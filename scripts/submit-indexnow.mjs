// Notifies IndexNow (Bing, Yandex, Seznam, Naver) that pages changed.
// Reads URLs from Hugo's own sitemaps so the URL rules live in one place.
//
//   node scripts/submit-indexnow.mjs             # pages whose lastmod is within 2 days
//   node scripts/submit-indexnow.mjs --all       # every page (use once, to seed the index)
//   node scripts/submit-indexnow.mjs --dry-run   # print what would be sent, send nothing
//
// INDEXNOW_MAX_AGE_DAYS overrides the 2-day window.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const publicDir = "public";
const host = "entrycardguide.com";
const endpoint = "https://api.indexnow.org/indexnow";
const sitemaps = ["public/en/sitemap.xml", "public/zh/sitemap.xml"];
const keyFilePattern = /^[0-9a-f]{32}\.txt$/;

const submitEverything = process.argv.includes("--all");
const dryRun = process.argv.includes("--dry-run");

function readKey() {
  const found = readdirSync(publicDir).filter(name => keyFilePattern.test(name));
  if (found.length !== 1) {
    throw new Error(
      `Expected exactly one IndexNow key file (${keyFilePattern}) in ${publicDir}/, found ${found.length}: ${found.join(", ") || "none"}. ` +
        `The key file lives in static/ and Hugo copies it into ${publicDir}/.`,
    );
  }
  const key = path.basename(found[0], ".txt");
  const contents = readFileSync(path.join(publicDir, found[0]), "utf8").trim();
  if (contents !== key) {
    throw new Error(`Key file ${found[0]} must contain exactly "${key}", but contains "${contents}".`);
  }
  return key;
}

function readSitemapEntries(file) {
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

function changedSince() {
  const raw = process.env.INDEXNOW_MAX_AGE_DAYS ?? "2";
  const days = Number(raw);
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(`INDEXNOW_MAX_AGE_DAYS must be a positive number, got "${raw}".`);
  }
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

const key = readKey();
const entries = sitemaps.flatMap(readSitemapEntries);
const cutoff = submitEverything ? null : changedSince();
const urlList = [
  ...new Set(
    entries.filter(entry => cutoff === null || entry.lastmod.getTime() >= cutoff).map(entry => entry.url),
  ),
];

if (urlList.length === 0) {
  console.log(`IndexNow: nothing changed since ${new Date(cutoff).toISOString()}, skipping.`);
  process.exit(0);
}

const payload = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList,
};

console.log(`IndexNow: ${urlList.length} of ${entries.length} URLs${submitEverything ? " (--all)" : ""}`);
for (const url of urlList) {
  console.log(`  ${url}`);
}

if (dryRun) {
  console.log("IndexNow: --dry-run, nothing submitted.");
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  throw new Error(`IndexNow rejected the submission: ${response.status} ${response.statusText} — ${await response.text()}`);
}

console.log(`IndexNow: accepted (${response.status}).`);
