# 菲律宾繁体 eTravel 入口页优化交接

日期：2026-10-18。工作分支：`seo/entrycardguide-20261017-etravel`。
范围：当前 worktree；未 commit、push 或部署。内容修改已完成，本地验证有下述环境限制，不能视为发布验收通过。

## 页面分工与修改

| 页面 | 分工 |
| --- | --- |
| `/zh-hant/philippines/` | 入境要求摘要：官方入口、免费申报、适用对象和豁免、72 小时窗口；按需求导航到下面两篇指南 |
| `/zh-hant/philippines/etravel/` | 既有 eTravel 专页：辨认官方渠道、免费申报与提交后的 QR Code 说明；本轮未改正文 |
| `/zh-hant/philippines/how-to-fill/` | 既有字段指南：护照、行程、联系方式等字段卡片及本地检查；本轮未改正文 |

原入口页已有两篇子页的正文链接，列表模板也已有首屏导航。本次改写摘要及链接说明，不新增页面，不调整 URL、canonical、hreflang 或 sitemap 机制。提供的 GSC 数据不足以诊断落错页、下滑或技术异常，也不足以证明本次优化有效。

修改文件：

- `content/philippines/_index.zh.md`：简体内容源，重写标题、摘要、办理要求及导航，核查日期为 2026-10-18。
- `content/philippines/_index.zh-hant.md`：通过 `npm run sync:zh-hant` 生成的繁体入口页，含两条指向繁体专页的正文链接。
- `data/seo/titles.toml`：更新菲律宾入口页简体标题、描述及 H1，并生成繁体对应字段。实际搜索摘要读取该覆盖表，不能只改 Markdown。
- `layouts/_default/list.html`：国家入口页沿用现有 SEO 表的语言字段读取 H1；只有配置了对应 H1 的入口页启用覆盖，其他入口页保持原有生成方式。
- `data/official_urls/philippines.toml`：核查官方首页并更新日期；补充官方 FAQ 来源、核查范围及日期。原字段脚本证据仍标明 2026-10-15，未重验字段规则。
- `functions/_mcp/snapshot.js`：用 `npm run gen:mcp` 更新上述来源和日期，保持生成快照一致。
- 本报告：记录依据、验证限制及上线后的观察表。

最终繁体 SEO 标题为「菲律賓 eTravel 入境指南：官方入口、適用對象與辦理時間」，H1 为「菲律賓 eTravel 入境指南」。摘要同时说明官方入口、免费、适用对象、72 小时办理窗口及两篇子页导航。没有复制字段教程或添加关键词变体页。

## 官方依据

本轮通过浏览工具读取官方正文；没有使用第三方旅行网站补写政策。

- [eTravel 官方首页](https://etravel.gov.ph/)：显示 eTravel 免费；核查日期 2026-10-18。
- [eTravel 官方 FAQ](https://etravel.gov.ph/frequently-asked-questions)：确认唯一官方入口、入境旅客与机组／船员、离境菲律宾籍旅客、外交等豁免、免费注册及更新、抵达／离境前 72 小时内办理、保存 QR Code 并在登机前出示；核查日期 2026-10-18。

页面强调「72 小时内」，没有把它写成「至少提前 3 天」。没有扩大为所有外籍旅客离境都须申报；没有声称 eTravel 可代替签证。

## 已执行验证与限制

通过：

- `npm run sync:zh-hant`：仅 1 篇内容派生物及 1 个 SEO TOML 文件发生预期变化，其余派生内容保持一致。
- `npm run gen:mcp`、`npm run check:mcp`：53 个国家快照新鲜度通过。
- `npm run test:mcp`：642/642 通过。
- `npm run check:zh-hant`：171/171 篇同步、2818 个 TOML 展示字段、53 个 roster 条目及翻译陈旧门禁通过；转换核心 21 项自测通过。
- `npm run check:public-library`、`npm run check:library-ui`：公共资料库和多语言生成门禁通过。
- Hugo 0.160.1 extended 生产环境内存构建：EN 481、ZH 479、ZH-HANT 479 页生成成功，覆盖修改后的模板、shortcode 和三语内容。使用 `hugo --renderToMemory --noBuildLock --minify --environment production --cacheDir "$PWD/.cache/hugo"`，并将全部七类 `HUGO_CACHES_*_MAXAGE` 设为 0。它不等同于仓库完整发布脚本。
- `git diff --check`：通过。

未完成：

- 完整 `npm run build:prod` 和 `npm run check:seo`：构建前按外盘规则执行 1 GiB 峰值预检，`storage_governor.py --mode preflight` 返回 `ok=false`、`approved=false`，原因是沙箱内 `diskutil` 无法使用 DiskManagement framework。遵守失败后停止该落盘构建的规则，未绕过预检。`df` 可读到目标位于 `/dev/disk7s1` 的 ExternalProjects 卷且有约 100 GiB 余量，但这不能替代守卫的 UUID 核验。内存构建后轻量资源缓存 `resources/` 为 136 KiB，位于当前 worktree。
- HTTP／浏览器 smoke：尝试内存模式本地服务，绑定 `127.0.0.1:13153` 被沙箱拒绝（`bind: operation not permitted`）。没有获得渲染 HTML、canonical、sitemap 或可点击导航的端到端验收证据。生产环境内存编译成功不能替代这些检查。
- 统一 Registry 文档未同步：当前任务明确只允许在本目录改动，统一库也不在沙箱可写范围。待调度程序更新 `/Users/lzc/Projects/project-registry/docs/projects/entrycardguide.md` 的最新摘要，并追加 `docs/changes/entrycardguide/2026-10.md`，记录本报告的修改、验证和发布边界。

日期交接：生成器优先读取简体源的 Git author date，因此当前未提交繁体文件的 `lastmod` 仍为 2026-10-12；正文和官方来源数据明确标注本次核查日期 2026-10-18。调度程序提交简体源后应按现有维护流程重跑 `npm run sync:zh-hant`，复核并纳入派生日期变化，再跑门禁。本轮不手改生成日期或替调度程序提交。

## 上线后完整 28 天跟踪

任务输入基线（统计周期未注明，本轮未重新拉取 GSC）：

| 查询 | 承接页面 | 展示 | 点击 | 平均排名 |
| --- | --- | ---: | ---: | ---: |
| 菲律賓 etravel | `/zh-hant/philippines/` | 31 | 0 | 20.4 |
| etravel 菲律賓 | `/zh-hant/philippines/` | 25 | 0 | 27.9 |

合计展示 56、点击 0。两篇子页虽存在于 `gsc_pages`，但没有提供这两个查询在子页上的指标；不能填成 0，也不能把上述基线称为「上线前 28 天」。

上线回读后填写以下信息，当前全部待完成；本轮没有创建定时任务或查询未来数据。

- 生产 revision／deployment：待调度程序发布并回读。
- 上线日期（GSC 报表日期口径）：待填写。
- 观察起止：上线日期次日起连续完整 28 天，待填写明确的起止日期；结束后等 GSC 数据完整再取数。
- 取数条件：同一属性、同一搜索类型和国家／设备过滤条件，查询精确匹配这两个原始词；读取 `query × page`，同时保留落在其他 URL 的行以发现承接变化。
- 对比窗口：补取上线前紧邻的完整 28 天，同口径记录，不能直接将未注明周期的任务基线用于涨跌百分比。
- 数据获取：沿用 `docs/maintenance/search-data-api.md` 中的 `gsc-page-query.json` 流程；核对导出实际起止日期是否等于目标观察期，不能随意用运行当天滚动的近 28 天替代。仅数据完整后填写数值；缺行标记「未返回」，并与真实 0 区分。

| 查询 | 页面 | 前 28 天展示／点击／平均排名 | 后 28 天展示／点击／平均排名 | 承接变化 |
| --- | --- | --- | --- | --- |
| 菲律賓 etravel | `/zh-hant/philippines/` | 待取数 | 待取数 | 待比较 |
| 菲律賓 etravel | `/zh-hant/philippines/etravel/` | 待取数 | 待取数 | 待比较 |
| 菲律賓 etravel | `/zh-hant/philippines/how-to-fill/` | 待取数 | 待取数 | 待比较 |
| etravel 菲律賓 | `/zh-hant/philippines/` | 待取数 | 待取数 | 待比较 |
| etravel 菲律賓 | `/zh-hant/philippines/etravel/` | 待取数 | 待取数 | 待比较 |
| etravel 菲律賓 | `/zh-hant/philippines/how-to-fill/` | 待取数 | 待取数 | 待比较 |

逐查询说明入口页与专页的展示、点击和承接占比变化；不要把流量转到某一篇页面本身作为成功标准。两个词合看是否覆盖需求，同时保留单词和单页明细，不对六行排名做简单算术平均。SEO 效果与线上可用性均待后续验证。
