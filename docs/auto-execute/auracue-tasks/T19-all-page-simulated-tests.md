# Task T19 - All Page Simulated Tests

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T19-all-page-simulated-tests.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Create and run simulated mini-program page tests covering every P0 UI reference and every visible P0 control implemented in T09-T18.

## Required Inputs
T09-T18 handoffs, `auracue-ui-reference-map.md`, `auracue-standard-test-plan.md`.

## Allowed Files
`apps/wechat-mini/**` tests/harness, `scripts/**`, T19 traces/logs/result/HANDOFF.

## Forbidden Actions
Do not sample pages. Do not mark a page covered unless every visible P0 control is clicked or intentionally disabled with evidence.

## Development Standard References
Frontend rules, evidence rules.

## Software Test Standard References
Frontend page test standard, simulated user standard.

## Acceptance Criteria
- UI-01..UI-18 all have render tests.
- All visible P0 buttons/cards/tabs/modals/forms have click assertions.
- Each click asserts route, API call, local state, toast/modal, disabled state, or validation message.
- Analytics events are asserted.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| UI/Page | all UI IDs covered. | `page-coverage.json` |
| API | mocked/real local API calls asserted per click. | traces |
| Tests | full suite passes or reports exact failures. | log |
| Evidence | summary lists pageCount/controlCount/clickCount. | JSON |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page suite | all render/click/state tests | `docs/auto-execute/traces/T19/page-simulated-tests.json` |
| Logs | test command output | `docs/auto-execute/logs/T19/page-tests.log` |

## Output Files
Page test harness and coverage summary.

## Result JSON
`docs/auto-execute/results/T19.json`

## HANDOFF
`docs/auto-execute/latest/T19-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | any P0 page/control lacks test evidence. |
| BLOCKED_BY_ENVIRONMENT | mini-program test harness cannot run after fallback. |
