# T00 Source Inventory

Task boundary: T00 intake, source inventory, and harness decision only.

Inventory date: 2026-05-26

## Scope Result

T00 found the required MVP source set for later execution:

- PRD exists at `docs/AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md`.
- P0 UI reference root exists at `docs/UI/小程序`.
- All P0 source screenshots mapped by `auracue-ui-reference-map.md` exist.
- All P0 screenshots are `941x1672`.
- All mapped Stitch implementation references exist under `docs/UI/小程序/stitch_codex_ui_code_generator`.
- P1 sources exist and are explicitly deferred by `docs/UI/小程序/P1/README.md`.
- No product scaffold exists yet; T01 must create the workspace, commands, and local harness surfaces.

This inventory does not claim product completion, visual match, API readiness, DB readiness, or page test completion.

## Control Documents

| Source | Path | Status | Notes |
| --- | --- | --- | --- |
| Workspace instructions | `AGENTS.md` | FOUND | Autonomous execution, verification-first completion, Lore commit protocol. |
| Codex exec prompts | `docs/auto-execute/auracue-codex-exec-prompts.md` | FOUND | Confirms one fresh task boundary per task. |
| Development standard | `docs/auto-execute/auracue-development-standard.md` | FOUND | WeChat mini-program MVP, one-to-one UI, local/mock services. |
| Software test standard | `docs/auto-execute/auracue-software-test-standard.md` | FOUND | Requires simulated tests for every P0 page and fail-closed visual/API/DB evidence. |
| Requirement traceability matrix | `docs/auto-execute/auracue-requirement-traceability-matrix.md` | FOUND | REQ-001..REQ-020 mapped to T00..T25. |
| UI reference map | `docs/auto-execute/auracue-ui-reference-map.md` | FOUND | UI-01..UI-18 plus P1 exclusion row. |
| API/DB contract matrix | `docs/auto-execute/auracue-api-db-contract-matrix.md` | FOUND | API-000..API-010 and P0 DB readback expectations. |
| Owner scenario matrix | `docs/auto-execute/auracue-owner-scenario-matrix.md` | FOUND | SCN-001..SCN-016 exact-click future proof. |
| Final acceptance gate | `docs/auto-execute/auracue-final-acceptance-gate.md` | FOUND | Pure product PASS is fail-closed until all evidence exists. |
| Delivery standard index | `docs/auto-execute/auracue-delivery-standard-index.md` | FOUND | Evidence paths and false-PASS vocabulary. |
| Master plan | `docs/auto-execute/auracue-auto-execute-master-plan.md` | FOUND | T00..T25 total plan. |
| Standard test plan | `docs/auto-execute/auracue-standard-test-plan.md` | FOUND | TEST-001..TEST-025 planned evidence. |
| Task pack audit | `docs/auto-execute/auracue-task-pack-quality-audit.md` | FOUND | Task pack marked ready for auto-execute, not product-complete. |

## Product Requirement Source

| Source | Path | Status | T00 Finding |
| --- | --- | --- | --- |
| PRD v0.2 | `docs/AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md` | FOUND | Defines WeChat mini-program as first-stage experience validation, P0 pages, P0 APIs, P0 DB entities, analytics, and safety boundaries. |

Key P0 constraints preserved for later tasks:

- WeChat mini-program is the MVP validation build.
- UI must one-to-one reproduce `docs/UI/小程序`.
- Core flow is home -> scene -> energy -> generation -> free preview -> unlock/invite/mock payment -> full result -> share/save.
- Real WeChat Pay, real cloud writes, production DB, production AI, and production analytics are forbidden for MVP execution.
- P1 account/history/trend/profile/outfit expansion pages are out of MVP.

## P0 UI And Stitch Inventory

| UI ID | PNG Reference | Size | Stitch Reference | Route/Page Target | Status |
| --- | --- | --- | --- | --- | --- |
| UI-01 | `docs/UI/小程序/01-进入_首页生成入口.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/01/code.html` | `/` | FOUND |
| UI-02 | `docs/UI/小程序/02-选择_出门场景.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/02/code.html` | `/create/scene` | FOUND |
| UI-03 | `docs/UI/小程序/03-选择_今日能量.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/03/code.html` | `/create/energy` | FOUND |
| UI-04 | `docs/UI/小程序/03A-选择_场景与能量未完成状态.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/03a/code.html` | `/create/energy` incomplete state | FOUND |
| UI-05 | `docs/UI/小程序/04-生成_抽卡仪式.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/04/code.html` | `/create/loading` | FOUND |
| UI-06 | `docs/UI/小程序/05-结果_免费预览待解锁.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/05/code.html` | `/result/:id` | FOUND |
| UI-07 | `docs/UI/小程序/06-解锁_付费与邀请入口.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/06/code.html` | `/unlock/:id` | FOUND |
| UI-08 | `docs/UI/小程序/07A-邀请解锁_邀请3人入口.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/07a_3/code.html` | `/invite/:id` | FOUND |
| UI-09 | `docs/UI/小程序/07B-邀请解锁_邀请进度.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/07b/code.html` | `/invite/:id/progress` | FOUND |
| UI-10 | `docs/UI/小程序/07C-邀请解锁_好友承接页.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/07c/code.html` | `/invite/landing/:code` | FOUND |
| UI-11 | `docs/UI/小程序/08A-支付解锁_确认支付.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/08a/code.html` | `/unlock/:id/pay` | FOUND |
| UI-12 | `docs/UI/小程序/08B-支付解锁_失败与恢复购买.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/08b/code.html` | `/unlock/:id/pay-failed` | FOUND |
| UI-13 | `docs/UI/小程序/08C-支付解锁_成功状态.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/08c/code.html` | `/unlock/:id/success` | FOUND |
| UI-14 | `docs/UI/小程序/09-结果_完整气场卡与分享入口.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/09/code.html` | `/result/:id/full` | FOUND |
| UI-15 | `docs/UI/小程序/10A-分享_Story卡预览与保存.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/10a_story/code.html` | `/share/:id` | FOUND |
| UI-16 | `docs/UI/小程序/10B-分享_渠道选择.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/10b/code.html` | `/share/:id/channels` | FOUND |
| UI-17 | `docs/UI/小程序/10C-保存_保存成功反馈.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/10c/code.html` | `/saved/:id` | FOUND |
| UI-18 | `docs/UI/小程序/11-异常_生成失败网络异常.png` | 941x1672 | `docs/UI/小程序/stitch_codex_ui_code_generator/11/code.html` | `/error/network` or loading error state | FOUND |

## P1 Exclusion Inventory

| Source | Path | Status | MVP Handling |
| --- | --- | --- | --- |
| P1 README | `docs/UI/小程序/P1/README.md` | FOUND | Confirms deferred screens and concepts. |
| Outfit energy extension | `docs/UI/小程序/P1/08-穿搭能量页_P1扩展.png` | FOUND | OUT_OF_SCOPE_WITH_REASON. |
| History page extension | `docs/UI/小程序/P1/09-历史页_P1扩展.png` | FOUND | OUT_OF_SCOPE_WITH_REASON. |
| 7-day trend extension | `docs/UI/小程序/P1/10-七日能量趋势页_P1扩展.png` | FOUND | OUT_OF_SCOPE_WITH_REASON. |
| Profile extension | `docs/UI/小程序/P1/11-个人档案页_P1扩展.png` | FOUND | OUT_OF_SCOPE_WITH_REASON. |

T01 and later UI tasks must not implement P1 history, trend, account/profile, subscription, ecommerce, or full bottom-tab experiences except as disabled/coming-later affordances where required by a P0 screen.

## Existing Repo Shape

| Area | Finding | Status |
| --- | --- | --- |
| Product source code | No `package.json`, mini-program config, app source, backend source, or TS config found. | T01 MUST SCAFFOLD |
| Existing docs | `docs/auto-execute` task pack and PRD/UI sources exist. | READY |
| Existing evidence directories | `docs/auto-execute/logs` exists; `results`, `latest`, and `intake` are created by T00 outputs. | READY AFTER T00 |
| Existing generated task docs | T00 through T25 task documents exist. | READY |

## Planned Evidence Paths

| Evidence Class | Future Owner Task | Path |
| --- | --- | --- |
| T00 inventory | T00 | `docs/auto-execute/intake/T00-source-inventory.md` |
| T00 harness decision | T00 | `docs/auto-execute/intake/T00-harness-decision.md` |
| T00 command/read evidence | T00 | `docs/auto-execute/logs/T00/T00-command-log.md` |
| T00 result JSON | T00 | `docs/auto-execute/results/T00.json` |
| T00 handoff | T00 | `docs/auto-execute/latest/T00-HANDOFF.md` |
| T01 install/build/health logs | T01 | `docs/auto-execute/logs/T01/` and `docs/auto-execute/api/T01/health.json` |
| Page simulation traces | T19/T24 | `docs/auto-execute/traces/T19/`, `docs/auto-execute/traces/T24/` |
| API/DB readbacks | T20 | `docs/auto-execute/api/T20/`, `docs/auto-execute/db/T20/` |
| Contract evidence | T21 | `docs/auto-execute/api/T21/contract-summary.json` |
| Visual screenshots and diffs | T22/T23 | `docs/auto-execute/screenshots/`, `docs/auto-execute/screenshots/diffs/` |

## Intake Verdict

T00 source intake is complete for the current task boundary. No missing P0 PRD, PNG, Stitch code, or P1 exclusion source was found. Product implementation has not started and must not be inferred from this artifact.
