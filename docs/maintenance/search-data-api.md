# GSC + GA4 取数配置

`scripts/fetch-search-data.mjs` 把 Search Console 和 GA4 的全量数据拉成 JSON，供月度复盘用。
配好之后一条命令拿到 12 份数据，不用再点两个后台界面。

```bash
npm run fetch:search-data
```

## 为什么需要它

两个界面都不适合程序化读取：GSC 的分页下拉和维度 tab 对模拟点击没反应，
GA4 的报告要一页一页翻。界面导出 CSV 能救 GSC，但 GA4 没有等价的一键全量导出，
而且每次复盘都要手动重来一遍。

## 一次性配置

下面第 1–3 步必须你本人在 Google Cloud Console 完成，凭据不要贴进仓库或聊天记录。

### 1. 建项目并启用两个 API

在 [Google Cloud Console](https://console.cloud.google.com/) 新建一个项目（名字随意），
然后在「API 和服务 → 库」里启用：

- **Google Search Console API**
- **Google Analytics Data API**

### 2. 创建 OAuth 客户端

「API 和服务 → 凭据 → 创建凭据 → OAuth 客户端 ID」，应用类型选 **桌面应用**。

首次创建会要求先配置「OAuth 权限请求页面」：用户类型选**外部**，
填应用名和联系邮箱即可，不需要提交审核。发布状态保持「测试中」，
并在「测试用户」里加上拥有 GSC 属性的那个账号。

创建完拿到 **客户端 ID** 和 **客户端密钥**。

### 3. 写 .env

在仓库根目录建 `.env`（已在 `.gitignore` 里）：

```
GOOGLE_OAUTH_CLIENT_ID=<客户端 ID>
GOOGLE_OAUTH_CLIENT_SECRET=<客户端密钥>
```

### 4. 授权，拿 refresh token

```bash
node scripts/fetch-search-data.mjs --auth
```

脚本会打印一个授权链接并在 `http://localhost:8731` 等回调。
用**拥有 GSC 属性的账号**登录（当前是 `l363758470@gmail.com`，不是主账号），
两个权限都要勾上——少勾一个会导致后面报 403。

「未验证的应用」警告是正常的（应用处于测试状态），点「高级 → 继续前往」。

授权成功后终端会打印一行 `GOOGLE_OAUTH_REFRESH_TOKEN=...`，把它追加到 `.env`。

如果提示没返回 refresh token，说明这个应用之前已经授权过，
去 [账号权限页](https://myaccount.google.com/permissions) 撤销后重跑。

## 日常使用

```bash
npm run fetch:search-data              # 近 28 天
node scripts/fetch-search-data.mjs --days=90
```

数据写到 `data-exports/<结束日期>-<天数>d/`（已 gitignore）：

| 文件 | 内容 |
|---|---|
| `gsc-query.json` | 查询维度，含点击/曝光/CTR/排名 |
| `gsc-page.json` | 页面维度 |
| `gsc-country.json` | 国家维度 |
| `gsc-device.json` | 设备维度 |
| `gsc-date.json` | 按天 |
| `gsc-page-query.json` | 页面 × 查询交叉，界面里做不了 |
| `ga4-source-medium.json` | 来源/媒介 |
| `ga4-channel.json` | 默认渠道组 |
| `ga4-landing-page.json` | 着陆页 |
| `ga4-event.json` | 事件名与次数，用来确认 `affiliate_click` 是否发生 |
| `ga4-country.json` | 国家 |
| `ga4-landing-page-by-source.json` | 着陆页 × 来源交叉，用来定位 AI 助手引流落在哪些页 |
| `ga4-bot-signature.json` | 来源 × 城市 × 屏幕分辨率，用来量爬虫占比（见下） |

窗口两端都往回退 2 天，因为 GSC 数据有约 2 天延迟，这样两个数据源对齐同一区间。

## 核查 Google 索引状态

`scripts/check-index-status.mjs` 先读取 GSC 已提交的 sitemap 状态，再逐个核查本地
`public/en/sitemap.xml` 和 `public/zh/sitemap.xml` 中的 URL。它会回答 GSC 是否下载了新版
sitemap、每个 URL 的索引判定，以及未索引原因。

先生成生产 sitemap，再运行：

```bash
npm run build:prod
npm run check:index-status

# 只查 sitemap 提交状态，不消耗 URL Inspection 配额
node scripts/check-index-status.mjs --sitemaps-only

# 只核查 URL 中包含指定字符串的页面
node scripts/check-index-status.mjs --filter=/jordan/
```

结果写入 `data-exports/<运行日期>-index-status/`：

| 文件 | 内容 |
|---|---|
| `sitemaps.json` | Sitemaps API 原始返回 |
| `url-inspection.json` | 每个 URL 的判定、抓取、robots、canonical 等关键字段 |
| `summary.txt` | coverage 分布、新旧国家页面统计、按国家分组的未索引 URL 完整清单 |

脚本使用现有的 `https://www.googleapis.com/auth/webmasters.readonly` scope，不需要重新授权，
也不需要启用新的 API；第 1 步已经启用的 **Google Search Console API** 同时提供 Sitemaps
和 URL Inspection。域名属性参数使用 `sc-domain:entrycardguide.com`，脚本在 Sitemaps API
路径中对它做 URL 编码，在 URL Inspection 请求体中按原格式传入。

Google 官方配额为每属性每天 2,000 次 URL Inspection、每分钟 600 次；项目当前 312 个 URL
可在一次运行中查完。脚本串行请求，每次间隔 120 ms，约 500 次/分钟。Sitemaps API 属于
其他资源配额，不消耗 URL Inspection 配额。

Sitemaps API 仍可能返回 `contents[].indexed`，但 Google 已把该字段标记为 deprecated。
脚本会原样保存和展示它，不能把这个值当作当前完整索引总数；逐 URL 结果以 URL Inspection
的 `verdict` 和 `coverageState` 为准。

官方资料：

- [Sitemaps: list](https://developers.google.com/webmaster-tools/v1/sitemaps/list)
- [URL Inspection: index.inspect](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [URL Inspection 返回字段](https://developers.google.com/webmaster-tools/v1/urlInspection.index/UrlInspectionResult)
- [Search Console API 配额](https://developers.google.com/webmaster-tools/limits)

## 已知限制

**GSC 会匿名化低频查询。** 2026-08-08 的实测：查询维度返回的行只覆盖全站 26% 的曝光、
2.5% 的点击。这是 Search Console 的隐私策略，API 和界面导出一样受限，换取数方式解决不了。
页面、国家、设备维度不受影响。

**GA4 的 `(not set)` 和 `(data not available)`** 是采样与归因缺失的正常产物，不是脚本问题。

**GA4 会话数含 headless 爬虫。** 2026-08-08 确认全站 30.8% 的会话是爬虫：
来源 `(direct)/(none)`、城市 `Singapore`、分辨率 `1280x1200`、互动 0 秒、每会话固定 3.01 个事件。
读任何 GA4 指标前先看 `ga4-bot-signature.json`，把这一组合扣掉再算比率。
GA4 的数据过滤器只支持 `traffic_type`，没法按分辨率过滤原始数据，所以只能在分析时扣。

## 相关

- 月度内容复盘流程：`monthly-review.md`
- 历史复盘报告：`../reports/gsc-ga-follow-up-*.md`

## 2026-09-14：可重复的增长复盘口径

`--days=28` 现在严格包含 28 个日历日，默认截止 UTC 今天减 3 天，GSC 仅取 final Web 数据。旧版起止日期均包含时实际为 29 天，请勿直接混比。

原始数据应写外盘，显式设置目录：

```bash
node scripts/fetch-search-data.mjs --days=28 --end-date=2026-09-11 \
  --output-dir=/Volumes/ExternalPrivate/Runtime/entrycardguide/search-data
# 另取原始流量，写到带 -raw 后缀的目录，不覆盖过滤后的数据
node scripts/fetch-search-data.mjs --days=28 --end-date=2026-09-11 --all-traffic \
  --output-dir=/Volumes/ExternalPrivate/Runtime/entrycardguide/search-data
```

也可用 `SEARCH_DATA_OUTPUT_DIR` 指定外盘根目录；旧默认 `data-exports` 保留兼容，执行前必须确认它实际落在外盘。

默认 GA4 仅保留 `entrycardguide.com`，排除 `(direct) / (none)` × Singapore × 1280x1200。该规则是疑似自动化访问排除，不代表其余会话都是真人。`--all-traffic` 移除此过滤，用于复查特征及原始来源。不要再次从过滤后报表扣除同一组流量。

新增 `gsc-total.json`、`ga4-total.json`。页面/查询/用户分组不可直接相加替代总计；GSC 查询匿名化会使关键词点击远少于属性总计。GA4 按 rowCount 分页；`report-metadata.json` 保存窗口、实际过滤条件及每份 GA4 报表响应 metadata，可检查抽样/阈值与时区。

前端新增 `official_link_click`：仅模板中的官方链接触发，参数为 `destination`、`official_key`、`link_slot`。官方目录的 slot 为 `directory`，正文 callout 为 `callout`，明确标记的官方内联入口为 `inline`。来源说明链接也有独立 official_key，统计表单入口时核对该国 meta.form_key 与明确支持的替代入口（如 sgac_enhanced），不能把豁免说明页算作提交入口。事件不带护照、姓名、邮箱、输入值和 URL 参数。

开发构建不带测量 ID；生产 bundle 在 hostname 不匹配时不调用 GA config 或点击事件。使用生产产物预览时 gtag.js 可能仍被加载，但本站不会配置该主机的统计。此变更不追溯删除历史访问，也不替代 GA4 管理后台的过滤设置。联盟事件保持原名，不能与通用 click 相加计算转化。


### 官方入口点击的来源与页面

新增三份数据（同样应用默认正式主机名及疑似自动化过滤）：

- `ga4-official-click-total.json`：`official_link_click` 的事件数、产生该事件的会话和用户。
- `ga4-official-click-source.json`：按 `sessionSourceMedium` 分组。
- `ga4-official-click-page.json`：按发生点击的 `pagePath` 分组，不是落地页。

本批合计18份数据文件与metadata。`--all-traffic` 只移除流量过滤，官方点击报告仍限定事件名。空数组表示窗口内没有返回该事件，不是取数失败，也不能单凭它判定埋点失效。报告metadata记录eventFilter。

以官方点击会话除以同窗口同过滤的GA4总会话，作为本站引导使用的代理比率；它不代表政府表单提交成功。各页面/来源的用户数不可相加替代去重总计。目的地、official_key等自定义参数尚未注册为GA4自定义维度，本轮不改后台配置；当前报告不依赖这些维度。
