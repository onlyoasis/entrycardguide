// Read usage for the same active Bearer grant used by /api/mcp.
import { authenticate } from "../../_mcp/auth.js";
import { countUsage, usageByTool } from "../../_mcp/db.js";
import { currentPeriod, planLimit } from "../../_mcp/quota.js";

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: {
    "Content-Type": "application/json", "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff", ...extraHeaders,
  } });
}

export async function onRequestGet({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin !== null && origin !== new URL(request.url).origin) return json({ error: "forbidden_origin" }, 403);
  if (!env.DB) return json({ error: "mcp_not_configured" }, 503);
  try {
    const user = await authenticate(env, request);
    if (!user) return json({ error: "unauthorized", message: "An active MCP Bearer authorization is required." }, 401,
      { "WWW-Authenticate": 'Bearer realm="entrycardguide-mcp"' });
    const period = currentPeriod();
    const limit = planLimit(env, user.plan);
    const [used, byTool] = await Promise.all([
      countUsage(env.DB, user.id, period), usageByTool(env.DB, user.id, period),
    ]);
    return json({
      email: user.email, keyPrefix: user.key_prefix, plan: user.plan,
      authorization: { id: user.grant_id, scope: user.scope, expiresAt: user.expires_at },
      quota: { period, used, limit, remaining: limit === null ? null : Math.max(0, limit - used) },
      usedByTool: byTool, createdAt: user.created_at,
    });
  } catch {
    return json({ error: "mcp_temporarily_unavailable" }, 503);
  }
}
