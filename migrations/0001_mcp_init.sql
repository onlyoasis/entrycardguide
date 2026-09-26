-- MCP server tables. Apply with:
--   wrangler d1 migrations apply entrycardguide-mcp --local   (dev)
--   wrangler d1 migrations apply entrycardguide-mcp --remote  (production)

CREATE TABLE IF NOT EXISTS mcp_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  -- SHA-256 hex of the full API key. Lookup is by hash: a leaked database
  -- does not leak usable keys.
  key_hash TEXT NOT NULL UNIQUE,
  -- First 10 chars of the key, so support can identify a key without it.
  key_prefix TEXT NOT NULL,
  -- 'free' | 'pro' | 'enterprise' — see functions/_mcp/quota.js PLANS.
  plan TEXT NOT NULL DEFAULT 'free',
  created_at INTEGER NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);

-- Append-only metering log. One row per tools/call. This is the table a
-- future billing job reads: counts by (user_id, period), never rewritten.
CREATE TABLE IF NOT EXISTS mcp_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  -- UTC calendar month "YYYY-MM".
  period TEXT NOT NULL,
  tool TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mcp_usage_user_period ON mcp_usage(user_id, period);
