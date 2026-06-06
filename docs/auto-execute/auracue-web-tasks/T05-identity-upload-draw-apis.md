# Task T05 - Identity Upload Draw APIs

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-API-DOMAIN` |
| Task 类型 | API domain implementation |
| 主验收面 | method/path/schema/auth/persistence contract |
| 为什么选这个模板 | 本任务实现强相关的身份、今日卡、上传、抽卡 session API |
| 覆盖对象 | API-001, API-002, API-003, API-004, DB-AnonymousUser, DB-OutfitUpload, DB-DrawSession |
| 辅助模板 | `TPL-CONTRACT` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T05-identity-upload-draw-apis.md"
```

## 1. Task 目标

实现 `POST /api/v1/identity/anonymous`、`GET /api/v1/aura-cards/today`、`POST /api/v1/uploads/outfit`、`POST /api/v1/draw-sessions/start`。

## 2. 必须读取的输入

`auracue-web-api-db-contract-matrix.md`、Web spec §7.1-7.4、T03/T04 HANDOFF。

## 3. 允许改动范围

`apps/web/app/api/v1/**`、`apps/web/server/services/**`、`apps/web/server/repositories/**`、`apps/web/tests/api/**`。

## 4. 禁止事项

上传失败不能阻塞主流程；不得把上传图片发到真实云；不得跳过 DB readback。

## 5. 依赖与续跑门槛

前置：T04。

## 6. 执行步骤

1. 实现 request/response schemas。
2. 实现 routes/services。
3. 实现 jpg/png/webp、>8MB、bad type cases。
4. 实现 drawSeed、cards、expiry。
5. 写 success/negative/readback tests。

## 7. 必须输出

API transcripts、DB readback、`docs/auto-execute/results/web/T05.json`、`docs/auto-execute/latest/web/T05-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:api -- identity-upload-draw
pnpm --filter @auracue/web test:db
```

## 9. 细化验收标准

API-001..004 每个有 success、validation、not-found/idempotency/readback。

## 10. 防停止规则

任一 API 未完成必须修复或写 blocker，不得让页面 task 以 fake API 通过。

## 11. 失败修复路由

schema drift/readback 缺失：T05 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T09 create flow 可调用真实本地 API。
