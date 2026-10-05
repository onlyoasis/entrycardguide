# GLM额度恢复后的继续执行清单

## 目标不变

继续整理全球全部目的地的旅客入境/海关申报资料，完善双语网站资料库，数据为后续MCP服务准备。不能把现有70记录视作全球完成。

## 当前可靠状态

- 工作树：/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global
- 分支：codex/global-traveler-library，HEAD f3441cc；已合并7bb45c8到索引并解决冲突，尚未commit、push或发布。
- 母表249目的地（M49 248+额外TW），主库70记录/87事项，53旧站点映射保留。
- 生产构建自动先跑check:travel-library；当前gate/build/SEO通过。
- 70中英详情+2目录，四宽度568次实际浏览器检查通过；这只是页面与结构验收，不证明所有资料完整。
- 主控已按直接原文做少量编辑审校，见外盘codex-editorial-review-fixes.json；恢复时读当前文件，禁止旧上下文覆盖这些修正。

## 实际阻碍

Z.ai返回API1308，五小时额度耗尽。恢复提示2026-09-10 04:42:40，提示未注明时区。最小无工具调用再次失败，记录为外盘glm-availability-probe.json。不要高频试探或替换供应商绕过用户指定的GLM。

## 恢复顺序

1. 先用现有claude-glm入口做一次最小可用性检查，确认is_error=false且正常返回后再派大任务。不要把CLI启动或HTTP200当模型可用。
2. 所有claude -p任务加--disallowedTools Agent，单进程逐国落盘。曾出现父CLI退出即system killed全部异步子代理，不能再只派发就结束。
3. 非洲第2批返修：原session cbfc4eab-11a9-4f1e-9dc8-faa25130c10a未完成；优先新会话读africa-02-review和当前12records、主控审校清单，完成其余来源/条件复核，不重复改回已修内容。
4. 亚洲首批：asia-01/normalized/records仅HK JP KP KR KZ MN MO七份，独立fixture检查18问题，见asia-seven-independent-check.json；缺CN KG TJ TM UZ。JP已由主控修家庭表单/多语数量/品目合计并加现行C5360来源，保留。先按schema与真实来源修七份，再补五份，完整验收后集成。
5. 非洲第三批：africa-03/normalized目前0记录，父任务异步子代理均被system killed；单进程接续3572d895-7d4a-4b3c-9e7a-6c15a4379601也因额度退出。复用evidence与准备脚本，但亲自完成12地，不等待旧子任务。
6. 后续按global-batches队列继续未分配批次。并行任务只写各自外盘暂存；主库母表串行按ISO更新，不用旧snapshot覆盖已完成地区。
7. 每批独立核实来源、数字条件、状态与模型实际usage，统一工作树后跑gate/build/SEO，资料增加后刷新浏览器预览；未解决项不算完整。

## 预览与证据

普通本机预览23134（exec50974），禁脚本预览23135（exec28794）。如旧handle已结束，再按实际状态启动，不盲目重启。浏览器id2/tab3是暂存验收页；页面或构建变化后reload。

所有运行资料：/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910。
临时文件、下载、缓存全部外盘；不读凭据、不写哈希、不触碰其他工作树，不未经授权提交或发布。
