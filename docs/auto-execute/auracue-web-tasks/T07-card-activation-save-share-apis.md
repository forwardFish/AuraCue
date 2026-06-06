# Task T07 - Card Activation Save Share APIs

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-API-DOMAIN` |
| Task 类型 | API domain implementation |
| 主验收面 | method/path/schema/auth/persistence contract |
| 为什么选这个模板 | 本任务实现卡片读取/渲染/激活/保存/分享/埋点 API 域 |
| 覆盖对象 | API-007..API-013, DB-Activation, DB-SavedCard, DB-ShareEvent, DB-AnalyticsEvent |
| 辅助模板 | `TPL-CONTRACT` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T07-card-activation-save-share-apis.md"
```

## 1. Task 目标

实现 `GET /api/v1/aura-cards/:cardId`、render、activation start、seal、save、share、analytics events。

## 2. 必须读取的输入

Web spec §7.7-7.13, §11-12、`packages/card-renderer`、`packages/analytics-events`、T06 HANDOFF。

## 3. 允许改动范围

`apps/web/app/api/v1/**`、`apps/web/server/renderer/**`、`apps/web/server/analytics/**`、`packages/card-renderer/**`、`packages/analytics-events/**`、tests。

## 4. 禁止事项

不得暴露 prompt/provider secret；不得跳过 holdDurationMs 校验；不得把 renderer failure 静默成功。

## 5. 依赖与续跑门槛

前置：T06。

## 6. 执行步骤

1. 实现 card read/render。
2. 实现 activation start/seal 幂等和 wrong-user negative。
3. 实现 save/share/analytics writes。
4. 实现 renderer fallback/error。
5. 写 API tests 和 readback。

## 7. 必须输出

API transcripts、DB readback、renderer proof、`docs/auto-execute/results/web/T07.json`、`docs/auto-execute/latest/web/T07-HANDOFF.md`。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web test:api -- card-activation-share
pnpm --filter @auracue/web test:db
```

## 9. 细化验收标准

API-007..013 全部有 success/negative/readback；share image 有稳定路径。

## 10. 防停止规则

任一 P0 API 缺失时不得交给页面用 mock 填洞。

## 11. 失败修复路由

API/schema/readback drift：T07 repair。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T10/T11 页面可调用真实本地 API。
