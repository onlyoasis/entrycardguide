import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const publicDir = "public";

const requiredFiles = [
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
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}
walk(publicDir);

const missingLocalTargets = [];
const localAssetPattern = /\s(?:href|src)=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g;

function localTargetExists(rawUrl) {
  if (
    !rawUrl ||
    rawUrl.startsWith("http:") ||
    rawUrl.startsWith("https:") ||
    rawUrl.startsWith("mailto:") ||
    rawUrl.startsWith("tel:") ||
    rawUrl.startsWith("#") ||
    rawUrl.startsWith("data:") ||
    rawUrl.startsWith("//")
  ) {
    return true;
  }

  const cleanUrl = rawUrl.split("#")[0].split("?")[0];
  if (!cleanUrl || cleanUrl === "/") return true;

  const target = cleanUrl.endsWith("/")
    ? path.join(publicDir, cleanUrl, "index.html")
    : path.extname(cleanUrl)
      ? path.join(publicDir, cleanUrl)
      : path.join(publicDir, cleanUrl, "index.html");

  return existsSync(target) && statSync(target).isFile();
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(localAssetPattern)) {
    const rawUrl = match[1] || match[2] || match[3];
    if (!localTargetExists(rawUrl)) {
      missingLocalTargets.push(`${path.relative(publicDir, file)} -> ${rawUrl}`);
    }
  }
}

if (missingLocalTargets.length) {
  throw new Error(
    `Missing local links/assets:\n${missingLocalTargets.slice(0, 30).join("\n")}`,
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
