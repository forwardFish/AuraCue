# U02 HANDOFF - Home Create Flow Visual Repair

## Status
REPAIR_REQUIRED

## Scope
Continued only U02 home/create visual flow for UI-01 through UI-05, round 5. Did not move to U03.

Allowed product source scope was respected:
- `apps/wechat-mini/src/pages/home/**`
- `apps/wechat-mini/src/pages/create/**`
- shared visual helpers only if required

No result, unlock, invite, payment, share, save, or error page source files were edited. No full reference screenshots were mounted, no reference PNG crops were retained as UI, no remote assets were introduced, and thresholds were not changed.

## Round-5 Action
- Re-read AGENTS, U02 task doc, U02 handoff/result, and current T27 visual summary.
- Inspected current HTML/CSS fallback renderers and the UI-01 through UI-05 reference/actual screenshots.
- Attempted a local vector/component-asset strategy on the remaining large mismatches:
  - UI-05 tarot/celestial/progress chrome selector and card-art detail.
  - UI-02 scene-card illustration detail.
  - UI-04 phone hardware/notch/status/bottom cloud sizing.
- Ran T27 after the attempt. The candidate edits regressed measured ratios or failed to materially improve them, so they were not retained.

## Product Source Changes Retained
None.

The retained product renderer state is the round-4 baseline because the round-5 vector/CSS component approximations were worse under the pixel harness.

## Fresh U02 Ratios
T27 and T31 match for UI-01 through UI-05.

| UI | Round 4 | Round 5 | Target | Status |
| --- | ---: | ---: | ---: | --- |
| UI-01 | 0.142936 | 0.142936 | <= 0.005 | REPAIR_REQUIRED |
| UI-02 | 0.212549 | 0.212549 | <= 0.005 | REPAIR_REQUIRED |
| UI-03 | 0.174261 | 0.174261 | <= 0.005 | REPAIR_REQUIRED |
| UI-04 | 0.193674 | 0.193674 | <= 0.005 | REPAIR_REQUIRED |
| UI-05 | 0.262479 | 0.262479 | <= 0.005 | REPAIR_REQUIRED |

## Evidence
- `docs/auto-execute/results/U02.json`
- `docs/auto-execute/results/T27.json`
- `docs/auto-execute/results/T31.json`
- `docs/auto-execute/results/T33.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T27/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T31/visual-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T33/visual-summary.json`
- `docs/auto-execute/logs/U02/`

Each target UI has actual PNG, diff PNG, and metrics JSON under both T27 and T31.

## Verification
| Command | Result | Exit | Log |
| --- | --- | ---: | --- |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T27` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U02/T27.log` |
| `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31` | REPAIR_REQUIRED | 0 | `docs/auto-execute/logs/U02/T31.log` |
| `node scripts/t33-final-ui-one-to-one-gate.mjs` | REPAIR_REQUIRED | 2 | `docs/auto-execute/logs/U02/T33.log` |
| `pnpm.cmd test` | PASS | 0 | `docs/auto-execute/logs/U02/pnpm-test.log` |
| `node scripts/verify-wechat-routes.mjs` | PASS | 0 | `docs/auto-execute/logs/U02/routes.log` |
| `git diff --check` | PASS | 0 | `docs/auto-execute/logs/U02/diff-check.log` |

## Unresolved Regions
- UI-01: full viewport `x=0 y=0 w=941 h=1672`.
- UI-02: full viewport `x=0 y=0 w=941 h=1672`.
- UI-03: full viewport `x=0 y=0 w=941 h=1672`.
- UI-04: `x=107 y=48 w=727 h=1603`.
- UI-05: full viewport `x=0 y=0 w=941 h=1672`.

## Remaining Blocker Classification
`ASSET_SOURCE_REQUIRED`

The remaining mismatch is high-detail raster-like visual fidelity rather than missing evidence, broken routes, missing controls, or threshold configuration. A fifth loop with local CSS/vector component approximations did not materially converge. The reference screens depend on detailed artwork, texture, font rendering, glow/orbit particles, phone hardware chrome, and card/illustration rendering that the current DOM/CSS fallback cannot match to `diffRatio <= 0.005` without either:

- approved original component assets from the design source, or
- explicit approval to extract/use reference-derived per-component assets.

## Recommendation
Stop U02 under the current no-screenshot-crop/no-remote-asset constraint and record it as `REPAIR_REQUIRED`. Proceed to U03 only after accepting this U02 blocker classification, or require explicit asset-source approval before another U02 repair worker. Do not spend another CSS-only or hand-drawn-vector round on U02.
