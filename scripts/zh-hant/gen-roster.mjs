// Upsert "zht" / "subZht" display names in layouts/partials/country-roster.html.
//
//   node scripts/zh-hant/gen-roster.mjs [--check]
//
// Per-line upsert semantics (review-03 #1):
// - every (dict …) line with a known key is checked/updated independently, so
//   one missing/mismatched zht never masks the other 49;
// - an edited subZh source propagates to subZht on the next run;
// - identical input leaves the file byte-identical (mtime untouched);
// - --check exits 1 listing every missing/stale line without writing.
// Country exonyms are hand-curated TW/HK common forms — NOT run through
// OpenCC (新西兰→紐西蘭, 澳大利亚→澳洲, 老挝→寮國 … need human choices).
import { readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { zh2hant } from "./core.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
// ROSTER_FILE is a test hook only (temp-copy demos); production always runs
// against the real roster path.
const ROSTER = process.env.ROSTER_FILE
  ? path.resolve(process.env.ROSTER_FILE)
  : path.join(ROOT, "layouts/partials/country-roster.html");
const CHECK = process.argv.includes("--check");

// key → Traditional exonym (generic TW/HK service language; no nationality
// inference — these are standard place-name exonyms only).
const ZHT = {
  indonesia: "印尼",
  malaysia: "馬來西亞",
  singapore: "新加坡",
  vietnam: "越南",
  thailand: "泰國",
  dominican: "多明尼加",
  mexico: "墨西哥",
  japan: "日本",
  india: "印度",
  korea: "韓國",
  philippines: "菲律賓",
  cambodia: "柬埔寨",
  usa: "美國",
  uk: "英國",
  canada: "加拿大",
  "new-zealand": "紐西蘭",
  australia: "澳洲",
  turkey: "土耳其",
  "sri-lanka": "斯里蘭卡",
  maldives: "馬爾地夫",
  taiwan: "台灣",
  egypt: "埃及",
  "saudi-arabia": "沙烏地阿拉伯",
  kenya: "肯亞",
  israel: "以色列",
  cuba: "古巴",
  curacao: "庫拉索",
  colombia: "哥倫比亞",
  laos: "寮國",
  azerbaijan: "亞塞拜然",
  myanmar: "緬甸",
  nepal: "尼泊爾",
  pakistan: "巴基斯坦",
  uzbekistan: "烏茲別克",
  georgia: "喬治亞",
  oman: "阿曼",
  qatar: "卡達",
  bahrain: "巴林",
  tanzania: "坦尚尼亞",
  ethiopia: "衣索比亞",
  morocco: "摩洛哥",
  jamaica: "牙買加",
  bahamas: "巴哈馬",
  aruba: "阿魯巴",
  panama: "巴拿馬",
  peru: "秘魯",
  brazil: "巴西",
  barbados: "巴貝多",
  russia: "俄羅斯",
  jordan: "約旦",
};

const mtimeBefore = statSync(ROSTER).mtimeMs;
const raw = readFileSync(ROSTER, "utf8");
let parsed = 0, inserted = 0, updated = 0, unchanged = 0;
const unknownKeys = new Set();
const problems = [];

const lines = raw.split("\n").map((line) => {
  if (!/^\s*\(dict /.test(line)) return line;
  const keyM = line.match(/"key"\s+"([a-z-]+)"/);
  if (!keyM) return line;
  const key = keyM[1];
  if (!(key in ZHT)) {
    unknownKeys.add(key);
    return line;
  }
  parsed++;
  const zht = ZHT[key];
  const problems0 = problems.length;

  let out = line;
  const zhtM = out.match(/"zht"\s+"([^"]*)"/);
  if (!zhtM) {
    if (CHECK) problems.push(`${key}: missing "zht"`);
    out = out.replace(/("zh"\s+"[^"]+")/, `$1 "zht" "${zht}"`);
    inserted++;
  } else if (zhtM[1] !== zht) {
    if (CHECK) problems.push(`${key}: stale "zht" ${zhtM[1]} (expected ${zht})`);
    out = out.replace(/"zht"\s+"[^"]*"/, `"zht" "${zht}"`);
    updated++;
  } else {
    unchanged++;
  }

  const subM = out.match(/"subZh"\s+"([^"]+)"/);
  if (subM) {
    const expected = zh2hant(subM[1]);
    const subZhtM = out.match(/"subZht"\s+"([^"]*)"/);
    if (!subZhtM) {
      if (CHECK) problems.push(`${key}: missing "subZht"`);
      out = out.replace(/("subZh"\s+"[^"]+")/, `$1 "subZht" "${expected}"`);
      inserted++;
    } else if (subZhtM[1] !== expected) {
      if (CHECK) problems.push(`${key}: stale "subZht" (subZh changed)`);
      out = out.replace(/"subZht"\s+"[^"]*"/, `"subZht" "${expected}"`);
      updated++;
    }
  } else {
    // roster line without subZh must not carry a stale subZht either
    if (/"subZht"/.test(out)) {
      if (CHECK) problems.push(`${key}: "subZht" without "subZh"`);
      out = out.replace(/\s*"subZht"\s+"[^"]*"/, "");
      updated++;
    }
  }
  void problems0;
  return out;
});

if (unknownKeys.size) {
  console.error(`gen-roster: roster has keys with no curated zht name: ${[...unknownKeys].join(", ")}`);
  process.exit(1);
}

const next = lines.join("\n");

if (CHECK) {
  if (problems.length) {
    console.error(`gen-roster --check: ${problems.length} problem(s)`);
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }
  console.log(`gen-roster --check OK: ${parsed} roster lines complete (${unchanged} up-to-date)`);
  process.exit(0);
}

if (next === raw) {
  console.log(`gen-roster: ${parsed} lines parsed, 0 written (byte-identical, mtime untouched)`);
  if (statSync(ROSTER).mtimeMs !== mtimeBefore) throw new Error("mtime changed without write");
  process.exit(0);
}
writeFileSync(ROSTER, next);
console.log(`gen-roster: ${parsed} lines parsed, ${inserted} inserted, ${updated} updated`);
