---
title: "如何核实本站的每一条说法"
kicker: "五条独立核查路径。不需要相信我们。"
description: "entrycardguide.com 每一类说法背后的完整方法论。任何人都可以核查，不需要账号。"
date: 2026-04-27
lastmod: 2026-04-27
url: "/zh/trust/"
---

这是[关于页方法论部分](/zh/about/#methodology)的长版。短版是：不要相信文案，直接查文件。

## 路径 1：核实任何官方网址

所有官方网址都在 [`data/official_urls/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/official_urls)。打开某个国家的文件，例如 [`data/official_urls/thailand.toml`](https://github.com/onlyoasis/entrycardguide/blob/main/data/official_urls/thailand.toml)，看对应表单的记录。

每条记录都写明网址、运营机构、最近核实日期，通常还有存档快照。以泰国 TDAC 为例，文件里有 `tdac.immigration.go.th`、泰国皇家移民局，以及 `.go.th` 后缀为什么重要的说明。

你可以这样核查：

1. 对比 TOML 里的 URL 和页面上显示的官方链接。
2. 打开 `archive_url`，确认那个日期该站点确实存在。
3. 打开今天的政府官网，核对域名后缀和机构信息。

如果三者对不上，页面就应该修。

## 路径 2：核实任何字段规则

校验器由 [`data/rules/`](https://github.com/onlyoasis/entrycardguide/tree/main/data/rules) 里的 JSON 规则驱动，不靠隐藏的服务器逻辑。打开 [`data/rules/thailand.json`](https://github.com/onlyoasis/entrycardguide/blob/main/data/rules/thailand.json)，你会看到字段、必填规则、正则、长度限制和错误提示。

你也可以自己核查一条规则：打开官方表单，用 Chrome 检查某个输入框，对比 HTML 属性和 JSON。重点看 `maxlength`、`pattern`、`required`、输入类型，以及官方站返回的错误文字。

官方站一旦改字段，最应该变化的就是这个 JSON 文件。所以每份规则都有核实日期，校验器也会链接回源码。

## 路径 3：核实假站名单

假站警告存在官方 URL TOML 文件里的 `[[scam_sites]]` 数组中。每条都有域名、首次观察日期和证据说明。

规则很简单：列入时，域名必须能通过 DNS 解析。它还必须有证据显示正在为免费表单收费、模仿官方流程，或出现在公开警告和新闻报道中。如果域名不再解析，我们会删除，而不是留一个过期警告撑场面。

提交 [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) 就是这样做的：DNS 审计后删除了 13 个失效域名。短一点但还能核实的名单，比一长串旅客打不开的域名更有用。

你可以用 `dig example.com` 或 `nslookup example.com` 复查，再和 TOML 里的证据说明对照。

## 路径 4：核实校验器只在本地运行

打开一个带校验器的指南，再打开 DevTools 的 Network 面板。往校验器里输入测试数据。页面不应该发出任何携带你输入内容的请求。

校验器源码在 [`assets/js/validator.ts`](https://github.com/onlyoasis/entrycardguide/blob/main/assets/js/validator.ts)。页面把国家规则作为 JSON 嵌入，脚本在你的浏览器里解析，校验也在本地完成。

本站没有账号系统，没有数据库，也没有接收草稿表单数据的接口。如果未来有人改出这样的接口，它应该同时出现在源码和 Network 面板里。

## 路径 5：核实整个站点

[`github.com/onlyoasis/entrycardguide`](https://github.com/onlyoasis/entrycardguide) 就是这个站。Markdown 页面在 [`content/`](https://github.com/onlyoasis/entrycardguide/tree/main/content)，结构化数据在 [`data/`](https://github.com/onlyoasis/entrycardguide/tree/main/data)，模板在 [`layouts/`](https://github.com/onlyoasis/entrycardguide/tree/main/layouts)，浏览器端代码在 [`assets/js/`](https://github.com/onlyoasis/entrycardguide/tree/main/assets/js)。

本地复现方式：

```powershell
git clone https://github.com/onlyoasis/entrycardguide.git
cd entrycardguide
npm ci
hugo server --gc --disableFastRender
```

本地站点应该和线上站点一致，页脚显示的部署提交除外。如果你发现旧信息、失效的官方网址，或已经无法解析的假站警告，请带着具体失败的文件开 [issue](https://github.com/onlyoasis/entrycardguide/issues) 或 PR。
