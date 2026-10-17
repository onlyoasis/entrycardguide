# 英国 ETA 英文住址指南优化与复查交接

## 范围与状态

- 页面：`https://entrycardguide.com/uk/how-to-fill/`，优化现有英文指南，未新增 URL。
- 初始工作树干净。本轮没有 commit、push 或部署；上线时间、部署版本与线上页面均待调度程序回读。
- 只修改当前工作树。简体与繁体正文、语言路径、hreflang 和 sitemap 机制保持既有实现；本次未修改中文源文，不需要生成新的繁体正文。
- 源码 `lastmod` 更新为 `2026-10-17`，正文另有明确的来源核查日期。英文页面启用 GitInfo，未提交工作树的页头日期可能仍取上次提交；发布后须核对实际显示，不能仅凭 front matter 宣称已刷新。

## 核查结论与修改

原页有一个家庭住址段落和简短地址拆分示例，FAQ 已收录两条地址问题；没有目录、独立排错章节，也没有明确标注示例虚构或说明排错证据边界。

本轮补充常住地址含义、加拿大住址与伦敦短期酒店的区别、独立 Address line 1 章节、虚构房屋与公寓拆分表、无第二地址行时的示例、目录锚点、基本输入检查及官方网页申请和 webchat 入口。更新英文标题、H1、摘要和 FAQ 示例标识，保留英国国家枢纽和 ETA 介绍内链。

字段规则和浏览器校验器未修改。没有添加未经官方证实的字符上限、仅限 ASCII、删除标点或邮编占位符规则。手动重输和检查自动填充被明确标为本站建议，未声称已修复 App 缺陷。

## 官方证据（2026-10-17 核查）

- [Home Office App 指南](https://www.gov.uk/guidance/using-the-uk-eta-app)：公开指南确认申请询问地址；遇到 App 问题可以改用网页，也可求助 ETA webchat。指南未列出地址行字符限制或通用排错修复。
- [GOV.UK 申请说明](https://www.gov.uk/eta/apply)：官方网页申请入口、每人费用及决策邮件等原页流程信息。
- [GOV.UK ETA 概览](https://www.gov.uk/eta)：每人申请要求及官方 webchat 链接。
- 网页申请入口仅确认目标和 JavaScript 应用外壳；没有进入受会话控制的住址步骤，没有提交申请、付款或启动客服对话。搜索词中的题目和错误原文没有在实时地址界面复现；页面以条件句说明，不宣称已复现。
- 常住地址释义、地址拆分表和输入检查属于编辑解释；多住址、无固定住址和没有邮编却被阻挡等情况转官方支持，不编造确定填法。
- 官方来源入口及日期统一维护于 `data/official_urls/uk.toml`；MCP 快照随之再生成。

## 验证

- `npm run test:ui`：97/97 通过。
- `npm run gen:mcp`、`npm run check:mcp`：53 国快照生成并通过新鲜度检查。
- `npm run check:zh-hant`：通过，171/171 繁体内容、206 个 TOML 文件、53 个 roster 条目及手译快照均无陈旧。
- `npm run check:public-library`、`npm run check:library-ui`：通过（249 个目的地及对应记录，UI 派生物无漂移）。
- 源码 smoke：正文官方引用键、目录锚点、英文正文与 SEO 标题摘要一致性通过；这不替代 Hugo HTML 渲染验证。
- `git diff --check`：通过。
- 生产构建前执行 storage-governor preflight，目标为当前工作树 `public-release/`、峰值预算 0.5 GiB。失败原因：沙箱中 `diskutil` 无法调用 DiskManagement framework。遵循外盘规则，未执行该构建写入，也未回退内盘或安装依赖。
- `npm run build:prod`、`npm run check:seo` 和 HTML/目录/三语 sitemap smoke：待有磁盘管理访问能力的执行环境完成，不能宣称通过。缓存应保留在工作树 `.cache/hugo`，产物为 `public-release/`。

## GSC 原始机会数据

以下数值来自任务书，未重新查询 GSC，**原始统计周期未知，不是已确认的 28 天基线**。

| 页面内的精确查询 | 展示 | 点击 | CTR | 平均排名 |
| --- | ---: | ---: | ---: | ---: |
| provide the address where you live most of the time eta | 74 | 0 | 0% | 8.7 |
| enter address line 1 eta | 43 | 0 | 0% | 8.1 |
| uk eta enter address line 1 | 25 | 0 | 0% | 8.9 |

三条合计展示 142、点击 0、CTR 0%；不把这个合计当成页面全量，也不算简单平均排名。周期未知前不用于前后效果对比。

## 上线记录与完整 28 天复查

由发布方完成以下记录，本轮不部署，也不创建未来定时任务。

- 上线时间及其时区：待发布后回填。
- 部署 SHA / 平台记录：待回填。
- 正式页 HTML 回读、标题/H1/摘要、地址目录锚点及来源链接：待回填。
- 三语 hreflang、canonical 与 sitemap 回读：待回填。
- GSC 中的上线日期 D：按 Search Console 日期口径从实际发布时间确定，不用本地写稿日期替代。
- 对比前窗：D−28 至 D−1（含首尾 28 天）。后窗：D+1 至 D+28（含首尾 28 天），排除发布当天的混合内容。
- 等 GSC 后窗完整、final 数据可用再取数，记录实际取数日与窗口。固定 Search type=Web、精确页面=`https://entrycardguide.com/uk/how-to-fill/`、国家和设备不限，三个 query 逐条精确匹配；不要用全站 query 汇总替代页面×query。
- 用相同过滤取页面全量作为背景，三个 query 另列；原始 API 响应和窗口 metadata 保留于授权的当前工作树或指定外盘位置。可参考 `docs/maintenance/search-data-api.md` 和既有 `gsc-page-query.json` 格式，但本轮不使用凭据或联网取数。
- CTR=点击/展示，展示为 0 时记为不适用；未返回查询行记为“未返回/可能受匿名化影响”，不能直接补 0。排名读取各窗口 API 值，不简单平均每日或查询排名。CTR 变化记百分点，排名下降代表改善。少量样本和外部排名变化不足以证明因果。

发布后复制下表，前后窗各填四行：三个精确 query 和页面全量。三条 query 合计可另附，不能代替页面全量。

| 窗口与具体起止日 | 页面/精确 query | 展示 | 点击 | CTR | 平均排名 | 取数日/证据路径 |
| --- | --- | --- | --- | --- | --- | --- |
| 前窗：待回填 | provide the address where you live most of the time eta | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 前窗：待回填 | enter address line 1 eta | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 前窗：待回填 | uk eta enter address line 1 | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 前窗：待回填 | 页面全量 | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 后窗：待回填 | provide the address where you live most of the time eta | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 后窗：待回填 | enter address line 1 eta | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 后窗：待回填 | uk eta enter address line 1 | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |
| 后窗：待回填 | 页面全量 | 待取数 | 待取数 | 待取数 | 待取数 | 待回填 |

## 统一文档库待同步

用户要求仅改当前目录，且 Registry 不在可写范围，因此未同步外部统一库。交接方需将本报告的实际修改、验证及限制摘要同步至 `/Users/lzc/Projects/project-registry/docs/projects/entrycardguide.md` 最新变更，并追加 `/Users/lzc/Projects/project-registry/docs/changes/entrycardguide/2026-10.md`。架构、运行和部署事实本轮没有改变；不得把本地内容修改记作上线。后续通过构建和实际发布时另补证据。
