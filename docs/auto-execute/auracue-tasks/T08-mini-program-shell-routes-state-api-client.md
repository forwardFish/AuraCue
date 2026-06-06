# Task T08 - Mini-Program Shell Routes State API Client

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T08-mini-program-shell-routes-state-api-client.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement mini-program app shell, route registry, navigation helpers, shared state, API client, analytics client, and fixture toggles required by all P0 pages.

## Required Inputs
T01 scaffold, T02 tokens, T04-T07 API contracts, UI reference map.

## Allowed Files
`apps/wechat-mini/**`, `packages/shared-types/**`, `packages/analytics-events/**`, tests/evidence.

## Forbidden Actions
Do not implement full page visuals yet except shell-level layout/state and placeholder route wrappers.

## Development Standard References
Frontend rules, frontend/backend contract standard, analytics rules.

## Software Test Standard References
Frontend page test standard, contract test standard.

## Acceptance Criteria
- Routes exist for `/`, `/create/scene`, `/create/energy`, `/create/loading`, `/result/:id`, `/unlock/:id`, invite/payment/share/saved/error routes.
- State store tracks scene, energy, job, card, entitlement, invite, payment, share/save, error.
- API client maps to API-001..API-010.
- Shell smoke test can navigate all routes with fixtures.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| UI/Page | route registry covers UI-01..UI-18. | route manifest |
| API | API client methods typed. | contract fixture |
| Tests | route smoke and state tests. | logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Route smoke | navigate all route placeholders | `docs/auto-execute/traces/T08/route-smoke.json` |
| State/API tests | shell tests | `docs/auto-execute/logs/T08/shell-tests.log` |

## Output Files
Mini-program shell, routing, state, API/analytics client.

## Result JSON
`docs/auto-execute/results/T08.json`

## HANDOFF
`docs/auto-execute/latest/T08-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | route/API/state coverage incomplete. |
| BLOCKED_BY_ENVIRONMENT | mini-program test runtime unavailable. |
