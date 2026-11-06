# 53 国枢纽页“谁要填 / 谁不用填”（2026-11-06）

## 目标

接住“{国家} arrival card for {国籍}”“香港 / 台灣人要不要填”这类国籍长尾词（[10-14 长尾词规划](2026-10-14-country-longtail-keywords.md)“跨国规律”第 5 条，当时列为未处理）。53 个国家枢纽页（`content/{国家}/_index.md`、`_index.zh.md`，繁体由 `npm run sync:zh-hant` 生成）各补一节短段落：谁要填、谁不用填、按国籍或证件怎么算。

规则：

- 只写官方原文明确列出的适用对象和豁免对象，每条都有官方来源和原文摘录。
- 不给签证结论。电子签证类国家不逐国说谁免签，只给官方资格名单链接。
- 入境卡类国家可以从“所有外国人 / 所有非本国公民都要填”推出“印度、美国、香港护照同样要填”；目的地对某类人有特殊身份（中国对港澳台居民、台湾对港澳和大陆居民、马来西亚对新加坡公民、印度对 OCI 等）时必须有点名的官方原文，否则标“未核实”、不写。
- 链接全部走 `{{< source-link >}}`，新来源登记进 `data/official_urls/{国家}.toml`。

## 数据来源

| 来源 | 窗口 | 用法 |
|---|---|---|
| 10-14 长尾词表“枢纽页”一列的联想词 | 2026-10-14 | 联想词里的国籍词（for indians、for us citizens、香港、台灣人等），只当“有人在搜”的信号 |
| Bing 页面×查询（`data-exports/2026-11-06-bing/bing-get-page-query-stats.json`） | 2026-07-31 起 | 按国家汇总全部页面上带国籍、身份、过境、儿童、机组、免签、“要不要填”字样的查询 |
| GSC 页面×查询（`data-exports/2026-11-04-28d/gsc-page-query.json`） | 28 天 | 同上 |

筛选规则：查询含国籍或身份词（for {国籍}、citizen、passport holder、resident、OCI、dual、transit、cruise、crew、children、exempt、中国人、香港、台湾人、大陆、外国人、免签、过境、要不要填等），去掉地址、中间名、职业、费用类字段问题（归填写页和表单页）。下表每国取曝光最高的 6 条。数据导出在 gitignore 的 `data-exports/`，筛选脚本和逐国原始结果在调研现场 `/Volumes/ExternalProjects/Runtime/entrycardguide/nationality-hubs-20261106/input/`。

**结论：** 真实查询量最大的是土耳其“免签吗 / 需要签证吗”（Bing 合计 600+ 次曝光）和中国“外国人入境卡”，两者都属于签证或证件身份问题，本轮只写“这张表谁要填”，签证部分链官方页面。其余国家的国籍词以联想词为主，真实曝光个位数；过境、邮轮、儿童、本国公民回国（尼日利亚、新西兰、菲律宾）是数据里比国籍更常见的身份问题，一并写进段落。

## 各国真实查询与联想词

| 国家 | 表单 | Bing/GSC 真实身份类查询（曝光，B=Bing G=Google） | 联想词里的国籍词（10-14 词表） |
|---|---|---|---|
| aruba | ED Card | — | 阿鲁巴需要签证吗 |
| australia | ETA | does the australiaeta ap work for returning australian citizens（3 B）；do you need your birth certificate for evisitor application（2 B）；can a family oof 6 apply for australian eta visa toogehter（2 B）；after scan for australian eta, my full name is on family name, given name is empty（1 B）；do i need to include details in purpose of stay for subclass 651 visa?（1 B）；e ta number for australian（1 B） | australia eta for us citizens; 澳洲eta 香港 |
| azerbaijan | ASAN e-Visa | — | — |
| bahamas | C17 | exempt bahamas（3 G） | how to apply for bahamas visa; 巴哈马免签入境流程; 巴哈马免签政策详情; 巴哈马对中国人免签吗; 巴哈马免签证就可以直接去吗 |
| bahrain | eVisa | — | — |
| barbados | ED Form | how do we fill out a form for barbados immigration and customs if we cruised into barbados（3 B）；immigration and customs form for local residents when entering barbados（2 B）；how long berfor edo you need to complete barbados ed form（2 B）；barbados ed form flying crew（1 B）；do you fill arrival form to enter barbados if transiting（1 B）；do uk cruise visitors to barbados have to fill out a form（1 B） | 巴巴多斯免签政策 |
| brazil | eVisa | — | brazil evisa application for us citizens |
| cambodia | e-Arrival | 香港人辦理柬埔寨e-arrival card official website（2 B）；香港申請柬埔寨e-arrival（2 B）；柬埔寨 e-arrival 电子入境卡 申请 入境 中国公民（1 B） | cambodia e arrival card for uk citizens |
| canada | eTA | childcare worker how to put it in eta canada（1 B） | canada eta for us citizens |
| china | Arrival Card | 外国人入境卡网上填报（24 B）；外国人入境卡（9 B）；外国人入境填报回执（5 BG）；外国人入境网上填报（4 B）；外国人入境卡电子版（2 B）；国家移民管理局 外国人入境填报回执 national immigration administration entry declaration receipt for foreigner（2 B） | 中國入境卡 台灣; 中國入境卡 香港人; 中國入境卡 台灣人 |
| colombia | Check-Mig | do i need a check-mig form if arriving for one day on a cruise ship（1 B） | colombia transit visa requirements; travel visa for colombia; how to apply for colombia visa; 哥伦比亚入境中国免签吗; 哥伦比亚中国人入境政策; 哥倫比亞 columbia 台灣官網 外套 |
| cuba | D'Viajeros | — | travel visa for cuba; how to apply for cuba visa; 古巴入境卡需要买么; 古巴入境中国免签吗 |
| curacao | DI Card | — | 库拉索岛需要签证吗 |
| dominican | E-Ticket | dominican republic eticket for us citizens（7 G）；do you need an eticket for dominican republic（6 G）；dominican republic eticket for canadian citizens（6 G）；as a spanish citizen do i need to pay for e ticket dominican republic（2 B）；dominican republic e ticket instructions for departue after a cruise（2 B）；how to fill in domiocican repuclic entry form for a cruise（1 B） | dominican republic entry form for us citizens; dominican republic entry form for canadians; 多米尼加来中国免签吗 |
| egypt | e-Visa | official egypt visa website for canadians（2 B）；中国护照 埃及 电子签证 visa2egypt 落地签 条件 美签 申根 2026（1 B）；有埃及居住卡重新入境时还需要办理签证吗（1 B）；中国普通护照持有人前往埃及需要签证，但可选择提前办理电子签或在机场办理落地签，停留时间一般为30天。（1 B）；中国护照 埃及电子签证 网站（1 B）；egypt e-visa official website for americans turnaround time（1 B） | egypt e-visa for us citizens |
| ethiopia | eVisa | — | — |
| georgia | e-Visa | — | georgia e-visa for indians; georgia e visa for pakistani |
| india | e-Arrival Card | indian e-arrival card nationality code uk british citizen（4 B）；india e-arrival card official nationality code united kingdom british citizen country code（4 B）；e arrival card for indian passport holder gov（2 B）；official indian e-arrival card for foreign passport holders（2 B）；legitimate site for indian e-arrival card（2 B）；india arrival card for indian citizens?（2 B） | india e-arrival card for us citizens; india e-arrival card for oci holders; 印度入境需要什么材料 |
| indonesia | e-CD | 外国人填写印尼入境卡（2 B）；indonesia arrival immigration customs declaration indonesian citizens customs form official（1 B）；site.gov.uk indonesia all indonesia cruise passengers declaration（1 B）；入境印度尼西亚需要填写入境卡吗（1 B）；提醒赴印尼中国公民入境前填写all indonesia入境申报系统并办理合规签证_中华人民共和国驻印度尼西亚共和国大使馆（1 B）；過境印尼要什麼（1 B） | indonesia arrival card for us citizens; indonesia arrival card for australians; 印尼入境卡 香港 |
| israel | ETA-IL | israel eta for british citizens（2 G）；israel eta for uk citizens（1 G） | — |
| jamaica | C5 | passport immigration and citizenship agency c5 online（10 B）；electronic c5 passport immigration and citizenship agency entry form（2 B）；electronicc5pastportimmigrationandcitizenshipagency(pica)（1 B）；electronic c5 passport immigration and citizenship（1 B）；when did the electronic c5 passport immigration and citizenship agency form start（1 B）；what is a c5 form do i need one from germanydo germany have to complete a c5 form to enter jamaica（1 B） | 牙买加免签吗; 牙买加落地签需要什么 |
| japan | Visit Japan Web | where to enter cruise name in visit japan web（2 B）；do i need to add my return flight for japan vist web both my entry and return（1 B）；do i need to fill out visit japan web（1 B）；what is the link visa number for us entry form to japan（1 B） | japan arrival card for us citizens; japan arrival card for australians; japan arrival card for uk citizens; japan arrival card for uk |
| jordan | Pass | — | jordan pass for us citizens; jordan pass for indians |
| kenya | eTA | kenya eta exempt countries（1 G） | — |
| korea | e-Arrival Card | korea arrival card for us citizens（4 B）；要寫韓國入境卡 如果我只是轉機7小時 入境目的怎麼寫（3 B）；do you need to pay for a e arrival card for korea?（2 B）；site.e-arrivalcard.go.kr k-eta holders exempt arrival card（1 B）；korea e-arrival card minor signature parent guardian 17（1 B）；what info do you need to fill.out ecard for korea（1 B） | korea e arrival card for us citizens; korea arrival card for us citizens; korea arrival card for canadians; 韓國e arrival card 香港 |
| laos | eVisa | 持有老挝evisa是否免填入境卡（1 B）；laos evisa for us citizens official website（1 B）；how many entry points from thailand to laos for us citizen（1 B） | — |
| malaysia | MDAC | 马来 过境 卡 官方 入口（4 B）；what information do i include in mdac when i am transiting but will leave the airport for 3-4 hours（3 B）；what information do i include in mdac when i am transiting（3 B）；马来西亚过境卡（2 B）；马来西亚入境卡 豁免（2 B）；马来西亚入境卡持香港护照国籍和出生地填什么（2 B） | malaysia mdac for indians; malaysia arrival card for us citizens; malaysia arrival card for australians; malaysia arrival card for australian citizens; 馬來西亞入境卡香港; 馬來西亞mdac香港 |
| maldives | IMUGA | what info do you need for imuga（1 B）；how to fill minor declaration for maldives（1 B） | maldives arrival form for indian; maldives on arrival visa for indian |
| mexico | FMM-E | 航空入境墨西哥需不需要提前填写fmm（2 B）；mexico imigration form online for britih citizen（2 B）；mexico immigration form online for british citizen（2 B）；free fmm form for us citizens（2 B）；green card in fm（1 B）；入境墨西哥需不需要提前填写fmm（1 B） | do i need a tourist card for mexico; 墨西哥入境需要什么资料 |
| morocco | eVisa | — | morocco evisa for indians |
| myanmar | Tourist eVisa | myanmar visa requirements for us citizens（1 G）；缅甸电子签 入境果敢 老街 是否必须有邀请人 接受人 南伞口岸 外国人限制区 2025 2026（1 G） | myanmar tourist visa for us citizens; myanmar tourist visa for indian; myanmar tourist visa for bangladeshi; 緬甸電子簽證台灣 |
| nepal | Tourist Visa | visa for nepal on arrival（5 G）；on arrival visa for nepal（4 G）；尼泊尔 免签（3 B）；visa on arrival for nepal（3 G）；尼泊尔免签吗（2 B）；越南护照到尼泊尔落地签（2 B） | nepal tourist visa for us citizens |
| new-zealand | NZTD | how to complete nztd together with your children（8 B）；do i need to complete a new zealand declaration if i'm only staying in an airport?（4 B）；nztd 中国护照选哪个（4 B）；do new zealand passport holders have to fill in a nztd when returning to nz（2 B）；when did you last visit or live  in new zealand? what do i need to answer this（2 B）；how early do you need to get nee zealand travel declaration（1 B） | new zealand entry form for australians |
| nigeria | Landing & Exit Card | does a doual citizen need nigerian landing card?（1 B）；does a nigerian need a landing card（1 B）；do i need a landing card for nigeria（1 B）；do i need a landing card for nigeria if im a citizen（1 B）；must nigerian passport holders complete landing card to enter nigeria（1 B）；any complete digital entry forms depending on current rules nigeria for nigerian（1 B） | visa on arrival for nigeria |
| oman | eVisa | oman evisa netherlands 14 days visa exemption official royal oman police（1 B） | oman evisa for uae residents |
| pakistan | VPA | — | pakistan e visa for us citizens; pakistan e visa fee for us citizens |
| panama | DJV | going to panama on small cruise do i need to complete a customize declaration（1 B） | panama visa on arrival for americans; panama visa on arrival for tourists; panama transit visa application for americans; 巴拿马需要什么签证才能入境; 巴拿马转机需要过境签证吗 |
| peru | TAM Virtual | — | how to get a visa for peru; apply for peru visa; 秘鲁入境中国免签多少天 |
| philippines | eTravel | official site for philippines etravel（4 B）；step by step process to fill out etravel for tongan citizen entering manila（2 B）；how to fill out e travel registration for philippines arrival card（2 B）；fill in arrial card for philippines（2 B）；official philippines visa entry form for american  etravel declaration for 10 day stay（1 B）；philippines etravel official arrival card transit passengers 2026（1 B） | 菲律宾入境需要什么资料 |
| qatar | Hayya e-Visa | — | 卡塔尔电子签证免签吗 |
| russia | e-Visa | — | russia e-visa for indians |
| saudi-arabia | Tourist eVisa | — | saudi tourist visa for us citizens; saudi tourist visa for us green card holders; 沙烏地阿拉伯電子簽證台灣 |
| singapore | SGAC | entry form for singapore（8 B）；sgac hotel field for transit passengers（5 B）；details to fill up for singapore arrival card（4 B）；singapore arrival card last city port of embarkation before singapore disney cruise port（4 B）；sgda form for singapore（3 B）；singapore arrival health card uk citizen（2 B） | — |
| south-africa | Traveller Declaration | — | visa on arrival countries for south africans |
| sri-lanka | ETA | — | — |
| taiwan | TWAC | 入境台湾需要填写入境卡吗？（4 B）；非香港出生人士 台湾入境申请 网站（3 B）；香港入境台灣入境卡（3 B）；大陆去台湾线上登记表（2 B）；港人如何移民台灣?（2 B）；加拿大大陆人士入境台湾（2 B） | taiwan arrival card for us citizens; taiwan arrival card for australians; taiwan arrival card for canadians; 台湾入境卡; 台湾入境卡线上; 台湾入境卡 online arrival card; 台湾入境卡几时填; 台湾入境卡online; 台灣入境卡; 台灣入境卡線上; 台灣入境卡教學; 台灣入境卡香港; 台灣入境卡申請 |
| tanzania | eVisa | — | — |
| thailand | TDAC | 中国人泰国入境卡填写官网（2 B）；出发前填写tdac，不是办理落地签按已实施制度，非泰籍旅客通常需要在抵达前3天内提交泰国数字入境卡 tdac，以官方系统允许选择的日期为准。（2 B）；why cant i select the just transit checkbox while filling in the tdac?（2 B）；泰国 tdac 数字入境卡 填写 2026 中国游客 免签（1 B）；泰国 tdac 中国大陆 北京 出发 是否需要填写 官方（1 B）；tdac 中國香港名點填（1 B） | thailand tdac for us citizens; thailand tdac for indians; thailand arrival card for us citizens |
| turkey | e-Visa | 土耳其免签吗（214 B）；土耳其免签（194 B）；土耳其需要签证吗（92 B）；去土耳其需要签证吗（32 B）；土耳其免签中国吗（31 B）；土耳其免签么（17 B） | turkey e-visa for indians |
| uk | ETA | — | uk eta application for us citizens; uk eta for us citizens |
| usa | ESTA | cbp green card esta not needed（3 B）；esta visa for usa is this free（2 B）；esta visa for usa free（1 B）；why do i need to pay to check my esta（1 B）；do you have to pay for an esta for usa（1 B）；do you need to typically pay for the esta application for the us（1 B） | us esta application for uk citizens; us esta for uk citizens; 美国ESTA签证需要什么材料 |
| uzbekistan | eVisa | — | uzbekistan evisa for indians; uzbekistan evisa for pakistan; 烏茲別克電子簽證台灣 |
| vietnam | E-Visa | 中国公民申请越南电子签证官网（4 B）；official government site for evisa vietnam for canadians（2 B）；how to fill out a e visa for vietnam from usa（2 B）；identity card line for vietnam visa application（2 B）；how to select business or tourist visa for vietnam visa in application form（2 B）；how to fill up evisa for vietnam application（2 B） | vietnam e-visa for us citizens |

## 做法

1. **调研（Codex，4 进程并行）。** 任务书 `BRIEF.md`：每国回答“谁必须填、谁不用填、真实查询里的国籍或身份要不要填”，每条结论附官方 URL 和逐字原文；电子签国家不逐国下签证结论；只读仓库，产物写外盘 `out/{国家}.json`。53 国全部产出，约 1 小时。
2. **回源核对（主控）。** `tools/verify.mjs` 用 curl 抓每条来源，复用 `scripts/helpers/entry-quotes.mjs` 的归一化和匹配规则，检查原文是否还在页面上：Codex 给出的 195 条结论原文里，161 条 curl 直接匹配；3 条只差 `<abbr>` 展开（GOV.UK，人工看过原文）；22 条在 JS 渲染或拦截 curl 的页面上（加拿大 IRCC 8、美国 CBP 5、澳大利亚内政部 4、埃塞俄比亚 2、老挝 2、巴林 1），在内置浏览器里逐条核到；其余 9 条核不到，对应结论没有采用：美国国务院 VWP 页 2 条（403）、阿塞拜疆电子签条件页 2 条（Cloudflare 人机验证，没有绕过，该国只用站内已发布的说法和已登记链接）、缅甸电子签 FAQ、日本驻悉尼领馆 PDF、墨西哥驻英使馆页（Radware）、秘鲁国会新闻、卡塔尔 2022 年世界杯旧页各 1 条。主控另从回源缓存补核了 4 处：新加坡 ICA“All travellers must submit … except”原句、新西兰转机豁免的两个条件（24 小时内且不入境）、日本海关“纸质申报单仍可使用”、秘鲁 TAM Virtual“入境检查时自动生成”。
3. **换来源。** Codex 用菲律宾驻新加坡使馆的 PDF 支撑马来西亚豁免名单，改用已登记的马来西亚外交部页 `malaysia.exemptions`（11-06 curl 读到同一份 7 类名单）；中国改用已登记的驻洛杉矶总领馆通知 `china.consulate_notice`（同一份 7 类豁免）；墨西哥陆路改用已登记的 INM 申请页 `mexico.fmm`；秘鲁改用已登记的 `peru.record_explanation`（11-06 curl 读到“入境检查时自动生成”）；巴巴多斯港务公司、库拉索旅游局、Codex 提的巴基斯坦重复键没有采用。
4. **定稿（主控逐国手写）。** 每节 3 条：要填 / 不用填 / 按国籍或证件，加来源行。英文入境卡类标题 “Who has to file it”，电子签与电子旅行许可类 “Who applies, and who does not”，约旦 “Who buys it, and who does not”；中文对应“谁要填，谁不用填”“谁要申请，谁不用申请”“谁要买，谁不用买”。放在“Start here / 从这里开始”之后的第一个二级标题前；菲律宾中文页原已有“谁需要填写菲律宾 eTravel？”，只补一段按国籍说明。
5. **写作约束。** 中文粗体写成 `**要填**：`，冒号放在粗体外，否则 CommonMark 不闭合（首轮插入后在构建产物里发现，已改）。全部定稿过一遍禁用词（含 OpenCC 易错的“单只”“多只”“写明了”）。

脚本、原始产物、回源缓存和报告在 `/Volumes/ExternalProjects/Runtime/entrycardguide/nationality-hubs-20261106/`（`BRIEF.md`、`out/`、`tools/`、`report-verify.tsv`、`cache/`）。

## 顺带修正

- **越南枢纽页**删掉速记要点里“约 80 个国家的公民可以在线申请 e-visa”一条：越南驻美使馆公告写明电子签已向所有国家和地区公民开放，和新段落冲突。越南表单页、填写页如有同样说法，属于另一会话的文件，未改。
- 新登记来源 35 条，分布在 25 国的 `data/official_urls/*.toml`，`last_verified = "2026-11-06"`。这些条目也会进入站内“域名核对”工具的官方域名表，全部是政府、使领馆或政府门户域名（含旅游部 `godominicanrepublic.com`、越南驻美使馆 `vietnamembassy-usa.org`、新加坡外交部、英国 GOV.UK）。

## 各国写入内容

| 国家 | 类型 | 页面写的“不用填 / 例外”（中文摘要） | 引用的来源键 | 新登记 |
|---|---|---|---|---|
| aruba | ED Card（arrival_card） | 只有所乘船只需要办阿鲁巴入境手续的，才填 ED Card。 | official_guide, sustainability_fee | — |
| australia | ETA（travel_authorization） | 澳大利亚公民。持适用护照的双重国籍者也不能申请 ETA。 | eta601 | — |
| azerbaijan | ASAN e-Visa（evisa） | 外交部免签名单覆盖的旅客，名单写明护照类型、停留期限和生效日期。 | eligible_countries, visa_free | — |
| bahamas | C17（arrival_card） | 改为口头申报行李。 | airport_notice, customs_arriving | customs_arriving |
| bahrain | eVisa（evisa） | 海湾合作委员会国家公民，凭身份证就能入境巴林。 | national_id_entry, online_countries | national_id_entry |
| barbados | ED Form（arrival_card） | 居民、机组、机场转机的规定没找到现行官方原文，这里不列。 | visitor_rules | — |
| brazil | eVisa（evisa） | 护照本来不需要访问签证的，就没有电子签要办。 | visitor_eligibility | visitor_eligibility |
| cambodia | e-Arrival（arrival_card） | 我们读到的政府页面没有列豁免。柬埔寨公民、居民、机组、不入境转机的规定没找到官方原文，属于这几类的先问移民局。 | government_visitor_scope | government_visitor_scope |
| canada | eTA（travel_authorization） | 美国公民；身份有效的美国永久居民；用加拿大证件出行的加拿大公民（含双重国籍）；加拿大永久居民；多数情况下坐汽车、大巴、火车或船抵达的旅客。 | eligibility, eta_facts | eta_facts |
| china | Arrival Card（arrival_card） | 持外国人永久居留身份证；持港澳居民来往内地通行证（非中国籍）；持团体签证或符合团体免签入境；24 小时直接过境、不离开口岸限定区域；乘邮轮入出境并随原邮轮返回；走快捷通道入境；… | consulate_notice | — |
| colombia | Check-Mig（arrival_card） | Check-Mig 是免费的在线预登记，哥伦比亚移民局写明不强制使用。 | checkmig, service_guide | — |
| cuba | D'Viajeros（arrival_card） | 没找到给古巴公民、居民、机组或转机旅客免填的官方原文，这里不列。 | mandatory_notice | — |
| curacao | DI Card（arrival_card） | 库拉索居民。 | dicard, faq | — |
| dominican | E-Ticket（arrival_card） | 乘私人飞机、非商业船只、渡轮或邮轮抵达的旅客。儿童只是不填海关部分，整张 E-Ticket 还是要有。 | embassy_faq_usa, filing_exemptions, filing_scope | filing_exemptions, filing_scope |
| egypt | e-Visa（evisa） | 官网上没找到一般豁免的原文，这里不列。 | embassy_visa_requirements, faq | — |
| ethiopia | eVisa（evisa） | 持有效护照的肯尼亚、吉布提公民，免签入境。 | on_arrival, tourist | — |
| georgia | e-Visa（evisa） | 不离开国际中转区的旅客。 | about, evisa, faq | — |
| india | e-Arrival Card（arrival_card） | 持印度护照的印度公民不在填报范围内。 | portal_filing_advisory | portal_filing_advisory |
| indonesia | e-CD（arrival_card） | 走陆路入境的改用海关 e-CD，这是另一条申报渠道，不是免填。 | customs_arrival_channels, immigration_scope | customs_arrival_channels, immigration_scope |
| israel | ETA-IL（travel_authorization） | 以色列公民和持以色列身份号码的人。 | british_eta_guidance, eta_scope_notice | british_eta_guidance, eta_scope_notice |
| jamaica | C5（arrival_card） | 对访客和居民都免费。 | customs_passenger | — |
| japan | Visit Japan Web（arrival_card） | 海关建议在 Visit Japan Web 上做电子申报，纸质海关申报单仍然可以用。 | customs_declaration | customs_declaration |
| jordan | Pass（travel_authorization） | 持阿拉伯国家国籍的人。 | pass_faq | pass_faq |
| kenya | eTA（travel_authorization） | 肯尼亚永久居民，持有效工作许可、准证或再入境许可的人；东非伙伴国公民，180 天以内；官方 90 天和 60 天名单上的国籍；不出机场的转机旅客；不下船的乘船旅客；列入机组名单… | eligibility | — |
| korea | e-Arrival Card（arrival_card） | 韩国公民；持有效韩国居留证、永久居留证或海外同胞居留证的人；持有效 K-ETA 的人；外国航班乘务员；韩国出入境管理局列明的团体签证游客。 | faq, navigator_scope, subject_guide, system_scope_notice | navigator_scope, system_scope_notice |
| laos | eVisa（evisa） | 电子签网站上没找到一般豁免的原文，这里不列。 | faq, information, terms | — |
| malaysia | MDAC（arrival_card） | 新加坡公民；外交、公务护照持有人；马来西亚永久居民和长期准证持有人；持文莱 GCI 身份证明书或文莱马来西亚常旅客便利的人；持泰国边境通行证或印尼跨境旅行证件（PLB）的人。马… | exemptions, singapore_mdac_advice | singapore_mdac_advice |
| maldives | IMUGA（arrival_card） | 马尔代夫公民。移民局已停止要求马尔代夫人填写旅客申报。 | citizen_exemption, tourist_visa, traveller_declaration | citizen_exemption |
| mexico | FMM-E（arrival_card） | INM 说明，坐飞机入境不用填 FMMe。 | air_fmmd, fmm | air_fmmd |
| morocco | eVisa（evisa） | 去摩洛哥本来免签的，不用申请。 | evisa, terms | — |
| myanmar | Tourist eVisa（evisa） | 官方豁免名单上国家的普通护照持有人，在写明的免签期内旅游。 | tourist_eligibility | tourist_eligibility |
| nepal | Tourist Visa（evisa） | 没找到这张表的一般豁免原文，这里不列。 | china_tourist_visa | — |
| new-zealand | NZTD（arrival_card） | 在转机区停留 24 小时以内、不入境新西兰的转机旅客。 | air_transit, completion_guide, nztd | air_transit, completion_guide |
| nigeria | Landing & Exit Card（arrival_card） | 持尼日利亚护照出行的人。这个网站也不受理过境。 | faq, nis_overview | — |
| oman | eVisa（evisa） | 豁免名单上 100 多个国家和地区的访客，停留 14 天以内。 | eligibility, visa_exemption | — |
| pakistan | VPA（evisa） | 海湾合作委员会国家公民，商务和旅游免签。 | eligibility, gcc_exemption | — |
| panama | DJV（arrival_card） | 一个家庭只做一份申报。这是合并申报，不是免填。 | customs_process | — |
| peru | TAM Virtual（arrival_card） | TAM Virtual 在入境检查时自动生成，记录个人信息、出入境日期时间、口岸和获准停留期。 | record_explanation | — |
| philippines | eTravel（arrival_card） | 外国外交官及家属、外国政要及代表团、9(e) 签证、外交和公务护照（中文页原有段落） | faq | — |
| qatar | Hayya e-Visa（evisa） | 海湾合作委员会国家公民，去卡塔尔免签。 | hayya, visa_guide | — |
| russia | e-Visa（evisa） | 护照上已有有效俄罗斯签证的人。 | faq, instruction, nationalities | — |
| saudi-arabia | Tourist eVisa（evisa） | 官网列的是谁能申请，没找到豁免原文，这里不列。 | terms, tourist_evisa | — |
| singapore | SGAC（arrival_card） | 不过移民检查的转机旅客；经兀兰（Woodlands）、大士（Tuas）关卡入境的新加坡公民、永久居民和长期准证持有人。 | sgac_guidance | — |
| south-africa | Traveller Declaration（arrival_card） | 在指定转机区停留，或不离开原航班、原船只的空海路过境旅客。 | faq, processing_policy, rules, service | — |
| sri-lanka | ETA（travel_authorization） | 官方表格列出的外交、公务护照持有人，在表格写明的访问范围内。持有效居留签证或多次入境签证的，签证到期或取消前不能再申请新的 ETA。 | eta_faq, eta_scope, official_exemptions | eta_faq, eta_scope, official_exemptions |
| taiwan | TWAC（arrival_card） | 有户籍的国民；持上述证件的外国人；持单次入出境许可证、网签、落地签或中华民国居留证的港澳居民。 | egov_filing_scope, launch_notice | egov_filing_scope |
| tanzania | eVisa（evisa） | 官方免签名单上国家的公民。 | evisa, guidelines, visa_free_countries | visa_free_countries |
| thailand | TDAC（arrival_card） | 泰国公民；不过移民检查的转机旅客；持边境通行证（Border Pass）入境的人；机组人员。 | consulate_scope, faq, user_guide | consulate_scope |
| turkey | e-Visa（evisa） | 旅游或商务访问本来就免签的人。 | general_visa_guidance, mfa_visa_info | general_visa_guidance |
| uk | ETA（travel_authorization） | 英国和爱尔兰公民；持英国签证的人；获准在英国居住、工作或学习的人；不过边检的空侧转机旅客；持英国国民（海外）护照（BN(O)）或英国海外领土公民护照的人。 | eligibility, eta, eta_exemptions | eta_exemptions |
| usa | ESTA（travel_authorization） | 持加拿大护照的加拿大公民；同时是 VWP 国家公民的美国永久居民；持有效美国签证的人。 | esta_exemptions, esta_land, esta_visa_exemption | esta_exemptions, esta_land, esta_visa_exemption |
| uzbekistan | eVisa（evisa） | 享受免签制度国家的公民，行程符合免签条件时。 | visa_policy | — |
| vietnam | E-Visa（evisa） | 符合官方免签名单条件的旅客，在免签覆盖的入境里不用办。 | evisa_scope, visa_exemption_list | evisa_scope, visa_exemption_list |

## 未核实（页面不写）

下表是调研中查不到官方点名原文、因此没有写进页面的身份问题。签证、费用、字段填法类问题不在本轮范围，不列。

| 国家 | 未核实的问题 |
|---|---|
| aruba | 阿鲁巴居民、航空机组、当日过境旅客是否免填 ED Card |
| bahamas | 儿童、机组和不过关转机的完整豁免 |
| barbados | immigration and customs form for local residents when entering barbados；barbados ed form flying crew；do you fill arrival form to enter barbados if transiting；in-transit in barbados need immigration form?；how do we fill out a form for barbados immigration and customs if we cruised into barbados；儿童是否须单独填表 |
| cambodia | 柬埔寨公民、居民、外交护照、机组是否免填；儿童是否须独立记录；不过关转机、陆路与海路各口岸适用情况 |
| china | 中國入境卡 香港人；澳门中国籍居民；一般居留许可是否等同永久居留身份证豁免；儿童独立记录和外籍边民单独入口 |
| colombia | 儿童是否可合并在同行人申报内 |
| cuba | 古巴入境卡需要买么；古巴公民、居民、机组、外交护照和不过关转机的豁免；儿童是否必须单独提交表格 |
| curacao | 儿童是否须单独提交，及机组、外交护照、纯空侧转机和邮轮停靠的豁免 |
| egypt | 哪些群体不用申请埃及电子签 |
| india | 尼泊尔、不丹公民是否要填；儿童、机组及不过关转机的具体豁免 |
| indonesia | 過境印尼要什麼；site.gov.uk indonesia all indonesia cruise passengers declaration；儿童、外交护照、居留证持有人及其他免填类别 |
| jamaica | 儿童、机组、不过关转机旅客或邮轮旅客的豁免 |
| japan | 新入境外国人、再入境者、日本公民、SOFA 等具体外国人入国记录适用区别；同行儿童是否每人需独立入国记录二维码；电子申报当前完整适用机场及身份范围 |
| kenya | 肯尼亚公民是否豁免 eTA |
| korea | 要寫韓國入境卡 如果我只是轉機7小時 入境目的怎麼寫；korea e-arrival card minor signature parent guardian 17；SOFA、联合国证件、ABTC和上下船船员的全部附加条件 |
| malaysia | 马来西亚纯空侧转机是否免填 MDAC；儿童是否另填一份 MDAC |
| maldives | 不过关转机旅客、机组及特殊居留身份的申报豁免 |
| mexico | green card in fm；美国旅客 FMM 是否免费；墨西哥公民、居民、机组、儿童及海路旅客的完整豁免范围 |
| morocco | 使馆的一般免申请说明 |
| myanmar | 缅甸电子签 入境果敢 老街 是否必须有邀请人 接受人 南伞口岸 外国人限制区 2025 2026 |
| nepal | 一般免申请范围及印度公民是否免填此表；不适用落地签的完整名单 |
| new-zealand | 紧急医疗撤离、海上救援或天气备降是否免填；机组豁免 |
| nigeria | 外交、永久居留、ECOWAS 身份及儿童的特殊豁免 |
| panama | 不入境的空侧转机、机组或外交人员是否免申报 |
| peru | 各国籍、居民、儿童和所有陆海空口岸的当前覆盖范围 |
| philippines | philippines etravel official arrival card transit passengers 2026；儿童、婴儿是否须独立登记 |
| russia | 英国与西班牙、罗马尼亚双重国籍及多护照组合的个案资格 |
| saudi-arabia | 旅游电子签的一般免申请群体 |
| singapore | 儿童是否需独立 SGAC 记录 |
| taiwan | 加拿大大陆人士入境台湾；大陆居民其他非观光多次许可证、儿童及转机规则 |
| usa | 美国绿卡持有人中非 VWP 国籍是否不用 ESTA |

## 后续

- 4 周后（2026-12-04 前后）复查 Bing / GSC：国籍词（for indians、for us citizens、香港、台灣人）是否开始落到枢纽页，以及土耳其“免签吗”这类签证词的点击有没有变化。
- 未核实表里的身份问题，等官方补出原文再写；中国港澳台居民、印度对尼泊尔和不丹公民这两项搜索需求最明确。
- 阿塞拜疆电子签条件页有 Cloudflare 人机验证，下次月度审查用浏览器人工核一次。
