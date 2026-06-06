# Task T01 - Web-first Source Lock And Intake

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-INTAKE` |
| Task 类型 | intake |
| 主验收面 | source inventory and blocker map |
| 为什么选这个模板 | 本任务只锁定 Web-first 源头、现有资产、缺口和外部副作用边界 |
| 覆盖对象 | SRC-AGENTS, SRC-PRD-001, SRC-WEB-001, SRC-UI-*, SRC-API-LEGACY |
| 辅助模板 | `TPL-REQ-MATRIX` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T01-source-lock-and-intake.md"
```

## 1. Task 目标

确认当前版本只做 H5/Web，输出可供 T02-T15 使用的 source inventory、现有代码资产盘点、Web-first 缺口、legacy 小程序降级边界。

## 2. 必须读取的输入

`AGENTS.md`、`docs/AuraCue_Web_First_Full_Development_Spec_v1.0.md`、`docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`、`docs/UI/小程序/README.md`、`apps/api`、`apps/wechat-mini`、`packages/*`。

## 3. 允许改动范围

只允许更新 `docs/auto-execute/auracue-web-*.md` 中的盘点结论，以及 future result/HANDOFF/log 路径。

## 4. 禁止事项

不开发产品代码；不启动服务；不把旧小程序 unlock/payment/invite 当 Web P0。

## 5. 依赖与续跑门槛

前置：T00。若已存在合格 T01 result/HANDOFF，先读取再决定是否刷新。

## 6. 执行步骤

1. 读取 docs 和 UI 目录。
2. 盘点 `apps/web` 是否存在、`apps/api` 可复用点、`apps/wechat-mini` legacy 边界。
3. 更新 blocker map。
4. 确认 local-only、AI key、storage、payment 边界。

## 7. 必须输出

`docs/auto-execute/results/web/T01.json`、`docs/auto-execute/latest/web/T01-HANDOFF.md`，含 source inventory、blockers、runtime command 候选。

## 8. 最低验证命令

```powershell
Get-ChildItem -LiteralPath docs -File
Get-ChildItem -LiteralPath apps -Directory
rg -n "apps/web|/api/v1|Web/H5|P0" docs/AuraCue_Web_First_Full_Development_Spec_v1.0.md
```

## 9. 细化验收标准

明确 Web 主线、9 个 route、13 个 API、DB 模型、视觉来源和旧小程序非目标。

## 10. 防停止规则

信息不足时写 `BLOCKED_BY_MISSING_SOURCE`，不要脑补。

## 11. 失败修复路由

源文件缺失：blocker；目录结构与 spec 冲突：交给 T02/T03 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T02 可直接根据 T01 HANDOFF 建 `apps/web`。
