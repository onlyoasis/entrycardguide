#!/usr/bin/env node
// Isolated negative regression for check-translation-currency (review-13 #3):
// changing one English help text while keeping the key must FAIL the gate;
// the untouched tree stays clean afterwards.
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, cpSync, rmSync, readdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

const ROOT = path.resolve(import.meta.dirname, "../..");
const GATE = path.join(ROOT, "scripts/zh-hant/check-translation-currency.mjs");

const dir = mkdtempSync(path.join(os.tmpdir(), "zh-hant-currency-"));
mkdirSync(path.join(dir, "data/rules"), { recursive: true });
mkdirSync(path.join(dir, "data/decision"), { recursive: true });
mkdirSync(path.join(dir, "scripts/zh-hant"), { recursive: true });
cpSync(path.join(ROOT, "data/rules_i18n"), path.join(dir, "data/rules_i18n"), { recursive: true });
for (const f of readdirSync(path.join(ROOT, "data/rules")).filter((n) => n.endsWith(".json")))
  cpSync(path.join(ROOT, "data/rules", f), path.join(dir, "data/rules", f));
cpSync(path.join(ROOT, "data/decision/tree.json"), path.join(dir, "data/decision/tree.json"));
cpSync(path.join(ROOT, "scripts/zh-hant/translation-sources.json"), path.join(dir, "scripts/zh-hant/translation-sources.json"));

function run() {
  return spawnSync(process.execPath, [GATE], {
    env: { ...process.env, SNAPSHOT_ROOT: dir },
    encoding: "utf8",
  });
}

const failures = [];
function check(name, fn) {
  try { fn(); console.log(`ok - ${name}`); }
  catch (e) { failures.push(name); console.error(`FAIL - ${name}\n    ${e.message}`); }
}

check("clean snapshot passes", () => {
  const r = run();
  assert.equal(r.status, 0, r.stderr);
});

check("changed source help (same key) FAILS the gate", () => {
  const p = path.join(dir, "data/rules/thailand.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  o.fields.passport.help = "Changed English help text after translation.";
  writeFileSync(p, JSON.stringify(o, null, 2));
  const r = run();
  assert.equal(r.status, 1, "stale translation must be caught");
  assert.match(r.stderr, /rules\/thailand\.passport\.help/);
  assert.match(r.stderr, /npm run snapshot:zh-hant/);
  // restore for the following cases
  o.fields.passport.help = "Printed on the photo page of your passport. Usually starts with a letter.";
  writeFileSync(p, JSON.stringify(o, null, 2));
});

check("changed maxLength constraint FAILS the gate (review-14)", () => {
  const p = path.join(dir, "data/rules/cambodia.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  o.fields.passport.maxLength = 13;
  writeFileSync(p, JSON.stringify(o, null, 2));
  const r = run();
  assert.equal(r.status, 1, "constraint change must invalidate translation currency");
  assert.match(r.stderr, /rules\/cambodia\.passport\.maxLength/);
  o.fields.passport.maxLength = 12;
  writeFileSync(p, JSON.stringify(o, null, 2));
});

check("changed tree form fee FAILS the gate (review-14)", () => {
  const p = path.join(dir, "data/decision/tree.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  o.states.thailand_result.forms[0].fee = "USD999";
  writeFileSync(p, JSON.stringify(o, null, 2));
  const r = run();
  assert.equal(r.status, 1, "fee change must invalidate feeDisplay currency");
  assert.match(r.stderr, /tree\/thailand_result\.forms/);
  o.states.thailand_result.forms[0].fee = "FREE";
  writeFileSync(p, JSON.stringify(o, null, 2));
});

check("empty snapshot FAILS the gate (review-14)", () => {
  const p = path.join(dir, "scripts/zh-hant/translation-sources.json");
  writeFileSync(p, "{}");
  const r = run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /snapshot\.rules is empty/);
  // restore
  cpSync(path.join(ROOT, "scripts/zh-hant/translation-sources.json"), p);
});

check("truncated snapshot (missing state) FAILS the gate (review-14)", () => {
  const p = path.join(dir, "scripts/zh-hant/translation-sources.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  delete o.tree.thailand_result;
  writeFileSync(p, JSON.stringify(o, null, 1));
  const r = run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /snapshot\.tree missing state "thailand_result"/);
  cpSync(path.join(ROOT, "scripts/zh-hant/translation-sources.json"), p);
});

check("restored fixture passes again", () => {
  const r = run();
  assert.equal(r.status, 0, r.stderr);
});

rmSync(dir, { recursive: true, force: true });
if (failures.length) { console.error(`${failures.length} regression(s) failed`); process.exit(1); }
console.log("test-translation-currency: all regressions passed");
