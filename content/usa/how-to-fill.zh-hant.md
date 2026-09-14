---
title: "ESTA 怎麼填：9 組欄位逐項中文說明（2026）"
kicker: "從電子護照號碼到標為 Optional 的社交媒體欄目，按 9 組欄位核對。"
description: "ESTA 怎麼填：護照、姓名、出生日期、信箱、電話、住址、僱主、美國聯繫人和可選社交媒體欄位。"
date: 2026-07-14
country: "usa"
weight: 20
keywords: ["ESTA 怎麼填", "ESTA 填寫", "ESTA 僱主", "ESTA 美國聯繫人 UNKNOWN", "ESTA 社交媒體 Optional"]
layout: how-to-fill
lastmod: 2026-09-14
---

{{< official-link site="usa.esta" >}}

準備好赴美時要使用的電子護照，在 CBP 官網填寫。ESTA 是收費旅行授權，不是簽證。獲批後的官方總價為 40.27 美元：先收 4.00 美元處理費，獲批後再收 36.27 美元。最遲在出發前 72 小時提交。

下面的本地檢查器讀取 `data/rules/usa.json`，覆蓋 9 組欄位。資料只在瀏覽器內檢查，不會發給本站。最終填寫要求以 CBP 實際頁面為準。

{{< validator country="usa" >}}

## 付款前再看一次網址

主機名必須是 `esta.cbp.dhs.gov`。官方先收 4.00 美元處理費，只有申請獲批才再收 36.27 美元。結果為 Travel Not Authorized 時，只應扣 4.00 美元。

提交後保存申請編號。授權通常有效 2 年或到護照到期日，以先到者為準；文萊護照的有效期為 1 年。
