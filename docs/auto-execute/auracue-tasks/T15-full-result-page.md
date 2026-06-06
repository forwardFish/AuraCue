# Task T15 - Full Result Page

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T15-full-result-page.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-14 full unlocked Aura Card result page at `/result/:id/full`.

## Required Inputs
`09-结果_完整气场卡与分享入口.png`, Stitch `09`, PRD 10.1/10.3/19.7, P1 README.

## Allowed Files
`apps/wechat-mini/**`, tests, T15 evidence.

## Forbidden Actions
Do not implement 7-day trend P1 page. Do not show unsafe copy.

## Development Standard References
Frontend rules, safety/risk copy rules.

## Software Test Standard References
Frontend page test standard, copy safety guard.

## Acceptance Criteria
- Full result shows all structured fields: title, aura name, tarot, message, colors, outfit, beauty, social, ritual, avoid, caption/theme.
- Save Card and Share Story navigate or call expected APIs.
- More Sharing Options routes to channel chooser.
- View 7-Day Trend is disabled/coming-soon/P1-safe, not implemented as MVP feature.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-008/REQ-010. | full result trace |
| UI/Page | UI-14 implemented. | screenshot |
| API | API-003 full, API-007, API-008 callers. | contract trace |
| Tests | all buttons clicked. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | full result click/state test | `docs/auto-execute/traces/T15/full-result.json` |
| Screenshot | capture UI-14 | `docs/auto-execute/screenshots/T15/UI-14-full-result.png` |

## Output Files
Full result page and tests.

## Result JSON
`docs/auto-execute/results/T15.json`

## HANDOFF
`docs/auto-execute/latest/T15-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | missing full field, unsafe copy, or P1 leakage. |
| PASS_NEEDS_MANUAL_UI_REVIEW | visual proof incomplete. |
