# GSC + GA4 跟踪报告：2026-08-08

记录时间：2026-08-08 CST
站点：`https://entrycardguide.com/`
数据来源：
- Google Search Console，属性 `sc-domain:entrycardguide.com`（账号 `l363758470@gmail.com`，Chrome `authuser=1`）
- GA4 property `p536218791`（account `a165829930` / forOasis，Measurement ID `G-8C2Q42N506`，同 `authuser=1`）

窗口：GSC 近 3 个月（2026-05-06 – 2026-08-05，更新滞后 5 小时）；GA4 近 28 天（2026-07-11 – 2026-08-07）
上一份报告：`gsc-ga-follow-up-2026-07-23.md`

## 摘要

- **上轮接入 Bing 的动作生效了，而且超出预期。** `cn.bing.com/referral` 93 会话 + `bing/organic` 45 会话 = 138 会话，是 `google/organic`（66）的 2.1 倍。上轮 `bing/organic` 只有 1 个用户。近 7 天 Bing 系环比 +107% 到 +209%。
- **Copilot 渠道从 0 起步**：`copilot.com` 合计 4 会话。上轮 BWT AI Performance 的 Citations 基线是 0。
- **ChatGPT 仍是最大单一来源**：860 会话（43.6%），28 天口径较上轮的 218 会话涨约 4 倍。
- **GSC 三个月全面增长**：点击 73 → 119，曝光 8,780 → 12,200，平均排名 25.2 → 22.6，索引 100 → 156 页。
- **外链仍然是 0。** 三次复盘、三个月，一个都没有。这是主表页排在 32–88 位的根因。
- **`affiliate_click` 判断需要修正**：上轮说「代码已修好，只剩 GA4 后台标记关键事件」。实测 GA4 近 28 天只记录了 6 个事件（`click`、`first_visit`、`page_view`、`scroll`、`session_start`、`user_engagement`），`affiliate_click` **一次都没发生过**。追踪链路经核对是通的，所以结论是：1,974 个会话里，SafetyWing 页脚链接的真实点击是 0。
- **全站 30.8% 的会话是 headless 爬虫，已确认。** `(direct)` × `Singapore` × `1280x1200` 这一组合有 556–561 个会话，互动率 0%、时长 0 秒、每会话固定 3.01 个事件。加上另外两批小量，合计约 610 会话。真实会话数约 1,373 而不是 1,983。**下面所有 GA4 数字都是未剔除爬虫的原始值**，读的时候要按这个折扣理解——尤其是 Direct 渠道和各页面的平均互动时长。

## 一、本轮取数方式（与上轮不同）

上轮是用 Chrome 登录态逐屏读 GSC/GA4 界面。本轮验证了这条路走不通：GSC 的 Material 组件（分页下拉、维度 tab）对程序化点击基本免疫，翻 750 行查询需要 75 次翻页。

改用 **GSC 自带的「导出 → 下载 CSV」**，一次拿到 5 张完整表：

| 文件 | 行数 |
|---|---:|
| 查询数 | 750 |
| 网页 | 148 |
| 国家/地区 | 156 |
| 设备 | 3 |
| 图表（按天） | 92 |

CSV 的中文文件名在 macOS `unzip` 下会报 `Illegal byte sequence`，需要用 Python `zipfile` 按 cp437→utf-8 重解码文件名。

GA4 没有等价的一键全量导出，仍是界面读取，但 GA4 的分页按钮可以用元素引用点击（GSC 的不行）。

**GSC 的固有限制**：查询表 750 行只覆盖 3,159 次曝光 / 3 次点击，而全站是 12,200 曝光 / 119 点击。低频查询被 Google 匿名化了，覆盖率约 26%。这个限制 API 也绕不过，不是取数方式的问题。

## 二、GSC 效果数据

### 汇总（近 3 个月）

| 指标 | 本轮 | 上轮 7/23 | 变化 |
|---|---:|---:|---|
| 点击 | 119 | 73 | +63% |
| 曝光 | 12,200 | 8,780 | +39% |
| CTR | 1.0% | 0.8% | +0.2pp |
| 平均排名 | 22.6 | 25.2 | 前进 2.6 位 |

窗口是滚动的，两次有重叠，增幅里含窗口滑动的贡献。按周看更干净：

| 周起 | 点击 | 曝光 | CTR |
|---|---:|---:|---:|
| 2026-06-29 | 9 | 1,106 | 0.81% |
| 2026-07-06 | 7 | 1,278 | 0.55% |
| 2026-07-13 | 17 | 1,761 | 0.97% |
| 2026-07-20 | 23 | 1,382 | 1.66% |
| 2026-07-27 | 22 | 1,622 | 1.36% |
| 2026-08-03（仅 3 天） | 7 | 797 | 0.88% |

7/23 改了 6 个 how-to-fill 页的标题（`d12b36e`）。改后两周 CTR 是 1.66% / 1.36%，明显高于改前的 0.55%–0.97%。但 8/03 周回落到 0.88%，样本量小，还不能断定改标题的效果稳定。

### 三类页面，三种病

**A. 卡在第 3–9 页的主表页**（曝光 ≥100 且排名 >30，合计 3,170 曝光、3 点击）

| 页面 | 曝光 | 点击 | 排名 |
|---|---:|---:|---:|
| `/indonesia/e-cd/` | 1,358 | 2 | 32.4 |
| `/vietnam/evisa/` | 728 | 1 | 88.3 |
| `/dominican/eticket/` | 372 | 0 | 46.4 |
| `/mexico/` | 242 | 0 | 57.6 |
| `/dominican/` | 150 | 0 | 40.7 |
| `/malaysia/mdac/` | 111 | 0 | 45.3 |
| `/indonesia/` | 109 | 0 | 51.7 |
| `/mexico/fmm/` | 100 | 0 | 56.4 |

改标题救不了排名 30–88。这批打的是 `ecd indonesia`、`mdac`、`fmm`、`sgac`、`evisa vietnam` 这类头部词，需要域名权重。

**B. 已在第 1 页但 CTR 低**（排名 ≤12 且曝光 ≥100）

| 页面 | 曝光 | 点击 | CTR | 排名 |
|---|---:|---:|---:|---:|
| `/singapore/how-to-fill/` | 1,700 | 19 | 1.12% | 9.1 |
| `/malaysia/how-to-fill/` | 819 | 19 | 2.32% | 10.5 |
| `/indonesia/how-to-fill/` | 792 | 4 | 0.51% | 11.2 |
| `/thailand/how-to-fill/` | 586 | 7 | 1.19% | 10.8 |
| `/dominican/how-to-fill/` | 310 | 1 | 0.32% | 9.9 |
| `/zh/mexico/fmm/` | 203 | 10 | 4.93% | 9.0 |
| `/uk/how-to-fill/` | 157 | 4 | 2.55% | 7.8 |
| `/mexico/how-to-fill/` | 146 | 1 | 0.68% | 9.5 |
| `/canada/how-to-fill/` | 127 | 3 | 2.36% | 9.0 |

`/dominican/how-to-fill/` 排名 9.9 却只有 0.32% CTR，`/indonesia/how-to-fill/` 排名 11.2 只有 0.51%。同样在第 1 页，`/zh/mexico/fmm/` 能做到 4.93%。差距在标题和摘要。

**C. 排名极好但没需求**（排名 ≤10 且曝光 <60，共 44 页，合计只有 307 曝光）

`/canada/` pos 2.0（1 曝光）、`/zh/canada/` pos 3.62（8 曝光）、`/trust/` pos 4.33（3 曝光）、`/zh/uk/is-ivisa-official/` pos 4.0（2 曝光）。

内容写了，Google 也认，但没人搜。这批页面是沉没成本，不值得再投入。

### 中英文分化

| 语言 | 页面数 | 点击 | 曝光 | CTR |
|---|---:|---:|---:|---:|
| EN | 75 | 82 | 11,097 | 0.74% |
| ZH | 73 | 37 | 1,292 | **2.86%** |

中文页 CTR 是英文的 3.9 倍，但曝光只有英文的 1/8.6。页面数几乎相同。

高 CTR 的中文页：`/zh/malaysia/is-ivisa-official/` 33.3%、`/zh/korea/is-ivisa-official/` 21.1%、`/zh/cambodia/how-to-fill/` 14.3%、`/zh/dominican/how-to-fill/` 11.5%。

### 设备

| 设备 | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| 桌面 | 61 | 8,302 | 0.73% | 24.0 |
| 移动设备 | 58 | 3,800 | 1.53% | 19.6 |
| 平板 | 0 | 72 | 0% | 6.9 |

桌面曝光是移动的 2.2 倍，CTR 只有一半。

### 国家（按点击前 9）

| 地区 | 点击 | 曝光 | CTR | 排名 |
|---|---:|---:|---:|---:|
| 美国 | 19 | 3,577 | 0.53% | 33.4 |
| 中国香港 | 10 | 356 | 2.81% | 13.8 |
| 台湾 | 10 | 315 | 3.17% | 16.3 |
| 中国 | 9 | 159 | 5.66% | 10.2 |
| 印度 | 8 | 535 | 1.50% | 13.3 |
| 德国 | 8 | 335 | 2.39% | 17.8 |
| 马来西亚 | 7 | 302 | 2.32% | 14.5 |
| 新加坡 | 5 | 622 | 0.80% | 16.6 |
| 澳大利亚 | 5 | 594 | 0.84% | 17.9 |

美国占全站曝光 29%，排名最差（33.4）、CTR 最低（0.53%）。华语区 CTR 2.8%–5.7%。

### 索引与链接

| 项 | 本轮 | 上轮 |
|---|---:|---:|
| 已编入索引 | 156 | 100 |
| 未编入索引 | 8 | 8 |
| **外部链接** | **0** | **0** |
| 内部链接 | 2,852 | 596 |

未编入的 8 页：7 个「网页会自动重定向」+ 1 个 404。需要查那个 404 是什么。

## 三、「报错型」长尾查询

> **2026-08-09 更正：这一节最初的结论是错的，下面的建议已作废。**
> 原文从「排名 9–13 且零点击」推断出「站点缺内容」和「标题摘要接不住」，但没有实际查看 SERP。
> 补做三次验证后，两个前提都不成立，见本节末尾的「更正」。表格本身是原始数据，予以保留。

从 750 行查询里筛出排名 ≤10 且零点击的 116 个词（合计 286 曝光），其中一批是**用户带着表单的具体报错和字段格式问题来搜**：

| Query | 曝光 | 排名 |
|---|---:|---:|
| `vietnam evisa identity card field` | 25 | 9.7 |
| `indonesia passport number format` | 14 | 10.0 |
| `tdac occupation field only letters allowed` | 14 | 10.7 |
| `when the e ticket asks for passport number do iput thebletters too` | 14 | 11.1 |
| `indonesia passport number example` | 7 | 12.1 |
| `sgac error code 20260625003841982front056` | 6 | 13.5 |
| `indonesian passport number format` | 6 | 10.5 |
| `full contact or residential address in new zealand` | 5 | 11.0 |
| `tdac occupation field only letters a-z` | 4 | 10.5 |
| `access by kai passport id field nomor paspor` | 3 | 6.7 |
| `please fill in the required fields not entered of declarant01` | 3 | 9.0 |
| `印尼護照號碼格式` | 3 | 15.7 |

`sgac error code 20260625003841982front056` 和 `please fill in the required fields not entered of declarant01` 是把官方表单的报错原文直接粘进 Google。这类词竞争极低（站点已经排 9–13 位，没有任何针对性优化），但没有页面专门回答。

还有一类导航型查询：`www.e-arrivalcard.go.kr🇰🇷`（7 曝光 pos 8.9）、`www.e-arrivalcard.go.kr/portal/main/index.do`（4 曝光 pos 8.8）、`mdac 官网`（5 曝光 pos 9.6）——用户在搜官方 URL 本身。

以及 `ivisa korea`（5，pos 9.2）、`ivisa philippines`（5，pos 9.6）、`ivisa cambodia`（3，pos 7.3）、`ivisa dominican republic`（3，pos 11.3）、`singapore ivisa`（2，pos 11.0）：`is-ivisa-official` 页在接这些词，排名不错但 0 点击。

### 更正（2026-08-09）：上面的推断经不起 SERP 检验

挑三个代表词实际去 Google 搜了一遍：

| 查询 | GSC 记录 | 实际 SERP |
|---|---|---|
| `indonesia passport number format` | 14 曝光 pos 10.0 | 前 20 名内没有本站。结果是 Microsoft Learn 的数据分类定义、Wikipedia 护照条目、Passport Index——**该词问的是印尼护照号本身的格式，不是怎么填表**，搜的人不是本站用户 |
| `full contact or residential address in new zealand` | 5 曝光 pos 11.0 | **第 7 位**，摘要精准抓到 field card：「use the first address. Looks good. Hotel Britomart, Auckland.」 |
| 多米尼加 e-ticket 护照号带不带字母 | 14 曝光 pos 11.1 | **第 2 位**，仅次于官方 MITUR，摘要「Format: letters and digits, 6 to 12 characters. No spaces or dashes. Do not use the MRZ.」 |

两个错误：

1. **「缺内容」不成立。** 「表单报错」类目早就存在——`layouts/_default/how-to-fill.html:162-179` 就是 Error decoder 段落，`[[errors]]` 数据结构带 `code`/`why_en`/`why_zh`，且 GSC 里有需求的 6 个国家（印尼 5、泰国 7、越南 7、多米尼加 6、新加坡 7、马来 7 条）全都已经有数据。写报告时没去看模板。

2. **「零点击 = CTR 有问题」是把噪声当信号。** 116 个词分摊 286 次曝光，平均每词 2.5 次。pos 7 的期望 CTR 约 3–5%，5 次曝光的期望点击是 0.2 次——观测到 0 是正常结果。在意图匹配的词上，内容、摘要、位置都已接近最优，没有可修的东西。

真正卡住的是排名，而挡在前面的是官方站（`travellerdeclaration.govt.nz`、MITUR）、论坛（Cruise Critic、Facebook）和中介内容农场（`tropicalevasion.com`、`nowinpuntacana.com` 等）。这把结论推回外链，也就是本报告的另一条 P0。

**唯一幸存的线索**是「缺字段」而非「缺呈现」：`data/rules/thailand.json` 的 8 个字段里确实没有 `occupation`，而 TDAC 官方表单有这个字段（2026-08-09 在中介站的表单副本上确认）。`data/rules/vietnam.json` 也没有身份证字段。这两处是真空白，但合计曝光仅 47，优先级低于外链。

## 四、GA4 数据（近 28 天，7/11–8/7）

### 渠道

| 渠道 | 会话 | 占比 | 互动率 | 平均互动 | 事件 |
|---|---:|---:|---:|---:|---:|
| 总计 | 1,974 | 100% | 26.7% | 16 秒 | 7,157 |
| AI Assistant | 864 | 43.8% | 39.8% | 20 秒 | 3,359 |
| Direct | 857 | 43.4% | **8.2%** | **7 秒** | 2,792 |
| Organic Search | 219 | 11.1% | **50.7%** | **33 秒** | 867 |
| Unassigned | 52 | 2.6% | 5.8% | 20 秒 | 83 |
| Cross-network | 15 | 0.8% | 0% | 9 秒 | 56 |

Organic Search 的质量最高（50.7% 互动率、33 秒），AI Assistant 次之（39.8%、20 秒）。

Direct 的 8.2% / 7 秒不是真实用户行为——这一格里混着 556 个爬虫会话，见第五节。剔除后 Direct 剩约 270 个真实会话，占全站真实流量的 20% 左右。

### 来源/媒介（22 行全量）

| 来源 / 媒介 | 会话 | 互动率 | 平均互动 |
|---|---:|---:|---:|
| chatgpt.com / ai-assistant | 860 | 39.8% | 20 秒 |
| (direct) / (none) | 857 | 8.2% | 7 秒 |
| **cn.bing.com / referral** | **93** | 47.3% | 34 秒 |
| google / organic | 66 | 60.6% | 41 秒 |
| **bing / organic** | **45** | 40.0% | 18 秒 |
| (not set) | 43 | 0% | 17 秒 |
| (data not available) | 15 | 0% | 9 秒 |
| chatgpt.com / (none) | 6 | 33.3% | 38 秒 |
| m.sogou.com / referral | 5 | 20.0% | 4 秒 |
| au.search.yahoo.com / referral | 2 | 100% | 1 分 17 秒 |
| claude.ai / ai-assistant | 2 | 0% | 0 秒 |
| **copilot.com / ai-assistant** | **2** | 100% | 22 秒 |
| hk.search.yahoo.com / referral | 2 | 100% | 36 秒 |
| copilot.com /（无媒介） | 1 | 0% | 0 秒 |
| copilot.com / (not set) | 1 | 0% | 4 秒 |
| duckduckgo / organic | 1 | 100% | 3 分 21 秒 |
| in.search.yahoo.com / referral | 1 | 0% | 0 秒 |
| openai / (not set) | 1 | 100% | 1 分 24 秒 |
| openai / organic | 1 | 0% | 1 秒 |
| tw.search.yahoo.com / referral | 1 | 100% | 34 秒 |
| uk.search.yahoo.com / referral | 1 | 100% | 13 秒 |
| yahoo / organic | 1 | 100% | 14 秒 |

没有 perplexity、没有 gemini。

近 7 天（8/1–8/7）环比上一周期：`cn.bing.com` +84.8%、`bing/organic` +209.1%、`chatgpt.com` +7.4%、`google/organic` +5.0%。Bing 系是当前增长最快的渠道。

### 着陆页（前 10，共 111 个）

| 着陆页 | 会话 | 平均互动 |
|---|---:|---:|
| `/indonesia/e-cd` | 524 | 23 秒 |
| `/malaysia/mdac` | 346 | 18 秒 |
| `/` | 62 | 25 秒 |
| `/zh/thailand/tdac` | 59 | 33 秒 |
| (not set) | 58 | 9 秒 |
| `/singapore/how-to-fill` | 44 | 17 秒 |
| `/malaysia/how-to-fill` | 41 | **3 秒** |
| `/zh/thailand/how-to-fill` | 32 | 14 秒 |
| `/indonesia/how-to-fill` | 27 | **5 秒** |
| `/vietnam/how-to-fill` | 26 | 22 秒 |

两个页面吃掉 44% 会话，比上轮的 89% 集中度已经下降。韩国、泰国、墨西哥、越南的中文页都开始有量（`/zh/thailand/tdac` 59 会话 33 秒是新面孔）。

一批页面的互动时长低到不正常（`/korea/how-to-fill` 20 会话 **0 秒**、`/malaysia` 13 会话 **0 秒**、`/zh/korea/how-to-fill` 14 会话 **1 秒**、`/zh/mexico` 15 会话 **2 秒**）——这是爬虫把均值拉平的结果，不是内容问题。第五节有拆解。

### 关键事件：0

GA4 近 28 天记录的事件只有 6 个，全部是增强型衡量的自动事件：

`click`、`first_visit`、`page_view`、`scroll`、`session_start`、`user_engagement`

**`affiliate_click` 不在列表里，说明它一次都没被触发。**

追踪链路已逐项核对，是通的：

- `layouts/partials/scripts.html:31` 正常输出 `analytics.js` 并带 `data-ga4-measurement-id`
- 线上 `/indonesia/e-cd/` 确认加载了 `https://www.googletagmanager.com/gtag/js?id=G-8C2Q42N506` 和 `analytics.a857152e….js`
- `static/_headers` 的 CSP 在 `script-src`、`connect-src` 里都放行了 googletagmanager 和 google-analytics
- 线上 HTML 里 `data-analytics-event="affiliate_click"` 属性存在
- `assets/js/analytics.ts:42` 的全局 click 监听和 `trackAffiliateClick` 逻辑完整

所以这不是配置问题。**1,974 个会话，SafetyWing 页脚链接的真实点击数是 0。**

另外 `config.toml` 里 `airalo_url = ""` 是空的，页脚实际只有 SafetyWing 一个位。

## 五、已确认：Direct 流量的 65% 是 headless 爬虫

用次级维度交叉验证过了，三个维度指向同一批会话：

| 交叉维度 | 值 | 会话 | 互动率 | 平均互动 | 事件/会话 |
|---|---|---:|---:|---:|---:|
| 来源 × 屏幕分辨率 | `(direct)` × `1280x1200` | 556 | 0% | 0 秒 | 3.01 |
| 来源 × 城市 | `(direct)` × `Singapore` | 561 | 0.36% | 0 秒 | 3.01 |
| 来源 × 浏览器 | `(direct)` × `Chrome` | 788 | 7.61% | 3 秒 | 3.23 |

556 / 561 / 3.01 三个数字互相咬合，是同一批流量。

**判定依据：**

1. `1280x1200` 不对应任何真实设备。常见的 1280 系是 1280×1024、1280×800、1280×720。1280×1200 是 headless Chrome 的默认视口变体。
2. 同一张表里，真实流量的分辨率是分散的：ChatGPT 流量集中在 `440x956`、`402x874`、`393x852`、`430x932`、`390x844`——全是 iPhone 各机型的真实 CSS 视口，互动率 36%–49%，时长 15–23 秒。
3. 同样是 Chrome，`google/organic` 的互动率是 60.71% / 39 秒，`(direct)` 的是 7.61% / 3 秒。
4. 同样是 Direct，中国城市的是真人（Guangzhou 52 会话 42.31% / 15 秒，Shenzhen 14 会话 50% / 16 秒），只有 Singapore 那批是 0 秒。
5. 每会话固定 3.01 个事件（`session_start` + `page_view` + `user_engagement`），是脚本化的固定序列，不是人的行为。
6. 它执行 JavaScript——否则 gtag.js 不会上报。所以是 headless 浏览器，不是普通 HTTP 爬虫。
7. 着陆页维度共 219 行，Direct 的最大单项只有 62 会话（首页）。这 556 个会话分散在大量页面上，是**按 sitemap 全站爬取**的特征，不是盯着某几页的监控服务。

另外两批小量可疑流量：`(direct)` × `800x600` 29 会话（6.9% / 1 秒，800×600 是另一个经典爬虫默认值）、`(direct)` × `Android Webview` 25 会话（0% / 0 秒）。

**合计约 610 个会话是非人类，占全站 1,983 会话的 30.8%，占 Direct 857 会话的 71%。**

### 这解释了第四节的低互动时长

之前记为异常的那些页面，拆开就清楚了。以 `/malaysia/how-to-fill/` 为例：

| 切片 | 会话 | 互动率 | 平均互动 |
|---|---:|---:|---:|
| 全部 | 41 | — | 3 秒 |
| 其中 `(direct)` 那批 | 24 | 4.17% | **0 秒** |
| 推算的真实用户 | ~17 | — | 约 7 秒 |

`/korea/how-to-fill` 0 秒、`/malaysia` 0 秒、`/zh/korea/how-to-fill` 1 秒，同理。这些页面不是内容有问题，是被爬虫的 0 秒把均值拉平了。

### 建议：在分析层处理，不要去拦截

这批爬虫**不影响 SEO、不影响真实用户、几乎不产生成本**（静态站 + Cloudflare CDN）。它唯一的危害是污染 GA4 指标。所以对策应该放在分析层：

- **可以做**：在 GA4 建一个比较对象（comparison），条件为「城市 不完全匹配 Singapore」或「屏幕分辨率 不完全匹配 1280x1200」，日常看报告时套用。零风险，立即生效，不改变数据收集。
- **可以做**：`scripts/fetch-search-data.mjs` 已加 `ga4-bot-signature.json`（来源 × 城市 × 分辨率），每次复盘能直接量到爬虫占比，不用再手动交叉。

**不建议开 Cloudflare Bot Fight Mode。** 站点 43% 的流量来自 ChatGPT，靠的是 OAI-SearchBot / GPTBot 能正常抓取。Bot Fight Mode 的拦截规则可能误伤这类爬虫，代价远大于省下的那点带宽。

**不建议在 `assets/js/analytics.ts` 里加分辨率判断跳过上报。** 把爬虫指纹硬编码进产品代码，既脆弱（对方改个视口就失效）又会误伤真实用户，属于用错误的层解决问题。

## 六、上轮行动清单的执行情况

| 上轮项目 | 状态 | 证据 |
|---|---|---|
| 确认没屏蔽 AI 爬虫 | 已完成 | `static/robots.txt` 是 `User-agent: * / Allow: /` |
| 改 6 个 how-to-fill 标题 | 已完成 | `d12b36e`；CTR 改后两周 1.66%/1.36% vs 改前 0.55%–0.97% |
| 接入 Bing Webmaster Tools | 已完成且见效 | Bing 系 138 会话，是 Google 的 2.1 倍 |
| IndexNow | 已完成 | `scripts/submit-indexnow.mjs`、`557d93d` |
| llms.txt | 已完成 | `f910a33` |
| 按流量重排 roster | 已完成 | `07d2af9` |
| **外链建设** | **未执行** | 外部链接仍为 0 |
| **GA4 标记 affiliate_click 为关键事件** | **无意义** | 事件从未发生，标记了也没有数据 |

## 七、优化清单

### P0：外链——已经拖了三个月，是唯一的硬瓶颈

3,170 次曝光卡在排名 30–88，全在主表页。这批词（`ecd indonesia` 93 曝光 pos 40.7、`mdac` 53 曝光 pos 62.2、`fmm` 42 曝光 pos 65.0、`sgac` 41 曝光 pos 61.7、`evisa vietnam` 520 曝光 pos 110.1）改标题、加内链都没用，只能靠域名权重。

`docs/tasks/09-quora-outreach.md`、`docs/tasks/10-backlink-recon.md` 两份任务书三个月没动。建议本轮只挑一个渠道跑通，不要铺开：Reddit 的 r/indonesia、r/bali、r/malaysia、r/VietNam 里有大量「e-CD 怎么填」「MDAC 官网是哪个」的真实提问，回答后链到对应的 how-to-fill 页。锚文本用 `official Indonesia e-CD site`、`Malaysia MDAC official website`。

### ~~P0：新建「表单报错」内容类目~~ —— 已作废（2026-08-09）

原建议基于两个错误前提（类目不存在、CTR 有问题），SERP 验证后都不成立，详见第三节末尾的更正。**不要执行。**

从这条作废建议里剩下的，只有两个真实的字段空白，降级为 P2：

- `data/rules/thailand.json` 没有 `occupation` 字段，而 TDAC 官方表单有（`tdac occupation field only letters allowed` / `a-z` / `free type field`，合计 22 曝光）
- `data/rules/vietnam.json` 没有身份证字段（`vietnam evisa identity card field`，25 曝光 pos 9.7）

合计 47 曝光。补之前必须先拿到官方表单的真实约束——这个站不编造字段规则。

### P1：修 5 个第 1 页页面的标题与摘要

**先做一次 SERP 抽查再动手。** 作废的 P0 就栽在这上面。这里的样本量大得多（曝光 146–1,700，不是每词 2.5 次），CTR 从 0.32% 到 4.93% 的差距也不像噪声，但同样没有验证过 Google 实际展示成什么样。花 10 分钟搜三五个词，确认摘要确实抓错了段落，再改 front matter。

按「曝光 × CTR 差距」排序，只改 `content/{country}/how-to-fill.md` 的 front matter：

| 页面 | 曝光 | 当前 CTR | 参照 |
|---|---:|---:|---|
| `/indonesia/how-to-fill/` | 792 | 0.51% | 同为第 1 页的 `/zh/mexico/fmm/` 是 4.93% |
| `/dominican/how-to-fill/` | 310 | 0.32% | 排名 9.9，CTR 却最低 |
| `/singapore/how-to-fill/` | 1,700 | 1.12% | 站内曝光第一，1pp 提升 = +17 点击 |
| `/mexico/how-to-fill/` | 146 | 0.68% | — |
| `/thailand/how-to-fill/` | 586 | 1.19% | — |

7/23 已经改过一轮，这次改的是上轮没覆盖或改后仍偏低的。

### P1：给 GA4 建一个排除爬虫的比较对象

爬虫已经确认（第五节），剩下的是让日常看报告时自动扣掉。在 GA4 报告页点「添加比较对象」，
条件设为「屏幕分辨率 不完全匹配 `1280x1200`」，保存后每次看报告套用。

这只影响报告展示，不改变数据收集，可随时撤销。不要去改数据流设置或加 Cloudflare 拦截规则，
理由见第五节。

### P2：中文页扩量，不是英文页

中文页 CTR 2.86%，英文页 0.74%，页面数几乎相同（73 vs 75），但中文曝光只有英文的 1/8.6。

中文侧的问题是曝光不足而非转化不足。可考虑：`cn.bing.com` 已经贡献 93 会话，说明中文用户走必应的比例高；在必应站长工具里单独看中文页的表现，比在 GSC 里看更有代表性。

### P2：放弃 C 类页面

44 个排名 ≤10 但曝光 <60 的页面（合计 307 曝光）不值得再投入。土耳其、澳大利亚、加拿大的多数页面属于这一类。

### 不建议做的

- **不要为了 affiliate 收入改版页脚。** 1,974 会话 0 点击，问题不在展示位而在流量意图——用户是来核对官方 URL 的，20 秒就走。`docs/reports/affiliate-placement-2026-07-23.md` 已经分析过展示位，再调位置不会改变意图。
- **不要重写 16 个主表页。** 上轮已排除「内容不够好」这个解释，本轮数据（同批上线、篇幅更长的 `vietnam/evisa` 仍排 88）继续支持这个结论。

## 八、下次复查要看的指标

- Bing 系（`cn.bing.com` + `bing/organic`）是否继续保持三位数增长率，会不会超过 ChatGPT
- 外链是否从 0 起步——这是唯一能判断 P0 有没有执行的指标
- ~~表单报错类页面上线后，那批 pos 9–13 的词是否开始有点击~~ —— 该建议已作废，不必跟踪
- `1280x1200` 那批爬虫是否还在，占比是否变化（`ga4-bot-signature.json` 直接能看）
- `copilot.com` 会话是否从个位数起量
- 剔除爬虫后，`/malaysia/how-to-fill`、`/indonesia/how-to-fill` 的真实互动时长基线是多少——本轮只推算出前者约 7 秒，需要用比较对象量准
