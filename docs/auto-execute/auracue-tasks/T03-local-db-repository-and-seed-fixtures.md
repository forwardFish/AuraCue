# Task T03 - Local DB Repository And Seed Fixtures

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T03-local-db-repository-and-seed-fixtures.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement local MVP persistence or deterministic JSON repository for users, aura_cards, generation_jobs, card_templates, share_events, analytics_events, payment_orders, and user_entitlements.

## Required Inputs
PRD section 17, `auracue-api-db-contract-matrix.md`, T01 scaffold.

## Allowed Files
`apps/api/**`, `packages/shared-types/**`, `docs/auto-execute/db/T03/**`, T03 result/log/HANDOFF.

## Forbidden Actions
No production database. No cloud DB. No destructive cleanup outside repo-local test data.

## Development Standard References
Database rules, backend/API rules.

## Software Test Standard References
Database test standard, DB readback rule.

## Acceptance Criteria
- All P0 entities are typed and seedable.
- Fixtures include locked card, unlocked card, failed job, invite progress, payment success/failure, saved card, share event, analytics events.
- Readback helpers exist for later API/owner tests.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| DB | all P0 entities exist in local repository/schema. | `docs/auto-execute/db/T03/schema-summary.json` |
| UI/Page | seed data can render UI-05..UI-18 states. | fixture manifest |
| API | repository methods cover API matrix mutations/readbacks. | unit logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| DB unit | repository tests | `docs/auto-execute/logs/T03/db-tests.log` |
| Readback | seed/readback JSON | `docs/auto-execute/db/T03/seed-readback.json` |

## Output Files
Local repository/schema, fixtures, readback helpers.

## Result JSON
`docs/auto-execute/results/T03.json`

## HANDOFF
`docs/auto-execute/latest/T03-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | missing entity or readback helper. |
| BLOCKED_BY_ENVIRONMENT | local storage runtime unavailable. |
