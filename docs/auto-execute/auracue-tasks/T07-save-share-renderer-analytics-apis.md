# Task T07 - Save Share Renderer Analytics APIs

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T07-save-share-renderer-analytics-apis.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement API-007, API-008, API-009, API-010 for saving cards, recording share events, generating deterministic local share image metadata/assets, and recording analytics events.

## Required Inputs
PRD sections 15/18.7-18.9/23, UI-15..UI-17, API matrix API-007..API-010.

## Allowed Files
`apps/api/**`, `packages/card-renderer/**`, `packages/analytics-events/**`, `packages/shared-types/**`, tests/evidence.

## Forbidden Actions
No production analytics endpoint. No cloud storage write. No real social-platform share API dependency in tests.

## Development Standard References
Backend/API rules, analytics rules, local-only safety.

## Software Test Standard References
All-API standard, report standard.

## Acceptance Criteria
- Save marks card as saved and is idempotent.
- Share event records channel/source.
- Share renderer creates deterministic local artifact or local path metadata.
- Analytics event collector validates event names and stores safe properties.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| API | API-007..010 success/error/readback covered. | API summary |
| DB | save/share/render/analytics readbacks. | DB summary |
| UI/Page | supports UI-15, UI-16, UI-17. | response fixtures |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| API tests | save/share/render/analytics suite | `docs/auto-execute/api/T07/save-share-render-analytics.json` |
| DB readback | mutations/readbacks | `docs/auto-execute/db/T07/readback.json` |
| Local render | share image artifact/metadata | `docs/auto-execute/screenshots/T07/share-render-local.json` |

## Output Files
Save/share/render/analytics APIs, renderer package, tests.

## Result JSON
`docs/auto-execute/results/T07.json`

## HANDOFF
`docs/auto-execute/latest/T07-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | API/DB readback incomplete. |
| HARD_FAIL | production analytics/storage is touched. |
