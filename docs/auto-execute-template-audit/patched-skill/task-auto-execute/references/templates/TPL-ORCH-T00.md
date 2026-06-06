# TPL-ORCH-T00 - 串行编排任务模板

## 适用场景

用于生成 `T00-omx-auto-execute-orchestrator.md`。该任务只负责未来执行队列的编排、续跑、失败路由和最终门禁调用，不实现产品功能。

## 不适用场景

- 不用于写业务代码。
- 不用于修复测试失败。
- 不用于补 UI、API、DB、外部数据功能。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-ORCH-T00` |
| Task 类型 | orchestration |
| 主验收面 | task queue/result JSON/HANDOFF/log/failure routing |
| 为什么选这个模板 | 说明本任务是整个 auto-execute 队列的唯一串行调度入口 |
| 覆盖对象 | 全部 Task IDs、results/latest/blockers/repair queue/final gate |
| 辅助模板 | 通常为 `TPL-FINAL-GATE` |

## 必须读取输入

- `AGENTS.md`
- `<slug>-auto-execute-master-plan.md`
- `<slug>-codex-exec-prompts-split.md`
- `<slug>-final-acceptance-gate.md`
- `<slug>-tasks/*.md`
- `docs/auto-execute/results/`
- `docs/auto-execute/latest/`
- `docs/auto-execute/blockers.md`
- `docs/auto-execute/repair-queue.md`

## 执行步骤模板

1. 读取 master plan，生成规范化 task queue。
2. 检查每个 task 是否有 `Task Template ID`、result JSON 路径、HANDOFF 路径、依赖和失败路由。
3. 执行 resume probe：读取已有 `results/*.json`、`latest/*HANDOFF.md`、blockers、repair queue。
4. 只启动一个 future fresh `codex exec` worker。
5. 等 worker 退出后，读取 result JSON、HANDOFF、log。
6. 将 verdict 分类为 `PASS`、`PASS_WITH_LIMITATION`、`PASS_NEEDS_MANUAL_UI_REVIEW`、`REPAIR_REQUIRED`、`BLOCKED_BY_ENVIRONMENT`、`BLOCKED_BY_MISSING_SOURCE` 或 `HARD_FAIL`。
7. 遇到可修复失败，写入或启动最小 repair task。
8. 所有 P0 durable evidence 齐全后，才调用 final gate。

## 禁止事项

- 禁止把聊天回复当作完成证据。
- 禁止并行启动存在依赖关系的任务。
- 禁止跳过失败任务继续报 ready。
- 禁止没有 result JSON 或 HANDOFF 就启动下一个任务。

## 最低验证命令

生成任务包时只要求写入未来验证命令。未来 T00 执行时必须至少能检查：

```powershell
Test-Path docs/auto-execute/results/<TASK-ID>.json
Test-Path docs/auto-execute/latest/<TASK-ID>-HANDOFF.md
```

## 必须输出证据

- `docs/auto-execute/results/T00.json`
- `docs/auto-execute/latest/T00-HANDOFF.md`
- 队列状态表
- repair queue 更新记录
- final gate 调用记录

## 失败路由

- 缺任务文件：`NEEDS_REGENERATION`
- 缺 result JSON/HANDOFF：`REPAIR_REQUIRED`
- 缺 PRD/UI/source：`BLOCKED_BY_MISSING_SOURCE`
- 环境无法启动且无替代证据：`BLOCKED_BY_ENVIRONMENT`

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
