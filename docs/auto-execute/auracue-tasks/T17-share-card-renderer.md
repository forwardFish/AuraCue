# Task T17 - Share Card Renderer

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T17-share-card-renderer.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement deterministic local share-card renderer for 9:16 AuraCue story cards that supports UI-15 and API-009 without cloud storage.

## Required Inputs
PRD section 15, UI-15, T02 tokens, T07 API contract.

## Allowed Files
`packages/card-renderer/**`, `apps/api/**`, `apps/wechat-mini/**` renderer integration, tests/evidence.

## Forbidden Actions
No cloud rendering service. No production object storage. No paid image API.

## Development Standard References
Card renderer architecture, local-only safety, visual rules.

## Software Test Standard References
Visual one-to-one standard, local-only guard.

## Acceptance Criteria
- Renderer consumes structured card fields and template metadata.
- Produces deterministic local artifact/path or data URL for tests.
- UI-15 can display the renderer output.
- Renderer test verifies stable dimensions and required text fields.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-014. | render artifact |
| UI/Page | UI-15 uses renderer output. | screenshot target |
| API | API-009 integrated. | API transcript |
| Tests | renderer unit/snapshot/metadata test. | logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Renderer test | generate local story card | `docs/auto-execute/screenshots/T17/share-card-render.json` |
| API test | API-009 render path | `docs/auto-execute/api/T17/render-api.json` |

## Output Files
Renderer package, API integration, tests.

## Result JSON
`docs/auto-execute/results/T17.json`

## HANDOFF
`docs/auto-execute/latest/T17-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | renderer cannot produce deterministic local output. |
| HARD_FAIL | cloud/production render path used. |
