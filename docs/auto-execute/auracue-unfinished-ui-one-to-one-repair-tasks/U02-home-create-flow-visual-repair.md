# Task U02 - Home Create Flow Visual Repair

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U02-home-create-flow-visual-repair.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to repair `UI-01` through `UI-05`: home entry, scene selection, energy selection, incomplete state, and generation/loading. Current known diff ratios are:

| UI | Current diffRatio | Target |
| --- | ---: | ---: |
| UI-01 | 0.132944 | <= 0.005 |
| UI-02 | 0.234748 | <= 0.005 |
| UI-03 | 0.266123 | <= 0.005 |
| UI-04 | 0.290327 | <= 0.005 |
| UI-05 | 0.334089 | <= 0.005 |

## Target Files

- `apps/wechat-mini/src/pages/home/**`
- `apps/wechat-mini/src/pages/create/**`
- shared visual tokens/helpers only when required by this group
- `docs/auto-execute/screenshots/ui-one-to-one/T27/**`
- `docs/auto-execute/logs/U02/**`
- `docs/auto-execute/results/U02.json`
- `docs/auto-execute/latest/U02-HANDOFF.md`

## Forbidden Actions

- Do not edit result, unlock, invite, payment, share, save, or error pages except shared tokens needed by this group.
- Do not change route/API/DB/owner-flow behavior.
- Do not mount reference screenshots.

## Acceptance Criteria

- `UI-01` through `UI-05` have actual PNG, diff PNG, and metrics JSON.
- Each target screen reaches `diffRatio <= 0.005`, or U02 returns `REPAIR_REQUIRED` with exact unresolved regions.
- Scene shortcuts, start CTA, scene selection, energy selection, disabled incomplete state, and generation routing still work.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T27
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U02.json`; visual harness result also updates `docs/auto-execute/results/T27.json`

## HANDOFF

`docs/auto-execute/latest/U02-HANDOFF.md`
