// Resubmits the two sitemaps via the Search Console API (sitemaps.submit: PUT
// sites/{siteUrl}/sitemaps/{feedpath}, empty body, writable "webmasters" scope)
// and prints the readback. Re-downloading a sitemap does not force indexing.
//   node scripts/resubmit-sitemaps.mjs [--dry-run]
import { existsSync, readFileSync } from "node:fs";

loadDotEnv();

const siteUrl = process.env.GSC_SITE_URL || "sc-domain:entrycardguide.com";
const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
const feedUrl = feedpath => `${api}/${encodeURIComponent(feedpath)}`;
const feeds = ["https://entrycardguide.com/en/sitemap.xml", "https://entrycardguide.com/zh/sitemap.xml"];
const badArgument = process.argv.slice(2).find(argument => argument !== "--dry-run");
if (badArgument) throw new Error(`Unknown argument "${badArgument}". Only --dry-run is supported.`);
if (process.argv.includes("--dry-run")) {
  for (const feedpath of feeds) console.log(`PUT ${feedUrl(feedpath)} (empty request body)`);
  console.log("--dry-run: nothing submitted, no token requested.");
  process.exit(0);
}

const { access_token: token } = await fetchJson("https://oauth2.googleapis.com/token", {
  method: "POST",
  form: {
    client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"), client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    refresh_token: requireEnv("GOOGLE_OAUTH_REFRESH_TOKEN"), grant_type: "refresh_token",
  },
});
for (const feedpath of feeds) {
  await fetchJson(feedUrl(feedpath), { method: "PUT", token });
  console.log(`Submitted ${feedpath}.`);
}
for (const sitemap of (await fetchJson(api, { token })).sitemap || []) {
  const status = `${sitemap.path}  lastSubmitted=${sitemap.lastSubmitted ?? "-"}  lastDownloaded=${sitemap.lastDownloaded ?? "-"}`;
  console.log(`${status}  errors=${sitemap.errors ?? 0}  warnings=${sitemap.warnings ?? 0}`);
}

function loadDotEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}
function requireEnv(name) {
  if (!process.env[name]) throw new Error(`${name} is not set. Put it in .env or the environment.`);
  return process.env[name];
}

async function fetchJson(url, { method = "GET", token, form } = {}) {
  const response = await fetch(url, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(form && { "Content-Type": "application/x-www-form-urlencoded" }) },
    ...(form ? { body: new URLSearchParams(form) } : {}),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${url} returned ${response.status} ${response.statusText} — ${text}`);
  return text === "" ? {} : JSON.parse(text);
}
