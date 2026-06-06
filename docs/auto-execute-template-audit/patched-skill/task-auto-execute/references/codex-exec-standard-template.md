# Codex Exec Standard Template

本文件是 `task-auto-execute` skill 的母模板。以后生成任何项目的 `docs/auto-execute/<slug>-codex-exec-prompts.md`、`<slug>-codex-exec-prompts-split.md` 和 `<slug>-tasks/*.md` 时，必须先套用本模板，再填入项目事实。

本模板来自 `D:\lyh\agent\agent-frame\xwstarmap\docs\auto-execute\xwstarmap-codex-exec-prompts.md` 的可用执行结构，并补强了后续失败暴露出的硬约束：任务必须能被一个 fresh `codex exec` 独立执行、必须写 result JSON 和 HANDOFF、必须有依赖续跑门槛、必须有失败修复路由、必须禁止纯聊天式收尾。

## 1. 如何使用这个 skill

### 1.1 适用场景

当用户提供 PRD、需求文档、UI 截图、设计稿、参考项目或“要生成 auto-execute 任务包”时，使用 `task-auto-execute` skill。

本 skill 只生成任务包和未来执行提示词。它不执行产品实现，不启动服务，不点击页面，不调用 API，不写数据库，不生成运行证据。

### 1.2 推荐调用话术

在目标项目根目录中使用：

```text
使用 task-auto-execute skill。
请按 references/codex-exec-standard-template.md 生成标准任务包。
目标项目根目录：<absolute project root>
项目 slug：<slug>
需求来源：<PRD/docs paths>
UI 来源：<UI screenshots/design/prototype paths>
参考项目：<optional read-only reference project paths>
执行限制：local-only，不调用真实云服务/支付/生产数据。
输出到：docs/auto-execute/
只生成任务包，不执行 codex exec，不创建 results/latest 运行证据。
```

如果用户要求 goal 模式，生成阶段应创建或使用一个明确目标：

```text
Goal: 为 <project> 生成可交给 auto-execute 串行执行的标准任务包。
完成条件：母模板文档、主计划、拆分命令、每任务文档、质量审计全部生成且审计结论为 READY_FOR_AUTO_EXECUTE。
```

### 1.3 生成顺序

1. 读取本模板。
2. 读取 `task-archetype-templates.md`，先建立 task 类型模板 ID 索引。
3. 读取 `software-dev-task-templates.md`，按软件开发分类选择开发、测试、接口、UI 一比一、外部集成、发布、审查、修复和最终门禁模板。
4. 对每个计划 task 读取对应的 `references/templates/<Task Template ID>.md` 独立模板文件；独立模板文件是 task 细节的最终约束。
5. 读取 `task-pack-contract.md` 和 `document-templates.md`。
6. 读取目标项目 `AGENTS.md`、PRD、UI、现有代码和参考项目。
7. 先做 source inventory、requirement inventory、UI inventory、API/DB inventory、acceptance inventory。
8. 分解 task queue 时先为每个 task 选择 `Task Template ID`，再按对应独立模板文件填写 task 文件。
9. 生成 `<slug>-codex-exec-prompts.md`，作为整包执行入口。
10. 生成 `<slug>-codex-exec-prompts-split.md`，每条命令只执行一个 task。
11. 生成 `<slug>-tasks/T00-omx-auto-execute-orchestrator.md` 和每个任务文档。
12. 生成标准矩阵和最终门禁文档。
13. 生成 `<slug>-task-pack-quality-audit.md`，必须包含 task template matching audit。
14. 运行可用的文档审计脚本。任何 FAIL 都必须回到生成步骤修复，不能报告 ready。

## 2. 输出文件合同

必须生成或更新：

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
docs/auto-execute/<slug>-owner-scenario-matrix.md
docs/auto-execute/<slug>-final-acceptance-gate.md
docs/auto-execute/<slug>-codex-exec-prompts.md
docs/auto-execute/<slug>-codex-exec-prompts-split.md
docs/auto-execute/<slug>-task-pack-quality-audit.md
docs/auto-execute/<slug>-tasks/T00-omx-auto-execute-orchestrator.md
docs/auto-execute/<slug>-tasks/<TASK-ID>-<task-name>.md
```

禁止在生成阶段创建：

```text
docs/auto-execute/results/*.json
docs/auto-execute/latest/*HANDOFF.md
docs/auto-execute/logs/*.log
docs/auto-execute/screenshots/**
docs/auto-execute/evidence/**
docs/AUTO_EXECUTE_DELIVERY_REPORT.md
```

这些路径只能由未来真正执行 task 的 `codex exec` worker 写入。

## 3. `<slug>-codex-exec-prompts.md` 母模板

生成文件必须使用下面结构，并把所有 `<...>` 替换成目标项目事实。缺失事实必须写成 `BLOCKED_BY_MISSING_SOURCE`，不能编造。

```markdown
# <Project Name> auto-execute Codex Exec 执行提示词

> 生成日期：<YYYY-MM-DD>
> 项目根目录：`<absolute project root>`
> 项目 slug：`<slug>`
> 需求文档：`<PRD paths>`
> UI 截图/设计来源：`<UI paths>`
> 参考项目：`<reference project paths, read-only>`
> 执行方式：每个 Task 单独使用一次 fresh `codex exec`，从 `T00` 串行执行到最终门禁。上一个 `codex exec` 必须完全退出并写入 result JSON、日志和 HANDOFF 后，才能启动下一个 task。

本文档是给 `auto-execute` / `codex exec` 使用的执行包，不是完成报告。生成本文档时没有运行代码、没有启动服务、没有截图、没有 API transcript、没有 DB readback、没有 result JSON、没有 HANDOFF，不允许写 `PASS`。

## 总原则

- 一个 Task 只交给一个 fresh `codex exec` worker。
- 每个 worker 必须先读 `AGENTS.md`，再读本任务指定输入。
- 每个 worker 必须执行、测试、修复、写 result JSON、写 HANDOFF，然后退出。
- 每个 worker 禁止只规划、不实现；禁止只用聊天文字收尾。
- 所有本地可逆的实现和验证步骤不需要询问“是否继续”，必须继续到该 task 的退出条件。
- 参考项目只读，禁止修改参考项目。
- 业务必须按目标项目 PRD/UI 重建，禁止把参考项目业务照搬。
- UI 以用户给的截图、设计稿、HTML prototype 或 Figma 为视觉验收源。
- 缺少真实截图或像素 diff 时，视觉结论不得强于 `PASS_NEEDS_MANUAL_UI_REVIEW`。
- 默认 local-only，不触碰真实云服务、真实支付、真实生产数据。
- 默认不 commit、不 push，除非用户另行明确要求。

## Source Inventory

| Source ID | 类型 | 路径/位置 | 用途 | 状态 | Blocker |
| --- | --- | --- | --- | --- | --- |
| SRC-AGENTS | agent 规则 | `<path>` | 约束所有 task | PLANNED |  |
| SRC-PRD-001 | PRD | `<path>` | P0/P1 需求来源 | PLANNED |  |
| SRC-UI-001 | UI reference | `<path>` | 视觉验收来源 | PLANNED |  |
| SRC-REF-001 | reference project | `<path>` | 只读架构参考 | PLANNED |  |

## 推荐项目结构

```text
<absolute project root>
  <frontend app path>/
  <backend/server path>/
  <admin or miniapp path if required>/
  scripts/
    verify/
    acceptance/
  docs/
    auto-execute/
```

## UI Mapping

| UI ID | 来源 | 目标界面 | 目标路径/路由 | Viewport | 关键状态 | 关键控件 | 数据依赖 | 视觉证据目标 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UI-001 | `<path>` | `<screen name>` | `<route/path>` | `<viewport>` | loaded/empty/error/loading | `<buttons/tabs/forms>` | `<fixture/API/DB>` | screenshots/diff/metrics |

## API And DB Mapping

| API ID | Method | Path | Auth | Request | Response | DB side effect | Frontend caller | Required tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-001 | GET | `/api/...` | `<rule>` | `<schema>` | `<schema>` | `<entity/readback>` | `<page/component>` | success/auth/validation/not-found/server/readback |

## External Data Mapping

| Data ID | 外部目标 | 表/实体 | 字段 | internal field | unique_key | 写入规则 | 回读证据 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DATA-001 | `<Feishu/Bitable/Airtable/DB/SaaS>` | `<table>` | `<exact field>` | `<model.field>` | `<key>` | create/update/upsert/cache/replay | `<path>` |

## Task Queue

| Order | Task | Task Template ID | 主要验收面 | 覆盖对象 | 前置任务 | 必须输出 result JSON | 必须输出 HANDOFF | 失败路由 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 00 | T00-orchestrator | TPL-ORCH-T00 | 编排与续跑 | task queue/results/latest/blockers | none | docs/auto-execute/results/T00.json | docs/auto-execute/latest/T00-HANDOFF.md | blockers/repair-queue |
| 01 | T01-<name> | TPL-<...> | <surface> | <Req/UI/API/DB/Owner IDs> | T00 | docs/auto-execute/results/T01.json | docs/auto-execute/latest/T01-HANDOFF.md | <repair task> |

## Task <ID> - <任务名>

```powershell
Set-Location -LiteralPath '<absolute project root>'
codex exec @'
# Task <ID> - <任务名>

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-<...>` |
| Task 类型 | `<type from references/task-archetype-templates.md>` |
| 主验收面 | `<one primary acceptance surface>` |
| 为什么选这个模板 | `<project-specific reason>` |
| 覆盖对象 | `<Req/UI/API/DB/ExternalData/Owner IDs>` |
| 辅助模板 | `<optional TPL IDs or none>` |

## 1. Task 目标

<一个 task 只写一个主要验收面。说明它要实现或验证什么，覆盖哪些 requirement/UI/API/DB/owner scenario。>

## 2. 必须读取的输入

| 输入 | 用途 |
| --- | --- |
| `AGENTS.md` | 当前项目规则 |
| `<file>` | `<why>` |

## 3. 允许改动范围

- `<allowed path 1>`
- `<allowed path 2>`

## 4. 禁止事项

- 不要修改参考项目。
- 不要触碰真实云服务、真实支付、真实生产数据。
- 不要扩大到本 task 未覆盖的需求。
- 不要写纯 PASS，除非本 task 的所有证据真实存在。

## 5. 依赖与续跑门槛

| 依赖 | 必须存在 | 不满足时处理 |
| --- | --- | --- |
| `<previous task>` | `docs/auto-execute/results/<PREV>.json` | 读取 HANDOFF；缺失则写 BLOCKED_BY_MISSING_SOURCE 或回到前置 task |
| `<previous task>` | `docs/auto-execute/latest/<PREV>-HANDOFF.md` | 不要猜测前置结果 |

续跑时必须先检查：

- `docs/auto-execute/results/<ID>.json`
- `docs/auto-execute/latest/<ID>-HANDOFF.md`
- `docs/auto-execute/blockers.md`
- `docs/auto-execute/repair-queue.md`

如果本 task 已有合格 result JSON 和 HANDOFF，必须读取并确认是否仍需重跑；不得重复制造冲突证据。

## 6. 执行步骤

1. <repo/source inspection step>
2. <implementation or verification step>
3. <targeted tests step>
4. <repair loop step>
5. <write durable evidence step>

## 7. 必须输出

| 输出文件 | 必须内容 |
| --- | --- |
| `<code/doc/evidence path>` | `<required content>` |
| `docs/auto-execute/results/<ID>.json` | verdict、covered requirements、commands、evidence、blockers、next repair |
| `docs/auto-execute/latest/<ID>-HANDOFF.md` | 当前状态、已改文件、验证结果、下一 task 输入 |

## 8. 最低验证命令

```powershell
<command 1>
<command 2>
```

每个命令必须写日志到 `docs/auto-execute/logs/<ID>-<name>.log`，或在 result JSON 中解释为什么无法运行。

## 9. 细化验收标准

### Functional

- <concrete behavior>

### UI

- <reference ID, route, viewport, state, artifact paths>

### API/DB

- <method/path, request, response, mutation, readback>

### External Data

- <payload, unique_key, upsert, duplicate-run, failed-write cache, replay, readback>

### Owner Scenario

- <exact click path: page -> click -> route/state -> API -> DB -> visible proof>

## 10. 防停止规则

- 不要在完成计划后停止。
- 不要问普通的“是否继续”。
- 如果测试失败，先定位并做 task-local 修复，再重跑相关验证。
- 如果仍失败，写 `REPAIR_REQUIRED` 和最小 repair task，不要只写聊天状态。
- 无论成功、失败还是阻塞，都必须写 result JSON 和 HANDOFF。

## 11. 失败修复路由

| 状态 | 何时使用 | 必须动作 |
| --- | --- | --- |
| PASS | 本 task 所有必需证据真实存在 | 写 result JSON/HANDOFF 并退出 |
| PASS_WITH_LIMITATION | 非 P0 限制或用户允许的 local-only 限制 | 写清限制和后续风险 |
| PASS_NEEDS_MANUAL_UI_REVIEW | 功能证据有，但缺真实 raster/pixel 视觉证据 | 写人工复核路径和后续视觉 repair |
| REPAIR_REQUIRED | P0 断言失败但可本地修复 | 写 repair task、失败断言、重跑命令 |
| BLOCKED_BY_ENVIRONMENT | 运行环境缺失且无法替代 | 写环境 blocker 和可替代证据 |
| BLOCKED_BY_MISSING_SOURCE | PRD/UI/code/source 缺失 | 写缺失源和需要的输入 |
| HARD_FAIL | P0 目标明确失败且本 task 无法修复 | 写失败证据和上游路由 |

## 12. 退出条件

退出前确认：

- result JSON 已写入；
- HANDOFF 已写入；
- 日志/截图/API/DB/证据路径已写入或解释缺失原因；
- 下一个 task 能只靠 durable 文件继续；
- 没有只停留在聊天消息里的结论。
'@
```
```

## 4. T00 编排任务模板

`T00-omx-auto-execute-orchestrator.md` 必须是第一个任务，且只做编排，不实现产品功能。

T00 必须要求未来 worker：

1. 读取整包文档和 task queue。
2. 检查 `docs/auto-execute/results/`、`latest/`、`blockers.md`、`repair-queue.md`。
3. 判断从哪个 task 续跑。
4. 每次只启动一个 fresh `codex exec`。
5. 等待该 worker 退出。
6. 验证 result JSON、日志和 HANDOFF 真实存在。
7. 根据 verdict 决定下一步：
   - `PASS` 或可接受的 limitation：进入下一 task。
   - `REPAIR_REQUIRED`：启动最小 repair task 或把失败写入 repair queue。
   - `BLOCKED_BY_ENVIRONMENT` / `BLOCKED_BY_MISSING_SOURCE`：只在无替代证据时停止并写 blocker。
   - `HARD_FAIL`：写失败摘要和最小修复路线。
8. 最终门禁只能读取 durable files，不能相信聊天结论。

T00 的 Codex Exec 命令必须明确：

```powershell
Set-Location -LiteralPath '<absolute project root>'
codex exec "Use auto-execute. Execute only T00 from docs/auto-execute/<slug>-tasks/T00-omx-auto-execute-orchestrator.md. Orchestrate future one-task-per-fresh-codex-exec execution. Do not implement product code in T00."
```

## 5. 拆分任务规则

任务必须按验收面拆，不按笼统工程层拆。

必须单独成 task 的类型：

- 项目接管和 source inventory；
- 需求归一化；
- UI reference map 和 design token 提取；
- 参考项目只读架构映射；
- 项目 scaffold；
- backend foundation；
- 每个 API domain；
- 数据导入和解析；
- 核心业务引擎；
- frontend shell；
- 每个 P0 页面；
- 每个复杂 modal/form/state group；
- admin/PC 后台关键工作流；
- contract alignment；
- local full-flow smoke；
- cloud/payment/local-only guard；
- visual one-to-one comparison；
- visual repair loop；
- owner scenario matrix；
- owner click E2E；
- API/DB readback E2E；
- external data write/upsert/readback E2E；
- report integrity；
- secret guard；
- final acceptance gate。

禁止：

- 用一个 “frontend implementation” 包掉多个 P0 页面。
- 用一个 “backend APIs” 包掉所有 API 细节。
- 用一个 “owner E2E” 不列 exact click path。
- final gate 再去补实现。
- 生成阶段创建 result JSON 或 HANDOFF。

## 6. 质量审计模板

`<slug>-task-pack-quality-audit.md` 必须逐项审计，而不是只写 READY 表格。

```markdown
# <Project Name> Task Pack Quality Audit

Generated by `task-auto-execute`.

## Verdict

`READY_FOR_AUTO_EXECUTE` | `NEEDS_REGENERATION` | `BLOCKED_BY_MISSING_SOURCE`

## Source Integrity

| Check | Evidence | Status | Blocker |
| --- | --- | --- | --- |
| PRD paths exist or missing source is recorded |  |  |  |
| UI paths exist or missing source is recorded |  |  |  |
| Reference projects are read-only |  |  |  |
| UTF-8 no mojibake |  |  |  |

## Task Executability Audit

| Task | Has command | Has inputs | Has allowed files | Has forbidden actions | Has dependency gate | Has stop rules | Has repair routing | Has result JSON | Has HANDOFF | Specific enough | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Task Template Matching Audit

| Task | Selected Template | Primary Surface | Covered IDs | Template Fits? | Missing Template Fields | Verdict |
| --- | --- | --- | --- | --- | --- | --- |

## Coverage Audit

| Surface | Required rows | Covered rows | Missing rows | Status |
| --- | --- | --- | --- | --- |
| P0/P1 requirements |  |  |  |  |
| UI references |  |  |  |  |
| API success/auth/validation/error/readback |  |  |  |  |
| DB mutations/readbacks |  |  |  |  |
| External data payload/upsert/cache/replay/readback |  |  |  |  |
| Owner exact clicks |  |  |  |  |
| Visual one-to-one artifacts |  |  |  |  |

## Generation Boundary Audit

| Forbidden artifact | Exists? | Status |
| --- | --- | --- |
| `docs/auto-execute/results/*.json` |  |  |
| `docs/auto-execute/latest/*HANDOFF.md` |  |  |
| execution screenshots/logs/API transcripts |  |  |
| generated PASS/VERIFIED completion claims |  |  |

## Regeneration Blockers

- <list every blocker that prevents READY_FOR_AUTO_EXECUTE>
```

审计必须 fail closed。只要出现下列情况，verdict 必须是 `NEEDS_REGENERATION`：

- 任务文档短薄，只有目标和测试命令，没有依赖门槛、停止规则、修复路由、result JSON、HANDOFF。
- 任务文档没有 `Task Template ID`、模板选择理由、主验收面或覆盖对象。
- 任务所选模板与实际任务内容不匹配。
- 任务没有项目事实，只是通用模板。
- P0 页面、API、DB、外部数据、owner click 没有逐项映射。
- 视觉一比一缺 reference、target route、viewport、capture、diff/metrics、status rule。
- final gate 可以在缺证据时通过。
- 生成阶段创建了结果证据。
- 中文路径或业务文案出现 mojibake。

## 7. 好任务和坏任务的判定

好任务必须像 `xwstarmap-codex-exec-prompts.md` 里的强结构：

- 有目标；
- 有必须读取的输入；
- 有允许改动范围；
- 有禁止事项；
- 有执行步骤；
- 有必须输出；
- 有最低验证命令；
- 有完成标准；
- 有 result JSON；
- 有 HANDOFF；
- 有失败状态；
- 能被一个 fresh `codex exec` 独立跑完。

坏任务的典型形态：

- 只有一句 “实现首页”；
- 只写 “npm run test”；
- 没有前置依赖；
- 没有续跑规则；
- 没有失败后怎么修；
- 没有 exact UI/API/DB/owner evidence；
- 没有 result JSON 和 HANDOFF；
- 没有明确退出条件。
- 没有先选择 task 类型模板。

坏任务不能进入 `READY_FOR_AUTO_EXECUTE`。

## 8. 套用模板的最小工作流

生成新项目任务包时，按这个顺序填：

1. 替换项目元信息：root、slug、PRD、UI、reference、local-only 限制。
2. 填 Source Inventory。
3. 填 UI Mapping，每个 UI reference 一行。
4. 填 API And DB Mapping，每个 API 多行覆盖 success/auth/validation/error/readback。
5. 填 External Data Mapping，如果没有外部数据也要写明 `OUT_OF_SCOPE_WITH_REASON`。
6. 设计 Task Queue，先 T00，再按验收面拆任务。
7. 为每个 task 从 `task-archetype-templates.md` 选择 `Task Template ID`。
8. 为每个 task 填模板选择表和完整 12 节。
9. 生成 split commands。
10. 生成矩阵、标准、owner scenario、final gate。
11. 生成 quality audit，必须包含 Task Template Matching Audit。
12. 审计不通过就重生成，不要报告 ready。

## 9. Skill 自检清单

在最终回复前，skill 必须确认：

- 已读取本模板；
- 已读取目标 PRD/UI/代码/参考项目；
- 已生成 `<slug>-codex-exec-prompts.md`；
- 已生成 `<slug>-codex-exec-prompts-split.md`；
- 已生成每个 task 文档；
- 每个 task 都先选择了 `Task Template ID`；
- 每个 task 都有依赖续跑、防停止、失败修复、result JSON、HANDOFF；
- 质量审计不是空表格；
- 没有创建运行证据；
- 没有把 `READY_FOR_AUTO_EXECUTE` 等同于产品完成；
- 如果是 goal 模式，只有模板/任务包生成并验证后才能把 goal 标记 complete。
