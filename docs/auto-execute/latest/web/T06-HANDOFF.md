# T06 Web Handoff

Status: `COMPLETE`

Verdict: `PASS_FOR_T06_SCOPE`

Product PASS claimed: no. T06 only covers AI/mock provider boundaries plus generation start/job readback APIs.

## Current State

The Web app now has DB-backed local generation APIs:

- `POST /api/v1/aura-cards/generate`
- `POST /api/v1/generations/start`
- `GET /api/v1/generation-jobs/:jobId`

The contract path and alias share `GenerationService`. Without an authorized AI key, generation falls back to deterministic mock output, writes a successful `GenerationJob`, writes an `AuraCard`, stores `generationSource: "local-fallback"` and `fallbackUsed: true`, and supports idempotent `drawSessionId + drawPosition` repeats.

## Completed In T06

- Read T04/T05 result and HANDOFF, Web API/DB contract matrix, Web AI/generation spec fragments, and `packages/prompt-core`.
- Added schema normalization/validation for generation input and structured Aura Card content.
- Added deterministic mock provider plus OpenAI-compatible adapter with redacted/no-key fallback behavior.
- Added repository/service boundaries for `GenerationJob` and `AuraCard` persistence/readback.
- Added API route handlers for generate, start alias, and generation job readback.
- Added API test runner support for `pnpm.cmd --filter @auracue/web test:api -- generation`.
- Wrote T06 API transcript, mock transcript, DB readback, secret scan, result JSON, command log, and this handoff.

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test:api -- generation
node scripts/acceptance/check-web-copy-safety.mjs
pnpm.cmd --filter @auracue/web typecheck
pnpm.cmd --filter @auracue/web lint
pnpm.cmd --filter @auracue/web build
pnpm.cmd --filter @auracue/web test:api
```

Build evidence: Next listed `/api/v1/aura-cards/generate`, `/api/v1/generations/start`, and `/api/v1/generation-jobs/[jobId]` as dynamic handlers.

## Evidence Paths

- API transcript: `docs/auto-execute/evidence/web/T06/api-transcript.json`
- Mock transcript: `docs/auto-execute/evidence/web/T06/mock-transcript.json`
- DB readback: `docs/auto-execute/evidence/web/T06/db-readback.json`
- Secret scan: `docs/auto-execute/evidence/web/T06/secret-scan.json`
- Result JSON: `docs/auto-execute/results/web/T06.json`
- Command log: `docs/auto-execute/logs/web/T06-command-log.md`

## Repair Record

- Initial generation test failed because a fresh `t06-local.sqlite` had no schema. Repaired the T06 test to run local `prisma db push` before reset.
- The first repair used an unsupported Prisma `--skip-generate` option. Removed it and reran successfully.
- Initial typecheck failed on self-referential repository return types and Prisma JSON input typing. Repaired with explicit Prisma payload types and JSON input casting.
- Default `test:api` then failed because the T04 foundation test hard-coded the old script command. Repaired the assertion to accept the new API test runner and reran successfully.

## Next Task Input

T07/T09/T13 can use:

- `POST /api/v1/aura-cards/generate` or alias `POST /api/v1/generations/start`
- Request body: `anonymousId`, `platform`, `drawSessionId`, `drawPosition`, optional `locale`
- Response: `jobId`, `status`, `cardId`, `generationSource`, `fallbackUsed`, `provider`
- Poll/readback: `GET /api/v1/generation-jobs/:jobId?anonymousId=...`

## Residual Risks

- No live AI provider call was attempted. This is intentional for T06 because no key was provided and the task requires complete mock fallback.
- The OpenAI-compatible adapter is implemented but only compile-verified, not live-provider verified.
- The API transcript is a local Prisma contract test, not a long-running Next server HTTP transcript.
