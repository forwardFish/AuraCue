# T04 Web Handoff

Status: `COMPLETE`

Verdict: `PASS`

Product PASS claimed: no. T04 only implemented the API foundation, health Route Handler, local-only guard, redaction, and foundation tests. Final product acceptance remains T16.

## Current State

`apps/web` now has a reusable `/api/v1` backend foundation:

- `apps/web/server/api/envelope.ts` provides request context, success envelope, error envelope, and JSON body parsing helpers.
- `apps/web/server/api/redaction.ts` redacts secret-like keys/values and exposes a redacted environment snapshot.
- `apps/web/server/api/local-guard.ts` provides a local-only boundary for diagnostic/local adapter routes.
- `apps/web/server/config/env.ts` centralizes local-first API mode and service labels.
- `apps/web/app/api/v1/health/route.ts` exposes `GET /api/v1/health`.
- `apps/web/tests/api/foundation.test.mjs` verifies the foundation and writes health evidence.
- `scripts/acceptance/check-web-copy-safety.mjs` scans the Web API/server/test API surface for secret-like literals and forbidden Web P0 copy.

## Completed In T04

- Read all required AGENTS, execution, master-plan, split-prompt, T04 task, and T01-T03 handoff/result files.
- Inspected the T03 Prisma repository/readback helpers and schema.
- Inspected the legacy `apps/api/src/server.mjs` for reusable envelope/health/local-only ideas without reusing legacy non-v1 routes or paywall/payment/invite semantics.
- Added reusable T04 API helpers and `GET /api/v1/health`.
- Added `test:api` to `apps/web/package.json` so the required T04 verification command is runnable.
- Added the T04 copy-safety checker.
- Wrote:
  - `docs/auto-execute/results/web/T04.json`
  - `docs/auto-execute/latest/web/T04-HANDOFF.md`
  - `docs/auto-execute/logs/web/T04-command-log.md`

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test:api
node scripts/acceptance/check-web-copy-safety.mjs
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web typecheck
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web lint
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web build
```

Build evidence: Next compiled `ƒ /api/v1/health` as a dynamic Route Handler.

## Evidence Paths

- Result JSON: `docs/auto-execute/results/web/T04.json`
- Handoff: `docs/auto-execute/latest/web/T04-HANDOFF.md`
- Command log: `docs/auto-execute/logs/web/T04-command-log.md`
- Health response evidence: `docs/auto-execute/evidence/web/T04/health-response.json`
- Copy-safety evidence: `docs/auto-execute/evidence/web/T04/copy-safety.json`
- Health route: `apps/web/app/api/v1/health/route.ts`
- API foundation helpers: `apps/web/server/api/`

## Repair Record

No failed T04 verification checks remained. The only scope expansion was adding `apps/web/package.json` script `test:api`, required to run the task's mandated command.

## Next Task Input

T05-T07 can implement the domain APIs under `apps/web/app/api/v1/**` using:

- `createRequestContext`, `jsonOk`, `jsonError`, and `readJsonBody` from `apps/web/server/api/envelope.ts`
- `redactSecretLikeValues` and `redactedEnvSnapshot` from `apps/web/server/api/redaction.ts`
- `requireLocalOnly` from `apps/web/server/api/local-guard.ts` where local-only diagnostics/adapters are exposed
- T03 Prisma helpers and schema for DB-backed behavior

Do not replace the T04 helpers with per-endpoint custom envelopes. Do not add paywall, real payment, WeChat Pay, invite unlock, or legacy non-v1 route semantics.

## Residual Risks

- T04 health evidence is foundation/compile/static-contract evidence, not full API runtime transcript evidence.
- Domain routes are still intentionally unimplemented and remain T05-T07 scope.
- Production PostgreSQL alignment remains unresolved from T03; T04 preserved the local SQLite validation baseline.
