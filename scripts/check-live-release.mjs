#!/usr/bin/env node
// Post-deploy readback. It never exports credentials or sends verification mail.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const expected = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const origin = 'https://entrycardguide.com';
// --static: the release shipped without the D1 binding (scripts/release-mode.mjs),
// so MCP routes must answer 503 mcp_not_configured instead of 401.
const staticRelease = process.argv.includes('--static');
function requireCondition(ok, message) { if (!ok) throw new Error(message); }
async function get(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
}
function htmlLanguage(html) {
  const openingTag = html.match(/<html\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/i)?.[0] || '';
  const attributes = [...openingTag.matchAll(/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)];
  const lang = attributes.find(attribute => attribute[1].toLowerCase() === 'lang');
  return lang?.[2] ?? lang?.[3] ?? lang?.[4] ?? null;
}
// Pages can take a minute to reach every edge after the deploy step returns,
// so a stale page or sitemap is retried before the release is called failed.
async function readBack() {
  requireCondition(account && token, 'Missing Cloudflare deployment credentials');
  const response = await get(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/entrycardguide`, { headers: { Authorization: `Bearer ${token}` } });
  const envelope = await response.json();
  requireCondition(response.ok && envelope.success, 'Unable to read the Pages deployment');
  const project = envelope.result;
  const deployment = project.canonical_deployment;
  requireCondition(project.production_branch === 'main' && deployment?.environment === 'production', 'Deployment must be the main production release');
  requireCondition(deployment.deployment_trigger?.metadata?.commit_hash === expected, 'Pages production revision does not match the pushed commit');
  requireCondition(deployment.latest_stage?.name === 'deploy' && deployment.latest_stage.status === 'success', 'Pages production deployment is not successful');
  const library = JSON.parse(readFileSync('data/travel_library_public.json', 'utf8'));
  // Destinations with nothing published are noindex and left out of the sitemap.
  const published = new Set(library.records.filter(r => r.procedures.length).map(r => r.jurisdiction_id));
  const seen = [];
  for (const [prefix, lang] of [['', 'en'], ['/zh', 'zh-Hans'], ['/zh-hant', 'zh-Hant']]) {
    const directory = await get(`${origin}${prefix}/library/`);
    const html = await directory.text();
    requireCondition(directory.status === 200 && htmlLanguage(html) === lang, `Invalid ${lang} library response`);
    requireCondition((html.match(/data-library-row(?:[\s=>])/g) || []).length === 249, `Missing ${lang} destination rows`);
    const sitemap = await get(`${origin}${prefix || '/en'}/sitemap.xml`);
    const xml = await sitemap.text();
    requireCondition(sitemap.status === 200, `Missing ${lang} sitemap`);
    for (const destination of library.jurisdictions) {
      const listed = xml.includes(`${origin}${prefix}/library/${destination.id.toLowerCase()}/`);
      requireCondition(listed === published.has(destination.id), `${lang} sitemap ${listed ? 'lists noindex' : 'is missing'} destination ${destination.id}`);
    }
    seen.push({ lang, destinationRows: 249, sitemapDestinations: published.size, sitemapUrls: (xml.match(/<loc>/g) || []).length });
  }
  const negative = await get(`${origin}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-06-18', Authorization: 'Bearer ecg_INVALID_NON_SECRET_PROBE_20261002' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
  });
  const negativeBody = await negative.json();
  if (staticRelease) requireCondition(negative.status === 503 && negativeBody.error === 'mcp_not_configured', 'A static release must answer MCP with 503 mcp_not_configured');
  else requireCondition(negative.status === 401 && negativeBody.error === 'unauthorized', 'Invalid MCP credentials must return 401 with the database binding configured');
  const authorize = await get(`${origin}/api/mcp/authorize`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ csrf: 'not-a-session', scope: 'mcp:read', consent: true }),
  });
  requireCondition(authorize.status === (staticRelease ? 503 : 401), 'Anonymous clients must not receive MCP authorization');
  const result = { commit: expected, release_mode: staticRelease ? 'static' : 'full', deployment_id: deployment.id, deployment_url: deployment.url, environment: deployment.environment, public_libraries: seen, mcp_invalid_key: negative.status, anonymous_authorization: authorize.status, live_email_verified: false };
  writeFileSync('release-live.json', JSON.stringify(result, null, 2) + '\n');
  console.log(staticRelease
    ? `Production Pages revision ${expected} confirmed (static release); 249 destinations in all three live indexes, ${published.size} in each sitemap; MCP answers 503 mcp_not_configured until D1 is set up.`
    : `Production Pages revision ${expected} confirmed; 249 destinations in all three live indexes, ${published.size} in each sitemap; MCP rejects invalid keys and anonymous authorization. Email sign-in still requires separate acceptance.`);
}
const ATTEMPTS = 7;
for (let attempt = 1; ; attempt++) {
  try {
    await readBack();
    break;
  } catch (error) {
    if (attempt < ATTEMPTS) {
      console.log(`check-live-release: attempt ${attempt}/${ATTEMPTS} failed (${error.message}); retrying in 20s`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      continue;
    }
    console.error(`check-live-release: ${error.message}`);
    process.exitCode = 1;
    break;
  }
}
