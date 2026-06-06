# T14 Web Handoff

Status: `COMPLETE`

Verdict: `PASS_FOR_T14_SCOPE`

Product PASS claimed: no. T14 proves owner-click E2E scenarios only; T16 owns final acceptance.

## Current State

The Web app starts locally at `http://127.0.0.1:3214`, opens in headless Chrome through CDP, and completes T14 owner scenarios:

- Owner-001 and Owner-002: first-run/skip-upload click flow through mood, context, upload skip, draw, generation, and result.
- Owner-003: visible upload failure UI plus intentional `API-003` oversized upload `413 FILE_TOO_LARGE`, then skip recovery to result.
- Owner-004: activation start, 1000ms hold cancel that stays on `/activate/[id]`, then 3250ms hold seal to `/activated/[id]`.
- Owner-005: activated save/share, share copy, save image/download path, save to AuraCue, saved copy.
- Owner-006: home revisit displays `Today's Aura Active` and opens the activated card.

## Evidence

- API transcript: `docs/auto-execute/api/web/T14/runtime-smoke-api-transcript.json`
- DB readback: `docs/auto-execute/db/web/T14/runtime-smoke-readback.json`
- Trace: `docs/auto-execute/traces/web/T14/owner-click-e2e/runtime-smoke-trace.json`
- Screenshots: `docs/auto-execute/screenshots/web/T14/owner-click-e2e/`
- Start log: `docs/auto-execute/logs/web/T14-start.log`
- Browser log: `docs/auto-execute/logs/web/T14-browser.log`
- Command log: `docs/auto-execute/logs/web/T14-command-log.md`
- Result JSON: `docs/auto-execute/results/web/T14.json`

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test:e2e -- owner-click-e2e
pnpm.cmd --filter @auracue/web test:e2e
pnpm.cmd --filter @auracue/web lint
pnpm.cmd --filter @auracue/web typecheck
node -e parse docs/auto-execute/results/web/T14.json and verify T14 HANDOFF/log/evidence paths exist
```

Evidence summary:

- Trace verdict is `PASS`.
- Owner IDs covered: `Owner-001` through `Owner-006`.
- API IDs covered: `API-001` through `API-013`.
- The only HTTP failure is the intentional Owner-003 upload failure: `API-003` returned `413 FILE_TOO_LARGE`.
- DB readback: `AnonymousUser=1`, `DrawSession=2`, `GenerationJob=2`, `AuraCard=2`, `AuraActivation=1`, `SavedCard=1`, `ShareEvent=4`, `AnalyticsEvent=25`.
- Screenshots captured: 12.
- Unexpected blocking console errors: 0.
- T14 result JSON parsed successfully, and the required handoff, command log, API transcript, DB readback, trace, and screenshot paths exist.

## Repair Record

- Added T14 owner-click mode to the existing E2E harness so it writes T14 evidence paths and keeps T13 default mode intact.
- Repaired harness timing around home-page bootstrap and mood/CTA readiness.
- Fixed a syntax typo in the new selected-mood wait helper.
- Classified the expected oversized-upload `413` console event as non-blocking while preserving the API failure transcript.
- Reran T14 E2E until clean, then reran the literal default `test:e2e`, lint, and typecheck.

## Next Task Input

T15 can use:

- `docs/auto-execute/screenshots/web/T14/owner-click-e2e/`
- `docs/auto-execute/traces/web/T14/owner-click-e2e/runtime-smoke-trace.json`
- `docs/auto-execute/api/web/T14/runtime-smoke-api-transcript.json`
- `docs/auto-execute/db/web/T14/runtime-smoke-readback.json`

## Residual Risks

- T14 does not perform visual diff or final gate acceptance.
- Upload success with persisted `OutfitUpload` remains covered by T13/T05; T14 specifically proves skip and failure recovery, so `OutfitUpload=0` is expected in T14 DB readback.
- Final product PASS remains blocked until T16 reads all durable evidence.
