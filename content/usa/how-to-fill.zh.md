---
title: "ESTA 怎么填：9 组字段逐项中文说明（2026）"
kicker: "从电子护照号码到标为 Optional 的社交媒体栏目，按 9 组字段核对。"
description: "ESTA 怎么填：护照、姓名、出生日期、邮箱、电话、住址、雇主、美国联系人和可选社交媒体字段。"
date: 2026-07-14
lastmod: 2026-07-14
country: "usa"
weight: 20
keywords: ["ESTA 怎么填", "ESTA 填写", "ESTA 雇主", "ESTA 美国联系人 UNKNOWN", "ESTA 社交媒体 Optional"]
layout: how-to-fill
---

{{< official-link site="usa.esta" >}}

准备好赴美时要使用的电子护照，在 CBP 官网填写。ESTA 是收费旅行授权，不是签证。获批后的官方总价为 40.27 美元：先收 4.00 美元处理费，获批后再收 36.27 美元。最迟在出发前 72 小时提交。

下面的本地检查器读取 `data/rules/usa.json`，覆盖 9 组字段。数据只在浏览器内检查，不会发给本站。最终填写要求以 CBP 实际页面为准。

{{< validator country="usa" >}}

## 付款前再看一次网址

主机名必须是 `esta.cbp.dhs.gov`。官方先收 4.00 美元处理费，只有申请获批才再收 36.27 美元。结果为 Travel Not Authorized 时，只应扣 4.00 美元。

提交后保存申请编号。授权通常有效 2 年或到护照到期日，以先到者为准；文莱护照的有效期为 1 年。
