# Task T11 - Web Share Save Pages

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-FRONTEND-PAGE` |
| Task 类型 | frontend page |
| 主验收面 | share/save route/page/state group |
| 为什么选这个模板 | 本任务实现分享图预览、下载、Web Share、Copy fallback、保存成功页 |
| 覆盖对象 | UI-008, UI-009, API-008, API-011, API-012, Owner-005 |
| 辅助模板 | `TPL-PAGE-CLICK-API` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T11-web-share-save-pages.md"
```

## 1. Task 目标

实现 `/share/[id]` 和 `/saved/[id]`，证明 9:16 share image、render fallback、copy/download/share/save actions。

## 2. 必须读取的输入

Web spec §8.8-8.9、UI map UI-008..009、T07/T10 HANDOFF。

## 3. 允许改动范围

`apps/web/app/share/**`、`apps/web/app/saved/**`、share/save components、tests。

## 4. 禁止事项

Web Share 不可用时不得失败停住；render 失败必须显示 fallback 和 Generate Again。

## 5. 依赖与续跑门槛

前置：T07、T10。

## 6. 执行步骤

1. Share 页面加载 card。
2. 无 shareImageUrl 时调用 render。
3. 实现 Save Image、Share、Copy Link、Generate Again。
4. 实现 Saved 页面。
5. 写 clipboard/share/download mocks 和 page tests。

## 7. 必须输出

`docs/auto-execute/results/web/T11.json`、`docs/auto-execute/latest/web/T11-HANDOFF.md`、page logs、share action API transcript。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:pages -- share-save
pnpm --filter @auracue/web typecheck
```

## 9. 细化验收标准

Copy Link 成功写 clipboard mock 并记录 share API；Save Image 触发下载和记录；Saved 可回首页。

## 10. 防停止规则

分享动作不能只是按钮存在，必须有 effect/API 证据。

## 11. 失败修复路由

render/share/save drift：T11 或 T07 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T13/T14 可完整覆盖分享保存阶段。
