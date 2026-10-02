#!/usr/bin/env node
// Local release gate. --deployment additionally verifies remote prerequisites;
// it never creates databases, applies migrations, sets secrets or deploys.
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import TOML from '@iarna/toml';
import { validatePublicTravelLibrary } from './travel-library-public.mjs';

function requireCondition(ok, message) { if (!ok) throw new Error(message); }
try {
  const library = JSON.parse(readFileSync('data/travel_library_public.json', 'utf8'));
  const errors = validatePublicTravelLibrary(library);
  requireCondition(!errors.length, errors.join('\n'));
  requireCondition(library.jurisdictions.length === 249 && library.records.length === 249, 'Release must contain all 249 destination records');
  const snapshot = (await import('../functions/_mcp/snapshot.js')).default;
  requireCondition(JSON.stringify(snapshot.library) === JSON.stringify(library), 'MCP and public library differ; run npm run gen:mcp');
  for (const prefix of ['', 'zh/', 'zh-hant/']) {
    requireCondition(existsSync(`public-release/${prefix}library/index.html`), `Missing ${prefix}library index`);
    for (const destination of library.jurisdictions) {
      requireCondition(existsSync(`public-release/${prefix}library/${destination.id.toLowerCase()}/index.html`), `Missing ${prefix}library/${destination.id.toLowerCase()}`);
    }
  }
  const config = TOML.parse(readFileSync('wrangler.toml', 'utf8'));
  requireCondition(config.pages_build_output_dir === 'public-release', 'Deployment must use public-release');
  requireCondition(existsSync('migrations/0002_mcp_accounts.sql'), 'Missing account/grant migration');
  if (process.argv.includes('--deployment')) {
    const database = config.d1_databases?.find(item => item.binding === 'DB');
    requireCondition(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(database?.database_id || ''), 'Configure the real D1 database_id in wrangler.toml before deployment');
    function remote(args, parseJson = true) {
      const command = process.env.WRANGLER_BIN || 'wrangler';
      const run = spawnSync(command, args, { encoding: 'utf8', timeout: 45000, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
      requireCondition(run.status === 0, 'Unable to read MCP remote deployment prerequisites; verify Cloudflare access');
      if (!parseJson) return run.stdout.replace(/\u001b\[[0-9;]*m/g, "");
      try { return JSON.parse(run.stdout); } catch { throw new Error('Invalid remote prerequisite response'); }
    }
    const secretReport = remote(['pages', 'secret', 'list', '--project-name', 'entrycardguide', '--env', 'production'], false);
    requireCondition(secretReport.includes('"production" environment of your Pages project "entrycardguide"'), 'Unable to confirm the Pages production environment');
    const secrets = [...secretReport.matchAll(/^\s+- ([A-Za-z0-9_]+): Value Encrypted\s*$/gm)].map(match => ({name: match[1]}));
    for (const name of ['MCP_AUTH_SECRET', 'RESEND_API_KEY', 'MCP_EMAIL_FROM']) requireCondition(secrets.some(item => item.name === name), `Configure the production Pages secret ${name}`);
    const rows = remote(['d1', 'execute', database.database_name, '--remote', '--json', '--command', "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('mcp_users','mcp_sessions','mcp_grants','mcp_login_codes','mcp_auth_limits','mcp_usage');"]);
    const names = new Set(rows.flatMap(item => item.results || []).map(item => item.name));
    for (const name of ['mcp_users', 'mcp_sessions', 'mcp_grants', 'mcp_login_codes', 'mcp_auth_limits', 'mcp_usage']) requireCondition(names.has(name), `Apply the production migration for ${name}`);
    const migrations = remote(['d1', 'execute', database.database_name, '--remote', '--json', '--command', "SELECT name FROM d1_migrations WHERE name IN ('0001_mcp_init.sql','0002_mcp_accounts.sql');"]);
    requireCondition(new Set(migrations.flatMap(item => item.results || []).map(item => item.name)).size === 2, 'Apply both production MCP migrations');
    console.log('Deployment prerequisites read back: D1 tables and required Pages secret names present. Email delivery and live MCP still require post-deployment acceptance.');
  }
  console.log(`Release structure OK: ${library.jurisdictions.length} destinations × 3 languages; MCP public snapshot matches.`);
} catch (error) {
  console.error(`check-release: ${error.message}`);
  process.exitCode = 1;
}
