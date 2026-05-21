# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目本质

反诈骗入境卡指南站。目标搜索 query 是 *"thailand TDAC"*、*"is iVisa official"*、*"巴厘岛海关表"*。每个国家有一份免费的政府入境表，每个表前面都有付费中介在 Google 搜索结果里拦截。这个站把官方 URL、字段填法、已知诈骗站名单放在一起。

**做改动前先读 `docs/README.md`**——它是贡献者指南，包含写作风格规则（避免 AI 八股词）、内容样板、任务清单。

## 常用命令

```bash
npm run dev          # 本地预览 http://localhost:1313（Hugo server + GC）
npm run build:prod   # 生产构建（含 minify、production 环境）
npm run check:seo    # SEO 验证：必需文件、本地链接、hreflang、JSON-LD（CI 也跑）
npm run clean        # 清理 public/ 和 resources/
```

需要 Hugo **0.160.1+ extended**（`brew install hugo`）和 Node 22+（CI 用 22）。Hugo 必须是 extended 版（PostCSS、TypeScript 编译都依赖它）。

部署：push 到 `main` → GitHub Actions → Cloudflare Pages（`.github/workflows/cloudflare-pages.yml`）。全过程 < 1 分钟。

## 关键架构

### 数据驱动（修改数据 = 修改所有页面）

每个国家的所有内容由四份 data 文件驱动，shortcode 直接读取，**没有重复的字符串**：

- `data/rules/{country}.json` — 字段验证规则（label、pattern、minLength、错误信息）。`{{< validator >}}` shortcode 把它嵌成 `<script type="application/json">`，`assets/js/validator.ts` 在浏览器读。
- `data/official_urls/{country}.toml` — 官方 URL、机构名、`last_verified` 日期、`[[scam_sites]]` 名单（带 `evidence` 和 `first_observed`）。`{{< official-link >}}` 和 `{{< scam-site >}}` 都从这里读。
- `data/decision/tree.json` — `/decide/` 决策树状态机。被 `{{< decide >}}` shortcode 嵌入，`assets/js/decide.ts` 消费。
- `data/changelog/{country}.toml` — 国家变更日志（`docs/maintenance/monthly-review.md` 描述了月度审查流程）。

**改任何 URL、字段规则、诈骗站、决策状态时只改 data 文件，不要去翻 markdown。**

### Shortcode 构建时验证

`layouts/shortcodes/scam-site.html` 在构建时强制：传入的 `domain` 必须出现在 `data/official_urls/{country}.toml` 的 `[[scam_sites]]` 里。不在 → `errorf` 终止构建。这是法律防线（避免没有证据的污蔑指控）。

`layouts/shortcodes/official-link.html` 也类似——`site="country.key"` 必须能在 TOML 中找到，否则构建失败。

加新诈骗站：先在 TOML 加 `[[scam_sites]]` 条目（含 `evidence` 和 `first_observed` 日期），**再**在 markdown 里写 `{{< scam-site >}}`。

### 双语机制

- 默认英语在根（`/`、`/thailand/`、`/about/`）
- 简体中文加 `/zh/` 前缀（`/zh/`、`/zh/thailand/`、`/zh/about/`）
- 文件后缀决定语言：`tdac.md`（英）+ `tdac.zh.md`（中）
- UI 字符串走 `i18n/en.yaml` 和 `i18n/zh.yaml`——**加一个 key 必须两个文件都加**
- 中文翻译不存在时，语言切换器 fallback 到 `/zh/`（不会 404）
- `disableKinds = ["taxonomy", "term"]`（无 tag/category 索引页）；旧的 `/countries/` 和 `/tags/` 路径在 `static/_redirects` 中 301 到首页

### JS 资源管道

**浏览器端零 npm 依赖**（v1.0 设计约束）。`assets/js/*.ts` 通过 Hugo 的 `js.Build` 编译为 IIFE，生产构建会 minify + fingerprint + SRI。看 `layouts/partials/scripts.html`。

只有两个 TS 文件：
- `validator.ts` — 客户端字段校验，零网络请求
- `decide.ts` — 决策树状态机渲染器

两个都站内全局加载（在没有对应容器的页面静默 no-op）。规则全部从 data 文件来，**改字段验证不需要改代码**。

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

### SEO 严格性

`scripts/check-seo-output.mjs` 在 `npm run check:seo` 时跑，**CI 失败会阻断部署**。它验证：

1. `robots.txt` 和 `sitemap.xml`（含 en、zh 子 sitemap）存在
2. 所有 HTML 中的 `href`/`src` 本地路径在 `public/` 真实存在
3. `hreflang` alternate 都解析得到（且 `x-default` 不指向 `/zh/`）
4. 所有 JSON-LD 合法可解析，没有双重转义（如 `"\"foo\""`）

每个页面都会发出 Article/BreadcrumbList schema；前置元数据有 `faq` 字段时自动发 FAQPage。详见 `layouts/partials/head.html`。

### 关键路径

```
content/{country}/_index.md            # 国家枢纽（链到三篇主文章）
content/{country}/{form-slug}.md       # 主表介绍（如 tdac、fmm、eticket、mdac、evisa、e-cd、sgac）
content/{country}/how-to-fill.md       # 字段逐项填写
content/{country}/is-ivisa-official.md # 诈骗站点画廊
```

加新国家的最小改动：在 7 个文件里加内容，加 4 份 data 文件（rules、official_urls、changelog、可选 decision 节点），在 `config.toml` 加菜单项，更新 `layouts/index.html` 的 `$mainSlugs`/`$subtitlesEn`/`$subtitlesZh`，加 i18n 国家名。`layouts/shortcodes/official-directory.html` 也要加一行。

## 写作风格（来自 docs/README.md）

英文 — 禁用：`delve`、`crucial`、`comprehensive`、`nuanced`、`furthermore`、`moreover`、长破折号单独成句。

中文 — 禁用：「关键在于」「让我来分解一下」「重要的是」「值得注意的是」这类开场套话。

要用：短句、具体数字、具体文件名、具体规则、真实用户视角、政府表单的真实约束（字符上限、日期格式、API 错误信息）。

## 编辑注意

- **不要 `git push --force`**。CI 触发部署，强推会污染历史。
- **不要修改 `tailwind.config.js` 加调色板/阴影/圆角**，除非有明确设计依据。
- **改字段规则只改 `data/rules/*.json`，不要碰 `validator.ts`**。
- **加诈骗站：先 TOML，后 markdown**，否则构建失败。
- 国家页面 `Last verified` 元数据来自 `enableGitInfo` + 文件 `Lastmod`，所以**改文件 = 自动刷新 last-verified 显示**。如果只是审查没改变内容，要主动 bump `lastmod` 前置字段。
