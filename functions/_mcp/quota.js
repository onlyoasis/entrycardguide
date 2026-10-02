// A successful read is returned only after this single conditional INSERT
// consumes quota. Concurrent requests cannot pass a separate COUNT gate.
export const PLANS = Object.freeze({
  free: { monthlyCalls: 100 },
  pro: { monthlyCalls: 10000 },
  enterprise: { monthlyCalls: null },
});

export function planLimit(env, plan) {
  if (!Object.hasOwn(PLANS, plan)) throw new Error("Unknown MCP plan");
  if (plan === "free" && env.MCP_FREE_MONTHLY_CALLS !== undefined) {
    const value = String(env.MCP_FREE_MONTHLY_CALLS);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
      throw new Error("Invalid MCP quota configuration");
    }
    return Number(value);
  }
  return PLANS[plan].monthlyCalls;
}

export function currentPeriod(now = new Date()) {
  return now.toISOString().slice(0, 7);
}

export async function consumeCall(env, user, tool) {
  const now = Date.now();
  const period = currentPeriod(new Date(now));
  const limit = planLimit(env, user.plan);
  const active = `SELECT 1 FROM mcp_users u JOIN mcp_grants g ON g.user_id = u.id
    WHERE u.id = ? AND u.plan = ? AND u.revoked = 0 AND u.verified_at IS NOT NULL
      AND g.id = ? AND g.scope = 'mcp:read' AND g.revoked_at IS NULL AND g.expires_at > ?`;
  const result = await env.DB.prepare(`INSERT INTO mcp_usage (user_id, period, tool, created_at)
    SELECT ?, ?, ?, ? WHERE EXISTS (${active})
      AND (? IS NULL OR (SELECT COUNT(*) FROM mcp_usage WHERE user_id = ? AND period = ?) < ?)`)
    .bind(user.id, period, tool, now, user.id, user.plan, user.grant_id, now, limit, user.id, period, limit)
    .run();
  if (!result.success || !Number.isInteger(result.meta?.changes)) throw new Error("MCP metering failed");
  if (result.meta.changes === 1) return { allowed: true, period, limit };
  // Distinguish a grant revoked while the request was in flight from an
  // exhausted quota. Neither condition can return the computed tool data.
  const validGrant = await env.DB.prepare(active).bind(user.id, user.plan, user.grant_id, now).first();
  if (!validGrant) return { allowed: false, unauthorized: true };
  const used = await env.DB.prepare("SELECT COUNT(*) AS n FROM mcp_usage WHERE user_id = ? AND period = ?")
    .bind(user.id, period).first();
  return { allowed: false, period, limit, used: used?.n ?? 0 };
}
