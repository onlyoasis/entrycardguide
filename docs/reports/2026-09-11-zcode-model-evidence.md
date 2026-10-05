# ZCode 实际模型调用核验

主控读取model-io-sess_77634629-084d-4bdb-a5d4-65deec4ecfa1.jsonl的结构化记录，未读取或输出headers凭据值。
现存日志共138条，时间UTC 2026-09-10T21:35:53.239Z 至 2026-09-10T23:36:20.899Z。请求模型配置全部为builtin:bigmodel-coding-plan/GLM-5.3-Flash，variant=max；响应modelId分布为{'GLM-5.3-Flash': 136, 'None': 2}。

日志开头存在modelIOReset标记，现存范围只能证明这一时间段的真实调用；不能扩大成之前所有批次都已核验。需从DB/旧日志进一步核对更早调用。当前记录对应北京时间9月11日05:35至07:36，位于免费窗口内。活动是否实际零扣额仍不是模型ID本身能证明。

## 现存日志按轮次统计

原始日志已按turnId结构化统计并保存外盘zcode-tool-audit-by-turn.json，仅保留时间/模型/工具名/计数，无headers与私人正文。
- 2026-09-10T21:35:53.239Z 至 2026-09-10T21:48:35.003Z：29次请求，工具{"Bash": 21, "TodoWrite": 4, "WebSearch": 3}。
- 2026-09-10T22:02:26.258Z 至 2026-09-10T22:32:20.134Z：71次请求，工具{"Read": 1, "Bash": 42, "TodoWrite": 11, "WebSearch": 13}。
- 2026-09-10T23:01:56.784Z 至 2026-09-10T23:10:51.159Z：25次请求，工具{"Read": 1, "Bash": 18, "TodoWrite": 3, "WebSearch": 2}。
- 2026-09-10T23:32:03.613Z 至 2026-09-10T23:36:39.090Z：13次请求，工具{"Bash": 12, "TodoWrite": 1}。

工具列表中的Bash可能调用curl，须进一步检查命令和真实stdout；仅没有WebFetch名字不能断言没有联网。服务端内建工具还可能记在response/providerMetadata或消息内容，最终逐源结论须结合完整区间原始回传和写文件时序。已发现三国补強写摘要时序，应按此强证据返修。不要把日志缺失本身等同伪造。

三国补强窗口补查：providerMetadata顶层键为{'anthropic': 13}；request/messages中role=tool且含webReader_result标记的事件数为0。此检查限定该窗口，未扩展到重置前历史。

## 数据库全session核验补齐
只读model_usage按session_id精确过滤，统计{"records": 803, "completed": 802, "cancelled": 1, "models": ["GLM-5.3-Flash"], "first_beijing": "2026-09-10T07:24:14.819000+08:00", "last_beijing": "2026-09-11T07:36:39.100000+08:00", "outside_window_starts": 0}。803条均为内置Coding Plan Flash，无其他模型；此为该ZCode session范围，不包含此前Claude GLM入口。数据库模型使用记录证明调用模型和时间，不单独证明供应商计费为零，也不证明采集内容真实。完整汇总已存外盘zcode-model-usage-db-audit.json。

## DB来源回传可恢复
part表精确session查询保留855个tool part，另有21个text part含服务端webReader标记（不是tool_usage同名工具）。已保存仅ID/时间/长度的索引zcode-server-reader-parts-index.json。后续来源核验应同时检查这些text回传，不可仅凭tool_usage无webReader判未抓取。三国补强窗口的命令和输出仍有独立拒绝证据。

## 审计纠正：存在文本型webReader记录，真实工具来源待判
数据库part表确有三份带webReader_result_summary标记的text记录，时间分别UTC23:32:48.962、23:33:54.428、23:34:42.474，对应IN/MV/BH，已保存外盘asia12-server-reader-text-records.json。因此先前“无任何回传记录”措辞不准确，不能仅按toolCalls列表断言凭空生成。
这些part为text类型，内容是含省略号的摘要、IN甚至中文摘要；尚须确认是供应商独立服务端工具输出还是模型模拟的工具文本。现有普通工具回传只见抓取失败，两类证据不能混为一谈。撤回对三国已确定伪造的定性，改为“来源真实性未证实，引用逐字性与事实冲突未解决”。保持未核验隔离状态直到取得独立官方证据；不是恢复原来的已核标签。MV官方通告数值冲突仍有直接依据。
