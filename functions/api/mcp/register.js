// POST /api/mcp/register — become a registered MCP user and get an API key.
//
//   JSON:  curl -X POST https://entrycardguide.com/api/mcp/register \
//            -H 'Content-Type: application/json' -d '{"email":"you@example.com"}'
//   Form:  a plain <form method="post" action="/api/mcp/register"> also works
//          (the /mcp/ page links here); the response is a small HTML page.
//
// One key per email. The key is shown exactly once; only its SHA-256 hash is
// stored. v1 has no email verification — rate-limit at the edge (WAF rule) if
// registration abuse shows up; see docs/mcp.md.

import { createUser, findUserByEmail } from "../../_mcp/db.js";
import { generateKey, sha256Hex } from "../../_mcp/auth.js";
import { currentPeriod, planLimit } from "../../_mcp/quota.js";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "X-Robots-Tag": "noindex", ...extraHeaders },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) {
    return json({ error: "mcp_not_configured", message: "D1 binding missing; see docs/mcp.md." }, 503);
  }

  const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim();
  let email;
  let wantsHtml = false;

  if (contentType === "application/json") {
    try {
      const body = await request.json();
      email = typeof body?.email === "string" ? body.email : null;
    } catch {
      return json({ error: "invalid_json", message: "Body must be JSON: {\"email\": \"...\"}." }, 400);
    }
  } else if (contentType === "application/x-www-form-urlencoded") {
    const form = await request.formData();
    email = typeof form.get("email") === "string" ? form.get("email") : null;
    wantsHtml = true;
  } else {
    return json(
      { error: "unsupported_media_type", message: "Content-Type must be application/json or application/x-www-form-urlencoded." },
      415,
    );
  }

  email = (email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json({ error: "invalid_email", message: "Provide a valid email address." }, 400);
  }

  if (await findUserByEmail(env.DB, email)) {
    return json(
      { error: "email_already_registered", message: "This email already has an API key. If you lost it, contact the site maintainer." },
      409,
    );
  }

  const key = await generateKey();
  const keyHash = await sha256Hex(key);
  const period = currentPeriod();

  await createUser(env.DB, {
    id: crypto.randomUUID(),
    email,
    keyHash,
    keyPrefix: key.slice(0, 10),
    createdAt: Date.now(),
  });

  const limit = planLimit(env, "free");
  if (wantsHtml) {
    // CSP-safe: no scripts, no external styles (style-src 'unsafe-inline' allows attrs).
    const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return new Response(
      `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>entrycardguide MCP API key</title></head>
<body style="font-family: ui-monospace, monospace; max-width: 42rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.6">
<h1>Your entrycardguide MCP key</h1>
<p>Copy it now &mdash; it cannot be shown again:</p>
<p style="font-size: 1.2rem; word-break: break-all"><code>${escape(key)}</code></p>
<p>Free plan: ${limit === null ? "unlimited" : limit} tool calls per month. Point your MCP client at
<code>https://entrycardguide.com/api/mcp</code> with header
<code>Authorization: Bearer &lt;key&gt;</code>. Setup guide: <a href="/mcp/">entrycardguide.com/mcp/</a>.</p>
<p>Registered: ${escape(email)}</p>
</body>
</html>`,
      {
        status: 201,
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      },
    );
  }

  return json(
    {
      apiKey: key,
      plan: "free",
      monthlyCallQuota: limit,
      usagePeriod: period,
      notice: "Store this key now — it is shown once and cannot be recovered. Only its hash is stored.",
      usage: "GET /api/mcp/whoami with the same Bearer key shows remaining quota.",
    },
    201,
  );
}

export async function onRequestGet() {
  return json(
    { error: "method_not_allowed", message: "POST {\"email\": \"...\"} to register. Docs: https://entrycardguide.com/mcp/" },
    405,
    { Allow: "POST" },
  );
}
