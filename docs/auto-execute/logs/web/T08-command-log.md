# T08 Command Log

Worker scope: T08 only.

## Read Inputs

1. `Get-Content -Raw AGENTS.md` - read root operating contract.
2. `Get-Content -Raw docs/auto-execute/auracue-web-tasks/T08-web-shell-draft-api-client.md` - read task.
3. `Get-Content -Raw docs/auto-execute/latest/web/T02-HANDOFF.md` - read scaffold handoff.
4. `Get-Content -Raw docs/auto-execute/latest/web/T04-HANDOFF.md` - read API foundation handoff.
5. `Get-Content -Raw docs/auto-execute/latest/web/T05-HANDOFF.md` - read identity/upload/draw API handoff.
6. `Get-Content -Raw docs/auto-execute/latest/web/T07-HANDOFF.md` - read card/activation/share API handoff.
7. `Get-Content -Raw docs/auto-execute/auracue-web-ui-reference-map.md` - read UI route map.
8. `Get-Content -Raw packages/ui-tokens/src/index.ts` - read token package.
9. `rg -n "Route-001|API-001|REQ-001|UI-SHELL|localStorage|draft|§8|§9|Web spec|Web/H5|8\.|9\." docs -g "*.md"` - located Web spec §8-9 and route/API requirement references.

## Verification

1. `pnpm.cmd --filter @auracue/web test -- draft-store api-client`
   - Final status: `PASS`
   - Evidence: draft store persisted only `mood`, `context`, `uploadId`, `drawSessionId`, `drawPosition`; blocked `cardId` and `activationId`. API client covered success envelope, error envelope, network error, and analytics whitelist.

2. `pnpm.cmd --filter @auracue/web test`
   - Status: `PASS`
   - Evidence: nine route files exist, use `RoutePlaceholder` plus shared `routeByPath`; shared shell/loading/error/API/draft files exist.

3. `pnpm.cmd --filter @auracue/web typecheck`
   - First status: `FAIL`
   - Failure: route lookup literal union hid optional `nextPath`; custom CSS variable object needed a React style cast.
   - Repair: typed `routeByPath` as `AuraCueRouteDefinition | null`, cast token style as `CSSProperties`, marked retry-capable error state component as client-side.
   - Rerun status: `PASS`

4. `pnpm.cmd --filter @auracue/web lint`
   - Status: `PASS`

5. `pnpm.cmd --filter @auracue/web build`
   - Status: `PASS`
   - Evidence: Next compiled the nine page routes and all existing `/api/v1/*` route handlers.

## Notes

- `pnpm.cmd` was used because prior web handoffs documented PowerShell shim policy issues with `pnpm`.
- No concrete business pages were completed in T08; placeholders remain shell-only.
- Core card and activation identifiers are exposed through the API client only and are not written by the draft store.
