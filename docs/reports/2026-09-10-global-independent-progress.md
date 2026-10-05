# 全球资料库独立验收进度

## 已证实

- GLM 执行 session：4920304d-729e-4220-8528-14a739534158；实际 assistant 消息 model 为 glm-5.3，尚未获得终态 modelUsage。
- 独立通过 curl 下载联合国 M49 官方完整 HTML，第二次下载退出 0，文件含完整 HTML 结束标签。第一次45秒超时的文件已由完整下载替换，不作为证据。
- 独立使用 HTMLParser 提取表格，与 GLM 使用不同解析方式，EN 248 条、ZH 248 条，248 个非空且唯一 ISO-alpha2。
- 对英文表的15个字段逐项与 GLM 快照比对，差异0。GLM快照额外带有独立页面未提供的 Developed / Developing Countries 字段，本轮没有验证此额外字段，不应据此做分类。
- 母表是国家或地区列表，不能对外称作248个国家。本站既有目的地不在母表时需显式补充来源，不能丢失也不能冒称联合国母表条目。

## 尚未验收

- 国家/地区母表到本站既有53个目的地的映射。
- 8地试点资料、官方证据、费用/条件/期限及中英文一致性。
- 校验脚本对错误数据的真实拒绝能力。
- 剩余地区资料、双语网站页面、构建与SEO、发布状态。

## 外盘证据

目录：/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910
- m49-independent.html：独立下载原文。
- m49-independent-check.json：独立结构比对统计。
- m49/m49_en_zh.json：GLM提取快照。
- pilot.jsonl：GLM运行日志。

## 执行反馈

GLM在临时提取命令中加入了hashlib/sha256，违反项目禁止写哈希的规则；这些仅是外盘临时日志，没有必要纳入产品或验收。下一轮明确要求删除该额外机制，不以哈希证明事实准确性。

## 首批官方来源预核（资料文件交付前）

- 挪威：https://www.toll.no/en/goods/currency/ 已打开正文。超过25,000 NOK须申报；入境走红通道交两份表。不能写成达到25,000即触发，也不能将“该金额不征税”推断为所有相关服务免费。这是现金事项，不能代表全部行李物品申报覆盖。
- 智利：https://www.sag.gob.cl/ambitos-de-accion/ingreso-por-controles-con-declaracion-jurada-digital 已打开正文。SAG指向 ingresoachile.cl，说明数字申报免费、无需打印，适用已实施该系统的口岸。SAG生物检疫事项不能自动扩展为所有海关税费规则；年龄条件应保留来源准确范围。
- 文莱：https://www.immigration.gov.bn/ 已打开正文，移民局首页说明 E-Arrival 注册需护照、行程和住宿资料并产生参考编号。首页不能证明海关申报义务已经完成；后续仍需单独海关来源。
- 德国：官方旅行免税额度页面搜索可定位，但本轮 web open 返回 Internal Error，尚不记已核验正文。不得以搜索摘要代替正文证据。
- 斐济：https://frcs.org.fj/our-services/customs/travellers/visiting-fiji/arriving-in-fiji/ 已打开正文。官方说明旅客填写纸质 Arrival Card 两面；海关栏包括限制物品、达到 FJ$10,000 的货币及生物风险物品。适用时另填 Border Currency Reporting Form。资料应支持“同一入境卡包含海关栏目”，而非捏造两个独立线上系统。
- 文莱海关补查候选：https://bdnsw.mofe.gov.bn/Pages/CustomsBN-Info.aspx 搜索命中，但正文请求502，尚不计核验；赞比亚旅客清关候选：https://www.zra.org.zm/wp-content/uploads/2025/08/Passenger-Clearance.pdf 正文请求失败，尚不计核验。这两处应继续抓取，不能仅填eVisa后声称海关已完成。

### 德国补充正文核对

来源：https://www.zoll.de/DE/Privatpersonen/Reisen/Rueckkehr-aus-einem-Nicht-EU-Staat/Einschraenkungen/Barmittel/barmittel_node.html
已读取GLM下载的真实官方HTML。现金达到10,000欧元触发相关申报；Zollportal在线表单040000_1需注册/登录，提交产生识别码。纸质路径的原文限制为个别情况下暂仍可使用，不能写成无条件等价任选；表号040000/040001及附页040050/040051。来源还说明非欧盟至非欧盟、经欧盟国际中转区的旅客也有相关义务，不能泛写“纯转机无需申报”。此核对只覆盖现金事项，不代表德国全部海关资料已完成。

### 欧洲首个交付文件复核

`runtime/europe-research/common-eu.json` 已生成并读取。欧盟现金规则的1万欧元门槛、按个人计算、未成年人代理申报、金币/金条纯度条件及欧盟内部另有国家规定，均在所引欧盟官方正文找到支持。
待修正：directory_source.evidence_excerpt 的“EU Member States section lists 27...”是研究者摘要，不是原文，应改成摘要字段或准确短摘录；共同规则不应把金块/金团遗漏后声称穷尽现金定义。目录含旧域名或维护页，只能作为入口线索，不计各国旅客页核验完成。

### 现有目的地映射预核

实读本分支 country-roster：53行，按英文名称直接匹配M49有43项。另10项必须有显式映射：vietnam、korea、usa、uk、turkey、taiwan、laos、tanzania、bahamas、russia。除taiwan外的9个名称差异应逐项以ISO确认；台湾未出现在本M49表内，需要额外目的地来源且标明非本表条目。禁止只按字符串相等把这10项误判为新增或丢弃。

### 纠偏后补充海关正文

- RW RRA allowances页面已在外盘保存且独立读取：存在口头申报、126 Bis、DD COM路径，并说明超免税额度征税；关于500,000 RWF的英文原文有缺词，不应在未交叉核实时生成精确比较校验规则。
- AR ARCA ingreso-egreso-de-valores页面已保存且独立读取：出现USD10,000及OM2249A；正文同时用inferiores和superior，临界值的严格数学判断需补官方法规支持，不直接将其转成gt/gte规则。
- BN bdnsw页面当前抓取没有可用CustomsBN正文，不计通过。


### 本地构建基线

在新增资料文件尚未生成时，独立运行 npm ci --ignore-scripts（缓存/依赖在外盘），安装111个包；npm提示5项漏洞（1 low、1 moderate、3 high），没有运行自动修复。
Node22.22.0、Hugo0.160.1 extended。npm run build:prod 与 npm run check:seo 均退出0；Hugo统计 EN224、ZH222 pages。此为构建统计，不是已核实国家数量；不得据此修改覆盖口径。该构建只证明现有分支基线，不证明未来新增资料通过。

### 母表实际文件首次验收

GLM已生成 data/travel_library/jurisdictions.json。独立解析实际文件：249项（248 M49+额外TW）；与官方快照逐项比较ISO2/M49代码，遗漏0、错配0；existing_site_key非空53项，全部既有目的地保留。研究状态此时为not_researched188、existing_destination53、researched8。8地记录仍在逐个写入，researched计数不能当作8地交付验收已通过。现有目的地映射也不代表这些地方的海关资料已经完整。

### 试点交付中首次检查（非终态）

首次调用真实check-travel-library.mjs时输出54个问题：52个既有目的地记录路径指向不存在文件、AQ空region与脚本要求冲突、AR摘录超过25词。GLM仍在写入，自查修复后需重跑，不能用这次工作中结果判最终交付。

内容待修：AR.json把实际抓取 arca.gob.ar 的来源地址写成 argentina.gob.ar/aduana/AYUDA/...，已保存HTML的og:url仍为arca.gob.ar/viajeros；必须恢复实际证据URL并确认可用，不能擅造路径。CL.json的摘录来自declaracion-jurada-sag-de-ingreso-chile页面，却引用另一篇ingreso-por-controles-con-declaracion-jurada-digital，需逐项对应真实出处。DE将Barmittel和等同支付手段的主动申报/被询问申报混合；FJ断言不存在两个独立线上系统过强，只能说本来源描述同一张卡。

校验器待针对性反例验证：非法日历日期（当前Date.parse可接受部分溢出日期）、空摘录access_status=ok、被引用源和supports源不一致仍可通过、existing_site_key未校验实际roster；不要用结构通过等于事实正确。

### 四个反例修复独立回归

使用原始独立fixtures，未修改样本或期望。主控再次运行真实check-travel-library.mjs：baseline退出0；impossible_date、empty_evidence、uncited_support、duplicate_site_key均退出1，并输出对应原因。结果保存在外盘 independent-validator-recheck.json。修复前同四例全部错误退出0的证据仍保留，证明这些反例实际覆盖本次缺陷。资料事实修正与全批验收尚未完成。

### 无可靠资料状态的独立验收

主控另建4个外盘fixture，调用真实check-travel-library.mjs：blocked且procedures为空但有unresolved时退出0；verified空记录、blocked空记录却无原因、非法月份2026-99-99均退出1，且日期错误有具体字段信息，不再RangeError。证据 independent-blocked-fixtures.json。该能力用于诚实展示研究阻碍，绝不把blocked计作完整资料。

对母表248项的中英名称共496个值独立与M49解码结果比对，差异0。

### 当前源码与已发布分支的集成风险

git rev-list --left-right --count HEAD...origin/main 得3/12；HEAD=f3441cc，origin/main=632d869（本地引用，本轮未重新fetch）。当前单独国家扩展分支的构建通过不等于最新已发布布局兼容；页面接入前需串行整合并复验，已写入执行计划。
