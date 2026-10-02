#!/usr/bin/env node
// Route and protocol regression tests, using the real migrations and SQL.
// Accounts and explicit grants are fixtures; OTP/login have a separate suite.
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateKey, sha256Hex } from "../functions/_mcp/auth.js";
import { currentPeriod, planLimit } from "../functions/_mcp/quota.js";
import { onRequestPost as mcpPost, onRequestGet as mcpGet, onRequestDelete as mcpDelete } from "../functions/api/mcp/index.js";
import { onRequestGet as whoamiGet } from "../functions/api/mcp/whoami.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const database = new DatabaseSync(":memory:");
database.exec("PRAGMA foreign_keys = ON");
for (const migration of readdirSync(path.join(ROOT, "migrations")).filter((name) => name.endsWith(".sql")).sort()) {
  database.exec(readFileSync(path.join(ROOT, "migrations", migration), "utf8"));
}
class D1Statement {
  constructor(sql) { this.statement = database.prepare(sql); this.args = []; }
  bind(...args) { this.args = args; return this; }
  async first() { return this.statement.get(...this.args) ?? null; }
  async all() { return { results: this.statement.all(...this.args) }; }
  async run() { const row = this.statement.run(...this.args); return { success: true, meta: { changes: row.changes } }; }
}
const db = { prepare: (sql) => new D1Statement(sql) };
const envDefault = { DB: db };
const ORIGIN = "https://entrycardguide.com";
const BASE_HEADERS = { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18" };
const context = (request, env = envDefault) => ({ request, env });
let passed = 0;
function check(name, condition, detail = "") { assert.ok(condition, `${name}${detail ? `: ${detail}` : ""}`); passed++; }
function request(body, key, extra = {}) {
  const headers = { ...BASE_HEADERS, ...(key ? { Authorization: `Bearer ${key}` } : {}), ...extra.headers };
  for (const name of Object.keys(headers)) if (headers[name] === null) delete headers[name];
  return new Request(`${ORIGIN}/api/mcp`, { method: "POST", headers, body: extra.raw === undefined ? JSON.stringify(body) : extra.raw });
}
function rpc(method, params, key, id = 1, extra) {
  return request({ jsonrpc: "2.0", id, method, ...(params === undefined ? {} : { params }) }, key, extra);
}
const initParams = { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "regression-client", version: "1" } };
async function fixture(options = {}) {
  const id = options.userId ?? crypto.randomUUID();
  const now = Date.now();
  if (!options.userId) database.prepare(`INSERT INTO mcp_users
    (id,email,key_hash,key_prefix,plan,created_at,revoked,verified_at) VALUES (?,?,?,?,'free',?,0,?)`)
    .run(id, `${id}@example.com`, `retired:${id}`, "retired", now, options.verified === false ? null : now);
  const key = await generateKey();
  const grantId = crypto.randomUUID();
  database.prepare(`INSERT INTO mcp_grants (id,user_id,key_hash,key_prefix,scope,created_at,expires_at,revoked_at)
    VALUES (?,?,?,?,?,?,?,?)`).run(grantId, id, await sha256Hex(key), key.slice(0, 10), options.scope ?? "mcp:read", now,
      options.expiresAt ?? now + 3600000, options.revokedAt ?? null);
  return { id, key, grantId };
}
const usage = (userId) => database.prepare("SELECT COUNT(*) AS n FROM mcp_usage WHERE user_id = ?").get(userId).n;
const first = await fixture();
const KEY = first.key;

let response = await mcpPost(context(rpc("initialize", initParams)));
check("missing Bearer key is unauthorized", response.status === 401);
check("401 advertises Bearer authentication", response.headers.get("WWW-Authenticate")?.startsWith("Bearer"));
response = await mcpPost(context(rpc("ping", undefined, "ecg_invalid")));
check("unknown key is unauthorized", response.status === 401);
response = await mcpPost(context(rpc("ping", undefined, undefined, 1, { headers: { Cookie: "ecg_session=browser-session" } })));
check("browser login cookie cannot authorize MCP", response.status === 401);
const expired = await fixture({ expiresAt: Date.now() - 1 });
check("expired grant cannot initialize", (await mcpPost(context(rpc("initialize", initParams, expired.key)))).status === 401);
const revoked = await fixture({ revokedAt: Date.now() });
check("revoked grant cannot ping", (await mcpPost(context(rpc("ping", undefined, revoked.key)))).status === 401);
const unverified = await fixture({ verified: false });
check("unverified account cannot use grant", (await mcpPost(context(rpc("ping", undefined, unverified.key)))).status === 401);
const disabled = await fixture();
database.prepare("UPDATE mcp_users SET revoked=1 WHERE id=?").run(disabled.id);
check("disabled account cannot use an otherwise active grant", (await mcpPost(context(rpc("ping", undefined, disabled.key)))).status === 401);
const legacyKey = await generateKey();
database.prepare("UPDATE mcp_users SET key_hash=? WHERE id=?").run(await sha256Hex(legacyKey), first.id);
check("retired user-level key cannot authorize MCP", (await mcpPost(context(rpc("ping", undefined, legacyKey)))).status === 401);
check("stored grant contains no plaintext key", !JSON.stringify(database.prepare("SELECT * FROM mcp_grants").all()).includes(KEY));

response = await mcpPost(context(rpc("initialize", initParams, KEY)));
let body = await response.json();
check("initialize returns negotiated version", body.result?.protocolVersion === "2025-06-18");
check("initialize returns serverInfo and tools capability", body.result?.serverInfo?.name === "entrycardguide" && body.result.capabilities.tools);
response = await mcpPost(context(rpc("initialize", { ...initParams, protocolVersion: "unknown" }, KEY)));
check("initialize negotiates an unknown requested version", (await response.json()).result?.protocolVersion === "2025-06-18");
response = await mcpPost(context(rpc("ping", undefined, KEY, "string-id")));
check("string id survives response", (await response.json()).id === "string-id");
response = await mcpPost(context(rpc("ping", undefined, KEY, 0, { headers: { "MCP-Protocol-Version": null } })));
check("missing protocol header supports older native clients", response.status === 200);
response = await mcpPost(context(request({ jsonrpc: "2.0", method: "notifications/initialized" }, KEY)));
check("initialized notification returns empty 202", response.status === 202 && await response.text() === "");
for (const id of [null, {}, [], true, 1.5, "", "i".repeat(129)]) {
  response = await mcpPost(context(rpc("ping", undefined, KEY, id)));
  check(`invalid request id (${typeof id}) is rejected`, (await response.json()).error?.code === -32600);
}
for (const message of [[], null, { jsonrpc: "1.0", id: 1, method: "ping" }, { jsonrpc: "2.0", id: 1, method: "ping", extra: true }]) {
  check("invalid envelope is rejected", (await (await mcpPost(context(request(message, KEY)))).json()).error?.code === -32600);
}
response = await mcpPost(context(request({ jsonrpc: "2.0", method: "tools/call", params: { name: "list_countries" } }, KEY)));
check("tools/call cannot masquerade as a notification", response.status === 400 && usage(first.id) === 0);
response = await mcpPost(context(rpc("notifications/initialized", {}, KEY)));
check("notification with id is rejected", (await response.json()).error?.code === -32600);
response = await mcpPost(context(rpc("made/up", {}, KEY)));
check("unknown method returns method-not-found", (await response.json()).error?.code === -32601);
for (const [method, params] of [["initialize", { protocolVersion: "2025-06-18" }], ["ping", []], ["ping", { unexpected: 1 }], ["tools/list", null], ["tools/call", { name: 1 }], ["tools/call", { name: "list_countries", extra: 1 }]]) {
  response = await mcpPost(context(rpc(method, params, KEY)));
  check(`invalid ${method} params rejected`, (await response.json()).error?.code === -32602);
}

for (const [headers, status] of [
  [{ Origin: "https://attacker.example" }, 403], [{ Origin: "null" }, 403],
  [{ "Content-Type": "text/plain" }, 415], [{ "Content-Type": "application/json; charset=latin1" }, 415],
  [{ Accept: null }, 406], [{ Accept: "text/event-stream" }, 406], [{ Accept: "application/json;q=0, text/event-stream" }, 406],
  [{ "MCP-Protocol-Version": "2024-11-05" }, 400], [{ "Content-Length": "bad" }, 400], [{ "Content-Length": "99999" }, 413],
]) {
  response = await mcpPost(context(rpc("ping", undefined, KEY, 1, { headers })));
  check(`invalid transport returns ${status}`, response.status === status);
}
response = await mcpPost(context(rpc("ping", undefined, KEY, 1, { headers: { Origin: ORIGIN } })));
check("same-origin browser request is allowed", response.status === 200);
response = await mcpPost(context(request({}, KEY, { raw: "{invalid" })));
check("malformed JSON returns 400", response.status === 400);
response = await mcpPost(context(request({}, KEY, { raw: new Uint8Array([0xff, 0xfe]) })));
check("invalid UTF-8 is rejected", response.status === 400);
response = await mcpPost(context(request({}, KEY, { raw: JSON.stringify({ padding: "x".repeat(17000) }) })));
check("stream body is bounded without Content-Length", response.status === 413);
check("GET endpoint returns 405", (await mcpGet(context(new Request(`${ORIGIN}/api/mcp`)))).status === 405);
check("DELETE endpoint returns 405", (await mcpDelete(context(new Request(`${ORIGIN}/api/mcp`, { method: "DELETE" })))).status === 405);
check("foreign Origin on GET rejected", (await mcpGet(context(new Request(`${ORIGIN}/api/mcp`, { headers: { Origin: "https://attacker.example" } })))).status === 403);

response = await mcpPost(context(rpc("tools/list", undefined, KEY)));
body = await response.json();
const requiredTools = ["list_countries", "get_country_forms", "get_field_rules", "get_field_guide", "run_decision_tree"];
check("existing guide tools remain available", requiredTools.every((name) => body.result.tools.some((tool) => tool.name === name)));
check("tool schemas are declared", body.result.tools.every((tool) => tool.inputSchema?.type === "object"));
for (const [name, args] of [
  ["list_countries", []], ["list_countries", null], ["list_countries", "thailand"], ["list_countries", { unknown: true }],
  ["get_country_forms", {}], ["get_country_forms", { country: 123 }], ["get_country_forms", { country: "a".repeat(65) }],
  ["get_field_rules", { country: "thailand", extra: true }],
  ["get_field_guide", { country: "thailand", lang: "toString" }], ["get_field_guide", { country: "thailand", lang: "fr" }],
  ["run_decision_tree", { answers: "thailand" }], ["run_decision_tree", { answers: [1] }],
  ["run_decision_tree", { answers: ["x".repeat(129)] }], ["run_decision_tree", { answers: Array(33).fill("thailand") }],
]) {
  response = await mcpPost(context(rpc("tools/call", { name, arguments: args }, KEY)));
  check(`invalid ${name} schema rejected`, (await response.json()).error?.code === -32602);
}
check("transport, envelope, and schema failures do not consume quota", usage(first.id) === 0);
response = await mcpPost(context(rpc("tools/call", { name: "unknown" }, KEY)));
check("unknown tool rejected", (await response.json()).error?.code === -32602);
response = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: "atlantis" } }, KEY)));
check("unknown country is a tool error", (await response.json()).result?.isError === true);
response = await mcpPost(context(rpc("tools/call", { name: "run_decision_tree", arguments: { answers: ["thailand", "extra"] } }, KEY)));
check("extra answer after final decision is rejected", (await response.json()).result?.isError === true);
check("business validation errors do not consume quota", usage(first.id) === 0);

async function tool(name, args, key = KEY, env = envDefault) {
  const response = await mcpPost(context(rpc("tools/call", { name, arguments: args }, key), env));
  const body = await response.json();
  check(`${name} succeeds`, response.status === 200 && body.result?.isError !== true && body.result?.content?.[0]?.type === "text");
  return JSON.parse(body.result.content[0].text);
}
let payload = await tool("list_countries", {});
check("country list includes existing guide destinations", payload.count >= 50 && payload.countries.some((country) => country.slug === "thailand" || country.iso2 === "TH"));
check("list countries provides attribution", payload.source?.license?.includes("CC BY-SA"));
payload = await tool("get_field_rules", { country: "thailand" });
check("Thailand passport constraint preserved", payload.fields.passport.pattern === "^[A-Z][A-Z0-9]{5,8}$");
check("field rules identify validation mode", payload.validationMode === "field_rules");
payload = await tool("get_field_guide", { country: "thailand", lang: "zh" });
check("Chinese field guide preserved", payload.lang === "zh" && /护照/.test(payload.fields[0].howToFill || ""));
payload = await tool("get_field_guide", { country: "thailand", lang: "zh-hant" });
check("traditional Chinese field guide preserved", payload.lang === "zh-hant" && /護照/.test(payload.fields[0].howToFill || ""));
payload = await tool("get_country_forms", { country: "thailand" });
check("country forms carry official links and changelog", payload.officialLinks.some((link) => link.url.includes("go.th")) && Array.isArray(payload.recentChanges));
check("country forms exclude internal blocks", !["scam_sites", "outcomes", "news"].some((key) => key in payload));
payload = await tool("run_decision_tree", { answers: [] });
check("empty answers returns opening question", payload.done === false && payload.nextQuestion.options.some((option) => option.value === "thailand"));
payload = await tool("run_decision_tree", { answers: ["thailand"] });
check("Thailand decision returns official TDAC", payload.done === true && payload.summary.includes("TDAC") && payload.forms[0].url.includes("go.th"));
payload = await tool("run_decision_tree", { answers: ["mexico"] });
check("Mexico decision returns follow-up", payload.done === false && payload.nextQuestion.options.length >= 2);

const limited = await fixture();
const otherGrant = await fixture({ userId: limited.id });
const envQuota = { DB: db, MCP_FREE_MONTHLY_CALLS: "2" };
await tool("list_countries", {}, limited.key, envQuota);
await tool("get_country_forms", { country: "thailand" }, otherGrant.key, envQuota);
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, limited.key), envQuota));
body = await response.json();
check("quota exhaustion is HTTP 429 with actual usage", response.status === 429 && body.error?.code === -32001 && body.error.data.used === 2 && body.error.data.limit === 2);
check("multiple grants share one account quota", usage(limited.id) === 2);
response = await mcpPost(context(rpc("tools/call", { name: "get_field_rules", arguments: { country: 1 } }, limited.key), envQuota));
check("schema errors still return validation failure at exhausted quota", (await response.json()).error?.code === -32602 && usage(limited.id) === 2);
const parallel = await fixture();
const concurrent = await Promise.all(Array.from({ length: 8 }, () => mcpPost(context(rpc("tools/call", { name: "list_countries" }, parallel.key), { DB: db, MCP_FREE_MONTHLY_CALLS: "1" }))));
check("parallel calls admit exactly one success", concurrent.filter((item) => item.status === 200).length === 1 && concurrent.filter((item) => item.status === 429).length === 7);
check("parallel calls consume exactly one usage row", usage(parallel.id) === 1);
const racingGrant = await fixture();
let revokedDuringCall = false;
const revokeDuringMeterDb = { prepare(sql) {
  if (sql.startsWith("INSERT INTO mcp_usage") && !revokedDuringCall) {
    revokedDuringCall = true;
    database.prepare("UPDATE mcp_grants SET revoked_at=? WHERE id=?").run(Date.now(), racingGrant.grantId);
  }
  return db.prepare(sql);
} };
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, racingGrant.key), { DB: revokeDuringMeterDb }));
check("grant revoked between authentication and metering cannot return data", response.status === 401 && usage(racingGrant.id) === 0);
const racingPlan = await fixture();
database.prepare("UPDATE mcp_users SET plan='pro' WHERE id=?").run(racingPlan.id);
let downgradedDuringCall = false;
const downgradeDuringMeterDb = { prepare(sql) {
  if (sql.startsWith("INSERT INTO mcp_usage") && !downgradedDuringCall) {
    downgradedDuringCall = true;
    database.prepare("UPDATE mcp_users SET plan='free' WHERE id=?").run(racingPlan.id);
  }
  return db.prepare(sql);
} };
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, racingPlan.key), { DB: downgradeDuringMeterDb }));
check("plan changed between authentication and metering cannot use stale limit", response.status === 401 && usage(racingPlan.id) === 0);
const zero = await fixture();
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, zero.key), { DB: db, MCP_FREE_MONTHLY_CALLS: "0" }));
check("zero quota denies successful reads", response.status === 429 && usage(zero.id) === 0);
const unlimited = await fixture();
database.prepare("UPDATE mcp_users SET plan='enterprise' WHERE id=?").run(unlimited.id);
await tool("list_countries", {}, unlimited.key);
check("unlimited plan still records successful calls", usage(unlimited.id) === 1);
const unknownPlan = await fixture();
database.prepare("UPDATE mcp_users SET plan='constructor' WHERE id=?").run(unknownPlan.id);
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, unknownPlan.key)));
check("unknown plan fails closed", response.status === 503 && usage(unknownPlan.id) === 0);
response = await mcpPost(context(rpc("tools/call", { name: "list_countries" }, KEY), { DB: db, MCP_FREE_MONTHLY_CALLS: "100junk" }));
check("invalid quota override fails closed", response.status === 503);
check("UTC month period is stable", currentPeriod(new Date("2026-10-01T00:00:00Z")) === "2026-10");
check("known plan limits preserved", planLimit({}, "free") === 100 && planLimit({}, "pro") === 10000 && planLimit({}, "enterprise") === null);

response = await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`, { headers: { Authorization: `Bearer ${limited.key}` } }), envQuota));
body = await response.json();
check("whoami reports account usage and active authorization", response.status === 200 && body.quota.used === 2 && body.quota.remaining === 0 && body.authorization.scope === "mcp:read");
check("whoami reports tool usage", body.usedByTool.some((item) => item.tool === "list_countries" && item.calls === 1));
check("whoami reveals no credential hash", !JSON.stringify(body).includes("key_hash"));
check("whoami and MCP responses prevent caching", response.headers.get("Cache-Control") === "no-store");
check("whoami without Bearer is unauthorized", (await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`)))).status === 401);
database.prepare("UPDATE mcp_grants SET revoked_at=? WHERE id=?").run(Date.now(), first.grantId);
check("revoked active fixture is immediately denied", (await mcpPost(context(rpc("ping", undefined, KEY)))).status === 401);
check("revoked grant cannot query whoami", (await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`, { headers: { Authorization: `Bearer ${KEY}` } })))).status === 401);
const noDbResponse = await mcpPost(context(rpc("ping", undefined, limited.key), {}));
check("missing binding returns 503", noDbResponse.status === 503 && (await noDbResponse.json()).error === "mcp_not_configured");
const brokenDb = { prepare() { throw new Error("SECRET SQLITE internal table detail"); } };
response = await mcpPost(context(rpc("ping", undefined, limited.key), { DB: brokenDb }));
check("database failure returns safe 503", response.status === 503 && !(await response.text()).includes("SQLITE"));
response = await whoamiGet(context(new Request(`${ORIGIN}/api/mcp/whoami`, { headers: { Authorization: `Bearer ${limited.key}` } }), { DB: brokenDb }));
check("whoami database failure returns safe 503", response.status === 503 && !(await response.text()).includes("SQLITE"));

// The global MCP contract exposes exactly the website's public projection.
const publicLibrary = JSON.parse(readFileSync(path.join(ROOT, "data/travel_library_public.json"), "utf8"));
const globalUser = await fixture();
database.prepare("UPDATE mcp_users SET plan='enterprise' WHERE id=?").run(globalUser.id);
payload = await tool("list_countries", {}, globalUser.key);
check("all 249 destinations available without duplicate ISO2 IDs", payload.count === 249 && payload.countries.length === 249 && new Set(payload.countries.map(item => item.iso2)).size === 249);
check("53 detailed country guides remain available", payload.detailedGuideCount === 53 && payload.countries.filter(item => item.guide).length === 53);
for (const [args, expected] of [[{}, -32602], [{ id: "th" }, -32602], [{ id: "TH", extra: true }, -32602], [{ id: 42 }, -32602]]) {
  response = await mcpPost(context(rpc("tools/call", { name: "get_jurisdiction", arguments: args }, globalUser.key)));
  check("global tool validates ID and rejects unknown properties", (await response.json()).error?.code === expected);
}
check("invalid global arguments do not consume quota", usage(globalUser.id) === 1);
response = await mcpPost(context(rpc("tools/call", { name: "get_jurisdiction", arguments: { id: "ZZ" } }, globalUser.key)));
check("unknown valid-format ISO2 ID is rejected", (await response.json()).result?.isError === true && usage(globalUser.id) === 1);
for (const destination of publicLibrary.jurisdictions) {
  payload = await tool("get_jurisdiction", { id: destination.id }, globalUser.key);
  assert.deepEqual(payload.jurisdiction, destination);
  assert.deepEqual(payload.record, publicLibrary.records.find(record => record.jurisdiction_id === destination.id));
  check(`${destination.id} MCP matches public projection without private fields`, !/"(?:evidence_excerpt|access_status|unresolved|supports)"\s*:|\/Users\/|\/Volumes\//.test(JSON.stringify(payload)));
  if (payload.record.review_status === "blocked") check(`${destination.id} blocked record cannot publish requirements`, payload.record.procedures.length === 0);
}
check("every successful global read is metered", usage(globalUser.id) === 250);
for (const country of ["china", "nigeria", "south-africa"]) {
  payload = await tool("get_field_rules", { country }, globalUser.key);
  check(`${country} preparation data does not claim executable validation`, payload.validationMode === "examples_only");
}

console.log(`MCP tests passed: ${passed}/${passed}`);
