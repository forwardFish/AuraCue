# Task T16 - Share And Save Pages

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T16-share-and-save-pages.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-15, UI-16, and UI-17: story share preview, channel chooser, and saved success feedback.

## Required Inputs
`10A-分享_Story卡预览与保存.png`, `10B-分享_渠道选择.png`, `10C-保存_保存成功反馈.png`, Stitch `10a_story`, `10b`, `10c`, PRD 11/15/19.8/19.9.

## Allowed Files
`apps/wechat-mini/**`, tests, T16 evidence.

## Forbidden Actions
No real external platform share dependency in tests. Do not implement full card history.

## Development Standard References
Frontend rules, analytics rules, local-only safety.

## Software Test Standard References
Frontend page test standard, simulated user standard.

## Acceptance Criteria
- Share preview renders 9:16 card and supports save/share.
- Channel chooser records channel share event or mocked action and supports Cancel.
- Save success page confirms saved state and routes Share Now/Back Home.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-011/REQ-014. | share/save traces |
| UI/Page | UI-15..UI-17 implemented. | screenshots |
| API | API-007/API-008/API-009/API-010 callers. | API trace |
| DB | save/share readback in later owner/API tasks. | DB evidence |
| Tests | all controls clicked. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | share/channel/save click tests | `docs/auto-execute/traces/T16/share-save.json` |
| Screenshots | capture UI-15..UI-17 | `docs/auto-execute/screenshots/T16/` |

## Output Files
Share/save pages and tests.

## Result JSON
`docs/auto-execute/results/T16.json`

## HANDOFF
`docs/auto-execute/latest/T16-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | share/save/channel behavior incomplete. |
| PASS_NEEDS_MANUAL_UI_REVIEW | visual proof incomplete. |
