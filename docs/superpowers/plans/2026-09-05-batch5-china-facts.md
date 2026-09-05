# 中国入境卡事实核查表（2026-09-05 修订）

本表替换此前未通过复核的事实表。旧版“六步、33 字段、护照接受 PDF、可直接挂校验器”等结论撤销；不得把旧版文字继续当作证据。

配套任务书：[中国批次任务](2026-09-05-batch5-china.md)。独立问题清单：[中国复核报告](../../reports/2026-09-05-china-review.md)。本次状态：已按下列证据修订内容，待主控独立验收；没有完成全表申报验证。

## 证据及使用边界

| 标记 | 来源与本次读取方式 | 可以证明什么 |
| --- | --- | --- |
| NIA 提示 | [国家移民管理局 2025-12-02 提示](https://s.nia.gov.cn/mps/zcjd/202507/t20250750_1010.html)，2026-09-05 重新读取正文 | 实施日期、免费、官方渠道、口岸设备和纸质卡方式 |
| 实施通知 | [中国驻洛杉矶总领馆实施通知](https://losangeles.china-consulate.gov.cn/tzgg/202512/t20251202_11764464.htm)，2026-09-05 重新读取正文 | 网页填报 URL、实施日期、替代渠道、口岸填报、通知所列 7 类豁免；正文没有免费句子 |
| 当前浏览器 | 独立复核报告记录同日 Chrome 实际打开首页、填报须知、普通填报首步 | 界面实际列出的 8 类豁免和普通首步；不是全程提交验证 |
| 官方脚本 | 同日已保存的 `https://s.nia.gov.cn/ArrivalCardFillingPC/js/app.bc4b0fcf.js`，本次重新用 Acorn 解析实际对象、控件及绑定 | 该产物中的执行分支与前端约束；不能证明服务器最终接受、邮件送达或所有外部渠道一致 |

官方脚本本地路径：`/private/tmp/claude-502/-Users-lzc-orca-workspaces-entrycardguide-----/7cd7b441-3ec4-4c77-888c-e48d92e604c2/scratchpad/app.bc4b0fcf.js`。

独立复核脚本：`/tmp/entrycardguide-china-bundle-review.cjs`。本次重新运行该脚本，并用额外 AST 查询核对 `stepData`、`BaseInfo`、`PersonInfo`、`zfyqlxdh`、日期控件和 required 规则。下文 offset 是该保存产物中的字符偏移，不是当前服务器响应的版本保证。临时文件可能被清理。

2026-09-05 Web 工具打开官方表单只能读到 JavaScript 提示壳；本次没有将其算成表单正文验证，也没有声称重新下载并比对当前 bundle。

## 基本事实与来源归因

- 官方入口：`https://s.nia.gov.cn/ArrivalCardFillingPC/`。实施通知正文直接链接这一地址。
- 机构：国家移民管理局（National Immigration Administration）；表单英文名 Arrival Card Filling。
- 2025-11-20 起提供网上填报：NIA 提示与实施通知均支持。
- 免费：**依据 NIA 提示**的“不收取任何费用”，不是领事馆实施通知。
- 其他渠道：国家移民管理局政府网站、政务服务平台、「移民局12367」APP、微信/支付宝小程序、入境卡填报码。这里只列官方通知名称，未逐个测试渠道。
- `s.nia.gov.cn/mps/bszy/wgrcrj/` 是办事指引栏目，已从填报入口数据移除；不能把它当作确认可用的替代填报入口。
- 旧 `archive_url` 未确认存在对应快照，已删除。
- 本次读取的通知没有提前多少小时/天填报的规则。应写“所核查通知没有说明”，不能扩展成检查过全部官方材料。
- NIA 提示允许不具备网上填报条件者在口岸使用现场设备或填写纸质卡；这不等于保证任何错误申报到柜台都会被解决。
- 过境政策中的小时数不等于入境卡填报窗口。旧脚本里的政策选项不作为当前签证政策有效性依据。

## 免填与条件通道

当前浏览器记录的填报须知列 8 类：持有效外国人永久居留身份证；持有效港澳居民来往内地通行证（非中国籍）；24 小时直接过境且不离开口岸限定区域；团体免签或持团体签证的旅游团成员；外国籍机组、船员、司机等交通运输员工；同一邮轮入出境并返回者；符合集中交验出入境证件礼遇条件者；经边检快捷通道入境者。

同一须知允许相应 24/240 小时过境安排中需要离开口岸的旅客使用系统。持边民证件的相关邻国人员另有边民入境通道。本批指南仅解释普通填报，不宣称已验证边民、紧急临时入境、团体与家庭全部分支。

豁免清单依据当前界面；实施通知的 7 类概述不能覆盖第八类的界面记录。

## 普通流程与字段卡范围

`stepData`（offset 294803）实际数组为：

1. `stepDataTitle.upload` → `Step1`：证件资料页上传；
2. `stepDataTitle.baseInfoFillIn` → `BaseInfo`：基本信息填报；
3. `stepDataTitle.personalInfoFillIn` → `PersonInfo`：个人信息填报；
4. `stepDataTitle.journeyInfoFillIn` → `Step3`：行程信息填报；
5. `stepDataTitle.mycolleaguesFillIn` → `Step4`：同行人信息填报。

不能把 `Selecting Entry Category`、回执等翻译词条拼进这个数组，写成固定六步。回执是后续产出。其他条件分支的步骤可能不同。

指南八张卡按普通组件的先后顺序排列：护照上传；出生日期；证件号码；个人联系电话；邮箱；入境日期；境内地址；邀请方联系方式。分为上传、基本信息、个人信息、行程信息四组。

因此 `meta.field_count = 8`、`meta.sections = 4` 表示**本站指南选列及分组**，不是官方全表字段总数，也不是官方步骤总数。`fields_intro_*` 与 `fields_walkthrough_*` 必须说明这一范围及条件分支。主控追加授权 H1 可选覆写：`fields_title_en/zh` 显示“护照上传与常见资料项”，未设置的国家保留原模板标题。

旧卡片 `contact_number_in_china` 在历史 rules 中出现 `jndh`，但本次没有找到普通流程对应控件，已替换成证件上传卡；不再说普通游客可填酒店电话。

## 真实上传路径

| 控件 / 函数 | 证据 | 结论 |
| --- | --- | --- |
| 护照 `el-upload` | offset 190813：`accept="image/jpeg, image/png"`，绑定 `beforeUpload` | 护照只接受 JPEG/PNG |
| 护照 `beforeUpload` | offset 188940：默认 MIME 白名单二者；读取、转换为 JPEG、调用压缩后判断 `e.size > 102400` | 102400 bytes 检查的是压缩结果，不能写成原图必须先小于 100KB |
| 说明材料 `el-upload` | offset 283970：`accept="image/jpeg, image/png, .pdf"`，绑定 `beforeUploadFile` | PDF 是说明材料路径 |
| 说明材料 `beforeUploadFile` | offset 276955：PDF 直接判断原始 `size > 102400`；图片仍先压缩 | 不能将说明材料规则用于护照 |

本次再次调用**原官方护照函数**，传入合成的 1KB PDF 对象，实际拒绝并返回 `rule.imgFileFormat`。未上传个人证件。没有测试真实图片压缩及服务器接受，也没有“小文件一定通过”的结论。

## 八张卡及邀请信息的实际约束

| 项目 | 控件 / 规则证据 | 保留的说法 |
| --- | --- | --- |
| 出生日期 | BaseInfo `birthDate` 控件 offset 264570；rules offset 257581 为 required | 按证件核对，使用官方日期控件。不同日期控件不能统一归因为一个已验证正则 |
| 证件号码 | BaseInfo `idNumber` 控件 offset 265761；同组件 rules 为 required | 必填、核对证件；不编各国护照通用格式 |
| 个人联系电话 | PersonInfo `jwdh` 控件 offset 279892，`v-input.phone`、`maxlength="30"`；rules offset 272256 为 required | 必填，只保留 `+` 和数字，最多 30 字符 |
| 邮箱 | PersonInfo `email` 控件 offset 280329；同组件 rules 为 optional，`validator:S.a`、`trigger:"blur"` | 选填；填后离开控件会查格式 |
| 入境日期 | `rjrq` 控件 offset 219588，`el-date-picker value-format="yyyy-MM-dd"`；rules offset 209482 为 required | 必填，采用 YYYY-MM-DD；不据此宣称所有日期都由同一正则验收 |
| 境内行政区划 | `zhzzxzqhdm` rules offset 209730 为 required，并检查选择到有效末级 | 地址行政区划必须选择 |
| 详细地址 | `zhxxzz` 控件 offset 225115，`v-input.byte_limit=100`，`placeholder=$t("form.zhxxzz")` | 100 字节；街道示例是占位提示，没有证据证明能自动识别所有笼统地址 |
| 是否有邀请方 | `zfsfyq` 控件 offset 225648；分支 offset 226073 为 `formData.zfsfyq === "1"` | 先如实回答是否有邀请单位/邀请人 |
| 邀请类型 | `yqType` 控件 offset 226106 在邀请分支 required | 选择单位或个人 |
| 邀请单位名称 | `zfyqdw` 控件 offset 226527：`yqType === "1"` 时显示且 required；字节限制 200 | 有邀请单位时名称必填，最多 200 字节 |
| 邀请人姓名 | `zfyqr` 控件 offset 227142：`yqType === "2"` 时显示且 required；字节限制 32 | 有个人邀请人时姓名必填，最多 32 字节 |
| 邀请方电话 | `zfyqlxdh` 控件 offset 227773：邀请分支内 required；`v-input.num`、`maxlength="12"`；标签按邀请类型切换 | 分支内必填，只保留数字，最多 12 字符。不能复用个人电话的 +/30 规则 |

个人电话指令 `phone` 的原实现 offset 142723 会移除 `+` 和数字之外的字符。邀请电话绑定另一条 `num` 指令。字节指令 `byte_limit` offset 143881 按计算结果截断，不应写成字符数上限。

邮箱验证函数属于模块 `61f7`，函数 offset 185829；PersonInfo 引用该模块。旧 regex 确实存在，但公共校验器 email 分支不执行这条 pattern，不能据此挂站内预检。修订后页面不展示“所有规则都可在本站复现”的承诺。

住宿地址与邀请方是两个问题。只预订酒店不能推导出存在邀请单位；有真实邀请方时按实际名称、邀请类型和联系方式填。`required: false` 已从邀请联系方式的数据中移除，以条件说明表达。

## 错误、占位文字与中文文案

- `rule.imgFileFormat`：英文 `Only JPG and PNG image formats are allowed`；中文 `只允许上传jpg、png格式的图片`。实际护照函数会调用。
- `rule.imgFileSize`：英文 `File size cannot exceed 100kb`；护照路径为压缩结果检查。
- `rule.imgPdfFileFormat`：英文 `Please upload JPG or PNG images or PDF files`；实际说明材料路径调用，不是护照错误。
- `rule.fileSize` 英文也为 `File size cannot exceed 100kb`，但说明材料 PDF 分支检查原文件。相同消息不能等同于相同上传路径。
- `rule.email`：英文 `The email format is invalid`；中文 `邮箱格式不合法`。普通个人信息组件 rules 确有绑定。
- `form.zhxxzz` 的详细地址示例、`rule.zfyqdw` 的单位名提示在对应 input 中是 **placeholder**，已从错误解码列表移除。
- 公开 bundle 包含中文规则文案。撤销旧版“中文界面错误未公开”的说法；没有逐字段提取的文案不能编成官方原话。

## 本站预检与验收边界

中国四个主表/填写页面不挂 validator。公共组件的 text 分支、email 分支和 phone 分支与中国数据不兼容；本批不修改公共 JS，不新增依赖，不造校验正则。

规则 JSON 现用于字段卡元信息，实际判定仍在官方表单。选列示例用于填报前核对，不构成服务器接受或拒绝保证。

没有完成：全表提交；真实证件图片上传；全部邀请、同行人或特殊入境分支；回执邮件送达；提交后更正流程；其他官方渠道逐个对照。构建、SEO、内容修订、主控复核与发布必须分别记录。
