/**
 * Pure helpers for the photo tool (assets/js/photo.ts): output sizing, the
 * file-size search, conformance checks, JPEG density and a one-page PDF
 * wrapper. No DOM, no network — shared by photo.ts and the node tests in
 * tests/photo-fit.test.mjs.
 *
 * File-size limits are read conservatively because governments write "KB"
 * and "MB" loosely: an upper limit counts 1 KB as 1,000 bytes and a lower
 * limit counts 1 KB as 1,024 bytes, so the file passes either reading.
 */

export interface PhotoPreset {
  /** Crop ratio. Omitted for a free crop that keeps the photo's own shape. */
  ratioW?: number;
  ratioH?: number;
  /** Output size for a fixed ratio. */
  outW?: number;
  outH?: number;
  /** Free crop: cap on the long side of the output. */
  outLong?: number;
  pxMinW?: number;
  pxMinH?: number;
  pxMaxW?: number;
  pxMaxH?: number;
  kbMin?: number;
  kbMax?: number;
  /** Physical width in mm, used to write a matching JPEG density. */
  mmW?: number;
  /** Accepted formats as published, lower case: jpg, png, pdf. */
  formats?: string[];
}

export interface Size {
  w: number;
  h: number;
}

export interface ByteLimits {
  min: number;
  max: number;
}

const DEFAULT_LONG = 1600;
const Q_HIGH = 0.92;
const Q_LOW = 0.5;

export function byteLimits(p: PhotoPreset): ByteLimits {
  return {
    min: p.kbMin ? p.kbMin * 1024 : 0,
    max: p.kbMax ? p.kbMax * 1000 : Infinity,
  };
}

/** The file type the tool writes: PDF only when PDF is the sole format. */
export function outputFormat(p: PhotoPreset): 'jpg' | 'pdf' {
  const f = p.formats ?? [];
  return f.length > 0 && !f.includes('jpg') && f.includes('pdf') ? 'pdf' : 'jpg';
}

/** Width:height of the crop frame, or null for a free crop. */
export function cropRatio(p: PhotoPreset): number | null {
  if (p.ratioW && p.ratioH) return p.ratioW / p.ratioH;
  if (p.outW && p.outH) return p.outW / p.outH;
  return null;
}

/**
 * First output size to try for a crop of cropW × cropH source pixels.
 * Fixed ratio: the preset's output size, raised to the published minimum.
 * Free crop: the crop itself, scaled down so the long side fits outLong.
 */
export function planSize(p: PhotoPreset, cropW: number, cropH: number): Size {
  let w: number;
  let h: number;
  if (p.outW && p.outH) {
    w = p.outW;
    h = p.outH;
  } else {
    const long = p.outLong ?? DEFAULT_LONG;
    const scale = Math.min(1, long / Math.max(cropW, cropH));
    w = Math.max(1, Math.round(cropW * scale));
    h = Math.max(1, Math.round(cropH * scale));
  }
  const up = Math.max(1, (p.pxMinW ?? 0) / w, (p.pxMinH ?? 0) / h);
  const down = Math.min(1, (p.pxMaxW ?? Infinity) / w, (p.pxMaxH ?? Infinity) / h);
  const k = up > 1 ? up : down;
  return { w: Math.round(w * k), h: Math.round(h * k) };
}

export interface FitResult<T> {
  ok: boolean;
  /** too_big: still over the limit at the smallest allowed size and lowest
   *  quality. too_small: still under the minimum at the largest allowed size. */
  reason?: 'too_big' | 'too_small';
  out: T;
  size: Size;
  quality: number;
}

/**
 * Find an encoding inside the byte limits. Keeps the size and lowers JPEG
 * quality first; only then shrinks (down to the published minimum pixels) or
 * grows (up to the published maximum pixels). `encode` returns anything with
 * a byte `size`, such as a Blob.
 */
export async function fitBytes<T extends { size: number }>(
  encode: (w: number, h: number, q: number) => Promise<T>,
  p: PhotoPreset,
  start: Size,
): Promise<FitResult<T>> {
  const { min, max } = byteLimits(p);
  const ratio = start.w / start.h;
  const minW = Math.max(p.pxMinW ?? 1, (p.pxMinH ?? 1) * ratio);
  const maxW = Math.min(p.pxMaxW ?? Infinity, (p.pxMaxH ?? Infinity) * ratio);
  const sized = (w: number): Size => ({ w: Math.round(w), h: Math.round(w / ratio) });

  let size = start;
  let last: FitResult<T> | null = null;
  for (let step = 0; step < 12; step++) {
    const high = await encode(size.w, size.h, Q_HIGH);
    if (high.size >= min && high.size <= max) return { ok: true, out: high, size, quality: Q_HIGH };

    if (high.size > max) {
      const low = await encode(size.w, size.h, Q_LOW);
      if (low.size <= max) {
        // Highest quality that fits: binary search between Q_LOW and Q_HIGH.
        let lo = Q_LOW;
        let hi = Q_HIGH;
        let best = low;
        let bestQ = Q_LOW;
        for (let i = 0; i < 6; i++) {
          const mid = (lo + hi) / 2;
          const t = await encode(size.w, size.h, mid);
          if (t.size <= max) {
            best = t;
            bestQ = mid;
            lo = mid;
          } else hi = mid;
        }
        if (best.size >= min) return { ok: true, out: best, size, quality: bestQ };
        return { ok: false, reason: 'too_small', out: best, size, quality: bestQ };
      }
      last = { ok: false, reason: 'too_big', out: low, size, quality: Q_LOW };
      // Bytes scale roughly with pixel count: jump close to the target width.
      const next = size.w * Math.max(0.5, Math.min(0.9, Math.sqrt(max / low.size) * 0.95));
      if (next < minW) return last;
      size = sized(next);
      continue;
    }

    // Under the minimum: try top quality, then grow towards the maximum size.
    const top = await encode(size.w, size.h, 1);
    if (top.size >= min && top.size <= max) return { ok: true, out: top, size, quality: 1 };
    last = { ok: false, reason: 'too_small', out: top, size, quality: 1 };
    if (top.size > max) {
      // The window sits between Q_HIGH and 1: search it.
      let lo = Q_HIGH;
      let hi = 1;
      for (let i = 0; i < 6; i++) {
        const mid = (lo + hi) / 2;
        const t = await encode(size.w, size.h, mid);
        if (t.size < min) lo = mid;
        else if (t.size > max) hi = mid;
        else return { ok: true, out: t, size, quality: mid };
      }
      return last;
    }
    const next = Math.min(size.w * 1.25, maxW);
    if (next <= size.w) return last;
    size = sized(next);
  }
  return last as FitResult<T>;
}

export interface Check {
  key: 'format' | 'pixels' | 'ratio' | 'bytes';
  ok: boolean;
}

/** Compare a finished file with the preset's published rules. */
export function checkOutput(p: PhotoPreset, out: { w: number; h: number; bytes: number; format: string }): Check[] {
  const checks: Check[] = [];
  if (p.formats && p.formats.length) checks.push({ key: 'format', ok: p.formats.includes(out.format) });
  if (p.pxMinW || p.pxMinH || p.pxMaxW || p.pxMaxH) {
    checks.push({
      key: 'pixels',
      ok:
        out.w >= (p.pxMinW ?? 0) &&
        out.h >= (p.pxMinH ?? 0) &&
        out.w <= (p.pxMaxW ?? Infinity) &&
        out.h <= (p.pxMaxH ?? Infinity),
    });
  }
  if (p.ratioW && p.ratioH) {
    const want = p.ratioW / p.ratioH;
    checks.push({ key: 'ratio', ok: Math.abs(out.w / out.h - want) / want < 0.01 });
  }
  if (p.kbMin || p.kbMax) {
    const { min, max } = byteLimits(p);
    checks.push({ key: 'bytes', ok: out.bytes >= min && out.bytes <= max });
  }
  return checks;
}

/** Pixels per inch that make `px` pixels print `mm` millimetres wide. */
export function densityFor(px: number, mm: number | undefined): number {
  return mm ? Math.round((px * 25.4) / mm) : 300;
}

/**
 * Set the JFIF density (dots per inch) of a JPEG. Canvas encoders write a
 * JFIF header with no physical unit; some portals read the density to judge
 * printed size. Inserts a JFIF header when the encoder wrote none.
 */
export function setJpegDensity(jpeg: Uint8Array, dpi: number): Uint8Array {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return jpeg;
  const d = Math.max(1, Math.min(65535, Math.round(dpi)));
  const isJfif =
    jpeg[2] === 0xff && jpeg[3] === 0xe0 && jpeg[6] === 0x4a && jpeg[7] === 0x46 && jpeg[8] === 0x49 && jpeg[9] === 0x46 && jpeg[10] === 0;
  if (isJfif) {
    const out = jpeg.slice();
    out[13] = 1; // units: dots per inch
    out[14] = d >> 8;
    out[15] = d & 0xff;
    out[16] = d >> 8;
    out[17] = d & 0xff;
    return out;
  }
  const app0 = [0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, d >> 8, d & 0xff, d >> 8, d & 0xff, 0x00, 0x00];
  const out = new Uint8Array(jpeg.length + app0.length);
  out.set(jpeg.subarray(0, 2), 0);
  out.set(app0, 2);
  out.set(jpeg.subarray(2), 2 + app0.length);
  return out;
}

/**
 * Wrap a baseline JPEG in a one-page PDF (DCTDecode, no re-encoding). The
 * page is sized so the image prints at `dpi`.
 */
export function jpegToPdf(jpeg: Uint8Array, w: number, h: number, dpi = 300): Uint8Array {
  const enc = new TextEncoder();
  const pw = ((w * 72) / dpi).toFixed(2);
  const ph = ((h * 72) / dpi).toFixed(2);
  const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === 'string' ? enc.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (body: string) => {
    offsets.push(length);
    push(`${offsets.length} 0 obj\n${body}\nendobj\n`);
  };

  push('%PDF-1.4\n');
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // binary marker comment
  object('<< /Type /Catalog /Pages 2 0 R >>');
  object('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offsets.push(length);
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg);
  push('\nendstream\nendobj\n');
  object(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xref = length;
  let table = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) table += `${String(o).padStart(10, '0')} 00000 n \n`;
  push(`${table}trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

/** "2.0 MB", "512 KB", "860 bytes" — for the result line. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`;
  return `${bytes} bytes`;
}
