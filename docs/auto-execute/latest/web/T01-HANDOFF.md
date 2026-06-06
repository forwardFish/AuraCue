# T01 Web Handoff

Status: `COMPLETE`

Verdict: `PASS`

Product PASS claimed: no. T01 was source-lock/intake only and did not implement product code, start services, click pages, run API transcripts, or produce screenshots.

## Current State

Web/H5 remains locked as the main product, main engineering project, and main acceptance surface. The mini-program is a later validation entry and must call the same unified API after Web is complete.

This rerun refreshed the stale source inventory after T02/T03 repairs:

- `apps/web` now exists.
- The nine required Web P0 route page files now exist under `apps/web/app`.
- `apps/web/package.json` now exists with Next.js, React, Prisma, lint, build, test, and typecheck scripts.
- `apps/web/prisma/schema.prisma` now exists with the required ten P0 model names.
- `apps/web/tests/smoke-routes.test.mjs` and `apps/web/tests/db-readback.test.mjs` now exist.
- `apps/web/app/api/v1` is still missing; no unified API route handlers were found.
- Root `prisma/schema.prisma` is still missing, and the current app-local Prisma datasource is SQLite while the Web-first spec names PostgreSQL + Prisma as the production source of truth.

## Completed In T01

- Read the rerun prompt, top-level `AGENTS.md`, execution prompt index, and T01 task spec.
- Read or searched the required source docs:
  - `docs/AuraCue_Web_First_Full_Development_Spec_v1.0.md`
  - `docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`
  - `docs/UI/小程序/README.md`
- Inventoried current assets:
  - `apps/web`
  - `apps/api`
  - `apps/wechat-mini`
  - `packages/analytics-events`
  - `packages/card-renderer`
  - `packages/prompt-core`
  - `packages/shared-types`
  - `packages/ui-tokens`
- Confirmed downstream gaps:
  - `apps/web/app/api/v1`
  - root `prisma/schema.prisma`
  - real Web P0 page implementations beyond route placeholders
  - final API/DB/E2E/visual acceptance gates
- Wrote:
  - `docs/auto-execute/results/web/T01.json`
  - `docs/auto-execute/latest/web/T01-HANDOFF.md`
  - `docs/auto-execute/logs/web/T01-intake-command-log.md`

## Locked Inputs For Later Tasks

Required Web routes:

- `/`
- `/create/context`
- `/create/upload`
- `/create/draw`
- `/result/[id]`
- `/activate/[id]`
- `/activated/[id]`
- `/share/[id]`
- `/saved/[id]`

Current route status: all nine required route page files are present under `apps/web/app`, but they are scaffold placeholders.

Required API contracts:

- `POST /api/v1/identity/anonymous`
- `GET /api/v1/aura-cards/today`
- `POST /api/v1/uploads/outfit`
- `POST /api/v1/draw-sessions/start`
- `POST /api/v1/aura-cards/generate`
- `GET /api/v1/generation-jobs/:jobId`
- `GET /api/v1/aura-cards/:cardId`
- `POST /api/v1/aura-cards/:cardId/render`
- `POST /api/v1/aura-cards/:cardId/activation/start`
- `POST /api/v1/activations/:activationId/seal`
- `POST /api/v1/aura-cards/:cardId/save`
- `POST /api/v1/aura-cards/:cardId/share`
- `POST /api/v1/analytics/events`

Current API status: no `/api/v1/*` route handlers were found in `apps/web`.

Required DB models:

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

Current DB status: all ten model names exist in `apps/web/prisma/schema.prisma`; production alignment remains pending because the current datasource is SQLite and the root `prisma/schema.prisma` path is absent.

## Legacy Boundaries

Reusable from `apps/api`:

- local mock server/testing discipline
- AI fallback idea
- deterministic local repository/readback concepts
- local health/evidence pattern

Do not reuse as Web P0 semantics:

- `/api/generation-jobs` instead of `/api/v1/*`
- `/api/cards/:id/unlock/mock`
- `/api/payment-orders/mock`
- `/api/invites/:cardId/events`
- paywall, payment, restore, or invite unlock as the main product flow

Reusable from `apps/wechat-mini`:

- page/state inventory
- storage/upload/share/save-image adapter concepts
- P0 reference mapping

Do not use it as the primary Web implementation source. Web must be built first, then mini-program can adapt to the unified API.

## Evidence Paths

- Result JSON: `docs/auto-execute/results/web/T01.json`
- Handoff: `docs/auto-execute/latest/web/T01-HANDOFF.md`
- Command log: `docs/auto-execute/logs/web/T01-intake-command-log.md`
- Current Web scaffold: `apps/web`
- Current app-local Prisma schema: `apps/web/prisma/schema.prisma`
- Current route placeholder test: `apps/web/tests/smoke-routes.test.mjs`
- Current DB readback test: `apps/web/tests/db-readback.test.mjs`

## Command Evidence Summary

Minimum required validation was run:

- `Get-ChildItem -LiteralPath docs -File`
- `Get-ChildItem -LiteralPath apps -Directory`
- `rg -n "apps/web|/api/v1|Web/H5|P0" docs/AuraCue_Web_First_Full_Development_Spec_v1.0.md`

Additional intake checks confirmed:

- `apps/web` exists.
- All nine required Web P0 route page files exist.
- `apps/web/app/api/v1` route handlers are missing.
- `apps/web/prisma/schema.prisma` exists and includes the ten required model names.
- Root `prisma/schema.prisma` is missing.
- `docs/UI/小程序/README.md` demotes legacy unlock/payment/invite/profile/trend/P1 references from P0.

## Next Task Input

Resume at the unified Web API work:

- Implement `/api/v1/*` contracts under `apps/web/app/api/v1`.
- Keep Web first.
- Keep mock AI usable without API keys.
- Keep localStorage limited to draft/anonymous state, not authoritative card/activation data.
- Keep upload optional and skippable.
- Do not introduce Web P0 paywall, real payment, WeChat Pay, unlock payment, or invite unlock.
- Preserve the current app-local Prisma evidence path unless a downstream task explicitly replaces it with a canonical PostgreSQL-ready schema layout.

## Residual Risks

- T01 passes as intake only; it does not prove product readiness.
- Current Web pages are placeholders, so later visual and owner-click gates remain required.
- Current API v1 surface is absent.
- Current Prisma implementation is app-local SQLite, while production acceptance still needs PostgreSQL + Prisma alignment.
