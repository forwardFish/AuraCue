# AuraCue Unfinished UI One-To-One Repair Master

Source unfinished file: `docs/auto-execute/latest/unfinished-ui-one-to-one-repair-tasks.md`

## Objective

Finish the remaining AuraCue mini-program UI one-to-one repair work. The current product state is not blocked by routes, clicks, API, DB, or owner-flow evidence; the remaining blocker is visual fidelity. `UI-01` through `UI-18` must be repaired until each screen has actual PNG, diff PNG, metrics JSON, and `diffRatio <= 0.005`.

## Current State

- Final verdict: `REPAIR_REQUIRED`
- Visual gate: `REPAIR_REQUIRED`
- Failing screens: `18/18`
- Strict threshold: `diffRatio <= 0.005`
- Environment blocker: none currently documented
- Regression status: `T32` route/click/owner/API/local-only evidence is `PASS`
- U01 refreshed intake on `2026-05-27T08:40:49.016Z`: local Chrome visual harness still runs, `git diff --check` is clean, and T33 final gate still fails closed because visual thresholds fail.
- Current failing ratios: `UI-01=0.140472`, `UI-02=0.24331`, `UI-03=0.258656`, `UI-04=0.30664`, `UI-05=0.364333`, `UI-06=0.408715`, `UI-07=0.218841`, `UI-08=0.294825`, `UI-09=0.569328`, `UI-10=0.346631`, `UI-11=0.600235`, `UI-12=0.614982`, `UI-13=0.619667`, `UI-14=0.544078`, `UI-15=0.721088`, `UI-16=0.518919`, `UI-17=0.308903`, `UI-18=0.369695`.
- Next repair group: U02 home/create flow, `UI-01` through `UI-05`; repair largest current group diffs first (`UI-05`, `UI-04`, `UI-03`, `UI-02`, then `UI-01`).

## Source Of Truth

1. Direct user goal: finish the unfinished UI one-to-one work and let `auto-execute` execute it.
2. `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\latest\unfinished-ui-one-to-one-repair-tasks.md`
3. `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\screenshots\ui-one-to-one\T33\visual-summary.json`
4. `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\results\T33.json`
5. UI reference PNGs under `D:\lyh\agent\agent-frame\AuraCue\docs\UI`
6. Stitch HTML references under `D:\lyh\agent\agent-frame\AuraCue\docs\UI\*\stitch_codex_ui_code_generator`
7. Current mini-program implementation under `apps/wechat-mini/src/pages/**`

## Non-Negotiable Rules

- Use the `auto-execute` skill for execution.
- One task must run in one fresh `codex exec` worker.
- Do not merge multiple child tasks into one long worker.
- Do not mount full-screen reference screenshots as the UI.
- Do not lower the threshold or weaken tests.
- Do not use remote CDN, remote fonts, remote images, production services, real payment, real AI, or secrets.
- Preserve current route, click, API, DB, local/mock payment, analytics, and owner-flow behavior.
- If any UI still exceeds `diffRatio <= 0.005`, report `REPAIR_REQUIRED`, not PASS.

## Child Task Queue

| Order | Task | Scope | UI IDs | Task document |
| --- | --- | --- | --- | --- |
| 1 | U01 | Re-baseline current unfinished evidence and lock execution boundaries | UI-01..UI-18 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U01-current-state-intake.md` |
| 2 | U02 | Home and create flow visual repair; use visual harness task `T27` | UI-01..UI-05 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U02-home-create-flow-visual-repair.md` |
| 3 | U03 | Result, unlock, and invite visual repair; use visual harness task `T28` | UI-06..UI-10 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U03-result-unlock-invite-visual-repair.md` |
| 4 | U04 | Payment and full-result visual repair; use visual harness task `T29` | UI-11..UI-14 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U04-payment-full-result-visual-repair.md` |
| 5 | U05 | Share, save, and error visual repair; use visual harness task `T30` | UI-15..UI-18 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U05-share-save-error-visual-repair.md` |
| 6 | U06 | All-screen visual convergence loop; use visual harness tasks `T31` and `T33` | UI-01..UI-18 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U06-all-screen-visual-convergence.md` |
| 7 | U07 | Final regression and acceptance gate | UI-01..UI-18 | `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U07-final-regression-and-gate.md` |

## Execution Strategy

Run U01 first to refresh the machine state and confirm the harness still captures real PNG evidence. Then execute U02 through U05 by screen group. After each visual group, run the group harness, then run T31/T33 visual gates. U06 performs the full all-screen repair loop after the grouped repairs. U07 is the only final gate task and may update final delivery reports.

## Required Verification Commands

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Done Criteria

- `UI-01` through `UI-18` each have reference PNG, actual PNG, diff PNG, and metrics JSON.
- Every screen has `diffRatio <= 0.005`.
- No required core text or control is missing.
- No page uses a mounted full-screen reference screenshot.
- `T32` route/click/owner/API/local-only evidence remains effectively PASS.
- `pnpm.cmd test`, `pnpm.cmd lint`, `pnpm.cmd typecheck`, `node scripts/verify-wechat-routes.mjs`, and `git diff --check` pass.
- `node scripts/t33-final-ui-one-to-one-gate.mjs` returns `PASS`.
