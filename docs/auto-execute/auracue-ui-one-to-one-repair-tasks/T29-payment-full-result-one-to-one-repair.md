# Task T29 - Payment Full Result One-To-One Repair

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T29-payment-full-result-one-to-one-repair.md"
```

## Implementation Scope
Repair `UI-11` through `UI-14`: mock payment confirm, mock payment failed, payment success, and full result.

## Source References
- `docs/UI/小程序/08A-支付解锁_确认支付.png`; `stitch_codex_ui_code_generator/08a/code.html`
- `docs/UI/小程序/08B-支付解锁_失败与恢复购买.png`; `stitch_codex_ui_code_generator/08b/code.html`
- `docs/UI/小程序/08C-支付解锁_成功状态.png`; `stitch_codex_ui_code_generator/08c/code.html`
- `docs/UI/小程序/09-结果_完整气场卡与分享入口.png`; `stitch_codex_ui_code_generator/09/code.html`

## Allowed Files
- `apps/wechat-mini/src/pages/unlock/pay.*`
- `apps/wechat-mini/src/pages/unlock/pay-failed.*`
- `apps/wechat-mini/src/pages/unlock/success.*`
- `apps/wechat-mini/src/pages/unlock/payment-state-page.mjs`
- `apps/wechat-mini/src/pages/result/full.*`
- `apps/wechat-mini/src/pages/result/full-page.mjs`
- shared UI tokens/helpers only if required for this screen group
- visual evidence/logs for `T29`
- `docs/auto-execute/results/T29.json`
- `docs/auto-execute/latest/T29-HANDOFF.md`

## Forbidden Actions
- Do not introduce real payment.
- Do not implement P1 seven-day trend; keep it disabled/explained as the existing product contract requires.
- Do not change API/DB entitlement semantics except to preserve existing mock flow.
- Do not use screenshots as UI.

## Acceptance Criteria
- `UI-11` to `UI-14` pass actual PNG/diff/metrics pixel gate.
- Confirm unlock, try again, restore purchase, invite instead, contact support, view full card, save card, share story, more sharing options, and disabled trend controls remain covered.
- Local/mock payment and local-only evidence remain clean.

## Verification Commands
- T26 visual harness for `UI-11..UI-14`
- relevant page tests for T14/T15 if available
- `pnpm test`
- `node scripts/verify-wechat-routes.mjs`
- `git diff --check`

## Done When
All four target screens pass the pixel gate and the task writes `docs/auto-execute/screenshots/ui-one-to-one/T29/visual-summary.json`.

## Result JSON
`docs/auto-execute/results/T29.json`

## HANDOFF
`docs/auto-execute/latest/T29-HANDOFF.md`

