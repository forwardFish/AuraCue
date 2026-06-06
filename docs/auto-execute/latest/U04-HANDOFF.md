# U04 HANDOFF - Payment Full Result Visual Repair Round 2

## Status
REPAIR_REQUIRED

## Scope
Executed only U04 round 2: UI-11 through UI-14 payment/full-result flow.

Did not move to U05. Did not edit home/create, result/unlock/invite outside full-result, share/save/error pages, backend, API, route, payment semantics, thresholds, or harness logic.

## Product Changes
None retained.

Round 2 tested two scoped visual repair branches and reverted both because they regressed the U04 pixel ratios:
- Payment/full-result CSS background, shell, success card, and lower-composition tuning regressed to UI-11 0.527012, UI-12 0.452226, UI-13 0.69325, UI-14 0.327206.
- UI-14 visible-copy alignment regressed UI-14 to 0.317361.

The final product files match the better round-1 U04 implementation.

## Fresh Ratios
T29 and T31 agree for U04 after round 2.

| UI | Round 1 | Fresh T29/T31 | Delta | Target | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| UI-11 | 0.457306 | 0.457306 | 0 | <= 0.005 | REPAIR_REQUIRED |
| UI-12 | 0.366343 | 0.366343 | 0 | <= 0.005 | REPAIR_REQUIRED |
| UI-13 | 0.518726 | 0.518726 | 0 | <= 0.005 | REPAIR_REQUIRED |
| UI-14 | 0.314493 | 0.314493 | 0 | <= 0.005 | REPAIR_REQUIRED |

## Verification
| Command | Result | Exit | Log |
| --- | --- | ---: | --- |
| `node --check apps\wechat-mini\src\pages\unlock\payment-state-page.mjs` | PASS | 0 | inline |
| `node --check apps\wechat-mini\src\pages\result\full-page.mjs` | PASS | 0 | inline |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T29` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U04/T29-round2.log` |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U04/T31-round2.log` |
| `node scripts/t33-final-ui-one-to-one-gate.mjs` | REPAIR_REQUIRED | 2 | `docs/auto-execute/logs/U04/T33-round2.log` |
| `pnpm.cmd test` | PASS | 0 | `docs/auto-execute/logs/U04/pnpm-test-round2.log` |
| `node scripts/verify-wechat-routes.mjs` | PASS | 0 | `docs/auto-execute/logs/U04/routes-round2.log` |
| `git diff --check` | PASS | 0 | `docs/auto-execute/logs/U04/diff-check-round2.log` |

## Evidence
- `docs/auto-execute/results/U04.json`
- `docs/auto-execute/results/T29.json`
- `docs/auto-execute/results/T31.json`
- `docs/auto-execute/results/T33.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T31/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/actual/UI-11-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/actual/UI-12-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/actual/UI-13-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/actual/UI-14-actual.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/diff/UI-11-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/diff/UI-12-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/diff/UI-13-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/diff/UI-14-diff.png`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/metrics/UI-11-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/metrics/UI-12-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/metrics/UI-13-metrics.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T29/metrics/UI-14-metrics.json`
- `docs/auto-execute/logs/U04/round2-command-results.json`

## Unresolved Regions
- UI-11: full viewport `x=0 y=0 w=941 h=1672`.
- UI-12: full viewport `x=0 y=0 w=941 h=1672`.
- UI-13: full viewport `x=0 y=0 w=941 h=1672`.
- UI-14: full viewport `x=0 y=0 w=941 h=1672`.

## Blocker Classification
ASSET_SOURCE_REQUIRED

Round 2 did not find a safe structural CSS/content change that improves the current U04 ratios. The remaining mismatch is dominated by exact raster-like reference assets: realistic device/background compositing, tarot/card artwork, payment status art, success/failure clouds/confetti texture, and exact font rendering. Under the current constraints, reaching `diffRatio <= 0.005` appears to require approved original component assets or explicit approval for reference-derived per-component assets.

## Next Action
Stop U04 here as `REPAIR_REQUIRED` / `ASSET_SOURCE_REQUIRED`. Do not start U05 in this worker.
