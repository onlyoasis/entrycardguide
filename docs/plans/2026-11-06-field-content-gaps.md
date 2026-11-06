# 字段类问题内容缺口：全量清单与处理结果（2026-11-06）

## 结论

1. **按条件筛出的字段类问题共 9 组。** 条件：落在填写页或表单页、排名不超过第 12 位、展示不少于 15 次、点击为 0。另有约 170 条同样满足条件的查询是官网和导航类头部词（如 `sg arrival card`、`马来西亚入境卡`、`www.e-arrivalcard.go.kr`），归标题会话处理，本清单不收。
2. **9 组里 4 组页面早有答案，但答得不够直接。** 印度 ISD 区号的 FAQ 10-14 就上线了，排第 4 位仍然 0 点击：旧答案只说“填国际区号”，没说印度是 91、要不要加 +。本轮改成直接给数字和格式。
3. **计划表里的 P1、P2 项，泰国 6 项和马来西亚修改、查询、PIN 已在 10-15 补完。** 本轮补了剩下的新加坡、菲律宾、印度、日本、柬埔寨，以及马来西亚的“alphanumeric only”。
4. **核不到的 4 项没写**：马来西亚拼图验证码不出来、马来西亚 PDF 回执怎么下载、OCI 持卡人入境目的选哪项、Visit Japan Web 免税二维码有效多久。
5. **顺带修正一处错误。** 印度填写页的“签证、e-Visa 或 OCI 编号”字段卡写得像表单上有这一栏，现行网页表单没有（2026-11-06 浏览器内读前端脚本确认，`official_urls/india.toml` 早有 “No flight number or visa/OCI number box” 的记录）。卡片文字改为说明现状。

## 数据与方法

| 来源 | 窗口 | 文件 |
|---|---|---|
| GSC 页面×查询 | 近 28 天（2026-11-04 导出） | `data-exports/2026-11-04-28d/gsc-page-query.json` |
| Bing 页面×查询 | 4 周：10-09、10-16、10-23、10-30 | `data-exports/2026-11-06-bing/bing-get-page-query-stats.json` |
| 长尾词计划“内容缺口”表 | 2026-10-14 | `docs/plans/2026-10-14-country-longtail-keywords.md` |

页面归类：去掉 `/zh/`、`/zh-hant/` 前缀后路径为两段的算国家页，第二段是 `how-to-fill` 的算填写页，其余算表单页；枢纽页、资料库页不算。Bing 按页面×查询把 4 周展示相加，排名按展示加权。变体（同一意图、展示不足 15 次）并入主条目列出。

## 候选清单与处理

“来源”列：G = GSC，B = Bing，P = 10-14 计划表。“写入位置”里的 FAQ 指 `data/seo/faq.toml`，正文 FAQ 指内容文件 front matter 的 `faq`（该页有 front matter FAQ 时 `faq.toml` 不生效）。

### 一、搜索数据筛出的条目

| # | 页面 | 查询（展示 / 排名） | 来源 | 处理 | 写入位置 | 官方依据 |
|---|---|---|---|---|---|---|
| 1 | `/china/arrival-card/` | national immigration administration entry declaration receipt for foreigner（101 / 9.4）；变体 entry declaration receipt for foreigner（8 / 7.1）、…for foreigner china（7 / 7.3） | G | **已补**。新 FAQ 讲回执是什么：抬头“国家移民管理局”，副标题“外国人入境填报回执”/ Entry Declaration Receipt for Foreigner，可下载或发邮件，官方页面没有要求打印。原中文页写的“入境申报回执”不是官方叫法，新答案用官方原名。 | `content/china/arrival-card.md`、`.zh.md` 正文 FAQ | s.nia.gov.cn 填报页前端 `js/app.bc4b0fcf.js` 的 receipt 文案；登记在 `official_urls/china.toml` `[arrivalcard]` |
| 2 | `/china/how-to-fill/` | do you have any inviting entities or inviters in china?（21 / 7.8）、不带问号（20 / 7.2）、china arrival card inviting entities（17 / 6.0）；变体 …meaning（7）、…? yes（5） | G | **已补**。原 FAQ 只讲“Entity Contact Information 填什么”。新增一条按查询原句提问：问的是有没有中方邀请单位（Inviting entity in China）或中方邀请人（Inviter in China），没有就选否。 | `content/china/how-to-fill.md`、`.zh.md` 正文 FAQ | 同上前端脚本的 zfsfyq / zfyqdw / zfyqr 文案 |
| 3 | `/india/how-to-fill/` | what is isd code for india e arrival card（46 / 4.0）；变体 isd code india arrival card（12 / 3）、isd code e arrival card india（10 / 8.9）；B：isd code india（11 / 8.0） | G、B | **已改写**。原 FAQ（10-14）没给数字。新答案：单独一栏、只填数字、不加 +、最多 4 位、必填；印度号码 91，美加 1，英国 44，中国 86；紧急联系人另有区号栏。 | FAQ | 表单前端 `assets/index-DBv8aLuY.js`（`countryCodeMbl` maxLength 4、`/^\d*$/`、“Please provide ISD Code”）；国家代码取自 ITU E.164 国家代码清单；均登记在 `official_urls/india.toml` `[earrival]` |
| 4 | `/malaysia/how-to-fill/` | please key-in alphanumeric only（37 / 4）；变体 *please key-in…（8）、please key in alphanumeric only meaning（7）、**please key-in…（5） | G | **已补**。正文早已列出允许的符号，但没有按这句提示提问的 FAQ。新 FAQ：提示只管下面两行地址；收字母、数字、空格和 @ / - ( ) , '，句点和 # 输不进；不能粘贴；每行 100 字符。 | FAQ | 登记页 `main?registerMain` 的 `isNumberCharacterKeyAccom` 与输入框属性；登记在 `[registration_form]` |
| 5 | `/malaysia/how-to-fill/` | please enter address in malaysia properly（9 / 5.4） | G | 低于 15 次展示，不单列。正文和错误解码卡已有这句报错的解释。 | — | — |
| 6 | `/new-zealand/how-to-fill/` | full contact or residential address in new zealand（37 / 9.9） | G | **已补**。字段卡已有一句话说明；新 FAQ 按查询原句提问：填落脚地址，住多处填第一处；表单边输边搜，搜不到可手动分栏填写，邮编 4 位。 | FAQ | travellerdeclaration.govt.nz “Completing your declaration”页；app.travellerdeclaration.govt.nz 前端脚本与 appSettings.json（地址分栏、`^\d{4}$`）；登记在 `[form_checks]` |
| 7 | `/uk/how-to-fill/` | uk eta home address line 1 等 12 个变体（15–37 / 2.6–7.4） | G | **已有内容，未改。** FAQ 10-13 上线，10-17（f748e29）又补了住址解释和地址栏排错。28 天窗口大部分时间旧版在线，等下次数据复测。 | — | — |
| 8 | `/korea/how-to-fill/`、`/korea/e-arrival-card/` | www.e-arrivalcard.go.kr scan（49–153 / 5.6–7.8） | B | **已有内容，未改。** 10-14 已按门户第 2 步护照拍照/上传说明补上。表单页那几条属官网导航词。 | — | — |
| 9 | `/dominican/how-to-fill/` | e - ticket dominican repablic flight confirmation number / pnr（10 / 2.0） | B | 低于阈值，未处理。 | — | — |

### 二、10-14 计划表里的 P1、P2 项

| # | 国家 | 需求 | 处理 | 写入位置 | 官方依据 |
|---|---|---|---|---|---|
| 10 | 泰国 | 职业、旅行目的、居住国、电话填错、修改 | **10-15 已补**（f3b6514、d9a9f13），本轮未动 | FAQ | 见 `official_urls/thailand.toml` |
| 11 | 马来西亚 | 修改、查询是否成功、PIN 忘了 | **10-15 已补**，本轮未动 | FAQ | 见 `official_urls/malaysia.toml` |
| 12 | 马来西亚 | 拼图验证码不出来 | **未核实，未写。** 官方只有界面文案（Drag To Verify、加载 3 次失败显示 Load Failed），没有排障说明 | — | — |
| 13 | 马来西亚 | 下载 PDF | **未核实，未写。** 查询页脚本有按行程打印回执的动作，但结果页要真实记录才显示，按钮文字和是否出 PDF 看不到 | — | — |
| 14 | 新加坡 | 电话国家区号 | **已补**：可搜索下拉，显示为 +数字；号码另填，只填数字 | 正文 FAQ（`content/singapore/how-to-fill.md`、`.zh.md`） | eservices.ica.gov.sg/arrivalcard 前端脚本与 `assets/i18n/en.json`；登记在 `[sgac_enhanced]` |
| 15 | 新加坡 | 居住地 | **已补**：Place of Residence 是“国家, 州, 城市”组合的可搜索列表，指平时住的地方，不是新加坡住宿 | 正文 FAQ | 同上 |
| 16 | 新加坡 | 填错了怎么办 | **已补**：出行前用 Update SGAC 改；外国访客 6 项不能改，要重新提交 | 正文 FAQ | ICA SGAC 页（2026-10-28 更新）与 en.json；登记在 `[sgac_guidance]`、`[sgac_enhanced]` |
| 17 | 新加坡 | 怎么查看已提交 | **已补**：成功页 + 确认邮件，查垃圾邮件，邮件里有 DE 编号。官方没有单独的“查询是否已提交”功能 | 正文 FAQ | 同上 |
| 18 | 菲律宾 | 职业怎么填 | **已补**：必填，从网站加载的列表里选，按名称排序。选项清单来自后端接口，没取，不写 | FAQ | etravel.gov.ph 前端脚本（`occupation_code` 必填、`/api/v1/common/occupations`）；登记在 `[etravel]` |
| 19 | 菲律宾 | 创建账号没反应 | **部分补**：只写官方提示的“至少等 3 分钟、可重发”，加上已有字段卡的“邮箱拼错收不到”。其他排障办法官方没写 | FAQ | etravel.gov.ph 页面文案 `otp_info`；登记在 `[faq]` |
| 20 | 菲律宾 | 出境也要填吗 | **已补**：只有出境的菲律宾籍旅客要填，外国旅客出境不在官方名单里 | FAQ | eTravel 官方 FAQ；登记在 `[faq]` |
| 21 | 菲律宾 | 被拒绝 | **已补**：按官方 FAQ 解释红码和绿码。“提交失败”的报错文案官方没公布，未写 | FAQ | eTravel 官方 FAQ |
| 22 | 印度 | OCI 持卡人怎么填 | **已补**：和其他外国旅客一样，72 小时内；网页表单没有 OCI 号栏。入境目的选哪项：**未核实，未写** | FAQ；另改 `data/fields/india.toml` 的 `visa_or_oci_number` 卡片 | boi.gov.in What's New 原文；表单前端脚本；登记在 `[boi]`、`[earrival]` |
| 23 | 印度 | 有中文版吗 | **已补**：表单只有英文；boi.gov.in 说明站有中文菜单 | FAQ | 同上 |
| 24 | 日本 | 同行家人怎么加 | **已补**：先登记本人，最多 10 名同时入境的家人，逐人登记、逐人办手续 | FAQ | VJW 使用手册 3-3；登记在 `[vjw_manual]` |
| 25 | 日本 | 免税二维码 | **已补**：适用对象、先登记护照和上陆许可证印、不能截图、不能代替护照、入境后可补登。有效时长：**未核实，未写** | FAQ | Digital Agency 使用说明页、手册 9-1；登记在 `[tax_free_guide]`、`[vjw_manual]` |
| 26 | 日本 | 多久前申请 | **已补**：官方没规定入境前几天，只说事先登记；计划最远登记到次年 12 月 31 日，最多 100 条 | FAQ | VJW 使用手册第 4 章 |
| 27 | 柬埔寨（P3） | App 下载 | **已补**：官网链接 Google Play 和 App Store 上的 Cambodia e-Arrival；没有“必须用 App”的说法。华为应用市场链接由后端下发，没取到，不写 | FAQ | arrival.gov.kh 前端脚本；登记在 `[earrival]` |
| 28 | 柬埔寨（P3） | 回程日期改签 | **已补**：官网有 Update e-Arrivals；声明条款要求信息变了就重新申报；官方没列哪些字段可改；7 天窗口 | FAQ | arrival.gov.kh `assets/en.json` |

## 核对方式

- 所有引文都由主控回源取原文核对：curl 取页面和前端脚本，印度官网本机 curl 握手失败，改用内置浏览器在页面里 fetch 前端脚本；子代理的调研只作线索。
- 没有提交任何表单、没有过验证码、没有注册账户、没有调用需要登录的接口。
- 繁体 `*_zh_hant` 和 `.zh-hant.md` 由 `npm run sync:zh-hant` 生成。

## 未改、留给后续

- `data/rules/india.json` 里还有 `visa_or_oci_number` 校验项（站内预校验器会显示这一栏）。现行官方表单没有这一栏，应与字段卡一起复核；该文件不在本任务的文件范围内。
- 印度填写页正文第 4 条、第 7 条（签证/OCI 编号、航班号）仍沿用 7 月的“官方网页未显示、使领馆材料提到”写法，和现行表单一致，但读起来像有这两栏，下次改正文时一起收紧。
- 印度表单脚本里有同行人字段（`mbrName`、`mbrPassport`、`mbrNationality`），说明表单可以替家人一起填，本轮没核实具体流程。
- 复测：2026-12-04 前后取 28 天 GSC、4 周 Bing，看上表 #1–#4、#6 的点击是否离开 0。
