# Task T15 - Visual Compare

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-VISUAL-COMPARE` |
| Task 类型 | visual one-to-one comparison |
| 主验收面 | reference/actual/diff/metrics visual proof |
| 为什么选这个模板 | Web 页面必须对 P0 UI reference 做真实截图和差异分析 |
| 覆盖对象 | UI-001..UI-010, mobile viewport, visual evidence |
| 辅助模板 | `TPL-VISUAL-REPAIR` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T15-visual-compare.md"
```

## 1. Task 目标

对 9 个 Web P0 页面和关键错误态进行 reference/actual/diff/metrics 视觉验证，生成 material deviations。

## 2. 必须读取的输入

`auracue-web-ui-reference-map.md`、`docs/UI/小程序/P0-*.png`、Stitch HTML、T09-T14 HANDOFF。

## 3. 允许改动范围

`apps/web/tests/visual/**`、`scripts/acceptance/**visual**`、必要的最小样式修复。

## 4. 禁止事项

无 actual raster screenshot 不得写 pixel PASS；不得用裁切/暗化/模糊图替代。

## 5. 依赖与续跑门槛

前置：T13、T14。

## 6. 执行步骤

1. 准备 fixture 让每个目标状态可见。
2. 启动 Web。
3. 捕获 actual screenshots。
4. 复制 reference。
5. 生成 diff、metrics、visual-summary。
6. 对 material deviations 做最小 repair 并重截。

## 7. 必须输出

`docs/auto-execute/screenshots/web/T15/reference|actual|diff|metrics|visual-summary.json`、`docs/auto-execute/results/web/T15.json`、`docs/auto-execute/latest/web/T15-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:visual
```

## 9. 细化验收标准

UI-001..UI-009 至少 mobile viewport 有 reference/actual/diff/metrics；UI-010 错误态有截图。

## 10. 防停止规则

有 material deviation 必须修复或标 `REPAIR_REQUIRED`，不能写“基本一致”。

## 11. 失败修复路由

缺 screenshot 环境：`BLOCKED_BY_ENVIRONMENT`；差异可修：visual repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T16 可根据 visual summary 给最终 UI verdict。
