# Task T10 - Scene And Energy Selection Pages

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T10-scene-energy-selection-pages.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-02, UI-03, and UI-04: scene selection, energy selection, and incomplete selection disabled/validation state.

## Required Inputs
`02-选择_出门场景.png`, `03-选择_今日能量.png`, `03A-选择_场景与能量未完成状态.png`, Stitch `02`, `03`, `03a`, PRD 9/19.2/19.3.

## Allowed Files
`apps/wechat-mini/**`, tests, T10 evidence.

## Forbidden Actions
Do not add extra P1 scene/energy values. Do not allow generation without valid scene and energy.

## Development Standard References
Frontend rules, state rules, analytics rules.

## Software Test Standard References
Frontend page test standard, simulated user standard.

## Acceptance Criteria
- Scene options exactly include Date, Work / Meeting, Party / Social, Just need luck.
- Energy options exactly include Confidence, Luck, Love, Calm, Charm, Focus.
- Continue/generate disabled state matches UI-04 when incomplete.
- Complete selection calls API-001 and navigates to loading.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-006/REQ-007 covered. | selection trace |
| UI/Page | UI-02/UI-03/UI-04 implemented. | screenshots |
| API | API-001 called only when complete. | API mock trace |
| DB | generation job created after valid action. | readback in later API task |
| Tests | each option clicked. | all-click trace |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | render/click/disabled/generate | `docs/auto-execute/traces/T10/scene-energy-clicks.json` |
| Screenshots | capture UI-02/UI-03/UI-04 | `docs/auto-execute/screenshots/T10/` |

## Output Files
Scene/energy pages, state handlers, tests.

## Result JSON
`docs/auto-execute/results/T10.json`

## HANDOFF
`docs/auto-execute/latest/T10-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | options, disabled state, route, or API call is wrong. |
| PASS_NEEDS_MANUAL_UI_REVIEW | functional proof exists but visual diff unavailable. |
