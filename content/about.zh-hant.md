---
title: "關於我們"
description: "誰在營運 entrycardguide，為什麼有這個網站，我們怎麼賺錢，以及我們承諾永遠不做的事。"
date: 2026-04-25
url: "/zh-hant/about/"
layout: about
lastmod: 2026-08-10
---

## 為什麼有這個網站

本站列出的每個國家都有一份數字入境卡。每一份都是 **免費** 的。每一份都只在一個官方政府網址上提交。

而每一份的背後，Google 搜索結果的最前幾條都坐著一群付費中介，向你索取 20 到 90 美元，去填一份只需要 8 分鐘的免費表格。

2026 年 3 月，泰國皇家移民局公開聲明：**約有 10% 的泰國外國入境者使用過非官方網站填寫 TDAC 並多付了錢**。這個數字促成了這個項目。

我們想不通為什麼沒有人做這件顯而易見的事：一份免費、獨立、白話的指南，把每個國家官方表單的正確網址放在最顯眼的位置，逐欄位講清楚怎麼填。所以我們自己做了。

## 我們是什麼

- 一份獨立的數字入境卡指南。
- 由真正填過每一份表的人撰寫。
- 在官方網站變更時同步更新。
- 以靜態網站形式託管。無賬號、無登入、無資料庫。
- 開源，並且寫明瞭許可證。代碼是 [MIT](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE)，欄位規則、假站名單和這些頁面是 [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)：拿去用可以，但必須署名，並且保持同樣開放。

## 我們不是什麼

- 不是泰國移民局、INM、DGM、馬來西亞移民局，或任何政府機構。
- 不是旅行社。
- 不是簽證中介。
- 與任何簽證代辦服務都沒有任何關聯。
- 不替你填表。我們不會拿你的護照，不會拿你的錢，不會拿你的資料。

<a id="methodology"></a>

## 如何核查我們

不要因為這個站看起來認真就相信我們。請直接看證據。

1. **官方網址存在有版本記錄的 TOML 文件裡。** 我們指向的每個政府網址都放在 [`data/official_urls/{country}.toml`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls)，不是藏在模板裡。以泰國 TDAC 為例，文件裡寫著 `tdac.immigration.go.th`、營運機構、`last_verified` 日期和 Wayback Machine 存檔。你可以同時對照 TOML、存檔頁和今天打開的官網。

2. **欄位規則存在可檢查的 JSON 裡。** 校驗器使用的規則放在 [`data/rules/{country}.json`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules)。這些文件記錄欄位長度、正則、必填項和官方表單返回的錯誤提示。頁面上的校驗器讀取這些規則，不臨時編建議。政府表單一變，JSON 就必須跟著變。

3. **校驗器只在你的瀏覽器裡運行。** 打開 DevTools 的 Network 面板，在校驗器裡輸入內容，你會看到：不會有攜帶護照資料的外發請求。規則嵌在頁面裡，由 [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts) 在本地檢查。我們不記錄按鍵，不保存草稿，也不上傳半填的表單。

4. **整個網站都在 GitHub 上。** 線上頁面對應 [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content) 裡的 Markdown 文件，資料變更對應提交記錄。兩份許可證覆蓋全站：代碼用 [MIT](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE)，資料和指南用 [CC BY-SA 4.0](https://github.com/onlyoasis/entrycardguide/blob/main/LICENSE-CC-BY-SA-4.0)。發現錯誤，可以看 [issues](https://github.com/onlyoasis/entrycardguide/issues)、PR 和 git 歷史。更長的核查流程在這裡：[如何核實本站的每一條說法](/zh-hant/trust/)。

## 我們怎麼賺錢

目前，符合條件的指南底部有一類聯盟連結：

1. **SafetyWing 旅行保險**。你點擊購買後，SafetyWing 會給我們一筆小額佣金。你支付的價格和直接去 SafetyWing 是一樣的。

以後我們可能會加入 eSIM 連結，但只有在真實合作連結已經可用、且頁面清楚披露時才會展示。

就這樣。這就是全部商業模式。

我們 **從來沒有** 收過任何簽證中介的錢。我們也永遠不會，不是因為我們高尚，而是因為那樣做會讓本站存在的整個理由失效，我們喜歡這個理由。

## 我們的承諾

我們永遠不會：

- 因任何與入境卡填寫相關的服務向你收費。
- 收集或儲存你在校驗器裡輸入的任何資料。一切都在你的瀏覽器裡運行。
- 把資料賣給或共享給任何第三方。我們沒有資料可賣。
- 接受簽證中介、移民顧問，或任何與我們指向的官方政府表單形成競爭的服務的廣告。
- 隱瞞某國政策已變化的事實。規則變了，我們就更新頁面，並在頂部打上日期。

我們會：

- 把官方網址放在每份指南的最頂端。
- 在官方表單變化時更新欄位規則。每份規則文件都有 `lastVerified` 日期，可以在 [我們的 GitHub data 文件夾](https://github.com/onlyoasis/entrycardguide/tree/main/data) 審計。
- 在新國家上線數字入境卡且出現相同騙局模式時，加入新國家。
- 一旦發現某條資訊錯了，立即下架。給我們發郵件，我們當天就修。

## 錯誤與勘誤

我們一定會出錯。政府表單會變。新的假站會冒出來。老的假站可能悄悄變得合規。

如果你發現錯誤：

1. 在 [我們的 GitHub](https://github.com/onlyoasis/entrycardguide/issues) 上開一個 issue。
2. 或發郵件到 `corrections@entrycardguide.com`，告訴我們你看到了什麼。

我們的目標是 48 小時內回覆，一週內修復，安全相關的會更快。

## 誰做的

一支小小的旅行者和開發者團隊。我們都至少付過一次中介，才搞清楚原來根本不需要付錢。這個網站是我們讓下一個人不再走同樣冤枉路的方式。

如果你覺得本站有用，並想支持它，下次購買旅行保險時，從符合條件的指南底部的聯盟連結進去就好。這就能讓本站繼續運轉下去。這就是我們全部的請求。
