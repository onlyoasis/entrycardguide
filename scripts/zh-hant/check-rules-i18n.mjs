#!/usr/bin/env node
// Gate: every validator country must have a COMPLETE Traditional display
// overlay in data/rules_i18n/{country}.json. English fallbacks in
// validator.ts must never be reachable on /zh-hant/ pages, so the overlay has
// to cover every real, triggerable message:
// - label (Han) for every field; help whenever the base rule has one;
// - errors ⊇ (base errors ∪ type-required errors), tooEarly/tooLate only
//   when the base field actually sets minDate/maxDate;
// - no machine fields (pattern/minLength/…) inside the overlay;
// - ui.fix / ui.ok present.
// Fails loudly listing every gap — a missing key can never slip through.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.env.RULES_GATE_ROOT
  ? path.resolve(process.env.RULES_GATE_ROOT)
  : path.resolve(import.meta.dirname, "../..");
const contentRoot = process.env.RULES_GATE_CONTENT
  ? path.resolve(process.env.RULES_GATE_CONTENT)
  : path.join(ROOT, "content");

const VALIDATOR_TYPES = {
  passport: ["required", "tooShort", "tooLong", "invalidChars", "invalidFormat"],
  date: ["required", "invalidFormat", "invalidMonth", "invalidDay", "invalid"],
  flight: ["required", "invalidFormat"],
  name: ["required", "tooShort", "tooLong", "invalidChars"],
  email: ["required", "invalidFormat", "tooLong"],
  phone: ["required", "invalidFormat"],
  select: ["required"],
  text: ["required"],
  nationality: ["required"],
};

const hasHan = (s) => /[\u3400-\u9fff]/.test(s);
// Language-neutral error constants that are allowed to carry no Han text.
// Errors outside this allowlist MUST contain Traditional Chinese — a pure
// English sentence is a gap, never a pass (review-12).
const ERROR_ALLOWLIST = new Set([]);

// discover validator countries from the EN content (single source)
const out = execFileSync("grep", ["-rl", "{{< validator", contentRoot, "--include=*.md"], { encoding: "utf8" });
const countries = [...new Set(out.trim().split("\n").map((line) => {
  const rel = path.relative(contentRoot, line);
  return rel.split(path.sep)[0];
}))].sort();

const problems = [];
let fields = 0, errs = 0;

for (const c of countries) {
  const basePath = path.join(ROOT, `data/rules/${c}.json`);
  const overlayPath = path.join(ROOT, `data/rules_i18n/${c}.json`);
  if (!existsSync(overlayPath)) {
    problems.push(`${c}: missing data/rules_i18n/${c}.json`);
    continue;
  }
  const base = JSON.parse(readFileSync(basePath, "utf8"));
  const overlay = JSON.parse(readFileSync(overlayPath, "utf8"));
  if (!overlay.ui || overlay.ui.fix !== "修正 ✗" || overlay.ui.ok !== "正確 ✓") {
    problems.push(`${c}: overlay.ui must carry 修正 ✗ / 正確 ✓`);
  }
  for (const [key, rule] of Object.entries(base.fields)) {
    fields++;
    const o = overlay.fields?.[key];
    if (!o) {
      problems.push(`${c}.${key}: missing overlay field`);
      continue;
    }
    for (const k of Object.keys(o)) {
      if (!["label", "help", "errors", "placeholder"].includes(k)) {
        problems.push(`${c}.${key}: overlay carries non-display key "${k}"`);
      }
    }
    if (typeof o.label !== "string" || !hasHan(o.label)) problems.push(`${c}.${key}: label not Traditional`);
    if (rule.help && (!o.help || !hasHan(o.help))) problems.push(`${c}.${key}: help missing or not Traditional`);
    // placeholder: when overridden it must either keep the literal source or
    // carry Han (instructional placeholders are translated, real example
    // values like dates/flight numbers stay verbatim).
    if (o.placeholder !== undefined && o.placeholder !== rule.placeholder) {
      if (!hasHan(o.placeholder)) problems.push(`${c}.${key}: placeholder override not Traditional`);
    }
    const required = new Set(VALIDATOR_TYPES[rule.type] || ["required"]);
    if (rule.minDate) required.add("tooEarly");
    if (rule.maxDate) required.add("tooLate");
    for (const k of Object.keys(rule.errors || {})) required.add(k);
    for (const k of required) {
      const v = o.errors?.[k];
      errs++;
      if (typeof v !== "string" || !v) problems.push(`${c}.${key}: error "${k}" missing`);
      else if (!hasHan(v) && !ERROR_ALLOWLIST.has(v)) problems.push(`${c}.${key}: error "${k}" is not Traditional`);
    }
  }
}

if (problems.length) {
  console.error(`check-rules-i18n: ${problems.length} gap(s) across ${countries.length} validator countries (${fields} fields / ${errs} error slots):`);
  for (const p of problems.slice(0, 60)) console.error("  " + p);
  process.exit(1);
}
console.log(`check-rules-i18n OK: ${countries.length} countries, ${fields} fields, ${errs} error slots fully Traditional`);
