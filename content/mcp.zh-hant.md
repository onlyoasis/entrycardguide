---
title: "MCP 伺服器 — 把本站資料接進你的本地 agent"
description: "免費 MCP 伺服器，把 entrycardguide 核實過的官方入境表單網址、欄位校驗規則、費用與決策樹提供給 Claude Code、Cursor 及任何 MCP 客戶端。僅限註冊用戶，需要 API key。"
date: 2026-09-26
url: "/zh-hant/mcp/"
lastmod: 2026-09-26
---

## 這是什麼

一個 MCP 伺服器，地址 `https://entrycardguide.com/api/mcp`。裝進 Claude Code、Cursor 或任何 MCP 客戶端後，你的 agent 回答「泰國 TDAC 官網是哪個」「巴厘島 e-CD 為什麼不收我的護照號」這類問題時，用的是本站核實過的資料，而不是搜索引擎餵給它的東西。

資料和頁面同源：帶 `last_verified` 日期的官方政府網址、逐欄位的正則和字符上限、費用、截止時間，以及[決策工具](/zh-hant/decide/)背後的決策樹。

## 五個工具

| 工具 | 返回內容 |
|---|---|
| `list_countries` | 全部 50 個國家：主表單、官方網址、費用、表單類型、最近核實日期 |
| `get_country_forms` | 一國全部官方網址（機構、存檔連結）+ 費用 + 最近 5 條政策變更 |
| `get_field_rules` | 逐欄位校驗規則：正則、長度上下限、官方網站返回的錯誤原文 |
| `get_field_guide` | 最容易填錯的欄位講解：正確示例、常見錯誤、被退回的原因（`en` / `zh` / `zh-hant`） |
| `run_decision_tree` | 走決策樹：你需要填哪些表、費用、截止時間 |

## 註冊（免費）

伺服器僅限註冊用戶。一次 POST，換一個 API key：

```bash
curl -X POST https://entrycardguide.com/api/mcp/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```

響應裡有你的 key（`ecg_...`），**只顯示這一次**，立刻存好。我們只保存它的哈希；key 丟了，用註冊信箱聯繫站長補發。

一個信箱一個 key。v1 沒有信箱驗證，別用你不控制的地址註冊——key 找回走這個信箱。

## 接入你的客戶端

Claude Code：

```bash
claude mcp add --transport http entrycardguide \
  https://entrycardguide.com/api/mcp \
  --header "Authorization: Bearer ecg_YOUR_KEY"
```

任何支持 streamable HTTP 的 MCP 客戶端：

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

沒有有效 key 的請求，所有方法（包括 `initialize`）一律 `401`。

## 配額

免費檔每個 key **每月 100 次工具調用**（按自然月）。`initialize`、`tools/list`、`ping` 不計數；只有工具調用計數，而且校驗失敗的調用（國家 slug 打錯）不燒配額。

隨時查用量：

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_KEY'
```

用超後，工具調用會返回帶用量數字的 JSON-RPC 錯誤。更高的配額和付費檔在代碼裡留了口子（原始碼見 `functions/_mcp/quota.js`）；批量商用授權走 `licensing@entrycardguide.com`。

## 條款

- **僅限註冊用戶。** 每個請求都要帶 key。別把 key 發進截圖，也別留在會公開的 dotfiles 裡。
- **署名。** 伺服器提供的資料採用 [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)。你的 agent 轉述這份資料時要註明來自 entrycardguide.com。不接受 share-alike 的商用條款：`licensing@entrycardguide.com`。
- **和網站同一條反詐騙規則。** 伺服器只提供官方網址和欄位規則，不提供點名第三方公司的名單。
