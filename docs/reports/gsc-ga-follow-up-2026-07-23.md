# GSC + GA4 跟踪报告：2026-07-23

记录时间：2026-07-23 CST
站点：`https://entrycardguide.com/`（18 国上线后首次复盘）
数据来源：
- Google Search Console，Chrome 登录态读取（属性在账号 `l363758470@gmail.com` 下，非主账号）
- GA4 property `p536218791`（Measurement ID `G-8C2Q42N506`，账号 forOasis）
GSC 数据更新时间：约 4.5 小时前；GSC 窗口=近 3 个月；GA4 窗口=近 28 天（6/25–7/22）

上一份报告：`gsc-follow-up-2026-05-19.md`（当时只有 5 个国家页有曝光，外链 0，点击≈0）。

## 摘要

- **最大发现：44% 的活跃用户来自 ChatGPT（`chatgpt.com / ai-assistant` 203 人），是 Google 自然搜索（21 人）的约 10 倍。** 加上 claude.ai、openai。本站真正的流量引擎是 AI 助手，不是 Google。
- GSC 近 3 个月：点击 `73`、曝光 `8,780`、CTR `0.8%`、平均排名 `25.2`。相比 5 月（28 天 564 曝光 / 1 点击）是数量级增长，主因是 18 国扩充 + 索引从 14 页涨到 100 页。
- **两类页面问题泾渭分明**：
  1. 主表页（`indonesia/e-cd` pos 35、`vietnam/evisa` pos 89、`dominican/eticket` pos 47、`mexico/` pos 62）曝光高但排名深，进不了 Google 前几页。
  2. `how-to-fill` 指南页已在 Google 第 1 页（pos 8–11），但 CTR 只有 0.3%–1%，标题/摘要没接住点击。
- **外链仍为 0**。这是 Google 自然排名上不去的根因，两个月没变。
- **GA4 流量质量偏低**：平均互动 16 秒、跳出率 66%–94%、几乎无回访。
- **收入信号量化不了**：GA4 关键事件「无数据」，`affiliate_click` 没被标为关键事件（或确实 0 次）。

## 一、GSC 效果数据（近 3 个月）

| 指标 | 值 | 对比 5 月（28 天） |
|---|---:|---|
| 点击 | 73 | 1 |
| 曝光 | 8,780 | 564 |
| CTR | 0.8% | 0.2% |
| 平均排名 | 25.2 | 41.7 |

### 网页（按点击，共 131 个有曝光页面）

| 页面 | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| `/malaysia/how-to-fill/` | 14 | 474 | 3% | 10.0 |
| `/singapore/how-to-fill/` | 12 | 1,165 | 1% | 8.1 |
| `/zh/mexico/fmm/` | 7 | 134 | 5.2% | 9.4 |
| `/thailand/how-to-fill/` | 4 | 393 | 1% | 11.5 |
| `/vietnam/how-to-fill/` | 3 | 1,131 | 0.3% | 11.4 |
| `/indonesia/how-to-fill/` | 3 | 539 | 0.6% | 9.4 |
| `/india/how-to-fill/` | 3 | 56 | 5.4% | 10.2 |
| `/zh/dominican/how-to-fill/` | 3 | 24 | 12.5% | 6.5 |
| `/zh/korea/is-ivisa-official/` | 3 | 12 | 25% | 4.3 |
| `/japan/how-to-fill/` | 2 | 68 | 2.9% | 14.3 |

### 网页（按曝光）——暴露「高需求卡住」的主表页

| 页面 | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| `/indonesia/e-cd/` | 0 | 1,188 | 0% | 35.3 |
| `/singapore/how-to-fill/` | 12 | 1,165 | 1% | 8.1 |
| `/vietnam/how-to-fill/` | 3 | 1,131 | 0.3% | 11.4 |
| `/vietnam/evisa/` | 1 | 707 | 0.1% | 88.9 |
| `/indonesia/how-to-fill/` | 3 | 539 | 0.6% | 9.4 |
| `/malaysia/how-to-fill/` | 14 | 474 | 3% | 10.0 |
| `/thailand/how-to-fill/` | 4 | 393 | 1% | 11.5 |
| `/dominican/eticket/` | 0 | 370 | 0% | 46.6 |
| `/dominican/how-to-fill/` | 1 | 256 | 0.4% | 9.6 |
| `/mexico/` | 0 | 154 | 0% | 61.7 |

倒挂现象：多个国家的 `how-to-fill` 指南页排名（8–11）反而高于它对应的主表页（e-cd 35、evisa 89、eticket 47）。长尾「how to fill X」竞争小、能排上；主表页打的是「vietnam evisa」「indonesia e-cd」这类头部词，被 iVisa / 官方 / 竞品压住。

### 查询（按点击，共 617 个）

| Query | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| `evisa vietnam` | 1 | 512 | 0.2% | 110.5 |
| `印度入境卡填寫` | 1 | 5 | 20% | 9.8 |
| `ecd indonesia` | 0 | 92 | 0% | 40.8 |
| `e cd indonesia` | 0 | 59 | 0% | 36.8 |
| `e ticket dominican republic` | 0 | 56 | 0% | 49.1 |
| `indonesia ecd` | 0 | 55 | 0% | 35.5 |
| `mdac` | 0 | 53 | 0% | 62.2 |
| `bali customs declaration` | 0 | 48 | 0% | 56.7 |
| `custom declaration indonesia` | 0 | 45 | 0% | 53.2 |
| `eticket dominican republic` | 0 | 40 | 0% | 52.1 |

需求集中在：印尼 e-CD / bali 海关申报、越南 evisa、多米尼加 e-ticket、马来西亚 MDAC。都是「主表页」对应的词，且排名普遍 35–110。

### 国家 / 地区（按点击）

| 地区 | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| 美国 | 15 | 3,053 | 0.5% | 35.7 |
| 中国香港 | 7 | 239 | 2.9% | 14.6 |
| 台湾 | 7 | 218 | 3.2% | 15.9 |
| 印度 | 5 | 352 | 1.4% | 12.8 |
| 德国 | 5 | 249 | 2% | 20.1 |
| 马来西亚 | 5 | 193 | 2.6% | 16.4 |
| 新加坡 | 3 | 478 | 0.6% | 16.6 |
| 菲律宾 | 3 | 206 | 1.5% | 14.2 |
| 中国 | 3 | 103 | 2.9% | 11.3 |

美国占全站曝光 35%（3,053），但排名 35.7、CTR 0.5%——量最大却排最差。华语区（港台+大陆）CTR 2.9%–3.2%、排名 11–16，zh 页面效率明显更高。

## 二、GSC 结构

### 索引（近乎解决）

| 状态 | 数量 | 对比 5 月 |
|---|---:|---|
| 已编入索引 | 100 | 14 |
| 未编入索引 | 8 | 57 |

5 月「已发现-尚未编入 54 页」的抓取瓶颈基本消失。

### 链接（外链仍是天花板）

| 类型 | 数量 | 对比 5 月 |
|---|---:|---|
| 外部链接 | **0** | 0 |
| 内部链接 | 596 | 21 |

内链问题被扩充解决了（首页 53、各枢纽 ~30，分布均匀）。**外链两个月仍为 0**，这是 Google 排名上不去的根因。

## 三、GA4 数据（近 28 天）

| 指标 | 值 |
|---|---:|
| 活跃用户 | 462 |
| 新用户 | 460 |
| 事件数 | 1,709 |
| 平均互动时长 | 16 秒 |
| 关键事件（转化） | 无数据 |

几乎全是新用户、无回访。

### 热门页面（按浏览）

| 页面 | 浏览 | 用户 | 事件 | 跳出率 |
|---|---:|---:|---:|---:|
| Indonesia e-CD（主表页） | 160 | 122 | 490 | 66.9% |
| Malaysia MDAC（主表页） | 94 | 89 | 334 | 71.4% |
| Singapore SGAC how-to-fill | 20 | 19 | 65 | 73.7% |
| 首页 | 17 | 17 | 54 | 88.9% |
| Malaysia MDAC 逐字段 | 15 | 15 | 51 | 94.1% |
| Japan hub | 12 | 6 | 23 | 33.3% |
| Vietnam E-Visa how-to-fill | 10 | 9 | 33 | 66.7% |

Indonesia e-CD 是 GA 浏览第一（160），但它在 GSC 排名 35、几乎 0 谷歌点击——这些访客不是 Google 来的。

### 来源 / 媒介（本报告最重要的一张表）

按带来用户首次互动划分的活跃用户：

| 来源 / 媒介 | 活跃用户 |
|---|---:|
| (direct) / (none) | 230 |
| **chatgpt.com / ai-assistant** | **203** |
| google / organic | 21 |
| m.sogou.com / referral | 4 |
| bing / organic | 1 |
| claude.ai / ai-assistant | 1 |
| openai / organic | 1 |

会话维度同样：chatgpt.com/ai-assistant `218` 会话、google/organic `23`。

**结论：AI 助手（主力是 ChatGPT）是本站第二大、且远超 Google 的流量来源。** 直接访问 230 里也可能有一部分是 AI 客户端/未打标的 AI 引流。反诈入境卡内容（明确官方 URL、机构名、费用、「是否官方」结论）正是 LLM 喜欢引用的结构化事实。

## 四、分析

1. **本站已经赢在 AI 搜索，输在 Google 搜索。** ChatGPT 引流 203 vs Google 21。而 Google 弱是因为外链=0、域名零权重——这恰恰是 AI 助手不太在意的维度。两个渠道的排序逻辑不同，要分开打。

2. **16 秒互动 + 高跳出**符合 AI/直接流量特征：用户在 ChatGPT 拿到答案，点链接来核对官方 URL，看一眼就走。这不完全是坏事（核对官方站本就是秒级动作），但首页 88.9% 跳出说明首页没接住人。

3. **收入链路没打通**：GA4 关键事件无数据，`affiliate_click` 没被标为关键事件。即便有人点 SafetyWing/Airalo 联盟链接也量化不到。先修配置，才能判断这批 AI 流量有没有变现潜力。

4. **主表页 vs 指南页倒挂**是内容结构信号：主表页需要外链/权重才能在 Google 打头部词；指南页靠长尾已经能排。

## 五、优化清单

### P0：把 AI 助手流量当第一优先级经营（GEO）

- 立刻确认没有屏蔽 AI 爬虫：检查 `static/robots.txt` 和 `static/_headers`，确保 `GPTBot`、`OAI-SearchBot`、`ClaudeBot`、`PerplexityBot`、`Google-Extended` 没被 disallow。这是 203 人来源的命脉，先查。
- 强化「可被 AI 直接引用」的事实密度：每页开头用明确短句给出——官方机构名、官方 URL、费用、「iVisa 等中介非官方」结论。ChatGPT 引流最多的 `indonesia/e-cd`、`malaysia/mdac` 优先。
- 复核 `layouts/partials/head.html` 的 JSON-LD：确保每页 Article / BreadcrumbList 完整，有 `faq` 的页面都发 FAQPage。结构化数据同时喂 Google 和 AI 爬虫。

### P0/P1：改 6 个 Google 第 1 页 how-to-fill 页的标题/摘要（最快见效）

这些页已在 pos 8–11，只是 CTR 太低（0.3%–1%）。对照 `india/how-to-fill`（5.4%）、`zh/dominican/how-to-fill`（12.5%）、`zh/korea/is-ivisa-official`（25%）——标题写法能差 5–25 倍。

改 `content/{country}/how-to-fill.md`（及 `.zh.md`）front matter 的 `title`/`description`：

| 页面 | 曝光 | CTR | 动作 |
|---|---:|---:|---|
| `singapore/how-to-fill` | 1,165 | 1% | 标题加官方/free/2026，覆盖 SGAC |
| `vietnam/how-to-fill` | 1,131 | 0.3% | 覆盖「application form」搜索说法（沿用 5 月建议，仍未做） |
| `indonesia/how-to-fill` | 539 | 0.6% | 覆盖 e-CD/customs declaration |
| `thailand/how-to-fill` | 393 | 1% | 覆盖 TDAC |
| `dominican/how-to-fill` | 256 | 0.4% | 覆盖 e-ticket |
| `malaysia/how-to-fill` | 474 | 3% | 已最好，仍可再提 |

只改 markdown front matter，不动模板。

### P1：外链——Google 的天花板（沿用 5 月，仍未执行）

外链 0 是主表页排 35–89 的根因，改标题救不了。执行 `docs/tasks/09-quora-outreach.md`、`docs/tasks/10-backlink-recon.md`：
- Reddit / TripAdvisor / FlyerTalk / Quora 回答真实问题，链到官方目录页或具体指南页。
- 锚文本用官方站说法：`official Indonesia e-CD site`、`Malaysia MDAC official website`、`Vietnam evisa official site`。

### P1：给卡住的主表页更强站内锚文本

从首页 / 国家枢纽 / `/official-links/` 用精确锚文本指向 `indonesia/e-cd`、`vietnam/evisa`、`dominican/eticket`、`mexico/`。不改设计系统，只加文字链接。

### P1：修 GA4 收入追踪（配置问题）

在 GA4（property `p536218791`）把 `affiliate_click` 标记为「关键事件」，否则无法量化 SafetyWing/Airalo 点击。这批 AI 流量能不能变现，取决于先能不能测到。

### P2：按真实流量重排 roster（对应 9 月计划，数据已就绪）

`layouts/partials/country-roster.html` 顺序按实际带量调整：Indonesia（e-CD）、Malaysia（MDAC）、Singapore、Vietnam、Thailand、Dominican、Mexico 靠前。首页网格、导航、页脚都从 roster 自动生成。

## 六、下次复查要看的指标

- `chatgpt.com/ai-assistant` 是否继续增长、是否有 perplexity 等新 AI 来源。
- 6 个 how-to-fill 页改标题后 CTR 是否上升（等 2 周）。
- 外链是否从 0 起步。
- `affiliate_click` 标为关键事件后，转化是否 > 0。
- 首页跳出率（当前 88.9%）是否下降。

## 七、AI 引流深挖：ChatGPT 到底引用了什么

用 GA4「网页路径 × 带来会话的来源/媒介」交叉，过滤 `chatgpt` 得到 17 行组合（近 28 天）。

ChatGPT 合计：**浏览 260（占全站 49.3%）、活跃用户 203（43.9%）、事件 845、平均互动 18 秒**。

| 页面 | 浏览 | 占 ChatGPT | 互动时长 |
|---|---:|---:|---:|
| `/indonesia/e-cd/` | 142 | 54.6% | 15 秒 |
| `/malaysia/mdac/` | 90 | 34.6% | 15 秒 |
| `/japan/` | 11 | 4.2% | 19 秒 |
| `/vietnam/how-to-fill/` | 4 | 1.5% | 41 秒 |
| `/indonesia/is-ivisa-official/` | 3 | 1.2% | 8 秒 |
| `/japan/visit-japan-web/` | 1 | 0.4% | 1 分 12 秒 |
| 其余（首页、`/indonesia/how-to-fill/`、`/japan/how-to-fill/` 等） | 各 1 | — | — |

**两个页面吃掉 ChatGPT 流量的 89%。18 国里 14 国拿不到任何 AI 引流。**

### 排除的解释

**不是页面年龄。** 主表页首次提交日期：

| 页面 | 创建日期 |
|---|---|
| `malaysia/mdac.md` | 2026-04-25 |
| `thailand/tdac.md` | 2026-04-25 |
| `dominican/eticket.md` | 2026-04-25 |
| `mexico/fmm.md` | 2026-04-25 |
| `indonesia/e-cd.md` | 2026-04-26 |
| `vietnam/evisa.md` | 2026-04-26 |
| `singapore/sgac.md` | 2026-04-26 |
| `japan/visit-japan-web.md` | 2026-06-11 |
| `india/e-arrival-card.md`、`turkey/evisa.md` | 2026-07-14 |

7 个主表页同周上线，只有 2 个被引用。

**不是内容体量。**

| 文件 | 字数 | FAQ | 诈骗站引用 |
|---|---:|---:|---:|
| `mexico/fmm.md` | 1,185 | 6 | 2 |
| `vietnam/evisa.md` | 1,108 | 8 | 3 |
| `malaysia/mdac.md` | 1,081 | 7 | 2 |
| `thailand/tdac.md` | 1,006 | 7 | 2 |
| `dominican/eticket.md` | 941 | 6 | 2 |
| `indonesia/e-cd.md` | 890 | 8 | 2 |
| `singapore/sgac.md` | 845 | 8 | 1 |
| `turkey/evisa.md` | 809 | 5 | 0 |
| `japan/visit-japan-web.md` | 250 | 3 | 0 |

`vietnam/evisa` 和 `mexico/fmm` 比 `indonesia/e-cd` 更长、FAQ 更多、诈骗站证据更多，却拿不到 AI 引流。

**也不是纯搜索需求。** `evisa vietnam` 在 GSC 有 512 次曝光（全站单 query 最高），但 `/vietnam/evisa/` 的 ChatGPT 引流为 0。

### 最可能的机制：不在 AI 助手依赖的索引里

- `docs/tasks/05-bing-webmaster-tools.md` 状态仍是 **`open`**，从未执行。
- 仓库内没有 `BingSiteAuth.xml`、没有 `msvalidate` meta、没有 IndexNow。
- GSC 国家/来源数据里 `bing / organic` 只有 **1 个用户**。

AI 助手的联网检索大量依赖 Bing 及各家自有索引（OAI-SearchBot 等），而本站只在 Google 做了收录工作。目前这 2 个被引用的页面更像是「碰巧被非 Google 索引收进去了」，不是内容特殊。这是推断，不是定论——但它给出一个 10 分钟、零风险的验证动作。

### 行动

1. **接入 Bing Webmaster Tools**（`docs/tasks/05`，可从 GSC 一键导入，约 10 分钟），提交两份 sitemap。这是解锁其余 16 国 AI 引流成本最低、最值得先试的一步。
2. 考虑接 IndexNow（Cloudflare 支持），让新增/更新页面主动推送给 Bing 系索引。
3. **先别重写 16 个主表页**。数据已经排除「内容结构不够好」这个解释，盲目重写是浪费。先解决「能不能被检索到」，2–4 周后复看 AI 引流是否扩散。
4. 修 GA4 关键事件（`affiliate_click`），否则这 203 个 AI 用户有没有商业价值无从判断。

### 下次复查（AI 侧）

- 接入 Bing 后，ChatGPT 引流是否从 2 个页面扩散到更多国家。
- `bing / organic` 是否从 1 起量。
- 是否出现 perplexity、gemini 等新 AI 来源。
- ChatGPT 流量的平均互动时长（当前 18 秒）是否上升。
