# ETIAS 接入设计

日期：2026-09-05
状态：待用户拍板（第 3 节有一个必须由用户决定的分叉）
上位设计：`docs/superpowers/specs/2026-07-13-country-expansion-design.md`
相关：`docs/superpowers/plans/2026-09-05-batch5-china.md`（批次 5 的事故教训写在第 7 节）

---

## 1. 为什么现在做

ETIAS 官方口径是 **2026 年第四季度上线，确切日期尚未公布**
（`travel-europe.europa.eu` 与 `home-affairs.ec.europa.eu`，2026-09-04 读取正文）。
距今最多三个多月。

本站的处境决定了这是唯一一次能和中介同时起跑的机会：外链为 0，域名权重低，
在已固化的搜索结果里抢不动位置（主表页普遍 p32–p88）。ETIAS 的表还没上线，
没有任何人有"填过这张表"的内容。

需求形状已经测过（2026-09-04，Google autocomplete a–z 展开）：

| seed | 切题补全 | 填写意图 query |
|---|---:|---:|
| `etias` | 375 | 5 |
| `italy etias` | 87 | **0** |
| `france etias` / `spain etias` / `portugal etias` | 75 | **0** |
| `greece etias` | 40 | **0** |
| `germany etias` | 29 | **0** |

当前真实 query 是 `etias 2026`、`etias active yet`、`etias start date`、
`etias how to apply`、`etias and ees`——**问的是"开始了没有"，不是"怎么填"**。

> 指标口径提醒：`etias` 是 5 字符短 seed，补全总数不可与多词 seed 比较
> （控制实验：`esta` 393 补全但仅 264 曝光，`sgac` 337 却有 3,167 曝光，排序是反的）。
> 上表里**只有 `{国家} etias` 那几行之间以及它们与 `etias` 的"填写意图"列可比**。
> 不要用 375 这个数论证 ETIAS 需求大于任何已收录国家。

---

## 2. 核心问题

ETIAS 是**一张授权覆盖 30 个欧洲国家**，而本站的数据模型假设
"一个 key = 一个国家 = 一张表"：

- `layouts/partials/country-roster.html` 的每行 dict 有 `key/en/zh/flag/formKey/formCode/guideSlug/fee`
- `data/official_urls/{key}.toml`、`data/rules/{key}.json`、`data/fields/{key}.toml`
- `data/decision/tree.json` 的 `states.country.options`，result 节点有 `country` 字段
- 路由 `/{key}/`、`/{key}/{guide_slug}/`、`/{key}/how-to-fill/`

好消息：**代码层面这套模型是 key 无关的**（已核对）。`official-link` 只要求
`data/official_urls/{key}.toml` 里有对应节名；`decide.ts` 的 `Result.country` 只当标识符用；
`list.html` 按 `form_type` 选副标题。没有任何模板硬编码"必须是国家"。

坏消息在第 3 节。

---

## 3. 需要用户拍板：站点的"国家数"口径

两处模板直接用 `len $countries` 对外声明数量：

- `layouts/partials/footer-commit.html:20` → `全部 {N} 个国家 →` / `All {N} countries →`
- `layouts/index.llms.txt:19,21` → `共收录 {N} 个国家` / `{N} countries`

把 ETIAS 作为一行加进 roster，站点就会声称有 54 个"国家"，
而其中一行是覆盖 30 国的授权。**这是事实性错误，本站不能这么写。**

三个选项：

**A. 加进 roster，改计数口径（推荐）**
roster 那行加一个 `kind = "authorization"` 字段，上面两处计数改成只数 `kind` 不等于
`authorization` 的行，文案维持"国家"。ETIAS 照常出现在首页网格、导航下拉、页脚、
官方目录、decide 无 JS fallback，一处不用单独接。
代价：动两个共享模板（`footer-commit.html`、`index.llms.txt`），
且国家扩展任务书一贯禁止执行方碰 layout——这一步必须主控方自己做，不能派单。

**B. 加进 roster，把文案从"国家"改成"目的地"**
要同时改 `i18n/en.yaml` 和 `i18n/zh.yaml`（加 key 必须两个文件都加），
以及 `nav_countries`、`decide_no_js`、`footer_popular_countries` 等既有措辞。
波及面比 A 大，收益只是措辞更准。不推荐。

**C. 不进 roster，`/etias/` 单独成页**
零共享改动，但失去首页网格、导航、页脚、官方目录、decide fallback 的自动接入，
每一处都要单独硬编码——正好是 roster 当初被设计出来消灭的那类重复。不推荐。

**建议 A。**在用户确认前，本设计后续章节按 A 描述。

---

## 4. 决策：一个实体，不做 30 个国家页

`key = "etias"`，路由 `/etias/`、`/zh/etias/`。

**不给法国、西班牙、意大利等 30 国各建一页。**依据是第 1 节的实测：
`{国家} etias` 的填写意图全部为 0，需求集中在裸词。
30 个国家页会产出 90 个中英页面，全部落在本站已知的"排名很好但没人搜"区间
（GSC 365 天里有 44 页排名 ≤10 而曝光 <60）。

30 国名单写在 `/etias/` 页正文和 `data/official_urls/etias.toml` 的 notes 里，
不拆成路由。

---

## 5. 决策：两阶段，现在只做第一阶段

### 阶段一（现在）：状态页，没有 how-to-fill

**表还没上线，站点不能发布一份"怎么填"的指南。**
`layouts/_default/how-to-fill.html` 的默认导语原文是
*"With the exact regex the official site enforces, the error message it returns"*，
对一个不存在的表单，这句话是假的。

批次 5 的中国事故正是这个类别的教训（`docs/reports/2026-09-05-china-review.md`）：
把 i18n 词条当运行时流程拼出"6 步"，实际是 5 步；把同一 bundle 里相邻控件的错误字符串
归到护照上传字段。**没有真实运行时就不写字段级断言，这条对 ETIAS 是硬约束，
因为连 bundle 都还没有。**

阶段一交付：

| 文件 | 内容 |
|---|---|
| `content/etias/_index.md` / `.zh.md` | 枢纽 |
| `content/etias/etias.md` / `.zh.md` | 主页面（`layout: country-form`） |
| `data/official_urls/etias.toml` | 官方 URL、机构、费用、生效日期、30 国名单 |
| `data/changelog/etias.toml` | 变更日志 |
| roster 一行 + 决策树节点 | 见第 6、7 节 |

**阶段一不创建 `data/rules/etias.json` 和 `data/fields/etias.toml`，
不创建 `content/etias/how-to-fill.md`，不挂 `{{< validator >}}`。**
`layouts/_default/how-to-fill.html` 强依赖 `data/fields/{key}.toml`，
不建这两份文件就不会有 how-to-fill 页，构建不会炸。

主页面要回答的，就是实测到的那几个 query：

- **开始了没有**（`etias active yet` / `etias start date` / `etias 2026`）
- **要不要办**（哪些护照需要、哪 30 个国家、爱尔兰和英国不在其中）
- **多少钱**（€20，以及未成年/高龄的费用豁免）
- **和 EES 什么关系**（`etias and ees`）——EES 自 2026-04-10 起全面运行，
  且**不需要旅客填任何表**，这是高频混淆点
- **现在能不能申请**——不能。这一条是当前最有用的事实，也是本站定位的核心

### 阶段二（上线当周触发）

触发条件：欧盟公布确切启用日期，且申请入口实际可访问。

届时补 `data/rules/etias.json`、`data/fields/etias.toml`、
`content/etias/how-to-fill.md` / `.zh.md`，并按第 8 节的红线决定是否挂 validator。

---

## 6. 数据模型映射（阶段一）

roster 那一行（追加到 slice 末尾，order = traffic）：

```
(dict "key" "etias" "en" "ETIAS (Europe)" "zh" "欧洲 ETIAS" "flag" "🇪🇺"
      "formKey" "etias" "formCode" "ETIAS" "guideSlug" "etias" "fee" "paid"
      "kind" "authorization"
      "subEn" "30 countries, one authorisation" "subZh" "30 国共用一张授权")
```

`flag` 用 🇪🇺 是简写，**不准确**：ETIAS 的 30 国包含瑞士、挪威、冰岛、列支敦士登
这些非欧盟国家。正文里必须写清楚覆盖范围，不能让读者以为"欧盟 = ETIAS"。

`[meta]` 取值：

```
form_type = "travel_authorization"     # 不是 evisa。ETIAS 不是签证
fee_en    = "EUR 20"                   # 非 "Free"，list.html 会按付费渲染
form_key  = "etias"
guide_slug = "etias"
```

`form_type = "travel_authorization"` 会让 `layouts/_default/list.html:50` 给枢纽页生成
"the official paid travel authorisation, and how to spot the middlemen who mark it up"
这句副标题。措辞与本站定位一致，可用。

`field_count` / `sections` / `time_needed_*` 这几个键是 how-to-fill 布局用的，
阶段一没有 how-to-fill 页。**如果不写会让别的模板取到空值，先实测再决定是否补占位值，
不要凭猜填一个数字。**

---

## 7. 决策树接入

`states.country.options` 追加**一项**，不是 30 项：

```
{"value": "etias", "label": "Europe — Schengen area + Cyprus (ETIAS)", "next": "etias_status"}
```

首问 label 目前是 "Where are you going?"，这一项混在 53 个国家名里可以接受。

`etias_status` 先问资格（本站的资格先行惯例，`spec` 3.4）：
"你的护照进入这 30 国是否免签？" → 免签路径走 ETIAS 流程；需要申根签证的路径
返回 `forms: []`，note 说明该护照走使馆签证，ETIAS 不适用。

**上线前，ETIAS 路径的 result 也必须是 `forms: []`**，note 写明尚未开放申请、
公布日期后再来。给一个还不能申请的表挂"去申请"按钮，是本站最不该犯的错。

---

## 8. 红线

1. **不写任何字段级填写指导，直到表单真实可访问。**
   不从法规文本、新闻稿、FAQ 或任何中介站的"表单预览"推断字段、长度、格式或报错文案。
2. **不挂 `{{< validator >}}`。**
   阶段二要挂之前，必须先加载构建产物 `public/js/validator.*.js`，
   调用其真实导出 `window.__entrycardguide_validator.validateField` 跑一遍 ETIAS 数据，
   确认它真的执行了所声称的约束。中国就是漏了这一步：`type:"text"` 落进无条件成功的
   default 分支，必填留空显示 `OK ✓`，而页面印着"官方正则"。
3. **不点名任何第三方中介公司。**站点 2026-08-10 已下线中介名单，理由是法律风险。
   可以陈述"目前无法申请、任何声称现在能代办的都不是官方入口"这一事实，不点名。
4. **费用与日期只写官方公布的。**€20 已由欧盟委员会 2025-07-17 确认；
   确切启用日期尚未公布，**不许从二手报道里抄一个日期**。
5. **不做 30 个国家页。**
6. **共享模板改动（第 3 节方案 A）由主控方自己做，不派给执行方。**

---

## 9. 待核查清单（交给执行方，逐条自己查）

本节故意**不给结论**（全局规则 8.1）。下面每条都要打开官方页面读正文确认，
查到的与本文档不符时以实际为准并报告差异：

1. ETIAS 官方入口域名与页面（欧盟官方，注意与大量仿冒域名区分）
2. 确切启用日期是否已公布；若已公布，来源页面与原句
3. 费用金额、币种、支付时点、退款规则
4. 费用豁免的年龄边界与判定时点
5. 覆盖的 30 个国家/地区完整名单，以及**不在其中**的欧洲国家（爱尔兰、英国等）
6. 有效期规则（年限、与护照有效期的关系）
7. 哪些护照需要 ETIAS、哪些需要申根签证
8. 是否有过渡期/宽限期——**二手报道提到 2027 年 4 月强制，未经官方确认，属待核**
9. EES 与 ETIAS 的关系，以及 EES 是否需要旅客填表
10. 申请后的产物形态（是否与护照绑定、是否需要打印）

---

## 10. 风险

- **日期滑动。**EES/ETIAS 已经多次改期。页面结构要让"改一个日期"是改
  `data/official_urls/etias.toml` 一行，不是重写正文。所有日期与费用走 data 文件。
- **抢跑写成了猜测。**阶段一的价值全在"如实说明现在还不能申请"。
  一旦为了看起来完整而补上猜测性的填写指导，本站就变成了它反对的那种页面。
- **🇪🇺 旗标与 30 国范围不符。**见第 6 节，正文必须消歧。
- **`index.llms.txt` 仍在统计 `scam_sites`**（`layouts/index.llms.txt:13`），
  那是 2026-08-10 下线中介名单后的遗留死代码，当前所有新国家都不写这个数组。
  本设计不修它，仅记录。
