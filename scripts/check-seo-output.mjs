import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";

// PUBLIC_DIR env override — isolated negative regressions run the gate
// against a temp copy of the built output.
const publicDir = process.env.PUBLIC_DIR || "public";

const requiredFiles = [
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "en/sitemap.xml",
  "zh/sitemap.xml",
  "zh-hant/sitemap.xml",
].map((f) => path.join(publicDir, f));

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing required SEO output: ${file}`);
  }
}

const robots = readFileSync(path.join(publicDir, "robots.txt"), "utf8");
for (const sitemap of [
  "https://entrycardguide.com/sitemap.xml",
  "https://entrycardguide.com/en/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
  "https://entrycardguide.com/zh-hant/sitemap.xml",
]) {
  if (!robots.includes(`Sitemap: ${sitemap}`)) {
    throw new Error(`robots.txt does not advertise ${sitemap}`);
  }
}

const rootSitemap = readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
for (const sitemap of [
  "https://entrycardguide.com/en/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
  "https://entrycardguide.com/zh-hant/sitemap.xml",
]) {
  if (!rootSitemap.includes(`<loc>${sitemap}</loc>`)) {
    throw new Error(`root sitemap does not include ${sitemap}`);
  }
}

for (const file of ["en/sitemap.xml", "zh/sitemap.xml", "zh-hant/sitemap.xml"].map((f) => path.join(publicDir, f))) {
  const sitemap = readFileSync(file, "utf8");
  if (!sitemap.includes("<urlset")) {
    throw new Error(`${file} is not a URL sitemap`);
  }
}

const htmlFiles = [];
const referencedCssFiles = new Set();
const jsFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      jsFiles.push(fullPath);
    }
  }
}
walk(publicDir);

const missingLocalTargets = [];
const hreflangProblems = [];
const localAssetPattern = /\s(?:href|src)=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g;
const cssUrlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"]+))\s*\)/g;
const hreflangPattern =
  /<link\s+rel=alternate\s+hreflang=(?:"([^"]+)"|'([^']+)'|([^\s>]+))\s+href=(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>/g;

function shouldSkipUrl(rawUrl) {
  return (
    !rawUrl ||
    rawUrl.startsWith("http:") ||
    rawUrl.startsWith("https:") ||
    rawUrl.startsWith("mailto:") ||
    rawUrl.startsWith("tel:") ||
    rawUrl.startsWith("#") ||
    rawUrl.startsWith("data:") ||
    rawUrl.startsWith("//")
  );
}

function localTargetExists(rawUrl, sourceFile = null) {
  if (shouldSkipUrl(rawUrl)) {
    return true;
  }

  const target = localTargetPath(rawUrl, sourceFile);
  return existsSync(target) && statSync(target).isFile();
}

function localTargetPath(rawUrl, sourceFile = null) {
  const cleanUrl = rawUrl.split("#")[0].split("?")[0];
  if (!cleanUrl || cleanUrl === "/") return path.join(publicDir, "index.html");

  return cleanUrl.startsWith("/")
    ? cleanUrl.endsWith("/")
      ? path.join(publicDir, cleanUrl, "index.html")
      : path.extname(cleanUrl)
        ? path.join(publicDir, cleanUrl)
        : path.join(publicDir, cleanUrl, "index.html")
    : sourceFile
      ? path.join(path.dirname(sourceFile), cleanUrl)
      : path.extname(cleanUrl)
        ? path.join(publicDir, cleanUrl)
        : path.join(publicDir, cleanUrl, "index.html");
}

function localTargetLabel(rawUrl, sourceFile = null) {
  if (
    shouldSkipUrl(rawUrl) ||
    rawUrl.split("#")[0].split("?")[0] === "/" ||
    !rawUrl.split("#")[0].split("?")[0]
  ) {
    return rawUrl;
  }

  return path.relative(publicDir, localTargetPath(rawUrl, sourceFile));
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(localAssetPattern)) {
    const rawUrl = match[1] || match[2] || match[3];
    if (!localTargetExists(rawUrl)) {
      missingLocalTargets.push(`${path.relative(publicDir, file)} -> ${rawUrl}`);
    } else if (!shouldSkipUrl(rawUrl) && path.extname(rawUrl.split("#")[0].split("?")[0]) === ".css") {
      referencedCssFiles.add(localTargetPath(rawUrl));
    }
  }

  for (const match of html.matchAll(hreflangPattern)) {
    const hreflang = match[1] || match[2] || match[3];
    const href = match[4] || match[5] || match[6];
    if (!href?.startsWith("https://entrycardguide.com/")) continue;

    const localPath = new URL(href).pathname;
    if (!localTargetExists(localPath)) {
      hreflangProblems.push(`${path.relative(publicDir, file)} -> ${hreflang} ${href}`);
    }

    if (hreflang === "x-default" && (localPath.startsWith("/zh/") || localPath.startsWith("/zh-hant/"))) {
      hreflangProblems.push(`${path.relative(publicDir, file)} has zh x-default: ${href}`);
    }
  }
}

if (missingLocalTargets.length) {
  throw new Error(
    `Missing local links/assets:\n${missingLocalTargets.slice(0, 30).join("\n")}`,
  );
}

const missingCssTargets = [];
for (const file of referencedCssFiles) {
  const css = readFileSync(file, "utf8");
  for (const match of css.matchAll(cssUrlPattern)) {
    const rawUrl = (match[1] || match[2] || match[3] || "").trim();
    if (!localTargetExists(rawUrl, file)) {
      missingCssTargets.push(
        `${path.relative(publicDir, file)} -> ${rawUrl} (${localTargetLabel(rawUrl, file)})`,
      );
    }
  }
}

if (missingCssTargets.length) {
  throw new Error(
    `Missing CSS url() assets:\n${missingCssTargets.slice(0, 30).join("\n")}`,
  );
}

if (hreflangProblems.length) {
  throw new Error(`Invalid hreflang links:\n${hreflangProblems.slice(0, 30).join("\n")}`);
}

const affiliateAnalyticsProblems = [];
const affiliateLinkPattern =
  /<a\b(?=[^>]*\bhref=(?:"[^"]*(?:safetywing\.com|airalo)[^"]*"|'[^']*(?:safetywing\.com|airalo)[^']*'))[^>]*>/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(affiliateLinkPattern)) {
    const link = match[0];
    if (!/\bdata-analytics-event=(?:"affiliate_click"|'affiliate_click'|affiliate_click)(?:\s|>|$)/.test(link)) {
      affiliateAnalyticsProblems.push(
        `${path.relative(publicDir, file)} affiliate link missing data-analytics-event`,
      );
    }
    if (!/\bdata-affiliate-partner=/.test(link)) {
      affiliateAnalyticsProblems.push(
        `${path.relative(publicDir, file)} affiliate link missing data-affiliate-partner`,
      );
    }
  }
}

const homeHtml = readFileSync(path.join(publicDir, "index.html"), "utf8");
const affiliateAnalyticsScript = jsFiles.find(file => {
  const publicPath = `/${path.relative(publicDir, file).replaceAll("\\", "/")}`;
  const js = readFileSync(file, "utf8");
  return homeHtml.includes(publicPath) && js.includes("affiliate_click") && js.includes("gtag");
});

if (!affiliateAnalyticsScript) {
  affiliateAnalyticsProblems.push("No built JS bundle tracks affiliate_click with gtag");
} else {
  const browser = {
    location: { hostname: "entrycardguide.com" },
    document: {
      currentScript: { dataset: { ga4MeasurementId: "G-TEST", ga4Hostname: "entrycardguide.com" } },
      addEventListener() {},
    },
  };
  browser.window = browser;

  runInNewContext(readFileSync(affiliateAnalyticsScript, "utf8"), browser);

  const queuedCommandType = Object.prototype.toString.call(browser.dataLayer?.[0]);
  if (queuedCommandType !== "[object Arguments]") {
    affiliateAnalyticsProblems.push(
      `Built analytics queues ${queuedCommandType}; expected [object Arguments]`,
    );
  }
}

const ga4MeasurementId = process.env.HUGO_PARAMS_ANALYTICS_GA4_MEASUREMENT_ID?.trim();
if (ga4MeasurementId) {
  if (!homeHtml.includes(`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`)) {
    affiliateAnalyticsProblems.push("Configured GA4 measurement ID is missing from public/index.html");
  }
  if (!homeHtml.includes(`data-ga4-measurement-id="${ga4MeasurementId}"`)) {
    const dataAttrPattern = new RegExp(
      `data-ga4-measurement-id=(?:"${ga4MeasurementId}"|'${ga4MeasurementId}'|${ga4MeasurementId})(?:\\s|>)`,
    );
    if (!dataAttrPattern.test(homeHtml)) {
      affiliateAnalyticsProblems.push("Configured GA4 measurement ID is missing from analytics script data attribute");
    }
  }
}

if (affiliateAnalyticsProblems.length) {
  throw new Error(
    `Invalid affiliate analytics wiring:\n${affiliateAnalyticsProblems.slice(0, 30).join("\n")}`,
  );
}

const jsonLdPattern =
  /<script\s+type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(jsonLdPattern)) {
    let schema;
    try {
      schema = JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${path.relative(publicDir, file)} has invalid JSON-LD: ${error.message}`);
    }

    const valuesToCheck = [
      schema.name,
      schema.headline,
      schema.description,
      schema.datePublished,
      schema.dateModified,
      schema.inLanguage,
      schema.image,
      schema.mainEntityOfPage,
      schema.author?.name,
      schema.publisher?.name,
    ];

    if (schema["@type"] === "BreadcrumbList") {
      for (const item of schema.itemListElement || []) {
        valuesToCheck.push(item.name, item.item);
      }
    }

    if (schema["@type"] === "FAQPage") {
      for (const item of schema.mainEntity || []) {
        valuesToCheck.push(item.name, item.acceptedAnswer?.text);
      }
    }

    for (const value of valuesToCheck) {
      if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
        throw new Error(
          `${path.relative(publicDir, file)} has double-encoded JSON-LD value: ${value}`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Three-language gate (review-13 #2 / review-15). Real Hugo output is the
// authority: language sitemaps define the neutral content-key set, and every
// neutral key must carry an exact, matching translation graph in BOTH the
// sitemap alternates and the page HTML.

const ORIGIN = "https://entrycardguide.com";
const LANG_SPECS = [
  { code: "en", hreflang: "en", dir: "en", prefix: "" },
  { code: "zh-Hans", hreflang: "zh-Hans", dir: "zh", prefix: "/zh" },
  { code: "zh-Hant", hreflang: "zh-Hant", dir: "zh-hant", prefix: "/zh-hant" },
];
const fullURL = (p) => ORIGIN + p;
const HREFLANGS = LANG_SPECS.map((l) => l.hreflang);
const pathFor = (prefix, key) => (prefix === "" ? key : prefix + key);

// Parse one language sitemap into neutralKey -> { loc, alts: {hreflang: path} }.
// Neutral key = pathname with the language's own prefix stripped; a loc under
// a foreign language prefix is rejected outright.
function readSitemap(spec, problems) {
  const file = path.join(publicDir, spec.dir, "sitemap.xml");
  const xml = readFileSync(file, "utf8");
  const map = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const entry = m[1];
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const url = new URL(loc);
    if (url.origin !== ORIGIN) {
      // a same-path wrong-domain loc must fail, not silently pass by pathname
      problems.push(`${spec.code} sitemap: loc ${loc} is not an ${ORIGIN} URL`);
      continue;
    }
    if (!url.pathname.startsWith(spec.prefix + (spec.prefix === "" ? "/" : "/")) &&
        url.pathname !== (spec.prefix || "/") &&
        !(spec.prefix === "" && url.pathname === "/")) {
      problems.push(`${spec.code} sitemap: loc ${url.pathname} is not under ${spec.prefix || "/"}`);
      continue;
    }
    const key =
      url.pathname === "/" || url.pathname === spec.prefix
        ? "/"
        : url.pathname.slice(spec.prefix === "" ? 0 : spec.prefix.length);
    const alts = {};
    for (const a of entry.matchAll(/<xhtml:link[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"[^>]*\/?>(?:<\/xhtml:link>)?/g)) {
      alts[a[1]] = new URL(a[2], ORIGIN).href;
    }
    for (const a of entry.matchAll(/<xhtml:link[^>]*href="([^"]+)"[^>]*hreflang="([^"]+)"[^>]*\/?>(?:<\/xhtml:link>)?/g)) {
      alts[a[2]] = new URL(a[1], ORIGIN).href;
    }
    map.set(key.endsWith("/") && key !== "/" ? key : key + (key.endsWith("/") ? "" : "/"), { loc: url.pathname, alts });
  }
  return map;
}

const seoProblems = [];
const sitemaps = Object.fromEntries(
  LANG_SPECS.map((spec) => [spec.hreflang, readSitemap(spec, seoProblems)]),
);

for (const spec of LANG_SPECS) {
  if (sitemaps[spec.hreflang].size === 0) {
    seoProblems.push(`${spec.code} sitemap is empty or unreadable`);
  }
}

// 1. neutral key sets must match exactly across the three languages
const enKeys = sitemaps.en;
for (const spec of LANG_SPECS.slice(1)) {
  const set = sitemaps[spec.hreflang];
  for (const key of enKeys.keys()) {
    if (!set.has(key)) seoProblems.push(`sitemap coverage: en ${key} has no ${spec.code} page`);
  }
  for (const key of set.keys()) {
    if (!enKeys.has(key)) seoProblems.push(`sitemap coverage: ${spec.code} ${spec.prefix}${key === "/" ? "/" : key} has no en page`);
  }
}
// foreign-prefix rejection (e.g. zh-hant loc still targeting a Simplified path)
for (const [key, rec] of sitemaps["zh-Hant"]) {
  if (key !== "/" && rec.loc.startsWith("/zh/")) {
    seoProblems.push(`sitemap: zh-Hant loc ${rec.loc} targets the Simplified tree`);
  }
}

// 2. sitemap alternates per key: the three languages + optional x-default = en
for (const spec of LANG_SPECS) {
  for (const [key, rec] of sitemaps[spec.hreflang]) {
    for (const target of LANG_SPECS) {
      const expected = fullURL(pathFor(target.prefix, key));
      const got = rec.alts[target.hreflang];
      if (got === undefined) {
        seoProblems.push(`sitemap ${spec.code} ${rec.loc}: missing xhtml alternate ${target.hreflang}`);
      } else if (got !== expected) {
        seoProblems.push(`sitemap ${spec.code} ${rec.loc}: ${target.hreflang} alternate is ${got}, expected ${expected}`);
      }
    }
    if (rec.alts["x-default"] !== undefined && rec.alts["x-default"] !== fullURL(pathFor("", key))) {
      seoProblems.push(`sitemap ${spec.code} ${rec.loc}: x-default must be the en page`);
    }
  }
}

// 3. HTML pages for every sitemap key: lang, self-canonical, exact 4 alternates
function htmlLangValues(html) {
  return new Set(
    [...html.matchAll(/<link\s+rel=alternate\s+hreflang=(?:"([^"]*)"|'([^']*)'|([^\s>]+))\s+href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/g)].map(
      (m) => (m[1] ?? m[2] ?? m[3]).toLowerCase(),
    ),
  );
}

function idsIn(html) {
  const set = new Set();
  for (const m of html.matchAll(/\bid=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    set.add(m[1] ?? m[2] ?? m[3]);
  }
  return set;
}

const ID_CACHE = new Map();
function fileIds(file) {
  if (!ID_CACHE.has(file)) {
    try {
      ID_CACHE.set(file, idsIn(readFileSync(file, "utf8")));
    } catch {
      ID_CACHE.set(file, new Set());
    }
  }
  return ID_CACHE.get(file);
}

for (const spec of LANG_SPECS) {
  for (const [key, rec] of sitemaps[spec.hreflang]) {
    const relPath = path.join(publicDir, spec.prefix === "" ? "." : spec.prefix.slice(1), key === "/" ? "" : key.replace(/^\//, ""), "index.html");
    let html;
    try {
      html = readFileSync(relPath, "utf8");
    } catch {
      seoProblems.push(`${spec.code} ${rec.loc}: sitemap URL has no built index.html`);
      continue;
    }

    // a sitemap content page must never be de-indexed or turned into a redirect
    if (/name=robots[^>]*content=["']?noindex/.test(html) || /http-equiv=["']?refresh/i.test(html)) {
      seoProblems.push(`${spec.code} ${rec.loc}: sitemap content page is noindex or a refresh redirect`);
    }

    // <html lang>
    const langMatch = html.match(/<html[^>]*\slang=("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!langMatch) seoProblems.push(`${spec.code} ${rec.loc}: missing <html lang>`);
    else {
      const got = langMatch[2] ?? langMatch[3] ?? langMatch[4];
      if (got !== spec.hreflang) seoProblems.push(`${spec.code} ${rec.loc}: html lang ${got} != ${spec.hreflang}`);
    }

    // self-canonical — full URL equality (a same-path different-domain URL fails)
    const canonical = html.match(/<link\s+rel=canonical\s+href=("([^"]*)"|'([^']*)'|([^\s>]+))/);
    if (!canonical) seoProblems.push(`${spec.code} ${rec.loc}: missing self-canonical`);
    else {
      const cURL = new URL(canonical[2] ?? canonical[3] ?? canonical[4], ORIGIN).href;
      if (cURL !== fullURL(rec.loc)) seoProblems.push(`${spec.code} ${rec.loc}: canonical ${cURL} is not self (${fullURL(rec.loc)})`);
    }

    // exactly four alternates (x-default REQUIRED) as full URLs of the same page
    const alts = new Map();
    for (const m of html.matchAll(/<link\s+rel=alternate\s+hreflang=(?:"([^"]*)"|'([^']*)'|([^\s>]+))\s+href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/g)) {
      const hf = m[1] ?? m[2] ?? m[3];
      const href = m[4] ?? m[5] ?? m[6];
      if (alts.has(hf)) seoProblems.push(`${spec.code} ${rec.loc}: duplicate alternate ${hf}`);
      alts.set(hf, new URL(href, ORIGIN).href);
    }
    for (const target of LANG_SPECS) {
      const expected = fullURL(pathFor(target.prefix, key));
      const got = alts.get(target.hreflang);
      if (got === undefined) seoProblems.push(`${spec.code} ${rec.loc}: missing alternate ${target.hreflang}`);
      else if (got !== expected) seoProblems.push(`${spec.code} ${rec.loc}: ${target.hreflang} alternate is ${got}, expected ${expected}`);
    }
    const xd = alts.get("x-default");
    if (xd === undefined) seoProblems.push(`${spec.code} ${rec.loc}: missing alternate x-default`);
    else if (xd !== fullURL(pathFor("", key))) {
      seoProblems.push(`${spec.code} ${rec.loc}: x-default is ${xd}, expected the en page ${fullURL(pathFor("", key))}`);
    }
    for (const hf of alts.keys()) {
      if (!HREFLANGS.includes(hf) && hf !== "x-default") seoProblems.push(`${spec.code} ${rec.loc}: unexpected alternate ${hf}`);
    }
  }
}

// 4) reverse HTML coverage: walk the ACTUAL built files; every indexable HTML
//    must belong to exactly one language sitemap with its full graph. Utility
//    pages (404, refresh aliases) are skipped here — they are not in sitemaps.
for (const file of htmlFiles) {
  const rel = path.relative(publicDir, file).replaceAll("\\", "/");
  if (rel === "404.html" || rel.endsWith("/404.html")) continue;
  const html = readFileSync(file, "utf8");
  if (/name=robots[^>]*content=["']?noindex/.test(html) || /http-equiv=["']?refresh/i.test(html)) continue;
  // zh-hant/* → Hant, zh/* → Hans, EVERYTHING else is English (en lives at
  // the root — never strip a prefix from it).
  const spec = rel.startsWith("zh-hant/")
    ? sitemaps["zh-Hant"] && LANG_SPECS[2]
    : rel.startsWith("zh/")
      ? LANG_SPECS[1]
      : LANG_SPECS[0];
  const key =
    rel === "index.html" || rel === `${spec.dir}/index.html`
      ? "/"
      : "/" + rel.slice(spec.dir === "en" ? 0 : spec.dir.length + 1).replace(/\/index\.html$/, "/");
  if (!sitemaps[spec.hreflang].has(key)) {
    seoProblems.push(`indexable HTML ${rel} is missing from the ${spec.code} sitemap`);
  }
}

// 4. in-page anchors (Unicode ids supported): local href fragments must resolve
for (const file of htmlFiles) {
  const rel = path.relative(publicDir, file).replaceAll("\\", "/");
  if (rel === "404.html" || rel.endsWith("/404.html")) continue;
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/<a\b[^>]*\bhref=("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const href = m[2] ?? m[3] ?? m[4];
    if (!href || !href.includes("#")) continue;
    const [pathPart, frag] = href.split("#");
    if (!frag) continue;
    let targetFile;
    if (pathPart === "" || pathPart === undefined) targetFile = file;
    else {
      if (!pathPart.startsWith("/") || pathPart.startsWith("//")) continue; // external
      targetFile = localTargetPath(pathPart.split("?")[0], file);
    }
    let decoded;
    try {
      decoded = decodeURIComponent(frag);
    } catch {
      decoded = frag;
    }
    if (!fileIds(targetFile).has(decoded) && !fileIds(targetFile).has(frag)) {
      seoProblems.push(`${rel}: anchor #${frag} not found in ${path.relative(publicDir, targetFile)}`);
    }
  }
}

if (seoProblems.length) {
  throw new Error(
    `Three-language SEO gate failed (${seoProblems.length}):\n${seoProblems.slice(0, 40).join("\n")}`,
  );
}

console.log("Three-language SEO gate passed: sitemap coverage, alternates, canonical, lang, anchors");
console.log("SEO output check passed");

