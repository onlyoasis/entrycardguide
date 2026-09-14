---
title: "墨西哥 FMM-E 怎麼填：每個欄位填寫指南和常見錯誤"
kicker: "墨西哥官方 INM 表單欄位逐項講解，常見錯誤及含義。約 10 分鐘看完。"
description: "墨西哥 FMM-E 怎麼填：按 INM 官方表單順序講解護照、航班、入境資訊和常見錯誤，附免費官網入口。"
date: 2026-04-24
country: "mexico"
weight: 20
keywords: ["FMM 怎麼填", "墨西哥入境表欄位", "FMM-E 欄位填寫", "INM 表單幫助"]
layout: how-to-fill
lastmod: 2026-09-14
---

{{< official-link site="mexico.fmm" >}}

本指南按官方 INM FMM-E 表單的實際順序，逐欄位講解填寫。貼上到 INM 官方網站之前，先在下面預校驗。

{{< validator country="mexico" >}}

## 第 1 部分：旅客身份

### 護照號

資料頁上 "Passport No." 旁邊的字符串。

- **格式**：字母+數字，6 到 12 位，無空格、無連字符。
- **不要用 MRZ。** 資料頁底部那兩行長字符串是機讀區，含校驗位。用上面的短號。
- **常見錯誤**："Número de pasaporte inválido" 通常是含空格或用了 INM 表單不接受的字符。去空格重試。

### 名（Nombre）

護照上的名（含中間名）。

- **上限 50 字符。**
- **僅拉丁字母。** INM 表單拒絕重音字符和非拉丁文字。參考護照 MRZ 區域的純 ASCII 拼寫。
- 如果護照同時印了原文名和拉丁拼寫，用拉丁拼寫。

### 姓（Apellidos）

姓。在西語國家，人們用兩個姓（父系 + 母系）。如果護照都列了，兩個一起填，單空格分隔。如果只列了一個，就用那一個。

- **上限 50 字符。**
- **帶連字符的姓**：保留連字符，按護照原樣。

### 國籍

護照頒發國，ISO 三字母代碼。

- `USA`、`CAN`、`GBR`、`FRA`、`DEU`、`JPN` 等。
- INM 表單的下拉也有西班牙語全名。兩種都行。如果你要搜，用西班牙語更靠譜：搜 `Estados Unidos` 比搜 `United States` 找到 USA 更快。

### 出生日期

格式：`YYYY-MM-DD`。INM 站多數瀏覽器有日期選擇器；如要貼上，用 ISO 格式。

- `1991-08-22`，不是 `22/08/1991`，也不是 `08-22-1991`。
- **常見錯誤**："Fecha inválida" 幾乎都是因為用了美式 `MM/DD/YYYY`。墨西哥日常用 `DD/MM/YYYY`，但 INM 表單的選擇器接受 `YYYY-MM-DD`。

## 第 2 部分：行程

### 抵達日期

格式：`YYYY-MM-DD`。**真正進入墨西哥** 的日期。

- 航空入境：用機票上墨西哥段的日期。
- 陸路過境：用你計劃過境的日期。如果實際推遲一天，可以重新提交或在邊境更新。

### 入境口岸

機場（IATA 代碼）或陸路口岸。

- 機場：`MEX`（墨西哥城）、`CUN`（坎昆）、`GDL`（瓜達拉哈拉）、`TIJ`（蒂華納）、`PVR`（巴亞爾塔港）、`SJD`（洛斯卡沃斯）等。
- 陸路口岸：INM 下拉按名稱列出（例如 `San Ysidro / Tijuana`、`Laredo / Nuevo Laredo`）。
- 海港：按名稱列出（`Cozumel`、`Progreso` 等）。

如果你的入境口岸不在下拉里，幾乎肯定你不需要 FMM-E：參考 [概覽頁](/zh-hant/mexico/fmm/) 看哪些入境改用護照蓋章。

### 行程目的

選一個。常見選項：

- **Tourism（旅遊）** —— 多數訪客。
- **Business（商務）** —— 參加會議、研討會，但不為墨西哥僱主工作。
- **Transit（過境）** —— 不停留、過境。
- **Study（學習）** —— 報名短期課程。長期學習需另辦學生簽證。
- **Other（其他）** —— 選這個會出現自由文本輸入。

不確定就選 Tourism。差別主要在蓋章授權天數，不影響是否被允許入境。

## 第 3 部分：墨西哥停留

### 墨西哥地址

入住地。

- **上限 200 字符。**
- 旅遊目的下，酒店名 + 城市就夠。
- 示例：`Hotel Xcaret Mexico, Carretera Chetumal-Puerto Juarez Km 282, Playa del Carmen, Quintana Roo`。
- 多地停留：用第一晚的地址。INM 不要求完整行程。
- Airbnb 沒問題，用房東在訂單確認中給的地址。

### 信箱

FMM-E PDF 發到這裡。用持續可查的信箱。

- **上限 80 字符。**
- 確認在幾分鐘內到達。1 小時還沒到先看垃圾箱，再重新提交。
- PDF 含參考號。保留好，邊境可能要用。

---

## 提交後會發生什麼

1. INM 站顯示帶參考號的確認頁。截圖保存。
2. 一封帶 FMM-E PDF 附件的郵件到達。
3. 在邊境：
   - **航空**：航司在值機時可能要看 PDF。落地後官員掃護照，可能要參考號，蓋章，遞迴回執條。
   - **陸路**：走到 INM 櫃檯（通常在海關檢查之後）。出示 PDF。官員蓋章、撕回執條、還給你。
4. **保留回執條** 到離開墨西哥那天。出境時上交。丟了在出境時有一筆小額補辦費。

## 常見錯誤及含義

**"Número de pasaporte inválido" / "Invalid passport number"**
含空格、連字符，或貼上自 MRZ。用資料頁上的短號。

**"Fecha inválida" / "Invalid date"**
你用了 `MM/DD/YYYY` 或 `DD/MM/YYYY`。用日期選擇器，或貼上 `YYYY-MM-DD`。

**"Nacionalidad no encontrada" / "Nationality not found"**
你用英文搜了國名但下拉是西語。試三字母代碼（`USA`、`CAN`、`GBR`）。

**"Correo electrónico inválido"**
信箱格式錯。看尾隨空格或域名拼寫。

**"No se pudo generar el formato"**
INM 伺服器問題，通常臨時性。等 5 分鐘再試。一直不行換一個瀏覽器；INM 站偶爾與 Safari 不兼容。

**1 小時沒收到郵件**
看垃圾箱。還沒有就重新提交。重複無害，邊境官員按最近一份處理。
