# 全站繁体中文实施报告（2026-09-15）

执行方：ZCode 内置 `builtin:bigmodel-coding-plan/GLM-5.3-Flash`（本会话，单任务串行）。
实施窗口：北京时间 2026-09-14 23:05 起（东京 9-15 00:05），夜间免费时段内。
任务书：`docs/plans/2026-09-14-full-traditional-chinese.md`；基线 `92e52a2`；分支 `codex/full-traditional-chinese`。
本报告为**本地实施完成**声明：未 commit / push / deploy；"完成"不等同于上线、收录或流量变化。

## 范围与产出

- **第三语言**：`[languages.zh-hant]`（languageCode `zh-Hant`，繁体菜单）；zh 语言码改为 `zh-Hans`、en 改为 `en`（BCP 47 映射 en / zh-Hans / zh-Hant，OG 地区标记 en_US / zh_CN / zh_TW 独立经 `og_locale` 参数）。
- **内容 156/156**：全部 156 个内容路径的 `.zh-hant.md`（50 个目的地 + 首页、decide、官方目录、about、trust、changelog 等通用页）。404 为模板产出，三语各一份（en、zh、zh-hant 的 `404.html`），文案已三语化，不计入 156 个 Markdown 路径。由可重复的 `scripts/sync-zh-hant.mjs` 从 `.zh.md` 生成（OpenCC cn→tw + 手工术语覆写 + 保护规则），`--check` 幂等。
- **i18n**：`i18n/zh-hant.yaml` 由 `gen-i18n.mjs` 生成（含 5 个英文基线 key 的繁体 OVERRIDES：trust-bar ×2、Also on、2 个 aria 标签）；en/zh 各新增 118 个 key（git 基线 92e52a2 为 98，现各 216；zh-hant 216），UI 全部三语。
- **数据展示字段**：`data/{fields,official_urls,changelog}` 的全部 `*_zh` 展示字段派生 `*_zh_hant`（2250 条，150 个 TOML），机器字段/日期/URL 零改动（Codex 独立结构化核对 201 份源文件，0 原字段变动）。
- **校验器**：31 个渲染校验器的页面（17 目的地、171 字段、617 个错误槽位）全部繁体提示：`data/rules_i18n/*.json` 覆写 build 时 merge 进 payload；`validator.ts` 仅把 `Fix ✗/OK ✓` 改为 payload 驱动（en/zh 走原 fallback，行为不变）；校验算法与机器规则未动。新增 9 个说明型 placeholder 的繁体展示覆写（真实例值原样保留）。
- **决策树**：`data/decision/tree.zh-hant.json` —— 173 状态、72 表单、145 条结果路径全部手工繁体；guide/fallback 链接指向 `/zh-hant/`；`gen-tree.mjs` 校验状态/边/费用机器值与基线完全一致；`decide.ts` 仅增加 `feeDisplay` 展示回退（`fee === 'FREE'` 机器语义未动）。
- **搜索/目录**：首页与目录的 `data-search` 含 en/简体/繁体国名（含 `name_zh_hant` 区域异写别名：印度尼西亞、新西蘭、澳洲、臺灣、老撾 等），筛选/计数/清除/无结果提示经 i18n 本地化；无 JS fallback 可用。
- **SEO**：`head.html` hreflang 映射（en/zh-Hans/zh-Hant）、og:locale、JSON-LD inLanguage、WebSite 语言列表、changelog CollectionPage 路径；`check-seo-output.mjs` 新增三语门禁（sitemap 互译集、精确 alternate 图、self-canonical、x-default=en 必需、html lang、Unicode 锚点、反向收录覆盖、完整 URL 比对）。
- **构建入口**：`npm run sync:zh-hant`（顺序重生成全部派生物）、`npm run check:zh-hant`（只读门禁：sync --check、TOML/roster/i18n/tree --check、rules 覆写完整性、翻译源文本陈旧检测）；`prebuild`/`prebuild:prod`/`predev` 自动前置。快照刷新 `npm run snapshot:zh-hant` 必须在翻译复核后显式执行，build/sync 不自动刷新。

## 已通过的检查（本方执行）

| 命令 | 结果 |
|---|---|
| `npm run build:prod` | 通过（三语各 210 页；真实内容 URL 以 sitemap 为准 156×3） |
| `npm run check:seo` | 通过（含新增三语门禁：155+ 检查项 0 问题） |
| `npm run check:zh-hant` | 通过（7 项命令：内容/TOML/roster/i18n/tree 的 --check、rules 覆写完整性、翻译源文本陈旧检测） |
| `node scripts/zh-hant/selftest.mjs` | 18 例转换回归（保护/术语/锚点/链接/围栏） |
| `node scripts/zh-hant/test-data-toml.mjs` | 10 例 CLI 回归（含 review-04/05/06 全部反例） |
| `node scripts/zh-hant/test-sync-zh-hant.mjs` | 7 例（url 映射/别名/日期钉入/幂等） |
| `node scripts/zh-hant/test-rules-gate.mjs` | 3 例（英文句/非展示键拒绝） |
| `node scripts/zh-hant/test-translation-currency.mjs` | 7 例（help/maxLength/fee 变更、空/缺项快照拒绝） |
| `node scripts/zh-hant/test-check-seo.mjs` | 8 例（删页/错文 alternate/错 x-default/错域名 canonical/篡改 sitemap/删 sitemap/未收录页） |
| 术语扫描 | 可见文本 0 个 籤 类签证误字（合法 標籤/抽籤 15 处保留）；已知的简体残留与 OpenCC 误字清单（review-08/11）全部修复并经 Codex 独立 HTML 复核。该扫描证明已审阅的残留为零，不是对全部译文的逐句人工认证 |

## 独立验收证据（Codex 拥有，本方未修改）

- `content-semantic-preservation.json`：156 对源码结构化对照，数字/代码/真实值保留；9 个"源 Git 有效日期钉入"与 3 个口岸说明例外已复核。
- `data-preservation-final-precheck.json`：201 份原始 JSON/TOML，0 原字段变动。
- `seo-independent-negatives.json`：正常副本 + 12 种错误副本全部预期结果。
- `validator-behaviour-comparison-final.json`：31 页 / 171 字段，8314 次输入（原 8300 次判定全部保持，另 14 例覆盖本地化 placeholder）。
- `decision-behaviour-comparison-01.json`：173 状态 / 145 路径，官方链接、对应指南、免费/收费样式一致。
- `nojs-hant-01.json`：6 项无 JS 验证；`layout-browser-hant-precommit.json`：156 页 × 4 宽度 624 项无溢出。搜索复检（800 × 3 语，含繁体区域异写别名）以 Codex 的最终读数为准，本报告不预先声明结果。

## 语义边界（按任务书）

- 校验规则/决策树机器逻辑零修改；浏览器端仍零 npm 依赖（opencc-js、@iarna/toml 仅构建端，锁定版本）。
- 翻译不是法规重新核验：`last_verified`、规则 lastVerified、决策树 lastVerified 全部保留原值；繁体页 lastmod 钉入**源页有效日期**（zh-hant 语言块 `frontmatter.lastmod=["lastmod","date"]`），提交翻译不会伪造核验日期。
- en/zh 原行为保持：模板语言分支改为 i18n key（文本值不变）、站内路径统一 `relLangURL`；head 的 og:locale:alternate 修复为输出各译文自身 locale（原实现重复输出当前页 locale，属任务 C 要求的修正）。
- 两处**已确认接受的简体 UI 变化**（基线 zh 页面此前显示英文）：`/zh/changelog/` 等使用 single 模板的页面的元数据标签（Last verified / Commit）由英文变为简体中文；`/zh/decide/` 无 JS fallback 的 50 个国家名由英文变为简体。二者属 i18n 化的预期改善，英文原文未动。
- 已知残留限制：繁体文件未提交故 51 个页面暂时缺 source commit 链接（Codex 确认按未提交状态处理）；引用块 Accessed 日期随构建日期自然变化。

## 交接

本地 diff 停在工作树等待 Codex 最终验收与串行 Git 交付；未 commit / push / deploy。
