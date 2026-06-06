# Task T05 - Card Result And Entitlement Read APIs

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T05-card-result-and-entitlement-read-apis.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement API-003 card result reads for free preview, locked full result, unlocked full result, and not-found. Enforce entitlement visibility behind backend boundary.

## Required Inputs
PRD sections 10.1-10.3, 18.3, API matrix API-003, T03/T04 fixtures.

## Allowed Files
`apps/api/**`, `packages/shared-types/**`, tests and T05 evidence.

## Forbidden Actions
Do not expose full locked content to the frontend response except as explicitly blurred/locked preview fields.

## Development Standard References
Backend/API rules, frontend/backend contract rules.

## Software Test Standard References
All-API standard, contract test standard.

## Acceptance Criteria
- Free result returns only aura name, lucky color, one-line reminder, low-res/watermark metadata, and locked preview markers.
- Full result without entitlement fails or returns locked status.
- Full result with entitlement returns complete fields.
- Not-found is safe and typed.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | API-003 C01-C04 cases covered. | API transcript |
| DB | entitlement readback gates full response. | DB readback |
| UI/Page | response shape supports UI-06 and UI-14. | contract fixture |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| API tests | card API suite | `docs/auto-execute/api/T05/card-api.json` |
| DB readback | card + entitlement | `docs/auto-execute/db/T05/card-readback.json` |

## Output Files
Card read API and tests.

## Result JSON
`docs/auto-execute/results/T05.json`

## HANDOFF
`docs/auto-execute/latest/T05-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | locked/full visibility contract is wrong. |
| BLOCKED_BY_ENVIRONMENT | API runtime unavailable. |
