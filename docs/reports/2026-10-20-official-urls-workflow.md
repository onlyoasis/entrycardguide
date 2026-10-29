# 2026-10-20 官方链接与定期工作流核查

本次只在本地分支 `fix/official-urls` 修改和提交，基线为 `825afdb1cc1277fbfd26c7d84eb26247e7504d37`。没有推送、部署、触发工作流、评论、合并 PR 或修改 GitHub 配置、真实密钥。`.seo-cache` 是接手时已有的未跟踪文件，未读取内容、修改或暂存。

## 失败根因

运行：[Verify official URLs #22](https://github.com/onlyoasis/entrycardguide/actions/runs/39216214670)，2026-10-19，提交 `825afdb`；job `117940564917`。

用户指定的两条只读命令均已尝试：

```sh
gh run list --repo onlyoasis/entrycardguide --workflow 'Verify official URLs' --limit 15 --json databaseId,headSha,headBranch,status,conclusion,createdAt,url,event
gh run view 39216214670 --repo onlyoasis/entrycardguide --log-failed
```

两者均受当前沙箱网络限制，报 `proxyconnect tcp: dial tcp 127.0.0.1:2082: connect: operation not permitted`。临时取消代理环境变量后的只读重试也无法连接 GitHub，没有修改代理设置。随后通过 Chrome 只读查看运行记录，并通过 GitHub 连接器的 `fetch_workflow_run_jobs` / `fetch_workflow_job_logs` 读取 job 和完整日志；未调用 GitHub 写接口。

日志表明：

- `Verify official URLs` 步骤是 **success**，227 条中 195 条核验通过、32 条未更新日期。该脚本未传 `--strict`，单个链接错误不会让此步骤失败。
- 构建、SEO、发布结构、MCP 快照及 MCP 测试步骤均为 success。
- 真正失败的是 `Check MCP deployment configuration`，命令 `npm run check:release -- --deployment`。
- 2026-10-19T07:36:10Z 的实际错误为：`check-release: Configure the real D1 database_id in wrangler.toml before deployment`。
- 仓库仍使用 D1 占位值，`scripts/release-mode.mjs` 判定为 static。主发布工作流已支持 static/full，但定期核验工作流仍无条件检查 full 模式的 D1 前置条件。
- 此次运行中的自动提交/推送步骤已执行，后面的直接部署步骤被跳过。这是历史运行日志，不是本次操作。

本次修复定期工作流：同主发布工作流一样检测模式，仅 full 执行远端 MCP 前置检查；static 在已有本地发布结构检查通过后，才在未来 CI runner 内移开占位 D1 配置。未修改 `wrangler.toml` 或任何密钥。本次没有执行 YAML 内的推送、移开配置或部署命令。

## 官方 PDF 替换

- 旧地址：`https://www.ana.gob.pa/w_ana/images/ANA_pdf/slider/2024/RES_079_29042024.pdf`。CI 中 fetch 和 curl 均返回 404。本轮本地 curl 被沙箱网络阻断；联网读取旧址超时，Chrome 报 `ERR_BLOCKED_BY_CLIENT`，不能据此确认旧文件永久删除或迁移原因。
- 新地址：[巴拿马政府公报中的第 079 号决议](https://www.gacetaoficial.gob.pa/pdfTemp/30018_B/104423.pdf)。本轮联网工具成功打开完整 3 页 PDF，并核对第 1 页的海关机构、决议号和日期 2024-04-04，以及第 2 页第 1 条的申报门户、第 5 条的 QR 出示要求。新址是政府原始公报，不是第三方转载。
- 这是同一份文件的可读政府来源替换，没有改写法规。只更新 `panama.digital_resolution` 的 URL 和核对日期，并用 `npm run gen:mcp` 派生 MCP 快照。没有批量刷新其他来源日期或页面 lastmod。

## 32 项逐个复核

对以下每个地址均执行了一次独立的 curl 子进程（4 路并发）：

```sh
curl -sS -L --connect-timeout 5 --max-time 15 -o /dev/null -w '%{http_code} %{url_effective}' '<原地址>'
```

**32/32 均在本机代理连接阶段退出 7，HTTP 000**，报 `Failed to connect to 127.0.0.1 port 2082`；没有请求到政府服务器。表内 CI 状态来自失败运行日志；本轮正文证据来自联网读取或 Chrome，不混称为本地 curl 结果。未取得正文的项目保留待核，不能断言均为反爬或临时故障。

| 数据项 | 旧 URL | CI 状态 | 本轮证据与决定 |
| --- | --- | --- | --- |
| `australia.toml [eta601]` | [原地址](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601) | 403 | 保留：联网读取返回移民局 HTML 外壳，正文未完整确认。 |
| `australia.toml [evisitor651]` | [原地址](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651) | 403 | 保留：联网读取返回移民局 HTML 外壳，正文未完整确认。 |
| `azerbaijan.toml [evisa]` | [原地址](https://www.evisa.gov.az/en/) | 403 | 保留：联网读取到官方签证首页。 |
| `azerbaijan.toml [eligible_countries]` | [原地址](https://www.evisa.gov.az/en/countries) | 403 | 保留：联网读取到官方适用国家页。 |
| `azerbaijan.toml [conditions]` | [原地址](https://www.evisa.gov.az/en/conditions) | 403 | 保留：联网读取到官方条件页。 |
| `azerbaijan.toml [information]` | [原地址](https://www.evisa.gov.az/en/information) | 403 | 保留：联网读取到官方介绍页。 |
| `bahrain.toml [evisa]` | [原地址](https://www.evisa.gov.bh/) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `bahrain.toml [eligibility]` | [原地址](https://www.evisa.gov.bh/VISA/visaInput?A0S=a&nav=A0S) | 403 | 保留：联网读取到官方申请页。 |
| `bahrain.toml [online_countries]` | [原地址](https://www.evisa.gov.bh/list-of-online-visa-country.html) | 403 | 保留：联网读取到官方适用国家页。 |
| `bahrain.toml [arrival_countries]` | [原地址](https://www.evisa.gov.bh/list-of-onarrival-visa-country.html) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `bahrain.toml [faq]` | [原地址](https://www.evisa.gov.bh/VisaBhr7En.html) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `barbados.toml [ed_form]` | [原地址](https://www.travelform.gov.bb/) | 429 | 保留：CI 为限流 429，本轮联网读取 403；无法确认迁移。 |
| `cambodia.toml [evisa]` | [原地址](https://www.evisa.gov.kh) | curl 47，超过 50 次重定向 | 保留：联网读取同样报告循环重定向；Chrome 显示 Nexusguard Authentication challenge pages，属于反自动访问证据，未操作验证码。 |
| `dominican.toml [eticket]` | [原地址](https://eticket.migracion.gob.do) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `dominican.toml [dgm_home]` | [原地址](https://www.migracion.gob.do) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `dominican.toml [service_requirements]` | [原地址](https://migracion.gob.do/servicio/solicitud-de-e-ticket-entrada-y-salida-de-pasajeros/) | 403 | 保留：联网读取到移民局 E-TICKET 服务说明。 |
| `indonesia.toml [ecd]` | [原地址](https://allindonesia.imigrasi.go.id) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `indonesia.toml [evoa]` | [原地址](https://evisa.imigrasi.go.id) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `indonesia.toml [immigration_home]` | [原地址](https://www.imigrasi.go.id) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `israel.toml [eligibility]` | [原地址](https://www.gov.il/en/service/group_entry_to_israel) | 403 | 保留：联网读取到政府 New Entry Requirement for Israel 页面。 |
| `jamaica.toml [tourism_notice]` | [原地址](https://www.mot.gov.jm/node/1496) | 503 | 保留：联网读取到旅游部原文及其官方申报入口，原 CI 503 未持续复现。 |
| `pakistan.toml [vpa]` | [原地址](https://visa.nadra.gov.pk/) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `panama.toml [digital_resolution]` | [原地址](https://www.ana.gob.pa/w_ana/images/ANA_pdf/slider/2024/RES_079_29042024.pdf) | 404 | 替换：CI 的 fetch/curl 均为 404；政府公报提供同一决议全文，见下文。 |
| `qatar.toml [government_confirmation]` | [原地址](https://www.gco.gov.qa/en/media-centre/major-events/fifa-qatar-2022/hayya-card/) | 403 | 保留：联网读取到政府 Hayya Card 页面。 |
| `saudi-arabia.toml [tourist_evisa]` | [原地址](https://visa.visitsaudi.com/) | 403 | 保留：联网读取到官方旅游签证首页。 |
| `saudi-arabia.toml [terms]` | [原地址](https://visa.visitsaudi.com/Home/TermsConditions) | 403 | 保留：联网读取到官方条款页。 |
| `saudi-arabia.toml [national_platform]` | [原地址](https://my.gov.sa/en/content/tourism) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `saudi-arabia.toml [visa_finder]` | [原地址](https://my.gov.sa/en/experience/615129/615469) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `saudi-arabia.toml [umrah_route]` | [原地址](https://my.gov.sa/en/services/2691010) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `singapore.toml [arrival_date_help]` | [原地址](https://ask.gov.sg/ica/questions/cluuhsp9l001afxu700snp0f0) | 403 | 保留：检索工具读取到原 ICA 问答（抓取标记为两天前），不声称本地实时 HTTP 验证成功。 |
| `thailand.toml [immigration_home]` | [原地址](https://www.immigration.go.th) | 403 | 保留：本轮联网读取仍未取得正文，不能仅凭 403/读取失败断定失效或确认迁移。 |
| `usa.toml [vwp_info]` | [原地址](https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visa-waiver-program.html) | 403 | 保留：联网读取到国务院 Visa Waiver Program 页面。 |

## 本地验证

- `npm run gen:mcp`、`npm run check:mcp`：通过，53 个国家快照一致。
- `npm run check:zh-hant`：通过，171/171 译文、206 份 TOML 的 2817 个派生字段、53 行 roster、188 个决策状态与人工翻译快照检查均通过。
- `npm run check:release`：通过，249 个目的地 × 三语，MCP 公共快照一致。该命令读取**已有** `public-release/` 产物；本轮没有重新构建，不能将其称为本轮完整构建验收。
- `node scripts/release-mode.mjs`：返回 `static`。
- 使用 Node 内联检查解析实际 workflow YAML，对比基线与修改版：基线有两项 static 回归（无条件 D1 检查、缺少移开占位绑定步骤）；修改后 static/full/无内容变化共 12 个条件场景全部通过。另核对步骤顺序，并对全部 shell 步骤执行 `bash -n`，通过。执行了实际 release-mode CLI；未执行推送、部署和配置移开命令。
- `git diff --check`：通过。
- `npm run check:data-boundary`：暂存内容与 HEAD 历史边界检查均通过。
- `npm run verify:official-urls -- --timeout-ms 45000`：**退出 1**。227/227 均因 DNS `ENOTFOUND` 和/或本机代理连接被阻断而失败，结尾为 `No official URLs could be verified. Refusing to update dates.`。这是环境阻塞，不能宣称实时链接脚本通过，也没有放宽脚本判定来掩盖失败。

## 交接限制

- 外盘新工作树峰值预检（0.25 GiB）因沙箱内 `diskutil` 查询失败而停止，未创建工作树，也未继续大写入/生产构建。接手时当前工作区只有一个未跟踪文件、没有 tracked dirty，故在既有 canonical 工作区正常新建用户指定分支，不覆盖未提交改动。
- 用户本次硬性要求只在新建本地分支修改和提交，因此没有写入另一个仓库的统一 Registry。待同步内容为本报告中的根因、变更与验证限制；本报告作为当前项目内的交接证据。
- 本地联网校验、全新生产构建、GitHub 工作流重跑及线上部署均未完成。后两项明确不在本次授权范围内。
