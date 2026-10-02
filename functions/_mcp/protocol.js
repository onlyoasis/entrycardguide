// MCP (Model Context Protocol) JSON-RPC layer — stateless subset of the
// Streamable HTTP transport (2025-06-18 spec), implemented with zero npm
// dependencies to match the site's v1.0 constraint:
//
//   POST /api/mcp  one JSON-RPC message per request → one JSON response
//   notifications (no `id`)           → 202 Accepted, empty body
//   GET /api/mcp (server-initiated SSE) → 405 (not offered)
//   DELETE /api/mcp (session teardown)   → 405 (stateless server)
//
// Every method requires a registered API key (checked in the route handler
// before this module runs). Tool calls are metered by functions/_mcp/quota.js.

import snapshot from "./snapshot.js";
import { consumeCall, planLimit } from "./quota.js";

export const SERVER_INFO = { name: "entrycardguide", version: "1.1.0" };
export const SUPPORTED_PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26"];

const COUNTRIES_BY_SLUG = new Map(snapshot.countries.map((c) => [c.slug, c]));

class ToolError extends Error {}

function countryOrThrow(slug) {
  const country = COUNTRIES_BY_SLUG.get(slug);
  if (!country) {
    throw new ToolError(
      `Unknown country "${slug}". Valid slugs: ${snapshot.countries.map((c) => c.slug).join(", ")}. (Call list_countries first.)`,
    );
  }
  return country;
}

function sourceNote() {
  return {
    site: snapshot.site.origin,
    license: `${snapshot.site.license} — attribution required when you republish this data`,
    licenseUrl: snapshot.site.licenseUrl,
  };
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

function mainFormOf(country) {
  const form = country.forms.find((f) => f.key === country.formKey) ?? country.forms[0] ?? null;
  return form;
}

function toolListCountries() {
  const records = new Map(snapshot.library.records.map(record => [record.jurisdiction_id, record]));
  return {
    count: snapshot.library.jurisdictions.length,
    detailedGuideCount: snapshot.countries.length,
    countries: snapshot.library.jurisdictions.map(jurisdiction => {
      const record = records.get(jurisdiction.id);
      const country = COUNTRIES_BY_SLUG.get(jurisdiction.existing_site_key);
      return {
        iso2: jurisdiction.id,
        slug: country?.slug ?? null,
        names: { en: jurisdiction.name_en, zh: jurisdiction.name_zh, "zh-hant": jurisdiction.name_zh_hant },
        reviewStatus: record.review_status,
        coverage: record.coverage,
        library: `/library/${jurisdiction.id.toLowerCase()}/`,
        guide: country ? `/${country.slug}/${country.guideSlug}/` : null,
        formCode: country?.formCode ?? null,
        formType: country?.formType ?? null,
        fee: country?.fee ?? null,
        officialUrl: country ? mainFormOf(country)?.url ?? null : null,
        lastVerified: country?.lastVerified ?? null,
      };
    }),
    note: "Coverage includes verified, partial and blocked destinations. Missing published requirements are unknown, not a declaration exemption. Use get_jurisdiction for source-backed public items and original review dates.",
    source: sourceNote(),
  };
}

function toolGetJurisdiction(args) {
  const jurisdiction = snapshot.library.jurisdictions.find(item => item.id === args.id);
  const record = snapshot.library.records.find(item => item.jurisdiction_id === args.id);
  if (!jurisdiction || !record) throw new ToolError("Unknown destination ID. Call list_countries for ISO2 IDs.");
  return {
    jurisdiction,
    record,
    note: "This is the same public projection used by the website. Partial or blocked review status does not establish complete requirements. Original verified_at dates are source-review dates; no live legal review is performed by this call. An empty procedures list is not an exemption.",
    source: sourceNote(),
  };
}

function toolGetCountryForms(args) {
  const c = countryOrThrow(args.country);
  const changelog = (snapshot.changelogs[c.slug] || []).slice(0, 5);
  return {
    country: c.slug,
    names: c.names,
    formCode: c.formCode,
    formType: c.formType,
    fee: c.fee,
    timeNeeded: c.timeNeeded,
    fieldCount: c.fieldCount,
    sections: c.sections,
    officialLinks: c.forms,
    guide: `/${c.slug}/${c.guideSlug}/`,
    recentChanges: changelog,
    source: sourceNote(),
  };
}

function toolGetFieldRules(args) {
  const c = countryOrThrow(args.country);
  const rules = snapshot.rules[c.slug];
  if (!rules) {
    throw new ToolError(`No field rules for "${c.slug}" yet.`);
  }
  return { ...rules, validationMode: c.validationMode ?? "field_rules",
    guidanceNote: c.validationMode === "examples_only" ? "Document fields and examples only; this is not an executable official field validator." : null,
    source: sourceNote() };
}

function toolGetFieldGuide(args) {
  const c = countryOrThrow(args.country);
  const lang = args.lang ?? "en";
  const suffix = new Map([["en", "en"], ["zh", "zh"], ["zh-hant", "zh_hant"]]).get(lang);
  if (!suffix) {
    throw new ToolError(`lang must be "en", "zh" or "zh-hant" (got "${lang}").`);
  }
  const entries = snapshot.fieldGuides[c.slug] || [];
  if (!entries.length) {
    throw new ToolError(`No field guide for "${c.slug}" yet.`);
  }
  return {
    country: c.slug,
    lang,
    // The guide covers the most error-prone fields; the form itself can have more.
    validationMode: c.validationMode ?? "field_rules",
    guidanceNote: c.validationMode === "examples_only" ? "Use these document examples for comparison. They do not prove that an official form will accept a value." : null,
    guideFieldCount: entries.length,
    formFieldCount: c.fieldCount,
    fields: entries.map((f) => ({
      key: f.key,
      section: f[`section_${suffix}`] ?? f.section_en ?? null,
      example: f.example ?? null,
      commonMistake: f.mistake ?? null,
      whyItFails: f[`mistake_why_${suffix}`] ?? f.mistake_why_en ?? null,
      howToFill: f[`copy_${suffix}`] ?? f.copy_en ?? null,
    })),
    source: sourceNote(),
  };
}

function toolRunDecisionTree(args) {
  const answers = args.answers ?? [];
  if (answers.some((a) => typeof a !== "string")) {
    throw new ToolError("answers must be an array of option value strings.");
  }
  const tree = snapshot.decisionTree;
  let stateId = tree.start;
  const trace = [];
  for (const answer of answers) {
    const state = tree.states[stateId];
    if (!state || state.type !== "question") {
      throw new ToolError("answers contains an extra value after the final decision.");
    }
    const option = state.options.find((o) => o.value === answer);
    if (!option) {
      throw new ToolError(
        `At "${state.label}", "${answer}" is not a valid answer. Valid values: ${state.options
          .map((o) => `"${o.value}" (${o.label})`)
          .join(", ")}.`,
      );
    }
    trace.push({ question: state.label, answer: option.value });
    stateId = option.next;
  }
  const state = tree.states[stateId];
  if (!state) {
    throw new ToolError(`Decision tree is inconsistent: state "${stateId}" does not exist.`);
  }
  if (state.type === "question") {
    return {
      done: false,
      treeVersion: tree.version,
      lastVerified: tree.lastVerified,
      nextQuestion: {
        question: state.label,
        options: state.options.map((o) => ({ value: o.value, label: o.label })),
      },
      trace,
      hint: "Answer by sending run_decision_tree again with previous answers plus the chosen option value appended.",
    };
  }
  return {
    done: true,
    treeVersion: tree.version,
    lastVerified: tree.lastVerified,
    country: state.country,
    summary: state.summary,
    forms: state.forms,
    note: state.note ?? null,
    trace,
    source: sourceNote(),
  };
}

export const TOOLS = [
  {
    name: "get_jurisdiction",
    description: "Read the public source-backed declaration items for one ISO2 destination, including original verified_at dates, sources, review status and coverage. Missing items are unknown, not exemptions.",
    inputSchema: {
      type: "object", properties: { id: { type: "string", pattern: "^[A-Z]{2}$", minLength: 2, maxLength: 2 } },
      required: ["id"], additionalProperties: false,
    },
    run: toolGetJurisdiction,
  },
  {
    name: "list_countries",
    description:
      "List all 249 destinations with review status, public coverage, library URLs and available detailed guide links. Start here, then use get_jurisdiction with an ISO2 ID.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: toolListCountries,
  },
  {
    name: "get_country_forms",
    description:
      "All official government URLs for one country's entry forms (URL, agency, last-verified date, archive link), plus fees, timing, and the 5 most recent policy changes. Requires a country slug from list_countries.",
    inputSchema: {
      type: "object",
      properties: { country: { type: "string", minLength: 1, maxLength: 64, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", description: "Country slug, e.g. thailand" } },
      required: ["country"],
      additionalProperties: false,
    },
    run: toolGetCountryForms,
  },
  {
    name: "get_field_rules",
    description:
      "Field constraints and examples curated for one country's entry form. Check validationMode: examples_only entries are document guidance, not an executable official validator.",
    inputSchema: {
      type: "object",
      properties: { country: { type: "string", minLength: 1, maxLength: 64, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", description: "Country slug, e.g. thailand" } },
      required: ["country"],
      additionalProperties: false,
    },
    run: toolGetFieldRules,
  },
  {
    name: "get_field_guide",
    description:
      "Field-by-field filling guide for one country's most error-prone fields: correct example, common mistake, why it gets rejected, how to fill it. lang: en (default), zh, or zh-hant.",
    inputSchema: {
      type: "object",
      properties: {
        country: { type: "string", minLength: 1, maxLength: 64, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", description: "Country slug, e.g. thailand" },
        lang: { type: "string", enum: ["en", "zh", "zh-hant"], description: "Response language (default en)" },
      },
      required: ["country"],
      additionalProperties: false,
    },
    run: toolGetFieldGuide,
  },
  {
    name: "run_decision_tree",
    description:
      "Walk the entrycardguide decision tree: given an array of option values (e.g. [\"thailand\"] or [\"mexico\",\"land\",\"no\"]), returns either the next question or the final result — which forms you must file, their fees and deadlines. With no answers, returns the first question.",
    inputSchema: {
      type: "object",
      properties: {
        answers: {
          type: "array",
          maxItems: 32,
          items: { type: "string", minLength: 1, maxLength: 128 },
          description: "Option values chosen so far, in order. Empty array returns the opening question.",
        },
      },
      additionalProperties: false,
    },
    run: toolRunDecisionTree,
  },
];

// ---------------------------------------------------------------------------
// JSON-RPC dispatch
// ---------------------------------------------------------------------------

function json(body, status = 200, extraHeaders = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extraHeaders },
  });
}

function rpcResult(id, result) {
  return json({ jsonrpc: "2.0", id, result });
}

function rpcError(id, code, message, data, status = 200, extraHeaders = {}) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return json({ jsonrpc: "2.0", id, error }, status, extraHeaders);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateValue(value, schema, location) {
  if (schema.type === "object") {
    if (!isObject(value)) return `${location} must be an object.`;
    const properties = schema.properties ?? {};
    for (const key of schema.required ?? []) {
      if (!Object.hasOwn(value, key)) return `${location}.${key} is required.`;
    }
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(properties, key)) {
        if (schema.additionalProperties === false) return `${location} contains an unknown property.`;
        continue;
      }
      const error = validateValue(value[key], properties[key], `${location}.${key}`);
      if (error) return error;
    }
  } else if (schema.type === "string") {
    if (typeof value !== "string") return `${location} must be a string.`;
    if (schema.minLength !== undefined && value.length < schema.minLength) return `${location} is too short.`;
    if (schema.maxLength !== undefined && value.length > schema.maxLength) return `${location} is too long.`;
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) return `${location} has an invalid format.`;
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return `${location} must be an array.`;
    if (schema.maxItems !== undefined && value.length > schema.maxItems) return `${location} contains too many items.`;
    for (const item of value) {
      const error = validateValue(item, schema.items, `${location} item`);
      if (error) return error;
    }
  } else if (schema.type === "integer") {
    if (!Number.isSafeInteger(value)) return `${location} must be an integer.`;
    if (schema.minimum !== undefined && value < schema.minimum) return `${location} is too small.`;
    if (schema.maximum !== undefined && value > schema.maximum) return `${location} is too large.`;
  } else {
    throw new Error("Unsupported MCP input schema");
  }
  if (schema.enum && !schema.enum.includes(value)) return `${location} has an unsupported value.`;
  return null;
}

const META = { type: "object" };
const PARAM_SCHEMAS = {
  initialize: {
    type: "object", additionalProperties: false, required: ["protocolVersion", "capabilities", "clientInfo"],
    properties: {
      protocolVersion: { type: "string", minLength: 1, maxLength: 32 },
      capabilities: { type: "object" },
      clientInfo: {
        type: "object", additionalProperties: false, required: ["name", "version"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 128 },
          version: { type: "string", minLength: 1, maxLength: 64 },
          title: { type: "string", maxLength: 128 },
        },
      },
      _meta: META,
    },
  },
  ping: { type: "object", additionalProperties: false, properties: { _meta: META } },
  "tools/list": { type: "object", additionalProperties: false, properties: { _meta: META } },
  "tools/call": {
    type: "object", additionalProperties: false, required: ["name"],
    properties: {
      name: { type: "string", minLength: 1, maxLength: 128 },
      arguments: { type: "object" },
      _meta: META,
    },
  },
  "notifications/initialized": { type: "object", additionalProperties: false, properties: { _meta: META } },
};

export async function handleRpc(env, user, message) {
  if (!isObject(message)) return rpcError(null, -32600, "Invalid Request: expected one JSON-RPC object.");
  const { jsonrpc, id, method, params } = message;
  const hasId = Object.hasOwn(message, "id");
  const validId = (typeof id === "string" && id.length > 0 && id.length <= 128) || Number.isSafeInteger(id);
  if (jsonrpc !== "2.0" || typeof method !== "string" || !method || method.length > 128 ||
      (hasId && !validId) || Object.keys(message).some((key) => !["jsonrpc", "id", "method", "params"].includes(key))) {
    return rpcError(null, -32600, "Invalid JSON-RPC envelope or request id.");
  }
  const replyId = hasId ? id : null;
  if (!hasId && method !== "notifications/initialized") {
    return rpcError(null, -32600, "Only notifications/initialized may omit a request id.", undefined, 400);
  }
  if (hasId && method.startsWith("notifications/")) {
    return rpcError(id, -32600, "Notifications must omit the request id.");
  }
  if (!Object.hasOwn(PARAM_SCHEMAS, method)) return rpcError(replyId, -32601, "Method not found.");
  const actualParams = params === undefined ? {} : params;
  const parameterError = validateValue(actualParams, PARAM_SCHEMAS[method], "params");
  if (parameterError) return rpcError(replyId, -32602, parameterError, undefined, hasId ? 200 : 400);
  if (!hasId) return new Response(null, { status: 202, headers: { "Cache-Control": "no-store" } });

  try {
    // Unknown plans or a bad quota override must never grant unmetered reads.
    planLimit(env, user.plan);
    switch (method) {
      case "initialize": {
        const requested = actualParams.protocolVersion;
        const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : SUPPORTED_PROTOCOL_VERSIONS[0];
        return rpcResult(id, {
          protocolVersion,
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
          instructions: "Official entry-form URLs and filling guides. Start with list_countries. " +
            "Republished data requires entrycardguide.com attribution under CC BY-SA 4.0. " +
            "An active mcp:read authorization is required; tool calls share your account monthly quota.",
        });
      }
      case "ping": return rpcResult(id, {});
      case "tools/list": return rpcResult(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      });
      case "tools/call": {
        const tool = TOOLS.find((candidate) => candidate.name === actualParams.name);
        if (!tool) return rpcError(id, -32602, "Unknown tool. Call tools/list for available tools.");
        const args = actualParams.arguments === undefined ? {} : actualParams.arguments;
        const argumentError = validateValue(args, tool.inputSchema, "arguments");
        if (argumentError) return rpcError(id, -32602, argumentError);
        let payload;
        try {
          payload = tool.run(args);
        } catch (error) {
          if (!(error instanceof ToolError)) throw error;
          return rpcResult(id, { content: [{ type: "text", text: error.message }], isError: true });
        }
        const meter = await consumeCall(env, user, tool.name);
        if (meter.unauthorized) return rpcError(id, -32002, "MCP authorization is no longer active.", undefined, 401);
        if (!meter.allowed) return rpcError(id, -32001, "Monthly account call quota exceeded.", {
          period: meter.period, used: meter.used, limit: meter.limit, whoami: "/api/mcp/whoami",
        }, 429);
        return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] });
      }
    }
  } catch {
    // Do not expose SQL, account rows, configuration, or provider errors.
    return rpcError(id, -32003, "MCP service is temporarily unavailable.", undefined, 503);
  }
}
