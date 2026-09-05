# 南非 SARS Traveller Declaration 官方事实核查

核查日期：2026-09-05。首读时间：08:07:07 UTC / 17:07:07 JST；其余页面在同次会话继续读取。

范围：只读公开网页、现行 PDF 和官方表单首屏。没有填写身份/联系方式，没有点击 Next 或 Submit，没有通过 CAPTCHA，没有提交真实或合成旅客申报。浏览器只打开首屏并查看 Nil 选项的说明弹窗，未确认弹窗。未执行 Git 命令；本文件是唯一写入。

结论：可以新增 `south-africa`，主表 slug 使用 `traveller-declaration`。名称宜为“南非 SARS 旅客海关申报 / South Africa SARS Traveller Declaration”。这是 SARS 管理的货物、货币及相关物品海关申报，不是 DHA 的签证、ETA 或移民入境许可；申报成功不代表获得入境许可。[S1](https://www.sars.gov.za/travellerdeclaration/)、[S10](https://www.sars.gov.za/legal-lsec-ce-ra-2026-11-r7622-gg-54900-ra-under-ss-15-and-120-electronic-south-african-traveller-management-system-dar275-26-june-2026/)

## 来源与当前读取结果

| 编号 | 官方来源 | 日期和读取方式 |
|---|---|---|
| S1 | [SARS 服务说明](https://www.sars.gov.za/travellerdeclaration/) | 正文读取；页面 Last Updated 为 2026-08-19 10:53，未注明时区。正文直链 S0。 |
| S0 | [实际申报入口](https://tools.sars.gov.za/sarsonlinequery/traveller) | 浏览器成功渲染 SARS 标识、系统名、Full/Nil 两个按钮及 Traveller Details 首屏；无登录墙。网页纯文本抓取仅返回需要 JavaScript，故字段证据采用浏览器可见页面和 DOM。 |
| S2 | [2026-07-01 新规 FAQ](https://www.sars.gov.za/travellerdeclaration/faqs-for-the-required-online-traveller-declarations-from-1-july-2026/) | 全部 Q1–Q28 正文读取；Last Updated 为 2026-07-03 11:08。 |
| S3 | [7 月 1 日实施公告](https://www.sars.gov.za/latest-news/required-online-traveller-declarations-from-1-july-2026-2/) | 正文署期 2026-07-01。 |
| S4 | [6 月 1 日车辆申报新闻稿](https://www.sars.gov.za/media-release/nearly-39-000-foreign-registered-vehicles-already-registered-as-sars-launches-the-process-from-1-june-2026/) | 正文署期 2026-06-01；包含申报免费明确句子。仅取费用证据，不用其宽泛起始日期覆盖新规。 |
| S5 | [网页操作指南](https://www.sars.gov.za/guide-to-satms-through-sars-website/) | 正文读取；Last Updated 为 2026-07-31 10:17。页面说明与 PDF 冲突时以 PDF 为准。 |
| S6 | [SC-PA-01-12 网站操作指南 PDF](https://www.sars.gov.za/wp-content/uploads/Ops/Guides/SC-PA-01-12-SATMS-Through-SARS-Website-External-Guide.pdf) | 实际打开是 40 页，Effective Date 为 2026-07-01；封面 Revision 6，内页仍有 Revision 5，存在编辑残留。不可采用搜索结果缓存的 2025-12-09 / 41 页版本。 |
| S7 | [SC-PA-01-11 旅客处理政策 PDF](https://www.sars.gov.za/wp-content/uploads/Ops/Policies/SC-PA-01-11-Traveller-Processing-External-Policy.pdf) | 10 页，Effective Date 为 2026-07-01；封面 Revision 7，内页 Revision 8。 |
| S8 | [TD-01 现行手工表 PDF](https://www.sars.gov.za/wp-content/uploads/Ops/Forms/TD-01-Traveller-Declaration-Manual-Form.pdf) | 从 S1 Related Documents 点击，3 页；没有据此推断在线控件格式。 |
| S9 | [2026 年法规修订目录](https://www.sars.gov.za/legal-counsel/secondary-legislation/rule-amendments/rule-amendments-2026/) | 正文读取；Last Updated 为 2026-08-07 12:55；列出 R.7622 / GG54900，6 月 26 日公布、7 月 1 日生效。 |
| S10 | [R.7622 / GG54900 正式规则 PDF](https://www.sars.gov.za/legal-lsec-ce-ra-2026-11-r7622-gg-54900-ra-under-ss-15-and-120-electronic-south-african-traveller-management-system-dar275-26-june-2026/) | 从 S9 Notice R.7622 点击打开，17 页；正文公布日期 2026-06-26、生效 2026-07-01。优先依据条文编号复核。 |

## 可以写入页面的事实

### 业务、费用与实施状态

- 管理机构为 South African Revenue Service（SARS，南非税务局），系统为 South African Traveller Management System（SATMS）。S1 和实际 S0 首屏均能验证。
- 2026-07-01 已经是现行实施日期，不写成未来计划。S10 第 1 页和 S9 列表一致；S3 为当天实施公告。
- 在线申报本身免费，有明确政府原文，并非从没有付款页反推。S4 原文短引：**“there is no fee for obtaining a TIP or for submitting an online traveller declaration”**。
- 免费指申报服务。应税货物的关税、VAT，或特定临时进口的担保金是另一个环节。S7 第 7–8 页列出应缴税款可在线或在具备条件的口岸支付。不要写“官方表单绝不会出现付款页”。

### 谁需要、谁豁免

- 进入或离开南非的旅客均纳入，包括外国旅客、南非公民和居民；覆盖航空、陆路、海路和铁路。没有物品需要申报也要走 Nil 分支。S2 Q1–Q3；S7 第 3 页明确无货物也须申报。
- 航空或海路旅客仅过境，且始终留在机场/港口指定过境区，或没有离开原飞机/船舶，属于明确豁免。依据 S10 Rule 15.02；不能扩展成“所有转机”“所有过境”或陆路豁免。
- 儿童和婴儿也必须由申报覆盖；父母或法定监护人可代填。照顾者/协助人可为因年龄、健康或身心能力无法自行申报的人填写，并承担准确性责任。S2 Q18；S10 15.06(c)。未查到可直接写入的统一年龄数字。
- 同行资料项确实存在，但 S1 要求每名同行者都有申报；没有提交验证，不能承诺添加 Companion 后系统就自动完成全家申报、共用一张凭证。
- S7 第 3 页还列出机组人员和外交/VIP旅客仍受海关要求约束。本批面向一般旅客，不设这些身份的未经核实免填出口。

### 时间窗口

- S2 Q5 的短引为 **“no more than 24 hours before departure”**；S10 15.06(b)(i)(aa)，第 12 页，有完整对应规则。
- 一般要求：从旅程出发国离境前 **24 小时内**提交，不能译成“至少提前 24 小时”。
- 前往南非且有中停/转机：按**最后一段直接前往南非的行程出发时间**倒推 24 小时，不按全程第一段，也不按到达南非时间。
- 离开南非：该通用条文适用为**从南非出发前 24 小时内**。这是将条文的“出发国”用于离境场景的直接解读；FAQ 没有另写一条离境专句。无来源支持“返程也按海外最后一段”或“到达前 24 小时”。
- 提交后、通过海关处理通道前，信息变动必须更新。S10 15.06(b)(i)(bb)。本轮未实测在线修改入口，不写具体按钮或修改次数保证。
- 铁路还有专门规则：未预报者在入境后的首个/离境前的最后一个南非火车站按规定申报。S10 15.09。普通页面可链接 FAQ，不把航空时间说明当作铁路现场流程全部。

### 线上、现场和纸质

- 线上入口、SATMS App、QR扫码，以及具备条件口岸的自助终端都是官方渠道。S1、S7 第 4 页。
- 纸质不是随意可选的常规替代。系统故障、当地无网络或其他合理无法电子提交的情况，才可在海关区使用 TD-01，必要时另有 TGD1。S10 15.06(a)(ii)。
- SARS 表示不会仅因到口岸前没有填好而拒绝出入境；可由海关人员/自助终端协助。此句不表示免除申报或其他入境条件。S3 正文。
- 无海关常驻的非指定地点必须先在线申报并按 Customs 指示走；不能建议到这种地点再找纸表。S10 15.10；S7 第 8 页。

## 建议展示的 12 个资料项

以下是本站整理的 **12 个资料项**，不是政府表单固定字段总数。字段组及 key 是实施建议，不代表 SARS API 字段。没有可用于站内预检的完整实证，不建议挂 validator，也不生成 pattern、maxlength 或错误消息。

| 建议 key / 资料项 | 可确认内容与必填边界 | 证据 |
|---|---|---|
| `declaration_type` 申报类型 | 按携带物品选择 Full 或 Nil；无应申报货物不等于无需填表。 | S0 两个实际按钮；S6 第 6–8 页 |
| `travel_mode` 出行方式与口岸 | 选择方式、口岸、交通工具；航班/火车/船舶/车辆标识随交通类型出现，不能统一强制航班号。 | S0 首屏星号；S6 第 9–12 页 |
| `travel_document` 旅行证件 | 准备证件类型、号码、签发国家。页面确有这些控件；不杜撰号码长度、正则或仅限普通护照。 | S0；S6 第 12 页 |
| `nationality` 国籍 | 真实首屏有 Country of Origin / Nationality；与签发国家是独立项。 | S0；S6 第 12 页 |
| `traveller_name` 姓名 | 分 First Name 与 Surname，依旅行证件填写；未核查姓名特殊字符、单名和汉字的执行分支。 | S0；S6 第 12 页；S8 第 1 页 |
| `date_of_birth` 出生日期 | 法规要求提供；实际首屏占位提示为 CCYY/MM/DD。占位提示不等于后端接受格式的完整验证。 | S0；S10 15.04(a)(iii) |
| `contact_details` 联系方式 | 准备可接收通知的邮箱和手机/区号。法规为有手机时提供；邮箱可用自己的，或按海关安排使用口岸邮箱，不能自行编口岸邮箱。Occupation 同样只在适用时提供，不列为所有人绝对必填。 | S0 星号；S10 15.04(a)(v)–(vii)、15.08(b) |
| `stay_address` 住宿地址 | **入境**为南非住宿地址；**离境**为目的地国家住宿地址。实际首屏/旧式指南的固定南非地址标题不能覆盖这个方向差异。酒店名在当前首屏无星号，街道/城市/邮编有星号；未验证所有路径。 | S10 15.04(a)(iv)；S0；S6 第 13 页 |
| `travel_capacity` 身份及出行原因 | 个人旅行或代表机构，另选目的；机构详情是代表机构时才出现的条件资料。 | S6 第 14–15 页；S5 Travel Details |
| `itinerary` 行程及日期 | 出发地、目的地、途经地（如适用）、行程日期。不要强制无转机旅客填写途经国家。 | S6 第 15 页；S10 15.04(b) |
| `companions` 同行人 | 如有同行者，准备其姓名、证件号码和签发国家。每名旅客仍须由申报覆盖，不能承诺一份主申报自动覆盖所有成年人。 | S1 Complete your declaration；S6 第 15–16 页 |
| `goods_currency` 货物及货币 | 先披露有无相关物品；按所选情况补种类、数量/金额、价值、来源或序列号。只有触发相应分支才需要细项。现金阈值本批不写数字。 | S5 Currency/Possession Details；S10 15.04(c)–(d)、15.05；S8 第 2 页 |

## 确认信息和口岸流程

- S1 说明提交后通过 email 发确认及后续指示，旅客应保存在手机或打印。S6 第 39–40 页还描述 SMS/email 通知。未实际提交，不能承诺所有分支必定同时收到短信、二维码、固定几分钟内收到，或凭证有固定有效期。
- S4 提及 personal reference number；面向一般旅客的页面优先称“申报确认/参考信息”，不要凭这条车辆语境新闻稿承诺每名旅客都有某种二维码。
- **入境：先办理 immigration，再按确认信去 Customs Control 区域。**不应说向移民官提交 SARS 海关确认就完成申报。依据 S1 Arrivals。
- **离境：先到 Customs 按指示处理物品（如复进口登记、暂进口核销、VAT退税核验），再办理 immigration。**依据 S1 Departures。无相关物品者按自己的确认指示和现场标识走，不强迫人人进入红色柜台队列。
- 若复用固定标题 `At immigration` 的 how-to-fill 模板，正文必须明确 SARS 确认用于 **Customs / 海关**，并说明上述顺序；若模板不能免歧义地承载，向主控报告模板限制，不扩大本子任务修改范围。

## 最小决策树建议

1. “是否仅乘飞机/船舶过境，并始终留在指定过境区或原飞机/船舶？”
   - 是：结束为“该场景免交 SARS 旅客申报”，附 S2 或 S10 15.02；不分配填表任务。
   - 否：进入第 2 问。离开过境区的转机者走此项；陆路/铁路不套用这个豁免。
2. “本次进入南非，还是离开南非？”
   - 入境：指向 `south-africa/traveller-declaration`，说明最后一段直达南非的出发前 24 小时内，按携带物品选择 Full/Nil。
   - 离境：同指南，说明从南非出发前 24 小时内，SARS 是海关程序。

不新增国籍或儿童年龄免填分支；不因“没有东西要申报”返回免填。两条填表出口都提醒儿童须有申报覆盖。无需为了 Full/Nil 额外加一层任务状态；可在结果说明中让旅客依据官方提示选择。

## 冲突和不应写成定论的内容

1. **6 月与 7 月实施日期**：S4 的车辆新闻泛称 6 月 1 日所有跨境旅客须申报；S3、S9、S10明确一般电子申报规则 7 月 1 日生效。新页面采用正式规则 7 月 1 日，S4只证明免费。
2. **现金数字冲突**：现行 FAQ、操作指南部分段落及 S0 Nil 弹窗显示 R100 000；S8 第 3 页仍显示 R25 000，S6 非指定口岸说明也出现 R25 000。不能把不同业务阈值合成一个无条件数字，不能把“无需预先批准”与“无需申报”当成一回事。本批只写“按 SARS 当期货币规定申报”并给官方链接。
3. **指南/实际首屏与法规条件不同**：地址方向、手机、邮箱和职业的适用条件以 S10 为准。首屏也有带星号的 South African ID Number，但本轮没有进入外国旅客条件路径；不要列为所有外国游客必填，也不要指导填假值。
4. **纸表字段不等于在线格式约束**：TD-01 可以帮助准备资料，不能从纸表版式生成在线长度或正则。
5. **当前 PDF 编辑残留**：两份 PDF 的封面/内页修订号不一致；引用时写文件名、2026-07-01生效日期和页码，比只写 revision 更可复核。
6. **现行门户验证范围**：确认入口能打开并读取真实首屏，不等于申报提交、邮件送达、修改入口或每个口岸规则已实测。指南第 2 屏以后来自官方文档，不是合成旅客穿透测试。

本报告完成事实研究；未实现 content/data、未构建、未发布。后续实施须由主控在中国修复验收之后明确分派。
