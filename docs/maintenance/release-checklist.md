# 发布范围检查清单

这个清单用于内容更新、官方网址复核和紧急修正。发布架构保持不变：

- 分支 push 和 PR 只运行生产构建与 SEO 检查。
- 只有 `main` 的 push 或手动触发可以进入 Cloudflare Pages deploy job。
- 每周官方链接任务可以更新日期、提交到 `main` 并部署。

## 1. 固定发布范围

先记录当前分支、基线和所有本地现场：

```bash
git status --short --branch
git worktree list --porcelain
git fetch origin
git diff --name-status origin/main...HEAD
git diff --name-status
```

把本次允许发布的文件列成清单。不要把其他 worktree、分析报告、analytics、Agent 配置或备份文件顺手带入。

只暂存点名文件，不运行 `git add -A` 或 `git add .`：

```bash
git add path/to/file-a path/to/file-b
git diff --cached --name-status
git diff --cached --check
```

如果 `git diff --cached --name-status` 出现清单外文件，停止发布并移出暂存区。不要用 reset、checkout 或 stash 清理用户的未提交改动。

## 2. 核对 freshness 日期

改动官方网址或完成一次正式复核时，同时检查：

- `data/official_urls/{country}.toml` 中对应条目的 `last_verified`。
- 引用该条目的内容页 frontmatter `lastmod`。
- 只有同时复核了字段规则时，才更新 `data/rules/{country}.json` 的 `lastVerified`。

安全核验不写文件：

```bash
npm run verify:official-urls -- --timeout-ms 45000
```

需要刷新日期时，单独运行写入模式，然后逐文件审查 diff：

```bash
npm run verify:official-urls -- --write --timeout-ms 45000
git diff -- data/official_urls content
```

不要因为某个站点返回 403、超时或 TLS warning，就手工把它标成当天已核验。

## 3. 官方站点错误分类

| 结果 | 语义 | 处理 |
|---|---|---|
| HTTP 2xx/3xx | 自动请求可达 | 可以作为本次自动核验证据 |
| HTTP 401/403 | 站点拒绝自动请求，不等于 URL 已失效 | 保留原日期；需要时用浏览器人工复核 |
| timeout、DNS、连接失败 | 当前运行无法证明可达 | 重试并人工复核；不要刷新日期 |
| HTTP 404/410，或重定向到无关域名 | 可能发生真实 URL 漂移 | 按紧急内容修正处理，核实后更新 TOML、内容和 changelog |
| TLS 校验失败后 fallback 成功 | 页面可达，但证书链未被正常验证 | 输出 `verified after TLS certificate-chain fallback` warning；不得写成无警告成功 |

TLS fallback 只适用于证书链校验错误。它不能绕过 403、404、DNS 或超时，也不能证明证书配置健康。

## 4. 本地门禁

按顺序运行：

```bash
npm run verify:official-urls -- --timeout-ms 45000
npm run build:prod
npm run check:seo
git status --short --branch
git diff --cached --name-status
```

`public/`、`resources/`、`.wrangler/` 和测试产物必须保持 ignored。构建后如果它们出现在普通 `git status` 中，停止发布并先修 ignore 规则。

## 5. CI 与线上证据

PR 合并前确认 build 和 SEO job 都成功。合并后记录：

- `main` 的完整 commit SHA。
- `Cloudflare Pages` workflow run URL。
- GitHub production deployment 的 SHA 和 success 状态。
- `https://entrycardguide.com/` 返回 HTTP 200。

普通 `main` push 的线上 revision 以 GitHub production deployment 和对应 workflow run 为准。

每周 `Verify official URLs` 有一条特殊路径：workflow 启动后才创建日期刷新 commit，然后在同一个 job 中直接部署。这个 run 的 `headSha` 仍是启动时的旧 SHA，GitHub production deployment 列表也可能没有新 commit。此时必须同时记录：

- `Commit refreshed verification dates` 日志中的新 commit SHA。
- `Deploy to Cloudflare Pages` 日志中的 `Deployment complete` preview URL。
- apex 页面实际显示的 `last_verified` / `lastmod`，并与新 commit 中的 TOML 和 content frontmatter 对照。

不要把周任务的旧 `headSha` 写成线上 revision。页脚的提交链接来自当前页面的 Git 历史，也不能单独证明整站部署 revision。三段证据无法对齐时，只报告“线上内容已更新但 exact revision 未确认”，不要猜。

## 6. Worktree 清理边界

只生成候选清单，不在发布流程中删除：

```bash
git worktree list --porcelain
git branch --merged main
```

候选项必须另外核实工作树是否干净、分支是否已合并、是否仍被 Agent 使用。删除 worktree、分支或本地文件都需要单独确认。
