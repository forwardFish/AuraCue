# AuraCue Unfinished UI One-To-One Auto-Execute Entrypoint

Project root: `D:\lyh\agent\agent-frame\AuraCue`

Task dir: `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks`

Execution mode: use the `auto-execute` skill. Run exactly one child task per fresh `codex exec` worker. Let each worker write its result JSON and HANDOFF, then exit completely before the next task starts.

## Global Worker Rules

- Read `AGENTS.md` first.
- Use the `auto-execute` skill.
- Execute only the task document passed to the worker.
- Preserve route/API/click/owner-flow behavior unless the task explicitly repairs a visual-work regression.
- Do not mount reference screenshots as UI.
- Do not use remote CDN, remote fonts, remote images, production services, real payment, real AI, or secrets.
- Do not lower `diffRatio <= 0.005`.
- Do not claim PASS while any required screen fails the pixel gate.
- Write `docs/auto-execute/results/<TASK-ID>.json`.
- Write `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`.

## Paste-Ready Queue

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'

Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U01-current-state-intake.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U02-home-create-flow-visual-repair.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U03-result-unlock-invite-visual-repair.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U04-payment-full-result-visual-repair.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U05-share-save-error-visual-repair.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U06-all-screen-visual-convergence.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
Get-Content -Raw 'docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-tasks\U07-final-regression-and-gate.md' | codex exec -C 'D:\lyh\agent\agent-frame\AuraCue' --dangerously-bypass-approvals-and-sandbox -
```

## Worker Prompt Contract

```text
Use the auto-execute skill.

Project root: D:\lyh\agent\agent-frame\AuraCue

Execute only this task document:
<TASK_DOC_ABSOLUTE_PATH>

Before editing or testing, read:
- D:\lyh\agent\agent-frame\AuraCue\AGENTS.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\latest\unfinished-ui-one-to-one-repair-tasks.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-unfinished-ui-one-to-one-repair-master.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-unfinished-ui-one-to-one-codex-exec-prompts.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-reference-map.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\results\T33.json
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\screenshots\ui-one-to-one\T33\visual-summary.json

Rules:
- Execute only <TASK_ID>.
- Stay within allowed files.
- Repair WXML/WXSS/page renderers from the supplied UI references and Stitch HTML.
- Do not mount screenshots.
- Preserve route/API/click/owner-flow behavior.
- Run the task verification commands.
- Write result JSON and HANDOFF.
- Exit this codex exec after the task.
```
