# TPL-DESIGN-TOKEN-ASSET-INVENTORY - 设计 Token 与资产盘点任务模板

## 适用场景

用于从 UI references、HTML/CSS、Figma、截图或历史页面中提取共享 design tokens、视觉 motif、资产清单，并生成可导入的 token package 或项目级样式依据。典型历史任务包括 `extract-ui-tokens-and-asset-inventory`、`design-tokens-routes`、`ui-visual-target-map`。

## 不适用场景

- 不用于实现具体页面。
- 不用于最终视觉 PASS。
- 不用于替代 `TPL-UI-MAP` 的 route/state/control 映射。
- 不用于凭感觉发明品牌视觉。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-DESIGN-TOKEN-ASSET-INVENTORY` |
| Task 类型 | design token and asset inventory |
| 主验收面 | token extraction, asset manifest, build/import proof |
| 为什么选这个模板 | 说明本任务要抽取视觉基础资产，而不是实现页面 |
| 覆盖对象 | UI IDs、Asset IDs、Token IDs、Route IDs |
| 辅助模板 | `TPL-UI-MAP`、`TPL-FRONTEND-PAGE`、`TPL-MINIAPP-PAGE` |

## 必须读取输入

- UI reference map。
- 所有 P0 screenshots/design frames。
- HTML/CSS/Figma/design source，若存在。
- 目标 frontend/miniapp style system。
- source asset folders。
- 现有色彩、字体、spacing、图标、图片、组件样式。

## 允许改动范围

- `packages/ui-tokens/**`
- frontend/miniapp shared styles。
- asset manifest。
- token report under `docs/auto-execute/intake/`。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止修改 source screenshots/design refs。
- 禁止只写 primary/secondary 这类泛化 token。
- 禁止实现页面级布局。
- 禁止忽略中文字体、rpx/px、阴影、圆角、视觉密度。
- 禁止把缺失资产静默替换成无关图标。

## 执行步骤模板

1. 建立 UI source 列表，记录 source path、viewport、尺寸、状态。
2. 提取 color palette，并写明 usage、状态色、风险/成功/警告语义。
3. 提取 typography：字体族、字号、行高、字重、数字样式、中文 fallback。
4. 提取 spacing/rhythm：px 与 rpx 转换、网格、内外边距。
5. 提取 radius、shadow、border、z-depth、background treatment。
6. 建立 CTA/button/card/input/table/modal token。
7. 建立 asset manifest：文件、来源、用途、尺寸、缺失替代策略。
8. 生成 token package 或 shared style 文件，并跑 import/build test。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| token 来源 | 每个核心 token 必须能回指 UI source 或现有代码 |
| 资产清单 | 每个 P0 图标/图片/motif 必须有 source、target path、用途 |
| 中文字体 | 必须说明中文字体 fallback 和文本密度 |
| miniapp 单位 | miniapp 项目必须写 rpx/px 转换规则 |
| 构建证明 | token package 或 shared style 必须有 build/import 证据 |

## 最低验证命令

```powershell
<token package build/test command>
<asset manifest validation command>
```

## 验收证据

- token files。
- asset manifest。
- token extraction report。
- token build/import log。
- no-source-modified git/status note。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `tokenFiles`
- `assetManifest`
- `sourceUiIds`
- `missingAssets`
- `buildCommand`
- `buildResult`
- `limitations`

## 失败路由

- P0 UI token missing/generic：`REPAIR_REQUIRED`。
- source UI missing：`BLOCKED_BY_MISSING_SOURCE`。
- raster detail unavailable：`PASS_NEEDS_MANUAL_UI_REVIEW`。
- token package cannot build/import：`REPAIR_REQUIRED`。
