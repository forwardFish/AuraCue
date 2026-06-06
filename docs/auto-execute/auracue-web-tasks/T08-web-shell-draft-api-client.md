# Task T08 - Web Shell Draft API Client

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-FRONTEND-SHELL` |
| Task 类型 | frontend shell |
| 主验收面 | route/layout/token/API client foundation |
| 为什么选这个模板 | 页面实现前需要统一 layout、routes、draft store、API client、loading/error foundation |
| 覆盖对象 | Route-001..009, UI-SHELL, REQ-001, REQ-002 |
| 辅助模板 | `TPL-LOCAL-SMOKE` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T08-web-shell-draft-api-client.md"
```

## 1. Task 目标

实现 Web route shell、global style tokens、draft store、API client、analytics wrapper、shared loading/error components。

## 2. 必须读取的输入

T02/T04/T05 HANDOFF、`auracue-web-ui-reference-map.md`、Web spec §8-9、`packages/ui-tokens`。

## 3. 允许改动范围

`apps/web/app/**`、`apps/web/components/**`、`apps/web/lib/**`、`apps/web/tests/unit/**`。

## 4. 禁止事项

不完成具体页面业务；不把核心 card/activation 存 localStorage。

## 5. 依赖与续跑门槛

前置：T02、T04。

## 6. 执行步骤

1. 建 route constants。
2. 建 layout/theme/tokens。
3. 建 API client envelope/error handling。
4. 建 draft store。
5. 建 analytics non-blocking wrapper。
6. 写 unit/smoke tests。

## 7. 必须输出

`docs/auto-execute/results/web/T08.json`、`docs/auto-execute/latest/web/T08-HANDOFF.md`、unit logs、route smoke logs。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test -- draft-store api-client
pnpm --filter @auracue/web typecheck
```

## 9. 细化验收标准

所有后续页面复用同一 client/store，不重复实现 API fetch。

## 10. 防停止规则

API client 错误处理缺失必须本 task 修复。

## 11. 失败修复路由

typecheck/unit failure：T08 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T09-T11 可实现页面。
