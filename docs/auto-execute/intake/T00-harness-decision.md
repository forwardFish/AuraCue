# T00 Harness Decision

Task boundary: T00 intake, source inventory, and harness decision only.

## Decision Summary

T00 chooses the following default for T01 unless local tooling proves unsuitable:

- Mini-program framework: Taro + React + TypeScript.
- Package manager: pnpm workspace.
- Local API surface: `apps/api`, implemented as a local mock/backend service.
- Mini-program app: `apps/wechat-mini`.
- Shared packages: `packages/shared-types`, `packages/ui-tokens`, `packages/prompt-core`, `packages/card-renderer`, and `packages/analytics-events`.
- Local persistence: deterministic JSON-backed repository first, with a later migration-compatible DB boundary for the P0 entities.
- Payment, AI, analytics, storage, and DB integrations: local/mock only.

This is a harness and architecture decision for later tasks. T00 did not scaffold these files.

## Why Taro + React + TypeScript

| Criterion | Decision Evidence |
| --- | --- |
| Source standard | `auracue-development-standard.md` lists Taro + React as preferred default because Stitch references are HTML/CSS oriented. |
| UI replication | React components and CSS-like token extraction fit the Stitch `code.html` references while targeting WeChat mini-program output. |
| Future reuse | Shared TypeScript contracts can later support Web/PWA/App paths without moving prompt, entitlement, renderer, or analytics logic into page components. |
| Testability | Taro/React gives T19 a practical route to simulated render/click/state tests. |
| Risk | If T01 proves Taro tooling unavailable locally, T01 may choose native mini-program but must document the deviation and preserve the same contracts. |

## Planned Workspace Shape For T01

```text
apps/
  wechat-mini/
  api/
packages/
  shared-types/
  ui-tokens/
  prompt-core/
  card-renderer/
  analytics-events/
docs/auto-execute/
  logs/T01/
  api/T01/
```

T01 must create actual scaffold files and executable commands. T00 only records the planned harness.

## Local API Harness Plan

| Area | T00 Decision | Later Owner |
| --- | --- | --- |
| Health endpoint | Add local `GET /api/health` returning `{status, version}`. | T01 |
| Generation APIs | Implement API-001 and API-002 with deterministic local generation and job state. | T04 |
| Card APIs | Implement API-003 with free/full/locked/not-found behavior. | T05 |
| Unlock/payment/invite APIs | Implement API-004, API-005, API-006 with local mock orders, invite events, and entitlement readback. | T06 |
| Save/share/render/analytics APIs | Implement API-007..API-010 with local readbacks and no production writes. | T07 |
| Error envelope | Use the matrix-defined `{ error: { code, message, details } }` shape. | T04-T07 |

No real WeChat Pay, production cloud writes, production DB, production AI, production analytics, secrets, or external billing calls are allowed in MVP execution.

## Local Persistence Plan

Use a deterministic local repository boundary first. T03 should create fixtures/readback helpers for:

- `users`
- `aura_cards`
- `generation_jobs`
- `card_templates`
- `share_events`
- `analytics_events`
- `payment_orders`
- `user_entitlements`

The storage can be JSON-backed for MVP verification if it exposes independent readback tests. API responses alone are not enough for final acceptance.

## UI Harness Plan

| Required UI Evidence | Later Owner | Notes |
| --- | --- | --- |
| Token extraction from PNG/Stitch | T02 | Must preserve one-to-one target for `docs/UI/小程序`. |
| Routes and app state | T08 | Build shell, route map, API client, and fixture state. |
| P0 page implementations | T09-T18 | Each implemented page/state must include simulated tests in its task or be covered by T19. |
| All-page simulated tests | T19 | Every P0 page/control must have render/click/state assertions. |
| Visual capture/diff | T22/T23 | Screenshot and diff evidence required for pure visual PASS; otherwise use manual-review/limitation status. |

T00 did not create visual screenshot/diff evidence. Later tasks must not infer visual PASS from this document.

## Commands T01 Must Make Executable

T01 should create or document project-native equivalents for:

| Purpose | Planned Command |
| --- | --- |
| Install dependencies | `pnpm install` |
| Mini-program dev/build | `pnpm --filter @auracue/wechat-mini dev:weapp` or equivalent |
| Local API dev | `pnpm --filter @auracue/api dev` or equivalent |
| Local API health probe | HTTP probe for `GET /api/health` saved to `docs/auto-execute/api/T01/health.json` |
| Workspace lint/typecheck | `pnpm lint` and `pnpm typecheck` or scoped equivalents |
| Test suite | `pnpm test` plus later scoped page/API/contract commands |

Because no scaffold exists before T01, these commands are planned targets, not T00-executed tests.

## Safety Guardrails

| Risk Area | Decision |
| --- | --- |
| Payment | Mock only. No real WeChat Pay or production payment callback. |
| AI generation | Deterministic local generation first. No production AI provider call. |
| Analytics | Local collector/mock only. No production analytics endpoint. |
| Storage | Local fixtures/render paths only until an explicit later task changes scope. |
| DB | Local/test repository only. No production DB or cloud writes. |
| Secrets | No secret files, API keys, or credentials required for MVP scaffold. |

## T00 Verdict

The harness decision is ready for T01. The source set is complete, the planned framework is Taro + React + TypeScript, and all production integrations remain forbidden unless a later explicit task changes scope.
