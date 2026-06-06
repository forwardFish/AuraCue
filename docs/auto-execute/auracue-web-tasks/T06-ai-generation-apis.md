# Task T06 - AI Generation APIs

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-AI-PROVIDER` |
| Task 类型 | AI provider integration |
| 主验收面 | prompt/input/output schema and provider boundary |
| 为什么选这个模板 | Aura Card 生成依赖 AI/mock provider、JSON schema、fallback 和 secret guard |
| 覆盖对象 | API-005, API-006, AI-001, DB-GenerationJob, DB-AuraCard |
| 辅助模板 | `TPL-API-DOMAIN` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T06-ai-generation-apis.md"
```

## 1. Task 目标

实现 `POST /api/v1/aura-cards/generate`、`GET /api/v1/generation-jobs/:jobId`，以及 mock provider、OpenAI-compatible adapter、schema validation、fallback。

## 2. 必须读取的输入

Web spec §7.5-7.6, §10、`packages/prompt-core`、T05 HANDOFF、memory 中 AuraCue provider guardrail 可作为历史参考但必须现场验证。

## 3. 允许改动范围

`apps/web/server/ai/**`、`apps/web/app/api/v1/aura-cards/generate/**`、`apps/web/app/api/v1/generation-jobs/**`、`packages/prompt-core/**`、API tests。

## 4. 禁止事项

不得提交或打印 API key；无授权不得真实调用 provider；不得把 mock 结果写成 live proof。

## 5. 依赖与续跑门槛

前置：T05。

## 6. 执行步骤

1. 定义 prompt input/output schema。
2. 实现 deterministic mock provider。
3. 实现 OpenAI-compatible adapter 和 redaction。
4. 实现 generate/job routes。
5. 测 AI fail、invalid JSON retry、fallback、idempotency、readback。

## 7. 必须输出

mock transcript、secret scan、generation API transcripts、card/job DB readback、`docs/auto-execute/results/web/T06.json`、`docs/auto-execute/latest/web/T06-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:api -- generation
node scripts/acceptance/check-web-copy-safety.mjs
```

## 9. 细化验收标准

无 key 时完整生成 card；AI failure fallback 成功并写 `generationSource`/`fallbackUsed`。

## 10. 防停止规则

provider 不可用时必须保留 mock fallback 完整链路。

## 11. 失败修复路由

schema 不稳或 readback 缺失：T06 repair；真实 provider 缺 key：`PASS_WITH_LIMITATION`，不是 blocker。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T09/T13 可通过 API-005 生成 result card。
