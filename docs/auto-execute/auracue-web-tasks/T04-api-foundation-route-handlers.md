# Task T04 - API Foundation Route Handlers

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-BACKEND-FOUNDATION` |
| Task 类型 | backend foundation |
| 主验收面 | backend runtime foundation |
| 为什么选这个模板 | Web/API 同域需要统一 env、error envelope、local-only guard 和 health |
| 覆盖对象 | API-FOUNDATION, error envelope, env, secret guard |
| 辅助模板 | `TPL-LOCAL-ONLY-GUARD` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T04-api-foundation-route-handlers.md"
```

## 1. Task 目标

在 `apps/web` 建立 API foundation：Route Handler helpers、validation、error envelope、request context、secret redaction、health/local guard。

## 2. 必须读取的输入

T02/T03 HANDOFF、Web spec §4, §7, §12、现有 `apps/api/src/server.mjs` 的 envelope/guard 可复用点。

## 3. 允许改动范围

`apps/web/app/api/**`、`apps/web/server/**`、`apps/web/tests/api/**`、`scripts/acceptance/check-web-copy-safety.mjs`。

## 4. 禁止事项

不实现全部业务 API；不调用真实 AI/storage/payment；不记录 secrets。

## 5. 依赖与续跑门槛

前置：T02、T03。

## 6. 执行步骤

1. 建 API helper 和 envelope。
2. 建 env/config + redaction。
3. 建 health endpoint。
4. 建 local-only adapter boundaries。
5. 写 foundation tests。

## 7. 必须输出

`docs/auto-execute/results/web/T04.json`、`docs/auto-execute/latest/web/T04-HANDOFF.md`、health response、foundation test logs、secret guard logs。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:api
node scripts/acceptance/check-web-copy-safety.mjs
```

## 9. 细化验收标准

所有业务 API 后续可复用同一 validation/envelope/error/redaction。

## 10. 防停止规则

helper 缺口必须本 task 补齐，不能让 T05-T07 各写一套。

## 11. 失败修复路由

foundation test 失败留在 T04；secret guard 失败为 `HARD_FAIL` 风险。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T05-T07 可直接实现 API 域。
