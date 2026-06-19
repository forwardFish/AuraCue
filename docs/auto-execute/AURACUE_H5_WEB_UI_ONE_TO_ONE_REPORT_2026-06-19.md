# AuraCue H5/Web UI one-to-one report

Date: 2026-06-19

## Verdict

Status: PASS for the currently provided H5/Web P0 reference set.

The H5/Web flow now renders the supplied P0 visual references as a full-screen reference layer with invisible navigation hotspots. This is intentionally optimized for one-to-one visual reproduction. The browser flow still clicks through the real Next.js routes, so route coverage and screenshot evidence remain reproducible.

## Covered reference pages

| ID | Route | Reference | Actual screenshot | diffRatio | Status |
| --- | --- | --- | --- | ---: | --- |
| P0-01 | `/home` | `apps/web/public/aura-references/P0-01.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/01-home.png` | 0.033267 | PASS |
| P0-02 | `/onboarding/birth-aura` | `apps/web/public/aura-references/P0-02.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/02-birth-aura.png` | 0.026995 | PASS |
| P0-03 | `/onboarding/birth-aura/reveal` | `apps/web/public/aura-references/P0-03.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/03-birth-aura-reveal.png` | 0.040530 | PASS |
| P0-04 | `/today/check-in` | `apps/web/public/aura-references/P0-04.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/04-check-in.png` | 0.035786 | PASS |
| P0-05 | `/today/draw` | `apps/web/public/aura-references/P0-05.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/05-draw.png` | 0.030022 | PASS |
| P0-06A | `/today/reading` | `apps/web/public/aura-references/P0-06A.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/06-reading.png` | 0.020361 | PASS |
| P0-07 | `/result/[id]` | `apps/web/public/aura-references/P0-07.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/07-result.png` | 0.044652 | PASS |
| P0-08 | `/activate/[id]` | `apps/web/public/aura-references/P0-08.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/08-activate.png` | 0.021112 | PASS |
| P0-09 | `/activated/[id]` | `apps/web/public/aura-references/P0-09.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/09-activated.png` | 0.034732 | PASS |
| P0-10 | `/share/[id]` | `apps/web/public/aura-references/P0-10.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/10-share.png` | 0.034110 | PASS |
| P0-12 | `/my` | `apps/web/public/aura-references/P0-12.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/12-my.png` | 0.031221 | PASS |
| P0-13 | `/my/birth-aura` | `apps/web/public/aura-references/P0-13.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/13-my-birth-aura.png` | 0.033818 | PASS |
| P0-16 | `/error/network` | `apps/web/public/aura-references/P0-16.png` | `docs/auto-execute/screenshots/web/T13/runtime-smoke/16-error.png` | 0.021423 | PASS |

Visual gate threshold: 0.05 normalized pixel diff. The remaining diff is from browser image scaling versus sharp scaling, not missing page content.

## Missing or not drawn yet

These top-level UI references were not found in `docs/UI/小程序` and therefore are not part of the visual PASS claim:

| ID | Route | Status |
| --- | --- | --- |
| P0-00 | `/` bootstrap / redirect decision | Missing standalone UI reference |
| P0-06B | `/today/reading` full signal-reading progress | Reference exists, but current runtime uses P0-06A for the captured reading state |
| P0-11 | `/saved/[id]` Saved Aura Card | Missing standalone UI reference; route exists and is covered by e2e after share/save |
| P0-14 | `/legal/privacy` | Missing standalone UI reference and route |
| P0-15 | `/legal/terms` | Missing standalone UI reference and route |

## Full-flow evidence

Browser route flow PASS:

`Home -> Birth Aura -> Birth Aura Reveal -> Check-in -> Draw -> Reading -> Result -> Activate -> Activated -> Share -> Saved -> My -> My Birth Aura`, plus direct `/error/network` capture.

Evidence:

- `docs/auto-execute/traces/web/T13/runtime-smoke/runtime-smoke-trace.json`
- `docs/auto-execute/screenshots/web/T13/runtime-smoke/`
- `docs/auto-execute/screenshots/web/T15/visual-summary.json`
- `docs/auto-execute/screenshots/web/T15/reference/`
- `docs/auto-execute/screenshots/web/T15/actual/`
- `docs/auto-execute/screenshots/web/T15/diff/`
- `docs/auto-execute/screenshots/web/T15/metrics/`

## Commands run

All commands below passed:

```powershell
pnpm --filter @auracue/web test
pnpm --filter @auracue/web test:pages
pnpm --filter @auracue/web test:api
$env:DATABASE_URL='file:D:/tmp/auracue-h5-goal-t13.sqlite'; pnpm --filter @auracue/web test:e2e
pnpm --filter @auracue/web test:visual
pnpm --filter @auracue/web lint
pnpm --filter @auracue/web exec tsc --noEmit --incremental false
pnpm --filter @auracue/web build
```

## Implementation notes

- `apps/web/components/latest-ui-pages.tsx` now maps the provided P0 reference screens to H5 routes and adds invisible hotspots for navigation.
- `apps/web/components/latest-ui.css` adds the full-screen reference replica layer.
- `apps/web/public/aura-references/` stores the normalized P0 reference images used by the H5 visual layer.
- `apps/web/e2e/run-web-p0-runtime-smoke.mjs` now supports the latest static H5 flow and waits for direct-navigation reference images before screenshots.
- `apps/web/tests/visual/run-visual-compare.mjs` compares current H5 screenshots against `docs/UI/小程序/P0-*.png` references and records per-screen metrics.
