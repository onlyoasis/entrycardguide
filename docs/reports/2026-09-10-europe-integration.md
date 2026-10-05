# 欧洲 27 国资料集成报告（2026-09-10）

范围：`data/travel_library/records/`（新增 26 国 + DE 合并）、`data/travel_library/jurisdictions.json`（仅 26 行）、本报告。未改其他国家的 record、脚本、模板、依赖，未执行任何 git 操作。工作区内其他已暂存的站点内容改动与本任务无关，未触碰。

## 复核修正（相对归一化交付版）

按独立评审 `2026-09-10-europe-research-review.md` 终态要求，逐国复核后修正（改动同步落在外盘 `europe-research/normalized/records/` 与主库）：

- **IE**：评审指出的「酒类 18+」错误在归一化版仍存在，已改为烟酒均 17 岁门槛；新增 source `ie-revenue-rules`（rules.aspx，GLM 经 WebFetch 独立复核原文 "If you are under 17, you are not entitled to tobacco or alcohol allowances."，采集摘录存 `raw/ie-rules-excerpt.md`）。
- **CY** 现金摘录、**MT** 物品摘录、**PT** 两条摘录、**LV** 消费税摘录、**PL** 摘录、**SE** 酒类摘录、**FI**、**HR**：逐字比对 raw 原文后统一改为真实短摘录（≤25 词/来源，片段用省略号连接，每片段均可在外盘 raw 文件中逐字命中）。修正前的问题包括插入原文没有的逗号、省略括注、拼接列表项等。
- **DE** 现金 source（`de-zoll-barmittel`）摘录在外盘 raw 中无对应（属主库既有资产，非本批取证），按任务边界原样保留，未改动。

## 完整度口径（评审终态要求）

verified 表示该国主要事项（现金 + 物品额度）均有原文支撑，不表示该国海关制度全量核实：

- **verified（4）**：CY DE HU LV（现金+物品两类均有官方原文）
- **partial（20）**：AT CZ DK EE ES FI FR HR IE IT LT LU MT NL PL PT RO SE SI SK——其中 CZ/EE/FR/HR/IE/LU/PL/SI 原判 verified，因仅取证物品额度、现金申报未落证而降级，procedure 的 verified_at 保留，unresolved 列明现金缺口
- **blocked（3）**：BE BG GR（无可落证事项）

**LT** 由 blocked 改 partial：新增 `lt-cash-declaration-service`（fee 0 EUR），基于主控（Codex）web.open 取得的 Mano Muitinė 服务页 17 词逐字摘录（`raw/lt-codex-official-excerpts.md`），procedure 与 source 中均写明采集归属与证据边界，不称 GLM 自行请求成功，也不称整国制度已核实。

## 集成动作

1. 复制 26 个新国家 record（不含 DE）到 `data/travel_library/records/`；目标均不存在，无覆盖。
2. **DE 合并**：保留主库原 `de-cash-declaration` procedure 与 `de-zoll-barmittel` source 原文不动，仅新增 `de-goods-declaration`（reisefreimengen_node.html 取证）与对应 source；原 unresolved 中「物品额度未覆盖」一条因此清空；review_status partial→verified。
3. **母表**：即时读取 `jurisdictions.json` 后原子写回（tempfile + os.replace），只改本批 26 行的 `research_status: not_researched→researched` 与 `records_file`，非洲第 2 批（ET/KE/MG/MU/MW）的记录与标签全部保留（集成时其行已由并行任务接线为 researched，5 个 record 文件在场且被引用）。
4. LT 的 fee 初版写 "free" 不合 schema，改为 `{amount: 0, currency: EUR}`（外盘与主库同步改）。

## 验证

- `node scripts/check-travel-library.mjs` → `OK — 249 jurisdictions, 70 record files, 87 procedures (all unique)`，退出码 0。无并行孤儿文件问题（非洲任务已接线完毕）。
- 27 份 record 的全部非空摘录逐片段在外盘 raw 中逐字命中（唯一例外为上述主库既有 DE 现金 source）。
- 本轮未修改校验器、任何脚本或其他国家记录。

## 证据与日志位置

外盘 `/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/europe-research/`（raw/ 含本轮新增 `ie-rules-excerpt.md`）。未使用 /tmp、哈希、凭据，未发布、未安装依赖。
