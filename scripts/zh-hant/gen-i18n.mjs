// Generate i18n/zh-hant.yaml from i18n/zh.yaml (repeatable).
// Keys and comments are preserved byte-for-byte; only quoted/plaintext values
// containing Han text are converted via scripts/zh-hant/core.mjs. Hand
// refinements are made by editing this pipeline's PRE/POST term table, never
// by editing the generated file in place.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { convertFrontMatterLine } from "./core.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const src = path.join(ROOT, "i18n/zh.yaml");
const out = path.join(ROOT, "i18n/zh-hant.yaml");

// Explicit zh-hant overrides for keys whose zh source value is English (kept
// English on /zh/ by baseline) or needs a hand-verified sentence. Applied on
// every regeneration — never hand-edit the generated file.
const OVERRIDES = {
  tb_full: '獨立營運 <span class="dot">·</span> 與任何政府無關 <span class="dot">·</span> 我們不收費 <span class="dot">·</span> 我們不儲存你的資料',
  tb_short: '獨立營運 <span class="dot">·</span> 免費 <span class="dot">·</span> 不儲存資料',
  label_also_on: "另見",
  aria_breadcrumb: "目前位置",
  aria_trust: "關於本站",
};

function yamlQuote(v) {
  return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

const converted = readFileSync(src, "utf8")
  .split("\n")
  .map((line) => {
    if (/^\s*#/.test(line)) return line;
    const key = line.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (key && OVERRIDES[key[1]] !== undefined) return `${key[1]}: ${yamlQuote(OVERRIDES[key[1]])}`;
    return convertFrontMatterLine(line);
  })
  .join("\n");

const HEADER = `# 繁體中文 UI 字串。由 scripts/zh-hant/gen-i18n.mjs 從 zh.yaml 產生。\n# 術語覆寫統一在 scripts/zh-hant/core.mjs 與本檔 OVERRIDES；不要直接改本檔（重跑會覆蓋）。\n\n`;
const expected = HEADER + converted;

if (process.argv.includes("--check")) {
  const current = readFileSync(out, "utf8");
  if (current !== expected) {
    console.error("gen-i18n --check: i18n/zh-hant.yaml is stale (zh.yaml, core terms or OVERRIDES changed) — re-run `npm run sync:zh-hant` tooling: node scripts/zh-hant/gen-i18n.mjs");
    process.exit(1);
  }
  console.log("gen-i18n --check OK: zh-hant UI strings up to date");
  process.exit(0);
}

writeFileSync(out, expected);
console.log(`gen-i18n: wrote ${out} (${Object.keys(OVERRIDES).length} overrides)`);

