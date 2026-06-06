# TPL-REPORT-CARD-RENDERER - 报告卡片与分享渲染器任务模板

## 适用场景

用于实现 report card、share card、question card、image/PDF-like renderer、daily report card 等确定性渲染器，要求尺寸、文本适配、资产、快照或本地 artifact 证明。典型历史任务包括 `share-card-renderer`、`full-report-question-cards`、`card-task-report-api`。

## 不适用场景

- 不用于 raw file download，下载导出使用 `TPL-EXPORT-DOWNLOAD`。
- 不用于普通页面布局。
- 不用于只写 API JSON 而不渲染 artifact。
- 不用于真实第三方图片生成服务。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-REPORT-CARD-RENDERER` |
| Task 类型 | report/card renderer |
| 主验收面 | deterministic card rendering and artifact proof |
| 为什么选这个模板 | 说明本任务输出可视化卡片/报告 artifact |
| 覆盖对象 | Report IDs、Card IDs、Template IDs、Asset IDs、API IDs |
| 辅助模板 | `TPL-EXPORT-DOWNLOAD`、`TPL-VISUAL-COMPARE`、`TPL-LOCALE-ENCODING-GUARD` |

## 必须读取输入

- report/card content schema。
- visual reference or dimensions。
- required assets/icons/fonts。
- target output type：PNG、SVG、HTML snapshot、data URL、PDF-like local artifact。
- text length and localization rules。
- API or data fixture that feeds renderer。

## 允许改动范围

- renderer modules/components。
- report/card templates。
- renderer tests/fixtures。
- local artifact output directory。
- API wrapper only if renderer endpoint is part of the task。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止只返回文本 JSON 而不生成渲染 artifact。
- 禁止忽略长文本、中文换行、数字对齐、溢出。
- 禁止使用远程截图或生产生成服务。
- 禁止把渲染器样例当成业务数据 readback，二者要分开。

## 执行步骤模板

1. 定义 renderer input schema、required fields、optional fields、fallback copy。
2. 定义 canvas/dimension、safe area、font、asset、text fit、overflow rules。
3. 实现 deterministic renderer，支持本地 fixture。
4. 输出 local artifact：image/html/data URL/PDF-like 文件，按项目要求选择。
5. 覆盖 success、missing optional、long text、Chinese copy、asset missing、invalid input。
6. 如有 API，加入 response contract 和 renderer artifact readback。
7. 生成 snapshot/visual proof，记录 artifact path。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 尺寸 | 卡片宽高、safe area、输出格式必须固定 |
| 文本适配 | 中文长文、数字、换行、ellipsis 或缩放规则必须测试 |
| 资产 | 图标/图片/字体 source 和 missing fallback 必须说明 |
| artifact | 必须有本地可检查 artifact，不能只有函数返回 |
| API 区分 | renderer proof 与 API/DB readback proof 必须分开 |

## 最低验证命令

```powershell
<renderer fixture test command>
<snapshot or artifact validation command>
<api contract command if endpoint exists>
```

## 验收证据

- renderer fixture outputs。
- local artifact paths。
- snapshot/visual summary。
- long-text/Chinese text-fit test log。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `rendererInputs`
- `artifactPaths`
- `dimensions`
- `textFitCases`
- `assetManifest`
- `apiEvidence`
- `limitations`

## 失败路由

- artifact missing：`REPAIR_REQUIRED`。
- text overflow/material layout break：`REPAIR_REQUIRED`。
- missing visual/source dimensions：`BLOCKED_BY_MISSING_SOURCE`。
- renderer depends on unavailable runtime：`BLOCKED_BY_ENVIRONMENT`。
