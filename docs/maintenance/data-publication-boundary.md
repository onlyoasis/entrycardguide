# 资料发布边界

`data/travel_library/` 是被 Git 忽略的内部研究工作目录；夜间任务继续写入原位置。默认预览和生产构建在 Hugo 加载层排除该目录，只使用 `data/travel_library_public.json`。公开快照缺失或结构无效会失败，不回退研究数据。

公开快照只保留选定目的地的办理信息、核验日期和公开引用链接；证据摘录、未决研究、失败诊断、内部路径及未知字段不进入快照。初始快照为空，表示尚未批准新的研究记录发布。空目录仍提供现有官方指南入口。

## 本地操作

```bash
# 每台维护机器在本工作树运行一次；安装前检查已有hook，不覆盖自定义配置
npm run install:data-hooks

# 完整内部研究预览，仅监听127.0.0.1，研究资料页带noindex
npm run dev:research
npm run build:research  # 输出research-public，不能部署

# 仅在完成独立事实验收后，显式选择要发布的完整目的地集合
npm run export:public-library -- --ids DE
npm run check:public-library
npm run test:data-protection
npm run build:prod      # 每次重建专用public-release，清除旧研究页或下架页残留
npm run check:seo
```

导出命令会替换整个公开快照，未列出的目的地不会保留。DE只是命令形式示例，不代表本次已批准德国资料上线；JSON中的 `verified` 仍须独立核对官方证据。

公开与研究产物分目录，原有 `public/` 不再是部署输入。GitHub Actions部署 `public-release`，IndexNow也从这个目录取站点地图。运行公开构建前应保存该产物目录中手工添加的内容；该目录是可重建产物，构建会清空后重建。原研究主库和旧 `public/` 不在清理范围中。

## Git检查与限制

提交前及合并提交前的hook检查真实Git索引；推送前检查待上传范围内全部可达提交，即使中间加入研究文件后又删除也拒绝。安装的hook使用当前Node与脚本绝对路径，适用于本仓库所有worktree；移动或退役该工作树前须重新安装并验证。

安装程序拒绝覆盖已有自定义hook或 `core.hooksPath`；遇到该情况应先合并既有检查，不能关闭旧检查以便安装。hook可被手动绕过，CI发生在上传后，这些检查不能代替维护者控制公开范围。

既有公开网址、文章和已授出的CC BY-SA 4.0许可保持有效。内部保存和停止主动分发不能收回既有授权，也不构成对政府网址或公共事实的独占权。此改造保护未公开的研究材料；它不阻止别人复制允许公开的官方链接，不等于已实现收费MCP。

## 存储与测试

本机缓存和验证临时文件放已挂载外盘。当前工作树为 `/Volumes/ExternalPrivate/Workspaces/codex/entrycardguide-global`，缓存设置 `HUGO_CACHEDIR=/Volumes/ExternalProjects/DevCaches/entrycardguide/hugo`。测试支持 `TRAVEL_LIBRARY_TEST_ROOT`；CI设置为 `runner.temp`，本机默认使用本任务外盘运行目录。外盘缺失时不要创建同名卷路径或回退内盘。

测试调用真实导出函数、原研究校验器、Git命令、生产构建入口及Hugo模板，涵盖不存在研究主库、损坏研究JSON、内部字段误入、合并历史和旧产物残留。
