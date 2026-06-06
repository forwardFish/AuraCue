# TPL-HARNESS-EVIDENCE-GATE - 验收 Harness 与证据门禁任务模板

## 适用场景

用于建立或修复验收 harness、证据目录、proof-strength 规则、runtime gate、report-integrity gate、secret guard。典型历史任务包括 `harness-and-evidence-gates`、`intake-source-inventory-harness-decision`、`live-local-frontend-backend-page-runtime-gate`。

## 不适用场景

- 不用于实现产品功能。
- 不用于只跑一次 smoke。
- 不用于最终 PASS 判定，最终判定使用 `TPL-FINAL-GATE`。
- 不用于视觉差异修复，视觉修复使用 `TPL-VISUAL-REPAIR`。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-HARNESS-EVIDENCE-GATE` |
| Task 类型 | harness/evidence gate |
| 主验收面 | evidence contract, proof strength, runtime preflight, report integrity |
| 为什么选这个模板 | 说明本任务要建立哪一类验收证据门禁，而不是实现业务功能 |
| 覆盖对象 | Req/UI/API/DB/Runtime/Evidence IDs |
| 辅助模板 | 常见为 `TPL-INTAKE`、`TPL-REPORT-GUARD`、`TPL-FINAL-GATE` |

## 必须读取输入

- `AGENTS.md` 和项目执行边界。
- PRD、UI、API、DB、外部数据 source inventory。
- 现有 test/harness/verification scripts。
- local runtime start/test commands。
- 预期证据路径、result JSON、HANDOFF、final gate/report-integrity 要求。

## 允许改动范围

- `scripts/**`
- `tools/**`
- `tests/**`
- `docs/auto-execute/*matrix*.md`
- `docs/auto-execute/*standard*.md`
- `docs/auto-execute/results/<TASK-ID>.json`
- `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`

## 禁止事项

- 禁止把 harness ready 写成 product ready。
- 禁止生成假的 screenshots、API transcripts、DB readbacks。
- 禁止把 dry-run、聊天声明、计划表当 PASS evidence。
- 禁止隐藏环境 blocker。
- 禁止在日志、报告、截图路径中泄露密钥。

## 执行步骤模板

1. 盘点当前 evidence 目录、result JSON、HANDOFF、logs、screenshots、API transcripts、DB readbacks。
2. 定义 proof-strength 词汇：`STRUCTURAL_ONLY`、`LOCAL_RUNTIME`、`RUNTIME_SCREENSHOT`、`PIXEL_DIFF`、`API_TRANSCRIPT`、`DB_READBACK`、`MANUAL_REVIEW_REQUIRED`。
3. 建立 runtime preflight：frontend、backend、DB、mock/external guard、secret guard。
4. 建立 evidence directory contract：每类证据的必填路径、写入者、消费方、过期判断。
5. 建立 report-integrity hook：报告里的每个 claim 必须能回查 durable evidence。
6. 建立 fail-closed 规则：P0 证据缺失时不能 pure PASS。
7. 写入 result JSON 和 HANDOFF，即使失败也要记录 blocker 和下一步 repair routing。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 证据类型 | 每个 P0 验收面需要哪类 durable evidence，不能只写“运行通过” |
| 证明强度 | 哪些状态只允许 `PASS_WITH_LIMITATION` 或 `PASS_NEEDS_MANUAL_UI_REVIEW` |
| runtime 区分 | local mock、本地真实 runtime、真实设备/真实服务证据必须分开 |
| report integrity | 报告 claim 到证据路径的映射必须可机器或人工复核 |
| secret guard | 明确不记录 secret 值，只记录变量名、存在性和 redacted 状态 |

## 最低验证命令

```powershell
<harness preflight command>
<report-integrity command>
<secret scan command>
```

## 验收证据

- harness contract document。
- proof-strength matrix。
- runtime preflight log。
- report-integrity result。
- secret-scan result。
- `docs/auto-execute/results/<TASK-ID>.json`。
- `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `proofStrengths`
- `evidencePaths`
- `missingEvidence`
- `runtimeMode`
- `reportIntegrityResult`
- `secretGuardResult`
- `repairRouting`
- `limitations`

## 失败路由

- runtime 无法启动：`BLOCKED_BY_ENVIRONMENT`。
- evidence contract 缺 P0 路径：`REPAIR_REQUIRED`。
- report claim 无 durable evidence：`REPAIR_REQUIRED`。
- secret 泄露：`HARD_FAIL`。
- source 不足以定义证据门禁：`BLOCKED_BY_MISSING_SOURCE`。
