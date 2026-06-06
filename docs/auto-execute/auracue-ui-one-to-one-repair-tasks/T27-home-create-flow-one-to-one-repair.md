# Task T27 - Home Create Flow One-To-One Repair

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T27-home-create-flow-one-to-one-repair.md"
```

## Implementation Scope
Repair `UI-01` through `UI-05`: home, scene selection, energy selection, incomplete state, and generation/loading.

## Source References
- `docs/UI/小程序/01-进入_首页生成入口.png`; `stitch_codex_ui_code_generator/01/code.html`
- `docs/UI/小程序/02-选择_出门场景.png`; `stitch_codex_ui_code_generator/02/code.html`
- `docs/UI/小程序/03-选择_今日能量.png`; `stitch_codex_ui_code_generator/03/code.html`
- `docs/UI/小程序/03A-选择_场景与能量未完成状态.png`; `stitch_codex_ui_code_generator/03a/code.html`
- `docs/UI/小程序/04-生成_抽卡仪式.png`; `stitch_codex_ui_code_generator/04/code.html`

## Allowed Files
- `apps/wechat-mini/src/pages/home/**`
- `apps/wechat-mini/src/pages/create/**`
- shared UI tokens/helpers only if required for this screen group
- visual evidence/logs for `T27`
- `docs/auto-execute/results/T27.json`
- `docs/auto-execute/latest/T27-HANDOFF.md`

## Forbidden Actions
- Do not change routes, API contracts, local DB behavior, or owner-flow semantics.
- Do not modify other UI groups except shared tokens needed by these pages.
- Do not use screenshots as page backgrounds or mounted UI.

## Acceptance Criteria
- `UI-01` to `UI-05` visually match references with actual PNG + diff PNG + metrics JSON.
- Required controls still work: scene shortcuts, start CTA, scene selection, energy selection, disabled incomplete state, generation pending/success/failure routing.
- `diffRatio <= 0.005` for each repaired screen, or the task returns `REPAIR_REQUIRED` with exact remaining regions.

## Verification Commands
- T26 visual harness for `UI-01..UI-05`
- relevant page tests for T09/T10/T11 if available
- `pnpm test`
- `node scripts/verify-wechat-routes.mjs`
- `git diff --check`

## Done When
All five target screens pass the pixel gate and the task writes `docs/auto-execute/screenshots/ui-one-to-one/T27/visual-summary.json`.

## Result JSON
`docs/auto-execute/results/T27.json`

## HANDOFF
`docs/auto-execute/latest/T27-HANDOFF.md`

