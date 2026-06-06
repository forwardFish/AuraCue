# AuraCue auto-execute Codex Exec 执行入口提示词

> 生成日期：2026-05-26  
> 项目根目录：`D:\lyh\agent\agent-frame\AuraCue`  
> 需求文档：`D:\lyh\agent\agent-frame\AuraCue\docs\AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md`  
> UI 截图目录：`D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序`  
> UI 代码参考：`D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序\stitch_codex_ui_code_generator`  
> 任务目录：`D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-tasks`  
> 执行方式：从 `T00` 串行执行到 `T25`，每个 Task 必须单独启动一个 fresh `codex exec`，该 Task 完成并写出 result JSON + HANDOFF 后，旧 `codex exec` 必须完全退出，再启动下一个 Task。

本文档是给 `auto-execute` / `codex exec` 使用的执行入口，不是完成报告。没有当前工作树的新日志、JSON、截图、测试结果、DB readback 或 HANDOFF，不允许写 `PASS`。

## 一句话执行目标

把 AuraCue MVP 做成可本地运行、可验收的微信小程序体验验证版：前端页面必须一比一复刻 `docs\UI\小程序` 的 P0 UI；所有页面都必须有模拟测试；所有 P0 API、DB 读回、前后端合同、视觉对比、owner 全点击路径、local-only guard、secret guard 和最终验收报告都必须有证据。

## 总原则

- 本入口只负责调度 `T00` 到 `T25`；不要跳任务，不要合并任务。
- 一个 Task 只能交给一个 fresh `codex exec` worker。
- 每个 worker 只能执行一个任务文档。
- 每个 worker 完成后必须写：
  - `docs/auto-execute/results/<TASK-ID>.json`
  - `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`
  - 任务要求的 logs / traces / screenshots / api / db evidence。
- 当前 Task 的 result JSON 和 HANDOFF 不存在时，禁止启动下一个 Task。
- worker 完成当前 Task 后必须退出；下一个 Task 必须由新的 `codex exec` 执行。
- 所有 worker 必须先读 `AGENTS.md`，再读本入口、任务文档、标准文档和相关矩阵。
- 默认不提交、不推送；commit/push 需要用户另行明确要求。
- 不允许真实微信支付、真实云写入、生产数据库、生产 AI 服务调用或生产 analytics。MVP 必须 local/mock first。
- UI 一比一复刻以 PNG 截图为视觉真相，以 Stitch HTML/CSS 为结构和 token 参考。
- 没有真实截图、actual capture、diff/metrics 时，视觉结论最多只能是 `PASS_NEEDS_MANUAL_UI_REVIEW` 或更弱。
- `READY_FOR_AUTO_EXECUTE` 只代表任务包可执行，不代表产品完成。

## 必须先读取的总控文档

| 文档 | 用途 |
| --- | --- |
| `docs/auto-execute/auracue-delivery-standard-index.md` | 总入口、证据路径、状态词、false PASS 规则 |
| `docs/auto-execute/auracue-auto-execute-master-plan.md` | T00-T25 总任务计划 |
| `docs/auto-execute/auracue-development-standard.md` | 开发标准 |
| `docs/auto-execute/auracue-software-test-standard.md` | 测试标准 |
| `docs/auto-execute/auracue-requirement-traceability-matrix.md` | 需求追踪矩阵 |
| `docs/auto-execute/auracue-ui-reference-map.md` | UI 一比一映射 |
| `docs/auto-execute/auracue-api-db-contract-matrix.md` | API/DB 合同矩阵 |
| `docs/auto-execute/auracue-standard-test-plan.md` | 标准测试计划 |
| `docs/auto-execute/auracue-owner-scenario-matrix.md` | owner 全点击场景 |
| `docs/auto-execute/auracue-final-acceptance-gate.md` | 最终验收门 |
| `docs/auto-execute/auracue-task-pack-quality-audit.md` | 任务包生成端质量审计 |

## 任务执行顺序

| Order | Task | Task 文档 |
| --- | --- | --- |
| 1 | T00 | `docs/auto-execute/auracue-tasks/T00-intake-source-inventory-harness-decision.md` |
| 2 | T01 | `docs/auto-execute/auracue-tasks/T01-scaffold-mini-program-backend-shared-workspace.md` |
| 3 | T02 | `docs/auto-execute/auracue-tasks/T02-extract-ui-tokens-and-asset-inventory.md` |
| 4 | T03 | `docs/auto-execute/auracue-tasks/T03-local-db-repository-and-seed-fixtures.md` |
| 5 | T04 | `docs/auto-execute/auracue-tasks/T04-generation-job-and-structured-card-api.md` |
| 6 | T05 | `docs/auto-execute/auracue-tasks/T05-card-result-and-entitlement-read-apis.md` |
| 7 | T06 | `docs/auto-execute/auracue-tasks/T06-mock-unlock-payment-invite-apis.md` |
| 8 | T07 | `docs/auto-execute/auracue-tasks/T07-save-share-renderer-analytics-apis.md` |
| 9 | T08 | `docs/auto-execute/auracue-tasks/T08-mini-program-shell-routes-state-api-client.md` |
| 10 | T09 | `docs/auto-execute/auracue-tasks/T09-home-page-one-to-one.md` |
| 11 | T10 | `docs/auto-execute/auracue-tasks/T10-scene-energy-selection-pages.md` |
| 12 | T11 | `docs/auto-execute/auracue-tasks/T11-generation-ritual-and-network-error-pages.md` |
| 13 | T12 | `docs/auto-execute/auracue-tasks/T12-free-preview-locked-result.md` |
| 14 | T13 | `docs/auto-execute/auracue-tasks/T13-unlock-and-invite-pages.md` |
| 15 | T14 | `docs/auto-execute/auracue-tasks/T14-mock-payment-states.md` |
| 16 | T15 | `docs/auto-execute/auracue-tasks/T15-full-result-page.md` |
| 17 | T16 | `docs/auto-execute/auracue-tasks/T16-share-and-save-pages.md` |
| 18 | T17 | `docs/auto-execute/auracue-tasks/T17-share-card-renderer.md` |
| 19 | T18 | `docs/auto-execute/auracue-tasks/T18-analytics-and-safety-copy-guard.md` |
| 20 | T19 | `docs/auto-execute/auracue-tasks/T19-all-page-simulated-tests.md` |
| 21 | T20 | `docs/auto-execute/auracue-tasks/T20-all-api-db-readback-tests.md` |
| 22 | T21 | `docs/auto-execute/auracue-tasks/T21-frontend-backend-contract-tests.md` |
| 23 | T22 | `docs/auto-execute/auracue-tasks/T22-visual-one-to-one-capture-and-diff.md` |
| 24 | T23 | `docs/auto-execute/auracue-tasks/T23-visual-repair-loop.md` |
| 25 | T24 | `docs/auto-execute/auracue-tasks/T24-simulated-owner-e2e-full-click-journey.md` |
| 26 | T25 | `docs/auto-execute/auracue-tasks/T25-final-acceptance-gate-and-delivery-report.md` |

## 调度器必须执行的流程

对上表每一个 Task，严格执行：

1. 确认当前 Task 文档存在。
2. 如果不是 T00，确认前一个 Task 的 result JSON 和 HANDOFF 存在。
3. 启动一个新的 `codex exec`，只执行当前 Task 文档。
4. 当前 worker 必须按 Task 文档完成实现、测试、证据、result JSON、HANDOFF。
5. 等当前 `codex exec` 完全退出。
6. 检查当前 Task 的 result JSON 和 HANDOFF。
7. 若缺失 result JSON 或 HANDOFF，立即停止队列，不得启动下一个 Task。
8. 若当前 Task 状态是 `REPAIR_REQUIRED`、`HARD_FAIL`、`BLOCKED_BY_ENVIRONMENT` 或 `BLOCKED_BY_MISSING_SOURCE`，按 `auto-execute` 规则先尝试在当前 Task 边界内修复；无法修复时停止并写明 blocker，不得伪造完成。
9. 只有当前 Task 证据完整且 worker 已退出，才能启动下一个 fresh `codex exec`。

## 单个 Task worker 的统一提示词模板

调度器对每个 Task 启动 worker 时，使用这个模板，把 `<TASK_DOC_ABSOLUTE_PATH>` 替换为当前任务文档绝对路径，把 `<TASK_ID>` 替换为任务编号：

```text
Use the auto-execute skill.

Project root: D:\lyh\agent\agent-frame\AuraCue

Execute only this task document:
<TASK_DOC_ABSOLUTE_PATH>

Treat this as one fresh task boundary for <TASK_ID>.

Before editing or testing, read:
- D:\lyh\agent\agent-frame\AuraCue\AGENTS.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-codex-exec-prompts.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-development-standard.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-software-test-standard.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-requirement-traceability-matrix.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-reference-map.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-api-db-contract-matrix.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-owner-scenario-matrix.md
- D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-final-acceptance-gate.md

Rules:
- Execute only <TASK_ID>; do not start the next task.
- Stay within the task allowed files.
- Preserve the user requirement that the WeChat mini-program UI must one-to-one reproduce D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序.
- Every page implemented by this task must have simulated tests.
- Use local/mock payment, AI, analytics, storage, and DB unless a task explicitly says otherwise.
- Do not use real WeChat Pay, real cloud writes, production DB, production AI, production analytics, or secrets.
- Do not claim PASS without evidence.
- If visual screenshot/diff evidence is unavailable, use PASS_NEEDS_MANUAL_UI_REVIEW or a stricter non-PASS status.
- At the end, write D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\results\<TASK_ID>.json.
- At the end, write D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\latest\<TASK_ID>-HANDOFF.md.
- Include changed files, commands run, evidence paths, blockers, and next-step notes in the HANDOFF.
- After writing result JSON and HANDOFF, exit this codex exec completely.
```

## 最终完成标准

只有 T25 能写最终交付报告。最终报告路径：

`D:\lyh\agent\agent-frame\AuraCue\docs\AUTO_EXECUTE_DELIVERY_REPORT.md`

T25 之前的任何任务都不能把产品说成最终完成。T25 也必须按 `auracue-final-acceptance-gate.md` 失败关闭：

- 任一 P0 requirement 缺 evidence -> `REPAIR_REQUIRED`
- 任一 P0 page/control 没有模拟点击证据 -> `REPAIR_REQUIRED`
- 任一 P0 API 没有 API/DB readback -> `REPAIR_REQUIRED`
- 任一 P0 UI 没有 reference/actual/diff/metrics -> `REPAIR_REQUIRED` 或 `PASS_NEEDS_MANUAL_UI_REVIEW`
- 只有结构化 UI 证据、没有真实 raster 截图/diff -> 不能纯 PASS
- local-only guard / secret guard / report-integrity 失败 -> `HARD_FAIL`

## 给用户的单条启动提示

如果用户要求开始执行，调度器读取本文件后直接开始 T00，不要再要求用户手动确认每个 Task。
