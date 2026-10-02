// Account endpoints are same-origin browser actions. They never enable CORS.
export class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}

const HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...HEADERS, "Content-Type": "application/json", ...headers } });
}

export function html(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: { ...HEADERS, "Content-Type": "text/html; charset=utf-8", ...headers } });
}

export function redirect(url, headers = {}) {
  return new Response(null, { status: 303, headers: { ...HEADERS, Location: url, ...headers } });
}

export function escape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function locale(value) { return ["en", "zh", "zh-hant"].includes(value) ? value : "en"; }
export function wantsHtml(request) {
  return (request.headers.get("Content-Type") || "").startsWith("application/x-www-form-urlencoded");
}

export function requireSameOrigin(request) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("Origin") !== origin || request.headers.get("Sec-Fetch-Site") === "cross-site") {
    throw new HttpError(403, "origin_not_allowed");
  }
}

export async function readBody(request, fields) {
  requireSameOrigin(request);
  const type = (request.headers.get("Content-Type") || "").split(";")[0].trim();
  if (!["application/json", "application/x-www-form-urlencoded"].includes(type)) throw new HttpError(415, "unsupported_media_type");
  if (Number(request.headers.get("Content-Length")) > 4096) throw new HttpError(413, "body_too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "invalid_body");
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 4096) { await reader.cancel(); throw new HttpError(413, "body_too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let body;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (type === "application/json") {
      body = JSON.parse(text);
    } else {
      const entries = [...new URLSearchParams(text).entries()];
      if (new Set(entries.map(([key]) => key)).size !== entries.length) throw new Error("duplicate_field");
      body = Object.fromEntries(entries);
    }
  } catch { throw new HttpError(400, "invalid_body"); }
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !fields.includes(key) || !["string", "boolean"].includes(typeof body[key]))) {
    throw new HttpError(400, "invalid_body");
  }
  return body;
}

export function guarded(handler) {
  return async (context) => {
    if (!context.env.DB) return json({ error: "mcp_not_configured" }, 503);
    try { return await handler(context); }
    catch (error) {
      const known = error instanceof HttpError;
      return json({ error: known ? error.code : "account_unavailable" }, known ? error.status : 503,
        known && error.status === 429 ? { "Retry-After": "900" } : {});
    }
  };
}

export function methodNotAllowed() { return json({ error: "method_not_allowed" }, 405, { Allow: "POST" }); }
