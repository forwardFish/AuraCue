---
name: task-auto-execute
description: Global task-pack generator for auto-execute. Use when the user provides PRD/requirements and UI references/screenshots for any project and wants Codex to split the work into detailed auto-executable markdown task documents. This skill only generates the task pack and future execution prompts; it must not execute code, run auto-execute, start apps, click pages, call APIs, or modify product code.
---

# Task Auto Execute

## Purpose

Generate a detailed software delivery standard pack and auto-execute task pack for any project from PRD/docs/UI references. This skill only creates markdown standards, planning/task documents, and future auto-execute prompts. It does not run the generated task queue.

Primary template: always read and follow `references/codex-exec-standard-template.md` before generating a task pack. That template is the standard structure for `<slug>-codex-exec-prompts.md`, split `codex exec` commands, T00 orchestration, task documents, quality audit, and skill usage instructions. If the generated pack does not satisfy that template, the pack is not ready.

Software task template gate: always read and follow `references/task-archetype-templates.md`, `references/software-dev-task-templates.md`, and the exact independent template file under `references/templates/<Task Template ID>.md` before splitting tasks. The archetype file is the valid ID index; the software-dev file is the classification catalog; the independent `references/templates/TPL-*.md` file is the task-level source of truth. Every generated task must first select a `Task Template ID`, then fill the matching independent template with project facts. A task without a template selection, template rationale, primary acceptance surface, covered requirement/UI/API/DB/owner IDs, or matching independent template file is not executable enough and must make the quality audit verdict `NEEDS_REGENERATION`.

This is a global skill. Do not assume the target project is `xwstarmap` unless the current working directory or the user says so. `xwstarmap` is only the origin project that proved the pattern; the generated output must always be project-local to the user's target repo.

Hard boundary: `task-auto-execute` is a task-pack generator only. Do not execute implementation code, do not call `codex exec`, do not start frontend/backend servers, do not click pages, do not call APIs, do not write database records, and do not modify product code as part of this skill. Those actions must appear only as requirements inside the generated task documents for a later `auto-execute` run.

This skill is a software delivery standard generator. It generalizes the xwstarmap pattern:

- international-standard-inspired delivery lifecycle;
- standardized software development rules;
- standardized software testing rules;
- standardized acceptance and evidence rules;
- detailed task decomposition;
- one markdown document per task;
- future auto-execute implementation and verification requirements;
- local-only backend/cloud/payment safety;
- full frontend page coverage;
- all backend API coverage;
- row-level external data validation for storage, spreadsheet, database, and SaaS-write integrations;
- small-business-owner scenario testing;
- page click -> route -> API -> DB mutation/readback -> visible UI proof;
- visual one-to-one comparison before final acceptance.
- reference-first UI reconstruction: source image inventory -> design token extraction -> route/component mapping -> implementation slice -> actual capture -> diff/metrics/manual-review artifact -> repair loop.
- anti-stop orchestration: generated T00 must verify each fresh worker exit, result JSON, logs, HANDOFF, and repair routing before moving on.
- locale fidelity: when the project is Chinese or the user requires Chinese, all user-facing pages, generated documents, business copy, spreadsheet/table names, and external data field names must be Chinese and UTF-8 clean.

## Standard Basis

Use this practical standard stack when generating documents:

- lifecycle and traceability: ISO/IEC/IEEE 12207 style software lifecycle process;
- product quality: ISO/IEC 25010 style quality model;
- testing process and documentation: ISO/IEC/IEEE 29119 style test process;
- secure development: NIST SSDF and OWASP ASVS style requirements;
- web accessibility: WCAG 2.2 style checks when the product has web UI;
- API contract: OpenAPI-style method/path/schema/error contract;
- delivery evidence: DORA-style lead time/recovery/change-failure awareness, adapted as local evidence rather than organization metrics.

Do not claim formal certification or compliance. Use these standards as a practical checklist and documentation structure.

## Workflow

### 0. Decide Scope

Use this skill when the user wants a reusable task pack, not a one-off implementation note. The normal output is a set of project-local documents under `docs/auto-execute/` that `auto-execute` can run later.

Before editing, identify:

- target project root;
- PRD/requirement source files;
- UI reference source files or screenshots;
- frontend app locations;
- backend/API/server locations;
- database/storage/payment/cloud boundaries;
- future execution constraints and verification surfaces.

If the user says this is "global", update this global skill or generate a reusable global-style task pack. Do not narrow the behavior to the current repo's hardcoded pages unless the user explicitly scopes it to the current repo.

If the user asks this skill to execute code, keep the skill boundary intact: generate or update the task pack so a separate `auto-execute` run can execute it later, and state that this skill itself does not execute.

### 1. Gather Inputs

Use the current project root unless the user gives another root. Read:

- `AGENTS.md`;
- provided PRD/requirement docs;
- provided UI screenshots/design folders/HTML prototypes;
- existing source code, if any;
- reference projects the user names.

Build an evidence inventory before task splitting:

- requirement inventory: every P0/P1 function, role, page, data rule, and non-functional requirement;
- UI inventory: every screen, state, modal, tab, button, upload area, table, empty/error state, and navigation edge;
- backend inventory: every route, method, request DTO, response DTO, auth rule, side effect, database table/collection, and external service boundary;
- acceptance inventory: tests, local data fixtures, visual references, browser/miniprogram harnesses, API probes, DB readback probes, and report paths.

If a required source is missing, create a blocker in the task pack rather than guessing silently. Missing evidence cannot become pure PASS later.

### 1.05. Task Template Selection Gate

Before writing task files, classify every planned task with `references/task-archetype-templates.md`, then read the matching independent template file from `references/templates/<Task Template ID>.md` and fill its detailed fields. Use `references/software-dev-task-templates.md` as the classification catalog and historical rationale, not as a replacement for the independent template file.

Each task row in the master plan and each generated task document must include:

- `Task Template ID`;
- task type;
- primary acceptance surface;
- why this template fits;
- covered requirement IDs, UI IDs, API IDs, DB/external-data IDs, and owner scenario IDs;
- optional secondary templates if the task needs supporting checks.

Do not generate a task from a blank generic structure. First select the template, read `references/templates/<Task Template ID>.md`, then fill the required fields for that template. If no existing template fits, create a project-specific template entry in the generated pack and mark the task-pack quality audit with the reason. If a task is missing template selection, the selected template file is missing, or the selected template does not match the task content, the audit verdict must be `NEEDS_REGENERATION`.

### 1.06. Template Content Accuracy Gate

Template selection is not enough. Before generating each task, compare the selected independent template against the actual historical/project task shape and decide whether the template content is accurate enough to drive execution.

For every task, verify:

1. The selected template's `适用场景` and `不适用场景` match the task. If the task falls into a forbidden or adjacent category, reselect the template.
2. The task can fill the template's required opening fields: `Task Template ID`, task type, primary acceptance surface, template rationale, covered IDs, and secondary templates.
3. Every required input in the template maps to a concrete project file, source document, command, fixture, or explicit `BLOCKED_BY_MISSING_SOURCE`.
4. Every acceptance criterion maps to a verification command and durable evidence path. A criterion without evidence is not executable enough.
5. Every possible incomplete proof has an honest status rule such as `PASS_WITH_LIMITATION`, `PASS_NEEDS_REFERENCE`, `PASS_NEEDS_MANUAL_UI_REVIEW`, `REPAIR_REQUIRED`, or `BLOCKED_BY_ENVIRONMENT`.
6. Template-specific traps are handled: visual tasks need real reference/actual/diff/metrics rules; mini-program tasks must distinguish real WeChat runtime from local mock preview; API/DB tasks need independent readback; Chinese tasks need UTF-8 and copy preservation checks.

If the independent template is too thin, too generic, missing the task's real proof chain, or cannot produce the result JSON/HANDOFF/evidence required by the task, strengthen or add the template before generating task files. The quality audit must mark the pack `NEEDS_REGENERATION` or `NEEDS_TEMPLATE_REPAIR` until this is fixed.

When available, run:

```powershell
python <skill-root>\scripts\audit-template-content-quality.py --template-dir <skill-root>\references\templates
```

Treat failures for a selected task template as blockers for task generation, not as optional suggestions.

### 1.1. Language And Encoding Gate

Before task splitting, determine the project language from direct user instructions first, then PRD/docs/UI references. If the user says the project is Chinese, or the PRD/docs/UI are Chinese, set `project_language=zh-CN`.

For `project_language=zh-CN`, generated packs must obey:

1. Generated project documents must use Chinese headings and Chinese business descriptions. English technical identifiers such as `codex exec`, `pytest`, API method names, file paths, env var names, and Python module names may remain English.
2. Task documents must describe implementation scope, inputs, allowed files, forbidden actions, acceptance criteria, dependency/resume gates, stop-prevention rules, and failure routing in Chinese.
3. User-facing page text, report text, alert text, README/operator docs, and Feishu/Bitable table and field names must be Chinese.
4. Feishu/Bitable field names must preserve the exact Chinese business field names from the PRD, not pinyin, English aliases, mojibake, or placeholder labels.
5. All generated markdown must be valid UTF-8 without BOM and must not contain mojibake markers such as `�`, `锛`, `鈥`, `涓`, `浠`, `娣`, or replacement-question output caused by console encoding.
6. The quality audit must include a language/encoding section. If Chinese language fidelity fails, the verdict must be `NEEDS_REGENERATION`.

Do not use the terminal's visual rendering as proof of Chinese correctness on Windows. Verify by reading files as UTF-8 and, when needed, checking Unicode code points or JSON keys directly.

### 1.25. Anti-Stop Execution Design

When the user says prior generated tasks stopped, errored, were not executable, or must be completed "in one go", the generated pack must strengthen orchestration instead of only adding more tasks.

The pack must include:

1. A first task named `T00-omx-auto-execute-orchestrator.md`. T00 is orchestration only: it reads the whole pack, checks task order, verifies prerequisites, launches exactly one fresh future `codex exec` per task, waits for that process to exit, verifies result JSON/log/HANDOFF existence, classifies the verdict, and only then starts the next task.
2. A master-plan dependency table. Every task row must list predecessor tasks, unblock condition, required result JSON, required HANDOFF, and repair behavior.
3. A resume probe. T00 must inspect `docs/auto-execute/results/`, `docs/auto-execute/latest/`, `docs/auto-execute/blockers.md`, and `docs/auto-execute/repair-queue.md` before launching or relaunching a task.
4. A fail-forward repair rule. If a task returns `REPAIR_REQUIRED` or `HARD_FAIL`, T00 must route the failure to the smallest repair task or append a new repair task, then continue until final gate or a genuine `BLOCKED_BY_ENVIRONMENT` / `BLOCKED_BY_MISSING_SOURCE`.
5. A no-silent-stop rule. Every future worker prompt must require a result JSON and HANDOFF even on failure, and must forbid ending with only chat text.
6. A no-permission-handoff rule for already-requested local, reversible implementation and verification steps. Worker prompts must not ask "should I continue?" for task-local work.
7. A final gate that reads durable files only. Chat claims, dry-run helper output, and planned task rows are not completion evidence.

Task docs must include "Dependency And Resume Gate", "Stop Prevention Rules", and "Failure To Repair Routing" sections. If these sections are missing, the task-pack quality audit verdict must be `NEEDS_REGENERATION`.

### 1.75. External Data And Spreadsheet Validation

When the PRD includes external data writes, spreadsheets, Bitable/Airtable/Notion, database persistence, local cache replay, or user says data correctness is most important, the generated pack must include row-level data validation as a first-class acceptance surface.

The pack must create or strengthen:

- `<slug>-external-data-validation-matrix.md`: one row per target table/entity and one row per write/readback case.
- `api-db-contract-matrix`: include storage adapter methods, table IDs/env vars, unique keys, idempotency, retry, pending-cache behavior, and readback expectations.
- `standard-test-plan`: include local mock write, real-write dry-run/sandbox gate where allowed, duplicate-run upsert, failed-write pending cache, corrupted payload rejection, and independent readback rows.
- task docs: include data fixture, expected outbound payload, expected saved fields, expected unique key, expected readback JSON, duplicate-run behavior, and failure status.
- final gate: pure PASS is impossible without evidence that every P0 table/entity has correct fields, correct values, correct unique keys, no duplicate records, no failure-as-zero metric pollution, and readback or mock-readback proof.

For Feishu Bitable specifically, require:

1. A table-by-table matrix for `system_config`, `shop_config`, `monitor_snapshot`, `orders_raw`, `promotion_snapshot`, `metrics_10min`, `task_run_log`, `alert_log`, and `daily_report` when present in the PRD.
2. Field mapping with the exact Chinese field names from the source document, canonical internal model fields, Feishu field type, sample value, nullability, and validation rule.
3. `unique_key` upsert proof for every snapshot/log table where the PRD requires deduplication.
4. A local Feishu fake/storage double that records create/update/list calls and supports independent readback without calling real Feishu unless explicitly authorized.
5. A real-credential guard: missing Feishu secrets must not block local acceptance; they must route to local mock/sandbox proof and `PASS_WITH_LIMITATION` only if real write proof is explicitly required but unavailable.
6. Failure handling tests proving failed collection values remain `None`/failure status and are not written as `0`.
7. Pending cache tests proving failed Feishu writes are written to local pending storage and replayed later.
8. Duplicate-run tests proving rerunning the same collection window updates records by `unique_key` instead of creating duplicate rows.

### 1.5. One-To-One UI Reconstruction Method

When the user asks for "one-to-one", "pixel-perfect", "复刻", "一比一复刻", "按图还原", or provides UI screenshots/design folders, the generated pack must include a dedicated reconstruction method instead of a vague visual comparison note.

This method is how the earlier scoremap-style implementation worked:

1. Treat the UI reference as the visual source of truth after direct user instructions. Map every screenshot/prototype to a route, page state, viewport, required controls, data dependencies, and owner scenario.
2. Extract design tokens before implementation: canvas size, spacing scale, typography scale, color palette, corner radii, shadows, borders, icon/image assets, component density, and page-level layout rhythm.
3. Split implementation by screen and state, not by generic frontend layers. A page task must name the exact UI reference IDs it reproduces and the route/state that should render them.
4. Build data fixtures and local API/DB responses that make the target state visible. A visually correct empty shell is not acceptable for a business screen that needs loaded, empty, error, locked, paid, or report states.
5. Capture actual output from the local app or mini-program-compatible harness at the target viewport. If the environment cannot produce raster screenshots, require deterministic structural captures plus an explicit `PASS_NEEDS_MANUAL_UI_REVIEW` limitation, and assign a later task to replace it with real screenshot/pixel-diff evidence.
6. Compare reference vs actual with visible artifacts: reference path, actual capture, diff artifact, metrics JSON, and summary JSON. The summary must list material deviations and route them to repair tasks.
7. Iterate until the final gate has either real visual proof for every P0 UI reference or an honest non-PASS state. Do not upgrade structural SVG/diff evidence into pixel-perfect PASS.

For one-to-one UI work, the generated task pack must add or strengthen these documents:

- `ui-reference-map`: include viewport, source dimensions, token notes, required assets, target route/state, controls, data fixture, capture command, actual artifact, diff artifact, metrics artifact, allowed deviation, and status.
- `development-standard`: require shared design tokens and forbid unrelated redesign, generic dashboards, placeholder cards, oversized marketing-style UI, and copy drift from the supplied reference.
- `software-test-standard`: require reference/actual/diff/metrics artifacts for every P0 UI target and require the final visual verdict to fail closed when evidence is missing.
- `standard-test-plan`: include a visual reconstruction row for each reference/state and repair rows for material differences.
- task docs: include exact reference IDs, exact route/state, fixture setup, capture command, comparison command, artifact paths, allowed deviation, and the status rule for missing raster proof.
- final gate: pure PASS requires visual evidence for every P0 UI reference; missing or structural-only proof must remain `PASS_NEEDS_MANUAL_UI_REVIEW`, `PASS_WITH_LIMITATION`, or `REPAIR_REQUIRED`.

### 2. Create The Task Pack

Create or update these project-local files:

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
docs/auto-execute/<slug>-tasks/
```

Use `references/codex-exec-standard-template.md` first as the executable mother template. Use `references/task-archetype-templates.md`, `references/software-dev-task-templates.md`, and the matching files under `references/templates/` before splitting any task. Then use `references/task-pack-contract.md` for the required structure and `references/document-templates.md` for supporting document templates.

Every generated document must be concrete for the target project. Do not leave generic standard text without project-specific routes, APIs, data entities, pages, tasks, or blockers. If information is missing, write `BLOCKED_BY_MISSING_SOURCE` rows instead of inventing facts.

Generation-phase boundary:

- Do not create `docs/auto-execute/results/*.json`.
- Do not create `docs/auto-execute/latest/*HANDOFF.md`.
- Do not create execution evidence such as screenshots, API transcripts, DB readbacks, or PASS logs.
- Do not mark any generated task as `PASS`, `VERIFIED`, or completed.
- All generated implementation/verification rows must start as `PLANNED`, `BLOCKED_BY_MISSING_SOURCE`, or `OUT_OF_SCOPE_WITH_REASON`.
- Use UTF-8 for all generated markdown and preserve Chinese filenames and business copy exactly.

The development standard and software test standard are mandatory. This skill exists to turn the user's PRD/UI into a repeatable delivery standard, not only a task list.

The development standard must define:

- source-of-truth order: PRD, UI references, existing code, local AGENTS.md, and explicit user constraints;
- feature implementation rules;
- frontend page/component rules;
- backend API and database rules;
- external data/spreadsheet/storage validation rules when present;
- frontend/backend contract rules;
- local-only cloud/payment/external-service safety;
- file ownership and allowed-change boundaries;
- evidence and handoff rules;
- false-completion prohibitions.

The software test standard must define:

- how to run the project locally in a later execution run;
- frontend page-render and navigation standards for every page;
- visual one-to-one comparison standards against every UI reference;
- simulated-user click standards covering every P0 page, tab, card, button, modal, form, and workflow action;
- frontend unit/component/integration standards;
- backend unit/integration standards;
- all-API test standards for method/path, auth, request, response, validation, errors, side effects, and DB readback;
- frontend/backend contract standards;
- data persistence and DB readback standards;
- external data write/readback standards for spreadsheet/Bitable/SaaS storage integrations;
- report integrity, secret guard, and final gate standards.
- one-to-one UI reconstruction standards when UI references exist: token extraction, fixture-backed target states, viewport-specific capture, reference/actual/diff/metrics artifacts, repair routing, and honest non-PASS statuses when raster proof is unavailable.

The delivery standard index must explain how all generated documents connect:

- which docs define the standard;
- which docs map requirements/UI/API/DB;
- which docs define future execution;
- which docs prove final acceptance;
- how a later `auto-execute` worker must move from task to task.

The task-pack quality audit is mandatory. It must inspect the generated pack before the skill reports completion and must fail the pack as `NEEDS_REGENERATION` if any of these are true:

- a task document is generic/template-like rather than project-specific;
- a P0/P1 requirement lacks implementation task, verification task, or evidence path;
- a UI reference lacks route/page mapping, controls, click expectations, visual evidence target, or owner scenario coverage;
- an API lacks method/path-specific success, validation, auth, not-found/error, side-effect, and DB readback standards;
- an external data table/entity lacks exact field mapping, unique-key/upsert expectations, duplicate-run proof, failure-cache proof, and readback evidence path;
- a simulated-user scenario does not list exact clicks and expected route/API/DB/UI evidence;
- a final gate can pass without every P0 page/API/DB/UI/owner evidence item;
- T00 orchestration, dependency/resume gates, stop-prevention rules, or failure-to-repair routing are missing;
- the generated pack contains execution evidence, result JSON, HANDOFF, or `PASS` statuses created by this documentation-only skill;
- Chinese source paths or business copy are mojibake/corrupted.

Task documents must be very detailed and execution-ready. Do not generate short, thin task documents that only contain a goal and one test command. Every task must follow the 12-section task block in `references/codex-exec-standard-template.md` and needs:

- task template selection section with `Task Template ID`;
- template rationale and primary acceptance surface;
- `Codex Exec` command;
- implementation scope;
- allowed files;
- forbidden actions;
- required inputs;
- functional acceptance criteria;
- detailed acceptance criteria;
- local-only safety checks;
- tests and commands;
- dependency and resume gate;
- stop-prevention rules;
- failure-to-repair routing;
- output files;
- result JSON path;
- handoff path;
- failure statuses.

Each task must be small enough for one fresh `codex exec` run to implement and verify without losing the thread. Split by acceptance surface, not by vague engineering layers.

Execution lifecycle rule for generated prompts: every task must run in a new `codex exec` process. After a task finishes, the old `codex exec` process must be allowed to exit completely and write its result JSON, logs, and HANDOFF before the next task starts. Do not keep one long-running `codex exec` session alive across multiple task documents.

Every future `codex exec` prompt must explicitly say: "Do not stop after planning. Implement, test, repair, write result JSON, write HANDOFF, and exit. If blocked, classify the blocker in durable files and route to repair; do not end with only a chat status."

### 3. Required Task Categories

The pack must include enough tasks to fully deliver the project. Do not force exactly 10 tasks. Prefer smaller, clearer tasks.

For full-stack products with UI references, include at least:

- delivery-standard-index;
- intake/harness;
- requirement normalization;
- UI visual target mapping;
- reference-project architecture mapping, when relevant;
- project scaffold;
- backend adapter/auth/cloud/payment foundation;
- external data/storage schema and validation foundation;
- domain APIs;
- data import/parsing;
- core business engine;
- frontend shell;
- one task per major frontend page;
- one task per complex modal/stateful component group when it has distinct behavior;
- one or more PC/admin tasks if the PRD requires a backend console;
- contract alignment;
- local full-flow smoke;
- payment/cloud local-only guard;
- visual one-to-one comparison;
- visual reconstruction repair loop for every material reference-vs-actual deviation;
- owner journey scenario plan;
- owner frontend click E2E;
- owner admin/backoffice E2E;
- owner API and DB readback E2E;
- external data write/upsert/readback E2E;
- final owner acceptance gate.

For every P0 page, create or map at least one task that proves:

- the page can render from a clean local run;
- all visible P0 controls are clickable or intentionally disabled;
- each click has an expected route, modal, API call, local state change, or validation message;
- API side effects are asserted by response checks and local DB readback;
- screenshots or truthful manual-review evidence exist for comparison with the UI reference.

For every P0 API, create or map explicit test rows for:

- success;
- request validation failure;
- unauthenticated request;
- unauthorized/ownership failure where applicable;
- not found where applicable;
- duplicate/conflict/idempotency where applicable;
- timeout/server/fallback behavior where applicable;
- expected database mutation and independent readback where applicable;
- frontend caller and owner scenario that exercises it where applicable.

For every P0 external data table/entity, create or map explicit test rows for:

- exact field mapping from internal model to table fields;
- valid write/create;
- valid update/upsert by `unique_key`;
- duplicate-run idempotency;
- missing optional fields;
- missing required fields;
- failed collector result that must not write `0`;
- external write failure to pending cache;
- pending cache replay;
- independent readback from mock/sandbox/real target according to user authorization.

### 4. Future Execution Prompt Only

Do not run the generated commands. The skill may generate a queue file or print future `codex exec` commands for the user or a later automation to run. Use one fresh `codex exec` per task in the generated prompts. Do not merge multiple tasks into one worker. The generated queue must require the previous `codex exec` to finish and close before starting the next task's `codex exec`.

Use the helper to print a queue template when useful. This helper is non-executing by design:

```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.codex\skills\task-auto-execute\scripts\run-task-pack.ps1" `
  -ProjectRoot "<project root>" `
  -TaskDir "<project root>\docs\auto-execute\<slug>-tasks" `
  -DryRun
```

Do not remove `-DryRun` in this skill. The helper must not call `codex exec`; it only prints future commands.

### 5. Small-Business-Owner Acceptance

Always add final acceptance tasks that simulate how a small-business owner would actually use the product. These are not optional polish tasks; they are the final product proof.

The owner scenarios must include:

- first visit and unauthenticated redirects;
- onboarding/login if required;
- core happy path from landing/home to the main business result;
- every P0 page/tab/card/button the owner would naturally click;
- upload/import/data-entry success and failure paths when relevant;
- empty state, partial data, duplicate data, invalid data, and retry flows;
- publish/save/submit/checkout/payment-like flows with local-only safety;
- admin/backoffice review flow when the product has a console;
- refresh/revisit proof that persisted local data is visible again;
- API failure handling for 401, 404, 500, validation error, and timeout;
- DB mutation and DB readback for every P0 business side effect.

Each scenario row must state: persona intent, preconditions, exact clicks, expected route or state, expected API, expected DB mutation/readback, expected visible UI, required screenshot or trace artifact, and pass/fail status.

### 6. Final Acceptance

The generated final acceptance task must require proof of:

- the code can be run locally from a clean start command;
- all frontend pages work;
- every frontend page can be opened or navigated to;
- every P0 page is compared one-to-one against the UI reference with screenshots or a truthful manual-review blocker;
- all backend APIs work;
- every backend API has an explicit test standard covering method/path, auth, request, response, validation, error cases, and DB side effects;
- all P0/P1 requirements have evidence;
- frontend tests pass;
- backend tests pass;
- frontend/backend contract tests pass;
- local-only tests pass;
- simulated owner click journeys pass;
- the simulated owner clicks every P0 page, tab, card, button, modal, and main workflow action;
- page navigation is asserted;
- API calls are asserted;
- all APIs are tested;
- local DB mutations and readbacks are asserted;
- every P0 external data write has payload, upsert, duplicate-run, failure-cache, and readback evidence;
- visual references are compared;
- report integrity and secret guard pass.

If visual screenshots, real browser/miniprogram evidence, or other required proof is missing, report `PASS_NEEDS_MANUAL_UI_REVIEW`, `PASS_WITH_LIMITATION`, `REPAIR_REQUIRED`, or `BLOCKED_BY_ENVIRONMENT` instead of pure PASS.

Pure PASS means the product can run locally end to end after the task queue finishes. A completed implementation without owner click evidence, API evidence, DB readback, and page visual evidence is not pure PASS.

### 7. Quality Audit Before Reporting

Before finalizing a generation run, read the generated docs and produce `<slug>-task-pack-quality-audit.md`.

The audit must include:

- document completeness checklist;
- full task executability audit after all tasks are generated;
- requirement coverage audit;
- UI/page/click coverage audit;
- API/DB test-standard audit;
- external data/table field-mapping and readback audit;
- language and UTF-8/mojibake audit;
- owner scenario exact-click audit;
- task specificity audit;
- dependency/resume/stop-prevention audit for every task;
- generation-boundary audit proving no code execution evidence, result JSON, HANDOFF, or PASS statuses were generated;
- UTF-8/source-path audit;
- final verdict: `READY_FOR_AUTO_EXECUTE`, `NEEDS_REGENERATION`, or `BLOCKED_BY_MISSING_SOURCE`.

Do not report the task pack as ready if the audit verdict is not `READY_FOR_AUTO_EXECUTE`.

When available, run `scripts/audit-task-pack.py` after writing all docs. Treat any `FAIL` item as a regeneration blocker; do not rely on manual spot checks.
