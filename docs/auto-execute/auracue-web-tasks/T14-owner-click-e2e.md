# Task T14 - Owner Click E2E

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-OWNER-E2E` |
| Task 类型 | owner e2e |
| 主验收面 | user click -> API -> DB/state -> visible proof |
| 为什么选这个模板 | T13 证明最短主链后，本任务扩展到所有 owner scenarios 和失败/分支路径 |
| 覆盖对象 | Owner-001..Owner-006, UI-001..UI-009, API-001..API-013, DB all |
| 辅助模板 | `TPL-TEST-E2E` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T14-owner-click-e2e.md"
```

## 1. Task 目标

用 Playwright 或等价浏览器测试扩展验证 happy path、skip upload、upload failure、generation fallback、hold cancel、route guards、share/save，捕获 API transcript、DB readback、trace 和可见 UI 断言。

## 2. 必须读取的输入

`auracue-web-owner-scenario-matrix.md`、T09-T13 HANDOFF。

## 3. 允许改动范围

`apps/web/e2e/**`、`apps/web/playwright.config.*`、`scripts/acceptance/**`、必要的最小产品修复。

## 4. 禁止事项

不使用静态 HTML 替代真实 app；不跳过后端调用；不把 API mock 当真实本地 API，除非 scenario 明确 fallback。

## 5. 依赖与续跑门槛

前置：T13 必须已启动并证明最短主链，或明确交付可复用启动命令。

## 6. 执行步骤

1. 启动 Web 和测试 DB。
2. 跑 happy path、skip upload、upload failure、generation fallback、hold cancel、route guards、share/save。
3. 捕获 trace、screenshots、API、DB readback。
4. 修复可修问题并重跑。

## 7. 必须输出

`docs/auto-execute/traces/web/T14/**`、`docs/auto-execute/screenshots/web/T14/**`、API/DB evidence、`docs/auto-execute/results/web/T14.json`、`docs/auto-execute/latest/web/T14-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:e2e
```

## 9. 细化验收标准

所有 Owner-001..Owner-006 有 verdict；失败分支有可见 UI 和 API/DB 证据；失败后重跑记录写入 result。

## 10. 防停止规则

浏览器失败必须先定位和修复；环境不可用才 `BLOCKED_BY_ENVIRONMENT`。

## 11. 失败修复路由

控件失败回 T09/T10/T11；API/readback 失败回 T05-T07/T12。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T15/T16 可读取完整 E2E evidence。
