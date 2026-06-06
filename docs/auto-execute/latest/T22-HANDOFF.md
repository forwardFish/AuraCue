# T22 HANDOFF

## Status
PASS_NEEDS_RUNTIME_SCREENSHOTS

## Scope
Final P0 mini-program UI target set is `UI-01..UI-12`, sourced from `apps/wechat-mini/src/routes/route-registry.mjs` and `docs/UI/小程序/P0-*.png`.

Legacy unlock, payment, invite, free-preview, history, trend, and profile references are demoted and must not drive the P0 visual gate.

## Evidence Paths
- docs/auto-execute/screenshots/T22/screenshot-manifest.json
- docs/auto-execute/screenshots/diffs/T22/visual-summary.json
- docs/auto-execute/logs/T22/visual-harness.log
- docs/auto-execute/screenshots/diffs/T22/UI-01-metrics.json through UI-12-metrics.json

## Next-Step Notes
- Generate runtime actual screenshots, diff images, and pixel metrics for `UI-01..UI-12`.
- Do not revive old `UI-13..UI-18` as P0 targets without an explicit product-scope change.
