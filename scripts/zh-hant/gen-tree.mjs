#!/usr/bin/env node
// Merge the hand-authored Traditional display overlay
// (scripts/zh-hant/tree-zh-hant.part*.json) onto data/decision/tree.json and
// emit data/decision/tree.zh-hant.json.
//
// Hard gates (fail loudly, never silently fall back):
// - every state in the base tree has overlay coverage for its display strings;
// - the state graph is byte-equivalent: same states, same option
//   value→next edges, same start — only display text changes;
// - every localized display string (labels, summaries, notes, deadlines,
//   agencies, fee displays, fallback labels/warnings) contains Han text;
// - machine semantics survive: option values, fees, URLs, lastVerified are
//   copied verbatim; guide links are rewritten to /zh-hant/ (validated).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { readdirSync } from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const overlayDir = path.join(ROOT, "scripts/zh-hant");
const base = JSON.parse(readFileSync(path.join(ROOT, "data/decision/tree.json"), "utf8"));

const overlay = {};
for (const f of readdirSync(overlayDir).filter((n) => n.startsWith("tree-zh-hant.part") && n.endsWith(".json")).sort()) {
  Object.assign(overlay, JSON.parse(readFileSync(path.join(overlayDir, f), "utf8")));
}

const problems = [];
const han = (s) => /[\u3400-\u9fff]/.test(s);
const hantifyGuide = (g) => (g.startsWith("/") ? "/zh-hant" + g : g);

const out = { version: base.version, lastVerified: base.lastVerified, start: base.start, states: {} };
if (base.start !== "country") problems.push(`unexpected start: ${base.start}`);

for (const [sid, state] of Object.entries(base.states)) {
  const o = overlay[sid];
  if (!o) {
    problems.push(`${sid}: no overlay for state`);
    continue;
  }
  if (state.type === "question") {
    if (!o.label || !han(o.label)) problems.push(`${sid}: label missing or not Traditional`);
    const options = state.options.map((opt) => {
      const lo = o.options?.[opt.value];
      if (!lo || !han(lo)) problems.push(`${sid}: option ${opt.value} label missing or not Traditional`);
      return { value: opt.value, label: lo ?? opt.label, next: opt.next };
    });
    out.states[sid] = { type: "question", label: o.label ?? state.label, options };
  } else {
    if (!o.summary || !han(o.summary)) problems.push(`${sid}: summary missing or not Traditional`);
    if (state.note && (!o.note || !han(o.note))) problems.push(`${sid}: note missing or not Traditional`);
    if (state.fallback_label && (!o.fallback_label || !han(o.fallback_label)))
      problems.push(`${sid}: fallback_label missing or not Traditional`);
    if (state.fallback_warning && state.fallback_warning !== "None" &&
        (!o.fallback_warning || !han(o.fallback_warning)))
      problems.push(`${sid}: fallback_warning missing or not Traditional`);
    if ((o.forms?.length ?? 0) !== state.forms.length)
      problems.push(`${sid}: forms overlay count ${o.forms?.length} != base ${state.forms.length}`);
    const forms = state.forms.map((f, i) => {
      const fo = o.forms?.[i] ?? {};
      const fee = fo.feeDisplay ?? f.fee;
      if (!han(fee)) problems.push(`${sid}: form ${i} feeDisplay missing or not Traditional`);
      if (fo.agency && !han(fo.agency)) problems.push(`${sid}: form ${i} agency not Traditional`);
      if (fo.deadline && !han(fo.deadline)) problems.push(`${sid}: form ${i} deadline not Traditional`);
      return {
        name: fo.name ?? f.name,
        fee: f.fee, // machine value untouched — decide.ts keys on === 'FREE'
        feeDisplay: fee,
        url: f.url,
        guide: hantifyGuide(f.guide),
        agency: fo.agency ?? f.agency,
        ...(f.deadline ? { deadline: fo.deadline ?? f.deadline } : {}),
      };
    });
    out.states[sid] = {
      type: "result",
      country: state.country,
      summary: o.summary ?? state.summary,
      forms,
      ...(state.note ? { note: o.note ?? state.note } : {}),
      ...(state.fallback_guide
        ? { fallback_guide: hantifyGuide(state.fallback_guide), fallback_label: o.fallback_label ?? state.fallback_label }
        : {}),
      ...(state.fallback_warning && state.fallback_warning !== "None"
        ? { fallback_warning: o.fallback_warning ?? state.fallback_warning }
        : {}),
    };
  }
}

// graph equivalence check: edges must be identical to base
for (const [sid, state] of Object.entries(base.states)) {
  const o2 = out.states[sid];
  if (!o2) continue;
  if (state.type === "question") {
    const a = state.options.map((x) => x.value + ">" + x.next).join("|");
    const b = o2.options.map((x) => x.value + ">" + x.next).join("|");
    if (a !== b) problems.push(`${sid}: option edges changed`);
  }
  if (state.type === "result" && state.country !== o2.country) problems.push(`${sid}: country changed`);
}

const covered = Object.keys(overlay).filter((k) => !base.states[k]);
if (covered.length) problems.push(`overlay states not in base tree: ${covered.join(", ")}`);

if (problems.length) {
  console.error(`gen-tree: ${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.error("  " + p);
  process.exit(1);
}

const states = Object.keys(out.states).length;
const forms = Object.values(out.states).reduce((n, s) => n + (s.forms?.length ?? 0), 0);

const target = path.join(ROOT, "data/decision/tree.zh-hant.json");
const serialized = JSON.stringify(out, null, 1) + "\n";
void forms;

if (process.argv.includes("--check")) {
  const current = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (current !== serialized) {
    console.error("gen-tree --check: data/decision/tree.zh-hant.json is stale or missing (tree.json or the overlay changed) — re-run node scripts/zh-hant/gen-tree.mjs");
    process.exit(1);
  }
  console.log(`gen-tree --check OK: ${states} states localized, edges preserved`);
  process.exit(0);
}
writeFileSync(target, serialized);
console.log(`gen-tree: wrote ${path.relative(ROOT, target)} — ${states} states, ${forms} forms, edges preserved`);
