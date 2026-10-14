// Pulls query-level, site-traffic, and crawl data from the Bing Webmaster
// Tools JSON API. GSC anonymizes rare queries (only 2.5% of clicks visible in
// the 2026-08-31 pull), while Bing sends 3.1x Google's sessions and does not
// anonymize — see docs/maintenance/search-data-api.md.
//
//   node scripts/fetch-bing-search-data.mjs
//
// Reads from the environment (or .env, which is gitignored):
//
//   BING_WEBMASTER_API_KEY   Bing Webmaster Tools -> Settings -> API Access
//                            -> Generate API Key (one key per user, works for
//                            all verified sites)
//   BING_SITE_URL            defaults to https://entrycardguide.com — the
//                            http(s) form of the URL verified in BWT, NOT the
//                            sc-domain: form GSC uses
//
// VERIFIED AGAINST THE REAL API on 2026-09-05: the three method names, the
// {"d": [...]} envelope, every field name below, and the
// "/Date(epochMs±offset)/" date format all matched on a live call (3x HTTP
// 200). All 684 returned dates were re-derived independently and agreed.
//
// Two response semantics that are NOT obvious and that the docs do not spell
// out, both measured on that call — read these before trusting a number:
//
//   GetQueryStats is WEEKLY and TRUNCATED. Its Date values sit exactly 7 days
//   apart and each carries exactly 100 rows, so it is a per-week top-100, not
//   a daily series and not the full query set. Summing rows across dates is
//   fine (distinct weeks); reading one row as a single day is not.
//
//   GetRankAndTrafficStats is DAILY, and is the right denominator when you
//   want site totals.
//
//   AvgClickPosition came back as -1 on all 600 query rows. Treat it as
//   absent. AvgImpressionPosition is populated and usable.
//
// Three calls, one JSON file each in data-exports/<run-date>-bing/:
//
//   GetQueryStats           top queries: Clicks, Impressions, positions
//                           (weekly refresh, no date parameters)
//   GetRankAndTrafficStats  site-wide Clicks/Impressions per day, all
//                           verticals (Web, Chat, News, ...) since 2023-03-24
//   GetCrawlStats           daily crawl counts, index size, inbound links,
//                           last 6 months
//
// --pages adds the page-level view: GetPageStats lists the URLs Bing shows,
// then one GetPageQueryStats call per URL returns the queries that page was
// shown for (same weekly rows as GetQueryStats). GetQueryStats has no page
// column, so this is the only way to see which country page a query lands on
// (docs/plans/2026-10-14-country-longtail-keywords.md). ~130 calls.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const apiBaseUrl = "https://ssl.bing.com/webmaster/api.svc/json";
const methods = ["GetQueryStats", "GetRankAndTrafficStats", "GetCrawlStats"];

loadDotEnv();

const apiKey = requireApiKey();
const siteUrl = process.env.BING_SITE_URL || "https://entrycardguide.com";
const outputDir = path.join("data-exports", `${localDate()}-bing`);
mkdirSync(outputDir, { recursive: true });

console.log(`Bing Webmaster Tools ${siteUrl}`);
for (const method of methods) {
  const rows = await callMethod(method, apiKey);
  const file = `bing-${kebabCase(method)}.json`;
  writeFileSync(path.join(outputDir, file), `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`  ${file.padEnd(36)} ${String(rows.length).padStart(6)} rows`);
}
let written = methods.length;
if (process.argv.includes("--pages")) {
  const pages = await callMethod("GetPageStats", apiKey);
  writeFileSync(path.join(outputDir, "bing-get-page-stats.json"), `${JSON.stringify(pages, null, 2)}\n`);
  const byPage = {};
  for (const page of [...new Set(pages.map((row) => row.Query))]) {
    byPage[page] = await callMethod("GetPageQueryStats", apiKey, { page });
  }
  writeFileSync(path.join(outputDir, "bing-get-page-query-stats.json"), `${JSON.stringify(byPage, null, 2)}\n`);
  const rows = Object.values(byPage).reduce((sum, list) => sum + list.length, 0);
  console.log(`  ${"bing-get-page-stats.json".padEnd(36)} ${String(pages.length).padStart(6)} rows`);
  console.log(`  ${"bing-get-page-query-stats.json".padEnd(36)} ${String(rows).padStart(6)} rows (${Object.keys(byPage).length} pages)`);
  written += 2;
}
console.log(`\nWrote ${written} files to ${outputDir}/`);

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

function requireApiKey() {
  const value = process.env.BING_WEBMASTER_API_KEY;
  if (!value) {
    throw new Error(
      "BING_WEBMASTER_API_KEY is not set. Generate one at " +
        "https://www.bing.com/webmasters: sign in, open Settings (top right), " +
        "go to API Access, accept the terms once, click Generate API Key. " +
        "The key is per user and covers every verified site. Put it in .env.",
    );
  }
  return value;
}

async function callMethod(method, apiKey, params = {}) {
  const url = `${apiBaseUrl}/${method}?${new URLSearchParams({ siteUrl, apikey: apiKey, ...params })}`;
  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} returned ${response.status} ${response.statusText} — ${text}`);
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${method} returned a non-JSON body — ${text}`);
  }
  // Documented failure shape: HTTP 400 with {"ErrorCode":3,"Message":"InvalidApiKey"}.
  if (body !== null && typeof body === "object" && "ErrorCode" in body) {
    throw new Error(`${method} returned API error ${body.ErrorCode} (${body.Message}) — ${text}`);
  }
  if (!Array.isArray(body?.d)) {
    throw new Error(`${method} response has no "d" array — ${text}`);
  }
  return body.d.map(normalizeRow);
}

// Bing serializes dates as ASP.NET JSON: "/Date(1316156400000-0700)/" — epoch
// milliseconds plus the UTC offset of the reported day. Shift by that offset
// and keep just the date, so a row stays on the day Bing attributed it to.
// Anything that does not match the pattern is kept verbatim, which makes a
// format drift visible in the output instead of silently dropping the day.
function normalizeRow(row) {
  if (!("Date" in row) || typeof row.Date !== "string") return row;
  const match = /^\/Date\((\d+)([+-]\d{4})?\)\/$/.exec(row.Date);
  if (!match) return row;
  const offsetMs = match[2] ? offsetMinutes(match[2]) * 60_000 : 0;
  return { ...row, Date: new Date(Number(match[1]) + offsetMs).toISOString().slice(0, 10) };
}

function offsetMinutes(offset) {
  const sign = offset.startsWith("-") ? -1 : 1;
  return sign * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(3, 5)));
}

function kebabCase(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function localDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
