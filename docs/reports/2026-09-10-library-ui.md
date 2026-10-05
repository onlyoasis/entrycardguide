# 全球资料库页面实施报告（2026-09-10）

实施者：GLM（前端所有权范围）。验收：主控浏览器独立验收 + Codex 评审。

## 首轮验收修复（2026-09-10 第二轮，见 library-ui-review.md）

1. **计数选择器冲突**：status 下拉与计数 `<p>` 共用 `data-library-status`，JS 取到 select 导致 `countLabel` undefined → `replace` 异常，计数/无结果/Reset 全坏。计数节点改用独立属性 `data-library-count`，JS 同步更新；无 catch 掩盖。
2. **无 JS 控件假可用**：`.flex` 工具类优先级高于 `[hidden]` 属性，控件在无 JS 时仍然显示但不可用。控件与计数节点改用内联 `style="display:none"`，library.ts 初始化成功后清除内联样式。无 JS 时全表 249 行保留、控件不出现。
3. **M49 文案**：目录两语改为"联合国 M49 清单 248 个国家和地区 + 1 个未列入该快照的本站已有目的地，合计 249"（经数据核验：`source=m49` 248 行 + TW 1 行）。不再称 UN 清单本身 249。
4. **adapter 日期确定性**：移除 `publishDate=min(researchDate, now)` 钳制（每次构建随 now 漂移）。研究日期改为显式 Asia/Tokyo 解释：`time.AsTime (printf "%sT00:00:00+09:00" .)`，date/lastmod/publishDate 均为该确定值。未开全站 buildFuture，未改旧内容日期。datePublished 现稳定为 2026-09-10。
5. **孤儿 record 防护**：adapter 与目录行均要求 jurisdiction 的 `records_file` 真正引用该文件（并行数据任务已落盘但未接线 ET/KE/MG/MW/MU，否则会生成无名详情页 / SEO 死链）。本轮 32 个已引用记录全量生成中英详情页。
6. probe/libtest 残留：源码与构建产物均已清理（clean 后重建核验）。

第二轮验证：`build:prod` exit=0、`check:seo` exit=0；249 行、计数 0/26/57/166；孤儿链接 0。`check-travel-library` exit=1 系 ET/KE/MG/MW 记录未被 jurisdictions.json 引用——属并行数据导入未完成，非前端所有权范围。

## 交付文件

| 文件 | 作用 |
|---|---|
| `content/library/_content.gotmpl` | Hugo content adapter，按 `data/travel_library/records/*.json` 实际存在动态生成双语详情页；正文不复制事实，页面 shell 只含 ISO、标题与研究日期 |
| `content/library/_index.md` / `_index.zh.md` | `/library/` 与 `/zh/library/` 目录页文案 |
| `layouts/library/list.html` | 249 目的地目录：互斥四态计数、搜索/地区/状态筛选、无 JS 完整表格 |
| `layouts/library/single.html` | 详情页：直接渲染 JSON（事项、来源、证据摘录、待核事项） |
| `assets/js/library.ts` | 零依赖目录筛选（仅目录页加载，无 JS 时表格完整可浏览） |
| `assets/css/main.css` | 追加 `library-*` 组件类，全部复用既有设计 tokens，未改调色板 |
| `layouts/partials/scripts.html` | 仅 library section 首页条件加载 library.js |
| `config.toml` | 两语菜单各加 Library/资料库 入口（weight 70） |

未触碰：data/、校验脚本、其他模板、tailwind 配置、首页 roster 计数（仍 53）。

## 关键实现决策

1. **数据层级**：布局遍历 `hugo.Data.travel_library.jurisdictions.jurisdictions`（文件名建了一层 map）。adapter 用 `readFile` + `transform.Unmarshal`，取 `$data.jurisdictions`。
2. **日期陷阱（重要）**：adapter 页 `dates.date` = JSON 研究日期；研究日期"今天"按 UTC 午夜解析会在 UTC 仍是前一天时被 Hugo 判为未来而静默丢页（`buildFuture=false`）。解决：`publishDate` 钳制到 `now`，`date/lastmod` 保持研究日期。未改任何全站发布配置。
3. **状态四态互斥**：verified（record.review_status=verified）/ partial / pending（blocked 记录 + researched、existing_destination 无记录）/ not_researched。existing_destination 只给旧指南链接，不计入已核实。
4. **费用按类型渲染**：string（"unknown"→未知徽标、"free"→免费、其余原样）；对象 `{amount,currency,note}`（amount=0→免费，null→未知，否则金额+币种，note 为原语言括注）。零比较用 `eq (float $amount) 0.0`（int 字面量与 float64 不等值）。
5. **待核呈现**：`verified_at=null` 的事项带黄色待核徽标；blocked 记录整页声明"无已证实要求"；来源 `access_status != ok` 标"访问未完成"；unresolved note 含本地路径特征（/Volumes/、data/travel_library、.json）时不输出，只给官方下一步 URL。
6. **日期来源**：页面显示的研究/核实/检索日期全部来自 JSON 字段；Article schema 的 datePublished/dateModified 来自 adapter 设置的研究日期，不从 Git Lastmod 推断。

## 验证结果（真实退出码）

- `npm run build:prod`：exit=0（日志：外盘 `.../library-ui/build-prod.log`）
- `npm run check:seo`：exit=0（`check-seo.log`）
- `node scripts/check-travel-library.mjs`：exit=0（数据门禁未放松）
- 构建后 clean 重建，无 probe/残留页

### 数字

- 目录两页（en/zh），详情页 32×2=64（跟随当前 `records/` 实际 32 个 JSON 动态生成）
- 目录 249 行全量渲染：已核实 0 / 部分核实 26 / 待核 57（6 blocked + 51 existing_destination）/ 尚未整理 166
- 166 个 not_researched 行：0 个虚假详情链接（脚本核验）
- hreflang：列表页与详情页均有 en/zh/x-default 互链
- 菜单：`>Library<` / `>资料库<` 已出现；library.js 仅在 `/library/` 列表页加载（详情页、泰国页均无），带 SRI
- 抽样核验：AR（partial，双语事项/来源/证据）、BI（blocked，待核+官方入口）、CL（费用对象 0 CLP → 免费）、ZM（fee unknown + verified_at null → 待核徽标）

## 剩余缺口

- 0 个 verified 记录——数据侧尚无 fully verified 目的地
- 217 个目的地无 record（166 未研究 + 51 只有旧指南），详情页随数据导入自动出现，无需改前端
- 另一并行任务正导入 12 地 JSON；adapter/目录以 jurisdictions.json 的 `records_file` 引用 + 文件实际存在双条件跟进，未接线的落盘文件不生成页面
