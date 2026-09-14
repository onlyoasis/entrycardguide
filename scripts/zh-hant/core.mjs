// Shared Simplified→Traditional (zh-Hant) conversion core.
//
// Used by scripts/sync-zh-hant.mjs (content) and the data/roster sync tools.
// Design constraints from docs/plans/2026-09-14-full-traditional-chinese.md:
// - Repeatable, one command; never hand-edit generated output in place.
// - Protect URLs, slugs, IDs, shortcode params, code, dates, numbers, examples.
//   Only visible prose is converted; machine params never pass through OpenCC.
// - Manual term overrides live here so a re-run never clobbers them.
//
// Build-side dependency only (opencc-js). Browser stays zero-npm.

import OpenCC from "opencc-js";

const converter = OpenCC.Converter({ from: "cn", to: "tw" });

// Simplified→Simplified pre-writes so OpenCC char mapping lands on the
// generic Traditional word used in TW/HK (opencc cn→tw keeps 字段/信息 as-is).
const PRE_SIMP = [
  // Visa-context words (review-11): opencc cn→tw maps 签→籤 in these
  // compounds (電子籤/免籤/落地籤/旅遊籤/轉機籤/拒籤/籤證…); the correct
  // generic Traditional is 簽. 標籤/抽籤 never enter this list and stay
  // untouched. Longer compounds first.
  [/电子签/g, "電子簽"],
  [/电子签证/g, "電子簽證"],
  [/落地签/g, "落地簽"],
  [/免签/g, "免簽"],
  [/旅游签/g, "旅遊簽"],
  [/转机签/g, "轉機簽"],
  [/过境签/g, "過境簽"],
  [/拒签/g, "拒簽"],
  [/普通签/g, "普通簽"],
  [/多次签/g, "多次簽"],
  [/单次签/g, "單次簽"],
  [/领馆签/g, "領館簽"],
  [/贴签/g, "貼簽"],
  [/商务签/g, "商務簽"],
  [/居民签/g, "居民簽"],
  [/签证/g, "簽證"],
  // 几天 slipped through opencc (几 survives as the tea-table character).
  [/几天/g, "幾天"],
  // opencc cn→tw maps these 发 to 髮 (hair) — wrong for this site's contexts.
  [/发卡行/g, "發卡行"],
  [/换发/g, "換發"],
  [/发票/g, "發票"],
  // 電子表 means "electronic form" here; protect as-is so opencc never reads
  // 表 as 錶 (watch) and no extra word is inserted (电子表单 → 電子表單).
  [/电子表/g, "電子表"],
  // Taiwan-flavoured service vocabulary (longer phrases first).
  [/移动数据/g, "行動數據"],
  [/移动端/g, "行動裝置"],
  [/官方站点/g, "官方網站"],
  [/站点/g, "網站"],
  [/存储/g, "儲存"],
  [/源码/g, "原始碼"],
  [/粘贴/g, "貼上"],
  [/运营/g, "營運"],
  [/网络/g, "網路"],
  [/数据库/g, "資料庫"],
  [/服务器/g, "伺服器"],
  [/字段/g, "栏位"], // → 欄位
  [/信息/g, "資訊"],
  [/链接/g, "連結"],
  [/登录/g, "登入"],
  [/打印/g, "列印"],
  [/笔记本/g, "筆電"],
  [/邮箱/g, "信箱"],
  [/垃圾邮件箱/g, "垃圾郵件匣"],
  [/数据/g, "資料"],
  [/在线/g, "线上"], // → 線上
];

// Post-writes on the converted Traditional text. QR Code spacing is tidied
// locally around the token only — never by a global whitespace rule, which
// would collapse Markdown list indentation.
const POST_TRAD = [
  // 二維碼 is the HK term; "QR Code" is unambiguous for TW and HK readers.
  [/二維碼/g, "QR Code"],
];

export function zh2hant(s) {
  let out = s;
  for (const [re, to] of PRE_SIMP) out = out.replace(re, to);
  out = converter(out);
  for (const [re, to] of POST_TRAD) out = out.replace(re, to);
  // Local QR Code spacing: pad against Han neighbours, drop before CJK
  // punctuation / after opening brackets. No other whitespace is modified.
  out = out
    .replace(/([\u3400-\u9fff])(QR Code)/g, "$1 $2")
    .replace(/(QR Code)([\u3400-\u9fff])/g, "$1 $2")
    .replace(/(QR Code) +(?=[，。、；：？！）」』】》%,,;])/g, "$1")
    .replace(/(?<=[（「『【《]) +(QR Code)/g, "$1");
  return out;
}

export function hasHan(s) {
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(s);
}

// ------ Markdown body conversion ------
// Protected regions are swapped for \u0000n\u0000 tokens before conversion:
// - fenced code blocks (``` ... ```)            — real form values live here
// - inline code spans (`...`)                   — commands, domains, regexes
// - markdown link destinations `](…)`           — URLs must survive verbatim
// - reference link definitions `[x]: url`
// - HTML attribute values href/src/id/srcset
// - shortcodes `{{< … >}}` / `{{% … %}}`        — machine params
// Anything ASCII passes through OpenCC unchanged anyway; stashing guarantees
// it even when the URL itself contains Han (e.g. /官网?q=填写).
// Audited inline-code exceptions (review-11 #3 / review-13): exact source
// spans in vietnam/how-to-fill that wrap an official place value TOGETHER
// with a Chinese explanation. Matched only verbatim — no pattern rewrite of
// arbitrary parenthetical text. The value stays protected code; the
// explanation moves out as already-Traditional prose. Handling happens inside
// the inline-code stashing pass, so fenced code (stashed earlier) can never
// be touched by these exceptions.
const CODE_EXPLAIN = new Map([
  ["`Lao Bao（老挝方向）`", ["`Lao Bao`", "（寮國方向）"]],
  ["`Huu Nghi（中国方向）`", ["`Huu Nghi`", "（中國方向）"]],
  ["`Moc Bai（柬埔寨方向）`", ["`Moc Bai`", "（柬埔寨方向）"]],
]);

export function convertMarkdownBody(body) {
  const vault = [];
  const stash = (text) => {
    vault.push(text);
    return `\u0000${vault.length - 1}\u0000`;
  };

  let staged = body.replace(/```[\s\S]*?(?:```|$)/g, (m) => stash(m));
  staged = staged.replace(/`[^`\n]+`/g, (span) => {
    const mapped = CODE_EXPLAIN.get(span);
    if (!mapped) return stash(span);
    return stash(mapped[0]) + mapped[1]; // code value stashed, prose rides the normal conversion
  });
  staged = staged.replace(/\]\(([^)\n]*)\)/g, (_, dest) => `](${stash(dest)})`);
  staged = staged.replace(/^(\s*\[[^\]]+\]):(\s*)(\S+)[ \t]*$/gm, (_, label, gap, dest) => `${label}:${gap}${stash(dest)}`);
  staged = staged.replace(
    /\b(href|src|srcset|id|action|poster)="([^"]*)"/gi,
    (_, attr, val) => `${attr}="${stash(val)}"`,
  );
  staged = staged.replace(/\{\{<[^\n]*?>\}\}|\{\{%[^\n]*?%\}\}/g, (m) => stash(m));

  let out = zh2hant(staged);

  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => vault[Number(i)]);
  return out;
}

// ------ Front matter conversion (line based, YAML scalar values only) ------
const FM_NEVER_CONVERT = new Set([
  "url",
  "slug",
  "alias",
  "aliases",
  "translationkey",
  "lastmod",
  "date",
  "publishdate",
  "expirydate",
  "weight",
  "country",
  "layout",
  "type",
  "draft",
  "images",
  "og_image",
]);

// `key: value`, `- q: value`, `- value`, `key: ["a", "b"]` … — convert only
// the value half, and only when it contains Han. Quotes are preserved.
// Anything else (continuation lines, block scalars) throws — silent pass-through
// would leak Simplified into the output.
export function convertFrontMatterLine(line, allowBare = false) {
  const clean = line.replace(/\r$/, ""); // tolerate CRLF sources
  const m = clean.match(/^(\s*(?:-\s+)?)([A-Za-z_][A-Za-z0-9_]*)(\s*:\s*)(.*)$/);
  if (!m) {
    const bare = clean.match(/^(\s*-\s+)(.*)$/);
    if (bare) {
      if (hasHan(bare[2])) return bare[1] + convertYamlScalar(bare[2]);
      return line;
    }
    if (hasHan(clean)) {
      if (!allowBare) {
        throw new Error(
          `unsupported front matter line (block scalar / continuation) with Han text: ${clean.trim().slice(0, 60)}`,
        );
      }
      return line;
    }
    return line;
  }
  const [, indent, key, sep, value] = m;
  if (/^([|>][+-]?\d*)\s*$/.test(value)) {
    throw new Error(`unsupported front matter block scalar on key "${key}"`);
  }
  if (FM_NEVER_CONVERT.has(key.toLowerCase()) || !hasHan(value)) return line;
  return indent + key + sep + convertYamlScalar(value);
}

function convertYamlScalar(value) {
  const sq = value.match(/^'(.*)'\s*$/);
  if (sq) return `'${zh2hant(sq[1])}'`;
  const dq = value.match(/^"(.*)"\s*$/);
  if (dq) return `"${zh2hant(dq[1])}"`;
  return zh2hant(value);
}

// Split raw file into { fm, body } on the leading --- fence. Tolerates CRLF.
export function splitFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: null, body: raw };
  return { fm: m[1], body: m[2] };
}

// ------ Heading anchor mapping ------
// Hugo (goldmark, default github auto id): lowercase, strip punctuation,
// whitespace runs → "-". Unicode letters/numbers survive.
export function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function headings(body) {
  return [...body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map((m) => m[1]);
}

// Rewrite `](#anchor)` links from source-language slugs to converted slugs.
// Same-file anchors are validated; an anchor with no counterpart heading is
// reported so the sync fails loudly instead of shipping a dead link.
// Fenced code is stashed for the duration of any rewriting pass so examples
// containing href/anchor syntax survive byte-identically (review-13).
function withFencesProtected(body, fn) {
  const vault = [];
  const stash = (m) => `\u0001F${vault.push(m) - 1}\u0001`;
  const staged = body.replace(/```[\s\S]*?(?:```|$)/g, stash);
  const text = fn(staged);
  return text.replace(/\u0001F(\d+)\u0001/g, (_, i) => vault[Number(i)]);
}

export function remapAnchors(srcBody, outBody) {
  const src = headings(srcBody).map(slugifyHeading);
  const out = headings(outBody).map(slugifyHeading);
  const map = new Map();
  src.forEach((s, i) => {
    if (out[i] && s !== out[i]) map.set(s, out[i]);
  });

  const unresolved = [];
  const text = withFencesProtected(outBody, (staged) =>
    staged.replace(/\]\(#([^)\s]+)\)/g, (whole, anchor) => {
      const mapped = map.get(anchor) || anchor;
      if (!out.includes(mapped)) unresolved.push(anchor);
      return `](#${mapped})`;
    }),
  );
  return { text, unresolved };
}

// ------ In-site link language mapping ------
// Content links must land on the same page in the target language:
//   /zh/…                 → /zh-hant/…
//   /country/… (en route) → /zh-hant/country/…
//   /                     → /zh-hant/
//   https://entrycardguide.com/… same as above for host-absolute URLs
// Fragments on same-file links are remapped via the anchor map; cross-page
// fragments are converted with the same text pipeline (headings went through
// it too). External URLs and non-content paths (static assets, /og/, …) are
// left untouched. `routes` = set of valid site content routes ("/thailand/",
// "/thailand/tdac/", "/", …).
export function remapInternalLinks(outBody, routes, convertFragments = true) {
  const problems = [];

  const rewrite = (dest) => {
    let url = dest;
    let rest = "";
    const hashIdx = dest.indexOf("#");
    if (hashIdx !== -1) {
      url = dest.slice(0, hashIdx);
      rest = dest.slice(hashIdx);
    }
    // keep any query string attached to the rewritten path (review-13)
    let query = "";
    const qIdx = url.indexOf("?");
    if (qIdx !== -1) {
      query = url.slice(qIdx);
      url = url.slice(0, qIdx);
    }
    if (!url) return { dest, ok: true }; // bare fragment — remapAnchors' job

    const hostAbsolute = url.startsWith("https://entrycardguide.com");
    let p = hostAbsolute
      ? (url.replace(/^https:\/\/entrycardguide\.com/, "") || "/")
      : url;
    if (!p.startsWith("/") || p.startsWith("//")) return { dest, ok: true }; // external/relative

    let target = p;
    let rewritten = false;
    if (target === "/zh" || target.startsWith("/zh/")) {
      target = "/zh-hant" + target.slice(3);
      rewritten = true;
    } else if (target === "/") {
      target = "/zh-hant/";
      rewritten = true;
    } else if (!target.startsWith("/zh-hant")) {
      const bare = target.endsWith("/") && target !== "/" ? target : target + "/";
      if (routes.has(bare)) {
        target = "/zh-hant" + target;
        rewritten = true;
      }
      // else: not a content route (static asset, /og/, /llms.txt) — untouched
    }

    // Validate the content part resolves to a real site route — but only when
    // we actually rewrote something; untouched paths may be static assets.
    if (rewritten) {
      const stripped =
        target === "/zh-hant" ? "/" : target.replace(/^\/zh-hant(?=\/|$)/, "").replace(/\/+$/, "");
      const routeKey = stripped === "" || stripped === "/" ? "/" : stripped + "/";
      if (!routes.has(routeKey)) {
        problems.push(dest);
        return { dest, ok: false };
      }
    }

    // Cross-page fragments: headings in the target page went through the same
    // conversion pipeline, so slugify(zh2hant(fragment)) is the best mapping.
    if (convertFragments && rest.startsWith("#") && rest.length > 1) {
      rest = "#" + slugifyHeading(zh2hant(decodeURIComponent(rest.slice(1))));
    }
    return {
      dest: (hostAbsolute ? "https://entrycardguide.com" : "") + target + query + rest,
      ok: true,
    };
  };

  // markdown inline links: [text](dest)
  let text = outBody.replace(/\]\(([^)\n]*)\)/g, (whole, dest) => {
    if (!dest || dest.startsWith("#")) return whole;
    const r = rewrite(dest);
    if (!r.ok) return whole;
    return `](${r.dest})`;
  });

  // HTML href with site-internal paths
  text = withFencesProtected(text, (staged) =>
    staged.replace(/\b(href)="(\/[^"]*)"/g, (whole, attr, dest) => {
      const r = rewrite(dest);
      if (!r.ok) return whole;
      return `${attr}="${r.dest}"`;
    }),
  );

  // reference-style destinations: [ref]: /zh/thailand/tdac/ — same language
  // mapping as inline links; blank lines around the definition survive
  // (only the destination token is touched).
  text = withFencesProtected(text, (staged) =>
    staged.replace(/^(\s*\[[^\]]+\]:)(\s*)(\S+)([ \t]*)$/gm, (whole, label, gap, dest, trail) => {
      if (!dest.startsWith("/")) return whole;
      const r = rewrite(dest);
      if (!r.ok) return whole;
      return `${label}${gap}${r.dest}${trail}`;
    }),
  );

  return { text, problems };
}
