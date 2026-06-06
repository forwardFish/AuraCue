# Task T09 - Web Create Flow Pages

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-FRONTEND-PAGE` |
| Task 类型 | frontend page |
| 主验收面 | create flow route/page/state group |
| 为什么选这个模板 | 本任务实现 Mood、Context、Upload、Draw 四个创建流程页面组 |
| 覆盖对象 | UI-001..UI-004, UI-010, API-001..API-005, Owner-001..Owner-003 |
| 辅助模板 | `TPL-PAGE-CLICK-API` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T09-web-create-flow-pages.md"
```

## 1. Task 目标

实现 `/`、`/create/context`、`/create/upload`、`/create/draw`，接入真实本地 API 和 draft store。

## 2. 必须读取的输入

Web spec §8.1-8.4、UI map UI-001..004/010、T05/T06/T08 HANDOFF。

## 3. 允许改动范围

`apps/web/app/page.tsx`、`apps/web/app/create/**`、`apps/web/components/**`、`apps/web/tests/pages/**`、E2E fixtures。

## 4. 禁止事项

不出现付费入口；上传失败不能阻塞；未选卡不能生成；不得用 fake API 替代已完成本地 API。

## 5. 依赖与续跑门槛

前置：T05、T06、T08。

## 6. 执行步骤

1. 实现首页 mood cards 和今日已激活入口。
2. 实现 context 选择/skip/guard。
3. 实现 upload success/error/retry/skip。
4. 实现 draw session、三卡选择、generate、retry。
5. 写 page tests 和 click/API assertions。

## 7. 必须输出

page test logs、route screenshots target、`docs/auto-execute/results/web/T09.json`、`docs/auto-execute/latest/web/T09-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:pages -- create-flow
pnpm --filter @auracue/web typecheck
```

## 9. 细化验收标准

选 mood -> context/skip -> upload/skip -> draw -> generate 成功跳 `/result/[id]`。

## 10. 防停止规则

任何 P0 控件无可执行 effect 必须修复。

## 11. 失败修复路由

页面无法渲染或 API 未调用：T09 repair；API contract drift：回 T05/T06/T07。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T13 可执行创建阶段点击。
