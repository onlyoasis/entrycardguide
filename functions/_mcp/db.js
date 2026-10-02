// D1 queries for the MCP server. Everything goes through env.DB (the `DB`
// binding declared in wrangler.toml). The unit tests swap env.DB for a
// node:sqlite adapter with the same prepare().bind().first()/all()/run()
// surface, so the SQL here is the only database contract.

export async function findUserByKeyHash(db, keyHash, now = Date.now()) {
  return db
    .prepare(
      `SELECT u.id, u.email, u.plan, u.created_at, g.key_prefix,
              g.id AS grant_id, g.scope, g.expires_at
       FROM mcp_grants g JOIN mcp_users u ON u.id = g.user_id
       WHERE g.key_hash = ? AND g.scope = 'mcp:read' AND g.revoked_at IS NULL
         AND g.expires_at > ? AND u.verified_at IS NOT NULL AND u.revoked = 0`,
    )
    .bind(keyHash, now)
    .first();
}

export async function findUserByEmail(db, email) {
  return db
    .prepare("SELECT id, email, plan, created_at, verified_at, revoked FROM mcp_users WHERE email = ?")
    .bind(email)
    .first();
}

export async function createUser(db, { id, email, createdAt }) {
  return db
    .prepare(
      `INSERT INTO mcp_users (id, email, key_hash, key_prefix, plan, created_at, revoked)
       VALUES (?, ?, ?, '', 'free', ?, 0) ON CONFLICT(email) DO NOTHING`,
    )
    .bind(id, email, `pending:${id}`, createdAt)
    .run();
}

export async function takeRateLimit(db, subject, window, limit) {
  return db.prepare(`INSERT INTO mcp_auth_limits (subject, window, hits) VALUES (?, ?, 1)
    ON CONFLICT(subject, window) DO UPDATE SET hits = hits + 1 WHERE hits < ?
    RETURNING hits`).bind(subject, window, limit).first();
}

export async function createLoginCode(db, code) {
  return db.prepare(`INSERT INTO mcp_login_codes (id, user_id, code_hash, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)`).bind(code.id, code.userId, code.hash, code.now, code.expiresAt).run();
}

export async function deliverLoginCode(db, id, now) {
  // Only a delivered, usable challenge may replace another delivered code.
  // Pending email requests stay untouched, including out-of-order delivery.
  // D1 batch is transactional.
  return db.batch([
    db.prepare(`UPDATE mcp_login_codes SET consumed_at = ? WHERE user_id =
      (SELECT user_id FROM mcp_login_codes WHERE id = ? AND consumed_at IS NULL AND expires_at > ?)
      AND id <> ? AND consumed_at IS NULL AND delivered_at IS NOT NULL`)
      .bind(now, id, now, id),
    db.prepare("UPDATE mcp_login_codes SET delivered_at = ? WHERE id = ? AND consumed_at IS NULL AND expires_at > ?")
      .bind(now, id, now),
  ]);
}

export async function discardLoginCode(db, id, now) {
  return db.prepare("UPDATE mcp_login_codes SET consumed_at = ? WHERE id = ?").bind(now, id).run();
}

export async function attemptLoginCode(db, id, now) {
  return db.prepare(`UPDATE mcp_login_codes SET attempts = attempts + 1
    WHERE id = ? AND consumed_at IS NULL AND delivered_at IS NOT NULL
      AND expires_at > ? AND attempts < 5
    RETURNING code_hash, user_id`).bind(id, now).first();
}

export async function claimLoginCode(db, id, hash, now) {
  return db.prepare(`UPDATE mcp_login_codes SET consumed_at = ?
    WHERE id = ? AND code_hash = ? AND consumed_at IS NULL AND delivered_at IS NOT NULL
      AND expires_at > ? AND attempts <= 5
    RETURNING user_id`).bind(now, id, hash, now).first();
}

export async function createSession(db, session) {
  const result = await db.batch([
    db.prepare("UPDATE mcp_users SET verified_at = COALESCE(verified_at, ?) WHERE id = ? AND revoked = 0")
      .bind(session.now, session.userId),
    db.prepare(`INSERT INTO mcp_sessions (token_hash, user_id, csrf_token, created_at, expires_at)
      SELECT ?, id, ?, ?, ? FROM mcp_users WHERE id = ? AND verified_at IS NOT NULL AND revoked = 0`)
      .bind(session.hash, session.csrf, session.now, session.expiresAt, session.userId),
  ]);
  return result[1].meta.changes === 1;
}

export async function findSession(db, hash, now) {
  return db.prepare(`SELECT u.id, u.email, u.plan, s.csrf_token, s.token_hash, s.expires_at
    FROM mcp_sessions s JOIN mcp_users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?
      AND u.verified_at IS NOT NULL AND u.revoked = 0`).bind(hash, now).first();
}

export async function revokeSession(db, hash, now) {
  return db.prepare("UPDATE mcp_sessions SET revoked_at = ? WHERE token_hash = ?")
    .bind(now, hash).run();
}

export async function createGrant(db, grant, sessionHash) {
  // Recheck the session at write time so logout and account revocation cannot
  // race the authorization check to mint a key.
  return db.prepare(`INSERT INTO mcp_grants (id, user_id, key_hash, key_prefix, scope, created_at, expires_at)
    SELECT ?, u.id, ?, ?, 'mcp:read', ?, ? FROM mcp_users u
    JOIN mcp_sessions s ON s.user_id = u.id
    WHERE u.id = ? AND u.verified_at IS NOT NULL AND u.revoked = 0
      AND s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?
      AND (SELECT COUNT(*) FROM mcp_grants WHERE user_id = u.id AND revoked_at IS NULL AND expires_at > ?) < 10`)
    .bind(grant.id, grant.hash, grant.prefix, grant.now, grant.expiresAt, grant.userId, sessionHash, grant.now, grant.now).run();
}

export async function listGrants(db, userId) {
  const { results } = await db.prepare(`SELECT id, key_prefix, scope, created_at, expires_at, revoked_at
    FROM mcp_grants WHERE user_id = ? ORDER BY created_at DESC`).bind(userId).all();
  return results;
}

export async function revokeGrant(db, userId, grantId, now) {
  return db.prepare("UPDATE mcp_grants SET revoked_at = COALESCE(revoked_at, ?) WHERE id = ? AND user_id = ?")
    .bind(now, grantId, userId).run();
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
