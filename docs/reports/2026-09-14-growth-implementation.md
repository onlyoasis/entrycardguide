# 网站增长优化实施与验收

## 结论

本批完成本地实现与验证，可审查发布。尚未推送或部署，未请求 Google 编入索引，未发送推广消息；不能据此宣称收录、排名或流量已增长。

方案：`docs/plans/2026-09-14-growth-optimization.md`。推广短文：`docs/plans/2026-09-14-promotion-drafts.md`。

## 实施内容

- 重写 MDAC 英中主表页：删去重复中介叙述，保留清楚的政府入口、证件类别、准备步骤及字段指南；纠正普通泰国/文莱护照与指定边境证件的混淆，补充长期准证等官方豁免类别；国家首页同步修正。
- 英国英中字段指南：住所/Address line 1 解释前置，说明示例与官方规定的差别，增加 `#home-address` 和 `#field-home_address` 定位。没有为近义查询批量建新页，也没有改动现有字段规则。
- 多米尼加英中字段指南：移除与字段卡重复的正文和未经支持的“一小时后重填、重复无害、同一二维码自动往返”等承诺。主表页与国家首页同步撤回相同承诺；保留已有 URL。
- 指定五国的页面增添相关行程指南，从新加坡、泰国、印尼、多米尼加、韩国链接到相关现有页面，其中包括牙买加、巴哈马和台湾。数据驱动、双语一致，目标缺失会阻断构建。MDAC 正文另含新加坡/泰国深链。
- 官方表单链接和目录新增 `official_link_click`，只传国家、官方条目 key、位置，不传字段值和查询参数。普通来源引用走 `source-link`，不冒充官方表单点击。联盟事件保留。
- 开发构建不带正式测量 ID/gtag loader。生产 bundle 仅在配置主机名 `entrycardguide.com` 上调用 GA config/事件，防止生产产物的本地、Pages 预览访问污染统计。
- 取数脚本修正包含首尾的 28 天边界；增加指定截止日、外盘输出、属性总计、默认正式域名/固定疑似自动化特征过滤、GA4 分页与响应 metadata。`--all-traffic` 单独输出 raw 目录，便于检查过滤规则。

## 内容证据

| 修改 | 来源 | 证据范围 |
|---|---|---|
| MDAC 豁免 | https://www.kln.gov.my/web/can_vancouver/travel_advisory | 官方搜索索引返回完整七类豁免，包括 Thailand Border Pass、Brunei 指定证件/便利资格、马来西亚长期准证；直接页面请求返回 502，因此引用不展示可达性核验徽章，也未把它当成申请入口 |
| MDAC 入口 | https://imigresen-online.imi.gov.my/mdac/main | 本轮下载主页 HTML；图片下载不完整，未用残缺图片确认字段或边界 |
| UK 申请材料与时效 | https://www.gov.uk/eta/apply | GOV.UK 当前正文：申请材料、费用和通常一天/最多三个工作日；本轮不改变费用数据 |
| UK 地址 | https://www.gov.uk/guidance/using-the-uk-eta-app#complete-the-application | 官方明确询问地址；Address line 1 拆分是本站示例，正文已区分 |
| DGM 所需资料 | https://migracion.gob.do/servicio/solicitud-de-e-ticket-entrada-y-salida-de-pasajeros/ | 官方服务说明列出姓名、护照、邮箱、航班、航空公司、准确住宿地址及适用海关资料，服务免费。没有从该说明推导“一张 QR 往返/全家通用” |

字段规则的 `lastVerified` 未刷新，因为本批不是全量字段约束重核。内容编辑日期与代码/部署证据分开。

## 验证

1. `npm run build:prod`：Hugo 0.160.1 extended，成功。
2. `npm run check:seo`：全站本地链接、hreflang、JSON-LD、联盟事件管线通过。原有 VM 测试补入真实正式主机名上下文，仍保留 Arguments 队列断言。
3. `npm run check:growth`：统计及取数 CLI 行为回归通过。统计测试在修改前证明 localhost 错误配置 GA；取数测试在修改前证明指定窗口不生效。测试实际构建的 analytics bundle 与真实 CLI 入口，不使用备用实现。
4. 开发构建检查：首页不含 `data-ga4-measurement-id` 或远端 gtag loader。
5. Chrome：两轮共32次页面/尺寸观察（15个不同页面，390px/1440px，含重复复查），无根横向溢出、无缺失 H1；捕获控制台无 error。英国地址锚点实际点击后定位成功。22个相关本地 fragment 检查通过。
6. 修改后脚本真实 Google API 取数：15份数据与 metadata，复现 2026-08-15—09-11 的 GSC 79 点击/6427曝光、过滤后 GA4 1381会话/465互动会话。页面与查询数据分别147/481行，GSC日期完整28行。
7. `git diff --check` 通过；未增加浏览器 npm 依赖，未更改 Tailwind 调色板、CSP 或官方字段规则。

统计正式域名行为在隔离 VM 内验证，未向正式 GA4 注入测试事件。浏览器接口未提供可用的网络资源明细，故不声称已经取得“零 collect 请求”的网络抓包证据；上线后仍需实际事件回读。

## 交接与发布

- Git 基线 `92e52a2`，分支 `codex/growth-optimization`。
- 工作树：`/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-growth`。canonical 原有 `.gitignore`、`CLAUDE.md` 和 `.seo-cache` 现场均保留。
- 实施记录、回归运行和API数据：`/Volumes/ExternalPrivate/Runtime/entrycardguide/growth-implementation-20260914`。原始分析数据留在同级 `growth-analysis-2026-09-14`，不提交原始数据或凭据。
- 本地预览 `http://127.0.0.1:1326/zh/malaysia/mdac/`。它不是正式部署。
- 发布前只合入本次提交，复核远端是否有新修改；发布后分别回读 GitHub Actions、Cloudflare 部署和重点页面/事件。第7/14天检查 MDAC、新增内链目标索引；首个完整28天复盘增长，不能用上线后几天与完整月直接比较。
