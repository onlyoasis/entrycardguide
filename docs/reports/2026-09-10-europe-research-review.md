# 欧洲资料研究中独立评审

当前文件未验收，不可直接导入正式资料库。

- IE来源URL在独立打开时失败。重新从官方搜索定位并打开 https://www.revenue.ie/en/customs/individuals/info-travelling-duty-free/from-outside-eu/allowances.aspx 。确认一般物品430/215欧元，但原研究“机组人员免税额减半”被正文反驳：机组香烟40对普通200，烈酒0.35L对1L，并非统一减半。删除这个错误概括，按需要保留精确且有证据的规则。
- EE来源应重新核对 https://www.emta.ee/en/private-client/consignments-travel-moving/travel/third-country-estonia 。原研究/eng/private-client/travelling路径独立打开失败。正文明确飞机、火车、海路的烟草频率豁免，不能把“每月前两次”普遍套给航空。来源URL和例外条件需逐项修正。
- DE的_functions.html路径独立打开失败，真实官方候选是 https://www.zoll.de/EN/Private-individuals/Travel/Entering-Germany/Duties-and-taxes/Travellers-allowances/travellers-allowances_node.html （搜索定位；主控该地址先前open曾失败，执行方需真读正文）或对应德文 /DE/Privatpersonen/Reisen/Rueckkehr-aus-einem-Nicht-EU-Staat/Zoll-und-Steuern/Reisefreimengen/reisefreimengen_node.html 。邮购150欧元是否取消不属于旅客任务，不应无对应依据加入。
- NL guide的reizen与source的reisen不一致，必须使用实际获取页面地址。
- 多个evidence_excerpt是英文模型摘要，不是官方原句。可以用summary字段保留摘要，但excerpt只允许真实短摘录（25词以内）。摘要不能充当原始证据快照。
- CZ宣称欧盟内部无海关检查太绝对。行李、消费税、现金、限制物品可能有检查；删绝对句或找确切范围证据。
- ES把未成年人现金与监护人合并计算可能与共同规则每人计算冲突，必须找西班牙具体原文，不能凭推断。

由于已出现错误数字概括和来源URL错配，按照计划扩大该欧洲批次为全量事实复核；ok不是通过状态。必须逐国保留真实官方原文（网页工具的模型总结不算原文），不能一次概括几十条后写verified。

## 返修进行中补充复核

- 已有IE/DE/EE/CZ/NL raw HTML可回读。主控生成外盘 independent-europe-raw-check.json，检查raw存在和摘录字面匹配；含省略号的摘录需人工按各片段核对，不能仅因整句不连续就误判伪造。
- IE返修summary新增“酒类（18+）”错误。主控实际打开 https://www.revenue.ie/en/customs/individuals/info-travelling-duty-free/from-outside-eu/rules.aspx ，原文：If you are under 17, you are not entitled to tobacco or alcohol allowances. 两类额度都是17岁门槛，不能套用一般饮酒年龄。
- 一个来源多条excerpt累计仍须遵守单来源25词限制；不要复制同一URL多次绕过摘录上限，保留一个短引用并用自己写的摘要表达其他经核实事实。
- 请在最终交付前重新读取本报告新增部分。

## 主控补充现行入口（已独立打开，优先于旧路径存档）

- LT https://mano.muitine.lt/lt/paslaugos/keleivio-grynuju-pinigu-deklaracijos ：更新2026-05-08，明确旅客/现金电子申报服务、海关要求时的旅客申报、现金10000欧或海关要求时申报、可书面、服务免费。此为Mano Muitine服务页，链接到muitine.lrv.lt与国家电子服务入口；请复核并以准确官方归属写入，不要只在猜测的/for-passengers路径上反复取存档。
- MT https://mtca.gov.mt/customs/individual/Informationtotravellersoncashdeclaration ：已打开的现行马耳他税务海关页面。旧customs.gov.mt需转到MTCA现行内容，不要误认为无官方旅客信息。
- LV https://www.vid.gov.lv/en/cash ：已打开；https://www.vid.gov.lv/en/travelling 可作旅客目录候选。
- PT https://info.portaldasfinancas.gov.pt/en/tax-information/travellers-and-customs/Pages/default.aspx ：已打开旅客与海关目录；官方指南PDF候选 https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/Guia_viajantes.pdf （本轮未读PDF，不记已核实）。

请直接取得这些现行来源的原文并补齐对应国家，不以主控给的摘要替代自己取证。source日期仍为实际获取日。

## 归一化终态交付复核

27文件已交付，执行方称12verified/11partial/4blocked。LT依然blocked，但主控确实通过web.open读取了现行Mano Muitine官方服务正文；短原文与方法元数据已保存到外盘 raw/lt-codex-official-excerpts.md（17词原文，不是“HTML全文”）。可基于明确采集归属补LT服务记录，不得称GLM自己的curl成功或整个当地海关制度已全部核实。

执行方在validation-root移除了正由非洲任务写入且尚未接线的ET/KE/MG/MU/MW文件。它们是并行执行的中间状态，不是既有仓库缺陷；报告需改口径。最终集成必须复制当前一致状态并保留非洲全部文件，不能把临时fixture删减带入主库。

verified必须明确完整度边界。许多记录只收集物品额度、未记录现金/其他主要事项；在完整度未核对前不要用verified表示该国资料完整。可以保留已证事实的verified_at，同时将国家review_status设partial并列清楚未覆盖部分，不能清空unresolved只为绿色统计。
