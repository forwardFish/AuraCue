# Task T02 - Extract UI Tokens And Asset Inventory

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T02-extract-ui-tokens-and-asset-inventory.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Build the visual foundation for one-to-one reconstruction. Extract tokens and asset requirements from `docs/UI/小程序/*.png` and Stitch HTML/CSS, then encode them into shared mini-program tokens.

## Required Inputs
`auracue-ui-reference-map.md`, all P0 PNGs, all Stitch `code.html` files, T01 scaffold.

## Allowed Files
- `packages/ui-tokens/**`
- `apps/wechat-mini/src/styles/**` or equivalent
- `docs/auto-execute/intake/T02-ui-token-report.md`
- T02 result/log/HANDOFF paths

## Forbidden Actions
Do not implement page-specific UI beyond shared tokens/assets. Do not replace screenshots or modify source UI refs.

## Development Standard References
Frontend rules and visual source-of-truth order.

## Software Test Standard References
Visual one-to-one standard.

## Acceptance Criteria
- Tokens include color, typography, spacing, radius, shadow, border, z-depth, card proportions, background treatments, and CTA styles.
- Each UI ID maps to required assets/icons/visual motifs.
- Later page tasks can import tokens rather than duplicate ad hoc styles.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| UI/Page | UI-01..UI-18 token notes exist. | token report |
| Tests | token package has import/build test. | log |
| Safety | no source screenshots modified. | git/status note |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Token build | package build/test command | `docs/auto-execute/logs/T02/token-build.log` |
| Token report | generated inventory | `docs/auto-execute/intake/T02-ui-token-report.md` |

## Output Files
Shared token files and token report.

## Result JSON
`docs/auto-execute/results/T02.json`

## HANDOFF
`docs/auto-execute/latest/T02-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | tokens are generic or fail to cover P0 refs. |
| BLOCKED_BY_MISSING_SOURCE | required UI refs are missing. |
| PASS_NEEDS_MANUAL_UI_REVIEW | token extraction could not inspect raster details fully. |
