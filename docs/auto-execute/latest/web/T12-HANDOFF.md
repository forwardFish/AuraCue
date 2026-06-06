# T12 Web Handoff

Status: `COMPLETE`

Verdict: `PASS_FOR_T12_SCOPE`

Product PASS claimed: no. T12 only proves API-001..API-013 contract coverage and DB readback evidence. T16 owns final acceptance.

## Completed

- Repaired `apps/web/tests/api/run-api-tests.mjs` so the default `test:api` command runs foundation, identity/upload/draw, generation, and card/activation/share suites.
- Added `scripts/acceptance/check-web-api-contract.mjs`.
- Generated T12-specific API transcript summary at `docs/auto-execute/api/web/T12/api-transcript.json`.
- Generated T12-specific matrix summary at `docs/auto-execute/api/web/T12/matrix-summary.json`.
- Generated T12-specific DB readback summary at `docs/auto-execute/db/web/T12/db-readback.json`.
- Wrote result JSON at `docs/auto-execute/results/web/T12.json`.
- Wrote command log at `docs/auto-execute/logs/web/T12-command-log.md`.

## Verification

Passed in the final rerun:

```powershell
pnpm.cmd --filter @auracue/web test:api
pnpm.cmd --filter @auracue/web test:db
node scripts/acceptance/check-web-api-contract.mjs
```

The checker verdict is `PASS` and covers `API-001` through `API-013`. Negative cases have explicit `error.code` values, mutation APIs have DB readback mapping, the T06 mock fallback evidence proves no AI key was used, and the T07 render proof remains `1080x1920`.

## Repair Record

- First `pnpm` attempt failed because PowerShell blocked `pnpm.ps1`; reran with `pnpm.cmd`.
- `test:api` originally ran only foundation by default; repaired to run all suites.
- T12 checker was missing; added it and reran.
- Initial checker expected API-010 case name `idempotent`; existing T07 transcript uses `idempotent repeat`, so the checker now matches the durable evidence while still requiring the repeat case.

## Next Task Input

T13 can proceed with whole-app runtime smoke using:

- API proof: `docs/auto-execute/api/web/T12/api-transcript.json`
- DB proof: `docs/auto-execute/db/web/T12/db-readback.json`
- Matrix summary: `docs/auto-execute/api/web/T12/matrix-summary.json`
- Command log: `docs/auto-execute/logs/web/T12-command-log.md`

## Residual Risks

- T12 uses local Prisma/SQLite test evidence and aggregated API contract transcripts, not a long-running browser/server runtime transcript.
- Whole-app startup, page clicks, live API transcript capture, browser trace, screenshot evidence, and runtime DB readback remain T13/T14/T15 scope.
