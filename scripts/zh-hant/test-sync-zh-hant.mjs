#!/usr/bin/env node
// CLI regression for scripts/sync-zh-hant.mjs front matter handling
// (review-07 P1 URL mapping + review-09 date pinning + review-10 fixture shape).
// CONTENT_ROOT mirrors the real layout: the fixture dir IS the content root,
// and every .zh.md has its English sibling so in-site routes resolve.
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SYNC = path.join(ROOT, "scripts/sync-zh-hant.mjs");

const dir = mkdtempSync(path.join(os.tmpdir(), "zh-hant-sync-"));
// fixture dir IS the content root — files sit at the top like real content/
const P = (name) => path.join(dir, name);
void mkdirSync;

// English siblings define the valid routes (about/, trust/, decide/).
for (const [name, body] of [
  ["about.md", "About body."],
  ["trust.md", "Trust body."],
  ["decide.md", "Decide body."],
]) {
  writeFileSync(P(name), `---\ntitle: ${name.replace(".md", "")}\n---\n\n${body}\n`);
}

writeFileSync(
  P("about.zh.md"),
  [
    "---",
    'title: "关于我们"',
    'url: "/zh/about/"',
    "date: 2026-01-01",
    "lastmod: 2026-02-02",
    'aliases: ["/zh/old-about/"]',
    "layout: about",
    "---",
    "",
    "正文链接 [核查](/zh/trust/)。",
    "",
  ].join("\n"),
);
writeFileSync(
  P("decide.zh.md"),
  ["---", 'title: "我要填哪份表"', 'url: "/zh/decide/"', "date: 2026-03-03", "---", "", "工具正文。", ""].join("\n"),
);

function run(args) {
  return spawnSync(process.execPath, [SYNC, ...args], {
    env: { ...process.env, CONTENT_ROOT: dir },
    encoding: "utf8",
  });
}

const failures = [];
function check(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (e) {
    failures.push(name);
    console.error(`FAIL - ${name}\n    ${e.message}`);
  }
}

check("sync runs on fixture", () => {
  const r = run([]);
  assert.equal(r.status, 0, r.stderr + r.stdout);
});

const about = readFileSync(P("about.zh-hant.md"), "utf8");
const decide = readFileSync(P("decide.zh-hant.md"), "utf8");

check("quoted /zh/ url becomes /zh-hant/ (review-07 P1)", () => {
  assert.match(about, /^url: "\/zh-hant\/about\/"$/m);
  assert.match(decide, /^url: "\/zh-hant\/decide\/"$/m);
});

check("aliases keep the source scalar verbatim (quoted)", () => {
  assert.match(about, /^aliases: \["\/zh\/old-about\/"\]$/m);
});

check("lastmod pinned to source FM lastmod (non-git fixture)", () => {
  assert.match(about, /^lastmod: 2026-02-02$/m, "FM lastmod wins when no git date exists");
  assert.match(decide, /^lastmod: 2026-03-03$/m, "date used when neither lastmod nor git exists");
});

check("source page untouched", () => {
  const src = readFileSync(P("about.zh.md"), "utf8");
  assert.match(src, /^url: "\/zh\/about\/"$/m);
  assert.doesNotMatch(src, /zh-hant/);
});

check("body link maps to a real fixture route", () => {
  assert.match(about, /\]\(\/zh-hant\/trust\/\)/);
});

check("re-run is idempotent", () => {
  const r = run([]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /0 written, 2 unchanged/);
});

rmSync(dir, { recursive: true, force: true });
if (failures.length) {
  console.error(`${failures.length} sync regression(s) failed`);
  process.exit(1);
}
console.log("test-sync-zh-hant: all regressions passed");
