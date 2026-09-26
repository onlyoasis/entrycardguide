# MCP 服务器（`/api/mcp`）

把站点数据以 MCP（Model Context Protocol）工具的形式提供给注册用户的本地 agent（Claude Code、Cursor 等）。本文是架构说明 + 运维手册。

用户可见的说明在 `/mcp/` 页面（en/zh/zh-hant 三语），本文只讲内部。

## 端点

| 路由 | 方法 | 用途 |
|---|---|---|
| `/api/mcp` | POST | MCP JSON-RPC 端点（每个请求都要求 `Authorization: Bearer ecg_...`） |
| `/api/mcp` | GET / DELETE | 405（无状态服务器，无 SSE、无会话） |
| `/api/mcp/register` | POST | 注册：`{"email":"..."}`（JSON）或表单提交（返回 HTML）→ 返回一次性 API key |
| `/api/mcp/whoami` | GET | 同一 Bearer key，查配额用量（不计费） |

协议层实现 MCP Streamable HTTP 的无状态子集（2025-06-18 规范）：单条 JSON-RPC 消息对单条 JSON 响应；notification 回 202；不支持的 `protocolVersion` 回退到 `2025-06-18`。零 npm 依赖（延续 v1.0 约束）。

## 文件地图

```
functions/_mcp/            下划线目录不参与路由，全是内部模块
  snapshot.js              数据快照（生成物，勿手改）
  protocol.js              JSON-RPC 分发 + 5 个工具定义
  auth.js                  key 生成/哈希/Bearer 解析
  db.js                    D1 查询（唯一 SQL 出口）
  quota.js                 计划表 + 配额执行（收费口）
functions/api/mcp/         路由：index.js / register.js / whoami.js
migrations/0001_mcp_init.sql   mcp_users + mcp_usage 表
scripts/gen-mcp-data.mjs   从 data/ 生成 snapshot.js（npm run gen:mcp / check:mcp）
scripts/test-mcp.mjs       单元测试（node:sqlite 模拟 D1，npm run test:mcp）
wrangler.toml              Pages 配置：D1 绑定 `DB`
```

## 数据流

`data/`（rules / official_urls / fields / changelog / decision tree）＋ roster 顺序
→ `scripts/gen-mcp-data.mjs` → `functions/_mcp/snapshot.js`（构建时打包进 Functions bundle）

- **快照排除** `scam_sites`、`outcomes`、`news`、`primary_middleman`/`page_question`/`page_answer`。与 2026-08-10 站点决策一致：MCP 只发布官方网址与字段规则，不发布第三方公司点名。changelog 正文里提到历史移除记录属于已公开文案，保留。
- 快照体积约 1MB 源码（JSON 压缩后远小于 Workers 1MB 压缩限制）。国家数翻倍前需要复查。
- 快照**不含时间戳**（避免 check 在跨日时误报陈旧）；新鲜度由数据内的 `last_verified` 体现。
- CI 门禁：改了 `data/` 或 roster 后必须 `npm run gen:mcp`，否则 `check:mcp` 失败阻断构建——和 zh-hant 门禁同一套路。

## 工具（5 个）

`list_countries` / `get_country_forms` / `get_field_rules` / `get_field_guide` / `run_decision_tree`。定义在 `functions/_mcp/protocol.js` 的 `TOOLS`。加新工具 = 加一个 run 函数 + schema，无其他改动。

## 配额与收费口

`functions/_mcp/quota.js` 是唯一的计费咽喉：

- `PLANS`：`free: 100 次/月`，`pro: 10000`，`enterprise: null`（不限）。用户的 plan 存在 `mcp_users.plan` 列。
- `authorizeCall()` 在每次 `tools/call` 前查额；`recordCall()` 在工具**成功后**记账。校验错误（如国家 slug 打错）不烧配额；`initialize`/`tools/list`/`ping` 不计数。
- `mcp_usage` 只追加（user, period, tool, 时间戳），是未来计费作业的唯一数据源——按 `(user_id, period)` 聚合即可出账，历史不因改 plan 重写。
- 接入付费（Stripe 等）时的改动点：webhook 更新 `mcp_users.plan`；必要时在 `recordCall` 里加一行上报。不需要动协议层。
- 免费额度支持运行时覆盖：Pages 环境变量 `MCP_FREE_MONTHLY_CALLS`，不用重新部署。

## 部署（合并 main 之前的必做步骤）

1. `wrangler d1 create entrycardguide-mcp`，把打印的 `database_id` 填进 `wrangler.toml`（替换占位符）。
2. `wrangler d1 migrations apply entrycardguide-mcp --remote` 建表。
3. 之后正常 `git push main`。`wrangler pages deploy` 会带上 wrangler.toml 里的 D1 绑定。

绑定缺失时所有 `/api/*` 返回 503 `mcp_not_configured`，静态站点不受影响——所以带着占位符合并不会挂站，但 MCP 不可用。

### 本地开发

```bash
npm run build:prod                    # 先产出 public/
wrangler d1 migrations apply entrycardguide-mcp --local
wrangler pages dev                    # 读 wrangler.toml，本地 D1 + functions
curl -X POST http://localhost:8788/api/mcp/register -H 'Content-Type: application/json' -d '{"email":"dev@test"}'
```

单测不需要 wrangler：`npm run test:mcp` 用 `node:sqlite` 内存库跑真实 SQL（Node 22 的 `--experimental-sqlite` 已写进 npm script；CI 锁 Node 22）。

## 日常运维（D1 SQL）

```sql
-- 查一个用户（支持场景只有 key 前缀）
SELECT id, email, plan, revoked FROM mcp_users WHERE key_prefix = 'ecg_xxxx';

-- 吊销一个 key（立即生效，下次请求 401）
UPDATE mcp_users SET revoked = 1 WHERE email = 'abuser@example.com';

-- 升级到付费档
UPDATE mcp_users SET plan = 'pro' WHERE email = 'customer@example.com';

-- 本月用量总览
SELECT u.email, s.period, COUNT(*) AS calls
FROM mcp_usage s JOIN mcp_users u ON u.id = s.user_id
WHERE s.period = strftime('%Y-%m', 'now')
GROUP BY u.email ORDER BY calls DESC;
```

远程执行：`wrangler d1 execute entrycardguide-mcp --remote --command "<SQL>"`。

## 已知限制（v1）

- **无邮箱验证。** 注册只查邮箱格式 + 唯一性。若出现注册灌水，在 Cloudflare 加一条 WAF 限速规则（针对 `/api/mcp/register`），比在应用层做限速更省事。
- **注册无限流。** 同上，交给边缘。
- **配额计数有竞态。** 先查后插，极端并发下可能略微超出免费额度。可接受，如需精确改为 D1 batch / 事务。
- **key 无法自助找回。** 只存哈希；找回 = 运维核对注册邮箱后删行重发（老 key 因唯一约束需先删除）。
