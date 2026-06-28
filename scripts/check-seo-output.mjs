import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const publicDir = "public";

const requiredFiles = [
  "public/404.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/en/sitemap.xml",
  "public/zh/sitemap.xml",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing required SEO output: ${file}`);
  }
}

const robots = readFileSync("public/robots.txt", "utf8");
for (const sitemap of [
  "https://entrycardguide.com/sitemap.xml",
  "https://entrycardguide.com/en/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
]) {
  if (!robots.includes(`Sitemap: ${sitemap}`)) {
    throw new Error(`robots.txt does not advertise ${sitemap}`);
  }
}

const rootSitemap = readFileSync("public/sitemap.xml", "utf8");
for (const sitemap of [
  "https://entrycardguide.com/en/sitemap.xml",
  "https://entrycardguide.com/zh/sitemap.xml",
]) {
  if (!rootSitemap.includes(`<loc>${sitemap}</loc>`)) {
    throw new Error(`root sitemap does not include ${sitemap}`);
  }
}

for (const file of ["public/en/sitemap.xml", "public/zh/sitemap.xml"]) {
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

    if (hreflang === "x-default" && localPath.startsWith("/zh/")) {
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

const hasAffiliateClickScript = jsFiles.some(file => {
  const js = readFileSync(file, "utf8");
  return js.includes("affiliate_click") && js.includes("gtag");
});

if (!hasAffiliateClickScript) {
  affiliateAnalyticsProblems.push("No built JS bundle tracks affiliate_click with gtag");
}

const ga4MeasurementId = process.env.HUGO_PARAMS_ANALYTICS_GA4_MEASUREMENT_ID?.trim();
if (ga4MeasurementId) {
  const homeHtml = readFileSync("public/index.html", "utf8");
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

console.log("SEO output check passed");
