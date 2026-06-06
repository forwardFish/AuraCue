# Task T21 - Frontend Backend Contract Tests

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T21-frontend-backend-contract-tests.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Verify every mini-program API caller matches the backend contract for method, path, request DTO, response DTO, error envelope, loading/error UI behavior, and analytics side effects.

## Required Inputs
T04-T08, T09-T18, API/DB matrix.

## Allowed Files
Contract tests, API client tests, T21 evidence.

## Forbidden Actions
Do not weaken contracts to match broken UI. Fix drift at the correct boundary.

## Development Standard References
Frontend/backend contract standard.

## Software Test Standard References
Frontend/backend contract test standard.

## Acceptance Criteria
- API client methods map to API-001..API-010.
- Every caller has success and error contract tests.
- Locked/free/full entitlement visibility is verified.
- Contract drift blocks task success.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | all frontend callers match matrix. | contract summary |
| UI/Page | loading/error UI asserted for API errors. | traces |
| Tests | contract suite passes or gap list. | log |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Contract suite | all caller/response/error contracts | `docs/auto-execute/api/T21/contract-summary.json` |
| Logs | command output | `docs/auto-execute/logs/T21/contract-tests.log` |

## Output Files
Contract tests and summary.

## Result JSON
`docs/auto-execute/results/T21.json`

## HANDOFF
`docs/auto-execute/latest/T21-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | any caller/contract drift remains. |
| BLOCKED_BY_ENVIRONMENT | test runtime unavailable after fallback. |
