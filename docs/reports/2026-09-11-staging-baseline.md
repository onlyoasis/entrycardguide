# 第二夜暂存结构基线

2026-09-11独立调用仓库原版校验器；未修改执行方校验器或期望值。状态是记录当前标记，非独立事实核验结论。

|批次|记录|事项|fixture一致|校验退出码|
|---|---:|---:|---|---:|
|asia-01|12|29|True|0|
|africa-03|12|23|True|0|
|africa-04|12|24|True|0|
|africa-05|10|20|True|0|
|americas-06|12|19|True|0|
|americas-07|12|18|True|0|
|americas-08|12|14|True|0|
|americas-09|7|10|True|0|
|asia-11|12|17|True|0|
|asia-12|12|15|True|0|

asia-12当前全部blocked（主控撤销三项未经证实核验）；报告旧部分的partial/verified数量不可复用。完整分布与校验输出保存外盘staging-audit-night2-baseline.json。结构通过与内容验收分开，仍不集成主库。
