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
| `evisa.govn.tr` | look-alike 域名，自称官方门户 | 2026-07-14 | 域名 `govn.tr` 仿 `gov.tr` 属实，标题仍自称 Official。但 `disclaimer.php` 明写 "This company (E SERVICES) **is not associated with the government of Turkey**"；费用表已改为「政府费 + Addl. Admin Fee」分列；原指控的"美英资格说法过时"也已修正（现写明 USA 可免签入境） | 否 |
| `malaysia-mdac.com` | 冒用马来西亚移民局品牌 | 2024-02-15 | 页脚："本网站**不隶属于马来西亚政府和使馆**。协助申请服务将收取一定的服务费"，正文另有"如希望通过马来西亚入境卡官网申请，您可以在此申请"并给出官方链接 | 否 |
| `mexico-fmm.com` | 冒用 INM 品牌 | 2024-08-15 | **域名已 301 到 `mexicofmm.com`**。新站页脚："www.mexicofmm.com **is not affiliated with the Government** or its sponsors. An application can also be submitted **for a lower cost** through the Government's website here" | 否 |
| `eticket-dominican.com` | 冒用 DGM 品牌 | 2023-08-01 | 页脚："www.eticket-dominican.com **no está afiliado al Gobierno**... También se puede enviar una solicitud **por un precio menor** a través del sitio web del gobierno aquí" | 否 |
| `indonesia-evoa.com` | 加价伪装成 service fee | 2024-08-22 | 页脚："**is not affiliated with the Government** or its sponsors. An application can also be submitted for a lower cost through the Government's website here"，且服务费单列 | 否 |
| `evisa-vietnam.com` | 仿冒官方站 UI | 2024-06-10 | 页脚："**We are neither a government website nor affiliated with the embassy.** We are a commercial website" | 否 |
| `vietnam-evisa.org` | 用 .org 仿官方域名 | 2024-03-15 | 正文："**We are not affiliated with the Government**... you can visit the official website **for a cheaper price**"。（页脚版权写 "VIETNAM EVISA DEPARTMENT"，"Department" 有误导性，但披露明确） | 基本否 |
| `visasforms.com` | 自称 "Official Turkey eVisa Service" | 2026-07-14 | H1 **仍是** "Official Turkey eVisa Service"，但同页有："This is a private third-party service **not affiliated with or endorsed by** the Turkish Ministry of Foreign Affairs... For official eVisa applications, **visit evisa.gov.tr**" | 弱 |

**8 个全部带明确的非官方免责声明，多数还主动给出官方链接并说明官方更便宜。**

如果按原计划批量提交，等于提交 37 份假举报，其中 12 份针对一家有律师的公司。

> **本节的两次自我修正**，都是同一种错法——查得太浅就断定"它没有披露"：
>
> 1. `evisa.govn.tr`：只看首页，判定"全文未声明与政府无关"、可单独提交。查 `disclaimer.php` 后发现声明明确存在，只是不在首页。结论从"1 条可提交"改为"0 条"。
> 2. `ivisa.com/malaysia`：翻了页脚、用正则搜 `not the government`，判定"该页没有任何非官方声明"。实际文本是 "We are not the **Malaysian** government"——正则漏了中间的国名。
>
> **复核流程必须写死两条**：(a) 逐站翻完 disclaimer / about / terms，不能只看落地页；(b) 搜披露文本要用宽松模式（`We are not`、`not affiliated`、`no está afiliado`、`不隶属`），不能假设措辞。

### 附带发现：三个站是同一个模板

`mexicofmm.com`、`eticket-dominican.com`、`indonesia-evoa.com` 使用完全相同的页面结构（"Services / Government / 本站" 三列对比表）和逐字相同的免责声明措辞。同一运营方的站群。这条信息本身有情报价值，值得记进 TOML。

## 四、更紧急的问题：本站在发布已经过期的指控

复核的直接后果不是"不能提交举报"，而是：

**`data/official_urls/*.toml` 里目前有 6 条指控，在今天已经不符合事实。** 它们随构建渲染进 `{{< scam-site >}}`，是公开发布的内容：

- `malaysia-mdac.com` — "Uses Malaysian Immigration Department branding **without authorization**"
- `mexico-fmm.com` — "Uses INM-style branding **without authorization**"（且域名已迁移）
- `eticket-dominican.com` — "Uses DGM-style branding **without authorization**"
- `evisa-vietnam.com` — "**copying the official site's UI**"
- `indonesia-evoa.com` — "markup **masquerading as** 'service fee'"
- `evisa.govn.tr` — "called its USD $20-$100 range a **government fee**" 及"**美英资格说法过时**"（该站已改版，费用分列、资格说法已修正）

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

### 也不做

`evisa.govn.tr` 一度被判为唯一可提交的一条，复核 `disclaimer.php` 后撤回：声明存在，只是不在首页。**26 个域名，0 条符合 Safe Browsing 的提交标准。**

它仍有一个真实问题——`govn.tr` 与官方 `evisa.gov.tr` 只差一个字母，属于近似域名。但这是**域名/商标争议**，不是社会工程学，对口渠道是 .tr 注册管理机构和土耳其外交部，不是 Google Safe Browsing。

### 政府机构渠道：查过了，同样没有可提交的东西

原本判断"真正的对口渠道是被冒用品牌的政府机构"。实际去查之后，这条也不成立。

**渠道确实存在且对口。** 新加坡 ICA 的 feedback 表单有一个专设类别，标题直接写着 "Others (e.g. **Reporting of Scams Related to ICA Services/Facilities**)"（`form.gov.sg/68553b140c742cca1571de4c`）。马来西亚移民局的 contact 页只给出 `webmaster@imi.gov.my`，没有独立的反诈通道。

**但没有可填进去的内容。** 复核 iVisa 各国入境卡页面（2026-07-24）：

| 页面 | 披露文本 | 标价 |
|---|---|---|
| `/thailand/digital-arrival-card` | "We are not the Thai government, but will submit your application to them on your behalf." | from $64.99 |
| `/malaysia/digital-arrival-card` | "We are not the Malaysian government..." | from $64.99 |
| `/indonesia/arrival-card` | "We are not the Indonesian government..." | from $64.99 |
| `/singapore/sg-arrival-card-health-declaration` | "We are not the Singapore government..." | from $64.99 |

模板化的披露，逐国替换国名，价格统一。要向 ICA 提交的内容会变成"有公司为你们免费的表收 $64.99，并且明确说了自己不是你们"——这不是诈骗举报，ICA 那个类别是给冒充 ICA 的行为准备的。

### 由此得到的真正结论

**这个行业已经普遍加上了免责声明。** 今天复核的每一个站——8 个涉嫌冒充的 + iVisa 的 4 个国家页——无一例外。

这不削弱本站，反而校正了它的定位：

- 站不住的版本：「这些是骗子/诈骗站」
- 站得住的版本：**「你正要为一份免费的表付 $64.99，真正的网址在这里」**

第二个版本不需要证明任何人违法，只需要两个可核验的数字并列，而这两个数字本站已经全部持有。后续所有对外表述都应该收敛到第二个版本。

### 那外链怎么办

第二节说的"外链=0 是 Google 排名的天花板"仍然成立，但本节证明**它不能靠举报诈骗站来解决**。这个问题要退回 `docs/tasks/09-quora-outreach.md` 和 `10-backlink-recon.md` 的常规路径，或者接受 `monetization-model` 报告的判断——本站的流量引擎本来就是 AI 助手而不是 Google，外链的优先级可能被高估了。

## 六、下一步

1. ~~改 6 条已过期的证据~~ **已完成**（`malaysia`、`mexico`、`dominican`、`vietnam`×2、`indonesia`、`turkey`）。保留收费指控，删除/改写品牌侵权指控。同步更新 `mexico-fmm.com` → `mexicofmm.com` 的域名迁移。
2. ~~把"同一站群模板"这条发现记进相关 TOML~~ **已完成**。
3. **建立复核制度。** `docs/maintenance/monthly-review.md` 已有月度流程，但没覆盖 scam_sites 的证据时效——这次 6 条过期的最老一条是 2023-08，将近三年没复核。26 个域名手工复核约 1 小时，应排进月度。流程里必须写明：**逐站要翻 disclaimer / about / terms 页，不能只看落地页**（见第三节的自我修正）。
4. ~~`evisa.govn.tr` 单独提交~~ **撤回，不提交。**
5. 打通政府机构渠道（第五节），这才是原本要的外链和背书。
