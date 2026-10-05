# 资料库校验接线（library gate）

日期：2026-09-10 · 分支：`codex/global-traveler-library` · 未做任何 git 操作 / 发布

## 改动

1. `package.json` 新增两条 scripts：
   - `"check:travel-library": "node scripts/check-travel-library.mjs"`
   - `"prebuild:prod": "npm run check:travel-library"` —— npm 在 `build:prod`
     前自动执行；原先没有 prebuild:prod，无既有 hook 需要串联。`build:prod`
     本身未改，GitHub Actions 调用 `build:prod` 即自动继承，CI 无需新步骤。
2. `docs/README.md`「本地跑起来」一节：`build:prod` 注释更新，新增
   `check:travel-library` 命令行和一段中文说明——该检查验证
   `data/travel_library/` 的结构与证据关联（管辖区/记录文件互相引用、真实
   日历日、来源 URL 与摘录、`verified_at` 需被引用且 `access_status: ok`
   的来源支撑等），**不证明资料内容全部属实**。原有换行与月度复盘代码块保持不变。

校验器、样本、预期、依赖、锁文件、workflow 均未改动。

## 验证结果

fixture 根：`/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/independent-fixtures-23xvgo6p`（样本与预期未改动）

| 用例 | 退出码 | 预期 |
|---|---|---|
| baseline | 0（`npm run check:travel-library -- <baseline>` 同样通过） | 0 ✅ |
| impossible_date | 1 | 1 ✅ |
| empty_evidence | 1 | 1 ✅ |
| uncited_support | 1 | 1 ✅ |
| duplicate_site_key | 1 | 1 ✅ |

`npm run build:prod` 实测：pre-hook 触发全库校验，失败即退出 1，Hugo 未执行。

## 全库当前状态（如实记录）

校验脚本对仓库全量 `data/travel_library/` 跑出 **23 处违规**（如
`records/ET.json`、`SC.json`、`TF.json`、`YT.json` 等 `no jurisdiction
references this records file` / `jurisdiction_id … does not match`）。原因：
资料写入任务仍在并行进行中，jurisdictions.json 与 records/ 尚未完全对齐。
这是接线前的既有状态，本次未修改任何数据。因此在数据任务收尾前，
`npm run build:prod` 会因 pre-hook 失败而中止——数据对齐后即恢复通过。

日志：`/Volumes/ExternalPrivate/Runtime/entrycardguide/global-20260910/library-gate/`
（`full-library-check.txt`、`prebuild-hook.txt`）。
