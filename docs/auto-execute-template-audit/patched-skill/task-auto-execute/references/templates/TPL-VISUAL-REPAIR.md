# TPL-VISUAL-REPAIR - 视觉差异修复任务模板

## 适用场景

用于根据 visual diff、metrics、summary 中的 deviation IDs 做最小 UI 修复，并重新截图对比。

## 不适用场景

- 不用于首次 UI mapping。
- 不用于大改信息架构。
- 不用于没有失败视觉证据的主观调色。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-VISUAL-REPAIR` |
| Task 类型 | visual repair |
| 主验收面 | before/after visual diff improvement |
| 为什么选这个模板 | 说明本任务修复哪些 material deviations |
| 覆盖对象 | Deviation IDs、UI IDs、Route IDs、target files |
| 辅助模板 | `TPL-VISUAL-COMPARE` |

## 必须读取输入

- failed visual-summary.json。
- reference/actual/diff/metrics。
- deviation list。
- 目标组件和样式文件。

## 执行步骤模板

1. 将每个 deviation 映射到具体样式或组件。
2. 只修改导致差异的 token、layout、spacing、font、asset 或 state。
3. 重新启动页面并捕获 actual。
4. 重新生成 diff/metrics。
5. 写 remaining deviations。

## 禁止事项

- 禁止借 repair 重写整个页面。
- 禁止不重截就声明修好。
- 禁止只改截图工具不改页面问题。

## 最低验证命令

```powershell
<rerun capture command>
<rerun visual diff command>
```

## 验收证据

- before artifacts。
- after artifacts。
- updated metrics。
- remaining deviations。

## 失败路由

- 差异缩小但仍需人工：`PASS_NEEDS_MANUAL_UI_REVIEW`
- 仍有 P0 material deviation：`REPAIR_REQUIRED`

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
