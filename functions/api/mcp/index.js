// POST /api/mcp — the MCP endpoint (registered API key required).
// GET/DELETE → 405: this is a stateless Streamable HTTP server; it offers no
// server-initiated SSE stream and has no sessions to tear down.

import { authenticate } from "../../_mcp/auth.js";
import { handleRpc } from "../../_mcp/protocol.js";

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function notConfigured() {
  return json(
    {
      error: "mcp_not_configured",
      message:
        "The D1 database binding is missing on this deployment. Site admins: see docs/mcp.md (wrangler.toml + wrangler d1 migrations apply).",
    },
    503,
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return notConfigured();

  const user = await authenticate(env, request);
  if (!user) {
    return json(
      {
        error: "unauthorized",
        message:
          "This MCP server is for registered users. Register at POST /api/mcp/register (see https://entrycardguide.com/mcp/), then send Authorization: Bearer <your key>.",
      },
      401,
      { "WWW-Authenticate": 'Bearer realm="entrycardguide-mcp"' },
    );
  }

  let message;
  try {
    message = await request.json();
  } catch {
    return json({ error: "invalid_json", message: "Request body must be a single JSON-RPC 2.0 message." }, 400);
  }

  return handleRpc(env, user, message);
}

export async function onRequestGet() {
  return json(
    { error: "method_not_allowed", message: "This MCP server is stateless; POST JSON-RPC messages only." },
    405,
    { Allow: "POST" },
  );
}

export async function onRequestDelete() {
  return json(
    { error: "method_not_allowed", message: "Stateless server: no sessions to delete." },
    405,
    { Allow: "POST" },
  );
}
