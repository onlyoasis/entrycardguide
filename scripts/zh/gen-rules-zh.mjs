// Generate data/rules_i18n_zh/*.json (Simplified validator overlays) from the
// reviewed Traditional overlays in data/rules_i18n/*.json (repeatable).
// The Traditional files are the hand-reviewed source (guarded by
// scripts/zh-hant/check-translation-currency.mjs); this only converts script
// and Taiwan wording. Fix wording in POST below, never in the generated files.
//   node scripts/zh/gen-rules-zh.mjs          write
//   node scripts/zh/gen-rules-zh.mjs --check  fail if any file is stale
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import OpenCC from "opencc-js";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "data/rules_i18n");
const OUT = path.join(ROOT, "data/rules_i18n_zh");
const check = process.argv.includes("--check");
const toCn = OpenCC.Converter({ from: "twp", to: "cn" });
// Taiwan wording that opencc leaves as-is or maps to a non-mainland word.
const POST = [
  ["字元", "字符"],
  ["電子郵件", "电子邮件"],
  ["电子邮件地址", "电子邮箱地址"],
  ["拷贝", "复制"],
  ["社区媒体", "社交媒体"],
  ["住家地址", "家庭住址"],
  ["目前状况", "当前状况"],
];

function convert(value) {
  if (typeof value === "string") {
    let v = toCn(value);
    for (const [a, b] of POST) v = v.split(a).join(b);
    return v;
  }
  if (Array.isArray(value)) return value.map(convert);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convert(v)]));
  return value;
}

if (!check) mkdirSync(OUT, { recursive: true });
const stale = [];
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".json")).sort()) {
  const expected = JSON.stringify(convert(JSON.parse(readFileSync(path.join(SRC, file), "utf8"))), null, 1) + "\n";
  const target = path.join(OUT, file);
  const current = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (current === expected) continue;
  if (check) stale.push(file);
  else writeFileSync(target, expected);
}
if (check && stale.length) {
  console.error(`gen-rules-zh --check FAILED: stale or missing ${stale.join(", ")}. Run: node scripts/zh/gen-rules-zh.mjs`);
  process.exit(1);
}
console.log(check ? "gen-rules-zh --check OK: Simplified validator overlays up to date" : `gen-rules-zh: wrote ${OUT}`);
