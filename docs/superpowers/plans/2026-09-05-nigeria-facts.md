# 尼日利亚 Landing & Exit Card 官方事实核查

核查日期：2026-09-05。国家 key：`nigeria`；主表 slug 建议：`landing-exit-card`。

范围：只读公开网页、官方 PDF 索引及浏览器 UI；没有注册账户，没有填写或提交旅客资料，没有调用找卡查询，没有执行 Git 命令。只写本报告，未改 content/data。

## 可用于本批的结论

官方机构是 Nigeria Immigration Service（NIS，尼日利亚移民局）。正式入口为 [Landing and Exit Card Portal](https://lecard.immigration.gov.ng/)，由 [NIS 介绍页](https://immigration.gov.ng/lecard/) 和 [NIS 首页](https://immigration.gov.ng/)直接链接。门户将入境、出境分别处理；申请卡片本身免费。它是入/出境资料预处理业务，不可替代所需签证。

**本轮不能声称读过完整申报表。** 浏览器实际点击入境申请后到达 `/login`。两种申请入口的链接均为登录页。公开注册页只见账户资料，登录后的申报控件、航班资料、条件分支、完整字段数均未核验。不为了补齐字段而注册或提交虚构旅客。

## 来源与复核位置

以下均打开正文读取，搜索摘要仅用于找来源。括号中的行号对应本轮网页文本解析结果，复核应以页面标题/段落/控件定位为准。

| 编号 | 官方来源 | 读取方式与定位 | 短引 / 控件证据 |
| --- | --- | --- | --- |
| S1 | [NIS 介绍页](https://immigration.gov.ng/lecard/) | Web 正文，唯一业务介绍段（行 165） | `all passengers`。这是一段泛化介绍，不能覆盖专用 FAQ 的具体范围。 |
| S2 | [NIS 首页](https://immigration.gov.ng/) | Web 正文，Landing and Exit Cards 小节（行 150–154） | `commences May 1, 2025`。前一个 Emergency Travel Certificate 小节的 72 小时不能移到本卡。 |
| S3 | [专用门户首页](https://lecard.immigration.gov.ng/) | Web 正文 + Chrome AX；步骤、资料、资格区 | `Arrival` / `Departure`；证件号、姓名、出生日期、国籍、联系方式；两种申请链接均指向 `/login`。 |
| S4 | [专用门户 FAQ](https://lecard.immigration.gov.ng/faq) | Web 正文，问题顺序 1–16（行 24–81） | `All foreigners`、`completely free`、`instant`、`cannot be updated`、`resubmit your application`、`not for transit purposes`、`email confirmation`。 |
| S5 | [门户 About](https://lecard.immigration.gov.ng/about) | Web 正文，平台介绍（行 11–27） | 服务面向外国访客，入境预处理与出境资料核对。 |
| S6 | [登录页](https://lecard.immigration.gov.ng/login) | Web + Chrome 实际从首页点击申请后到达 | 邮箱、密码、登录，以及注册和重置入口；未登录。 |
| S7 | [注册页](https://lecard.immigration.gov.ng/register-page) | Web + Chrome AX + 公开 HTML 控件属性解析 | `First Name`、`Middle Name`、`Last Name`、`Email Address`、`Phone Number`、`Password`、`Confirm Password`；注册说明要求姓名与护照一致。 |
| S8 | [找回最后一张卡](https://lecard.immigration.gov.ng/get-last-card) | Web 正文 + 公开 HTML 解析 | `Passport Number`、`Country of Issuance`、`Date of Birth`，三项标签带星号且有 HTML `required`。生日控件 `type=date`。没有提交查询。 |
| S9 | [联邦新闻部 2025-04-10 公告](https://fmino.gov.ng/fg-strengthens-border-security-travel-experience-through-inter-ministerial-collaboration/) | Web 正文，日期与第 8–11 段（行 153、165–168） | `prior to boarding`；`free of charge to all foreign travelers`。免费范围是数字卡，不是同文的签证等其他业务。 |
| S10 | [联邦新闻部边境改革公告](https://fmino.gov.ng/fg-reaffirms-commitment-to-innovative-border-migration-management/) | Web 正文，部长介绍系统上线段（行 203） | `as of 1st May across air, land, and maritime borders`。同段 48 小时紧接 e-Visa，不作为卡的提前时限。 |
| S11 | [NIS 与 NCAA 2025-05-23 公告](https://immigration.gov.ng/nis-in-collaboration-with-nigerian-civil-aviation-authority/) | Web 正文，新闻主体与署名日期（行 171–184） | 公告提醒航空公司核验有效签证及卡片；讨论 e-Visa 与卡两套系统。 |
| S12 | [NIS F9B 未成年人页面](https://immigration.gov.ng/info-center/returning-holders-of-foreign-passports-nigerians-by-birth-accompanied-minors-f9b/) | Web 正文，Purpose 和 Steps to Obtain（行 325、339–345） | `Under 18`，第 4 步 `Obtain Visa` 后第 5 步 `Get Landing Card`。只证明此特定外国护照未成年人场景，不把整页签证材料移作卡片材料。 |

## 政策、费用与凭证

| 待查项 | 已证实范围与写法 | 来源 |
| --- | --- | --- |
| 免费 / 隐藏政府费 | 专用 FAQ 明确门户服务完全免费；部委公告明确数字卡免费。可写“官方卡片提交费为 0”；不把签证费、逾期款或其他旅行费用算成免费。 | S4、S9 |
| 面向谁 | 专用 FAQ 面向来访或离开的外国旅客；门户列旅游、商务、临时停留等。主站“所有旅客”口径更宽，须披露差异。 | S1、S4、S5 |
| 尼日利亚公民 | 未读到明确写“持尼日利亚护照公民豁免”的现行官方条文。不能从 foreigners 自动推出所有公民/双国籍豁免。 | S1 与 S4 范围差异；未知项 |
| ECOWAS / 免签 | 首页公开结构包含 ECOWAS、免签/豁免、发展组织、其他护照类别；这说明签证豁免不宜直接当作卡片豁免。未登录验证分支，不写各类别的必填规则。 | S3；仅页面结构证据 |
| 外交 / CERPAC 等 | 未取得卡片专属豁免列表。不要套用外交签证、居留许可或免签规则。 | 未证实 |
| 儿童 | 没有证据支持“儿童免填”。F9B 官方流程要求一种外国护照未成年人拿卡。其余儿童类别及监护人代办机制未明确。 | S12 |
| 转机 | FAQ 排除仅 transit 用途；不要把这个结论扩大为“只要联程机票就不填”。需要进入尼日利亚的旅客仍应按实际入境目的确认。 | S4；后一句为适用边界说明 |
| 入境与出境 | 到访选入境卡；离境选出境卡/出境确认。不能写一张入境卡自动覆盖回程。 | S3、S5 |
| 启用日期 | 可写 NIS 官网标示自 2025-05-01 启用。 | S2，S10交叉支持 |
| 提前时限 | 建议写登机前办妥，且必须在入/出境核验前完成；**暂不写 72/96 小时窗口、最早或最晚日期**。 | S9、S11；小时数见下文 |
| 处理多久 | FAQ称符合要求且信息有效时即时处理；不要承诺实际网络或问题个案一定即时。 | S4 |
| 提交成功 | 官方称成功后有邮件和可下载卡；首页要求下载打印，以便检查点出示。不是本轮实际提交验收结果。 | S3、S4 |
| QR | 未读取到卡片样本或明确 QR 说明。NIS 新闻的 barcode 叙述与 e-Visa 相邻，不能据此认定本卡一定是 QR。写“下载卡片/确认页”。 | S11；证据不足 |
| 更正 | 已提交信息不能更新；错误时重新提交正确申请，仍有问题联系支持。未核验新版登录后的操作按钮，不编“编辑”路径。 | S4 |
| 多人 | FAQ 要求逐人提交，不能承诺家庭合并一张卡。 | S4 |
| 遗失 | 邮件可用于重印；当前还有公开找卡页，用证件号、签发国、生日查最后的入/出境卡。 | S4、S8 |
| 是否取代签证 | 不取代。F9B 将取得签证与领取卡分为相邻独立步骤。门户提供证件号核验，不是签证申请业务。 | S12、S3、S11 |
| 支持 | 官方联系邮箱 `lecard@immigration.gov.ng`。问题升级可指向门户 Contact / FAQ，不需要发信实测。 | S3、S4 |

## 推荐 8 个准备项（不是政府表单总字段数）

这 8 项可作为 fields 指南所选资料条目。`required` 未知时不可写成固定必填；当前不挂 validator，不加 pattern、min/maxLength 或模拟政府错误。示例只能教用户对照自己的文件，不能暗示格式已验证。

| 建议 key | 中 / 英标签 | 已有证据 | 必填或条件口径 |
| --- | --- | --- | --- |
| `journey_direction` | 入境或出境 / Arrival or departure | S3 步骤 1 | 选择对应业务，非护照旅行目的字段。 |
| `full_name` | 护照全名 / Full name on passport | S3 资料说明；S7 将姓名拆成三格 | 与证件一致；中间名是否必填未证实。不要自行移除连字符、空格或变造姓名。 |
| `passport_number` | 护照号码 / Passport number | S3 证件说明；S8 找卡控件 | 证件核对资料；未核验所有申请分支是否固定必填。找卡必填已证实。 |
| `visa_number` | 签证号码（按适用路径） / Visa number, where applicable | S3 说明使用签证号或护照号 | 条件资料，不能让免签/ECOWAS 旅客虚构号码。具体分支要求未核验。 |
| `date_of_birth` | 出生日期 / Date of birth | S3 资料说明；S8 找卡控件 | 与证件一致；找卡为日期选择器。不能写全站强制 DD/MM/YYYY 或 YYYY-MM-DD 手输格式。 |
| `nationality` | 国籍 / Nationality | S3 资料说明 | 与旅行证件一致；不要与护照签发国混为一项。申请是否支持多国籍选择未核验。 |
| `email` | 电子邮箱 / Email address | S3 联系方式说明；S7 账户字段；S4 成功凭证 | 邮件用于官方联系与卡片凭证；应能接收邮件。不能推断邮箱验证码步骤。 |
| `phone` | 联系电话 / Phone number | S3 联系方式说明；S7 账户字段 | 联系方式资料，未证实国际区号/长度/正则或必填性。不要复制页面占位号码作格式规则。 |

补充在“找回卡片”段，不算入上述 8 项：签发国在 S8 找卡页明确必填，须与护照及生日一起提供。它不是已核验的申报主字段。

账户密码与确认密码只出现在政府账户注册流程，不纳入本站 fields/rules，也不让用户在本站填写。S7 的 7 个公开注册控件均未设置 HTML `required`，**这不能证明业务上选填**，因为本轮没有执行前后端提交校验。S8 三个找卡控件的 `required` 则已直接解析确认。

## 操作步骤可写到哪一步

1. 从官方门户选入境或出境申请；当前会先到登录页。
2. 按政府页面登录/注册。公开注册说明要求护照姓名一致；本轮未验证注册成功、邮箱验证或账户内页面。
3. 按实际业务提供证件及个人资料。官网只列总体步骤，不能虚构“第几页填写航班/住宿/停留天数”。
4. 仔细核对再提交。这个步骤来自官网说明，本轮未执行。
5. 根据官网说明保存成功邮件与卡片，下载打印；离境业务单独处理。遗失可从邮件或找卡入口恢复。

## 冲突、未知与不采纳的线索

- **时限**：[NIS YouTube 操作视频线索](https://www.youtube.com/watch?v=-OfuHqm74wM)的搜索结果称 2025-06-29 发布，并提到提前 72 小时与双国籍。门户页脚确实链接 `youtube.com/@nigimmigration`，但本轮 Web 打开视频被节流，Chrome 打开也 `ERR_FAILED`；未读视频正文/字幕，不采纳其小时数或双国籍断言。
- **96 小时来源降级**：[EUAA 2026-01 报告页面](https://www.euaa.europa.eu/nigeria-country-focus/39-mobility-and-freedom-movement)正文提到 96 小时，但脚注 1268 引用 Business Day 2025-06-13 媒体文章，非 NIS 原始规则。不能因为转述者是政府机构就升级为尼日利亚官方时限。该页面已打开正文核查。
- **PDF**：检索官方域名及公开指南线索，未找到可读的 Landing/Exit Card 专用用户手册 PDF。打开了 [NIS 2026-04 SLA PDF](https://immigration.gov.ng/wp-content/uploads/2026/04/SERVICE-LEVEL-AGREEMENT-2026_.pdf)（93 页），文本搜索 `LANDING`、`lecard`、`72 hours` 均无匹配；不宣称它提供本卡规则。
- **泛化语句**：S1 的“所有旅客”和抵达/离境时填写，与 S4 的外国旅客预处理范围、S9 的登机前口径有差别。页面应以专用门户的目标人群为主，提醒尼日利亚护照/特殊身份向 NIS 确认，不能把公民或外交类别自动导到填表任务或绝对免填结论。
- **缺口**：登录后真实表单字段、航班/入境点/住宿/停留天数、儿童代办、新版更正入口、QR、格式长度和具体输入报错，本轮均未核验。没有证据的内容不进入本批 data。

## 给主控的接线建议

- country roster 主表显示 Landing & Exit Card；费用可为 Free / 免费；业务类型采用既有 `arrival_card`，说明含出境流程，不误标 eVisa。
- decision 在外国访客入/出境分支给官方门户任务；仅 transit 分支不要派申报任务，但说明须符合门户的纯过境范围。
- 尼日利亚护照、双国籍及外交/居留等尚无明确豁免的分支，用“向 NIS 确认适用性”的指南结果，不用无证据的“必须填”或“免填”。
- fields 简介应明确“8 个准备项，来自政府公开资料与账户入口；具体必填项以实际申请页面为准”，不承诺完整表单或在线格式校验。

