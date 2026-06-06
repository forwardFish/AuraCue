# Task T25 - Final Acceptance Gate And Delivery Report

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T25-final-acceptance-gate-and-delivery-report.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Run the final fail-closed acceptance gate for AuraCue MVP and write `docs/AUTO_EXECUTE_DELIVERY_REPORT.md`.

## Required Inputs
All T00-T24 result JSON/HANDOFF/evidence, all standard/matrix docs, final acceptance gate doc.

## Allowed Files
`docs/AUTO_EXECUTE_DELIVERY_REPORT.md`, final gate scripts/evidence, T25 result/HANDOFF/logs.

## Forbidden Actions
Do not implement missing product behavior in final gate. Do not upgrade missing visual/API/DB/page evidence to pure product PASS.

## Development Standard References
False-completion prohibitions, evidence and handoff rules.

## Software Test Standard References
Final gate standard, report-integrity, secret guard, local-only guard.

## Acceptance Criteria
- Confirms T00-T24 result JSON/HANDOFF presence and status.
- Runs or verifies frontend, backend, contract, visual, owner E2E, local-only, secret, report-integrity checks.
- Emits category-by-category verdicts for requirements, UI, pages, clicks, API, DB, contracts, visual, owner, safety, reports.
- Pure product PASS only if every P0 evidence item is present and clean.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | all P0 requirements mapped to evidence. | final report |
| UI/Page | every P0 UI has visual and click evidence. | final report |
| API/DB | every API/DB readback covered. | final report |
| Safety | local-only and secret guard clean. | guard logs |
| Report | no stale/fake/missing required artifact. | report-integrity log |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Final gate | aggregate evidence and verdict | `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` |
| Report integrity | check artifacts/results/handoffs | `docs/auto-execute/logs/T25/report-integrity.json` |
| Secret/local guard | scan config/env/output | `docs/auto-execute/logs/T25/secret-local-guard.json` |

## Output Files
`docs/AUTO_EXECUTE_DELIVERY_REPORT.md`, final gate evidence, T25 result/HANDOFF.

## Result JSON
`docs/auto-execute/results/T25.json`

## HANDOFF
`docs/auto-execute/latest/T25-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | any P0 evidence missing/failing. |
| PASS_NEEDS_MANUAL_UI_REVIEW | only visual raster proof is incomplete while functional proof exists. |
| PASS_WITH_LIMITATION | non-P0 limitation remains explicit. |
| BLOCKED_BY_ENVIRONMENT | required local runtime unavailable. |
| HARD_FAIL | secret/report/local-only guard fails. |
