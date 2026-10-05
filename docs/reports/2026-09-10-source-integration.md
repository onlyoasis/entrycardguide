# 2026-09-10 源码集成：三处模板冲突解决

范围：仅 `layouts/_default/how-to-fill.html`、`layouts/index.html`、`layouts/index.llms.txt`。
无 git 操作、无提交、无推送、无部署。其余合并改动未触碰。

## 冲突与取舍

### 1. layouts/_default/how-to-fill.html（h1 标题）

- HEAD：`font-size: clamp(36px, 5.6vw, 56px)` + `fields_title_en/zh` 覆盖逻辑。
- origin/main：去掉 clamp 的响应式 h1 样式，无标题覆盖。

**合并结果**：采用 origin/main 的样式（无 clamp，统一响应式布局），保留 HEAD 的
`fields_title` 覆盖分支——China 的诚实性文案（"passport upload and selected fields /
不是官方全表字段数"）依赖它。

### 2. layouts/index.html（国家计数）

- HEAD：`partial "country-count.html"`（排除 `kind = "authorization"`，ETIAS 不计国家数）。
- origin/main：`len $countries`，注释改为讲字段规则统计。

**合并结果**：保留 country-count partial（否则 53 目的地 + ETIAS 行会数成 54），注释采用
origin/main 的字段规则表述并补一句 non-country 行不计数的说明。

### 3. layouts/index.llms.txt（开头简介）

- HEAD：`$scamCount` 统计 + 提及"收费中介名单"的旧文案。
- origin/main：去掉中介名单表述的真实文案，但用 `len $countries`。

**合并结果**：采用 origin/main 文案（与 2026-08-10 移除中介名单的口径一致），计数改用
country-count partial。HEAD 的 `$scamCount` 变量在新文案中无消费点，随之移除
（属本冲突自产物，非删除无关代码）。

## 关键保留项

- 53 个目的地的国家数口径（kind=authorization 排除逻辑，`country-count.html`）
- China how-to-fill 的 `fields_title_en/zh` 标题覆盖 + `fields_intro` + `fields_examples_only`
- origin/main 的响应式 h1、首页四格统计（URL 数、字段规则数）、分享栏与 affiliate 位置（未触碰，merge 已带入）
- llms.txt 的真实文案（无中介名单表述）

## 验证（只读运行）

- `npm run build:prod`：通过（1281 ms）。
- `npm run check:seo`：通过（SEO output check passed）。
- `public/llms.txt`：`53 countries, 26 of them with a free government form`。
- `public/index.html` 四格：53 / 192 / 526 / 0（国家、官方 URL、字段规则、存储数据）。
- `public/china/how-to-fill/index.html`：h1 输出 "China Arrival Card: passport upload and selected fields"。
- `layouts/` 下已无冲突标记残留。
