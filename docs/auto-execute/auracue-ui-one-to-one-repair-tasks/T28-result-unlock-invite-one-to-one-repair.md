# Task T28 - Result Unlock Invite One-To-One Repair

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T28-result-unlock-invite-one-to-one-repair.md"
```

## Implementation Scope
Repair `UI-06` through `UI-10`: free preview, unlock choice, invite start, invite progress, and invite landing.

## Source References
- `docs/UI/小程序/05-结果_免费预览待解锁.png`; `stitch_codex_ui_code_generator/05/code.html`
- `docs/UI/小程序/06-解锁_付费与邀请入口.png`; `stitch_codex_ui_code_generator/06/code.html`
- `docs/UI/小程序/07A-邀请解锁_邀请3人入口.png`; `stitch_codex_ui_code_generator/07a_3/code.html`
- `docs/UI/小程序/07B-邀请解锁_邀请进度.png`; `stitch_codex_ui_code_generator/07b/code.html`
- `docs/UI/小程序/07C-邀请解锁_好友承接页.png`; `stitch_codex_ui_code_generator/07c/code.html`

## Allowed Files
- `apps/wechat-mini/src/pages/result/free-preview.*`
- `apps/wechat-mini/src/pages/result/free-preview-page.mjs`
- `apps/wechat-mini/src/pages/unlock/index.*`
- `apps/wechat-mini/src/pages/unlock/unlock-invite-page.mjs`
- `apps/wechat-mini/src/pages/invite/**`
- shared UI tokens/helpers only if required for this screen group
- visual evidence/logs for `T28`
- `docs/auto-execute/results/T28.json`
- `docs/auto-execute/latest/T28-HANDOFF.md`

## Forbidden Actions
- Do not change entitlement, invite count, mock payment routing, API contracts, or DB behavior except to preserve current owner flow.
- Do not edit payment success/failure/full-result/share screens in this task.
- Do not use reference screenshots as page UI.

## Acceptance Criteria
- `UI-06` to `UI-10` pass actual PNG/diff/metrics pixel gate.
- Unlock, invite, paid-entry, progress, copy/share, and friend landing controls still produce the existing route and analytics evidence.
- Locked preview blur/watermark and invite progress states remain fixture-controlled.

## Verification Commands
- T26 visual harness for `UI-06..UI-10`
- relevant page tests for T12/T13 if available
- `pnpm test`
- `node scripts/verify-wechat-routes.mjs`
- `git diff --check`

## Done When
All five target screens pass the pixel gate and the task writes `docs/auto-execute/screenshots/ui-one-to-one/T28/visual-summary.json`.

## Result JSON
`docs/auto-execute/results/T28.json`

## HANDOFF
`docs/auto-execute/latest/T28-HANDOFF.md`

