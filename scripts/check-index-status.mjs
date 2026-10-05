// Reports whether Google has seen the submitted sitemaps and which sitemap URLs
// are indexed. Requires the same GSC OAuth credentials as fetch-search-data.mjs.
//
//   node scripts/check-index-status.mjs
//   node scripts/check-index-status.mjs --sitemaps-only
//   node scripts/check-index-status.mjs --filter=/jordan/

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const tokenEndpoint = "https://oauth2.googleapis.com/token";
const inspectionEndpoint = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const sitemapFiles = ["public/en/sitemap.xml", "public/zh/sitemap.xml"];
const inspectionIntervalMs = 120;
const oldCountrySlugs = new Set([
  "australia",
  "cambodia",
  "canada",
  "dominican",
  "india",
  "indonesia",
  "japan",
  "korea",
  "malaysia",
  "mexico",
  "new-zealand",
  "philippines",
  "singapore",
  "thailand",
  "turkey",
  "uk",
  "usa",
  "vietnam",
]);

loadDotEnv();

const siteUrl = process.env.GSC_SITE_URL || "sc-domain:entrycardguide.com";
const sitemapEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
const { sitemapsOnly, filter } = readArguments();
const oauth = {
  clientId: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
  clientSecret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
  refreshToken: requireEnv("GOOGLE_OAUTH_REFRESH_TOKEN"),
};
const sitemapEntries = sitemapsOnly ? [] : sitemapFiles.flatMap(readSitemapEntries);
const urls = [
  ...new Set(
    sitemapEntries
      .map(entry => entry.url)
      .filter(url => filter === null || url.includes(filter)),
  ),
];

if (!sitemapsOnly && urls.length === 0) {
  throw new Error(`No sitemap URLs matched --filter="${filter}".`);
}

const token = await accessToken(oauth);
const sitemaps = await getJson(sitemapEndpoint, token);
const outputDir = path.join("data-exports", `${localDate()}-index-status`);
mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "sitemaps.json"), `${JSON.stringify(sitemaps, null, 2)}\n`);

if (sitemapsOnly) {
  const summary = sitemapSummary(sitemaps);
  writeFileSync(path.join(outputDir, "summary.txt"), summary);
  console.log(summary);
  console.log(`Wrote sitemap status to ${outputDir}/`);
  process.exit(0);
}

const countrySlugs = new Set(
  readdirSync("data/official_urls")
    .filter(name => name.endsWith(".toml"))
    .map(name => path.basename(name, ".toml")),
);
const inspections = [];

for (const [index, url] of urls.entries()) {
  if (index > 0) await delay(inspectionIntervalMs);
  const response = await inspectUrl(token, url);
  if (!response.inspectionResult?.indexStatusResult) {
    throw new Error(`URL Inspection returned no indexStatusResult for ${url}.`);
  }
  const result = response.inspectionResult;
  const status = result.indexStatusResult;
  const country = countryForUrl(url, countrySlugs);

  inspections.push({
    url,
    country,
    pageGroup: pageGroup(country),
    inspectionResultLink: result.inspectionResultLink ?? null,
    verdict: status.verdict ?? null,
    coverageState: status.coverageState ?? null,
    robotsTxtState: status.robotsTxtState ?? null,
    indexingState: status.indexingState ?? null,
    lastCrawlTime: status.lastCrawlTime ?? null,
    pageFetchState: status.pageFetchState ?? null,
    googleCanonical: status.googleCanonical ?? null,
    userCanonical: status.userCanonical ?? null,
    crawledAs: status.crawledAs ?? null,
    sitemap: status.sitemap || [],
    referringUrls: status.referringUrls || [],
  });
}

writeFileSync(
  path.join(outputDir, "url-inspection.json"),
  `${JSON.stringify(inspections, null, 2)}\n`,
);
const summary = fullSummary(sitemaps, inspections, filter);
writeFileSync(path.join(outputDir, "summary.txt"), summary);
console.log(summary);
console.log(`Wrote index status for ${inspections.length} URLs to ${outputDir}/`);

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

function readArguments() {
  const allowed = process.argv.slice(2);
  const unknown = allowed.find(
    argument => argument !== "--sitemaps-only" && !argument.startsWith("--filter="),
  );
  if (unknown) {
    throw new Error(`Unknown argument "${unknown}". Use --sitemaps-only or --filter=<substring>.`);
  }
  const filters = allowed.filter(argument => argument.startsWith("--filter="));
  if (filters.length > 1) {
    throw new Error("--filter may only be supplied once.");
  }
  const filter = filters.length === 0 ? null : filters[0].slice("--filter=".length);
  if (filter === "") {
    throw new Error("--filter requires a non-empty substring.");
  }
  return { sitemapsOnly: allowed.includes("--sitemaps-only"), filter };
}

function readSitemapEntries(file) {
  if (!existsSync(file)) {
    throw new Error(`Sitemap ${file} does not exist. Run "npm run build:prod" first.`);
  }
  const xml = readFileSync(file, "utf8");
  const entries = [...xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(match => ({
    url: match[1],
    lastmod: new Date(match[2]),
  }));
  if (entries.length === 0) {
    throw new Error(`No <loc>/<lastmod> pairs found in ${file}. Run "npm run build:prod" first.`);
  }
  const undated = entries.find(entry => Number.isNaN(entry.lastmod.getTime()));
  if (undated) {
    throw new Error(`Unparseable <lastmod> for ${undated.url} in ${file}.`);
  }
  return entries;
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

async function getJson(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status} ${response.statusText} — ${text}`);
  }
  return JSON.parse(text);
}

async function accessToken(oauth) {
  const tokens = await postForm(tokenEndpoint, {
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: oauth.refreshToken,
    grant_type: "refresh_token",
  });
  return tokens.access_token;
}

async function inspectUrl(token, url) {
  const response = await fetch(inspectionEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: "en-US" }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `URL Inspection failed for ${url}: HTTP ${response.status} ${response.statusText} — ${text}`,
    );
  }
  return JSON.parse(text);
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function localDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function countryForUrl(url, countrySlugs) {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  const candidate = segments[0] === "zh" ? segments[1] : segments[0];
  return countrySlugs.has(candidate) ? candidate : null;
}

function pageGroup(country) {
  if (country === null) return "non-country";
  return oldCountrySlugs.has(country) ? "old-country" : "new-country";
}

function indexedCount(inspections) {
  return inspections.filter(item => item.verdict === "PASS").length;
}

function coverageCounts(inspections) {
  const counts = new Map();
  for (const item of inspections) {
    const coverage = item.coverageState || "(missing)";
    counts.set(coverage, (counts.get(coverage) || 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

function sitemapSummary(response) {
  const lines = ["GSC sitemap 提交状态", "====================", ""];
  const sitemaps = response.sitemap || [];
  if (sitemaps.length === 0) {
    lines.push("GSC 未返回已提交的 sitemap。", "");
  }
  for (const sitemap of sitemaps) {
    lines.push(`- ${sitemap.path}`);
    lines.push(`  lastSubmitted: ${sitemap.lastSubmitted || "(missing)"}`);
    lines.push(`  lastDownloaded: ${sitemap.lastDownloaded || "(missing)"}`);
    lines.push(`  isPending: ${sitemap.isPending ?? "(missing)"}`);
    lines.push(`  warnings: ${sitemap.warnings ?? "(missing)"}`);
    lines.push(`  errors: ${sitemap.errors ?? "(missing)"}`);
    const contents = sitemap.contents || [];
    if (contents.length === 0) lines.push("  contents: (none)");
    for (const content of contents) {
      lines.push(
        `  contents.${content.type}: submitted=${content.submitted ?? "(missing)"}, ` +
          `indexed=${content.indexed ?? "(missing; deprecated by Google)"}`,
      );
    }
    lines.push("");
  }
  lines.push("说明：Google 已将 contents[].indexed 标记为 deprecated；此处仅原样展示返回值。", "");
  return `${lines.join("\n")}\n`;
}

function fullSummary(sitemaps, inspections, filter) {
  const lines = [sitemapSummary(sitemaps).trimEnd(), "", "URL Inspection 摘要", "===================", ""];
  lines.push(`检查 URL 数: ${inspections.length}`);
  if (filter !== null) lines.push(`过滤条件: ${filter}`);
  lines.push(`已索引（verdict=PASS）: ${indexedCount(inspections)}`);
  lines.push(`未索引（verdict!=PASS）: ${inspections.length - indexedCount(inspections)}`, "");

  lines.push("按 coverageState 统计（降序）:");
  for (const [coverage, count] of coverageCounts(inspections)) {
    lines.push(`- ${coverage}: ${count}`);
  }
  lines.push("");

  lines.push("新旧页面统计:");
  for (const [group, label] of [
    ["old-country", "18 国老页"],
    ["new-country", "32 国新页"],
    ["non-country", "非国家页"],
  ]) {
    const pages = inspections.filter(item => item.pageGroup === group);
    lines.push(`- ${label}: 总数 ${pages.length}，已索引 ${indexedCount(pages)}，未索引 ${pages.length - indexedCount(pages)}`);
    for (const [coverage, count] of coverageCounts(pages)) {
      lines.push(`  - ${coverage}: ${count}`);
    }
  }
  lines.push("");

  lines.push("未被索引的 URL 完整清单（按国家分组）:");
  const unindexed = inspections.filter(item => item.verdict !== "PASS");
  if (unindexed.length === 0) {
    lines.push("无", "");
    return `${lines.join("\n")}\n`;
  }

  const countries = [...new Set(unindexed.map(item => item.country || "非国家页"))].sort();
  for (const country of countries) {
    lines.push(`\n[${country}]`);
    for (const item of unindexed.filter(entry => (entry.country || "非国家页") === country)) {
      lines.push(`- ${item.url}`);
      lines.push(
        `  coverageState=${item.coverageState || "(missing)"}; verdict=${item.verdict || "(missing)"}; ` +
          `indexingState=${item.indexingState || "(missing)"}; pageFetchState=${item.pageFetchState || "(missing)"}`,
      );
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}
