# TPL-ADMIN-WORKFLOW - 后台工作流任务模板

## 适用场景

用于后台管理流程：上传、审核、配置、发布、启停、人工修正、批处理、运营后台表单。

## 不适用场景

- 不用于普通用户前台点击流程。
- 不用于只实现 API。
- 不用于无权限边界的后台改动。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-ADMIN-WORKFLOW` |
| Task 类型 | admin workflow |
| 主验收面 | admin action -> API -> DB -> visible effect |
| 为什么选这个模板 | 说明本任务覆盖哪个后台工作流 |
| 覆盖对象 | Admin UI IDs、API IDs、DB IDs、Req IDs |
| 辅助模板 | `TPL-AUTH-IDENTITY`、`TPL-OWNER-E2E` |

## 必须读取输入

- 管理员角色和权限规则。
- 后台页面 UI 或 PRD。
- API/DB contract。
- 发布或配置影响的前台页面。

## 执行步骤模板

1. 实现或修复后台页面状态。
2. 实现上传/审核/配置/发布动作。
3. 调用 API 并验证 DB mutation/readback。
4. 验证前台或 owner 侧可见效果。
5. 覆盖 invalid、unauthorized、empty、retry 场景。

## 最低验证命令

```powershell
<admin workflow e2e or integration test>
<api/db readback test>
```

## 验收证据

- admin 操作 trace。
- API transcript。
- DB readback。
- 前台可见结果截图或断言。

## 失败路由

- 权限绕过：`REPAIR_REQUIRED`
- 发布结果不可见：`REPAIR_REQUIRED`
- 后台需求缺源：`BLOCKED_BY_MISSING_SOURCE`

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
