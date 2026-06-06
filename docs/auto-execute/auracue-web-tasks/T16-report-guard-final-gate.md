# Task T16 - Report Guard Final Gate

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-FINAL-GATE` |
| Task 类型 | final acceptance gate |
| 主验收面 | fail-closed final verdict from durable evidence |
| 为什么选这个模板 | 本任务只读取证据并判定 AuraCue Web/H5 是否真正完成 |
| 覆盖对象 | All Req/UI/API/DB/Owner/Test/Evidence IDs |
| 辅助模板 | `TPL-REPORT-GUARD` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T16-report-guard-final-gate.md"
```

## 1. Task 目标

实现并运行 Web final gate，检查所有 result/HANDOFF/log/API/DB/trace/screenshot/report claims，特别检查 T13 是否真实启动整个 app 并跑通页面/API/DB 主链，给出 fail-closed verdict。

## 2. 必须读取的输入

全部 `auracue-web-*.md` 矩阵、T01-T15 result/HANDOFF、evidence directories。

## 3. 允许改动范围

`scripts/acceptance/run-web-final-gate.ps1`、`scripts/acceptance/**`、`docs/AUTO_EXECUTE_DELIVERY_REPORT.md`、final report、T16 result/HANDOFF。

## 4. 禁止事项

不补实现；不生成伪证据；不把 local smoke 或聊天文字当 final PASS；T13 没有 live app page/API/DB evidence 时不能 PASS。

## 5. 依赖与续跑门槛

前置：T12、T13、T14、T15，且 T01-T11 result/HANDOFF 齐全。

## 6. 执行步骤

1. 抽取 P0 requirements。
2. 读取所有 durable evidence。
3. 检查 T13 live app runtime smoke 的 start log、live URL、screenshots、API transcript、DB readback、rerun count。
4. 检查 API/DB readback、E2E、visual、secret guard、report integrity。
5. 运行 final gate。
6. 写最终 verdict 和 missing evidence list。

## 7. 必须输出

`docs/auto-execute/results/web/web-final-gate.json`、`docs/auto-execute/results/web/T16.json`、`docs/auto-execute/latest/web/T16-HANDOFF.md`、最终报告。

## 8. 最低验证命令

```powershell
powershell -ExecutionPolicy Bypass -File scripts/acceptance/run-web-final-gate.ps1
node scripts/acceptance/check-web-copy-safety.mjs
```

## 9. 细化验收标准

所有 P0 Req/UI/API/DB/Owner/Test evidence 齐全才 `PASS`；T13 缺 live app 页面/API/DB 完整主链为 `REPAIR_REQUIRED`；缺 visual raster 最多 `PASS_NEEDS_MANUAL_UI_REVIEW`；缺 API/DB/E2E 为 `REPAIR_REQUIRED`。

## 10. 防停止规则

final gate 失败必须写 repair queue 指向具体 task。

## 11. 失败修复路由

证据缺失回对应 T task；T13 runtime smoke 缺失回 T13；secret 泄露 `HARD_FAIL`；环境缺失 `BLOCKED_BY_ENVIRONMENT`。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

最终 verdict 写入 `web-final-gate.json`，报告与 evidence 一致。
