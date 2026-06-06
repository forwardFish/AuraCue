# AuraCue Final Acceptance Gate

## Gate Inputs
| Input | Path | Required |
| --- | --- | --- |
| Delivery index | `docs/auto-execute/auracue-delivery-standard-index.md` | yes |
| Development standard | `docs/auto-execute/auracue-development-standard.md` | yes |
| Software test standard | `docs/auto-execute/auracue-software-test-standard.md` | yes |
| Requirement matrix | `docs/auto-execute/auracue-requirement-traceability-matrix.md` | yes |
| UI reference map | `docs/auto-execute/auracue-ui-reference-map.md` | yes |
| API/DB matrix | `docs/auto-execute/auracue-api-db-contract-matrix.md` | yes |
| Standard test plan | `docs/auto-execute/auracue-standard-test-plan.md` | yes |
| Owner scenario matrix | `docs/auto-execute/auracue-owner-scenario-matrix.md` | yes |
| Task results | `docs/auto-execute/results/T00.json` through `T25.json` | yes |
| HANDOFF files | `docs/auto-execute/latest/T00-HANDOFF.md` through `T25-HANDOFF.md` | yes |
| Final delivery report | `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` | yes |

## Fail-Closed Rules
- Missing any P0 requirement evidence -> `REPAIR_REQUIRED`.
- Missing any P0 page render/click evidence -> `REPAIR_REQUIRED`.
- Missing visual comparison for any UI-01..UI-18 reference -> `REPAIR_REQUIRED` or `PASS_NEEDS_MANUAL_UI_REVIEW`.
- Structural-only visual capture for one-to-one UI -> `PASS_NEEDS_MANUAL_UI_REVIEW`, not pure product PASS.
- Missing any API case or DB readback -> `REPAIR_REQUIRED`.
- Missing frontend/backend contract evidence -> `REPAIR_REQUIRED`.
- Missing simulated owner exact-click evidence -> `REPAIR_REQUIRED`.
- Real payment/cloud/AI production call, secret exposure, or report-integrity failure -> `HARD_FAIL`.
- Implemented P1 history/trend/account/profile beyond explicit disabled/coming-soon handling -> `REPAIR_REQUIRED`.

## Final Verdict Table
| Gate | Required Evidence | Current Status Before Execution | Later Verdict Rule |
| --- | --- | --- | --- |
| Requirements | REQ-001..REQ-020 mapped to task evidence | PLANNED | all P0 must have result-backed evidence |
| UI one-to-one | UI-01..UI-18 reference/actual/diff/metrics | PLANNED | all P0 UI refs required |
| Page simulated tests | T19 page/control coverage | PLANNED | all controls clicked or intentionally disabled |
| API/DB | T20 all API cases and DB readbacks | PLANNED | no missing P0 API case |
| Contracts | T21 frontend/backend contracts | PLANNED | no drift |
| Visual repair | T22 + T23 summaries | PLANNED | no unresolved material deviation for pure product PASS |
| Owner E2E | T24 exact-click scenarios SCN-001..SCN-016 | PLANNED | all route/API/DB/UI assertions required |
| Safety | T18 copy guard, T25 local-only/secret guard | PLANNED | no forbidden copy or production side effect |
| Report integrity | T25 report-integrity JSON and final report | PLANNED | all artifacts linked and fresh |

## Pure Product PASS Definition
Pure product PASS after later execution means the mini-program can run locally end to end and all required evidence exists. A completed implementation without owner click evidence, API evidence, DB readback, and one-to-one page visual evidence is not pure product PASS.
