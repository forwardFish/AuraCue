# AuraCue H5/Web Functional Implementation Report

Date: 2026-06-19

## Verdict

Functional implementation: PASS.

Pixel one-to-one visual parity: REPAIR_REQUIRED.

The latest H5/Web flow no longer renders full-page reference images. The current pages are real React/DOM UI with state, selection, localStorage persistence, timed reading, hold-to-seal, share/save feedback, My Aura history, legal pages, and browser-tested navigation.

## What Changed

- Removed the full-screen `aura-references` image overlay path from `apps/web/components/latest-ui-pages.tsx`.
- Removed `.latest-reference-replica*` CSS and deleted `apps/web/public/aura-references`.
- Rebuilt the latest P0 routes as functional UI:
  - birthday month/day selectors
  - Birth Aura reveal based on selected birthday
  - mood and scene required selections
  - three-card tarot selection
  - timed reading state
  - result generated from birthday, mood, scene, and selected card
  - 2-second hold-to-seal
  - activated, share, save, My Aura, Birth Aura profile
  - `/legal/privacy` and `/legal/terms`
- Updated page tests to fail if `aura-references`, `latest-reference-replica`, or `replicaPages` return.
- Updated browser E2E to wait for React hydration and exercise real interactions, not transparent hotspots.

## Functional Coverage

| ID | Route | Status |
| --- | --- | --- |
| P0-00 | `/` | Implemented via latest Home entry |
| P0-01 | `/home` | Implemented and tested |
| P0-02 | `/onboarding/birth-aura` | Implemented and tested with month/day change |
| P0-03 | `/onboarding/birth-aura/reveal` | Implemented and tested |
| P0-04 | `/today/check-in` | Implemented and tested with mood + scene required |
| P0-05 | `/today/draw` | Implemented and tested with card selection required |
| P0-06 | `/today/reading` | Implemented and tested with timed reading |
| P0-07 | `/result/[id]` | Implemented and tested |
| P0-08 | `/activate/[id]` | Implemented and tested with 2250ms hold |
| P0-09 | `/activated/[id]` | Implemented and tested |
| P0-10 | `/share/[id]` | Implemented and tested |
| P0-11 | `/saved/[id]` | Implemented and tested |
| P0-12 | `/my` | Implemented and tested |
| P0-13 | `/my/birth-aura` | Implemented and tested |
| P0-14 | `/legal/privacy` | Implemented and tested |
| P0-15 | `/legal/terms` | Implemented and tested |
| P0-16 | `/error/network` | Implemented and tested |

## Evidence

- Browser full-flow trace: `docs/auto-execute/traces/web/T13/runtime-smoke/runtime-smoke-trace.json`
- Browser screenshots: `docs/auto-execute/screenshots/web/T13/runtime-smoke/`
- Page functional contracts: `docs/auto-execute/evidence/web/latest-ui-code/`
- Visual comparison summary: `docs/auto-execute/screenshots/web/T15/visual-summary.json`

## Verification Run

- `pnpm --filter @auracue/web test` PASS
- `pnpm --filter @auracue/web test:pages` PASS
- `pnpm --filter @auracue/web lint` PASS
- `pnpm --filter @auracue/web typecheck` PASS
- `pnpm --filter @auracue/web build` PASS
- `pnpm --filter @auracue/web test:api` PASS
- `T13_WEB_PORT=3215 T13_CDP_PORT=9325 DATABASE_URL=file:D:/lyh/agent/agent-frame/AuraCue/apps/web/t13-functional-runtime.sqlite pnpm --filter @auracue/web test:e2e` PASS
- `pnpm --filter @auracue/web test:visual` completed with `REPAIR_REQUIRED`

## Visual Parity Result

The functional pages are not pixel one-to-one yet. T15 compared 13 screens and all 13 exceeded the 0.05 normalized diff threshold.

Worst current diffs:

- P0-01 Home: `0.645151`
- P0-09 Activated: `0.572361`
- P0-10 Share: `0.541588`
- P0-16 Error: `0.496318`
- P0-04 Check-in: `0.435990`

This is now an honest state: real UI works, but visual tuning still needs another pass.

## Missing / Not Fully Drawn From References

- P0-06B exists in `docs/UI/...` as a second Reading reference, but the current visual comparison only covers P0-06A.
- P0-11 Saved is implemented and tested, but the current latest reference set under `docs/UI/...` does not include a top-level P0-11 image; only an older backup Saved reference exists.
- P0-14 Privacy and P0-15 Terms are implemented and tested from requirements, but no matching P0-14/P0-15 raster references were found in the current top-level `docs/UI/...` set.

## Next Repair Pass

1. Tune layout/spacing/typography/colors screen by screen against T15 diff images.
2. Add current references for P0-11, P0-14, and P0-15 if exact visual parity is required.
3. Add P0-06B to visual comparison if the full reading-progress state must be separately validated.
4. Rerun `test:e2e` and `test:visual` after each visual repair loop.
