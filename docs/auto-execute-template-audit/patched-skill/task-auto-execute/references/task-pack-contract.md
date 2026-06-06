# Auto-Execute Task Pack Contract

## Required Outputs

For a project slug such as `scoremap`, generate:

```text
docs/auto-execute/<slug>-delivery-standard-index.md
docs/auto-execute/<slug>-auto-execute-master-plan.md
docs/auto-execute/<slug>-development-standard.md
docs/auto-execute/<slug>-software-test-standard.md
docs/auto-execute/<slug>-requirement-traceability-matrix.md
docs/auto-execute/<slug>-ui-reference-map.md
docs/auto-execute/<slug>-api-db-contract-matrix.md
docs/auto-execute/<slug>-external-data-validation-matrix.md
docs/auto-execute/<slug>-standard-test-plan.md
docs/auto-execute/<slug>-codex-exec-prompts-split.md
docs/auto-execute/<slug>-owner-scenario-matrix.md
docs/auto-execute/<slug>-final-acceptance-gate.md
docs/auto-execute/<slug>-task-pack-quality-audit.md
docs/auto-execute/<slug>-tasks/T00-omx-auto-execute-orchestrator.md
docs/auto-execute/<slug>-tasks/<TASK-ID>-<task-name>.md
```

This contract is documentation-only. The skill that uses this contract must not execute code, run `codex exec`, start a local app, click a browser, call APIs, mutate a database, or create product execution evidence. It must only generate the markdown task pack and future execution prompts.

## Task Template Selection

Before generating any task document, select a task archetype from `references/task-archetype-templates.md`, use `references/software-dev-task-templates.md` as the classification catalog, then fill the exact independent template file from `references/templates/<Task Template ID>.md`. Every task must include a `Task Template ID`, task type, primary acceptance surface, template rationale, and covered requirement/UI/API/DB/external-data/owner IDs.

The master plan task table must include a `Task Template ID` column. The task-pack quality audit must include a `Task Template Matching Audit` section. A task without template selection, or a selected template without a matching `references/templates/TPL-*.md` file, is not ready for auto-execute and makes the pack `NEEDS_REGENERATION`.

## Generation Boundary

During task-pack generation, do not create:

- `docs/auto-execute/results/*.json`;
- `docs/auto-execute/latest/*HANDOFF.md`;
- `docs/auto-execute/latest/verification-results.md`;
- execution screenshots;
- API transcripts;
- DB readbacks;
- run logs;
- PASS evidence.

All generated tasks, test rows, and evidence rows must start as `PLANNED`, `BLOCKED_BY_MISSING_SOURCE`, or `OUT_OF_SCOPE_WITH_REASON`. `PASS`, `VERIFIED`, result JSON, and HANDOFF states are reserved for later `auto-execute` execution.

All generated markdown must be UTF-8. Preserve Chinese source paths, UI filenames, and business copy exactly. Mojibake or corrupted Chinese makes the pack `NEEDS_REGENERATION`.

## Language And Encoding Contract

If the user says the project is Chinese, or the source PRD/docs/UI are Chinese, the generated pack must set `project_language=zh-CN` and obey:

- generated project documents use Chinese headings and Chinese business descriptions;
- generated task documents use Chinese for implementation scope, inputs, allowed files, forbidden actions, acceptance criteria, dependency/resume gates, stop-prevention rules, and failure routing;
- user-facing pages, README/operator docs, alerts, reports, spreadsheet/table names, and external data field names are Chinese;
- technical identifiers may remain English only when they are commands, env vars, file paths, API IDs, code symbols, package names, or stable task IDs;
- Feishu/Bitable table and field names preserve the exact Chinese business names from the PRD;
- UTF-8 must be verified by reading files as UTF-8, not by trusting Windows console rendering;
- mojibake markers such as `�`, `锛`, `鈥`, `涓`, `浠`, and `娣` make the pack `NEEDS_REGENERATION`.

## Delivery Standard Index Must Include

The delivery standard index is the entrypoint for the generated pack. It must include:

- target project root, project slug, generation date, and source-of-truth files;
- standard basis: lifecycle, product quality, test process, secure development, accessibility, API contract, delivery evidence;
- document map explaining what each generated markdown file controls;
- evidence map explaining where future result JSON, screenshots, traces, API transcripts, DB readbacks, logs, and HANDOFF files must live;
- execution boundary: this skill generated documents only and did not execute code;
- future execution rule: one task document equals one future fresh `codex exec` boundary, and the previous `codex exec` must finish and close before the next task starts;
- anti-stop rule: T00 must inspect prior result JSON/HANDOFF/blockers, launch one fresh future worker per task, wait for exit, verify durable evidence, route failures to repair, and never treat chat text as task completion;
- status vocabulary and false-PASS rules.

## Development Standard Must Include

The development standard is the mandatory engineering contract for later `auto-execute` workers. It must include:

- source-of-truth order: user prompt, AGENTS.md, PRD/requirements, UI references, existing code, and explicit safety constraints;
- lifecycle rules for intake, design, implementation, verification, release evidence, and maintenance handoff;
- product quality rules covering functional suitability, performance, compatibility, usability, reliability, security, maintainability, portability, safety/risk, and accessibility where applicable;
- implementation rules for keeping scope small, reviewable, and tied to a requirement ID;
- frontend rules for page completeness, states, navigation, accessibility basics, loading, empty, error, and responsive behavior;
- backend rules for route ownership, DTOs, validation, auth, persistence, idempotency, error responses, and local-only external-service adapters;
- frontend/backend contract rules for request/response shape, status codes, error envelope, and version drift;
- database rules for schema/collection ownership, seed data, mutation proof, readback proof, and cleanup policy;
- external data rules for spreadsheet/Bitable/SaaS storage field mapping, upsert, idempotency, failure-cache, replay, and readback proof;
- external integration rules for payment, cloud, AI, storage, email, SMS, and other side effects;
- logging, result JSON, HANDOFF, and evidence artifact rules for later execution;
- forbidden actions and false-completion prohibitions.

## Software Test Standard Must Include

The software test standard is the mandatory QA contract for later `auto-execute` workers. It must include:

- test process rules for test planning, test design, test environment, test data, test execution, defect handling, regression, and final reporting;
- local start/run standard for frontend, backend, database, and required mocks;
- frontend test standard: render, navigation, form validation, state transition, empty/error/loading states, and responsive checks for every page;
- visual test standard: one-to-one comparison against every UI reference, with screenshot paths, allowed deviation rules, and manual-review fallback status;
- one-to-one reconstruction standard: reference inventory, design-token extraction, fixture-backed target state setup, viewport-specific capture, reference/actual/diff/metrics artifacts, material-deviation repair routing, and status demotion when raster proof is unavailable;
- simulated-user standard: one realistic user persona must click every P0 page, tab, card, button, modal, form, and main workflow action;
- backend test standard: unit, integration, persistence, validation, auth, and error-path checks;
- all-API standard: every API must have method/path, auth rule, request schema, response schema, success case, validation case, auth failure, not found where applicable, server/fallback behavior, side effect, DB readback, and evidence path;
- frontend/backend contract standard: every frontend caller must match the backend method/path/request/response/error contract;
- database test standard: every P0 mutation must have write proof and independent readback proof;
- external data test standard: every P0 spreadsheet/Bitable/SaaS write must prove exact payload fields, unique key, create/update behavior, duplicate-run idempotency, failed-write cache, replay, failure-as-null-not-zero handling, and independent readback or mock-readback;
- report standard: result JSON, logs, screenshots/traces, DB snapshots, API transcripts, final summary, secret guard, and report-integrity check for later execution;
- final gate standard: fail closed unless all P0 requirements, pages, APIs, DB side effects, visual checks, and simulated-user clicks have evidence.

## Master Plan Must Include

- source docs and UI references;
- reference project boundaries;
- links to the delivery standard index, development standard, and software test standard;
- execution order;
- task table;
- local-only safety rules;
- anti-stop orchestration, resume probe, and repair-routing rules;
- final PASS conditions;
- owner journey and full scenario matrix requirements;
- explicit blocker list for missing PRD/UI/code/runtime evidence;
- statement that one task document equals one future fresh `codex exec` execution boundary;
- statement that later execution must close each task's old `codex exec` process after result JSON, logs, and HANDOFF are written before launching the next task;
- statement that a task failure must produce durable failure evidence and either a repair task or a blocker classification before the orchestrator may stop;
- explicit statement that this skill generated documents only and did not execute product code.

## Traceability Matrix Must Include

Every P0/P1 requirement must be mapped to:

- source document and section;
- UI screen/state if applicable;
- backend API if applicable;
- database table/collection or storage side effect if applicable;
- task ID that implements it;
- task ID that verifies it;
- evidence path;
- status: `PLANNED`, `BLOCKED_BY_MISSING_SOURCE`, or `OUT_OF_SCOPE_WITH_REASON`.

## UI Reference Map Must Include

Every supplied UI image, screenshot, design folder, HTML prototype, or reference page must be mapped to:

- source path and source dimensions or viewport, when discoverable;
- extracted visual tokens: color, typography, spacing, radius, shadow, border, asset, and layout notes;
- target route/page/component;
- visible states;
- buttons/tabs/cards/forms/modals;
- navigation destinations;
- data shown on the screen;
- required fixture or local data state needed to make the screenshot state visible;
- actual capture command or later-worker capture requirement;
- diff/metrics command or later-worker comparison requirement;
- required future visual evidence;
- material-deviation repair rule;
- owner scenario coverage;
- allowed deviations, if any.

Do not accept a generic dashboard or placeholder page as matching a specific UI reference.

## API/DB Contract Matrix Must Include

Every backend route or required backend behavior must be mapped to:

- API ID;
- method and path;
- auth rule;
- request DTO;
- response DTO;
- validation and error cases;
- local DB mutation/readback target;
- frontend caller;
- owner scenario coverage where applicable;
- future test command/action and evidence path.

Every API must include method/path-specific rows or subrows for success, validation failure, auth failure, not-found where applicable, conflict/idempotency where applicable, timeout/server/fallback behavior where applicable, and DB mutation/readback where applicable.

## External Data Validation Matrix Must Include

When a project writes to spreadsheets, Feishu Bitable, Airtable, Notion, SaaS storage, or another external data target, generate `<slug>-external-data-validation-matrix.md`.

Every table/entity must be mapped to:

- data target ID;
- table/entity name;
- env var or config key for the target;
- internal model/source object;
- exact outbound field name;
- source/internal field;
- external field type;
- required/optional/nullability rule;
- sample value from the PRD or local fixture;
- validation rule;
- `unique_key` or idempotency rule;
- create/update/upsert behavior;
- failure-cache behavior;
- replay behavior;
- independent readback or mock-readback evidence path;
- status.

For Feishu Bitable projects, the matrix must include every PRD table such as `system_config`, `shop_config`, `monitor_snapshot`, `orders_raw`, `promotion_snapshot`, `metrics_10min`, `task_run_log`, `alert_log`, and `daily_report` when present. Pure PASS is forbidden unless later execution proves correct fields, values, unique keys, upsert/idempotency, failure-cache, replay, and readback for every P0 table.

## Standard Test Plan Must Include

The standard test plan must be a matrix, not a prose summary. It must include:

- one row per P0/P1 frontend page state and control cluster;
- one row per P0/P1 API success case;
- one row per P0/P1 API validation/auth/error case;
- one row per P0/P1 DB mutation/readback;
- one row per P0/P1 external data write, update/upsert, duplicate-run, failed-write cache, replay, and readback case;
- one row per UI visual comparison target;
- one row per simulated-user journey;
- one row per frontend/backend contract surface;
- local run/start commands that a later executor must run;
- report-integrity, secret-guard, local-only guard, and final-gate rows.

Do not collapse "all APIs" into one generic test row. Do not collapse "all pages" into one generic render row.

## Every Task Document Must Include

```markdown
# Task <ID> - <Name>

## 0. 任务模板选择
<Task Template ID, task type, primary acceptance surface, rationale, covered IDs, secondary templates>

## Codex Exec
<future paste-ready command only; not executed by this skill>

## 实现功能
<what this task must implement or verify in later execution>

## 必须读取的输入
<files/docs/UI references/code to read before editing>

## 允许改动范围
<allowed files for later execution>

## 禁止事项
<forbidden actions>

## 验收标准
<short criteria>

## 开发标准引用
<specific sections from <slug>-development-standard.md>

## 测试标准引用
<specific sections from <slug>-software-test-standard.md>

## 细化验收标准
<detailed criteria by requirement/data/API/UI/security/evidence>

## 测试与证据
<future commands/actions and required output paths>

## Dependency And Resume Gate
<predecessor tasks, prerequisite result JSON/HANDOFF paths, resume probe, skip/rerun rule>

## Stop Prevention Rules
<do not stop after planning; implement/test/repair/write durable evidence/exit; no permission handoff for task-local safe work>

## Failure To Repair Routing
<how REPAIR_REQUIRED/HARD_FAIL/BLOCKED statuses become repair tasks, blockers, or final-gate input>

## 输出文件
<files this task must create/update during later execution>

## 结果 JSON
<docs/auto-execute/results/<TASK-ID>.json>

## HANDOFF
<docs/auto-execute/latest/<TASK-ID>-HANDOFF.md>

## 失败状态
<allowed non-pass statuses and what each means>
```

Task documents must be project-specific. They must name the exact requirement IDs, UI IDs, API IDs, DB entities, owner scenario IDs, commands, and evidence paths they cover. A task that only repeats generic standards is not ready for auto-execute.

Task documents for external data must additionally name exact table/entity IDs, field names, source model fields, sample payloads, unique-key rules, duplicate-run expectations, failed-write cache paths, and readback evidence paths.

T00 is mandatory. It must be generated as `tasks/T00-omx-auto-execute-orchestrator.md` and must be orchestration-only. T00 must not implement product code. T00 must require the later executor to read the master plan, inspect durable state, run each task in order with one fresh `codex exec`, wait for the worker to exit, verify result JSON/log/HANDOFF, route failures to repair, and run the final gate using only durable evidence.

For one-to-one UI reconstruction tasks, each task must additionally name:

- source UI reference IDs and absolute or project-relative reference paths;
- target route, viewport, and page state;
- extracted design-token requirements the implementation must honor;
- local fixture/API/DB setup required to render that state;
- actual capture artifact path;
- reference/actual/diff/metrics/summary artifact paths;
- allowed deviations and forbidden redesigns;
- repair rule for material visual differences;
- status rule: missing raster screenshot or pixel-diff proof cannot become pure PASS.

## Task Granularity Rules

- One task must have one primary acceptance surface.
- Split large pages, complex forms, admin workflows, and payment/cloud boundaries into separate tasks.
- Do not hide multiple P0 pages inside one "frontend" task.
- Do not hide multiple unrelated API domains inside one "backend" task.
- Add separate verification tasks for all-page runtime proof, all-API proof, visual comparison proof, simulated-user click proof, frontend test proof, backend test proof, and frontend/backend contract proof.
- Add separate verification tasks for external data field mapping, payload generation, upsert/idempotency, failure-cache/replay, and independent readback proof when external data writes exist.
- Do not collapse "click all pages" into a generic owner E2E task. The owner task must list exact click steps and expected route/API/DB/UI evidence.
- A final gate task cannot implement missing product behavior; it can only verify or report blockers.

## Required Verification Task Types

Every full-stack task pack must include tasks that require a later executor to:

- run the project locally with frontend and backend start commands;
- open or navigate to every frontend page;
- compare every P0 page against the provided UI reference one-to-one;
- run frontend tests;
- run backend tests;
- run frontend/backend contract tests;
- test every backend API with explicit standards for success, validation failure, auth failure, not found, server error or fallback behavior, request shape, response shape, and DB mutation/readback if applicable;
- run a simulated user journey that clicks every P0 page, tab, card, button, modal, and main workflow action;
- validate every P0 external data table/entity with exact payload, upsert, duplicate-run, failure-cache, replay, and readback evidence;
- capture screenshots, traces, API logs, DB readback JSON, and final report artifacts.

For UI reconstruction, evidence must include either:

- real reference/actual raster screenshots plus diff/metrics artifacts; or
- deterministic structural capture artifacts plus an explicit `PASS_NEEDS_MANUAL_UI_REVIEW` or `PASS_WITH_LIMITATION` verdict and a follow-up task that replaces them with real raster proof.

Structural captures, SVG overlays, DOM snapshots, and manual notes are useful evidence, but they do not prove pixel-perfect PASS by themselves.

## Owner Scenario Matrix

Final packs must include owner journey tasks. Each row must include:

- scenario ID;
- owner persona intent;
- preconditions and seed data;
- exact click steps;
- expected route, modal, toast, table change, or visible state;
- expected API method/path and payload summary;
- expected local DB mutation/readback;
- screenshot, trace, log, or JSON evidence path;
- status and blocker notes.

Owner journeys must cover:

- happy path;
- unauthenticated redirect;
- empty data;
- invalid upload rows;
- duplicate import;
- insufficient data or missing cost;
- risk boundary cases;
- task state changes;
- publish before/after;
- API 401/404/500/timeout;
- every clickable P0 page/card/button/tab;
- every P0 modal, form submit, navigation element, and workflow action;
- DB readback;
- visual comparison;
- local-only safety.

## Final Gate Rule

Pure PASS is allowed only in later execution when every P0 owner scenario has route, API, visible UI, and DB evidence. Missing any P0 proof means the final verdict is not pure PASS.

The generated final gate must fail closed when:

- any required future task result JSON is missing;
- any P0 task is `REPAIR_REQUIRED`, `HARD_FAIL`, or `BLOCKED_BY_MISSING_SOURCE`;
- any P0 owner scenario lacks click, route, API, DB, or visible UI proof;
- visual evidence is missing for required UI references;
- visual evidence is structural-only while the user requested one-to-one or pixel-perfect reproduction;
- any frontend page was not run or navigated to;
- any backend API lacks an explicit test standard and execution result;
- any P0 external data table/entity lacks exact field mapping, payload proof, upsert/idempotency proof, failed-write cache/replay proof, or independent readback/mock-readback proof;
- frontend tests, backend tests, or frontend/backend contract tests are missing;
- the simulated owner did not click all required pages and controls;
- secret guard or report-integrity checks fail;
- real cloud/payment/production data was touched without explicit permission.

## Task-Pack Quality Audit Must Include

Generate `<slug>-task-pack-quality-audit.md` after all other docs. The audit is the generator's own quality gate and must include:

- document completeness checklist;
- source-path and UTF-8 integrity audit;
- language/locale fidelity audit;
- requirement traceability audit;
- UI/page/control/click audit;
- API/DB test-standard audit;
- external data field-mapping/upsert/readback audit;
- owner scenario exact-click audit;
- T00 anti-stop orchestration audit;
- full post-generation task executability audit for every task after all tasks are written;
- task specificity audit;
- generation-boundary audit;
- final-gate strictness audit;
- regeneration blockers.

The audit verdict must be one of:

- `READY_FOR_AUTO_EXECUTE`: all required standards and task docs are concrete and complete;
- `NEEDS_REGENERATION`: the pack is too generic, incomplete, corrupt, or contains forbidden generation-phase execution artifacts;
- `BLOCKED_BY_MISSING_SOURCE`: required PRD/UI/code source is unavailable.

If the audit verdict is not `READY_FOR_AUTO_EXECUTE`, the skill must report the blocker and must not describe the pack as ready.
