# TPL-REQ-MATRIX - 需求归一与追踪矩阵任务模板

## 适用场景

用于把用户指令、PRD、UI、现有代码和参考材料归一成可执行的 requirement IDs，并建立 requirement -> task -> test -> evidence 的追踪关系。

## 不适用场景

- 不用于写代码。
- 不用于补充不存在的需求。
- 不用于把 UI 猜测当业务需求。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-REQ-MATRIX` |
| Task 类型 | requirement traceability |
| 主验收面 | requirement coverage matrix |
| 为什么选这个模板 | 说明本任务负责把需求拆成可验证 ID |
| 覆盖对象 | Req IDs、source sections、priority、role、task/test/evidence IDs |
| 辅助模板 | `TPL-UI-MAP`、`TPL-CONTRACT` |

## 必须读取输入

- 用户最新指令。
- PRD/需求文档。
- UI reference map 或原始 UI sources。
- API/DB 线索。
- 已生成或计划生成的 task queue。

## 执行步骤模板

1. 按 source section 抽取候选需求。
2. 为每条需求分配稳定 `REQ-xxx`。
3. 标记 P0/P1/P2、角色、页面、API、DB、外部数据、非功能要求。
4. 将每条 P0/P1 映射到实现 task 和验证 task。
5. 为每条需求预留 evidence path。
6. 对冲突、缺失、重复和过期需求写 blocker。

## 验收矩阵字段

| 字段 | 必填说明 |
| --- | --- |
| Req ID | 稳定唯一 |
| Source | 文档路径和章节 |
| Priority | P0/P1/P2 |
| Role | owner/admin/user/system |
| UI IDs | 可为空但必须说明 |
| API IDs | 可为空但必须说明 |
| DB/External IDs | 可为空但必须说明 |
| Implementation Task | 任务 ID |
| Verification Task | 任务 ID |
| Evidence Path | 未来证据路径 |
| Status | `PLANNED` 或 blocker |

## 禁止事项

- 禁止把未确认的想法升级为 P0。
- 禁止遗漏用户明确提出的验收要求。
- 禁止不写 evidence path。

## 失败路由

- 需求来源冲突：`BLOCKED_BY_MISSING_SOURCE`
- P0 无实现或验证 task：`NEEDS_REGENERATION`

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
