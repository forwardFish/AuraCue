# AuraCue Development Standard

## Non-Negotiable Rules
- MVP target is the WeChat mini-program experience verification build, not Web/PWA/App.
- Frontend UI must one-to-one reproduce `docs/UI/小程序` and Stitch code references. Do not redesign, restyle, simplify, or replace the supplied screens with generic dashboards.
- Every code change in later execution must cite a requirement ID, UI ID, API ID, DB entity, owner scenario, or test row from this pack.
- Prompt, AI generation logic, unlock entitlement, card persistence, share image generation, and analytics contracts must live behind backend/local service boundaries, not be hardcoded as mini-program-only business logic.
- Real WeChat Pay, real cloud writes, real production data, and real paid transactions are forbidden in MVP execution unless the user explicitly authorizes them in a later turn. Use local/mock adapters.
- Do not claim completion without fresh local evidence under `docs/auto-execute/`.

## Source-Of-Truth Order
| Priority | Source | Rule |
| --- | --- | --- |
| 1 | Direct user instructions | MVP first, WeChat mini-program, one-to-one UI, every page has simulated tests, generate tasks only in this phase. |
| 2 | `AGENTS.md` | Verification-first, autonomous safe local work, no false completion. |
| 3 | PRD v0.2 | Product behavior, P0 pages, API/DB, analytics, risk boundaries, acceptance standards. |
| 4 | `docs/UI/小程序/*.png` | Visual source of truth for mini-program P0 screens. |
| 5 | Stitch HTML/CSS prototypes | Implementation reference for spacing, typography, colors, hierarchy, buttons, states. |
| 6 | Existing code | No product code exists yet; scaffold must respect this pack. |

## Lifecycle Standard
| Phase | Required Work Product | Exit Criteria |
| --- | --- | --- |
| Intake | Source inventory, blockers, planned harness paths | PRD/UI/code scope mapped and no missing P0 source. |
| Design | Requirement/UI/API/DB matrices | Every P0 row maps to implement + verify task. |
| Scaffold | Mini-program/backend/shared package skeleton | Local commands, scripts, fixtures, test surfaces exist. |
| Implementation | Task-local code changes | Allowed files only, no unrelated refactor. |
| Verification | Tests and evidence | Relevant standard-test-plan rows have future result JSON evidence. |
| Handoff | Result JSON + HANDOFF | Next worker can resume without re-reading the whole thread. |
| Final gate | Final acceptance report | Fails closed on any missing P0 proof. |

## Product Quality Standard
| Quality Area | Development Rule | Required Evidence In Later Execution |
| --- | --- | --- |
| Functional suitability | P0 flow completes in about 30 seconds with scene, energy, generation, preview, unlock, full result, share, save, failure recovery. | Requirement matrix and owner E2E traces. |
| Usability | Each screen performs one primary action and preserves the supplied visual hierarchy. | Screenshots, click traces, visual diff. |
| Reliability | Generation, payment mock, invite, save, share, and API errors have retry/recovery states. | Error-path tests and UI evidence. |
| Security/safety | No destiny guarantees, no negative predictions, no appearance anxiety, no therapy/medical claims. | Copy audit and safety tests. |
| Maintainability | Shared types, API client, tokens, fixtures, and mocks are centralized. | Code review notes and tests. |
| Portability | Backend contracts can later serve Web/PWA/App. | API/DB contract matrix and contract tests. |
| Local safety | Payment/cloud/AI/storage are mocked or local-only. | Local-only guard and secret guard. |

## Architecture Rules
| Area | Rule |
| --- | --- |
| Mini-program framework | Later executor may choose Taro + React + TypeScript or native mini-program, but must document the choice in T00/T01. Given the Stitch HTML/CSS references, Taro + React is the preferred default unless local tooling proves unsuitable. |
| App structure | Use `apps/wechat-mini` for mini-program code, `apps/api` or `services/api` for local backend/mock API, and `packages/*` for shared types, tokens, card renderer, analytics events, and prompt core. |
| State | Store current scene, energy, generation job, card, entitlement, invite progress, payment mock, share/save state in explicit typed state modules. |
| API boundary | Mini-program calls local API client. No prompt template, entitlement decision, pricing decision, or full card generation should be hidden only in page components. |
| DB boundary | Use local DB or deterministic JSON-backed repository first. Every P0 mutation must support independent readback tests. |
| Analytics | Centralize event names from PRD section 23. Page and click handlers must emit events through a local collector/mock. |

## Frontend Rules
- Implement all P0 UI references: `UI-01` through `UI-17`.
- Every P0 page/state must have route, fixture, loaded state, empty/error/loading state where applicable, clickable controls, and a simulated test.
- Use shared tokens extracted from reference screens before implementing page-specific styling.
- Preserve supplied text and English brand copy unless PRD risk boundary requires safer wording.
- Text must fit the 941x1672 reference ratio and mini-program viewport equivalents.
- All visible P0 controls must either trigger route/API/local state/toast/modal/share/save or be intentionally disabled with a tested reason.

## Backend/API Rules
- Every API uses typed request/response DTOs and an error envelope.
- Every API has success, validation, unauthenticated/local anonymous, unauthorized/ownership where applicable, not-found, conflict/idempotency, timeout/server/fallback, and DB readback test rows where applicable.
- Anonymous users must complete one generation flow.
- Entitlement and payment are local mock only in MVP; real WeChat payment integration is out of scope.
- AI generation can use deterministic local generation first; real model calls are forbidden unless a later task explicitly adds a local-only guarded adapter and test doubles.

## Database Rules
| Entity | Required MVP Use |
| --- | --- |
| `users` | Anonymous/local user identity and later migration-compatible shape. |
| `aura_cards` | Structured card result, free/full visibility, share/save state. |
| `generation_jobs` | Async generation lifecycle and failure/retry state. |
| `card_templates` | Share/card rendering template metadata. |
| `share_events` | Share channel and invite/referral events. |
| `analytics_events` | Page/click/funnel metrics. |
| `payment_orders` | Mock unlock order lifecycle. |
| `user_entitlements` | Mock paid/invite unlock entitlement. |

## Forbidden Actions
- No real payment, production payment callback, or production credentials.
- No real cloud write or production DB.
- No hidden broad cleanup, history rewrite, or unrelated refactor.
- No P1 implementation unless explicitly marked as deferred preview or out-of-scope row.
- No claims of pixel-perfect PASS without reference/actual/diff/metrics evidence for every P0 UI reference.
