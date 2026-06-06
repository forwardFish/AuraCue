# Task U07 - Final Regression And Gate

## Codex Exec

```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
Get-Content -Raw "docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U07-final-regression-and-gate.md" | codex exec -C "D:\lyh\agent\agent-frame\AuraCue" --dangerously-bypass-approvals-and-sandbox -
```

## Scope

Use the `auto-execute` skill to run the final regression and fail-closed acceptance gate for the unfinished UI repair queue. U07 is the only task in this queue allowed to update final delivery reporting.

## Required Inputs

- U01-U06 result JSON and HANDOFF files, when present
- T31 and T33 final visual summaries
- T32 regression evidence
- Existing T00-T25 baseline evidence
- `docs/auto-execute/auracue-final-acceptance-gate.md`

## Allowed Files

- `docs/AUTO_EXECUTE_DELIVERY_REPORT.md`
- `docs/auto-execute/latest/machine-summary.json`
- `docs/auto-execute/latest/unfinished-ui-one-to-one-repair-tasks.md`
- `docs/auto-execute/logs/U07/**`
- `docs/auto-execute/results/U07.json`
- `docs/auto-execute/latest/U07-HANDOFF.md`
- final gate scripts only if needed to read U-task evidence without weakening T33 criteria

## Forbidden Actions

- Do not implement page repairs except trivial report/gate plumbing.
- Do not promote visual failure or missing evidence to PASS.
- Do not ignore T32 regression evidence.
- Do not skip `pnpm test`, lint, typecheck, route verification, visual harness, or `git diff --check`.

## Acceptance Criteria

- Confirms every `UI-01` through `UI-18` screen has reference PNG, actual PNG, diff PNG, metrics JSON, and `diffRatio <= 0.005`.
- Confirms no missing core text, missing required control, or major visual region mismatch remains.
- Confirms routes, clicks, owner flow, API, local-only safety, report integrity, and `git diff --check` are clean.
- Updates final reports consistently.
- Pure PASS only if every required artifact and check is clean.

## Verification Commands

```powershell
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T31
node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33
node scripts/t33-final-ui-one-to-one-gate.mjs
pnpm.cmd test
pnpm.cmd lint
pnpm.cmd typecheck
node scripts/verify-wechat-routes.mjs
git diff --check
```

## Result JSON

`docs/auto-execute/results/U07.json`

## HANDOFF

`docs/auto-execute/latest/U07-HANDOFF.md`

## Failure Statuses

- `PASS`: all visual and regression gates pass.
- `REPAIR_REQUIRED`: any screen/gate/evidence item is missing or failing.
- `BLOCKED_BY_ENVIRONMENT`: local capture/runtime cannot run after safe alternatives.
- `HARD_FAIL`: local-only, secret, report-integrity, or git diff check fails.
