# 诈骗站名单实地复核：8 个"冒用品牌"指控里 7 个已不成立

记录时间：2026-07-24
起因：`docs/reports/monetization-model-2026-07-23.md` 第八节建议"把 37 条诈骗域名提交给 PhishTank / APWG / Google Safe Browsing"
方法：逐站访问，读取标题、H1/H2、页脚免责声明、费用表述。只读，未提交任何举报，未输入任何数据。
结论：**该建议不成立，且复核过程暴露了一个更紧急的问题——本站正在发布已经过期的指控。**

## 一、提交渠道的受理定义（实查）

### PhishTank（Cisco Talos 运营）

官方定义：*"Phishing is a fraudulent attempt, usually made through email, to steal your personal information."*

**37 条里 0 条符合。** 这些中介收 3–10 倍的钱，但确实会把表填了、把批文发给你。这是价格问题，不是窃取个人信息。另外提交需要注册账号。

### Google Safe Browsing

「社会工程学」分三类，只有第三类挂得上：

> **标识不明的第三方服务**：第三方是代表其他实体运营网站或服务的提供商。如果您（第三方）代表其他方（第一方）运营网站，而未明确说明双方关系，则这种行为可能会被标记为社会工程学行为。

配套的《第三方服务指南》给出判定标准：每页明确包含第三方品牌、明确说明与第一方的关系。

**即：判定标准是"有没有明确披露自己不是政府"。** 这条标准把名单劈成了两半。

## 二、名单的实际构成

37 条，26 个唯一域名（`ivisa.com` 一家占 12 条）。

| 分类 | 条数 | 我们自己的证据原文 |
|---|---:|---|
| 证据里**已记录对方披露了非官方身份** | 14 | "footer stated that it is an agency **not affiliated with** the Australian Government"；"the page also stated that **iVisa is not** the New Zealand government" |
| 指控冒用品牌 / 仿冒 UI / 仿冒域名 | 8 | "Uses INM-style branding **without authorization**"；"**copying the official site's UI**" |

第一组本来就不能报——我们手里有反证。第二组是唯一的候选，所以逐个实地复核。

## 三、8 个候选的复核结果（2026-07-24 实访）

| 域名 | TOML 里的指控 | 首次观测 | 今天实际情况 | 还成立吗 |
|---|---|---|---|:--:|
| `evisa.govn.tr` | look-alike 域名，自称官方门户 | 2026-07-14 | 标题仍为 "**Official** Turkey Electronic Visa Apply"，H2 仍为 "Republic of Türkiye Electronic Visa (e-Visa) - Portal Version 2.0"，域名 `govn.tr` 仿 `gov.tr`。页脚有 "operated by E-Services, a private entity"，**但全文未声明与政府无关** | **部分成立** |
| `malaysia-mdac.com` | 冒用马来西亚移民局品牌 | 2024-02-15 | 页脚："本网站**不隶属于马来西亚政府和使馆**。协助申请服务将收取一定的服务费"，正文另有"如希望通过马来西亚入境卡官网申请，您可以在此申请"并给出官方链接 | 否 |
| `mexico-fmm.com` | 冒用 INM 品牌 | 2024-08-15 | **域名已 301 到 `mexicofmm.com`**。新站页脚："www.mexicofmm.com **is not affiliated with the Government** or its sponsors. An application can also be submitted **for a lower cost** through the Government's website here" | 否 |
| `eticket-dominican.com` | 冒用 DGM 品牌 | 2023-08-01 | 页脚："www.eticket-dominican.com **no está afiliado al Gobierno**... También se puede enviar una solicitud **por un precio menor** a través del sitio web del gobierno aquí" | 否 |
| `indonesia-evoa.com` | 加价伪装成 service fee | 2024-08-22 | 页脚："**is not affiliated with the Government** or its sponsors. An application can also be submitted for a lower cost through the Government's website here"，且服务费单列 | 否 |
| `evisa-vietnam.com` | 仿冒官方站 UI | 2024-06-10 | 页脚："**We are neither a government website nor affiliated with the embassy.** We are a commercial website" | 否 |
| `vietnam-evisa.org` | 用 .org 仿官方域名 | 2024-03-15 | 正文："**We are not affiliated with the Government**... you can visit the official website **for a cheaper price**"。（页脚版权写 "VIETNAM EVISA DEPARTMENT"，"Department" 有误导性，但披露明确） | 基本否 |
| `visasforms.com` | 自称 "Official Turkey eVisa Service" | 2026-07-14 | H1 **仍是** "Official Turkey eVisa Service"，但同页有："This is a private third-party service **not affiliated with or endorsed by** the Turkish Ministry of Foreign Affairs... For official eVisa applications, **visit evisa.gov.tr**" | 弱 |

**8 个里 7 个现在都带明确的非官方免责声明，多数还主动给出官方链接并说明官方更便宜。**

如果按原计划批量提交，等于提交 37 份假举报，其中 12 份针对一家有律师的公司。

### 附带发现：三个站是同一个模板

`mexicofmm.com`、`eticket-dominican.com`、`indonesia-evoa.com` 使用完全相同的页面结构（"Services / Government / 本站" 三列对比表）和逐字相同的免责声明措辞。同一运营方的站群。这条信息本身有情报价值，值得记进 TOML。

## 四、更紧急的问题：本站在发布已经过期的指控

复核的直接后果不是"不能提交举报"，而是：

**`data/official_urls/*.toml` 里目前有 5 条指控，在今天已经不符合事实。** 它们随构建渲染进 `{{< scam-site >}}`，是公开发布的内容：

- `malaysia-mdac.com` — "Uses Malaysian Immigration Department branding **without authorization**"
- `mexico-fmm.com` — "Uses INM-style branding **without authorization**"（且域名已迁移）
- `eticket-dominican.com` — "Uses DGM-style branding **without authorization**"
- `evisa-vietnam.com` — "**copying the official site's UI**"
- `indonesia-evoa.com` — "markup **masquerading as** 'service fee'"

CLAUDE.md 把 shortcode 的构建时校验称为"法律防线（避免没有证据的污蔑指控）"。那条防线保证的是"指控必须有 TOML 条目"，它**保证不了 TOML 条目本身还成立**。上面 5 条就是从这个缝里漏出去的。

需要区分两种指控：

| 指控类型 | 现状 | 处理 |
|---|---|---|
| **"对免费的政府表单收费"** | **全部仍然成立**，实访确认收费依旧 | 保留。这是本站的立论，站得住 |
| "冒用政府品牌 / 无授权使用 / 仿冒 UI" | 5 条已不成立 | **必须改写或删除** |

本站的核心主张一个字都不用改。要改的只是那几句品牌侵权指控——那是最容易被追责、而且对读者价值最低的一句。

## 五、修正后的建议

### 不做

- 不向 PhishTank 提交任何条目（定义不符 + 需注册账号）
- 不向 APWG 提交（同一套 phishing 定义）
- 不向 Google Safe Browsing 批量提交 37 条

### 可做（需逐条确认）

`evisa.govn.tr` 是唯一有实质理由的一条：仿冒域名（`govn.tr` vs 官方 `gov.tr`）+ 标题自称 Official + 冒用政府门户命名，且**全文没有一句声明与政府无关**。可按「标识不明的第三方服务」单独提交，附我们的观测记录。一次一条，提交前你过目。

### 更值得做的替代路线

原目标是"拿外链 + 权威背书"。真正的对口渠道不是安全厂商，是**被冒用品牌的政府机构本身**：

- 泰国移民局已经在发公开警告（我们 `thailand.toml` 的证据就引用了这个）
- 各国移民局有反诈联系渠道，且**有动机**发布中介警告名单

一个 `immigration.go.th` 或 `ica.gov.sg` 的警告页引用本站，权重远高于 PhishTank 条目（后者基本是 nofollow，SEO 价值接近 0），而且这些机构本来就想要这份数据。方向对了，强度也更高。

## 六、下一步

1. **改 5 条已过期的证据**（`malaysia`、`mexico`、`dominican`、`vietnam`、`indonesia`）。保留收费指控，删除/改写品牌侵权指控。同步更新 `mexico-fmm.com` → `mexicofmm.com` 的域名迁移。
2. 把"同一站群模板"这条发现记进相关 TOML。
3. 建立复核制度：`docs/maintenance/monthly-review.md` 已有月度流程，但显然没覆盖到 scam_sites 的证据时效。26 个域名手工复核约 1 小时，值得排进月度。
4. `evisa.govn.tr` 单独提交与否，待定。
