# Task T12 - API DB Contract E2E

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-API-DB-E2E` |
| Task 类型 | API DB e2e proof |
| 主验收面 | all API cases and DB readbacks |
| 为什么选这个模板 | 本任务证明所有 P0 API 的 success/negative/mutation/readback |
| 覆盖对象 | API-001..API-013, DB all, REQ-002..REQ-013 |
| 辅助模板 | `TPL-REPORT-GUARD` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T12-api-db-contract-e2e.md"
```

## 1. Task 目标

运行并补齐全量 API/DB 合同测试，生成 API transcript 和 DB readback。

## 2. 必须读取的输入

`auracue-web-api-db-contract-matrix.md`、T05-T07 HANDOFF、DB seed。

## 3. 允许改动范围

`apps/web/tests/api/**`、`apps/web/tests/db/**`、`scripts/acceptance/check-web-api-contract.mjs`、必要的 API 修复文件。

## 4. 禁止事项

不只跑 happy path；不跳过 readback；不把页面 E2E 当 API proof。

## 5. 依赖与续跑门槛

前置：T05、T06、T07。

## 6. 执行步骤

1. 枚举 API-001..013 cases。
2. 对每个写 success、validation、not-found/idempotency。
3. 写 before/after/readback。
4. 输出 matrix summary。

## 7. 必须输出

`docs/auto-execute/api/web/T12/**`、`docs/auto-execute/db/web/T12/**`、`docs/auto-execute/results/web/T12.json`、`docs/auto-execute/latest/web/T12-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:api
pnpm --filter @auracue/web test:db
node scripts/acceptance/check-web-api-contract.mjs
```

## 9. 细化验收标准

13 个 API 都有 transcript；所有 mutation 都有 readback；失败 case 有明确 error code。

## 10. 防停止规则

任一 P0 API 缺证据必须修复或 `REPAIR_REQUIRED`。

## 11. 失败修复路由

API domain drift 回 T05/T06/T07。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T13 可以基于真实 API/DB 启动整个 app 并跑页面/API/DB runtime smoke。
