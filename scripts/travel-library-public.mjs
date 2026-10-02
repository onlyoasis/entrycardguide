import { zh2hant } from "./zh-hant/core.mjs";

const JURISDICTION_FIELDS = ["id", "name_en", "name_zh", "region", "existing_site_key"];
const RECORD_FIELDS = ["jurisdiction_id", "review_status", "researched_at", "procedures", "sources"];
const PROCEDURE_FIELDS = ["id", "type", "name_en", "name_zh", "agency", "official_url", "channel", "applicability_en", "applicability_zh", "timing_en", "timing_zh", "fee", "source_ids", "verified_at"];
const SOURCE_FIELDS = ["id", "url", "title", "publisher"];
const TYPES = ["customs_declaration", "arrival_card", "health_declaration", "travel_authorization", "visa"];
const CHANNELS = ["online", "paper", "on_arrival", "on_departure", "conditional"];
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const pick = (source, fields) => Object.fromEntries(fields.filter((field) => Object.hasOwn(source, field)).map((field) => [field, source[field]]));

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function httpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

// 只拣选明确列出的字段；研究侧新增字段不会自动变成公开字段。
export function projectPublicTravelLibrary(jurisdictions, records, ids) {
  if (!Array.isArray(ids) || ids.length === 0) throw new Error("ids: explicitly select at least one jurisdiction ID");
  if (ids.some((id) => typeof id !== "string" || !/^[A-Z]{2}$/.test(id))) throw new Error("ids: expected uppercase two-letter jurisdiction IDs");
  if (new Set(ids).size !== ids.length) throw new Error("ids: duplicate jurisdiction selection");
  if (!Array.isArray(jurisdictions) || !Array.isArray(records)) throw new Error("research: jurisdictions and records must be arrays");
  const result = { schema_version: 1, jurisdictions: [], records: [] };
  for (const id of ids) {
    const jurisdiction = jurisdictions.find((entry) => entry.id === id);
    const record = records.find((entry) => entry.jurisdiction_id === id);
    if (!jurisdiction || !record) throw new Error(`ids.${id}: jurisdiction or research record does not exist`);
    if (record.review_status !== "verified") throw new Error(`records.${id}.review_status: must be verified`);
    if (!Array.isArray(record.procedures) || record.procedures.length === 0) throw new Error(`records.${id}.procedures: expected verified procedures`);
    if (!Array.isArray(record.sources)) throw new Error(`records.${id}.sources: must be an array`);
    const publicRecord = pick(record, ["jurisdiction_id", "review_status", "researched_at"]);
    publicRecord.procedures = record.procedures.map((procedure) => {
      if (!validDate(procedure.verified_at)) throw new Error(`records.${id}.procedures.${procedure.id}.verified_at: must be a valid date`);
      const projected = pick(procedure, PROCEDURE_FIELDS);
      projected.fee = object(procedure.fee) ? pick(procedure.fee, ["amount", "currency", "note"]) : procedure.fee;
      if (Array.isArray(procedure.source_ids)) projected.source_ids = [...procedure.source_ids];
      return projected;
    });
    const cited = new Set(publicRecord.procedures.flatMap((procedure) => procedure.source_ids || []));
    publicRecord.sources = record.sources.filter((source) => cited.has(source.id)).map((source) => pick(source, SOURCE_FIELDS));
    result.jurisdictions.push(pick(jurisdiction, JURISDICTION_FIELDS));
    result.records.push(publicRecord);
  }
  const errors = validatePublicTravelLibrary(result);
  if (errors.length) throw new Error(errors.join("\n"));
  return result;
}

// 独立检查手工编辑的公开快照，拒绝未知字段和无法追溯的公开记录。
export function validatePublicTravelLibrary(snapshot) {
  if (snapshot?.schema_version === 2) return validatePublicTravelLibraryV2(snapshot);
  const errors = [];
  const error = (where, message) => errors.push(`${where}: ${message}`);
  function rejectLocalPaths(value, where) {
    if (typeof value === "string" && /file:\/\/|\/Users\/|\/Volumes\//i.test(value)) error(where, "must not contain a local filesystem path");
    else if (Array.isArray(value)) value.forEach((entry, index) => rejectLocalPaths(entry, `${where}[${index}]`));
    else if (object(value)) {
      for (const [key, entry] of Object.entries(value)) rejectLocalPaths(entry, where ? `${where}.${key}` : key);
    }
  }
  function fields(value, allowed, where) {
    if (!object(value)) { error(where, "must be an object"); return false; }
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) error(`${where}.${key}`, "unknown public field");
    }
    return true;
  }
  function requiredStrings(value, names, where) {
    for (const name of names) if (!nonEmpty(value[name])) error(`${where}.${name}`, "must be a non-empty string");
  }
  function unique(value, seen, where) {
    if (!nonEmpty(value)) error(where, "must be a non-empty string");
    else if (seen.has(value)) error(where, `duplicate ID '${value}'`);
    else seen.add(value);
  }
  if (!fields(snapshot, ["schema_version", "jurisdictions", "records"], "snapshot")) return errors;
  rejectLocalPaths(snapshot, "");
  if (snapshot.schema_version !== 1) error("schema_version", "must be 1");
  if (!Array.isArray(snapshot.jurisdictions)) error("jurisdictions", "must be an array");
  if (!Array.isArray(snapshot.records)) error("records", "must be an array");
  if (!Array.isArray(snapshot.jurisdictions) || !Array.isArray(snapshot.records)) return errors;
  const jurisdictionIds = new Set();
  const recordIds = new Set();
  const procedureIds = new Set();
  snapshot.jurisdictions.forEach((jurisdiction, index) => {
    const where = `jurisdictions[${index}]`;
    if (!fields(jurisdiction, JURISDICTION_FIELDS, where)) return;
    unique(jurisdiction.id, jurisdictionIds, `${where}.id`);
    if (typeof jurisdiction.id !== "string" || !/^[A-Z]{2}$/.test(jurisdiction.id)) error(`${where}.id`, "must be an uppercase two-letter ID");
    requiredStrings(jurisdiction, ["name_en", "name_zh", "region"], where);
    if (jurisdiction.existing_site_key !== null && !nonEmpty(jurisdiction.existing_site_key)) error(`${where}.existing_site_key`, "must be a non-empty string or null");
  });
  snapshot.records.forEach((record, index) => {
    const where = `records[${index}]`;
    if (!fields(record, RECORD_FIELDS, where)) return;
    unique(record.jurisdiction_id, recordIds, `${where}.jurisdiction_id`);
    if (!jurisdictionIds.has(record.jurisdiction_id)) error(`${where}.jurisdiction_id`, "does not reference a public jurisdiction");
    if (record.review_status !== "verified") error(`${where}.review_status`, "must be verified");
    if (!validDate(record.researched_at)) error(`${where}.researched_at`, "must be a valid YYYY-MM-DD date");
    const sourceIds = new Set();
    if (!Array.isArray(record.sources)) error(`${where}.sources`, "must be an array");
    else record.sources.forEach((source, sourceIndex) => {
      const sourceWhere = `${where}.sources[${sourceIndex}]`;
      if (!fields(source, SOURCE_FIELDS, sourceWhere)) return;
      unique(source.id, sourceIds, `${sourceWhere}.id`);
      requiredStrings(source, ["title", "publisher"], sourceWhere);
      if (!httpUrl(source.url)) error(`${sourceWhere}.url`, "must be an http(s) URL");
    });
    if (!Array.isArray(record.procedures) || record.procedures.length === 0) error(`${where}.procedures`, "must be a non-empty array");
    else record.procedures.forEach((procedure, procedureIndex) => {
      const procedureWhere = `${where}.procedures[${procedureIndex}]`;
      if (!fields(procedure, PROCEDURE_FIELDS, procedureWhere)) return;
      unique(procedure.id, procedureIds, `${procedureWhere}.id`);
      requiredStrings(procedure, ["name_en", "name_zh", "agency", "applicability_en", "applicability_zh", "timing_en", "timing_zh"], procedureWhere);
      if (!TYPES.includes(procedure.type)) error(`${procedureWhere}.type`, "unknown procedure type");
      if (!CHANNELS.includes(procedure.channel)) error(`${procedureWhere}.channel`, "must be a verified channel");
      if (!httpUrl(procedure.official_url)) error(`${procedureWhere}.official_url`, "must be an http(s) URL");
      if (!validDate(procedure.verified_at)) error(`${procedureWhere}.verified_at`, "must be a valid YYYY-MM-DD date");
      if (procedure.fee !== "unknown" && fields(procedure.fee, ["amount", "currency", "note"], `${procedureWhere}.fee`)) {
        const fee = procedure.fee;
        if (fee.amount !== null && !(typeof fee.amount === "number" && Number.isFinite(fee.amount) && fee.amount >= 0)) error(`${procedureWhere}.fee.amount`, "must be a non-negative number or null");
        if (!nonEmpty(fee.currency)) error(`${procedureWhere}.fee.currency`, "must be a non-empty string");
        if (Object.hasOwn(fee, "note") && typeof fee.note !== "string") error(`${procedureWhere}.fee.note`, "must be a string");
      }
      if (!Array.isArray(procedure.source_ids) || procedure.source_ids.length === 0) error(`${procedureWhere}.source_ids`, "must be a non-empty array");
      else for (const sourceId of procedure.source_ids) {
        if (!sourceIds.has(sourceId)) error(`${procedureWhere}.source_ids`, `unknown source '${sourceId}'`);
      }
    });
  });
  for (const id of jurisdictionIds) if (!recordIds.has(id)) error(`jurisdictions.${id}`, "missing public record");
  return errors;
}

// These refer to the research execution chain. Government deployment history
// ("rollout") and goods such as "raw material" are ordinary traveler facts.
export const PRIVATE_RESEARCH_TEXT = /file:\/\/|\/Users\/|\/Volumes\/|\b(?:source[-_]cache|cache|Codex|GLM|modelUsage|validator|fixture|normalized|validation-root|curl|OCR|audit-progress|candidate-v\d+)\b|\bSHA[- ]?256\b|\braw\/|\brollout[-_\/]|研究缓存|研究快照|运行目录/i;
const STATUS = ["verified", "partial", "blocked"];
const COVERAGE_FIELDS = ["total_procedures", "published_procedures", "withheld_procedures", "open_questions"];
const HANT_PROCEDURE_FIELDS = ["name_zh_hant", "applicability_zh_hant", "timing_zh_hant"];
function strings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (object(value)) return Object.values(value).flatMap(strings);
  return [];
}
function hasPrivateResearchText(value) { return strings(value).some(text => PRIVATE_RESEARCH_TEXT.test(text)); }
function supportedSources(record, procedure) {
  return record.sources.filter(source => procedure.source_ids.includes(source.id)
    && source.access_status === "ok" && nonEmpty(source.evidence_excerpt)
    && Array.isArray(source.supports) && source.supports.includes(procedure.id));
}

// v2 publishes the complete destination roster while retaining the original
// record status. A date alone never qualifies a procedure: a cited, opened,
// excerpt-bearing supporting source is required, and blocked records publish
// no procedures. Research prose is withheld as a whole, never rewritten into
// a stronger claim. The CLI runs the original research validator first.
export function projectPublicTravelLibraryV2(jurisdictions, records, ids) {
  if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => !/^[A-Z]{2}$/.test(id)) || new Set(ids).size !== ids.length) {
    throw new Error("ids: explicitly select unique uppercase two-letter IDs");
  }
  if (!Array.isArray(jurisdictions) || !Array.isArray(records)) throw new Error("research: jurisdictions and records must be arrays");
  const result = { schema_version: 2, jurisdictions: [], records: [] };
  for (const id of ids) {
    const jurisdiction = jurisdictions.find(entry => entry.id === id);
    const record = records.find(entry => entry.jurisdiction_id === id);
    if (!jurisdiction || !record) throw new Error(`ids.${id}: jurisdiction or research record does not exist`);
    if (!STATUS.includes(record.review_status) || !Array.isArray(record.procedures) || !Array.isArray(record.sources) || !Array.isArray(record.unresolved)) {
      throw new Error(`records.${id}: invalid research record`);
    }
    const publicRecord = pick(record, ["jurisdiction_id", "review_status", "researched_at"]);
    publicRecord.procedures = [];
    const cited = new Set();
    if (record.review_status !== "blocked") for (const procedure of record.procedures) {
      if (!validDate(procedure.verified_at) || !CHANNELS.includes(procedure.channel) || !Array.isArray(procedure.source_ids)) continue;
      const supporting = supportedSources(record, procedure);
      if (!supporting.length) continue;
      const projected = pick(procedure, PROCEDURE_FIELDS);
      projected.fee = object(procedure.fee) ? pick(procedure.fee, ["amount", "currency", "note"]) : procedure.fee;
      projected.source_ids = supporting.map(source => source.id);
      if (hasPrivateResearchText(projected) || supporting.some(source => hasPrivateResearchText(pick(source, SOURCE_FIELDS)))) continue;
      for (const field of ["name", "applicability", "timing"]) projected[`${field}_zh_hant`] = zh2hant(projected[`${field}_zh`]);
      publicRecord.procedures.push(projected);
      projected.source_ids.forEach(sourceId => cited.add(sourceId));
    }
    publicRecord.sources = record.sources.filter(source => cited.has(source.id)).map(source => pick(source, SOURCE_FIELDS));
    publicRecord.coverage = {
      total_procedures: record.procedures.length,
      published_procedures: publicRecord.procedures.length,
      withheld_procedures: record.procedures.length - publicRecord.procedures.length,
      open_questions: record.unresolved.length,
    };
    const publicJurisdiction = pick(jurisdiction, JURISDICTION_FIELDS);
    publicJurisdiction.name_zh_hant = zh2hant(publicJurisdiction.name_zh);
    result.jurisdictions.push(publicJurisdiction);
    result.records.push(publicRecord);
  }
  const errors = validatePublicTravelLibraryV2(result);
  if (errors.length) throw new Error(errors.join("\n"));
  return result;
}

function validatePublicTravelLibraryV2(snapshot) {
  const errors = [];
  const error = (where, message) => errors.push(`${where}: ${message}`);
  function fields(value, allowed, where) {
    if (!object(value)) { error(where, "must be an object"); return false; }
    for (const key of Object.keys(value)) if (!allowed.includes(key)) error(`${where}.${key}`, "unknown public field");
    return true;
  }
  if (!fields(snapshot, ["schema_version", "jurisdictions", "records"], "snapshot")) return errors;
  if (!Array.isArray(snapshot.jurisdictions) || !Array.isArray(snapshot.records)) return ["snapshot: jurisdictions and records must be arrays"];
  const jurisdictionIds = new Set();
  const recordIds = new Set();
  const nonemptyJurisdictions = [];
  const nonemptyRecords = [];
  for (const [index, jurisdiction] of snapshot.jurisdictions.entries()) {
    const where = `jurisdictions[${index}]`;
    if (!fields(jurisdiction, [...JURISDICTION_FIELDS, "name_zh_hant"], where)) continue;
    if (jurisdictionIds.has(jurisdiction.id)) error(`${where}.id`, "duplicate ID");
    jurisdictionIds.add(jurisdiction.id);
    if (!/^[A-Z]{2}$/.test(jurisdiction.id)) error(`${where}.id`, "must be an uppercase two-letter ID");
    for (const name of ["name_en", "name_zh", "name_zh_hant", "region"]) if (!nonEmpty(jurisdiction[name])) error(`${where}.${name}`, "must be a non-empty string");
    if (jurisdiction.existing_site_key !== null && !nonEmpty(jurisdiction.existing_site_key)) error(`${where}.existing_site_key`, "must be a non-empty string or null");
    if (nonEmpty(jurisdiction.name_zh) && jurisdiction.name_zh_hant !== zh2hant(jurisdiction.name_zh)) error(`${where}.name_zh_hant`, "stale generated translation");
  }
  for (const [index, record] of snapshot.records.entries()) {
    const where = `records[${index}]`;
    if (!fields(record, [...RECORD_FIELDS, "coverage"], where)) continue;
    if (recordIds.has(record.jurisdiction_id)) error(`${where}.jurisdiction_id`, "duplicate ID");
    recordIds.add(record.jurisdiction_id);
    if (!jurisdictionIds.has(record.jurisdiction_id)) error(`${where}.jurisdiction_id`, "missing public jurisdiction");
    if (!STATUS.includes(record.review_status)) error(`${where}.review_status`, "unknown review status");
    if (!validDate(record.researched_at)) error(`${where}.researched_at`, "must be a valid YYYY-MM-DD date");
    if (!Array.isArray(record.procedures) || !Array.isArray(record.sources)) { error(where, "procedures and sources must be arrays"); continue; }
    if (record.review_status === "blocked" && record.procedures.length) error(`${where}.procedures`, "blocked records must not publish procedures");
    if (fields(record.coverage, COVERAGE_FIELDS, `${where}.coverage`)) {
      for (const key of COVERAGE_FIELDS) if (!Number.isSafeInteger(record.coverage[key]) || record.coverage[key] < 0) error(`${where}.coverage.${key}`, "must be a non-negative integer");
      if (record.coverage.published_procedures !== record.procedures.length) error(`${where}.coverage.published_procedures`, "must equal procedure count");
      if (record.coverage.total_procedures !== record.coverage.published_procedures + record.coverage.withheld_procedures) error(`${where}.coverage`, "total must equal published plus withheld");
      if (record.review_status === "verified" && (record.coverage.open_questions !== 0 || record.coverage.withheld_procedures !== 0 || !record.procedures.length)) error(`${where}.review_status`, "verified requires full published coverage and no open questions");
    }
    for (const [procedureIndex, procedure] of record.procedures.entries()) {
      const procedureWhere = `${where}.procedures[${procedureIndex}]`;
      if (!fields(procedure, [...PROCEDURE_FIELDS, ...HANT_PROCEDURE_FIELDS], procedureWhere)) continue;
      for (const field of ["name", "applicability", "timing"]) {
        const value = procedure[`${field}_zh`];
        if (!nonEmpty(procedure[`${field}_zh_hant`])) error(`${procedureWhere}.${field}_zh_hant`, "must be a non-empty string");
        else if (nonEmpty(value) && procedure[`${field}_zh_hant`] !== zh2hant(value)) error(`${procedureWhere}.${field}_zh_hant`, "stale generated translation");
      }
    }
    const cited = new Set(record.procedures.flatMap(procedure => procedure?.source_ids || []));
    for (const [sourceIndex, source] of record.sources.entries()) {
      fields(source, SOURCE_FIELDS, `${where}.sources[${sourceIndex}]`);
      if (!cited.has(source?.id)) error(`${where}.sources[${sourceIndex}]`, "unused source must not be published");
    }
    if (!record.procedures.length && record.sources.length) error(`${where}.sources`, "empty procedures must have no sources");
    if (record.procedures.length) {
      const jurisdiction = snapshot.jurisdictions.find(entry => entry?.id === record.jurisdiction_id);
      if (jurisdiction) nonemptyJurisdictions.push(pick(jurisdiction, JURISDICTION_FIELDS));
      nonemptyRecords.push({ ...pick(record, ["jurisdiction_id", "researched_at", "sources"]), review_status: "verified", procedures: record.procedures.map(procedure => pick(procedure, PROCEDURE_FIELDS)) });
    }
  }
  for (const id of jurisdictionIds) if (!recordIds.has(id)) error(`jurisdictions.${id}`, "missing public record");
  // The original v1 validator still checks every published procedure/source
  // and rejects its original negative cases. v2 status/coverage is checked above.
  errors.push(...validatePublicTravelLibrary({ schema_version: 1, jurisdictions: nonemptyJurisdictions, records: nonemptyRecords }));
  if (hasPrivateResearchText(snapshot)) error("snapshot", "contains private research text or local filesystem path");
  return errors;
}
