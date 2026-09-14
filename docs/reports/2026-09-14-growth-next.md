# 第二批增长优化：新加坡指南与官方入口点击报表

## 选择依据

本批基于已发布的 `a76adda`，沿用同一工作树。BWT真实返回700条查询记录（7个周日期，每期100条），最新标签2026-09-11中 sg arrival card、singapore arrival card、新加坡入境卡分别968、935、330曝光。结合GA4已有访问和GSC字段页下降，优先改进现有新加坡页面。

BWT有点击大于曝光的异常行，未据此计算CTR；周度top100不代表全量关键词。9月13日抓取记录返回InIndex=212、CrawlErrors=0、BlockedByRobotsTxt=0、InLinks=0，最后一项不是完整外链调查。

## 本批产物

- 修订新加坡国家首页、主表页、填写页，共6个中英内容文件。保留路径，避免重复建页。
- ICA当前界面可选择简体中文，但资料用英文；当前外国旅客姓名提示为Given Name followed by Surname，正文及字段卡同步。
- 三天窗口包括抵达当天；居民陆路豁免与空海路情况分开，撤回“所有公民/长期准证持有人都免填”的旧说法。
- 官方页面明确链接增强版，与原版任选其一、每次行程提交一次。新增入口保留各自official_key，内联官方入口也记official_link_click，普通引用不计。
- 增加姓名、日期、最后出发地及确认信息锚点；主表页直接链接这些答案。
- 移除未核实的政府错误原话、固定等待时间后重填、重复提交无害等断言。字段卡仅作实用提示，不展示未经本轮验证的regex/长度作为官方限制。此次只改本地校验器两项帮助文本，全部校验约束及旧lastVerified保留。
- 增加官方入口点击总计、来源、发生页面三份报表；保留流量过滤和分页，记录eventFilter元数据。此为事件/会话代理，不代表官方提交成功。
- 更新勘误记录，准备一篇姓名顺序推广短文。尚未对外发送或发帖。

## 官方核查证据

直接浏览器访问 `https://eservices.ica.gov.sg/sgarrivalcard/`，选择Submit SGAC及Foreign Visitor，读取空白第一页 `.../fvipa`：

- 语言菜单含12个选项和简体中文，说明要求信息使用英文。
- Full Name占位文字为Given Name followed by Surname；生日/到期日显示DD/MM/YYYY。
- 9月14日界面提供14/15/16日抵达选项。
- 页面链接增强版 `https://eservices.ica.gov.sg/arrivalcard/sgac`，说明任选其一、每次行程一次。

没有输入个人资料、接受声明或提交表格，没有核查增强版每个步骤。姓名/护照HTML没有maxlength属性，不意味着服务端无长度限制。最后出发地的转机示例明确标为本站解释。

其他来源：

- [ICA提交要求与豁免](https://www.ica.gov.sg/enter-transit-depart/entering-singapore/sg-arrival-card)
- [ICA抵达日期说明](https://ask.gov.sg/ica/questions/cluuhsp9l001afxu700snp0f0)
- [ICA团体与更新功能](https://ask.gov.sg/ica/questions/clos83fv8019f5k0wj9top13o)
- [ICA确认与e-Pass找回](https://www.ica.gov.sg/enter-transit-depart/at-our-checkpoints/for-travellers/retrieval-of-electronic-visit-pass)

## 验证结果

- 生产构建、全站SEO检查、统计及CLI回归通过。
- 七个相关官方链接只读检查：六个HTTP200；AskGov抵达日期问答对验证脚本返回403，官方正文已从搜索工具读取，不把403当作链接失效。未批量刷新日期。
- 真正API拉取18份数据及metadata，原窗口仍为GSC79点击、GA4过滤后1381会话。
- 新事件报表在8月15日—9月11日返回空数组：该窗口在新事件上线之前，属于预期结果。
- 另外只读查询GA4实时报告，当时只有first_visit/page_view/session_start，没有official_link_click。不能用此判断事件失败或流量增长。
- Chrome核查新加坡6页及英国回归页，共7页×2宽度（390/1440），无根横向溢出，标题/官方标记正常。手机从主表页点击姓名深链后，正确到达`#passport-name`。
- 不注册GA4后台自定义维度，不注入生产测试点击，不提交政府表单。

## 发布与观察

本文件记录本地验收；发布结果另以Actions、production deployment及公网回读为准。用户已授权提交发布，本批继续既有流程。

- 9月21日：适合检查首批目标URL索引变化，不把未变化视为立即失败。
- 9月28日：第二次索引复查，评估是否需要调整内容与发现路径。
- 首个完整上线后28天流量窗口可用9月15日—10月12日；按脚本三天延迟，10月15日再取数。以Bing流量/互动、Google目标页点击、官方入口点击会话为指标。

以上是复盘日期，不代表已创建自动任务。外部推广仍需具体渠道/接收方授权。

数据与界面事实记录：`/Volumes/ExternalPrivate/Runtime/entrycardguide/growth-next-20260914`。canonical及其他工作树未提交修改保留，未导入全球资料库研究数据。
