# Task T24 - Simulated Owner E2E Full Click Journey

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T24-simulated-owner-e2e-full-click-journey.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Run the full simulated owner journey from first visit through generation, free preview, invite, mock payment, full result, share, save, failure recovery, analytics, and P1 exclusion checks.

## Required Inputs
All prior implementation tasks, owner scenario matrix, standard test plan.

## Allowed Files
E2E scripts, traces, screenshots where useful, API/DB readback evidence, T24 result/HANDOFF.

## Forbidden Actions
Do not sample the journey. Do not skip failed payment, invite, error recovery, or P1 exclusion paths.

## Development Standard References
Evidence and handoff rules, local-only safety.

## Software Test Standard References
Simulated user standard, final report standard.

## Acceptance Criteria
- SCN-001 through SCN-016 all execute with exact click/action steps.
- Each step asserts expected route/UI, API call, DB readback where applicable, analytics event, and visible state.
- Every P0 page/control is clicked at least once across the journey.
- Output includes page count, click count, API count, DB readback count, and unresolved gap list.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Owner Scenario | SCN-001..SCN-016 covered. | owner summary |
| UI/Page | all P0 pages and controls clicked. | click matrix |
| API | expected API calls asserted. | API trace |
| DB | mutations/readbacks asserted. | DB trace |
| Safety | P1 links disabled/explained. | P1 trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Owner E2E | exact-click journey | `docs/auto-execute/traces/T24/owner-e2e-summary.json` |
| Click matrix | all controls coverage | `docs/auto-execute/traces/T24/all-click-targets.json` |
| API/DB trace | journey-side effects | `docs/auto-execute/traces/T24/api-db-readbacks.json` |

## Output Files
Owner E2E harness, traces, summaries.

## Result JSON
`docs/auto-execute/results/T24.json`

## HANDOFF
`docs/auto-execute/latest/T24-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | any P0 scenario/click/API/DB assertion missing or failing. |
| BLOCKED_BY_ENVIRONMENT | E2E harness cannot run after fallback. |
