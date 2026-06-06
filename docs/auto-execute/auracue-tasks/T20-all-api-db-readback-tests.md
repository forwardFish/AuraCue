# Task T20 - All API And DB Readback Tests

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T20-all-api-db-readback-tests.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Create and run all API and DB readback tests for API-000 through API-010.

## Required Inputs
T03-T07 handoffs, API/DB matrix, standard test plan.

## Allowed Files
API tests, repository tests, scripts, T20 evidence.

## Forbidden Actions
No production endpoints. No real payment/cloud/AI.

## Development Standard References
Backend/API rules, database rules, local-only safety.

## Software Test Standard References
Backend/API test standard, all-API standard, DB readback rule.

## Acceptance Criteria
- Every API case in `auracue-api-db-contract-matrix.md` is tested.
- Every mutation has independent DB readback.
- Validation, not-found, duplicate/idempotency, timeout/fallback, and locked/unauthorized states are covered where applicable.
- API summary maps each tested case back to API ID and case ID.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | API-000..API-010 all covered. | `all-api-summary.json` |
| DB | all mutation/readbacks covered. | `db-readbacks.json` |
| Safety | local-only guard confirms mocks. | local-only log |
| Tests | API suite passes or exact gaps listed. | log |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| API suite | all API cases | `docs/auto-execute/api/T20/all-api-summary.json` |
| DB readback | independent readbacks | `docs/auto-execute/db/T20/db-readbacks.json` |
| Logs | command output | `docs/auto-execute/logs/T20/api-db-tests.log` |

## Output Files
API/DB test suites and summaries.

## Result JSON
`docs/auto-execute/results/T20.json`

## HANDOFF
`docs/auto-execute/latest/T20-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | API case or DB readback missing/failing. |
| HARD_FAIL | production side effect detected. |
