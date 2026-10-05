# 全球旅客申报资料库续跑：补齐 29 地与全库事实验收

## 当前基线（2026-09-24 只读实查）

- 母表 249 地（联合国 M49 的 248 项加本站单列 TW）；研究主库 70 地、87 事项，独立暂存新增 150 地、234 事项，合计有记录 220 地、321 事项。这里的“有记录”不是事实完整或可发布。
- 缺记录的 29 地：AQ；大洋洲 AS AU CC CK CX FM GU HM KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS。按母表差集重算后派发，不能只相信此快照。
- 前 126 份暂存记录已逐项审校：210 事项中 189 项保留官方正文核验日期，21 项未通过，涉及 19 地。后增欧洲 24 地仅 GB 为 partial，其余 23 地 blocked，需本国官方来源返修。全部暂存记录仍未导入主库。
- 公开快照 `data/travel_library_public.json` 为 0 地；网站线上 50 个目的地，另有本地 53 地国家指南分支。研究、公开快照、网站指南分别验收。
- Z.AI 官方公告已将 ZCode 内置 GLM-5.3-Flash 活动延至 2026-10-07；仅付费计划、ZCode 3.10+、北京时间 23:00 至次日 09:00 内使用 Flash 才按公告享受零额度消耗。仍须在每夜派发前核实资格、额度、当前模型和真实时间。公告：<https://docs.z.ai/devpack/notice/event-glm-5.3-flash>。

## 执行入口和时间

复用 ZCode 原全球资料库任务 `sess_77634629-084d-4bdb-a5d4-65deec4ecfa1`，仅选择内置 `GLM-5.3-Flash`。工作树为 `/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global`；暂存记录、下载原件、运行日志只写 `/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910` 下本轮专用批次目录。外盘缺失、不可写、额度耗尽、模型切换或控制界面异常时停止派发并记实。不要使用 `claude-glm`、官方 Claude 或其他模型替代。单进程逐地落盘，禁后台 Agent。

沿用 `2026-09-10-nightly-execution.md` 的窗口：北京时间 23:00 至 08:30 可派新任务；08:30 后只验收和收尾；08:50 停止仍运行的本项目任务，08:55 复查。每夜记录实际调用 ID、模型、起止时间、文件增量、验证结果；调度触发不等于任务执行。

## 先补 29 地：小批次、官网原文优先

按现有 `2026-09-10-global-batches.md` 的 17 至 20 批区域顺序执行，但每次仅派 2 至 4 地，避免一轮生成十二份外国旅行建议占位记录。首批 AU、NZ；之后 CX/CC/HM/NF、NC/PG/SB/VU、GU/KI/MH/FM、NR/MP/PW/UM、AS/CK/PF/NU、PN/WS/TK/TO、TV/WF、AQ。每个国家/地区先核母表差集和本轮专用目录，已落盘且未经主控验收的文件只返修，不重复覆盖。多个行政区共用制度时分别核领土适用范围，不自动复制宗主国规则。南极洲及无人常住岛屿也须以主管机关原文说明访问/许可边界，不造旅客表单。

每地先定位本地海关、边境、检疫或有法定管辖权的主管机关网页/法条，实际取得正文；再确认表单/规则类型、入出境方向、旅客适用条件、豁免、金额及含本数、期限、渠道、费用、现行性。将 URL、发布机关、读取日期、原文短引文及原件指针保存到外盘。短引文遵守当前 schema 的 25 词上限。外国政府旅行建议仅作线索；搜索摘要、HTTP 200、网页标题或模型转述不构成官方事实。拿不到原文则留 `blocked` 与具体失败、下一检查入口；不得把“未找到”写成“无需申报”。

首批官方入口线索（派发时重新打开正文）：AU 的 [Australian Border Force 入境旅客卡](https://www.abf.gov.au/crossing/Pages/incoming-passenger-card.aspx) 与 [农业部入境生物安全说明](https://www.agriculture.gov.au/travelling/to-australia)；NZ 的 [NZTD 官方入口](https://www.travellerdeclaration.govt.nz/) 与 [New Zealand Customs 入境说明](https://www.customs.govt.nz/travel-to-and-from-new-zealand/travel-by-air/on-your-arrival)。NZTD 同时收集移民、海关与生物安全信息，建模时核对是否属于同一次旅客提交，避免重复写成两张必填表；澳洲 ATD 仍需按官方适用范围判断，不能把试点当全国全面替代。

执行方只写本批独立 `normalized/records/{ISO2}.json`、对应 fixture、证据和报告，不改主库、母表、网站页面、schema、校验器、公开快照，不做 Git 操作或部署。每小批结束即停，由 Codex 独立调用原版校验器、核对文件差集和每项官方原文后，才派下一批。

## 再完善全库

补录 29 地后，按审校清单关闭先前 21 项未通过及所有 `unresolved`；欧洲 24 地优先返修本地官方来源。再对主库与暂存 249 地进行全量结构、引用、状态、同一制度复用及中英事实一致性检查。已核事项需有当前适用的官方正文，`verified_at` 不能代替整地完整性；`partial` 和 `blocked` 继续如实存在，直到明确证据解决。

Codex 串行集成获准记录到内部主库，确保 249 母表、249 唯一记录、事项 ID 不冲突、旧 70 记录不丢失，并重跑真实 `scripts/check-travel-library.mjs`。独立事实验收、研究版构建、SEO、页面浏览器验收分别记录。本地提交须固定本次范围，不带入并发改动；公开快照只选择已批准记录导出。推送、部署或开放 MCP 服务另行依据用户明确授权。完整结果必须分别给出“有记录”“已核事项”“整地状态”“已集成”“已公开”数字。
