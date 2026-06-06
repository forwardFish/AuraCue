# T13 Web Handoff

Status: `COMPLETE`

Verdict: `PASS`

Product PASS claimed: no. T13 only proves the whole-app local runtime smoke; T16 remains the final acceptance gate.

## Current State

The Web app starts locally, opens in a real headless Chrome browser through CDP, and completes:

`Mood -> Context -> Upload -> Draw -> Generate -> Result -> Activate -> Hold Seal -> Activated -> Save -> Share -> Copy -> Download -> Save to AuraCue -> Saved`

The final smoke captured all API IDs `API-001` through `API-013`, zero failed API responses, zero console events, DB readback for the runtime user/card flow, ten screenshots, and trace JSON.

## Evidence

- Start log: `docs/auto-execute/logs/web/T13-start.log`
- Browser log: `docs/auto-execute/logs/web/T13-browser.log`
- Command log: `docs/auto-execute/logs/web/T13-command-log.md`
- Validation log: `docs/auto-execute/logs/web/T13-validation-log.md`
- API transcript: `docs/auto-execute/api/web/T13/runtime-smoke-api-transcript.json`
- DB readback: `docs/auto-execute/db/web/T13/runtime-smoke-readback.json`
- Trace: `docs/auto-execute/traces/web/T13/runtime-smoke/runtime-smoke-trace.json`
- Screenshots: `docs/auto-execute/screenshots/web/T13/runtime-smoke/`
- Result JSON: `docs/auto-execute/results/web/T13.json`

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test:e2e -- web-p0-runtime-smoke
pnpm.cmd --filter @auracue/web typecheck
pnpm.cmd --filter @auracue/web lint
pnpm.cmd --filter @auracue/web test:api -- card-activation-share
pnpm.cmd --filter @auracue/web test:pages -- share-save
```

Evidence summary checks passed:

- API transcript has `API-001` through `API-013`.
- API transcript has zero response statuses >= 400.
- Trace has 10 screenshots and zero console/blocking console errors.
- DB readback has one `AnonymousUser`, `OutfitUpload`, `DrawSession`, `GenerationJob`, `AuraCard`, `AuraActivation`, and `SavedCard`, plus 4 `ShareEvent` and 15 `AnalyticsEvent` records.

## Repair Record

- Repaired the T13 harness for Windows `.cmd` startup, browser CDP startup, null-safe page readiness, enabled draw-control waits, and clean process shutdown.
- Repaired runtime product issues found by T13:
  - draw-session start is now atomic/idempotent through Prisma upsert;
  - Web P0 analytics events are accepted by the shared analytics validator;
  - share-page download avoids unhandled `local://` renderer URLs;
  - `/favicon.ico` no longer creates a 404 console event.

## T14 Input

T14 can reuse the same runtime command:

```powershell
pnpm.cmd --filter @auracue/web test:e2e -- web-p0-runtime-smoke
```

T14 should treat T13 evidence as proof that the local runtime smoke is viable, but still perform its own owner-click E2E evidence and must not claim final product PASS.

## Residual Risk

The share renderer still produces local-only renderer paths for local evidence; the T13 download action falls back to the share URL to avoid browser scheme errors. Production share image hosting remains outside T13.
