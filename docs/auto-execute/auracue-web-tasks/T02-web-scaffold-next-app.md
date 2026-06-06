# Task T02 - Web Scaffold Next App

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-SCAFFOLD` |
| Task 类型 | scaffold |
| 主验收面 | install/build/start/test skeleton |
| 为什么选这个模板 | `apps/web` 是 Web-first P0 blocker，需要先建立可运行 Next.js App Router 骨架 |
| 覆盖对象 | REQ-001, Route-001..009, TEST-UNIT-001 |
| 辅助模板 | `TPL-LOCAL-SMOKE` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T02-web-scaffold-next-app.md"
```

## 1. Task 目标

创建或修复 `apps/web`，让 Next.js + TypeScript + Tailwind + workspace scripts 可安装、可 typecheck、可 smoke render。只做骨架，不完成业务页面。

## 2. 必须读取的输入

T01 HANDOFF、root `package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`、`packages/ui-tokens`、Web spec §3-4。

## 3. 允许改动范围

`apps/web/**`、root workspace 配置、`scripts/acceptance/**` 中与 web scaffold 相关的最小文件。

## 4. 禁止事项

不实现复杂业务；不引入真实云/支付；不破坏 `apps/api` 和 `apps/wechat-mini` 现有测试。

## 5. 依赖与续跑门槛

前置：T01 result/HANDOFF。

## 6. 执行步骤

1. 建 `apps/web/package.json` 和 Next.js 基础配置。
2. 建 `app/layout.tsx`、`app/page.tsx`、基础 route placeholder。
3. 接入 Tailwind 和 UI tokens。
4. 添加 `lint/typecheck/test/build/dev` scripts。
5. 添加最小 smoke test。

## 7. 必须输出

代码 diff、`docs/auto-execute/results/web/T02.json`、`docs/auto-execute/latest/web/T02-HANDOFF.md`、logs。

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web typecheck
pnpm --filter @auracue/web test
pnpm --filter @auracue/web build
```

## 9. 细化验收标准

`apps/web` 可构建；route placeholders 存在；后续 T08-T11 可在该结构上实现页面。

## 10. 防停止规则

依赖缺失时修 package/workspace；不能只报告“需要安装”。

## 11. 失败修复路由

build/typecheck 失败留在 T02 修复；外部依赖无法安装才 `BLOCKED_BY_ENVIRONMENT`。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T03/T04 能基于 `apps/web` 添加 Prisma/API。
