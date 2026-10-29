// Text extraction and quote matching for scripts/check-entry-quotes.mjs.
// Same rules as the 2026-10-23 research check: NFKC, straight quotes and
// hyphens, collapsed whitespace, lower case; a punctuation-free match counts.

// Read in a browser on 2026-10-23: curl gets 403, times out, or the page is
// rendered by JavaScript. Items citing these are reported for manual review.
export const BROWSER_READ_DATE = "2026-10-23";
export const BROWSER_ONLY = new Set([
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/extend-stay/about.html",
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/eligibility.html",
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html",
  "https://consulmex.sre.gob.mx/montreal/index.php/es/extranjeros/visas/340-visas-2",
  "https://www.seattle.us.emb-japan.go.jp/itpr_en/TravelingJapanQuickFacts.html",
  "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html",
  "https://www.nl.emb-japan.go.jp/itpr_en/r_visa_necessary_yes_or_no.html",
  "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601",
  "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651",
  "https://evisa.imigrasi.go.id/front/info/evoa",
  "https://evisa.gov.ph/page/policy",
  "https://visa.visitsaudi.com/Home/TermsConditions",
  "https://www.evisa.gov.et/information/tourist",
  "https://immigration.gov.ng/wp-content/uploads/2025/10/SERVICE_LEVEL_AGREEMENT_2025_.pdf",
  "https://www.bahrain.bh/wps/portal/en/BNP/ServicesCatalogue/GSX-UI-PServiceDetails?psID=1871",
  "https://israel-entry.piba.gov.il/learn-about",
  "https://israel-entry.piba.gov.il/get-help",
  "https://eta.dha.gov.za/faq",
]);

const LATIN1 =
  "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml".split(" ");
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  lsquo: "‘", rsquo: "’", sbquo: "‚", ldquo: "“", rdquo: "”", bdquo: "„",
  ndash: "–", mdash: "—", hellip: "…", bull: "•", prime: "′", Prime: "″",
  ensp: " ", emsp: " ", thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏",
  euro: "€", trade: "™", minus: "−", OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š",
};
LATIN1.forEach((name, i) => { ENTITIES[name] = String.fromCharCode(160 + i); });

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);?/gi, (match, ref) => {
    if (ref[0] === "#") {
      const code = ref[1] === "x" || ref[1] === "X" ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return Object.hasOwn(ENTITIES, ref) ? ENTITIES[ref] : match;
  });
}

export function htmlToText(s) {
  return decodeEntities(
    s
      .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<br\s*\/?>|<\/(?:p|li|h\d|div|td|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
}

export function normalize(s) {
  return (s || "")
    .normalize("NFKC")
    .replace(/[­​﻿]/g, "")
    .replace(/[‘’‛′`]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const NON_WORD = /[^\p{L}\p{N}_]+/gu;
const CJK = /[぀-ヿ㐀-鿿가-힯]/;

// "exact" | "exact-ignoring-punct" | "near" | "partial" | "missing" | "no-quote".
// ratio is the share of the quote's word 4-grams (CJK: 6-character runs)
// still on the page, to show how far a missing quote has drifted.
export function matchQuote(quote, text) {
  const q = normalize(quote);
  const t = normalize(text);
  if (!q) return { status: "no-quote", ratio: 0 };
  if (t.includes(q)) return { status: "exact", ratio: 1 };
  const q2 = q.replace(NON_WORD, "");
  const t2 = t.replace(NON_WORD, "");
  if (q2 && t2.includes(q2)) return { status: "exact-ignoring-punct", ratio: 1 };

  const cjk = CJK.test(q);
  const n = cjk ? 6 : 4;
  const units = cjk ? [...q2] : q.match(/[\p{L}\p{N}_]+/gu) || [];
  const haystack = cjk ? t2 : ` ${(t.match(/[\p{L}\p{N}_]+/gu) || []).join(" ")} `;
  const grams = [];
  for (let i = 0; i < Math.max(1, units.length - n + 1); i++) {
    grams.push(cjk ? units.slice(i, i + n).join("") : ` ${units.slice(i, i + n).join(" ")} `);
  }
  const ratio = Math.round((grams.filter((g) => haystack.includes(g)).length / grams.length) * 100) / 100;
  return { status: ratio >= 0.8 ? "near" : ratio >= 0.4 ? "partial" : "missing", ratio };
}

export function isFound(status) {
  return status === "exact" || status === "exact-ignoring-punct";
}

// Decide how to turn a fetched body into text: PDFs go through pdftotext,
// JavaScript and JSON are compared raw (stripping tags would cut the code).
export function bodyKind(url, contentType, head) {
  if (head.startsWith("%PDF") || /pdf/i.test(contentType)) return "pdf";
  if (/javascript|ecmascript|json/i.test(contentType)) return "raw";
  if (/\.(?:m?js|json)(?:[?#]|$)/i.test(new URL(url).pathname)) return "raw";
  if (/^text\/plain/i.test(contentType)) return "raw";
  return "html";
}

export function sniffCharset(bytes, contentType) {
  const fromHeader = /charset=["']?([\w-]+)/i.exec(contentType || "");
  if (fromHeader) return fromHeader[1];
  const fromMeta = /charset=["']?([\w-]+)/i.exec(Buffer.from(bytes.subarray(0, 4000)).toString("latin1"));
  return fromMeta ? fromMeta[1] : "utf-8";
}

export function decodeBytes(bytes, charset) {
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}
