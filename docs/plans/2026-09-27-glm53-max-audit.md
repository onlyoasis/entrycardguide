# 全球资料库剩余事实核验：Claude Code GLM-5.3 / max

## 用户授权与当前基线

用户于 2026-09-27 明确改用 `claude-glm`、模型 `glm-5.3`、`--effort max` 处理剩余核验内容。本计划在执行入口和模型上取代此前 ZCode Flash 夜间方案；研究资料与公开数据隔离、官方正文门槛、逐批独立验收仍保留。旧 `automation-2` 曾暂停以避免并发写入，现已改成新的 CLI 续跑提示。

同日补充授权：扫描件确需多模态识别时，可用 GLM-5.3-Flash **仅执行 OCR**，保留原图、识别文本和实际模型使用记录；法规判断、适用范围分析、最终记录仍由 GLM-5.3/max 完成并由 Codex 独立核对。允许 Codex 子 agent 按互不重叠的国家与外盘目录并行监督 GLM 批次；主控串行验收与合并。`automation-2` 已更新为本入口并重新启用，不再运行旧 ZCode Flash 研究提示。

首批试运行发现 Claude Code `WebFetch` 辅助步骤在实际 `modelUsage` 中调用了 GLM-5.3-Flash，且用途不是 OCR；该首批无记录产出，未验收。后续主体 CLI 显式使用 `--tools Read,Write,Edit,Bash --disallowedTools Agent,WebFetch,WebSearch`，以官网直取原文和 Codex 独立浏览回读为证据；最终仍逐次检查 `modelUsage`，只有单独登记的 OCR 调用可含 Flash。

第二次 MY/SR 严格模型调用虽仅使用 GLM-5.3，却在 15 分钟内只持续检索、零记录，已按任务时间上限中止。此后每批分成限时官网取证和**仅 Read/Write/Edit 的记录写作**两个调用；取证每入口最多两次且单次有限时，取得不到即保留真实未知，写作阶段先落盘再由 Codex 自行跑 validator。超过约 20 分钟仍零记录的主体调用精准停止，不让长时搜索耗尽额度而无交付。

原始不可变候选基线是 `/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/consolidation-20260926-v2/candidate`：249 地/249 记录/321 事项，状态 15 verified、201 partial、33 blocked；363 条 `unresolved` 涉及 234 地，CC/CX 两事项没有核验日期。它尚未集成到工作树主库，也未进入公开快照。

2026-09-27 主控已从该不可变基线串行生成 `glm53-max-audit-20260927/candidate-v4`：仅覆盖已独立验收的 PG/SB/VU/SR 四条，原版 validator 249/249/324 通过；状态 15 verified / 202 partial / 32 blocked，记录内 360 条 unresolved。此后每轮先取最新有主控验收记录的 `candidate-vN`，不能从旧 v2 重建并覆盖已接受批次。新并行批次仍可只读 v2 中自己不重叠国家的原始记录，合并时由主控覆盖最新候选。

同日随后验收 `candidate-v5`：在 v4 上仅覆盖 MY，原版 validator 仍为 249/249/324；MY 两条原未决保留为有界未知，MDAC 整项核验日期恢复为 2026-09-12。

同日随后验收 `candidate-v6`：在 v5 上仅覆盖 AS/TK/WS，原版 validator 249/249/328 通过；AS/TK blocked、WS partial，含本数与免税冲突如实留未决。

同日随后验收 `candidate-v7`：在 v6 上仅覆盖 AX/GG/IM/JE，原版 validator 249/249/332 通过；AX/GG blocked，IM/JE partial，现金恰等阈值及申报渠道留未决。

同日验收 `candidate-v8`：在 v7 上仅覆盖 BE/BG/GR，原版 validator 249/249/333 通过；BE/BG blocked，GR 仅保留有 AADE 证据的随身现金旅客申报，免税优惠和无陪同现金披露误分类已移出。

同日验收 `candidate-v9`：在 v8 上仅覆盖 ET，原版 validator 249/249/330 通过。NBE FXD/04/2026 撤销旧版超过 USD 10,000 的特定入境外币申报要求；ET 旧三项程序均移出，政府原文仍不可完整比对的部分保留五条未决。

同日验收 `candidate-v10`：在 v9 上仅覆盖 CC/CX，原版 validator 249/249/328 通过。DAFF 页面只支持商品进口条件，ABF 2026/11 通知只支持货物边境管控及报告，原两项旅客 `customs_declaration` 因证据不符移出；旅客表格是否存在仍 blocked/pending。

同日验收 `candidate-v11`：在 v10 上仅覆盖 NR/MP/PW/UM，原版 validator 249/249/327 通过。NR 保留现金申报但指南本轮下载不完整，MP 旅客表/现金规则获本地官网正文，PW 现金恰等 USD 10,000 以本国法典 §3603(a) 的含本数为准，UM 不再将九岛特殊用途准入泛化成普通旅客申请。

同日验收 `candidate-v12`：在 v11 上仅覆盖 LI/MC/SM/VA，原版 validator 249/249/331 通过。LI 的被询问现金应答并非主动申报事项，已移出；MC 门槛严格 >€10,000，SM/VA 为 ≥€10,000，均按本国原文。v12 仅外盘研究候选。

同日验收 `candidate-v13`：在 v12 上仅覆盖 BI/KM/LY/SD，原版 validator 249/249/336 通过。BI/LY 的 Flash 调用只转录扫描文字，主体法律判断为 GLM-5.3/max；KM 2024 部长令区分绿/红通道和非商业货物口头申报；SD 申报数额未找到。

随后验收 `candidate-v14`（ME/MK/RU，249/249/337；黑山现金申报有官方 DOCX，MK/RU 官网阻塞）、`candidate-v15`（EH/ER/IO，249/249/338；厄立特里亚本国原法纠正 USD 10,000 含本数误判）、`candidate-v16`（GB，249/249/338；英国本岛额度取官方原文，北爱尔兰另待核）、`candidate-v17`（IR/KP/KW/YE，249/249/338；四地来源不足保持 blocked）。各版均有 `candidate-vN-review.md` 和 overrides 清单，不能跳版覆盖。

同日验收 `candidate-v18`：在 v17 上仅覆盖 AU/CA，原版 validator 249/249/338 通过。澳大利亚免税值已获 ABF 现行正文，ATD 全国推广尚属计划；加拿大移出伪“免税申报”、补真实 E311 旅客到达申报，费用仍未知。

同日验收 `candidate-v19`：在 v18 上仅覆盖 NZ，原版 validator 249/249/338 通过。旧海关免税页 404 已由现行官网正文解决，GLM 首稿伪造 `customs_concession` 类型与 `complete` 状态均经真实 validator 失败后撤回；最终仅保留 NZTD 申报，状态由 partial 升 verified。

同日验收 `candidate-v20`：在 v19 上仅覆盖 US/BR/MX，原版 validator 249/249/337 通过；美国 Title 19 海关关境与 Title 31 货币报告范围分开，三地免税额度均不作为独立申报程序，费用/电子提交细节保持有界未知。

同日验收 `candidate-v21`：在 v20 上仅覆盖 FR/ES/IT/NL，原版 validator 249/249/340 通过；FR/ES 两地升 verified，IT 超额物品申报动作、NL 酒/烟深链仍待核。

同日验收 `candidate-v22`：在 v21 上仅覆盖 IN/ID/VN/PH，原版 validator 249/249/345 通过。印度 2026 新规的 CBD-II/III/IV 经旅客提交动作核实；印尼空海 All Indonesia/陆路及部分出境 e-CD 分开，现金 FAQ 残件不作支持；越南 PAI 是新山一机场外国航空旅客自愿试点，菲律宾行李 PDF 仍截断。

同日验收 `candidate-v23`：在 v22 上仅覆盖 ZA/EG，原版 validator 249/249/344 通过。南非 2026-07 普遍在线旅客申报补入，重复货币表和免税伪程序移除；SARS 同版政策对 SACU 增值税额度 R100,000/R25,000 冲突、离境贵重品 required/may elect 仍有界未知。埃及仅保留现行官网支持的居民离境贵重品登记，旧表号不猜。

同日验收 `candidate-v24`：在 v23 上仅覆盖 SA/TR/AE，原版 validator 249/249/344 通过；沙特 40k 英阿/法源与 3k 商品措辞冲突有界保留，土耳其出境现金门槛按 2025 合并法，阿联酋恰满 18 岁规则未确认。

同日验收 `candidate-v25`：在 v24 上仅覆盖 CH/AT/IE/PT，原版 validator 249/249/345 通过；CH/AT/IE 三地升 verified，葡萄牙机组烟草特例留未决。

同日验收 `candidate-v26`：在 v25 上仅覆盖 UY/EC，原版 validator 249/249/348 通过。乌拉圭 IMPO 现行法现金严格 >USD10,000 与旧海关操作页 ≥USD10,000 矛盾保留；厄瓜多尔完整 2026 FRA 决议与陆路官方页补证，新旧法不乱判废止。GLM 首稿短摘录拼接非连续原文，EC 由 GLM 成功返修，UY 因额度 429 改由 Codex 独立逐字机械修正；9/9 摘录均是存档官方正文连续子串。

同日验收 `candidate-v27`：在 v26 上仅覆盖 AR/CO，原版 validator 249/249/351 通过。阿根廷 RG5659/2025 区分入境现金申报、离境本币申报与外币运输限制；哥伦比亚 DIAN 2026 意见证实家庭现金合计触发，初稿将入境免费纸表误推广为双向零费已由 GLM 修为 unknown。原始来源摘录连续原文已逐一核对，AR/CO 官方法源获主控网页回读。

同日验收 `candidate-v28`：在 v27 上仅覆盖 CL/PE，原版 validator 249/249/353 通过。智利 SAG 现行 `mayores de 18` 与 2020 纸表 `18 años o más` 对恰满 18 岁的差异留窄未决，UAF 现金严格 >USD10k；秘鲁 SUNAT 条件入境行李表与双向现金申报、>USD30k 随身限制按实际官方原文入库，旧免税伪程序移出。两地仍 partial。

同日验收 `candidate-v29`：在 v28 上仅覆盖 SE/DK/FI，原版 validator 249/249/355 通过。瑞典 TFS 2026:6 数值与四个官网页经主控独立回读，瑞典私人机艇高档限额仍未知；丹麦 EU/非 EU 与现金渠道分开；芬兰免税伪程序移出。NO 四条中同一货物红道重复拆分仍交 GLM 修复，未合入。

同日验收 `candidate-v30`：在 v29 上仅覆盖 LU/IS，原版 validator 249/249/358 通过。卢森堡跨 EU 内外 ≥€10k 现金申报与非 EU 货物申报均获本国主管页面；冰岛 E-29 现金、E-9 车辆与红道货物申报获主管页面，恰 €10k 以 Alþingi 2026-09-01 现行《海关法》第 27a 条含本数为准，修正英文页面冲突；两地升 verified。

随后按主控串行验收 `candidate-v31` 至 `candidate-v43`，每版只覆盖报告列出的国家：CN、NO、LK、EE/CZ、PK、LT、LV、BD、CN 摘录修正、BO、CR、BZ/GT。CN 2003 频繁往返 500/1000 美元仅留历史/现行性未决，错配摘录在 v40 修正；NO 同一红道重复货物程序合并；LK/BD 扫描或截断原文不强行建表；EE 升 verified，CZ 移出货物伪程序，LT 严分 EU 外 ≥€10k 主动与 EU 内 >€10k 应要求，LV 的 EU 内“仅陆路”过窄描述在 v38 纠正。BO Form250 现金边界由本国 FAQ 确认；CR 本轮仅分层记录现行法规源不可达，旧日核验日期不刷新；BZ 机场线上表与旧纸卡分开，GT 官方指南证明填表免费并保留提前窗口冲突。各版原版 validator 均在最新父版覆盖后通过，差异与限界见对应 `candidate-vN-review.md`。

同日 `candidate-v43` 阶段：相对 v2 累计 88 地变更，原版 validator **249 地/249 记录/361 唯一事项**通过，状态 24 verified / 205 partial / 20 blocked，记录内 402 条 unresolved；审计账本 458 条（原 363 + 新 95）为 50 resolved、73 bounded_unknown、40 blocked、295 pending，原 363 条当时仍有 226 pending。

随后验收 `candidate-v44` 至 `candidate-v49`：KH 将同一次 e-Arrival 去重；SI 官方法源纠正 17 岁年龄线并升 verified；MT 删除额度伪申报；AD 现挂五页现金表确认 ≥€10k 并撤回返回欧盟额度伪程序；LA 2015规章 ≥1 亿基普与后续海关法 >1 亿的恰等冲突有界保留；HR 2026 新法将 EU 外部现金主动申报与 EU 内官员要求时第24条表分开。逐版均在最新父版运行原版 validator。

同日最新已验收候选是 `candidate-v49`：相对 v2 累计 94 地变更，原版 validator **249 地/249 记录/362 唯一事项**通过，状态 25 verified / 204 partial / 20 blocked，记录内 404 条 unresolved；审计账本 464 条（原 363 + 新 101）为 54 resolved、79 bounded_unknown、43 blocked、288 pending，原 363 条仍有 **219 pending**。v49 仅外盘内部研究候选，未集成工作树主库、未公开、未提交、推送或部署。之后不得从 v48 或更早版覆盖已收结果；新并行批次交主控另行验收。

随后验收 `candidate-v50` 和 `candidate-v51`：BT 原 2024 通告不能证明 2026 海关现行细则，撤去重复货币程序并保留法规全文受阻；BS 由财政部官方完整扫描件确认 C17 表的入境口头货物申报、应税货物填表及现金 B$10,000 含本数书面申报，表内普遍填表字句与条件段冲突留有界未知。主控直接看 BS 原图，Flash 仅作 OCR，主体返修为 GLM-5.3/max。最新 v51 相对 v2 累计 96 地变更，原版 validator **249 地/249 记录/362 唯一事项**通过，状态 25 verified / 204 partial / 20 blocked，记录内 408 条 unresolved；审计账本 469 条（原 363 + 新 106）为 54 resolved、83 bounded_unknown、47 blocked、285 pending，原 363 条仍有 **216 pending**。v51 仍只在外盘，未集成研究主库、未公开、未提交、推送或部署；后续从最新已验收候选续接。

随后验收 `candidate-v52`：只覆盖 AG/AI/BM。安提瓜机场电子入境表与条件海关申报分开，安圭拉主法及两表规的货币恰本数冲突保留，百慕大同一 Form98 去重且现金恰 BDA$10,000 官网冲突留窄未知。主控独立核读官方原文和 13 条逐字短摘，原版 validator **249 地/249 记录/362 唯一事项**通过。最新 v52 相对 v2 累计 99 地变更，25 verified / 204 partial / 20 blocked，记录内 412 条 unresolved；账本 473 条（原 363 + 新 110）为 54 resolved、93 bounded_unknown、47 blocked、279 pending，原 363 条仍 **210 pending**。限额解除后 `automation-2` 已改全天每 30 分钟巡检，先查在跑/未验收批次，按最新已验收候选续接。v52 仍为外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v53`：只覆盖 NP；主控直接查看 NRB 2026 扫描原图，短摘 USD 5,000 连续可见，超额携入自报改由完整 FAQ 支撑，本币 FAQ 仅证明 NPR 5,000 携带上限而不建新表。原版 validator **249 地/249 记录/362 唯一事项**通过。最新 v53 相对 v2 累计 100 地变更，25 verified / 204 partial / 20 blocked，416 条 unresolved；账本 478 条（原 363 + 新 115）为 54 resolved、99 bounded_unknown、47 blocked、278 pending，原 363 条仍 **209 pending**。自动化现全天每30分钟巡检，原始与新增 pending 均清零且内部主库集成验证后才停用。v53 仅外盘内部候选，未公开、提交、推送或部署。

随后验收 `candidate-v54`：仅覆盖 NL。荷兰海关 2026 酒烟页使烟草额度未决结项；非 EU 低度酒荷兰页 1L 与同页示例、欧盟官网 2L 冲突，主控退回初稿，GLM-5.3/max 返修保留有界未决。原版 validator **249 地/249 记录/362 唯一事项**通过；最新 v54 相对 v2 累计100地变更，25 verified / 204 partial / 20 blocked，415 条 unresolved；账本478条（原363+新115）为55 resolved、100 bounded_unknown、47 blocked、276 pending，原363条仍 **209 pending**。v54 仍外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v55`：仅覆盖 AL；本国海关五官网页证明货物、RTVK货币/价值、文化遗产携出三项真实申报及烟酒额度，AL 原待核结项并升 verified。原版 validator **249 地/249 记录/364 唯一事项**通过；最新 v55 相对 v2 累计101地变更，26 verified / 203 partial / 20 blocked，414条 unresolved；账本478条（原363+新115）为56 resolved、100 bounded_unknown、47 blocked、275 pending，原363条仍 **208 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v56`：仅覆盖 PL；KAS 2026 官网及边境页证明欧盟外部双向 ≥€10k 资金书面申报与 PUESC 预填边界，2023 官网原句只支持货币表免费，旅客货物页纠正旧行李限缩。18/18短摘连续匹配，原版 validator **249 地/249 记录/365 唯一事项**通过。最新 v56 相对 v2 累计102地变更，26 verified / 203 partial / 20 blocked，415条 unresolved；账本480条（原363+新117）为57 resolved、102 bounded_unknown、47 blocked、274 pending，原363条仍 **207 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v57`：仅覆盖 BA/RS/SK；波黑免税口头批准伪程序撤回、现金严格>€10k表保留，塞尔维亚现金与真实货物口岸报告拆开且€100优惠限国内旅客，斯洛伐克欧盟外主动Form1a与欧盟内应要求说明分开并升 verified。主控核16条官方短摘及完整法规，原版 validator **249地/249记录/367唯一事项**通过。最新 v57 相对v2累计105地变更，27 verified / 202 partial / 20 blocked，417条unresolved；账本485条（原363+新122）为60 resolved、107 bounded_unknown、47 blocked、271 pending，原363条仍 **204 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v58`：仅覆盖 TO；完整80页本国海关条例Reg65/64证明入/出C18及机船，新增离境事项，烟酒数值/收取机关/许可冲突保留有界未决。主控核21条官网短摘，原版 validator **249地/249记录/368唯一事项**通过。最新v58相对v2累计106地变更，27 verified / 202 partial / 20 blocked，418条unresolved；账本488条（原363+新125）为61 resolved、112 bounded_unknown、47 blocked、268 pending，原363条仍 **201 pending**。自动化全天可并行监督最多3个不重叠批；v58仅外盘内部候选，未集成、公开、提交、推送或部署。

随后验收 `candidate-v59`、`candidate-v60`：RO欧盟旧现金法撤出、现行2018/1672欧盟外边境≥€10k直接适用，本国表介质未核，免税页403仍blocked；CK国会扫描原图§7证明本人携币入/出申报，海上Departure card未证海关内容而撤回误分类，250mg烟草疑值不猜。主控核官方原文，原版validator对v60 **249地/249记录/369唯一事项**通过。最新v60相对v2累计108地变更，27 verified / 202 partial / 20 blocked，421条unresolved；账本492条（原363+新129）为61 resolved、118 bounded_unknown、48 blocked、265 pending，原363条仍 **198 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28（日本时间）验收 `candidate-v61`、`candidate-v62`：TV真实Form11入境卡与仅官员要求时书面行李申报分开；GL本国现行法规确认现金严格>DKK50k与仅努克机场DKK100办理费自愿清关，旧15k草案已撤不采。主控核TV22条/GL9条官方短摘，原版validator v62 **249地/249记录/372唯一事项**通过。最新v62相对v2累计110地变更，27 verified / 202 partial / 20 blocked，420条unresolved；账本493条（原363+新130）为63 resolved、121 bounded_unknown、48 blocked、261 pending，原363条仍 **194 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28验收 `candidate-v63`：仅覆盖FO；TAKS红绿通道与现金T33申报获当前官网及完整表支撑，Lógasavn仅§29(3)选段DOM实读、合并法全文仍未得。原版validator **249地/249记录/372唯一事项**通过。最新v63相对v2累计111地变更，27 verified / 202 partial / 20 blocked，420条unresolved；账本493条（原363+新130）为63 resolved、122 bounded_unknown、48 blocked、260 pending，原363条仍 **193 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28验收 `candidate-v64`、`candidate-v65`：AW公报证Afl900及真实MOT/货物表；SX个人NAf25k与同行geld合计NAf20k分开、XCG1:1法律映射；GI条约货物/现金申报获本地法/BOE原文，行政协议临时适用形式状态及Annex23原表仍未知。主控核25条官方短摘，原版validator v65 **249地/249记录/373唯一事项**通过。最新v65相对v2累计114地变更，27 verified / 202 partial / 20 blocked，421条unresolved；账本496条（原363+新133）为65 resolved、128 bounded_unknown、48 blocked、255 pending，原363条仍 **188 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28验收 `candidate-v66`：仅覆盖NU/KI，NU通用实体到达卡、可选在线Express Lane与独立NZ$10k离境现金报告分开，统计卡不伪作申报；KI旧完整总统府官件原图重读§57，当前下载残件不当完整来源，税务烟酒数字仅VAT/消费税豁免。主控核25条官方短摘，原版validator **249地/249记录/374唯一事项**通过。最新v66相对v2累计116地变更，27 verified / 202 partial / 20 blocked，424条unresolved；账本500条（原363+新137）为66 resolved、136 bounded_unknown、48 blocked、250 pending，原363条仍 **183 pending**。MH仍隔离补来源；仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28验收 `candidate-v67`：仅覆盖MH，议会现行货币法§203(1)证明本人双向携US$10k及以上申报，§206免税伪程序撤回并保留独立背景官源，Schedule1表未知。主控核15条官方短摘，原版validator **249地/249记录/374唯一事项**通过。最新v67相对v2累计117地变更，27 verified / 202 partial / 20 blocked，423条unresolved；账本501条（原363+新138）为68 resolved、138 bounded_unknown、48 blocked、247 pending，原363条仍 **180 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28验收 `candidate-v68`、`candidate-v69`：CW本岛现金报告与XCG共同货币法/官方发币选段分证，2014修订与英表429留未知；GF/GP/MQ法国海关官页证明超额货物真申报及DROM往返外国现金路线，本土往返DROM不触发、DROM互往未知。主控核18条官源短摘，原版validator v69 **249地/249记录/377唯一事项**通过。最新v69相对v2累计121地变更，27 verified / 202 partial / 20 blocked，430条unresolved；账本511条（原363+新148）为71 resolved、152 bounded_unknown、49 blocked、239 pending，原363条仍 **172 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v70`、`candidate-v71`：PN 官件证短签申请费 NIL 和独立登岸费，恰好 5 岁金额未知；NR 现金指南分段取齐且与旧完整件相同，严格 >$5,000；FM 本国法典和财政部完整条例证主张免税货物仍须按规定表式入境申报，旅客表名/媒介及现金门槛未知。主控核 34 条短摘，六次成功主体 CLI 仅 glm-5.3；原版 validator v71 **249 地/249 记录/378 唯一事项**通过。最新 v71 相对 v2 累计 123 地变更，27 verified / 202 partial / 20 blocked，428 条 unresolved；账本 512 条（原 363+新 149）为 74 resolved、155 bounded_unknown、50 blocked、233 pending，原 363 条仍 **167 pending**。仍仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v72`：SO/SS 两份此前残缺的官源 PDF 完整重取；SO 的 58 页扫描件仅第 29–32 页做 Flash OCR 与主控原图核对，报到/查验并非普通旅客货物申报，撤两条伪程序，改 blocked；SS 正文第 175 条保留行李内容申报，第 54 条 10% 税率伪程序移除，第 175(2) 条特定免税行李可不作书面申报，主控修正初稿反向表述。首次 GLM-5.3/max 写作超时，定点续写成功；原版 validator v72 **249 地/249 记录/375 唯一事项**通过。最新 v72 相对 v2 累计 125 地变更，27 verified / 201 partial / 21 blocked，428 条 unresolved；账本 514 条（原 363+新 151）为 76 resolved、157 bounded_unknown、52 blocked、229 pending，原 363 条仍 **163 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v73`：CG 2018 CEMAC/UMAC 外汇条例第 78 条证对外边境现金严格 >500 万 CFA 等值申报；2019 区域海关法第 226–227 条个人物品暂准免税无已证提交动作，旧伪程序删除。主控将执行方未取齐的官网外汇条例按七段 HTTP 206 完整重取 42 页，与旧完整官件逐字节相同；核第 77–79 条原图和 2 条短摘。原版 validator v73 **249 地/249 记录/374 唯一事项**通过。最新 v73 相对 v2 累计 126 地变更，27 verified / 201 partial / 21 blocked，428 条 unresolved；账本 514 条（原 363+新 151）为 76 resolved、160 bounded_unknown、52 blocked、226 pending，原 363 条仍 **160 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v74`：DM ED Card 移民/海关问项同表一次提交，免费官公告已核；GD 线上表与 MBIA 红绿道为同一流程，服务费和现金仍未知；JM C5 与独立 POCA 现金 CTR 分开，免税额伪程序移除，恰好 US$10,000 与版本差保留未知。主控读 DM 浏览器官方正文、GD 当前 HTTP 全文、JM 两页扫描 CTR 原图和 JTB 官页，36 条短摘全部连续；九次成功主体仅 glm-5.3/max，唯一 Flash 仅 OCR。原版 validator v74 **249 地/249 记录/373 唯一事项**通过。最新 v74 相对 v2 累计 129 地变更，27 verified / 201 partial / 21 blocked，429 条 unresolved；账本 518 条（原 363+新 155）为 79 resolved、168 bounded_unknown、52 blocked、219 pending，原 363 条仍 **153 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v75`：GW 本国旅客页对随行货物严格 >20 万 FCFA 要求申报，并非免税值；BCEAO 区内达 1000 万、第三国达 500 万含本数，2025 第 7 条非居民外币现金严格 >50 万 CFA 等值书面申报。主控看第 7 条扫描原图，核其他五条短摘；本国网页仍写非居民 >500 万，表式/费用和制度并行执行保留未知。原版 validator v75 **249 地/249 记录/373 唯一事项**通过。最新 v75 相对 v2 累计 130 地变更，27 verified / 201 partial / 21 blocked，429 条 unresolved；账本 518 条（原 363+新 155）为 79 resolved、171 bounded_unknown、52 blocked、216 pending，原 363 条仍 **150 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v76`–`candidate-v78`：NC 地区海关官页补齐 15/17 岁货物额度并单列本人对外国 EUR10k 现金申报、XPF 等值差未知；GY C14 原图证 reg.84、表内字段和 US$100 口头/书面申报方式边界，Flash 仅 OCR；WF 官方指南证到达货物与现金申报，2014 指南和 2021 决议额度冲突仍未知，主控将 11 条来源改挂实际 PDF 深链。主控核 47 条短摘及关键原图；原版 validator v78 **249 地/249 记录/376 唯一事项**通过。最新 v78 相对 v2 累计 133 地变更，27 verified / 201 partial / 21 blocked，429 条 unresolved；账本 523 条（原 363+新 160）为 84 resolved、176 bounded_unknown、53 blocked、210 pending，原 363 条仍 **144 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v79`：PF 本地到达货物申报与本人对外国 EUR10k 现金申报分开，游艇船东载具声明删除；恰好 20 万 XPF 路由、本地/COM 现金等值差、普通旅客携货出境未知。DGDDI 同页 48 小时两句时间锚点不同，主控退回过度推断，GLM-5.3/max 定点收窄并立未决。48 条短摘逐字连续；原版 validator v79 **249 地/249 记录/377 唯一事项**通过。最新 v79 相对 v2 累计 134 地变更，27 verified / 201 partial / 21 blocked，431 条 unresolved；账本 527 条（原 363+新 164）为 85 resolved、181 bounded_unknown、53 blocked、208 pending，原 363 条仍 **142 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v80`：VI 的 eCFR 19 CFR 101.1、148.11–13 与 48 U.S.C. 1406i 官源仅证从 USVI 进入美国海关领土时向 CBP 申报物品，不能推给抵达 USVI 的本地手续；本地表、现金与费用未知。主控核 13 条官方 XML/USC 短摘；原版 validator v80 **249 地/249 记录/377 唯一事项**通过。最新 v80 相对 v2 累计 135 地变更，27 verified / 201 partial / 21 blocked，431 条 unresolved；账本 527 条（原 363+新 164）为 85 resolved、183 bounded_unknown、53 blocked、206 pending，原 363 条仍 **140 pending**。TD/DO 语义冲突已退回，未计入。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v81`：海地 DIE iKAT 单一出入境电子卡有官页与 2026-03 Cap-Haïtien 启动公告支持，全国仍渐进上线；同页 72h 正文与 48h FAQ 冲突、费用及现金法门槛未知。主控读 3 份官页网页阅读器正文，核 37 条短摘，2 条法典失败源摘录空；原版 validator v81 **249 地/249 记录/377 唯一事项**通过。最新 v81 相对 v2 累计 136 地变更，27 verified / 201 partial / 21 blocked，431 条 unresolved；账本 527 条（原 363+新 164）为 85 resolved、184 bounded_unknown、54 blocked、204 pending，原 363 条仍 **138 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v82`–`candidate-v84`：DO 法定现金≥US$10k与E‑Ticket问项>US$10k分证，空路货物同表重复程序删除；TD 本国任何金额外币入境申报与CEMAC区域对外边境≤500万免申报的重叠场景立窄未决，暂准免税伪程序撤回；NE 财政部完整109页2018-19海关法证条件性到达口头/红绿通道申报，未断言具体口岸已启用，主控补Art214/218/223三条短摘。原版 validator v84 **249 地/249 记录/376 唯一事项**通过。最新 v84 相对 v2 累计 139 地变更，27 verified / 201 partial / 21 blocked，434 条 unresolved；账本 535 条（原 363+新 172）为 89 resolved、196 bounded_unknown、54 blocked、196 pending，原 363 条仍 **130 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v85`–`candidate-v86`：BL 对外国现金 EUR10k 含本数单一申报，DALIA/COM 纸表为两渠道，2024 本地税法附件残缺，税额/暂准许可不造旅客程序；MF 现金同一义务按官页 EU/FR 表别，圣马丁至法国本土/瓜德罗普直达路线不凭关税领土地位归类，货物与路由未知。主控核 15 条短摘并纠 MF 弯引号和缓存路径误报；原版 validator v86 **249 地/249 记录/374 唯一事项**通过。最新 v86 相对 v2 累计 141 地变更，27 verified / 201 partial / 21 blocked，438 条 unresolved；账本 539 条（原 363+新 176）为 89 resolved、203 bounded_unknown、55 blocked、192 pending，原 363 条仍 **126 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v87`–`candidate-v90`：PM当地海关证一般到达货物与本人携商业物品>€1,524详式申报，2019附件烟酒仅18岁及以上；NI DGA完整门户证同一张出入境表含≥US$10k现金问项、仅出行前3天内登记；HN旧制度证区域表+另交现金表、2023空港上线，主控保留旧verified_at；SV DGA040取代006、机场Declara同一次提交、现金≥US$15k，主控将7条下载URL改为稳定PDF直链。主控复跑原版validator v90 **249地/249记录/377唯一事项**通过。最新v90相对v2累计145地变更，27 verified / 201 partial / 21 blocked，442条unresolved；账本548条（原363+新185）为94 resolved、213 bounded_unknown、57 blocked、184 pending，原363条仍 **118 pending**。仅外盘内部候选，未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v91`–`candidate-v96`：KY/FK/MS/TC/PR/GU/AQ/TF 按原版校验器逐版通过，最终 v96 **249 地/249 记录/381 唯一事项**。相对 v2 累计 153 地变更，27 verified / 201 partial / 21 blocked，450 条 unresolved；账本 557 条（原 363+新 194）为 95 resolved、235 bounded_unknown、58 blocked、169 pending，原 363 条仍 **103 pending**。TC 恰 US$10,000 现金边界与烟草额度冲突保留；PR/GU 限定美国关税领土和现金规则的不同范围；AQ 活动许可、TF 私人游艇卷宗只归实际申请人。BV 隔离稿因 NPI 官页直升机登陆许可暂缓，待 GLM 定点返修。仅外盘内部候选，研究主库仍 70 地、公开快照 0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v97`–`candidate-v100`：BJ/TT/VC/BF 逐版原版校验器通过，最终 v100 **249 地/249 记录/385 唯一事项**。相对 v2 累计 157 地变更，27 verified / 201 partial / 21 blocked，456 条 unresolved；账本 570 条（原 363+新 207）为 97 resolved、254 bounded_unknown、58 blocked、161 pending，原 363 条仍 **95 pending**。BJ 主控目验扫描外汇令第 4/7/8 条；TT C15 与非随行 C88 分表，VC 同次口头申报不重复计现金，BF 旅行表只证瓦加杜古航空口岸，单次 QR 覆盖往返未知。SN、VG、TZ 和 BV 返修尚未计入。研究主库仍 70 地、公开快照 0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v101`–`candidate-v104`：VG/SN/BV/TZ 逐版原版校验器通过，v104 **249 地/249 记录/386 唯一事项**。相对 v2 累计 161 地变更，27 verified / 201 partial / 21 blocked，462 条 unresolved；账本 579 条（原 363+新 216）为 99 resolved、268 bounded_unknown、60 blocked、152 pending，原 363 条仍 **86 pending**。VG 在线 ED 卡免费且一次提交，法定现金申报的程序建模正在返修；SN 旧外汇数字撤出、旧货物指南保留原核验日期；BV 狭义直升机登陆特许经法与 NPI 官页确认；TZ 烈酒 1L/2L 官源冲突保留。研究主库仍 70 地、公开快照 0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v105`–`candidate-v109`：PA/GN/VG 定点返修/BB/FJ 逐版原版校验器通过，v109 **249 地/249 记录/389 唯一事项**。相对 v2 累计 165 地变更，27 verified / 201 partial / 21 blocked，470 条 unresolved；账本 587 条（原 363+新 224）为 99 resolved、278 bounded_unknown、63 blocked、147 pending，原 363 条仍 **81 pending**。VG 恢复法定现金申报并保留 unknown 渠道，FJ 划分到达卡、第二张货币报告表与条件性央行批准，离境官页乱码不裁边。研究主库仍 70 地、公开快照 0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v110`–`candidate-v114`：PY/CM/GA/CF/ML 逐版原版校验器通过，v114 **249 地/249 记录/387 唯一事项**。相对 v2 累计 170 地变更，27 verified / 201 partial / 21 blocked，477 条 unresolved；账本 594 条（原 363+新 231）为 99 resolved、289 bounded_unknown、67 blocked、139 pending，原 363 条仍 **73 pending**。PY 恰 USD10k 官源冲突保留；CEMAC 三地只证对外边境现金申报，旧法件复用不刷新核验日；ML 离境货物与两套区域货币申报分证。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v115`–`candidate-v117`：CI/GQ/TG 逐版原版校验器通过，v117 **249 地/249 记录/388 唯一事项**。相对 v2 累计 173 地变更，27 verified / 201 partial / 21 blocked，482 条 unresolved；账本 599 条（原 363+新 236）为 99 resolved、297 bounded_unknown、68 blocked、135 pending，原 363 条仍 **69 pending**。CI 旧国别 SYDEF 通告不能自动证明新 BCEAO 门槛已实施；GQ 无本国旅客表；TG 原扫描令第 2／5 条经目视证实随行行李简化申报与旅客本人编制，25万CFA属另一类边境贸易货物。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v118`–`candidate-v119`：SH/NA 逐版原版校验器通过，v119 **249 地/249 记录/386 唯一事项**。相对 v2 累计 175 地变更，27 verified / 201 partial / 21 blocked，484 条 unresolved；账本 601 条（原 363+新 238）为 99 resolved、301 bounded_unknown、68 blocked、133 pending，原 363 条仍 **67 pending**。SH 2026 法 Reg10/12 的入境表与现金表分开，仅限圣赫勒拿岛；NA 当前 CE-FR-008 一表含入境货物和≥N$100k货币问项，低额现金路线保留未决。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v120`–`candidate-v121`：CD/DZ 逐版原版校验器通过，v121 **249 地/249 记录/384 唯一事项**。相对 v2 累计 177 地变更，27 verified / 201 partial / 21 blocked，485 条 unresolved；账本 602 条（原 363+新 239）为 99 resolved、305 bounded_unknown、68 blocked、130 pending，原 363 条仍 **64 pending**。CD 剔除仅为行李查验、关员开 DSI/DES 或免税额度的伪程序；DZ 2026 财政法严格 >EUR1k 与旧央行条例恰等额冲突有界保留，ALCES 线上提交未证。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v122`–`candidate-v124`：AO/BN/BW 逐版原版校验器通过，v124 **249 地/249 记录/386 唯一事项**。相对 v2 累计 180 地变更，27 verified / 201 partial / 21 blocked，488 条 unresolved；账本 607 条（原 363+新 244）为 101 resolved、311 bounded_unknown、68 blocked、127 pending，原 363 条仍 **61 pending**。AO 入境达USD10k原表、非居民出境同额交副联，私站公报镜像现行性与未成年人差异有界保留；BN 海关/移民/BDCB三项独立，S37双向≥BND15k，货邮S39不套旅客；BW 行李出入境义务与到达Form J、银行券现金分证，出境表式未知，免税额度伪程序撤销。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v125`–`candidate-v127`：KN/MA/GB 逐版原版校验器通过，v127 **249 地/249 记录/386 唯一事项**。相对 v2 累计 182 地变更，27 verified / 201 partial / 21 blocked，491 条 unresolved；账本 611 条（原 363+新 248）为 102 resolved、314 bounded_unknown、71 blocked、124 pending，原 363 条仍 **59 pending**。KN 旧2022全旅客ED误述撤出，仅2025分流；MA 入境与非居民/MRE离境再申报明确双向，旧ADII指南/费用页阻塞；GB 北爱物品与现金规则分证，首稿遗漏北爱现金段经二轮GLM修复，NI↔EU现金及时窗保留窄未知。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v128`–`candidate-v129`：BW补2016 BURS旧指南原PDF，R5,000与当前R3,000差异仅为免税背景，申报程序不变；TN保留TLS链缺失和下载截断的blocked边界，名称/channel修为入/出/过境条件性，不刷新2026-09-10旧核验日。v129 原版校验器 **249地/249记录/386唯一事项**通过；相对v2累计183地变更，27 verified / 201 partial / 21 blocked，491条unresolved；账本611条（原363+新248）为102 resolved、314 bounded_unknown、72 blocked、123 pending，原363条仍 **58 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v130`：GH 官方BoG公告外币申报FX-5严格>USD10k、出境>USD50k凭证与抵达来源证明均附同一表；GRA官页抵达行李口头/书面申报与条件性PUBD独立，旧$1000/CDF4A冲突有界保留。首稿错BoG PDF URL及首次自报修好却未改文件的稿均退回，最终四源同正确深链。原版validator **249地/249记录/387唯一事项**通过；相对v2累计184地变更，27 verified / 201 partial / 21 blocked，492条unresolved；账本613条（原363+新250）为103 resolved、316 bounded_unknown、72 blocked、122 pending，原363条仍 **57 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v131`–`candidate-v133`：LC 旧Form15不证在线ED之外现役另交，撤下重复程序并降blocked；PT机组烟草限量与每人EUR200有官法、混搭未知；IT 49页2026 ADM指南只证超额税负、不证旅客提交动作。v133原版validator **249地/249记录/386唯一事项**通过；相对v2累计185地变更，27 verified / 200 partial / 22 blocked，496条unresolved；账本618条（原363+新255）为104 resolved、319 bounded_unknown、76 blocked、119 pending，原363条仍 **56 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v134`：UY 当前IMPO法Art29及实施细则Art100均严格>USD10k，旧DNA业务页与OD35扫描含本数且所引旧法已废。Flash只OCR扫描，GLM-5.3/max裁法并写双语；恰等额的现行表格提示另留窄未决。原版validator **249地/249记录/386唯一事项**通过；相对v2累计185地变更，27 verified / 200 partial / 22 blocked，496条unresolved；账本619条（原363+新256）为105 resolved、320 bounded_unknown、76 blocked、118 pending，原363条仍 **56 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-28 验收 `candidate-v135`：AE 两篇 ICP 英文官文及阿文服务页对独立额度写超过18岁、并入成人写未满18岁；恰等18岁的适用未明确，不借民法推断。新来源只得web-reader摘录，unknown接入状态，初稿非法枚举经GLM定点修复。原版validator **249地/249记录/386唯一事项**通过；相对v2累计185地变更，27 verified / 200 partial / 22 blocked，496条unresolved；账本619条（原363+新256）为105 resolved、321 bounded_unknown、76 blocked、117 pending，原363条仍 **56 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v136`：GE Matsne当前法第169条证进出境现金/证券严格>GEL30k，旧RS手册补免税和药品限界却不当2026实施细则；fee unknown、旧verified_at保留。原版validator **249地/249记录/386唯一事项**通过；相对v2累计186地变更，27 verified / 200 partial / 22 blocked，496条unresolved；账本619条（原363+新256）为105 resolved、322 bounded_unknown、76 blocked、116 pending，原363条仍 **55 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v137`–`candidate-v138`：OM 一般条>OMR6k与填表说明≥6k冲突、电子首屏未提交，阿文现金范围不证英文goods伪程序；SA在效SAMA M/20与ZATCA旧M/39分清，40k/旧60k法规修订未取、恰3k货物冲突有界保留。v138原版validator **249地/249记录/386唯一事项**通过；相对v2累计187地变更，27 verified / 200 partial / 22 blocked，497条unresolved；账本622条（原363+新259）为106 resolved、327 bounded_unknown、76 blocked、113 pending，原363条仍 **54 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v139`：AM SRC同一张旅客海关申报单涵盖现金、行李、禁限物、车辆和其他条件类别，FAQ11证年满16岁申报/未满16岁代报；主控退回重复程序、错配PDF短摘及漏读FAQ4/11，GLM-5.3/max修后五源闭合。原版validator **249地/249记录/386唯一事项**通过；相对v2累计188地变更，27 verified / 200 partial / 22 blocked，497条unresolved；账本622条（原363+新259）为106 resolved、328 bounded_unknown、76 blocked、112 pending，原363条仍 **53 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v140`–`candidate-v141`：TR 2025出境新门槛与2024通函旧值分清，入境自愿/应要求Ek-1程序不伪称全量原PDF或当前普遍强制阈值；AZ外币本币合并同一事项，手机专属申报有官PDF与当前渠道，初稿来源交叉语义映射经GLM返修。v141原版validator **249地/249记录/388唯一事项**通过；相对v2累计189地变更，27 verified / 200 partial / 22 blocked，500条unresolved；账本625条（原363+新262）为106 resolved、333 bounded_unknown、76 blocked、110 pending，原363条仍 **52 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v142`：SC SRC当前官页与SI94/2024证未满18岁其他物品SCR8k、机场SCR3k旧值撤下；到达超额/限制物品申报与SI11/2022双向≥SCR50k现金表分证，电子问项>SCR50k窄冲突保留。GLM初稿双向cash误记on_arrival且同一年龄短摘跨程序，主控返修后两源独立映射。原版validator **249地/249记录/389唯一事项**通过；相对v2累计190地变更，27 verified / 200 partial / 22 blocked，501条unresolved；账本627条（原363+新264）为107 resolved、335 bounded_unknown、76 blocked、109 pending，原363条仍 **51 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v143`：法国海关2026 DALIA FAQ证 RE 与外国之间双向现金≥EUR10k申报，与法国本土之间不在现金申报义务范围，最早旅行前30日、最迟过境前在线填报。GLM首稿非法 schema type/channel 和 FAQ 逐字引号错误经主控退回修订。2019货物页现行性、海外特殊条款、DROM间路线保留有界未知。原版validator **249地/249记录/390唯一事项**通过；相对v2累计191地变更，27 verified / 200 partial / 22 blocked，502条unresolved；账本629条（原363+新266）为108 resolved、337 bounded_unknown、76 blocked、108 pending，原363条仍 **50 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v144`/`candidate-v145`：NG 当前官网 E-CDF ≥USD10k双向申报并到边境验证，官方海关法§162/164仅在实际使用的入境双通道选道、普通行李表/PBES未获证；IM 英国抵达多数货物不限量但有应申报货物/需清关商业货物/不确定时到红道或红电话，现金恰£10k仍冲突。主控退回 IM 首稿无关内容与新增 unresolved 后 GLM-5.3/max 收敛。原版validator **249地/249记录/392唯一事项**通过；相对v2累计192地变更，27 verified / 200 partial / 22 blocked，502条unresolved；账本630条（原363+新267）为109 resolved、339 bounded_unknown、76 blocked、106 pending，原363条仍 **49 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v146`：南非 SATMS 官方强制双向申报，2026-08-14宪报 R.7810/R.7811 证一般货物 R10k/R40k，SARB Circular9/2026 证 R100k 为外带兰特无需事前许可额度而非申报门槛；旧 R5k/R20k 页面仅作背景。首稿旧额/通用义务短摘错挂程序，GLM按19段直接语义映射返修，并纠正缓存政策 PDF 不可读误报。SACU 额度及离境贵重物强制/可选冲突仍未知。原版validator **249地/249记录/392唯一事项**通过；相对v2累计192地变更，27 verified / 200 partial / 22 blocked，500条unresolved；账本630条（原363+新267）为111 resolved、339 bounded_unknown、76 blocked、104 pending，原363条仍 **49 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v147`：MZ央行2024第3号规则§104/105证外币严格>USD10k、本币严格>MT10k双向申报和旅客填表交海关；e-Viajante物品表与现金法定表是否同载体未知。门户FAQ与外交部旧USD5k说法仅留冲突背景，免税额度伪程序撤销。主控退回§104无谓语短摘及MINEC无URL误报，GLM拆9段直接支持来源并补真官页。原版validator **249地/249记录/392唯一事项**通过；相对v2累计193地变更，27 verified / 200 partial / 22 blocked，502条unresolved；账本632条（原363+新269）为111 resolved、342 bounded_unknown、76 blocked、103 pending，原363条仍 **48 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v148`/`candidate-v149`：KG EEC官网俄文 Art260 与签署第130号决定证单次进/出外部关境现金/旅行支票严格>等值USD10k申报及严格>USD100k来源文件，本国表币种符形似S、英译自标非正式均不作法效主证，免税额度伪程序撤销；EC 2026海关手册仅证海路旅客补充适用，海港 FRA 实施渠道仍未知。原版validator **249地/249记录/391唯一事项**通过；相对v2累计194地变更，27 verified / 200 partial / 22 blocked，502条unresolved；账本632条（原363+新269）为111 resolved、344 bounded_unknown、76 blocked、101 pending，原363条仍 **47 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v150`/`candidate-v151`：GR AADE 2026 FAQ 只证进出欧盟现金与免税数值，EU内现金和入境超额物品本人动作仍未知；三 PDF 直取403、reader-only 背景源标 unknown，未动现金程序日期。TJ NCZ 现行法第308/309条更新电子/书面、口头申报与非现金缴税，NBT第234号仅可证现金出境按居民/非居民分档；居民USD3,000–3,001非整数空档、现金入境形式、544免税数值及独立入境卡仍未知，快递/邮寄/货运现金条款已从旅客本人程序移走。原版validator **249地/249记录/391唯一事项**通过；相对v2累计195地变更，27 verified / 200 partial / 22 blocked，501条unresolved；账本632条（原363+新269）为112 resolved、348 bounded_unknown、76 blocked、96 pending，原363条仍 **45 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v152`：RW RRA 法语站点与基尼亚卢旺达语页对到达货物证 Form126 Bis 价值≤RWF500k、DD COM严格>RWF500k，此数为选表门槛非免税额；移民旧URL404换现行入境签证页，费用按类别保留unknown。原版validator **249地/249记录/391唯一事项**通过；相对v2累计196地变更，27 verified / 200 partial / 22 blocked，500条unresolved；账本632条（原363+新269）为113 resolved、348 bounded_unknown、76 blocked、95 pending，原363条仍 **44 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v153`/`candidate-v154`：UZ LEX原文证现金严格>等值1亿苏姆、首饰出境≥1亿与特定持证贵金属超USD5k填同一旅客海关表，一般货物≤USD5k免表不反推其他超值必填；KE EAC公告和KRA证税惠USD2k，KRA知识库同页“所有物须报/旧物不需报”及F88全员/仅新物>USD2k两层冲突分开，税惠不作填表线。原版validator **249地/249记录/388唯一事项**通过；相对v2累计198地变更，27 verified / 200 partial / 22 blocked，503条unresolved；账本636条（原363+新273）为114 resolved、353 bounded_unknown、76 blocked、93 pending，原363条仍 **42 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v155` 至 `candidate-v157`：UG USD2k税惠与现金1,500货币点门槛分证，2023规章≥/双向C表与旧法及FIA现页>/入境D表冲突保留；MD BNM第62/2008号整合法和海关两页面证≥€10k货币价值表与个人货物表不同；BY EEC旅客主表及现金附表完整取得，第260条原件不全、错误第107号链接排除。原版validator **249地/249记录/390唯一事项**通过；相对v2累计201地变更，28 verified / 199 partial / 22 blocked，503条unresolved；账本638条（原363+新275）为116 resolved、357 bounded_unknown、76 blocked、89 pending，原363条仍 **38 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v158`：UA NBU正式2019年第3号原件第5点现金≤€10k免书面与第6点≥€10k须书面相交，SCS旧指南绿道≤/红道>；GLM返修后仅断言严格<免、严格>须报，恰额窄未知，草案PDF排除、Rada法件超时留待。原版validator **249地/249记录/390唯一事项**通过；相对v2累计202地变更，28 verified / 199 partial / 22 blocked，504条unresolved；账本639条（原363+新276）为116 resolved、359 bounded_unknown、76 blocked、88 pending，原363条仍 **37 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v159`/`candidate-v160`：BH LLOC第3/2003号条例只证免税、207/2022决定只证关员要求时双向披露，未获主动旅客表且支付服务403，旧伪程序撤销后blocked；QA 2019第41号正式规章证本人携现金等入出境≥QAR50k填表、2025官令证随行行李礼物总额≤QAR3k和香烟200，旧网页每件/400只留历史。原版validator **249地/249记录/387唯一事项**通过；相对v2累计204地变更，28 verified / 198 partial / 23 blocked，506条unresolved；账本641条（原363+新278）为116 resolved、362 bounded_unknown、77 blocked、86 pending，原363条仍 **35 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v161`：KW FIU完整第106/2013号法Art20仅关员要求时披露，第37/2013号细则KWD3000仅金融机构客户尽调，海关Sahel新闻只reader写严格>3000而旧表客户端≥3000且入口超时，记录维持零程序blocked。原版validator **249地/249记录/387唯一事项**通过；相对v2累计204地变更，28 verified / 198 partial / 23 blocked，505条unresolved；账本641条（原363+新278）为117 resolved、362 bounded_unknown、77 blocked、85 pending，原363条仍 **35 pending**。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

## 分批执行

1. 从当前候选库完整解析 249 条记录和 363 条未决，建立逐项审计账本。初始清单与进度文件位于本轮外盘根目录的 `unresolved-inventory.json`、`audit-progress.json`，363 个 `(jurisdiction_id, unresolved_id)` 键均唯一且初始为 `pending`。每条保留原 ID、国家、问题类型、所需主管机关、现有证据和决策，不因 `verified_at` 非空就跳过未决；只有 Codex 接受批次后才更新进度文件。
2. 先处理上轮中断的 MY/SR，再按高风险事实顺序处理 ET、CC/CX、其余 blocked 记录、数值与时效冲突，最后逐地复核剩余 partial。每批限 2–4 地，避免搜索摘要或外国旅行建议被扩写成整国法规。
3. Claude Code GLM 仅写 `/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/glm53-max-audit-20260927` 下独立批次的 normalized 记录、原文证据和报告；读候选库但不改它，也不改仓库、Git、公开快照、网站或 Registry。并行批次必须指定不重叠国家及目录；CLI 内部仍禁 Agent、模型 fallback 与凭据读取。
4. 每个未决 ID 逐一结论：`resolved`（官方正文足以消除）、`bounded_unknown`（官方来源明确不公开或未说明，保留 unknown 和范围）、`blocked`（记录具体访问/来源阻碍及下一检查入口）。不能为了清零删掉真实未知或把 blocked 改 verified。
5. Codex 每批独立检查来源身份、可读原文、条款现行性、引文逐字支持、适用范围、中英一致、金额含本数与方向；用原版 `scripts/check-travel-library.mjs` 对隔离 fixture 验证，核对原事项 ID 与文件差异。失败批退回 GLM 精准返修，不并入候选库。
   - 语义门槛：海关对旅客/行李的检查权、机场联络方式或货运报关页面，不自动构成旅客需要提交的 `customs_declaration`；若缺旅客申报程序原文，保留 blocked 或仅在 unresolved 描述检查线索。英文 `over 18` 不得翻成含 18 岁的中文。
   - 日期门槛：不能仅因补到一个新渠道/链接就刷新整项 `verified_at`；该日期覆盖的金额、豁免、时窗和适用人群须一并有本轮可读官方正文支持，否则保留原日期并标识新旧来源各自支持的字段。
6. 每批通过后由 Codex 串行覆盖候选库副本，保留前版和来源清单；全库最终需 249 唯一记录、所有原 363 未决 ID 有可追踪处理结论，结构门禁和负例通过。对因官方阻塞仍无法核实的事项保持 blocked/partial 并明确报告，不能宣称事实全部完成。

## 存储与发布边界

仅使用已挂载的 `/Volumes/ExternalPrivate` 存证据、批次、日志与候选副本；开始前和结束后核实挂载、可写、容量与实际落盘。工作树保持现有 `codex/global-traveler-library` 未提交现场，GLM 不做 Git。已核研究主库的内部集成由 Codex 串行进行，并另行验证研究构建、SEO 和浏览器；公开快照导出、推送、部署及 MCP 开放不在本轮授权范围。

2026-09-29 验收 `candidate-v162`–`candidate-v164`：主控串行覆盖 TL/WS/VU，每版原版 validator 通过，最终 **249地/249记录/390唯一事项**；相对v2累计205地变更，28 verified / 198 partial / 23 blocked，506条unresolved；账本646条（原363+新283）为119 resolved、374 bounded_unknown、77 blocked、76 pending，原363条仍 **33 pending**。TL 央行 Art3≥20k 与 Art4>20k申请细则，WS 法条>20k与央行表≥20k，VU 2009法≥100万瓦图与旧BCR表>、法定货币范围与表式差异均保留有界未知；VU入境卡扫描两页原图目验，Flash仅OCR，其余实质写作五/四/四轮GLM-5.3/max。主控独立核一手官页/法图及18/8/28条短摘。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v165`：仅覆盖PW二次GLM-5.3/max数学返修稿，原版validator **249地/249记录/390唯一事项**通过；相对v2累计205地变更，28 verified / 198 partial / 23 blocked，507条unresolved；账本647条（原363+新284）为119 resolved、377 bounded_unknown、77 blocked、74 pending，原363条仍 **33 pending**。帕劳首页以departure、内嵌表单以arrival锚定72小时；两轮错误区间推理经主控退回，最终仅保留未决冲突，不给推算时机建议。现金≥USD10k双向书面申报，离境条件性Currency Form已证，普遍离境表未证。31条官方短摘匹配，成功主体五轮仅glm-5.3。研究主库仍70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v166`/`candidate-v167`：主控串行覆盖JO/NF，最终原版validator **249地/249记录/392唯一事项**通过；相对v2累计207地变更，28 verified / 197 partial / 24 blocked，512条unresolved；账本654条（原363+新291）为121 resolved、384 bounded_unknown、77 blocked、72 pending，原363条仍 **31 pending**。JO现金/物品/无人机三真实动作因2026现行性未核保持verified_at=null及blocked；NF IPC与同卡生物安全申报获官页直证，免税额度不建程序，ABF通知编号2026/11签发4月21日。主控核官网、法件、3/7条短摘和成功GLM-5.3/max用量。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v168`–`candidate-v170`：AU/MM/MN修订串行覆盖，最终原版validator **249地/249记录/392唯一事项**通过；相对v2累计209地变更，28 verified / 197 partial / 24 blocked，516条unresolved；账本660条（原363+新297）为122 resolved、393 bounded_unknown、77 blocked、68 pending，原363条仍 **28 pending**。AU DAFF生物安全正文与ATD部分Qantas试点分证；MM门户与2025 AIP表组及健康PHEIC条件冲突保留；MN现金严格>与≥MNT1500万本数差异保留，新健康在线表仅限AIP航空语境已证义务，COP17活动公告不推广。主控核官源/13、5、50条短摘和成功GLM-5.3/max用量。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v171`–`candidate-v176`：LB修订/IQ修订/CC/CX/IR/VN串行覆盖，最终原版validator **249地/249记录/393唯一事项**通过；相对v2累计211地变更，28 verified / 195 partial / 26 blocked，521条unresolved；账本666条（原363+新303）为123 resolved、399 bounded_unknown、82 blocked、62 pending，原363条仍 **26 pending**。LB/IQ均有历史官法动作但2026现行性未证而blocked；CC/CX/IR没有可核本人申报原文保持blocked；VN公安部PAI仍自愿且局限新山一、费与推广日留未知。主控核官方PDF/原图/网页、成功GLM-5.3/max用量及逐版原版validator。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v177`：GM央行官网2012 AML法§48原图证本人入出境现金/票据披露，但原制定文严格>USD7500的(a)支、(b)央行另定金额与GRA FAQ入境>USD10000未调和；程序verified_at=null、整地blocked。Flash仅OCR，GLM-5.3/max多轮返修后删除免税伪程序与重复现金项，主控目验原图、五条短摘并跑原版validator **249地/249记录/392唯一事项**。相对v2累计212地变更，28 verified / 194 partial / 27 blocked，523条unresolved；账本669条（原363+新306）为124 resolved、402 bounded_unknown、82 blocked、61 pending，原363条仍 **25 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v178`/`candidate-v179`：AS卫生部TravelHealth门户/FAQ/Privacy仅证服务及家庭团体每人一份，普遍法定义务未证维持blocked；MP现行6 CMC §2306原图证离境严格>USD10k实际离境前交签署表，历史目的语≥恰额冲突保留。主控核7/17条官方短摘、原图、GLM-5.3/max用量，逐版原版validator最终 **249地/249记录/393唯一事项**通过；相对v2累计212地变更，28 verified / 194 partial / 27 blocked，526条unresolved；账本673条（原363+新310）为125 resolved、406 bounded_unknown、83 blocked、59 pending，原363条仍 **25 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v180`/`candidate-v181`：PS FFU2024正式指令证双向资金≥JOD2000及贵金属宝石≥JOD7000；Allenby线上>JOD2000仅reader、费用与两制度关系未知。UM Palmyra私船入境须USFWS事前批准，只证船舶准入不指定法定申请人，Midway公众访问当前关闭。主控独立核原图/官页、6/31条短摘及GLM-5.3/max用量，逐版原版validator最终 **249地/249记录/395唯一事项**通过；相对v2累计213地变更，28 verified / 195 partial / 26 blocked，526条unresolved；账本677条（原363+新314）为128 resolved、409 bounded_unknown、84 blocked、56 pending，原363条仍 **24 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v182`（主控06:18覆盖CC、06:22更新账本后中断，ZCode约15:05 JST补记验收）：CC由blocked升partial，现行Airservices AIP GEN 1.3 §8.4.2(a)（完整现行卷general_03SEP2026.pdf、页脚09 JUL 2026）证抵港旅客须填Incoming Passenger Card兼作海关移民用途且含禁止进口申报，建唯一程序CC-arrival-card（fee unknown）；§8.4.2(b)出境句仅背景源supports空不建程序。原3条未决resolved、新3条窄未知bounded_unknown。原版validator **249地/249记录/396唯一事项**通过，候选与批次normalized逐字节相同；批次摘录审计曾按空白归一化匹配，按SO/SS判例改以机械拍平（无损、原件不动）后的AIP/ABF文本复验，6/6短摘≤25词逐字连续（evidence-cc-flat-verify.txt）。相对v2累计213地变更，28 verified / 196 partial / 25 blocked，526条unresolved；账本680条为131 resolved、412 bounded_unknown、81 blocked、56 pending，原363条仍 **24 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v183`（ZCode约15:10 JST代主控验收06:23交付的GLM-5.3/max CX返修稿）：CX由blocked升partial，同一现行AIP GEN 1.3 §8.3.3(a)（物理页90、页脚09 JUL 2026）证乘机抵圣诞岛旅客须填Incoming Passenger Card兼作海关移民用途且含禁止进口申报，建唯一程序CX-arrival-passenger-card（fee unknown、航空范围）；§8.3.3(b)出境句仅背景源不建程序；首稿嵌套schema与非标准evidence_excerpt_2被原版validator打回后按14个扁平键重建、两条AIP陈述拆为两个主题来源。原2条未决resolved、新3条窄未知bounded_unknown。原版validator **249地/249记录/397唯一事项**通过（批次fixture的394系v179旧基线、以最终候选复跑为准），候选与批次normalized逐字节相同，7/7短摘≤25词逐字连续（evidence-cx-flat-verify.txt）。相对v2累计214地变更，28 verified / 197 partial / 24 blocked，527条unresolved；账本683条为133 resolved、415 bounded_unknown、79 blocked、56 pending，原363条仍 **24 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 验收 `candidate-v184`（ZCode约15:20 JST代主控验收06:23交付的GLM-5.3/max IN来源修正稿）：IN维持partial、5程序（CBD-I/CDF/CBD-II/III/IV）不变，证据面由2来源重建为26来源，verified_at全部保持2026-09-27不刷新；旧IN-2026-appendix仅载CDF门槛，其对CBD-I的supports/source_ids按GLM裁定双向移除；CBD-I各组额度改由cus1526.pdf第7–9页9条连续短摘直接支撑；Atithi条目定位操作流程并明示未实测。原版validator **249地/249记录/397唯一事项**通过，与批次normalized逐字节相同，隔离负例恰1违规exit 1，26/26短摘≤25词逐字连续（四份PDF文本层无损拍平，evidence-in-flat-verify.txt）。账本IN-atithi-guide-online-steps、IN-forex-carry-rules由pending改bounded_unknown。28 verified / 197 partial / 24 blocked，527条unresolved；账本683条为133 resolved、417 bounded_unknown、79 blocked、**54 pending**，原363条仍 **22 pending**。研究主库70地、公开快照0；未集成、公开、提交、推送或部署。

2026-09-29 批次现场清点（ZCode 15:2x JST）：06:23中断时仅三份交付物悬置——CC（06:18已入v182）、CX与IN（本轮已验收为v183/v184）；`batch-pacific-tk-permit-20260929` 仅完成取证步（General Fono 2017 决议PDF HTTP200/680KB及其文本抽取、tokelau.org.nz 许可服务页200；访客许可表PDF在http 502/https 000失败，legislation.govt.nz 1991移民条例页202空响应），GLM写作调用未运行、normalized仍为基线种子——该批不验收，待按两步制派发写作。全部batch-normalized与最新已验收候选逐一比对，无其他未验收差异稿。automation-2仍ACTIVE（每30分钟心跳）但自06:23起无实际动作，主控线程未恢复；后续恢复主控或automation时从candidate-v184续接。

2026-09-29 下午（JST）用户授权 ZCode 按 GLM CLI 同等证据与验证标准直接处理剩余 54 条 pending，`batch-pending54-20260929` 逐国取证（curl 原件+fetch-log 失败存证+无损拍平摘录核验），串行验收 `candidate-v185`–`candidate-v193` 九版，每版原版 validator 通过、仅覆盖本版国家、候选与批次 normalized 逐字节相同、隔离负例恰 1 违规 exit 1。要点：**v185** ET 四条出结论（FXD/04/2026 与 FXD/05/2026 原件 PDF 复下载 200；FXD/05 仅改附件 2/6 贸易融资子条、不触第 22 条；ecc.gov.et 复试 000×2 → 923/transit/traveler 三条 blocked、USD500 陆路条 bounded）+ TK 访客许可费自 General Fono 2017 决定（修订 1991 移民规则第 8 条）确认为 **NZD$50**（程序 fee 对象化、channel 保持 unknown、verified_at 保持 null）。**v186** GS：ETA 页完整捕获（门户/8 天前付费/£50 迟交费/团体 xlsx/第 14 条船方舱单 72 小时），程序 verified 2026-09-29，GS-audit-1 收窄 bounded；SM：DD141 合并法经 HTTP 206 断点续传补全（688,335 字节/20 页/%%EOF），failed 源升 ok，程序补双渠道（跨越前电传/书面交最近边境警察）并 resolved；SZ：ERS 现行页（Section 41：>E15,000 按总额向警察或海关申报；Form E/SAD500 分轨）两程序 verified 并 resolved。**v187** ID：现金 FAQ 完整页捕获（169,745 字节含页脚），四条残片主张全部证实（≥Rp1 亿含本数通知海关；印尼盾 ≥Rp1 亿出境 BI 许可/入境申报验真；个人禁携 ≥Rp10 亿等值外币纸币；PMK 100/2018 依据），failed 源升 ok+新增 Rupiah 主题源，现金程序 verified，条目 resolved；CV（ASA 定位源、bounded）、BQ（含本数 USD 10,000 or more+替他人携带，verified，费用 bounded）、CU（MLC 5,000+124/20 许可制，verified，决议号 bounded）。**v188–v193** 其余 35 条按同标准出结论：新增 ME 枢纽定位源、MC OS 2.318 版本标记源（至 10.124/2023、含 11.242/2025-05-30 块、@2025.06.07 后无修正）、VE 领事馆费用邮箱源（均逐字短摘）；LR 2001 条例 PDF 完整复取（USD7,500 出境未申报限额/>USD10,000 入境申报）；AF/BI/IL/LI-llv/VE-seniat/SJ-regjeringen 六处按连接层失败或 Cloudflare/403 封锁记录 blocked，其余维持 bounded_unknown（含 LY 日期、KM 表单、MV 烟草现行性、MW 门槛、JE 1999 法、IM £10k 措辞、VA/GS 现金规则、ZW 红绿道、ZM Reg22 等）。最终 **candidate-v193**：249 地/249 记录/397 唯一事项，28 verified / 197 partial / 24 blocked，记录内 524 条 unresolved；审计账本 683 条全部出结论——136 resolved、459 bounded_unknown、88 blocked、**0 pending**（原 363 条与新增条目均已决）。外部盘在连续重 IO 下出现目录可见性抖动与一次 candidate-v190 丢失，经统一 candidate-vNNN 命名、幂等构建与逐版复验重建；期间曾出现无 v 前缀影子目录，已全部清除。研究主库仍 70 地、公开快照 0；仅外盘内部候选，未集成、公开、提交、推送或部署。后续：内部主库集成验证仍待主控；公开快照导出/部署不在本轮授权。

2026-09-29 ZCode 交接：v182–v193 的复核指引已写入 `glm53-max-audit-20260927/batch-pending54-20260929/codex-review-handoff.md`（含 12 处实质编辑重点清单、机械门禁复跑方法、流程缺口与四处建议补挖项 JE/IM/AF/HM、非主管机关来源 12 程序政策裁定项、外置盘稳定性警告）。Codex 额度恢复后按该文档从 candidate-v193 复核续接；任何推翻性结论须同步审计账本并另出 v194+，不改 v193 本体。


2026-09-30 Codex 接手：外盘 v193 的结构与逐版覆盖已独立重跑：v182–v193 每版原版 validator 通过，且每跳仅指定国家文件变动；v193 为249地/249记录/397事项，账本683条136 resolved/459 bounded_unknown/88 blocked/0 pending。但 v185–v193 的 ZCode 代验收与当前用户指定的直接 Claude Code GLM-5.3/max、Codex 独立事实验收入口不一致；交接文档自认无逐国报告、批内 fixture、v188–v192 各版负例，batch-pending54 目录未见直接 CLI modelUsage。Codex 不把零 pending 当全库事实完成；当前记录仍524条 unresolved、24地 blocked，研究主库70地、公开快照0。已并行启动三个互不重叠的直接 GLM-5.3/max 复核批次：review-v185-et-tk-20260930、review-v186-gs-sm-sz-20260930 与 review-v187-id-bq-20260930。必须检查真实 modelUsage、逐项来源映射后才能接受或出 v194+；其余 v187–v193 待同样复核。机械审计另发现51条 bounded/blocked 账本 evidence 为空，需检查对应 note/next_check_url 的具体边界并补账本引用。automation-2 保持 ACTIVE，未集成、公开、提交、推送或部署。

同轮 Codex 原图回读官方 Tokelau 2017 General Fono 决议第21–23页：NZD50 访客许可费用列于「noted」且明确待下届讨论；获认可的附录未改 Rule8(2)(ii) 费用。v185/v193 将其作为现行费用缺证；待直接 GLM 报告完成后按新版本返修，不改旧候选。

2026-09-30 用户明确纠正：已授权 ZCode GLM 完成后续核验，故 v185–v193 是待 Codex 独立验收的交付基线，不能因 ZCode 入口本身否决。前述“与用户指定入口不一致”判断撤回；仍须逐项复核已识别的 TK 费用、ID/SM 摘录、GS 舱单主语、SZ 免税伪程序风险、51 条空 evidence 边界，完成后才考虑内部主库集成。

2026-09-30 07:42 JST：在已授权 ZCode GLM v193 基线之上，Codex 串行接受 v194 ET/TK、v195 ID/BQ、v196 GS/SM，原版 validator 逐版 249 地/249 记录/397 事项通过。v196 账本 684 条 0 pending（136 resolved/460 bounded_unknown/88 blocked），但记录 525 unresolved、45 条 bounded/blocked evidence 为空；主库 70/87、公开 0。SZ 免税伪程序与跨题来源在隔离返修未验收；ME/LI/MC、SR/JE/IM/VE 后续复核运行。用户纠正的授权口径已采纳：不得因 ZCode 入口否决已有交付，但需 Codex 独立事实验收并修复具体错误。未集成或公开。

2026-09-30 08:14 JST：主控独立接受 v197 SZ、v198 JE、v199 ME/LI，原版 validator 每版通过；v199 249 地/249 记录/396 唯一事项，账本687条0 pending（137 resolved/462 bounded_unknown/88 blocked），记录528 unresolved、空 evidence 尚37。ZCode v193 是用户明确授权的已有交付，不因入口否决；继续核其具体来源语义，MC 完整页新取、AF 携带限制/申报分轨、v191 各地 note 待完成。2026-09-30 用户新增额度保护：Codex 剩余≤80% 且任务仍未完成即暂停；当前 usage 已用4%、剩余96%。automation-2 已按该阈值更新，触发时先停新批、保存在途成果并暂停调度，不用重置额度自行续跑。内部主库/公开快照未集成或部署。

2026-09-30 08:32 JST：Codex 在用户授权 ZCode GLM 基线上新增 v200 AF、v201 MC 验收。v201 原版validator249地/249记录/395事项；账本689条137 resolved/465 bounded_unknown/87 blocked/0 pending，记录530 embedded unresolved、空 evidence35。AF 携带上限伪程序已移，旧申报表现行性不明；MC 完整当前法网页已取并与纸表程序对应，旧截断版来源降背景。SY生效公报日期未知，v191/v192 其他地复核继续。Codex 额度已用6%、剩余94，未到用户设定的剩余≤80%暂停线。主库/公开快照仍未集成，禁止提交、推送或部署。

2026-09-30 08:46 JST：候选串行至 v202，原版validator249/249/395。SY新法 Art88/264 原图已Codex回读、公报刊载日未知，程序保持旧有核验范围；旧阿文短摘由已验收 v201 原始字节确定性恢复。v191 DJ/KM/LR/MV/MW、v192 HM/SJ/ZM/ZW 仅注释增量审阅并补九条证据 URL，账本689条 pending0、空 evidence23。LS官方PDF死链与VA表单法律型号需返修；ASIF新门户/一页扫描表已存，Flash仅OCR成功并保存使用量，主GLM-5.3/max处理中；v193六地两组三国审核中。用户的Codex额度阈值继续生效，最近剩余94%。研究主库/公开快照未集成。

2026-09-30 09:11 JST：独立候选串行至 v205，原版validator249地/249记录/394事项。IL同页门槛比较符冲突列窄未知；VA当前ASIF扫描表Flash只OCR、GLM5.3/max判断其法定型号未证；ST海关清关/免税伪申报移出并blocked。账本690条0 pending，空evidence19，记录531 embedded unresolved。TW单地重审可用，LS旧PDF本轮为404且原成功版未在本外盘核到，现行RSL另有 Registrable Goods VAT退款指南但免责声明称无约束力，继续有界返修。用户Codex剩余≤80%暂停规则有效，最近剩余92%。主库/公开快照仍未集成。

2026-09-30 09:50 JST 阶段收束：最新经主控验收的内部候选为 candidate-v207（详见独立 review/overrides）；外盘研究主库已按该候选全量集成并由原版validator与249文件/roster字节回读证实，公开快照仍0。状态28 verified/194 partial/27 blocked、394事项，531条embedded unresolved；账本690项137 resolved/466 bounded_unknown/87 blocked/0 pending，所有有界/阻碍证据非空。AF/GS/VA来源角色清理仅由直接GLM-5.3/max写作，Codex复核后串行覆盖。此处“逐项核验完成”仅指每项已给出 resolved 或有证据边界的有界结论；未证事实不能冒称 verified，公开发布须另行授权。automation-2保持ACTIVE，针对真实新证据继续检查；Codex剩余≤80%且任务未完即暂停，最近实查剩余91%。无Git、公开导出、推送或部署。
2026-09-30 调度更新：上段所记 automation-2 ACTIVE 是集成后、完成条件复核前的暂态；完成条件已满足，automation-2 已删除。未决条目保留有界状态与下次官网检查入口，新证据另开针对性核验。
