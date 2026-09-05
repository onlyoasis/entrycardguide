# 中国修复、南非与尼日利亚扩展验收

验收时间：2026-09-05 18:30 JST。

## 结果

**本地验收通过，国家覆盖 53；未提交、推送或发布。** 工作树为 `onlyoasis/国家扩展`，HEAD 保持 `a0c07c1`。不把本地 53 国与当前生产版本混为一谈。

先完成中国修复与独立验收，再写入南非、尼日利亚，顺序符合用户指令。两国各新增六篇中英文内容和四份数据；中国六篇内容及四份数据已修订。共享改动仅为国家 roster、决策树和 how-to-fill 的两个局部文案覆写。

## 中国问题关闭

- 四篇主表/填写页撤下不兼容的 validator；页面明确提供所选资料指南，使用官方表单作最终校验。公共 `validator.ts` 未修改。
- 护照资料页仅 JPEG/PNG；PDF 说明材料是另一条路径。纠正先压缩后检查 102400 bytes 的次序。
- 邀请单位/邀请人按实际条件展开，不再让普通游客自动把酒店当邀请方；邀请电话在该分支必填，字符规则与个人电话分开。
- 普通流程五步；指南选列八项、四组，取消未经核实的 33 字段/固定六步承诺。
- 纠正地址/邀请名称的字节限制、placeholder 与报错身份、免费来源和未经核验的存档/入口。
- 英文枢纽的时限表述已限定为本次核查的官方通知。
- 独立审查 Spec compliance / Quality 均通过，全部原问题及最终局部 P2 关闭。

## 新增两国

| 国家 | 主表与资料页 | 实现内容 |
| --- | --- | --- |
| 南非 | `/south-africa/traveller-declaration/`、`/south-africa/how-to-fill/`，及中文对应路径 | 12 个所选准备项；SARS 海关申报与移民许可分开；出发前 24 小时窗口、Full/Nil、限定航空/海路过境、儿童覆盖、地址方向、确认和更新资料 |
| 尼日利亚 | `/nigeria/landing-exit-card/`、`/nigeria/how-to-fill/`，及中文对应路径 | 8 个公开确认的准备项；入/出境分开、免费、打印凭证、逐人提交、更正需重新申请；登录后字段及特殊身份规则未编造 |

两国均有枢纽页和中英文主表/填写页。两国 rules 补齐 officialUrl/source，所列字段没有未经证实的正则、长度或模拟报错。

## 权威验证

执行方报告后，主控在稳定工作树独立重跑：

```text
npm run build:prod
Pages EN 224 / ZH 222
exit 0

npm run check:seo
SEO output check passed
exit 0

node /tmp/entrycardguide-china-remediation-check.mjs
China remediation output checks passed

python3 .superpowers/sdd/2026-09-05-china-fix-africa-expansion/check-expansion.py
china: 8 cards, 6 source files, 6 rendered pages, bilingual/schema/no-validator checks passed
south-africa: 12 cards, 6 source files, 6 rendered pages, bilingual/schema/no-validator checks passed
nigeria: 8 cards, 6 source files, 6 rendered pages, bilingual/schema/no-validator checks passed
Countries: 53; all decision links resolve
en sitemap: 165 URLs; every reviewed country has exactly 3
zh sitemap: 165 URLs; every reviewed country has exactly 3

python3 .superpowers/sdd/2026-09-05-china-fix-africa-expansion/check-example-labels.py
Three-country example labels: no unverified rejection promises
```

Hugo 的 Pages 数含内部页型，不等同于 sitemap 的可索引 URL 数。

额外核对：

- 原 HEAD 中 50 国的选项顺序和全部国家 state 结构化比较一致；仅增加三国 15 个 state。
- 加标题覆写时，原 50 国 300 个 HTML 逐字不变。
- 53 国接线后保存第二份基线，再改资料卡标签；原 50 国 300 个 HTML 再次逐字不变。
- 三国语言日期一致、8/12/8 卡片与 rules 键匹配；六个主表/填写页对照标签为“需要核对”，没有无依据的“会被退回”。
- 两种语言的首页、官方目录和决定工具产物均包含三国入口；三国 18 个产物页均有 en/zh/x-default；主表与填写页 JSON-LD 可解析。
- `git diff --check` 通过。没有修改其他国家内容、公共 JS、CSS、i18n 或 config。

## 反向回归

1. 暂时恢复中国一页旧 validator shortcode，调用真正的 Hugo 构建，再跑同一检查，exit 1：`incompatible validator still rendered`。用保存的完整字节恢复修复后，构建与检查再次通过。
2. 暂时关闭中国 `fields_examples_only`，调用真正的 Hugo 构建，再跑对照标签检查，exit 1，定位到中英两页各 8 个旧标签。恢复 metadata 后，构建、SEO、两项结构/标签检查再次通过。

没有通过改期望值把这两个回归检查变绿。另一处检查范围在实现前得到更正：枢纽页没有 Article schema 是既有 `IsPage` 守卫行为，已用旧泰国枢纽作基线确认；schema 断言针对真正发出 schema 的主表/填写页，枢纽仍验证存在与 hreflang。

## 浏览器验收

使用真实 Chrome 浏览器和本地构建产物，未改写被测前端逻辑：

- 回读三国 18 页，页面标题/官方入口存在，validator 容器均为 0；三国填写页的“需要核对”卡数分别为每语言 8、12、8。
- 实际点击 9 条路径，每条在 `/decide/` 和 `/zh/decide/` 各跑一次，共 18 种：
  - 中国豁免 / 填报；
  - 南非限定过境 / 入境 / 出境；
  - 尼日利亚纯过境 / 未知特殊身份 / 外国访客入境 / 外国访客出境。
- 三种确定免填/不适用结果不展示表单；明确申报结果分别指向 NIA、SARS、NIS 官方门户。
- 尼日利亚未知特殊身份结果显示“先向 NIS 确认”，链接官方 FAQ，既不显示“免填”也不自动要求申报。
- 决策内容沿用现有英文数据模型；中文工具的框架文案本地化，不宣称所有问题已翻译。三国内容页面本身均有中英文版本。

## 已作取舍

1. 撤下中国不兼容预检，保留有依据的官方指南；代价是本批三国都不提供本地输入验证。
2. 不提交或推送，保留工作树与本地验证记录；代价是后续集成需处理当前未提交内容，不能凭本报告认为已经上线。
3. 为选列资料提供可选标题覆写；代价是触碰公共模板，已用旧 300 页逐字比较约束影响。
4. 尼日利亚不明身份使用明确命名的官方 FAQ 信息卡；代价是信息入口采用既有表单卡外观，summary/name/note 均说明只是确认要求。
5. 仅三国开启资料对照标签，使用“需要核对”替代拒收保证；代价是一个 metadata 开关，旧默认行为已独立验证不变。

## 事实边界与后续

- 没有向政府系统提交真实或合成旅客申报，也没有注册 NIS 账户、验证服务器受理或回执邮件送达。
- 尼日利亚完整表单在登录后；不宣称其所有字段、小时窗口、QR 或特殊身份豁免已核验。
- 南非以现行官方 FAQ 与法规为依据；不同文件中的金额口径未被合成一条未经确认的阈值。
- 中国脚本分析使用同日保存且与当前页面脚本路径一致的 bundle；不声称已逐字比对新的服务器响应。
- 本轮未集成最新主线、未提交/部署或验证生产新页面。当前生产站的其他会话发布记录保持原口径。
- ETIAS 不在本轮授权范围，没有新增其方案或页面。

官方来源详见三份事实表：`2026-09-05-batch5-china-facts.md`、`2026-09-05-south-africa-facts.md`、`2026-09-05-nigeria-facts.md`。独立审查过程和临时验证脚本保留在本计划的 `.superpowers/sdd/` 目录；未提交前不删除这些交接证据。
