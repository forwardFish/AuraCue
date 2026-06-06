# TPL-DATA-MODEL-MIGRATION - 数据模型与迁移任务模板

## 适用场景

用于 schema、table、collection、model、migration、seed、index、adapter 或数据兼容层变更。目标是让数据结构可迁移、可回读、可回滚或至少有清晰失败边界。

## 不适用场景

- 不用于无回滚说明的破坏性改库。
- 不用于业务 API 全实现。
- 不用于外部 SaaS 表字段验证，那个用 `TPL-EXTERNAL-DATA`。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-DATA-MODEL-MIGRATION` |
| Task 类型 | data model migration |
| 主验收面 | schema/migration/seed/readback |
| 为什么选这个模板 | 说明本任务改变哪类持久化模型 |
| 覆盖对象 | DB IDs、model IDs、migration IDs、API IDs、Req IDs |
| 辅助模板 | `TPL-API-DOMAIN`、`TPL-TEST-INTEGRATION` |

## 必须读取输入

- 当前 schema/model/migration 文件。
- requirement matrix 中的数据规则。
- API/DB contract matrix。
- seed 或 fixture 数据。
- local DB/runtime 命令。

## 执行步骤模板

1. 记录当前数据模型和受影响 API。
2. 设计 migration：新增字段、类型、默认值、索引、唯一键、兼容读取。
3. 写 migration、model、adapter、seed fixture。
4. 写 rollback 或明确不可逆原因。
5. 执行本地 migration。
6. 写入测试数据并独立 readback。
7. 跑受影响 API/service tests。

## 禁止事项

- 禁止删除用户数据。
- 禁止在不清楚数据库位置时写迁移。
- 禁止只改类型文件不验证真实持久化。
- 禁止把 readback 省略。

## 最低验证命令

```powershell
<migration up command>
<seed command>
<db readback command or integration test>
<impacted API/service test command>
```

## 验收证据

- migration log。
- schema before/after。
- seed fixture。
- DB readback JSON。
- impacted tests log。

## Result JSON 必填

- `changed_models`
- `migration_files`
- `rollback_strategy`
- `readback_evidence`
- `impacted_api_ids`
- `limitations`

## 失败路由

- 迁移失败但可修：`REPAIR_REQUIRED`
- DB 环境缺失：`BLOCKED_BY_ENVIRONMENT`
- 数据规则缺失：`BLOCKED_BY_MISSING_SOURCE`
- 发现破坏性迁移风险：停止并写 blocker

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
