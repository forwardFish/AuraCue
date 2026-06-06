# T08 Web Handoff

Status: `COMPLETE`

Verdict: `PASS_FOR_T08_SCOPE`

Product PASS claimed: no. T08 only implemented the reusable Web shell, route constants, style token plumbing, draft store, API client, analytics wrapper, shared loading/error states, and unit/smoke coverage.

## Completed

- Added shared route constants for `Route-001..009` and wired all existing placeholder routes through them.
- Added `WebShell`, `LoadingState`, and `ErrorState` shared components.
- Connected global CSS variables to `@auracue/ui-tokens` through `createGlobalTokenStyle`.
- Added draft store limited to non-core draft fields: `mood`, `context`, `uploadId`, `drawSessionId`, and `drawPosition`.
- Added a shared API client for existing `/api/v1/*` envelope handling, named endpoint methods, typed API errors, and network-error normalization.
- Added a non-blocking analytics wrapper with whitelist and secret-like payload key filtering.
- Added unit/smoke tests for draft persistence, API envelope handling, analytics behavior, and route shell presence.

## Repair Record

- Initial `pnpm.cmd --filter @auracue/web typecheck` failed because the literal route union hid optional `nextPath`, and React style typing rejected custom CSS variable keys.
- Fixed by returning `AuraCueRouteDefinition | null` from `routeByPath`, casting global token styles as `CSSProperties`, and marking the retry-capable `ErrorState` as a client component.
- Reran typecheck successfully.

## Verification

Passed:

```powershell
pnpm.cmd --filter @auracue/web test -- draft-store api-client
pnpm.cmd --filter @auracue/web test
pnpm.cmd --filter @auracue/web typecheck
pnpm.cmd --filter @auracue/web lint
pnpm.cmd --filter @auracue/web build
```

Evidence:

- Result JSON: `docs/auto-execute/results/web/T08.json`
- Command log: `docs/auto-execute/logs/web/T08-command-log.md`
- Unit log: `docs/auto-execute/logs/web/T08-unit-log.md`
- Route smoke log: `docs/auto-execute/logs/web/T08-route-smoke-log.md`

## Next Task Input

T09-T11 should import from:

- `apps/web/lib/routes.ts`
- `apps/web/lib/draft-store.js`
- `apps/web/lib/api-client.js`
- `apps/web/lib/analytics.js`
- `apps/web/components/web-shell.tsx`
- `apps/web/components/loading-state.tsx`
- `apps/web/components/error-state.tsx`

Preserve the T08 boundary: do not duplicate per-page fetch/envelope handling, and do not store core `cardId` or `activationId` as draft/localStorage state.

## Residual Risks

- Placeholder pages are still intentionally not business-complete; T09-T11 own page behavior.
- T08 did not start a live dev server or run browser screenshots; T13-T15 own runtime and visual evidence.
