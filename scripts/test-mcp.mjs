#!/usr/bin/env node
// Unit tests for the MCP Pages Functions. Runs against a real SQLite database
// (node:sqlite) wrapped in the same prepare().bind().first()/all()/run()
// surface Cloudflare D1 exposes, so the SQL in functions/_mcp/db.js is
// actually executed, not mocked away.
//
//   npm run test:mcp    (Node 22: node:sqlite needs --experimental-sqlite)

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- D1 adapter -----------------------------------------------------------

class D1StatementShim {
  constructor(db, sql) {
    this.statement = db.prepare(sql);
    this.args = [];
  }
  bind(...args) {
    this.args = args;
    return this;
  }
  async first() {
    return this.statement.get(...this.args) ?? null;
  }
  async all() {
    return { results: this.statement.all(...this.args) };
  }
  async run() {
    const info = this.statement.run(...this.args);
    return { success: true, meta: { changes: info.changes } };
  }
}

const database = new DatabaseSync(":memory:");
database.exec(readFileSync(path.join(ROOT, "migrations/0001_mcp_init.sql"), "utf8"));
const db = { prepare: (sql) => new D1StatementShim(database, sql) };

// --- harness ---------------------------------------------------------------

const failures = [];
let passed = 0;
function check(name, condition, detail = "") {
  if (condition) {
    passed++;
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const ORIGIN = "https://entrycardguide.com";
// Two environments: envQuota forces the free tier down to 2 calls/month for
// exhaustion tests; envDefault leaves it at the code default (100) for the
// tool-semantics tests that need more calls.
const envQuota = { DB: db, MCP_FREE_MONTHLY_CALLS: "2" };
const envDefault = { DB: db };
const context = (request, env = envQuota) => ({ request, env, next: async () => new Response(null, { status: 599 }) });

const { onRequestPost: mcpPost, onRequestGet: mcpGet, onRequestDelete: mcpDelete } = await import(
  "../functions/api/mcp/index.js"
);
const { onRequestPost: registerPost } = await import("../functions/api/mcp/register.js");
const { onRequestGet: whoamiGet } = await import("../functions/api/mcp/whoami.js");

function rpc(method, params, key, id = 1) {
  const body = { jsonrpc: "2.0", id, method };
  if (params !== undefined) body.params = params;
  return new Request(`${ORIGIN}/api/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

// --- registration ----------------------------------------------------------

let noAuth = await mcpPost(context(rpc("initialize", { protocolVersion: "2025-06-18" })));
check("initialize without key → 401", noAuth.status === 401, `got ${noAuth.status}`);
check("401 carries WWW-Authenticate", noAuth.headers.get("WWW-Authenticate")?.startsWith("Bearer"));

let reg = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "agent@example.com" }),
    }),
  ),
);
check("register JSON → 201", reg.status === 201, `got ${reg.status}`);
const regBody = await reg.json();
const KEY = regBody.apiKey;
check("register returns ecg_ key", typeof KEY === "string" && KEY.startsWith("ecg_") && KEY.length > 20);
check("register returns free quota 2 (env override)", regBody.monthlyCallQuota === 2, JSON.stringify(regBody));
check("register stores only hash", !JSON.stringify(database.prepare("SELECT * FROM mcp_users").all()).includes(KEY));

let dup = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "AGENT@example.com" }),
    }),
  ),
);
check("duplicate email (case-insensitive) → 409", dup.status === 409, `got ${dup.status}`);

let badEmail = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    }),
  ),
);
check("invalid email → 400", badEmail.status === 400);

let htmlReg = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=form-user@example.com",
    }),
  ),
);
check("register form post → 201 HTML", htmlReg.status === 201 && (htmlReg.headers.get("Content-Type") || "").startsWith("text/html"));
const htmlText = await htmlReg.text();
check("HTML register page shows key once", htmlText.includes("ecg_") && !htmlText.includes("<script"));

let wrongCt = await registerPost(
  context(new Request(`${ORIGIN}/api/mcp/register`, { method: "POST", headers: { "Content-Type": "text/plain" }, body: "x" })),
);
check("unsupported content type → 415", wrongCt.status === 415);

// --- protocol --------------------------------------------------------------

let badKey = await mcpPost(context(rpc("ping", undefined, "ecg_wrongkey")));
check("unknown key → 401", badKey.status === 401);

let init = await mcpPost(context(rpc("initialize", { protocolVersion: "2025-03-26" }, KEY)));
let initBody = await init.json();
check("initialize echoes supported protocolVersion", initBody.result?.protocolVersion === "2025-03-26");
check("initialize serverInfo", initBody.result?.serverInfo?.name === "entrycardguide");
check("initialize advertises tools capability", initBody.result?.capabilities?.tools);

init = await mcpPost(context(rpc("initialize", { protocolVersion: "1999-01-01" }, KEY, 2)));
initBody = await init.json();
check("initialize falls back on unknown protocolVersion", initBody.result?.protocolVersion === "2025-06-18");

let ping = await mcpPost(context(rpc("ping", undefined, KEY, 3)));
check("ping → empty result", (await ping.json()).result !== undefined);

let notif = await mcpPost(
  context(
    new Request(`${ORIGIN}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
    }),
  ),
);
check("notification → 202 empty", notif.status === 202);

let batch = await mcpPost(
  context(
    new Request(`${ORIGIN}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify([{ jsonrpc: "2.0", id: 20, method: "ping" }]),
    }),
  ),
);
check("batch array → -32600", (await batch.json()).error?.code === -32600);

let get = await mcpGet(context(new Request(`${ORIGIN}/api/mcp`, { method: "GET" })));
check("GET /api/mcp → 405", get.status === 405);
let del = await mcpDelete(context(new Request(`${ORIGIN}/api/mcp`, { method: "DELETE" })));
check("DELETE /api/mcp → 405", del.status === 405);

let badJson = await mcpPost(
  context(
    new Request(`${ORIGIN}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: "{not json",
    }),
  ),
);
check("unparseable body → 400", badJson.status === 400);

// --- tools -----------------------------------------------------------------

let toolList = await mcpPost(context(rpc("tools/list", undefined, KEY, 4)));
let toolListBody = await toolList.json();
const toolNames = toolListBody.result?.tools?.map((t) => t.name);
check(
  "tools/list has all five tools",
  JSON.stringify(toolNames) === JSON.stringify(["list_countries", "get_country_forms", "get_field_rules", "get_field_guide", "run_decision_tree"]),
  JSON.stringify(toolNames),
);
check("every tool has an inputSchema", toolListBody.result.tools.every((t) => t.inputSchema?.type === "object"));

let unknownTool = await mcpPost(context(rpc("tools/call", { name: "nope" }, KEY, 5)));
check("unknown tool → -32602", (await unknownTool.json()).error?.code === -32602);

// call 1 of quota 2: list_countries
let countries = await mcpPost(context(rpc("tools/call", { name: "list_countries", arguments: {} }, KEY, 6)));
let countriesBody = await countries.json();
const countriesPayload = JSON.parse(countriesBody.result.content[0].text);
check("list_countries returns 50 countries", countriesPayload.count === 50, `got ${countriesPayload.count}`);
check("list_countries includes thailand with official URL", countriesPayload.countries.some((c) => c.slug === "thailand" && c.officialUrl?.includes("go.th")));
check("list_countries carries license attribution", countriesPayload.source?.license?.includes("CC BY-SA"));
check("list_countries result is not an error", countriesBody.result.isError !== true);

// call 2 of quota 2: get_field_rules
let rules = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: "thailand" } }, KEY, 7)));
let rulesBody = await rules.json();
const rulesPayload = JSON.parse(rulesBody.result.content[0].text);
check("get_field_rules returns passport pattern", rulesPayload.fields?.passport?.pattern === "^[A-Z][A-Z0-9]{5,8}$");

// call 3 → over quota
let over = await mcpPost(context(rpc("tools/call", { name: "get_field_guide", arguments: { country: "thailand" } }, KEY, 8)));
let overBody = await over.json();
check("quota exhaustion → -32001 with usage data", overBody.error?.code === -32001 && overBody.error.data?.used === 2 && overBody.error.data?.limit === 2);

// tool-level validation errors under the low quota: the gate still runs first
let badCountryOver = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: "atlantis" } }, KEY, 9)));
check("quota gate precedes execution (blocked even for bad args)", (await badCountryOver.json()).error?.code === -32001);

// fresh key for non-quota tool tests (default free limit)
let reg2 = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "second@example.com" }),
    }),
    envDefault,
  ),
);
const KEY2 = (await reg2.json()).apiKey;

let badCountry = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: "atlantis" } }, KEY2, 10), envDefault));
let badCountryBody = await badCountry.json();
check(
  "unknown country → isError with slug list",
  badCountryBody.result?.isError === true && badCountryBody.result.content[0].text.includes("Unknown country") && badCountryBody.result.content[0].text.includes("thailand"),
);

let guide = await mcpPost(context(rpc("tools/call", { name: "get_field_guide", arguments: { country: "thailand", lang: "zh" } }, KEY2, 11), envDefault));
let guideBody = await guide.json();
const guidePayload = JSON.parse(guideBody.result.content[0].text);
check("get_field_guide zh returns Chinese copy", guidePayload.lang === "zh" && /护照/.test(guidePayload.fields[0].howToFill || ""));

let badLang = await mcpPost(context(rpc("tools/call", { name: "get_field_guide", arguments: { country: "thailand", lang: "fr" } }, KEY2, 12), envDefault));
check("invalid lang → isError", (await badLang.json()).result?.isError === true);

let forms = await mcpPost(context(rpc("tools/call", { name: "get_country_forms", arguments: { country: "thailand" } }, KEY2, 13), envDefault));
let formsBody = await forms.json();
const formsPayload = JSON.parse(formsBody.result.content[0].text);
check(
  "get_country_forms lists official links + changelog",
  Array.isArray(formsPayload.officialLinks) && formsPayload.officialLinks.length >= 1 && Array.isArray(formsPayload.recentChanges),
);
check(
  "get_country_forms excludes internal-only structures",
  !("scam_sites" in formsPayload) && !("outcomes" in formsPayload) && !("news" in formsPayload) && !formsPayload.officialLinks.some((f) => f.key === "meta" || !f.url),
);

// decision tree
let treeStart = await mcpPost(context(rpc("tools/call", { name: "run_decision_tree", arguments: { answers: [] } }, KEY2, 14), envDefault));
let treeStartBody = await treeStart.json();
const startPayload = JSON.parse(treeStartBody.result.content[0].text);
check("empty answers → opening question", startPayload.done === false && startPayload.nextQuestion.options.some((o) => o.value === "thailand"));

let treeTh = await mcpPost(context(rpc("tools/call", { name: "run_decision_tree", arguments: { answers: ["thailand"] } }, KEY2, 15), envDefault));
let treeThBody = await treeTh.json();
const thPayload = JSON.parse(treeThBody.result.content[0].text);
check("thailand path → TDAC result", thPayload.done === true && thPayload.summary.includes("TDAC") && thPayload.forms[0].url.includes("go.th"));

let treeBad = await mcpPost(context(rpc("tools/call", { name: "run_decision_tree", arguments: { answers: ["nonsense"] } }, KEY2, 16), envDefault));
let treeBadBody = await treeBad.json();
check("invalid option value → isError with valid values", treeBadBody.result?.isError === true && treeBadBody.result.content[0].text.includes("land"));

let multiStep = await mcpPost(context(rpc("tools/call", { name: "run_decision_tree", arguments: { answers: ["mexico"] } }, KEY2, 17), envDefault));
let multiStepBody = JSON.parse((await multiStep.json()).result.content[0].text);
check("mexico → follow-up question", multiStepBody.done === false && Array.isArray(multiStepBody.nextQuestion.options) && multiStepBody.nextQuestion.options.length >= 2);

// validation errors do not burn quota: fresh key under envQuota(2), one bad
// call, then the meter should still read zero
let reg3 = await registerPost(
  context(
    new Request(`${ORIGIN}/api/mcp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "quota-probe@example.com" }),
    }),
  ),
);
const KEY3 = (await reg3.json()).apiKey;
let probe = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: "atlantis" } }, KEY3, 21)));
check("probe call is a tool error", (await probe.json()).result?.isError === true);
let probeWho = await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`, { headers: { Authorization: `Bearer ${KEY3}` } })));
check("isError calls are not metered", (await probeWho.json()).quota?.used === 0);

// --- whoami ----------------------------------------------------------------

let whoami = await whoamiGet(
  context(new Request(`${ORIGIN}/api/mcp/whoami`, { headers: { Authorization: `Bearer ${KEY}` } })),
);
check("whoami → 200", whoami.status === 200);
let whoamiBody = await whoami.json();
check(
  "whoami reports quota 2/2 used",
  whoamiBody.quota?.used === 2 && whoamiBody.quota?.limit === 2 && whoamiBody.quota?.remaining === 0,
  JSON.stringify(whoamiBody.quota),
);
check("whoami breaks usage down by tool", whoamiBody.usedByTool?.some((row) => row.tool === "list_countries" && row.calls === 1));
check("whoami never exposes the key hash", !JSON.stringify(whoamiBody).includes("key_hash"));

let whoamiNoKey = await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`)));
check("whoami without key → 401", whoamiNoKey.status === 401);

// --- revocation ------------------------------------------------------------

database.exec("UPDATE mcp_users SET revoked = 1 WHERE email = 'second@example.com'");
let revokedCall = await mcpPost(context(rpc("ping", undefined, KEY2, 18)));
check("revoked key → 401", revokedCall.status === 401);

// --- unconfigured deployment ------------------------------------------------

let noDb = await mcpPost({ request: rpc("ping", undefined, KEY, 19), env: {}, next: async () => new Response(null, { status: 599 }) });
check("missing DB binding → 503 mcp_not_configured", noDb.status === 503 && (await noDb.json()).error === "mcp_not_configured");

// --- report ------------------------------------------------------------------

if (failures.length) {
  console.error(`FAIL (${failures.length}/${passed + failures.length}):\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log(`MCP tests passed: ${passed}/${passed + failures.length}`);
