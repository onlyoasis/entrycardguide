#!/usr/bin/env node
// Staleness gate for hand-translated display text (review-13 #3): if the
// English source help/label/note/option/… changed after the Traditional
// translation was written, the old translation must NOT silently survive.
// Compares current source text against scripts/zh-hant/translation-sources.json
// and fails until a translator reviews the change and explicitly refreshes the
// snapshot via `npm run snapshot:zh-hant`. The snapshot is never a second rule
// source — machine data still lives only in data/.
// SNAPSHOT_ROOT env overrides the repo root (isolated regression fixtures).
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.env.SNAPSHOT_ROOT ? path.resolve(process.env.SNAPSHOT_ROOT) : path.resolve(import.meta.dirname, "../..");
const snapshotPath = path.join(ROOT, "scripts/zh-hant/translation-sources.json");

let snapshot, current;
try {
  snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
} catch {
  console.error("check-translation-currency: snapshot missing — run `npm run snapshot:zh-hant` once");
  process.exit(1);
}

function diff(a, b, where, out) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a?.[k], b?.[k], `${where}.${k}`, out);
    return;
  }
  out.push(`${where}: snapshot=${JSON.stringify(a)} current=${JSON.stringify(b)}`);
}

// rules sources
const problems = [];
for (const [country, fields] of Object.entries(snapshot.rules ?? {})) {
  let base;
  try {
    base = JSON.parse(readFileSync(path.join(ROOT, `data/rules/${country}.json`), "utf8"));
  } catch {
    problems.push(`rules/${country}: source file missing`);
    continue;
  }
  for (const [key, snapField] of Object.entries(fields)) {
    const rule = base.fields[key];
    if (!rule) {
      problems.push(`rules/${country}.${key}: field removed from source`);
      continue;
    }
    const now = {};
    for (const k of ["label", "help", "placeholder"]) if (rule[k] !== undefined) now[k] = rule[k];
    if (rule.errors) now.errors = rule.errors;
    // Constraint inputs the translated messages may reference (review-14):
    // a changed maxLength/fee must invalidate the old translation text.
    for (const k of ["type", "required", "pattern", "minLength", "maxLength", "minDate", "maxDate"]) {
      if (rule[k] !== undefined) now[k] = rule[k];
    }
    diff(snapField, now, `rules/${country}.${key}`, problems);
  }
}

// Coverage: the snapshot must match the FULL hand-translated set — an empty,
// truncated or over-grown snapshot silently skipping checks is a failure
// (review-14 #3).
import { readdirSync, existsSync } from "node:fs";
const overlayCountries = existsSync(path.join(ROOT, "data/rules_i18n"))
  ? readdirSync(path.join(ROOT, "data/rules_i18n"))
      .filter((n) => n.endsWith(".json"))
      .map((n) => n.replace(/\.json$/, ""))
  : [];
const snapCountries = Object.keys(snapshot.rules ?? {});
if (!snapCountries.length) problems.push("snapshot.rules is empty — nothing is under currency control");
for (const c of overlayCountries) if (!(c in (snapshot.rules ?? {}))) problems.push(`snapshot.rules missing country "${c}" (overlay exists)`);
for (const c of snapCountries) if (!overlayCountries.includes(c)) problems.push(`snapshot.rules has country "${c}" with no overlay`);
for (const [country, fields] of Object.entries(snapshot.rules ?? {})) {
  let base;
  try {
    base = JSON.parse(readFileSync(path.join(ROOT, `data/rules/${country}.json`), "utf8"));
  } catch {
    continue; // already reported above
  }
  for (const key of Object.keys(base.fields)) {
    if (!(key in fields)) problems.push(`snapshot.rules.${country} missing field "${key}"`);
  }
  for (const key of Object.keys(fields)) {
    if (!(key in base.fields)) problems.push(`snapshot.rules.${country} has stale field "${key}"`);
  }
}

if (!Object.keys(snapshot.tree ?? {}).length) problems.push("snapshot.tree is empty — nothing is under currency control");
const treeStates = (() => {
  try {
    return Object.keys(JSON.parse(readFileSync(path.join(ROOT, "data/decision/tree.json"), "utf8")).states);
  } catch {
    return null; // reported above
  }
})();
if (treeStates) {
  for (const sid of treeStates) if (!(sid in (snapshot.tree ?? {}))) problems.push(`snapshot.tree missing state "${sid}"`);
  for (const sid of Object.keys(snapshot.tree ?? {})) if (!treeStates.includes(sid)) problems.push(`snapshot.tree has stale state "${sid}"`);
}

// tree sources
try {
  const tree = JSON.parse(readFileSync(path.join(ROOT, "data/decision/tree.json"), "utf8"));
  for (const [sid, snapState] of Object.entries(snapshot.tree ?? {})) {
    const state = tree.states[sid];
    if (!state) {
      problems.push(`tree/${sid}: state removed from source`);
      continue;
    }
    const now = {};
    if (state.type === "question") {
      now.label = state.label;
      now.options = Object.fromEntries(state.options.map((o) => [o.value, o.label]));
    } else {
      now.summary = state.summary;
      if (state.note !== undefined) now.note = state.note;
      if (state.fallback_label !== undefined) now.fallback_label = state.fallback_label;
      if (state.fallback_warning !== undefined) now.fallback_warning = state.fallback_warning;
      now.forms = state.forms.map((f) => ({ name: f.name, fee: f.fee, agency: f.agency, deadline: f.deadline }));
    }
    diff(snapState, now, `tree/${sid}`, problems);
  }
} catch {
  problems.push("tree: data/decision/tree.json unreadable");
}

if (problems.length) {
  console.error(`check-translation-currency: ${problems.length} changed source text(s) need translation review —`);
  for (const p of problems.slice(0, 40)) console.error("  " + p);
  console.error("after reviewing the Traditional translations, refresh the snapshot: npm run snapshot:zh-hant");
  process.exit(1);
}
console.log("check-translation-currency OK: hand-translated text matches its reviewed source snapshot");
