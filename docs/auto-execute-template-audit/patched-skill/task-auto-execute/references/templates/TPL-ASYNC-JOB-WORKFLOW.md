# TPL-ASYNC-JOB-WORKFLOW - 异步任务与生成工作流模板

## 适用场景

用于实现 create/poll/result/failure/retry/readback 类型的异步 job workflow，例如生成任务、识别任务、结构化卡片生成、后台处理队列。典型历史任务包括 `generation-job-and-structured-card-api`。

## 不适用场景

- 不用于简单 CRUD API。
- 不用于真实 AI provider 调用，provider 集成使用 `TPL-AI-PROVIDER`。
- 不用于只写前端轮询 UI。
- 不用于没有 job lifecycle 状态的同步接口。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-ASYNC-JOB-WORKFLOW` |
| Task 类型 | async job workflow |
| 主验收面 | job create, poll, state transition, result readback |
| 为什么选这个模板 | 说明本任务有异步状态机，而不是普通 API |
| 覆盖对象 | API IDs、Job IDs、DB IDs、Fixture IDs、UI State IDs |
| 辅助模板 | `TPL-API-DOMAIN`、`TPL-DATA-MODEL-MIGRATION`、`TPL-AI-PROVIDER` |

## 必须读取输入

- API contract for create/poll/result endpoints。
- job schema/state model。
- DB/repository/fixture docs。
- deterministic local generator or processor rule。
- failure/retry/fallback requirements。
- frontend polling or later UI state dependency。

## 允许改动范围

- backend routes/services/repositories for the job domain。
- job/card/result shared types。
- deterministic local generator。
- tests/fixtures。
- API transcript and DB readback evidence。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止真实 AI、云服务或外部 provider 调用，除非 task 明确授权且有 local secret guard。
- 禁止只返回 success mock，不持久化 job/result。
- 禁止跳过 pending/failure/not-found/validation。
- 禁止把 failed job 写成 success。
- 禁止前端硬编码 prompt 或生成结果。

## 执行步骤模板

1. 定义 job lifecycle：`created`、`pending`、`success`、`failure`、`not-found`，按项目事实增减。
2. 实现 create endpoint：validation、auth/local-only、dedupe/idempotency where applicable。
3. 实现 poll/result endpoint：状态转换、result schema、not-found、failure reason。
4. 实现 deterministic local processor/generator，生成稳定可测结果。
5. 写 DB write/readback：job row、result/card row、failure row。
6. 写 retry/fallback 行为，明确哪些失败能重试。
7. 写 API tests 和 transcript，覆盖 success、validation、not-found、failure、readback。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| lifecycle | create/poll/result/failure/retry 每个状态必须有预期 |
| persistence | job 与结果必须有 DB/local readback |
| generator | local deterministic generator 的输入/输出 schema 必须固定 |
| failure | provider/processor 失败不能静默成功 |
| UI dependency | later UI 需要的 pending/success/failure fixture 必须可复用 |

## 最低验证命令

```powershell
<job API test command>
<job DB readback command>
<failure/retry fixture command>
```

## 验收证据

- API transcripts for create/poll/result/failure。
- DB readback JSON。
- deterministic generator test log。
- failure/retry evidence。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `jobStatesCovered`
- `apiTranscripts`
- `readbackEvidence`
- `generatorMode`
- `failureCases`
- `retryBehavior`
- `limitations`

## 失败路由

- lifecycle incomplete：`REPAIR_REQUIRED`。
- DB readback missing：`REPAIR_REQUIRED`。
- local runtime unavailable：`BLOCKED_BY_ENVIRONMENT`。
- missing schema/source：`BLOCKED_BY_MISSING_SOURCE`。
- real provider accidentally called：`HARD_FAIL`。
