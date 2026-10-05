# 第二夜实际差集与待验收清单

2026-09-11重新解析主库与十个已派发暂存目录，按母表id去重。数量仅表示有文件，不证明资料正确完整。

主库70地；暂存新增113地；联合183地；剩余66地。

## 尚无记录

### Asia（13）

IL 以色列, JO 约旦, KW 科威特, LB 黎巴嫩, OM 阿曼, QA 卡塔尔, SA 沙特阿拉伯, PS 巴勒斯坦国, SY 阿拉伯叙利亚共和国, TR 土耳其, AE 阿拉伯联合酋长国, YE 也门, TW 台湾

### Europe（24）

BY 白俄罗斯, MD 摩尔多瓦共和国, RU 俄罗斯联邦, UA 乌克兰, AX 奥兰群岛, FO 法罗群岛, GG 格恩西, IS 冰岛, IM 马恩岛, JE 泽西, SJ 斯瓦尔巴群岛和扬马延岛, GB 大不列颠及北爱尔兰联合王国, AL 阿尔巴尼亚, AD 安道尔, BA 波斯尼亚和黑塞哥维那, GI 直布罗陀, VA 教廷, ME 黑山, MK 北马其顿, SM 圣马力诺, RS 塞尔维亚, LI 列支敦士登, MC 摩纳哥, CH 瑞士

### Oceania（28）

AU 澳大利亚, CX 圣诞岛, CC 科科斯（基林）群岛, HM 赫德岛和麦克唐纳岛, NZ 新西兰, NF 诺福克岛, NC 新喀里多尼亚, PG 巴布亚新几内亚, SB 所罗门群岛, VU 瓦努阿图, GU 关岛, KI 基里巴斯, MH 马绍尔群岛, FM 密克罗尼西亚联邦, NR 瑙鲁, MP 北马里亚纳群岛, PW 帕劳, UM 美国本土外小岛屿, AS 美属萨摩亚, CK 库克群岛, PF 法属波利尼西亚, NU 纽埃, PN 皮特凯恩, WS 萨摩亚, TK 托克劳, TO 汤加, TV 图瓦卢, WF 瓦利斯群岛和富图纳群岛

### Unspecified (M49)（1）

AQ 南极洲

## 暂存验收队列

|目录|记录|事项|执行方状态分布（非独立结论）|
|---|---:|---:|---|
|asia-01|12|29|{"partial": 10, "verified": 1, "blocked": 1}|
|africa-03|12|23|{"verified": 1, "blocked": 2, "partial": 9}|
|africa-04|12|24|{"partial": 8, "blocked": 4}|
|africa-05|10|20|{"partial": 8, "blocked": 2}|
|americas-06|12|19|{"partial": 8, "blocked": 4}|
|americas-07|12|18|{"partial": 9, "blocked": 3}|
|americas-08|12|14|{"partial": 10, "blocked": 2}|
|americas-09|7|10|{"partial": 5, "blocked": 2}|
|asia-11|12|17|{"partial": 9, "blocked": 3}|
|asia-12|12|15|{"blocked": 12}|

2026-09-11北京时间22:28按实际JSON的review_status重新全量核对，以上数量及分布成立；十个暂存目录与主库及彼此之间均无重复ID。asia-12包括主控撤销IN/MV/BH证据确认后的状态，不再沿用执行方旧分布。下一批asia-13任务书仅覆盖剩余亚洲13地中的12地，TW仍须另行安排，不得漏算。

## 下一步

先执行night2-priority五地证据返修，再核PR/VI/US边界，补asia-12九地官方研究。仅有记录或validator通过不能跳过内容验收。剩余66地按现有global-batches对应未派发段继续；asia13虽有任务书但未派。所有GLM执行只在北京时间23:00至08:30启动，08:50停止。
