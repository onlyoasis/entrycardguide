# 全球旅客申报资料库执行方案

## 目标与边界
用户授权 Codex 制定方案、GLM 执行剩余国家资料整理。默认旅客入境、海关、健康申报；签证/ETA 独立分类，商业货运不混入。未来付费 MCP 本轮仅准备结构化数据，不实现计费、鉴权或服务部署。
当前基线 f3441cc，继承已存在国家扩展成果。先实测 roster 唯一国家数，不把表单数当国家数。canonical 仍是 /Users/lzc/Projects/web/entrycardguide。

## 覆盖与数据
以联合国 M49 https://unstats.un.org/unsd/methodology/m49/overview/ 的国家和地区为可审计母表，保留地区类别，不宣称每项都是主权国家；补充本站既有目的地并显式注明来源。每个母表实体都必须有记录和完成状态，未核实绝不写已覆盖。
新增 data/travel_library/jurisdictions.json：schema_version、scope_source、retrieved_at、jurisdictions 数组。实体含 id（ISO alpha2，例外显式标识）、name_en/name_zh、m49、region、existing_site_key、research_status、records_file。统计既有覆盖、剩余、已研究、未解决。
新增 data/travel_library/records/{id}.json：jurisdiction_id、review_status、researched_at、procedures 数组、sources 数组、unresolved 数组。每事项含 id、type（customs_declaration/arrival_card/health_declaration/travel_authorization/visa）、name_en/zh、agency、official_url、channel（online/paper/on_arrival/conditional/unknown）、applicability_en/zh、fee（已证实金额与币种或 unknown）、timing_en/zh、source_ids、verified_at。未读到官方正文则 verified_at 为 null；不得以检索片段或 HTTP 200 当核验。
每来源含 id、url、title、publisher、retrieved_at、短 evidence_excerpt（单来源最多25词）、支持字段列表、access_status。原始正文快照放外盘 runtime，仓库只存短摘录与自写摘要。公共表单不可访问时找官方说明/使馆，仍无证据则明确 unresolved。没有线上表单不能推出无需申报。已存在 eVisa 指南不能代表已覆盖海关资料，既有国家也建映射和缺口。

## 执行顺序
1. GLM 先实现全球母表、现有目的地映射、结构校验脚本 scripts/check-travel-library.mjs，并用8个尚未覆盖目的地作试点：包含欧洲、非洲、美洲、亚洲/大洋洲以及纸质/条件申报案例，具体国家先查母表与已有数据再选。
2. Codex 独立读所有试点官方证据、跑真实校验脚本，确认 schema 可以表达无线上表单、共享区域规则、未知费用。对无来源/错引用/重复实体/未知冒充 verified 的反例必须失败。
3. GLM 按地区分批，每批10至15地补齐剩余实体。各地实际访问官方来源，不得模板批量捏造入口、费用、字段限制、QR、处理时长。失败国家记录明确原因和下次核查入口，不能换国家把母表缺口隐藏。
4. 数据层验收后再由 GLM 增加中英资料库索引和实体页，展示现状、官方证据与缺口；不强迫每国生成虚假的 how-to-fill 页。只对具备真实字段证据的表单复用既有页面模式。已核验内容与研究中分开展示。每国可以多个事项，共用制度应关联同一资料避免重复事实。
5. Codex 全量结构检查、所有数字事实的官方出处核对、每批至少3地且涵盖全部风险类型的正文复核；发现一处编造扩大该批至全量重审。构建及 SEO 门禁与页面移动端检查完成后记录准确统计。未解决不计完整资料，不能宣称全球已核验。

## GLM 任务约束
采用 claude-glm --model glm-5.3；实际日志 modelUsage/model 字段由 Codex 核对。执行方禁止任何 git 操作、push、部署、外发消息；不是独自工作，不覆盖他人改动。仅拥有新增 travel_library 数据、校验脚本、试点报告；在试点验收前不改共享模板或已有国家事实。先读 AGENTS.md、CLAUDE.md、docs/README.md 与本计划，以现状为准并允许反驳本计划假设。不要安装依赖，不读密钥或 .env，不更新旧条目的核验日期。不得使用其他模型代替 GLM。
运行日志、抓取正文、临时文件在 /Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910；构建、依赖缓存在外盘。每次写入前确保卷仍挂载可写；禁止回退内盘。预计<2GB，交付后证据保留30天，由用户决定退役，不自动删除。

## 完成标准
母表完整与资料完整分开：每实体有状态；已核实事项都有可回溯官方正文；未知字段诚实表达；中英事实一致；本地构建与 SEO 通过。独立验收报告列覆盖分母、现有/新增、verified/partial/blocked 分布。发布与 MCP 商业化另列阶段，不能把本地交付当线上完成。

## 页面接入前的源码集成门禁

2026-09-10独立实查：任务HEAD f3441cc与本地origin/main 632d869分叉（HEAD侧3提交、origin/main侧12提交），当前模板仍包含旧版布局。必须在页面实施前整合既有国家扩展成果与origin/main的前端/资料修复，保留本轮新增资料与其他工作树，不让新页面发布把已发布宽度/手机导航修复退回。整合由主控串行控制Git，GLM仅负责必要冲突内容与实现，禁止worker自行git操作。集成后的统一工作树重新构建/SEO/页面验收，旧分支基线测试不可代替。当前并行资料任务未结束前不变更其跟踪源码基线。


## CLI后台子代理生命周期约束

本轮实际发现：GLM通过claude -p调用Agent后返回“后台运行”，父CLI随后正常退出，终态统计却显示4个child均被system killed、0完成。后续GLM CLI任务使用--disallowedTools Agent，由本进程逐国完成并落盘后才返回；并行由Codex外层按独立目录分派，不能把异步派发当完成。历史任务仅在真实终态/进程证明停止后恢复，不因观察超时重启。
