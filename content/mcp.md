---
title: "MCP server — use this site's data in your local agent"
description: "Free MCP server exposing entrycardguide's verified official entry-form URLs, field validation rules, fees, and decision tree to Claude Code, Cursor, and any MCP client. Registered users only; API key required."
date: 2026-09-26
lastmod: 2026-09-26
url: "/mcp/"
---

## What this is

An MCP server at `https://entrycardguide.com/api/mcp`. Add it to Claude Code, Cursor, or any MCP client, and your agent answers questions like *"what's the official Thailand TDAC site?"* or *"why does Bali e-CD reject my passport number?"* from this site's verified data instead of whatever a search engine serves it.

Same data the pages use: official government URLs with `last_verified` dates, per-field regex and character limits, fees, deadlines, and the decision tree behind the [decide tool](/decide/).

## The five tools

| Tool | Returns |
|---|---|
| `list_countries` | All 50 countries: main form, official URL, fee, form type, last-verified date |
| `get_country_forms` | Every official URL for one country (agency, archive link) + fees + 5 latest policy changes |
| `get_field_rules` | Per-field validation rules: regex, min/max length, the exact error text the official site returns |
| `get_field_guide` | The most error-prone fields explained: right example, common mistake, why it gets rejected (`en` / `zh` / `zh-hant`) |
| `run_decision_tree` | Walk the decision tree: which forms you must file, fees, deadlines |

## Register (free)

The server is for registered users. One POST, one API key:

```bash
curl -X POST https://entrycardguide.com/api/mcp/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```

The response contains your key (`ecg_...`). It is shown **once** — copy it somewhere safe. We store only its hash; if you lose the key, email the maintainer from your registered address.

One key per email. No email verification in v1; don't register with an address you don't control, because key recovery goes through it.

## Connect your client

Claude Code:

```bash
claude mcp add --transport http entrycardguide \
  https://entrycardguide.com/api/mcp \
  --header "Authorization: Bearer ecg_YOUR_KEY"
```

Any MCP client that speaks streamable HTTP:

```json
{
  "mcpServers": {
    "entrycardguide": {
      "type": "http",
      "url": "https://entrycardguide.com/api/mcp",
      "headers": { "Authorization": "Bearer ecg_YOUR_KEY" }
    }
  }
}
```

Requests without a valid key get `401` on every method, `initialize` included.

## Quota

The free plan allows **100 tool calls per calendar month** per key. `initialize`, `tools/list`, and `ping` are not counted; only tool calls are, and a call that fails validation (typo'd country slug) does not burn quota.

Check your usage any time:

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_KEY'
```

When you hit the limit, tool calls return a JSON-RPC error with your usage numbers. Heavier quotas and paid tiers exist as a seam in the code (`functions/_mcp/quota.js`, if you're reading the source); commercial licensing for bulk access goes through `licensing@entrycardguide.com`.

## Terms

- **Registered users only.** Every request needs your key. Don't publish your key in screenshots or dotfiles that end up in public repos.
- **Attribution.** The data this server serves is [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0). If your agent's output republishes it, credit entrycardguide.com. Commercial-use terms without share-alike: `licensing@entrycardguide.com`.
- **Same anti-scam rule as the site.** The server serves official URLs and field rules. It does not serve lists of named third-party companies.
