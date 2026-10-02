# 2026-10-02 全球目的地与 MCP 本地发布候选

本报告记录本地验收结束时的候选状态：当时尚未提交、合并、推送或部署。用户随后已授权生产发布，执行状态另见 `2026-10-02-production-release.md`；本地验收记录不替代线上证据。

## 版本与文件范围

- canonical：`/Users/lzc/Projects/web/entrycardguide`，原`feat/mcp-server`及原有未提交工作保留。
- 本轮工作树：`/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-release-global-mcp`，分支`codex/release-global-mcp`，基线`1a02a99`；只叠加本次改动。只读fetch后origin/main仍为`09c5dea`。
- 整合此前中国、南非、尼日利亚资料：详细国家指南从50到53，三语内容、字段准备说明、官方链接与决策路径均接线。准备型字段明确`examples_only`，不接入通用浏览器预检。
- 全球资料研究主库仍在`entrycardguide-global`。本轮直接字节比对v207候选的250份JSON，差异0；本轮发布工作树中不存在`data/travel_library/`。

## 公开范围

249个国家／地区各有英文、简体、繁体目录与详情。原研究状态保留：28 verified、194 partial、27 blocked。394个研究事项公开328项，66项暂不公开（20项无核实日期，46项含研究执行文字或引用标题）。531个待核问题只公开数量；48个目的地没有可公开事项，页面明确“没有公开事项不代表无需申报”。

每个公开事项须有原日期、已知渠道以及引用源的ok状态、官方摘录和supports关联。只投影旅行者字段与实际支持来源，不输出研究引文、未决正文、失败诊断或本机路径。原v1严格校验与负例保持；v2处理部分核实记录并保留覆盖限制。此次没有重新核实全部249目的地当前法规。

数据从同一个`travel_library_public.json`进入网站及MCP，未创建公开批量JSON下载入口。既有CC BY-SA许可仍有效，不声称能阻止复制已公开资料。

## MCP 账户与调用

邮箱注册→邮件验证码验证及登录→明确同意只读mcp:read→一次显示30天授权key。验证码10分钟、最多5次、原子单次消费；登录Cookie7天、HttpOnly/Secure/SameSite Strict，写操作同时检查Origin与会话CSRF。授权可撤销、每账户最多10个有效授权；旧匿名key停用，凭据与会话只存哈希，验证码使用服务端secret的HMAC。

六工具含新增get_jurisdiction；list_countries覆盖249目的地，旧53个指南工具保留。每次调用检查身份、授权、到期、传输头、16KiB请求上限、UTF-8、JSON-RPC、实际参数schema与业务条件。校验错误不扣额度；成功读取经原子SQL额度检查后才返回，同账户所有授权共享额度。

首页信任栏、关于页和核查页已同步账户事实：表单预检数据留在浏览器，MCP会保存邮箱、会话、授权和调用计数；注册前页面也明确告知。繁体MCP链接的lang参数由生成链转为zh-hant。

独立审查发现并修复OTP邮件乱序送达导致两码同时失效的问题。真实handler回归在旧实现上4项失败，修复后通过；另一执行方重验两种送达顺序及身份/CSRF/撤销负例。

## 验收证据

| 检查 | 结果与实际范围 |
|---|---|
| test:mcp | 660/660，真实SQLite迁移/HTTP handler；全部249个目的地MCP结果与公开投影一致 |
| test:mcp-auth | 138通过；注册、发码、登录、三语表单、会话轮换、明确授权、撤销、竞态与限流；邮件transport为测试fake，无真实邮件 |
| 独立账户负例 | 29项通过，OTP并发单次消费/尝试上限、邮件失败保留旧码、CSRF、scope、跨账户撤销等 |
| test:data-boundary | 26/26，包括原v1负例、v2投影、坏研究JSON隔离、研究产物拒绝、旧页清除、繁体范围及模板数字错误 |
| 生产构建、SEO、release结构 | 通过；三语各416个sitemap URL，249×3目的地详情全有；1252个HTML产物 |
| 数据Git边界 | 索引及HEAD全可达历史检查通过；研究JSON未进入发布工作树 |
| 三语派生物/快照 | 167个三语源页、53个roster项、188个决策状态；UI与MCP生成检查通过 |
| Pages Functions编译 | Wrangler 4.85.0本地编译成功，bundle未压缩5140957字节 |
| 真实Cloudflare本地runtime | 两份D1迁移成功；未授权401、跨Origin403、缺邮件配置503、三语账户200/no-store |
| 本地runtime授权与额度 | 专用fixture账户剩余1次，8个实际并发HTTP工具请求仅1个200、7个429；真实whoami回读used100/limit100；本地fixture授权停用后401，已删除临时明文测试key |
| 浏览器抽查 | 简体目录搜索、状态筛选、精确TH代码搜索，375px详情与账户无整页溢出、表格内部滚动；繁体MCP链接进入zh-Hant账户页；无控制台错误 |

浏览器仅为抽查，不等于所有页面所有视口通过。服务器单测和Cloudflare本地runtime不是正式域名或真实邮件证明。三国新增入口核心说明另回读了中国领馆通知、南非SARS FAQ、尼日利亚NIS FAQ，未把它扩大为全分支当前验证。

公开目录47MB、依赖30MB，运行与测试证据约73MB，均在外盘。依赖realpath为`/Volumes/ExternalProjects/DevCaches/entrycardguide/release-dependencies/node_modules`。缓存、DB、构建和测试未在canonical生成新副本。

## 上线前剩余事项

1. 用户授权生产阶段后创建专用D1并填真实database_id，应用两份迁移。
2. 配置Pages生产RESEND_API_KEY、MCP_EMAIL_FROM、MCP_AUTH_SECRET。凭据不进入代码、输出或文档。
3. 执行`check:release -- --deployment`，只读回查生产表、迁移与secret名称。当前占位值确实被该门禁拒绝。
4. 按明确授权提交、合并、推送和部署，再用实际邮箱与MCP客户端完成完整线上链路并回读SHA、邮件、用量和撤销结果。

本轮没有创建生产D1、发真实验证码、设置生产secret、修改Cloudflare规则、提交、推送或部署。研究剩余66项及531待核问题继续独立审校，不能提高状态迁就发布。

证据目录：`/Volumes/ExternalPrivate/Runtime/entrycardguide/release-20261002`；全量投影明细为`/Volumes/ExternalPrivate/Runtime/entrycardguide/release-global-mcp-20261002/public-library-projection.json`。运行手册：`docs/mcp.md`，资料边界：`docs/maintenance/data-publication-boundary.md`。

协议和平台依据：[MCP传输规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)、[Cloudflare D1 API](https://developers.cloudflare.com/d1/worker-api/d1-database/)、[Hugo module挂载](https://gohugo.io/configuration/module/#files)。编译文件大小仅为本地测量，平台最终接受与性能仍须部署验证。
