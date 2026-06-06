# Task T10 - Web Result Activation Pages

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-FRONTEND-PAGE` |
| Task 类型 | frontend page |
| 主验收面 | result and activation route/page/state group |
| 为什么选这个模板 | 本任务实现结果页、激活页、激活成功页 |
| 覆盖对象 | UI-005..UI-007, API-007, API-009, API-010, API-011, API-012, Owner-004 |
| 辅助模板 | `TPL-PAGE-CLICK-API` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T10-web-result-activation-pages.md"
```

## 1. Task 目标

实现 `/result/[id]`、`/activate/[id]`、`/activated/[id]`，包括 HoldToSealButton 3000ms 行为。

## 2. 必须读取的输入

Web spec §8.5-8.7、UI map UI-005..007、T07/T08/T09 HANDOFF。

## 3. 允许改动范围

`apps/web/app/result/**`、`apps/web/app/activate/**`、`apps/web/app/activated/**`、`apps/web/components/**`、tests。

## 4. 禁止事项

主 CTA 不能是 Pay/Unlock；长按不足 3000ms 不能 seal；已激活 guard 不得错。

## 5. 依赖与续跑门槛

前置：T07、T09。

## 6. 执行步骤

1. Result 读取 card，展示完整字段和 save/share/activate。
2. Activate 读取 card，选择 anchor，start activation。
3. HoldToSeal 支持 mouse/touch、cancel、complete、防重复。
4. Activated guard 和 save/share/done。
5. 写 component/page tests。

## 7. 必须输出

`docs/auto-execute/results/web/T10.json`、`docs/auto-execute/latest/web/T10-HANDOFF.md`、Hold button tests、page logs。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:pages -- result-activation
pnpm --filter @auracue/web test -- hold-to-seal
```

## 9. 细化验收标准

1000ms 松手不调用 seal；3100ms 调 seal 并跳 activated；保存/分享可用。

## 10. 防停止规则

长按行为不可只靠 CSS，必须测试。

## 11. 失败修复路由

seal/API/page failure：T10 或 T07 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T13 可执行激活阶段点击。
