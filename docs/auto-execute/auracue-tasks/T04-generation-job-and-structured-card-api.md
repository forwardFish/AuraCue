# Task T04 - Generation Job And Structured Card API

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T04-generation-job-and-structured-card-api.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement API-001 and API-002 plus deterministic local card generation that creates structured AuraCue card fields without real AI calls.

## Required Inputs
PRD sections 10/14/16/18.1/18.2, API matrix API-001/API-002, T03 DB fixtures.

## Allowed Files
`apps/api/**`, `packages/prompt-core/**`, `packages/shared-types/**`, tests and T04 evidence.

## Forbidden Actions
No real AI provider call. No prompt hardcoded in mini-program frontend.

## Development Standard References
Backend/API rules, architecture rules, safety/risk rules.

## Software Test Standard References
Backend/API test standard, local-only guard.

## Acceptance Criteria
- `POST /api/generation-jobs` creates a job for valid scene/energy and rejects invalid input.
- `GET /api/generation-jobs/:jobId` returns pending/success/failure/not-found states.
- Deterministic generator outputs all structured card fields and safe copy.
- Failure fixture drives UI-18 later.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | API-001/002 success, validation, not-found, fallback covered. | API logs |
| DB | job and card write/readback. | DB readback |
| Safety | no forbidden destiny/therapy/appearance claims. | copy test |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| API tests | generation API suite | `docs/auto-execute/api/T04/generation-api.json` |
| DB readback | job/card readback | `docs/auto-execute/db/T04/generation-readback.json` |

## Output Files
Generation API, local generator, tests.

## Result JSON
`docs/auto-execute/results/T04.json`

## HANDOFF
`docs/auto-execute/latest/T04-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | API contract or structured fields incomplete. |
| BLOCKED_BY_ENVIRONMENT | local API runtime cannot run. |
