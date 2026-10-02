import { escape } from "./http.js";

const TEXT = {
  en: {
    privacy: "MCP accounts store your email, sessions, authorizations and call counts. Your passport and form-check inputs stay in your browser.", title: "MCP account", register: "Register", login: "Sign in", email: "Email", send: "Send a verification code",
    sent: "If this address can sign in, a verification code has been sent. Check your email. The code expires in 10 minutes.",
    code: "6-digit code", verify: "Verify and sign in", authorize: "Authorize MCP access", permission: "Allow this MCP key to read country guides and official form information (mcp:read).",
    expiry: "The key expires in 30 days. Anyone with the key can use your monthly call allowance. You can revoke it below.",
    create: "Create an authorized key", grants: "Your authorized keys", revoke: "Revoke", logout: "Sign out", empty: "No authorized keys yet.",
    once: "Copy this key now. It is shown once and cannot be recovered.", keyTitle: "Your authorized MCP key", expires: "Expires", revoked: "Revoked", account: "Back to account", docs: "MCP setup guide",
  },
  zh: {
    privacy: "MCP 账户会保存邮箱、会话、授权和调用次数。护照及表单预检输入留在你的浏览器中。", title: "MCP 账户", register: "注册", login: "登录", email: "邮箱", send: "发送验证码",
    sent: "如果该邮箱可以登录，验证码已发送。请查收邮件。验证码 10 分钟内有效。",
    code: "6 位验证码", verify: "验证并登录", authorize: "授权 MCP 访问", permission: "允许此 MCP 密钥读取国家指南与官方表单信息（mcp:read）。",
    expiry: "密钥 30 天后到期。持有密钥的人可以使用您的每月调用额度。您可在下方撤销授权。",
    create: "创建授权密钥", grants: "已授权密钥", revoke: "撤销", logout: "退出登录", empty: "尚无授权密钥。",
    once: "请立即复制并保存。密钥仅显示一次，无法找回。", keyTitle: "您的 MCP 授权密钥", expires: "到期", revoked: "已撤销", account: "返回账户", docs: "MCP 配置指南",
  },
  "zh-hant": {
    privacy: "MCP 帳戶會保存電子郵件、工作階段、授權和呼叫次數。護照及表單預檢輸入留在你的瀏覽器中。", title: "MCP 帳戶", register: "註冊", login: "登入", email: "電子郵件", send: "傳送驗證碼",
    sent: "如果該電子郵件可以登入，驗證碼已傳送。請查收郵件。驗證碼 10 分鐘內有效。",
    code: "6 位驗證碼", verify: "驗證並登入", authorize: "授權 MCP 存取", permission: "允許此 MCP 金鑰讀取國家指南與官方表單資訊（mcp:read）。",
    expiry: "金鑰 30 天後到期。持有金鑰的人可以使用您的每月呼叫額度。您可在下方撤銷授權。",
    create: "建立授權金鑰", grants: "已授權金鑰", revoke: "撤銷", logout: "登出", empty: "尚無授權金鑰。",
    once: "請立即複製並儲存。金鑰僅顯示一次，無法找回。", keyTitle: "您的 MCP 授權金鑰", expires: "到期", revoked: "已撤銷", account: "返回帳戶", docs: "MCP 設定指南",
  },
};

export function accountUrl(lang) { return `/api/mcp/account?lang=${lang}`; }
const hidden = (name, value) => `<input type="hidden" name="${escape(name)}" value="${escape(value)}">`;
const form = (action, content) => `<form method="post" action="/api/mcp/${action}">${content}</form>`;
const button = (label) => `<button type="submit">${escape(label)}</button>`;
const langTag = { en: "en", zh: "zh-Hans", "zh-hant": "zh-Hant" };

function page(lang, title, content) {
  const guide = lang === "en" ? "/mcp/" : `/${lang}/mcp/`;
  return `<!doctype html><html lang="${langTag[lang]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | entrycardguide</title><style>body{color:#161616;background:#faf8f3;font:1rem/1.6 system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem}h1,h2{line-height:1.2}section,form{margin:1.5rem 0}input[type=email],input[type=text]{display:block;width:min(100%,28rem);box-sizing:border-box;padding:.7rem;border:1px solid #888}button{padding:.6rem .9rem;background:#161616;color:white;border:0;cursor:pointer;margin-top:.5rem}code{overflow-wrap:anywhere}li{margin:1rem 0}a{color:inherit}nav{display:flex;gap:1rem}</style></head><body><nav><a href="${accountUrl("en")}">English</a><a href="${accountUrl("zh")}">简体中文</a><a href="${accountUrl("zh-hant")}">繁體中文</a></nav><main><h1>${escape(title)}</h1><p>${escape(TEXT[lang].privacy)}</p>${content}<p><a href="${guide}">${escape(TEXT[lang].docs)}</a></p></main></body></html>`;
}

export function loggedOutView(lang) {
  const text = TEXT[lang];
  const emailField = `<label>${escape(text.email)}<input type="email" name="email" maxlength="254" autocomplete="email" required></label>${hidden("lang", lang)}${button(text.send)}`;
  return page(lang, text.title, `<section><h2>${escape(text.register)}</h2>${form("register", emailField)}</section><section><h2>${escape(text.login)}</h2>${form("login", emailField)}</section>`);
}

export function verificationView(lang, challengeId) {
  const text = TEXT[lang];
  return page(lang, text.login, `<p>${escape(text.sent)}</p>${form("verify", hidden("lang", lang) + hidden("challengeId", challengeId) + `<label>${escape(text.code)}<input type="text" name="code" inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6" autocomplete="one-time-code" required></label>` + button(text.verify))}`);
}

export function loggedInView(lang, session, grants) {
  const text = TEXT[lang];
  const securityFields = hidden("csrf", session.csrf_token) + hidden("lang", lang);
  const authorize = form("authorize", securityFields + hidden("scope", "mcp:read") + `<label><input type="checkbox" name="consent" value="yes" required> ${escape(text.permission)}</label><p>${escape(text.expiry)}</p>` + button(text.create));
  const rows = grants.map((grant) => {
    const active = !grant.revoked_at && grant.expires_at > Date.now();
    const state = grant.revoked_at ? text.revoked : `${text.expires}: ${new Date(grant.expires_at).toISOString().slice(0, 10)} UTC`;
    return `<li><code>${escape(grant.key_prefix)}…</code> · <code>${escape(grant.scope)}</code> · ${escape(state)}${active ? form("revoke", securityFields + hidden("grantId", grant.id) + button(text.revoke)) : ""}</li>`;
  }).join("");
  return page(lang, text.title, `<p>${escape(session.email)}</p><section><h2>${escape(text.authorize)}</h2>${authorize}</section><section><h2>${escape(text.grants)}</h2>${rows ? `<ul>${rows}</ul>` : `<p>${escape(text.empty)}</p>`}</section>${form("logout", securityFields + button(text.logout))}`);
}

export function grantView(lang, key, expiresAt) {
  const text = TEXT[lang];
  return page(lang, text.keyTitle, `<p>${escape(text.once)}</p><p><code>${escape(key)}</code></p><p><code>Authorization: Bearer &lt;key&gt;</code></p><p><code>https://entrycardguide.com/api/mcp</code></p><p>mcp:read · ${escape(text.expires)}: ${escape(new Date(expiresAt).toISOString())}</p><p><a href="${accountUrl(lang)}">${escape(text.account)}</a></p>`);
}
