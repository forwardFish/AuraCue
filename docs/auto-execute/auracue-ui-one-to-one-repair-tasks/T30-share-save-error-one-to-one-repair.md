# Task T30 - Share Save Error One-To-One Repair

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T30-share-save-error-one-to-one-repair.md"
```

## Implementation Scope
Repair `UI-15` through `UI-18`: share story, share channels, saved success, and network/generation error.

## Source References
- `docs/UI/小程序/10A-分享_Story卡预览与保存.png`; `stitch_codex_ui_code_generator/10a_story/code.html`
- `docs/UI/小程序/10B-分享_渠道选择.png`; `stitch_codex_ui_code_generator/10b/code.html`
- `docs/UI/小程序/10C-保存_保存成功反馈.png`; `stitch_codex_ui_code_generator/10c/code.html`
- `docs/UI/小程序/11-异常_生成失败网络异常.png`; `stitch_codex_ui_code_generator/11/code.html`

## Allowed Files
- `apps/wechat-mini/src/pages/share/**`
- `apps/wechat-mini/src/pages/saved/**`
- `apps/wechat-mini/src/pages/error/**`
- share renderer integration only if required for UI-15 output
- shared UI tokens/helpers only if required for this screen group
- visual evidence/logs for `T30`
- `docs/auto-execute/results/T30.json`
- `docs/auto-execute/latest/T30-HANDOFF.md`

## Forbidden Actions
- Do not remove local rendered share image functionality.
- Do not call real platform share APIs.
- Do not alter generation error retry/change-scene semantics except to preserve existing behavior.
- Do not use reference screenshots as page UI.

## Acceptance Criteria
- `UI-15` to `UI-18` pass actual PNG/diff/metrics pixel gate.
- Share, copy, channel selection, save, back home, retry, and change scene controls remain covered.
- The `<image>` on share story remains limited to local rendered share output, not a mounted reference screenshot.

## Verification Commands
- T26 visual harness for `UI-15..UI-18`
- relevant page tests for T11/T16/T17 if available
- `pnpm test`
- `node scripts/verify-wechat-routes.mjs`
- `git diff --check`

## Done When
All four target screens pass the pixel gate and the task writes `docs/auto-execute/screenshots/ui-one-to-one/T30/visual-summary.json`.

## Result JSON
`docs/auto-execute/results/T30.json`

## HANDOFF
`docs/auto-execute/latest/T30-HANDOFF.md`

