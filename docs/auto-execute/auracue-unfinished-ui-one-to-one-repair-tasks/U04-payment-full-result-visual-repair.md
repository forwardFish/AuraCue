# Task U04 - Payment Full Result Visual Repair

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U04-payment-full-result-visual-repair.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to repair `UI-11` through `UI-14`: mock payment confirm, mock payment failed, payment success, and full result. Current known diff ratios are:

| UI | Current diffRatio | Target |
| --- | ---: | ---: |
| UI-11 | 0.499684 | <= 0.005 |
| UI-12 | 0.587546 | <= 0.005 |
| UI-13 | 0.606867 | <= 0.005 |
| UI-14 | 0.538574 | <= 0.005 |

## Target Files

- `apps/wechat-mini/src/pages/unlock/pay.*`
- `apps/wechat-mini/src/pages/unlock/pay-failed.*`
- `apps/wechat-mini/src/pages/unlock/success.*`
- `apps/wechat-mini/src/pages/unlock/payment-state-page.mjs`
- `apps/wechat-mini/src/pages/result/full.*`
- `apps/wechat-mini/src/pages/result/full-page.mjs`
- shared visual tokens/helpers only when required by this group
- `docs/auto-execute/screenshots/ui-one-to-one/T29/**`
- `docs/auto-execute/logs/U04/**`
- `docs/auto-execute/results/U04.json`
- `docs/auto-execute/latest/U04-HANDOFF.md`

## Forbidden Actions

- Do not introduce real payment.
- Do not enable P1 seven-day trend.
- Do not change API/DB entitlement semantics except to preserve existing mock flow.
- Do not mount reference screenshots.

## Acceptance Criteria

- `UI-11` through `UI-14` have actual PNG, diff PNG, and metrics JSON.
- Each target screen reaches `diffRatio <= 0.005`, or U04 returns `REPAIR_REQUIRED` with exact unresolved regions.
- Confirm unlock, try again, restore purchase, invite instead, contact support, view full card, save card, share story, and disabled trend controls remain covered.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T29
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U04.json`; visual harness result also updates `docs/auto-execute/results/T29.json`

## HANDOFF

`docs/auto-execute/latest/U04-HANDOFF.md`
