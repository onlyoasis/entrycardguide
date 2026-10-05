# GLM 5.3 Flash 恢复执行

用户明确要求继续并改用 GLM 5.3 Flash。官方活动 https://docs.z.ai/devpack/notice/event-glm-5.3-flash 规定：2026-09-03至09-20，每日UTC+8 23:00至次日09:00，付费计划在ZCode使用Flash零额度消耗；其他Agent额度翻倍。CLI最小探测成功，actual modelUsage为glm-5.3-flash。后续使用ZCode内置GLM-5.3-Flash。

当前ZCode任务：sess_77634629-084d-4bdb-a5d4-65deec4ecfa1，Fix and complete asia-01 travel library records，已确认running并实际读取外盘计划和记录。模型配置builtin:bigmodel-coding-plan/GLM-5.3-Flash；完整实际usage在任务结束后复核。

## 当前执行范围

- 工作目录 /Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global。先读resume-after-glm-quota、global-library计划、scripts/check-travel-library.mjs。
- 只写 /Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/asia-01 暂存与证据，不改主库、UI或其他任务文件。
- 修复HK JP KP KR KZ MN MO七份记录的18项问题，保留Codex对日本的编辑修正，补齐CN KG TJ TM UZ，共12地。
- 逐地真实访问官方来源，记录短原文、网址、访问状态、日期和适用条件。未知保留unknown/blocked，不得编造或将未找到等同于无需申报。
- 亲自单进程执行，不创建后台子代理。逐地保存进度，不把派发当完成。
- 使用实际校验脚本在外盘隔离fixture验证；不改校验器或期望值迁就数据。报告中文。
- 保留其他人的编辑；禁止Git操作、发布、凭据读取、哈希。下载缓存临时文件只放既有外盘，先核挂载，不用/tmp。
- Codex独立核查后才集成。亚洲完成后，再按既有恢复清单接续非洲返修及后续全球批次；本任务目前只负责亚洲12地。

全球目标仍未完成，主库基线70记录/87事项。额度恢复不等于资料通过验收。
