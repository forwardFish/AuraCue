# T05 Web Handoff

Status: `COMPLETE`

Verdict: `PASS_FOR_T05_SCOPE`

Product PASS claimed: no. T05 only covers API-001..004 and DB readback for identity, today active card lookup, local outfit upload records, and draw-session start.

## Current State

The Web app has DB-backed local API route handlers for:

- `POST /api/v1/identity/anonymous`
- `GET /api/v1/aura-cards/today`
- `POST /api/v1/uploads/outfit`
- `POST /api/v1/draw-sessions/start`

The implementation reuses the T04 envelope helpers and the T03 Prisma data layer. Upload handling is local metadata-only and returns `/uploads/upload_*.{jpg,png,webp}` URLs; it does not write to real object storage.

## Completed In T05

- Verified anonymous identity create/idempotent and invalid platform behavior.
- Verified today-card empty, missing-user, and active-card readback behavior.
- Verified outfit upload records for jpg/png/webp plus >8MB and bad MIME failures.
- Verified draw session start with required mood, optional context, optional upload, idempotent seed behavior, 3 cards, expiry, and upload ownership failure.
- Verified DB readback for `AnonymousUser`, `OutfitUpload`, `DrawSession`, `GenerationJob`, and `AuraCard`.
- Verified Next build compiles the four T05 route handlers.

## Evidence

- API transcript: `docs/auto-execute/evidence/web/T05/api-transcript.json`
- DB readback: `docs/auto-execute/evidence/web/T05/db-readback.json`
- Result JSON: `docs/auto-execute/results/web/T05.json`
- Command log: `docs/auto-execute/logs/web/T05-command-log.md`

Readback counts from T05 API verification:

- `AnonymousUser`: 1
- `OutfitUpload`: 3
- `DrawSession`: 2
- `GenerationJob`: 1
- `AuraCard`: 1

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test:api -- identity-upload-draw
pnpm.cmd --filter @auracue/web test:db
pnpm.cmd --filter @auracue/web typecheck
pnpm.cmd --filter @auracue/web lint
pnpm.cmd --filter @auracue/web build
```

Build evidence: Next listed all four T05 API routes as dynamic handlers.

## Repair Record

No failed T05 verification checks remained in this worker run. Existing half-finished T05 route/service/repository/test files were present and verified against the required T05 contract; no product-wide PASS was claimed.

## Next Task Input

T06 can build generation APIs on top of:

- `DrawSession.drawSeed`, `DrawSession.cardOptions`, `DrawSession.expiresAt`
- `GenerationJob @@unique([drawSessionId, drawPosition])`
- `AuraCard` write/readback fields from the T03 schema
- T05 anonymous/user validation and upload ownership conventions

T09 create-flow pages can call the local T05 routes directly for draft bootstrap, optional upload, and draw-session start.

## Residual Risks

- Runtime transcript evidence was produced by the Node API contract test with Prisma readback; the Next production build separately proves route compilation. No long-running local server transcript was kept.
- Production PostgreSQL alignment remains unresolved from T03 because this worker only had local SQLite validation.
- Upload storage is intentionally local metadata-only for P0; real cloud storage remains out of T05 scope.
