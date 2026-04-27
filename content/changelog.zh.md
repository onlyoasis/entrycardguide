---
title: "变更日志"
description: "entrycardguide.com 的重要变更：政府政策更新、新国家、内容勘误和假站审计。"
date: 2026-04-27
lastmod: 2026-04-27
url: "/zh/changelog/"
---

这里记录实质性更新。出现这些情况时，我们会新增一条：

- 政府移民机构修改表单字段、费用或适用规则
- 新国家上线数字入境卡，我们开始覆盖
- 我们发现并修正已有指南中的事实错误
- 我们新增或移除 `scam_sites` 假站名单里的域名

我们**不会**记录每个错别字或样式微调。那些可以看 [git 历史](https://github.com/onlyoasis/entrycardguide/commits/main)。

---

## 2026-04-27 - 方法论和新鲜度信号上线

在 `/zh/about/` 增加公开方法论，在 `/zh/trust/` 增加长版核查页面，并在文章侧栏显示内容新鲜度。侧栏现在会显示每篇指南最近核实的时间，并链接回这份变更日志。

- 新增：`/trust/`、`/zh/trust/`、`/changelog/`、`/zh/changelog/`
- 更新：`/about/`、`/zh/about/`、文章侧栏新鲜度徽章
- 新增：月度维护清单和各国家 changelog TOML 文件

---

## 2026-04-26 - 新增越南、印度尼西亚、新加坡

新增三个国家，并提供完整英文和中文内容。越南是本站第一个底层表单确实有政府费用的国家，所以叙事重点是“中介加价”，不是“免费表单被转卖”。

- 新增：`/vietnam/`、`/indonesia/`、`/singapore/`
- 新增：每个国家的主指南、填写指南和 iVisa/官方站解释页
- 更新：站点导航现在列出七个国家

---

## 2026-04-26 - 假站 DNS 审计

重新审计已知假站域名，并删除失效条目，不保留过期警告。提交 [`6c841f3`](https://github.com/onlyoasis/entrycardguide/commit/6c841f3) 删除了 13 个 DNS 检查失败的域名。

- 更新：`data/official_urls/*.toml`
- 规则：只列出审计时仍能解析、且有证据说明的域名

---

## 2026-04-25 - SEO 输出检查和站点地图验证

增加 robots.txt 和 sitemap 生成后的自动检查，避免 Cloudflare Pages 发布后影响 Google Search Console。

- 新增：`scripts/check-seo-output.mjs`
- 更新：GitHub Actions 在生产构建后运行 SEO 检查
- 已验证：根 sitemap index 和各语言 sitemap 正常生成

---

## 2026-04-22 - 新增泰国 TDAC

发布第一个国家。覆盖 `tdac.immigration.go.th` 的 TDAC 全流程，说明泰国移民局在 2026 年 3 月公开点名的 iVisa 中介问题，并加入浏览器本地校验器。

- 新增：`/thailand/tdac/`、`/thailand/how-to-fill/`、`/thailand/is-ivisa-official/`
- 新增：`data/official_urls/thailand.toml`、`data/rules/thailand.json`

---

## 如何理解审计日期

每个国家的 `data/official_urls/{country}.toml` 都有 `last_verified` 字段。每次我们对照真实官网重新核实时都会更新它。如果你看到某篇指南超过 90 天没有复核，请把它当成可能过期，并先去官方站自行确认。
