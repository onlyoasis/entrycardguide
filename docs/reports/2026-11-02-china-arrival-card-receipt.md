# 中国入境卡英文页：回执说明与官方入口优化

## 范围与状态

- 页面：`https://entrycardguide.com/china/arrival-card/`，保留现有英文指南 URL，没有新增近义页面。
- 初始工作树干净。按本次任务要求，仅修改当前工作树，不 commit、push 或部署，也不写外部 Registry。
- 内容变更日与来源核查日：2026-11-02。`lastmod` 和中国变更日志已记录。英文页启用 GitInfo，未提交工作树中的页头日期可能仍取旧提交日期，须在调度程序提交、构建后核对。
- 本次只优化英文正文。简体与繁体页面、语言路径、canonical、hreflang 和 sitemap 继续使用现有机制；繁体生成器仅为新增变更日志生成对应摘要。MCP 快照按数据源重生成。

## 实施前核查与修改

原页已有官方入口、免费说明、回执名称和下载/发送邮件按钮提示，也有填写指南内链。因此“内容完全缺失”不成立；零点击无法证明摘要或内容存在缺陷。

本轮将官方申报链接与免费费用说明移到正文开头，缩短导语并明确独立指南身份。标题、H1 和描述改为概括在线入境卡与回执用途，不声称本站是官方网站。

新增包含主关键词的自然英文 H2，解释回执是申报后的记录，提供取得、下载/邮件保存、离线备份和入境查验时出示的方法。截图和离线备份明确标为本站准备建议；回执不替代护照、签证或实际入境检查。打印要求、回执有效期和遗失后恢复流程均标为未确认，没有编造天数或通用补办步骤。可见 FAQ 与 front matter 中新增的回执回答一致。

保留并前置指向 `/china/how-to-fill/` 的描述性内链，详细上传、地址和邀请资料继续由既有填写指南承接。没有修改字段验证规则、费用数据或全站模板。

## 官方依据及核查边界

以下均于 2026-11-02 核查，链接通过 `data/official_urls/china.toml` 统一维护。

| 来源 | 本次证据 | 限制 |
| --- | --- | --- |
| [NIA 官方申报入口](https://s.nia.gov.cn/ArrivalCardFillingPC/) | 公开入口可读取，为需要 JavaScript 的应用外壳；NIA 英文提醒同时指向该地址 | 未完成真实申报、未生成真实回执、未测试邮件送达 |
| [NIA 英文防假网站提醒](https://en.nia.gov.cn/n147418/n147463/c191530/content.html) | 2025-12-05 发布；确认官方网址、免费申报、口岸设备和纸卡选项 | 不是回执有效期或找回规则的说明 |
| [北京市政府转载 NIA 英文图解](https://english.beijing.gov.cn/mostrequested/list/202603/t20260318_4560102.html) | 页面明确署名 NIA；正文要求提交后在入境时向边检出示记录 | 移动说明图片抓取超时，没有以该图片作为本轮已读证据 |
| [南通市外办外国人入境卡 FAQ](https://wb.nantong.gov.cn/ntszfwqswbgs/wdzsk/content/0a02c6e4-49b2-4bef-a1ed-be2a3b9946dd.html) | 2026-03-12 发布；搜索索引返回的完整官方正文第 7 步写明“签署声明，通关时出示二维码，可下载/发送PDF回执” | 直接抓取返回 403；保存方式有官方文字依据，当前链接可达性仍需复核 |

原页已有按钮英文名称。本次没有把它们表述为已完成提交后的实时界面测试，也没有修改现有字段级核查日期。新增来源日期的范围写入各来源 `notes`，不代表所有表单分支均已复测。

## 验证记录

- `npm run sync:zh-hant`：通过，172 份繁体内容均未变化；仅新增中国变更日志的繁体摘要。
- `npm run gen:mcp`、`npm run check:mcp`：53 国快照重生成并通过新鲜度检查，差异仅涉及中国来源与变更日志。
- `npm run check:zh-hant`：通过；172/172 内容、263 个 TOML 文件中的 3082 个展示字段、53 国 roster 及手译源快照一致。
- `npm run test:ui`：109/109 通过，0 失败、0 跳过。
- `npm run check:public-library`：通过，249 个目的地和 249 条记录。
- `npm run check:library-ui`：通过，无派生物漂移。
- 源码 smoke：用 Ruby YAML 和 Node TOML 解析完整记录，核对元数据、实际路由无 SEO 覆写、含主查询的 H2、开头的官方入口/免费说明、6 处官方来源引用、回执锚点、填写指南内链、新增 FAQ 的可见正文/结构化数据答案一致性、语言对应页和变更日志日期，全部通过。
- `git diff --check`：通过。工作树真实路径与文件系统均回读为 `/Volumes/ExternalProjects`；没有安装依赖或产生构建产物。

以上是源码及既有测试结果，不替代构建和线上验收。

构建前执行：

```bash
/usr/bin/python3 /Users/lzc/Projects/automation/storage-governor/storage_governor.py --mode preflight --destination /Volumes/ExternalProjects/Workspaces/site-growth-agent/entrycardguide-ct-20261102-entrycardguide-01 --expected-write-gib 1
```

结果为 `ok: false`、`approved: false`、退出码 2，原因是“预检失败：diskutil 查询失败”。直接调用 `diskutil` 返回 `Unable to run because unable to use the DiskManagement framework.`。按外盘规则暂停构建写入，不回退内盘、不安装依赖。`df` 显示工作树位于 `/Volumes/ExternalProjects`，可用约 65 GiB，但这不能代替 UUID 与挂载预检。

`npm run build:prod`、依赖产物的 `npm run check:seo` 及渲染后页面 smoke 尚未执行，待允许读取磁盘管理信息的环境先通过预检再运行。缓存应保留在工作树 `.cache/hugo`，构建产物为 `public-release/`。需核对正文首屏入口/费用、标题/H1/描述、回执目录锚点、FAQPage、三语 alternate 与 sitemap，不将源码检查当作渲染验收。

## 发布后验收与完整 28 天复查

本次不部署、不创建未来定时任务。发布方需回填：

- 实际提交与部署 SHA、平台发布成功记录、上线时间及其时区。
- `/china/arrival-card/` 最终返回 200；响应头没有 `X-Robots-Tag: noindex`，HTML 没有 `noindex`，`robots.txt` 允许抓取；自引用 canonical 为 `https://entrycardguide.com/china/arrival-card/`。允许索引不等于已收录。
- 上线 HTML 的标题/H1/描述、回执说明、来源核查日期、`/china/how-to-fill/` 内链、三语 hreflang 和 sitemap。
- 桌面与手机首屏实际显示官方入口和免费说明；NIA 入口可打开，不能只验证链接标签存在。南通 FAQ 的 403 需人工复核；不得为测试而提交虚构申报。

任务书给出的主查询为 `national immigration administration entry declaration receipt for foreigner`，在该页展示 77、点击 0、CTR 0%、平均排名 9.4。统计起止日和周期长度未知，**不能当作已确认的 28 天基线**。本轮未重新读取 GSC。关键词搜索量与难度是选题线索，不是本站点击成效；主词难度缺失不等于 0，`arrival card china` 与核心词搜索量不相加。

实际发布日记为 D，采用 Search Console 日期口径：前窗 D−28 至 D−1，后窗 D+1 至 D+28，均含首尾 28 天，排除发布当天。后窗结束且 GSC final 数据完整后再取数，记录取数日。

固定 Search type=Web、精确页面=`https://entrycardguide.com/china/arrival-card/`、国家与设备不限。主查询逐字精确匹配；另以相同条件逐条观察以下相关查询，不用全站 query 汇总代替页面×query：

- `national immigration administration entry declaration receipt for foreigner china`
- `china arrival card`
- `arrival card china`
- `china digital arrival card`
- `china e arrival card`
- `china arrival card online`
- `china arrival card online free`
- `china arrival card official website`
- `china arrival card online website`

页面全量另作背景。保留原始 API 响应、查询/页面过滤、窗口、数据状态及取数日期。CTR=点击/展示，变化用百分点；展示为 0 时记不适用。未返回的查询行标为“未返回/可能受匿名化影响”，不直接补 0。平均排名使用各窗口 API 返回值，不简单平均每日或各查询排名。

| 窗口 | 对象 | 点击 | CTR | 展示 | 平均排名 | 起止日、取数日及证据 |
| --- | --- | --- | --- | --- | --- | --- |
| 前窗 | 主查询 × 本页 | 待取数 | 待取数 | 待取数 | 待取数 | 待发布后确定 |
| 后窗 | 主查询 × 本页 | 待取数 | 待取数 | 待取数 | 待取数 | 待满 28 天 |
| 前窗 | 本页全量 | 待取数 | 待取数 | 待取数 | 待取数 | 待发布后确定 |
| 后窗 | 本页全量 | 待取数 | 待取数 | 待取数 | 待取数 | 待满 28 天 |

相关查询各复制前后窗两行。内容交付、构建/线上验收与搜索表现分别报告；没有后窗数据前不声称 CTR 或排名改善，低样本变化不能直接归因于本轮改稿。

## 统一文档库待同步

本次要求只改当前目录，且属于调度任务执行方，未写外部 Registry、未运行登记提交/推送。交接主控需按实际验证结果同步 `docs/projects/entrycardguide.md` 和当月记录，再按统一流程运行 `ruby /Users/lzc/Projects/project-registry/scripts/registry_log.rb entrycardguide`。本地修订不能记作生产已上线。
