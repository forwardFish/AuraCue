# TPL-FINAL-GATE - 最终验收门禁任务模板

## 适用场景

用于聚合全部 durable evidence，按 requirement、UI、API、DB、external data、owner scenario、test、visual、security、report integrity 给最终 verdict。

## 不适用场景

- 不用于补实现。
- 不用于根据聊天记录判定 PASS。
- 不用于跳过缺失 P0 证据。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-FINAL-GATE` |
| Task 类型 | final acceptance gate |
| 主验收面 | fail-closed final verdict from durable evidence |
| 为什么选这个模板 | 说明本任务只判定最终状态 |
| 覆盖对象 | All Req/UI/API/DB/External/Owner/Test/Evidence IDs |
| 辅助模板 | `TPL-REPORT-GUARD` |

## 必须读取输入

- requirement traceability matrix。
- UI reference map。
- API/DB contract matrix。
- external data matrix。
- owner scenario matrix。
- standard test plan。
- all result JSON。
- all HANDOFF。
- evidence directories。

## 执行步骤模板

1. 列出所有 P0/P1 证据要求。
2. 读取 durable evidence，不读聊天 claims。
3. 检查每个 P0 requirement。
4. 检查每个 P0 UI reference。
5. 检查每个 P0 API/DB readback。
6. 检查外部数据、owner E2E、visual、security、report guard。
7. 给出最终 verdict 和原因。

## 状态规则

- 全 P0 证据齐全且通过：`PASS`
- 有非 P0 限制：`PASS_WITH_LIMITATION`
- 功能证据有但 UI 缺真实 raster/pixel：`PASS_NEEDS_MANUAL_UI_REVIEW`
- P0 可修失败：`REPAIR_REQUIRED`
- 环境阻塞：`BLOCKED_BY_ENVIRONMENT`
- 源缺失：`BLOCKED_BY_MISSING_SOURCE`
- 严重安全或数据风险：`HARD_FAIL`

## 禁止事项

- 禁止实现功能。
- 禁止用计划文件替代证据。
- 禁止把 local smoke 当 final PASS。

## 验收证据

- final acceptance report。
- machine-readable final verdict。
- missing evidence list。
- why PASS or why not pure PASS。

## 失败路由

- 缺 P0 requirement 证据：`REPAIR_REQUIRED` 或 `BLOCKED_BY_MISSING_SOURCE`
- 缺 P0 UI raster/pixel 证据：`PASS_NEEDS_MANUAL_UI_REVIEW`，不能 pure PASS
- 缺 API/DB readback：`REPAIR_REQUIRED`
- 报告 claim 与 durable evidence 不一致：转 `TPL-REPORT-GUARD`
- 发现安全、密钥或真实外部副作用风险：`HARD_FAIL`

<!-- TEMPLATE-CONTENT-QUALITY:START -->
## 通用内容准确性补强

本附录用于补齐旧模板的执行字段。生成 task 时，必须优先使用本模板上方的领域规则，再用本附录补全范围、证据、Result JSON 和失败路由。

### 允许改动范围

- 只允许改动 task 明确列出的目标文件、测试、fixture、证据输出和必要的相邻 contract 文件。
- 如果需要跨越本模板的主验收面，必须在 task 中列出辅助模板和范围理由。
- 不得修改 source reference、用户未授权的外部系统、生产数据或无关模块。

### 禁止事项

- 禁止把计划、dry-run、聊天状态、结构化占位或局部 smoke 写成 pure PASS。
- 禁止跳过本模板的领域必填项、负例、readback、截图、日志或报告完整性检查。
- 禁止隐藏 `BLOCKED_BY_MISSING_SOURCE`、`BLOCKED_BY_ENVIRONMENT`、`REPAIR_REQUIRED` 等真实状态。

### 执行步骤补充

1. 先把本模板上方的领域必填项映射到具体 Req/UI/API/DB/Owner/Evidence IDs。
2. 再写 task-local allowed files、forbidden actions、dependency/resume gate。
3. 为每个验收点写清验证命令、durable evidence path、失败状态和 repair routing。
4. 最后写 result JSON 和 HANDOFF，失败也必须落盘。

### 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 模板适配 | 为什么本模板是主模板，哪些辅助模板只做补充 |
| 具体输入 | 每个输入必须是项目文件、source 文档、命令、fixture 或明确 blocker |
| 验收证据 | 每条 P0/P1 验收都要有命令和 durable evidence path |
| 降级状态 | 证据不足时必须写限制状态，不能 pure PASS |
| task 粒度 | 一个 task 只能证明一个主验收面，过大必须拆分 |

### 最低验证命令

```powershell
<template-specific targeted command>
<negative or edge-case command where applicable>
<evidence/readback/report-integrity command>
```

### 验收证据补充

- targeted test/build/smoke/log evidence。
- required screenshots/API transcripts/DB readbacks/external readbacks if applicable。
- updated matrix/report if this template owns a mapping or gate。
- `docs/auto-execute/results/<TASK-ID>.json`。
- `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`。

### Result JSON 必填补充

- `taskId`
- `templateId`
- `status`
- `coveredIds`
- `commandsRun`
- `evidencePaths`
- `failedChecks`
- `repairRouting`
- `limitations`

### 失败路由补充

- source 缺失：`BLOCKED_BY_MISSING_SOURCE`。
- runtime/tooling 缺失：`BLOCKED_BY_ENVIRONMENT`。
- 领域验收或证据缺口：`REPAIR_REQUIRED`。
- secret、真实生产副作用、伪造证据：`HARD_FAIL`。
<!-- TEMPLATE-CONTENT-QUALITY:END -->
