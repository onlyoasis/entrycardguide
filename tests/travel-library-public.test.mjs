import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { projectPublicTravelLibrary, validatePublicTravelLibrary } from "../scripts/travel-library-public.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = process.env.TRAVEL_LIBRARY_TEST_ROOT || "/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912/worker-snapshot";
if (!process.env.TRAVEL_LIBRARY_TEST_ROOT) {
  assert.equal(existsSync("/Volumes/ExternalPrivate/Runtime/entrycardguide/data-protection-20260912"), true, "External test volume must be available");
}
mkdirSync(scratch, { recursive: true });

function research() {
  return {
    jurisdictions: [{ id: "JP", name_en: "Japan", name_zh: "日本", m49: "392", region: "Asia", source: "m49", existing_site_key: "japan", research_status: "researched", records_file: "records/JP.json", private_note: "INTERNAL_CANARY" }],
    records: [{
      jurisdiction_id: "JP", review_status: "verified", researched_at: "2026-09-10",
      procedures: [{ id: "jp-customs", type: "customs_declaration", name_en: "Customs declaration", name_zh: "海关申报", agency: "Japan Customs", official_url: "https://www.customs.go.jp/english/", channel: "online", applicability_en: "Arriving travellers", applicability_zh: "入境旅客", timing_en: "On arrival", timing_zh: "入境时", fee: { amount: 0, currency: "JPY", note: "Free", internal_note: "INTERNAL_CANARY" }, source_ids: ["jp-customs-source"], verified_at: "2026-09-10", internal_note: "INTERNAL_CANARY" }],
      sources: [{ id: "jp-customs-source", url: "https://www.customs.go.jp/english/", title: "Japan Customs", publisher: "Japan Customs", retrieved_at: "2026-09-10", evidence_excerpt: "Declare your goods on arrival.", supports: ["jp-customs"], access_status: "ok", private_note: "INTERNAL_CANARY" }, { id: "jp-unused-source", url: "https://www.customs.go.jp/", title: "Unused research source", publisher: "Japan Customs", retrieved_at: "2026-09-10", evidence_excerpt: "", supports: [], access_status: "failed" }],
      unresolved: [], private_note: "INTERNAL_CANARY"
    }]
  };
}

function snapshot() {
  const { jurisdictions, records } = research();
  return projectPublicTravelLibrary(jurisdictions, records, ["JP"]);
}

function fixture() {
  const folder = mkdtempSync(join(scratch, "fixture-"));
  const { jurisdictions, records } = research();
  const researchDir = join(folder, "data", "travel_library");
  mkdirSync(join(researchDir, "records"), { recursive: true });
  writeFileSync(join(researchDir, "jurisdictions.json"), JSON.stringify({ schema_version: 1, retrieved_at: "2026-09-10", scope_source: { name: "UN M49", url: "https://unstats.un.org/unsd/methodology/m49/" }, jurisdictions }));
  writeFileSync(join(researchDir, "records", "JP.json"), JSON.stringify(records[0]));
  return folder;
}

function cli(script, args = [], cwd = root) {
  return spawnSync(process.execPath, [join(root, "scripts", script), ...args], { cwd, encoding: "utf8" });
}

test("projection keeps public citations and removes internal and newly added research fields", () => {
  const result = snapshot();
  assert.equal(result.schema_version, 1);
  assert.deepEqual(result.jurisdictions, [{ id: "JP", name_en: "Japan", name_zh: "日本", region: "Asia", existing_site_key: "japan" }]);
  assert.deepEqual(result.records[0].sources, [{ id: "jp-customs-source", url: "https://www.customs.go.jp/english/", title: "Japan Customs", publisher: "Japan Customs" }]);
  assert.deepEqual(result.records[0].procedures[0].fee, { amount: 0, currency: "JPY", note: "Free" });
  assert.deepEqual(result.records[0].procedures[0].source_ids, ["jp-customs-source"]);
  assert.doesNotMatch(JSON.stringify(result), /INTERNAL_CANARY|evidence_excerpt|supports|unresolved|access_status|retrieved_at/);
  assert.deepEqual(validatePublicTravelLibrary(result), []);
});

test("projection requires explicit existing verified selections with verified procedures", () => {
  const { jurisdictions, records } = research();
  for (const ids of [[], undefined, ["XX"], ["JP", "JP"]]) {
    assert.throws(() => projectPublicTravelLibrary(jurisdictions, records, ids));
  }
  assert.throws(() => projectPublicTravelLibrary(jurisdictions, [], ["JP"]), /JP/);
  records[0].review_status = "partial";
  assert.throws(() => projectPublicTravelLibrary(jurisdictions, records, ["JP"]), /verified/);
  records[0].review_status = "verified";
  records[0].procedures[0].verified_at = null;
  assert.throws(() => projectPublicTravelLibrary(jurisdictions, records, ["JP"]), /verified_at/);
});

test("public validation rejects unknown keys at every boundary with a field location", () => {
  const insertions = [
    ["private_note", (s) => { s.private_note = "private"; }],
    ["jurisdictions[0].records_file", (s) => { s.jurisdictions[0].records_file = "records/JP.json"; }],
    ["records[0].unresolved", (s) => { s.records[0].unresolved = []; }],
    ["records[0].procedures[0].evidence_excerpt", (s) => { s.records[0].procedures[0].evidence_excerpt = "private"; }],
    ["records[0].procedures[0].fee.private_note", (s) => { s.records[0].procedures[0].fee.private_note = "private"; }],
    ["records[0].sources[0].access_status", (s) => { s.records[0].sources[0].access_status = "ok"; }]
  ];
  for (const [location, insert] of insertions) {
    const result = snapshot();
    insert(result);
    assert.ok(validatePublicTravelLibrary(result).some((error) => error.includes(location)), location);
  }
});

test("public validation rejects unverified status, invalid dates and missing citation references", () => {
  const cases = [
    ["review_status", (s) => { s.records[0].review_status = "partial"; }],
    ["verified_at", (s) => { s.records[0].procedures[0].verified_at = null; }],
    ["researched_at", (s) => { s.records[0].researched_at = "2026-02-31"; }],
    ["source_ids", (s) => { s.records[0].procedures[0].source_ids = ["missing"]; }],
    ["official_url", (s) => { s.records[0].procedures[0].official_url = "javascript:alert(1)"; }],
    ["jurisdiction_id", (s) => { s.records[0].jurisdiction_id = "ZZ"; }],
    ["id", (s) => { s.jurisdictions.push(s.jurisdictions[0]); }],
    ["procedures", (s) => { s.records[0].procedures = []; }]
  ];
  for (const [location, mutate] of cases) {
    const result = snapshot();
    mutate(result);
    assert.ok(validatePublicTravelLibrary(result).some((error) => error.includes(location)), location);
  }
  assert.deepEqual(validatePublicTravelLibrary({ schema_version: 1, jurisdictions: [], records: [] }), []);
});

test("public scalar strings cannot carry local filesystem paths through allowed fields", () => {
  const cases = [
    ["records[0].procedures[0].fee.note", (s) => { s.records[0].procedures[0].fee.note = "研究文件：/Volumes/ExternalPrivate/research.json"; }],
    ["records[0].procedures[0].agency", (s) => { s.records[0].procedures[0].agency = "/Users/lzc/research/agency.txt"; }],
    ["records[0].sources[0].title", (s) => { s.records[0].sources[0].title = "Source file://local/research.html"; }]
  ];
  for (const [location, mutate] of cases) {
    const publicSnapshot = snapshot();
    mutate(publicSnapshot);
    assert.ok(validatePublicTravelLibrary(publicSnapshot).some((error) => error.includes(location) && error.includes("local filesystem path")), location);
    const privateResearch = research();
    mutate(privateResearch);
    assert.throws(() => projectPublicTravelLibrary(privateResearch.jurisdictions, privateResearch.records, ["JP"]), (error) => error.message.includes(location) && error.message.includes("local filesystem path"));
  }
});

test("export CLI refuses absent ids without overwriting an existing snapshot", () => {
  const folder = fixture();
  const output = join(folder, "data", "travel_library_public.json");
  writeFileSync(output, "prior snapshot\n");
  for (const args of [[], ["--ids", ""], ["--ids", "XX"]]) {
    const result = cli("export-public-travel-library.mjs", ["--root", folder, ...args]);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(output, "utf8"), "prior snapshot\n");
  }
});

test("export CLI invokes the actual research validator before publishing", () => {
  const folder = fixture();
  const recordPath = join(folder, "data", "travel_library", "records", "JP.json");
  const record = JSON.parse(readFileSync(recordPath, "utf8"));
  record.sources[0].supports = [];
  writeFileSync(recordPath, JSON.stringify(record));
  const result = cli("export-public-travel-library.mjs", ["--root", folder, "--ids", "JP"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /no single cited 'ok' source/);
  assert.equal(existsSync(join(folder, "data", "travel_library_public.json")), false);
});

test("export and check CLIs publish a selected snapshot and fail on manual private fields", () => {
  const folder = fixture();
  const output = join(folder, "data", "travel_library_public.json");
  const result = cli("export-public-travel-library.mjs", ["--root", folder, "--ids", "JP", "--output", output]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(readFileSync(output, "utf8"), /INTERNAL_CANARY|evidence_excerpt/);
  assert.equal(cli("check-public-travel-library.mjs", [], folder).status, 0);
  const publicSnapshot = JSON.parse(readFileSync(output, "utf8"));
  publicSnapshot.records[0].unresolved = [];
  writeFileSync(output, JSON.stringify(publicSnapshot));
  const invalid = cli("check-public-travel-library.mjs", ["--root", folder]);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /records\[0\]\.unresolved/);
  assert.deepEqual(readdirSync(join(folder, "data")).sort(), ["travel_library", "travel_library_public.json"]);
});
