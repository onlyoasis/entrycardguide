# CLAUDE.md

<!-- project-knowledge-sync:start -->
## 项目资料

- 项目详情：`/Users/lzc/Projects/project-registry/docs/projects/entrycardguide.md`。需要背景、运行或发布信息时查阅相关章节，以当前源码和运行证据为准。
- 项目目标、功能、架构、路径或发布事实改变时，同步详情对应章节；区分代码、测试、部署和线上验证，不为刷新日期改文档。
- 更新发布状态时按 `/Users/lzc/Projects/project-registry/docs/project-documentation-standard.md` 的口径记录证据；仅保存非敏感事实。
<!-- project-knowledge-sync:end -->

## 项目本质

反诈骗入境卡指南站。目标搜索 query 是 *"thailand TDAC"*、*"is iVisa official"*、*"巴厘岛海关表"*。每个国家有一份免费的政府入境表，每个表前面都有付费中介在 Google 搜索结果里拦截。这个站提供官方 URL 与字段填法；不发布第三方公司点名名单。

**做改动前先读 `docs/README.md`**——它是贡献者指南，包含写作风格规则（避免 AI 八股词）、内容样板、任务清单。

## 常用命令

```bash
npm run dev          # 本地预览 http://localhost:1313（Hugo server + GC）
npm run build:prod   # 生产构建（含 minify、production 环境）
npm run check:seo    # SEO 验证：必需文件、本地链接、hreflang、JSON-LD（CI 也跑）
npm run clean        # 清理 public/ 和 resources/
```

需要 Hugo **0.160.1+ extended**（`brew install hugo`）和 Node 22+（CI 用 22）。Hugo 必须是 extended 版（PostCSS、TypeScript 编译都依赖它）。

部署：push 到 `main` → GitHub Actions → Cloudflare Pages（`.github/workflows/cloudflare-pages.yml`）。完成时间与线上结果须实际回读。

## 关键架构

### 数据驱动（修改数据 = 修改所有页面）

每个国家的所有内容由四份 data 文件驱动，shortcode 直接读取，**没有重复的字符串**：

- `data/rules/{country}.json` — 字段验证规则（label、pattern、minLength、错误信息）。`{{< validator >}}` shortcode 把它嵌成 `<script type="application/json">`，`assets/js/validator.ts` 在浏览器读，校验逻辑在 `assets/js/lib/field-check.ts`（单测 `tests/field-check.test.mjs`，属 `test:ui`）。可选键：`pattern` 写官方表单自己的正则，name/email/phone/flight/text 有它就按它校验（phone/flight/text 同时查 `maxLength`），没有就用各类型的默认规则（text 没有 pattern 时只查必填和 `maxLength`，所以 text 的 `maxLength` 只写官方表单的上限）；日期 `format`（`YYYY-MM-DD` 默认、`DD/MM/YYYY`、`YYYY/MM/DD`）和 `minDaysFromToday`/`maxDaysFromToday`（按今天算的可选日期窗口）。只写官方表单里核实过的规则。
- `data/official_urls/{country}.toml` — 官方 URL、机构名、`last_verified` 日期。`{{< official-link >}}` 从这里读。文件里仍保留 `[[scam_sites]]` 数组作为内部记录，但**站点不再渲染它**（2026-08-10 移除中介名单）。
- `data/decision/tree.json` — `/decide/` 决策树状态机。被 `{{< decide >}}` shortcode 嵌入，`assets/js/decide.ts` 消费。
- `data/changelog/{country}.toml` — 国家变更日志（`docs/maintenance/monthly-review.md` 描述了月度审查流程）。
- `data/entry_requirements/{country}.toml`（可选，2026-10-23 起 20 个热门国家）— 护照与入境材料：护照有效期（`basis` arrival/departure/stay/application/permitted_stay + `months`/`days`；官方没写起算日用 `other` 并写 `value_*`）、空白页、其他护照条件、电子护照（芯片）、返程/续程票、资金证明。每条 `[[items]]` 必须有 https 官方 `source` 和原文 `quote`，只写原文明确写出的规则；没有条目的主题显示“未见官方规定”。`partials/entry-req-rows.html` 统一展开并在构建时校验，喂给国家枢纽页“护照与入境材料”卡和 `/entry-requirements/` 对照表；照片列取自 `data/photo_specs`。改后跑 `npm run sync:zh-hant`。
- `data/photo_specs/{country}.toml`（可选）— 照片与上传规则：每张表要人像还是护照页、上传/现场拍/可选、官方公布的尺寸·像素·文件上限·格式、来源与核对日期。`partials/photo-rows.html` 统一展开，喂给填写页“照片与上传”卡、`/photo-requirements/` 对照表和浏览器照片工具。**只写官方公布的数字**；`out_*` 是工具输出尺寸不是规则；`tool = false` 不进工具；`kind = "none"` 只用于有字段级证据的表。

**改任何 URL、字段规则、决策状态时只改 data 文件，不要去翻 markdown。**

### Shortcode 构建时验证

`layouts/shortcodes/official-link.html` 在构建时强制：`site="country.key"` 必须能在 TOML 中找到，否则 `errorf` 终止构建。

**站点不再发布中介/仿冒站名单。** `scam-site.html` shortcode 和 `is-ivisa-official` 页面已于 2026-08-10 移除，理由是这批页面几乎没有流量却承担了全部法律风险。不要重新引入对第三方公司的点名——页面只讲官方网址和字段怎么填。

### 多语言机制（en / zh-Hans / zh-Hant）

- 默认英语在根（`/`、`/thailand/`、`/about/`）
- 简体中文加 `/zh/` 前缀，繁体中文加 `/zh-hant/` 前缀；HTML lang / hreflang / sitemap 使用 en、zh-Hans、zh-Hant 映射，robots.txt 列出三个子 sitemap
- 文件后缀决定语言：`tdac.md`（英）+ `tdac.zh.md`（简）+ `tdac.zh-hant.md`（繁，生成文件不要手改）
- UI 字符串走 `i18n/en.yaml`、`i18n/zh.yaml`、`i18n/zh-hant.yaml`——**加一个 key 必须三个文件都加**（zh-hant.yaml 由 `scripts/zh-hant/gen-i18n.mjs` 生成，勿手改）
- 繁体派生物用 `npm run sync:zh-hant` 重生成；`npm run check:zh-hant` 是 build/dev 前置只读门禁；手工英文→繁体覆写（`data/rules_i18n/`、决策树覆写）受源文本快照陈旧门禁保护
- 译文不存在时，语言切换器 fallback 到该语言首页（不会 404）
- `disableKinds = ["taxonomy", "term"]`（无 tag/category 索引页）；旧的 `/countries/` 和 `/tags/` 路径在 `static/_redirects` 中 301 到首页
- 细节与流程：`docs/maintenance/zh-hant.md`
### JS 资源管道

**浏览器端零 npm 依赖**（v1.0 设计约束）。`assets/js/*.ts` 通过 Hugo 的 `js.Build` 编译为 IIFE，生产构建会 minify + fingerprint + SRI。看 `layouts/partials/scripts.html`。

浏览器端 TS 文件（均零 npm 依赖，规则/数据从构建时嵌入或同源 JSON 来）：
- `validator.ts` — 客户端字段校验，零网络请求（站内全局加载）
- `decide.ts` — 决策树状态机渲染器（站内全局加载）
- `search.ts` — 首页国家网格过滤；`directory.ts` / `nav.ts` / `analytics.ts` — 目录、导航、点击埋点
- `photo.ts` — `/photo-requirements/` 照片工具：浏览器内裁切、缩放、压缩到官方 KB 范围，印度护照页封装成单页 PDF；零网络请求、不发统计、不改颜色/背景/人脸（新西兰、英国拒收修图）；纯函数在 `lib/photo-fit.ts`（`tests/photo-fit.test.mjs`，属 `test:ui`）；仅含 `{{< photo-tool >}}` 的页面加载
- `ask.ts` — `/ask/` 页问答引擎：同源拉取构建期生成的 `/ask-index.json`（每语言一份，来自各页 faq 前置元数据 + 国家 roster，见 `layouts/index.ask.json`），浏览器内做中英混合检索匹配，答案全部带出处链接；仅含 `{{< ask >}}` shortcode 的页面加载（`scripts.html` 里 `.HasShortcode` 门控）

没有对应容器的页面静默 no-op。**改字段验证不需要改代码**。

### CSS 管道

- `assets/css/main.css` → `css.PostCSS` → 生产构建 minify + fingerprint
- `tailwind.config.js` 锁定了完整的设计系统（颜色、字号、间距、圆角）。文件首行警告："adding tints/shades, shadows, pill radii, or blue will break the anti-scam visual positioning"。
- 调色板只有：`ink`、`paper`、`rule`、`muted`、`verified`、`scam`、`mark`、`white`。**没有蓝/紫，没有 tint 级别，没有阴影，没有渐变。**
- 字体三种：Fraunces（serif）、Instrument Sans（sans）、Geist Mono（mono）。自托管（见 `assets/fonts/`）。
- 不要加 `rounded-xl`、`rounded-full`、`shadow-*`、`bg-gradient-*` 等。Tailwind 配置主动禁用了 `boxShadow` 和 `gradientColorStops`。

### Cloudflare Pages 配置

通过 `static/` 里两个特殊文件配置（Hugo 把 `static/` 原样拷到 `public/`）：

- `static/_headers` — 全站 CSP（严格：默认只允许 self，外加 Cloudflare Insights）、HSTS、X-Frame-Options 等
- `static/_redirects` — www→apex 强制 301、已废弃的 taxonomy 路径 301

`functions/_middleware.js` 是 Pages Function，做 www→apex 重定向兜底（与 `_redirects` 冗余但更可靠）。

### MCP 服务器（`/api/mcp`，feat/mcp-server 分支）

给注册用户的本地 agent（Claude Code / Cursor）提供站点数据的 MCP 端点，**仅限带 API key 的注册用户**。详见 `docs/mcp.md`，要点：

- 协议是手写的 MCP Streamable HTTP 无状态子集（`functions/_mcp/protocol.js`），**零 npm 依赖**，5 个工具全部读 `functions/_mcp/snapshot.js` 快照
- 快照由 `scripts/gen-mcp-data.mjs` 从 `data/` + roster 生成：**改 data 后必须 `npm run gen:mcp`**，`npm run check:mcp` 是 CI 门禁；快照排除 `scam_sites`/`outcomes`/news（延续不点名中介的决策）
- 用户与调用计量在 D1（`migrations/0001_mcp_init.sql`，绑定名 `DB`）；`functions/_mcp/quota.js` 是收费口：`PLANS` 表 + `authorizeCall`/`recordCall`，`mcp_usage` 只追加，付费档接进来只改 `mcp_users.plan`
- 单测 `npm run test:mcp`（node:sqlite 内存库跑真实 SQL，需 Node 22 的 `--experimental-sqlite`）
- 部署模式由 `scripts/release-mode.mjs` 按 `wrangler.toml` 的 `database_id` 决定：占位符 → **static**（不带 D1 绑定部署，`/api/*` 返回 503 `mcp_not_configured`，`/mcp/` 显示“注册暂未开放”）；真实 UUID → **full**（远端 MCP 前置检查 + D1 绑定）。填真值前先 `wrangler d1 create`、应用迁移并设好 secret

### SEO 严格性

`scripts/check-seo-output.mjs` 在 `npm run check:seo` 时跑，**CI 失败会阻断部署**。它验证：

1. `robots.txt` 和 `sitemap.xml`（含 en、zh、zh-hant 子 sitemap）存在
2. 所有 HTML 中的 `href`/`src` 本地路径在 `public/` 真实存在
3. `hreflang` alternate 都解析得到（且 `x-default` 不指向 `/zh/`）
4. 所有 JSON-LD 合法可解析，没有双重转义（如 `"\"foo\""`）

每个页面都会发出 Article/BreadcrumbList schema；前置元数据有 `faq` 字段时自动发 FAQPage。详见 `layouts/partials/head.html`。

### 关键路径

```
content/{country}/_index.md            # 国家枢纽（链到三篇主文章）
content/{country}/{form-slug}.md       # 主表介绍（如 tdac、fmm、eticket、mdac、evisa、e-cd、sgac）
content/{country}/how-to-fill.md       # 字段逐项填写
```

加新国家的最小改动：6 个内容文件（3 篇 × 英中），5 份 data 文件（rules、official_urls、changelog、**fields**——`layouts/_default/how-to-fill.html` 强依赖 `data/fields/{country}.toml`——外加 decision 树节点），以及 `layouts/partials/country-roster.html` 末尾追加一行。首页网格、导航下拉、页脚、官方目录、decide 无 JS fallback 全部从 roster 自动生成，无需逐处修改。付费国家在 TOML `[meta]` 里写 `form_type`（`arrival_card | travel_authorization | evisa`）和 `fee_en/fee_zh`。

## 写作风格（来自 docs/README.md）

英文 — 禁用：`delve`、`crucial`、`comprehensive`、`nuanced`、`furthermore`、`moreover`、长破折号单独成句。

中文 — 禁用：「关键在于」「让我来分解一下」「重要的是」「值得注意的是」这类开场套话。

要用：短句、具体数字、具体文件名、具体规则、真实用户视角、政府表单的真实约束（字符上限、日期格式、API 错误信息）。

## 编辑注意

- **不要 `git push --force`**。CI 触发部署，强推会污染历史。
- **不要修改 `tailwind.config.js` 加调色板/阴影/圆角**，除非有明确设计依据。
- **改字段规则只改 `data/rules/*.json`，不要碰 `validator.ts`**。
- 国家页面 `Last verified` 元数据来自 `enableGitInfo` + 文件 `Lastmod`，所以**改文件 = 自动刷新 last-verified 显示**。如果只是审查没改变内容，要主动 bump `lastmod` 前置字段。

## 繁体中文（zh-Hant）维护

繁体是完整的第三语言（`/zh-hant/`，156 篇内容页 + 全部 UI/数据/校验器/决策树本地化）。派生文件（`.zh-hant.md`、`*_zh_hant` TOML 字段、`i18n/zh-hant.yaml`、`tree.zh-hant.json`）**不要手改**——用 `npm run sync:zh-hant` 重新生成；`npm run check:zh-hant` 是 build/dev 前置只读门禁。手工英文→繁体覆写（rules_i18n、决策树）受源文本快照陈旧门禁保护，改英文源后复核翻译再 `npm run snapshot:zh-hant`。细节见 `docs/maintenance/zh-hant.md`。

## 2026-10-02 本地发布候选补充

- `codex/release-global-mcp` 工作树整合53个详细国家指南和249目的地全球资料库三语页；公开数据只来自`data/travel_library_public.json`，原研究主库留外盘独立工作树。
- 公共v2投影保留状态及覆盖数量，当前328公开事项、66暂不公开、531待核问题。不要把完整目的地目录说成完整法规核验。
- `build:prod`固定产出`public-release/`；CI发布相同目录，检查公共schema、三语派生物、MCP快照、SEO和私有数据历史边界。
- MCP改用邮箱验证码登录与显式`mcp:read`授权；旧匿名key停用。`gen:mcp`同时包含公开全球快照，新增`get_jurisdiction`，每次调用校验授权、参数和原子账户额度。
- MCP 上线（full 模式）前必须填真实D1 ID、应用两份迁移并设置邮件/认证secret；`check:release -- --deployment`只读核对前置条件。静态站不受此限，2026-10-13 起以 static 模式发布。详见`docs/mcp.md`与本轮验收报告。不得把本地假邮件测试说成真实送达。
