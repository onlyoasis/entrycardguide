# 资料库页面独立验收记录（进行中）

## 日期导致详情页被排除

主控clock实际UTC为2026-09-09 17:24:16，用户时区Asia/Tokyo已为9月10日。config.toml未设timeZone/buildFuture。adapter以time.AsTime解析无时区2026-09-10并设dates.date，可能被Hugo视为未来页面而不输出，当前2020日期probe正可验证这一差异。

修复应限定新资料库日期，使用明确时区的日期或明确区分页面发布日期与JSON研究日期；不要全站buildFuture=true，不更改旧文章核验日期，不伪造2020日期只为过测。页面显示的研究/核验日期仍来自JSON，不能取Git日期或每次构建now当核验。

交付前清理所有probe-page/probe-params/probe-dates页面代码和构建残留，以及libtest调试代码。检查全部有record的ISO生成中英详情，无record不得生成假内容。

## 真实浏览器首轮（本地23134）

CUA已实际打开/library/，249行可见。搜索Argentina后只剩对应行；叠加Europe后0行。但控制台报Cannot read properties of undefined (reading replace)，结果计数/无结果提示未出现，Reset始终disabled，实际click无法完成。
根因：assets/js/library.ts的status和statusLine都querySelector('[data-library-status]')，后者取到了select而不是计数p，dataset.countLabel为undefined。必须给计数节点独立属性并同步JS，不通过catch隐藏错误。
检查[data-library-controls]的hidden与CSS display优先级，确保无JS时控件不假装可用，全部目录行仍可浏览。

390px视口（可用clientWidth375，含滚动条）首轮根元素scrollWidth375，无整页横向溢出；表格内部横向滚动属既定设计。尚未完成全宽度/全详情页验证。

内容问题：content/library/_index两语把“联合国M49清单共249”写错，应是M49 248 + 本站额外目的地1；总范围249必须与原始清单来源分开。

本地预览服务器exec50974，http://127.0.0.1:23134 。CUA浏览器id2、tab1已markHandoff；修复/重新构建后必须reload再取新状态。viewport已reset。

## 第二轮真实浏览器结果

- 新标签页当前library脚本运行无控制台错误；旧标签页dev日志会重带旧脚本错误，故不以其时间戳判新错误，另开干净标签验证。
- 英文搜索Argentina：1/249；叠加Europe：0/249且空结果提示可见；Reset可点击，恢复249/249并重新禁用；Partial状态筛选26/249。
- 阿根廷详情通过语言菜单跳到/zh/library/ar/，中文标题、来源、未知费用正常。
- 当前渲染32个英文和32个中文详情，加2目录，共66页；320/390/768/1440共264次真实页面导航与DOM尺寸检查，无缺失h1、无根元素横向溢出、无/Users/或/Volumes/本地路径泄露。表格内部横向滚动按设计保留。
- 使用原构建HTML、仅本机响应加CSP script-src none的禁脚本预览：中英目录各250行（含1表头，即249目的地），筛选控件不可见。library模板无noscript分支，此检查覆盖无脚本目录展示。
- 中文ZM详情的签证项显示已核实日期，CE6项单独显示待核且无伪核验日期；unknown费用未当免费。
- 中文键盘Tab焦点依次进入地区/状态/重置，Enter重置恢复249项并回到搜索框。该轮未将单次ArrowDown无选择变化误报为选择成功。

预览服务器：普通exec50974端口23134；禁脚本exec28794端口23135。当前CUA browser2/tab3，旧tab1和禁脚本临时tab已关闭；tab3 markHandoff，viewport reset。页面层通过这些检查不等于32地资料全部核实或全球资料完成。


## 70记录构建的复验

主控在GLM额度暂停期间完成已核对原文的定点审校（SO/SS适用例外与税率条件、MG香水et/ou范围；JP仅修改暂存件）。npm build:prod含前置gate与SEO均通过。当前中英详情各70页加2目录，142页×4宽度=568次实际CUA导航检查，根元素无横向溢出、无缺h1、无本地绝对路径泄露。浏览器已导航新构建，不能再引用旧32详情页数量。批量资料完整性依然未完成。
