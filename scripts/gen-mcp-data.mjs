#!/usr/bin/env node
// Regenerates functions/_mcp/snapshot.js — the single data bundle the MCP
// server serves. Sources (same ones the HTML pages read at build time):
//   · layouts/partials/country-roster.html   → country order
//   · data/official_urls/{country}.toml      → official URLs, agencies, meta
//   · data/rules/{country}.json              → field validation rules
//   · data/fields/{country}.toml             → field-by-field filling guides
//   · data/changelog/{country}.toml          → per-country change log
//   · data/decision/tree.json                → /decide/ state machine
//
// Deliberately EXCLUDED from the snapshot (kept internal since 2026-08-10):
// scam_sites, outcomes, news, primary_middleman / page_question / page_answer.
// The MCP server publishes official URLs and field rules, not middleman names.
//
//   node scripts/gen-mcp-data.mjs          → write functions/_mcp/snapshot.js
//   node scripts/gen-mcp-data.mjs --check  → exit 1 on drift (CI gate)
//
// No timestamp is embedded on purpose: a date-only stamp would make --check
// drift at midnight. Freshness comes from the real last_verified dates inside
// the data itself.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import TOML from "@iarna/toml";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "functions/_mcp/snapshot.js");
const CHECK = process.argv.includes("--check");

function readJson(rel) {
  return JSON.parse(readFileSync(path.join(ROOT, rel), "utf8"));
}

function readToml(rel) {
  return TOML.parse(readFileSync(path.join(ROOT, rel), "utf8"));
}

// Ordered country slugs from the roster partial (traffic order). The regex is
// intentionally dumb: each roster line starts with (dict "key" "<slug>".
function rosterOrder() {
  const html = readFileSync(
    path.join(ROOT, "layouts/partials/country-roster.html"),
    "utf8",
  );
  const slugs = [...html.matchAll(/\(dict\s+"key"\s+"([a-z0-9-]+)"/g)].map((m) => m[1]);
  if (slugs.length < 30) {
    throw new Error(`Roster parse found only ${slugs.length} countries — partial format changed?`);
  }
  return slugs;
}

function isPlainObject(value) {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

// [news] is a plain object too, so both exclusions are by name. Arrays
// (scam_sites, outcomes) are dropped by the isPlainObject check.
const NON_FORM_BLOCKS = new Set(["meta", "news"]);
const NON_PUBLIC_META_KEYS = /^(primary_middleman|page_question|page_answer)/;

function pickForm(entry) {
  const form = {
    key: null,
    name: entry.name ?? null,
    url: entry.url ?? null,
    agency: entry.agency ?? null,
    lastVerified: entry.last_verified ?? null,
  };
  if (entry.archive_url) form.archiveUrl = entry.archive_url;
  if (entry.notes) form.notes = entry.notes;
  return form;
}

function latestVerified(forms) {
  const dates = forms.map((f) => f.lastVerified).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}

function buildCountry(slug) {
  const official = readToml(`data/official_urls/${slug}.toml`);
  const meta = official.meta;
  if (!isPlainObject(meta)) {
    throw new Error(`${slug}: data/official_urls/${slug}.toml has no [meta] block`);
  }

  const forms = Object.entries(official)
    .filter(([key, value]) => !NON_FORM_BLOCKS.has(key) && isPlainObject(value))
    .map(([key, value]) => ({ ...pickForm(value), key }));

  const cleanMeta = Object.fromEntries(
    Object.entries(meta).filter(([key]) => !NON_PUBLIC_META_KEYS.test(key)),
  );

  return {
    slug,
    names: {
      en: cleanMeta.name_en,
      zh: cleanMeta.name_zh,
      "zh-hant": cleanMeta.name_zh_hant,
    },
    flag: cleanMeta.flag ?? null,
    formCode: cleanMeta.form_code ?? null,
    formKey: cleanMeta.form_key ?? null,
    guideSlug: cleanMeta.guide_slug ?? null,
    formType: cleanMeta.form_type ?? null,
    fee: {
      en: cleanMeta.fee_en ?? null,
      zh: cleanMeta.fee_zh ?? null,
      "zh-hant": cleanMeta.fee_zh_hant ?? null,
    },
    fieldCount: cleanMeta.field_count ?? null,
    sections: cleanMeta.sections ?? null,
    timeNeeded: {
      en: cleanMeta.time_needed_en ?? null,
      zh: cleanMeta.time_needed_zh ?? null,
      "zh-hant": cleanMeta.time_needed_zh_hant ?? null,
    },
    forms,
    lastVerified: latestVerified(forms),
  };
}

const countries = rosterOrder().map(buildCountry);

const snapshot = {
  site: {
    origin: "https://entrycardguide.com",
    mcpEndpoint: "https://entrycardguide.com/api/mcp",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0",
    repo: "https://github.com/onlyoasis/entrycardguide",
  },
  countries,
  rules: Object.fromEntries(
    countries.map((c) => [c.slug, readJson(`data/rules/${c.slug}.json`)]),
  ),
  fieldGuides: Object.fromEntries(
    countries.map((c) => [c.slug, readToml(`data/fields/${c.slug}.toml`).fields ?? []]),
  ),
  changelogs: Object.fromEntries(
    countries.map((c) => [c.slug, readToml(`data/changelog/${c.slug}.toml`).entries ?? []]),
  ),
  decisionTree: readJson("data/decision/tree.json"),
};

const header = `// GENERATED by scripts/gen-mcp-data.mjs — do not edit.
// Sources: data/official_urls/*.toml, data/rules/*.json, data/fields/*.toml,
// data/changelog/*.toml, data/decision/tree.json, country-roster order.
// Regenerate: npm run gen:mcp     CI freshness gate: npm run check:mcp
// Excludes scam_sites / outcomes / news / middleman copy (internal since 2026-08-10).
export default `;

const output = header + JSON.stringify(snapshot, null, 2) + ";\n";

if (CHECK) {
  const current = readFileSync(OUT, "utf8");
  if (current !== output) {
    console.error(
      "functions/_mcp/snapshot.js is stale. Run: npm run gen:mcp\n" +
        "(data/ or the roster changed since the snapshot was generated)",
    );
    process.exit(1);
  }
  console.log(`MCP snapshot fresh: ${countries.length} countries`);
} else {
  writeFileSync(OUT, output);
  console.log(`Wrote functions/_mcp/snapshot.js (${countries.length} countries)`);
}
