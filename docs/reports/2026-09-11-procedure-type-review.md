# 暂存事项类型全量筛查

## 面向用户字段中的执行备注

另对全部189事项的名称、适用范围、时间中英文字段筛查JavaScript、服务端渲染、抓取、本轮等词，共55事项/47地命中。此数字是人工审读候选，包含合理的不确定性说明，不能据此自动删改55项。

明确处理原则：采集工具、失败方法、执行过程留在来源或unresolved/研究报告；面向旅客的字段保留能影响决策的未知、规则冲突和适用边界。清理执行措辞不得顺带隐藏未核事实，更不得把“尚未证实”改成肯定句。后续逐国事实返修时同时处理，不增加无关schema或批量正则改写。

2026-09-11解析十个既有暂存目录113条记录的全部189事项：customs_declaration 184、arrival_card 3、health_declaration 1、visa 1。此为实际枚举分布，不代表184项均有问题，也不把名称命中关键词当最终分类。

人工确认TH-tdac当前customs_declaration与其入境卡性质及schema已有arrival_card枚举不符；见thailand-scope-review报告。

SG-sgac同样标customs_declaration。主控实际读取 https://www.ica.gov.sg/enter-transit-depart/entering-singapore/sg-arrival-card ：ICA说明为电子入境卡及健康申报，列出免填人群与含抵达当天的三日窗口。应按入境卡/健康的实际职责分类，不能归为海关货物申报。

MY-mdac、LA-ldif亦为customs_declaration候选，需GLM逐项核原页及改类型。本次MY官方公告可打开，但正文图示细节未完成核验；LA未新增官方证据。PR-international-arrival-processing属于生物识别入境处理说明、GS-visit-permit-biosecurity混许可与检疫，需另核是否适合当前事项模型。

ID/KH/PH/KN/JM可能是综合申报，不能仅凭arrival或immigration词汇自动改成arrival_card，也不要为凑类型数拆成重复填写义务。先核表单实际功能与现有schema语义；必要拆分须明确同一提交入口。其他常规Arrival customs名称命中已排除自动判错。

执行方须只修有证据的分类与说明，保留未知；主控本轮未改国家记录、未修改schema。集成前需复查分类查询结果，而非只验证枚举合法。

## SG/MY适用范围补核

实际SG JSON把“all travellers including residents”写成无条件，漏掉已读ICA原页的不过移民检查转机者及经Woodlands/Tuas进入的居民豁免。另写“SGAC包括应税/禁止货物申报”，不能由ICA入境/健康说明背书，须核海关独立流程；分类错误与内容混写应一并修。

实际MY JSON把新加坡公民豁免限定陆路、三天等同72小时，并记录非居民仅可携出RM1000。前两项仍须取得官方图示核查；本次实际打开 https://imigresen-online.imi.gov.my/mdac/main ，可读提醒明确现金/无记名票据超过USD10000等值向海关申报，携带超过USD10000等值林吉特须有央行许可。旧RM1000表述与当前提示如何衔接须回央行/海关确认，不可继续把历史宣传册与现行规则无说明拼接。

后续已读EMGS（高教部辖下机构）2023-12-08公告：https://educationmalaysia.gov.my/get-in-touch/news/malaysia-digital-arrival-card-(mdac)-for-foreign-visitors-traveling-to-malaysia 。列新加坡公民、外交/公务护照、马来西亚永久居民及长期准证、文莱GCI、文莱马来西亚常旅设施、泰国边境通行证、印尼PLB等七类；新加坡公民条目未限定陆路。公告还明确已有有效学生准证的学生再次出入境无需MDAC。与暂存仅列三类的范围不同，GLM须回现行移民局来源确认后补全；勿将EMGS学生业务说明当所有旅客2026流程已全验收。本次驻新使馆页502、其PDF超时、MDAC资格图示超时，未假称取得图示。
