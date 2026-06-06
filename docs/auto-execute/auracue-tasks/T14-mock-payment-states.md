# Task T14 - Mock Payment States

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T14-mock-payment-states.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-11, UI-12, and UI-13 mock payment confirm, failure/recovery, and success screens.

## Required Inputs
`08A-支付解锁_确认支付.png`, `08B-支付解锁_失败与恢复购买.png`, `08C-支付解锁_成功状态.png`, Stitch `08a`, `08b`, `08c`, PRD 12/13/19.6.

## Allowed Files
`apps/wechat-mini/**`, tests, T14 evidence.

## Forbidden Actions
No real WeChat payment SDK call. No production payment URL. No secret key.

## Development Standard References
Local-only safety, frontend/backend contract standard.

## Software Test Standard References
Local-only guard, frontend page test standard.

## Acceptance Criteria
- Confirm payment creates/completes local mock order.
- Forced failure state supports Try Again, Restore Purchase, Invite 3 Friends Instead, Contact Support.
- Success state supports View Full Card and Share Story.
- Local-only payment guard evidence is written.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-012. | payment trace |
| UI/Page | UI-11..UI-13 implemented. | screenshots |
| API | API-004/API-005 callers wired. | API trace |
| Safety | no real payment integration. | local-only log |
| Tests | all recovery buttons clicked. | trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | payment states and all controls | `docs/auto-execute/traces/T14/mock-payment.json` |
| Screenshots | capture UI-11..UI-13 | `docs/auto-execute/screenshots/T14/` |
| Safety | payment local-only check | `docs/auto-execute/logs/T14/payment-local-only.json` |

## Output Files
Mock payment pages and tests.

## Result JSON
`docs/auto-execute/results/T14.json`

## HANDOFF
`docs/auto-execute/latest/T14-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| HARD_FAIL | real payment path/secret is used. |
| REPAIR_REQUIRED | recovery/success behavior incomplete. |
