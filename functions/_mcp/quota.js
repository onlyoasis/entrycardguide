// Per-call metering — the single choke point where usage is counted and
// enforced. This is the seam future paid tiers plug into:
//
//   · PLANS below defines call limits per plan (null = unlimited).
//   · A user's plan lives on the mcp_users.plan column (set it via SQL or a
//     future Stripe webhook handler; nothing else needs to change).
//   · mcp_usage rows are append-only (user, period, tool, timestamp) so
//     historical counts survive plan changes and can be invoiced retroactively
//     — a billing job only ever reads this table.
//   · authorizeCall() gates every tools/call before execution;
//     recordCall() books it after the tool succeeded. Tool-level validation
//     errors do not burn quota. initialize / tools/list / ping are not counted.
//
// Ops override: set the MCP_FREE_MONTHLY_CALLS Pages environment variable to
// retune the free tier without a redeploy.

export const PLANS = {
  free: { monthlyCalls: 100 },
  pro: { monthlyCalls: 10000 },
  enterprise: { monthlyCalls: null },
};

export function planLimit(env, plan) {
  if (plan === "free" && env.MCP_FREE_MONTHLY_CALLS) {
    const override = Number.parseInt(env.MCP_FREE_MONTHLY_CALLS, 10);
    if (Number.isFinite(override) && override >= 0) return override;
  }
  return (PLANS[plan] ?? PLANS.free).monthlyCalls;
}

// Billing period = UTC calendar month "YYYY-MM".
export function currentPeriod(now = new Date()) {
  return now.toISOString().slice(0, 7);
}

export async function authorizeCall(env, user) {
  const { countUsage } = await import("./db.js");
  const period = currentPeriod();
  const limit = planLimit(env, user.plan);
  const used = await countUsage(env.DB, user.id, period);
  return { allowed: limit === null || used < limit, period, used, limit };
}

// Called only after a tool call succeeded. Tool-level validation errors
// (isError results) do not burn quota — a mistyped country slug should not
// cost a user a metered call.
export async function recordCall(env, user, tool) {
  const { recordUsage } = await import("./db.js");
  await recordUsage(env.DB, user.id, currentPeriod(), tool);
}
