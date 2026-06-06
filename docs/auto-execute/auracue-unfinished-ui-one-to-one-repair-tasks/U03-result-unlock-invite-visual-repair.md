# Task U03 - Result Unlock Invite Visual Repair

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U03-result-unlock-invite-visual-repair.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to repair `UI-06` through `UI-10`: free preview, unlock choice, invite start, invite progress, and invite landing. Current known diff ratios are:

| UI | Current diffRatio | Target |
| --- | ---: | ---: |
| UI-06 | 0.404842 | <= 0.005 |
| UI-07 | 0.214381 | <= 0.005 |
| UI-08 | 0.487978 | <= 0.005 |
| UI-09 | 0.377504 | <= 0.005 |
| UI-10 | 0.550792 | <= 0.005 |

## Target Files

- `apps/wechat-mini/src/pages/result/free-preview.*`
- `apps/wechat-mini/src/pages/result/free-preview-page.mjs`
- `apps/wechat-mini/src/pages/unlock/index.*`
- `apps/wechat-mini/src/pages/unlock/unlock-invite-page.mjs`
- `apps/wechat-mini/src/pages/invite/**`
- shared visual tokens/helpers only when required by this group
- `docs/auto-execute/screenshots/ui-one-to-one/T28/**`
- `docs/auto-execute/logs/U03/**`
- `docs/auto-execute/results/U03.json`
- `docs/auto-execute/latest/U03-HANDOFF.md`

## Forbidden Actions

- Do not change entitlement, invite count, mock payment routing, API contracts, or DB behavior.
- Do not edit payment success/failure/full-result/share screens in this task.
- Do not mount reference screenshots.

## Acceptance Criteria

- `UI-06` through `UI-10` have actual PNG, diff PNG, and metrics JSON.
- Each target screen reaches `diffRatio <= 0.005`, or U03 returns `REPAIR_REQUIRED` with exact unresolved regions.
- Unlock, invite, progress, copy/share, and friend landing controls preserve existing route and analytics evidence.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T28
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U03.json`; visual harness result also updates `docs/auto-execute/results/T28.json`

## HANDOFF

`docs/auto-execute/latest/U03-HANDOFF.md`
