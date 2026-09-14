---
title: "變更日誌"
description: "entrycardguide.com 的重要變更：政府政策更新、新國家和內容勘誤。"
date: 2026-04-27
url: "/zh-hant/changelog/"
lastmod: 2026-08-10
---

這裡記錄實質性更新。出現這些情況時，我們會新增一條：

- 政府移民機構修改表單欄位、費用或適用規則
- 新國家上線數字入境卡，我們開始覆蓋
- 我們發現並修正已有指南中的事實錯誤
- 我們新增或下線一整類內容

我們**不會**記錄每個錯別字或樣式微調。那些可以看 [git 歷史](https://github.com/onlyoasis/entrycardguide/commits/main)。

---

## 2026-08-10 - 下線中介名單

本站不再發佈列舉各國收費中介網站的頁面。這 36 個頁面幾乎沒有讀者，卻承擔了點名第三方的全部法律風險；7 月的逐站複核還發現，其中多數公司如今自己就寫明瞭非官方身份，原來的表述已經不成立。

沒有替代內容。官方網址和逐欄位填寫指南本來就承載了真正要傳達的資訊，而且它們才是讀者實際會看的頁面。

- 移除：全部 18 個國家的 `/{country}/is-ivisa-official/`，中英各一份
- 移除：主表頁上的證據卡片畫廊和 14 張截圖
- 保留：每一條官方網址、`last_verified` 日期、費用說明和欄位指南
- 保留：價格對比，只是去掉了公司名——官方總額與商業網站收費的對照仍在每篇指南里
- 舊網址 301 跳轉到對應國家頁

## 2026-06-17 - 為未變更的官方連結補齊 URL 核驗日期

重新檢查了 6 月地址審計中未發生變化的官方 URL 記錄，並更新它們的 `last_verified` 日期，不再保留舊的 4 月日期。

- 更新：馬來西亞 MDAC、墨西哥 FMM-E、新加坡 SGAC、印尼 All Indonesia / e-VOA、菲律賓 eTravel、柬埔寨 e-Arrival、日本 Visit Japan Web、韓國 e-Arrival Card
- 更新：泰國 TDAC 主入口和越南兩個當前 e-visa 官方域名
- 保持不變：這次複查仍返回 403 或 DNS 失敗的 URL，不在缺少證據時標為“已重新核驗”

---

## 2026-06-11 - 新增菲律賓、柬埔寨、日本、韓國；修正印尼和越南官網地址

新增四個國家，並在實時地址審計後刷新印尼和越南的官方 URL 資料。

- 新增：`/philippines/`、`/cambodia/`、`/japan/`、`/korea/`
- 新增：英文和中文國家首頁、表單指南、欄位指南、官方站判斷頁、rules JSON、fields TOML、official URL TOML 和國家 changelog
- 更新：印尼當前統一入境申報入口改為 `allindonesia.imigrasi.go.id`，e-VOA 改為 `evisa.imigrasi.go.id`
- 更新：越南以 `evisa.gov.vn` 作為主要 e-visa URL，並記錄 `thithucdientu.gov.vn` 為官方備用入口
- 移除：DNS 已失效的 `thailand-tdac.com` 和 `vietnam-visa-online.com` 活躍警示卡
- 更新：網站導航和決策工具現在覆蓋 11 個國家

---

## 2026-04-27 - 方法論和新鮮度信號上線

在 `/zh/about/` 增加公開方法論，在 `/zh/trust/` 增加長版核查頁面，並在文章側欄顯示內容新鮮度。側欄現在會顯示每篇指南最近核實的時間，並連結回這份變更日誌。

- 新增：`/trust/`、`/zh/trust/`、`/changelog/`、`/zh/changelog/`
- 更新：`/about/`、`/zh/about/`、文章側欄新鮮度徽章
- 新增：月度維護清單和各國家 changelog TOML 文件

---

## 2026-04-26 - 新增越南、印度尼西亞、新加坡

新增三個國家，並提供完整英文和中文內容。越南是本站第一個底層表單確實有政府費用的國家，所以敘事重點是“中介加價”，不是“免費表單被轉賣”。

- 新增：`/vietnam/`、`/indonesia/`、`/singapore/`
- 新增：每個國家的主指南、填寫指南和官方站解釋頁
- 更新：網站導航現在列出七個國家

---

## 2026-04-26 - 假站 DNS 審計

重新審計已知假站域名，並刪除失效條目，不保留過期警告。提交 [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) 刪除了 13 個 DNS 檢查失敗的域名。

- 更新：`data/official_urls/*.toml`
- 規則：只列出審計時仍能解析、且有證據說明的域名

---

## 2026-04-25 - SEO 輸出檢查和網站地圖驗證

增加 robots.txt 和 sitemap 生成後的自動檢查，避免 Cloudflare Pages 發佈後影響 Google Search Console。

- 新增：`scripts/check-seo-output.mjs`
- 更新：GitHub Actions 在生產構建後運行 SEO 檢查
- 已驗證：根 sitemap index 和各語言 sitemap 正常生成

---

## 2026-04-22 - 新增泰國 TDAC

發佈第一個國家。覆蓋 `tdac.immigration.go.th` 的 TDAC 全流程，說明泰國移民局在 2026 年 3 月公開警告的中介收費問題，並加入瀏覽器本地校驗器。

- 新增：`/thailand/tdac/`、`/thailand/how-to-fill/`、`/thailand/is-ivisa-official/`
- 新增：`data/official_urls/thailand.toml`、`data/rules/thailand.json`

---

## 如何理解審計日期

每個國家的 `data/official_urls/{country}.toml` 都有 `last_verified` 欄位。每次我們對照真實官網重新核實時都會更新它。如果你看到某篇指南超過 90 天沒有複核，請把它當成可能過期，並先去官方站自行確認。
