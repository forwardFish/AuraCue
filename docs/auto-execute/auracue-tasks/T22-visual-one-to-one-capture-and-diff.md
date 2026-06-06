# Task T22 - Visual One-To-One Capture And Diff

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T22-visual-one-to-one-capture-and-diff.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Create and run visual capture/diff harness for UI-01 through UI-18 against supplied reference screenshots.

## Required Inputs
All implemented pages, `auracue-ui-reference-map.md`, `docs/UI/小程序/*.png`, Stitch screens/code.

## Allowed Files
visual harness scripts, test fixtures, screenshot/diff evidence, T22 result/HANDOFF.

## Forbidden Actions
Do not edit reference screenshots. Do not report structural-only proof as pixel-perfect.

## Development Standard References
Frontend rules, visual source-of-truth.

## Software Test Standard References
Visual one-to-one standard.

## Acceptance Criteria
- Actual output captured for every UI-01..UI-18 target at reference-equivalent viewport.
- Reference/actual/diff/metrics/summary artifacts exist.
- Summary lists material deviations by UI ID, severity, likely cause, and repair owner.
- If raster capture is impossible, result must be `PASS_NEEDS_MANUAL_UI_REVIEW` or `BLOCKED_BY_ENVIRONMENT`, not pure visual PASS.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| UI/Page | UI-01..UI-18 captured. | screenshot manifest |
| Visual | diff metrics and summary. | visual summary |
| Tests | harness command and logs. | log |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Capture | capture actual pages | `docs/auto-execute/screenshots/T22/` |
| Diff | compare refs vs actuals | `docs/auto-execute/screenshots/diffs/T22/visual-summary.json` |
| Logs | command output | `docs/auto-execute/logs/T22/visual-harness.log` |

## Output Files
Visual harness, screenshots, diffs, metrics, summary.

## Result JSON
`docs/auto-execute/results/T22.json`

## HANDOFF
`docs/auto-execute/latest/T22-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | material visual deviations remain. |
| PASS_NEEDS_MANUAL_UI_REVIEW | only structural/manual evidence is available. |
| BLOCKED_BY_ENVIRONMENT | no capture path can run locally. |
