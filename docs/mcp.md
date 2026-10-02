# MCP 账户、授权与调用

`/api/mcp` 是带只读授权的 Streamable HTTP 无状态接口。注册仅创建待验证账户；收到邮箱验证码并登录后，用户必须在账户页明确同意 `mcp:read`，才能获取 API key。登录 Cookie 不能代替 MCP Bearer 授权。

## 路由

| 路由 | 方法 | 用途 |
|---|---|---|
| `/api/mcp/account?lang=en|zh|zh-hant` | GET | 三语注册、登录、授权和撤销界面；Accept JSON 返回会话、CSRF 和授权摘要 |
| `/api/mcp/register` | POST | 邮箱注册并申请验证码，不返回 API key |
| `/api/mcp/login` | POST | 已注册账户申请新的验证码，不创建未知账户 |
| `/api/mcp/verify` | POST | `{challengeId, code}`，邮箱验证后建立会话 |
| `/api/mcp/authorize` | POST | `{csrf, scope:"mcp:read", consent:true}`，明确授权后一次显示 API key |
| `/api/mcp/revoke` | POST | `{csrf, grantId}`，只能撤销自己的授权 |
| `/api/mcp/logout` | POST | `{csrf}`，撤销当前登录会话；MCP 授权独立管理 |
| `/api/mcp` | POST | Bearer 凭据、JSON-RPC 请求；GET/DELETE 为405 |
| `/api/mcp/whoami` | GET | Bearer 授权状态和账户月度用量，不扣调用次数 |

账户 POST 支持 JSON 或 URL-encoded 表单。必须提供与请求地址一致的 `Origin`；表单含 `lang`。错误只返回安全代码，不返回邮件供应商、SQL 或凭据内容。账户响应禁缓存、禁嵌入、禁索引，使用独立 CSP。

验证码10分钟有效、最多5次尝试、原子单次消费。只保存以 `MCP_AUTH_SECRET` 为密钥的验证码 HMAC。注册/发码、验证、授权和撤销均有D1原子限流。邮件投递失败不激活验证码；并发投递按最后成功送达的验证码替换已送达旧码，不提前作废尚未投递的请求。

登录会话7天有效，Cookie为 `__Host-ecg_session; HttpOnly; Secure; SameSite=Strict; Path=/`，数据库只存会话凭据哈希。登录会轮换当前会话，写操作同时验证Origin与会话CSRF。授权30天有效，每账户最多10个有效授权；数据库只保存API key哈希。撤销、账户停用和到期会在每次MCP请求检查，工具计量时再核对一次。迁移0002使旧版匿名key失效，原账户需验证邮箱并重新授权。

## 调用与数据

六个工具：`list_countries`、`get_jurisdiction`、`get_country_forms`、`get_field_rules`、`get_field_guide`、`run_decision_tree`。

- `list_countries`覆盖249个目的地；`get_jurisdiction({id:"TH"})`返回同一公开快照内的记录。
- 53个详细指南继续通过country slug调用。准备资料型字段明确返回`examples_only`，不能据此宣称执行了官方全部校验。
- 快照由`npm run gen:mcp`从既有公开指南数据及`data/travel_library_public.json`生成。禁止读取研究主库。全球公开版本含328事项，66事项暂不公开；28/194/27核实状态原样保留，531个待核问题只保留数量。没有公开事项不能解释为无需申报。
- 不包含`scam_sites`、`outcomes`、新闻块、原研究引文、私密路径或待核正文。原核实日期保留，工具调用不代表重新核实法规。

请求检查Origin（如有）、Content-Type、Accept、协议头、16KiB流式大小上限、UTF-8、JSON-RPC envelope、request ID、方法参数及实际工具schema。拒绝额外属性、类型错误、非法国家/语言和终态后的多余答案。无ID请求只允许`notifications/initialized`，不能绕过`tools/call`记账。

支持2025-06-18与2025-03-26，返回JSON响应，不提供服务器SSE。原2024-11-05 HTTP+SSE版本不在支持范围。传输约束依据[MCP规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)。

```bash
curl https://entrycardguide.com/api/mcp \
  -H 'Authorization: Bearer ecg_YOUR_AUTHORIZED_KEY' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2025-06-18' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_jurisdiction","arguments":{"id":"TH"}}}'
```

## 配额

免费账户UTC自然月100次成功工具调用；pro10000，enterprise不限。多个授权共享账户额度。`initialize`、`ping`、`tools/list`不计数，参数或业务校验错误不计数。

工具先执行完整校验和纯快照读取，再以单条条件`INSERT ... SELECT`同时检查有效授权、账户计划与`COUNT < limit`，记账成功后才返回数据。并发不会越额。额度用尽HTTP429，授权失效401，未知计划或数据库异常503。`MCP_FREE_MONTHLY_CALLS`运行时覆盖须为非负整数字符串，错误配置拒绝服务，不静默放宽。

## 上线前配置

本次仅准备本地发布候选。`wrangler.toml`的数据库ID仍是占位符；没有创建生产D1、迁移生产库、设置生产secret或发送真实验证码。上线需要另行授权生产操作。

1. 创建专用`entrycardguide-mcp` D1，填真实`database_id`。
2. 应用`0001_mcp_init.sql`和`0002_mcp_accounts.sql`远程迁移；第二份会停用旧匿名key。
3. 在Pages生产环境设置secret：`RESEND_API_KEY`、`MCP_EMAIL_FROM`（已验证发件域地址）、`MCP_AUTH_SECRET`（随机至少32字符）。不写入Git、文档或日志。
4. `npm run check:release -- --deployment`只读回查D1表与Pages secret名称，缺配置会阻断发布；配置存在不代表真实邮件已经送达。
5. 发布后用实际邮箱走注册→收码→登录→明确授权→初始化→工具调用→用量→撤销后401，并回读部署SHA与正式域名。

CI固定构建`public-release`，构建前检查公开schema、三语生成物和MCP快照；测试账户、协议、额度及数据隔离。部署步骤只发布这个目录，并要求生产前置检查通过。不会自动创建D1、应用远程迁移或写secret。

## 本地验收

```bash
npm run gen:mcp
npm run test:mcp
npm run test:mcp-auth
npm run test:data-boundary
npm run build:prod
npm run check:seo
npm run check:release
```

本机测试运行目录和D1持久化必须在已挂载外盘。示例：`/Volumes/ExternalPrivate/Runtime/entrycardguide/release-20261002`；依赖与npm缓存在`/Volumes/ExternalProjects/DevCaches/entrycardguide`。真实SQLite测试执行所有迁移和HTTP handler，邮件只用隔离测试transport；生产代码没有测试验证码或登录绕过。Cloudflare本地runtime迁移、未授权401及缺邮件配置503也必须实际回读。

密钥、验证码和会话只出现在相应一次性响应或私密邮件中，不输出到服务日志。已有CC BY-SA许可继续有效，访问授权不撤回原公开数据许可。

## 生产初始化工作流

用户已授权部署时，可运行`Provision MCP production`工作流。首次受限发布分支初始化已执行；后续仅通过手动触发执行。它使用现有GitHub Cloudflare加密secret，只读确认Pages项目生产分支后创建或复用专用D1、按migrations应用两份迁移、创建缺失认证secret。若本项目RESEND_API_KEY与MCP_EMAIL_FROM已明确配置在GitHub secret，则同步到Pages生产secret；缺邮件配置时报告缺失，不绕过部署门禁。输出artifact仅含数据库ID、迁移名、secret名称及旧部署元数据，不输出值。

现有Pages部署令牌没有D1权限时，可单独配置GitHub `CLOUDFLARE_MCP_API_TOKEN`：生产初始化需D1 Edit，查询迁移前置需对应D1访问权限。D1请求只使用该独立令牌，Pages请求与部署继续使用原`CLOUDFLARE_API_TOKEN`。未配置独立令牌时兼容原合并权限令牌；没有权限就失败，不绕过门禁。
