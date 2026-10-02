import { HttpError } from "./http.js";

export function requireMailConfig(env) {
  if (!env.RESEND_API_KEY || !env.MCP_EMAIL_FROM || typeof env.MCP_AUTH_SECRET !== "string" || env.MCP_AUTH_SECRET.length < 32) {
    throw new HttpError(503, "email_login_not_configured");
  }
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
  let response;
  try {
    response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `mcp-login/${id}` },
      body: JSON.stringify({ from: env.MCP_EMAIL_FROM, to: [email], subject: subjects[lang], text: messages[lang] }),
      signal: AbortSignal.timeout(10000),
    });
  } catch { throw new HttpError(503, "email_delivery_unavailable"); }
  if (!response.ok) throw new HttpError(503, "email_delivery_unavailable");
}
