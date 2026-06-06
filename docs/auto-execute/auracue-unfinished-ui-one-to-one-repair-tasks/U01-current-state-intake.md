# Task U01 - Current State Intake

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U01-current-state-intake.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to refresh the current unfinished UI state before any grouped visual repair. This task must not do broad product redesign. It may only inspect state, run non-destructive verification, update intake docs/logs, and repair obvious stale status inconsistencies if they block the next task.

## Required Inputs

- `docs/auto-execute/latest/unfinished-ui-one-to-one-repair-tasks.md`
- `docs/auto-execute/latest/machine-summary.json`
- `docs/auto-execute/screenshots/ui-one-to-one/T33/visual-summary.json`
- `docs/auto-execute/results/T33.json`
- `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-master.md`

## Allowed Files

- `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-master.md`
- `docs/auto-execute/auracue-unfinished-ui-one-to-one-codex-exec-prompts.md`
- `docs/auto-execute/logs/U01/**`
- `docs/auto-execute/results/U01.json`
- `docs/auto-execute/latest/U01-HANDOFF.md`
- `TODO.md` only if it is updated to point to the new U01-U07 queue

## Forbidden Actions

- Do not edit product page code in U01.
- Do not reset convergence state.
- Do not mark visual screens PASS.
- Do not lower thresholds or change references.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33
node scripts/t33-final-ui-one-to-one-gate.mjs
git diff --check
```

## Acceptance Criteria

- Current visual status is summarized with exact failing UI IDs and diff ratios.
- Result JSON records whether the environment can still run the local visual harness.
- HANDOFF tells U02 exactly which screen group to repair first.

## Result JSON

`docs/auto-execute/results/U01.json`

## HANDOFF

`docs/auto-execute/latest/U01-HANDOFF.md`

## Failure Statuses

- `PASS_WITH_LIMITATION`: intake and harness refresh complete, but screens still fail as expected.
- `REPAIR_REQUIRED`: local visual harness or final gate cannot run due a task-caused or stale-state issue.
- `BLOCKED_BY_ENVIRONMENT`: Chrome/local capture is unavailable after safe retries.
