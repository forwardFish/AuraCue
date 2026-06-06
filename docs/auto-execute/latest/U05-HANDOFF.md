# U05 HANDOFF - Share Save Error Visual Repair

## Status
REPAIR_REQUIRED

## Scope
Executed only U05 round 2: UI-15 through UI-18 share/save/error visual repair. Did not continue U02, U03, U04, or start U06.

Allowed product source scope was respected:
- `apps/wechat-mini/src/pages/share/**`
- `apps/wechat-mini/src/pages/saved/**`
- `apps/wechat-mini/src/pages/error/**`
- shared visual helpers only if required

No real platform share APIs were called. Local rendered share image metadata was preserved. Generation retry/change-scene semantics were not changed. No full reference screenshots were mounted, no remote assets were introduced, and thresholds were not changed.

## Product Changes Retained
No new round-2 product edits were retained.

Round 1 retained product changes still define the current source state:
- `apps/wechat-mini/src/pages/share/share-save-page.mjs`
  - Reduced share header/title sizing and spacing so UI-15 and UI-16 move closer to the reference vertical structure.
  - Constrained the story preview/card width for UI-15 and UI-16.
  - Moved the UI-16 share channel sheet upward and gave it explicit room for the cancel action.

## Round 2 Candidates Reverted
- Saved/error compression and CTA layout: regressed UI-17 to `0.328028` and UI-18 to `0.410143`; reverted. Log: `docs/auto-execute/logs/U05/T30-round2-worker-pass1.log`.
- Saved-card internal CSS artwork detail only: regressed UI-17 to `0.316408`; reverted. Log: `docs/auto-execute/logs/U05/T30-round2-worker-saved-art.log`.
- Pinned UI-18 retry/change-scene CTAs inside viewport: regressed UI-18 to `0.374238`; reverted. Log: `docs/auto-execute/logs/U05/T30-round2-worker-error-cta.log`.

## Fresh Ratios

T30 and T31 agree for U05 after round 2 final verification.

| UI | Round 1 retained | Round 2 final T30/T31 | Target | Status |
| --- | ---: | ---: | ---: | --- |
| UI-15 | 0.642515 | 0.642515 | <= 0.005 | REPAIR_REQUIRED |
| UI-16 | 0.476996 | 0.476996 | <= 0.005 | REPAIR_REQUIRED |
| UI-17 | 0.309294 | 0.309294 | <= 0.005 | REPAIR_REQUIRED |
| UI-18 | 0.369695 | 0.369695 | <= 0.005 | REPAIR_REQUIRED |

## Verification

| Command | Result | Exit | Log |
| --- | --- | ---: | --- |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T30` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U05/T30-round2-final.log` |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U05/T31-round2-final.log` |
| `node scripts/t33-final-ui-one-to-one-gate.mjs` | REPAIR_REQUIRED | 2 | `docs/auto-execute/logs/U05/T33-round2-final.log` |
| `pnpm.cmd test` | PASS | 0 | `docs/auto-execute/logs/U05/pnpm-test-round2-final.log` |
| `node scripts/verify-wechat-routes.mjs` | PASS | 0 | `docs/auto-execute/logs/U05/routes-round2-final.log` |
| `git diff --check` | PASS | 0 | `docs/auto-execute/logs/U05/diff-check-round2-after-result-update.log` |

## Evidence
- `docs/auto-execute/results/U05.json`
- `docs/auto-execute/results/T30.json`
- `docs/auto-execute/results/T31.json`
- `docs/auto-execute/results/T33.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T31/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/actual/UI-15-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/actual/UI-16-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/actual/UI-17-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/actual/UI-18-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/diff/UI-15-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/diff/UI-16-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/diff/UI-17-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/diff/UI-18-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/metrics/UI-15-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/metrics/UI-16-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/metrics/UI-17-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T30/metrics/UI-18-metrics.json`

## Unresolved Regions
- UI-15: full viewport `x=0 y=0 w=941 h=1672`.
- UI-16: full viewport `x=0 y=0 w=941 h=1672`.
- UI-17: full viewport `x=0 y=0 w=941 h=1672`.
- UI-18: full viewport `x=0 y=0 w=941 h=1672`.

## Blocker Classification
ASSET_SOURCE_REQUIRED

Round 2 confirmed that safe structural/page-level CSS candidates for UI-17 saved success and UI-18 error flow regress the current pixel ratios. The retained round-1 state remains the best measured state for U05.

The remaining mismatch is dominated by exact raster-like reference assets and native visual details: illustrated portrait/story card artwork, ornate gold frame and corner detail, cloud/particle texture, realistic save-card artwork, icon glyphs, native phone/status chrome, and font rendering.

Under the current constraints, reaching `diffRatio <= 0.005` appears to require approved original component assets from the design source or explicit approval for reference-derived per-component assets. Continuing CSS-only/vector approximation is likely to churn decorative pixels and regress measured ratios.

## Next Action
Stop U05 here as `REPAIR_REQUIRED` / `ASSET_SOURCE_REQUIRED`. Do not start U06 in this worker.
