# Bing URL 保护基线与全球资料库核验分层（2026-11-23）

在 Bing Webmaster 的页面数据中，**193 个 URL 贡献了 3,764 次点击和 258,868 次展示，其中 142 个 URL 有点击**。其中 6 个有点击的资料库 URL 都属于 `partial`，已经列入保护清单。页面数据有头部回传限制，未返回的 URL 流量未知。

## 数据来源与覆盖

- 2026-11-23（JST）以 `seo-ops` 的 `bing_search_data` 对 `entrycardguide` 只读查询，使用 `SEO_OPS_ENABLE_WRITES=0`。查询包含首尾的 90 个日历日 `2026-08-26..2026-11-23`，按 Bing `Date` 的 UTC 日期标签筛选。
- `pages` 在 API 整体回传中有 1,125 条，日期标签为 `2026-07-31..2026-11-20`。筛选后有 **982 条 URL × 周记录**，实际为 `2026-08-28..2026-11-20` 的 13 个周度日期标签。首尾以回传标签为准，接口未提供桶内逐日边界。取数 `offset=0, limit=2000`，`nextOffset=null`，无日期解析失败、无重复 URL × 日期。最后四个周标签各回传 100 条，完整取到了本次 API 返回的页面记录，页面覆盖仍受提供方限制。
- `traffic` 的实际筛选范围为 `2026-08-26..2026-11-21`，共 88 个站点级日记录，合计 **4,927 点击、299,309 展示**。站点日数据与页面周数据的返回粒度和覆盖有别，按语言或层级切分时统一使用 `pages`。
- 全量逐 URL 汇总按原始 HTTPS URL 累加，保留三语路径。CSV 的 `build_html` 和 `in_sitemap` 以本地候选构建为准，`protect_d7=true` 表示这次回传中有点击。[全量 193 URL CSV](2026-11-23-bing-url-baseline.csv)

## 点击集中度与三语分布

头部 1、5、10、20 个 URL 分别占页面回传点击的 **15.4%、35.9%、48.6%、65.9%**。首位是 `/zh/thailand/tdac/`，578 次点击、32,524 次展示。

| URL 前缀 | 周记录 | 有记录 URL | 有点击 URL | 点击 | 展示 | 点击占比 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 455 | 94 | 63 | 1,374 | 113,386 | 36.5% |
| `/zh/` | 455 | 75 | 61 | 2,237 | 137,978 | 59.4% |
| `/zh-hant/` | 72 | 24 | 18 | 153 | 7,504 | 4.1% |
| **合计** | 982 | 193 | 142 | 3,764 | 258,868 | 100% |

<details>
<summary>13 个 Bing 周标签回传的点击与展示</summary>

| 日期标签（UTC） | 行数 | 点击 | 展示 |
| --- | ---: | ---: | ---: |
| 2026-08-28 | 42 | 72 | 14,369 |
| 2026-09-04 | 57 | 105 | 16,489 |
| 2026-09-11 | 49 | 92 | 14,806 |
| 2026-09-18 | 57 | 128 | 16,537 |
| 2026-09-25 | 61 | 152 | 15,177 |
| 2026-10-02 | 67 | 172 | 18,441 |
| 2026-10-09 | 68 | 149 | 13,867 |
| 2026-10-16 | 89 | 227 | 14,491 |
| 2026-10-23 | 92 | 339 | 19,182 |
| 2026-10-30 | 100 | 404 | 24,175 |
| 2026-11-06 | 100 | 481 | 25,157 |
| 2026-11-13 | 100 | 661 | 32,148 |
| 2026-11-20 | 100 | 782 | 34,029 |

</details>

## 资料库目的地核验层级

以公开数据的 `review_status` 为准，逐页核对候选 HTML 的状态徽章、语言、索引标签和站点地图。249 个目的地在三种语言各生成一页，共 **747 个详情页**，另有 3 个目录入口。每种语言共有 28 个 `verified`、212 个 `partial` 和 9 个 `blocked` 详情页，前两层的 240 页均进入该语言站点地图，后 9 页已有 `noindex` 且不在站点地图。三个语言站点地图中的资料库 URL 共 **723 条**，含各自目录入口。核验层级描述本站公开资料的证据覆盖。[公开目的地数据](../../data/travel_library_public.json)

| 前缀 | 层级 | 构建 URL | 站点地图 URL | Bing 有记录 URL | Bing 有点击 URL | 点击 | 展示 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | `directory` | 1 | 1 | 0 | 0 | — | — |
| `/` | `verified` | 28 | 28 | 2 | 0 | 0 | 82 |
| `/` | `partial` | 212 | 212 | 5 | 3 | 6 | 72 |
| `/` | `blocked` | 9 | 0 | 0 | 0 | — | — |
| `/zh/` | `directory` | 1 | 1 | 0 | 0 | — | — |
| `/zh/` | `verified` | 28 | 28 | 0 | 0 | — | — |
| `/zh/` | `partial` | 212 | 212 | 3 | 3 | 3 | 31 |
| `/zh/` | `blocked` | 9 | 0 | 0 | 0 | — | — |
| `/zh-hant/` | `directory` | 1 | 1 | 0 | 0 | — | — |
| `/zh-hant/` | `verified` | 28 | 28 | 0 | 0 | — | — |
| `/zh-hant/` | `partial` | 212 | 212 | 0 | 0 | — | — |
| `/zh-hant/` | `blocked` | 9 | 0 | 0 | 0 | — | — |
| **合计** |  | 750 | 723 | 10 | 6 | 9 | 185 |

表中「—」表示本次页面接口未返回该组，各组统计只覆盖有返回的记录。资料库共回传 13 条周记录，覆盖 10 个 URL、9 点击和 185 展示。以下是本次回传的全部资料库 URL。

| URL 路径 | 核验层级 | 点击 | 展示 | D+7 保护 |
| --- | --- | ---: | ---: | --- |
| `/library/cm/` | `partial` | 4 | 36 | 是 |
| `/zh/library/bn/` | `partial` | 1 | 26 | 是 |
| `/library/sr/` | `partial` | 1 | 12 | 是 |
| `/zh/library/sr/` | `partial` | 1 | 4 | 是 |
| `/library/eg/` | `partial` | 1 | 1 | 是 |
| `/zh/library/tw/` | `partial` | 1 | 1 | 是 |
| `/library/nz/` | `verified` | 0 | 58 | 本次回传无点击 |
| `/library/jp/` | `verified` | 0 | 24 | 本次回传无点击 |
| `/library/tt/` | `partial` | 0 | 12 | 本次回传无点击 |
| `/library/pa/` | `partial` | 0 | 11 | 本次回传无点击 |

<details>
<summary>249 个目的地 ID 与核验层级</summary>

三个语言版本使用同一个目的地层级，详情路径为各语言前缀加 `library/<小写 ID>/`。

**`verified`（28）**

AL, AT, CH, CY, DE, EE, ES, FR, HK, HU, IE, IS, JP, KR, KZ, LU, LV, MD, MG, MO, MU, NZ, SG, SI, SK
TH, TM, YT

**`partial`（212）**

AD, AE, AG, AI, AM, AO, AQ, AR, AS, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BI, BJ, BL, BM, BN, BO
BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CZ
DJ, DK, DM, DO, DZ, EC, EG, ER, FI, FJ, FK, FM, FO, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP
GQ, GR, GS, GT, GU, GW, GY, HM, HN, HR, HT, ID, IL, IM, IN, IO, IQ, IR, IT, JE, JM, JO, KE, KG, KH
KI, KM, KN, KY, LA, LB, LC, LI, LK, LR, LS, LT, LY, MA, MC, ME, MF, MH, MK, ML, MM, MN, MP, MQ, MR
MS, MT, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, OM, PA, PE, PF, PG, PH, PK
PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SC, SD, SE, SH, SJ, SL, SM, SN, SO, SR
SS, SV, SX, SY, SZ, TC, TD, TF, TG, TJ, TK, TL, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ
VA, VC, VE, VG, VI, VN, VU, WF, WS, ZA, ZM, ZW

**`blocked`（9）**

AF, BH, EH, ET, KP, KW, SB, ST, YE

</details>

## D+7 复查保护清单

本次回传有点击的 **142 个 URL 全部纳入保护**。其中 141 个有本地构建 HTML 并在站点地图中。历史路径 `/new-zealand/is-ivisa-official/` 在 `2026-09-04` 桶仍有 1 点击、2 展示，当前构建已无该页，保留其观测记录供复查。另有已不在构建中的 `/usa/is-ivisa-official/` 回传 1 展示、0 点击，留在全量 CSV。

最早于 **2026-12-01** 首查 Google 核心更新完成后是否已有 7 个完整 GSC 定稿日。届时用最新 Bing 页面回传和有点击的 GSC URL 扩充排除名单，保留本表已观察到的 URL，再评估标题或资料库 `noindex` 试点。页面接口回传缺失不足以证明某 URL 没有 Bing 流量。

<details>
<summary>展开全部 142 个有 Bing 点击的 URL</summary>

下表路径均为 `https://entrycardguide.com`，完整 URL 也可用 CSV 的 `protect_d7=true` 筛出。

| URL 路径 | 点击 | 展示 |
| --- | ---: | ---: |
| `/zh/thailand/tdac/` | 578 | 32,524 |
| `/zh/korea/e-arrival-card/` | 352 | 20,688 |
| `/zh/taiwan/twac/` | 163 | 3,736 |
| `/zh/indonesia/e-cd/` | 138 | 4,391 |
| `/india/how-to-fill/` | 119 | 3,676 |
| `/zh/japan/visit-japan-web/` | 113 | 4,656 |
| `/zh/turkey/` | 112 | 3,821 |
| `/india/e-arrival-card/` | 93 | 8,985 |
| `/dominican/eticket/` | 81 | 7,249 |
| `/japan/how-to-fill/` | 81 | 1,447 |
| `/jamaica/c5/` | 74 | 7,836 |
| `/dominican/how-to-fill/` | 73 | 1,178 |
| `/zh/malaysia/how-to-fill/` | 72 | 5,220 |
| `/singapore/how-to-fill/` | 69 | 5,795 |
| `/malaysia/how-to-fill/` | 67 | 2,151 |
| `/zh/malaysia/mdac/` | 62 | 16,144 |
| `/zh/singapore/sgac/` | 62 | 8,372 |
| `/taiwan/twac/` | 60 | 8,839 |
| `/korea/how-to-fill/` | 60 | 2,249 |
| `/china/arrival-card/` | 52 | 3,470 |
| `/vietnam/how-to-fill/` | 51 | 1,771 |
| `/zh/india/` | 51 | 1,431 |
| `/zh/mexico/fmm/` | 51 | 842 |
| `/mexico/fmm/` | 46 | 2,310 |
| `/zh/vietnam/evisa/` | 45 | 4,316 |
| `/korea/e-arrival-card/` | 40 | 14,354 |
| `/zh-hant/malaysia/mdac/` | 35 | 3,197 |
| `/zh/egypt/evisa/` | 34 | 1,873 |
| `/zh/china/arrival-card/` | 33 | 2,068 |
| `/philippines/how-to-fill/` | 32 | 1,010 |
| `/usa/how-to-fill/` | 30 | 912 |
| `/zh/cambodia/e-arrival/` | 27 | 1,289 |
| `/uk/how-to-fill/` | 26 | 677 |
| `/nigeria/` | 25 | 3,380 |
| `/zh/laos/evisa/` | 24 | 942 |
| `/india/air-suvidha/` | 23 | 2,818 |
| `/zh/indonesia/how-to-fill/` | 22 | 765 |
| `/zh/singapore/how-to-fill/` | 22 | 439 |
| `/singapore/sgac/` | 20 | 15,003 |
| `/zh/korea/` | 20 | 11,412 |
| `/laos/evisa/` | 20 | 2,106 |
| `/zh/egypt/` | 20 | 1,453 |
| `/zh/australia/eta/` | 20 | 349 |
| `/thailand/how-to-fill/` | 19 | 622 |
| `/zh-hant/thailand/tdac/` | 19 | 535 |
| `/zh-hant/japan/how-to-fill/` | 19 | 487 |
| `/australia/how-to-fill/` | 19 | 437 |
| `/zh/taiwan/` | 19 | 408 |
| `/zh/nepal/visa-on-arrival/` | 19 | 389 |
| `/indonesia/e-cd/` | 18 | 1,261 |
| `/zh/china/` | 17 | 1,036 |
| `/egypt/evisa/` | 16 | 2,135 |
| `/zh/laos/` | 16 | 1,146 |
| `/zh-hant/malaysia/how-to-fill/` | 16 | 702 |
| `/taiwan/how-to-fill/` | 16 | 212 |
| `/zh/india/e-arrival-card/` | 16 | 168 |
| `/canada/how-to-fill/` | 15 | 294 |
| `/zh/thailand/how-to-fill/` | 13 | 631 |
| `/jamaica/` | 12 | 2,025 |
| `/zh-hant/singapore/sgac/` | 12 | 1,054 |
| `/new-zealand/how-to-fill/` | 11 | 773 |
| `/zh-hant/korea/e-arrival-card/` | 10 | 503 |
| `/zh/nigeria/landing-exit-card/` | 10 | 242 |
| `/zh/maldives/traveller-declaration/` | 10 | 241 |
| `/zh-hant/korea/how-to-fill/` | 10 | 207 |
| `/zh/new-zealand/how-to-fill/` | 9 | 327 |
| `/barbados/how-to-fill/` | 9 | 207 |
| `/mexico/how-to-fill/` | 9 | 179 |
| `/zh-hant/uk/eta/` | 9 | 118 |
| `/zh/vietnam/how-to-fill/` | 9 | 100 |
| `/zh/korea/how-to-fill/` | 8 | 528 |
| `/zh/philippines/etravel/` | 7 | 868 |
| `/barbados/ed-form/` | 7 | 740 |
| `/panama/traveler-declaration/` | 7 | 140 |
| `/zh/egypt/how-to-fill/` | 7 | 122 |
| `/zh-hant/japan/visit-japan-web/` | 6 | 233 |
| `/panama/` | 6 | 167 |
| `/zh/philippines/how-to-fill/` | 6 | 164 |
| `/barbados/` | 5 | 546 |
| `/nepal/visa-on-arrival/` | 5 | 380 |
| `/china/how-to-fill/` | 5 | 59 |
| `/zh/malaysia/` | 4 | 1,359 |
| `/usa/esta/` | 4 | 1,066 |
| `/new-zealand/` | 4 | 479 |
| `/thailand/tdac/` | 4 | 421 |
| `/cambodia/how-to-fill/` | 4 | 195 |
| `/zh/india/how-to-fill/` | 4 | 155 |
| `/library/cm/` | 4 | 36 |
| `/zh/china/how-to-fill/` | 3 | 299 |
| `/zh/russia/evisa/` | 3 | 259 |
| `/vietnam/pre-arrival/` | 3 | 224 |
| `/zh/japan/` | 3 | 139 |
| `/zh/brazil/` | 3 | 123 |
| `/zh/cambodia/` | 3 | 89 |
| `/zh/kenya/` | 3 | 85 |
| `/zh/mexico/` | 3 | 49 |
| `/nepal/how-to-fill/` | 3 | 48 |
| `/zh-hant/oman/` | 3 | 5 |
| `/zh-hant/usa/how-to-fill/` | 3 | 5 |
| `/philippines/etravel/` | 2 | 607 |
| `/malaysia/mdac/` | 2 | 440 |
| `/israel/` | 2 | 225 |
| `/egypt/` | 2 | 198 |
| `/india/` | 2 | 183 |
| `/nigeria/how-to-fill/` | 2 | 165 |
| `/australia/eta/` | 2 | 136 |
| `/indonesia/how-to-fill/` | 2 | 83 |
| `/zh-hant/malaysia/` | 2 | 76 |
| `/zh/vietnam/pre-arrival/` | 2 | 53 |
| `/zh/brazil/evisa/` | 2 | 48 |
| `/zh/jordan/` | 2 | 37 |
| `/zh-hant/indonesia/e-cd/` | 2 | 34 |
| `/zh/peru/` | 2 | 16 |
| `/zh-hant/myanmar/how-to-fill/` | 2 | 3 |
| `/zh-hant/georgia/` | 2 | 1 |
| `/zh/thailand/` | 1 | 860 |
| `/zh/maldives/` | 1 | 255 |
| `/zh-hant/cambodia/e-arrival/` | 1 | 165 |
| `/south-africa/` | 1 | 144 |
| `/zh/new-zealand/nztd/` | 1 | 132 |
| `/maldives/how-to-fill/` | 1 | 110 |
| `/zh/pakistan/visa-prior-to-arrival/` | 1 | 92 |
| `/korea/` | 1 | 78 |
| `/zh/ethiopia/evisa/` | 1 | 63 |
| `/japan/visit-japan-web/` | 1 | 42 |
| `/colombia/check-mig/` | 1 | 38 |
| `/zh/nigeria/` | 1 | 29 |
| `/zh/library/bn/` | 1 | 26 |
| `/qatar/hayya-evisa/` | 1 | 17 |
| `/zh/myanmar/tourist-evisa/` | 1 | 16 |
| `/library/sr/` | 1 | 12 |
| `/zh-hant/india/` | 1 | 12 |
| `/zh/entry-requirements/` | 1 | 12 |
| `/zh/canada/how-to-fill/` | 1 | 11 |
| `/japan/landing/` | 1 | 9 |
| `/peru/` | 1 | 4 |
| `/zh/library/sr/` | 1 | 4 |
| `/zh/colombia/` | 1 | 3 |
| `/new-zealand/is-ivisa-official/` | 1 | 2 |
| `/library/eg/` | 1 | 1 |
| `/zh-hant/china/` | 1 | 1 |
| `/zh/library/tw/` | 1 | 1 |

</details>
