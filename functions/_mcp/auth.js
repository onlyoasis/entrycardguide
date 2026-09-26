// API-key auth for /api/mcp*. Keys are shown once at registration; only the
// SHA-256 hash is stored. Lookup is by hash, so a leaked database does not
// leak usable keys.

const encoder = new TextEncoder();

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
}

export function parseBearer(request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(ecg_[A-Za-z0-9_-]+)\s*$/);
  return match ? match[1] : null;
}

export async function generateKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const b64 = btoa(String.fromCharCode(...bytes));
  return "ecg_" + b64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

// Returns the user row, or null for missing/unknown/revoked keys. All three
// cases return the same 401 so probes cannot distinguish them.
export async function authenticate(env, request) {
  const key = parseBearer(request);
  if (!key) return null;
  const { findUserByKeyHash } = await import("./db.js");
  const user = await findUserByKeyHash(env.DB, await sha256Hex(key));
  if (!user || user.revoked) return null;
  return user;
}
