---
title: "如何核實本站的每一條說法"
kicker: "五條獨立核查路徑。不需要相信我們。"
description: "entrycardguide.com 每一類說法背後的完整方法論。任何人都可以核查，不需要賬號。"
date: 2026-04-27
url: "/zh-hant/trust/"
layout: trust
lastmod: 2026-08-10
---

這是[關於頁方法論部分](/zh-hant/about/#methodology)的長版。短版是：不要相信文案，直接查文件。

## 路徑 1：核實任何官方網址

所有官方網址都在 [`data/official_urls/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls)。打開某個國家的文件，例如 [`data/official_urls/thailand.toml`](https://github.com/onlyoasis/entrycardguide/blob/main/data/official_urls/thailand.toml)，看對應表單的記錄。

每條記錄都寫明網址、營運機構、最近核實日期，通常還有存檔快照。以泰國 TDAC 為例，文件裡有 `tdac.immigration.go.th`、泰國皇家移民局，以及 `.go.th` 後綴為什麼重要的說明。

你可以這樣核查：

1. 對比 TOML 裡的 URL 和頁面上顯示的官方連結。
2. 打開 `archive_url`，確認那個日期該網站確實存在。
3. 打開今天的政府官網，核對域名後綴和機構資訊。

如果三者對不上，頁面就應該修。

## 路徑 2：核實任何欄位規則

校驗器由 [`data/rules/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules) 裡的 JSON 規則驅動，不靠隱藏的伺服器邏輯。打開 [`data/rules/thailand.json`](https://github.com/onlyoasis/entrycardguide/blob/main/data/rules/thailand.json)，你會看到欄位、必填規則、正則、長度限制和錯誤提示。

你也可以自己核查一條規則：打開官方表單，用 Chrome 檢查某個輸入框，對比 HTML 屬性和 JSON。重點看 `maxlength`、`pattern`、`required`、輸入類型，以及官方站返回的錯誤文字。

官方站一旦改欄位，最應該變化的就是這個 JSON 文件。所以每份規則都有核實日期，校驗器也會連結回原始碼。

## 路徑 3：核實校驗器只在本地運行

打開一個帶校驗器的指南，再打開 DevTools 的 Network 面板。往校驗器裡輸入測試資料。頁面不應該發出任何攜帶你輸入內容的請求。

校驗器原始碼在 [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts)。頁面把國家規則作為 JSON 嵌入，腳本在你的瀏覽器裡解析，校驗也在本地完成。

表單校驗器沒有接收草稿欄位的接口。獨立的 MCP 賬戶服務會在 D1 保存已驗證信箱、會話、授權和調用次數；註冊及授權不會提交護照或表單輸入。可在 [MCP 指南](/zh-hant/mcp/) 與 `functions/_mcp/` 核對這條獨立流程。

## 路徑 4：核實整個網站

[`github.com/onlyoasis/entrycardguide`](https://github.com/onlyoasis/entrycardguide) 就是這個站。Markdown 頁面在 [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content)，結構化資料在 [`data/`](https://github.com/onlyoasis/entrycardguide/tree/main/data)，模板在 [`layouts/`](https://github.com/onlyoasis/entrycardguide/tree/main/layouts)，瀏覽器端代碼在 [`assets/js/`](https://github.com/onlyoasis/entrycardguide/tree/main/assets/js)。

本地復現方式：

```powershell
git clone https://github.com/onlyoasis/entrycardguide.git
cd entrycardguide
npm ci
hugo server --gc --disableFastRender
```

本地網站應該和線上網站一致，頁腳顯示的部署提交除外。如果你發現舊資訊、失效的官方網址，或已經無法解析的假站警告，請帶著具體失敗的文件開 [issue](https://github.com/onlyoasis/entrycardguide/issues) 或 PR。
