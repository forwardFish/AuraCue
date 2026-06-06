# Task T32 - Click Route Regression After Visual Repair

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T32-click-route-regression-after-visual-repair.md"
```

## Implementation Scope
Run and repair regressions caused by T26-T31 visual work. This task owns route, page simulation, owner E2E, API/DB/contract, local-only, and secret-safety verification after visual repair.

## Required Inputs
- T26-T31 result JSON and HANDOFF files.
- Current route manifests and page tests.
- Existing T19/T20/T21/T24 evidence as historical baseline only; rerun fresh checks.

## Allowed Files
- Regression fixes in `apps/wechat-mini/**`, `apps/api/**`, `packages/**`, and scripts only if caused by visual repair.
- Fresh regression logs/evidence for `T32`.
- `docs/auto-execute/results/T32.json`
- `docs/auto-execute/latest/T32-HANDOFF.md`

## Forbidden Actions
- Do not broaden scope into new product features.
- Do not weaken tests or remove click assertions.
- Do not use production services, real payment, or secrets.
- Do not mark a visual failure as functional PASS.

## Acceptance Criteria
- Route manifest still covers `UI-01` through `UI-18`.
- Page simulation/click coverage remains complete.
- Owner E2E remains complete.
- API/DB/contract evidence remains clean where scripts exist.
- Local-only and secret guard remain clean where scripts exist.
- Any regression caused by visual repair is fixed inside this task boundary.

## Verification Commands
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `node scripts/verify-wechat-routes.mjs`
- existing page simulation test commands where available
- existing owner E2E test commands where available
- existing API/DB/contract test commands where available
- existing local-only/secret/report-integrity checks where available
- `git diff --check`

## Done When
All available route/click/owner/API/contract/local-only/secret checks are PASS and documented, or the task returns `REPAIR_REQUIRED` with the exact failing command and owner.

## Result JSON
`docs/auto-execute/results/T32.json`

## HANDOFF
`docs/auto-execute/latest/T32-HANDOFF.md`

