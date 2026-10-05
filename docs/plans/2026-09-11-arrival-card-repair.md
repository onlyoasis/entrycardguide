# 四地入境卡与海关边界返修

状态：未派发。主控单独发送本任务后执行，不能与其他本项目GLM任务同时开始。仅北京时间23:00至08:30启动，08:45保存结束；ZCode内置GLM-5.3-Flash，不切CLI或模型。禁止Git、提交、推送、发布、主库/UI/schema/validator修改、哈希、凭据读取及子代理。你不是唯一执行者，保护已有编辑，下载和临时文件仅用外盘。

工作树`/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global`；唯一写入范围为`/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/asia-11`中TH/SG/MY/LA记录、对应证据、fixture副本与本次报告。其他八地只读。

先读`docs/reports/2026-09-11-procedure-type-review.md`及`docs/reports/2026-09-11-thailand-scope-review.md`。以下为待核问题，不是免查证结论；查得不同新证据须说明并以实际为准。

- TH：TDAC应与海关货物申报区分，按原版schema的arrival_card语义修类型。取官方手册及现行豁免、填写时间。一般应税物品、超量烟酒、禁限品不得统一概括为补税即可。核实际许可要求，未证实不编。
- SG：核ICA明确的免填人群及陆路居民条件，纠正无条件“所有旅客”；区分入境/健康信息与Customs@SG货物申报，不凭“国家统一平台”联想表单功能。事项类型与正文一致，保留三日含抵达当天的计算方式。
- MY：核完整MDAC豁免范围、新加坡公民是否存在陆路限定、长期准证与旧MACS措辞；不把三日自动等同精确72小时。对历史RM1000出境说法，回央行/海关最新规定和MDAC门户现金提醒核现行门槛、适用人群、方向及许可。不要把旧罚款数额直接称现行。
- LA：实际获取LDIF官方说明，核起用口岸、日期和双向要求后修类型；未取到的规则保留unknown，不能仅凭名称补事实。

逐地保存真实来源返回、短引用与条款定位，写修改前后和未决。引用主控报告不能代替原文；不要生成一段摘要再称官方全文。不改已存在的事实核验标记来迁就校验，缺证据如实处理。

用工作树原版`scripts/check-travel-library.mjs`验证隔离fixture；报告实际四地事项增减与全批数量，确认其他八地未改。完成即停止，等待Codex独立验收，不自行集成或接下批。
