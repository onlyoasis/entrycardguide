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
