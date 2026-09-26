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
import { authorizeCall, recordCall } from "./quota.js";

export const SERVER_INFO = { name: "entrycardguide", version: "1.0.0" };
export const SUPPORTED_PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

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
  return {
    count: snapshot.countries.length,
    countries: snapshot.countries.map((c) => ({
      slug: c.slug,
      names: c.names,
      formCode: c.formCode,
      formType: c.formType,
      fee: c.fee,
      officialUrl: mainFormOf(c)?.url ?? null,
      lastVerified: c.lastVerified,
      fieldCount: c.fieldCount,
      guide: `/${c.slug}/${c.guideSlug}/`,
    })),
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
  return { ...rules, source: sourceNote() };
}

function toolGetFieldGuide(args) {
  const c = countryOrThrow(args.country);
  const lang = args.lang ?? "en";
  const suffix = { en: "en", zh: "zh", "zh-hant": "zh_hant" }[lang];
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
  const answers = Array.isArray(args.answers) ? args.answers : [];
  if (answers.some((a) => typeof a !== "string")) {
    throw new ToolError("answers must be an array of option value strings.");
  }
  const tree = snapshot.decisionTree;
  let stateId = tree.start;
  const trace = [];
  for (const answer of answers) {
    const state = tree.states[stateId];
    if (!state || state.type !== "question") break;
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
    name: "list_countries",
    description:
      "List every country entrycardguide covers, with its main entry form code, official government URL, fee, form type, and last-verified date. Start here.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: toolListCountries,
  },
  {
    name: "get_country_forms",
    description:
      "All official government URLs for one country's entry forms (URL, agency, last-verified date, archive link), plus fees, timing, and the 5 most recent policy changes. Requires a country slug from list_countries.",
    inputSchema: {
      type: "object",
      properties: { country: { type: "string", description: "Country slug, e.g. thailand" } },
      required: ["country"],
      additionalProperties: false,
    },
    run: toolGetCountryForms,
  },
  {
    name: "get_field_rules",
    description:
      "Machine-readable field validation rules for one country's entry form: per-field regex, min/max length, and the exact error text the official site returns. Use to validate values before submitting.",
    inputSchema: {
      type: "object",
      properties: { country: { type: "string", description: "Country slug, e.g. thailand" } },
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
        country: { type: "string", description: "Country slug, e.g. thailand" },
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
          items: { type: "string" },
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
    headers: { "Content-Type": "application/json", ...extraHeaders },
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

export async function handleRpc(env, user, message) {
  if (message === null || typeof message !== "object" || Array.isArray(message)) {
    return rpcError(null, -32600, "Invalid Request: expected a single JSON-RPC 2.0 message object.");
  }
  const { jsonrpc, id, method, params } = message;
  const isNotification = id === undefined;

  if (jsonrpc !== "2.0" || typeof method !== "string") {
    return rpcError(isNotification ? null : id, -32600, "Invalid Request: jsonrpc must be \"2.0\" and method must be a string.");
  }
  if (isNotification) {
    // Notifications (notifications/initialized etc.) get no response body.
    return new Response(null, { status: 202 });
  }

  switch (method) {
    case "initialize": {
      const requested = params?.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
        ? requested
        : SUPPORTED_PROTOCOL_VERSIONS[0];
      return rpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Official government entry-form URLs, field-by-field validation rules, and a decision tree for 50+ countries. " +
          "Start with list_countries. Data is CC BY-SA 4.0: credit entrycardguide.com when you republish it. " +
          `Free plan: ${user.plan} tier, metered per tool call — see /api/mcp/whoami for remaining quota.`,
      });
    }

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      });

    case "tools/call": {
      const name = params?.name;
      const args = params?.arguments ?? {};
      if (typeof name !== "string") {
        return rpcError(id, -32602, "Invalid params: tools/call needs params.name.");
      }
      const tool = TOOLS.find((t) => t.name === name);
      if (!tool) {
        return rpcError(id, -32602, `Unknown tool "${name}". Call tools/list for the available tools.`);
      }

      const meter = await authorizeCall(env, user);
      if (!meter.allowed) {
        return rpcError(id, -32001, "Monthly call quota exceeded for this API key.", {
          plan: user.plan,
          period: meter.period,
          used: meter.used,
          limit: meter.limit,
          whoami: "/api/mcp/whoami",
          upgrade: "Reply to your registration email or contact licensing@entrycardguide.com to raise the limit.",
        });
      }

      try {
        const payload = tool.run(args);
        await recordCall(env, user, name);
        return rpcResult(id, {
          content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        });
      } catch (error) {
        if (error instanceof ToolError) {
          return rpcResult(id, {
            content: [{ type: "text", text: error.message }],
            isError: true,
          });
        }
        throw error;
      }
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}
