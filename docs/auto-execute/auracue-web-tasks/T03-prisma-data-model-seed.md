# Task T03 - Prisma Data Model Seed

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-DATA-MODEL-MIGRATION` |
| Task 类型 | data model migration |
| 主验收面 | schema/migration/seed/readback |
| 为什么选这个模板 | Web-first spec 要 PostgreSQL + Prisma 作为唯一业务事实源 |
| 覆盖对象 | DB-AnonymousUser, DB-OutfitUpload, DB-DrawSession, DB-GenerationJob, DB-AuraCard, DB-Activation, DB-SavedCard, DB-ShareEvent, DB-AnalyticsEvent, DB-CardTemplate |
| 辅助模板 | `TPL-TEST-INTEGRATION` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T03-prisma-data-model-seed.md"
```

## 1. Task 目标

实现 Prisma schema、seed、local test DB 策略和 readback 测试，覆盖 Web P0 数据模型。

## 2. 必须读取的输入

Web spec §5-6、`auracue-web-api-db-contract-matrix.md`、T02 HANDOFF、现有 `apps/api/src/local-repository.mjs`。

## 3. 允许改动范围

`prisma/**`、`apps/web/server/repositories/**`、`apps/web/tests/**`、相关 package scripts。

## 4. 禁止事项

禁止破坏性删库；禁止只写 TypeScript 类型不做 readback；禁止把旧 local repository 当最终 DB 证明。

## 5. 依赖与续跑门槛

前置：T02。

## 6. 执行步骤

1. 定义 schema 和 indexes/idempotency keys。
2. 添加 seed。
3. 配置 test DB 或本地 SQLite/Postgres 替代策略并写明 limitation。
4. 写 readback tests。
5. 运行 migration/seed/test。

## 7. 必须输出

schema/migration/seed、DB readback JSON、`docs/auto-execute/results/web/T03.json`、`docs/auto-execute/latest/web/T03-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web prisma migrate dev
pnpm --filter @auracue/web prisma db seed
pnpm --filter @auracue/web test:db
```

## 9. 细化验收标准

每个 P0 model 都可写入并独立读取；idempotency 覆盖 draw/generate/save/seal。

## 10. 防停止规则

Postgres 不可用时用明确 local test DB 替代并标注，不得省略 readback。

## 11. 失败修复路由

migration/readback 失败：T03 repair；数据规则缺失：blocker。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T04-T07 可使用 repository/prisma client 实现 API。
