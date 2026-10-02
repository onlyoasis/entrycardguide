-- Retire anonymous keys. Every account must prove email ownership and then
-- explicitly create a scoped grant before it can call the MCP endpoint.
ALTER TABLE mcp_users ADD COLUMN verified_at INTEGER;
UPDATE mcp_users SET key_hash = 'retired:' || id, key_prefix = '';

CREATE TABLE mcp_login_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES mcp_users(id),
  code_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  delivered_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at INTEGER
);
CREATE INDEX idx_mcp_codes_user ON mcp_login_codes(user_id, created_at);

CREATE TABLE mcp_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES mcp_users(id),
  csrf_token TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX idx_mcp_sessions_user ON mcp_sessions(user_id);

CREATE TABLE mcp_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES mcp_users(id),
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope = 'mcp:read'),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX idx_mcp_grants_user ON mcp_grants(user_id, created_at);

-- One atomic counter per subject/window. No isolate-local rate limiter.
CREATE TABLE mcp_auth_limits (
  subject TEXT NOT NULL,
  window INTEGER NOT NULL,
  hits INTEGER NOT NULL,
  PRIMARY KEY (subject, window)
);
