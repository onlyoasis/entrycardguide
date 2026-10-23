import test from "node:test";
import assert from "node:assert/strict";
import {
  BROWSER_ONLY,
  bodyKind,
  decodeBytes,
  decodeEntities,
  htmlToText,
  isFound,
  matchQuote,
  normalize,
  sniffCharset,
} from "../scripts/helpers/entry-quotes.mjs";

test("normalize folds width, curly quotes, dashes, spaces and case", () => {
  assert.equal(normalize("  Passport VALID “for” six month’s – ＡＢＣ\n\t"), "passport valid \"for\" six month's - abc");
});

test("normalize drops soft hyphens, zero-width spaces and BOMs", () => {
  assert.equal(normalize("﻿pass­port​ valid"), "passport valid");
});

test("decodeEntities handles named, decimal and hex references", () => {
  assert.equal(decodeEntities("A&amp;B &lt;6&gt; months&rsquo; &#8220;x&#x201D; caf&eacute;&nbsp;"), "A&B <6> months’ “x” café ");
  assert.equal(decodeEntities("&unknown; &#0;"), "&unknown; &#0;");
});

test("htmlToText removes scripts, styles, comments and tags", () => {
  const text = htmlToText(
    '<style>p{color:red}</style><script>var q="valid for 6 months";</script><!-- note --><p>Valid for <b>6</b>&nbsp;months</p><li>Two pages</li>',
  );
  assert.ok(!text.includes("color"));
  assert.ok(!text.includes("var q"));
  assert.ok(!text.includes("note"));
  assert.equal(normalize(text), "valid for 6 months two pages");
});

test("matchQuote finds a quote split across tags and lines", () => {
  const page = htmlToText("<p>Passports must be valid for\n at least <strong>six months</strong> on arrival.</p>");
  assert.deepEqual(matchQuote("Passports must be valid for at least six months on arrival.", page), { status: "exact", ratio: 1 });
});

test("matchQuote falls back to a punctuation-free match", () => {
  const result = matchQuote("valid for 6 months, from the date of entry.", "Valid for 6 months from the date of entry; and");
  assert.equal(result.status, "exact-ignoring-punct");
  assert.ok(isFound(result.status));
});

test("matchQuote matches CJK quotes after normalization", () => {
  assert.equal(matchQuote("护照有效期须在6个月以上。", "入境时，护照有效期须在６个月以上。其余").status, "exact");
});

test("matchQuote grades a reworded quote by how much is still there", () => {
  const page = "Your passport must be valid for at least six months beyond the date you plan to leave the country.";
  assert.deepEqual(
    matchQuote("Your passport must be valid for at least six months beyond the date you plan to depart the country.", page),
    { status: "near", ratio: 0.81 },
  );
  assert.deepEqual(
    matchQuote("Your passport must be valid for at least three months beyond the date you plan to depart the country.", page),
    { status: "partial", ratio: 0.56 },
  );
  assert.equal(matchQuote("A return ticket is required.", page).status, "missing");
  assert.equal(matchQuote("", page).status, "no-quote");
  assert.ok(!isFound("near"));
});

test("matchQuote word grams do not match inside longer words", () => {
  assert.equal(matchQuote("six month stay allowed here", "sixty months stayed allowed here").status, "missing");
});

test("bodyKind keeps JavaScript raw and sends PDFs to pdftotext", () => {
  assert.equal(bodyKind("https://x.gov/a.pdf", "application/octet-stream", "%PDF-"), "pdf");
  assert.equal(bodyKind("https://x.gov/doc", "application/pdf", "xxxxx"), "pdf");
  assert.equal(bodyKind("https://x.gov/app.js?v=3", "text/plain", "var a"), "raw");
  assert.equal(bodyKind("https://x.gov/static/main.js", "application/octet-stream", "(()=>"), "raw");
  assert.equal(bodyKind("https://x.gov/x", "application/javascript; charset=utf-8", "!func"), "raw");
  assert.equal(bodyKind("https://x.gov/apply.jsp?locale=en", "text/html", "<html"), "html");
});

test("sniffCharset prefers the header, then the meta tag", () => {
  const bytes = Buffer.from('<meta charset="windows-1252"><p>caf\xe9</p>', "latin1");
  assert.equal(sniffCharset(bytes, "text/html; charset=ISO-8859-1"), "ISO-8859-1");
  assert.equal(sniffCharset(bytes, "text/html"), "windows-1252");
  assert.ok(decodeBytes(bytes, sniffCharset(bytes, "text/html")).includes("café"));
  assert.equal(decodeBytes(Buffer.from("ok"), "no-such-charset"), "ok");
});

test("browser-only list holds the 18 sources read by hand", () => {
  assert.equal(BROWSER_ONLY.size, 18);
  for (const url of BROWSER_ONLY) assert.match(url, /^https:\/\//);
});
