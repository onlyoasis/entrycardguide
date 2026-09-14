#!/usr/bin/env node
// Negative regression for check-rules-i18n (review-12): the gate must FAIL
// when a Traditional error is swapped back to the English source sentence, or
// when a non-display key sneaks into an overlay — and pass when clean.
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

const ROOT = path.resolve(import.meta.dirname, "../..");
const GATE = path.join(ROOT, "scripts/zh-hant/check-rules-i18n.mjs");

function seed() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "zh-hant-gate-"));
  mkdirSync(path.join(dir, "data/rules"), { recursive: true });
  mkdirSync(path.join(dir, "data/rules_i18n"), { recursive: true });
  mkdirSync(path.join(dir, "content/cambodia"), { recursive: true });
  cpSync(path.join(ROOT, "data/rules/cambodia.json"), path.join(dir, "data/rules/cambodia.json"));
  cpSync(path.join(ROOT, "data/rules_i18n/cambodia.json"), path.join(dir, "data/rules_i18n/cambodia.json"));
  writeFileSync(path.join(dir, "content/cambodia/how-to-fill.md"), "---\ntitle: x\n---\n\n{{< validator country=\"cambodia\" >}}\n");
  return dir;
}
function run(dir) {
  return spawnSync(process.execPath, [GATE], {
    env: { ...process.env, RULES_GATE_ROOT: dir, RULES_GATE_CONTENT: path.join(dir, "content") },
    encoding: "utf8",
  });
}

const failures = [];
function check(name, fn) {
  try { fn(); console.log(`ok - ${name}`); }
  catch (e) { failures.push(name); console.error(`FAIL - ${name}\n    ${e.message}`); }
}

check("clean overlay passes", () => {
  const dir = seed();
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr + r.stdout);
  rmSync(dir, { recursive: true, force: true });
});

check("English required error FAILS the gate (review-12 negative)", () => {
  const dir = seed();
  const p = path.join(dir, "data/rules_i18n/cambodia.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  o.fields.passport.errors.required = "Passport number is required";
  writeFileSync(p, JSON.stringify(o));
  const r = run(dir);
  assert.equal(r.status, 1, "gate must reject pure-English error");
  assert.match(r.stderr, /error "required" is not Traditional/);
  rmSync(dir, { recursive: true, force: true });
});

check("non-display key FAILS the gate", () => {
  const dir = seed();
  const p = path.join(dir, "data/rules_i18n/cambodia.json");
  const o = JSON.parse(readFileSync(p, "utf8"));
  o.fields.passport.fields = "x";
  writeFileSync(p, JSON.stringify(o));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /non-display key "fields"/);
  rmSync(dir, { recursive: true, force: true });
});

if (failures.length) { console.error(`${failures.length} gate regression(s) failed`); process.exit(1); }
console.log("test-rules-gate: all regressions passed");
