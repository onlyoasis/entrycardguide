// D1 queries for the MCP server. Everything goes through env.DB (the `DB`
// binding declared in wrangler.toml). The unit tests swap env.DB for a
// node:sqlite adapter with the same prepare().bind().first()/all()/run()
// surface, so the SQL here is the only database contract.

export async function findUserByKeyHash(db, keyHash) {
  return db
    .prepare(
      "SELECT id, email, key_hash, key_prefix, plan, created_at, revoked FROM mcp_users WHERE key_hash = ?",
    )
    .bind(keyHash)
    .first();
}

export async function findUserByEmail(db, email) {
  return db
    .prepare("SELECT id FROM mcp_users WHERE email = ?")
    .bind(email)
    .first();
}

export async function createUser(db, { id, email, keyHash, keyPrefix, createdAt }) {
  return db
    .prepare(
      "INSERT INTO mcp_users (id, email, key_hash, key_prefix, plan, created_at, revoked) VALUES (?, ?, ?, ?, 'free', ?, 0)",
    )
    .bind(id, email, keyHash, keyPrefix, createdAt)
    .run();
}

export async function recordUsage(db, userId, period, tool) {
  return db
    .prepare("INSERT INTO mcp_usage (user_id, period, tool, created_at) VALUES (?, ?, ?, ?)")
    .bind(userId, period, tool, Date.now())
    .run();
}

export async function countUsage(db, userId, period) {
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM mcp_usage WHERE user_id = ? AND period = ?")
    .bind(userId, period)
    .first();
  return row ? row.n : 0;
}

export async function usageByTool(db, userId, period) {
  const { results } = await db
    .prepare(
      "SELECT tool, COUNT(*) AS calls FROM mcp_usage WHERE user_id = ? AND period = ? GROUP BY tool ORDER BY calls DESC",
    )
    .bind(userId, period)
    .all();
  return results;
}

export async function applyMigrations(db) {
  // Table existence doubles as a deploy diagnostic: a fresh database without
  // migrations applied fails every request with a clear error instead of a
  // bare SQLITE error further down.
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'mcp_users'")
    .first();
}
