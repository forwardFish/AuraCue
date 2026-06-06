# Task T12 - Free Preview Locked Result

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T12-free-preview-locked-result.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-06 free result preview at `/result/:id` with locked/blurred full content and unlock/invite entry points.

## Required Inputs
`05-结果_免费预览待解锁.png`, Stitch `05`, PRD 10.2/19.5.

## Allowed Files
`apps/wechat-mini/**`, tests, T12 evidence.

## Forbidden Actions
Do not expose full unlocked content in the locked page response or UI.

## Development Standard References
Frontend/backend contract standard, frontend rules.

## Software Test Standard References
Frontend page test standard, contract test standard.

## Acceptance Criteria
- Displays free aura fields only: aura name, lucky color, one-line reminder, watermarked/low-res card, blurred full preview.
- `Unlock Full Card` routes to `/unlock/:id`.
- invite CTA routes to invite flow.
- API-003 free/locked behavior is respected.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-009. | result trace |
| UI/Page | UI-06 implemented. | screenshot |
| API | API-003 free response consumed. | contract trace |
| Tests | unlock/invite clicks and locked data visibility. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | locked preview clicks | `docs/auto-execute/traces/T12/free-preview.json` |
| Screenshot | capture UI-06 | `docs/auto-execute/screenshots/T12/UI-06-free-preview.png` |

## Output Files
Free preview result page and tests.

## Result JSON
`docs/auto-execute/results/T12.json`

## HANDOFF
`docs/auto-execute/latest/T12-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | locked/full visibility or CTA behavior wrong. |
| PASS_NEEDS_MANUAL_UI_REVIEW | visual proof incomplete. |
