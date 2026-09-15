# 全站繁体中文实施与验收（2026-09-15）

全站繁体版本已完成实现、独立验收和生产发布，覆盖主线 `7538cbe` 的全部50个目的地、156个内容路径。发布完成不代表已经被搜索引擎收录或取得流量增长。

ZCode 内置 `builtin:bigmodel-coding-plan / GLM-5.3-Flash` 负责实现；Codex 制定任务书、审核补丁、合并主线并独立验收。实际调用日志核对了267个完成请求，全部为指定模型，执行时间为北京时间9月14日23:05至9月15日06:56。任务书见 [全站繁体实施方案](../plans/2026-09-14-full-traditional-chinese.md)。

## 生产发布

- 源码提交 `7538cbeb3391cd46db9e27326e1ba10354ab02b8` 已快进推送至 `main`。
- GitHub Actions `34912432224` 的 Build 与 Cloudflare Pages Deploy 均成功；部署完成于 2026-09-15 00:16:21 UTC，IndexNow 通知成功。
- Cloudflare 部署地址：`https://45f39ceb.entrycardguide.pages.dev`；正式繁体入口：`https://entrycardguide.com/zh-hant/`。
- 生产回读检查英文、简体、繁体 sitemap 各156条；全部156个繁体URL均返回200，页面语言、canonical、hreflang和H1正确。繁体目录下不存在的页面返回404及繁体404正文，正式域名保留HSTS、CSP及其余安全响应头。

## 实现范围

| 项目 | 实际覆盖 |
|---|---|
| 内容与路由 | 英文 `/`、简体 `/zh/`、繁体 `/zh-hant/` 各156个内容URL，共468个；另有三语404页面 |
| 用户界面 | 导航、语言菜单、首页搜索、官方目录与筛选、页脚、分享、工具按钮、辅助说明和无JS后备内容 |
| UI词条 | 三个语言文件各222个key；当前主线已有的英/简词条保持原值 |
| TOML展示数据 | 150个文件、2262个 `_zh_hant` 展示字段；英文缩写和空字符串也同步 |
| 校验器 | 29个实际嵌入页面、17个目的地、171个字段、617个错误提示槽位；规则与算法保持原样 |
| 决策工具 | 173个状态、145条可达结果路径、72条表单记录；问题、选项、结果、费用展示及指南链接本地化 |
| 搜索与SEO | 同页语言切换、简繁常用国名、三语sitemap、self-canonical、互相对应的hreflang、英文x-default、JSON-LD与OG语言信息 |

Markdown和TOML从简体源生成，采用构建时OpenCC及明确的术语覆写。校验器与决策树的英文展示文字使用人工覆写。原始网址、金额、日期、代码、示例值、字段约束和状态分支保持单一来源。浏览器端没有新增npm依赖。

## 主线集成与日期

初始基线为 `92e52a2`，繁体实现检查点为 `ee90a9f`。期间主线增加了增长统计和新加坡等指南纠正；Codex将当前主线 `62f89f5` 合入，检查点为 `9347fe0`，再由ZCode同步译文。新版主线的29个校验器页面替代旧基线的31个页面，旧阶段的8300次输入和2250个展示字段不能当作最终数量。

保留了主线的 `guide_title`、`walkthrough_first`、`fields_guidance_only`、字段卡片锚点、相关指南、官方链接点击标记及生产域名统计限制。`source-link` 只翻译显示文字，机器参数保留。字段卡片锚点按实际TOML字段识别，显式标题ID保持可用。

翻译提交不会刷新法规核验日期：繁体front matter钉入源页有效日期，繁体语言的lastmod优先使用该值；英/简仍按原有Git日期规则。原始 `last_verified` 等事实字段未因翻译而修改。

## 独立验收

| 检查 | 结果 |
|---|---|
| 468个实际内容页面、三语404、语言菜单、链接、锚点、schema和日期 | 通过 |
| 156组源文/译文的结构化对照 | 数字、代码、机器元数据及核验日期符合源文 |
| 202份原始JSON/TOML完整解析对照 | 原字段零变动，2262个繁体展示字段齐全 |
| 29个校验器页面，7811次真实浏览器输入 | 7797个当前主线基线判定全部保留，另有14个本地化placeholder输入；无运行或溢出问题 |
| 173个决策状态、145条路径 | 全部遍历；官方入口、指南和费用样式与基线一致；返回、重启、焦点和27个后备链接符合原始树 |
| 英/简/繁搜索与目录 | 每种语言800次查询，共2400次通过；筛选、重置、无结果及菜单键盘行为通过 |
| 实际语言往返切换 | 7类页面、2个宽度，共42次导航通过 |
| 无JS页面 | 首页、目录、决策工具在2个宽度下共6项通过 |
| 全部156个繁体页面，320/390/768/1440四种宽度 | 624项检查，无水平溢出 |
| SEO反例 | 仓库8项与Codex独立13项均达到预期；缺页、错误alternate/canonical、缺x-default、错误sitemap和锚点等会失败 |
| 布局锚点的实际生成器正反例 | 5项通过；修复前卡片锚点无法通过，修复后可用，错误目标仍被拒绝；正式页面另经完整构建和链接检查 |

人工对照了全部171条字段说明，以及决策问题、选项、费用和期限展示。补齐了姓名字段遗漏，纠正了错误词义、上下文转字和个别期限措辞。原文中的官方英文名称、格式和实际填写值保留；该工作不等于重新核验各国法规。

英/简正文、链接及机器数据与当前主线保持一致。两项有意的原中文界面变化是：`/zh/changelog/` 的核验/提交标签改为中文，`/zh/decide/` 的无JS国家名称使用现有简体名称；目标链接与流程保持。

## 构建和维护

以下真实命令通过：

```bash
npm run sync:zh-hant
npm run check:zh-hant
npm run build:prod
npm run check:seo
npm run check:growth
node scripts/zh-hant/selftest.mjs
node scripts/zh-hant/test-data-toml.mjs
node scripts/zh-hant/test-sync-zh-hant.mjs
node scripts/zh-hant/test-rules-gate.mjs
node scripts/zh-hant/test-translation-currency.mjs
node scripts/zh-hant/test-check-seo.mjs
```

`sync:zh-hant` 顺序生成内容、TOML、roster、i18n及决策树；`check:zh-hant` 是开发/构建前的只读门禁。英文手工覆写源发生变化后，需要复核译文再显式执行 `npm run snapshot:zh-hant`，普通同步不会自动刷新快照。运行增长回归时，按既有脚本要求将 `GROWTH_TEST_TMP` 指向测试目录。

维护入口见 [繁体三语维护指南](../maintenance/zh-hant.md)。完整浏览器记录、模型元数据、反例及提交后的日期回读由Codex保存在本任务的外盘验收目录；未将这些运行记录作为网站内容发布。
