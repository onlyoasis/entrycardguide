# GSC 跟踪报告：2026-05-19

记录时间：2026-05-19 08:43 CST  
站点：`https://entrycardguide.com/`  
数据来源：Google Search Console，Chrome 登录态读取  
GSC 数据更新时间：页面显示“上次更新日期：4.5 小时前”  

## 摘要

本次跟踪的核心结论：

- 昨天 `b3deb15` 已发布针对 `/vietnam/evisa/`、`/singapore/how-to-fill/`、`/malaysia/mdac/` 的 SEO snippet 调整，但 GSC 当前最新数据只到 `2026-05-18`。这批修改还没有足够时间反映在 GSC 里。
- 近 7 天展示量基本持平：`209` vs 前 7 天 `216`。点击仍为 `0`。
- 近 28 天有 `564` 展示、`1` 点击、CTR `0.2%`、平均排名 `41.7`。
- 主要曝光仍来自 4 个页面：`/singapore/how-to-fill/`、`/vietnam/evisa/`、`/malaysia/mdac/`、`/vietnam/how-to-fill/`。
- 最大结构性问题不是 sitemap，而是抓取和权重：GSC 仍显示 `57` 个 URL 未编入索引，其中 `54` 个是“已发现 - 尚未编入索引”；外部链接为 `0`。

## 最近发布与 GSC 操作

已发布提交：

- Commit：`b3deb15 Improve GSC-targeted SEO snippets`
- 发布日期：2026-05-18
- 已优化页面：
  - `/vietnam/evisa/`
  - `/singapore/how-to-fill/`
  - `/malaysia/mdac/`

已在 GSC URL Inspection 请求重新编入索引：

| URL | GSC 状态 | 操作 |
|---|---:|---|
| `https://entrycardguide.com/vietnam/evisa/` | 网址已收录到 Google | 已请求编入索引，已加入优先抓取队列 |
| `https://entrycardguide.com/singapore/how-to-fill/` | 网址已收录到 Google | 已请求编入索引，已加入优先抓取队列 |
| `https://entrycardguide.com/malaysia/mdac/` | 网址已收录到 Google | 已请求编入索引，已加入优先抓取队列 |

判断：这 3 个页面不建议今天继续改。应至少等到 `2026-05-22` 以后再评估 CTR 和排名变化。

## 近 7 天效果数据

时间窗口：`2026-05-12` 到 `2026-05-18`  
对比窗口：`2026-05-05` 到 `2026-05-11`

| 指标 | 当前 7 天 | 前 7 天 | 变化 |
|---|---:|---:|---:|
| 点击 | 0 | 0 | 0 |
| 展示 | 209 | 216 | -7 |
| CTR | 0% | 0% | 0 |
| 平均排名 | 59.8 | 46.7 | 变差 13.1 |

### 近 7 天查询

GSC 当前表格可见前 10 行，共 15 行。

| Query | 点击 | 展示 | 前期展示 | 展示变化 | CTR | 平均排名 | 前期排名 | 排名变化 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `evisa vietnam` | 0 | 96 | 75 | +21 | 0% | 110.8 | 119.8 | 改善 9.0 |
| `mdac website` | 0 | 2 | 0 | +2 | 0% | 41.5 | 0 | 新增 |
| `how to fill out vietnam visa application form` | 0 | 2 | 0 | +2 | 0% | 57.5 | 0 | 新增 |
| `e-visa vietnam` | 0 | 2 | 0 | +2 | 0% | 77.0 | 0 | 新增 |
| `singapore passport number format` | 0 | 1 | 0 | +1 | 0% | 29.0 | 0 | 新增 |
| `how to fill sg arrival card` | 0 | 1 | 0 | +1 | 0% | 37.0 | 0 | 新增 |
| `sg a` | 0 | 1 | 0 | +1 | 0% | 55.0 | 0 | 新增 |
| `free malaysia digital arrival card` | 0 | 1 | 0 | +1 | 0% | 57.0 | 0 | 新增 |
| `evisa vietnam cost` | 0 | 1 | 0 | +1 | 0% | 69.0 | 0 | 新增 |
| `sg arrival card how to fill` | 0 | 1 | 1 | 0 | 0% | 74.0 | 45.0 | 变差 29.0 |

### 近 7 天页面

GSC 当前表格可见前 10 行，共 14 行。

| URL | 点击 | 展示 | 前期展示 | 展示变化 | CTR | 平均排名 | 前期排名 | 排名变化 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/vietnam/evisa/` | 0 | 104 | 83 | +21 | 0% | 105.5 | 109.1 | 改善 3.6 |
| `/singapore/how-to-fill/` | 0 | 40 | 90 | -50 | 0% | 12.0 | 6.6 | 变差 5.4 |
| `/vietnam/how-to-fill/` | 0 | 34 | 20 | +14 | 0% | 17.9 | 7.2 | 变差 10.8 |
| `/malaysia/mdac/` | 0 | 13 | 18 | -5 | 0% | 18.4 | 13.9 | 变差 4.4 |
| `/zh/vietnam/evisa/` | 0 | 4 | 1 | +3 | 0% | 8.8 | 7.0 | 变差 1.8 |
| `/thailand/tdac/` | 0 | 4 | 0 | +4 | 0% | 9.3 | 0 | 新增 |
| `/zh/singapore/how-to-fill/` | 0 | 4 | 6 | -2 | 0% | 12.3 | 6.5 | 变差 5.8 |
| `/decide/` | 0 | 4 | 1 | +3 | 0% | 12.8 | 9.0 | 变差 3.8 |
| `/zh/vietnam/how-to-fill/` | 0 | 1 | 0 | +1 | 0% | 9.0 | 0 | 新增 |
| `/zh/thailand/tdac/` | 0 | 1 | 0 | +1 | 0% | 10.0 | 0 | 新增 |

### 近 7 天国家 / 地区

GSC 当前表格可见前 10 行，共 41 行。

| 国家 / 地区 | 点击 | 展示 | 前期展示 | 展示变化 | CTR | 平均排名 | 前期排名 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 美国 | 0 | 117 | 104 | +13 | 0% | 79.1 | 75.0 |
| 越南 | 0 | 12 | 12 | 0 | 0% | 101.3 | 69.9 |
| 新加坡 | 0 | 8 | 15 | -7 | 0% | 15.5 | 6.3 |
| 澳大利亚 | 0 | 8 | 3 | +5 | 0% | 20.5 | 21.3 |
| 英国 | 0 | 7 | 3 | +4 | 0% | 49.1 | 20.7 |
| 印度 | 0 | 6 | 14 | -8 | 0% | 13.2 | 7.4 |
| 加拿大 | 0 | 6 | 3 | +3 | 0% | 55.0 | 32.7 |
| 德国 | 0 | 5 | 1 | +4 | 0% | 24.0 | 3.0 |
| 马来西亚 | 0 | 4 | 4 | 0 | 0% | 8.3 | 7.3 |
| 印度尼西亚 | 0 | 4 | 5 | -1 | 0% | 10.0 | 6.2 |

### 近 7 天设备

| 设备 | 点击 | 展示 | 前期展示 | CTR | 平均排名 | 前期排名 |
|---|---:|---:|---:|---:|---:|---:|
| 桌面 | 0 | 126 | 137 | 0% | 42.1 | 24.7 |
| 移动设备 | 0 | 83 | 78 | 0% | 86.7 | 85.8 |
| 平板电脑 | 0 | 0 | 1 | 0% | 0 | 9.0 |

### 近 7 天搜索结果呈现

无数据。

## 近 28 天效果数据

时间窗口：`2026-04-21` 到 `2026-05-18`  
对比窗口：`2026-03-24` 到 `2026-04-20`  
说明：对比窗口为 0，主要因为站点刚开始有 GSC 数据。

| 指标 | 当前 28 天 | 对比窗口 |
|---|---:|---:|
| 点击 | 1 | 0 |
| 展示 | 564 | 0 |
| CTR | 0.2% | 0% |
| 平均排名 | 41.7 | 0 |

### 近 28 天查询

GSC 当前表格可见前 10 行，共 23 行。

| Query | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `evisa vietnam` | 0 | 171 | 0% | 114.7 |
| `how to fill sgac form` | 0 | 5 | 0% | 8.2 |
| `"ivisa" -site:reddit.com -site:twitter.com -site:x.com -site:wykop.pl -site:tripadvisor.com -site:youtube.com -site:yelp.com -site:booking.com -site:facebook.com -site:instagram.com -site:tiktok.com` | 0 | 3 | 0% | 5.0 |
| `arrival card` | 0 | 3 | 0% | 5.3 |
| `-site:facebook.com -site:fb.me -site:youtube.com -site:youtu.be -site:youtube.be -site:twitter.com -site:instagram.com -site:tiktok.com -site:vm.tiktok.com -site:t.co -site:x.com -site:reddit.com "citizen" +"safetywing"` | 0 | 3 | 0% | 13.3 |
| `mdac website` | 0 | 2 | 0% | 41.5 |
| `how to fill out vietnam visa application form` | 0 | 2 | 0% | 57.5 |
| `sg arrival card how to fill` | 0 | 2 | 0% | 59.5 |
| `e-visa vietnam` | 0 | 2 | 0% | 77.0 |
| `马来西亚入境卡` | 0 | 1 | 0% | 3.0 |

### 近 28 天页面

GSC 当前表格可见前 10 行，共 15 行。

| URL | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `/singapore/how-to-fill/` | 1 | 210 | 0.5% | 7.4 |
| `/vietnam/evisa/` | 0 | 187 | 0% | 107.1 |
| `/malaysia/mdac/` | 0 | 67 | 0% | 12.4 |
| `/vietnam/how-to-fill/` | 0 | 54 | 0% | 13.9 |
| `/zh/singapore/how-to-fill/` | 0 | 22 | 0% | 8.8 |
| `/` | 0 | 9 | 0% | 4.1 |
| `/zh/malaysia/mdac/` | 0 | 5 | 0% | 5.0 |
| `/zh/vietnam/evisa/` | 0 | 5 | 0% | 8.4 |
| `/decide/` | 0 | 5 | 0% | 12.0 |
| `/thailand/tdac/` | 0 | 4 | 0% | 9.3 |

### 近 28 天国家 / 地区

GSC 当前表格可见前 10 行，共 52 行。

| 国家 / 地区 | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| 马来西亚 | 1 | 10 | 10% | 7.6 |
| 美国 | 0 | 250 | 0% | 68.8 |
| 新加坡 | 0 | 43 | 0% | 9.1 |
| 印度 | 0 | 30 | 0% | 8.5 |
| 越南 | 0 | 25 | 0% | 82.3 |
| 韩国 | 0 | 15 | 0% | 15.7 |
| 澳大利亚 | 0 | 14 | 0% | 17.7 |
| 印度尼西亚 | 0 | 13 | 0% | 7.1 |
| 中国香港 | 0 | 12 | 0% | 7.3 |
| 英国 | 0 | 12 | 0% | 34.8 |

### 近 28 天设备

| 设备 | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| 移动设备 | 1 | 183 | 0.5% | 76.6 |
| 桌面 | 0 | 380 | 0% | 25.0 |
| 平板电脑 | 0 | 1 | 0% | 9.0 |

## Query 到页面映射

本节用于判断具体查询应该优化哪一页。

| Query | 展示 | 平均排名 | 对应页面 | 判断 |
|---|---:|---:|---|---|
| `arrival card` | 3 | 5.3 | GSC 页面维度未正常切换出 URL；当前仅样本 3 | 暂不单独改，样本太小 |
| `how to fill sgac form` | 5 | 8.2 | `/singapore/how-to-fill/` | 已在 2026-05-18 改过 title/description，等待数据 |
| `evisa vietnam` | 171 | 114.7 | `/vietnam/evisa/` | 曝光高但排名太低，主要是权重问题 |
| `mdac website` | 2 | 41.5 | GSC 页面表格加载未完成；应为 `/malaysia/mdac/` | 样本太小，等待 2026-05-18 修改生效 |
| `how to fill out vietnam visa application form` | 2 | 57.5 | GSC 页面表格加载未完成；应为 `/vietnam/how-to-fill/` | 下一轮可优化此页标题与开头 |

## 索引、站点地图、增强功能

### 网页索引编制

GSC 索引报告更新时间：`2026-05-15`

| 状态 | 数量 | 说明 |
|---|---:|---|
| 已编入索引 | 14 | 可显示在 Google |
| 未编入索引 | 57 | 共 2 个主要原因 |
| 网页会自动重定向 | 3 | 来源：网站；验证未启动 |
| 已发现 - 尚未编入索引 | 54 | 来源：Google 系统；验证已开始，开始日期 `2026-05-04` |
| 已抓取 - 尚未编入索引 | 0 | 当前不是主要问题 |

判断：站点地图和页面技术结构正常，问题更像新站抓取优先级不足。

### 站点地图

| Sitemap | 类型 | 提交日期 | 上次读取 | 状态 | 已发现网页 | 视频 |
|---|---|---|---|---|---:|---:|
| `https://entrycardguide.com/zh/sitemap.xml` | 站点地图 | 2026-04-27 | 2026-05-14 | 成功 | 34 | 0 |
| `https://entrycardguide.com/sitemap.xml` | 站点地图索引 | 2026-04-27 | 2026-05-18 | 成功 | 68 | 0 |

判断：sitemap 不是当前问题。

### 链接

| 链接类型 | 数量 |
|---|---:|
| 外部链接 | 0 |
| 内部链接 | 21 |

GSC 显示的内部链接目标：

| URL | 内部链接数 |
|---|---:|
| `/malaysia/mdac/` | 3 |
| `/zh/decide/` | 3 |
| `/` | 2 |
| `/singapore/how-to-fill/` | 2 |
| `/vietnam/evisa/` | 2 |
| `/vietnam/how-to-fill/` | 2 |
| `/zh/malaysia/mdac/` | 2 |
| `/zh/singapore/how-to-fill/` | 2 |
| `/zh/vietnam/evisa/` | 2 |
| `/zh/` | 1 |

判断：外部链接为 `0` 是当前最大权重瓶颈。内部链接数量也偏少，尤其是国家枢纽页、官方目录页和首页可以给重点页面更多上下文链接。

### 增强功能

| 报告 | 状态 |
|---|---|
| Breadcrumbs / 路径 | 有效网页 10，无效 0，上次更新 `2026-05-17` |
| FAQ | 之前读取为有效网页 6，无效 0；GSC 同时提示 FAQ 富媒体结果将从 2026-05-07 起不再显示，报告 2026 年 6 月移除 |
| HTTPS | 之前读取为 HTTPS 网址 12，非 HTTPS 0 |
| Core Web Vitals | 移动和桌面都没有足够 CrUX 使用数据 |
| 搜索结果呈现 | 无数据 |

## 分析

### 1. 昨天的 snippet 改动还不能评价

`b3deb15` 在 `2026-05-18` 发布，并已请求 3 个重点 URL 重新编入索引。GSC 当前最新数据也到 `2026-05-18`，因此这次跟踪数据大多仍反映修改前或修改刚发布时的状态。

建议评估日期：

- 第一次观察：`2026-05-22` 到 `2026-05-24`
- 更可靠观察：`2026-05-26` 以后，看近 7 天窗口

### 2. `/vietnam/evisa/` 是曝光最大但权重最弱的页面

`evisa vietnam` 近 28 天 `171` 展示，平均排名 `114.7`。页面本身已经有 title、description、FAQ、Breadcrumb、官方链接、诈骗站证据和 quick answer。继续微调页面文字的边际收益有限。

更直接的瓶颈：

- GSC 外部链接为 `0`
- 该页内部链接数只有 `2`
- 站点整体已编入索引 URL 只有 `14`

### 3. `/singapore/how-to-fill/` 有排名基础，但 CTR 仍低

近 28 天：

- 展示 `210`
- 点击 `1`
- CTR `0.5%`
- 平均排名 `7.4`

这是当前唯一有点击的页面。昨天已经把标题改为 `How to Fill SGAC Form: Singapore Arrival Card Field Guide (2026)`，应该等待数据，不要今天再次改。

### 4. `/vietnam/how-to-fill/` 是下一轮最清晰的内容优化对象

近 28 天：

- 展示 `54`
- 点击 `0`
- 平均排名 `13.9`

近 7 天：

- 展示 `34`
- 点击 `0`
- 平均排名 `17.9`

相关 query：

- `how to fill out vietnam visa application form`
- `how to fill out vietnam e visa`

当前页面标题是 `How to Fill the Vietnam E-Visa: Field-by-Field Guide (2026)`。它没有直接覆盖 `application form` 这一搜索说法。下一轮可以小改，不需要大改正文。

### 5. 索引问题仍然要跟踪，但不建议用大规模改页面解决

GSC 已读取 sitemap，且 sitemap 状态成功。未编入索引主要是“已发现 - 尚未编入索引”，不是“已抓取 - 尚未编入索引”。这通常说明 Google 还没分配足够抓取资源，而不是页面质量被明确拒绝。

更合适的处理：

- 继续请求重点 URL 索引，不要批量乱点所有 URL。
- 提高重点页的站内链接权重。
- 获取外部链接，尤其是能指向官方目录页和重点国家页的链接。

## 下一步修改建议

### P0：先等昨天发布的数据

不要今天再次修改：

- `/vietnam/evisa/`
- `/singapore/how-to-fill/`
- `/malaysia/mdac/`

原因：这 3 页刚发版并请求重新抓取。现在改会混淆 GSC 归因。

建议在 `2026-05-22` 以后复查：

- `evisa vietnam`
- `how to fill sgac form`
- `malaysia arrival card`
- `mdac website`

### P1：准备优化 `/vietnam/how-to-fill/`

建议小改范围：

- title：加入 `application form`
- description：覆盖 `Vietnam evisa application form`、`photo upload`、`passport scan`、`payment`、`common errors`
- kicker：明确这是填写官方申请表，不是普通入境卡
- 开头加 `Quick answer`

建议方向：

```text
How to Fill Out the Vietnam Evisa Application Form (2026)
```

理由：GSC 已出现 `how to fill out vietnam visa application form`，而页面平均排名在 13.9，有进入前 10 的基础。

### P1：补强内部链接

建议增加的站内链接，不改变设计系统：

- 首页正文或国家卡片附近增加“官方目录 / 国家指南 / 表单填写指南”的文字链接。
- `/official-links/` 为 Vietnam、Singapore、Malaysia 的重点页面加入更清楚的锚文本。
- 各国家 `_index.md` 里给主表页、how-to 页、iVisa 页更明确的说明链接。

目标：让 GSC 内部链接数从现在的 `21` 明显增加，优先给：

- `/vietnam/evisa/`
- `/vietnam/how-to-fill/`
- `/singapore/how-to-fill/`
- `/malaysia/mdac/`
- `/official-links/`

### P1：做外链，不只是改站内页面

GSC 外部链接为 `0`。这是最值得让其他人评估和执行的事项。

建议外链入口：

- 旅行论坛回答：主题围绕 `Vietnam evisa official site`、`SGAC form`、`Malaysia MDAC official website`
- Reddit / TripAdvisor / FlyerTalk 等回答真实问题，链接到官方目录页或具体指南页
- Hacker News / Show HN 发布时，首链建议指向首页或 `/official-links/`
- Quora 问答：优先回答 `Is iVisa official?`、`Where is the official Vietnam evisa site?`

锚文本建议：

- `Vietnam evisa official site`
- `Singapore Arrival Card SGAC official ICA form`
- `Malaysia MDAC official website`
- `official entry card links`

### P2：等索引报告刷新后再决定是否处理未索引页面

现在索引报告更新时间仍是 `2026-05-15`。昨天的请求不会马上体现在这个报告里。

建议下一次复查：

- 索引报告日期是否从 `2026-05-15` 更新
- `已发现 - 尚未编入索引` 是否从 `54` 下降
- 已编入索引是否从 `14` 增加

如果 7 天后仍无变化，再考虑：

- 对首页、官方目录页、国家枢纽页做更强内链
- 对 5 个重点 URL 再做 URL Inspection
- 用 Search Console sitemap 手动重新提交根 sitemap

## 建议给评估者的问题

可以把这份文档发给 SEO / 内容 / 增长同事，让他们重点判断：

1. 现在是否应该优先做外链，而不是继续改标题？
2. `/vietnam/how-to-fill/` 是否值得下一轮改 title 来覆盖 `application form`？
3. `/official-links/` 是否应该被当作外链落地页，而不是只推具体国家页？
4. 是否要做一批轻量论坛/问答外链，先验证 Google 抓取和排名反馈？
5. 对 54 个“已发现 - 尚未编入索引”页面，是否有必要现在处理，还是先等 2026-05-22 后再看？

