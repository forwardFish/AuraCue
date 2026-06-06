# Task T18 - Analytics And Safety Copy Guard

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T18-analytics-and-safety-copy-guard.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement and verify analytics event constants/call sites plus copy safety guard for AuraCue risk boundaries.

## Required Inputs
PRD sections 23/25/28, all implemented page/API code, `packages/analytics-events`.

## Allowed Files
`packages/analytics-events/**`, `packages/prompt-core/**`, `apps/wechat-mini/**`, `apps/api/**`, safety tests/evidence.

## Forbidden Actions
No production analytics. Do not weaken product copy by deleting required value proposition unless it violates safety rules.

## Development Standard References
Analytics rules, safety/risk copy rules.

## Software Test Standard References
Report and safety standard.

## Acceptance Criteria
- Required analytics event names from PRD section 23 exist and are used by page/API flow.
- Safety guard scans static and generated fixture copy for forbidden claims: guaranteed destiny change, negative judgment, appearance anxiety, therapy/medical claims, mandatory selfie.
- Event tests cover page views, click_generate_start, select_scene, select_energy, generation, result view, unlock, checkout, save, share, invite, return.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-017/REQ-018. | analytics and safety reports |
| UI/Page | all P0 pages emit expected events. | trace summary |
| API | API-010 validates event names. | API transcript |
| Tests | safety guard and event usage tests pass. | logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Analytics test | event constants/call-site coverage | `docs/auto-execute/traces/T18/analytics-coverage.json` |
| Safety scan | copy safety guard | `docs/auto-execute/logs/T18/copy-safety-audit.json` |

## Output Files
Analytics constants, event wiring, safety guard/tests.

## Result JSON
`docs/auto-execute/results/T18.json`

## HANDOFF
`docs/auto-execute/latest/T18-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | missing event or unsafe copy. |
| HARD_FAIL | production analytics endpoint or secret used. |
