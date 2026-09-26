// GET /api/mcp/whoami — registered-user quota dashboard (same Bearer key as
// /api/mcp). Not metered.

import { authenticate } from "../../_mcp/auth.js";
import { countUsage, usageByTool } from "../../_mcp/db.js";
import { currentPeriod, planLimit } from "../../_mcp/quota.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "mcp_not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await authenticate(env, request);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "unauthorized", message: "Send Authorization: Bearer <your API key>." }),
      { status: 401, headers: { "Content-Type": "application/json", "WWW-Authenticate": 'Bearer realm="entrycardguide-mcp"' } },
    );
  }

  const period = currentPeriod();
  const [used, byTool] = await Promise.all([
    countUsage(env.DB, user.id, period),
    usageByTool(env.DB, user.id, period),
  ]);
  const limit = planLimit(env, user.plan);

  return new Response(
    JSON.stringify({
      email: user.email,
      keyPrefix: user.key_prefix,
      plan: user.plan,
      quota: { period, used, limit, remaining: limit === null ? null : Math.max(0, limit - used) },
      usedByTool: byTool,
      createdAt: user.created_at,
    }),
    { headers: { "Content-Type": "application/json", "X-Robots-Tag": "noindex" } },
  );
}
