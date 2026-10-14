# 收入与增长计划

记录时间：2026-10-13
输入：GA4/GSC 28 天数据（2026-09-15～10-12，`scripts/fetch-search-data.mjs` 拉取，导出未入库）、`docs/reports/2026-10-12-seo-audit/`、`docs/mcp.md`、下列三份旧报告、外部调研（见文末来源）
状态：**执行中**。2026-10-13 站长拍板：S1 维持现状、冻结 MCP full 模式；A1、A3、A4 已于 2026-10-13 上线：提交 ecb16c0，CI 38352766925 的 Build 与 Deploy 成功，CI 经 Cloudflare 回读生产版本一致（static），正式域名独立回读通过；实施记录见第五节。第七节其余事项待拍板。
关系：本文复核并更新 `docs/reports/monetization-model-2026-07-23.md`、`docs/reports/affiliate-placement-2026-07-23.md`、`docs/reports/b2b-licensing-outreach-2026-08-29.md` 的结论，冲突处以本文为准。

## 一、结论

1. **不做防爬。** 数据已在公开仓库，按 CC BY-SA 授权；Bing 和 AI 的抓取是现在唯一有效的分发渠道。要处理的是第三节的三件事。
2. **当前流量下，任何模式的收入都在每月几美元到几百美元之间。** 收入 = 流量 × 用户愿意付钱的时刻 × 单价，三项现在都小。
3. **本站的成功动作没有买家。** 把人送到官网这件事，没人付钱；愿意付钱的需求（省事、代办）恰好是本站承诺不做的。能挂收入的只有两处：填完表到落地前的 72 小时（eSIM、接机），以及另一类客户（旅行社、品牌方）。
4. **旧路线调整。** B2B 数据授权降为一次性验证；MCP 收费冻结；先问付费意愿，再建收费系统。
5. **执行顺序。** 第 1 周做四件不碰用户数据、不收旅客钱的事；第 2–3 周做付费意愿访谈和中文社交测试；第 12 周（2027-01-05）按第六节的判据决定继续投入还是转入低成本维护。

## 二、现状（2026-09-15～10-12，28 天）

| 指标 | 数值 |
|---|---|
| 真实会话 | 约 1,400。自然搜索 1,368；Direct 709 次里只有 78 次有互动，基本是机器人 |
| 来源 | bing/organic 540、cn.bing.com 448、google 166、Yahoo（含港台）约 160、chatgpt 23、copilot 11 |
| ChatGPT 引荐 | 7 月底到 8 月初每周 243–305 次；08-08 起跌到每周个位数，没有回升，原因未定 |
| 有互动会话的语言 | 英文 422、简体 346、繁体 106，中文占 52% |
| 国家 | 中国大陆 816（有互动 251，主要经 cn.bing.com）、美国 354、台湾 116、香港 88、英国 86 |
| 关键事件 | `official_link_click` 418 次，`affiliate_click` 1 次 |
| Google 点击设备 | 桌面 73、手机 54、平板 4 |
| Google 曝光主题 | 电子旅行许可（主要是英国 ETA）478、填表字段 452、签证停留 174、海关申报 164、机场交通 2 |
| 收入 | 0。唯一联盟伙伴是 SafetyWing，`config.toml` 的 `airalo_url` 为空 |

旧计划的执行情况：`b2b-licensing-outreach-2026-08-29.md` 的 5 封外联，在项目文档、统一库变更记录和会话记录里都没有发送痕迹。同期工程投入在 MCP 账户与额度、249 地资料库和繁体版上。MCP 自 2026-10-13 起以 static 模式上线，`/api/mcp` 返回 503。

## 三、防爬与数据边界

不做防爬的理由：

- 仓库 `onlyoasis/entrycardguide` 是公开的，字段规则、官网网址、指南正文都在里面。挡住网站，挡不住 `git clone`。
- 抓取就是分发。2026-10-13 用 OAI-SearchBot、ChatGPT-User、GPTBot、PerplexityBot、ClaudeBot 的 UA 实测，全部返回 200；`robots.txt` 全放行，没有 Cloudflare 托管的屏蔽段。保持现状。
- 官网网址、费用、字段长度是事实，换个说法就能重写。护城河是持续核验和日期，不是某一天的快照。
- Pages 的静态请求不计费。

要处理的三件事：

| # | 事项 | 现状 | 动作 | 优先级 |
|---|---|---|---|---|
| S1 | 公开仓库里的点名记录 | 14 个 `data/official_urls/*.toml` 含 37 条 `[[scam_sites]]`，`ivisa.com` 出现 12 次；`0d64de9` 删掉的点名页面仍在 git 历史里。08-10 下线点名是为了法律风险，这批记录仍可在 GitHub 搜到 | 需拍板，见第七节第 1 项 | 高 |
| S2 | 每个请求都进 Functions | 根目录 `functions/_middleware.js` 只做 www→apex 跳转；没有 `_routes.json`，所有请求都调用 Function，计入免费计划的每日额度 | 流量起来前，把跳转改成 Cloudflare 区域级 Redirect Rule，再用 `_routes.json` 只让 `/api/*` 进 Functions | 低 |
| S3 | MCP 发码接口防刷 | D1 原子限流已有 | 只在 MCP 转 full 模式时做：注册表单加 Turnstile，`/api/mcp/*` 加一条 WAF 限流 | 随 MCP |

另外，有人照抄指南正文时，按 CC BY-SA 去要求署名并链回，等于拿到一条外链。

## 四、方案评估

### 4.1 不做

| 方案 | 理由 |
|---|---|
| 展示广告 | 每月约 2,300 次页面浏览，只换几十美元；这类关键词最大的广告主是签证中介 |
| 付费代填 | 违背 `content/about.md` 第 34、66 行的承诺；泰国官方警告收费 TDAC 网站并请旅客举报，新加坡 ICA 不支持也不认可付费服务；据报道 Google 自 2020 年起禁投这类广告，2026-10-05 起要求政府授权并认证；要经手护照数据 |
| 向旅客收费的填表插件 | 同类 eVisaFlow 覆盖 TDAC、MDAC、SGAC 和 4 国电子签，数据存本地，ChromeBoard 显示 18 个用户；手机版 Chrome 装不了扩展；每国单独适配，官网改版就失效；同样违背承诺 |
| 通用旅游攻略 | 对手是 Lonely Planet、OTA、海量博主和 AI 概览；新域名几乎没有外链；批量 AI 内容会触碰 Google 的规模化内容政策；稀释"官方入境表"这个主题 |
| 大模型问答作为收入 | 每次提问都有成本，公开接口会被刷，入境规则答错代价高，用户不会付费 |
| MCP 收费 | 数据全公开，Agent 能直接读网页；full 模式还要 Workers Paid 和发信配置 |
| 向 AI 爬虫收费 | 据报道 Cloudflare 的按抓取付费仍在私测，前提是先拦 AI 爬虫，等于砍掉分发 |
| 收中介的钱、给中介发认证 | about 页承诺 |

### 4.2 做（按优先级）

| # | 方案 | 收入方式 | 当前流量下的量级（估算） | 工作量 | 前置验证 |
|---|---|---|---|---|---|
| R1 | 联盟换成 eSIM、接机 | 佣金 | 每月 $1–8；流量涨 10 倍约 $10–80 | 1–2 天 | 无，直接上 |
| R2 | 旅行社批量填表工具（Chrome 扩展，数据留在本地） | 按账号收年费 | 假设 20–50 家，每家每年 ¥200–500，约每月 $50–300 | 开发 2–4 周 | 访谈 10 家（B1） |
| R3 | 中文社交分发（小红书、公众号） | 平台广告分成、品牌合作、带货 SIM 卡和 WiFi | 取决于粉丝量，从 0 起步 | 每周 2–3 篇 | 4 周发 10 篇（B3） |
| R4 | 电子签照片工具（照片在浏览器里处理） | 每张 $3–5 | 每月几美元到几十美元 | 1–2 周 | 先做免费的尺寸和体积压缩（D2） |
| R5 | 品牌赞助"落地准备"栏位 | 每月固定费 | 月会话过万再谈 | — | 与 B1 同期询问（B2） |

估算口径：有互动会话约 870 次/月。R1 按 60% 看到推荐 × 点击 2–5% × 成交 5–10% × 每单佣金 $1.5–3（eSIM 客单约 $15 × 10–18%，接机约 $40 × 8%）。这些是估算，不是预测。

R2 的依据：一个 30 人的团按每人 5 分钟算，要填两个半小时，每个团都要重复。泰国 AGENTS 公司已经给旅行社做了 TDAC 平台：72 小时内提交免费，提前自动提交收 $8。本站的差异在字段规则和报错解读：TDAC 的姓名、护照号、出生日期提交后不能改，提交前校验最值钱。边界：人机验证和提交按钮由人完成；只卖给把入境卡含在团费里的旅行社，不卖给单独收代填费的。

R4 的依据：政府不免费提供照片，卖照片处理不违背承诺。这是现成的付费市场：Visafoto 约 $9 一张，Passport Photo Online $6.95。规格很严：越南电子签要 4×6 cm、JPEG、2MB 以内；印度电子签要 350–1000 像素的方图、JPEG、1MB 以内。照片不上传是隐私卖点；缺点是对手的 SEO 很强。

## 五、执行计划

### 第 1 周（10-13～10-19）：不碰用户数据、不收旅客钱的四件事

**A1 官网链接改为新标签页打开**

- 文件：`layouts/shortcodes/official-link.html`、`official-directory.html`、`source-link.html`。三处 `official_link_click` 链接现在都没有 `target`，用户点完就离开了本站。
- 加 `target="_blank"`，保留 `rel="noopener"`。
- 验收：`npm run build:prod`、`npm run check:seo` 通过；`official_link_click` 事件照常触发。
- 实施记录（2026-10-13）：已完成。构建产物里 1,092 个 `official_link_click` 链接全部带 `target="_blank"`。`layouts/partials/article-rail.html` 也列官方网址，但只用于通用 single 布局，本轮未改。

**A2 联盟换品类**

- 先由站长注册联盟账号（Claude 不能代为注册）：
  - 英文：Travelpayouts，一个账号接 Airalo（10%，30 天 cookie）、Yesim（18%）、Welcome Pickups 接机（8%，45 天 cookie）。
  - 繁体：KKday、Klook。基础佣金约 2–6%，eSIM/SIM 类在活动期曾到 9.6%–20%。
  - 简体：大陆行货手机多数不支持 eSIM，适合实体 SIM、随身 WiFi、接机。合作方和佣金待查，排最后。
- 代码：
  - `config.toml` 的 `[params.affiliate]` 改成按语言配置伙伴。
  - `layouts/partials/affiliate-footer.html`、`affiliate-rail.html` 按语言取伙伴。
  - 文案加在 `i18n/en.yaml`、`i18n/zh.yaml`；`i18n/zh-hant.yaml` 用 `npm run sync:zh-hant` 生成。
- 位置不变，仍在"§ 提交之后"后面（08-30 已调整）。每个语言区最多两个伙伴（2026-10-13 已拍板，Task 04 已同步）。
- SafetyWing 只保留在入境要求含保险的目的地，例如古巴；动手前先按官方来源核实。
- GA4：`affiliate_click` 带 partner、slot、lang 三个参数。
- about 页：改写 `content/about.md` 第 52–58 行"只用一个联盟链接、这就是全部商业模式"和第 94 行"买保险时点联盟链接"，`about.zh.md` 同步，繁体由 sync 生成。保留第 60–66 行"不收中介的钱、不为填表收费"。
- 验收：三语页面渲染对应语言的伙伴；披露文案三语齐全；`check:seo`、`check:zh-hant` 通过。

**A3 网页版预填清单**

- 范围：泰国 TDAC、马来西亚 MDAC、新加坡 SGAC、印尼 All Indonesia。`data/rules/` 已有这四国的规则，相关页面已嵌入 `{{< validator >}}`。
- 形态：在现有 validator 上加"生成清单"。用户输入，按 `data/rules` 校验，转成官方格式（护照上的英文姓名顺序、DD/MM/YYYY、航班号格式），再按官网字段顺序输出清单，每项一个复制按钮。
- 约束：零网络请求、零 npm 依赖，数据不出浏览器（about 页第 67 行的承诺）。
- 清单末尾放"落地准备"：A2 的 eSIM 和接机。
- 页面加"需要人帮忙？"入口，指向清单，并说明本站不代填的原因。
- GA4：`prefill_generated`（country、lang）、`need_help_click`（lang）。不传任何输入内容。
- 验收：四国清单的字段顺序与官网一致（动手时人工对照一次官网）；断网后可用；`build:prod`、`check:seo` 通过。
- 实施记录（2026-10-13）：已完成，三处与原设想不同：
  - 顺序按 `data/fields/{country}.toml` 的字段卡（即本站指南顺序），不是官网完整表单顺序。校验器只覆盖最易出错的 8–10 个字段（TDAC 全表 23 项），无法给出完整官网顺序；未在官网上逐项对照。没有字段卡的规则排在最后（如新加坡的到达日期）。
  - 日期保持 ISO（YYYY-MM-DD），与站内指南"粘贴用 ISO"的说法一致，不新增格式说法。
  - 不加 GA4 事件：校验器框里写着"No network calls. No tracking."，清单、复制按钮、"需要人帮忙？"都不发事件，清单里的官网链接也不带统计。要统计使用量，得先改这句承诺（第七节第 7 项）。
  - 范围由 `config.toml` 的 `[params.prefill_sheet] countries` 控制；帮助文案写了"官方表免费"，只能列免费表单。启用清单的国家，校验器行顺序也改为指南顺序，其他国家不变。
  - 纯函数在 `assets/js/lib/prefill.ts`，测试 `tests/prefill-sheet.test.mjs`（`npm run test:ui`，已加入 CI）。浏览器实测：清洗、缺项、格式错误提示、复制按钮、三语文案、375px 无横向溢出均通过。
  - 既有现象：简体页的校验器标签和报错是英文（只有繁体有覆写），本轮未改。

**A4 "这是不是官网"查询**

- 位置：`/official-links/` 页顶部，三语。
- 逻辑：用户输入网址，取出域名，对照各国 `data/official_urls/*.toml` 里官方表单和机构条目的 `url` 域名（构建时嵌入；排除 `[[scam_sites]]`、`[[outcomes]]`、`[news]`）。命中就显示国家、表单、机构和核验日期；没命中就显示"不在本站的官方清单里"，并给出按国家选择的官方地址。
- 约束：只确认官方，不评价第三方，不渲染 `[[scam_sites]]`；输入的网址不上传。
- GA4：`domain_check`（result = match / no_match）。
- 验收：所有官方域名都能命中；`www.`、大小写、路径、端口不影响判断。
- 实施记录（2026-10-13）：已完成，放在 `official-directory` shortcode 顶部（`layouts/partials/domain-check.html`），不改 content 文件，脚本只在该页加载。数据为 200 条官方条目、122 个域名，其中 45 个不是政府后缀（旅游局、官方签证外包商等），所以结果写成"在本站官方清单里"，不说"是政府域名"。不发 `domain_check` 事件；只有命中结果里的官网链接计入 `official_link_click`（`link_slot=checker`）。页面内嵌 JSON 约 51KB（未压缩）。纯函数在 `assets/js/lib/official-host.ts`，测试 `tests/official-host.test.mjs`。

### 第 2–3 周（10-20～11-02）：问付费意愿

执行稿（话术、邮件、10 篇选题要点、结果记录表）：`docs/plans/2026-10-13-week2-3-materials.md`。

**B1 访谈 10 家旅行社**（站长执行；Claude 可准备名单和话术）

- 对象：做泰国、马来西亚、新加坡、印尼团的中文旅行社和领队 6 家，泰国本地地接社 4 家（英文）。
- 问题：
  1. 现在团员的入境卡由谁填、怎么填，一个团花多久？
  2. 过去半年填错过吗？后果是什么？
  3. 用过官方团体提交（每次最多 10 人）或 AGENTS 这类平台吗？
  4. 名单在本地批量校验并辅助填写、数据不出电脑，每年 ¥199–499 愿意付吗？哪个价位会犹豫？
  5. 缺了什么功能就不会用？
- 判据：有 2 家及以上愿意报价或试用，第 4 周起做 R2 最小版本（D1）；少于 2 家，R2 停止。

**B2 询问品牌赞助 4–5 家**：Airalo、Yesim、KKday、Klook、Holafly。如实给出第二节的流量，问"落地准备"栏位按月固定付费的意向。

**B3 中文社交测试**（站长执行，可用现有公众号写作工具链）

- 小红书为主，公众号同步；4 周 10 篇，复用站内事实，每篇注明核验日期。
- 选题：泰国入境卡官网免费、别点收费站；马来西亚 MDAC 三分钟填完；印尼 All Indonesia 怎么填；新加坡 SGAC 填错了怎么办；护照姓名顺序怎么填；酒店地址英文怎么写；各国带多少现金要申报；入境卡要提前几天填（72 小时窗口）；Visit Japan Web；韩国电子入境卡。
- 判据（建议值，可调）：10 篇累计收藏 300 以上或涨粉 200 以上，继续并开始接品牌合作；否则停止。

**B4（可选）旧 B2B 邮件**：`b2b-licensing-outreach-2026-08-29.md` 的 5 封可以发一轮，卖点改成"维护 + 变更通知"，不再讲许可，不追加工程投入。

### 持续：流量

- **C1** 按 `docs/reports/2026-10-12-seo-audit/ACTION-PLAN.md` 推进：英国 ETA 地址字段那组词 28 天约 300 次曝光、排名 6–9、几乎 0 点击；印尼与多米尼加核验日期过期；表单页站内入链少。
  - 进度（2026-10-13）：第 1 阶段 1～3 项已随 10-13 发布上线；第 2 阶段已做“表单页 Article 加 about: GovernmentService”（318 页）和“About 页删掉 scam-site list”。印尼两页字段数说法已一致，无需再改。待站长：ChatGPT 引用基线、Bing Webmaster 核对、是否引用政府警示；2026-10-13 续做：`static/favicon.ico`；“More stops”区块加填写页链接；中文 logo 链接可访问名称包含可见文字（修 label-content-name-mismatch）；填写页显示 FAQ（此前中国、南非、尼日利亚只在结构化数据里有），并新增 `data/seo/faq.toml` 给英国 ETA 填写页加 3 条地址与费用问答（不改内容文件）。2026-10-14：按 GSC 查询给印尼、卡塔尔、牙买加、印度、泰国、阿鲁巴、库拉索 7 个填写页加 FAQ（共 11 条×三语，答案只复述站内已有事实；库拉索“乘客定位卡”站内无出处，未写）。待做：其余填写页 FAQ（目前无查询信号）、编辑方针页、表单截图、sitemap x-default（需重写 sitemap 模板，暂缓）；约 10-27 用 `fetch-search-data.mjs --days=14` 对比四个 how-to-fill 页的 CTR。
- **C2** "落地前后"内容试点：泰国、日本两地，三语。内容包括海关免税额度与现金申报门槛（来自 249 地资料库的公开事项）、自动通关资格、机场进城、落地上网，每条带官方来源和核验日期。4–6 周后看曝光，再决定是否扩到马来西亚、印尼、越南、新加坡、韩国、台湾。
- **C3** ETIAS 准备：据报道已推迟到 2027 年，官方未定日期，费用 €20；台湾、香港护照持有人也要申请。官方公布日期后提前 2–3 个月上线，用已有设计稿。
- **C4** `/ask/` 使用数据：上线 4 周后统计提问次数和未命中次数，未命中按国家粗分类，不记录原文。

### 第 4–8 周（11-03～12-07）：看验证结果再做

- **D1** R2 最小版本，仅在 B1 通过时做：Chrome 扩展，只做 TDAC 团体提交；读取本地表格，按 `data/rules/thailand.json` 校验后辅助填写；人机验证和提交由人完成。
- **D2** 电子签照片：先做免费的尺寸与体积压缩（越南、印度、柬埔寨、老挝），看使用量再决定是否做付费版。
- **D3** 72 小时提醒（可选）：用户只留邮箱、目的地、到达日期，到点发官网链接。需要 Workers Paid（$5/月）和发信配置，等 A3 有数据再定。

## 六、度量与第 12 周决策点

每周看：每千次会话收入（RPM）、`affiliate_click`（按 partner、lang）、`official_link_click`（含 `link_slot=checker`）、自然会话数。复制清单和"需要人帮忙？"目前没有统计（见 A3 实施记录）。

第 12 周（2027-01-05）：

| 条件 | 动作 |
|---|---|
| B1 少于 2 家愿意报价或试用 | 不做 R2 |
| RPM × 现实可达流量（如 10 倍）仍低于每月 $100，且 B2B 无人付费 | 转入低成本维护：每月几小时，只做核验和月度复盘。一年成本十几美元，不关站 |
| eSIM 点击率超过 3% | 评估自营白标 eSIM，毛利高于联盟佣金，可接收款中心 |
| R2 有付费客户 | 只做付费客户要的功能 |
| B3 达到判据 | 继续中文社交，开始接品牌合作 |

## 七、需要拍板的事项

1. **公开仓库里的 37 条点名记录（S1）**：**2026-10-13 已拍板，选 c，维持现状。** 原三个选项：
   - a. 移到私有位置（参照研究主库的做法），接受 git 历史里的残留（CLAUDE.md 禁止 force push）；
   - b. 仓库转私有，同时改掉 about 页的"开源"表述；
   - c. 维持现状，接受风险。
2. **Task 04 的"最多两个联盟伙伴"** 改为每个语言区最多两个（`docs/tasks/04-affiliate-links-revenue-integrity.md`）：**2026-10-13 已拍板，Task 04 已改。**
3. **改写 about 页的商业模式表述**（A2）。
4. **冻结 MCP full 模式**：**2026-10-13 已拍板冻结。** `wrangler.toml` 的 `database_id` 保持占位符，不再配置生产 D1 和发信，不运行 `Provision MCP production`，直到有人要 API。
5. **是否投入 R3**，即每周 2–3 篇的时间。
6. **S2 需要你在 Cloudflare 控制台加区域级 Redirect Rule**（低优先级）。
7. **是否统计复制清单的使用量**：需要先把校验器框里"No network calls. No tracking."改成更精确的说法（例如"你输入的内容不会发出；我们只统计按钮点击次数"），三语同步。不改就不统计。

## 八、语言扩充（2026-10-13 站长同意按此推进）

结论：不铺开新语言，先补现有缺口，再拿德语做小范围试点。

依据（GSC 28 天，2026-09-15～10-12）：
- 德国曝光 381，排第 5，与澳大利亚持平；荷兰、法国、西班牙、意大利、瑞典、波兰各一两百，这些人现在看英文结果。
- 已有少量母语搜索词：德语 "Kuba Touristenkarte ausfüllen"、西语 "forma migratoria múltiple fmm"、印尼语 "kartu kedatangan indonesia"。
- 韩语、日语、俄语没有信号（站内没有这些语言的内容，看不到不等于没需求）；韩国以 Naver 为主，Google SEO 效果有限；俄语联盟和支付受制裁影响。
- 繁体能做全站是因为由简体自动转换；新语言要从头翻译约 156 篇内容、界面、校验规则、决策树，以及 249 个目的地页，之后每次核验更新都要跟着改。

### L1 简体页校验器中文化（立即做）

- 现状：简体页校验器的标签和报错是英文，只有繁体有 `data/rules_i18n/*` 覆写；有互动会话里约 40% 来自简体页。
- 做法：`scripts/zh/gen-rules-zh.mjs` 用 opencc-js 把已审校的繁体覆写转成简体，生成 `data/rules_i18n_zh/*.json`，台湾用词在脚本的 POST 表里改，不手改生成文件；`--check` 接入构建前门禁；`validator.html` 在 zh 页合并这份覆写。
- 验收：17 国校验器在简体页显示中文标签、说明和报错；繁体和英文不变；`build:prod`、`check:seo` 通过；抽查生成文字无繁体残留和台湾用词。
- 实施记录（2026-10-13）：已完成。17 个国家、408 条中文文字生成；构建产物里简体页 294 个校验器标签全部为中文，英文页 294 个不变；POST 表改了“字元、电子邮件地址、拷贝、社区媒体、住家地址、目前状况”。

### L2 德语试点（排在第 1–3 周计划之后）

- 范围：泰国 TDAC、印尼 All Indonesia、马来西亚 MDAC、新加坡 SGAC、古巴，每个 2 页（表格介绍、填写步骤），约 10 页，加界面文字；资料库、决策树、问答不做德语。
- 前提：先评估四语言对现有模板的影响（roster 与 data 里的 `_en/_zh/_zh_hant` 字段、hreflang、语言切换、三语 SEO 门禁、sitemap、robots），定出只出试点页的做法，再动手。
- 翻译：机器翻译后必须由德语母语者审校，未审校不上线。
- 判据：上线 6–8 周后，德语页 Google 曝光达到英文同类页的三分之一以上，再扩到 20 国并考虑西语；达不到就下线并 301 回英文页。

### L3 排期

L1 立即做；L2 在第 1–3 周（流量修复、旅行社访谈、中文社交测试）之后，不与它们抢时间。

## 九、风险与未知

- 联盟账号可能因流量小被拒。被拒时先上 Travelpayouts，KKday、Klook 改走 Involve Asia 或 Ecomobi。
- 所有收入数字都是估算，不是预测。
- ChatGPT 引荐断崖的原因未定，这条渠道当作不受控。
- 大陆用户的合作方与佣金没查到。
- 古巴的保险要求、各国照片规格、TDAC 旅行社代交的官方依据，动手前都要按官方来源核实。

## 十、来源

内部：

- GA4/GSC 28 天导出（2026-09-15～10-12，未入库）。复现：`node scripts/fetch-search-data.mjs --days=28 --end-date=2026-10-12`
- `docs/reports/2026-10-12-seo-audit/FULL-AUDIT-REPORT.md`、`ACTION-PLAN.md`
- `content/about.md`、`config.toml`、`data/official_urls/*.toml`、`functions/_middleware.js`

外部：

- 政府立场：[新加坡 ICA 虚假网站提醒](https://www.ica.gov.sg/public-education/advisory-on-fake-or-misleading-websites)、[ICA 媒体稿](https://ica.gov.sg/news-and-publications/newsroom/media-release/reminder-to-all-travellers-including-singapore-residents-to-submit-sg-arrival-card-prior-to-arrival-in-singapore)、[Khaosod：泰国警告收费入境卡网站](https://www.khaosodenglish.com/tourism/2025/10/17/thailand-warns-tourists-of-fake-arrival-card-websites-charging-fees/)、[泰国驻布加勒斯特使馆：团体提交](https://bucharest.thaiembassy.org/en/content/thailand-digital-arrival-card-tdac)
- Google 广告政策：[Search Engine Land](https://searchengineland.com/google-tightens-ads-policy-for-government-document-providers-484342)、[TechWyse](https://www.techwyse.com/news/platform-updates/google-ads-government-documents-services-policy-update-october-2026)
- 同类产品：[eVisaFlow（ChromeBoard）](https://chromeboard.com/extension/evisaflow-southeast-asia-bgimfbnnojdhdmjmoihbnddoaciedgbc)、[AGENTS 旅行社 TDAC 平台](https://www.dpexnetwork.org/news/view/rkjL7MNrJTZvb6R7jGN8wG)
- 联盟佣金：[Airalo](https://www.airalo.com/blog/airalo-affiliate-program-faqs)、[Yesim](https://www.travelpayouts.com/en/offers/yesim-affiliate-program/)、[Welcome Pickups](https://www.travelpayouts.com/en/offers/welcome-pickups-partner-program)、[KKday](https://ecomobi.com/kkday-affiliate-via-ecomobi/)、[Klook](https://app.involve.asia/directory/klook-affiliate-program)
- 照片工具：[Visafoto 价格](https://getpulsesignal.com/pricing/visafoto)、[Passport Photo Online 对比](https://passport-photo.online/blog/visafoto-com-vs-passport-photo-online/)、[越南电子签照片要求](https://evisasvietnam.com/blog/vietnam-e-visa-photo-requirements-2026-the-complete-guide/)、[印度签证照片要求](https://photogov.net/knowledge/requirements/india-visa-photo/)
- ETIAS：[推迟到 2027（InsideFlyer）](https://insideflyer.com/posts/eu-postpones-etias-travel-authorization-to-2027/)、[费用 €20（CIBTvisas）](https://cibtvisas.com/blog/eu-increases-etias-fee-from-2026)
- AI 爬虫收费：[ppc.land](https://ppc.land/cloudflare-stops-charging-ai-per-crawl-and-starts-paying-per-answer/)；Pages 路由：[Cloudflare 文档](https://developers.cloudflare.com/pages/functions/routing/)
