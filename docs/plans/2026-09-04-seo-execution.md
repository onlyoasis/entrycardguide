# 2026-09-04 SEO 执行计划（委派实施）

**委派对象：** claude-GLM（glm-5.3）
**验收方：** 主控 Claude 会话
**状态：** 待实施

---

## 0. 这份任务书怎么读

下面「背景数据」一节里的数字，是主控方 2026-09-04 亲手从仓库导出文件和线上站点跑出来的，
可以当事实用。**除此之外的所有技术细节（API 端点、方法名、字段名、参数）都是记忆或推断，
必须先核实。**

**授权反驳：** 查到的实际情况与本文档不符时，**以实际为准**，并在最终报告里单列一节说明差异。
不要照着本文档的错误前提实现。

**禁止改期望值迁就实现：** 本文给出的验收数值（页数、行数、返回码）如果实测对不上，
说明原因，不要调低断言让检查变绿。

---

## 1. 红线（违反即返工）

- **不做任何 git 操作。** 不 `commit`、不 `push`、不 `stash`、不 `checkout`、不 `branch`、不 `add`。
  改完文件就停，提交由主控方逐个读 diff 后串行完成。
- **不点名任何第三方公司/中介域名。** 站点 2026-08-10 已移除中介名单（见 CLAUDE.md）。
  可以说「有站点收费 US$20–90 卖免费表单」（泰国移民局 2026-03-30 公开表态），
  **不可以**说「X 公司是骗子」。这条对本次要写的所有 outreach 文案同样生效。
- **不新增任何 npm 依赖。** 站点的 v1.0 约束是浏览器端零依赖，构建脚本也一直只用 node 内置模块。
- **不碰** `tailwind.config.js`、`assets/js/validator.ts`、`data/rules/`、`config.toml`、`content/`。
  本次三个任务都不需要它们。
- **不重构现有脚本。** `scripts/fetch-search-data.mjs` 和 `scripts/check-index-status.mjs`
  各自复制了一份 `loadDotEnv` / `requireEnv` / `postForm` / `accessToken`，这是本仓库既有风格。
  新脚本照着复制第三份，**不要**为了去重把它们抽成公共模块。

---

## 2. 背景数据（主控方 2026-09-04 实测，可直接引用）

### 2.1 索引状态 — 来自 `data-exports/2026-09-04-index-status/summary.txt`

| 分组 | 页数 | 已索引 |
|---|---|---|
| 18 国老页 | 108 | 107 |
| 32 国新页 | 192 | **0** |
| 非国家页 | 12 | 12 |

新页细分：英文 89 个 `Discovered - currently not indexed`、7 个 `URL is unknown to Google`；
中文 96 个全部 `URL is unknown to Google`。

已排除技术原因：线上 `/en/sitemap.xml` 与 `/zh/sitemap.xml` 各 156 个 `<loc>`、都含新国家、
`robots.txt` 全放行、首页有内链、新国家页返回 200。

**注意时间窗：** 50 国 2026-08-30 上线，这份检查 09-04 跑的，只隔 5 天。
5 天出现 `Discovered - not indexed` 属正常排队，**现在不能判定为索引失败**。

GSC Sitemaps API 返回的 `lastDownloaded`：en = `2026-09-01T14:43`，zh = `2026-08-30T06:38`。
zh 那份比 en 旧 2 天，且很可能早于当天的部署——这是任务 A 的动机。

### 2.2 搜索表现 — 来自 `data-exports/2026-08-31-365d/`（GSC 130 天，2026-04-23 起）

| 维度 | 曝光 | 点击 |
|---|---|---|
| date（真实总量） | 18,465 | 199 |
| page | 18,794 | 200 |
| **query** | **3,936（21%）** | **5（2.5%）** |

**结论：GSC 的 query 维度只能解释 5 次点击，不能用来做关键词研究。** 这是任务 C 的动机。

GA4 365 天渠道（已扣除已知的 headless 爬虫桶 `(direct)`）：

```
chatgpt.com/ai-assistant   928 会话（engaged 384）
cn.bing.com/referral       308 会话（engaged 161）  ┐ 合计 513
bing/organic               205 会话（engaged 122）  ┘
google/organic             164 会话（engaged  91）
```

Bing 系合计是 Google 的 3.1 倍，而 Bing Webmaster Tools 不做 query 匿名化。

### 2.3 外链现状

`docs/tasks/10-backlink-recon.md` 调研完成于 2026-05-16，2026-09-03 由提交 `dc6f949` 做过政策复核，
逐项标注了有效/失效，但**失效项的替代文案一直没写**，所以整份文档仍然无法执行。这是任务 B 的动机。

---

## 3. 动手前必须自查的事实清单

以下每条都要自己查证，**不要采信本文档的说法**：

1. `scripts/check-index-status.mjs` 里 `sitemapEndpoint` 的实际取值和 `accessToken()` 的实际实现；
2. `.env` 里实际存在哪些 key（**只看 key 名，不要打印 value，不要把 value 写进任何文件或报告**）；
3. `package.json` 的 `scripts` 现有条目；
4. `docs/tasks/10-backlink-recon.md` 里 2026-09-03 那张政策复核表格的实际内容
   （哪几项标了 ✅ / ⚠️ / ❌），本文第 5 节的转述可能有出入；
5. Google Search Console Sitemaps API 的**提交**方法：HTTP 动词、URL 形态、请求体、成功返回码。
   主控方的记忆是 `PUT /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}`、无请求体、返回 204，
   **未经核实**；
6. `.env` 里 refresh token 的 scope 是否包含可写的 `webmasters`（只读的 `webmasters.readonly`
   做不了提交）。项目文档说是 `webmasters` + `analytics.readonly` + `indexing`，**未经核实**；
7. Bing Webmaster Tools API 的 base URL、鉴权方式、以及取 query 数据的方法名。
   主控方的记忆是 `https://ssl.bing.com/webmaster/api.svc/json/{Method}?apikey=KEY`，
   方法名可能是 `GetQueryStats` / `GetPageQueryStats` / `GetRankAndTrafficStats`，
   **全部未经核实，必须查官方文档**。

---

## 4. 任务 A — GSC sitemap 重新提交脚本

### 产出

- 新文件 `scripts/resubmit-sitemaps.mjs`
- `package.json` 新增 `"submit:sitemaps": "node scripts/resubmit-sitemaps.mjs"`

### 要求

- 提交这两个 sitemap：`https://entrycardguide.com/en/sitemap.xml`、`https://entrycardguide.com/zh/sitemap.xml`。
  站点 URL 从 `process.env.GSC_SITE_URL` 读，默认 `sc-domain:entrycardguide.com`
  （和现有两个脚本一致）。
- 复用 `check-index-status.mjs` 的 `.env` 加载 + refresh token 换 access token 的写法（复制，不抽取）。
- 支持 `--dry-run`：打印将要发的请求，不发。
- **Fail fast：** 提交返回非成功状态码时立即抛出，错误信息里带上 URL、状态码和响应体。
  不要 `catch` 后继续。
- 提交完成后，回读一次 sitemaps 列表并打印每份的 `lastSubmitted` / `lastDownloaded` / `errors` / `warnings`，
  让调用方能确认提交真的落地了。
- 全文注释和输出用英文（和 `scripts/` 下现有 4 个脚本一致）。

### 验收标准

1. `node scripts/resubmit-sitemaps.mjs --dry-run` 打印两条请求，不产生网络写操作；
2. 主控方实跑真实提交后，回读的 `lastSubmitted` 两份都刷新到今天；
3. 脚本 60 行以内（现有 `submit-indexnow.mjs` 是同量级的参照）。

### 明确的预期边界

重提交只是让 Google 重新抓一次 sitemap，**不保证也不代表页面会被索引**。
不要在代码注释或报告里写「这样就能让新国家进索引」。

---

## 5. 任务 B — 重写 `docs/tasks/10-backlink-recon.md` 的失效话术

### 背景

该文档 2026-09-03 已做政策复核，标出了哪些项失效，但**没有给替代文案**，所以仍然不可执行。
本任务只补替代文案，不重写整份文档。

### 站点现在真实的三个卖点（全部可兑现、全部不点名任何公司）

1. **50 个国家的官方政府网址**，每条带 `last_verified` 日期，存在公开 TOML 里
   （`data/official_urls/{country}.toml`）；
2. **497 条字段规则**，含正则、字符上限、以及官方网站返回的原话错误信息，
   存在公开 JSON 里（`data/rules/{country}.json`）；
3. **每次变更都记在公开 changelog**，一国一份，带日期（`data/changelog/{country}.toml`）。

第三方权威事实（只讲品类不点名公司，可安全引用）：泰国移民局副局长兼发言人
Pol. Maj. Gen. Choengron Rimpadee 于 2026-03-30 表示，至少 10% 的外国入境者使用了非官方
TDAC 网站、收费 US$20–90，而官方 TDAC 免费（Bangkok Post / Khaosod English / Thai Examiner）。

**先自查这三条卖点的数字是否属实**：`data/official_urls/` 的文件数、`data/rules/*.json` 的字段总数、
`data/changelog/` 的文件数。对不上就用实际数字，并在报告里说明。

### 要改的四处

按文档里 2026-09-03 复核表标为 ⚠️（名单有效、话术失效）的四项，各写一份替代文案：

| # | 位置 | 现在的问题 | 要写成什么 |
|---|---|---|---|
| 3 | 政府/大使馆 outreach 的邮件模板 | 主题行和正文都在推销「a public repository of named scam domains with first_observed dates and DNS audit evidence」，这个数据集站点已不再发布，照发属虚假陈述 | 换成「可交叉核对的官方网址 + 字段规则数据集」。主题行不得出现 scam-domain / named / dataset of scammers 这类表述 |
| 5 | 维基百科编辑策略第 2 步 | 「用 `<ref>` 引用本站 scam domain catalog」——该 catalog 不存在了 | 删掉这一步，保留 External links 加国家枢纽页；引用来源改为官方 URL 目录页 |
| 6 | HARO 的 profile bio 和回复模板 | bio 写「Tracks reseller scam domains with first-observed dates and DNS evidence」且「across 7 countries」已过时（现在 50 国） | bio 按三个卖点重写、国家数改对；回复模板里的「our underlying scam domain dataset」换成官方 URL / 字段规则数据集 |
| 8 | 论坛回帖角度 | 复核结论是「回官方网址 + 字段怎么填，不回这些是骗子」，但文档没给示范 | 补一段 3–5 行的回帖示范，含 maintainer 身份披露、官方 URL、一条具体字段约束。不点名任何站点 |

### 另外三处标为 ❌ 的段落

第 2 节（竞争对手情报）、第 9 节（索引自检）、末尾「🚧 待核验中介域名候选」。

**不要删除它们**（保留记录），但在每段开头加一个醒目的停用横幅，写明：失效日期、失效原因、
以及「本节内容不得用于任何对外沟通」。横幅格式跟文档里已有的 `> ⚠️ 政策复核` 块保持一致。

### 还要改的一处

第 3 节表格上方那句「带上『我们维护一份带 first_observed 日期 + DNS 证据的完整名单』邮件去」
——这是同一个失效前提，一并改掉。

### 验收标准

1. 全文搜 `scam domain`、`scam-domain`、`named scam`、`first_observed`、`DNS evidence`
   （不区分大小写），命中只应出现在**停用横幅内部**或**说明「过去写过什么」的引述里**，
   不得出现在任何可直接拿去发送的模板正文中；
2. 全文搜 `across 7 countries`、`7 countries`，应为 0 命中；
3. 三个 ❌ 段落各有一个停用横幅；
4. 四份替代文案都不含任何第三方公司名或中介域名；
5. 文档语言保持中文（模板正文本身是英文，这是原文既有约定，保留）；
6. **不要动**文档里已有的 2026-08-09 和 2026-09-03 两个复核块的内容。

---

## 6. 任务 C — Bing Webmaster Tools 取数脚本

### 背景

见 2.2：GSC query 维度只覆盖 2.5% 的点击，而 Bing 系流量是 Google 的 3.1 倍且不匿名化。
BWT 属性 2026-07-23 已建好（`docs/tasks/05`），但**没有 API key**，所以脚本写完也跑不了真实调用。

### 产出

- 新文件 `scripts/fetch-bing-search-data.mjs`
- `package.json` 新增 `"fetch:bing-data": "node scripts/fetch-bing-search-data.mjs"`
- `docs/maintenance/search-data-api.md` 追加一节，写明怎么拿 API key、怎么跑、输出在哪

### 要求

- API key 从 `process.env.BING_WEBMASTER_API_KEY` 读，缺失时抛出**带获取指引**的错误
  （BWT 后台 → Settings → API access → API Key），不要静默退出。
- 输出目录沿用现有约定：`data-exports/{YYYY-MM-DD}-bing/`，一个方法一份 JSON，
  文件名 `bing-{方法的小写连字符名}.json`。
- 至少取到：query 级的展示/点击/排名，以及站点整体的流量与抓取趋势。
  **具体方法名必须查官方文档确认**，不要用本文第 3 节的记忆值。
- Fail fast：HTTP 非 2xx、或响应体里带 API 错误结构时，立即抛出并打印原始响应。
- 和现有脚本一样零依赖、ESM、注释与输出用英文。

### 验收标准（**这条最重要**）

真实 API 无法调用，所以：

1. **必须用 mock 的 `globalThis.fetch` 走一遍真实代码路径端到端**——不是写一个等价的验证脚本，
   而是 `import` 或直接执行被测脚本本身，让它的分支真的被执行到
   （参照 `check-index-status.mjs` 当初的验证方式）。mock 数据放在 scratchpad，不要入库。
2. **必须在脚本文件头部注释和 `search-data-api.md` 新增那节里，都显式标注**：
   「响应字段名与方法名出自官方文档核查，**未经真实 API 验证**。第一次真实运行时若与假设不符，
   按实际返回修正，不要调整断言迁就实现。」
   这条是硬性要求——本仓库已经在 `check-index-status.mjs` 上吃过一次「文档假设被当成既成事实」的亏。
3. 报告里必须写清：哪些方法名/字段名是从官方文档查到的（附文档 URL），哪些是推断的。

---

## 7. 完成后要交回什么

一份报告，包含：

1. 三个任务各自改了哪些文件、每个文件的增删行数；
2. 第 3 节自查清单里，**每一条**的实际查证结果，以及与本文档不符的地方；
3. 每条验收标准的实际执行命令和输出（不是「已通过」三个字）；
4. 任务 C 里哪些是查证的、哪些是推断的；
5. 你认为本文档写错或考虑不周的地方。

**不要跑 `npm run build:prod` 或 `check:seo`**——本次三个任务都不改 `layouts/`、`content/`、`data/`、
`assets/`，构建产物不受影响，跑了也证明不了什么。主控方会自行决定要不要跑。
