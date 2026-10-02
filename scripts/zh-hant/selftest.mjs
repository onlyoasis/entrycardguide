// Regression selftest for scripts/zh-hant/core.mjs.
// Run directly (node scripts/zh-hant/selftest.mjs); sync-zh-hant.mjs runs it
// before generating so a broken conversion can never write files.

import assert from "node:assert/strict";
import { zh2hant, convertMarkdownBody, convertFrontMatterLine, splitFrontMatter, remapAnchors, remapInternalLinks, slugifyHeading } from "./core.mjs";

const cases = [];
function test(name, fn) {
  cases.push([name, fn]);
}

test("term overrides and core conversion", () => {
  assert.equal(zh2hant("护照字段"), "護照欄位");
  assert.equal(zh2hant("官方网址"), "官方網址");
  assert.equal(zh2hant("电子邮件"), "電子郵件");
  assert.equal(zh2hant("填写表单"), "填寫表單");
  assert.equal(zh2hant("把 MRZ 填充符和护照号一起复制了"), "把 MRZ 填充符和護照號一起複製了");
  assert.equal(zh2hant("扫描二维码后提交"), "掃描 QR Code 後提交");
  assert.equal(zh2hant("（二维码）"), "（QR Code）");
  assert.equal(zh2hant("电子表"), "電子表");
  assert.equal(zh2hant("电子表单"), "電子表單");
  assert.equal(zh2hant("电子表格"), "電子表格");
  assert.equal(zh2hant("保留头发"), "保留頭髮"); // legit 髮 must survive targeted fixes
  // review-11 #1: visa context uses 簽, never 籤
  assert.equal(zh2hant("电子签和免签"), "電子簽和免簽");
  assert.equal(zh2hant("落地签、旅游签、转机签、过境签"), "落地簽、旅遊簽、轉機簽、過境簽");
  assert.equal(zh2hant("标签和抽签"), "標籤和抽籤"); // legit 籤 survives
  // review-11 #2: 几天 quantifier
  assert.equal(zh2hant("最长几天"), "最長幾天");
  // review-11 #3: audited code-span exceptions (value stays code, prose moves out)
  const body = convertMarkdownBody("经 `Lao Bao（老挝方向）` 或 `Huu Nghi（中国方向）` 口岸。");
  assert.match(body, /`Lao Bao`（寮國方向）/);
  assert.match(body, /`Huu Nghi`（中國方向）/);
  assert.doesNotMatch(body, /`Lao Bao（/);
});

test("nested list indentation and line structure preserved", () => {
  const src = "1. 步骤一\n   - 子步骤甲：扫描二维码\n   - 子步骤乙：三个空格缩进\n2. 步骤二\n\n段落  保留双空格";
  const out = convertMarkdownBody(src);
  assert.match(out, /^   - 子步驟甲：掃描 QR Code$/m);
  assert.match(out, /^   - 子步驟乙/m);
  assert.match(out, /^2\. 步驟二/m);
  assert.match(out, /^1\. 步驟一/m);
  assert.match(out, /段落  保留雙空格/);
});

test("CJK-bearing URLs and HTML attrs untouched", () => {
  const src = "[官网](https://example.com/官网?q=填写) 和 <a href=\"/zh/tdac/#什么是\">x</a> 与 ![图](/img/截图.png)";
  const out = convertMarkdownBody(src);
  assert.match(out, /https:\/\/example\.com\/官网\?q=填写/);
  assert.match(out, /href="\/zh\/tdac\/#什么是"/);
  assert.match(out, /\/img\/截图\.png/);
  assert.match(out, /\[官網\]/);
});

test("code fences, inline code, shortcode params protected", () => {
  const src = "正文字段\n\n```text\n字段 example=A1234567\n```\n\n用 `tdac.immigration.go.th` 填写。{{< validator country=\"thailand\" >}}";
  const out = convertMarkdownBody(src);
  assert.match(out, /```text\n字段 example=A1234567\n```/);
  assert.match(out, /`tdac\.immigration\.go\.th`/);
  assert.match(out, /\{\{< validator country="thailand" >\}\}/);
  assert.match(out, /正文欄位/);
  assert.match(out, /填寫。/);
});

test("front matter: prose converted, machine keys untouched", () => {
  const fm = [
    'title: "泰国 TDAC 指南"',
    "lastmod: 2026-09-14",
    'country: "thailand"',
    "weight: 10",
    "aliases: [/zh/tdac/]",
    'keywords: ["泰国入境卡", "TDAC"]',
    "faq:",
    '  - q: "要收费吗？"',
    '    a: "不收。"',
  ].join("\n");
  const out = fm.split("\n").map((l) => convertFrontMatterLine(l)).join("\n");
  assert.match(out, /title: "泰國 TDAC 指南"/);
  assert.match(out, /lastmod: 2026-09-14/);
  assert.match(out, /country: "thailand"/);
  assert.match(out, /weight: 10/);
  assert.match(out, /aliases: \[\/zh\/tdac\/\]/);
  assert.match(out, /keywords: \["泰國入境卡", "TDAC"\]/);
  assert.match(out, /- q: "要收費嗎\？"|q: "要收費嗎\?"/);
});

test("front matter: block scalars and Han continuations rejected", () => {
  assert.throws(() => convertFrontMatterLine("description: |"));
  assert.throws(() => convertFrontMatterLine("  这是缩进续行"), /unsupported front matter/);
});

test("anchor remap follows converted headings", () => {
  const src = "## 什么是 TDAC\n\n见[下文](#什么是-tdac)。\n\n## 费用\n";
  const { fm, body } = splitFrontMatter("---\ntitle: x\n---\n" + src);
  assert.equal(fm, "title: x");
  const out = convertMarkdownBody(body);
  const { text, unresolved } = remapAnchors(body, out);
  assert.deepEqual(unresolved, []);
  assert.match(text, /\]\(#什麼是-tdac\)/);
});

test("internal link language mapping", () => {
  const routes = new Set(["/", "/thailand/", "/thailand/tdac/", "/decide/", "/official-links/"]);
  const body = [
    "[](https://entrycardguide.com/zh/thailand/tdac/)",
    "[](/zh/decide/)",
    "[](/thailand/tdac/)",
    "[](/)",
    "[](https://github.com/onlyoasis/entrycardguide)",
    "[](/og/default.png)",
  ].join("\n");
  const { text, problems } = remapInternalLinks(body, routes);
  assert.deepEqual(problems, []);
  assert.match(text, /https:\/\/entrycardguide\.com\/zh-hant\/thailand\/tdac\//);
  assert.match(text, /\]\(\/zh-hant\/decide\/\)/);
  assert.match(text, /\]\(\/zh-hant\/thailand\/tdac\/\)/);
  assert.match(text, /\]\(\/zh-hant\/\)/);
  assert.match(text, /https:\/\/github\.com\/onlyoasis\/entrycardguide/);
  assert.match(text, /\]\(\/og\/default\.png\)/);
});

test("internal link with CJK fragment converts slug", () => {
  const routes = new Set(["/thailand/tdac/"]);
  const { text, problems } = remapInternalLinks("[](/thailand/tdac/#什么是-tdac)", routes);
  assert.deepEqual(problems, []);
  assert.match(text, /\]\(\/zh-hant\/thailand\/tdac\/#什麼是-tdac\)/);
});

test("unresolvable route fails loudly", () => {
  const { problems } = remapInternalLinks("[](/zh/nope/)", new Set());
  assert.equal(problems.length, 1);
});

test("slugify matches hugo github style", () => {
  assert.equal(slugifyHeading("什么是 TDAC？"), "什么是-tdac");
  assert.equal(slugifyHeading("Path 1: Verify the URL"), "path-1-verify-the-url");
});

export function runSelftest() {
  test("CRLF source file converts and normalizes (thailand/tdac.zh.md form)", () => {
  const crlf =
    "---\r\ntitle: \"泰国 TDAC 入境卡 2026 完整指南\"\r\nlastmod: 2026-09-14\r\ncountry: \"thailand\"\r\n---\r\n\r\n官方网址字段填写指南。\r\n\r\n- 列表一：扫描二维码\r\n";
  // same pre-normalisation sync-zh-hant.mjs applies before splitting
  const { fm, body } = splitFrontMatter(crlf.replace(/\r\n/g, "\n"));
  const fmOut = fm.split("\n").map((l) => convertFrontMatterLine(l)).join("\n");
  const bodyOut = convertMarkdownBody(body);
  assert.match(fmOut, /title: "泰國 TDAC 入境卡 2026 完整指南"/);
  assert.match(fmOut, /lastmod: 2026-09-14/);
  assert.equal(bodyOut.includes("\r"), false);
  assert.match(bodyOut, /^- 列表一：掃描 QR Code$/m);
});

test("reference definition keeps its label", () => {
  const src = "[gov]: https://example.com/官网\n正文引用 [gov] 链接。";
  const out = convertMarkdownBody(src);
  assert.match(out, /\[gov\]: ?https:\/\/example\.com\/官网/);
  assert.match(out, /正文引用 \[gov\] 連結。|正文引用 \[gov\] 連接。/);
});


test("review-13: visa compounds and quantifier coverage", () => {
  assert.equal(zh2hant("拒签、普通签、多次签、单次签"), "拒簽、普通簽、多次簽、單次簽");
  assert.equal(zh2hant("领馆签、商务签、居民签、贴签、签证"), "領館簽、商務簽、居民簽、貼簽、簽證");
  assert.equal(zh2hant("茶几上的标签"), "茶几上的標籤");
});

test("review-13: fenced annotation is byte-identical", () => {
  const src = "```text\n## 示例\n[A journey](/zh/thailand/tdac/) `Lao Bao（老挝方向）` href=\"/zh/decide/\"\n```\n正文。";
  const out = convertMarkdownBody(src);
  const fence = out.slice(out.indexOf("```text"), out.indexOf("```", out.indexOf("```text") + 6) + 3);
  assert.match(fence, /`Lao Bao（老挝方向）`/);
  assert.match(fence, /\]\(\/zh\/thailand\/tdac\/\)/);
  assert.match(fence, /href="\/zh\/decide\/"/);
  assert.match(out, /^正文。$/m);
});

test("review-13: full chain leaves fenced href untouched", () => {
  const routes = new Set(["/", "/thailand/tdac/", "/decide/"]);
  const src = '```html\n<a href="/zh/thailand/tdac/">x</a>\n```\n\n[链接](/zh/thailand/tdac/)。';
  const body = convertMarkdownBody(src);
  const { text, problems } = remapInternalLinks(body, routes);
  assert.deepEqual(problems, []);
  const fence = text.slice(text.indexOf("```html"), text.indexOf("```", text.indexOf("```html") + 6) + 3);
  assert.match(fence, /href="\/zh\/thailand\/tdac\/"/);
  assert.match(text, /\[\S+\]\(\/zh-hant\/thailand\/tdac\/\)/);
});

test("MCP account link uses Traditional UI without changing unrelated queries", () => {
  const { text, problems } = remapInternalLinks("[account](/api/mcp/account?lang=zh) [other](/api/mcp/account?lang=en)", new Set());
  assert.deepEqual(problems, []);
  assert.equal(text, "[account](/api/mcp/account?lang=zh-hant) [other](/api/mcp/account?lang=en)");
});

test("review-13: query strings preserved on rewritten links", () => {
  const routes = new Set(["/decide/", "/thailand/tdac/"]);
  const { text, problems } = remapInternalLinks("[](/zh/decide/?utm=x&y=1) [](/thailand/tdac/?a=1)", routes);
  assert.deepEqual(problems, []);
  assert.match(text, /\]\(\/zh-hant\/decide\/\?utm=x&y=1\)/);
  assert.match(text, /\]\(\/zh-hant\/thailand\/tdac\/\?a=1\)/);
});

test("review-13: reference-style internal destination mapped, blank lines kept", () => {
  const routes = new Set(["/thailand/tdac/", "/official-links/"]);
  const src = convertMarkdownBody("正文 [ref][1]。\n\n[1]: /zh/thailand/tdac/\n\n下一段。\n\n[ext]: https://example.com/zh/x\n");
  const { text, problems } = remapInternalLinks(src, routes);
  assert.deepEqual(problems, []);
  assert.match(text, /\[1\]: \/zh-hant\/thailand\/tdac\//);
  assert.match(text, /\[ext\]: https:\/\/example\.com\/zh\/x/);
  assert.match(text, /\n\n下一段。/);
});


test("source-link: text attribute converts, site/track/syntax untouched", () => {
  const src = '{{< source-link site="uk.application_help" text="英国内政部 App 指南" >}} 和 {{< source-link site="singapore.sgac_enhanced" track="official" text="增强版" >}}';
  const out = convertMarkdownBody(src);
  assert.match(out, /site="uk\.application_help"/);
  assert.match(out, /site="singapore\.sgac_enhanced"/);
  assert.match(out, /track="official"/);
  assert.match(out, /text="英國內政部 App 指南"/);
  assert.match(out, /text="增強版"/);
  assert.match(out, /\{\{< source-link /);
});

test("source-link without text stays byte-identical; fenced shortcode untouched", () => {
  const src = '正文。\n\n```html\n{{< source-link site="uk.application_help" text="英国内政部 App 指南" >}}\n```\n\n{{< source-link site="dominican.service_requirements" >}}';
  const out = convertMarkdownBody(src);
  const fence = out.slice(out.indexOf('```html'), out.indexOf('```', out.indexOf('```html') + 6) + 3);
  assert.match(fence, /text="英国内政部 App 指南"/, 'fenced shortcode must stay verbatim');
  assert.match(out, /\{\{< source-link site="dominican\.service_requirements" >\}\}/);
});

let failed = 0;
  for (const [name, fn] of cases) {
    try {
      fn();
      console.log(`ok - ${name}`);
    } catch (e) {
      failed++;
      console.error(`FAIL - ${name}\n    ${e.message}`);
    }
  }
  if (failed) {
    console.error(`${failed} selftest(s) failed`);
    process.exit(1);
  }
  console.log(`selftest OK: ${cases.length} cases`);
}

if (import.meta.url === `file://${process.argv[1]}`) runSelftest();
