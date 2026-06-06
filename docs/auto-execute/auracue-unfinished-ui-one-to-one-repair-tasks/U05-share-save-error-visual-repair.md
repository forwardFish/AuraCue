# Task U05 - Share Save Error Visual Repair

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U05-share-save-error-visual-repair.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to repair `UI-15` through `UI-18`: share story, share channels, saved success, and network/generation error. Current known diff ratios are:

| UI | Current diffRatio | Target |
| --- | ---: | ---: |
| UI-15 | 0.771100 | <= 0.005 |
| UI-16 | 0.454386 | <= 0.005 |
| UI-17 | 0.345407 | <= 0.005 |
| UI-18 | 0.304512 | <= 0.005 |

## Target Files

- `apps/wechat-mini/src/pages/share/**`
- `apps/wechat-mini/src/pages/saved/**`
- `apps/wechat-mini/src/pages/error/**`
- share renderer integration only if required for `UI-15`
- shared visual tokens/helpers only when required by this group
- `docs/auto-execute/screenshots/ui-one-to-one/T30/**`
- `docs/auto-execute/logs/U05/**`
- `docs/auto-execute/results/U05.json`
- `docs/auto-execute/latest/U05-HANDOFF.md`

## Forbidden Actions

- Do not remove local rendered share image functionality.
- Do not call real platform share APIs.
- Do not alter generation retry/change-scene semantics except to preserve existing behavior.
- Do not mount reference screenshots.

## Acceptance Criteria

- `UI-15` through `UI-18` have actual PNG, diff PNG, and metrics JSON.
- Each target screen reaches `diffRatio <= 0.005`, or U05 returns `REPAIR_REQUIRED` with exact unresolved regions.
- Share, copy, channel selection, save, back home, retry, and change scene controls remain covered.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T30
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U05.json`; visual harness result also updates `docs/auto-execute/results/T30.json`

## HANDOFF

`docs/auto-execute/latest/U05-HANDOFF.md`
