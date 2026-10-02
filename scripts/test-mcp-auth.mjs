#!/usr/bin/env node
// Full HTTP handler flow with real migrations/SQL and a fake Resend HTTPS
// transport. No production bypass, network request, printed code or key.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTestDatabase } from "./helpers/d1-test-shim.mjs";
import { sha256Hex, authenticate } from "../functions/_mcp/auth.js";
import { codeHash } from "../functions/_mcp/mail.js";
import { SESSION_COOKIE } from "../functions/_mcp/session.js";
import { loggedInView } from "../functions/_mcp/account-view.js";
import { onRequestPost as register } from "../functions/api/mcp/register.js";
import { onRequestPost as login } from "../functions/api/mcp/login.js";
import { onRequestPost as verify } from "../functions/api/mcp/verify.js";
import { onRequestGet as account } from "../functions/api/mcp/account.js";
import { onRequestPost as authorize } from "../functions/api/mcp/authorize.js";
import { onRequestPost as revoke } from "../functions/api/mcp/revoke.js";
import { onRequestPost as logout } from "../functions/api/mcp/logout.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://entrycardguide.com";
const failures = [];
let passed = 0;
function check(name, value) { if (value) passed++; else failures.push(name); }
const oldKey = "ecg_legacy_anonymous_registration_key";
const oldHash = await sha256Hex(oldKey);
const db = createTestDatabase(ROOT, (sqlite) => sqlite.prepare(`INSERT INTO mcp_users
  (id,email,key_hash,key_prefix,plan,created_at) VALUES ('legacy','legacy@example.com',?,'ecg_legacy','free',1)`).run(oldHash));
const env = { DB: db, RESEND_API_KEY: "test-resend-not-a-secret", MCP_EMAIL_FROM: "entrycardguide <test@example.com>", MCP_AUTH_SECRET: "test-only-otp-pepper-with-at-least-thirty-two-characters" };
const context = (request, runtimeEnv = env) => ({ request, env: runtimeEnv });
const originalFetch = globalThis.fetch;
const sent = [];
let mailFailure = false;
let transportFailure = false;
let delayedEmail = null;
let delayedRequests = [];
let notifyDelayed;
globalThis.fetch = async (url, options) => {
  check("sender uses fixed Resend HTTPS URL", url === "https://api.resend.com/emails");
  check("sender uses POST and API authorization", options.method === "POST" && options.headers.Authorization === `Bearer ${env.RESEND_API_KEY}`);
  const message = JSON.parse(options.body);
  check("sender sets idempotency key and timeout", options.headers["Idempotency-Key"]?.startsWith("mcp-login/") && options.signal instanceof AbortSignal);
  if (transportFailure) throw new Error("fake transport failure");
  if (mailFailure) return new Response(null, { status: 503 });
  if (message.to[0] === delayedEmail) {
    const waiting = new Promise((resolve) => delayedRequests.push({ resolve }));
    if (delayedRequests.length === 2) notifyDelayed();
    await waiting;
  }
  sent.push({ id: options.headers["Idempotency-Key"].slice("mcp-login/".length), email: message.to[0], code: message.text.match(/\b\d{6}\b/)[0] });
  return new Response(JSON.stringify({ id: "test-mail" }), { status: 200 });
};

function post(route, body, { cookie, origin = ORIGIN, type = "application/json", ip = "192.0.2.1", raw, headers = {} } = {}) {
  return new Request(`${ORIGIN}/api/mcp/${route}`, {
    method: "POST",
    headers: { "Content-Type": type, ...(origin === null ? {} : { Origin: origin }), "CF-Connecting-IP": ip, ...(cookie ? { Cookie: cookie } : {}), ...headers },
    body: raw ?? (type === "application/x-www-form-urlencoded" ? new URLSearchParams(body).toString() : JSON.stringify(body)),
  });
}
function getAccount(cookie, lang = "en", accept = "application/json") {
  return new Request(`${ORIGIN}/api/mcp/account?lang=${lang}`, { headers: { ...(cookie ? { Cookie: cookie } : {}), Accept: accept } });
}
const bearer = (key) => new Request(`${ORIGIN}/api/mcp`, { headers: { Authorization: `Bearer ${key}` } });
const tableCount = (name) => db.sqlite.prepare(`SELECT COUNT(*) AS n FROM ${name}`).get().n;
async function start(email, handler = register, extra = {}) {
  const response = await handler(context(post(handler === login ? "login" : "register", { email, lang: "en" }, extra)));
  return { response, body: await response.json(), code: sent.filter((message) => message.email === email.toLowerCase()).at(-1)?.code };
}
async function signIn(email, extra = {}) {
  const challenge = await start(email, register, extra);
  const response = await verify(context(post("verify", { challengeId: challenge.body.challengeId, code: challenge.code }, extra)));
  const body = await response.json();
  return { response, body, cookie: response.headers.get("Set-Cookie")?.split(";")[0], challenge };
}
const consentBody = (session, additional = {}) => ({ csrf: session.body.csrfToken, scope: "mcp:read", consent: true, ...additional });

try {
  check("migration retires all old anonymous key hashes", db.sqlite.prepare("SELECT key_hash FROM mcp_users WHERE id='legacy'").get().key_hash !== oldHash);
  check("legacy key does not authenticate", await authenticate(env, bearer(oldKey)) === null);
  let response = await register(context(post("register", { email: "good@example.com" }), {}));
  check("missing D1 returns 503", response.status === 503);
  for (const missing of ["RESEND_API_KEY", "MCP_EMAIL_FROM", "MCP_AUTH_SECRET"]) {
    response = await register(context(post("register", { email: "config@example.com" }), { ...env, [missing]: "" }));
    check(`missing ${missing} fails closed`, response.status === 503 && !response.headers.has("Set-Cookie"));
  }
  check("missing config did not create accounts", tableCount("mcp_users") === 1);
  for (const options of [{ origin: null }, { origin: "https://attacker.example" }, { headers: { "Sec-Fetch-Site": "cross-site" } }]) {
    response = await register(context(post("register", { email: "origin@example.com" }, options)));
    check("registration rejects missing or foreign origin", response.status === 403);
  }
  response = await register(context(post("register", { email: "bad@example.com", injected: true })));
  check("registration rejects unexpected input fields", response.status === 400);
  response = await register(context(post("register", { email: "x' OR 1=1--" })));
  check("invalid email rejected", response.status === 400);
  response = await register(context(post("register", {}, { raw: "{oops" })));
  check("malformed JSON rejected", response.status === 400);
  response = await register(context(post("register", {}, { raw: "email=a@example.com&email=b@example.com", type: "application/x-www-form-urlencoded" })));
  check("duplicate form values rejected", response.status === 400);
  response = await register(context(post("register", {}, { raw: "email=x", type: "text/plain" })));
  check("unsupported media type rejected", response.status === 415);
  response = await register(context(post("register", {}, { raw: "x".repeat(4097) })));
  check("actual oversized body without length rejected", response.status === 413);
  response = await register(context(post("register", {}, { raw: "{}", headers: { "Content-Length": "4097" } })));
  check("declared oversized body rejected", response.status === 413);

  const countBeforeUnknown = sent.length;
  const unknown = await start("unknown@example.com", login);
  check("unknown login has generic 202 response", unknown.response.status === 202 && unknown.body.status === "verification_required");
  check("unknown login creates neither account nor email", tableCount("mcp_users") === 1 && sent.length === countBeforeUnknown);
  const pending = await start("agent@example.com");
  check("registration returns verification challenge, no key", pending.response.status === 202 && !pending.body.apiKey && !pending.response.headers.has("Set-Cookie"));
  check("generic login and registration response shapes match", Object.keys(unknown.body).join() === Object.keys(pending.body).join());
  const user = db.sqlite.prepare("SELECT * FROM mcp_users WHERE email='agent@example.com'").get();
  check("registration leaves email unverified and no grants/sessions", user.verified_at === null && tableCount("mcp_grants") === 0 && tableCount("mcp_sessions") === 0);
  const storedCode = db.sqlite.prepare("SELECT * FROM mcp_login_codes WHERE id=?").get(pending.body.challengeId);
  check("OTP is HMAC hashed and not stored in plaintext", storedCode.code_hash === await codeHash(env, pending.body.challengeId, pending.code) && storedCode.code_hash !== pending.code && storedCode.delivered_at > 0);
  response = await authorize(context(post("authorize", { scope: "mcp:read", consent: true, csrf: "fake" })));
  check("unverified registration cannot authorize", response.status === 401);
  response = await verify(context(post("verify", { challengeId: pending.body.challengeId, code: pending.code === "000000" ? "000001" : "000000" })));
  check("wrong OTP rejected and attempts counted", response.status === 400 && db.sqlite.prepare("SELECT attempts FROM mcp_login_codes WHERE id=?").get(pending.body.challengeId).attempts === 1);
  response = await verify(context(post("verify", { challengeId: pending.body.challengeId, code: pending.code })));
  const primary = { response, body: await response.json(), cookie: response.headers.get("Set-Cookie")?.split(";")[0] };
  check("OTP verifies email and creates session", response.status === 200 && primary.body.authenticated && db.sqlite.prepare("SELECT verified_at FROM mcp_users WHERE id=?").get(user.id).verified_at > 0);
  const setCookie = response.headers.get("Set-Cookie");
  check("session cookie has secure flags and host-only path", setCookie.includes(`${SESSION_COOKIE}=ecs_`) && ["HttpOnly", "Secure", "SameSite=Strict", "Path=/", "Max-Age=604800"].every((value) => setCookie.includes(value)) && !setCookie.includes("Domain="));
  check("session token only hash stored", !JSON.stringify(db.sqlite.prepare("SELECT * FROM mcp_sessions").all()).includes(primary.cookie.split("=")[1]));
  check("session cookie never authenticates MCP", await authenticate(env, new Request(`${ORIGIN}/api/mcp`, { headers: { Cookie: primary.cookie } })) === null);
  response = await verify(context(post("verify", { challengeId: pending.body.challengeId, code: pending.code })));
  check("used OTP cannot be replayed", response.status === 400 && !response.headers.has("Set-Cookie"));

  for (const [lang, marker] of [["en", "MCP account"], ["zh", "MCP 账户"], ["zh-hant", "MCP 帳戶"]]) {
    response = await account(context(getAccount(undefined, lang, "text/html")));
    const text = await response.text();
    check(`${lang} logged-out account renders forms without script`, response.status === 200 && text.includes(marker) && text.includes('action="/api/mcp/register"') && text.includes('action="/api/mcp/login"') && !text.includes("<script"));
    check(`${lang} account responses never cache`, response.headers.get("Cache-Control") === "no-store" && response.headers.get("Referrer-Policy") === "no-referrer");
    response = await account(context(getAccount(primary.cookie, lang, "text/html")));
    const signedInHtml = await response.text();
    check(`${lang} signed-in page requires explicit unchecked consent`, signedInHtml.includes('name="consent"') && !signedInHtml.includes(" checked") && signedInHtml.includes(primary.body.csrfToken));
  }
  response = await account(context(getAccount(primary.cookie)));
  const dashboard = await response.json();
  check("authenticated JSON dashboard supplies matching CSRF and no key", dashboard.email === "agent@example.com" && dashboard.csrfToken === primary.body.csrfToken && dashboard.grants.length === 0);
  for (const [extra, status] of [[{ csrf: "bad" }, 403], [{ consent: false }, 400], [{ scope: "mcp:write" }, 400]]) {
    response = await authorize(context(post("authorize", consentBody(primary, extra), { cookie: primary.cookie })));
    check("authorization rejects invalid CSRF, missing consent and extra scope", response.status === status);
  }
  response = await authorize(context(post("authorize", consentBody(primary), { cookie: primary.cookie, origin: "https://attacker.example" })));
  check("authorization rejects foreign origin even with valid CSRF/session", response.status === 403);
  response = await authorize(context(post("authorize", consentBody(primary), { cookie: primary.cookie })));
  const grant = await response.json();
  check("explicit authorization issues ecg key once with 30-day read scope", response.status === 201 && grant.apiKey?.startsWith("ecg_") && grant.scope === "mcp:read" && Math.abs(grant.expiresAt - Date.now() - 2592000000) < 5000);
  const authorized = await authenticate(env, bearer(grant.apiKey));
  check("authorized key identifies verified account and specific grant", authorized?.id === user.id && authorized.grant_id === grant.grantId && authorized.scope === "mcp:read" && authorized.scopes[0] === "mcp:read");
  check("Bearer authentication scheme is case insensitive", (await authenticate(env, new Request(`${ORIGIN}/api/mcp`, { headers: { Authorization: `bearer ${grant.apiKey}` } })))?.id === user.id);
  const alteredKey = grant.apiKey.slice(0, 4) + grant.apiKey.slice(4).replace(/[A-Za-z]/, (character) => character === character.toUpperCase() ? character.toLowerCase() : character.toUpperCase());
  check("case-insensitive scheme does not lowercase secret key", await authenticate(env, bearer(alteredKey)) === null);
  check("DB never stores plaintext grant key", !JSON.stringify(db.sqlite.prepare("SELECT * FROM mcp_grants").all()).includes(grant.apiKey));
  response = await account(context(getAccount(primary.cookie)));
  const grantsDashboard = await response.json();
  check("dashboard lists grant metadata without usable key/hash", grantsDashboard.grants.length === 1 && !JSON.stringify(grantsDashboard).includes(grant.apiKey) && !JSON.stringify(grantsDashboard).includes("key_hash"));
  check("Bearer key is not a browser session", (await account(context(getAccount(`${SESSION_COOKIE}=${grant.apiKey}`)))).status === 401);

  const other = await signIn("other@example.com", { ip: "192.0.2.2" });
  response = await revoke(context(post("revoke", { csrf: other.body.csrfToken, grantId: grant.grantId }, { cookie: other.cookie, ip: "192.0.2.2" })));
  check("another account cannot revoke owner's grant", response.status === 404 && await authenticate(env, bearer(grant.apiKey)) !== null);
  response = await revoke(context(post("revoke", { csrf: "wrong", grantId: grant.grantId }, { cookie: primary.cookie })));
  check("revocation requires CSRF", response.status === 403);
  response = await revoke(context(post("revoke", { csrf: primary.body.csrfToken, grantId: grant.grantId }, { cookie: primary.cookie })));
  check("owner revocation takes effect immediately", response.status === 200 && await authenticate(env, bearer(grant.apiKey)) === null);

  response = await authorize(context(post("authorize", consentBody(primary), { cookie: primary.cookie })));
  const expiryGrant = await response.json();
  db.sqlite.prepare("UPDATE mcp_grants SET expires_at=? WHERE id=?").run(Date.now() - 1, expiryGrant.grantId);
  check("expired grants fail authentication", await authenticate(env, bearer(expiryGrant.apiKey)) === null);
  response = await authorize(context(post("authorize", consentBody(primary), { cookie: primary.cookie })));
  const liveGrant = await response.json();
  db.sqlite.prepare("UPDATE mcp_users SET revoked=1 WHERE id=?").run(user.id);
  check("disabled account invalidates live grants and sessions", await authenticate(env, bearer(liveGrant.apiKey)) === null && (await account(context(getAccount(primary.cookie)))).status === 401);
  db.sqlite.prepare("UPDATE mcp_users SET revoked=0 WHERE id=?").run(user.id);
  response = await logout(context(post("logout", { csrf: primary.body.csrfToken }, { cookie: primary.cookie })));
  check("logout revokes session and clears host cookie", response.status === 200 && response.headers.get("Set-Cookie").includes("Max-Age=0"));
  check("logged-out session cannot authorize", (await authorize(context(post("authorize", consentBody(primary), { cookie: primary.cookie })))).status === 401);
  check("independently granted key survives browser logout", await authenticate(env, bearer(liveGrant.apiKey)) !== null);

  const rotation = await signIn("rotate@example.com", { ip: "203.0.113.1" });
  const rotateChallenge = await start("rotate@example.com", login, { ip: "203.0.113.1" });
  response = await verify(context(post("verify", { challengeId: rotateChallenge.body.challengeId, code: rotateChallenge.code }, { cookie: rotation.cookie, ip: "203.0.113.1" })));
  const rotatedCookie = response.headers.get("Set-Cookie")?.split(";")[0];
  check("a fresh login rotates and revokes the prior browser session", response.status === 200 && rotation.cookie !== rotatedCookie && (await account(context(getAccount(rotation.cookie)))).status === 401 && (await account(context(getAccount(rotatedCookie)))).status === 200);
  const expiredSessionHash = await sha256Hex(rotatedCookie.split("=")[1]);
  db.sqlite.prepare("UPDATE mcp_sessions SET expires_at=? WHERE token_hash=?").run(Date.now() - 1, expiredSessionHash);
  check("expired sessions cannot read account", (await account(context(getAccount(rotatedCookie)))).status === 401);

  const grantLimited = await signIn("grant-limited@example.com", { ip: "203.0.113.2" });
  const grantResults = await Promise.all(Array.from({ length: 8 }, () => authorize(context(post("authorize", consentBody(grantLimited), { cookie: grantLimited.cookie, ip: "203.0.113.2" })))));
  check("concurrent grant creation limited to five per email/window", grantResults.filter((item) => item.status === 201).length === 5 && grantResults.filter((item) => item.status === 429).length === 3);
  const grantOwner = db.sqlite.prepare("SELECT id FROM mcp_users WHERE email='grant-limited@example.com'").get().id;
  const now = Date.now();
  for (let i = 0; i < 5; i++) db.sqlite.prepare(`INSERT INTO mcp_grants(id,user_id,key_hash,key_prefix,scope,created_at,expires_at) VALUES (?,?,?,?,'mcp:read',?,?)`)
    .run(crypto.randomUUID(), grantOwner, `test-existing-grant-${i}`, "test-only", now, now + 100000);
  db.sqlite.exec("DELETE FROM mcp_auth_limits");
  response = await authorize(context(post("authorize", consentBody(grantLimited), { cookie: grantLimited.cookie, ip: "203.0.113.2" })));
  check("ten active grants is an atomic per-account ceiling", response.status === 409 && db.sqlite.prepare("SELECT COUNT(*) AS n FROM mcp_grants WHERE user_id=?").get(grantOwner).n === 10);

  const htmlRegister = await register(context(post("register", { email: "html-form@example.com", lang: "zh-hant" }, { type: "application/x-www-form-urlencoded", ip: "203.0.113.3" })));
  const htmlChallenge = (await htmlRegister.text()).match(/name="challengeId" value="([A-Za-z0-9_-]+)"/)[1];
  check("HTML registration renders translated OTP form", htmlRegister.status === 202 && htmlRegister.headers.get("Content-Type").startsWith("text/html"));
  const htmlCode = sent.filter((message) => message.email === "html-form@example.com").at(-1).code;
  response = await verify(context(post("verify", { challengeId: htmlChallenge, code: htmlCode, lang: "zh-hant" }, { type: "application/x-www-form-urlencoded", ip: "203.0.113.3" })));
  const htmlCookie = response.headers.get("Set-Cookie")?.split(";")[0];
  check("HTML OTP verification redirects to selected account language", response.status === 303 && response.headers.get("Location") === "/api/mcp/account?lang=zh-hant");
  response = await account(context(getAccount(htmlCookie, "zh-hant", "text/html")));
  const htmlCsrf = (await response.text()).match(/name="csrf" value="([A-Za-z0-9_-]+)"/)[1];
  response = await authorize(context(post("authorize", { csrf: htmlCsrf, scope: "mcp:read", consent: "yes", lang: "zh-hant" }, { cookie: htmlCookie, type: "application/x-www-form-urlencoded", ip: "203.0.113.3" })));
  const keyHtml = await response.text();
  check("HTML explicit authorization shows key once with read scope", response.status === 201 && keyHtml.includes("ecg_") && keyHtml.includes("mcp:read") && keyHtml.includes("僅顯示一次"));
  response = await logout(context(post("logout", { csrf: htmlCsrf, lang: "zh-hant" }, { cookie: htmlCookie, type: "application/x-www-form-urlencoded", ip: "203.0.113.3" })));
  check("HTML logout clears session and redirects", response.status === 303 && response.headers.get("Set-Cookie").includes("Max-Age=0") && response.headers.get("Location") === "/api/mcp/account?lang=zh-hant");

  const escapedHtml = loggedInView("en", { email: '<img src=x onerror="attack()">', csrf_token: '\"><script>attack()</script>' }, [{ id: '\"><script>attack()</script>', key_prefix: "<script>", scope: "mcp:read", created_at: now, expires_at: now + 100000, revoked_at: null }]);
  check("HTML account escapes stored account/grant/form data", !escapedHtml.includes("<script>") && !escapedHtml.includes("<img") && escapedHtml.includes("&lt;script&gt;") && escapedHtml.includes("&quot;"));

  const concurrent = await start("concurrent@example.com", register, { ip: "192.0.2.3" });
  const attempts = await Promise.all([1, 2].map(() => verify(context(post("verify", { challengeId: concurrent.body.challengeId, code: concurrent.code }, { ip: "192.0.2.3" })))));
  check("concurrent OTP claim produces exactly one session", attempts.filter((item) => item.status === 200).length === 1 && attempts.filter((item) => item.status === 400).length === 1);
  for (const deliveryOrder of [[0, 1], [1, 0]]) {
    delayedEmail = `delivery-order-${deliveryOrder.join("")}@example.com`;
    delayedRequests = [];
    const ready = new Promise((resolve) => { notifyDelayed = resolve; });
    const registrationPromises = [0, 1].map(() => register(context(post("register", { email: delayedEmail }, { ip: "203.0.113.4" }))));
    await ready;
    delayedRequests[deliveryOrder[0]].resolve();
    const firstRegistration = await registrationPromises[deliveryOrder[0]];
    const firstChallenge = await firstRegistration.json();
    delayedRequests[deliveryOrder[1]].resolve();
    const lastRegistration = await registrationPromises[deliveryOrder[1]];
    const lastChallenge = await lastRegistration.json();
    const lastCode = sent.find((message) => message.id === lastChallenge.challengeId).code;
    check(`out-of-order delivery ${deliveryOrder.join()} preserves one usable code`, firstRegistration.status === 202 && lastRegistration.status === 202 && db.sqlite.prepare("SELECT COUNT(*) AS n FROM mcp_login_codes WHERE user_id=(SELECT id FROM mcp_users WHERE email=?) AND consumed_at IS NULL AND delivered_at IS NOT NULL").get(delayedEmail).n === 1);
    response = await verify(context(post("verify", { challengeId: lastChallenge.challengeId, code: lastCode }, { ip: "203.0.113.4" })));
    check(`last delivered code ${deliveryOrder.join()} verifies`, response.status === 200);
    response = await verify(context(post("verify", { challengeId: firstChallenge.challengeId, code: sent.find((message) => message.id === firstChallenge.challengeId).code }, { ip: "203.0.113.4" })));
    check(`earlier delivered code ${deliveryOrder.join()} remains invalid`, response.status === 400);
    delayedEmail = null;
  }
  const expired = await start("expired@example.com", register, { ip: "192.0.2.4" });
  db.sqlite.prepare("UPDATE mcp_login_codes SET expires_at=? WHERE id=?").run(Date.now() - 1, expired.body.challengeId);
  response = await verify(context(post("verify", { challengeId: expired.body.challengeId, code: expired.code }, { ip: "192.0.2.4" })));
  check("expired OTP is rejected without session", response.status === 400 && !response.headers.has("Set-Cookie"));
  const exhausted = await start("exhausted@example.com", register, { ip: "192.0.2.5" });
  for (let i = 0; i < 5; i++) await verify(context(post("verify", { challengeId: exhausted.body.challengeId, code: exhausted.code === "000000" ? "000001" : "000000" }, { ip: "192.0.2.5" })));
  response = await verify(context(post("verify", { challengeId: exhausted.body.challengeId, code: exhausted.code }, { ip: "192.0.2.5" })));
  check("five failed attempts lock out even correct OTP", response.status === 400 && db.sqlite.prepare("SELECT attempts FROM mcp_login_codes WHERE id=?").get(exhausted.body.challengeId).attempts === 5);
  const replaced = await start("replaced@example.com", register, { ip: "192.0.2.6" });
  const replacement = await start("replaced@example.com", login, { ip: "192.0.2.6" });
  check("duplicate registration/login do not create duplicate account", db.sqlite.prepare("SELECT COUNT(*) AS n FROM mcp_users WHERE email='replaced@example.com'").get().n === 1);
  response = await verify(context(post("verify", { challengeId: replaced.body.challengeId, code: replaced.code }, { ip: "192.0.2.6" })));
  check("new delivered OTP supersedes old challenge", response.status === 400);
  response = await verify(context(post("verify", { challengeId: replacement.body.challengeId, code: replacement.code }, { ip: "192.0.2.6" })));
  check("replacement OTP remains usable", response.status === 200);

  mailFailure = true;
  const failed = await start("delivery-failure@example.com", register, { ip: "192.0.2.7" });
  check("mail rejection never creates session or key", failed.response.status === 503 && !failed.response.headers.has("Set-Cookie") && !failed.body.apiKey);
  check("mail rejection leaves challenge consumed and undelivered", db.sqlite.prepare("SELECT consumed_at,delivered_at FROM mcp_login_codes WHERE user_id=(SELECT id FROM mcp_users WHERE email='delivery-failure@example.com')").get().consumed_at > 0);
  mailFailure = false;
  transportFailure = true;
  response = await register(context(post("register", { email: "transport-failure@example.com" }, { ip: "192.0.2.8" })));
  check("mail transport failure returns safe 503", response.status === 503 && (await response.json()).error === "email_delivery_unavailable");
  transportFailure = false;

  for (let i = 0; i < 5; i++) await start("limited@example.com", login, { ip: `192.0.2.${30 + i}` });
  response = await login(context(post("login", { email: "limited@example.com" }, { ip: "192.0.2.40" })));
  check("email limiter covers different IPs and unknown accounts", response.status === 429 && response.headers.has("Retry-After"));
  const limitedResults = await Promise.all(Array.from({ length: 24 }, (_, i) => login(context(post("login", { email: `ip-${i}@example.com` }, { ip: "198.51.100.1" })))));
  check("concurrent IP limiter admits at most 20 requests", limitedResults.filter((item) => item.status === 202).length === 20 && limitedResults.filter((item) => item.status === 429).length === 4);
  check("auth limit subjects contain no plaintext email/IP", !JSON.stringify(db.sqlite.prepare("SELECT subject FROM mcp_auth_limits").all()).includes("limited@example.com") && !JSON.stringify(db.sqlite.prepare("SELECT subject FROM mcp_auth_limits").all()).includes("198.51.100.1"));

  const escapedUser = await signIn("<invalid>@example.com", { ip: "192.0.2.9" });
  check("unsafe HTML email input rejected", escapedUser.challenge.response.status === 400);
} finally { globalThis.fetch = originalFetch; db.sqlite.close(); }

if (failures.length) {
  console.error(`MCP account tests: ${passed} passed, ${failures.length} failed`);
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
} else console.log(`MCP account tests: ${passed} passed`);
