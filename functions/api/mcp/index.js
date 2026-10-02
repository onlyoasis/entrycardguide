// Stateless MCP Streamable HTTP endpoint. Only an explicit active Bearer
// grant authenticates here; a logged-in browser cookie never grants MCP use.
import { authenticate } from "../../_mcp/auth.js";
import { handleRpc, SUPPORTED_PROTOCOL_VERSIONS } from "../../_mcp/protocol.js";

const MAX_BODY_BYTES = 16 * 1024;
const RESPONSE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
};

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...RESPONSE_HEADERS, ...extraHeaders } });
}

function originAllowed(request) {
  const origin = request.headers.get("Origin");
  // Native MCP clients do not send Origin. Browser clients must be same origin.
  return origin === null || origin === new URL(request.url).origin;
}

function transportError(request) {
  if (!originAllowed(request)) return json({ error: "forbidden_origin" }, 403);
  const parts = (request.headers.get("Content-Type") || "").toLowerCase().split(";").map((part) => part.trim());
  if (parts[0] !== "application/json" || parts.slice(1).some((part) => part.startsWith("charset=") && part !== "charset=utf-8")) {
    return json({ error: "unsupported_media_type", message: "Use application/json encoded as UTF-8." }, 415);
  }
  const accepted = (request.headers.get("Accept") || "").toLowerCase().split(",").filter((item) => {
    const q = item.split(";").map((part) => part.trim()).find((part) => part.startsWith("q="));
    return q === undefined || Number(q.slice(2)) > 0;
  }).map((item) => item.split(";")[0].trim());
  if (!accepted.includes("application/json") || !accepted.includes("text/event-stream")) {
    return json({ error: "not_acceptable", message: "Accept must include application/json and text/event-stream." }, 406);
  }
  const version = request.headers.get("MCP-Protocol-Version");
  if (version !== null && !SUPPORTED_PROTOCOL_VERSIONS.includes(version)) {
    return json({ error: "unsupported_protocol_version" }, 400);
  }
  const length = request.headers.get("Content-Length");
  if (length !== null && (!/^\d+$/.test(length) || !Number.isSafeInteger(Number(length)))) {
    return json({ error: "invalid_content_length" }, 400);
  }
  if (length !== null && Number(length) > MAX_BODY_BYTES) return json({ error: "request_too_large" }, 413);
  return null;
}

async function readMessage(request) {
  if (!request.body) throw new Error("invalid_json");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("request_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new Error("invalid_json");
  }
}

export async function onRequestPost({ request, env }) {
  const invalidTransport = transportError(request);
  if (invalidTransport) return invalidTransport;
  if (!env.DB) return json({ error: "mcp_not_configured" }, 503);
  try {
    const user = await authenticate(env, request);
    if (!user) return json({
      error: "unauthorized",
      message: "Register and sign in at /mcp/, authorize MCP access, then use the issued Bearer key.",
    }, 401, { "WWW-Authenticate": 'Bearer realm="entrycardguide-mcp"' });
    let message;
    try {
      message = await readMessage(request);
    } catch (error) {
      const tooLarge = error.message === "request_too_large";
      return json({ error: tooLarge ? "request_too_large" : "invalid_json" }, tooLarge ? 413 : 400);
    }
    return await handleRpc(env, user, message);
  } catch {
    return json({ error: "mcp_temporarily_unavailable" }, 503);
  }
}

function methodNotAllowed(context) {
  if (context?.request && !originAllowed(context.request)) return json({ error: "forbidden_origin" }, 403);
  return json({ error: "method_not_allowed", message: "This stateless MCP server accepts POST only." }, 405, { Allow: "POST" });
}
export const onRequestGet = methodNotAllowed;
export const onRequestDelete = methodNotAllowed;
export const onRequestOptions = methodNotAllowed;
export const onRequestPut = methodNotAllowed;
export const onRequestPatch = methodNotAllowed;
