/**
 * Photo tool on /photo-requirements/ ({{< photo-tool >}}).
 *
 * - ZERO network requests and no analytics. The photo is decoded with
 *   createImageBitmap, drawn on canvases and encoded with canvas.toBlob in
 *   this tab; the download is a blob: URL made here. Canvas previews also
 *   keep the page inside its img-src CSP.
 * - Presets come from data/photo_specs through the shortcode's JSON. Sizing,
 *   the file-size search, checks, JPEG density and the PDF wrapper live in
 *   ./lib/photo-fit.ts (tested in tests/photo-fit.test.mjs).
 * - It crops, resizes, turns by 90° and re-encodes. It never changes colour,
 *   background or the face: several governments refuse edited photos.
 */

import {
  checkOutput,
  cropRatio,
  densityFor,
  fitBytes,
  formatBytes,
  jpegToPdf,
  outputFormat,
  planSize,
  setJpegDensity,
  type Check,
  type PhotoPreset,
} from './lib/photo-fit';

interface Preset extends PhotoPreset {
  id: string;
  group: string;
  label: string;
  kind: 'face' | 'passport';
  size: string;
  file: string;
  format: string;
  note: string;
  faceMin?: number;
  faceMax?: number;
}

interface Payload {
  t: Record<string, string>;
  p: Preset[];
}

const INK = '#1A1A1A';
const PAPER = '#FAFAF7';
const VERIFIED = '#0F7356';
const MARK = 'rgba(245, 230, 168, 0.55)';
const MAX_W = 420;
const MAX_H = 520;

function fill(template: string, value: string): string {
  return template.replace('%s', value);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function toBlob(canvas: HTMLCanvasElement, q: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))), 'image/jpeg', q);
  });
}

/** Map rotated-image coordinates onto the original bitmap. */
function applyRotation(ctx: CanvasRenderingContext2D, rot: number, bw: number, bh: number) {
  if (rot === 90) {
    ctx.translate(bh, 0);
    ctx.rotate(Math.PI / 2);
  } else if (rot === 180) {
    ctx.translate(bw, bh);
    ctx.rotate(Math.PI);
  } else if (rot === 270) {
    ctx.translate(0, bw);
    ctx.rotate(-Math.PI / 2);
  }
}

function wire(root: HTMLElement) {
  const section = root.closest<HTMLElement>('.photo-tool');
  const data = section?.querySelector<HTMLScriptElement>('script[data-photo-tool-data]');
  const select = root.querySelector<HTMLSelectElement>('[data-photo-preset]');
  const specBox = root.querySelector<HTMLElement>('[data-photo-spec]');
  const fileInput = root.querySelector<HTMLInputElement>('[data-photo-file]');
  const stage = root.querySelector<HTMLElement>('[data-photo-stage]');
  const canvas = root.querySelector<HTMLCanvasElement>('[data-photo-canvas]');
  const zoomInput = root.querySelector<HTMLInputElement>('[data-photo-zoom]');
  const rotateBtn = root.querySelector<HTMLButtonElement>('[data-photo-rotate]');
  const makeBtn = root.querySelector<HTMLButtonElement>('[data-photo-make]');
  const result = root.querySelector<HTMLElement>('[data-photo-result]');
  const preview = root.querySelector<HTMLCanvasElement>('[data-photo-preview]');
  const checksList = root.querySelector<HTMLElement>('[data-photo-checks]');
  const resultNote = root.querySelector<HTMLElement>('[data-photo-note]');
  const download = root.querySelector<HTMLAnchorElement>('[data-photo-download]');
  const status = root.querySelector<HTMLElement>('[data-photo-status]');
  if (!section || !data?.textContent || !select || !specBox || !fileInput || !stage || !canvas || !zoomInput || !rotateBtn || !makeBtn || !result || !preview || !checksList || !resultNote || !download || !status) return;

  let payload: Payload;
  try {
    payload = JSON.parse(data.textContent) as Payload;
  } catch (e) {
    console.warn('photo-tool: data JSON parse failed', e);
    return;
  }
  const t = payload.t;
  const presets = new Map(payload.p.map((p) => [p.id, p]));
  const makeLabel = makeBtn.textContent ?? '';

  let preset: Preset | null = null;
  let bitmap: ImageBitmap | null = null;
  let rot = 0;
  let zoom = 1;
  let cx = 0;
  let cy = 0;
  let cssW = 0;
  let cssH = 0;
  let downloadUrl = '';

  const setStatus = (text: string) => {
    status.textContent = text;
  };

  const rotated = () => {
    if (!bitmap) return { w: 0, h: 0 };
    return rot % 180 === 0 ? { w: bitmap.width, h: bitmap.height } : { w: bitmap.height, h: bitmap.width };
  };

  const scale = () => {
    const r = rotated();
    return Math.max(cssW / r.w, cssH / r.h) * zoom;
  };

  /** The crop frame in rotated-image pixels. */
  const frame = () => {
    const s = scale();
    return { fw: cssW / s, fh: cssH / s };
  };

  const clampCenter = () => {
    const r = rotated();
    const { fw, fh } = frame();
    cx = Math.min(Math.max(cx, fw / 2), r.w - fw / 2);
    cy = Math.min(Math.max(cy, fh / 2), r.h - fh / 2);
  };

  const layout = () => {
    if (!bitmap) return;
    const r = rotated();
    const aspect = (preset && cropRatio(preset)) ?? r.w / r.h;
    const room = Math.min(MAX_W, stage.clientWidth || MAX_W);
    cssW = room;
    cssH = room / aspect;
    if (cssH > MAX_H) {
      cssH = MAX_H;
      cssW = MAX_H * aspect;
    }
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  };

  const drawGuides = (ctx: CanvasRenderingContext2D) => {
    if (!preset || preset.kind !== 'face') return;
    ctx.save();
    ctx.strokeStyle = VERIFIED;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cssW / 2, 0);
    ctx.lineTo(cssW / 2, cssH);
    ctx.stroke();
    if (preset.faceMin && preset.faceMax) {
      const top = ((1 - preset.faceMax / 100) / 2) * cssH;
      const chinA = top + (preset.faceMin / 100) * cssH;
      const chinB = top + (preset.faceMax / 100) * cssH;
      ctx.fillStyle = MARK;
      ctx.fillRect(0, chinA, cssW, chinB - chinA);
      ctx.beginPath();
      ctx.moveTo(0, top);
      ctx.lineTo(cssW, top);
      ctx.moveTo(0, chinA);
      ctx.lineTo(cssW, chinA);
      ctx.moveTo(0, chinB);
      ctx.lineTo(cssW, chinB);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '11px "Geist Mono", ui-monospace, monospace';
      const label = (text: string, y: number) => {
        const w = ctx.measureText(text).width + 8;
        ctx.fillStyle = PAPER;
        ctx.fillRect(4, y - 14, w, 14);
        ctx.fillStyle = INK;
        ctx.fillText(text, 8, y - 3);
      };
      label(t.guide_top, top);
      label(t.guide_chin, chinB);
    }
    ctx.restore();
  };

  const draw = () => {
    if (!bitmap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const s = scale();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.save();
    ctx.imageSmoothingQuality = 'high';
    ctx.translate(cssW / 2, cssH / 2);
    ctx.scale(s, s);
    ctx.translate(-cx, -cy);
    applyRotation(ctx, rot, bitmap.width, bitmap.height);
    ctx.drawImage(bitmap, 0, 0);
    ctx.restore();
    drawGuides(ctx);
  };

  const resetView = () => {
    if (!bitmap) return;
    zoom = 1;
    zoomInput.value = '1';
    layout();
    const r = rotated();
    cx = r.w / 2;
    cy = r.h / 2;
    clampCenter();
    draw();
  };

  const clearResult = () => {
    result.hidden = true;
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = '';
    download.href = '#photo-tool';
  };

  const showSpec = () => {
    specBox.replaceChildren();
    if (!preset) {
      specBox.hidden = true;
      return;
    }
    const facts = el('dl', undefined, 'photo-facts');
    for (const [label, value] of [
      [t.size, preset.size],
      [t.file, preset.file],
      [t.format, preset.format],
    ]) {
      const row = el('div');
      row.append(el('dt', label), el('dd', value));
      facts.append(row);
    }
    specBox.append(facts);
    if (preset.note) specBox.append(el('p', preset.note, 'm-0 mt-2'));
    const extra: string[] = [];
    if (preset.outW && preset.outH) extra.push(fill(t.output, `${preset.outW} × ${preset.outH} px`));
    if (!preset.kbMin && !preset.kbMax) extra.push(t.no_limit);
    if (extra.length) specBox.append(el('p', extra.join(' '), 'text-xs text-muted m-0 mt-2'));
    specBox.hidden = false;
  };

  const choose = (id: string) => {
    preset = presets.get(id) ?? null;
    select.value = preset ? preset.id : '';
    fileInput.disabled = !preset;
    showSpec();
    clearResult();
    setStatus('');
    if (bitmap) resetView();
  };

  select.addEventListener('change', () => choose(select.value));

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    clearResult();
    setStatus('');
    try {
      const next = await createImageBitmap(file, { imageOrientation: 'from-image' });
      bitmap?.close();
      bitmap = next;
      rot = 0;
      stage.hidden = false;
      resetView();
    } catch {
      setStatus(t.err_read);
    }
  });

  zoomInput.addEventListener('input', () => {
    zoom = Number(zoomInput.value) || 1;
    clampCenter();
    draw();
  });

  rotateBtn.addEventListener('click', () => {
    rot = (rot + 90) % 360;
    clearResult();
    resetView();
  });

  // Drag to move the photo inside the frame.
  let drag: { x: number; y: number } | null = null;
  canvas.addEventListener('pointerdown', (event) => {
    if (!bitmap) return;
    drag = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const s = scale();
    cx -= (event.clientX - drag.x) / s;
    cy -= (event.clientY - drag.y) / s;
    drag = { x: event.clientX, y: event.clientY };
    clampCenter();
    draw();
  });
  const endDrag = () => {
    drag = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  canvas.addEventListener('keydown', (event) => {
    if (!bitmap) return;
    const step = 10 / scale();
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    if (moves[event.key]) {
      cx += moves[event.key][0];
      cy += moves[event.key][1];
    } else if (event.key === '+' || event.key === '=') {
      zoom = Math.min(4, zoom + 0.1);
    } else if (event.key === '-' || event.key === '_') {
      zoom = Math.max(1, zoom - 0.1);
    } else return;
    event.preventDefault();
    zoomInput.value = String(zoom);
    clampCenter();
    draw();
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!bitmap || stage.hidden) return;
      layout();
      clampCenter();
      draw();
    }, 150);
  });

  /** Draw the current crop at w × h on a fresh white canvas. */
  const render = (w: number, h: number): HTMLCanvasElement => {
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');
    if (!ctx || !bitmap) return out;
    const { fw, fh } = frame();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.translate(w / 2, h / 2);
    ctx.scale(w / fw, h / fh);
    ctx.translate(-cx, -cy);
    applyRotation(ctx, rot, bitmap.width, bitmap.height);
    ctx.drawImage(bitmap, 0, 0);
    return out;
  };

  const checkLine = (text: string, checks: Check[]) => {
    const li = el('li');
    if (checks.length) {
      const ok = checks.every((c) => c.ok);
      li.className = ok ? 'text-verified' : 'text-scam';
      li.append(el('span', ok ? '✓ ' : '✗ ', 'font-mono'));
      li.setAttribute('aria-label', `${text}: ${ok ? t.pass : t.fail}`);
    } else {
      li.append(el('span', '· ', 'font-mono text-muted'));
    }
    li.append(document.createTextNode(text));
    return li;
  };

  makeBtn.addEventListener('click', async () => {
    if (!bitmap || !preset) return;
    const p = preset;
    makeBtn.disabled = true;
    makeBtn.textContent = t.working;
    setStatus('');
    try {
      const format = outputFormat(p);
      const { fw, fh } = frame();
      const start = planSize(p, fw, fh);
      // Keep only the latest size's canvas: large outputs are tens of MB each.
      const held = { key: '', canvas: null as HTMLCanvasElement | null };
      const canvasAt = (w: number, h: number): HTMLCanvasElement => {
        const key = `${w}x${h}`;
        if (held.key !== key || !held.canvas) {
          held.key = key;
          held.canvas = render(w, h);
        }
        return held.canvas;
      };
      const encode = async (w: number, h: number, q: number): Promise<Blob> => {
        const jpeg = new Uint8Array(await (await toBlob(canvasAt(w, h), q)).arrayBuffer());
        const dense = setJpegDensity(jpeg, densityFor(w, p.mmW));
        return format === 'pdf'
          ? new Blob([jpegToPdf(dense, w, h)], { type: 'application/pdf' })
          : new Blob([dense], { type: 'image/jpeg' });
      };
      const fit = await fitBytes(encode, p, start);
      const { w, h } = fit.size;

      // Preview: the finished pixels, scaled to fit the column.
      const finished = canvasAt(w, h);
      const pw = Math.min(240, w);
      preview.width = pw;
      preview.height = Math.round((pw * h) / w);
      const pctx = preview.getContext('2d');
      pctx?.drawImage(finished, 0, 0, preview.width, preview.height);

      const checks = checkOutput(p, { w, h, bytes: fit.out.size, format });
      const pick = (...keys: Check['key'][]) => checks.filter((c) => keys.includes(c.key));
      checksList.replaceChildren(
        checkLine(fill(t.check_pixels, `${w} × ${h} px`), pick('pixels', 'ratio')),
        checkLine(fill(t.check_bytes, formatBytes(fit.out.size)), pick('bytes')),
        checkLine(fill(t.check_format, format.toUpperCase()), pick('format')),
      );

      const notes: string[] = [];
      if (format === 'pdf') notes.push(t.pdf_note);
      if (w > fw * 1.01) notes.push(t.upscaled);
      resultNote.textContent = notes.join(' ');
      resultNote.hidden = notes.length === 0;

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = URL.createObjectURL(fit.out);
      const name = `${p.id}-${w}x${h}.${format}`;
      download.href = downloadUrl;
      download.download = name;
      download.textContent = fill(t.download, name);
      result.hidden = false;
      if (!fit.ok) setStatus(fit.reason === 'too_small' ? t.err_small : t.err_big);
    } catch (e) {
      console.warn('photo-tool: encode failed', e);
      setStatus(t.err_read);
    } finally {
      makeBtn.disabled = false;
      makeBtn.textContent = makeLabel;
    }
  });

  // Table buttons and #photo-{id} links pick a preset.
  document.querySelectorAll<HTMLButtonElement>('[data-photo-use]').forEach((button) => {
    if (!presets.has(button.dataset.photoUse ?? '')) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      choose(button.dataset.photoUse ?? '');
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      select.focus({ preventScroll: true });
    });
  });
  const fromHash = decodeURIComponent(window.location.hash.replace(/^#photo-/, ''));
  if (presets.has(fromHash)) choose(fromHash);

  root.hidden = false;
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-photo-tool]').forEach(wire);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
