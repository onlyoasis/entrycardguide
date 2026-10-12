import { HttpError } from "./http.js";

export function requireMailConfig(env) {
  if (!env.MCP_EMAIL_API_TOKEN || !/^[0-9a-f]{32}$/i.test(env.MCP_EMAIL_ACCOUNT_ID || "") || !senderAddress(env.MCP_EMAIL_FROM)
    || typeof env.MCP_AUTH_SECRET !== "string" || env.MCP_AUTH_SECRET.length < 32) {
    throw new HttpError(503, "email_login_not_configured");
  }
}

// MCP_EMAIL_FROM is "Display Name <address>" or a bare address. Cloudflare
// Email Sending takes the display name as a separate field.
function senderAddress(value) {
  if (typeof value !== "string" || /[\r\n]/.test(value)) return null;
  const named = value.match(/^\s*(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/);
  if (named) return named[1] ? { address: named[2], name: named[1] } : { address: named[2] };
  return /^[^<>\s]+@[^<>\s]+$/.test(value.trim()) ? { address: value.trim() } : null;
}

export async function codeHash(env, id, code) {
  if (typeof env.MCP_AUTH_SECRET !== "string" || env.MCP_AUTH_SECRET.length < 32) throw new HttpError(503, "email_login_not_configured");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.MCP_AUTH_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${id}:${code}`));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateCode() {
  // Rejection sampling avoids modulo bias.
  let value;
  do { value = crypto.getRandomValues(new Uint32Array(1))[0]; } while (value >= 4294000000);
  return String(value % 1000000).padStart(6, "0");
}

export async function sendLoginCode(env, { id, email, code, lang }, fetchImpl = globalThis.fetch) {
  requireMailConfig(env);
  const subjects = { en: "Your entrycardguide sign-in code", zh: "entrycardguide 登录验证码", "zh-hant": "entrycardguide 登入驗證碼" };
  const messages = {
    en: `Your sign-in code is ${code}. It expires in 10 minutes and can be used once. Do not share it. If you did not request it, ignore this email.`,
    zh: `您的登录验证码为 ${code}。10 分钟内有效，只能使用一次。请勿转发。若非本人请求，请忽略此邮件。`,
    "zh-hant": `您的登入驗證碼為 ${code}。10 分鐘內有效，只能使用一次。請勿轉發。若非本人請求，請忽略此郵件。`,
  };
  // Cloudflare Email Sending REST API (same channel emailHub uses via its
  // Worker binding; Pages Functions have no send_email binding). The API has
  // no idempotency key, so the challenge id travels as a header instead: it
  // also stops mail clients threading successive codes together.
  let response, result;
  try {
    response = await fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${env.MCP_EMAIL_ACCOUNT_ID}/email/sending/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.MCP_EMAIL_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: senderAddress(env.MCP_EMAIL_FROM), to: [email], subject: subjects[lang], text: messages[lang], headers: { "X-Entity-Ref-ID": `mcp-login/${id}` } }),
      signal: AbortSignal.timeout(10000),
    });
    result = await response.json();
  } catch { throw new HttpError(503, "email_delivery_unavailable"); }
  // HTTP 200 alone is not delivery: the body must report success, and a
  // permanent bounce for this recipient means no code will arrive.
  if (!response.ok || result?.success !== true || (result.permanent_bounces || []).includes(email)) {
    throw new HttpError(503, "email_delivery_unavailable");
  }
}
