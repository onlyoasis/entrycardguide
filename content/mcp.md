---
title: "MCP: sign in and authorize your agent"
description: "Read official entry-form guides and the global destination library through MCP. Verify your email, sign in and authorize a revocable read-only key."
date: 2026-09-26
lastmod: 2026-10-02
url: "/mcp/"
---

## Sign in and authorize

[Open your account](/api/mcp/account?lang=en). Register with an email address you control, then enter the one-time code sent to it. To sign in again, request a new code. A code expires after 10 minutes.

Registration and sign-in do not grant MCP access. On the account page, explicitly authorize **read-only MCP access**. Your API key is shown once. Save it in your client's secret storage. It expires after 30 days; revoke it on the account page whenever you need to. Account usage is shared by all your keys.

## Available tools

| Tool | Returns |
|---|---|
| `list_countries` | All 249 destinations, their review status, library link and available guide |
| `get_jurisdiction` | Public source-backed declaration items, original verification dates, sources and coverage for one destination |
| `get_country_forms` | Official links and fees for one of the 53 detailed form guides |
| `get_field_rules` | Published field rules or preparation notes, with their validation mode |
| `get_field_guide` | Field examples and filling guidance in English, Simplified or Traditional Chinese |
| `run_decision_tree` | Supported guide questions, fees and filing instructions |

The [global library](/library/) distinguishes verified, partial and blocked records. A missing item means it has not been verified for publication. It does not mean no declaration is required. Returned dates describe the source review, not a new legal review at the time of your request.

## Connect your client

Configure a Streamable HTTP MCP server:

```json
{
  "mcpServers": {
    "entrycardguide": {
      "type": "http",
      "url": "https://entrycardguide.com/api/mcp",
      "headers": {
        "Authorization": "Bearer ecg_YOUR_AUTHORIZED_KEY"
      }
    }
  }
}
```

For direct HTTP requests, also send `Content-Type: application/json`, `Accept: application/json, text/event-stream`, and your negotiated `MCP-Protocol-Version`. Sign-in cookies cannot authorize an MCP request. Requests without a valid, active read grant receive `401`.

## Validation and usage

Every request checks identity, authorization scope, expiration, transport headers, JSON-RPC structure, method parameters and tool arguments. Invalid country IDs, languages, extra properties and invalid decision paths are rejected. Input errors do not consume a call.

The free plan allows **100 successful tool calls per UTC calendar month per account**. `initialize`, `tools/list` and `ping` do not consume calls. Concurrent calls share the same atomic quota. Exhaustion returns `429`.

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_AUTHORIZED_KEY'
```

## Data use

Source URLs and existing guide data remain under [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0). Credit entrycardguide.com when republishing. Commercial licensing questions: `licensing@entrycardguide.com`. The service does not publish named intermediary lists or private research files.
