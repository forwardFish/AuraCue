# AuraCue UI one-to-one repair Codex Exec 执行入口

Project root: `D:\lyh\agent\agent-frame\AuraCue`
Task dir: `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-one-to-one-repair-tasks`
Execution mode: Run T26 through T33 sequentially. Each task must run in one fresh `codex exec` worker. Do not merge tasks.

One-sentence goal:
Repair AuraCue mini-program UI so all P0 screens are WXML/WXSS code replicas from `docs/UI/小程序` screenshots plus Stitch `code.html`, with real actual PNG capture, diff PNG, metrics JSON, route/click regression evidence, and no screenshot-mounted pages.

## Global Rules
- Use the auto-execute skill.
- Read `AGENTS.md` first.
- Execute exactly one task document per worker.
- Do not start the next task from inside a worker.
- Stay inside the task allowed scope.
- Preserve route/API/click/owner-flow behavior.
- Do not use full-screen reference images as UI.
- Do not use remote CDN, remote fonts, remote images, production cloud, real payment, production DB, real analytics, real AI, or secrets.
- Do not claim pure PASS without actual PNG + diff PNG + metrics JSON for all `UI-01` through `UI-18`.
- Every task must write `docs/auto-execute/results/<TASK-ID>.json`.
- Every task must write `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`.
- After writing result JSON and HANDOFF, exit the codex exec completely.

## Paste-Ready Queue

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'

codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T26-visual-capture-pixel-diff-harness.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T27-home-create-flow-one-to-one-repair.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T28-result-unlock-invite-one-to-one-repair.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T29-payment-full-result-one-to-one-repair.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T30-share-save-error-one-to-one-repair.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T31-all-ui-raster-diff-repair-loop.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T32-click-route-regression-after-visual-repair.md'
codex exec --cd 'D:\lyh\agent\agent-frame\AuraCue' --prompt-file 'docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T33-final-ui-one-to-one-gate.md'
```

## Unified Worker Prompt Template

```text
Use the auto-execute skill.

Project root: D:\lyh\agent\agent-frame\AuraCue

Execute only this task document:
<TASK_DOC_ABSOLUTE_PATH>

Treat this as one fresh task boundary for <TASK_ID>.

Before editing or testing, read:
- D:\lyh\agent\agent-frame\AuraCue\AGENTS.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-one-to-one-repair-master.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-one-to-one-codex-exec-prompts.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-reference-map.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-final-acceptance-gate.md
- D:\lyh\agent\agent-frame\AuraCue\apps\wechat-mini\src\app.config.ts
- D:\lyh\agent\agent-frame\AuraCue\apps\wechat-mini\src\routes\p0-routes.ts
- D:\lyh\agent\agent-frame\AuraCue\apps\wechat-mini\src\routes\route-registry.mjs

Rules:
- Execute only <TASK_ID>; do not start the next task.
- Stay within the task allowed files.
- One-to-one means WXML/WXSS/page-code implementation from docs/UI/小程序 screenshots and Stitch code.html, not mounting a screenshot.
- Preserve all existing navigation, API, DB, analytics, local/mock payment, and owner-click behavior unless the task explicitly repairs a regression caused by visual changes.
- Do not use remote CDN, remote fonts, remote images, production services, real payment, real AI, or secrets.
- Do not weaken tests or visual thresholds.
- Do not claim PASS without evidence.
- At the end, write D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\results\<TASK_ID>.json.
- At the end, write D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\latest\<TASK_ID>-HANDOFF.md.
- Include changed files, commands run, evidence paths, blockers, and next-step notes in the HANDOFF.
- After writing result JSON and HANDOFF, exit this codex exec completely.
```

