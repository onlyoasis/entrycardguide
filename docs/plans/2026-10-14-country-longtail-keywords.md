# 53 国国家页长尾词规划（2026-10-14）

## 结论

1. **中文用户搜的是“{国家}入境卡官网”，不是缩写。** Bing 上 11 周里，“泰国入境卡官网”一个词给 `/zh/thailand/tdac/` 带来 9,787 次曝光，平均第 6 位，只有 78 次点击。“马来西亚入境卡”4,546 次曝光、第 9 位、1 次点击。原中文标题以 TDAC、MDAC、e-Arrival Card 开头，“{国家}入境卡”在标题里不连续或根本没有。
2. **裸域名就是长尾词。** `tdac.immigration.go.th`（1,952 次）、`www.e-arrivalcard.go.kr`（937 次，另有“www.e-arrivalcard.go.kr 入境卡网址”1,338 次）这类查询都在核实官网。表单页标题现在直接写出官方域名。
3. **同一国家三页在抢同一个词。** “泰国入境卡官网”同时落在表单页（第 6 位）和枢纽页（第 8 位）；韩国的 `www.e-arrivalcard.go.kr` 在枢纽页的曝光（1,598）比表单页（937）还多。本轮按“表单页接官网词、填写页接怎么填、枢纽页接概览词”重新分工。
4. **长尾问题集中在五类：** 提前几天填、要不要打印/二维码怎么用、地址和姓名怎么填、填错了怎么改、能不能帮家人一起填。前三类本站页面已有答案，本轮写成 FAQ；“职业怎么填”“怎么修改”等没有可靠来源的，列为待核实内容缺口，没有编写。
5. **英文长尾是“{country} arrival card for {国籍}”和“how many days before”。** 例如 thailand tdac for indians、malaysia arrival card for singaporean。目前没有页面专门回答国籍问题，列入下一步。

## 数据与方法

| 来源 | 窗口 | 规模 | 用途 |
|---|---|---|---|
| GSC 页面×查询（`scripts/fetch-search-data.mjs --days=90`） | 2026-07-14 至 10-11 | 1,463 行（GSC 匿名化低频词，只占全站一小部分） | Google 排名与 CTR |
| Bing 页面×查询（`npm run fetch:bing-data -- --pages`，本轮新增） | 2026-07-31 起 11 周 | 132 个页面、9,971 行 | 主力流量来源的真实查询，按页面归属 |
| 搜索联想词：Google（en、zh-TW）、Bing（en-US、zh-CN、zh-TW）、百度 | 2026-10-14 | 每国 4 个英文种子、3 个简体种子、2 个繁体种子，约 950 次请求 | 没有流量数据的国家也能看到需求；只当“有人在搜”的信号，不代表搜索量 |
| SERP 重叠抽样（`claude-seo:seo-cluster` 方法） | 2026-10-14 | 2 组：马来西亚、韩国的“official website”对“how to fill” | 两组前 10 结果重叠 0–1 条，确认官网词和填写词应分属两页 |

数据导出在 `data-exports/2026-10-14-90d/` 和 `data-exports/2026-10-14-bing/`（gitignore）。查询意图按关键词规则归类：官网/入口/网址/费用/真假 → 表单页；怎么填/字段/二维码/打印/修改/时间 → 填写页；需不需要/免签/国籍/签证 → 枢纽页。没有修饰词的头部词（“泰国入境卡”）归表单页。

**限制：** 联想词没有搜索量；SERP 重叠只抽了 2 组，其余页面分工依据 Bing 实际落点；GSC 数据被匿名化，Google 侧的长尾判断偏少。

## 跨国规律

| 规律 | 证据 | 本轮处理 |
|---|---|---|
| 中文主词 = “{国家}入境卡”“{国家}电子签证”，后接“官网/官网入口/网址/填写官网” | 泰国、马来西亚、韩国、新加坡、菲律宾、印尼、柬埔寨的 Bing 头部查询；53 国的百度/Bing 联想词 | 中文表单页标题改为“{国家}入境卡官网：…”，电子签国家改为“{国家}电子签证官网：…” |
| 繁体用户搜“填寫範例”“教學”“要印出來嗎” | Google zh-TW 联想词：泰國入境卡填寫範例、馬來西亞 mdac 要印出來嗎、新加坡入境卡要印出來嗎 | 简体标题用“填写范例”，转繁体后正好是“填寫範例”；“要打印吗”写进 FAQ |
| 裸域名查询 | tdac.immigration.go.th、www.e-arrivalcard.go.kr、etravel.gov.ph官网、visa2egypt.gov.eg | 泰国、韩国、越南、柬埔寨、埃及等表单页标题写出官方域名 |
| 英文用户搜 “arrival card” 而不是表单缩写 | thailand arrival card、malaysia arrival card、philippines arrival card、cambodia e arrival card 的联想词 | 英文表单页、填写页标题加入 “Arrival Card” |
| 国籍长尾 | for indians、for us citizens、for singaporean、for malaysian、香港、台灣人 | 未处理，见下一步 |
| 枢纽页抢表单页的官网词 | 泰国、韩国、马来西亚、印度、新西兰枢纽页都拿到了官网类曝光 | 枢纽页标题去掉“官方网站”，改为“什么时候填、要准备什么”这类概览词 |

## 页面分工（每页一个主词）

| 页面 | 英文主词 | 简体主词 | 繁体主词 | 承接的长尾 |
|---|---|---|---|---|
| 表单页 `/{国家}/{表单}/` | {country} arrival card official website | {国家}入境卡官网 | {國家}入境卡官網 | 官网入口、网址、官方域名、免费吗、多少钱、真假、app |
| 填写页 `/{国家}/how-to-fill/` | how to fill {country} arrival card | {国家}入境卡怎么填 | {國家}入境卡填寫範例 / 教學 | 字段（职业、地址、姓名、航班号）、二维码、打印、提前几天、修改 |
| 枢纽页 `/{国家}/` | {country} arrival card guide / requirements | {国家}入境卡指南、入境要准备什么 | 同左 | 需不需要、国籍、与签证/K-ETA/e-VOA 的区别 |

电子签国家把“入境卡”换成“电子签证 / e-visa”，ETA 国家用表单代码（英国 ETA、美国 ESTA）。

## 本轮已实施

改动全部在数据文件和模板里，没有改内容文件，所以页面上 Git 推导的“Last verified”日期不会变。

| 文件 | 改动 |
|---|---|
| `data/seo/titles.toml` | 覆写表从 54 个页面键扩到 135 个，新增或改写 201 个标题/描述/H1 字段（英、简；繁体自动生成）。中文表单页标题含“{国家}+主名词”的从 22 国增至 46 国，中文填写页从 19 国增至 41 国；未改的多为海关申报、落地签、ETA 这类不该叫“入境卡”的表单。 |
| `data/seo/faq.toml` | 15 国填写页新增 36 组问答（英、简，繁体自动生成）：泰国、马来西亚、印尼、韩国、菲律宾、台湾、印度、日本、柬埔寨、越南、墨西哥、多米尼加、马尔代夫、牙买加、新西兰。连同已有的英国和 4 个 front matter FAQ，共 60 个填写页输出可见 FAQ 和 FAQPage。另一会话的未合并分支 `claude/faq-20261014`（beed86b）也给印尼、牙买加、印度、泰国等 7 页加了 FAQ；本轮删掉了与它重复的两条印尼问答（提交时间、海关二维码），其余问题不重叠。两边都在 `faq.toml` 末尾追加，合并时会有文本冲突，两段都保留即可。 |
| `layouts/_default/how-to-fill.html`、`i18n/*.yaml` | 填写页默认 H1 从“The fields where people get the official TDAC wrong”改为 “How to fill the Thailand TDAC: …”/“泰国 TDAC 怎么填：…”，53 国生效；`titles.toml` 的 `h1` / `h1_zh` 可覆写（秘鲁写“怎么查”、约旦写“怎么买”、尼泊尔写落地签表）。 |
| `layouts/_default/country-form.html` | 表单页 H1 同样支持 `h1` / `h1_zh` 覆写，10 个高需求国家已设置（例：“泰国入境卡（TDAC）官网 2026：…”）。 |
| `scripts/fetch-bing-search-data.mjs`、`docs/maintenance/search-data-api.md` | 新增 `--pages`，取 Bing 页面×查询数据，供复测。 |

所有新描述和 FAQ 答案只复述本国页面已发布的事实，逐条核对过出处（例：马来西亚“不需要打印”出自填写页“提交后会发生什么”；台湾“扫描护照即可调出记录”出自枢纽页速记要点）。

**验证：** `npm run check:zh-hant`、`npm run build:prod`（EN 478 / ZH 476 / ZH-Hant 476 页）、`npm run check:seo` 全部通过；全站 0 个重复标题；60 个填写页的 FAQPage JSON-LD 全部可解析；本地浏览器检查 `/zh/thailand/how-to-fill/`（H1、FAQ 区块）和 `/zh/korea/e-arrival-card/`（375px 宽度无横向溢出、控制台无报错）。

## 内容缺口（需先在官方表单或官方公告核实，再写进页面）

按曝光排序。核实后改 `data/fields/{国家}.toml` 或正文，并按 CLAUDE.md 刷新核验日期。

| 优先级 | 国家 | 长尾需求 | 证据 | 现状 |
|---|---|---|---|---|
| P1 | 韩国 | 支持简体中文吗、提前多久填、二维码、电话、家属地址、纸本还能用吗 | “www.e-arrivalcard.go.kr 支持简体中文”307 次曝光；联想词：韩国入境卡提前多久填、韩国e-arrival二维码一直转、韓國入境卡 電話 | 填写页只有 8 张字段卡，没有提交时间、语言、二维码、同行人说明。曝光第二大的国家，内容最薄。 |
| P1 | 韩国 | `www.e-arrivalcard.go.kr scan`（2,216 次曝光）、`のみ`（415 次） | Bing 页面×查询 | “scan”可能是 scam 的错拼，也可能指扫码；“のみ”是日语用户在确认唯一官网。表单页可加一句“唯一官网”的日语提示需另议。 |
| P1 | 泰国 | 职业怎么填、旅行目的、运输方式、居住国怎么填 | 6 条百度/Bing 联想词；GSC “thailand tdac form occupation dropdown options”；繁体“泰國tdac 職業” | `data/fields/thailand.toml` 没有这几个字段。需在 tdac.immigration.go.th 核对实际字段和下拉选项。 |
| P1 | 泰国 | 电话号码填错的影响 | GSC “tdac 电话号码 错误 影响 处理”第 6 位 | 页面只说电话可选，没讲填错后果。 |
| P2 | 马来西亚 | 填错了怎么修改、怎么查看是否成功、验证码不出来、下载 PDF | 百度联想词 7 条 | 页面没有修改和查询流程。 |
| P2 | 新加坡 | 国家地区代码、居住地、填错了怎么办、怎么查看已提交 | 百度联想词 | 填写页 FAQ 写在 front matter 里，`faq.toml` 不生效；补充需改内容文件。 |
| P2 | 菲律宾 | 职业怎么填、创建账号没反应、出境也要填吗、被拒绝 | 联想词（简繁） | 页面没有账户和出境说明。 |
| P2 | 印度 | OCI 持有人怎么填、有中文版吗 | 英文联想词多条 “for oci holders” | 页面提到 OCI 要填，没有逐项说明。 |
| P2 | 日本 | 同行家人怎么加、免税二维码、多久前申请 | 繁体联想词 | 页面没有。 |
| P3 | 柬埔寨 | App 下载、回程日期改签怎么填 | 百度联想词 | 页面没有。 |
| P3 | 墨西哥 | 英文 Google 排名弱（“fmm mexico”第 64 位） | GSC | 标题已改；需要外链和英文页内链。 |
| P3 | 各国 | 国籍长尾（for indians / for us citizens / 香港人 / 台灣人） | 英文、繁体联想词 | 需要按国籍确认是否要填、能否免签，涉及签证规则，应从官方来源逐国核实。 |

## 发现的问题（未改）

- **多米尼加家庭申报说法不一致。** 英文枢纽页写 “one adult can file for the whole family in a single E-Ticket”；中文表单页（2026-10-12 复核）写“每位旅客都需要提供资料，按官方表格中的团体选项填写”。本轮新描述用了谨慎的中文页说法；英文枢纽页需要按 DGM 现行页面复核后统一。
- **繁体用“臺灣”，台湾用户多搜“台灣”。** OpenCC 把“台湾”转成“臺灣”，全站繁体一致如此。Google 通常把两者视为同义，暂不改转换规则；如果繁体台湾页长期没有曝光，再评估在 `scripts/zh-hant/core.mjs` 加例外。
- **中国、南非、尼日利亚零数据。** 三国内容 2026-10-02 提交，10-13 随静态版上线，还没有搜索数据，属正常。中国入境卡的联想词需求很大（中国入境卡什么时候填、提前几天、怎么填、china arrival card for malaysian），2 周后应优先复查收录。

## 监测

- **2026-10-28（两周后）：** `node scripts/fetch-search-data.mjs --days=14` 和 `npm run fetch:bing-data -- --pages`。看这几组：“泰国入境卡官网”“马来西亚入境卡”“韩国入境卡官网”“www.e-arrivalcard.go.kr”在表单页的 Bing 排名和点击；对应枢纽页是否不再出现这些词。
- **成功标准：** 上述 4 组 Bing 点击率从当前 0–1%（泰国入境卡官网 0.8%）提高；表单页平均排名不低于改动前（第 6–9 位）。如果排名下降超过 2 位，回滚对应国家的标题。
- **2026-11-11（四周后）：** 复查中国、南非、尼日利亚的收录和曝光；按上表 P1 内容缺口的核实进度补内容。

---

## 附：53 国长尾词表

按 90 天 GSC + 11 周 Bing 合计曝光排序。“有曝光的长尾词”取该页曝光前 6 的查询（同义 URL 写法去重），B = Bing 平均曝光位置，G = Google 平均位置。“联想词需求”按上文意图规则分到该页，每种语言最多 4–5 个，没有就写“—”。现标题是本轮改后的版本。

### 1. 泰国 Thailand（TDAC）

90 天 GSC + 11 周 Bing：曝光 23,356，点击 211，有曝光的查询 469 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/thailand/tdac/` | Thailand Arrival Card (TDAC) Official Website: Free, Scam Check (2026) / 泰国入境卡官网：TDAC 免费填写入口 tdac.immigration.go.th | 泰国入境卡官网（9,787 / B6）；tdac.immigration.go.th（1,952 / B6）；泰国入境卡（1,169 / B10）；泰国电子入境卡官网（969 / B7）；tdac入境卡官网入口（640 / B7）；tdac immigration go th（527 / B7） | thailand tdac、thailand tdac official website、thailand tdac form、thailand tdac official / 泰国入境卡官网、泰国入境卡、泰国入境卡tdac官网、泰国入境卡官网入口 / 泰國入境卡、泰國入境卡教學、泰國入境卡申請、泰國入境卡官網 | — |
| 填写页 `/thailand/how-to-fill/` | How to Fill the Thailand Arrival Card (TDAC): Every Field (2026) / 泰国入境卡怎么填：TDAC 逐项填写范例与易错字段 | tdac（17 / B9）；thailand passport number format（13 / G2）；泰国入境卡怎么填（9 / B8）；泰国tdac官网入口（7 / B9）；thailand tdac form occupation dropdown options（5 / G45）；tdac 电话号码 错误 影响 处理（5 / G6） | thailand arrival card when to apply、thailand arrival card how many days before、how to fill thailand arrival card、how to fill thailand arrival card online、how to complete thailand arrival card / 泰国入境卡填写、泰国入境卡职业怎么填、泰国入境卡填写官网、泰国入境卡怎么填、泰国入境卡填写样本2025 / 泰國入境卡填寫、泰國入境卡填寫範例、泰國入境卡怎麼填、泰國入境卡 職業、泰國入境卡填寫教學 | 3 |
| 枢纽页 `/thailand/` | Thailand Arrival Card (TDAC) Guide: When to File, What to Bring / 泰国入境卡 TDAC 指南：什么时候填、要准备什么 | tdac.immigration.go.th（649 / B8）；tdac入境卡官网入口（490 / B7）；泰国入境卡官网（332 / B8）；泰国入境卡tdac官网（184 / B8）；tdac（172 / B9）；泰国入境卡官网入口（157 / B8） | thailand tdac for us citizens、thailand tdac for indians、thailand tdac requirements、thailand tdac visa、thailand arrival card for us citizens / — / 泰國tdac簽證 | — |

### 2. 韩国 South Korea（e-Arrival Card）

90 天 GSC + 11 周 Bing：曝光 21,940，点击 93，有曝光的查询 719 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/korea/e-arrival-card/` | Korea e-Arrival Card Official Website: e-arrivalcard.go.kr, Free / 韩国入境卡官网：电子入境卡 www.e-arrivalcard.go.kr 免费 | www.e-arrivalcard.go.kr 入境卡网址（1,338 / B6）；e arrival card korea（1,100 / B7）；www.e-arrivalcard.go.kr scan（1,015 / B8）；www.e-arrivalcard.go.kr（937 / B9 G10）；korea e arrival card（920 / B6）；e-arrival card korea（784 / B7） | korea e-arrival card、korea e-arrival card online、korea e-arrival card website、korea e-arrival card official website / 韩国入境卡、韩国入境卡官网、韩国入境卡电子版、韩国入境卡网上填报 / 韓國入境卡、韓國入境卡線上、韓國入境卡教學、韓國入境卡 電話 | — |
| 填写页 `/korea/how-to-fill/` | How to Fill the Korea e-Arrival Card: Field-by-Field Guide (2026) / 韩国入境卡怎么填：e-Arrival Card 电子入境卡逐项说明 | e-arrival card korea（90 / B8）；e-arrival card 韓国（47 / B6）；韩国e arrival card（25 / B6）；韩国入境卡填写（17 / B6）；www.e-arrivalcard.go.kr scan（16 / B9）；www.e-arrivalcard.go.kr 支持简体中文（16 / B7） | korea arrival card qr code、korea arrival card declaration、how to fill korea arrival card、how to fill korea e arrival card、how to fill out korea arrival card for layover / 韩国入境卡填写、韩国入境卡填写官网、韩国入境卡申报官网、韩国入境卡电子版二维码、韩国入境卡提前多久填 / 韓國入境卡填寫、韓國入境卡填寫範例、韓國入境卡線上填寫、韓國入境卡填寫dcard、韓國入境卡填寫教學 | 4 |
| 枢纽页 `/korea/` | South Korea e-Arrival Card Guide: Free, and Not the K-ETA / 韩国入境卡指南：e-Arrival Card 与 K-ETA、Q-Code 的区别 | www.e-arrivalcard.go.kr（1,598 / B9 G7）；www.e-arrivalcard.go.kr 入境卡网址（1,437 / B6）；www.e-arrivalcard.go.kr scan（1,055 / B8）；韩国电子入境申报官网（465 / B9）；www.e-arrivalcard.go.kr官网入口（231 / B7）；www.e-arrivalcard.go.kr のみ（211 / B7） | korea e-arrival card vs k-eta、korea e arrival card for us citizens、korea arrival card for us citizens、korea arrival card for canadians、how to answer korean visa application form / — / 韓國e arrival card 香港 | — |

### 3. 马来西亚 Malaysia（MDAC）

90 天 GSC + 11 周 Bing：曝光 13,188，点击 64，有曝光的查询 795 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/malaysia/mdac/` | Malaysia Arrival Card (MDAC) Official Website: Free, Who Needs It / 马来西亚入境卡官网：MDAC 免费入口、豁免名单与提交时间 | 马来西亚入境卡（4,546 / B9）；马来西亚入境卡官网（1,705 / B9）；mdac马来西亚电子入境卡官网（640 / B8）；mdac入境卡官网（612 / B8）；马来西亚电子入境卡官网（214 / B9）；马来西亚入境卡官网入口（57 / B8） | malaysia mdac、malaysia mdac official website、malaysia mdac form、malaysia mdac card / 马来西亚入境卡、马来西亚入境卡官网、马来西亚入境卡mdac、马来西亚入境卡官网madc / 馬來西亞入境卡、馬來西亞入境卡教學、馬來西亞入境卡中文版、馬來西亞入境卡申請 | — |
| 填写页 `/malaysia/how-to-fill/` | How to Fill the Malaysia Arrival Card (MDAC): Field Guide (2026) / 马来西亚入境卡怎么填：MDAC 护照、行程和住宿地址字段 | 马来西亚入境卡（444 / B9）；mdac入境卡官网（145 / B9）；马来西亚入境卡填写（109 / B7）；mdac（81 / B9）；马来西亚入境卡怎么填（33 / B7）；马来西亚mdac（22 / B6） | malaysia arrival card for china passport、how to fill malaysia arrival card、how to complete malaysia arrival card、how to fill malaysia arrival form、how to fill malaysia digital arrival card / 马来西亚入境卡填写、马来西亚入境卡怎么填、马来西亚入境卡填写官网、马来西亚入境卡填写教程、马来西亚入境卡中文版在线填写 / 馬來西亞入境卡填寫、馬來西亞入境卡填寫範例、馬來西亞入境卡填寫教學、馬來西亞mdac填寫教學、馬來西亞mdac填寫 | 4 |
| 枢纽页 `/malaysia/` | Malaysia Arrival Card (MDAC) Guide: When to File, What You Need / 马来西亚入境卡 MDAC 指南：什么时候填、要准备什么 | 马来西亚入境卡（705 / B9）；mdac入境卡官网（463 / B8）；mdac马来西亚电子入境卡官网（435 / B9）；马来西亚入境卡官网（379 / B9）；imigresen-online.imi.gov.my mdac（146 / B9）；马来西亚入境卡填写（94 / B8） | malaysia mdac for indians、malaysia arrival card for us citizens、malaysia arrival card for australians、malaysia arrival card for australian citizens、do i need to fill in malaysia arrival card / — / 馬來西亞入境卡香港、馬來西亞mdac香港 | — |

### 4. 新加坡 Singapore（SGAC）

90 天 GSC + 11 周 Bing：曝光 12,401，点击 96，有曝光的查询 964 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/singapore/sgac/` | Singapore Arrival Card: Official ICA Service, Free SGAC and Exemptions / 新加坡入境卡 SGAC：ICA 免费官网、提交时间与豁免条件 | singapore arrival card（3,457 / B6）；sg arrival card（2,154 / B6）；新加坡入境卡（1,129 / B6）；新加坡入境卡官网（711 / B6）；ica（567 / B8）；singapore arrival card online（274 / B7） | singapore sgac、singapore sgac card、singapore sgac arrival card、singapore sgac official website / 新加坡入境卡、新加坡入境卡在线申请、新加坡入境卡官网、新加坡入境卡在线申请官网 / 新加坡入境卡、新加坡入境卡教學、新加坡入境卡中文版、新加坡入境卡申請 | — |
| 填写页 `/singapore/how-to-fill/` | SG Arrival Card (SGAC) How to Fill: Name, Dates, Last Port / 新加坡入境卡怎么填：姓名顺序、三天窗口与 SGAC 确认信息 | sgac arrival card（69 / B9）；singapore arrival card（44 / B8）；sg arrival card（27 / B8 G21）；sg arrival card (sgac)（20 / B7）；singapore immigration form（17 / G50）；singapore arrival card (sgac)（14 / B7） | singapore sgac declaration / 新加坡入境卡填写、新加坡入境卡填写官网、新加坡入境卡填写指南、新加坡入境卡怎么填、新加坡入境卡填寫 / 新加坡入境卡填寫、新加坡入境卡填寫教學、新加坡入境卡範例、新加坡入境卡填写、新加坡入境卡怎么填 | — |
| 枢纽页 `/singapore/` | Singapore Arrival Card (SGAC) Guide: Official ICA Site, Free / 新加坡入境卡 SGAC 指南：ICA 入境卡怎么填与常见问题 | singapore entry card（35 / B8）；singapore arrival card（29 / B9）；sgac（16 / B8 G47）；sgac singapore（4 / B8）；singapore arrivals card（4 / B6）；singapore arrival card date picker 31 july not available 28 29 30 only（4 / B6） | — / — / — | — |

### 5. 印度尼西亚 Indonesia（All Indonesia）

90 天 GSC + 11 周 Bing：曝光 3,011，点击 48，有曝光的查询 861 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/indonesia/e-cd/` | Indonesia Arrival Card (All Indonesia / e-CD): Official Site, Free / 印尼入境卡官网：All Indonesia 入境申报免费入口（e-CD） | 印尼入境卡官网（263 / B8）；印尼入境申报（182 / B9）；印度尼西亚入境卡官网（150 / B7）；all indonesia（88 / B5）；indonesia customs declaration online（68 / B6）；ecd bali（31 / B5 G25） | indonesia all indonesia、indonesia all indonesia arrival card、indonesia ibl all indonesian、imigrasi indonesia all indonesia / 印度尼西亚入境卡、印度尼西亚入境卡官网、印度尼西亚入境卡网址、印度尼西亚电子入境卡 / 印尼入境卡、印尼入境卡教學、印尼入境卡申請、印尼入境卡 團體 | — |
| 填写页 `/indonesia/how-to-fill/` | Indonesia e-CD Customs Declaration: How to Fill Every Field / 印尼入境卡怎么填：All Indonesia / e-CD 海关申报逐项说明 | indonesia customs declaration（39 / B7 G7）；e declaration form indonesia（34 / G8）；customs declaration indonesia（16 / G15）；indonesia passport number format（8 / G4）；indonesian customs declaration（5 / B10 G9）；e-cd indonesia（4 / G8） | how to fill indonesia arrival card、how to fill indonesia arrival card online、how to fill indonesia arrival card for singaporean、how to complete indonesia arrival card、how to fill all indonesia arrival card / 印度尼西亚入境卡填写、印度尼西亚入境卡二维码、印度尼西亚入境卡填写样本、印度尼西亚入境卡怎么填写、印度尼西亚入境卡填写样本2019 / 印尼入境卡填寫、印尼入境卡填寫教學、印尼入境卡填写、印尼入境卡填写官网、印尼入境卡填写网站 | 2 |
| 枢纽页 `/indonesia/` | Indonesia Entry Forms: Arrival Card, e-CD and e-VOA Guide / 印尼 All Indonesia 入境申报、e-CD 海关记录和巴厘岛入境指南 | arrival card indonesia（42 / G72）；印尼入境卡官网（26 / B9）；indonesia arrival card（23 / G76）；印尼入境申报（17 / B9）；arrival card indonesia price（13 / G39）；immigration card indonesia（13 / G78） | indonesia visa all indonesia、evisa indonesia all indonesia、indonesia arrival card for us citizens、indonesia arrival card vs visa、indonesia arrival card for australians / 印尼 visa on arrival / 印尼入境卡 香港 | — |

### 6. 台湾 Taiwan（TWAC）

90 天 GSC + 11 周 Bing：曝光 2,819，点击 96，有曝光的查询 308 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/taiwan/twac/` | Taiwan Arrival Card (TWAC): Official Site, Free, 7-Day Window (2026) / 台湾入境卡官网：入境登记表 TWAC 免费，抵达前 7 天内提交 | taiwan arrival card（934 / B7 G46）；taiwan arrival card online（290 / B7）；twac taiwan arrival card（236 / B7 G40）；twac（196 / B7 G46）；台湾入境（63 / B7）；台湾入境卡（49 / B6） | taiwan arrival card、taiwan arrival card online、taiwan arrival card government website、taiwan arrival card online application / — / — | — |
| 填写页 `/taiwan/how-to-fill/` | How to Fill the Taiwan Arrival Card: All 13 Items (2026) / 台湾入境卡怎么填：入境登记表 13 项资料逐段说明（2026） | how to fill out taiwan arrival card（3 / G42） | taiwan arrival card when to fill out、how to fill taiwan arrival card、how to fill taiwan arrival card online、how to complete taiwan arrival card、how to fill out taiwan arrival card for filipino / 台湾入境卡填写、台湾入境卡怎么填、台湾入境卡网上填写、台湾入境卡网上填写外国人、台湾入境卡填写样本 / 台灣入境卡 填寫、台灣入境卡填寫 | 3 |
| 枢纽页 `/taiwan/` | Taiwan Arrival Card (TWAC) Guide: 7-Day Window, No Printout / 台湾入境卡指南：入境登记表 TWAC 7 天窗口，不用打印 | 台湾入境卡（24 / B6）；twac（17 / B6）；台湾入境（12 / B8）；https://twac.immigration.gov.tw/（8 / B7）；twc（6 / B6）；台湾入境许可网址（4 / B4） | taiwan arrival card for us citizens、taiwan arrival card visa type、taiwan arrival card for australians、taiwan arrival card for canadians、how to get taiwan visa / 台湾入境卡、台湾入境卡线上、台湾入境卡 online arrival card、台湾入境卡几时填、台湾入境卡online / 台灣入境卡、台灣入境卡線上、台灣入境卡教學、台灣入境卡香港、台灣入境卡申請 | — |

### 7. 菲律宾 Philippines（eTravel）

90 天 GSC + 11 周 Bing：曝光 1,829，点击 23，有曝光的查询 427 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/philippines/etravel/` | Philippines eTravel Official Website: Free Arrival QR Code (2026) / 菲律宾入境卡官网：eTravel 电子入境申报免费入口 | e travel philippines 2026（163 / B7）；etravel（139 / B9 G42）；etravel philippines official site（100 / B9）；菲律宾入境码 etravel（81 / B8）；菲律宾入境卡官网（80 / B5）；菲律宾etravel（58 / B9 G11） | philippines etravel、philippines etravel registration、philippines etravel form、philippines etravel app / 菲律宾入境卡、菲律宾入境卡官网、菲律宾入境卡官网入口、菲律宾入境卡etravel / 菲律賓入境卡、菲律賓入境卡線上、菲律賓入境卡教學、菲律賓入境卡 紙本 | — |
| 填写页 `/philippines/how-to-fill/` | How to Fill the Philippines eTravel Arrival Card: Field Guide (2026) / 菲律宾入境卡怎么填：eTravel 填写步骤与二维码 | 菲律宾etravel（14 / B8）；菲律宾入境卡（13 / B7）；菲律宾入境码（9 / B7）；菲律賓入境表格（7 / G43）；菲律宾入境码 etravel（6 / B8）；etravel philippines is it better to give the adress of a relative rather than condo för 1 week?（5 / B3） | philippines etravel health declaration form、philippines etravel declaration、philippines etravel qr code、philippines etravel online declaration、how to fill up e arrival card philippines / 菲律宾入境卡填写、菲律宾入境卡填写模板2024、菲律宾入境卡线上申报、菲律宾入境卡填写样本、菲律宾入境卡最新样本 / 菲律賓入境卡填寫、菲律賓入境卡填寫教學、菲律賓etravel填寫教學、菲律賓etravel填寫、菲律賓etravel申請時間 | 3 |
| 枢纽页 `/philippines/` | Philippines eTravel Guide: What to Prepare, Free QR Code / 菲律宾入境卡 eTravel 指南：要准备什么、二维码怎么用 | 菲律宾入境卡官网（70 / B6）；菲律賓 etravel（31 / G20）；etravel 菲律賓（24 / G25）；菲律宾etravel申报系统（20 / B7）；菲律賓電子入境申報系統（19 / G6）；菲律宾etravel（16 / B8） | philippines etravel requirements、arrival requirements in philippines、can i get a visa on arrival in philippines、visa and arrival card philippines / 菲律宾入境需要什么资料 / — | — |

### 8. 印度 India（e-Arrival Card）

90 天 GSC + 11 周 Bing：曝光 1,708，点击 80，有曝光的查询 621 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/india/e-arrival-card/` | India e-Arrival Card Official Site: Is It Free? (2026) / 印度入境卡官网：e-Arrival Card 免费吗？e-Visa 另算（2026） | e arrival card india（135 / B9 G52）；india arrival card（120 / B9）；e arrival india（59 / B9）；arrival card india（54 / B8 G49）；indian arrival card（42 / B9）；india e arrival card（40 / B9 G52） | india e-arrival card、india e-arrival card online、india e-arrival card for oci、india e-arrival card portal / 印度入境卡、印度入境卡官网入口、印度入境卡2025、印度入境卡2025版本最新 / 印度入境卡、印度入境卡電子、印度入境卡2026、印度入境卡 2025 | — |
| 填写页 `/india/how-to-fill/` | India e-Arrival Card: All 15 Fields, Phone Code, India Address / 印度入境卡怎么填：e-Arrival Card 15 个字段（2026） | 印度入境卡（20 / B8）；印度入境卡填寫（16 / G10）；印度电子入境卡（11 / B7）；how to fill e arrival card india（7 / B6）；india entry solutions（5 / G87）；select if you will travel further within india or abroad after arrival. fill details for your selection.（5 / B5 G11） | how to fill india e arrival card、how to fill india e arrival card online、how to complete india e arrival card、how to fill india e arrival form、how to fill digital arrival card india / 印度入境卡填寫、印度入境卡填写、印度入境卡已填好样本、印度电子入境卡填写、印度入境卡填写示范 / 印度入境卡填寫、印度入境卡下載、印度入境卡線上填寫、印度入境卡填写、印度入境卡已填好样本 | 2 |
| 枢纽页 `/india/` | India e-Arrival Card Guide: 72-Hour Rule, e-Visa and Fees / 印度入境卡指南：72 小时规则、谁要填、e-Visa 另算 | 印度入境卡（52 / B6）；https://indianvisaonline.gov.in/earrival/（38 / B6）；印度入境卡官网入口（33 / B4）；印度电子入境卡（11 / B5）；印度电子入境卡官网（9 / B3）；https://indianvisaonline.gov.in（7 / B5） | india e-arrival card for us citizens、india e-arrival card for oci holders、india e-arrival card requirements、can you get india visa on arrival / 印度e-visa对中国开放了吗、印度入境需要什么材料 / — | — |

### 9. 多米尼加 Dominican Republic（E-Ticket）

90 天 GSC + 11 周 Bing：曝光 1,574，点击 46，有曝光的查询 171 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/dominican/eticket/` | Dominican Republic E-Ticket: Official Site, Free Form, No Fees (2026) / 多米尼加入境卡官网：E-Ticket 免费填写，防中介收费 | e ticket dominican republic（398 / B7）；dominican republic e ticket official site（142 / B6）；dominican republic e ticket（120 / B7）；e-ticket dominican republic（116 / B6）；dominican republic e-ticket application form（94 / B6）；e ticket dominican republic free（79 / B5） | dominican republic e-ticket、dominican republic e-ticket portal、dominican republic e-ticket application、dominican republic e-ticket free / 多米尼加最新入境规定、ドミニカ共和国 e-ticket / — | — |
| 填写页 `/dominican/how-to-fill/` | How to Fill the Dominican Republic E-Ticket (2026) / 多米尼加入境卡怎么填：E-Ticket 易错字段和二维码（2026） | what is the identification number for dominican republic e ticket instructions pdf（4 / B9） | dominican republic e-ticket health declaration、dominican republic e-ticket qr code、dominican republic passport card、passport card for dominican republic、how to fill in dominican republic entry form / 多米尼加旅游签证期限多久、多米尼加护照免签国家一览表 / — | 2 |
| 枢纽页 `/dominican/` | Dominican Republic E-Ticket Guide: When to File, What You Need / 多米尼加入境卡 E-Ticket 指南：什么时候填、要准备什么 | 多米尼加扫码支付（12 / G84）；dominican republic entry fee（8 / G38）；dominican republic exit fee（7 / G26）；check mig dominican republic（3 / G33）；dominican departure tax（3 / G36）；dominican republic exit tax（3 / G30） | dominican republic e ticket visa、dominican republic e-ticket visa、dominican republic entry form for us citizens、dominican republic entry form for canadians / 多米尼加来中国免签吗、多米尼加签证怎么办理、多米尼加签证办理流程、多米尼加签证官网入口、多米尼加签证申请材料清单 / — | — |

### 10. 墨西哥 Mexico（FMM-E）

90 天 GSC + 11 周 Bing：曝光 1,168，点击 33，有曝光的查询 400 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/mexico/fmm/` | Mexico FMM Form Online (FMM-E): Official INM Site, Free (2026) / 墨西哥入境卡官网：FMM-E 电子入境表免费在线填写 | fmme（111 / B4 G34）；fmm 墨西哥（76 / G10）；fmm mexico form online（41 / B9）；墨西哥入境卡（28 / B2 G11）；fmm（15 / B7 G21）；official mexico fmm online application（12 / B8） | fmm mexico entry、mexico entry fmm form、mexico fmm form english、fmm mexico multiple entry / 墨西哥入境卡、墨西哥fmm入境卡、墨西哥电子入境卡、墨西哥入境卡网站 / 墨西哥入境卡 | — |
| 填写页 `/mexico/how-to-fill/` | How to Fill the Mexico FMM Form Online (FMM-E): Every Field / 墨西哥入境卡怎么填：FMM-E 每个字段和常见错误 | — | passport card for mexico、us passport card travel to mexico、form to fill out to enter mexico、form to fill out before entering mexico、how to fill mexico visa application form / 墨西哥入境卡填写模板、墨西哥入境卡怎么填写、墨西哥入境卡样本、墨西哥入境卡填写 / 墨西哥入境卡填写模板 | 2 |
| 枢纽页 `/mexico/` | Mexico FMM Guide: When You File the FMM-E and What You Need / 墨西哥入境卡 FMM 指南：什么时候填、要准备什么 | fmm mexico（63 / G64）；fmme（42 / B6）；fmm form（15 / G68）；fmm online mexico（14 / G58）；fmm form mexico（13 / G62）；fmm form online（9 / G52） | does mexico have visa on arrival、do i need a tourist card for mexico、mexico visa on arrival、visa card from mexico to usa、air travel mexico visa / 墨西哥入境签证、墨西哥入境需要什么资料 / — | — |

### 11. 越南 Vietnam（E-Visa）

90 天 GSC + 11 周 Bing：曝光 1,085，点击 47，有曝光的查询 515 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/vietnam/evisa/` | Evisa Vietnam Official Site: $25/$50 Government Fee (2026) / 越南电子签证官网：evisa.gov.vn 申请入口与 $25/$50 费用 | evisa.gov.vn（68 / B9）；越南evisa（36 / B9）；越南移民局官方网站（31 / B8）；越南evisa官方网站（27 / B4）；evisa vietnam（26 / B8 G68）；vietnam evisa（25 / G61） | — / — / — | — |
| 填写页 `/vietnam/how-to-fill/` | How to Fill the Vietnam E-Visa Application Form (2026) / 越南电子签证怎么填：E-Visa 申请表照片要求和易错字段 | vietnam evisa identity card field（24 / B1 G10）；how to fill out vietnam evisa（13 / B4 G73）；vietnam entry visa application form（9 / G63）；icao line passport（7 / G22）；how to fill out vietnam visa application（6 / B7 G65）；vietnam evisa application form（5 / B8 G76） | vietnam e-visa processing time、vietnam e-visa contact address、vietnam e visa processing time、vietnam e visa status processing、vietnam e visa for indians processing time / 越南电子签证多久下来、越南电子签证换纸签教程、越南evisa 多久、越南evisa申請時間、越南电子签证宗教怎么填 / 越南電子簽證要多久、越南電子簽證多久下來、越南電子簽證多久、越南e visa 要多久、越南e visa 列印 | 2 |
| 枢纽页 `/vietnam/` | Vietnam e-Visa Guide: Official Site and Government Fee / 越南签证指南：E-Visa 电子签证真实费用与中介加价 | vietnam e-visa fee 25 usd official（3 / G57） | vietnam e-visa、vietnam e-visa for us citizens、vietnam e-visa application、vietnam e-visa official website、vietnam e-visa portal / 越南电子签证官网、越南电子签证、越南电子签证申请官网、越南电子签证入境流程、越南电子签证费用 / 越南電子簽證、越南電子簽證官網、越南電子簽證教學、越南電子簽證照片過不了、越南電子簽證費用 | — |

### 12. 土耳其 Turkey（E-Visa）

90 天 GSC + 11 周 Bing：曝光 1,013，点击 62，有曝光的查询 210 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/turkey/evisa/` | Turkey e-Visa: Check Whether You Need One Before Paying (2026) / 土耳其电子签证官网：evisa.gov.tr，先确认是否免签 | — | — / 土耳其用信用卡安不安全、土耳其能用银联卡吗、土耳其电子签 / — | — |
| 填写页 `/turkey/how-to-fill/` | How to Fill the Turkey e-Visa: All 18 Fields (2026) / 土耳其电子签证怎么填：18 个字段逐项说明（2026） | turkey visa validity fields valid from valid until visa sticker（4 / B6）；turkish visa id card fields explanation（4 / B3）；turkey visa sticker what the fields mean vize türkiye 'surname' 'name' 'date of birth' 'passport number' 'nationality'（3 / B1） | turkey e visa pakistani passport、turkey e visa for indian passport holders、how to fill out e visa for turkey、how to fill turkey visa application form / 土耳其电子签证多久出签、土耳其电子签证有效期多久、土耳其电子签证申请步骤详解、土耳其电子签证永久联系地址怎么填 / 土耳其電子簽證 多久、download e visa turkey | — |
| 枢纽页 `/turkey/` | Turkey Visa Guide: Do You Need an e-Visa in 2026? / 土耳其需要签证吗？免签、e-Visa 官网与费用（2026） | 土耳其签证（206 / B6）；土耳其免签（117 / B8）；土耳其免签吗（107 / B7）；土耳其需要签证吗（79 / B3）；土耳其 簽證（33 / G54）；土耳其电子签（25 / B5） | turkey e-visa、turkey e-visa official website、turkey e-visa application、turkey e-visa for indians、turkey e-visa cost / 土耳其电子签证官网、土耳其电子签证、土耳其电子签证申请官网、土耳其电子签证多少钱、土耳其电子签证官网入口 / 土耳其電子簽證、土耳其電子簽證申請官網、土耳其電子簽證教學、土耳其電子簽證費用、土耳其電子簽證官方網站 | — |

### 13. 埃及 Egypt（e-Visa）

90 天 GSC + 11 周 Bing：曝光 941，点击 20，有曝光的查询 171 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/egypt/evisa/` | Egypt e-Visa: Official Portal, USD $30 and $65 Fees (2026) / 埃及电子签证官网：visa2egypt.gov.eg 入口与 30/65 美元费用 | egypt evisa portal（20 / B7）；evisa egypt official site（14 / B8）；egypt e-visa portal（10 / B9）；visa2egypt.gov.eg（10 / B9）；egypt e visa official website（9 / B9）；egypt e visa portal government site（8 / B7） | — / 埃及向全世界表演临时抱佛脚、埃及电子签申请流程 / — | — |
| 填写页 `/egypt/how-to-fill/` | How to Apply for the Egypt e-Visa: 10 Items (2026) / 埃及电子签证怎么申请：10 项材料（2026） | 埃及电子签（14 / B6）；埃及电子签证（3 / B6）；埃及电子签证申请（3 / B6） | egypt e visa address format、egypt e visa processing time、egypt e visa for indian passport holders、egypt e visa for bangladeshi passport、how to complete egypt e visa / 埃及电子签证收到款已确认后多久出签证 / 埃及電子簽證 多久 | — |
| 枢纽页 `/egypt/` | Egypt e-Visa Guide: Official Portal and Fees / 埃及电子签证指南：所需材料、提前 7 天与入境清单 | 埃及电子签证官网（145 / B7）；埃及电子签（124 / B7）；visa2egypt.gov.eg（87 / B7）；埃及签证官网（76 / B8）；埃及电子签证官网入口（53 / B6）；埃及签证（22 / B10） | egypt e-visa portal、egypt e-visa、egypt e-visa portal home page、egypt e-visa for us citizens、egypt e-visa official website / 埃及电子签证官网、埃及电子签证、埃及电子签证官网入口、埃及电子签证申请、埃及电子签证费用 / 埃及電子簽證、埃及電子簽證教學、埃及電子簽證被拒、埃及電子簽證官網、埃及電子簽證費用 | — |

### 14. 老挝 Laos（eVisa）

90 天 GSC + 11 周 Bing：曝光 919，点击 20，有曝光的查询 167 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/laos/evisa/` | Laos eVisa: Official Site, Fees and 9 Entry Ports (2026) / 老挝电子签证官网：laoevisa.gov.la、费用与 9 个口岸 | laos evisa（51 / B6）；laos evisa official website（42 / B6）；lao evisa（36 / B6）；laos evisa official（30 / B5）；老挝电子签证官网（27 / B5）；laos visa（18 / B8） | — / 老挝最新涉台表态 / — | — |
| 填写页 `/laos/how-to-fill/` | How to Apply for the Laos eVisa: 11 Items (2026) / 老挝电子签证怎么申请：11 项资料（2026） | — | laos evisa how long does it take、laos evisa processing time、laos e visa processing time、laos e visa when to apply、laos visa form pdf / 老挝电子签证几天下来、老挝evisa入境单怎么填写、老挝evisa几天出 / — | — |
| 枢纽页 `/laos/` | Laos eVisa Guide: Official Site, Fees and Entry Ports / 老挝签证指南：电子签、落地签与 9 个适用口岸 | 老挝签证（84 / B9）；老挝电子签证官网（83 / B5）；老挝电子签（50 / B5）；老挝签证官网（49 / B9）；老挝入境卡官网入口（26 / B7）；laoevisa.gov.la（22 / B9） | laos evisa cost、laos evisa、laos evisa application、laos evisa official website、laos evisa or visa on arrival / 老挝电子签证官网、老挝电子签证、老挝电子签证官网入口、老挝电子签证费用、老挝电子签证申请 / 寮國電子簽證、寮國電子簽證教學、寮國電子簽證費用、寮國電子簽證官方網頁、寮國evisa | — |

### 15. 牙买加 Jamaica（C5）

90 天 GSC + 11 周 Bing：曝光 907，点击 20，有曝光的查询 134 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/jamaica/c5/` | Jamaica C5 Form Online: Free Official Passenger Declaration (2026) / 牙买加入境卡官网：C5 电子旅客申报表免费填写 | jamaica c5 form online（196 / B7）；jamaica c5 form online free（98 / B5）；c5 form jamaica（46 / B9）；enter jamaica c5 form online free（45 / B6）；c5 form for jamaica immigration（45 / B6）；c5 form jamaica free（33 / B4） | jamaica c5 form、jamaica c5 form online free、jamaica c5 form online application、jamaica c5 form online / 牙买加入境卡、牙买加入境卡中英文对照、牙买加C5表格、牙买加超级联赛赛程表 / — | — |
| 填写页 `/jamaica/how-to-fill/` | How to Fill the Jamaica C5 Form (2026) / 牙买加入境卡怎么填：C5 旅客申报表字段说明（2026） | departure port on c5 form（4 / G10） | jamaica c5 form pdf、jamaica arrival customs form online、passport card for jamaica、jamaica customs arrival form、form to fill out to enter jamaica / 牙买加入境卡填写、牙买加入境卡填写样本、牙买加入境卡怎么填、牙买加入境信息填写、牙买加护照免签国家 / — | 1 |
| 枢纽页 `/jamaica/` | Jamaica C5 Guide: Free Official Passenger Declaration / 牙买加入境卡 C5 指南：免费官方旅客申报表 | https://enterjamaica.goy,jm（28 / B9）；jamaica c5 online free（3 / B8） | how do jamaicans get a visa / 牙买加签证、牙买加免签吗、牙买加落地签需要什么、牙买加商务签证 / — | — |

### 16. 新西兰 New Zealand（NZTD）

90 天 GSC + 11 周 Bing：曝光 631，点击 18，有曝光的查询 292 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/new-zealand/nztd/` | New Zealand Arrival Card (NZTD) Official Site: Is It Free? (2026) / 新西兰入境卡免费吗？NZTD 官网与 NZeTA 多少钱（2026） | nztd（17 / G20） | new zealand nztd、new zealand nztd app、new zealand nztd form、new zealand arrival card / 新西兰入境卡、新西兰入境卡中英文对照表、新西兰入境卡中文版、新西兰入境卡申请 / 紐西蘭入境卡、紐西蘭入境卡中文版、紐西蘭入境卡教學、紐西蘭入境卡app | — |
| 填写页 `/new-zealand/how-to-fill/` | How to Fill the New Zealand Traveller Declaration: All 18 Fields (2026) / 新西兰入境卡怎么填：NZTD 18 个字段逐项说明（2026） | nztd（61 / B8）；full contact or residential address in new zealand（5 / G11）；nztd 58（4 / B6）；新西兰 入境卡（4 / B5）；how to complete nztd together with your children（4 / B8）；new zealand customs arriving traveller declarations medication cash（4 / B6） | new zealand arrival card pdf、new zealand arrival card declaration、new zealand arrival card sample、new zealand arrival card pdf free、new zealand passenger arrival card pdf / 新西兰入境卡填写、新西兰入境卡打印、新西兰入境卡样本、新西兰入境卡英文版pdf、新西兰入境卡在线填写 / 紐西蘭入境卡填寫範例、紐西蘭入境卡填寫、紐西蘭入境卡線上填寫 | 2 |
| 枢纽页 `/new-zealand/` | New Zealand Arrival Card Guide: NZTD Timing, NZeTA Separate / 新西兰入境卡指南：NZTD 什么时候填，NZeTA 另算 | nztd（45 / B9）；new zealand entry declaration（26 / B8）；traveller declaration nieuw-zeeland（23 / G33）；new zealand travel declaration（15 / B9 G56）；nztd declaration（13 / B8）；new zealand traveller declaration（12 / B9 G39） | new zealand entry form for australians、new zealand arrival requirements / 新西兰nzeta、新西兰nzeta官网、新西兰NZeTA是啥签证、新西兰NZETA费用 / — | — |

### 17. 英国 United Kingdom（ETA）

90 天 GSC + 11 周 Bing：曝光 569，点击 1，有曝光的查询 72 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/uk/eta/` | Is UK ETA Free? Official Website and £20 Fee (2026) / 英国 ETA 多少钱？2026 官网费用是 20 英镑 | 英國簽證 費用（3 / G57） | — / — / — | — |
| 填写页 `/uk/how-to-fill/` | UK ETA Address Line 1 and Home Address: All 9 Fields (2026) / UK ETA 怎么填：9 组字段逐项中文说明（2026） | provide the address where you live most of the time eta（69 / G9）；enter address line 1 eta（37 / G8）；uk eta home address line 1（36 / G7）；eta address line 1（34 / G7）；address line 1 eta（31 / G8）；uk eta enter address line 1（28 / G9） | uk eta application steps、uk eta for australian passport holders、how to fill uk eta、how to complete uk eta application、how to complete uk eta / 英国eta 確認方法、英国eta申请要多久、英国eta申请最快的方法和步骤详解、英国eta提前多久申请、英国ETA官方下载 / 英國eta申請要多久 | 3 |
| 枢纽页 `/uk/` | UK ETA Official Website, £20 Fee, and Middleman Check / 英国 ETA 官网、20 英镑费用和中介核查 | — | uk eta、uk eta application、uk eta app、uk eta application for us citizens、uk eta for us citizens / 英国eta、英国eta申请、英国eta申請方法、英国eta 料金、英国eta 有効期限 / 英國eta、英國eta申請教學、英國eta查詢、英國eta申請、英國eta費用 | — |

### 18. 柬埔寨 Cambodia（e-Arrival）

90 天 GSC + 11 周 Bing：曝光 515，点击 9，有曝光的查询 109 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/cambodia/e-arrival/` | Cambodia e-Arrival Card Official Website: Free Declaration (2026) / 柬埔寨入境卡官网：e-Arrival 电子入境卡 arrival.gov.kh | 柬埔寨入境卡（56 / B9）；cambodia e-arrival（40 / B9）；arrival.gov.kh（28 / B8）；柬埔寨e arrival（24 / B4）；柬埔寨入境卡网站申请（21 / B6）；柬埔寨入境电子申报（18 / B4） | cambodia e-arrival、cambodia e-arrival card、cambodia e-arrival app、cambodia e-arrival form / 柬埔寨入境卡、柬埔寨入境卡网站申请、柬埔寨入境卡官网、柬埔寨入境卡电子版app / 柬埔寨入境卡、柬埔寨入境卡教學、柬埔寨入境卡网站申请、柬埔寨入境卡官网 | — |
| 填写页 `/cambodia/how-to-fill/` | How to Fill the Cambodia e-Arrival Card: Field Guide (2026) / 柬埔寨入境卡怎么填：e-Arrival 电子入境卡逐项说明 | — | cambodia e-arrival card when to apply、cambodia e arrival qr code、cambodia arrival card when to apply、how to fill cambodia e arrival card、cambodia visa on arrival application form pdf / 柬埔寨入境卡填写官网、柬埔寨入境卡填写样本、柬埔寨入境卡填寫、柬埔寨入境卡怎么填、柬埔寨入境卡如何填寫 / 柬埔寨入境卡填寫、柬埔寨入境卡填写官网、柬埔寨入境卡填写样本、柬埔寨入境卡怎么填、柬埔寨入境卡如何填寫 | 2 |
| 枢纽页 `/cambodia/` | Cambodia e-Arrival Card Guide: What to Prepare, Visa Fees Separate / 柬埔寨入境卡 e-Arrival 指南：要准备什么，签证费另算 | 柬埔寨电子入境卡官网（15 / B7 G9）；柬埔寨入境卡网站申请（12 / B6）；柬埔寨电子入境系统官方网站（9 / B4）；柬埔寨入境电子申报（8 / B4）；cambodia immigration（5 / G55）；填写入口:https://arrival.gov.kh/（5 / B7） | cambodia e arrival card for uk citizens、cambodia visa on arrival cost、cambodia visa on arrival form、cambodia on arrival visa、cambodian visa on arrival / 柬埔寨e-visa / 柬埔寨e-visa | — |

### 19. 美国 United States（ESTA）

90 天 GSC + 11 周 Bing：曝光 407，点击 6，有曝光的查询 207 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/usa/esta/` | Is ESTA Free? Official Website and USD $40.27 Fee (2026) / 美国 ESTA 多少钱？官网申请费用 40.27 美元（2026） | how much is an esta for usa（30 / B7）；esta price（19 / B7）；esta（15 / B9）；etsa（13 / B7）；esta fee（12 / B7）；esta application price 2026（6 / B6） | us esta、us esta application、us established、us esta official site / 美国esta、美国esta申请官网、美国esta是什么、美国esta费用 / 美國esta、美國esta申請、美國esta費用、美國esta官網 | — |
| 填写页 `/usa/how-to-fill/` | How to Fill the ESTA Form: All 9 Fields Explained (2026) / ESTA 怎么填：9 组字段逐项中文说明（2026） | — | us esta application steps、how to complete us esta、how to fill in us esta、how to complete usa esta、how to fill in esta form / — / — | — |
| 枢纽页 `/usa/` | United States ESTA: Official Website, $40.27 Fee, and Middleman Check / 美国 ESTA 官方网站、40.27 美元费用和中介核查 | esta官網（13 / G21）；esta（8 / B8）；美国esta（5 / B7）；esta united states（5 / B8）；$40.27（4 / G9）；esta是什么（3 / B9） | us esta visa、us esta visa application、us esta application for uk citizens、us esta application requirements、us esta for uk citizens / 美国esta电子签证、美国esta签证、美国ESTA签证需要什么材料、美国ESTA签证是干嘛的、美国ESTA和签证的区别 / 美國esta簽證 | — |

### 20. 日本 Japan（Visit Japan Web）

90 天 GSC + 11 周 Bing：曝光 353，点击 17，有曝光的查询 222 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/japan/visit-japan-web/` | Visit Japan Web Official Site: Free Japan Arrival QR (2026) / 日本入境卡官网：Visit Japan Web 免费入境二维码入口 | visit japan web（22 / B9）；visit japan web可預先填寫（14 / B8）；visit japan web 登入（6 / B8）；visit japan web 官方網站（5 / B5）；e arrival card japan offical website（4 / B9）；visit japan web services（4 / B9） | japan visit japan web、japan's visit japan web service、japan immigration visit japan web、visit japan web japan arrival card / 日本入境卡、日本入境卡电子版、日本入境卡网上填报、日本入境卡2026 / 日本入境卡、日本入境卡線上、日本入境卡紙本、日本入境卡2026 | — |
| 填写页 `/japan/how-to-fill/` | How to Fill Visit Japan Web: Field-by-Field Guide (2026) / 日本入境卡怎么填：Visit Japan Web 字段填写指南（2026） | how to fill up visit japan web（5 / B6）；when to fill up visit japan web（4 / B7）；how to fill out visit japan web（3 / B7） | japan customs visit japan web、japan customs form visit japan web、how to complete visit japan web、japan arrival card qr code、japan arrival card how many days before / 日本入境卡填写、日本入境卡填寫、日本入境卡線上填寫、日本入境卡填寫範例2026、日本入境卡紙本下載 / 日本入境卡填寫、日本入境卡填寫範例、日本入境卡紙本下載、日本入境卡多久前填寫、日本入境卡紙本範例 | 2 |
| 枢纽页 `/japan/` | Japan Entry Guide: Visit Japan Web Arrival QR, Free / 日本入境卡指南：Visit Japan Web 免费入境二维码流程 | visit japan web登录入口（9 / B5）；日本签证 二维码（3 / B8） | japan arrival card for us citizens、japan arrival card for australians、japan arrival card for uk citizens、japan arrival card for uk、japan visa arrival card / 日本visit japan web visa / 日本visit japan web visa | — |

### 21. 马尔代夫 Maldives（IMUGA）

90 天 GSC + 11 周 Bing：曝光 221，点击 3，有曝光的查询 73 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/maldives/traveller-declaration/` | Maldives IMUGA Traveller Declaration Official Site: Free (2026) / 马尔代夫入境卡官网：IMUGA 旅客申报表免费，只填入境 | imuga arrival form maldives（6 / G33）；馬爾地夫imuga（6 / G3）；马尔代夫入境申报（6 / B8）；maldives travel agency imuga（5 / G43）；imuga declaration（4 / G28）；formulaire imuga maldives（3 / G66） | maldives imuga、maldives imuga form、maldives imuga form official website、maldives imuga cost / 马尔代夫入境卡、马尔代夫入境卡官网、马尔代夫入境卡网站、马尔代夫电子入境卡 / 馬爾地夫入境卡 | — |
| 填写页 `/maldives/how-to-fill/` | How to Fill the Maldives Traveller Declaration (2026) / 马尔代夫入境卡怎么填：IMUGA 旅客申报表 7 项资料（2026） | formulaire imuga maldives（3 / G71） | maldives imuga traveller declaration、maldives imuga declaration、imuga maldives travel declaration、how to fill maldives arrival card、how to complete maldives entry form / 马尔代夫入境卡填写、马尔代夫入境卡填写官网、马尔代夫入境卡填写样本、马尔代夫电子入境卡填写、马尔代夫入境卡网上填写 / — | 2 |
| 枢纽页 `/maldives/` | Maldives IMUGA Traveller Declaration Guide: Free, Official / 马尔代夫入境卡指南：IMUGA 入境申报与 96 小时规则 | 马尔代夫入境申报（49 / B6）；马尔代夫入境卡（11 / B8）；马尔代夫入境申报网站（10 / B6）；马尔代夫入境卡官网（8 / B5）；马尔代夫入境（6 / B7）；马尔代夫电子入境卡官网（5 / B4） | maldives arrival form for indian、maldives on arrival visa documents、maldives visa on arrival、maldives on arrival visa for indian、maldives visa on arrival cost / — / — | — |

### 22. 加拿大 Canada（eTA）

90 天 GSC + 11 周 Bing：曝光 187，点击 4，有曝光的查询 98 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/canada/eta/` | Is eTA Canada Free? Official Site and CAD $7 Fee (2026) / 加拿大 eTA 多少钱？2026 官网费用是 7 加元 | 加拿大 eta（15 / G75） | — / — / — | — |
| 填写页 `/canada/how-to-fill/` | How to Fill the Canada eTA Form: All 11 Fields Explained (2026) / 加拿大 eTA 怎么填：11 组字段逐项中文说明（2026） | etaform（9 / G10） | canada eta processing time、canada eta how long valid、canada eta application how long does it take、canada eta application processing time、canada eta for australian passport holders / 加拿大eta沒收到email、加拿大eta申請時間、加拿大eta申请教程、加拿大eta最快多久能下来、加拿大eta申请步骤 / 加拿大eta沒收到確認信、加拿大eta沒收到email | — |
| 枢纽页 `/canada/` | Canada eTA Official Site, CAD $7 Fee, and Air-Only Rule / 加拿大 eTA 官网、7 加元费用和空路规则 | canada eta official site（19 / B9）；eta canada price（7 / B7）；canada eta official website（5 / B9）；canada eta cost（5 / B10）；since 2016 only eta required canada official（4 / B2）；canada eta fee validity official canada.ca（4 / B4） | canada eta、canada eta application、canada eta status check、canada eta visa、canada eta for us citizens / 加拿大eta、加拿大eta申請官網、加拿大eta申請教學、加拿大eta查詢、加拿大eta官網 / 加拿大eta、加拿大eta申請、加拿大eta查詢、加拿大eta官網、加拿大eta申請教學 | — |

### 23. 卡塔尔 Qatar（Hayya e-Visa）

90 天 GSC + 11 周 Bing：曝光 172，点击 0，有曝光的查询 56 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/qatar/hayya-evisa/` | Qatar Hayya e-Visa: Check Free Entry Before Paying QAR 100 (2026) / 卡塔尔电子签证官网：Hayya 平台，付 100 里亚尔前先查免签 | hayya qatar（22 / G52）；hayya card（15 / G63）；hayya entry requirements（12 / G73）；hayya entry to qatar（12 / G58）；hayya portal（5 / G49）；hayya qatar visa（5 / G53） | — / 卡塔尔世界杯、卡塔尔是哪个国家的、卡塔尔世界杯最大分差、卡塔尔航空 / — | — |
| 填写页 `/qatar/how-to-fill/` | How to Prepare a Qatar Hayya e-Visa Application (2026) / 卡塔尔 Hayya 电子签怎么填：8 项路径核对（2026） | hayya entry requirements（6 / G71）；hayya entry to qatar（5 / G66）；how to apply visa with hayya card（5 / G69）；how to apply for hayya a1 visa（4 / G67）；how to apply hayya a1 visa（4 / G69）；hayya card（3 / G82） | hayya qatar e visa processing time、qatar e visa download、visa application form pdf qatar / 卡塔尔旅游签证可以停留多久、卡塔尔免签可以停留多久、卡塔尔时间、卡塔尔护照免签国家 / — | — |
| 枢纽页 `/qatar/` | Qatar Hayya Guide: Visa-Free Entry Check and Official e-Visa / 卡塔尔免签与 Hayya 电子签官网指南 | — | qatar hayya e visa、hayya e visa qatar、qatar hayya visa online、gateway to qatar hayya e=visa、qatar e visa hayya portal / 卡塔尔电子签证、卡塔尔电子签证网站、卡塔尔电子签证官网、卡塔尔电子签证怎么申请、卡塔尔电子签证免签吗 / 卡達電子簽證教學 | — |

### 24. 澳大利亚 Australia（ETA）

90 天 GSC + 11 周 Bing：曝光 124，点击 4，有曝光的查询 95 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/australia/eta/` | Australian ETA App Official: Is Australia ETA Free? (2026) / 澳大利亚 ETA 多少钱？唯一官方入口是 AustralianETA App（2026） | australian eta app（4 / B10）；does the australiaeta ap work for returning australian citizens（3 / B7）；australia eta app（3 / B9）；eta app（3 / B4）；australian eta（3 / B5） | — / — / — | — |
| 填写页 `/australia/how-to-fill/` | Australian ETA App Steps and eVisitor 651 Field Guide (2026) / 澳大利亚 ETA App 六步流程 + eVisitor 651 字段指南（2026） | australian government department home affairs 651（5 / B9）；australia et how to fill out（3 / B5） | australia eta application processing time、australia eta application step by step、australia eta for british passport holders、how to complete australian eta、how to fill australia visa application form / 澳大利亚eta下载、澳大利亚ETAApp下载、澳洲ETA最新版本下载、澳洲ETAAPP下载最新版怎么安装 / 澳洲eta申請時間 | — |
| 枢纽页 `/australia/` | Australian ETA App Official Guide: ETA 601 and Free eVisitor 651 / 澳大利亚 ETA 多少钱？官方 App 与免费 eVisitor 651 指南 | — | australia eta、australia eta app、australia eta for us citizens、australia eta application、australia eta visa / 澳大利亚eta、澳大利亚eta申请网站、澳大利亚eta电子签证、澳大利亚eta官网、澳大利亚eta是什么 / 澳洲eta、澳洲eta申請、澳洲eta申請教學、澳洲eta效期、澳洲eta 香港 | — |

### 25. 巴巴多斯 Barbados（ED Form）

90 天 GSC + 11 周 Bing：曝光 105，点击 2，有曝光的查询 51 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/barbados/ed-form/` | Barbados ED Form: Free Official Immigration and Customs Form / 巴巴多斯入境卡官网：ED Form 入境和海关表免费 | barbados immigration forms online（6 / B9）；barbados ed form（5 / B3 G10）；barbados immigration arrival form（5 / B8）；barbados entry form（4 / B9）；barbados online immigration form（3 / B9）；barbados online ed form（3 / B4） | barbados ed form、barbados ed form online、barbados ed form portal、barbados immigration ed form / — / — | — |
| 填写页 `/barbados/how-to-fill/` | How to Fill the Barbados ED Form (2026) / 巴巴多斯入境卡怎么填：ED Form 行程、护照和两份回执 | — | barbados customs online ed form、barbados immigration and customs ed form、how to fill in barbados immigration form、guide to filling out barbados entry form、filling in barbados immigration form / 巴巴多斯工作签证申请要多久 / — | — |
| 枢纽页 `/barbados/` | Barbados ED Form Guide: Free Official Arrival Form / 巴巴多斯入境和海关表：免费官网与 72 小时窗口 | barbados immigration（8 / G49）；barbados immigration form（7 / G29）；immigration barbados（5 / G39）；barbados immigration arrival form（3 / G39）；barbados online immigration form（3 / G39）；entry to barbados（3 / G90） | barbados arrival requirements、travel to barbados visa / 巴巴多斯免签政策、巴巴多斯工程签证申请流程 / — | — |

### 26. 古巴 Cuba（D'Viajeros）

90 天 GSC + 11 周 Bing：曝光 82，点击 0，有曝光的查询 39 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/cuba/dviajeros/` | Cuba Entry Form (D'Viajeros): Free Official Site, eVisa Separate / 古巴入境卡官网：D'Viajeros 免费入境表，旅游 eVisa 另办 | dviajeros（6 / G59）；cuba entry form（3 / G14）；de viajeros（3 / G54） | cuba d'viajeros form、cuba d viajeros travel form、cuba d viajeros travel form english、cuba d'viajeros digital entry form / 古巴入境卡、古巴入境卡官网、古巴入境卡怎么申请、古巴入境卡怎么办理流程 / 古巴入境卡 | — |
| 填写页 `/cuba/how-to-fill/` | How to Fill Cuba D'Viajeros (2026) / 古巴入境卡怎么填：D'Viajeros 4 段信息和二维码（2026） | — | how to fill out the d viajeros forms for cuba、how to fill cuba entry form、how to fill out cuba entry form / 古巴入境卡填写、古巴入境卡填写样本、古巴入境卡提前四天填写可以吗、古巴入境卡填写样本2023最新、古巴入境卡填写正确方式 / 古巴入境卡填写 | — |
| 枢纽页 `/cuba/` | Cuba Entry Guide: Free D'Viajeros Form and Tourist eVisa / 古巴入境卡 D'Viajeros 指南：免费入境表与 eVisa 的区别 | kuba touristenkarte（20 / G92）；touristenkarte kuba online（7 / G88）；qr cuba（5 / G67） | d'viajeros cuba visa、travel visa for cuba、visa to enter cuba、how to get visa to cuba、how to apply for cuba visa / 古巴入境卡需要买么、古巴入境中国免签吗、古巴签证怎么办理、古巴旅游签证怎么办 / — | — |

### 27. 库拉索 Curaçao（DI Card）

90 天 GSC + 11 周 Bing：曝光 51，点击 0，有曝光的查询 21 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/curacao/digital-immigration-card/` | Curaçao Digital Immigration Card (DI Card): Official Free Form / 库拉索入境卡官网：数字移民卡 DI Card 免费，不要付费 | curacao immigration card（6 / G17）；curacao digital immigration card（5 / G37）；digital immigration card curacao（5 / G46）；curacao visa application online（3 / G46）；di card curacao（3 / G6） | curacao di card portal、curacao di card、curacao online di card、curaçao digital immigration card di card / 库拉索入境卡在哪里办 / — | — |
| 填写页 `/curacao/how-to-fill/` | How to Fill the Curaçao Digital Immigration Card (2026) / 库拉索入境卡怎么填：DI Card 航班、护照和确认 PDF | curacao immigration card passenger locator card（8 / G29）；ed kaart curacao invullen（4 / G49） | — / — / — | — |
| 枢纽页 `/curacao/` | Curaçao Digital Immigration Card Guide: Free Official Form / 库拉索入境卡 DI Card 指南：免费填写与 7 天窗口 | — | — / 库拉索签证、库拉索岛需要签证吗 / — | — |

### 28. 哥伦比亚 Colombia（Check-Mig）

90 天 GSC + 11 周 Bing：曝光 40，点击 0，有曝光的查询 16 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/colombia/check-mig/` | Colombia Check-Mig Form: Official Free Pre-Registration (2026) / 哥伦比亚入境卡官网：Check-Mig 免费预登记与填写时间 | check mig（19 / G4）；is the colombia check mig form free（3 / B5） | colombia check-mig form、colombia check-mig、colombia check mig official、colombia check mig form free / 哥伦比亚入境卡、哥伦比亚查获13.8吨可卡因、哥伦比亚入境卡怎么办理、哥伦比亚入境卡是什么卡 / check-mig、check-mig コロンビア、check-mig colombia | — |
| 填写页 `/colombia/how-to-fill/` | How to Fill Colombia Check-Mig (2026) / 哥伦比亚入境卡怎么填：Check-Mig 5 步字段指南 | — | form to fill out to enter colombia / 哥伦比亚入境卡怎么填、哥伦比亚入境卡样本、哥伦比亚入境卡填写、哥伦比亚入境卡电话用的什么号码、哥伦比亚Check-Mig在哪里填写 / — | — |
| 枢纽页 `/colombia/` | Colombia Check-Mig Guide: Free Official Pre-Registration / 哥伦比亚入境卡 Check-Mig 指南：免费官方预登记 | — | colombia transit visa requirements、travel visa for colombia、how to apply for colombia visa、how to get colombian visa / 哥伦比亚入境中国免签吗、哥伦比亚中国人入境政策、哥伦比亚签证怎么办 / 哥倫比亞 columbia 台灣官網 外套 | — |

### 29. 巴拿马 Panama（DJV）

90 天 GSC + 11 周 Bing：曝光 35，点击 0，有曝光的查询 22 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/panama/traveler-declaration/` | Panama Traveler Declaration Form: Free Official Site and QR / 巴拿马入境申报官网：电子旅客宣誓申报免费与 QR | — | panama arrival card、panama landing card、panama entry card、panama arrival form / 巴拿马入境卡、巴拿马入境政策官网、巴拿马入境要求、巴拿马总统最新涉华表态 / 巴拿馬入境卡 | — |
| 填写页 `/panama/how-to-fill/` | How to Fill Panama's Traveler Declaration (2026) / 巴拿马入境申报怎么填：身份、物品和 QR（2026） | — | panama travel declaration form / 巴拿马入境卡填写、巴拿马入境卡模板、巴拿马护照可以入境加拿大吗 / — | — |
| 枢纽页 `/panama/` | Panama Traveler Declaration Guide: Free Official Form / 巴拿马入境申报指南：免费旅客申报、72 小时与 QR 回执 | panama customs declaration form online free（4 / G8）；paco viajero panama（3 / G40）；panama customs declaration form english（3 / G11） | panama flag requirements、panama visa on arrival for americans、panama visa on arrival for tourists、panama transit visa application for americans / 巴拿马过境签证、巴拿马需要什么签证才能入境、巴拿马转机需要过境签证吗 / — | — |

### 30. 以色列 Israel（ETA-IL）

90 天 GSC + 11 周 Bing：曝光 32，点击 0，有曝光的查询 4 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/israel/eta-il/` | Israel ETA-IL: Visa-Exempt Passports Only (2026) / 以色列 ETA-IL 2026：只限免签护照，付款前先查资格 | israel eta for british citizens（22 / G63）；israel eta for uk citizens（6 / G63）；israel entry piba gov il（3 / G29） | — / — / — | — |
| 填写页 `/israel/how-to-fill/` | How to Prepare an Israel ETA-IL Application (2026) / 以色列 ETA-IL 怎么填 2026：先查免签资格 | — | — / — / — | — |
| 枢纽页 `/israel/` | Israel ETA-IL Guide: Official Site and Who Needs It / 以色列 ETA-IL 官网、免签资格和 25 新谢克尔费用 | — | israel eta-il、israel eta-il application、israel eta il visa、israel eta il permit 2025、israel eta il status / 以色列eta、イスラエル eta-il / イスラエル eta-il | — |

### 31. 沙特阿拉伯 Saudi Arabia（Tourist eVisa）

90 天 GSC + 11 周 Bing：曝光 23，点击 0，有曝光的查询 16 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/saudi-arabia/tourist-evisa/` | Saudi Tourist eVisa: Who Can Apply and What SAR 300 Really Costs (2026) / 沙特电子签证官网：谁能申请，300 里亚尔实际要付多少 | saudi evisa fee（4 / G57）；saudi arabia tourist visa（3 / G25） | — / — / — | — |
| 填写页 `/saudi-arabia/how-to-fill/` | Saudi Tourist eVisa: 9 Checks Before You Pay (2026) / 沙特旅游电子签：付款前的 9 项检查（2026） | — | saudi e visa for indian passport、saudi e visa check online by passport number、how to fill saudi visa application form、how to fill saudi visit visa form、how to download saudi e visa online / 中华人民共和国和沙特阿拉伯王国关于互免持外交、公务、特别护照人员签证的协定、沙特阿拉伯电子签证申请步骤、沙特阿拉伯电子签证模板、沙特阿拉伯电子签证申请要多久 / — | — |
| 枢纽页 `/saudi-arabia/` | Saudi Arabia eVisa Guide: Official Portal and Real Cost / 沙特旅游电子签官网、66 国名单与费用构成 | — | saudi tourist evisa、saudi tourist visa、saudi tourist visa for us citizens、saudi tourist visa cost、saudi tourist visa for us green card holders / 沙特阿拉伯电子签证官网、沙特阿拉伯电子签证、沙特阿拉伯电子签证申请网站、沙特阿拉伯电子签证费用、沙特阿拉伯电子签证官方网站 / 沙烏地阿拉伯電子簽證台灣、沙烏地阿拉伯電子簽證 | — |

### 32. 巴西 Brazil（eVisa）

90 天 GSC + 11 周 Bing：曝光 22，点击 0，有曝光的查询 14 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/brazil/evisa/` | Brazil e-Visa: Official VFS Route and USD 80.90 Fee (2026) / 巴西电子签证官网：VFS 官方指定路径和 80.90 美元费用 | — | — / — / — | — |
| 填写页 `/brazil/how-to-fill/` | How to Apply for Brazil's VFS e-Visa (2026) / 巴西 VFS 电子签怎么申请 2026：材料和核验链 | — | brazil evisa processing time、brazil e visa processing time、brazil e visa for indian passport holders / 巴西电子签证最快几天到手、巴西商务签电子签审核时间多久 / — | — |
| 枢纽页 `/brazil/` | Brazil e-Visa Guide: Official Application Route and Fee / 巴西电子签：先查资格，再从 gov.br 核对 VFS | 巴西vfs（8 / B4） | brazil evisa、brazil evisa website、brazil evisa photo requirements、brazil evisa application、brazil evisa application for us citizens / 巴西电子签证、巴西电子签证官网、巴西电子签证平台、巴西电子签证开通了么、巴西签证是电子签吗 / 巴西evisa、evisa.immigration.gov.vn、xin evisa online taiwan、津巴布韋zimbabwe 電子簽證 / evisa | — |

### 33. 格鲁吉亚 Georgia（e-Visa）

90 天 GSC + 11 周 Bing：曝光 18，点击 0，有曝光的查询 9 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/georgia/evisa/` | Georgia e-Visa: You May Not Need One Before Paying (2026) / 格鲁吉亚电子签证官网：付款前先查一年免签资格（2026） | georgian e visa（7 / G57）；georgia e visa（4 / G64） | — / — / — | — |
| 填写页 `/georgia/how-to-fill/` | How to Prepare a Georgia e-Visa Application (2026) / 格鲁吉亚电子签证怎么填：9 项申请准备（2026） | — | georgia e visa processing time、georgia e visa for indians processing time / 格鲁吉亚旅游签证停留时间、格鲁吉亚护照免签、格鲁吉亚签证费用能提前交吗、格鲁吉亚免签多久、去格鲁吉亚旅游签证能呆多长时间 / — | — |
| 枢纽页 `/georgia/` | Georgia e-Visa Guide: Visa-Free Check and Official Portal / 格鲁吉亚电子签官网与免签资格指南 | — | georgia e-visa、georgia e-visa portal、georgia e-visa for indians、georgia e-visa application、georgia e visa for pakistani / 格鲁吉亚电子签证办理、格鲁吉亚电子签证材料、格鲁吉亚电子签证流程、格鲁吉亚电子签证费用、格鲁吉亚电子签证常见问题 / 柬埔寨e-visa、e-visa 申請 | — |

### 34. 尼泊尔 Nepal（Tourist Visa）

90 天 GSC + 11 周 Bing：曝光 14，点击 3，有曝光的查询 10 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/nepal/visa-on-arrival/` | Nepal Visa on Arrival: Official Online Form, Fees and Gratis Rules (2026) / 尼泊尔落地签官网：在线预填、费用与中国护照免费规则 | 尼泊尔落地签（3 / B4） | — / 尼泊尔警局官网、尼泊尔警察局官网、尼泊尔官网、尼泊尔电子签 / — | — |
| 填写页 `/nepal/how-to-fill/` | How to Fill the Nepal Visa-on-Arrival Form: 10 Checks (2026) / 尼泊尔落地签在线表怎么填：10 个检查项（2026） | — | — / 尼泊尔电子签证教程、尼泊尔电子签证怎么填写、尼泊尔电子签证怎么下载 / — | — |
| 枢纽页 `/nepal/` | Nepal Visa on Arrival Guide: Official Online Form and Fees / 尼泊尔落地签在线预填、费用与免费资格 | — | nepal tourist visa、nepal tourist visa for us citizens、nepal tourist visa application、nepal tourist visa online、nepal tourist visa cost / 尼泊尔电子签证官网入口、尼泊尔电子签证、尼泊尔电子签证网站、尼泊尔电子签证网址、尼泊尔电子签证申请 / 尼泊爾電子簽證 | — |

### 35. 阿塞拜疆 Azerbaijan（ASAN e-Visa）

90 天 GSC + 11 周 Bing：曝光 13，点击 0，有曝光的查询 5 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/azerbaijan/evisa/` | Azerbaijan ASAN e-Visa: Check Visa-Free Status Before Paying (2026) / 阿塞拜疆电子签证官网：ASAN 入口，付款前先查免签 | — | — / — / — | — |
| 填写页 `/azerbaijan/how-to-fill/` | How to Prepare an Azerbaijan ASAN e-Visa Application (2026) / 阿塞拜疆电子签证怎么填：ASAN 8 项申请准备（2026） | — | azerbaijan e visa processing time、azerbaijan e visa check by passport number、azerbaijan e visa for philippine passport holder、azerbaijan visa application form pdf download / 阿塞拜疆电子签证打印怎么打 / — | — |
| 枢纽页 `/azerbaijan/` | Azerbaijan e-Visa Guide: ASAN Portal and Visa-Free Check / 阿塞拜疆电子签官网与免签资格指南 | asan visa（8 / G42） | azerbaijan asan e visa、azerbaijan asan e visa portal、azerbaijan asan visa online、e visa azerbaijan asan xidmet、azerbaijan e visa fee / 阿塞拜疆电子签证、阿塞拜疆电子签证官网、阿塞拜疆签证官网、阿塞拜疆电子签证怎么申请、阿塞拜疆电子签证怎么办理 / — | — |

### 36. 秘鲁 Peru（TAM Virtual）

90 天 GSC + 11 周 Bing：曝光 13，点击 1，有曝光的查询 11 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/peru/tam-virtual/` | Peru TAM Virtual: Free Official Lookup (2026) / 秘鲁入境卡 TAM Virtual：免费官方查询与下载（2026） | — | peru tam virtual、migraciones peru tam virtual、validar salida de peru tam virtual、tam virtual peru / 秘鲁入境卡、秘鲁入境卡正确写法、秘鲁入境卡怎么办理、秘鲁入境卡怎么申请 / 秘魯入境卡 | — |
| 填写页 `/peru/how-to-fill/` | How to Use Peru's TAM Virtual Lookup (2026) / 秘鲁入境卡 TAM Virtual 怎么查：证件、日期和下载 | — | — / 秘鲁入境卡样本高清、秘鲁入境卡模板、秘鲁入境卡样本pdf、秘鲁入境卡填写样本、秘鲁入境卡模板下载 / — | — |
| 枢纽页 `/peru/` | Peru TAM Virtual Guide: Free Official Lookup / 秘鲁入境卡 TAM Virtual：边检自动生成，免费查询下载 | tam virtual（3 / B9 G17） | how to get peru visa、how to get a visa for peru、peru visa application form、apply for peru visa / 秘鲁入境中国免签多少天 / — | — |

### 37. 肯尼亚 Kenya（eTA）

90 天 GSC + 11 周 Bing：曝光 11，点击 1，有曝光的查询 4 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/kenya/eta/` | Kenya eTA: Check Whether You Are Exempt Before Paying (2026) / 肯尼亚 eTA 官网：付款前先查豁免国籍（2026） | — | — / 肯尼亚acd官网、肯尼亚手表价格 / — | — |
| 填写页 `/kenya/how-to-fill/` | How to Prepare the Kenya eTA Application (2026) / 肯尼亚 eTA 怎么填 2026：护照、行程和材料准备 | — | kenya eta processing time、how to fill eta for kenya / 肯尼亚eta要彩色打印吗 / — | — |
| 枢纽页 `/kenya/` | Kenya eTA Guide: Official Site, Fee and Exemptions / 肯尼亚 eTA 官方网站、豁免国籍和 30 美元费用 | 肯尼亚eta（6 / B7） | kenya eta、kenya eta visa、kenya eta portal、kenya eta application、kenya eta consent commitment letter / 肯尼亚eta、肯尼亚eta申请网站、肯尼亚eta官网入口、肯尼亚eta费用、肯尼亚eta签证 / 肯亞eta、肯亞eta教學、肯亞eta申請 | — |

### 38. 缅甸 Myanmar（Tourist eVisa）

90 天 GSC + 11 周 Bing：曝光 10，点击 0，有曝光的查询 8 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/myanmar/tourist-evisa/` | Myanmar Tourist eVisa: Official Site, Fee and Entry Points (2026) / 缅甸电子签证官网：旅游电子签、50 美元参考费用与 4 个口岸 | myanmar tourist e visa（3 / G61） | — / — / — | — |
| 填写页 `/myanmar/how-to-fill/` | How to Apply for the Myanmar Tourist eVisa: 11 Checks (2026) / 缅甸电子签证怎么申请：旅游电子签 11 个检查项（2026） | — | myanmar e visa processing time / 缅甸电子签证多久出签 / 緬甸電子簽證 幾天 | — |
| 枢纽页 `/myanmar/` | Myanmar eVisa Guide: Official Site, Fee and Entry Points / 缅甸旅游电子签官网与 4 个适用口岸 | — | myanmar tourist visa、myanmar tourist visa application、myanmar tourist visa for us citizens、myanmar tourist visa for indian、myanmar tourist visa for bangladeshi / 缅甸电子签证官网、缅甸电子签证、缅甸电子签证官方网站、缅甸电子签证申请官网、缅甸电子签证在线申请 / 緬甸電子簽證、緬甸電子簽證教學、緬甸電子簽證台灣、myanmar evisa official government website、evisa myanmar official website | — |

### 39. 乌兹别克斯坦 Uzbekistan（eVisa）

90 天 GSC + 11 周 Bing：曝光 9，点击 0，有曝光的查询 7 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/uzbekistan/evisa/` | Uzbekistan eVisa: Check Visa-Free Status Before Paying (2026) / 乌兹别克斯坦电子签证官网：付款前先查免签（2026） | — | — / — / — | — |
| 填写页 `/uzbekistan/how-to-fill/` | How to Fill the Uzbekistan eVisa: 13 Checks (2026) / 乌兹别克斯坦电子签证怎么填：13 项检查（2026） | — | uzbekistan e visa processing time / 乌兹别克斯坦电子签证审核时间、乌兹别克斯坦电子签证有效期是多久、乌兹别克斯坦工作签证需要多久、乌兹别克斯坦签证多久能办下来、乌兹别克斯坦签证需要多长时间 / — | — |
| 枢纽页 `/uzbekistan/` | Uzbekistan eVisa Guide: Visa-Free Check and Official Portal / 乌兹别克斯坦电子签指南：免签核查与官方入口 | — | uzbekistan evisa、uzbekistan evisa application、uzbekistan evisa for indians、uzbekistan evisa for pakistan、uzbekistan evisa status / 乌兹别克斯坦电子签证入境、乌兹别克斯坦电子签证费用、乌兹别克斯坦电子签证有效期、乌兹别克斯坦电子签证常见问题、乌兹别克斯坦电子签证所需材料 / 烏茲別克電子簽證、烏茲別克電子簽證台灣、烏茲別克evisa | — |

### 40. 阿鲁巴 Aruba（ED Card）

90 天 GSC + 11 周 Bing：曝光 8，点击 0，有曝光的查询 5 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/aruba/ed-card/` | Aruba ED Card: Official Form and USD 20 Fee (2026) / 阿鲁巴入境卡官网：ED Card 官方表和 20 美元费用 | — | aruba ed card、aruba ed card official site、aruba ed card online、aruba ed card cost / 阿鲁巴入境卡怎么用、阿鲁巴入境卡怎么申请 / — | — |
| 填写页 `/aruba/how-to-fill/` | How to Fill the Aruba ED Card (2026) / 阿鲁巴入境卡怎么填：ED Card 护照、航班和地址限制 | edcardaruba.aw/welcome（3 / G41） | aruba ed card when to apply、form to fill out to enter aruba、form to fill out for aruba / 中国护照去阿鲁巴要签证吗 / — | — |
| 枢纽页 `/aruba/` | Aruba ED Card Guide: Official Form and Sustainability Fee / 阿鲁巴入境卡 ED Card 指南：7 天窗口与海空入境规则 | — | aruba arrival requirements、aruba visitor requirements、form needed to enter aruba / 去阿鲁巴办什么签证、阿鲁巴需要签证吗、阿鲁巴签证可以去欧盟国家吗、阿鲁巴签证 / — | — |

### 41. 巴哈马 The Bahamas（C17）

90 天 GSC + 11 周 Bing：曝光 4，点击 0，有曝光的查询 4 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/bahamas/c17/` | Bahamas C17: Who Uses the Free Digital Customs Form (2026) / 巴哈马入境申报：C17 免费电子海关申报，谁需要填 | — | bahamas c17 form、bahamas c17 form online、bahamas arrival card、bahamas arrival card online / 巴哈马入境卡模版、巴哈马入境卡怎么用、巴哈马入境卡怎么申请 / — | — |
| 填写页 `/bahamas/how-to-fill/` | How to Prepare the Bahamas C17 Digital Declaration (2026) / 巴哈马 C17 电子申报怎么准备（2026） | — | bahamas c17 form pdf、bahamas c17 declaration form、bahamas c17 customs form、bahamas customs c17 declaration form、bahamas customs c17 form pdf / 巴哈马入境卡填写、巴哈马签证申请步骤、巴哈马签证能停留多久 / — | — |
| 枢纽页 `/bahamas/` | Bahamas Entry Guide: Free C17 Digital Customs Form / 巴哈马入境指南：C17 免费电子海关申报官方入口 | — | bahamas visa on arrival、how to apply for bahamas visa / 巴哈马免签入境流程、巴哈马签证怎么办理、巴哈马免签政策详情、巴哈马对中国人免签吗、巴哈马免签证就可以直接去吗 / — | — |

### 42. 巴基斯坦 Pakistan（VPA）

90 天 GSC + 11 周 Bing：曝光 3，点击 0，有曝光的查询 3 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/pakistan/visa-prior-to-arrival/` | Pakistan Visa Prior to Arrival: Free Application and Eligibility / 巴基斯坦电子签证官网：免费入境前签证 VPA 与资格 | — | — / — / — | — |
| 填写页 `/pakistan/how-to-fill/` | How to Fill Pakistan Visa Prior to Arrival: 8 Checks (2026) / 巴基斯坦入境前签证填写指南：8 项检查（2026） | — | pakistan e visa processing time / 巴基斯坦电子签证多久能下来、巴基斯坦电子签证申请步骤、巴基斯坦人办中国签证二维码怎么弄 / — | — |
| 枢纽页 `/pakistan/` | Pakistan Visa Guide: Free Visa Prior to Arrival Portal / 巴基斯坦签证指南：免费入境前签证官方入口 | — | pakistan vpa visa、pakistan e visa、pakistan e visa for us citizens、pakistan e visa fee for us citizens、pakistan e visa fee / 巴基斯坦电子签证官网、巴基斯坦电子签证、巴基斯坦电子签证申请、巴基斯坦电子签证申请流程、巴基斯坦电子签证入口 / 巴基斯坦電子簽證 | — |

### 43. 埃塞俄比亚 Ethiopia（eVisa）

90 天 GSC + 11 周 Bing：曝光 3，点击 0，有曝光的查询 3 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/ethiopia/evisa/` | Ethiopia Tourist eVisa: Official USD 62 and USD 152 Options (2026) / 埃塞俄比亚电子签证官网：30 天 62 美元、90 天 152 美元 | — | — / 埃塞俄比亚航空公司 官网 / — | — |
| 填写页 `/ethiopia/how-to-fill/` | How to Prepare an Ethiopia Tourist eVisa Application (2026) / 埃塞俄比亚电子签证怎么填：13 项申请准备（2026） | — | ethiopia evisa processing time、ethiopia e visa processing time / 中华人民共和国政府和埃塞俄比亚联邦民主共和国政府关于互免持外交、公务护照人员签证的协定、埃塞俄比亚电子签证可以取消吗、埃塞俄比亚电子签证被拒打什么电话 / — | — |
| 枢纽页 `/ethiopia/` | Ethiopia eVisa Guide: Official Portal and Fees / 埃塞俄比亚电子签官网、30 天与 90 天费用指南 | — | ethiopia evisa、ethiopia evisa application、ethiopia evisa official website、ethiopia evisa cost、ethiopia evisa portal / 埃塞俄比亚电子签证官网、埃塞俄比亚电子签证、埃塞俄比亚电子签证网站、埃塞俄比亚电子签证申请、埃塞俄比亚电子签证官方网站 / 衣索比亞電子簽證、what is a uk evisa | — |

### 44. 俄罗斯 Russia（e-Visa）

90 天 GSC + 11 周 Bing：曝光 3，点击 0，有曝光的查询 3 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/russia/evisa/` | Russia e-Visa: Official Site, 64 Eligible States and the 30-Day Rule (2026) / 俄罗斯电子签证官网：64 国名单与 30 天停留规则（2026） | — | — / — / — | — |
| 填写页 `/russia/how-to-fill/` | How to Apply for the Russia e-Visa: 13 Checks (2026) / 俄罗斯电子签证怎么填：13 个检查项（2026） | — | russia e visa processing time / 俄罗斯电子签证官网下载、俄罗斯电子签证可以停留多久、俄罗斯电子签证几天出、俄罗斯电子签证申请表怎么填、俄罗斯电子签证怎么填写 / 俄罗斯电子签证 waiting for payment confirmation | — |
| 枢纽页 `/russia/` | Russia e-Visa Guide: Official Site and Eligible Countries / 俄罗斯电子签指南：官方网站与适用国家 | — | russia e-visa、russia e-visa for indians、russia e-visa application、russia e-visa cost、russia e visa check / 俄罗斯电子签证、俄罗斯电子签证申请官网、俄罗斯电子签证官网、俄罗斯电子签证网站官网、俄罗斯电子签证办理 / 俄羅斯電子簽證、俄羅斯電子簽證教學、俄羅斯電子簽證費用、俄羅斯電子簽證代辦、俄羅斯電子簽證申請 | — |

### 45. 阿曼 Oman（eVisa）

90 天 GSC + 11 周 Bing：曝光 2，点击 0，有曝光的查询 2 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/oman/evisa/` | Oman eVisa: Check the 14-Day Exemption Before Applying (2026) / 阿曼电子签证官网：先查 14 天免签（2026） | — | — / — / — | — |
| 填写页 `/oman/how-to-fill/` | How to Prepare an Oman eVisa Application (2026) / 阿曼电子签证怎么填：9 项申请准备（2026） | — | oman evisa processing time、oman e visa download、oman e visa for uae residents processing time / 阿曼电子签证需要多久 / — | — |
| 枢纽页 `/oman/` | Oman eVisa Guide: 14-Day Exemption and Official Portal / 阿曼电子签官网与 14 天免签资格指南 | — | oman evisa、oman evisa portal、oman evisa application、oman evisa check、oman evisa for uae residents / 阿曼电子签证官网、阿曼电子签证、阿曼电子签证流程、阿曼电子签证官网入口网址、阿曼电子签证怎么申请 / 阿曼電子簽證、阿曼evisa、myanmar evisa official site、xin evisa hong kong | — |

### 46. 约旦 Jordan（Pass）

90 天 GSC + 11 周 Bing：曝光 2，点击 0，有曝光的查询 1 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/jordan/jordan-pass/` | Jordan Pass: Official Site, Prices and the JD 40 Visa Fee It Waives (2026) / 约旦通票 Jordan Pass 官网、票价与可免的 40 第纳尔签证费 | — | jordan pass、jordan pass cost、jordan pass official website、jordan pass online / 约旦pass、约旦pass怎么买、约旦官网 / 約旦pass | — |
| 填写页 `/jordan/how-to-fill/` | How to Buy the Jordan Pass: 17 Items That Cause Trouble (2026) / 约旦通票购买指南：17 个容易出错的环节 | — | — / — / — | — |
| 枢纽页 `/jordan/` | Jordan Entry Guide: Jordan Pass and Visa Fees / 约旦入境指南：Jordan Pass 官网、签证费与口岸 | — | jordan pass visa、jordan pass for us citizens、jordan pass for indians、jordan pass with visa / — / — | — |

### 47. 巴林 Bahrain（eVisa）

90 天 GSC + 11 周 Bing：曝光 1，点击 0，有曝光的查询 1 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/bahrain/evisa/` | Bahrain eVisa: Check Online and On-Arrival Eligibility (2026) / 巴林电子签证官网：先查线上与落地资格（2026） | — | — / — / 埃拉·巴林斯卡、艾拉・巴林斯卡 | — |
| 填写页 `/bahrain/how-to-fill/` | How to Prepare a Bahrain eVisa Application (2026) / 巴林电子签证怎么填：11 项申请准备（2026） | — | bahrain evisa processing time / — / — | — |
| 枢纽页 `/bahrain/` | Bahrain eVisa Guide: Official Portal and On-Arrival Rules / 巴林电子签官网、落地签与资格指南 | — | bahrain evisa、bahrain evisa official website、bahrain evisa fee、bahrain evisa portal、bahrain evisa apply / 巴林电子签证、巴林电子签证照片要求、巴林电子签证官网、巴林电子签证怎么申请、巴林电子签证怎么办理 / xin evisa online taiwan、www.evisa.gov.mw | — |

### 48. 摩洛哥 Morocco（eVisa）

90 天 GSC + 11 周 Bing：曝光 1，点击 0，有曝光的查询 1 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/morocco/evisa/` | Morocco eVisa: Check Whether You Need One Before Paying (2026) / 摩洛哥电子签证官网：付款前先查免签资格（2026） | — | — / — / — | — |
| 填写页 `/morocco/how-to-fill/` | How to Prepare a Morocco eVisa Application (2026) / 摩洛哥电子签证怎么填：12 项资格与材料检查（2026） | — | morocco evisa processing time、morocco e visa processing time、how to fill morocco visa application form、morocco visa application form pdf / 摩洛哥电子签证几天出签、摩洛哥电子签证办理时间、摩洛哥签证最多可以签多长时间 / — | — |
| 枢纽页 `/morocco/` | Morocco eVisa Guide: Who Needs One and Official Portal / 摩洛哥电子签官网、免签资格与费用指南 | — | morocco evisa、morocco evisa application、morocco evisa cost、morocco evisa official website、morocco evisa for indians / 摩洛哥电子签证官网、摩洛哥电子签证登录入口、摩洛哥电子签证怎么申请、摩洛哥电子签证怎么办理、摩洛哥有电子签证吗 / — | — |

### 49. 斯里兰卡 Sri Lanka（ETA）

90 天 GSC + 11 周 Bing：曝光 0，点击 0，有曝光的查询 0 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/sri-lanka/eta/` | Sri Lanka ETA: Check Whether Your Fee Is Zero Before Paying (2026) / 斯里兰卡 ETA 官网收费吗？先确认你的费用是不是零 | — | — / 斯里兰卡阿塔纳水厂项目、斯里兰卡属于哪个洲、斯里兰卡简介、斯里兰卡是什么国家 / 斯里蘭卡6-1 | — |
| 填写页 `/sri-lanka/how-to-fill/` | How to Prepare a Sri Lanka ETA Application (2026) / 斯里兰卡 ETA 怎么申请：8 项准备清单（2026） | — | sri lanka eta processing time、sri lanka eta download、how to fill sri lanka eta form、how to fill sri lanka eta、how to fill sri lanka visa / 斯里兰卡eta样本、斯里兰卡eta需要打印吗、斯里兰卡ETA签证申请步骤、斯里兰卡ETA怎么取消、斯里兰卡ETAemail / — | — |
| 枢纽页 `/sri-lanka/` | Sri Lanka ETA Guide: Official Site and Fee Check / 斯里兰卡 ETA 官网、免费名单与费用查询指南 | — | sri lanka eta、sri lanka eta application、sri lanka eta visa、sri lanka eta visa official website、sri lanka eta official website / 斯里兰卡eta、斯里兰卡eta官网、斯里兰卡eta签证官网、斯里兰卡eta申请、斯里兰卡eta官网入口 / 斯里蘭卡eta、斯里蘭卡eta教學 | — |

### 50. 坦桑尼亚 Tanzania（eVisa）

90 天 GSC + 11 周 Bing：曝光 0，点击 0，有曝光的查询 0 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/tanzania/evisa/` | Tanzania eVisa: Official Site and the Right Fee for Your Route (2026) / 坦桑尼亚电子签证官网：先按护照和目的选类别（2026） | — | — / — / — | — |
| 填写页 `/tanzania/how-to-fill/` | How to Prepare a Tanzania Online Visa Application (2026) / 坦桑尼亚电子签证怎么填：10 项申请准备（2026） | — | tanzania evisa processing time、tanzania e visa processing time / 坦桑尼亚电子签证几天可以出、坦桑尼亚电子签证多久出签、坦桑尼亚电子签证怎么弄 / — | — |
| 枢纽页 `/tanzania/` | Tanzania eVisa Guide: Official Site and Fees / 坦桑尼亚电子签官网、费用与签证类别指南 | — | tanzania evisa、tanzania evisa application、tanzania evisa status、tanzania evisa official website、tanzania evisa portal / 坦桑尼亚电子签证官网、坦桑尼亚电子签证、坦桑尼亚电子签证申请、坦桑尼亚电子签证网站、坦桑尼亚商务电子签证 / 坦尚尼亞電子簽證 | — |

### 51. 中国 China（Arrival Card）

90 天 GSC + 11 周 Bing：曝光 0，点击 0，有曝光的查询 0 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/china/arrival-card/` | China Arrival Card: Official NIA Site, Free Filing (2026) / 中国入境卡网上填报 2026：官方网址、免费、谁要填谁免填 | — | china entry card application、china digital.arrival card application、china entry card app、china landing card app / 中国入境卡、中国入境卡电子版、中国入境卡什么时候填、中国入境卡网上填报 / 中國入境卡、中國入境卡填報、中國入境卡 台胞證、中國arrival card | — |
| 填写页 `/china/how-to-fill/` | How to Fill the China Arrival Card (2026): Upload, Dates and Entity Contact / 中国入境卡怎么填 2026：护照上传、日期、境内单位联系方式 | — | — / 中国入境卡填写、中国入境卡填写2026、中国入境卡怎么填、中国入境卡填写2025、中国入境卡填写样本 / 中國入境卡填寫、中國入境卡填寫台灣人 | — |
| 枢纽页 `/china/` | China Arrival Card Guide: Official NIA Site, Free Filing / 中国入境卡指南：NIA 官方网址、免费网上填报 | — | — / — / 中國入境卡 台灣、中國入境卡 香港人、中國入境卡 台灣人 | — |

### 52. 南非 South Africa（Traveller Declaration）

90 天 GSC + 11 周 Bing：曝光 0，点击 0，有曝光的查询 0 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/south-africa/traveller-declaration/` | South Africa Traveller Declaration: Official SARS Site and 24-Hour Rule / 南非入境海关申报官网：SARS 旅客申报与 24 小时规则 | — | south africa travel form、south africa arrival card、south africa arrival card online、south africa landing card / 南非入境卡、南非入境最新规定2023、南非入境卡怎么办理流程、南非入境卡怎么申请 / 南非入境卡 | — |
| 填写页 `/south-africa/how-to-fill/` | South Africa Customs Declaration: How to Prepare and Submit / 南非入境海关申报怎么填：资料准备与提交流程 | — | south africa traveller declaration、south africa traveller declaration form、south africa traveller declaration system、south africa traveller declaration app、south african traveller declaration online / 南非入境卡填写样本、南非入境卡填写、南非入境卡pdf版、南非入境卡填写中英文、南非入境卡填写必须本人吗 / — | — |
| 枢纽页 `/south-africa/` | South Africa Traveller Declaration Guide: Official SARS Site / 南非入境申报指南：SARS 旅客海关申报与 24 小时规则 | — | visa on arrival south africa、visa card south africa、visa on arrival countries for south africans、south africa arrival requirements、is south africa visa on arrival / — / — | — |

### 53. 尼日利亚 Nigeria（Landing & Exit Card）

90 天 GSC + 11 周 Bing：曝光 0，点击 0，有曝光的查询 0 个。

| 页面 | 现标题（英 / 简） | 有曝光的长尾词（曝光 / 平均排名） | 联想词需求（英 / 简 / 繁） | 本页 FAQ |
|---|---|---|---|---|
| 表单页 `/nigeria/landing-exit-card/` | Nigeria Landing & Exit Card: Official NIS Portal, Free Filing / 尼日利亚入境卡官网：Landing & Exit Card NIS 免费办理 | — | nigeria landing exit card、nigeria landing and exit card application、nigeria landing and exit card portal、nigeria landing and departure card / 尼日利亚入境卡、尼日利亚入境卡网址、尼日利亚入境卡官网入口、尼日利亚入境卡怎么注册账号 / — | — |
| 填写页 `/nigeria/how-to-fill/` | How to Prepare Nigeria's Landing & Exit Card / 尼日利亚入境卡怎么填：Landing & Exit Card 资料准备与打印 | — | nigeria landing card for expired passport、when to apply for landing card nigeria、how to fill nigeria landing card、how to complete nigeria landing card、how to print recharge card in nigeria / 尼日利亚入境卡填写、尼日利亚入境卡最新样本、尼日利亚入境卡注册步骤、尼日利亚入境卡怎么填、尼日利亚入境卡填写模板 / — | — |
| 枢纽页 `/nigeria/` | Nigeria Landing and Exit Card: Official NIS Portal, Free / 尼日利亚入境卡指南：NIS 官方入口、免费办理 | — | nigeria visa landing exit cards、does nigeria have visa on arrival、can you get a nigerian visa on arrival、visa on arrival for nigeria、nigeria visa on arrival application / — / — | — |
