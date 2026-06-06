# AuraCue Unfinished UI One-to-One Repair Tasks

Sources: `docs/auto-execute/latest/gap-list.json`, `docs/auto-execute/screenshots/ui-one-to-one/T33/visual-summary.json`, `docs/auto-execute/results/T33.json`.

## Current Verdict

- Final verdict: `REPAIR_REQUIRED`
- Visual gate scope: final P0 only, `UI-01..UI-12`
- Legacy P0 status: `DEMOTED`
- Failing screens: `12/12`, because runtime actual PNG, diff PNG, metrics JSON, and numeric diff ratios are not yet present.
- Strict threshold: `diffRatio <= 0.005`
- Do not mount full-screen reference screenshots. Do not lower thresholds. Do not weaken tests. Do not use remote CDN/fonts/images, production services, real payment, real AI, or secrets.

## Resume Commands

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
node scripts/t22-visual-harness.mjs
node scripts/t23-visual-repair-loop.mjs
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Task Groups

| Status | Task | Scope | Open UI IDs | Target files | Verification |
| --- | --- | --- | --- | --- | --- |
| [ ] | T27 | Mood/context/upload/draw/reveal | UI-01, UI-02, UI-03, UI-04, UI-05 | `apps/wechat-mini/src/pages/index/**; apps/wechat-mini/src/pages/create/**` | Final P0 visual capture for UI-01..UI-05, then T33 |
| [ ] | T28 | Result/activate/activated | UI-06, UI-07, UI-08 | `apps/wechat-mini/src/pages/result/**; apps/wechat-mini/src/pages/activate/**; apps/wechat-mini/src/pages/activated/**` | Final P0 visual capture for UI-06..UI-08, then T33 |
| [ ] | T29 | Share/save/error | UI-09, UI-10, UI-11, UI-12 | `apps/wechat-mini/src/pages/share/**; apps/wechat-mini/src/pages/saved/**; apps/wechat-mini/src/pages/error/**` | Final P0 visual capture for UI-09..UI-12, then T33 |
| [ ] | T33 | Final P0 UI one-to-one gate | UI-01..UI-12 | `scripts/t33-final-ui-one-to-one-gate.mjs; docs/AUTO_EXECUTE_DELIVERY_REPORT.md; docs/auto-execute/results/T33.json; docs/auto-execute/latest/T33-HANDOFF.md` | T33 final gate returns PASS only with all 12 runtime screenshot/diff/metrics sets |

## Per-Screen Open Items

| Status | UI | Route | Required evidence | Next action |
| --- | --- | --- | --- | --- |
| [ ] | UI-01 | `/` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve mood-home behavior. |
| [ ] | UI-02 | `/create/context` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve optional context behavior. |
| [ ] | UI-03 | `/create/upload` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve optional upload/skip behavior. |
| [ ] | UI-04 | `/create/draw` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve three-card selection behavior. |
| [ ] | UI-05 | `/create/draw` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve reveal/loading behavior. |
| [ ] | UI-06 | `/result/:id` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve result CTA behavior. |
| [ ] | UI-07 | `/activate/:id` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve anchor/hold-to-seal behavior. |
| [ ] | UI-08 | `/activated/:id` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve activated success behavior. |
| [ ] | UI-09 | `/share/:id` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve story preview behavior. |
| [ ] | UI-10 | `/share/:id/channels` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve channel chooser behavior. |
| [ ] | UI-11 | `/saved/:id` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve save success behavior. |
| [ ] | UI-12 | `/error/network` | actual PNG, diff PNG, metrics JSON | Generate runtime screenshot/diff evidence and preserve retry/change-context behavior. |

## Done Criteria

- All `UI-01` through `UI-12` have reference PNG, actual PNG, diff PNG, and metrics JSON.
- Every final P0 screen has `diffRatio <= 0.005`.
- No missing core text or required controls.
- Legacy `UI-13..UI-18` unlock/payment/invite targets are not treated as P0.
- `pnpm.cmd test`, `pnpm.cmd lint`, `pnpm.cmd typecheck`, `node scripts/verify-wechat-routes.mjs`, and `git diff --check` are PASS.
- `node scripts/t33-final-ui-one-to-one-gate.mjs` returns `PASS`.
