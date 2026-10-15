import test from "node:test";
import assert from "node:assert/strict";
import {
  byteLimits,
  checkOutput,
  cropRatio,
  densityFor,
  fitBytes,
  jpegToPdf,
  outputFormat,
  planSize,
  setJpegDensity,
} from "../assets/js/lib/photo-fit.ts";

// Stand-in for canvas.toBlob: bytes grow with pixels and quality.
// bpp(q) is bytes per pixel; a "detailed" photo compresses worse than a flat one.
const encoder = (bpp) => async (w, h, q) => ({ size: Math.round(w * h * bpp(q)), w, h, q });
const detailed = encoder((q) => 0.05 + q * 0.5);
const flat = encoder((q) => 0.02 + q * 0.09);

const vietnam = { ratioW: 40, ratioH: 60, outW: 600, outH: 900, kbMax: 2000, mmW: 40, formats: ["jpg"] };
const nzeta = { ratioW: 3, ratioH: 4, outW: 1200, outH: 1600, pxMinW: 900, pxMinH: 1200, pxMaxW: 2250, pxMaxH: 3000, kbMin: 500, kbMax: 3000, formats: ["jpg"] };

test("byteLimits reads KB conservatively in both directions", () => {
  assert.deepEqual(byteLimits({ kbMin: 10, kbMax: 1000 }), { min: 10240, max: 1_000_000 });
  assert.deepEqual(byteLimits({}), { min: 0, max: Infinity });
});

test("outputFormat writes PDF only when PDF is the sole accepted format", () => {
  assert.equal(outputFormat({ formats: ["pdf"] }), "pdf");
  assert.equal(outputFormat({ formats: ["jpg", "pdf"] }), "jpg");
  assert.equal(outputFormat({}), "jpg");
});

test("cropRatio uses the published ratio, then the output size, else free", () => {
  assert.equal(cropRatio({ ratioW: 1, ratioH: 1, outW: 600, outH: 600 }), 1);
  assert.equal(cropRatio({ outW: 900, outH: 1125 }), 0.8);
  assert.equal(cropRatio({ outLong: 1600 }), null);
});

test("planSize keeps a fixed output and raises it to the published minimum", () => {
  assert.deepEqual(planSize(vietnam, 3000, 4500), { w: 600, h: 900 });
  assert.deepEqual(planSize({ outW: 600, outH: 800, pxMinW: 900, pxMinH: 1200 }, 600, 800), { w: 900, h: 1200 });
});

test("planSize scales a free crop down to the long-side cap and never up", () => {
  assert.deepEqual(planSize({ outLong: 1600 }, 4000, 3000), { w: 1600, h: 1200 });
  assert.deepEqual(planSize({ outLong: 1600 }, 800, 600), { w: 800, h: 600 });
});

test("fitBytes accepts the first encoding when it is inside the limits", async () => {
  const r = await fitBytes(detailed, vietnam, { w: 600, h: 900 });
  assert.equal(r.ok, true);
  assert.equal(r.quality, 0.92);
  assert.deepEqual(r.size, { w: 600, h: 900 });
});

test("fitBytes lowers quality, then size, to get under a small cap", async () => {
  const china = { outLong: 1200, kbMax: 100, formats: ["jpg", "png"] };
  const r = await fitBytes(detailed, china, { w: 1200, h: 800 });
  assert.equal(r.ok, true);
  assert.ok(r.out.size <= 100_000, `got ${r.out.size}`);
  assert.ok(r.size.w < 1200, "had to shrink");
  assert.ok(Math.abs(r.size.w / r.size.h - 1.5) < 0.01, "kept the shape");
});

test("fitBytes stops at the published minimum pixels instead of breaking it", async () => {
  const r = await fitBytes(detailed, { ...vietnam, kbMax: 5, pxMinW: 600, pxMinH: 900 }, { w: 600, h: 900 });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "too_big");
  assert.deepEqual(r.size, { w: 600, h: 900 });
});

test("fitBytes grows a flat photo towards the maximum to reach a minimum size", async () => {
  const r = await fitBytes(flat, nzeta, { w: 1200, h: 1600 });
  assert.equal(r.ok, true);
  assert.ok(r.out.size >= 500 * 1024, `got ${r.out.size}`);
  assert.ok(r.size.w > 1200 && r.size.w <= 2250);
  assert.ok(r.size.h <= 3000);
});

test("fitBytes reports too_small when it cannot grow any further", async () => {
  const capped = { ...nzeta, pxMaxW: 1200, pxMaxH: 1600 };
  const r = await fitBytes(flat, capped, { w: 1200, h: 1600 });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "too_small");
});

test("checkOutput flags pixels, ratio, bytes and format against the rules", () => {
  const good = checkOutput(nzeta, { w: 1200, h: 1600, bytes: 600_000, format: "jpg" });
  assert.ok(good.every((c) => c.ok), JSON.stringify(good));
  const bad = Object.fromEntries(checkOutput(nzeta, { w: 800, h: 1000, bytes: 200_000, format: "pdf" }).map((c) => [c.key, c.ok]));
  assert.deepEqual(bad, { format: false, pixels: false, ratio: false, bytes: false });
});

test("densityFor matches printed size, defaulting to 300 dpi", () => {
  assert.equal(densityFor(472, 40), 300);
  assert.equal(densityFor(600, 40), 381);
  assert.equal(densityFor(600, undefined), 300);
});

test("setJpegDensity rewrites an existing JFIF header", () => {
  const jfif = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9]);
  const out = setJpegDensity(jfif, 381);
  assert.equal(out.length, jfif.length);
  assert.deepEqual([...out.subarray(13, 18)], [1, 1, 125, 1, 125]);
  assert.equal(jfif[13], 0, "input untouched");
});

test("setJpegDensity inserts a JFIF header when the encoder wrote none", () => {
  const exif = Uint8Array.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x04, 0x00, 0x00, 0xff, 0xd9]);
  const out = setJpegDensity(exif, 300);
  assert.equal(out.length, exif.length + 18);
  assert.equal(String.fromCharCode(...out.subarray(6, 10)), "JFIF");
  assert.deepEqual([...out.subarray(20, 22)], [0xff, 0xe1], "original segments follow");
});

test("jpegToPdf writes a one-page PDF whose xref offsets point at each object", () => {
  const jpeg = Uint8Array.from([0xff, 0xd8, 1, 2, 3, 4, 5, 0xff, 0xd9]);
  const pdf = jpegToPdf(jpeg, 1600, 1100);
  const text = Buffer.from(pdf).toString("latin1");
  assert.ok(text.startsWith("%PDF-1.4\n"));
  assert.ok(text.endsWith("%%EOF\n"));
  assert.match(text, /\/Width 1600 \/Height 1100 .*\/Filter \/DCTDecode \/Length 9 >>/);

  const startxref = Number(text.match(/startxref\n(\d+)\n/)[1]);
  assert.equal(text.slice(startxref, startxref + 4), "xref");
  const offsets = [...text.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(offsets.length, 5);
  offsets.forEach((o, i) => assert.equal(text.slice(o, o + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`));

  const start = text.indexOf("stream\n") + "stream\n".length;
  assert.deepEqual([...pdf.subarray(start, start + jpeg.length)], [...jpeg], "JPEG embedded unchanged");
});
