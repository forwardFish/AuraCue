# Task T06 - Mock Unlock Payment Invite APIs

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T06-mock-unlock-payment-invite-apis.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement local/mock API-004, API-005, and API-006 for entitlement unlock, payment order simulation, invite event/progress, duplicate invite safety, and restore-purchase fixture behavior.

## Required Inputs
PRD sections 12/13/18.4-18.6, UI-07..UI-13, API matrix API-004/API-005/API-006.

## Allowed Files
`apps/api/**`, `packages/shared-types/**`, tests and T06 evidence.

## Forbidden Actions
No real WeChat Pay, real callback, real order creation, or production payment keys.

## Development Standard References
Local-only safety, backend/API rules, database rules.

## Software Test Standard References
Backend/API test standard, local-only guard.

## Acceptance Criteria
- Mock order can be created, failed, retried, restored, and completed.
- Entitlement unlock is idempotent.
- Invite progress increments to 3/3 and creates entitlement without duplicate counting.
- API tests include success, validation, not-found, duplicate/idempotency, and DB readback.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | API-004/005/006 cases covered. | API transcripts |
| DB | orders, entitlements, invite/share events read back. | DB readbacks |
| Safety | no real payment config or network call. | local-only log |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| API tests | unlock/payment/invite suite | `docs/auto-execute/api/T06/unlock-payment-invite.json` |
| DB readback | order/entitlement/invite | `docs/auto-execute/db/T06/unlock-readback.json` |
| Safety | payment local-only guard | `docs/auto-execute/logs/T06/payment-local-only.json` |

## Output Files
Mock payment/invite/entitlement APIs and tests.

## Result JSON
`docs/auto-execute/results/T06.json`

## HANDOFF
`docs/auto-execute/latest/T06-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | payment/invite behavior is not local, idempotent, or readable. |
| HARD_FAIL | real payment/cloud credential is used. |
