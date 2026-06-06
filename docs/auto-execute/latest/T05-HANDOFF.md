# T05 HANDOFF - Card Result And Entitlement Read APIs

Status: PASS

## Summary
Implemented API-003 card result reads for free preview, locked full result, unlocked full result, and not-found. Full result content is serialized only after backend entitlement readback. Free and locked responses do not expose complete card content.

## Changed Files
- `apps/api/src/server.mjs`
- `apps/api/tests/card-result-api.test.mjs`
- `apps/api/package.json`
- `packages/shared-types/src/index.ts`
- `docs/auto-execute/api/T05/card-api.json`
- `docs/auto-execute/db/T05/card-readback.json`
- `docs/auto-execute/logs/T05/card-api-test.log`
- `docs/auto-execute/logs/T05/api-package-test.log`
- `docs/auto-execute/logs/T05/lint.log`
- `docs/auto-execute/logs/T05/typecheck.log`
- `docs/auto-execute/logs/T05/root-test.log`
- `docs/auto-execute/logs/T05/diff-check.log`
- `docs/auto-execute/results/T05.json`
- `docs/auto-execute/latest/T05-HANDOFF.md`

## What Was Implemented
- Added `GET /api/cards/:cardId?view=free` with only preview-safe fields: aura name, lucky color, one-line reminder, low-res/watermarked preview metadata, and locked preview markers.
- Added `GET /api/cards/:cardId?view=full` with entitlement-gated complete structured card fields.
- Added safe typed error envelopes for locked full reads, missing cards, and invalid `view` values.
- Added shared DTO types for free and full card result responses.
- Added focused API-003 tests that assert free/locked responses do not leak full locked content.

## Commands Run
- `pnpm.cmd --filter @auracue/api test:card *> docs\auto-execute\logs\T05\card-api-test.log` - PASS.
- `pnpm.cmd --filter @auracue/api test *> docs\auto-execute\logs\T05\api-package-test.log` - PASS.
- `pnpm.cmd lint *> docs\auto-execute\logs\T05\lint.log` - PASS.
- `pnpm.cmd typecheck *> docs\auto-execute\logs\T05\typecheck.log` - PASS.
- `pnpm.cmd test *> docs\auto-execute\logs\T05\root-test.log` - PASS.
- `git diff --check *> docs\auto-execute\logs\T05\diff-check.log` - PASS.

## Evidence Paths
- `docs/auto-execute/api/T05/card-api.json`
- `docs/auto-execute/db/T05/card-readback.json`
- `docs/auto-execute/logs/T05/card-api-test.log`
- `docs/auto-execute/logs/T05/api-package-test.log`
- `docs/auto-execute/logs/T05/lint.log`
- `docs/auto-execute/logs/T05/typecheck.log`
- `docs/auto-execute/logs/T05/root-test.log`
- `docs/auto-execute/logs/T05/diff-check.log`
- `docs/auto-execute/results/T05.json`

## Blockers
None.

## Limitations
- T05 is backend/API/shared-types scope only and does not implement mini-program pages or visual screenshot/diff evidence.
- Entitlement is local/mock repository readback only. No real WeChat Pay, cloud writes, production DB, production AI, production analytics, or secrets were used.

## Next-Step Notes
- T06 can add local mock unlock/payment/invite write APIs using the existing `unlockCard`, payment, invite, and entitlement repository methods.
- T12 should consume the free preview shape for UI-06.
- T15 should consume the full result shape for UI-14 after entitlement exists.
- T20 should rerun API-003 C01-C04 and DB readback as part of the full API/DB acceptance gate.
