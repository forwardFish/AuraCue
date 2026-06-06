# AuraCue Software Test Standard

## Test Process
| Step | Required Output | Failure Handling |
| --- | --- | --- |
| Planning | `auracue-standard-test-plan.md` rows for P0 requirements, pages, APIs, DB, visual refs, owner journeys. | Missing P0 row blocks final PASS. |
| Environment setup | Local mini-program/backend/mock DB commands documented by T00/T01. | Mark `BLOCKED_BY_ENVIRONMENT` only after fallback attempts. |
| Test data | Deterministic scene/energy/card/payment/invite/share fixtures. | Missing fixture blocks affected page/API evidence. |
| Execution | Logs, screenshots, traces, API transcripts, DB readbacks. | Fail closed on missing evidence. |
| Defect handling | Repair tasks or `REPAIR_REQUIRED` result JSON. | Do not hide failures in summary prose. |
| Regression | Rerun impacted tests after repair. | No final PASS without rerun evidence. |
| Final report | `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` plus result JSON/HANDOFF set. | Missing report is final gate failure. |

## Local Run Standard
Later T00/T01 must define exact commands after scaffold exists. Until then, planned defaults are:

| Surface | Planned Command | Expected Ready Signal | Evidence |
| --- | --- | --- | --- |
| Install | `pnpm install` | lockfile install succeeds | `docs/auto-execute/logs/T01/install.log` |
| Mini-program | `pnpm --filter @auracue/wechat-mini dev:weapp` or equivalent | dev build completes | `docs/auto-execute/logs/T01/wechat-mini-dev.log` |
| Local API/mock | `pnpm --filter @auracue/api dev` or equivalent | health endpoint responds | `docs/auto-execute/api/T01/health.json` |
| Tests | `pnpm test` plus scoped scripts | tests pass or report exact blocker | task result JSON |

## Frontend Page Test Standard
Every P0 reference must have:
- render test for default/loaded state;
- state test for loading/empty/error/disabled state where applicable;
- exact click test for every visible P0 control;
- route assertion for every navigation;
- API or state assertion for every submit/save/share/unlock/invite action;
- analytics event assertion;
- screenshot or structural capture target.

## Visual One-To-One Standard
| Requirement | Rule |
| --- | --- |
| Reference inventory | Use `docs/UI/小程序/*.png` as visual truth and `stitch_codex_ui_code_generator/*/code.html` as implementation reference. |
| Viewport | Reproduce `941x1672` design ratio and mini-program viewport-safe equivalent. |
| Token extraction | Extract colors, typography, spacing, radii, shadows, borders, icon/image assets, and layout rhythm before page implementation. |
| Fixture-backed states | Use local fixtures so screenshots show the same states as references: incomplete selection, generating, free preview, invite progress, payment failure/success, full result, share sheet, save success, network error. |
| Capture | Store actual screenshots or deterministic mini-program renders under `docs/auto-execute/screenshots/<TASK-ID>/`. |
| Diff/metrics | Store reference/actual/diff/metrics/summary under `docs/auto-execute/screenshots/diffs/<TASK-ID>/`. |
| Allowed deviation | Copy must match unless safety wording is required; layout deviation must be documented and repaired. Structural-only proof cannot become pure pixel-perfect PASS. |

## Simulated User Standard
The simulated owner user must click every P0 page, tab/card/button/modal/form/workflow action. Each step must assert expected route/state, expected API call where applicable, expected DB mutation/readback where applicable, expected analytics event, and expected visible UI.

## Backend/API Test Standard
Every API in `auracue-api-db-contract-matrix.md` needs tests for:
- success;
- request validation failure;
- anonymous/unauthenticated behavior;
- unauthorized or ownership failure where applicable;
- not found where applicable;
- duplicate/conflict/idempotency where applicable;
- timeout/server/fallback where applicable;
- expected DB mutation and independent readback where applicable.

## Contract Test Standard
Every mini-program API caller must be covered by a contract test that verifies method, path, request payload, success response, error envelope, loading/error UI behavior, and analytics side effects.

## Report And Safety Standard
Final verification must include:
- `git diff --check`;
- lint/typecheck/build/test commands available in the scaffold;
- all page simulated tests;
- all API and DB readback tests;
- visual one-to-one comparison;
- owner E2E click journey;
- local-only guard proving no real WeChat Pay/cloud/AI production call;
- secret guard;
- report-integrity check.

## Final PASS Rule
Pure product PASS is forbidden unless every P0 requirement, UI reference, page click, API case, DB side effect, visual target, and owner scenario has evidence. Missing visual screenshots or structural-only visual proof must remain `PASS_NEEDS_MANUAL_UI_REVIEW`, `PASS_WITH_LIMITATION`, or `REPAIR_REQUIRED`.
