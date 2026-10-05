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
