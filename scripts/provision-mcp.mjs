#!/usr/bin/env node
// Explicit production provisioning, run only by the authorized CI workflow.
// Tokens stay in CI secrets; the output artifact contains resource metadata only.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const projectName = 'entrycardguide';
const databaseName = 'entrycardguide-mcp';
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const d1Token = process.env.CLOUDFLARE_MCP_API_TOKEN || token;
function requireCondition(ok, message) { if (!ok) throw new Error(message); }
async function cloudflare(route, method = 'GET', body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/${route}`, {
    method,
    headers: { Authorization: `Bearer ${route.startsWith('d1/') ? d1Token : token}`, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  if (!response.ok || data.success !== true) {
    const codes = (data.errors || []).map(error => error.code).join(',');
    throw new Error(`Cloudflare ${method} ${route.split('?')[0]} failed: HTTP ${response.status}; codes ${codes || 'unavailable'}`);
  }
  return data.result;
}
function wrangler(args, input, parse = false) {
  const result = spawnSync('wrangler', args, {
    input, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, CLOUDFLARE_API_TOKEN: args[0] === 'd1' ? d1Token : token, WRANGLER_SEND_METRICS: 'false' },
  });
  requireCondition(result.status === 0, `Wrangler ${args.slice(0, 3).join(' ')} failed; verify the production token has Pages Edit and D1 Edit permissions`);
  if (parse) {
    try { return JSON.parse(result.stdout); }
    catch { throw new Error('Invalid D1 metadata response'); }
  }
}

try {
  requireCondition(token && /^[0-9a-f]{32}$/i.test(account || ''), 'Missing Cloudflare CI credentials');
  const project = await cloudflare(`pages/projects/${projectName}`);
  requireCondition(project.name === projectName && project.production_branch === 'main', 'Pages project must use main as its production branch');
  const databases = await cloudflare(`d1/database?name=${databaseName}&per_page=1000`);
  requireCondition(Array.isArray(databases), 'Invalid D1 database inventory');
  const matches = databases.filter(database => database.name === databaseName);
  requireCondition(matches.length <= 1, 'More than one entrycardguide-mcp database exists; select the intended resource before provisioning');
  const database = matches[0] || await cloudflare('d1/database', 'POST', { name: databaseName });
  requireCondition(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(database.uuid || ''), 'Invalid D1 database identifier');
  const config = readFileSync('wrangler.toml', 'utf8');
  requireCondition(config.includes('database_name = "entrycardguide-mcp"'), 'Unexpected D1 target');
  writeFileSync('wrangler.toml', config.replace(/^database_id = "[^"]+"$/m, `database_id = "${database.uuid}"`));
  // Use migrations, not execute --file: migration 0002 contains an ALTER and
  // must be recorded in d1_migrations before it is ever retried.
  wrangler(['d1', 'migrations', 'apply', databaseName, '--remote']);
  const migrations = wrangler(['d1', 'execute', databaseName, '--remote', '--json', '--command',
    "SELECT name FROM d1_migrations WHERE name IN ('0001_mcp_init.sql','0002_mcp_accounts.sql');"], undefined, true);
  const names = new Set(migrations.flatMap(item => item.results || []).map(item => item.name));
  requireCondition(names.has('0001_mcp_init.sql') && names.has('0002_mcp_accounts.sql'), 'Both MCP migrations must be applied');
  const variables = project.deployment_configs?.production?.env_vars || {};
  if (variables.MCP_AUTH_SECRET?.type !== 'secret_text') {
    wrangler(['pages', 'secret', 'put', 'MCP_AUTH_SECRET', '--project-name', projectName, '--env', 'production'], randomBytes(32).toString('base64url'));
  }
  // Only project-owned CI email credentials are accepted. No other project's
  // key is fetched or reused by this script.
  const mailKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MCP_EMAIL_FROM;
  requireCondition(Boolean(mailKey) === Boolean(mailFrom), 'Configure both entrycardguide RESEND_API_KEY and MCP_EMAIL_FROM CI secrets');
  if (mailKey && mailFrom) {
    requireCondition(!/[\r\n]/.test(mailFrom) && mailFrom.length <= 254 && mailFrom.includes('@'), 'Invalid MCP sender address');
    wrangler(['pages', 'secret', 'put', 'RESEND_API_KEY', '--project-name', projectName, '--env', 'production'], mailKey);
    wrangler(['pages', 'secret', 'put', 'MCP_EMAIL_FROM', '--project-name', projectName, '--env', 'production'], mailFrom);
  }
  const readback = await cloudflare(`pages/projects/${projectName}`);
  const requiredNames = ['MCP_AUTH_SECRET', 'RESEND_API_KEY', 'MCP_EMAIL_FROM'];
  const secretNames = requiredNames.filter(name => readback.deployment_configs?.production?.env_vars?.[name]?.type === 'secret_text');
  const output = {
    project: projectName, production_branch: readback.production_branch,
    database_name: databaseName, database_id: database.uuid,
    migrations: [...names].sort(), production_secret_names: secretNames,
    email_configured: requiredNames.every(name => secretNames.includes(name)),
    previous_production_deployment: {
      id: project.canonical_deployment?.id ?? null,
      url: project.canonical_deployment?.url ?? null,
      commit_hash: project.canonical_deployment?.deployment_trigger?.metadata?.commit_hash ?? null,
    },
  };
  writeFileSync('mcp-provision.json', JSON.stringify(output, null, 2) + '\n');
  console.log(`MCP production D1 ready; two migrations confirmed; ${secretNames.length}/3 required secret names present. No secret values exported.`);
  if (!output.email_configured) console.log('Email credentials remain required before production deployment.');
} catch (error) {
  console.error(`provision-mcp: ${error.message}`);
  process.exitCode = 1;
}
