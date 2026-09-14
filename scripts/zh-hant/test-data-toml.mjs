#!/usr/bin/env node
// CLI regression for scripts/zh-hant/gen-data-toml.mjs (review-04 counterexamples).
// Runs the real generator via child_process against isolated fixtures under
// TMPDIR (external disk). Never touches repo data files.
//
//   node scripts/zh-hant/test-data-toml.mjs
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, statSync, mkdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import TOML from "@iarna/toml";
import assert from "node:assert/strict";
import { zh2hant } from "./core.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const GEN = path.join(ROOT, "scripts/zh-hant/gen-data-toml.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "zh-hant-toml-"));
void tmp;

function seed(rootDir) {
  for (const d of ["fields", "official_urls", "changelog"]) mkdirSync(path.join(rootDir, d), { recursive: true });

  // #1 stale derived value under an ASCII/empty source
  writeFileSync(
    path.join(rootDir, "official_urls", "fee.toml"),
    [
      "[meta]",
      'name_en = "Testland"',
      'name_zh = "测试国"',
      'fee_en = "USD 20"',
      'fee_zh = "USD 20"',
      'fee_zh_hant = "免費"',
      'note_zh = ""',
      'note_zh_hant = "舊說明"',
      "",
    ].join("\n"),
  );

  // #3 literal string value, #4 inline comment, #2 comment between source and sibling
  writeFileSync(
    path.join(rootDir, "fields", "shapes.toml"),
    [
      "[[fields]]",
      'n = "01"',
      'key = "passport"',
      "label_zh = '填写 \"Passport\" 栏位'",
      'help_zh = "护照" # keep this inline comment',
      "section_zh = \"第一段\"",
      "# human comment between source and derived field",
      "section_zh_hant = \"舊的段落\"",
      "",
    ].join("\n"),
  );

  // #1 orphan: derived field without a source — non-derived data in the same
  // record must survive (review-05 #3)
  writeFileSync(
    path.join(rootDir, "changelog", "orphan.toml"),
    ["[[entries]]", 'date = "2026-01-01"', 'summary_zh_hant = "孤兒"', ""].join("\n"),
  );

  // #4 same file: orphan above, fresh source below — delete must not shift the insert
  writeFileSync(
    path.join(rootDir, "fields", "mixed.toml"),
    ["[legacy]", 'old_zh_hant = "孤兒欄位"', "", "[fresh]", 'title_zh = "新字段标题"', ""].join("\n"),
  );
}

function run(rootDir, args) {
  return spawnSync(process.execPath, [GEN, ...args], {
    env: { ...process.env, DATA_ROOT: rootDir },
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

// ---------- phase A: unsupported multiline blocks everything ----------
const dirA = mkdtempSync(path.join(os.tmpdir(), "zh-hant-toml-a-"));
seed(dirA);
writeFileSync(
  path.join(dirA, "changelog", "multiline.toml"),
  ["[[entries]]", 'date = "2026-01-02"', 'summary_zh = """多行', "文本\"\"\"", ""].join("\n"),
);

check("A1 --check fails on unsupported multiline (#5)", () => {
  const r = run(dirA, ["--check"]);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}${r.stderr}`);
  assert.match(r.stderr, /multiline TOML string unsupported/);
  assert.match(r.stderr, /orphan summary_zh_hant/, "--check also reports orphans");
});
check("A2 generation fails and writes nothing (#5)", () => {
  const r = run(dirA, []);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}${r.stderr}`);
  // the stale ASCII case must NOT have been silently repaired before the failure
  const fee = readFileSync(path.join(dirA, "official_urls", "fee.toml"), "utf8");
  assert.match(fee, /fee_zh_hant = "免費"/, "stale value must be untouched when a failure aborts the run");
});
rmSync(dirA, { recursive: true, force: true });

// ---------- phase B: well-formed fixture ----------
const dirB = mkdtempSync(path.join(os.tmpdir(), "zh-hant-toml-b-"));
seed(dirB);

check("B1 --check flags stale/missing/orphan before generation", () => {
  const r = run(dirB, ["--check"]);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}${r.stderr}`);
  for (const s of [/fee_zh_hant missing or stale/, /note_zh_hant missing or stale/, /label_zh_hant missing or stale/, /help_zh_hant missing or stale/, /section_zh_hant missing or stale/, /orphan summary_zh_hant/]) {
    assert.match(r.stderr + r.stdout, s, `missing report: ${s}`);
  }
});

const mtimesBefore = new Map(
  ["official_urls/fee.toml", "fields/shapes.toml", "changelog/orphan.toml"].map((f) => [
    f,
    statSync(path.join(dirB, f)).mtimeMs,
  ]),
);

check("B2 generation exits 0", () => {
  const r = run(dirB, []);
  assert.equal(r.status, 0, `expected exit 0\n${r.stdout}${r.stderr}`);
  assert.match(r.stdout, /orphan summary_zh_hant removed|orphans removed/);
});

check("B3 output parses independently and values are correct", () => {
  const fee = TOML.parse(readFileSync(path.join(dirB, "official_urls", "fee.toml"), "utf8"));
  assert.equal(fee.meta.fee_zh_hant, "USD 20", "stale ASCII source must refresh");
  assert.equal(fee.meta.note_zh_hant, "", "empty source must derive empty");

  const shapes = TOML.parse(readFileSync(path.join(dirB, "fields", "shapes.toml"), "utf8"));
  assert.equal(shapes.fields[0].label_zh_hant, zh2hant('填写 "Passport" 栏位'), "literal string with quotes round-trips");
  assert.equal(shapes.fields[0].help_zh_hant, zh2hant("护照"));
  assert.equal(shapes.fields[0].section_zh_hant, zh2hant("第一段"));
  assert.equal(shapes.fields[0].copy_zh_hant, undefined, "no phantom fields inserted");

  const orphan = TOML.parse(readFileSync(path.join(dirB, "changelog", "orphan.toml"), "utf8"));
  assert.equal(orphan.entries.length, 1, "non-derived record must survive");
  assert.equal(orphan.entries[0].date, "2026-01-01", "original date preserved");
  assert.equal(orphan.entries[0].summary_zh_hant, undefined, "orphan derived field removed only");

  const mixed = TOML.parse(readFileSync(path.join(dirB, "fields", "mixed.toml"), "utf8"));
  assert.equal(mixed.legacy.old_zh_hant, undefined, "orphan above removed");
  assert.equal(mixed.fresh.title_zh_hant, zh2hant("新字段标题"), "insert below survives the delete above");
  assert.equal(mixed.fresh.title_zh, "新字段标题", "source field untouched");
});

check("B4 comments and non-derived fields preserved", () => {
  const shapesRaw = readFileSync(path.join(dirB, "fields", "shapes.toml"), "utf8");
  assert.match(shapesRaw, /# human comment between source and derived field/);
  assert.match(shapesRaw, /# keep this inline comment/);
  assert.match(shapesRaw, /label_zh = '填写 "Passport" 栏位'/, "literal source line byte-preserved");
  assert.match(shapesRaw, /help_zh = "护照" # keep this inline comment/);

  const feeRaw = readFileSync(path.join(dirB, "official_urls", "fee.toml"), "utf8");
  assert.match(feeRaw, /fee_zh_hant = "USD 20"/);
  assert.match(feeRaw, /name_zh_hant = "測試國"/);
});

check("B5 re-run is a no-op with mtime untouched", () => {
  const tracked = ["official_urls/fee.toml", "fields/shapes.toml", "changelog/orphan.toml", "fields/mixed.toml"];
  const before = tracked.map((f) => statSync(path.join(dirB, f)).mtimeMs);
  const r = run(dirB, []);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /nothing to do/);
  const after = tracked.map((f) => statSync(path.join(dirB, f)).mtimeMs);
  assert.deepEqual(after, before, "mtime changed without a real write");
  void mtimesBefore;
});

check("B6 --check passes on the synced fixture", () => {
  const r = run(dirB, ["--check"]);
  assert.equal(r.status, 0, r.stderr);
});
rmSync(dirB, { recursive: true, force: true });

// ---------- phase C: broken untouched file must abort the whole run ----------
const dirC = mkdtempSync(path.join(os.tmpdir(), "zh-hant-toml-c-"));
for (const d of ["fields", "official_urls", "changelog"]) mkdirSync(path.join(dirC, d), { recursive: true });
// untouched-but-broken file: correct derived pair, unrelated unclosed string
writeFileSync(
  path.join(dirC, "official_urls", "unchanged.toml"),
  ["[meta]", 'label_zh = "正確"', 'label_zh_hant = "正確"', 'broken_en = "unclosed', ""].join("\n"),
);
// dirty file: stale derived value that a healthy run would refresh
writeFileSync(
  path.join(dirC, "official_urls", "needs-update.toml"),
  ["[meta]", 'fee_zh = "USD 20"', 'fee_zh_hant = "免費"', ""].join("\n"),
);

check("C1 --check fails listing the broken file", () => {
  const r = run(dirC, ["--check"]);
  assert.equal(r.status, 1, `expected exit 1\n${r.stdout}${r.stderr}`);
  assert.match(r.stderr + r.stdout, /unchanged\.toml/);
});

check("C2 generation aborts without touching the dirty file either", () => {
  const r = run(dirC, []);
  assert.equal(r.status, 1, `expected exit 1\n${r.stdout}${r.stderr}`);
  assert.match(r.stderr + r.stdout, /unchanged\.toml/, "broken untouched file must be named");
  const dirty = readFileSync(path.join(dirC, "official_urls", "needs-update.toml"), "utf8");
  assert.match(dirty, /fee_zh_hant = "免費"/, "stale value must remain untouched when the run aborts");
  assert.doesNotMatch(dirty, /USD 20"\n\s*fee_zh_hant = "USD 20"/);
});
rmSync(dirC, { recursive: true, force: true });

if (failures.length) {
  console.error(`${failures.length} regression(s) failed`);
  process.exit(1);
}
console.log("test-data-toml: all CLI regressions passed");
