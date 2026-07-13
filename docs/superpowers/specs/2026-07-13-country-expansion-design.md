# 国家扩充设计:11 国 → 18 国

日期:2026-07-13
状态:已批准(用户确认于本日)
讨论记录:Claude 起草 → CodeX consult 一轮收敛(session 019f5bab-6d5a-70c1-8dee-4ccd78d1667d)→ 用户拍板

## 目标

按国际旅游热度增补 7 国:**USA、UK、Canada、Australia、New Zealand、India、Turkey**。

选国依据:2024 年国际游客量排名(UN Tourism)中,排名靠前、有现行官方在线入境表/旅行授权、且被付费中介拦截搜索的国家。法国/西班牙/意大利等申根国排除——ETIAS 2026 Q4 才上线,当前没有可填的表,不建"填写指南"。

| 国家 | 2024 游客量排名 | 表单 | 官方入口 | 费用 |
|---|---|---|---|---|
| USA | #3 (72.4M) | ESTA | esta.cbp.dhs.gov | USD 40 |
| Turkey | #4 (60.6M) | e-Visa | evisa.gov.tr | 按护照变化,多国免签 |
| UK | #6 (41.8M) | ETA | gov.uk + UK ETA App | £20 |
| Canada | — | eTA | canada.ca | CAD 7 |
| Australia | — | ETA (601) | immi.homeaffairs.gov.au(App-only)| AUD 20 App 费 |
| New Zealand | — | NZTD(主)+ NZeTA | travellerdeclaration.govt.nz | NZTD 免费;NZeTA from NZD 17 |
| India | ~#15 | e-Arrival Card(主)+ e-Visa | indianvisaonline.gov.in | e-Arrival 免费;e-Visa 收费 |

所有费用/URL 在内容撰写时逐条对官方网站再核验,不以本表为准。

## 阶段 0:先修地基(单独 PR,不加任何国家)

新增付费授权类国家会踩中四个现有裂缝:

1. **`layouts/shortcodes/official-directory.html` 去硬编码**。当前硬编码了一份独立国家数组,费用只特判越南。改为消费 `layouts/partials/country-roster.html` + TOML meta;费用文案读 `meta.fee_en/fee_zh`。
2. **表单类型字段**。roster 与 TOML meta 增加 `form_type: arrival_card | travel_authorization | evisa`。`layouts/_default/list.html` 停止把一切付费项目统称 "paid government e-visa"(ESTA/UK ETA/Canada eTA 都不是签证);首页 §02 图例与底部汇总文案同步按类型渲染。
3. **`layouts/shortcodes/decide.html` 无 JS fallback 去硬编码**。当前写死 11 国,改为从 roster 生成。
4. **`layouts/shortcodes/scam-site.html` 兑现法律防线**。构建时强制对应 TOML 条目的 `evidence` 与 `first_observed` 非空,缺失即 `errorf`。当前只查域名是否存在于数组,与 CLAUDE.md 的承诺不符。

阶段 0 验收:`npm run build:prod`、`npm run check:seo` 全绿;现有 11 国页面输出与改造前 diff 一致(允许 "e-visa" 文案措辞修正)。

## 阶段 1:USA 打样(第二个 PR)

ESTA 是标准网页表单,走完整现有模型,最先暴露"付费授权 ≠ 电子签"的全部文案问题:

- `content/usa/`:`_index`、`esta`、`how-to-fill`、`is-ivisa-official` 各英中两份
- `data/rules/usa.json`:ESTA 真实字段(护照号、雇主、社交媒体等)的正则/长度/官方错误信息
- `data/official_urls/usa.toml`:esta.cbp.dhs.gov、USD 40、`form_type = "travel_authorization"`、archive 快照、`[[scam_sites]]`(带证据)
- `data/changelog/usa.toml`、`data/decision/tree.json` 节点、roster 追加一行(见"横切规则")

## 阶段 2:分批推进(每 PR 1–2 国)

| 批次 | 国家 | 特殊建模 |
|---|---|---|
| PR 3 | UK + Canada | UK:官方 App 与 gov.uk 双入口,App 条目记录开发者名与政府页指向的商店链接;Canada:标准 eTA 网页表单 |
| PR 4 | NZ + Australia | 见下 |
| PR 5 | India + Turkey | 见下 |

**New Zealand**:`formKey = "nztd"`。NZTD 免费、所有入境者必填(含新西兰公民),贴合"arrival card"定位;NZeTA 作为 TOML 第二条目。决策树始终返回 NZTD,再按护照/身份决定是否追加 NZeTA。NZeTA 费用写 "From NZD 17"(申请渠道与 IVL 影响总额)。

**Australia**:`formKey = "eta601"`,URL 指向 Home Affairs Subclass 601 官方说明页(不用 App Store 链接冒充政府主入口)。页面第一屏写明:**没有网页申请表,只能通过 AustralianETA App 申请**;AUD 20 是 App service charge。`[evisitor651]` 第二条目(仅特定欧洲护照、免费、网页申请)。**不创建空的 `rules/australia.json`,how-to-fill 页不套 how-to-fill 布局**(该布局公开声称展示官方正则与原话错误信息,对 App 内 NFC 扫描/活体照片不成立),用普通 Markdown 步骤页。

**India**:主表为免费 e-Arrival Card(抵达前 72 小时提交);e-Visa 作为第二条目 + 诈骗预警重点(中介站多、搜索意图强)。

**Turkey**:决策树资格先行,不默认推 e-Visa:① 该护照免签 → 不需要任何表;② 可 e-Visa;③ 需使馆签证;④ 不确定 → 官方国籍表。费用写"按护照和类型变化",不硬编码数字。页面标题采用 "Turkey e-Visa: check whether you need one before paying" 方向。

## 横切规则

- **Roster 顺序**:新国家一律追加到 roster 末尾(`order = traffic`,新页面站内流量为零,不拍脑袋插前排)。上线 28–56 天后按 Search Console 实际点击重排。
- **Key/路由**:`usa`、`uk`、`canada`、`australia`、`new-zealand`、`india`、`turkey`。目录名 = TOML 文件名 = 路由段。
- **分工**:Claude 定每国规格与校验标准;内容由 CodeX exec 逐国起草;Claude 抽检、逐条核对官方网站事实(URL/费用/字段规则/错误信息)、跑构建验证。不信任起草方自报。
- **写作风格**:遵守 docs/README.md(禁 AI 八股词,短句、具体数字、真实表单约束、真实搜索 query 作标题)。

## 每国验收清单

1. `npm run build:prod`、`npm run check:seo`、`node scripts/verify-official-urls.mjs` 全绿
2. 官方 URL、费用、字段规则与官方网站正文逐条核对(HTTP 200 不算核验)
3. `[[scam_sites]]` 条目均带 `evidence` 与 `first_observed`;先 TOML 后 markdown
4. 英中文件成对;新增 i18n key 两个文件都加
5. TOML `last_verified`、rules `lastVerified`、内容 `lastmod` 三者同日(日本样板曾出现 rules 落后一个月的反例,不复制)
6. App 类条目记录开发者/发布者名称与政府页指向的商店链接

## 风险

- **费用过期**:ESTA/ETA 类费用近年频繁上调(ESTA 2025-09 从 $21 → $40,UK ETA 2026-04 从 £16 → £20)。月度审查流程(docs/maintenance/monthly-review.md)覆盖新国家。
- **法律**:诈骗站指控必须有证据链,阶段 0 的 scam-site 强校验是前置条件。
- **Turkey 误导风险**:免签国籍旅客被推去付费 e-Visa 是本站最不可接受的错误,资格先行决策树为硬性要求。
