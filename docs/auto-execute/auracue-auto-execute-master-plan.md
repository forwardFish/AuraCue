# AuraCue Auto-Execute Master Plan

## Goal
Deliver a local WeChat mini-program MVP for AuraCue that one-to-one reproduces the supplied P0 UI references, supports the complete local generation/unlock/share/save loop with mock backend/API/DB/payment/AI boundaries, and proves every page with simulated tests, API/DB tests, visual comparison, owner click E2E, local-only safety, and final fail-closed acceptance evidence.

## Inputs
- Project root: `D:\lyh\agent\agent-frame\AuraCue`
- PRD: `docs/AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md`
- UI screenshots: `docs/UI/小程序/*.png`
- Stitch code: `docs/UI/小程序/stitch_codex_ui_code_generator/*/code.html`
- P1 exclusions: `docs/UI/小程序/P1/README.md`
- Standards: `docs/auto-execute/auracue-development-standard.md`, `docs/auto-execute/auracue-software-test-standard.md`

## Execution Boundary
This plan is documentation-only. It did not execute code. Later `auto-execute` must run one fresh `codex exec` per task document. After each task finishes, the old `codex exec` must exit completely and write result JSON, logs, and HANDOFF before the next task starts.

## Task Sequence
| Order | Task ID | Task Name | Primary Surface | Inputs | Outputs | Required Evidence | Blocks Product PASS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | T00 | Intake, source inventory, harness decision | planning/harness | PRD, UI dirs, AGENTS | source inventory, command plan | result JSON + no-code harness doc | yes |
| 2 | T01 | Scaffold mini-program/backend/shared workspace | project scaffold | T00, standards | package/app/api/shared skeleton | install/build/health logs | yes |
| 3 | T02 | Extract UI tokens and asset inventory | visual foundation | UI refs, Stitch code | tokens/assets/reference manifest | token extraction report | yes |
| 4 | T03 | Local DB/repository and seed fixtures | data | PRD DB entities | local DB or JSON repo + seeds | DB seed/readback logs | yes |
| 5 | T04 | Generation job and structured card API | backend | API-001/002 | generation APIs/local generator | API/DB tests planned/run | yes |
| 6 | T05 | Card result, entitlement read APIs | backend | API-003 | card read/free/full contracts | API evidence | yes |
| 7 | T06 | Mock unlock, payment, invite APIs | backend | API-004/005/006 | local payment/invite entitlement | API/DB evidence | yes |
| 8 | T07 | Save, share, renderer, analytics APIs | backend | API-007..010 | save/share/render/event APIs | API/DB evidence | yes |
| 9 | T08 | Mini-program shell, routes, state, API client | frontend foundation | UI map, API matrix | app shell/router/client/state | route smoke trace | yes |
| 10 | T09 | Home page one-to-one | UI-01 | UI-01 | home route/components/tests | screenshot/click trace | yes |
| 11 | T10 | Scene and energy selection pages | UI-02..UI-04 | UI-02/03/03A | selection routes/states/tests | screenshot/click trace | yes |
| 12 | T11 | Generation ritual and network error pages | UI-05/UI-18 | UI-04/11 | loading/error/retry flow | screenshot/click trace | yes |
| 13 | T12 | Free preview locked result | UI-06 | UI-05 | locked preview page | screenshot/click trace | yes |
| 14 | T13 | Unlock and invite pages | UI-07..UI-10 | UI-06/07A/07B/07C | unlock/invite/friend landing | screenshot/click trace | yes |
| 15 | T14 | Mock payment states | UI-11..UI-13 | UI-08A/B/C | payment confirm/fail/success | screenshot/click trace | yes |
| 16 | T15 | Full result page | UI-14 | UI-09 | full card/report page | screenshot/click trace | yes |
| 17 | T16 | Share and save pages | UI-15..UI-17 | UI-10A/B/C | share preview/channel/save success | screenshot/click trace | yes |
| 18 | T17 | Share card renderer | renderer | PRD 15, UI-15 | deterministic 9:16 render | render artifact | yes |
| 19 | T18 | Analytics and safety copy guard | safety/data | PRD 23/25 | analytics/copy guard tests | safety report | yes |
| 20 | T19 | All-page simulated tests | frontend QA | UI map | render/click/state test suite | page simulation summary | yes |
| 21 | T20 | All API and DB readback tests | backend QA | API matrix | API/DB test suite | API/DB summary | yes |
| 22 | T21 | Frontend/backend contract tests | contract QA | API callers/matrix | contract suite | contract summary | yes |
| 23 | T22 | Visual one-to-one capture and diff | visual QA | all UI refs | screenshot/diff harness | visual summary | yes |
| 24 | T23 | Visual repair loop | visual repair | T22 deviations | repairs + rerun diffs | repair summary | yes |
| 25 | T24 | Simulated owner E2E full click journey | owner QA | owner matrix | end-to-end click/API/DB/UI traces | owner E2E summary | yes |
| 26 | T25 | Final acceptance gate and delivery report | final verification | all task outputs | final report/verdict | `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` | yes |

## Local-Only Safety
- Use local/mock payment and entitlement.
- Use deterministic local generation unless a later task adds a guarded AI adapter with test doubles.
- Do not write to production WeChat cloud, Supabase, object storage, payment, or analytics.
- Do not commit secrets. Secret guard is mandatory before final verdict.

## Final Product PASS Conditions
Pure product PASS is allowed only after later execution has evidence for all of the following:
- all T00-T25 result JSON and HANDOFF files exist;
- every P0 requirement is implemented and verified;
- every P0 UI reference has reference/actual/diff/metrics evidence or an honest non-PASS visual limitation;
- every P0 page/control is clicked in simulated tests and owner E2E;
- every API case has method/path/schema/auth/error/DB readback evidence;
- frontend/backend contract tests pass;
- local-only, secret guard, report integrity, and P1 exclusion checks pass.

## Known Blockers At Generation Time
| Blocker | Status | Later Handling |
| --- | --- | --- |
| No product code exists yet | PLANNED | T01 scaffolds project. |
| Exact local dev command unknown before scaffold | PLANNED | T00/T01 must decide and document commands. |
| Real mini-program screenshot automation may depend on local tooling | PLANNED | T22 must try raster capture first; structural fallback cannot be pure visual PASS. |
