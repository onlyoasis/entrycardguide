import { sha256Hex } from "./auth.js";
import { findSession, revokeSession, takeRateLimit } from "./db.js";
import { HttpError } from "./http.js";

export const SESSION_COOKIE = "__Host-ecg_session";
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
export const GRANT_MS = 30 * 24 * 60 * 60 * 1000;

export function randomToken(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return prefix + btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function sessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MS / 1000}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function cookieToken(request) {
  const cookies = (request.headers.get("Cookie") || "").split(";").map((s) => s.trim());
  const values = cookies.filter((s) => s.startsWith(`${SESSION_COOKIE}=`));
  if (values.length !== 1) return null;
  const token = values[0].slice(SESSION_COOKIE.length + 1);
  return /^ecs_[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

export async function getSession(env, request) {
  const token = cookieToken(request);
  return token ? findSession(env.DB, await sha256Hex(token), Date.now()) : null;
}

export async function endSession(env, request) {
  const token = cookieToken(request);
  if (token) await revokeSession(env.DB, await sha256Hex(token), Date.now());
}

export function sameToken(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}

export async function requireSession(env, request, csrf) {
  const session = await getSession(env, request);
  if (!session) throw new HttpError(401, "login_required");
  if (!sameToken(session.csrf_token, csrf)) throw new HttpError(403, "invalid_csrf");
  return session;
}

export async function rateLimit(env, request, action, email = null) {
  const window = Math.floor(Date.now() / 900000);
  // Cloudflare supplies this header. When absent, all requests share a strict
  // fallback bucket; X-Forwarded-For is not trusted.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const subject = `${action}:ip:${await sha256Hex(ip)}`;
  const ipLimit = action === "otp" ? 20 : action === "verify" ? 40 : 30;
  if (!await takeRateLimit(env.DB, subject, window, ipLimit)) throw new HttpError(429, "rate_limited");
  if (email && !await takeRateLimit(env.DB, `${action}:email:${await sha256Hex(email)}`, window, 5)) {
    throw new HttpError(429, "rate_limited");
  }
}
