#!/usr/bin/env node
// Negative regressions for the three-language SEO gate (review-15/16).
// Each case runs the REAL gate against an isolated temp copy of public-release/ via
// PUBLIC_DIR; the real public-release/ directory is never modified.
import { spawnSync } from "node:child_process";
import { cpSync, rmSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

const ROOT = path.resolve(import.meta.dirname, "../..");
const GATE = path.join(ROOT, "scripts/check-seo-output.mjs");

function freshCopy() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "zh-hant-seo-"));
  cpSync(path.join(ROOT, "public-release"), path.join(dir, "public"), { recursive: true, dereference: true });
  return dir;
}
function run(dir) {
  return spawnSync(process.execPath, [GATE], {
    env: { ...process.env, PUBLIC_DIR: path.join(dir, "public") },
    encoding: "utf8",
  });
}

const failures = [];
function check(name, fn) {
  try { fn(); console.log(`ok - ${name}`); }
  catch (e) { failures.push(name); console.error(`FAIL - ${name}\n    ${e.message}`); }
}

check("pristine build output passes", () => {
  const dir = freshCopy();
  const r = run(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  rmSync(dir, { recursive: true, force: true });
});

check("deleting a zh-hant page FAILS", () => {
  const dir = freshCopy();
  rmSync(path.join(dir, "public/zh-hant/thailand/tdac"), { recursive: true, force: true });
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Missing local links|no \/zh-hant counterpart|missing from the zh-Hant sitemap/);
  rmSync(dir, { recursive: true, force: true });
});

check("hreflang pointing at a different existing page FAILS", () => {
  const dir = freshCopy();
  const p = path.join(dir, "public/zh-hant/thailand/tdac/index.html");
  const html = readFileSync(p, "utf8").replace(
    /hreflang=zh-Hant href=[^ >]+/,
    "hreflang=zh-Hant href=https://entrycardguide.com/zh-hant/japan/visit-japan-web/",
  );
  writeFileSync(p, html);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /zh-Hant alternate is https:\/\/entrycardguide\.com\/zh-hant\/japan\/visit-japan-web\//);
  rmSync(dir, { recursive: true, force: true });
});

check("x-default pointing at another en page FAILS", () => {
  const dir = freshCopy();
  const p = path.join(dir, "public/thailand/tdac/index.html");
  const html = readFileSync(p, "utf8").replace(
    /hreflang=x-default href=[^ >]+/,
    "hreflang=x-default href=https://entrycardguide.com/japan/visit-japan-web/",
  );
  writeFileSync(p, html);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /x-default is https:\/\/entrycardguide\.com\/japan\/visit-japan-web\//);
  rmSync(dir, { recursive: true, force: true });
});

check("same-path wrong-domain canonical FAILS", () => {
  const dir = freshCopy();
  const p = path.join(dir, "public/thailand/tdac/index.html");
  const html = readFileSync(p, "utf8").replace(
    /rel=canonical href=[^ >]+/,
    "rel=canonical href=https://example.net/thailand/tdac/",
  );
  writeFileSync(p, html);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /canonical https:\/\/example\.net\/thailand\/tdac\/ is not self/);
  rmSync(dir, { recursive: true, force: true });
});

check("tampered sitemap alternate FAILS", () => {
  const dir = freshCopy();
  const p = path.join(dir, "public/zh-hant/sitemap.xml");
  const xml = readFileSync(p, "utf8").replace(
    /hreflang="zh-Hant" href="[^"]+"/,
    'hreflang="zh-Hant" href="https://entrycardguide.com/zh/japan/visit-japan-web/"',
  );
  writeFileSync(p, xml);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /zh-Hant alternate is https:\/\/entrycardguide\.com\/zh\/japan\/visit-japan-web\//);
  rmSync(dir, { recursive: true, force: true });
});

check("deleting the zh-hant sitemap FAILS", () => {
  const dir = freshCopy();
  rmSync(path.join(dir, "public/zh-hant/sitemap.xml"));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Missing required SEO output|zh-hant.sitemap/);
  rmSync(dir, { recursive: true, force: true });
});

check("unindexed indexable HTML copy FAILS", () => {
  const dir = freshCopy();
  mkdirSync(path.join(dir, "public/thailand/unlisted"), { recursive: true });
  const src = readFileSync(path.join(dir, "public/thailand/tdac/index.html"), "utf8");
  writeFileSync(path.join(dir, "public/thailand/unlisted/index.html"), src);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /thailand\/unlisted\/index\.html is missing from the en sitemap/);
  rmSync(dir, { recursive: true, force: true });
});

if (failures.length) { console.error(`${failures.length} SEO regression(s) failed`); process.exit(1); }
console.log("test-check-seo: all negative regressions passed");
