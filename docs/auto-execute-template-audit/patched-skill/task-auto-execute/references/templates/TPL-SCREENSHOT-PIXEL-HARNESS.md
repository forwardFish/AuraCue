# TPL-SCREENSHOT-PIXEL-HARNESS - 截图与像素对比 Harness 任务模板

## 适用场景

用于构建或修复真实截图和像素比较 harness：Playwright/Chromium capture、mini-program preview rendering、rpx-to-px、pixelmatch artifacts、anti-fake actual guard。典型历史任务包括 `T45-browser-screenshot-harness`、`T46-pixelmatch-artifact-writer`、`runtime-visual-capture-harness`。

## 不适用场景

- 不用于直接修页面样式，样式修复使用 `TPL-VISUAL-REPAIR`。
- 不用于只做人工截图说明。
- 不用于没有 reference source 的 pure PASS。
- 不用于把结构化 DOM 检查冒充像素 PASS。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-SCREENSHOT-PIXEL-HARNESS` |
| Task 类型 | screenshot/pixel harness |
| 主验收面 | reference/actual/diff/metrics artifact generation |
| 为什么选这个模板 | 说明本任务是构建截图/像素 harness，而不是修 UI |
| 覆盖对象 | UI IDs、Route IDs、Viewport IDs、Screenshot IDs |
| 辅助模板 | `TPL-VISUAL-COMPARE`、`TPL-VISUAL-REPAIR`、`TPL-MINIAPP-PAGE` |

## 必须读取输入

- UI reference map。
- target routes、states、viewports。
- local runtime start command。
- preview renderer entry。
- reference image paths。
- artifact directory contract。
- 当前 harness 的 structural-only 限制和已知 blocker。

## 允许改动范围

- `tools/ui-visual/**`
- `tests/**`
- `package.json` 和 lock file，仅当 harness dependency 必需时。
- `docs/auto-execute/evidence/screenshot-pixel/**`
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止把 `reference.png` 或旧 `screen.png` 直接挂载成 actual。
- 禁止把 structural harness 当 pixel PASS。
- 禁止调用远程截图服务。
- 禁止顺手修改产品页面视觉，除非是 preview fixture 所需的极小 hook。
- 禁止无 reference 时写 pure PASS。

## 执行步骤模板

1. 建立 route-aware preview renderer，确保 actual 来自页面代码和本地 fixture。
2. 建立 viewport 固定规则，miniapp 常用 `390x844`，rpx 转 px 规则为 `viewportWidth / 750`。
3. 用 Playwright-compatible Chromium 捕获 actual screenshot。
4. 复制或定位 independent reference image。
5. 用 `pixelmatch + pngjs` 生成 `reference.png`、`actual.png`、`diff.png`、`metrics.json`、`summary.json`。
6. 写 anti-fake guard：actual 路径/hash 不能等于 reference，页面不能直接引用 reference 作为 actual。
7. 写 status rule：阈值内为 `PASS`，无 reference 为 `PASS_NEEDS_REFERENCE`，无 raster 为 `PASS_NEEDS_MANUAL_UI_REVIEW`，超阈值为 `REPAIR_REQUIRED`。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| actual 来源 | actual 必须来自运行中的页面/preview renderer，不能来自参考图 |
| viewport | 每个截图必须写清 viewport、device scale、rpx conversion |
| pixel metric | 必须包含 `diffPixels`、`totalPixels`、`diffRatio`、`threshold`、`status` |
| reference 缺失 | 无 independent reference 时只能 `PASS_NEEDS_REFERENCE` 或 blocker |
| 结构证据降级 | 只有 DOM/HTML/summary 时不能 pure PASS |

## 最低验证命令

```powershell
<visual capture command>
<pixelmatch command>
<harness unit/static guard command>
```

## 验收证据

- harness summary。
- 至少一个页面的 `reference.png`、`actual.png`、`diff.png`。
- `metrics.json` 和 `summary.json`。
- anti-fake static guard log。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `viewport`
- `referencePaths`
- `actualPaths`
- `diffPaths`
- `metricsPaths`
- `antiFakeChecks`
- `missingReferences`
- `repairRouting`
- `limitations`

## 失败路由

- actual 复用 reference：`HARD_FAIL`。
- 无 raster capture：`PASS_NEEDS_MANUAL_UI_REVIEW` 或 `BLOCKED_BY_ENVIRONMENT`。
- 无 reference：`PASS_NEEDS_REFERENCE` 或 `BLOCKED_BY_MISSING_SOURCE`。
- diff 超阈值：`REPAIR_REQUIRED`，并生成 `TPL-VISUAL-REPAIR` 输入。
- browser 不可用：`BLOCKED_BY_ENVIRONMENT`。
