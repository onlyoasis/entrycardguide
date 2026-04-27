# entrycardguide 贡献者指南

欢迎来帮 entrycardguide 写完 V1.5 的内容。

这个站点的目标很简单：让搜 *"thailand TDAC"*、*"is iVisa official"*、*"巴厘岛海关表"* 的人，第一时间找到官方政府表单的真实网址，并且不再被中介加价。

每完成一份下面的任务，搜索结果里就少一个被骗的人。

---

## 给新贡献者：先读这五件事

### 1. 项目长什么样

- **静态站**，由 [Hugo](https://gohugo.io) 构建
- 内容是 markdown，分两种语言（默认英文 + 中文 `.zh.md` 后缀）
- 数据驱动：每个国家有一份 JSON（字段规则）+ 一份 TOML（官方网址 / 已知假站名单），所有页面通过 shortcode 引用
- 部署：每次 `git push main` 触发 GitHub Actions，自动构建后用 `wrangler` 推到 Cloudflare Pages，全程 < 1 分钟

### 2. 本地跑起来

```bash
# 一次性
brew install hugo
npm install

# 日常
npm run dev       # 本地预览 http://localhost:1313
npm run build:prod  # 生产构建
npm run check:seo   # SEO 验证（CI 也跑这个）
```

### 3. 现有内容的样板

每个国家的页面结构基本一致，挑一个看就懂全部：

```
content/thailand/
  _index.md            # 国家枢纽页
  _index.zh.md         # 中文版
  tdac.md              # 主介绍文章（英）
  tdac.zh.md           # 主介绍文章（中）
  how-to-fill.md       # 字段逐项填写（英）
  is-ivisa-official.md # 「iVisa 是不是官方？」（英）
```

写新内容**不要凭空想**，照样板的结构和语气写。具体见每个 task 文档。

### 4. 写作风格规则

不要用："**delve**, **crucial**, **comprehensive**, **nuanced**, **furthermore**, **moreover**" 这类 AI 八股词。
不要用：「**关键在于**」「**让我来分解一下**」「**重要的是**」「**值得注意的是**」这类废话开场。
不要用：长破折号 `—` 单独成句，请改用句号或逗号。

要用：
- 短句。具体数字。具体文件名。具体规则。
- "is X official" 这种**真实搜索 query** 作为标题靶向
- 用真用户视角讲（"如果你已经付了中介..."）
- 政府表单的真实约束（字符上限、日期格式、API 错误信息）

### 5. 提交流程

1. fork 仓库，建一个分支（`feat/vietnam-how-to-fill` 这种）
2. 写文件，本地 `npm run build:prod && npm run check:seo` 都过
3. push 到你的 fork，开 PR 到 `main`
4. CI 自动跑构建。绿了 → reviewer 看 → 合并 → 自动部署
5. 当天上线 `entrycardguide.com`

---

## 当前任务清单

下表里**已完成 ✅** 的任务是给后续贡献者参考用的（不要重做）。**待做 🔵** 是开放工单，你可以挑一个 PR。

| # | 任务 | 状态 | 估时 | 难度 |
|---|---|---|---|---|
| 01 | "Is iVisa official" 详解（V/I/S 三国）| ✅ 已完成 | — | — |
| 02 | 字段填写详解（10 篇）| ✅ 已完成 | — | — |
| [03](./tasks/03-scam-site-screenshots.md) | 假站真实截图（16 张）| 🔵 待做 | 1.5–3 小时 | ⭐ |
| [04](./tasks/04-affiliate-links-revenue-integrity.md) | 联盟链接 / 收入完整性 | 🔵 待做 | 2–4 小时 | ⭐⭐ |
| [05](./tasks/05-bing-webmaster-tools.md) | Bing Webmaster Tools 提交 | 🔵 待做 | 10 分钟 | ⭐ |
| [06](./tasks/06-changelog-and-freshness.md) | 变更日志 + 新鲜度信号 | ✅ 已完成 | — | — |
| [07](./tasks/07-about-methodology-section.md) | About 页方法论部分（信任叙事核心）| ✅ 已完成 | — | — |

---

## 你需要的访问权限

| 任务 | 仓库 PR | Cloudflare | 第三方账号 |
|---|---|---|---|
| 03（截图）| ✓ | 不需要 | 可选：第三方截图服务的免费 tier |
| 04（联盟）| ✓ | 需要 dashboard 权限设置 env vars | **需要**（站长 SafetyWing + Airalo 申请） |
| 05（Bing） | 不需要 PR | 可选：DNS API token（如选手动验证）| **需要**（站长的 Microsoft 账号） |
| 06（变更日志）| ✓ | 不需要 | 不需要 |
| 07（方法论）| ✓ | 不需要 | 不需要 |

---

## 卡住了找谁

- 仓库结构 / Hugo 模板问题：看 `layouts/` 下的注释，已经写得很详细了
- 写作风格 / 内容判断：先参考样板文件
- 实在卡住：在仓库 [Issues](https://github.com/onlyoasis/entrycardguide/issues) 开一个 question 标签的 issue
- 紧急 / 凭证 / 法务：邮件给项目维护者
