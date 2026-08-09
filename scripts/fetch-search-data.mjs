// Pulls the full GSC + GA4 datasets that the monthly review needs, so a review
// never depends on clicking through two web UIs again.
//
//   node scripts/fetch-search-data.mjs --auth    # one-time: grant access, print refresh token
//   node scripts/fetch-search-data.mjs           # last 28 days -> data-exports/<date>/
//   node scripts/fetch-search-data.mjs --days=90
//
// Reads credentials from the environment (or a .env file, which is gitignored):
//
//   GOOGLE_OAUTH_CLIENT_ID       from Google Cloud Console, "Desktop app" OAuth client
//   GOOGLE_OAUTH_CLIENT_SECRET   same place
//   GOOGLE_OAUTH_REFRESH_TOKEN   printed by --auth
//   GSC_SITE_URL                 defaults to sc-domain:entrycardguide.com
//   GA4_PROPERTY_ID              defaults to 536218791
//
// Both APIs must be enabled on the Cloud project: "Google Search Console API"
// and "Google Analytics Data API".

import { createServer } from "node:http";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const scopes = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];
const tokenEndpoint = "https://oauth2.googleapis.com/token";
const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const callbackPort = 8731;
const callbackUrl = `http://localhost:${callbackPort}`;
const gscRowLimit = 25000;
const ga4RowLimit = 100000;

loadDotEnv();

const wantsAuth = process.argv.includes("--auth");
const days = readDays();
const siteUrl = process.env.GSC_SITE_URL || "sc-domain:entrycardguide.com";
const propertyId = process.env.GA4_PROPERTY_ID || "536218791";

function loadDotEnv() {
  const file = ".env";
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Put it in .env or the environment. ` +
        `Run "node scripts/fetch-search-data.mjs --auth" to obtain GOOGLE_OAUTH_REFRESH_TOKEN.`,
    );
  }
  return value;
}

function readDays() {
  const flag = process.argv.find(arg => arg.startsWith("--days="));
  if (!flag) return 28;
  const value = Number(flag.slice("--days=".length));
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--days must be a positive integer, got "${flag.slice("--days=".length)}".`);
  }
  return value;
}

function isoDate(offsetDays) {
  const date = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

async function postJson(url, body, accessToken) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status} ${response.statusText} — ${text}`);
  }
  return JSON.parse(text);
}

async function postForm(url, params) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status} ${response.statusText} — ${text}`);
  }
  return JSON.parse(text);
}

// --- one-time authorization -------------------------------------------------

function waitForCallbackCode() {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const code = new URL(request.url, callbackUrl).searchParams.get("code");
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(code ? "Authorized. You can close this tab." : "No ?code= in the callback.");
      server.close();
      code ? resolve(code) : reject(new Error(`Callback carried no code: ${request.url}`));
    });
    server.on("error", reject);
    server.listen(callbackPort);
  });
}

async function authorize() {
  const clientId = requireEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_OAUTH_CLIENT_SECRET");

  const url = `${authEndpoint}?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  })}`;

  console.log("Open this URL, sign in as the account that owns the GSC property, and grant both scopes:\n");
  console.log(`  ${url}\n`);
  console.log(`Waiting for the redirect on ${callbackUrl} ...`);

  const code = await waitForCallbackCode();
  const tokens = await postForm(tokenEndpoint, {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: callbackUrl,
    grant_type: "authorization_code",
  });

  if (!tokens.refresh_token) {
    throw new Error(
      `Google returned no refresh_token. This happens when the app was already authorized; ` +
        `revoke it at https://myaccount.google.com/permissions and run --auth again.`,
    );
  }

  console.log("\nAdd this line to .env:\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
}

// --- data pulls -------------------------------------------------------------

async function accessToken() {
  const tokens = await postForm(tokenEndpoint, {
    client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
    client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    refresh_token: requireEnv("GOOGLE_OAUTH_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });
  return tokens.access_token;
}

async function gscQuery(token, dimensions, startDate, endDate) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const rows = [];
  for (let startRow = 0; ; startRow += gscRowLimit) {
    const page = await postJson(endpoint, { startDate, endDate, dimensions, rowLimit: gscRowLimit, startRow }, token);
    if (!page.rows?.length) break;
    rows.push(
      ...page.rows.map(row => ({
        ...Object.fromEntries(dimensions.map((name, index) => [name, row.keys[index]])),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
    );
    if (page.rows.length < gscRowLimit) break;
  }
  return rows;
}

async function ga4Report(token, dimensions, metrics, startDate, endDate) {
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const report = await postJson(
    endpoint,
    {
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensions.map(name => ({ name })),
      metrics: metrics.map(name => ({ name })),
      limit: ga4RowLimit,
    },
    token,
  );
  return (report.rows || []).map(row => ({
    ...Object.fromEntries(dimensions.map((name, index) => [name, row.dimensionValues[index].value])),
    ...Object.fromEntries(metrics.map((name, index) => [name, Number(row.metricValues[index].value)])),
  }));
}

async function pull() {
  const token = await accessToken();
  const endDate = isoDate(2); // GSC lags ~2 days; keep both sources on one window
  const startDate = isoDate(2 + days);
  const outDir = path.join("data-exports", `${endDate}-${days}d`);
  mkdirSync(outDir, { recursive: true });

  console.log(`Window ${startDate} .. ${endDate} (${days} days)`);
  console.log(`GSC  ${siteUrl}`);
  console.log(`GA4  properties/${propertyId}\n`);

  const ga4Metrics = ["sessions", "activeUsers", "engagedSessions", "userEngagementDuration", "eventCount"];
  const jobs = [
    ["gsc-query", () => gscQuery(token, ["query"], startDate, endDate)],
    ["gsc-page", () => gscQuery(token, ["page"], startDate, endDate)],
    ["gsc-country", () => gscQuery(token, ["country"], startDate, endDate)],
    ["gsc-device", () => gscQuery(token, ["device"], startDate, endDate)],
    ["gsc-date", () => gscQuery(token, ["date"], startDate, endDate)],
    ["gsc-page-query", () => gscQuery(token, ["page", "query"], startDate, endDate)],
    ["ga4-source-medium", () => ga4Report(token, ["sessionSourceMedium"], ga4Metrics, startDate, endDate)],
    ["ga4-channel", () => ga4Report(token, ["sessionDefaultChannelGroup"], ga4Metrics, startDate, endDate)],
    ["ga4-landing-page", () => ga4Report(token, ["landingPage"], ga4Metrics, startDate, endDate)],
    ["ga4-event", () => ga4Report(token, ["eventName"], ["eventCount"], startDate, endDate)],
    ["ga4-country", () => ga4Report(token, ["country"], ga4Metrics, startDate, endDate)],
    ["ga4-landing-page-by-source", () => ga4Report(token, ["landingPage", "sessionSourceMedium"], ga4Metrics, startDate, endDate)],
    // Headless crawlers show up as one source + one city + one screen resolution with
    // ~0s engagement. Confirmed 2026-08-08: (direct) x Singapore x 1280x1200, 30% of sessions.
    ["ga4-bot-signature", () => ga4Report(token, ["sessionSourceMedium", "city", "screenResolution"], ga4Metrics, startDate, endDate)],
  ];

  for (const [name, run] of jobs) {
    const rows = await run();
    writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(rows, null, 2));
    console.log(`  ${name.padEnd(28)} ${String(rows.length).padStart(6)} rows`);
  }

  console.log(`\nWrote ${jobs.length} files to ${outDir}/`);
}

if (wantsAuth) {
  await authorize();
} else {
  await pull();
}
