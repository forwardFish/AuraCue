# T04 HANDOFF - Generation Job And Structured Card API

Status: PASS

## Summary
Implemented local/mock generation APIs for API-001 and API-002. The API now creates deterministic generation jobs, completes successful jobs into structured AuraCue cards, supports pending and failed job states, rejects invalid scene/energy input, and returns typed error envelopes for not-found and local fallback failures. No real AI provider calls are used.

## Changed Files
- `apps/api/src/server.mjs`
- `apps/api/src/local-repository.mjs`
- `apps/api/tests/generation-api.test.mjs`
- `apps/api/package.json`
- `packages/prompt-core/src/local-generator.mjs`
- `packages/prompt-core/src/index.ts`
- `packages/prompt-core/package.json`
- `packages/shared-types/src/index.ts`
- `docs/auto-execute/api/T04/generation-api.json`
- `docs/auto-execute/db/T04/generation-readback.json`
- `docs/auto-execute/logs/T04/generation-api-test.log`
- `docs/auto-execute/logs/T04/api-package-test.log`
- `docs/auto-execute/logs/T04/lint.log`
- `docs/auto-execute/logs/T04/typecheck.log`
- `docs/auto-execute/logs/T04/diff-check.log`
- `docs/auto-execute/logs/T04/root-test.log`
- `docs/auto-execute/results/T04.json`
- `docs/auto-execute/latest/T04-HANDOFF.md`

## What Was Implemented
- Added `POST /api/generation-jobs` with scene/energy validation, success, pending fixture support through `autoComplete:false`, and forced local failure through `forceFailure:true`.
- Added `GET /api/generation-jobs/:jobId` with success, pending, failed, and not-found responses.
- Added a deterministic prompt-core generator that returns all required structured card fields: title, auraName, tarotSymbol, message, luckyColor, colors, outfit, beauty, social, ritual, avoid, caption, and theme.
- Updated repository job completion to create generated card records from the deterministic generator and keep failed jobs from producing cards.
- Added copy-safety assertions for forbidden destiny, therapy, medical, and appearance-anxiety style claims.

## Commands Run
- `pnpm.cmd --filter @auracue/api test:generation *> docs\auto-execute\logs\T04\generation-api-test.log` - PASS.
- `pnpm.cmd --filter @auracue/api test *> docs\auto-execute\logs\T04\api-package-test.log` - PASS.
- `pnpm.cmd lint *> docs\auto-execute\logs\T04\lint.log` - PASS.
- `pnpm.cmd typecheck *> docs\auto-execute\logs\T04\typecheck.log` - PASS.
- `git diff --check *> docs\auto-execute\logs\T04\diff-check.log` - PASS.
- `pnpm.cmd test *> docs\auto-execute\logs\T04\root-test.log` - PASS.

## Evidence Paths
- `docs/auto-execute/api/T04/generation-api.json`
- `docs/auto-execute/db/T04/generation-readback.json`
- `docs/auto-execute/logs/T04/generation-api-test.log`
- `docs/auto-execute/logs/T04/api-package-test.log`
- `docs/auto-execute/logs/T04/lint.log`
- `docs/auto-execute/logs/T04/typecheck.log`
- `docs/auto-execute/logs/T04/diff-check.log`
- `docs/auto-execute/logs/T04/root-test.log`
- `docs/auto-execute/results/T04.json`

## Blockers
None.

## Limitations
- T04 does not produce visual screenshot or pixel-diff evidence because it does not implement mini-program pages.
- T04 uses deterministic local generation only. Real AI provider calls remain forbidden and unimplemented.

## Next-Step Notes
- T05 should build result and entitlement read APIs on the card IDs and structured card records created by T04.
- T11 can use `forceFailure:true` generation and the failed job readback as the UI-18 network/generation failure fixture.
- T20 should rerun API-001/API-002 cases and DB readback as part of full API/DB acceptance.
