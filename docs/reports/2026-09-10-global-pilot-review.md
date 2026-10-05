# 试点独立评审：暂不通过

## 校验器真实反例（已复现）

主控调用被测 scripts/check-travel-library.mjs 本身，基线退出0；下面4个本应退出非0的外盘fixture全返回0。结果与fixture路径见 runtime/global-20260910/independent-validator-fixtures.json。

1. DE.procedures[0].verified_at设为2026-02-31仍通过。使用有效日历日期校验（往返ISO日期匹配），不是只正则或Date.parse非NaN。
2. DE.sources[0].evidence_excerpt清空仍通过。access_status=ok且支撑verified必须有非空证据摘录。
3. DE唯一被引用源supports清空，另加不在source_ids里的ok来源给同一事项supports，仍通过。必须由同一个被引用来源同时满足ok、非空摘录、supports含该事项，不能拆成两个独立存在判断。
4. 两个现有目的地existing_site_key设为相同仍通过。需查唯一性，并与实际country-roster的key集合核对，不能仅把变量收集后不使用。

修改后重跑原fixture（不能改预期值迁就实现），正常数据应过，4个无效样本必须全部拒绝。

## 资料事实问题

- AR.json actual source和official_url用argentina.gob.ar/aduana/AYUDA/...，而真实抓取是 arca.gob.ar/viajeros/ 和 arca.gob.ar/viajeros/ayuda/ingreso-egreso-de-valores.asp。改回真实证据地址，不能凭想象整理新路径。
- CL摘录与标题来自 /ambitos-de-accion/declaracion-jurada-sag-de-ingreso-chile，引用URL却是另一页。请用保存的真实来源修正对应，必要时两来源分开记录。
- DE cash与equivalent means的主动申报和被询问申报不能用一句主动申报统括，依德国官方正文区分。
- FJ“不能把同一卡两栏目当两个系统”的建模要求，不等于官方证实“两个独立线上系统不存在”，删去这个无证据的绝对事实断言。
- RW出境channel=on_arrival语义错。当前schema把渠道与时间混在一起，增加on_departure或改为border办理渠道并保留明确方向；最小兼容修改，其他现有数据要同步真实含义。
- ZM海关PDF曾有webReader正文，但当前文件只记签证与缺口。继续取证修复海关记录；失败可partial，但不能把此地计为海关资料已完整。
- 目前8地全部partial，尚不能作为全部整理完成；母表mapped与资料verified必须分开统计。

## 欧洲研究早期风险（另批）

已见10地JSON。多个evidence_excerpt实际是模型摘要而非原文；NL source拼成reisen而guide写reizen；DE/CZ/IE/EE等URL独立open失败。未完成全量复核，所有数字主张需逐项对真实官方正文，不能把WebFetch产生的摘要当原始页面。

## 操作边界

所有修复由GLM完成，Codex独立复验。只改本批数据/校验器及本批报告；不触碰其他并行研究文件、不做git操作、不发布。临时fixtures、日志、正文全部外盘，不安装新依赖或写哈希。
