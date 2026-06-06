# TPL-MINIAPP-PAGE - 小程序页面实现任务模板

## 适用场景

用于实现或验证一个小程序页面或页面状态组：WXML、WXSS、page JSON、rpx layout、navigation、state、API binding、loading/empty/error/unauthorized/locked/paid states。典型历史任务包括 `miniprogram-home`、`miniprogram-today-card`、`miniprogram-ui-one-to-one-runtime`。

## 不适用场景

- 不用于 Web-only page。
- 不用于小程序壳、全局路由或 API client 基建。
- 不用于最终视觉 diff harness。
- 不用于多个大页面混在一个 task。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-MINIAPP-PAGE` |
| Task 类型 | mini-program page |
| 主验收面 | one mini-program route/state group |
| 为什么选这个模板 | 说明本任务实现哪一个小程序页面和哪些状态 |
| 覆盖对象 | UI IDs、Page IDs、Route IDs、API IDs、State IDs、Owner IDs |
| 辅助模板 | `TPL-VISUAL-COMPARE`、`TPL-PAGE-CLICK-API`、`TPL-LOCALE-ENCODING-GUARD` |

## 必须读取输入

- UI ID and reference path。
- target mini-program route。
- viewport and rpx conversion rule。
- design tokens。
- API/data fixture。
- owner scenario/control IDs。
- shell route/API client contract。

## 允许改动范围

- target mini-program page files。
- page-local components/styles。
- tests and fixtures。
- screenshot/evidence paths。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止用 generic dashboard 替代 reference。
- 禁止跳过 loading/empty/error/unauthorized/locked/paid 等必需状态。
- 禁止使用真实云服务。
- 禁止文字溢出、中文 copy 漂移或 mojibake。
- 禁止把本地 mock 预览冒充真实 WeChat simulator/device 证明。

## 执行步骤模板

1. 确认 page JSON registration、route、navigation entry。
2. 按 design tokens 实现 WXML/WXSS/layout，写清 rpx 转换。
3. 实现 loaded、loading、empty、error、unauthorized、locked、paid 等任务要求状态。
4. 绑定 API/local fixture，确保目标状态可稳定显示。
5. 实现 button、tab、form、modal、toast、navigation 事件。
6. 添加 page render、interaction、fixture/state tests。
7. 准备 screenshot target；若无法截图，写明 `PASS_NEEDS_MANUAL_UI_REVIEW` 限制。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| UI reference | 每个页面必须引用具体 reference path/ID |
| 状态完整性 | loaded/empty/error/loading/unauthorized/locked/paid 是否需要必须逐项说明 |
| 数据来源 | API、local fixture、fallback 必须标注，fallback UI 必须可见 |
| 交互 | P0 控件必须有 click/form/modal/navigation 预期 |
| 视觉限制 | 无 raster screenshot 时不能 pure PASS |

## 最低验证命令

```powershell
<miniapp page render/smoke command>
<page interaction test command>
<screenshot capture command if available>
```

## 验收证据

- page test log。
- route/state evidence。
- screenshot target 或 truthful limitation。
- API/state readback if page mutates data。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `route`
- `coveredUiIds`
- `coveredStates`
- `controlAssertions`
- `dataSourceMode`
- `screenshotEvidence`
- `limitations`

## 失败路由

- page cannot render：`REPAIR_REQUIRED`。
- missing UI source：`BLOCKED_BY_MISSING_SOURCE`。
- no raster proof：最高 `PASS_NEEDS_MANUAL_UI_REVIEW`。
- miniapp runtime unavailable：`BLOCKED_BY_ENVIRONMENT`。
