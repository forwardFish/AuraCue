# Task T31 - All UI Raster Diff Repair Loop

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T31-all-ui-raster-diff-repair-loop.md"
```

## Implementation Scope
Run the full visual diff loop across `UI-01` through `UI-18`, repair remaining visual deviations, and produce final per-screen raster/diff metrics for the UI repair pack.

## Required Inputs
- T26-T30 result JSON and HANDOFF files.
- All T26-T30 visual summaries and metrics.
- Current page code and UI references.

## Allowed Files
- `apps/wechat-mini/src/pages/**`
- `packages/ui-tokens/**` if required for shared visual alignment
- visual harness scripts if needed
- `docs/auto-execute/screenshots/ui-one-to-one/T31/**`
- `docs/auto-execute/logs/T31/**`
- `docs/auto-execute/results/T31.json`
- `docs/auto-execute/latest/T31-HANDOFF.md`

## Forbidden Actions
- Do not loosen `diffRatio <= 0.005`.
- Do not delete controls, hide mismatches, or bypass screenshots.
- Do not change non-visual behavior except to repair regressions caused by visual changes.
- Do not leave a screen as manual review unless a local environment blocker is proven.

## Acceptance Criteria
- All 18 screens have actual PNG, diff PNG, metrics JSON, and visual summary entry under `T31`.
- Every screen is either `PASS` with `diffRatio <= 0.005`, or the task status is `REPAIR_REQUIRED` with exact unresolved screen IDs, diff ratios, and remaining regions.
- No screen uses full-screen screenshot mounting, remote visual assets, or generic placeholder layout.

## Verification Commands
- full visual harness across `UI-01..UI-18`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `node scripts/verify-wechat-routes.mjs`
- `git diff --check`

## Done When
`docs/auto-execute/screenshots/ui-one-to-one/T31/visual-summary.json` reports all 18 screens PASS, or `docs/auto-execute/results/T31.json` reports `REPAIR_REQUIRED` with actionable unresolved visual diffs.

## Result JSON
`docs/auto-execute/results/T31.json`

## HANDOFF
`docs/auto-execute/latest/T31-HANDOFF.md`

