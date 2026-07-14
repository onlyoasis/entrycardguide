# PR4:New Zealand + Australia 实施计划

> **For agentic workers:** 由 CodeX(gpt-5.6-sol,reasoning high,workspace-write)执行;Claude 任务间验证与提交。常规结构样板用 USA/UK/Canada 文件;本批两国各有一处结构性偏离,见下。

**Goal:** 14 国 → 16 国。NZ 以免费 NZTD 为主表;Australia 是站内首个 App-only 国家。

**Spec:** `docs/superpowers/specs/2026-07-13-country-expansion-design.md`(阶段 2 / PR 4)

## Global Constraints

与前两批相同:风格规则、先 TOML 后 markdown、英中成对、三日期同日、事实以官方来源为准、scam 证据必须具体、roster 末尾追加、每任务验证到绿。

## 结构性决定(与 USA/UK/Canada 不同处)

1. **NZ 主表 = NZTD(免费)**,NZeTA 是 TOML 第二条目。roster `fee = "free"`(主表免费),subEn/subZh 提示 NZeTA 另算。决策树所有 NZ 路径都返回 NZTD,再按护照追加 NZeTA。
2. **Australia 不创建 `data/rules/australia.json` 和 `data/fields/australia.toml`**。ETA 601 只能用官方 AustralianETA App 申请(NFC 读护照 + 人脸照片),正则校验器和"官方原话错误信息"承诺都不成立。how-to-fill 页用**普通 Markdown 步骤页**(不设 `layout:` 字段,走默认 single 布局;不用 `{{</* validator */>}}`),内容为 App 流程逐步说明。eta.md 仍用 `layout: country-form`(该布局只读 TOML,不依赖 rules)。

## 事实基线(执行时逐条对官方源复核)

### New Zealand

| 项 | 值 | 官方源 |
|---|---|---|
| NZTD(主表)| https://www.travellerdeclaration.govt.nz/,免费,**所有入境者必填**(含新西兰公民);出发前 24 小时内可提交(具体窗口执行时核验) | NZ Customs Service |
| NZeTA(第二条目)| 官方 App 或 immigration.govt.nz 网页;费用 NZD $17(App)/ $23(网页),执行时核验现价 | Immigration New Zealand |
| IVL | 国际游客税 NZD $100,与 NZeTA 同时收取(2024-10-01 起,核验现价) | immigration.govt.nz |
| NZeTA 适用 | 免签国护照(空路)+ 邮轮旅客;澳大利亚公民不需要;澳 PR 需要 | immigration.govt.nz |
| NZeTA 有效期 | 2 年(核验) | immigration.govt.nz |
| form_type | arrival_card(NZTD) | — |
| suffix | .govt.nz | — |

### Australia

| 项 | 值 | 官方源 |
|---|---|---|
| ETA 601(主表)| https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601;**只能用 AustralianETA App 申请**;AUD $20 是 App service charge 不是签证费 | Home Affairs |
| App 官方性 | 开发者名称 + Home Affairs 页面指向的商店链接写入 [eta_app] 条目 | Home Affairs |
| ETA 适用 | 特定护照(美加日韩新港马文等,执行时以官方名单为准);12 个月有效、每次最长 3 个月(核验) | Home Affairs |
| eVisitor 651(第二条目)| https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651;**免费**、ImmiAccount 网页申请、欧洲护照;12 个月/每次 3 个月(核验) | Home Affairs |
| form_type | travel_authorization | — |
| suffix | .homeaffairs.gov.au(按官方 URL 实际主机定) | — |

## 任务(分支 `feat/nz-australia`)

### Task A: 数据文件(NZ 4 个 + Australia 2 个 = 6 个新文件)

- Create: `data/official_urls/new-zealand.toml`(`[nztd]` 主条目 + `[nzeta]` + `[meta]` form_key="nztd"、form_type="arrival_card"、fee_en="Free"、fee_zh="免费")
- Create: `data/rules/new-zealand.json` + `data/fields/new-zealand.toml`(NZTD 网页表单字段,同 key 同序)
- Create: `data/changelog/new-zealand.toml`
- Create: `data/official_urls/australia.toml`(`[eta601]` 主条目 + `[eta_app]` App 条目 + `[evisitor651]` + `[meta]` form_key="eta601"、form_type="travel_authorization"、fee_en="AUD $20 app charge"、fee_zh="20 澳元 App 费")
- Create: `data/changelog/australia.toml`
- **不创建** australia 的 rules/fields
- `[[scam_sites]]` 每国 2–4 条,证据标准同前(具体价格/误导表述 + Observed 日期)
- 验证:build 通过;NZ rules JSON 可 parse
- Commit(Claude):`feat(data): add new-zealand and australia official URLs and data`

### Task B: NZ 内容 + 接线

- Create: `content/new-zealand/` 8 篇:_index、nztd(主表页,layout: country-form)、how-to-fill(layout: how-to-fill)、is-ivisa-official × 英中
- 标题瞄准:"is NZTD free"、"nz traveller declaration official"、"NZeTA 多少钱"
- 正文讲清:NZTD 免费且人人必填;NZeTA 是另一回事(免签护照才需要,NZD $17/$23 + IVL $100);中介把两者打包加价的模式
- 决策树:country options 追加 new-zealand;`nz_passport` question → 三分支:nz_au_citizen(NZ/Australian citizen)→ 只要 NZTD;visa_waiver → NZTD + NZeTA(forms 数组两项,NZeTA fee 写 "NZD $17–$23 + IVL NZD $100" 以核验值为准);other → NZTD + 签证 note。lastVerified bump
- roster 末尾追加:
  `(dict "key" "new-zealand" "en" "New Zealand" "zh" "新西兰" "flag" "🇳🇿" "formKey" "nztd" "formCode" "NZTD" "guideSlug" "nztd" "fee" "free" "subEn" "NZeTA separate" "subZh" "NZeTA 另算")`
- 验证:build + check:seo;目录卡 15;decide 含 nz_passport;how-to-fill 字段卡数与 fields 条数一致
- Commit(Claude):`feat(new-zealand): country pages, decision tree, roster`

### Task C: Australia 内容 + 接线

- Create: `content/australia/` 8 篇:_index、eta(layout: country-form)、how-to-fill(**无 layout 字段**,普通步骤页,无 validator)、is-ivisa-official × 英中
- 标题瞄准:"australian eta app official"、"is australia eta free"、"澳大利亚 ETA 多少钱"
- 正文讲清:没有网页申请表,唯一官方途径是 AustralianETA App(第一屏);AUD $20 是 App 服务费;eVisitor 651 对欧洲护照免费(独立小节,别让欧洲读者多花 $20);网页上任何"帮你申请 ETA"的表单都是中介;中介加价对比
- how-to-fill 内容 = App 流程步骤(下载核对开发者 → NFC 读护照 → 人脸照片 → 填答问题 → 支付 AUD $20 → 出结果),每步一个小节
- 决策树:country options 追加 australia;`australia_passport` question → eta_eligible(ETA-eligible passport)→ ETA App 结果(fee "AUD $20 app charge");evisitor_eligible(European passport)→ eVisitor 结果(fee "FREE");other → 签证 note + fallback。lastVerified bump
- roster 末尾追加:
  `(dict "key" "australia" "en" "Australia" "zh" "澳大利亚" "flag" "🇦🇺" "formKey" "eta601" "formCode" "ETA" "guideSlug" "eta" "fee" "paid" "subEn" "App only, AUD $20" "subZh" "仅限 App，20 澳元")`
- 验证:build + check:seo;目录卡 16;decide 含 australia_passport;/australia/how-to-fill/ 正常渲染(无字段卡、无 validator 容器)
- Commit(Claude):`feat(australia): country pages, decision tree, roster`

### Task D: 批次收尾(Claude)

- 全量验证 + 浏览器走查(重点:/australia/how-to-fill/ 的普通布局、决策树 NZ 双表单结果卡)+ 费用独立二次核验(NZeTA/IVL、AUD $20)+ 合并 main
