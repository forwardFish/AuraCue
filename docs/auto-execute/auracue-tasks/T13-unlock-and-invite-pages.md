# Task T13 - Unlock And Invite Pages

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T13-unlock-and-invite-pages.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-07, UI-08, UI-09, and UI-10: unlock choice, invite start, invite progress, and friend invitation landing.

## Required Inputs
`06-解锁_付费与邀请入口.png`, `07A-邀请解锁_邀请3人入口.png`, `07B-邀请解锁_邀请进度.png`, `07C-邀请解锁_好友承接页.png`, Stitch `06`, `07a_3`, `07b`, `07c`, PRD 12.4/19.6.

## Allowed Files
`apps/wechat-mini/**`, tests, T13 evidence.

## Forbidden Actions
No real invite platform API dependency. Do not require login for friend landing MVP.

## Development Standard References
Frontend rules, analytics rules, backend contract rules.

## Software Test Standard References
Simulated user standard, frontend page test standard.

## Acceptance Criteria
- Unlock page offers local paid mock and invite alternative.
- Invite page/progress supports Invite Friends, Copy, Invite Again, How it works.
- Friend landing records invite and starts generation flow.
- Duplicate invite behavior remains API-owned.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-010/REQ-012. | invite traces |
| UI/Page | UI-07..UI-10 implemented. | screenshots |
| API | API-006/API-008/API-010 callers wired. | mock trace |
| DB | share/invite event readback in later API/owner task. | DB evidence |
| Tests | all invite controls clicked. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | unlock/invite/friend clicks | `docs/auto-execute/traces/T13/unlock-invite.json` |
| Screenshots | capture UI-07..UI-10 | `docs/auto-execute/screenshots/T13/` |

## Output Files
Unlock/invite pages and tests.

## Result JSON
`docs/auto-execute/results/T13.json`

## HANDOFF
`docs/auto-execute/latest/T13-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | invite/progress/friend route or click behavior missing. |
| PASS_NEEDS_MANUAL_UI_REVIEW | visual proof incomplete. |
