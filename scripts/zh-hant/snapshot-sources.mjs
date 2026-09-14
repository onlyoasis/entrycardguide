#!/usr/bin/env node
// Write the readable source-text snapshot for hand-translated displays
// (rules_i18n overlays + tree overlay). Purpose: staleness detection only —
// the snapshot is a translation-review aid, never a second rule source.
// Translators run `npm run snapshot:zh-hant` AFTER reviewing changed English
// source text; build gates never refresh it automatically.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { readdirSync } from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const sources = { rules: {}, tree: {} };

for (const f of readdirSync(path.join(ROOT, "data/rules")).filter((n) => n.endsWith(".json"))) {
  const country = f.replace(/\.json$/, "");
  const overlayPath = path.join(ROOT, `data/rules_i18n/${f}`);
  if (!existsQuiet(overlayPath)) continue; // only countries with hand overlays
  const base = JSON.parse(readFileSync(path.join(ROOT, "data/rules", f), "utf8"));
  const snap = {};
  for (const [key, rule] of Object.entries(base.fields)) {
    snap[key] = clean({
      label: rule.label,
      help: rule.help,
      placeholder: rule.placeholder,
      errors: rule.errors,
      // Constraint inputs the translated messages may reference. Review-only
      // context — never used as runtime rules.
      type: rule.type,
      required: rule.required,
      pattern: rule.pattern,
      minLength: rule.minLength,
      maxLength: rule.maxLength,
      minDate: rule.minDate,
      maxDate: rule.maxDate,
    });
  }
  sources.rules[country] = snap;
}

const tree = JSON.parse(readFileSync(path.join(ROOT, "data/decision/tree.json"), "utf8"));
for (const [sid, state] of Object.entries(tree.states)) {
  if (state.type === "question") {
    sources.tree[sid] = clean({ label: state.label, options: Object.fromEntries(state.options.map((o) => [o.value, o.label])) });
  } else {
    sources.tree[sid] = clean({
      summary: state.summary,
      note: state.note,
      fallback_label: state.fallback_label,
      fallback_warning: state.fallback_warning,
      forms: state.forms.map((f) => ({ name: f.name, fee: f.fee, agency: f.agency, deadline: f.deadline })),
    });
  }
}

function clean(o) {
  if (Array.isArray(o)) return o.map(clean);
  if (o && typeof o === "object") {
    const out = {};
    for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null) out[k] = clean(v);
    return out;
  }
  return o;
}
function existsQuiet(p) {
  try {
    readFileSync(p);
    return true;
  } catch {
    return false;
  }
}

const target = path.join(ROOT, "scripts/zh-hant/translation-sources.json");
writeFileSync(target, JSON.stringify(sources, null, 1) + "\n");
const fields = Object.values(sources.rules).reduce((n, c) => n + Object.keys(c).length, 0);
console.log(`snapshot-sources: wrote ${path.relative(ROOT, target)} — ${fields} rule fields, ${Object.keys(sources.tree).length} tree states`);
