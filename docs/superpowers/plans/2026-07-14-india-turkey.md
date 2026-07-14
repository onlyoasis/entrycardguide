# PR5:India + Turkey 实施计划(扩充收官批次)

> **For agentic workers:** 由 CodeX(gpt-5.6-sol,reasoning high,workspace-write)执行;Claude 任务间验证与提交。常规结构样板:免费主表参考 new-zealand(NZTD 主表 + 付费第二条目),付费主表参考 usa/uk。

**Goal:** 16 国 → 18 国,完成七国扩充。India 以免费 e-Arrival Card 为主表;Turkey 是站内首个"很多读者根本不需要表"的国家,决策树资格先行。

**Spec:** `docs/superpowers/specs/2026-07-13-country-expansion-design.md`(阶段 2 / PR 5)

## Global Constraints

与前三批相同:风格规则、先 TOML 后 markdown、英中成对、三日期同日、事实以官方来源为准、scam 证据必须具体(价格/误导表述 + Observed 日期)、roster 末尾追加、每任务验证到绿。

## 结构性决定

1. **India 主表 = e-Arrival Card(免费)**,e-Visa 是 TOML 第二条目(付费、按国籍/时长变价)。roster `fee = "free"`。India 的独特风险:**官方域名 indianvisaonline.gov.in 有大量近似仿冒域名**(如 .org/.us 变体),is-ivisa-official 页要正面讲"怎么核对 .gov.in 后缀"。
2. **Turkey 资格先行**(spec 硬性要求):大量国籍免签(德法意西日韩港新等),把免签旅客推去付费 e-Visa 是本站最不可接受的错误。决策树第一问就是护照资格;eta.md 对应页(evisa.md)标题采用 "check whether you need one before paying" 方向;**费用不硬编码**,meta `fee_en = "Varies by passport"`、`fee_zh = "按护照而定"`,正文给常见国籍的当前价目举例并注明会变。
3. 两国主表都是网页表单 → rules/fields 正常创建(各一套)。

## 事实基线(执行时逐条对官方源复核,以官方页面为准)

### India

| 项 | 值 | 官方源 |
|---|---|---|
| e-Arrival Card(主表)| indianvisaonline.gov.in 体系下的官方门户(确切 URL 执行时核验);免费;外国旅客抵达前 72 小时内提交(含 OCI 持有人;豁免人群核验) | Bureau of Immigration / indianvisaonline.gov.in |
| e-Visa(第二条目)| https://indianvisaonline.gov.in/evisa/tvoa.html;费用按国籍与时长变化(30 天旅游签淡旺季不同价、1 年、5 年档,执行时核验现价);仅限指定入境口岸 | indianvisaonline.gov.in |
| 谁需要什么 | 免签仅极少数(尼泊尔/不丹等);多数游客需要 e-Visa 或贴纸签;所有人抵达都要 e-Arrival Card | 官方 |
| form_type | arrival_card(主表) | — |
| suffix | .gov.in | — |

### Turkey

| 项 | 值 | 官方源 |
|---|---|---|
| e-Visa | https://www.evisa.gov.tr/;费用按国籍变化(核验几个代表国籍现价:美/英/加/澳/中等);90 天多次或 30 天单次按国籍 | evisa.gov.tr |
| 免签国籍 | 德法意西荷比葡瑞挪丹芬日韩港新泰马等大量国籍 90 天免签(以外交部名单为准,核验) | mfa.gov.tr |
| 有条件 e-Visa | 部分国籍需满足附加条件(持 OECD/申根有效签证等)才能用 e-Visa | evisa.gov.tr |
| form_type | evisa | — |
| suffix | .gov.tr | — |

## 任务(分支 `feat/india-turkey`)

### Task A: 数据文件(10 个新文件)

- Create: `data/official_urls/india.toml`(`[earrival]` 主条目 + `[evisa]` 第二条目 + `[meta]` form_key="earrival"、form_type="arrival_card"、fee_en="Free"、fee_zh="免费"、guide_slug="e-arrival-card")
- Create: `data/rules/india.json` + `data/fields/india.toml`(e-Arrival Card 表单字段,同 key 同序)
- Create: `data/changelog/india.toml`
- Create: `data/official_urls/turkey.toml`(`[evisa]` 主条目 + `[mfa_visa_info]` 免签名单条目 + `[meta]` form_key="evisa"、form_type="evisa"、fee_en="Varies by passport"、fee_zh="按护照而定"、guide_slug="evisa")
- Create: `data/rules/turkey.json` + `data/fields/turkey.toml`(e-Visa 表单字段)
- Create: `data/changelog/turkey.toml`
- `[[scam_sites]]` 每国 2–4 条,标准同前;India 特别留意 indianvisaonline 的近似仿冒域名(必须逐个确认当前可访问且有具体收费/误导证据)
- 验证:build 通过;两个 rules JSON 可 parse
- Commit(Claude):`feat(data): add india and turkey official URLs, rules, fields, changelogs`

### Task B: India 内容 + 接线

- Create: `content/india/` 8 篇:_index、e-arrival-card(主表页,layout: country-form)、how-to-fill(layout: how-to-fill)、is-ivisa-official × 英中
- 标题瞄准:"india e-arrival card official"、"is india e-arrival card free"、"印度入境卡"、"india evisa official site"
- 正文讲清:e-Arrival Card 免费、抵达前 72 小时、人人要填;e-Visa 是另一回事(按国籍/时长收费、指定口岸);**近似仿冒域名怎么识别**(.gov.in 后缀逐字核对);中介加价证据
- 决策树:country options 追加 india;`india_status` question:已持签证/OCI → 只要 e-Arrival Card(免费);需要签证 → e-Arrival Card + e-Visa 两项(e-Visa fee "Varies by nationality");不确定 → e-Arrival + 官方名单 note。lastVerified 保持 2026-07-14
- roster 末尾追加:
  `(dict "key" "india" "en" "India" "zh" "印度" "flag" "🇮🇳" "formKey" "earrival" "formCode" "e-Arrival Card" "guideSlug" "e-arrival-card" "fee" "free" "subEn" "e-Visa separate" "subZh" "电子签另算")`
- 验证:build + check:seo;目录卡 17;decide 含 india_status;how-to-fill 字段卡数与 fields 一致
- Commit(Claude):`feat(india): country pages, decision tree, roster`

### Task C: Turkey 内容 + 接线

- Create: `content/turkey/` 8 篇:_index、evisa(主表页,layout: country-form)、how-to-fill(layout: how-to-fill)、is-ivisa-official × 英中
- 标题方向(spec 指定):"Turkey e-Visa: check whether you need one before paying"、"is turkey evisa official"、"土耳其电子签多少钱"
- 正文结构:**第一节就是"你可能根本不需要 e-Visa"**(免签国籍名单入口 + 官方核对方式);然后才是 e-Visa 资格/费用(常见国籍举例价 + "以官网即时报价为准");有条件 e-Visa 一节;中介加价证据
- 决策树(资格先行,spec 硬性要求):country options 追加 turkey;`turkey_passport` question:visa_exempt(90 天免签国护照)→ turkey_none_result(空 forms,note "不需要任何表,谁收钱谁是中介");evisa_eligible → turkey_evisa_result(fee "Varies by passport");conditional(需持 OECD 签证等条件)→ turkey_conditional_result(note 讲条件 + 官方入口);other → turkey_visa_result(使馆签 + fallback)。lastVerified 保持 2026-07-14
- roster 末尾追加:
  `(dict "key" "turkey" "en" "Turkey" "zh" "土耳其" "flag" "🇹🇷" "formKey" "evisa" "formCode" "E-Visa" "guideSlug" "evisa" "fee" "paid" "subEn" "Many are visa-exempt" "subZh" "很多国籍免签")`
- 验证:build + check:seo;目录卡 18;decide 含 turkey_passport;how-to-fill 字段卡数与 fields 一致
- Commit(Claude):`feat(turkey): country pages, decision tree, roster`

### Task D: 批次收尾(Claude)

- 全量验证 + 浏览器走查(重点:决策树 Turkey 免签路径的"零表单"结果卡、India 双表单路径)+ 费用独立二次核验 + 合并 main + 扩充收官盘点(18 国全量构建统计)
