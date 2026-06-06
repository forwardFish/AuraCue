# Task U06 - All-Screen Visual Convergence

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U06-all-screen-visual-convergence.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to run the all-screen repair loop across `UI-01` through `UI-18` after U02-U05 grouped repairs. This task may touch any mini-program page needed to close remaining visual diffs.

## Required Inputs

- `docs/auto-execute/results/U02.json` through `docs/auto-execute/results/U05.json` when present
- `docs/auto-execute/latest/U02-HANDOFF.md` through `docs/auto-execute/latest/U05-HANDOFF.md` when present
- latest `T31` and `T33` visual summaries
- current UI reference PNG and Stitch HTML files

## Allowed Files

- `apps/wechat-mini/src/pages/**`
- `packages/ui-tokens/**` if required for shared visual alignment
- `scripts/t26-visual-capture-pixel-diff-harness.mjs` only if the harness is proven stale or unable to map U task IDs
- `docs/auto-execute/screenshots/ui-one-to-one/T31/**`
- `docs/auto-execute/logs/U06/**`
- `docs/auto-execute/results/U06.json`
- `docs/auto-execute/latest/U06-HANDOFF.md`

## Forbidden Actions

- Do not loosen thresholds.
- Do not hide differences with screenshots or overlays.
- Do not change non-visual behavior except to repair regressions caused by visual work.
- Do not mark manual review when local raster capture works.

## Acceptance Criteria

- All 18 screens have actual PNG, diff PNG, metrics JSON, and visual-summary entries.
- Every screen reaches `diffRatio <= 0.005`, or U06 returns `REPAIR_REQUIRED` with exact unresolved screen IDs, ratios, and remaining regions.
- No screen uses full-screen screenshot mounting, remote visual assets, or generic placeholder layout.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U06.json`; visual harness result also updates `docs/auto-execute/results/T31.json` and `docs/auto-execute/results/T33.json`

## HANDOFF

`docs/auto-execute/latest/U06-HANDOFF.md`
