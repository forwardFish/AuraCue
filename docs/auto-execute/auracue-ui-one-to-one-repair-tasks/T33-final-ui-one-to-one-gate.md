# Task T33 - Final UI One-To-One Gate

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T33-final-ui-one-to-one-gate.md"
```

## Implementation Scope
Run the final fail-closed UI one-to-one gate for this T26-T32 repair pack and update `docs/AUTO_EXECUTE_DELIVERY_REPORT.md`.

## Required Inputs
- T26-T32 result JSON and HANDOFF files.
- T31 final visual summary and all actual/diff/metrics artifacts.
- T32 regression evidence.
- Existing T00-T25 baseline evidence.
- `auracue-final-acceptance-gate.md`

## Allowed Files
- `docs/AUTO_EXECUTE_DELIVERY_REPORT.md`
- final gate scripts/evidence if needed
- `docs/auto-execute/logs/T33/**`
- `docs/auto-execute/results/T33.json`
- `docs/auto-execute/latest/T33-HANDOFF.md`

## Forbidden Actions
- Do not implement page repairs in the final gate except trivial report/gate script fixes.
- Do not promote `PASS_NEEDS_MANUAL_UI_REVIEW` to pure PASS.
- Do not ignore missing T26-T32 evidence.
- Do not skip diff evidence or click regression evidence.

## Acceptance Criteria
- Confirms T26-T32 result JSON/HANDOFF presence and status.
- Confirms all 18 screens have reference PNG, actual PNG, diff PNG, metrics JSON, and `diffRatio <= 0.005`.
- Confirms no missing core text/control/layout region in visual summaries.
- Confirms route/click/owner/regression checks are clean.
- Updates `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` with category-by-category verdicts.
- Pure PASS only when every required artifact and check is clean.

## Verification Commands
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `node scripts/verify-wechat-routes.mjs`
- full visual harness / final visual summary verification
- available report integrity check
- available local-only guard
- available secret guard
- `git diff --check`

## Done When
`docs/AUTO_EXECUTE_DELIVERY_REPORT.md`, `docs/auto-execute/results/T33.json`, and `docs/auto-execute/latest/T33-HANDOFF.md` all agree on the final status, with pure PASS only if all visual and regression gates are complete.

## Result JSON
`docs/auto-execute/results/T33.json`

## HANDOFF
`docs/auto-execute/latest/T33-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| PASS | all T26-T32 evidence is complete and all gates pass |
| REPAIR_REQUIRED | any screen/gate/evidence item is missing or failing |
| BLOCKED_BY_ENVIRONMENT | required local capture/runtime cannot run after safe alternatives |
| HARD_FAIL | secret/local-only/report-integrity fails |

