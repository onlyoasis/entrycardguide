# entrycardguide.com SEO 行动计划（2026-10-12）

依据：同目录 `FULL-AUDIT-REPORT.md`。优先级定义：Critical = 阻断索引或招致惩罚；High = 明显影响排名或点击，1 周内处理；Medium = 优化机会，1 个月内处理；Low = 有空再做。

本次审计**没有发现 Critical 问题**：没有阻断索引的项，也没有可能被惩罚的项。

> **2026-10-12 进度**：以下各项已通过 [PR #4](https://github.com/onlyoasis/entrycardguide/pull/4) 合入 `main`（merge commit `aba9078`），但**尚未上线**：main 的部署运行 38260392200 卡在 D1 `database_id` 检查上。
> - 第 1 阶段第 1 项（标题后缀与长度）：已完成。中文内页后缀改为“入境卡指南”；整条标题超过约 65 宽度时不再加后缀；三个超长标题已改写。
> - 第 1 阶段第 2 项（四个 how-to-fill 页的 title 和 description）：已完成。
> - 第 1 阶段第 3 项（枢纽页标题、schema、首屏导流）：已完成。Indonesia 枢纽页改为概览标题，避免和 e-CD 表单页抢词。
> - 第 1 阶段第 4 项（核验日期）：Indonesia `ecd`、Dominican `eticket`（经 DGM 服务页核对）、Australia ETA 601 / eVisitor 651 已在浏览器中人工复核；e-CD 页的字段说法已改正。**未完成**：Azerbaijan 和 Dominican 门户本身被 Cloudflare 人机验证挡住；Indonesia `field_count = 12` 需对照实际表单复核。
> - 第 1 阶段第 5 项（ChatGPT）：没有新增首屏事实句，因为两页首屏已经有直接答案；主要缺口是 Indonesia 的核验日期，已刷新。ChatGPT 引用基线、Bing Webmaster 核对和“是否引用政府警示”的决定仍待站长处理。
> - 搜索标题覆盖放在 `data/seo/titles.toml`，没有改内容文件，因此不会把页面上显示的 “Last verified” 刷新成提交日期。

## 第 0 步（前提）：恢复 `main` 的发布通道

- [ ] `main` 上的 `Cloudflare Pages` workflow 卡在 `check-release`，报错要求填真实的 D1 `database_id`。不先解决，下面所有修复合进 `main` 都不会上线。改完后按 `docs/maintenance/release-checklist.md` 回读线上结果。

## 第 1 阶段：High（第 1 周）

### 1. 标题后缀与长度（模板级，一次改完 468 页）
- [ ] `config.toml` 的 zh / zh-hant 站名 `entrycardguide · 入境卡指南` 改成单一品牌，或在 `layouts/partials/head.html:11` 只给中文标题拼一层后缀。目标：简繁各 133 个超长标题明显减少。
- [ ] 标题正文超过约 50 个字符宽度时省略 ` · entrycardguide` 后缀（品牌已经在 `og:site_name` 和 Organization schema 里了）。
- [ ] 英文 91 个超长标题里，先改最长的一批：`/indonesia/e-cd/`（114）、`/pakistan/…`（102）、`/myanmar/…`（99）、`/russia/…`（92）。

### 2. 第 6～11 位、CTR 偏低的 how-to-fill 页：title 和 description 改写
标题按 GSC 里实际出现的 query 改写。下表是建议稿，按 docs/README 的写作规则再润色：

| 页面 | 90 天曝光 / 点击 | 主要 query（位置） | 建议 title |
|---|---|---|---|
| `/uk/how-to-fill/` | 2679 / 40 | “provide the address where you live most of the time eta”（8.6），“enter address line 1 eta”（8.1），“uk eta home address line 1”（6.6） | `UK ETA Home Address and Address Line 1: How to Fill All 9 Fields (2026)` |
| `/singapore/how-to-fill/` | 2911 / 39 | “sg arrival card how to fill”（11.5），“how to fill singapore arrival card”（13.8），“sgac form”（12.7） | `How to Fill the SG Arrival Card (SGAC): Name Order, 3-Day Window, Embarkation` |
| `/indonesia/how-to-fill/` | 1334 / 5 | “indonesia customs declaration”（6.8），“e declaration form indonesia”（7.1），“indonesia passport number format”（4.2） | `Indonesia Customs Declaration (e-CD) Form: Every Field, Passport Number Format` |
| `/india/how-to-fill/` | 1978 / 29 | “what is isd code for india e arrival card”（11.0），“travel further within india or abroad after arrival”（11.0） | `India e-Arrival Card: ISD Code, Onward Travel and All 15 Fields (2026)` |

- [ ] description 的第一句直接回答这个字段怎么填（例：UK ETA “Address line 1 is your house number and street…”），不要先写“Step-by-step 2026 guide…”。
- [ ] 两周后用 `scripts/fetch-search-data.mjs --days=14` 对比这四页的 CTR。

### 3. 国家枢纽页：标题与 schema
- [ ] 43 个英文枢纽页、简繁各 6 个枢纽页（巴哈马、巴基斯坦、俄罗斯、哥伦比亚、乌兹别克斯坦、牙买加等）的 `title` 照 Canada、UK、USA 等 7 个已改好的样式重写。优先改 GSC 里在抢头部词的：`/indonesia/`、`/mexico/`、`/qatar/`、`/taiwan/`。
- [ ] `head.html:107` 和 `:158` 放宽条件，给 section 页（枢纽页）输出 `BreadcrumbList`，再加一个列出本国表单页和填写页的 `CollectionPage` + `ItemList`。改完跑 `npm run check:seo`。
- [ ] 枢纽页首屏把头部词导向表单页（锚文本用 “Indonesia arrival card (All Indonesia)” 这类目标词），减少与表单页互相抢词。

### 4. 高流量页的核验日期
- [ ] 人工复核 Indonesia（`last_verified` 2026-06-17，校验规则 2026-06-11）和 Dominican（2026-04-24），刷新 `data/official_urls/*.toml`。
- [ ] Australia、Azerbaijan 自动核验一直返回 HTTP 403：改为人工核验，并在页面上写明核验方式，不能让日期一直不更新。
- [ ] 统一 `/indonesia/e-cd/`（“9 fields across 3 sections”）与 `/indonesia/how-to-fill/`（“12 fields, 4 sections”）的说法，以 `data/fields/indonesia.toml` 为准。

### 5. ChatGPT 引荐断崖：先查清楚，再决定怎么做
- [ ] 在 ChatGPT 搜索里手动查 10 个左右过去带来流量的问题（Indonesia e-CD / Bali customs form / MDAC free / MDAC official site 等），记录现在引用了谁。没有这份基线就无法判断问题出在哪。
- [ ] 在 `/indonesia/e-cd/` 和 `/malaysia/mdac/` 首屏加一段能独立引用、带日期的事实句（官方域名、免费、负责机构）。
- [ ] 在 Bing Webmaster 核对这两页的索引状态和展示词；改完后用 IndexNow 提交一次。
- [ ] **需要你决定**：要不要以“引用移民局官方公布的仿冒网站警示”的形式，恢复一部分“某网站是否官方”的内容。这和 2026-08-10 “不点名第三方”的决定有关，本计划不替你做决定。

## 第 2 阶段：Medium（第 2～4 周）

- [ ] 内链：表单页和 how-to-fill 页目前每页只有 4 个站内入链。在 `/official-links/`、首页国家卡片和 “More stops on your trip?” 区块里直接链到这两类页面，锚文本用表单名和字段名。
- [ ] 表单页 Article 加 `about: GovernmentService`（`url` 填官方网址，`provider` 填 `GovernmentOrganization`），数据直接取 `data/official_urls/*.toml`。
- [ ] how-to-fill 页补 `faq` front matter（147 页没有）。素材直接用 GSC 里的问题型 query，例如 India 的 “what is isd code”。收益主要在 Bing 和 AI 抽取。
- [ ] 加一个“编辑方针 / 核实方法”页，Article schema 用 `publishingPrinciples` 指向它；About 页删掉已经过时的 “the scam-site list”。
- [ ] 主表单页加 1～2 张官方表单界面截图（避开个人信息，写明 alt、尺寸和拍摄日期）。
- [ ] 修 `/zh/thailand/tdac/` 的 `label-content-name-mismatch`（Lighthouse 可访问性项）。

## 第 3 阶段：Low（待办）

- [ ] sitemap 的 alternate 补 `x-default`。
- [ ] `static/favicon.ico`。
- [ ] 按国家生成 OG 图。
- [ ] 评估 `_routes.json` 只把 `/api/*` 交给 Functions，www 跳转改用区域级 Redirect Rule（先确认 MCP 路由不受影响）。

## 持续监测

- 每月：`scripts/fetch-search-data.mjs --days=28`，重点看 how-to-fill 页的 CTR，以及枢纽页与表单页的抢词情况。
- 每周：GA4 里 `chatgpt.com`、`bing`、`cn.bing.com` 三个来源分开看（`sessionSource` × `isoYearIsoWeek`）。
- 繁体版：4～6 周后复查繁体 query 是否已从 `/zh/` 页转到 `/zh-hant/` 页。
- 补齐数据缺口：配置 PageSpeed/CrUX API key 拿真实 CWV；配置 Bing Webmaster API key 拿外链和 Bing 展示词。
