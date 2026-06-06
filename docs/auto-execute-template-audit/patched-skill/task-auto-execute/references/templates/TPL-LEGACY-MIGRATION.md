# TPL-LEGACY-MIGRATION - 旧系统迁移/复用边界任务模板

## 适用场景

用于从旧 repo、旧版本、参考项目迁移或复用代码、配置、adapter、测试、数据模型。

## 不适用场景

- 不用于无边界复制旧业务。
- 不用于把旧 repo 变成第二需求源。
- 不用于跳过目标项目 PRD。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-LEGACY-MIGRATION` |
| Task 类型 | legacy migration |
| 主验收面 | reuse boundary and target adaptation |
| 为什么选这个模板 | 说明本任务迁移哪类旧系统能力 |
| 覆盖对象 | Legacy paths、Target paths、Req IDs、Compatibility IDs |
| 辅助模板 | `TPL-REF-MAP`、`TPL-TEST-INTEGRATION` |

## 必须读取输入

- legacy repo path。
- target repo path。
- user-approved reuse boundary。
- compatibility requirements。

## 执行步骤模板

1. 只读盘点 legacy files。
2. 分类为 `COPY_AS_IS`、`ALLOW_ADAPT`、`REFERENCE_ONLY`、`FORBIDDEN`。
3. 写 migration matrix。
4. 迁移最小必要文件或模式。
5. 适配 target project。
6. 运行 compatibility tests。

## 禁止事项

- 禁止复制旧密钥。
- 禁止复制旧业务文案。
- 禁止绕过目标项目需求。

## 验收证据

- migration matrix。
- copied/adapted file list。
- compatibility test log。
- forbidden list。

## 失败路由

- 复用授权不清：`BLOCKED_BY_MISSING_SOURCE`
- 兼容测试失败：`REPAIR_REQUIRED`

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
