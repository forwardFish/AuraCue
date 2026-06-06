# T03 Web Handoff

Status: `COMPLETE`

Verdict: `PASS`

Product PASS claimed: no. T03 only implemented and verified the Web P0 data model, seed, local DB strategy, and readback tests.

## Current State

`apps/web` now has a Prisma 7 data layer for the Web P0 model set:

- `AnonymousUser`
- `OutfitUpload`
- `DrawSession`
- `GenerationJob`
- `AuraCard`
- `AuraActivation`
- `SavedCard`
- `ShareEvent`
- `AnalyticsEvent`
- `CardTemplate`

The schema includes idempotency keys for:

- draw: `DrawSession @@unique([userId, drawSeed])`
- generate: `GenerationJob @@unique([drawSessionId, drawPosition])`
- save: `SavedCard @@unique([userId, cardId])`
- seal: `AuraActivation @@unique([cardId, userId, anchorType, anchorLabel])`

## Completed In T03

- Added `apps/web/prisma/schema.prisma`.
- Added initial migration at `apps/web/prisma/migrations/20260604010930_init/migration.sql`.
- Added Prisma 7 config at `apps/web/prisma.config.ts`.
- Added idempotent seed at `apps/web/prisma/seed.mjs`.
- Added Prisma repository helpers under `apps/web/server/repositories/`.
- Added P0 DB readback test at `apps/web/tests/db-readback.test.mjs`.
- Added Web package scripts: `prisma`, `db:push`, `db:seed`, `test:db`.
- Added Prisma 7 SQLite adapter dependencies: `@prisma/adapter-better-sqlite3`, `better-sqlite3`.
- Ignored generated local SQLite files in `.gitignore`.

## Local DB Strategy

Production target remains PostgreSQL + Prisma per spec.

T03 validation used local SQLite through Prisma 7 because no local Postgres service/credentials were available and the task allowed a safe local DB substitute. The validation DB URL was:

```powershell
$env:DATABASE_URL='file:./t03-local.sqlite'
```

Generated SQLite files are ignored. Durable DB proof is stored as JSON:

- `docs/auto-execute/evidence/web/T03/db-readback.json`

## Repair Record

- Prisma 7 rejected `url = env("DATABASE_URL")` inside `schema.prisma`; fixed by moving datasource URL to `apps/web/prisma.config.ts`.
- Prisma 7 no longer accepts the old global `--schema` CLI style; fixed package scripts to call Prisma commands through config.
- Prisma Client 7 required an adapter; installed and wired `@prisma/adapter-better-sqlite3`.
- `better-sqlite3` native binding initially failed because node-gyp/prebuild tried to write sandbox-denied user cache paths; fixed by running the install script with workspace-local cache/devdir under `.pnpm-store/native-cache`.
- `.mjs` seed/readback imports initially failed against CJS `@prisma/client`; fixed by default import plus destructuring.

## Verification

Passed:

```powershell
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web prisma generate
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web prisma db push
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web prisma db seed
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web prisma migrate dev --name init --create-only
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web test:db
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web typecheck
pnpm.cmd --config.store-dir=.pnpm-store --filter @auracue/web lint
git diff --check
```

Final readback counts:

- `AnonymousUser`: 1
- `OutfitUpload`: 1
- `DrawSession`: 1
- `GenerationJob`: 1
- `AuraCard`: 1
- `AuraActivation`: 1
- `SavedCard`: 1
- `ShareEvent`: 1
- `AnalyticsEvent`: 3
- `CardTemplate`: 3

## Evidence Paths

- Result JSON: `docs/auto-execute/results/web/T03.json`
- Handoff: `docs/auto-execute/latest/web/T03-HANDOFF.md`
- Command log: `docs/auto-execute/logs/web/T03-command-log.md`
- DB readback JSON: `docs/auto-execute/evidence/web/T03/db-readback.json`
- Schema: `apps/web/prisma/schema.prisma`
- Migration: `apps/web/prisma/migrations/20260604010930_init/migration.sql`
- Seed: `apps/web/prisma/seed.mjs`
- DB test: `apps/web/tests/db-readback.test.mjs`

## Next Task Input

T04-T07 can use the Prisma schema, client helper, seed fixtures, and readback test pattern to implement `/api/v1/*`.

Preserve T03 boundaries:

- Do not treat the SQLite validation DB as production Postgres proof.
- Keep generated `*.sqlite` files out of source control.
- Do not reintroduce the old `apps/api/src/local-repository.mjs` as final DB proof.
- T03 did not implement API routes, page UX, payments, invite unlock, or later task behavior.

## Residual Risks

- PostgreSQL migration was not executed because no local Postgres service/credentials were available in this worker surface.
- Prisma 7 local SQLite requires the `better-sqlite3` native binding; clean installs may need the same workspace-local cache/devdir rebuild step captured in the command log.
