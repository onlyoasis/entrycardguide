# 126份暂存资料的官方来源审校

2026-09-12。用户授权 Codex 及三个子 agent 并行执行。本轮已逐一审查并修正 126 个国家和地区的暂存记录；尚不能称为全部事实验收通过。

## 最终结果

| 分组 | 国家/地区 | 事项 | 保留核验日期 | 未通过事项 |
|---|---:|---:|---:|---:|
| 非洲 | 34 | 64 | 61 | 3 |
| 美洲 | 43 | 63 | 58 | 5 |
| 东亚、中亚及东南亚 | 24 | 50 | 43 | 7 |
| 其余亚洲及台湾 | 25 | 33 | 27 | 6 |
| 合计 | 126 | 210 | 189 | 21 |

- 修改前为 126 记录、204 事项，81 partial / 2 verified / 43 blocked。当前记录标记为 8 verified / 112 partial / 6 blocked。
- 原有 204 个事项 ID 全部保留。新增 6 项：CN 外国人入境卡、SG 现金、VN 现金、KH 独立入境服务、LC 入境卡、VE 回国居民家用品证书。拆分用于区分有证据的事项与仍未核实的海关范围，不代表旅客需要重复填写同一表。
- 189 项的核验日期非空，仅表示当前限定范围内的断言有官方正文支持；不表示该国家全部规定、所有未知费用及特殊情形已查全。
- 21 个事项涉及 19 地。整份记录仍 blocked 的为 CU、IR、IQ、KP、KW、YE；其他待核事项所在记录有另外的已核内容。
- 251 个来源条目、207 个不同 URL。不同 URL 数包含明确标注失败/未知的核查线索，不能当成 207 个均可用的官网。

[126地逐项清单](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/国家逐项核验清单.md) · [21项未通过清单](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/未通过事项清单.md) · [最终统计和真实校验输出](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/verification-summary.json)

## 主要事实修正

- 台湾：一般自用家用行李额度由旧记录 2 万改为 3.5 万新台币；酒类由 1 升改 1.5 升，酒类年龄为 18 岁；无记名证券申报不是原记录的 100 万新台币。另区分现金携带限制、申报和许可。[关务署额度调整](https://web.customs.gov.tw/singlehtml/2222?cntId=a1ba90a5e6744b15909b0226ed55a35d)、[资金申报问答](https://web.customs.gov.tw/singlehtml/2881?cntId=cus1_128145_2881)
- 土耳其：旧官网 FAQ 的 25,000 里拉已被 2025-03-28 修订取代，携出本币及相关支付文件超过 185,000 里拉申报；外币超过等值 10,000 欧元。以财政部合并条文纠正，不凭网页页脚更新时间选版本。[财政部法条，第3(5)、4(2)条](https://ms.hmb.gov.tr/uploads/2025/07/Turk-Parasi-Kiymetini-Koruma-Hakkinda-32-Sayili-Karara-Iliskin-Teblig-d2e065a8155e81ed.pdf)
- 亚美尼亚：剔除 2018-01-01 已失效条约的现行依据身份，改用本国税委旅客指南第13节，限于其直接说明的携入规则。[税委指南，第9页](https://www.src.am/storage/menu_contents_266/tq_sahman_hatogh_fizandz_arm_66bf43f3e78b4.pdf)
- 美国、波多黎各、USVI：纠正关税领土边界、将所有黄金都算 FinCEN 货币工具、禁止家庭合并免税额、USVI 1,600美元优惠一律要求48小时等旧断言；海关、移民和农业查验分开。
- MF 与 BL：纠正法属圣马丁和圣巴泰勒米的欧盟关税领土地位混用；墨西哥更新生产表所列额度/税率；TC、GS、加拿大等修正金额或时间边界。详细来源逐项记录在美洲审计中。
- 西非：分开反洗钱运输申报、外汇兑换配额、居民售汇和非居民证明义务；非居民外汇50万CFA与一般反洗钱500万CFA不能合并成一个阈值。地方旧页冲突仍有记录。
- 亚洲：补齐入境卡的国籍/证件/口岸豁免，区分海关与移民申报；修正孟加拉国旧金额、马来西亚表号、澳门含本数、日本家庭表与别送行李规则。中国两份2025废止目录已按实际XLS/XLSX解析，共6条废止、46条失效，未列2023年第151号；此检查不外推没有其他后续专项措施。

[非洲逐项审计](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/africa/audit.json) · [美洲逐项审计](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/americas/audit.json) · [东亚等逐项审计](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/asia-east/audit.json) · [其余亚洲逐项审计](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/asia-other/audit.json)

## 未通过与交叉评审处理

- 沙特现金4万/6万冲突，阿曼6,000及科威特3,000的含本数冲突未获消除，相关事项不保留核验日期。
- 朝鲜、伊朗、古巴等未取得足够现行主管机关正文；老挝LDIF、越南行前门户及柬埔寨海关组件仍只有应用外壳或访问阻塞。搜索摘要和HTTP 200未用来升级核验。
- 也门候选网站正文虽然可读，但未找到独立官方归属证据，已撤销核验，保留候选入口。
- SL机票税虽有NRA正文，当前模型不能正确表达为申报事项，主控最终将其置为未通过；BB机场费也不计海关申报验收。这是内容/分类门禁，未修改schema迁就数据。
- 主控与子agent交叉审查后，另纠正了TZ香水份额推断、ZA贵重物品的居民标题范围、AZ恰好1万美元歧义、IN渠道、DM家庭范围、BM美国预清关分支、VE发运时限、AG标题及JM机关归属残留。
- 子agent早先汇总是交付快照，最终以本报告、当前normalized文件和 verification-summary.json 为准。主控后续撤销SL与YE核验，因此早先“62项非洲”或“190项总计”不是最终批准数。
- IL、PS由主控通过实际浏览器读取，保存的是明确标注的官方段落选段；交叉agent的再次web访问失败，仅完成选段与字段一致性检查，未冒称第二次线上验收。

## 独立验证与交付边界

主控在全部执行agent停止修改后，重新调用工作树原版校验器：

```text
check-travel-library: OK — 249 jurisdictions, 126 record files, 210 procedures (all unique)
```

全量集合核对：126/126有逐事项审计；原事项丢失0；新增6；证据文件缺失0；已核事项仅依赖外国政府旅行建议的数量0。239个标记ok的来源条目做引文对原件核对：230个经格式归一化匹配，余9个为两份扫描法条的重复引用，主控已目视核对原图。引文一致性和结构通过均不证明全部法规时效已穷尽。

- [主控全量校验](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/verification-summary.json)
- [引文检查](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/independent-quote-check.json)、[扫描页目视检查](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/manual-quote-check.json)
- [亚洲交叉评审](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/asia-other/cross-review-africa-agent.json)、[美洲交叉评审](/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912/americas/cross-review-asia-east.json)

修改对象是既有外盘12个批次的normalized记录。修改前副本、原始官网证据、访问失败记录和本轮验证夹具均在 `/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/official-audit-20260912`。当前约69MB；XLS读取依赖单独存于外盘DevCaches。失败下载保留失败身份，不作为核验原件。

主库仍为70记录，本轮没有把暂存资料导入主库，也未改网页、schema或校验器、提交、推送或发布。工作树 `codex/global-traveler-library` 的 HEAD 仍为 `f3441cc`，先前对 `7bb45c8` 的合并仍待提交；并发的资料发布边界方案未改动。本轮无需用旧70条主库的构建/SEO结果替代210事项资料验收。

下一步应先解决21项未通过与各记录unresolved，再按独立的资料公开边界方案确定可公开内容；本报告不授予整体资料“全部官网核实”的发布结论。

