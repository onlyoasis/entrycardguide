# 繁体中文（zh-Hant）三语维护指南

本站在英文（`/`）和简体中文（`/zh/`）之外维护完整的繁体中文版本（`/zh-hant/`）。这份文档说明内容来源、同步流程和人工翻译入口。

## 内容来源与修改入口

| 内容 | 来源 | 修改方式 |
|---|---|---|
| 内容页 `.zh-hant.md`（156 篇） | 由 `.zh.md` 经 `scripts/sync-zh-hant.mjs` 转换（**生成文件**） | 只改简体源或 `scripts/zh-hant/core.mjs` 的术语表，然后重新生成；不要手改生成文件（重跑会覆盖） |
| 数据展示字段 `*_zh_hant`（150 个 TOML，当前共 2262 条，含英文缩写和空字符串） | 由 `*_zh` 源经 `scripts/zh-hant/gen-data-toml.mjs` 派生 | 只改 `_zh` 源或术语表，再同步；原字段、规则、日期和网址不因翻译而改变 |
| 校验器与决策树人工覆写：`data/rules_i18n/*.json`、`scripts/zh-hant/tree-zh-hant.part*.json` | 英文源对应的人工翻译，受 `translation-sources.json` 陈旧检查保护 | 直接编辑这些人工源；英文源改变后复核翻译，再显式刷新快照 |
| `i18n/zh-hant.yaml` | `zh.yaml` 加 `gen-i18n.mjs` 的人工 `OVERRIDES` 表生成 | 改源文件或覆写表，再同步；由生成器 `--check` 检查，**不使用英文源快照** |
| `data/decision/tree.zh-hant.json` | 原始树加人工覆写生成 | 不手改生成文件；由 `gen-tree.mjs --check` 检查 |

## 日常命令

```bash
npm run sync:zh-hant    # 按顺序重新生成全部繁体派生物（内容/TOML/roster/i18n/tree）
npm run check:zh-hant   # 只读检查：任何缺失/陈旧的繁体产物都会失败（build 前自动跑）
npm run dev             # predev 会先跑 check:zh-hant
npm run build:prod      # prebuild:prod 会先跑 check:zh-hant
```

`check:zh-hant` 在正常 checkout / CI 上可直接运行，不依赖本机外盘路径。

## 修改简体（或英文）内容之后

1. 改 `.zh.md`（或 `.md`）；
2. 跑 `npm run sync:zh-hant`；
3. 如果改动包含新站内链接或锚点，检查生成文件里的 `/zh-hant/…` 映射是否正确（转换器会自动改写并校验路由存在）；
4. `npm run check:zh-hant` 应全绿。

不要手改 `.zh-hant.md` —— 下一次 sync 会覆盖。术语问题改 `scripts/zh-hant/core.mjs` 里的 PRE/POST 表（有 `selftest.mjs` 回归保护，例如 簽/籤、髮/發、QR Code、几天→幾天、`Lao Bao`（寮國方向）这类已审核例外）。

## 修改 UI 字符串（i18n）

新增 key 时先同时更新 `i18n/en.yaml` 和 `i18n/zh.yaml`，再运行同步命令生成 `zh-hant.yaml`，保持三个文件的 key 集合一致。简体源保留英文的个别 key（如 trust-bar），在 `gen-i18n.mjs` 的 `OVERRIDES` 表中提供繁体文字。

## 新增国家

1. 按现有流程加 6 个内容文件（3 篇 × 英/简）+ 数据文件 + roster 行（roster 现在还带 `zht`/`subZht`，跑 `node scripts/zh-hant/gen-roster.mjs` 补齐，译名表在脚本里手工维护）；
2. 内容跑 `npm run sync:zh-hant` 即有繁体页；
3. 如果新国家任一页面使用 `validator` shortcode：必须新增 `data/rules_i18n/{country}.json` 繁体覆写（label/help/全部可触发 errors），否则繁体构建失败；
4. 若决策树加入新国家：更新 `scripts/zh-hant/tree-zh-hant.part*.json` 覆写并重跑 `node scripts/zh-hant/gen-tree.mjs`（树边/状态与基线不一致会失败）。

国家页的 `country` front matter 必须与目录国家一致。`how-to-fill` 模板的 `field-*` 跳转来自 `data/fields/{country}.toml` 的实际字段卡片；同步器会识别这些 ID 和显式标题 ID，例如 `{#home-address}`，不存在的卡片仍会报错。`source-link` 的 `text` 显示属性会转为繁体，`site`、`track` 等机器参数保持原样。

## 手工英文→繁体覆写的陈旧检测

`data/rules_i18n/*`（校验器提示）和决策树覆写对应的是英文源文案。`scripts/zh-hant/translation-sources.json` 记录这些英文源文本（含 pattern/minLength/fee 等翻译提示可能引用的约束）作为复核对照快照：

- 英文源文案或约束改变 → `npm run check:zh-hant`（以及每次 build）失败，提示具体差异；
- 人工复核繁体翻译后，跑 `npm run snapshot:zh-hant` 显式刷新快照；
- build/sync 永远不会自动刷新快照（避免掩盖陈旧翻译）。快照只是复核对照，不是第二份规则来源。

## 校验器与决策树的行为边界

- 字段校验算法只在 `assets/js/validator.ts`；繁体通过 `data/rules_i18n/*` 覆写 label/help/errors/UI 文案（build 时 merge 进 payload），机器规则（pattern/长度/日期）单一来源在 `data/rules/*.json`；
- 决策树的状态/边/费用机器值单一来源在 `data/decision/tree.json`；`tree.zh-hant.json` 只替换展示文字、把 guide 链接指向 `/zh-hant/`，`gen-tree.mjs` 会校验边完全一致。

## 日期语义：核验日期 ≠ 翻译提交日期

- 英文/简体页的 lastmod 仍是 Hugo 默认 `:git` 优先；
- 繁体页由 sync 把**源页有效日期**（源页 git author date，其次 FM lastmod/date）钉入 front matter `lastmod`，且 zh-hant 语言块配置 `frontmatter.lastmod = ["lastmod","date"]`——提交繁体翻译永远不会把"最近核验"刷成提交时间；
- 因此：如果改了英文/简体源文件并提交（改变了它的 git 有效日期），之后需要重新 `npm run sync:zh-hant`，并把生成文件的 lastmod 更新放进**同一个未推送提交**或紧随的提交，再推送；
- `data/*/last_verified` 等官方核验日期只有真实复核才会改，翻译不碰它们。

## 相关文件索引

- 转换核心与术语表：`scripts/zh-hant/core.mjs`（自测：`node scripts/zh-hant/selftest.mjs`）
- 生成器：`scripts/sync-zh-hant.mjs`、`scripts/zh-hant/gen-{data-toml,roster,i18n,tree}.mjs`
- 门禁：`scripts/zh-hant/check-rules-i18n.mjs`、`scripts/zh-hant/check-translation-currency.mjs`、`scripts/check-seo-output.mjs`（三语 SEO 门禁）
- 负向/幂等回归：`scripts/zh-hant/test-{data-toml,sync-zh-hant,rules-gate,translation-currency,check-seo}.mjs`
- 实施报告：`docs/reports/2026-09-15-traditional-chinese-implementation.md`
