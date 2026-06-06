# Task T00 - Intake, Source Inventory, And Harness Decision

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T00-intake-source-inventory-harness-decision.md. Treat this as one fresh task boundary. After this task finishes, exit this codex exec; the next task must be launched in a new codex exec only after result JSON, logs, and HANDOFF are written. Do not claim product PASS without evidence."
```

## Implementation Scope
Create the execution intake and harness decision artifacts for AuraCue without implementing product behavior. Confirm PRD, UI references, Stitch code, P1 exclusions, planned framework choice, local command strategy, and evidence directories.

## Required Inputs
- `AGENTS.md`
- `docs/AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md`
- `docs/UI/小程序/*.png`
- `docs/UI/小程序/stitch_codex_ui_code_generator/*/code.html`
- `docs/UI/小程序/P1/README.md`
- all `docs/auto-execute/auracue-*.md`

## Allowed Files
- `docs/auto-execute/intake/**`
- `docs/auto-execute/results/T00.json`
- `docs/auto-execute/latest/T00-HANDOFF.md`
- `docs/auto-execute/logs/T00/**`

## Forbidden Actions
- Do not implement product code.
- Do not run generated task queue.
- Do not start mini-program/dev servers.
- Do not create visual/API/DB PASS evidence beyond intake inventory.

## Development Standard References
`auracue-development-standard.md`: source-of-truth order, lifecycle standard, architecture rules.

## Software Test Standard References
`auracue-software-test-standard.md`: local run standard, report and safety standard.

## Acceptance Criteria
- Source inventory lists every P0 UI reference and confirms all `941x1672` source screenshots exist.
- Harness decision chooses or justifies Taro/native mini-program and local API/mock DB strategy.
- P1 screens are explicitly marked out of MVP.
- Result JSON and HANDOFF are written.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | All P0/P1 source docs are listed with paths and status. | `docs/auto-execute/intake/T00-source-inventory.md` |
| UI/Page | UI-01..UI-18 mapped to source PNG and Stitch path. | inventory table |
| API | Planned API harness approach documented. | harness decision |
| DB | Planned local DB/fixture approach documented. | harness decision |
| Safety | Confirms no real payment/cloud/AI in MVP. | result JSON |
| Tests | Lists commands T01 must make executable. | HANDOFF |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Inventory | Inspect PRD/UI/Stitch/P1 dirs | `docs/auto-execute/intake/T00-source-inventory.md` |
| Result JSON | Write T00 outcome | `docs/auto-execute/results/T00.json` |
| Handoff | Write next-step summary | `docs/auto-execute/latest/T00-HANDOFF.md` |

## Output Files
`docs/auto-execute/intake/T00-source-inventory.md`, `docs/auto-execute/intake/T00-harness-decision.md`

## Result JSON
`docs/auto-execute/results/T00.json`

## HANDOFF
`docs/auto-execute/latest/T00-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| BLOCKED_BY_MISSING_SOURCE | PRD or P0 UI/Stitch source is missing. |
| REPAIR_REQUIRED | Source inventory contradicts matrices. |
| PASS_WITH_LIMITATION | Non-P0 source is missing but MVP can continue. |
