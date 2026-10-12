# entrycardguide.com 全站 SEO 审计（2026-10-12）

审计对象：线上 `https://entrycardguide.com`。线上内容对应 9 月中旬那次生产发布（sitemap 的 lastmod 最晚为 2026-09-14）；之后 `main` 上的提交因 D1 发布门禁失败，至今没有上线。源码对照的是 `main`（`293eda8`）。
方法：claude-seo `seo-audit` 流程。爬取三份语言子 sitemap 全部 468 个 URL；GSC/GA4 用 `scripts/fetch-search-data.mjs` 拉 28 天（09-12～10-09）和 90 天（07-12～10-09）数据，另用 GA4 Data API 按周、按日拆分来源；用本地 Chrome 跑 Lighthouse 12.8.2（移动端，4 个页面）；另跑插件的 agentic 检查。

**未覆盖**：CrUX 真实用户 CWV（PageSpeed API 当日配额耗尽，插件未配 Google API key）；外链数据（无 Moz/Bing API key，Common Crawl 图谱下载超时被中止）；Bing Webmaster 面板（无 API）。这三项在报告里只写成待验证。

---

## 执行摘要

**SEO 健康分：75 / 100**

站点类型：信息型出版站（YMYL 边缘的旅行/政府手续指南），三语（en / zh-Hans / zh-Hant），50 国 × 3 类页面 × 3 语 = 468 个可索引 URL。

技术底子很好：468 页全部 200，canonical 全部自指，hreflang 四件套（en / zh-Hans / zh-Hant / x-default）全覆盖，JSON-LD 零解析错误，Lighthouse 四页四项全 100。分数被拉低的地方在**页面层面的搜索表现**：标题过长、国家枢纽页标题空泛且没有任何结构化数据、高曝光页 CTR 偏低，以及 AI 来源流量断崖。

| 类别 | 权重 | 得分 | 加权 |
|---|---:|---:|---:|
| 技术 SEO | 22% | 90 | 19.8 |
| 内容质量 | 23% | 72 | 16.6 |
| 页面 SEO（On-Page） | 20% | 62 | 12.4 |
| 结构化数据 | 10% | 70 | 7.0 |
| 性能（CWV） | 10% | 95 | 9.5 |
| AI 搜索就绪度 | 10% | 68 | 6.8 |
| 图片 | 5% | 60 | 3.0 |
| **合计** | | | **75** |

### 五个最重要的问题

1. **ChatGPT 引荐流量下降 96%。** 90 天窗口里 ChatGPT 带来 978 次会话，最近 28 天只有 24 次。按周看，07 月下旬到 08 月初每周 243～305 次，8 月 10 日那周（ISO 第 33 周）跌到 12 次，之后再没回来。下跌前 852/978 次集中在 `/indonesia/e-cd/` 和 `/malaysia/mdac/` 两页。原因见下文「AI 搜索就绪度」，**目前没有证据能归因到站内改动**。
2. **英文国家枢纽页 50 个中有 43 个标题只有国名（中文各 6 个），150 个枢纽页全部没有 JSON-LD。** 例：`Indonesia · entrycardguide`。这些页在搜索里抢掉了表单页的头部词，排名 50～78 位：`/indonesia/` 对 "arrival card indonesia" 排 72.2，`/mexico/` 对 "fmm mexico" 排 63.9。
3. **主要页面在第 6～11 位，CTR 只有 1.2%～1.7%。** 90 天里 `/singapore/how-to-fill/` 2911 次曝光 39 次点击，`/uk/how-to-fill/` 2679 / 40，`/india/how-to-fill/` 1978 / 29，`/indonesia/how-to-fill/` 1334 / 5（0.4%）。搜索词非常具体（UK ETA 的 "address line 1" 一组词 28 天合计 300+ 次曝光，几乎 0 点击），标题却是泛泛的 "All 9 Fields Explained"。
4. **标题普遍超长，中文页还挂了两层品牌后缀。** 英文 156 页里有 91 页的标题宽度超过 65 个字符，最长 114；简体和繁体各 156 页里各有 133 页超长，原因是 `config.toml` 把中文站名设成了 `entrycardguide · 入境卡指南`，品牌后缀占掉 30 个字符宽度（英文页是 17）。
5. **流量最大的两页核验日期已过期。** `/indonesia/e-cd/` 正文和 llms.txt 都写着 "Last verified June 17, 2026"（距今近 4 个月），Dominican E-Ticket 停在 2026-04-24。这两页正是 AI 引用和 Bing 流量的入口；对一个以“我们核实过官方网址”立身的站，过期日期直接伤害可信度。

### 五个速赢项

1. 中文站名从 `entrycardguide · 入境卡指南` 改成单品牌，或在 `head.html` 里对中文标题去掉一层后缀：改一行，266 页的标题就不再被截断。
2. 43 个英文枢纽页（外加简繁各 6 个）的 `title` 加上表单名和关键词，例：`Indonesia Arrival Card (All Indonesia / e-CD): Official Site, Free`。7 个英文枢纽页已经这样写了，照着改即可。
3. UK ETA、India、Singapore、Indonesia 四篇 how-to-fill 改 title/description，让 GSC 里最高频的字段词打头（见 ACTION-PLAN）。
4. 给枢纽页补上 `BreadcrumbList` 和 `CollectionPage`，复用现有的 `head.html` 逻辑，只需放宽 `if .IsPage` 条件。
5. 人工复核 Indonesia 和 Dominican 的官方网址，刷新 `last_verified`。

---

## 一、技术 SEO（90）

### 正常项（实测）
- 468 个 sitemap URL 全部返回 200，没有重定向链；canonical 全部自指；`robots` meta 统一为 `index,follow,max-image-preview:large,max-snippet:-1`；没有 `X-Robots-Tag` 头。
- robots.txt 允许所有爬虫，列出 1 个 sitemap 索引和 3 个语言子 sitemap。GPTBot、ClaudeBot、PerplexityBot、OAI-SearchBot 的 UA 实测都返回 200。
- `www` → apex 返回 301，`http` → `https` 返回 301，无尾斜杠 → 有尾斜杠返回 308；随机路径返回真 404（不是返回 200 的 soft 404）。
- 安全头齐全：HSTS（含 preload）、严格 CSP（含 Trusted Types）、COOP、X-Frame-Options DENY、nosniff、Referrer-Policy、Permissions-Policy。
- 每页都输出 hreflang 四件套，sitemap 中也带 `xhtml:link` alternate。
- 内链不存在断链：所有指向站内的链接都落在 sitemap 内。

### 问题

| 严重度 | 问题 | 证据 | 建议 |
|---|---|---|---|
| High | **`main` 的部署流水线被阻断** | `Cloudflare Pages` workflow 在 `main` 上最近一次（10-02，`293eda8`）失败于 `check-release: Configure the real D1 database_id in wrangler.toml`。另外 `Verify official URLs` 定时任务 10-05 失败（Australia、Azerbaijan 返回 HTTP 403） | 本报告的修复要合进 `main`，就得先解决 D1 占位符或调整发布门禁，否则不会上线。这是 SEO 修复能否落地的前提，不是排名因素 |
| Low | sitemap 的 alternate 缺 `x-default` | HTML 有 `x-default`，sitemap 里只有 en / zh-Hans / zh-Hant | 在 sitemap 模板里补一条 `x-default` 指向英文版，和 HTML 保持一致 |
| Low | `/favicon.ico` 返回 404 | HTML 已声明 svg/png 图标；但部分爬虫和 Bing 仍会直接请求 `/favicon.ico` | 在 `static/` 放一个 `favicon.ico` |
| Info | 每个请求都经过 Pages Function `_middleware.js` | 没有 `_routes.json`，静态资源和 HTML 也经过 Worker（只为了做 www→apex 跳转）。实测服务端耗时约 0.2～0.4 s；本机经代理，TLS 握手占了大头，**这项不能当作性能问题的证据** | 如果以后要压 TTFB，可加 `_routes.json` 只把 `/api/*` 路由给 Functions，www 跳转改用 Cloudflare 区域级 Redirect Rule。改之前先确认 MCP 路由 |

---

## 二、内容质量（72）

### 正常项
- 篇幅充足：英文页正文中位数 923 词（最短的枢纽页 573 词）；简体中文中位数 1311 个汉字，繁体 1336 个。没有薄内容页。
- 一手、可核查的信息：官方域名、机构、费用、字符上限、错误提示，数据都放在 `data/` 里，About 页讲清了怎么自行核查。这正是 YMYL 类内容最需要的 “Trust” 证据。
- 商业关系披露清楚：SafetyWing 是唯一的联盟链接，带 `rel="sponsored noopener noreferrer"`，About 页写明了收入模式。

### 问题

| 严重度 | 问题 | 证据 | 建议 |
|---|---|---|---|
| High | 高流量页核验日期过期 | `/indonesia/e-cd/`：“Last verified June 17, 2026”，校验器显示 “Rules last verified 2026-06-11”；llms.txt 中 Dominican 停在 2026-04-24、Australia 停在 2026-07-24（Australia 是 403 导致自动刷新失败）；其余 42 国停在 09-14 | Indonesia、Dominican 人工复核；对一直 403 的站点（Australia、Azerbaijan）改为人工核验流程，并在页面上写明核验方式 |
| Medium | 同一表单前后说法不一致 | `/indonesia/e-cd/` 写 “roughly 9 fields across 3 sections”，`/indonesia/how-to-fill/` 写 “12 fields, 4 sections” | 以 `data/fields/indonesia.toml` 为准，统一两页的说法。建议给其他国家跑一遍同样的“字段数”一致性检查 |
| Medium | 没有可识别的作者或审核人 | Article 的 `author` 是 Organization；About 页写 “Written by people who have actually filed each form”，但没有具体的人。旅行手续属 YMYL 边缘，Google 质量评估指南要求能看出“谁负责” | 不想露真名的话，至少加一个“编辑方针 / 核实方法”页（谁核实、多久核实一次、怎么纠错），并在 Article schema 里用 `publishingPrinciples` 指向它 |
| Low | About 页残留旧口径 | About 的许可证说明里仍写 “the field rules, the scam-site list, and these pages are CC BY-SA 4.0”，但名单已于 08-10 下线 | 删掉 “the scam-site list” |

---

## 三、页面 SEO（62）

### 标题与描述（全量统计，468 页）

| 语言 | 页数 | 标题宽度中位数 | > 65 宽度 | 描述宽度中位数 | 描述 > 160 |
|---|---:|---:|---:|---:|---:|
| en | 156 | 68 | 91 | 136 | 19 |
| zh-Hans | 156 | 74 | 133 | 91 | 2 |
| zh-Hant | 156 | 74 | 133 | 91 | 2 |

宽度按 CJK 字符记 2、其余记 1 计算。没有缺失描述，没有重复描述；唯一重复的标题是 “巴基斯坦 · …”，简繁两版同字，不算问题。每页恰好一个 H1。

| 严重度 | 问题 | 证据 | 建议 |
|---|---|---|---|
| High | 枢纽页标题只有国名 | 50 个英文枢纽页里有 43 个形如 `Cuba · entrycardguide`（宽度 21），简繁各有 6 个（巴哈马、巴基斯坦、俄罗斯等）；Canada、India、UK、USA 等 7 个已经写成描述性标题。`/indonesia/`、`/mexico/`、`/zh-hant/philippines/` 在 GSC 里替表单页去接头部词，排在 20～78 位 | 参照已改好的 7 个英文枢纽页，把 `_index*.md` 的 `title` 写成“国家 + 表单名 + 官方/免费”。如果担心面包屑和导航跟着变长，就在 `head.html:11` 新增 `.Params.seo_title` 覆盖（目前还没有这个字段） |
| High | 枢纽页与表单页互相抢词 | “菲律賓 etravel”：`/zh-hant/philippines/`（枢纽，20.4 位）对 `/zh/philippines/etravel/`（48.5 位），繁体表单页 `/zh-hant/philippines/etravel/` 没有出现。“customs declaration indonesia”同时出现在 3 个 URL 上，位置分别是 63.7、33.4、15.5 | 枢纽页定位为“导航”：标题写全国家/表单，但正文首屏直接把头部词导向表单页（锚文本用目标词）；表单页标题用头部词打头 |
| High | 第 6～11 位的 CTR 偏低 | 见执行摘要第 3 条。UK ETA 的 query 是 “provide the address where you live most of the time eta”“enter address line 1 eta”，都排在 6～9 位，0 点击 | 标题、描述用用户卡住的那个字段打头；这四页的具体改写见 ACTION-PLAN |
| Medium | 表单页、填写页的站内入链太少 | 爬取的链接图里，每个表单页和 how-to-fill 页只有 4 个站内入链（中位数 5），主要来自本国枢纽页和语言切换；枢纽页靠导航拿到 157 个。GSC 曝光最高的 how-to-fill 页也只有 4～6 个入链 | 在 `/official-links/` 目录页、首页国家卡片、相邻国家的 “More stops on your trip?” 区块里直接链到表单页和 how-to-fill 页，锚文本用表单名，例如 “UK ETA address fields” |
| Low | 简体页上出现了繁体搜索词的流量 | 繁体 query “etravel 菲律賓”落在 `/zh/philippines/etravel/`，排 71.3 | 繁体版 09-14 才上线，属正常过渡。4～6 周后复查繁体页是否接手 |

---

## 四、结构化数据（70）

- 实际输出：表单页 150 个 = Article + BreadcrumbList + FAQPage；how-to-fill 页 150 个 = Article + BreadcrumbList（只有 3 个带 FAQPage）；首页 = Organization + WebSite；About、Decide、Official Links 等 12 页 = Article；**国家枢纽页 150 个，没有任何 JSON-LD**。
- 468 页的 JSON-LD 全部能解析，没有双重转义。

| 严重度 | 问题 | 建议 |
|---|---|---|
| High | 150 个枢纽页没有 schema | 补 `BreadcrumbList`（首页 → 国家）和 `CollectionPage` + `ItemList`（列出本国表单页和填写页）。`head.html:107` 和 `:158` 的 `if .IsPage` 条件目前把 section 页排除了 |
| Medium | 没有把“官方网址”表达成实体 | 在表单页 Article 加 `about`：`GovernmentService`（name、`url` 填官方 URL、`provider` 填 `GovernmentOrganization` 机构名、`areaServed` 填国家）。数据已经在 `data/official_urls/*.toml` 里。Google 不会因此出富结果，但 Bing 和 LLM 抽取实体时能直接拿到“官方网址”这条事实 |
| Medium | how-to-fill 页没有 FAQPage | 147 个 how-to-fill 页都没有 `faq` front matter。GSC 里的问题型 query（如 “what is isd code for india e arrival card”）正好能写成 FAQ。注意：自 2023 年起 Google 基本只给政府和医疗站点展示 FAQ 富结果，这项的收益主要在 Bing 和 AI 抽取 |
| Low | 作者只有 Organization，`image` 全站同一张 | 见「内容质量」和「图片」两节 |

---

## 五、性能（95）

Lighthouse 12.8.2，移动端模拟，本地 Chrome：

| 页面 | Perf | A11y | BP | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1.1 s | 50 ms | 0 |
| `/uk/how-to-fill/` | 100 | 100 | 100 | 100 | 1.1 s | 40 ms | 0 |
| `/zh/thailand/tdac/` | 100 | 100 | 100 | 100 | 1.1 s | 10 ms | 0 |
| `/indonesia/e-cd/` | 100 | 100 | 100 | 100 | 1.1 s | 10 ms | 0 |

- 只有小的优化项：约 72 KiB 未使用的 JS（主要是 gtag），1 个资源缓存周期偏短，约 10 KiB 遗留 polyfill。`/zh/thailand/tdac/` 有一处 `label-content-name-mismatch`（可见标签与可访问名称不一致），属可访问性问题。
- **限制**：这些是实验室数据，不是 CrUX 真实用户数据。INP 只能在真实数据里看。

---

## 六、AI 搜索就绪度（68）

### 正常项
- 正文全部服务端渲染，不靠 JS 就能读到 1387 词；llms.txt 格式符合 Lighthouse 规则（17 KB，每国一行，写明官方域名、机构、费用、核验日期）；AI 爬虫全部放行；FAQ 写成问答形式，适合按段落引用。
- 繁体版见效：Google 每周点击从 9 月中旬的 15～18 次升到 33～41 次。`/zh-hant/singapore/how-to-fill/` CTR 34.5%，`/zh-hant/mexico/fmm/` 10.8%。

### ChatGPT 引荐断崖（重点）

GA4 `sessionSource = chatgpt.com`，按周统计：

| ISO 周 | 起始日 | ChatGPT | bing organic | cn.bing.com | google |
|---|---|---:|---:|---:|---:|
| 30 | 07-20 | 243 | 0 | 1 | 25 |
| 31 | 07-27 | 305 | 19 | 45 | 20 |
| 32 | 08-03 | 251 | 37 | 60 | 18 |
| 33 | 08-10 | 12 | 37 | 42 | 38 |
| 36 | 08-31 | 22 | 72 | 80 | 17 |
| 39 | 09-21 | 7 | 149 | 121 | 44 |
| 41 | 10-05 | 4 | 129 | 79 | 46 |

按日：08-05 69 次 → 08-07 38 → **08-08 21 → 08-09 8** → 08-10 4 → 之后每天 0～3 次。

**结论与不确定性：**
- 下跌从 08-08 开始。8 月 10 日 04:22 UTC 上线的生产部署 `e105f05` 包含“下线中介名单”（`0d64de9`），但在它之前，08-09 的两次部署只改了文档。**所以下跌的起点早于任何站内内容改动，不能归因于下线中介名单。** 更可能是 ChatGPT 那边换了检索或引用来源（这一条也是假设，站内数据无法验证）。
- 下线之后流量没有回升，这和“被删掉的点名内容原本是 ChatGPT 的匹配依据”这一假设吻合，但同样无法证明。
- 同期 Bing（含 cn.bing.com）从每周约 100 次升到约 250 次，已是最大的自然来源。

**建议**（不重新点名第三方，沿用 2026-08-10 的决定）：
1. 先用 ChatGPT 搜索手动查一组过去带来流量的问题，例如 “Indonesia e-CD official site”“is the MDAC free”“Bali customs form fee”，记录现在引用了谁、有没有引用本站。有了这份基线，才能判断问题出在“被换掉”还是“查不到”。
2. 在这两页首屏加一段能直接被引用的事实句，句子独立成段，带日期，例如 “As of 2026-10, the only official Indonesia arrival declaration site is allindonesia.imigrasi.go.id. It is free.” 并把 Indonesia 的核验日期从 06-17 刷新掉。
3. Bing 是 ChatGPT 检索的主要上游之一，也是本站最大的自然来源：在 Bing Webmaster 里核对这两页的索引状态和 Bing 的展示词；IndexNow 已接入，可以对改过的页面单独提交一次。
4. 是否用“引用政府官方警示”的形式恢复部分“某网站是否官方”的内容（只引用移民局自己公布的仿冒域名，不做站方判断），需要你在流量和法律风险之间做决定。本报告不替你做这个决定。

---

## 七、图片（60）

- 爬取的 468 页里，`<img>` 标签总数为 0，所以没有 alt 缺失问题；但页面也就没有任何截图、示意图或表单界面图。
- `og:image` 全站 468 页都用同一张 `/og/default.png`，Article schema 的 `image` 也是它。

| 严重度 | 建议 |
|---|---|
| Medium | 给主表单页加 1～2 张官方表单界面截图（带 alt 和尺寸，说明拍摄日期）。这既是“我们真的填过”的经验证据，也能拿到图片搜索和 Bing 图片流量。截图要避开个人信息 |
| Low | 按国家生成 OG 图（国名 + 表单名 + 官方域名），提升社交分享和 AI 卡片预览的辨识度 |

---

## 数据附录

- GSC 28 天：134 点击 / 7840 曝光 / CTR 1.71% / 平均位置 13.6。90 天：314 / 22582 / 1.39% / 17.3。移动端平均位置 8.5，桌面 17.7。
- GA4 28 天（已过滤生产主机与疑似机器人）：2078 次会话；Organic Search 1305，Direct 698（参与率 12%，疑似残留机器人），AI Assistant 36。
- 原始导出没有入库（`data-exports/` 已被 gitignore）。复现方法：`node scripts/fetch-search-data.mjs --days=28 --end-date=2026-10-09` 和 `--days=90 --end-date=2026-10-09`；按周、按日的来源拆分用 GA4 Data API，维度为 `isoYearIsoWeek` / `date` × `sessionSource`。
