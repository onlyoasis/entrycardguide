# 第二夜首批：修正证据与事实

## 执行边界

仅北京时间23:00至08:30启动/接续，经ZCode内置GLM-5.3-Flash；08:30停止新工作、08:45保存结束、08:50主控停止、08:55复查。先核真实时间、外盘和模型，不切CLI或供应商。禁止Git、提交、推送、发布、主库/UI修改、哈希、凭据读取、子代理。你不是唯一执行者，保护已有改动；下载/缓存/临时文件全部外盘。

## 首批仅五地

写入仅限既有外盘runtime/global-20260910/asia-12内IN/MV/BH与asia-11内VN/ID的记录、证据、fixture及报告。完整runtime前缀为 /Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910。工作树为 /Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global。

先读取docs/reports/2026-09-11-asia12-review.md的最新审计纠正。本任务书是当前结论：三国有数据库text型webReader摘要记录，但其是否为独立服务端工具原始返回尚未证实；不能定性确定伪造，也不能当官方完整原文。普通curl失败不证明其他工具未取得内容。主控已把三国新增事项verified_at清空、来源access_status设failed、记录blocked，保留隔离审计；不得用旧fixture恢复已核状态。

必须重新取得可核官方正文或原件；保存真实工具返回与实际URL/日期/方法，不生成摘要后称全文，再用自写摘要校验引用。工具无法取得就如实失败/unknown，不编造或迁就validator。

1. MV：核官方民航通告AT01/2024的3.1.7/3.2.5（任何币种等值USD10000及以上出入申报）与现记录本币MVR100000/外币超过10000的冲突，核有无后续更新。第3.1.3许可类与3.1.4完全禁止类分开；主控已读2024离境取消公告与2026-09-10更新的移民局游客说明，入境抵达前96小时内与出境免填该表须分开，不混海关/移民二维码。见docs/reports/2026-09-11-maldives-direction-review.md。
2. BH：烟草50g、现金BD3000、购物BD300数值缺可靠原文；查海关现行页面/法规，不能用AIP一般行李检查说明背书数值。新增官方检索线索：内政部207/2022号资金披露决定第3条似为官员要求时披露、第9条废止12/2017；2003年第3号实施细则有BD300个人物品/礼品免税条款。主控打开均403，尚非全文验证，不能将线索自动升级，详见docs/reports/2026-09-11-bahrain-source-leads.md。
3. IN：核CBIC真实现行旅客指南，明确现金与总外汇的或/且条件；不要把模型写的英文Verbatim当官方引文。主控已读财政部2026年第15号通知19页PDF正文，2026-02-02生效；CBD-I第18(viii)/(ix)分别列USD5000现钞、USD10000总外汇，任一Yes须报红通道。第3条涉及电子申报、提前三天及经官员准许的到达后其他申报方式。必须以2026规则复核，不能继续仅沿用旧2013申报规则或旧指南。原件及具体定位见docs/reports/2026-09-11-india-2026-review.md。
4. VN：撤销“USD5000是中国规则混淆”的错误纠错说法。主控已读取越南政府新闻网2024-03-04中文问答，明确15/2011/TT-NHNN第2条的USD5000/VND15000000门槛及低额存外币账户例外；核2026现行有效性与越文原条款，注意英文翻译可能把低额存款分支译反。现已读数据库历史与2022修订公报：部分失效涉及第5(1)(a)证明签发条款，不可误判第2条金额整体废止，详见docs/reports/2026-09-11-vietnam-amendment-review.md。
5. ID：9月1日强制仅三机场/Batam港口，其他口岸为试用扩展，不是全国。主控已实际读Batam移民局公告；现又读到日惹移民局2026-01-15正文，明确自2025-10-01适用从国外抵达的WNI/WNA旅客，见docs/reports/2026-09-11-indonesia-rollout-review.md。中央公告仍WAF，不能称已读其全文。three days不能擅写精确72小时截止。

每地给修改前后、原文定位、真实来源文件与访问结果、未决；用工作树原版scripts/check-travel-library.mjs复验隔离fixture，不改validator。五地完成停止让Codex独立验收，不能自行进入下一组或集成。

同时检查本次五地面向用户的名称/适用/时间字段：抓取工具和执行经过移入既有来源、unresolved或报告；保留实际影响旅客判断的未知及规则冲突，不把文字清理当事实确认。不得扩大本批写入范围批量清理其他国家。

## 后续顺序（首批之后由主控单独派发）

- 中亚KZ/KG/UZ按docs/plans/2026-09-11-central-asia-repair.md先作关联返修，具体证据见下列报告。此任务书未派发，不能与首批五地并行启动。
- TH/SG/MY/LA按docs/plans/2026-09-11-arrival-card-repair.md修事项分类与适用范围，未派发，逐批独立验收。
- 西非八地按docs/plans/2026-09-11-west-africa-repair.md处理2025区域规则与国家适用，未派发。
- PR/VI/US按docs/reports/2026-09-11-usvi-review.md核关税区与具体申报；国内航线不等于免海关义务。
- CW按docs/reports/2026-09-11-curacao-review.md核2014修订范围及新旧币衔接，保留现海关NAF20000原文，不凭换币直改门槛。
- 补asia-12其余9地国家官方研究，不接受仅一轮FCDO就报完成。
- 按docs/reports/2026-09-11-coverage-backlog.md处理剩余66地，asia13未派发；不把准备好的任务书当执行中。
- 来源追查队列见docs/reports/2026-09-11-rendered-source-queue.md，含正常PDF渲染候选，不全部视作问题。
- KZ按docs/reports/2026-09-11-kazakhstan-export-review.md补查本国外汇携出禁令；EAEU关境申报不等于超额外币可带出，现有已核事项须补适用边界后重验。
- UZ按docs/reports/2026-09-11-uzbekistan-primary-text-review.md补免税额度及条件。俄文页链接的乌兹别克文正文现已成功读取，不得继续把语言入口误记为JS无法获取；具体条款日期与元数据日期分开核。
- TH按docs/reports/2026-09-11-thailand-scope-review.md纠正TDAC事项类型，并分别核一般应税物品、超量烟酒和禁限品处理，不能一概写红通道补税即可。
- 事项类型复核见docs/reports/2026-09-11-procedure-type-review.md：全量189事项已有TH/SG明确错类，MY/LA等待核；综合表单不可凭关键词自动改类。由主控另行限定写入范围后执行。

## 模型与审计证据

实际模型数据库803条均GLM-5.3-Flash（802完成/1取消），无09:00至23:00启动调用；不单独证明计费零扣或内容正确。见docs/reports/2026-09-11-zcode-model-evidence.md。
外盘asia12-evidence-write-events.json保留8条命令及结果，asia12-server-reader-text-records.json保留3段text型摘要，两类证据合看。不得覆写审计材料。

西非八地另按docs/reports/2026-09-11-uemoa-review.md核2025实施细则；已找到UMOA区内1000万申报原文及2025外汇指令废止旧规定条文，禁止继续只看2024附件就称无新细则。
