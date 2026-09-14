// Upsert Traditional display siblings (`*_zh_hant`) next to every Simplified
// display field (`*_zh`) in data/fields/*.toml, data/official_urls/*.toml and
// data/changelog/*.toml.
//
//   node scripts/zh-hant/gen-data-toml.mjs [--check]
//   (DATA_ROOT env overrides the data dir — test hook for isolated fixtures)
//
// Semantics (review-03 #2, review-04 #1–5, review-05 #1–6):
// - machine data (urls, dates, regexes, weights) is never touched; only keys
//   ending exactly `_zh` get a `_zh_hant` sibling in the SAME table scope;
// - every derived value is refreshed from its current `_zh` source — ASCII and
//   empty sources derive their own value, so stale copies cannot survive;
// - an orphan `_zh_hant` whose `_zh` source disappeared is deleted in write
//   mode and reported by --check; non-derived siblings of that record
//   (dates, [[entries]] markers…) are preserved;
// - sibling lookup is by table scope, never by adjacency — comments between
//   source and sibling cannot create duplicate keys;
// - scalar lexing accepts escaped quotes; token values are decoded by the
//   installed TOML library (single decoding authority), serialized values are
//   escaped per TOML basic-string rules;
// - writes happen ONLY after every candidate text parses and passes the
//   full-parse derived-coverage walk in memory — no half-updated state;
// - --check reports ALL missing/stale/orphan findings together; unsupported
//   syntax (multiline strings, non-string `_zh`) is a fatal early exit;
// - in-sync input is left byte-identical (mtime untouched).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import TOML from "@iarna/toml";
import { zh2hant } from "./core.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DATA_ROOT = process.env.DATA_ROOT ? path.resolve(process.env.DATA_ROOT) : path.join(ROOT, "data");
const CHECK = process.argv.includes("--check");

const SUBDIRS = ["fields", "official_urls", "changelog"];
const fatal = []; // unsupported syntax — early exit, both modes
const problems = []; // missing/stale/orphan coverage findings — reported together
let parsed = 0, inserted = 0, updated = 0, removed = 0, unchanged = 0;

// ---- scalar lexing: token regex allows escaped quotes; decode via TOML lib ----
const VALUE_SRC = String.raw`(?:"(?:[^"\n]|\\.)*"|'[^'\n]*')`;
const SOURCE_RE = new RegExp(`^(\\s*)([A-Za-z0-9_]+)_zh(\\s*=\\s*)(${VALUE_SRC})(\\s*(?:#.*)?)$`);
const SIBLING_RE = new RegExp(`^(\\s*)([A-Za-z0-9_]+)_zh_hant(\\s*=\\s*)(${VALUE_SRC})(\\s*(?:#.*)?)$`);
const BARE_ZH_RE = /^(\s*)([A-Za-z0-9_]+)_zh(\s*=\s*)(\S.*)$/;
const TABLE_RE = /^\s*\[\[?[^\]]*\]\]?\s*(?:#.*)?$/;

function decodeScalar(token) {
  if (/^"""|^'''/.test(token)) throw new Error("multiline TOML string unsupported");
  try {
    const parsed = TOML.parse(`v = ${token}`);
    return parsed.v;
  } catch (e) {
    throw new Error(`invalid TOML scalar: ${e.message}`);
  }
}

function serialize(s) {
  let out = "";
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (ch === "\\") out += "\\\\";
    else if (ch === '"') out += '\\"';
    else if (code < 0x20 || code === 0x7f) {
      const named = { 8: "\\b", 9: "\\t", 10: "\\n", 12: "\\f", 13: "\\r" }[code];
      out += named || "\\u" + code.toString(16).padStart(4, "0");
    } else out += ch;
  }
  return `"${out}"`;
}

function planFile(file) {
  const rel = path.relative(ROOT, file);
  const lines = readFileSync(file, "utf8").split("\n");
  const sources = new Map(); // "scope:key" -> record
  const hants = new Map();
  let scope = 0;

  lines.forEach((line, i) => {
    if (TABLE_RE.test(line)) {
      scope++;
      return;
    }
    const bare = line.match(BARE_ZH_RE);
    if (bare && !SOURCE_RE.test(line) && !SIBLING_RE.test(line)) {
      const why = /^("""|''')/.test(bare[4]) ? "multiline TOML string unsupported" : `unsupported value form (${bare[4].slice(0, 24)})`;
      fatal.push(`${rel}:${i + 1}: ${bare[2]}_zh — ${why}`);
      return;
    }
    let m = line.match(SOURCE_RE);
    if (m) {
      sources.set(`${scope}:${m[2]}`, { key: m[2], index: i, indent: m[1], sep: m[3], token: m[4], rel });
      parsed++;
      return;
    }
    m = line.match(SIBLING_RE);
    if (m) hants.set(`${scope}:${m[2]}`, { key: m[2], index: i, indent: m[1], sep: m[3], token: m[4], comment: m[5] || "" });
  });

  // edits/inserts/deletes all carry ORIGINAL line indices; applyFile rebuilds
  // the text in one pass so a delete above can never shift an insert below.
  const deletes = new Set();
  const edits = new Map(); // index -> replacement line
  const inserts = []; // {after, line}

  for (const [sk, src] of sources) {
    let expected;
    try {
      expected = zh2hant(decodeScalar(src.token));
    } catch (e) {
      fatal.push(`${src.rel}:${src.index + 1}: ${src.key}_zh — ${e.message}`);
      continue;
    }
    const hant = hants.get(sk);
    if (!hant) {
      inserts.push({ after: src.index, line: `${src.indent}${src.key}_zh_hant${src.sep}${serialize(expected)}` });
      inserted++;
      continue;
    }
    let current;
    try {
      current = decodeScalar(hant.token);
    } catch (e) {
      fatal.push(`${src.rel}:${hant.index + 1}: ${src.key}_zh_hant — ${e.message}`);
      continue;
    }
    if (current !== expected) {
      edits.set(hant.index, `${hant.indent}${src.key}_zh_hant${hant.sep}${serialize(expected)}${hant.comment}`);
      updated++;
    } else {
      unchanged++;
    }
  }

  for (const [sk, hant] of hants) {
    if (!sources.has(sk)) {
      // orphan derived field: deleted in write mode, reported by --check
      if (CHECK) problems.push(`${rel}:${hant.index + 1}: orphan ${hant.key}_zh_hant (${hant.key}_zh removed)`);
      deletes.add(hant.index);
      removed++;
    }
  }

  return { rel, lines, deletes, edits, inserts };
}

// Rebuild one file's text from original line numbers in a single pass.
function applyPlan(plan) {
  const { lines, deletes, edits, inserts } = plan;
  const byAfter = new Map(inserts.map((ins) => [ins.after, ins.line]));
  const out = [];
  lines.forEach((line, i) => {
    if (deletes.has(i)) return;
    out.push(edits.get(i) ?? line);
    if (byAfter.has(i)) out.push(byAfter.get(i));
  });
  // inserts targeting past-the-end (source on the last line)
  const tail = byAfter.get(lines.length - 1);
  if (tail !== undefined && !deletes.has(lines.length - 1)) {
    /* already handled above when the last line is kept */
  }
  return out.join("\n");
}

// ---- coverage walk on a fully parsed tree (review-05 #1: sibling of `k`
// that ends in `_zh` is `k + "_hant"`) ----
function walkCoverage(node, rel, where) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walkCoverage(v, rel, `${where}[${i}]`));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k.endsWith("_zh") && !k.endsWith("_hant")) {
        if (typeof v !== "string") {
          fatal.push(`${rel}: ${where}.${k} is not a string — unsupported`);
          continue;
        }
        const sib = node[`${k}_hant`];
        if (typeof sib !== "string" || sib !== zh2hant(v)) {
          problems.push(`${rel}: ${where}.${k}_hant missing or stale`);
        }
      }
      if (v && typeof v === "object") walkCoverage(v, rel, where ? `${where}.${k}` : k);
    }
  }
}

function discoverFiles() {
  const files = [];
  for (const sub of SUBDIRS) {
    const dir = path.join(DATA_ROOT, sub);
    let names;
    try {
      names = readdirSync(dir);
    } catch {
      fatal.push(`data dir missing: ${path.relative(ROOT, dir)}`);
      continue;
    }
    for (const name of names.filter((n) => n.endsWith(".toml"))) files.push(path.join(dir, name));
  }
  return files.sort();
}

function fail(label) {
  console.error(`gen-data-toml: ${label} (${problems.length + fatal.length} total):`);
  for (const p of [...fatal, ...problems].slice(0, 40)) console.error("  " + p);
  process.exit(1);
}

const files = discoverFiles();
const mtimeBefore = new Map(files.map((f) => [f, statSync(f).mtimeMs]));
const plans = new Map();
for (const file of files) plans.set(file, planFile(file));
if (fatal.length) fail("unsupported input — nothing written");

if (!CHECK) {
  // Verify EVERY file before touching the disk: dirty files use their
  // candidate text, untouched files their original text — a broken file with
  // no derived-field changes must still abort the whole run (review-06).
  const texts = new Map(); // file -> final text
  const dirty = new Set();
  for (const [file, plan] of plans) {
    const isDirty = plan.deletes.size || plan.edits.size || plan.inserts.length;
    if (isDirty) {
      dirty.add(file);
      texts.set(file, applyPlan(plan));
    } else {
      texts.set(file, plan.lines.join("\n"));
    }
  }
  for (const [file, text] of texts) {
    let tree;
    try {
      tree = TOML.parse(text); // legality gate before any write
    } catch (e) {
      fatal.push(`${path.relative(ROOT, file)}: ${dirty.has(file) ? "candidate" : "current"} text failed TOML parse: ${e.message}`);
      continue;
    }
    walkCoverage(tree, path.relative(ROOT, file), "");
  }
  if (fatal.length || problems.length) fail("verification failed — nothing written");
  for (const file of dirty) writeFileSync(file, texts.get(file));
} else {
  // --check: verify current on-disk state; report ALL findings together
  for (const file of files) {
    let tree;
    try {
      tree = TOML.parse(readFileSync(file, "utf8"));
    } catch (e) {
      fatal.push(`${path.relative(ROOT, file)}: TOML parse failed: ${e.message}`);
      continue;
    }
    walkCoverage(tree, path.relative(ROOT, file), "");
  }
  if (problems.length || fatal.length) fail("coverage gate failed");
}

const touched = [...plans.values()].filter((p) => p.deletes.size || p.edits.size || p.inserts.length).length;

if (CHECK) {
  console.log(`gen-data-toml --check OK: ${parsed} display fields across ${files.length} TOML files fully derived`);
  process.exit(0);
}

if (!touched) {
  console.log(`gen-data-toml: ${parsed} display fields across ${files.length} files — nothing to do (mtime untouched)`);
  for (const [file, before] of mtimeBefore) {
    if (statSync(file).mtimeMs !== before) throw new Error(`mtime changed without write: ${file}`);
  }
  process.exit(0);
}

console.log(
  `gen-data-toml: ${parsed} display fields across ${files.length} files (${touched} changed) — ` +
    `${inserted} inserted, ${updated} refreshed, ${removed} orphans removed, ${unchanged} unchanged`,
);
