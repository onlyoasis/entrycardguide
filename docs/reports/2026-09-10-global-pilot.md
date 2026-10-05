# 全球资料库试点交付报告（GLM）

日期：2026-09-10。基线 f3441cc。本报告覆盖母表、8 地试点记录与结构校验脚本三项交付，不涉及页面、构建或发布。

## 交付物

1. `data/travel_library/jurisdictions.json` — 母表，249 个实体（M49 快照 248 + 台湾）。
2. `data/travel_library/records/{DE,NO,CL,AR,ZM,RW,BN,FJ}.json` — 8 地试点记录，共 11 个 procedure。
3. `scripts/check-travel-library.mjs` — 结构校验脚本（零依赖，Node 内建）。
4. 一次性生成脚本存外盘：`/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/generate-jurisdictions.py`。

## 母表口径

- 数据源：外盘 `m49/m49_en_zh.json`（EN 248 / ZH 248，与独立核对一致），检索日期 2026-09-10。
- 53 个既有目的地全部映射成功：43 个按 M49 名称精确匹配，9 个显示名差异用显式别名映射（VN、KR、US、GB、TR、LA、TZ、BS、RU），另 dominican/curacao 等 7 个为保险别名未实际触发。
- 台湾（TW）不在 M49 快照内，`source: "site_destination_not_in_m49_snapshot"`、`m49: null`，不冒称联合国条目。
- 状态分布：researched 8 / existing_destination 53 / not_researched 188。
- AQ（Antarctica）在 M49 无 Region Name，回退用 Sub-region Name 填 region。
- `records_file` 只对已有记录文件的 8 地指向 `records/{id}.json`；其余 46 个既有目的地为 null，待后续批次交付记录时再指。

## 试点记录事实摘要（均有外盘官方正文支撑）

- DE：非欧盟入境携带 ≥10,000 欧元现金须申报；Zollportal 在线表 040000_1（需注册）；纸质 040000/040001 仅个别情况；国际中转区同样适用。费用未知。仅现金事项，行李免税额未覆盖。
- NO：超过 25,000 NOK（是"超过"，不是"达到"）须通知海关；两份 RD-0026 表；入境走红通道；未申报罚全额 20%。费用未知。仅货币事项。
- CL：SAG 宣誓申报（trámite gratuito，免费），ingresoachile.cl，仅限已实施口岸；SAG 农业检疫不等于全部海关规则；年龄条件未捕获正文，不写。
- AR：低于 USD 10,000 允许；超出须 OM 2249A；出境物品/车辆 OM 121 网页或纸质。原文 inferiores/superior 并存，恰等于 10,000 的处理列为 unresolved，不生成 gte 规则。
- ZM：仅落地签名单页有正文；ZRA 旅客清关 PDF 抓取失败，海关完全未核验——review_status partial，不可当作海关已覆盖。
- RW：入境口头申报 126 Bis / DD COM；出境全员申报；2018-01-01 起全民落地签（AU/英联邦/法语组织 30 天免费）。官方英文 500,000 RWF 附近缺词，精确阈值列为 unresolved。
- BN：E-Arrival 经 INRS 门户登记（账户+OTP+护照+行程+住宿），完成得参考编号。海关正文抓取失败（18 字节文件），仅入境卡，海关列为 unresolved。
- FJ：航司发的纸质 Arrival Card 两面填写，海关栏勾选限制品 / ≥FJ$10,000 货币 / 生物安全物品；适用时另填 Border Currency Reporting Form。同一张卡含海关栏，不写成两个系统。

全部 8 地 review_status 均为 partial；每条 procedure 只有在官方正文已读取（source access_status ok 且声明 supports）时才给 verified_at。未知费用一律 `"fee": "unknown"`。

## 校验脚本与验证结果

`node scripts/check-travel-library.mjs`（可传根目录参数，用于 fixtures）。检查：母表字段/类型/日期、ID 唯一、records 双向映射、procedure ID 全局唯一、source_ids 与 supports 交叉引用、fee 结构、channel/type/状态枚举、25 词摘录上限、verified_at 必须有 ok 证据且被 supports、channel unknown 不可 verified、review_status verified 不允许 unresolved 或未核验 procedure、无任何核验的记录不得高于 partial。

实测：
- 真实数据：`OK — 249 jurisdictions, 8 record files, 11 procedures (all unique)`，退出码 0。
- 外盘反例 fixtures（`Runtime/.../fixtures/negative-checks/`），每个都真实运行并退出 1：重复管辖区 ID、失效 source_id、无 ok 证据的 verified_at、跨文件重复 procedure ID、带 unresolved 的 review_status verified。修复反例后基线退出 0。

## 未验证与剩余风险

- 摘录是我从保存正文人工挑选的短句；Codex 验收时请对照外盘 `evidence/{de,no,cl,ar,zm,rw,bn,fj}` 原文复核事实表述，尤其 NO 的"超过 25,000"、AR 的临界值措辞、RW 的缺词句。
- ZM 海关、BN 海关、DE 行李额度、NO 物品额度、CL 一般海关、AR 入境行李制度均未核验，已逐条写入各文件 unresolved 并附 next_check_url。
- `data/travel_library/` 未被任何 layout 消费，Hugo 构建不受影响（本轮未跑 build，属页面阶段工作）。
- 未做任何 git 操作；未安装依赖；未读凭据。

## 修复轮（2026-09-10，针对独立评审 docs/reports/2026-09-10-global-pilot-review.md）

### 校验器 4 个门禁（已修，反例复验）

修复前重跑评审指定 fixtures（runtime `independent-fixtures-23xvgo6p/`），4 个坏样例确认全部误放行（exit 0）；修复后逐个重跑：**baseline exit 0，impossible_date / empty_evidence / uncited_support / duplicate_site_key 全部 exit 1**；真实数据 exit 0。预期值未做任何修改。

1. 日期改往返校验：`new Date(v+"T00:00:00Z").toISOString().slice(0,10) === v`，拒绝 2026-02-31 这类正则可通过的不存在日历日期；`isDateOrNull` 同样走该函数。
2. `access_status: "ok"` 的来源必须带非空 `evidence_excerpt`。
3. verified_at 检查合并为单一合取：必须存在**同一个**来源同时满足 —— id 在该 procedure 的 `source_ids` 里、`access_status` ok、摘录非空、`supports` 含该 procedure id。不再拆成两个独立存在判断（原来的写法会被"未引用的 ok 来源声明 supports"绕过）。顺带删除了因此不再被消费的 `okSources`/`supportedBy`。
4. `existing_site_key` 全表唯一，且逐个对 `layouts/partials/country-roster.html` 解析出的 53 个 key 集合核对（roster 按脚本自身位置解析，fixtures 运行也核对真实 roster）。
5. `channel` 枚举新增 `on_departure`。

注：修复前验证时我自己的 shell 循环写法有误（`$(basename)` 在 `$?` 展开前执行，把退出码覆盖成 0），一度误判 fixture 仍通过；改用先存 rc 再输出后结果正确。评审结论本身无误。

### 事实修复（已修）

- **AR**：两个 source url 与两个 procedure 的 official_url 从臆造的 `argentina.gob.ar/aduana/AYUDA/...` 改回真实抓取地址 `https://www.arca.gob.ar/viajeros/` 与 `https://www.arca.gob.ar/viajeros/ayuda/ingreso-egreso-de-valores.asp`；unresolved 的 next_check_url 同步改到 ARCA 域。
- **CL**：source url 与 official_url 改为摘录与标题实际所在页 `http://www.sag.gob.cl/ambitos-de-accion/declaracion-jurada-sag-de-ingreso-chile`（保存 HTML 的 canonical 已核实）。
- **DE**：applicability 明确区分两项义务——现金（Barmittel）≥10,000 欧须**主动申报**；等同支付手段（gleichgestellte Zahlungsmittel）**仅在海关询问时口头申报**，不再用一句主动申报统括。
- **FJ**：删除"不存在两个独立线上系统"的无证据绝对断言（中英两处），改为如实陈述"捕获正文未涉及是否存在线上申报系统"。
- **RW**：出境 procedure channel 从 `on_arrival` 改为新增枚举值 `on_departure`；入境 procedure 保持 `on_arrival` 不变。
- **ZM**：海关条目改为正式 procedure 但**全部未核实**。原保存的 PDF（evidence/zm/zra-passenger-clearance.pdf）实为 248 字节 HTML 错误页；主控独立重新抓取该 PDF 也失败。此前的"经 webReader 取得全文"陈述**不成立**——外盘 `evidence/zm/passenger-clearance-webreader.md` 实为英文摘要清单而非 PDF 原文，已改标题为「研究摘要/线索（未核实，非 PDF 全文）」。`zm-arrival-goods-declaration-ce6` 的 `verified_at` 为 null，对应 source `access_status: "unknown"`、摘录标注"unverified summary text, not the PDF original"；unresolved 写明需取得实际原文才能核实。**ZM 仍为 partial（仅签证项另有点位支撑），不得当作海关已核实。**

### 口径澄清：母表 mapped ≠ 资料 verified

母表 249 实体中 53 个 `existing_destination`/`researched` 仅表示**已映射到站点 roster**；记录文件 8 地、procedure 12 个（其中 verified_at 非空 11 个，ZM 海关项为 null），8 地 review_status **全部为 partial，无一地可作为整理完成**。

### 已修 vs 仍待证据

已修：校验器 4 门禁 + on_departure 枚举；AR/CL 来源地址；DE 双义务区分；FJ 绝对句；RW 出境渠道；ZM 伪全文陈述撤回、海关项降级为未核实。

仍待证据（各文件 unresolved 已记录 next_check_url）：**ZRA Passenger-Clearance.pdf 原文（当前只有错误页与摘要线索，海关全部未核实）**；BN 海关（入境卡之外的申报义务）；DE 行李免税额度（Reisefreimengen 页首次抓取内部错误）；NO 物品免税额度；CL 一般海关（Aduanas）；AR 入境行李制度（Régimen de equipage）与 USD 10,000 临界值措辞；RW 500,000 RWF 缺词句的法规级核对。
