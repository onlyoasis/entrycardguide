---
title: "关于我们"
description: "谁在运营 entrycardguide，为什么有这个站点，我们怎么赚钱，以及我们承诺永远不做的事。"
date: 2026-04-25
lastmod: 2026-04-25
url: "/zh/about/"
---

## 为什么有这个站点

本站列出的每个国家都有一份数字入境卡。每一份都是 **免费** 的。每一份都只在一个官方政府网址上提交。

而每一份的背后，Google 搜索结果的最前几条都坐着一群付费中介，向你索取 20 到 90 美元，去填一份只需要 8 分钟的免费表格。

2026 年 3 月，泰国皇家移民局公开声明：**约有 10% 的泰国外国入境者使用过非官方网站填写 TDAC 并多付了钱**。这个数字促成了这个项目。

我们想不通为什么没有人做这件显而易见的事：一份免费、独立、白话的指南，把每个国家的官方表单和假冒站点的截图放在一起，再附上一个巨大的指向真站的链接。所以我们自己做了。

## 我们是什么

- 一份独立的数字入境卡指南。
- 由真正填过每一份表的人撰写。
- 在官方站点变更时同步更新。
- 以静态站点形式托管。无账号、无登录、无数据库。
- 100% 开源。代码、字段规则、假站名单，全在 [我们的 GitHub 仓库](https://github.com/onlyoasis/entrycardguide)。

## 我们不是什么

- 不是泰国移民局、INM、DGM、马来西亚移民局，或任何政府机构。
- 不是旅行社。
- 不是签证中介。
- 与 iVisa、VisaHQ、Sherpa 或任何签证处理服务都没有任何关联。
- 不替你填表。我们不会拿你的护照，不会拿你的钱，不会拿你的数据。

<a id="methodology"></a>

## 如何核查我们

不要因为这个站看起来认真就相信我们。请直接看证据。

1. **官方网址存在有版本记录的 TOML 文件里。** 我们指向的每个政府网址都放在 [`data/official_urls/{country}.toml`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls)，不是藏在模板里。以泰国 TDAC 为例，文件里写着 `tdac.immigration.go.th`、运营机构、`last_verified` 日期和 Wayback Machine 存档。你可以同时对照 TOML、存档页和今天打开的官网。

2. **字段规则存在可检查的 JSON 里。** 校验器使用的规则放在 [`data/rules/{country}.json`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules)。这些文件记录字段长度、正则、必填项和官方表单返回的错误提示。页面上的校验器读取这些规则，不临时编建议。政府表单一变，JSON 就必须跟着变。

3. **假站警告要有 DNS 和证据。** TOML 里的每条 `[[scam_sites]]` 都有域名、首次观察日期和证据说明。我们只保留审计时仍能解析的域名。提交 [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) 在 DNS 审计后删掉了 13 个失效域名。少一点但真实的警告，比一长串已经死掉的域名更有用。

4. **校验器只在你的浏览器里运行。** 打开 DevTools 的 Network 面板，在校验器里输入内容，你会看到：不会有携带护照数据的外发请求。规则嵌在页面里，由 [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts) 在本地检查。我们不记录按键，不保存草稿，也不上传半填的表单。

5. **整个站点都在 GitHub 上。** 线上页面对应 [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content) 里的 Markdown 文件，数据变更对应提交记录。发现错误，可以看 [issues](https://github.com/onlyoasis/entrycardguide/issues)、PR 和 git 历史。更长的核查流程在这里：[如何核实本站的每一条说法](/zh/trust/)。

## 我们怎么赚钱

目前，符合条件的指南底部有一类联盟链接：

1. **SafetyWing 旅行保险**。你点击购买后，SafetyWing 会给我们一笔小额佣金。你支付的价格和直接去 SafetyWing 是一样的。

以后我们可能会加入 eSIM 链接，但只有在真实合作链接已经可用、且页面清楚披露时才会展示。

就这样。这就是全部商业模式。

我们 **从来没有** 收过 iVisa 或任何签证中介的钱。我们也永远不会，不是因为我们高尚，而是因为那样做会让本站存在的整个理由失效，我们喜欢这个理由。

## 我们的承诺

我们永远不会：

- 因任何与入境卡填写相关的服务向你收费。
- 收集或存储你在校验器里输入的任何数据。一切都在你的浏览器里运行。
- 把数据卖给或共享给任何第三方。我们没有数据可卖。
- 接受签证中介、移民顾问，或任何与我们指向的官方政府表单形成竞争的服务的广告。
- 隐瞒某国政策已变化的事实。规则变了，我们就更新页面，并在顶部打上日期。

我们会：

- 把官方网址放在每份指南的最顶端。
- 在官方表单变化时更新字段规则。每份规则文件都有 `lastVerified` 日期，可以在 [我们的 GitHub data 文件夹](https://github.com/onlyoasis/entrycardguide/tree/main/data) 审计。
- 在新国家上线数字入境卡且出现相同骗局模式时，加入新国家。
- 一旦发现某条信息错了，立即下架。给我们发邮件，我们当天就修。

## 错误与勘误

我们一定会出错。政府表单会变。新的假站会冒出来。老的假站可能悄悄变得合规。

如果你发现错误：

1. 在 [我们的 GitHub](https://github.com/onlyoasis/entrycardguide/issues) 上开一个 issue。
2. 或发邮件到 `corrections@entrycardguide.com`，告诉我们你看到了什么。

我们的目标是 48 小时内回复，一周内修复，安全相关的会更快。

## 谁做的

一支小小的旅行者和开发者团队。我们都至少付过一次中介，才搞清楚原来根本不需要付钱。这个站点是我们让下一个人不再走同样冤枉路的方式。

如果你觉得本站有用，并想支持它，下次购买旅行保险时，从符合条件的指南底部的联盟链接进去就好。这就能让本站继续运转下去。这就是我们全部的请求。
