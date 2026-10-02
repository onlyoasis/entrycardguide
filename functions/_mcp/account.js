import { generateKey, sha256Hex } from "./auth.js";
import { createUser, findUserByEmail, createLoginCode, deliverLoginCode, discardLoginCode, attemptLoginCode, claimLoginCode, createSession, createGrant, listGrants, revokeGrant } from "./db.js";
import { HttpError, guarded, readBody, locale, wantsHtml, json, html, redirect } from "./http.js";
import { requireMailConfig, codeHash, generateCode, sendLoginCode } from "./mail.js";
import { randomToken, sameToken, getSession, requireSession, endSession, sessionCookie, clearSessionCookie, rateLimit, SESSION_MS, GRANT_MS } from "./session.js";
import { accountUrl, loggedOutView, loggedInView, verificationView, grantView } from "./account-view.js";

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?\.[A-Za-z]{2,63}$/;
const CHALLENGE = /^[A-Za-z0-9_-]{43}$/;

export function otpHandler(intent) {
  return guarded(async ({ request, env }) => {
    const body = await readBody(request, ["email", "lang"]);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const lang = locale(body.lang);
    if (email.length > 254 || !EMAIL.test(email)) throw new HttpError(400, "invalid_email");
    requireMailConfig(env);
    await rateLimit(env, request, "otp", email);
    const now = Date.now();
    if (intent === "register") await createUser(env.DB, { id: crypto.randomUUID(), email, createdAt: now });
    const user = await findUserByEmail(env.DB, email);
    const challengeId = randomToken();
    // A login attempt never registers an unknown address. The response shape
    // does not reveal whether the account exists or has been disabled.
    if (user && !user.revoked) {
      const code = generateCode();
      await createLoginCode(env.DB, { id: challengeId, userId: user.id, hash: await codeHash(env, challengeId, code), now, expiresAt: now + 600000 });
      try {
        await sendLoginCode(env, { id: challengeId, email, code, lang });
        await deliverLoginCode(env.DB, challengeId, Date.now());
      } catch (error) {
        await discardLoginCode(env.DB, challengeId, Date.now());
        throw error;
      }
    }
    return wantsHtml(request) ? html(verificationView(lang, challengeId), 202) : json({ status: "verification_required", challengeId, expiresIn: 600, message: "If this address can sign in, a verification code has been sent." }, 202);
  });
}

export const verify = guarded(async ({ request, env }) => {
  const body = await readBody(request, ["challengeId", "code", "lang"]);
  if (typeof body.challengeId !== "string" || !CHALLENGE.test(body.challengeId) || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) throw new HttpError(400, "invalid_verification");
  await rateLimit(env, request, "verify");
  const now = Date.now();
  const attempt = await attemptLoginCode(env.DB, body.challengeId, now);
  const hash = await codeHash(env, body.challengeId, body.code);
  if (!attempt || !sameToken(attempt.code_hash, hash)) throw new HttpError(400, "invalid_verification");
  const claim = await claimLoginCode(env.DB, body.challengeId, hash, now);
  if (!claim) throw new HttpError(400, "invalid_verification");
  const token = randomToken("ecs_");
  const csrf = randomToken();
  if (!await createSession(env.DB, { userId: claim.user_id, hash: await sha256Hex(token), csrf, now, expiresAt: now + SESSION_MS })) throw new HttpError(400, "invalid_verification");
  await endSession(env, request);
  const headers = { "Set-Cookie": sessionCookie(token) };
  return wantsHtml(request) ? redirect(accountUrl(locale(body.lang)), headers) : json({ authenticated: true, csrfToken: csrf, accountUrl: accountUrl(locale(body.lang)) }, 200, headers);
});

export const account = guarded(async ({ request, env }) => {
  const lang = locale(new URL(request.url).searchParams.get("lang"));
  const session = await getSession(env, request);
  const wantsJson = (request.headers.get("Accept") || "").split(",").some((part) => part.trim().startsWith("application/json"));
  if (!session) return wantsJson ? json({ error: "login_required" }, 401) : html(loggedOutView(lang));
  const grants = await listGrants(env.DB, session.id);
  return wantsJson ? json({ email: session.email, plan: session.plan, csrfToken: session.csrf_token, grants }) : html(loggedInView(lang, session, grants));
});

export const authorize = guarded(async ({ request, env }) => {
  const body = await readBody(request, ["csrf", "scope", "consent", "lang"]);
  const session = await requireSession(env, request, body.csrf);
  if (body.scope !== "mcp:read" || ![true, "yes"].includes(body.consent)) throw new HttpError(400, "explicit_consent_required");
  await rateLimit(env, request, "grant", session.email);
  const now = Date.now();
  const key = await generateKey();
  const grant = { id: crypto.randomUUID(), userId: session.id, hash: await sha256Hex(key), prefix: key.slice(0, 10), now, expiresAt: now + GRANT_MS };
  const result = await createGrant(env.DB, grant, session.token_hash);
  if (result.meta.changes !== 1) throw new HttpError(409, "grant_not_created");
  return wantsHtml(request) ? html(grantView(locale(body.lang), key, grant.expiresAt), 201) : json({ apiKey: key, grantId: grant.id, scope: "mcp:read", expiresAt: grant.expiresAt, notice: "Store this key now. It is shown once and cannot be recovered." }, 201);
});

export const revoke = guarded(async ({ request, env }) => {
  const body = await readBody(request, ["csrf", "grantId", "lang"]);
  const session = await requireSession(env, request, body.csrf);
  if (typeof body.grantId !== "string" || !/^[0-9a-f-]{36}$/.test(body.grantId)) throw new HttpError(400, "invalid_grant");
  await rateLimit(env, request, "revoke");
  const result = await revokeGrant(env.DB, session.id, body.grantId, Date.now());
  if (result.meta.changes !== 1) throw new HttpError(404, "grant_not_found");
  return wantsHtml(request) ? redirect(accountUrl(locale(body.lang))) : json({ revoked: true });
});

export const logout = guarded(async ({ request, env }) => {
  const body = await readBody(request, ["csrf", "lang"]);
  await requireSession(env, request, body.csrf);
  await endSession(env, request);
  const headers = { "Set-Cookie": clearSessionCookie() };
  return wantsHtml(request) ? redirect(accountUrl(locale(body.lang)), headers) : json({ loggedOut: true }, 200, headers);
});
