# Task T23 - Visual Repair Loop

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T23-visual-repair-loop.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Repair all material deviations reported by T22, rerun visual captures/diffs, and emit a repaired visual verdict.

## Required Inputs
T22 visual summary, screenshots/diffs, UI reference map, tokens, page code.

## Allowed Files
`apps/wechat-mini/**`, `packages/ui-tokens/**`, visual harness/evidence, T23 result/HANDOFF.

## Forbidden Actions
No redesign beyond matching supplied UI. No hiding deviations by loosening thresholds without documented reason.

## Development Standard References
One-to-one UI reconstruction rules.

## Software Test Standard References
Visual repair routing and fail-closed status rule.

## Acceptance Criteria
- Every T22 material deviation is either fixed, downgraded with evidence, or escalated as `REPAIR_REQUIRED`.
- Visual diff rerun creates T23 summary.
- No pure visual PASS if any P0 UI lacks raster evidence.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| UI/Page | repairs map to UI IDs and files. | repair log |
| Visual | rerun diff metrics. | T23 visual summary |
| Tests | impacted page tests rerun. | logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Repair log | deviation -> fix mapping | `docs/auto-execute/screenshots/diffs/T23/repair-log.md` |
| Diff rerun | updated visual summary | `docs/auto-execute/screenshots/diffs/T23/repair-summary.json` |
| Logs | rerun output | `docs/auto-execute/logs/T23/visual-repair.log` |

## Output Files
Visual repairs and rerun evidence.

## Result JSON
`docs/auto-execute/results/T23.json`

## HANDOFF
`docs/auto-execute/latest/T23-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | material P0 visual deviation remains. |
| PASS_NEEDS_MANUAL_UI_REVIEW | functional and structural evidence exists but raster proof incomplete. |
