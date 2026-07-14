# 国家扩充阶段 0(地基修复)+ 阶段 1(USA 打样)实施计划

> **For agentic workers:** 本计划由 CodeX(gpt-5.6-sol,reasoning high,workspace-write)逐任务执行;Claude 负责任务间验证与提交。Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复四个阻碍新增付费授权类国家的模板裂缝,然后以 USA ESTA 跑通完整的新国家链路(11 国 → 12 国)。

**Architecture:** Hugo 静态站,数据驱动。国家名单单一数据源 = `layouts/partials/country-roster.html`;每国数据 = `data/official_urls/{key}.toml` + `data/rules/{key}.json` + `data/changelog/{key}.toml` + `data/decision/tree.json` 节点。阶段 0 让 directory/decide/list 三处消费单一数据源并给 TOML 加 `form_type`;阶段 1 纯增量添加 USA。

**Tech Stack:** Hugo 0.160.1+ extended、Go template、TOML/JSON data、Tailwind(锁定调色板)、无浏览器端 npm 依赖。

**Spec:** `docs/superpowers/specs/2026-07-13-country-expansion-design.md`

## Global Constraints

- 写作风格:禁 `delve/crucial/comprehensive/nuanced/furthermore/moreover`;中文禁「关键在于/值得注意的是」类开场;短句、具体数字、真实表单约束(见 `docs/README.md`)
- 不改 `tailwind.config.js`;不加 `rounded-xl/rounded-full/shadow-*/bg-gradient-*`;调色板只有 ink/paper/rule/muted/verified/scam/mark/white
- 诈骗站:先在 TOML 加 `[[scam_sites]]`(带 `evidence` + `first_observed`),后在 markdown 用 `{{</* scam-site */>}}`,顺序颠倒会构建失败
- 英中文件成对(`x.md` + `x.zh.md`);新 i18n key 两个文件都加
- TOML `last_verified`、rules `lastVerified`、内容 frontmatter `lastmod` 三者同日
- 不 `git push --force`;每任务一个 commit
- 事实(URL/费用/字段规则)必须对官方网站核验后写入,HTTP 200 不算核验;来源写进 `source`/`notes` 字段
- 现有 11 国 key:thailand japan malaysia singapore vietnam indonesia korea philippines mexico dominican cambodia

---

## 阶段 0(分支 `feat/expansion-phase0`)

### Task 1: TOML meta 增加 form_type

**Files:**
- Modify: `data/official_urls/*.toml` 全部 11 个文件的 `[meta]` 段

**Interfaces:**
- Produces: `meta.form_type`,取值 `"arrival_card" | "travel_authorization" | "evisa"`,Task 2/5 与阶段 1 消费

- [ ] **Step 1:** 在每个 TOML 的 `[meta]` 段末尾(`suffix` 行之后)加一行 `form_type`:
  - `vietnam.toml` → `form_type = "evisa"`
  - 其余 10 国(thailand japan malaysia singapore indonesia korea philippines mexico dominican cambodia)→ `form_type = "arrival_card"`
- [ ] **Step 2:** 验证:`grep -c 'form_type' data/official_urls/*.toml` 每文件恰好 1;`npm run build:prod` 成功
- [ ] **Step 3:** Commit: `refactor(data): add form_type to country TOML meta`

### Task 2: official-directory.html 消费 roster

**Files:**
- Modify: `layouts/shortcodes/official-directory.html`(整文件替换 1–14 行的硬编码数组,并改 fee 单元格)
- Modify: `i18n/en.yaml`、`i18n/zh.yaml`(删除 `directory_fee_vietnam`)

**Interfaces:**
- Consumes: `partial "country-roster.html"`(字段 `key/en/zh/formKey/guideSlug/fee`)、TOML `meta.fee_en/fee_zh`
- Produces: 目录页国家顺序 = roster 顺序;新增国家零模板改动

- [ ] **Step 1:** 用以下内容替换文件头(第 1–14 行的 `$countries := slice ...` 整段):

```go-html-template
{{- $isZh := eq .Site.Language.Lang "zh" -}}
{{- /* Country list comes from the shared roster partial — the same source the
       homepage grid, header dropdown, and footer use. Adding a country there
       adds it here; no per-country edits in this shortcode. */ -}}
{{- $countries := partial "country-roster.html" . -}}
```

- [ ] **Step 2:** range 体内改字段引用:`index $countryData .form` → `index $countryData .formKey`;`printf "%s%s/" $countryPath .guide` → `printf "%s%s/" $countryPath .guideSlug`
- [ ] **Step 3:** fee 单元格(原第 40 行)替换为:

```go-html-template
          {{- $meta := $countryData.meta -}}
          <span>{{ if eq .fee "free" }}{{ i18n "directory_fee_free" }}{{ else }}{{ cond $isZh $meta.fee_zh $meta.fee_en }}{{ end }}</span>
```

- [ ] **Step 4:** 从 `i18n/en.yaml` 和 `i18n/zh.yaml` 各删除一行 `directory_fee_vietnam`(本改动后无引用)
- [ ] **Step 5:** 验证:`npm run build:prod && npm run check:seo` 全绿;`grep -c '<article' public/official-links/index.html` 输出 11;`grep 'USD \$25 single' public/official-links/index.html` 命中(vietnam 费用来自 TOML);`grep -rn 'directory_fee_vietnam' layouts i18n` 无输出
- [ ] **Step 6:** Commit: `refactor(directory): read countries from roster partial, fees from TOML`

### Task 3: decide.html 无 JS fallback 消费 roster

**Files:**
- Modify: `layouts/shortcodes/decide.html:38-50`(noscript 内硬编码 11 国列表)

**Interfaces:**
- Consumes: roster 字段 `key/en/formCode`

- [ ] **Step 1:** 将 `<ul>...</ul>` 内 11 个硬编码 `<li>` 替换为:

```go-html-template
      <ul>
        {{- range partial "country-roster.html" . }}
        <li><a href="{{ printf "/%s/" .key | relLangURL }}">{{ .en }} {{ .formCode }}</a></li>
        {{- end }}
      </ul>
```

- [ ] **Step 2:** 验证:`npm run build:prod` 成功;`grep -o '/cambodia/' public/decide/index.html | head -1` 命中;`grep -c '<li>' public/decide/index.html` ≥ 11
- [ ] **Step 3:** Commit: `refactor(decide): generate no-JS country list from roster`

### Task 4: scam-site.html 强制证据链

**Files:**
- Modify: `layouts/shortcodes/scam-site.html:31-33`(match 校验之后追加)

**Interfaces:**
- Produces: 构建时强制 `[[scam_sites]]` 条目 `evidence` 与 `first_observed` 非空,兑现 CLAUDE.md 承诺的"法律防线"

- [ ] **Step 1:** 在 `{{- if not $match }}...{{- end }}` 块之后插入:

```go-html-template
{{- /* Legal guardrail: an accusation without documented evidence must not
       build. first_observed may parse as a TOML date, so stringify first. */ -}}
{{- $evidence := $match.evidence | default "" }}
{{- if eq (trim $evidence " ") "" }}
  {{- errorf "scam-site shortcode: %q in data/official_urls/%s.toml has empty evidence. Document evidence before rendering." $domain $country }}
{{- end }}
{{- $firstObserved := printf "%v" ($match.first_observed | default "") }}
{{- if eq (trim $firstObserved " ") "" }}
  {{- errorf "scam-site shortcode: %q in data/official_urls/%s.toml has empty first_observed." $domain $country }}
{{- end }}
```

- [ ] **Step 2:** 负向验证:临时把 `data/official_urls/thailand.toml` 某条 `[[scam_sites]]` 的 `evidence` 改为 `""`,跑 `npm run build:prod`,预期构建失败且报错含 "empty evidence";改回后构建恢复绿色
- [ ] **Step 3:** Commit: `feat(scam-site): fail build when evidence or first_observed is missing`

### Task 5: 付费文案按 form_type 渲染

**Files:**
- Modify: `layouts/_default/list.html:13-25,46-55`(hero 标题)
- Modify: `layouts/index.html:235`(§02 底部汇总)

**Interfaces:**
- Consumes: Task 1 的 `meta.form_type`

- [ ] **Step 1:** `list.html` 在 `$isPaid` 旁增加 `$formType`(`with $countryMeta` 块内):

```go-html-template
{{- $formType := "arrival_card" -}}
```
并在 `{{- with $countryMeta -}}` 内加:
```go-html-template
  {{- $formType = .form_type | default "arrival_card" -}}
```

- [ ] **Step 2:** hero 标题 paid 分支(原 47–48 行)替换为:

```go-html-template
      {{- if $isPaid -}}
        {{- if eq $formType "travel_authorization" -}}
        {{ $countryName }} {{ $countryMeta.form_code }}{{ if $isZh }}：官方收费旅行授权，以及如何识别中介加价。{{ else }}, the official paid travel authorisation, and how to spot the middlemen who mark it up.{{ end }}
        {{- else -}}
        {{ $countryName }} {{ $countryMeta.form_code }}{{ if $isZh }}：官方收费电子签证，以及如何识别中介加价。{{ else }}, the official paid e-visa, and how to spot the middlemen who mark it up.{{ end }}
        {{- end -}}
      {{- else -}}
```

- [ ] **Step 3:** `layouts/index.html` 第 235 行汇总文案替换为:

```go-html-template
    {{ if $isZh }}{{ $freeCount }} 份免费政府表单 · {{ $paidCount }} 份政府收费的电子签或旅行授权。每张卡片都打开该国指南：官方网址、逐字段填法、诈骗核查。{{ else }}{{ $freeCount }} free government forms · {{ $paidCount }} paid government e-visas or travel authorisations. Every card opens the country guide: official URL, how to fill, scam check.{{ end }}
```

- [ ] **Step 4:** 验证:`npm run build:prod` 成功;`grep 'official paid e-visa' public/vietnam/index.html` 命中(vietnam 不变);`grep 'travel authorisations' public/index.html` 命中
- [ ] **Step 5:** Commit: `feat(templates): render paid copy by form_type instead of blanket e-visa`

### Task 6: 阶段 0 收尾验证

- [ ] **Step 1:** `npm run build:prod && npm run check:seo` 全绿
- [ ] **Step 2:** `node scripts/verify-official-urls.mjs` 通过
- [ ] **Step 3:** 抽查三页构建产物与 main 分支版本 diff,确认除本计划的措辞变更外无意外差异:`public/index.html`、`public/official-links/index.html`、`public/zh/vietnam/index.html`
- [ ] **Step 4:** 合并回 main(普通 merge,不 force)

---

## 阶段 1:USA 打样(分支 `feat/usa-esta`,基于合并后的 main)

**事实基线(执行时必须逐条对官方源复核,以官方页面为准):**

| 项 | 值 | 官方源 |
|---|---|---|
| 官方 URL | https://esta.cbp.dhs.gov/ | CBP |
| 机构 | U.S. Customs and Border Protection (CBP) | — |
| 费用 | USD $40(2025-09-30 起,原 $21) | help.cbp.gov |
| 适用 | VWP 约 40 国护照,海陆空入境均需 | travel.state.gov VWP 名单 |
| 有效期 | 2 年或护照到期(先到者) | esta.cbp.dhs.gov FAQ |
| 建议时限 | 最迟出发前 72 小时申请 | CBP |
| form_type | travel_authorization(不是签证,页面必须写明) | — |

### Task 7: data/official_urls/usa.toml

**Files:**
- Create: `data/official_urls/usa.toml`

**Interfaces:**
- Produces: `[esta]`(form_key 主条目)、`[vwp_info]`(travel.state.gov VWP 说明页)、`[meta]`(含 `form_type = "travel_authorization"`、`fee_en = "USD $40"`、`fee_zh = "40 美元"`、`suffix = ".dhs.gov"`、`primary_middleman = "iVisa"`)、`[[outcomes]]` ×3、`[[scam_sites]]`
- 结构样板:`data/official_urls/japan.toml`(字段名逐一对应);付费字段样板:`data/official_urls/vietnam.toml`

- [ ] **Step 1:** 照 japan.toml 结构创建,所有日期字段 = 执行当日
- [ ] **Step 2:** `[[scam_sites]]`:检索"esta application"类中介/仿冒站,**只收录 DNS 可解析、且能写出具体 evidence 的域名**(evidence 必须含:观察到的收费价格或误导性表述 + 观察日期);`first_observed` = 执行当日;至少 2 条,找不到合格证据就少收,宁缺毋滥
- [ ] **Step 3:** `[[outcomes]]` ×3 照 japan.toml 的 Case 1/2/3 模式:①买到的是代填服务(多付 $40 以上的服务费)②付费站代填成功但账号不在自己手里 ③付了钱什么都没收到
- [ ] **Step 4:** 验证:`npm run build:prod` 成功(TOML 语法);`node scripts/verify-official-urls.mjs` 通过
- [ ] **Step 5:** Commit: `feat(data): add usa official URLs, ESTA meta, scam sites`

### Task 8: data/rules/usa.json + data/changelog/usa.toml

**Files:**
- Create: `data/rules/usa.json`(结构样板 `data/rules/japan.json`)
- Create: `data/changelog/usa.toml`(结构样板 `data/changelog/japan.toml`,首条 entry = "USA guide published")

**Interfaces:**
- Produces: `{{</* validator country="usa" */>}}` 可用的字段规则;字段集合(以 ESTA 官方申请流程与 CBP help 页核对):`passport`(护照号,^[A-Z0-9]{6,15}$ 需核验)、`full_name`、`date_of_birth`、`email`、`phone`、`home_address`、`employer`(ESTA 要求雇主信息)、`us_contact`(美国联系人,可填 UNKNOWN)、`social_media`(自 2019 起为必答下拉,可选 none)。每字段带 `errors` 文案,来源写入顶层 `source`

- [ ] **Step 1:** 创建 rules/usa.json,`lastVerified` = 执行当日,与 TOML 同日
- [ ] **Step 2:** 创建 changelog/usa.toml
- [ ] **Step 3:** 验证:`npm run build:prod` 成功;`node -e "JSON.parse(require('fs').readFileSync('data/rules/usa.json','utf8'))"` 无异常
- [ ] **Step 4:** Commit: `feat(data): add usa field rules and changelog`

### Task 9: content/usa/ 八篇内容

**Files:**
- Create: `content/usa/_index.md` + `_index.zh.md`(国家枢纽,frontmatter 照 `content/japan/_index.md`)
- Create: `content/usa/esta.md` + `esta.zh.md`(主表介绍,weight 照 japan 的主表页)
- Create: `content/usa/how-to-fill.md` + `how-to-fill.zh.md`(逐字段,使用 `{{</* validator country="usa" */>}}`)
- Create: `content/usa/is-ivisa-official.md` + `is-ivisa-official.zh.md`(诈骗画廊,`{{</* scam-site */>}}` 只用 Task 7 已收录的域名)

**Interfaces:**
- Consumes: Task 7 的 TOML key(`{{</* official-link site="usa.esta" */>}}`)、Task 8 的 rules
- 内容要求:标题瞄准真实搜索 query("is ESTA free"、"esta official site");正文必须写清 ESTA 不是签证、$40 官方价、中介加价模式;英文版先写,中文版翻译而非直译(样板:japan 对应页)

- [ ] **Step 1:** 写 4 篇英文,frontmatter 的 `lastmod` = 执行当日
- [ ] **Step 2:** 写 4 篇中文对应
- [ ] **Step 3:** 验证:`npm run build:prod && npm run check:seo` 全绿(hreflang 成对、JSON-LD 合法)
- [ ] **Step 4:** Commit: `feat(content): usa country hub, esta guide, how-to-fill, scam gallery`

### Task 10: 决策树 + roster 接线

**Files:**
- Modify: `data/decision/tree.json`(country 节点 options 追加 usa;新增 `usa_passport` question + `usa_esta_result` / `usa_visa_result` 两个 result;`lastVerified` bump 到执行当日)
- Modify: `layouts/partials/country-roster.html`(**末尾**追加一行)

**Interfaces:**
- Consumes: tree.json 现有节点 schema(question: `label/options[].value/label/next`;result: `country/summary/forms[]/note`,forms 空数组 + `fallback_guide` 模式见 `mexico_air_major`)
- Produces: roster 行:

```go-html-template
  (dict "key" "usa" "en" "United States" "zh" "美国" "flag" "🇺🇸" "formKey" "esta" "formCode" "ESTA" "guideSlug" "esta" "fee" "paid" "subEn" "USD $40, not a visa" "subZh" "40 美元，不是签证")
```

- [ ] **Step 1:** tree.json:`usa_passport` 问 "Is your passport from a Visa Waiver Program country?"(options: yes → `usa_esta_result`;no / not sure → `usa_visa_result`)。`usa_esta_result`.forms = [{name "ESTA", fee "USD $40", url, guide "/usa/esta/", agency, deadline "At least 72 hours before departure"}];`usa_visa_result`.forms = [] + note 指向使馆签证 + `fallback_guide: "/usa/esta/"`
- [ ] **Step 2:** roster 末尾追加上面那行(不改动现有 11 行顺序)
- [ ] **Step 3:** 验证:`npm run build:prod` 成功;`grep -c '<article' public/official-links/index.html` 输出 12;首页 `grep 'United States' public/index.html` 命中;`grep 'usa_esta_result' public/decide/index.html` 命中
- [ ] **Step 4:** Commit: `feat(usa): wire decision tree and roster`

### Task 11: USA 收尾验证

- [ ] **Step 1:** `npm run build:prod && npm run check:seo && node scripts/verify-official-urls.mjs` 全绿
- [ ] **Step 2:** 人工核验:esta.cbp.dhs.gov 打开确认存活与文案;$40 费用与 help.cbp.gov 对照;VWP 名单说法与 travel.state.gov 对照
- [ ] **Step 3:** 本地 `npm run dev` 走查 4 个英文页 + 4 个中文页 + 首页卡片 + 目录行 + 决策树 USA 路径
- [ ] **Step 4:** 三日期一致性:`grep last_verified data/official_urls/usa.toml`、`grep lastVerified data/rules/usa.json`、`grep lastmod content/usa/*.md` 同日
- [ ] **Step 5:** 合并回 main

---

## 后续批次(本计划不含,按同一模式出计划)

PR 3: UK + Canada;PR 4: NZ + Australia(App-only 特殊建模);PR 5: India + Turkey(资格先行决策树)。见 spec。

## 执行偏差记录(2026-07-14 完成时补记)

1. **计划漏了第 5 份 data 文件**:`layouts/_default/how-to-fill.html` 强依赖 `data/fields/{country}.toml`(字段卡片展示数据)。已补 `data/fields/usa.toml`(9 字段,01–09,与 rules 同序)。后续批次的计划必须包含这份文件;CLAUDE.md 已同步修正。
2. **费用为 USD $40.27**,非计划基线的 $40:$4.00 处理费 + 获批后 $36.27(多源核验,2025-09-30 生效)。全站按 $40.27 落地。
3. **social media 字段为 Optional**(官方申请表标注),未采用基线的"必答";护照号未见官方长度规定,rules 用保守的 `^[A-Z0-9]{1,20}$` 并在 source 注明。
4. 目录 `<article>` 宽泛计数含 trust.html 外层容器,断言应按国家卡片计数(12)。
5. 决策树 deadline 文案统一为 "No later than 72 hours before departure"。
