# 资料发布边界

网站与 MCP 只使用 `data/travel_library_public.json`。内部研究主库 `data/travel_library/` 不进入 Git、公共构建或 MCP bundle。Hugo 在默认数据加载层排除该目录；公开快照缺失或不合法时构建失败，禁止回退研究数据。

## 全球目的地与事实范围

schema v2 支持全部 249 个国家和地区各自的目录和详情页。目的地完整覆盖不表示所有法律事实完整核实。每份公开记录保留研究主库的 `review_status`：`verified`、`partial`、`blocked`。不得因完成分类、填写核验日期或生成页面而升级状态。

每项公开事项必须同时满足：

- 记录状态不是 `blocked`。
- 有合法的原始 `verified_at` 日期和已知办理渠道。
- 至少一个引用源为 `access_status=ok`、有非空官方短摘，并且该源的 `supports` 明确包含该事项 ID。
- 公开文字及引用标题不含本地路径、缓存、模型调用、OCR、curl 等研究执行材料。

只投影满足条件的事项，引用仅保留实际支持该事项的已读取来源。日期不是单独的验收依据；结构校验不能替代官方来源身份、适用范围及时效的事实审查。本次投影复用此前记录的验收范围，没有声称在发布当天重新核对全部法律。

`blocked` 记录不发布事项。`partial` 记录只发布符合以上条件的事项，页面明确提示其余要求仍待核实。没有公开事项表示未核证，不能解释为无需申报。schema v1 的原有规则继续保留：只接受整份 `verified` 记录、非空已核事项和完整引用。

v2 的 `coverage` 只公开数量：`total_procedures`、`published_procedures`、`withheld_procedures`、`open_questions`。不公开未决问题正文、证据摘录、失败诊断和研究路径。发现研究执行叙述时暂不公开整个事项，避免编辑时误删法规限制。内部研究文本保持原样，后续可独立整理为适合旅行者阅读的公开表述并重新验收。

2026-10-02 从经接手回读的 v207 主库投影：249 地、249 公开记录，状态为 28 `verified`、194 `partial`、27 `blocked`；394 个记录事项中公开 328 项，另 66 项暂不公开，其中 20 项尚无核验日期，46 项的正文或来源标题包含研究执行材料。531 个待核研究问题只以数量显示。这些是当前快照统计，更新后以真实校验输出为准。

## 导出与验证

研究源仍留在既有外盘工作树，发布工作树不复制研究主库。`--root` 是只读输入路径；输出默认写当前发布工作树的公共快照。

```bash
node scripts/export-public-travel-library.mjs --schema 2 --all \
  --root /Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global
node scripts/check-public-travel-library.mjs
node scripts/gen-library-ui.mjs --check
npm run test:data-boundary
npm run build:prod
npm run check:seo
```

导出前先调用原研究校验器。`--all --schema 2` 是显式选择全量目的地，原 `--ids JP,SG` 接口默认 schema v1，仍只允许整国已核实记录。导出替换整个快照，不保留未选目的地；写入临时文件后原子替换，失败时不覆盖旧快照。使用 `--output` 可明确选择发布工作树中的目标位置，不能写回研究目录。

公开三语分别为英文、简体、繁体。繁体事项的 `*_zh_hant` 字段由既有 `scripts/zh-hant/core.mjs` 转换可见中文，机器 ID、URL、日期不转换；公共校验器检查繁体派生字段是否陈旧。资料库 UI 的英文/简体源在 `scripts/gen-library-ui.mjs`，繁体 UI 在生成的 `data/library_ui.json`。派生物不手改。

## 构建、Git 与发布

生产入口固定环境 `production`，每次重建 `public-release` 并检查产物，清除旧目的地页与研究页残留。Cloudflare Pages、SEO 校验和 IndexNow 都使用这个目录。旧 `public/`、`research-public` 不作为部署输入。构建会清空可重建的 `public-release`，不会清理研究主库。

Git 索引门禁拒绝研究目录；历史检查遍历每个可达提交树，防止研究文件先添加再删除或只在 merge 中加入。hook 安装程序不会覆盖自定义 hook，未显式执行安装命令时不会修改本机 hook。CI 历史检查发生在上传之后，不能代替维护者对公开 Git 范围的控制。

既有公开文章、网址和 CC BY-SA 4.0 许可保持有效。这套边界保护未来未公开研究材料，不能撤回已公开许可，也不阻止复制允许公开的官方网址。

## 存储与验收口径

依赖、构建、缓存和测试临时目录使用已挂载外盘。发布工作树为 `/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-release-global-mcp`；测试支持 `TRAVEL_LIBRARY_TEST_ROOT`，CI 使用 `runner.temp`，本机默认使用既有外盘运行目录。外盘不可用时停止写入，不回退内盘。

测试调用真实投影函数、原研究校验器、Git 检查、生产入口和 Hugo 模板，覆盖未核/blocked 事项禁止发布、错误引用、研究正文、来源标题、旧产物、损坏研究主库、三语 249 详情以及公开记录下架。构建和测试通过表示本地可发布产物通过检查；提交、推送、部署、D1 激活和线上调用结果分别记录。
