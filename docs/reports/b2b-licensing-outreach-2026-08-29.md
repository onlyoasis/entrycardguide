# B2B 数据授权：目标名单、询价话术与前置条件

记录时间：2026-08-29
输入：本轮 `data/` 目录实测盘点、`docs/reports/monetization-model-2026-07-23.md`、`gsc-ga-follow-up-2026-08-08.md`、`content/about.md`
状态：**待执行**。本文的目标不是成交，是**用最低成本证伪「B2B 愿不愿付费」**——这个问题至今一次都没验证过。

## 一、可卖的东西到底是什么（本轮实测，非引用旧报告）

| 资产 | 实测数量 | 出处 |
|---|---:|---|
| 覆盖国家 | **18** | `data/official_urls/*.toml` |
| 官方 URL 条目 | **38**，全部带 `agency` + `last_verified` | 同上 |
| 其中带 Wayback 快照 | **22** | `archive_url` 字段 |
| 机器可读字段规则 | **179**（18 国全覆盖） | `data/rules/*.json` |
| 双语字段填写卡 | **158** | `data/fields/*.toml` |
| 官方报错文案解码 | **63** | `[[errors]]` |
| 变更日志 | **18 国** | `data/changelog/*.toml` |
| 费用 + 表单类型分类 | **18/18 全覆盖**（12 arrival_card / 4 travel_authorization / 2 evisa） | `[meta]` |
| 中介/仿冒域名证据 | **37**（站点不再渲染，仅内部记录） | `[[scam_sites]]` |

**7 月报告说的「Australia 缺 rules/fields」已经补上，现在是 18/18 完整覆盖。**

字段规则的 schema 深度是这批数据真正值钱的地方，以 `data/rules/thailand.json` 的 passport 字段为例，单个字段带：`type`、`required`、`minLength`、`maxLength`、`pattern`（正则）、`placeholder`、`help`、以及 5 条分类错误文案。文件头带 `source`（含抓取日期）和 `lastVerified`。

这套东西的采购价值不在"信息"，在**可审计**：每条有日期戳、有来源 URL、构建时强制校验（找不到条目直接 `errorf` 中断构建）、全部走 git 版本化。B2B 买数据时的第一个问题就是"你怎么证明这是对的、什么时候更新的"，这三条正好是答案。

## 二、真正的杠杆：CC BY-SA 4.0 双许可

这是本轮最重要的发现，7 月报告写的时候 LICENSE 还不存在。

现状：代码 MIT，**数据和指南 CC BY-SA 4.0**（`content/about.md:26`、`:48` 已公开声明）。

CC BY-SA 是 copyleft。一家公司要把这 179 条字段规则嵌进自己的闭源产品，必须：

1. 署名来源，且
2. **把衍生的数据库以同样的 CC BY-SA 4.0 释出**。

第 2 条是绝大多数商业买家法务部门的红线。于是买家只剩两条路：不用，或者**向唯一版权人买一份免除 share-alike 的商业例外**。

这把整个对话的性质换掉了：

- 弱版本（7 月报告的隐含姿势）：「我们有一批数据，你要不要买？」——对方没有理由回信。
- 强版本（现在可以用的）：「这批数据你现在就能免费用，条款在这里；如果 share-alike 对你的产品不成立，我们有商业许可。」——对方要么用了要付钱，要么必须明确说"用不上"，两种回复都是你要的信息。

这是 Qt、MongoDB、OpenStreetMap 用了很多年的标准模式，不需要发明。**而且它不依赖流量——1,364 个真实会话和 100 万个会话对这条路的定价没有区别。**

## 三、前置条件（发信之前必须做完，否则外联当场失效）

### 3.1 `about.md` 有两句话会自我拆台

| 位置 | 原文 | 问题 |
|---|---|---|
| `content/about.md:58` | "That's it. That is the entire business model." | 一旦卖授权就是假话。潜在客户第一件事就是读 about 页 |
| `content/about.md:34` | "Not in the business of filing forms for you. We will not take your passport, your money, or your data." | 这句要**保留**——它同时封死了代填 Agent 那条路，是资产不是负债 |

`:58` 必须改。改法不是删掉透明度，是把授权写进去：读者看到"我们向企业收数据授权费、从不向中介收钱"，信任不降反升。这跟 7 月报告说的"说了开源却没 LICENSE"是同一类信用缺口，只是方向相反。

### 3.2 缺一个 `/licensing/` 页面

现在的状态是：数据 CC BY-SA，**没有任何地方说存在商业许可选项**。这意味着一个潜在客户读完 about 页的合理结论是"免费拿去用就行"——外联邮件里就没有 ask 了。

需要一页说清楚四件事：覆盖范围（上面第一节的表）、更新频率（`docs/maintenance/monthly-review.md` 的月度审查要变成对外承诺）、schema 稳定性、以及"商业许可请联系"。**这是本方向唯一必须写的代码，工作量约半天。**

### 3.3 开票主体

B2B 收款需要一个能开发票、能签 MSA 的实体。这件事的前置时间可能比找客户还长，需要你确认现状。

## 四、目标客户名单

按**动机真实度**排序，不是按公司大小。判据是：这家公司有没有一个不用我们的数据就会出事的理由。

### 第一梯队：现成的暖门 + 动机最直接

| 目标 | 为什么是它 | 为什么它会买 |
|---|---|---|
| **SafetyWing** | **已经是联盟伙伴，有现成联系人** | 数字游民保险，产品里天然需要"你落地前还要填哪份表"；创业公司决策快；使命同向，不用解释我们为什么存在 |
| **Airalo** | `config.toml` 里 `airalo_url` 一直是空的，Task 04 本来就要联系 | eSIM 用户 = 刚落地要联网的人，与填表人群 100% 重合。且 Airalo/Holafly 这类公司是内容营销机器，博客大量覆盖 arrival card 话题，一份维护中的可信数据源直接省掉他们的事实核查成本 |
| **Riskline** | 哥本哈根，卖旅行风险情报 API 给 TMC | **它的产品形态就是聚合国别数据然后卖 feed**。加一个 entry-form SKU 是自然扩展，而且它已经有"向外买数据"的采购流程——不用教育市场 |
| **Sitata** | 加拿大，旅行健康/安全数据 API | 同上，API-first，体量小好谈 |

### 第二梯队：有合规义务，预算真实，销售周期长

| 目标 | 动机 |
|---|---|
| Spotnana | API-first 的差旅平台，架构上最容易吃下一个数据源 |
| TravelPerk / Navan / Itilite | 企业差旅的 duty of care 义务，员工被中介宰是可归责事件 |
| Safeture（瑞典上市） | 旅行安全 SaaS，同 Riskline 逻辑 |
| International SOS / Crisis24 | 体量大、动机真，但采购周期以季度计 |
| Allianz Partners / Chubb Travel / World Nomads | 出行前触达是留存动作 |
| 携程商旅、分贝通 | 中文侧；注意中文页 CTR 是英文的 3.9 倍，这块流量数据本身就是谈判材料 |

### 第三梯队：动机真但体量撑不起（先别投时间）

反欺诈 / 品牌保护（Netcraft、Bolster、ZeroFox、Red Points、Group-IB）买的是那 37 条中介域名。**37 条太少，卖不动。** 这批数据的正确用途仍然是 7 月报告说的：免费提交给 PhishTank / APWG / Google Safe Browsing，换外链和权威背书——那是当前投入产出比最高的一项，但它不是收入。

### 明确排除

- **OTA / 机票元搜索**：7 月报告第六节的反对意见成立且不可绕过——iVisa 给 OTA 分成，官方 URL 不给。让他们换数据 = 让他们主动放弃收入。
- **OpenAI / Anthropic / Perplexity 的内容授权**：43.6% 流量来自 ChatGPT，说明数据已经被免费消费了。但签内容授权的都是 NYT 量级的出版商，156 个页面的现实预期是 0。**不要花时间。**

### 一条未经验证的线索，需要在外联中当问题问，不要当事实用

**假设**：航司/地服可能因承运证件不合规的旅客而被目的地国罚款（carrier sanctions），因而对入境卡数据有合规需求。

**本轮实测**：搜索未找到任何证据表明 TDAC / MDAC 这类**到达时查验**的表单构成登机要求或产生承运人责任。**这条假设目前不成立，不得写进任何对外材料。** 如果要用，先找一个航司地服的人确认。

## 五、询价话术

设计原则：**这一轮的目的是拿到"不需要"或"有兴趣"这个二值答案，不是成交。** 所以 ask 是 15 分钟的信息交换，不是报价。不要附件，不要 deck，5 句以内。

### 模板 A —— 给数据 feed 类买家（Riskline、Sitata、Safeture）

> **Subject:** Machine-readable entry-form field rules, 18 countries — licensing question
>
> Hi [Name],
>
> I maintain entrycardguide.com — a dataset of government entry-form requirements across 18 countries: 38 verified official URLs with agency and last-verified dates, 179 machine-readable field rules (regex, length limits, required flags), and 63 decoded official error messages. Everything is date-stamped, git-versioned, and validated at build time.
>
> It is published under CC BY-SA 4.0, which means share-alike applies to anything you derive from it. Since that is usually a non-starter for a commercial product, I also grant commercial licenses that waive it.
>
> Two questions, and a "no" is a genuinely useful answer: does entry-form data sit inside what [Company] already covers, and if so, do you source it or maintain it in-house?
>
> Happy to send the full schema. 15 minutes if it is easier.
>
> [Name]

### 模板 B —— 给暖门（SafetyWing、Airalo）

> **Subject:** Beyond the affiliate link — the underlying dataset
>
> Hi [Name],
>
> We have been linking to [SafetyWing / Airalo] from entrycardguide.com. Separately from that, I wanted to flag what sits under the site.
>
> It is a maintained dataset of entry-form requirements for 18 countries — official URLs with verification dates, 179 field-level validation rules, fees, and the decoded text of the errors those government forms actually throw. Your users hit every one of these in the days before they land.
>
> If [Company] publishes content on arrival cards or wants this inside the product, there is a licensable version. The public data is CC BY-SA 4.0; commercial use gets a license that drops share-alike.
>
> Worth 15 minutes?
>
> [Name]

### 模板 C —— 给 TMC / 差旅平台

> **Subject:** Entry-form requirements as a data source for [Company]
>
> Hi [Name],
>
> Question about duty of care: when a [Company] traveler flies to Thailand or Malaysia, where does the "you still need to file TDAC/MDAC, here is the official URL, here is what the fields accept" step come from today?
>
> I maintain that data for 18 countries — official government URLs with verification dates, 179 field-level rules, fees, and decoded error messages. The reason it exists is that paid middlemen outrank the government sites, so travelers routinely pay $60 for a free form.
>
> If that gap is already covered on your side, that is a useful answer and I will stop there. If not, worth a short call.
>
> [Name]

### 执行方式

- **一轮只发 5 封**，第一梯队 4 家 + 第二梯队挑 1 家。5 封的回复足以判断话术有没有问题。
- 找人的顺序：Head of Data / Head of Content / Product Lead > 泛 partnerships 邮箱 > info@。
- 一周无回复发一次跟进，只加一句新信息，不重复原文。
- **记录每一封的结果**（未回 / 明确不需要 / 有兴趣 / 已在用），这才是这轮真正的产出。

## 六、这轮的成功判据

不是"签了几单"。是拿到下面这个表：

| 问题 | 判据 |
|---|---|
| B2B 有没有需求 | 5 封里 ≥2 家回信讨论，则方向成立 |
| 谁是真买家 | 哪个梯队回复率最高 |
| 数据够不够采购 | 对方问覆盖度/SLA/schema 时答不上来的地方 |
| 定价区间 | 对方主动问价，或说出他们现在为同类数据付多少 |

**5 封全部石沉大海，就是一个有效结论：B2B 这条路在当前覆盖度下不成立，回到 6–12 个月扩覆盖再谈。** 成本是两天，比先建 API 再发现没人买便宜两个数量级。
