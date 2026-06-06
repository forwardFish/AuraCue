# Task T01 - Scaffold Mini-Program Backend Shared Workspace

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T01-scaffold-mini-program-backend-shared-workspace.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Create the initial local workspace for the WeChat mini-program MVP: mini-program app, local API/mock service, shared packages, scripts, and test skeletons. Prefer Taro + React + TypeScript unless T00 proves native mini-program is safer.

## Required Inputs
T00 handoff, development/test standards, PRD sections 6/22/31, UI map, API/DB matrix.

## Allowed Files
- `package.json`, lockfile, workspace config
- `apps/wechat-mini/**`
- `apps/api/**` or `services/api/**`
- `packages/shared-types/**`, `packages/ui-tokens/**`, `packages/analytics-events/**`, `packages/card-renderer/**`, `packages/prompt-core/**`
- `scripts/**`
- `docs/auto-execute/results/T01.json`, `docs/auto-execute/latest/T01-HANDOFF.md`, `docs/auto-execute/logs/T01/**`

## Forbidden Actions
No real cloud/payment/AI integration. No P1 pages. No broad unrelated setup.

## Development Standard References
Architecture rules, frontend rules, backend/API rules, database rules.

## Software Test Standard References
Local run standard, report and safety standard.

## Acceptance Criteria
- Workspace installs locally and exposes documented commands.
- Mini-program app has route placeholders for all P0 routes.
- Local API has health endpoint.
- Shared types/tokens/event package skeletons exist.
- Evidence paths and scripts are ready for later tasks.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-001 scaffold for MVP only. | install/build logs |
| UI/Page | routes for UI-01..UI-18 states exist as placeholders. | route manifest |
| API | API-000 health endpoint returns ready. | `docs/auto-execute/api/T01/health.json` |
| DB | local repository/mock DB shell exists. | scaffold docs |
| Tests | basic smoke/test command exists. | logs |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Install | package install command selected by scaffold | `docs/auto-execute/logs/T01/install.log` |
| Health | local API health probe | `docs/auto-execute/api/T01/health.json` |
| Smoke | minimal app/build/test smoke | `docs/auto-execute/logs/T01/smoke.log` |

## Output Files
Workspace/app/API/shared package scaffold and scripts.

## Result JSON
`docs/auto-execute/results/T01.json`

## HANDOFF
`docs/auto-execute/latest/T01-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| BLOCKED_BY_ENVIRONMENT | package manager/runtime cannot install after fallback. |
| REPAIR_REQUIRED | scaffold cannot expose routes or health endpoint. |
| PASS_WITH_LIMITATION | non-critical tooling unavailable but task has documented fallback. |
