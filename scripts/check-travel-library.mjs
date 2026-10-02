#!/usr/bin/env node
// Structural validator for data/travel_library/.
// Usage: node scripts/check-travel-library.mjs [rootDir]
//   rootDir defaults to the repo root; it must contain
//   data/travel_library/jurisdictions.json and data/travel_library/records/.
// Exits 1 with a list of violations on any failure.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.argv[2]
  ? process.argv[2]
  : join(dirname(fileURLToPath(import.meta.url)), "..");
const libDir = join(root, "data", "travel_library");
const recordsDir = join(libDir, "records");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TYPES = ["customs_declaration", "arrival_card", "health_declaration", "travel_authorization", "visa"];
const CHANNELS = ["online", "paper", "on_arrival", "on_departure", "conditional", "unknown"];
const REVIEW_STATUS = ["verified", "partial", "blocked"];
const ACCESS_STATUS = ["ok", "failed", "unknown"];
const RESEARCH_STATUS = ["existing_destination", "researched", "not_researched"];

const errors = [];
const error = (msg) => errors.push(msg);

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function isDateOrNull(v) {
  return v === null || validDateLiteral(v);
}
// Round-trip through Date rejects impossible calendar dates (2026-02-31),
// which pass a regex and Date.parse in some engines.
function validDateLiteral(v) {
  if (typeof v !== "string" || !DATE_RE.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  // An impossible calendar date yields an invalid Date whose toISOString()
  // throws RangeError; treat that as invalid rather than crashing.
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
function isHttpUrl(v) {
  return typeof v === "string" && /^https?:\/\//.test(v);
}

// Valid fee: the string "unknown", or an object with numeric amount >= 0
// and a non-empty currency code (optionally a note string).
function validFee(v) {
  if (v === "unknown") return true;
  if (isPlainObject(v)) {
    return (
      (typeof v.amount === "number" && Number.isFinite(v.amount) && v.amount >= 0) ||
      v.amount === null
    ) && isNonEmptyString(v.currency)
      && (v.note === undefined || typeof v.note === "string");
  }
  return false;
}

function parseJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    error(`${rel(file)}: not valid JSON (${e.message})`);
    return null;
  }
}
function rel(file) {
  return file.startsWith(root) ? file.slice(root.length + 1) : file;
}

// ---------- jurisdictions.json ----------
const jurisFile = join(libDir, "jurisdictions.json");
if (!existsSync(jurisFile)) {
  error("data/travel_library/jurisdictions.json missing");
} else {
  const juris = parseJson(jurisFile);
  if (juris) {
    if (!Number.isInteger(juris.schema_version)) error("jurisdictions.json: schema_version must be an integer");
    if (!validDateLiteral(juris.retrieved_at)) error("jurisdictions.json: retrieved_at must be YYYY-MM-DD");
    if (!isPlainObject(juris.scope_source) || !isNonEmptyString(juris.scope_source.name) || !isHttpUrl(juris.scope_source.url || "")) {
      error("jurisdictions.json: scope_source must have name and url");
    }
    if (!Array.isArray(juris.jurisdictions) || juris.jurisdictions.length === 0) {
      error("jurisdictions.json: jurisdictions must be a non-empty array");
    }
  }
}

// ---------- per-jurisdiction and record checks ----------
const jurisIds = new Set();
const siteKeys = new Set();
const referencedRecords = new Map(); // records file -> jurisdiction id
const globalProcedureIds = new Map(); // procedure id -> file

const jurisRaw = existsSync(jurisFile) ? parseJson(jurisFile) : null;
const jurisList = jurisRaw && Array.isArray(jurisRaw.jurisdictions) ? jurisRaw.jurisdictions : [];

for (const j of jurisList) {
  const where = `jurisdictions.json [${j && j.id}]`;
  if (!isPlainObject(j)) { error(`${where}: not an object`); continue; }
  if (!/^[A-Z]{2}$/.test(j.id || "")) error(`${where}: id must be ISO alpha-2 style (two uppercase letters)`);
  if (jurisIds.has(j.id)) error(`${where}: duplicate jurisdiction id`);
  jurisIds.add(j.id);
  for (const f of ["name_en", "name_zh"]) {
    if (!isNonEmptyString(j[f])) error(`${where}: ${f} must be a non-empty string`);
  }
  if (j.m49 !== null && !/^\d{3}$/.test(String(j.m49))) error(`${where}: m49 must be a 3-digit code or null`);
  if (!isNonEmptyString(j.region)) error(`${where}: region must be a non-empty string`);
  if (j.m49 === null && j.source === "m49") error(`${where}: source 'm49' requires an m49 code`);
  if (j.source === "site_destination_not_in_m49_snapshot" && j.m49 !== null) {
    error(`${where}: non-M49 entry must not carry an m49 code`);
  }
  if (j.existing_site_key !== null && !isNonEmptyString(j.existing_site_key)) {
    error(`${where}: existing_site_key must be a non-empty string or null`);
  }
  if (j.existing_site_key) {
    if (siteKeys.has(j.existing_site_key)) {
      error(`${where}: duplicate existing_site_key '${j.existing_site_key}'`);
    }
    siteKeys.add(j.existing_site_key);
  }
  if (!RESEARCH_STATUS.includes(j.research_status)) error(`${where}: research_status must be one of ${RESEARCH_STATUS.join(", ")}`);
  if (j.research_status === "researched" && j.records_file !== `records/${j.id}.json`) {
    error(`${where}: research_status 'researched' requires records_file records/${j.id}.json`);
  }
  if (j.records_file !== null) {
    if (referencedRecords.has(j.records_file)) error(`${where}: records_file ${j.records_file} referenced by more than one jurisdiction`);
    referencedRecords.set(j.records_file, j.id);
    const rf = join(libDir, j.records_file);
    if (!existsSync(rf) || !statSync(rf).isFile()) error(`${where}: records_file ${j.records_file} does not exist`);
  }
}

// Every existing_site_key must be a real roster key. The roster is resolved
// from the script's own location (not the data root) so fixture runs validate
// against the actual site roster too.
const rosterFile = join(dirname(fileURLToPath(import.meta.url)), "..", "layouts", "partials", "country-roster.html");
if (!existsSync(rosterFile)) {
  error("layouts/partials/country-roster.html not found (needed to verify existing_site_key values)");
} else {
  const rosterKeys = new Set(
    [...readFileSync(rosterFile, "utf8").matchAll(/\(dict "key" "([a-z-]+)"/g)].map((m) => m[1])
  );
  for (const key of siteKeys) {
    if (!rosterKeys.has(key)) {
      error(`jurisdictions.json: existing_site_key '${key}' is not a country-roster key`);
    }
  }
}

// ---------- record files ----------
const recordFiles = existsSync(recordsDir)
  ? readdirSync(recordsDir).filter((f) => f.endsWith(".json"))
  : [];

for (const f of recordFiles) {
  const file = join(recordsDir, f);
  const expectedKey = `records/${f}`;
  const rec = parseJson(file);
  if (!rec) continue;
  const where = rel(file);

  if (referencedRecords.get(expectedKey) === undefined) {
    error(`${where}: no jurisdiction references this records file`);
  }
  if (!/^[A-Z]{2}$/.test(rec.jurisdiction_id || "")) error(`${where}: jurisdiction_id must be two uppercase letters`);
  else if (!jurisIds.has(rec.jurisdiction_id)) error(`${where}: jurisdiction_id ${rec.jurisdiction_id} not found in jurisdictions.json`);
  else if (referencedRecords.get(expectedKey) !== rec.jurisdiction_id) {
    error(`${where}: jurisdiction_id ${rec.jurisdiction_id} does not match the referencing jurisdiction`);
  }
  if (!REVIEW_STATUS.includes(rec.review_status)) error(`${where}: review_status must be one of ${REVIEW_STATUS.join(", ")}`);
  if (!validDateLiteral(rec.researched_at || "")) error(`${where}: researched_at must be YYYY-MM-DD`);

  if (!Array.isArray(rec.sources)) error(`${where}: sources must be an array`);

  const sourceIds = new Set();
  (Array.isArray(rec.sources) ? rec.sources : []).forEach((s, i) => {
    const sw = `${where} sources[${i}]`;
    if (!isPlainObject(s)) { error(`${sw}: not an object`); return; }
    if (!isNonEmptyString(s.id)) error(`${sw}: id must be a non-empty string`);
    else if (sourceIds.has(s.id)) error(`${sw}: duplicate source id ${s.id}`);
    else sourceIds.add(s.id);
    if (!isHttpUrl(s.url || "")) error(`${sw}: url must be an http(s) URL`);
    for (const f2 of ["title", "publisher"]) {
      if (!isNonEmptyString(s[f2])) error(`${sw}: ${f2} must be a non-empty string`);
    }
    if (!validDateLiteral(s.retrieved_at || "")) error(`${sw}: retrieved_at must be YYYY-MM-DD`);
    if (typeof s.evidence_excerpt !== "string") error(`${sw}: evidence_excerpt must be a string`);
    else if (s.evidence_excerpt.trim().split(/\s+/).length > 25) error(`${sw}: evidence_excerpt exceeds 25 words`);
    if (!Array.isArray(s.supports)) error(`${sw}: supports must be an array`);
    if (!ACCESS_STATUS.includes(s.access_status)) error(`${sw}: access_status must be one of ${ACCESS_STATUS.join(", ")}`);
    if (s.access_status === "ok" && !isNonEmptyString(s.evidence_excerpt)) {
      // a source we claim to have opened must carry a non-empty excerpt
      error(`${sw}: access_status 'ok' requires a non-empty evidence_excerpt`);
    }
  });

  // procedures may only be empty when the record is honestly blocked:
  // review_status 'blocked', a non-empty unresolved list (each entry already
  // requires a real next_check_url above). verified/partial keep the
  // non-empty requirement.
  if (!Array.isArray(rec.procedures)) {
    error(`${where}: procedures must be an array`);
  } else if (rec.procedures.length === 0) {
    if (rec.review_status !== "blocked") {
      error(`${where}: procedures must be a non-empty array unless review_status is 'blocked'`);
    }
    if (!Array.isArray(rec.unresolved) || rec.unresolved.length === 0) {
      error(`${where}: empty procedures with review_status 'blocked' require a non-empty unresolved list`);
    }
  }
  (Array.isArray(rec.procedures) ? rec.procedures : []).forEach((p, i) => {
    const pw = `${where} procedures[${i}]`;
    if (!isPlainObject(p)) { error(`${pw}: not an object`); return; }
    if (!isNonEmptyString(p.id)) { error(`${pw}: id must be a non-empty string`); return; }
    if (globalProcedureIds.has(p.id)) {
      error(`${pw}: duplicate procedure id ${p.id} (also in ${globalProcedureIds.get(p.id)})`);
    } else {
      globalProcedureIds.set(p.id, rel(file));
    }
    if (!TYPES.includes(p.type)) error(`${pw}: type must be one of ${TYPES.join(", ")}`);
    for (const f2 of ["name_en", "name_zh", "agency"]) {
      if (!isNonEmptyString(p[f2])) error(`${pw}: ${f2} must be a non-empty string`);
    }
    if (!isHttpUrl(p.official_url || "")) error(`${pw}: official_url must be an http(s) URL`);
    if (!CHANNELS.includes(p.channel)) error(`${pw}: channel must be one of ${CHANNELS.join(", ")}`);
    for (const f2 of ["applicability_en", "applicability_zh", "timing_en", "timing_zh"]) {
      if (!isNonEmptyString(p[f2])) error(`${pw}: ${f2} must be a non-empty string`);
    }
    if (!validFee(p.fee)) error(`${pw}: fee must be "unknown" or {amount, currency}`);
    if (!isDateOrNull(p.verified_at)) error(`${pw}: verified_at must be a date string or null`);
    if (!Array.isArray(p.source_ids) || p.source_ids.length === 0) error(`${pw}: source_ids must be a non-empty array`);
    else {
      for (const sid of p.source_ids) {
        if (!sourceIds.has(sid)) error(`${pw}: source_ids references unknown source '${sid}'`);
      }
    }
    // unknown-not-verified: a procedure may only carry verified_at when at
    // least one cited source was actually opened (access_status ok) and
    // declares support for this procedure; channel 'unknown' blocks it too.
    if (p.verified_at !== null) {
      // One conjunction, not two independent existence checks: some single
      // source must be cited (id in source_ids), opened ok, carry a non-empty
      // excerpt, AND list this procedure in supports. A qualifying source
      // outside source_ids does not count.
      const backed = (Array.isArray(rec.sources) ? rec.sources : []).some(
        (s) =>
          s && s.access_status === "ok" && isNonEmptyString(s.evidence_excerpt)
          && Array.isArray(s.supports) && s.supports.includes(p.id)
          && p.source_ids.includes(s.id)
      );
      if (!backed) {
        error(
          `${pw}: verified_at set but no single cited 'ok' source with a non-empty excerpt lists this procedure in supports`
        );
      }
      if (p.channel === "unknown") error(`${pw}: channel 'unknown' cannot be verified`);
    }
  });

  // supports must reference existing procedure ids
  (Array.isArray(rec.sources) ? rec.sources : []).forEach((s, i) => {
    if (!isPlainObject(s)) return;
    const pids = new Set((Array.isArray(rec.procedures) ? rec.procedures : []).map((p) => p && p.id));
    for (const pid of s.supports || []) {
      if (!pids.has(pid)) error(`${where} sources[${i}]: supports unknown procedure '${pid}'`);
    }
  });

  if (!Array.isArray(rec.unresolved)) error(`${where}: unresolved must be an array`);
  (Array.isArray(rec.unresolved) ? rec.unresolved : []).forEach((u, i) => {
    const uw = `${where} unresolved[${i}]`;
    if (!isPlainObject(u)) { error(`${uw}: not an object`); return; }
    if (!isNonEmptyString(u.id)) error(`${uw}: id must be a non-empty string`);
    if (!isNonEmptyString(u.note)) error(`${uw}: note must be a non-empty string`);
    if (!isHttpUrl(u.next_check_url || "")) error(`${uw}: next_check_url must be an http(s) URL`);
  });

  // review_status 'verified' demands full coverage: no unresolved items,
  // and every procedure individually verified.
  if (rec.review_status === "verified") {
    const procs = Array.isArray(rec.procedures) ? rec.procedures : [];
    if ((Array.isArray(rec.unresolved) ? rec.unresolved : []).length > 0) {
      error(`${where}: review_status 'verified' but unresolved items present`);
    }
    if (procs.some((p) => p && p.verified_at === null)) {
      error(`${where}: review_status 'verified' but a procedure has verified_at null`);
    }
  }
  // a fully unverified record cannot claim better than partial
  const procs = Array.isArray(rec.procedures) ? rec.procedures : [];
  if (rec.review_status !== "blocked" && procs.every((p) => p && p.verified_at === null)) {
    error(`${where}: no verified procedure but review_status is not 'blocked'`);
  }
}

if (errors.length > 0) {
  console.error(`check-travel-library: ${errors.length} violation(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
const verifiedProcs = [];
console.log(
  `check-travel-library: OK — ${jurisList.length} jurisdictions, ${recordFiles.length} record files, ` +
  `${globalProcedureIds.size} procedures (all unique)`
);
