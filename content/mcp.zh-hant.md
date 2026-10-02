---
title: "MCP：登入並授權你的 Agent"
description: "通過 MCP 獲取官方入境表指南和全球目的地資料。驗證信箱並登入後，單獨授權可撤銷的只讀憑據。"
date: 2026-09-26
url: "/zh-hant/mcp/"
lastmod: 2026-09-26
---

## 註冊、登入與授權

[打開賬戶頁面](/api/mcp/account?lang=zh-hant)。使用自己的信箱註冊，輸入收到的一次性驗證碼完成信箱驗證和登入。再次登入時重新申請驗證碼；驗證碼10分鐘內有效。

註冊和登入不會直接開通 MCP。登入後在賬戶頁明確授權**只讀 MCP 訪問**，才會生成 API key。憑據只顯示一次，請保存到客戶端的安全儲存中。憑據30天后過期，也可隨時在賬戶頁撤銷。同一賬戶下所有憑據共用調用額度。

## 可用工具

| 工具 | 返回內容 |
|---|---|
| `list_countries` | 全部249個目的地、核實狀態、資料庫連結與已有指南 |
| `get_jurisdiction` | 一個目的地可公開的有來源申報事項、原核實日期、來源與覆蓋情況 |
| `get_country_forms` | 53個詳細表單指南中的一個國家的官方連結與費用 |
| `get_field_rules` | 欄位規則或準備資料說明，明確其校驗模式 |
| `get_field_guide` | 英文、簡體或繁體的欄位示例及填寫說明 |
| `run_decision_tree` | 已支持指南的決策問題、費用和填報說明 |

[全球資料庫](/zh-hant/library/)區分已核實、部分核實和受阻記錄。沒有公開某個事項，表示該事項未通過公開核驗，不能理解為無需申報。返回日期是來源核實日期，不代表調用時重新核實了法規。

## 接入客戶端

配置支持 Streamable HTTP 的 MCP 客戶端：

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

直接調用 HTTP 時還需發送 `Content-Type: application/json`、`Accept: application/json, text/event-stream` 和協商後的 `MCP-Protocol-Version`。登入 Cookie 不能授權 MCP 請求。缺少有效只讀授權的請求返回 `401`。

## 校驗與調用額度

每次請求檢查身份、授權範圍、到期狀態、傳輸請求頭、JSON-RPC 結構、方法參數和工具參數。無效國家編號、語言、額外欄位及無效決策路徑均被拒絕。輸入錯誤不扣調用次數。

免費賬戶每個UTC自然月可成功調用工具**100次**。`initialize`、`tools/list`、`ping`不計數。併發調用通過同一原子額度檢查，額度用盡返回`429`。

```bash
curl https://entrycardguide.com/api/mcp/whoami \
  -H 'Authorization: Bearer ecg_YOUR_AUTHORIZED_KEY'
```

## 資料使用

來源網址和已有指南資料繼續使用[CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)。轉載須註明entrycardguide.com。商業授權請聯繫`licensing@entrycardguide.com`。服務不發佈點名中介名單或內部研究文件。
