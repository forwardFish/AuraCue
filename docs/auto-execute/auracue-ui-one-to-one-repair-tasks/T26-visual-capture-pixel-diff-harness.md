# Task T26 - Visual Capture Pixel Diff Harness

## Codex Exec
```powershell
Set-Location -LiteralPath "D:\lyh\agent\agent-frame\AuraCue"
codex exec --cd "D:\lyh\agent\agent-frame\AuraCue" --prompt-file "docs\auto-execute\auracue-ui-one-to-one-repair-tasks\T26-visual-capture-pixel-diff-harness.md"
```

## Implementation Scope
Build or repair the local visual harness so it creates real actual PNG screenshots, diff PNGs, and metrics JSON for `UI-01` through `UI-18` at `941x1672`.

## Required Inputs
- `docs/auto-execute/auracue-ui-one-to-one-repair-master.md`
- `docs/auto-execute/auracue-ui-reference-map.md`
- `docs/UI/小程序/*.png`
- `docs/UI/小程序/stitch_codex_ui_code_generator/*/code.html`
- current T22/T23 summaries and page code under `apps/wechat-mini/src/pages/**`

## Allowed Files
- `package.json`, lockfile, and workspace manifests only for local dev/test dependencies required for capture/diff.
- `scripts/**` visual harness files.
- `docs/auto-execute/screenshots/ui-one-to-one/T26/**`
- `docs/auto-execute/logs/T26/**`
- `docs/auto-execute/results/T26.json`
- `docs/auto-execute/latest/T26-HANDOFF.md`

## Forbidden Actions
- Do not edit WXML/WXSS/page behavior in T26 except minimal harness-only adapters.
- Do not mount reference screenshots as UI.
- Do not use remote browser services, remote images, CDN fonts, production services, or secrets.
- Do not treat HTML-only structural evidence as visual PASS.

## Acceptance Criteria
- Playwright or an equivalent local browser path is installed/configured and documented.
- Pixel comparison uses local `pixelmatch`/`pngjs` or an equivalent deterministic local PNG diff.
- Every `UI-01` through `UI-18` has actual PNG, diff PNG, and metrics JSON under `docs/auto-execute/screenshots/ui-one-to-one/T26/`.
- The visual summary records `diffRatio`, viewport, reference path, actual path, diff path, threshold status, missing core text/control checks, and final screen verdict.
- If native WeChat mini-program capture is unavailable, the worker builds an equivalent local DOM rendering path from current page view models/WXML/WXSS and records that fallback honestly.

## Verification Commands
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `node scripts/verify-wechat-routes.mjs`
- visual harness full run created by this task
- `git diff --check`

## Done When
`docs/auto-execute/screenshots/ui-one-to-one/T26/visual-summary.json` exists and all 18 screens have actual PNG + diff PNG + metrics JSON, or the task returns `BLOCKED_BY_ENVIRONMENT` with the failed local capture commands and recovery instructions.

## Result JSON
`docs/auto-execute/results/T26.json`

## HANDOFF
`docs/auto-execute/latest/T26-HANDOFF.md`

## Failure Statuses
| Status | When To Use |
| --- | --- |
| PASS | all 18 screenshots/diffs/metrics exist and the harness is reusable by later tasks |
| REPAIR_REQUIRED | harness runs but screen output or metrics are incomplete |
| BLOCKED_BY_ENVIRONMENT | browser/capture dependencies cannot run locally after safe alternatives |

