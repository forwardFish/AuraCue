# AuraCue Web/H5 Auto-Execute Master Plan

生成日期：2026-06-03
项目根目录：`D:\lyh\agent\agent-frame\AuraCue`
项目 slug：`auracue-web`
当前阶段：只生成任务包，不执行开发。

## 1. 目标

后续按本队列执行后，AuraCue 必须能作为 H5/Web App 跑起来，并完整完成：

`Mood -> Context -> Optional Outfit Upload/Skip -> Draw -> Generate Aura Card -> Result -> Activate -> Hold 3s Seal -> Activated -> Save/Share/Copy/Download`

Web 是主验收面。小程序只作为现有 UI/流程资产和后续适配参考，不作为本轮 P0 完成条件。

## 2. 非目标

- 不实现 Paywall、真实支付、微信支付、邀请解锁、History、7-Day Trend、Evening Reflection、Shop Your Aura。
- 不把旧 `apps/api` 的非 `/api/v1/*` 接口当作最终 API。
- 不用 mock 页面或静态截图替代真实页面点击、API 调用、DB readback。
- 不把本任务包生成结果当成产品完成。

## 3. 推荐最终结构

```text
D:\lyh\agent\agent-frame\AuraCue
  apps\web
    app
      api\v1
      create\context
      create\upload
      create\draw
      result\[id]
      activate\[id]
      activated\[id]
      share\[id]
      saved\[id]
    components
    lib
    server
    tests
    e2e
  prisma
  scripts\acceptance
  docs\auto-execute
```

## 4. Task Queue

| Order | Task | Task Template ID | 主验收面 | 覆盖对象 | 前置 | 未来 result JSON | 未来 HANDOFF | 失败路由 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 00 | T00 orchestrator | `TPL-ORCH-T00` | 串行调度/续跑/final gate | 全部 task/evidence | none | `docs/auto-execute/results/web/T00.json` | `docs/auto-execute/latest/web/T00-HANDOFF.md` | repair queue |
| 01 | T01 source lock and intake | `TPL-INTAKE` | source inventory/blocker map | SRC/Req/UI/API/DB | T00 | `docs/auto-execute/results/web/T01.json` | `docs/auto-execute/latest/web/T01-HANDOFF.md` | T02 or blocker |
| 02 | T02 Web scaffold | `TPL-SCAFFOLD` | `apps/web` 可安装/可构建基础 | Req-WEB-FOUNDATION | T01 | `docs/auto-execute/results/web/T02.json` | `docs/auto-execute/latest/web/T02-HANDOFF.md` | T02 repair |
| 03 | T03 Prisma data model | `TPL-DATA-MODEL-MIGRATION` | schema/migration/seed/readback | DB-001..DB-010 | T02 | `docs/auto-execute/results/web/T03.json` | `docs/auto-execute/latest/web/T03-HANDOFF.md` | T03 repair |
| 04 | T04 API foundation | `TPL-BACKEND-FOUNDATION` | Next Route Handler/env/error/local guard | API-FOUNDATION | T02,T03 | `docs/auto-execute/results/web/T04.json` | `docs/auto-execute/latest/web/T04-HANDOFF.md` | T04 repair |
| 05 | T05 identity upload draw APIs | `TPL-API-DOMAIN` | identity/upload/draw 合同 | API-001..API-004 | T04 | `docs/auto-execute/results/web/T05.json` | `docs/auto-execute/latest/web/T05-HANDOFF.md` | T05 repair |
| 06 | T06 AI generation APIs | `TPL-AI-PROVIDER` | prompt/schema/mock fallback/generation | API-005..API-006, AI-001 | T04,T05 | `docs/auto-execute/results/web/T06.json` | `docs/auto-execute/latest/web/T06-HANDOFF.md` | T06 repair |
| 07 | T07 card activation save share APIs | `TPL-API-DOMAIN` | card/render/activation/save/share/analytics | API-007..API-013 | T06 | `docs/auto-execute/results/web/T07.json` | `docs/auto-execute/latest/web/T07-HANDOFF.md` | T07 repair |
| 08 | T08 Web shell draft API client | `TPL-FRONTEND-SHELL` | routes/layout/tokens/api client/draft | UI-SHELL, Route-001..009 | T02,T04 | `docs/auto-execute/results/web/T08.json` | `docs/auto-execute/latest/web/T08-HANDOFF.md` | T08 repair |
| 09 | T09 Web create flow pages | `TPL-FRONTEND-PAGE` | `/`, context, upload, draw | UI-001..UI-004, API-001..005 | T05,T08 | `docs/auto-execute/results/web/T09.json` | `docs/auto-execute/latest/web/T09-HANDOFF.md` | T09 repair |
| 10 | T10 Web result activation pages | `TPL-FRONTEND-PAGE` | result/activate/activated | UI-005..UI-007, API-007,009,010,011 | T07,T09 | `docs/auto-execute/results/web/T10.json` | `docs/auto-execute/latest/web/T10-HANDOFF.md` | T10 repair |
| 11 | T11 Web share save pages | `TPL-FRONTEND-PAGE` | share/saved/copy/download | UI-008..UI-009, API-008,011,012 | T07,T10 | `docs/auto-execute/results/web/T11.json` | `docs/auto-execute/latest/web/T11-HANDOFF.md` | T11 repair |
| 12 | T12 API DB full proof | `TPL-API-DB-E2E` | 全 API success/negative/readback | API-001..API-013, DB all | T05,T06,T07 | `docs/auto-execute/results/web/T12.json` | `docs/auto-execute/latest/web/T12-HANDOFF.md` | T05/T06/T07 repair |
| 13 | T13 run whole app page API smoke | `TPL-LOCAL-SMOKE` | 启动 Web app 并跑完整页面/API 最短主链 | Runtime, UI-001..009, API-001..013, DB core | T09,T10,T11,T12 | `docs/auto-execute/results/web/T13.json` | `docs/auto-execute/latest/web/T13-HANDOFF.md` | runtime/page/API repair |
| 14 | T14 owner click E2E | `TPL-OWNER-E2E` | 用户点击 -> API -> DB -> 可见 UI | Owner-001..Owner-006 | T13 | `docs/auto-execute/results/web/T14.json` | `docs/auto-execute/latest/web/T14-HANDOFF.md` | page/API repair |
| 15 | T15 visual compare | `TPL-VISUAL-COMPARE` | reference/actual/diff/metrics | UI-001..UI-009 | T13,T14 | `docs/auto-execute/results/web/T15.json` | `docs/auto-execute/latest/web/T15-HANDOFF.md` | visual repair |
| 16 | T16 report guard final gate | `TPL-FINAL-GATE` | fail-closed final verdict | All P0 evidence | T12,T13,T14,T15 | `docs/auto-execute/results/web/T16.json` | `docs/auto-execute/latest/web/T16-HANDOFF.md` | repair queue |

## 5. 串行规则

T00 必须一次只启动一个 fresh `codex exec`。每个 worker 必须写 result JSON、HANDOFF、日志并退出后，T00 才能继续下一个 task。任何缺证据、缺 readback、缺截图、缺 final gate 的状态都不能升级为 `PASS`。

## 6. 最终 PASS 条件

- `apps/web` 存在并能 `lint/typecheck/test/build`。
- `pnpm --filter @auracue/web dev` 或等价命令可启动 Web。
- T13 必须真实启动整个 Web app，打开页面，从首页跑到保存/分享，截获页面调用的后端 API，并保存 DB readback；失败必须修复并反复重跑，不能只写计划或静态检查。
- 所有 `/api/v1/*` P0 endpoint 实现并通过 success/validation/not-found/idempotency/readback。
- 无 AI key 时 mock fallback 可完整生成 Aura Card。
- 9 个 P0 Web 页面具备 loaded/loading/error/empty/guard 关键状态。
- Playwright 真实点击完整主流程，截获 API transcript，证明 DB readback。
- 视觉验证有 reference/actual/diff/metrics；若缺 raster，最终最多 `PASS_NEEDS_MANUAL_UI_REVIEW`。
- `scripts/acceptance/run-web-final-gate.ps1` 或等价 final gate 读取 durable evidence 后给出最终 verdict。
