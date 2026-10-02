#!/usr/bin/env node
// Post-deploy readback. It never exports credentials or sends verification mail.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const expected = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const origin = 'https://entrycardguide.com';
function requireCondition(ok, message) { if (!ok) throw new Error(message); }
async function get(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
}
try {
  requireCondition(account && token, 'Missing Cloudflare deployment credentials');
  const response = await get(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/entrycardguide`, { headers: { Authorization: `Bearer ${token}` } });
  const envelope = await response.json();
  requireCondition(response.ok && envelope.success, 'Unable to read the Pages deployment');
  const project = envelope.result;
  const deployment = project.canonical_deployment;
  requireCondition(project.production_branch === 'main' && deployment?.environment === 'production', 'Deployment must be the main production release');
  requireCondition(deployment.deployment_trigger?.metadata?.commit_hash === expected, 'Pages production revision does not match the pushed commit');
  requireCondition(deployment.latest_stage?.status === 'success', 'Pages production deployment is not successful');
  const library = JSON.parse(readFileSync('data/travel_library_public.json', 'utf8'));
  const seen = [];
  for (const [prefix, lang] of [['', 'en'], ['/zh', 'zh-Hans'], ['/zh-hant', 'zh-Hant']]) {
    const directory = await get(`${origin}${prefix}/library/`);
    const html = await directory.text();
    requireCondition(directory.status === 200 && (html.includes(`lang=${lang}`) || html.includes(`lang="${lang}"`)), `Invalid ${lang} library response`);
    requireCondition((html.match(/data-library-row(?:[\s=>])/g) || []).length === 249, `Missing ${lang} destination rows`);
    const sitemap = await get(`${origin}${prefix || '/en'}/sitemap.xml`);
    const xml = await sitemap.text();
    requireCondition(sitemap.status === 200, `Missing ${lang} sitemap`);
    for (const destination of library.jurisdictions) requireCondition(xml.includes(`${origin}${prefix}/library/${destination.id.toLowerCase()}/`), `Missing ${lang} sitemap destination ${destination.id}`);
    seen.push({ lang, destinationRows: 249, sitemapUrls: (xml.match(/<loc>/g) || []).length });
  }
  const negative = await get(`${origin}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-06-18', Authorization: 'Bearer ecg_INVALID_NON_SECRET_PROBE_20261002' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
  });
  requireCondition(negative.status === 401 && (await negative.json()).error === 'unauthorized', 'Invalid MCP credentials must return 401 with the database binding configured');
  const authorize = await get(`${origin}/api/mcp/authorize`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ csrf: 'not-a-session', scope: 'mcp:read', consent: true }),
  });
  requireCondition(authorize.status === 401, 'Anonymous clients must not receive MCP authorization');
  const result = { commit: expected, deployment_id: deployment.id, deployment_url: deployment.url, environment: deployment.environment, public_libraries: seen, mcp_invalid_key: 401, anonymous_authorization: 401, live_email_verified: false };
  writeFileSync('release-live.json', JSON.stringify(result, null, 2) + '\n');
  console.log(`Production Pages revision ${expected} confirmed; 249 destinations in all three live indexes and sitemaps; MCP rejects invalid keys and anonymous authorization. Email sign-in still requires separate acceptance.`);
} catch (error) {
  console.error(`check-live-release: ${error.message}`);
  process.exitCode = 1;
}
