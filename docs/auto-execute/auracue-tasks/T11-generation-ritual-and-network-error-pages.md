# Task T11 - Generation Ritual And Network Error Pages

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T11-generation-ritual-and-network-error-pages.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-05 generation ritual/loading and UI-18 network/generation failure recovery.

## Required Inputs
`04-生成_抽卡仪式.png`, `11-异常_生成失败网络异常.png`, Stitch `04`, `11`, PRD 14/19.4/28.2.

## Allowed Files
`apps/wechat-mini/**`, tests, T11 evidence.

## Forbidden Actions
No fake success without job status. No user-blaming failure copy.

## Development Standard References
Reliability rule, safety/risk copy rule.

## Software Test Standard References
Frontend state test standard, backend/API error path standard.

## Acceptance Criteria
- Loading screen renders ritual state and polls/awaits API-002.
- Success navigates to `/result/:id`.
- Failure renders UI-18 with `Try Again` and `Change Scene`.
- Retry creates or resumes valid generation; Change Scene returns to scene page.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-013 failure/retry. | error trace |
| UI/Page | UI-05/UI-18 implemented. | screenshots |
| API | API-002 pending/success/failure handled. | mock trace |
| Tests | pending/success/failure/retry/change route. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | loading/failure/retry/change scene | `docs/auto-execute/traces/T11/generation-error.json` |
| Screenshots | capture UI-05/UI-18 | `docs/auto-execute/screenshots/T11/` |

## Output Files
Loading/error pages and tests.

## Result JSON
`docs/auto-execute/results/T11.json`

## HANDOFF
`docs/auto-execute/latest/T11-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | failure/retry route or copy is incomplete. |
| PASS_NEEDS_MANUAL_UI_REVIEW | visual proof incomplete. |
