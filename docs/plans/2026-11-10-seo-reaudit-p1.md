# SEO 复评 P1 实施：基线、改动与复查（2026-11-10）

来源：`/Users/lzc/Projects/project-registry/docs/audits/2026-11-10-opengefei-seo/entrycardguide.md` 的两项 P1。P2 推广项不在本单。

## 1. 基线（改动前）

GSC 网页搜索，2026-10-11～11-07，太平洋时间定稿数据，`seo-ops` MCP 只读查询，2026-11-10 取数。与总台复核读数一致。

### 页×词

| 页面 | 查询 | 点击 | 展示 | CTR | 平均排名 |
|---|---|---:|---:|---:|---:|
| `/uk/how-to-fill/` | provide the address where you live most of the time eta | 3 | 90 | 3.3% | 4.2 |
| `/zh-hant/singapore/how-to-fill/` | 新加坡入境卡姓名順序 | 8 | 21 | 38.1% | 2.0 |
| `/china/how-to-fill/` | entity contact information china arrival card | 1 | 26 | 3.8% | 2.4 |

同页相关词（复查时一并看）：

- 英国页：home address eta uk 1/87（6.8）、eta home address 1/46（5.7）、uk eta home address 1/45（5.5）、enter address line 1 eta 1/38（5.5）、enter address line 1 uk eta 0/31（5.0）、eta provide the address where you live most of the time 0/25（4.6）。
- 中国页：do you have any inviting entities or inviters in china 0/21（6.9）、带问号 0/21（7.8）、china arrival card inviting entities 0/17（6.0）。
- 繁中新加坡页：新加坡入境卡姓名 1/3（3.0）。

### 页面合计

| 页面 | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `/uk/how-to-fill/` | 75 | 4,197 | 1.79% | 4.6 |
| `/zh-hant/singapore/how-to-fill/` | 39 | 182 | 21.4% | 4.8 |
| `/singapore/how-to-fill/` | 27 | 1,361 | 1.98% | 6.2 |
| `/china/how-to-fill/` | 17 | 1,748 | 0.97% | 7.5 |
| `/china/arrival-card/`（中国官方入口页） | 2 | 1,129 | 0.18% | 16.0 |
| `/china/`（枢纽页） | 2 | 231 | 0.87% | 25.4 |
| `/`（英文首页） | 1 | 66 | 1.5% | 8.0 |

### GA4 同期（Asia/Shanghai 时区）

| 页面 | page_view | official_link_click |
|---|---:|---:|
| `/uk/how-to-fill/` | 112 | 1 |
| `/zh-hant/singapore/how-to-fill/` | 65 | 1 |
| `/china/how-to-fill/` | 25 | 1 |
| `/china/arrival-card/` | 117 | 28 |
| `/zh/china/arrival-card/` | 57 | 13 |

## 2. 改动

### P1-A 三张填写页（URL 不变）

| 页面 | 改动 | 官方依据（2026-11-10 重读） |
|---|---|---|
| `/uk/how-to-fill/` | 顶部加 Quick answers 表（7 行）；新增“已提交错地址”一节 | GOV.UK《Using the UK ETA app》：“If you have problems using the app, you can apply online instead”；“You cannot get a refund after you apply… need to change the details… apply again”。地址栏字符规则官方没公布，表里注明前五行是本站的读法和基本输入检查。 |
| `/china/how-to-fill/`（英、简、繁） | 邀请方段落加“无邀请方 / 单位邀请 / 个人邀请”对照表，用表单原标签和虚构示例；加三种常见填错；页首加一句指向入口页 | s.nia.gov.cn 表单脚本 `js/app.bc4b0fcf.js`（与 9-05 核对的是同一文件）：问题原文、Yes/No、Inviting entity in China、Inviter in China、Entity Name、Inviter's Name、Entity Contact Information、Inviter's Contact Information；联系电话 `maxlength 12`、只留数字。 |
| `/zh-hant/singapore/how-to-fill/`（源文件是简体，繁体由脚本生成） | 姓名段落加护照姓、名对照表和四种常见填法；改写“姓名顺序”FAQ 答案 | ICA 表单 `eservices.ica.gov.sg/arrivalcard/assets/i18n/en.json`、`zh.json`：Full Name (In Passport)、Given name followed by Surname、中文界面“护照全名”“名字在前，姓氏在后”、姓名允许的符号。 |

入口页字段名称链接：英国、中国、新加坡三个枢纽页（三语）和中国入口页各加指向填写页锚点的链接，锚文本用表单字段原文。

没写的：英国地址栏的字符上限和各国地址格式（官方没公布，线上地址步骤没进入）；新加坡增强版是否分姓、名两格（没逐屏核）。

### P1-B 首页与分工

- 英文首页 `<title>`：`entrycardguide` → `Official Arrival Card Links & Field Guides | EntryCardGuide`（`content/_index.md` 的 `seo_title`，`layouts/partials/head.html` 首页分支读取）。
- 首页导语加一句免费范围：入境卡和海关申报免费填报；政府自己收费的（英国 ETA 20 英镑、电子签签证费、阿鲁巴入境卡附带的 20 美元可持续发展费）标出官方金额。三语 i18n。
- 首页正文删掉“列出冒牌网址”“每条山寨预警附 DNS 证据”两句（2026-08-10 起站点已不发布第三方名单），英、简、繁。
- 中国两页分工：按基线，字段词（inviting entities、entity contact）只落在填写页；官网和回执词落在入口页；“china arrival card”头部词入口页 123 次展示、填写页 4 次、枢纽页 17 次，没有明显抢词。只加互链：填写页页首指回入口页，入口页用字段名称链到填写页。
- 三语一致性：对构建产物全部 1,263 个页面（三语各 421）逐页检查 `<html lang>`、标题语言（英文页标题不含汉字、中文页含汉字、繁体标题不含简体专用字）和 hreflang 四项齐全，0 个问题；`check:seo` 的三语门禁同时通过。

## 3. GA4 采集缺口

本期（10-11～11-07）Organic Search 3,152 会话、关键事件 0。事件明细：

| 事件 | 次数 | 来源 | 是否关键事件 |
|---|---:|---|---|
| official_link_click | 725 | 站内埋点（`assets/js/analytics.ts`） | 否 |
| affiliate_click | 3 | 站内埋点 | 否 |
| click（出站点击） | 790 | GA4 增强型衡量 | 否 |
| scroll / form_start / file_download | 710 / 4 / 9 | 增强型衡量 | 否 |

缺口：

1. **关键事件一个都没定义。** `official_link_click` 有采集，但 GA4 里没有标成关键事件，所以关键事件数是 0。把它标成关键事件要改 GA4 配置，属于写外部系统，待用户同意。
2. **校验完成没有事件。** `validator.ts` 不发任何统计，站点对外写的是“校验在浏览器内完成，零网络请求”。要统计校验完成，就得加一个不含字段值的事件，并改这句承诺的措辞，待用户决定。
3. 三张填写页的官方出口点击各只有 1 次：填写页读者的任务是填表，官方链接在页首；复查时把它和页面浏览一起看，不单独当成转化率。

## 4. 复查

按第 1 节同一批页×词，取 GSC 定稿数据，同时取 GA4 的 page_view 与 official_link_click。日期按 2026-11-10 上线算；实际上线晚几天就顺延几天。

| 复查 | 数据窗口 | 取数日期 |
|---|---|---|
| 14 天 | 2026-11-11～11-24 | 2026-11-27 |
| 28 天 | 2026-11-11～12-08 | 2026-12-11 |

看三项：页×词的点击和 CTR、页面合计、官方出口点击。首页标题另看 `/` 的展示和 CTR。回滚口径沿用标题会话的规则：目标词平均排名掉 2 位以上且点击下降，回滚对应页面的改动。
