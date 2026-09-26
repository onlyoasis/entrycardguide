---
title: "MCP 服务器 — 把本站数据接进你的本地 agent"
description: "免费 MCP 服务器，把 entrycardguide 核实过的官方入境表单网址、字段校验规则、费用与决策树提供给 Claude Code、Cursor 及任何 MCP 客户端。仅限注册用户，需要 API key。"
date: 2026-09-26
lastmod: 2026-09-26
url: "/zh/mcp/"
---

## 这是什么

一个 MCP 服务器，地址 `https://entrycardguide.com/api/mcp`。装进 Claude Code、Cursor 或任何 MCP 客户端后，你的 agent 回答「泰国 TDAC 官网是哪个」「巴厘岛 e-CD 为什么不收我的护照号」这类问题时，用的是本站核实过的数据，而不是搜索引擎喂给它的东西。

数据和页面同源：带 `last_verified` 日期的官方政府网址、逐字段的正则和字符上限、费用、截止时间，以及[决策工具](/zh/decide/)背后的决策树。

## 五个工具

| 工具 | 返回内容 |
|---|---|
| `list_countries` | 全部 50 个国家：主表单、官方网址、费用、表单类型、最近核实日期 |
| `get_country_forms` | 一国全部官方网址（机构、存档链接）+ 费用 + 最近 5 条政策变更 |
| `get_field_rules` | 逐字段校验规则：正则、长度上下限、官方网站返回的错误原文 |
| `get_field_guide` | 最容易填错的字段讲解：正确示例、常见错误、被退回的原因（`en` / `zh` / `zh-hant`） |
| `run_decision_tree` | 走决策树：你需要填哪些表、费用、截止时间 |

## 注册（免费）

服务器仅限注册用户。一次 POST，换一个 API key：

```bash
curl -X POST https://entrycardguide.com/api/mcp/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```

响应里有你的 key（`ecg_...`），**只显示这一次**，立刻存好。我们只保存它的哈希；key 丢了，用注册邮箱联系站长补发。

一个邮箱一个 key。v1 没有邮箱验证，别用你不控制的地址注册——key 找回走这个邮箱。

## 接入你的客户端

Claude Code：

```bash
claude mcp add --transport http entrycardguide \
  https://entrycardguide.com/api/mcp \
  --header "Authorization: Bearer ecg_YOUR_KEY"
```

任何支持 streamable HTTP 的 MCP 客户端：

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

没有有效 key 的请求，所有方法（包括 `initialize`）一律 `401`。

## 配额

免费档每个 key **每月 100 次工具调用**（按自然月）。`initialize`、`tools/list`、`ping` 不计数；只有工具调用计数，而且校验失败的调用（国家 slug 打错）不烧配额。

随时查用量：

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_KEY'
```

用超后，工具调用会返回带用量数字的 JSON-RPC 错误。更高的配额和付费档在代码里留了口子（源码见 `functions/_mcp/quota.js`）；批量商用授权走 `licensing@entrycardguide.com`。

## 条款

- **仅限注册用户。** 每个请求都要带 key。别把 key 发进截图，也别留在会公开的 dotfiles 里。
- **署名。** 服务器提供的数据采用 [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)。你的 agent 转述这份数据时要注明来自 entrycardguide.com。不接受 share-alike 的商用条款：`licensing@entrycardguide.com`。
- **和站点同一条反诈骗规则。** 服务器只提供官方网址和字段规则，不提供点名第三方公司的名单。
