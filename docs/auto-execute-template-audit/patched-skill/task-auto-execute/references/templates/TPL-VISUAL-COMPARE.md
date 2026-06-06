# TPL-VISUAL-COMPARE - 前端页面一比一复刻验证任务模板

## 适用场景

用于用户要求“一比一”“按图还原”“复刻 UI”“pixel-perfect”的页面、状态、弹窗或组件。

## 不适用场景

- 不用于没有 UI reference 的页面。
- 不用于只检查 DOM 结构。
- 不用于把截图缺失升级为 pure PASS。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-VISUAL-COMPARE` |
| Task 类型 | visual one-to-one comparison |
| 主验收面 | reference/actual/diff/metrics visual proof |
| 为什么选这个模板 | 说明本任务验证哪个 UI reference 的一比一还原 |
| 覆盖对象 | UI IDs、Route IDs、Viewport IDs、Screenshot IDs |
| 辅助模板 | `TPL-FRONTEND-PAGE`、`TPL-VISUAL-REPAIR` |

## 必须读取输入

- reference image/prototype path。
- UI map 中的 target route/state/viewport。
- fixture 或 local API 数据。
- capture/diff 工具命令。

## 执行步骤模板

1. 准备目标页面 fixture，让截图状态可见。
2. 启动本地 app 或等价 UI harness。
3. 捕获 actual screenshot。
4. 保存 reference copy、actual、diff、metrics、summary。
5. 对比布局、颜色、字体、间距、圆角、阴影、图标、文本和状态。
6. material deviations 转成 repair task。

## 禁止事项

- 禁止没有 actual raster screenshot 就写 pixel PASS。
- 禁止只凭肉眼描述。
- 禁止使用模糊、裁切、暗化的截图替代验收。

## 最低验证命令

```powershell
<start app command>
<capture screenshot command>
<visual diff command>
```

## 验收证据

- `docs/auto-execute/screenshots/<TASK-ID>/reference.*`
- `docs/auto-execute/screenshots/<TASK-ID>/actual.*`
- `docs/auto-execute/screenshots/diffs/<TASK-ID>/diff.*`
- `docs/auto-execute/screenshots/diffs/<TASK-ID>/metrics.json`
- `docs/auto-execute/screenshots/diffs/<TASK-ID>/visual-summary.json`

## 状态规则

- 全部 P0 reference 有 raster/diff 且无 material deviation：`PASS`
- 功能可证但缺 raster/pixel：`PASS_NEEDS_MANUAL_UI_REVIEW`
- 有 material deviation：`REPAIR_REQUIRED`

## 失败路由

- 缺 reference source：`BLOCKED_BY_MISSING_SOURCE`
- local app 或截图环境不可用：`BLOCKED_BY_ENVIRONMENT`
- 缺 actual/diff/metrics：不能 pure PASS，写 `PASS_NEEDS_MANUAL_UI_REVIEW` 或 `REPAIR_REQUIRED`
- material deviation 可修：生成 `TPL-VISUAL-REPAIR`

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
