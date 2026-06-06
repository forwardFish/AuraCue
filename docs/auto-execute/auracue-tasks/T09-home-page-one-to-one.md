# Task T09 - Home Page One-To-One

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec "Use the auto-execute skill. Execute only D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks\T09-home-page-one-to-one.md. Treat this as one fresh task boundary. Exit after result JSON, logs, and HANDOFF are written."
```

## Implementation Scope
Implement UI-01 home page one-to-one from `01-进入_首页生成入口.png` and Stitch `01/code.html`.

## Required Inputs
UI-01 row, T02 tokens, T08 shell, PRD 8.3/19.1.

## Allowed Files
`apps/wechat-mini/**`, page tests, T09 evidence.

## Forbidden Actions
No generic landing page. No extra tabs/history/account. No product-code claims without screenshot/click test.

## Development Standard References
Frontend rules, visual source-of-truth order.

## Software Test Standard References
Frontend page test standard, visual one-to-one standard.

## Acceptance Criteria
- Home page reproduces UI-01 layout, typography, card preview, CTAs, and brand copy.
- Date/Work/Party/Just need luck and main CTA are clickable and route/state correctly.
- Analytics events `page_view_home` and `click_generate_start` are emitted.

## Detailed Acceptance Criteria
| Area | Criteria | Evidence |
| --- | --- | --- |
| Requirement | REQ-004 home start flow. | click trace |
| UI/Page | UI-01 implemented at `/`. | screenshot target |
| API | API-010 analytics caller wired. | event readback |
| Tests | render and all-click tests. | `traces/T09/home-clicks.json` |

## Required Future Tests And Evidence
| Evidence Type | Command/Future Action | Required Path |
| --- | --- | --- |
| Page test | render/click home controls | `docs/auto-execute/traces/T09/home-clicks.json` |
| Screenshot | capture actual home | `docs/auto-execute/screenshots/T09/UI-01-home.png` |

## Output Files
Home page components/styles/tests.

## Result JSON
`docs/auto-execute/results/T09.json`

## HANDOFF
`docs/auto-execute/latest/T09-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| REPAIR_REQUIRED | visual/control/analytics contract incomplete. |
| PASS_NEEDS_MANUAL_UI_REVIEW | functional proof exists but screenshot diff cannot run. |
