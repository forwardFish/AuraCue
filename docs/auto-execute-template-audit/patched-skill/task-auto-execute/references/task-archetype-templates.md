# Task Archetype Templates

本文件是 `task-auto-execute` 的任务类型模板库。生成任务包时，必须先为每个 task 匹配一个模板，再生成 task 文件。

软件开发类任务的详细模板字段以 `software-dev-task-templates.md` 为准。本文档负责维护模板 ID 索引和通用规则，`software-dev-task-templates.md` 负责规定开发、测试、接口、UI 一比一、外部集成、发布、审查、修复和最终门禁的必填项。

每个 `Task Template ID` 还必须存在同名独立模板文件：`references/templates/<Task Template ID>.md`。生成任务文件时必须读取这个独立模板文件，不能只看本文档索引。

硬规则：

- 每个 task 必须在文档开头写 `Task Template ID` / `任务模板 ID`。
- 每个 task 只能有一个主模板；可以列辅助模板，但主验收面只能有一个。
- 没有匹配模板时，不要凭感觉写 task；必须新增一个项目专用模板，并在 quality audit 中说明为什么新增。
- 任务分解时先选模板，再填项目事实，再写 task 文件。
- 选定模板后必须读取 `references/templates/<Task Template ID>.md`。
- 模板选错时，quality audit 必须判定为 `NEEDS_REGENERATION`。

## 1. 模板选择流程

1. 读 PRD/UI/API/DB/owner scenario/source inventory。
2. 判断该 task 的主验收面：接管、需求、UI、API、DB、外部数据、页面、工作流、E2E、视觉、门禁、修复。
3. 从本文件选择最接近的 `Task Template ID`。
4. 在 task 文件开头填写：

```markdown
## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-...` |
| Task 类型 | `<type>` |
| 主验收面 | `<one primary acceptance surface>` |
| 为什么选这个模板 | `<reason>` |
| 覆盖对象 | `<Req/UI/API/DB/Owner IDs>` |
| 辅助模板 | `<optional TPL IDs or none>` |
```

5. 按所选模板的必填项生成完整 task。
6. 在 `<slug>-task-pack-quality-audit.md` 中逐 task 审计模板匹配是否正确。

## 2. 模板索引

| Template ID | 类型 | 适用 task | 不能用于 |
| --- | --- | --- | --- |
| `TPL-ORCH-T00` | 编排 | T00 续跑、串行 fresh `codex exec`、结果检查 | 产品实现 |
| `TPL-INTAKE` | 项目接管 | source inventory、环境盘点、harness 初始化计划 | 实现完整功能 |
| `TPL-REQ-MATRIX` | 需求归一化 | PRD/P0/P1/story/traceability | 写代码实现 |
| `TPL-UI-MAP` | UI 映射 | 截图/设计稿/route/state/token/control mapping | 页面实现 |
| `TPL-REF-MAP` | 参考项目映射 | 只读参考 repo 架构/模式提取 | 复制参考业务 |
| `TPL-SCAFFOLD` | 项目骨架 | app/server/admin/miniprogram scaffold | 复杂业务逻辑 |
| `TPL-BACKEND-FOUNDATION` | 后端基础 | server app、adapter、auth、local DB foundation | 单个业务 API 全实现 |
| `TPL-API-DOMAIN` | API 领域 | 一个业务 API domain 的 routes/service/tests | 全部 API 打包 |
| `TPL-DATA-IMPORT` | 数据导入 | CSV/Excel/upload/parser/import validation | 页面视觉实现 |
| `TPL-BUSINESS-ENGINE` | 业务引擎 | 核心计算、规则、诊断、推荐、风控 | UI 页面实现 |
| `TPL-FRONTEND-SHELL` | 前端壳 | routing、layout、tokens、api client、state foundation | 具体页面完整复刻 |
| `TPL-FRONTEND-PAGE` | 单页面实现 | 一个 P0 页面/route/state/control group | 多页面混合 |
| `TPL-FRONTEND-COMPONENT` | 复杂组件 | modal/form/table/card/stateful component | 整页或 E2E |
| `TPL-ADMIN-WORKFLOW` | 后台工作流 | admin upload/review/publish/config workflow | 小程序 owner click |
| `TPL-CONTRACT` | 合同对齐 | frontend/backend request/response/error contract | 业务实现替代 |
| `TPL-LOCAL-SMOKE` | 本地全链路 smoke | clean start、basic full flow、fixture run | 最终 PASS 门禁 |
| `TPL-LOCAL-ONLY-GUARD` | 外部副作用防护 | cloud/payment/email/SMS/AI/storage local-only guard | 真实生产调用 |
| `TPL-VISUAL-COMPARE` | 视觉一比一 | reference/actual/diff/metrics/status | 没有 UI reference 的任务 |
| `TPL-VISUAL-REPAIR` | 视觉修复 | material deviations -> targeted repair -> recapture | 初次 UI mapping |
| `TPL-OWNER-SCENARIO` | 老板场景矩阵 | persona、exact clicks、route/API/DB/UI evidence plan | 实际 E2E 执行 |
| `TPL-OWNER-E2E` | 老板点击 E2E | 模拟用户点击页面/按钮/表单/工作流 | 只写测试计划 |
| `TPL-API-DB-E2E` | API/DB 证明 | all API tests、mutation/readback、error cases | 单 API 开发 |
| `TPL-EXTERNAL-DATA` | 外部数据验证 | payload、field mapping、upsert、cache、replay、readback | 无外部数据项目 |
| `TPL-REPORT-GUARD` | 报告/密钥/完整性 | report integrity、secret guard、evidence consistency | 产品功能实现 |
| `TPL-FINAL-GATE` | 最终门禁 | 汇总 durable evidence、判定 PASS/limitation/blocker | 补写缺失功能 |
| `TPL-REPAIR` | 修复任务 | 已知失败断言的最小修复和重跑 | 新功能规划 |
| `TPL-DEV-FEATURE` | 通用开发实现 | 一个明确 requirement ID 的产品能力实现 | 混合全量测试或最终门禁 |
| `TPL-DATA-MODEL-MIGRATION` | 数据模型/迁移 | schema/table/collection/model/migration/seed 变更 | 无回滚边界的破坏性操作 |
| `TPL-PAGE-CLICK-API` | 页面点击/API 链路 | control click -> route/state -> API -> DB/local state -> visible proof | 纯 UI 静态截图 |
| `TPL-TEST-UNIT` | 单元测试 | 函数/service/adapter/component 局部行为锁定 | 端到端验收 |
| `TPL-TEST-INTEGRATION` | 集成测试 | API/service/DB/adapter/contract 集成证明 | 单元测试替代 |
| `TPL-TEST-E2E` | 端到端测试 | 浏览器/用户流程/API/DB/UI 全链路证明 | 只写测试计划 |
| `TPL-CRAWLER-PIPELINE` | 爬虫/归一化 | crawl/fetch/parse/normalize/dedupe/source attribution | 真实网络无限制抓取 |
| `TPL-AI-PROVIDER` | AI/模型供应商 | prompt/input/output schema、mock/live limitation、secret guard | 把 mock 当真实模型证明 |
| `TPL-SCHEDULER-JOB` | 定时任务/队列 | cron/job/full collect/pending replay/idempotency/log | 页面点击验证 |
| `TPL-PAYMENT-ENTITLEMENT` | 支付/权益 | sandbox/local payment guard、entitlement、paywall | 真实扣费 |
| `TPL-EXPORT-DOWNLOAD` | 导出/下载 | PDF/Word/Excel/CSV/report export and validation | 只检查按钮存在 |
| `TPL-AUTH-IDENTITY` | 身份权限 | auth/session/role/tenant/access-control 正负例 | 通用 UI 样式 |
| `TPL-PERFORMANCE` | 性能 | API/page/build/workflow baseline and regression threshold | 功能正确性替代 |
| `TPL-SECURITY` | 安全 | secret guard、authz、validation、injection、dependency risk | 泛泛安全建议 |
| `TPL-ACCESSIBILITY` | 可访问性 | keyboard/focus/label/contrast/responsive text | 视觉一比一替代 |
| `TPL-OBSERVABILITY` | 可观测性 | logs/metrics/traces/error report/redaction | 最终报告替代 |
| `TPL-DEPLOY-ENV` | 部署环境 | env matrix、build/deploy/dry-run、rollback notes | 生产发布承诺 |
| `TPL-RELEASE-RUNBOOK` | 发布手册 | preflight、release steps、rollback、post-release verification | 代码实现 |
| `TPL-DOCS-HANDOFF` | 文档交接 | README/operator guide/HANDOFF/known limitations | 掩盖未完成状态 |
| `TPL-CODE-REVIEW` | 代码审查 | bug/risk/regression/missing-tests/security findings | 直接修复所有问题 |
| `TPL-LEGACY-MIGRATION` | 旧系统迁移 | COPY_AS_IS/ALLOW_ADAPT/REFERENCE_ONLY/FORBIDDEN 复用边界 | 无边界复制旧业务 |

## 3. 通用 task 骨架

所有模板都必须包含这些通用章节：

```markdown
# Task <ID> - <Name>

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-...` |
| Task 类型 |  |
| 主验收面 |  |
| 为什么选这个模板 |  |
| 覆盖对象 |  |
| 辅助模板 |  |

## Codex Exec

## 1. Task 目标

## 2. 必须读取的输入

## 3. 允许改动范围

## 4. 禁止事项

## 5. 依赖与续跑门槛

## 6. 执行步骤

## 7. 必须输出

## 8. 最低验证命令

## 9. 细化验收标准

## 10. 防停止规则

## 11. 失败修复路由

## 12. 退出条件
```

## 4. 各模板必填项

### `TPL-ORCH-T00` 编排模板

必填：

- task queue 全表；
- predecessor/result/HANDOFF/log 检查规则；
- resume probe：`results/`、`latest/`、`blockers.md`、`repair-queue.md`；
- 一次只启动一个 fresh `codex exec`；
- worker 退出后再启动下一 task；
- 不实现产品代码；
- failure routing；
- final gate 只读 durable evidence。

### `TPL-INTAKE` 项目接管模板

必填：

- 项目根目录、git 状态、现有代码盘点；
- PRD/UI/reference/source inventory；
- local-only 和外部服务边界；
- harness/acceptance 目录计划；
- known gaps；
- result JSON 最多 `PASS_WITH_LIMITATION`，因为 intake 不等于产品完成。

### `TPL-REQ-MATRIX` 需求归一化模板

必填：

- P0/P1/P2 分类；
- requirement ID、source section、role、priority；
- story matrix；
- requirement -> task -> test -> evidence 映射；
- missing source blocker；
- 禁止把候选需求写成已确认 P0。

### `TPL-UI-MAP` UI 映射模板

必填：

- 每个 UI reference 的 source path、viewport、dimensions；
- route/page/state/control/data dependency；
- design tokens：color、type、spacing、radius、shadow、assets；
- capture command 和 diff/metrics target；
- owner scenario coverage；
- missing raster proof 的状态降级规则。

### `TPL-REF-MAP` 参考项目映射模板

必填：

- 参考项目只读边界；
- 可复用 architecture/pattern/helper；
- 禁止复制的业务逻辑和文案；
- target repo adaptation plan；
- concrete files read；
- no modification proof for reference repo。

### `TPL-SCAFFOLD` 项目骨架模板

必填：

- package/workspace/app/server/admin/miniprogram 结构；
- local start/test/build commands；
- health/basic route；
- API client foundation；
- style token foundation；
- minimal tests；
- 明确不完成业务功能。

### `TPL-BACKEND-FOUNDATION` 后端基础模板

必填：

- server app factory；
- env/config；
- auth middleware；
- local DB/storage adapter；
- external adapter mock/local guard；
- error envelope；
- health/basic integration tests。

### `TPL-API-DOMAIN` API 领域模板

必填：

- API ID 列表；
- method/path/auth/request/response/error；
- service/domain logic；
- validation/auth/not-found/conflict/server cases；
- DB mutation/readback；
- frontend callers；
- API transcript/log evidence。

### `TPL-DATA-IMPORT` 数据导入模板

必填：

- accepted file formats；
- parser rules；
- fixture rows；
- invalid row handling；
- duplicate/idempotency；
- import result schema；
- DB write/readback；
- no failure-as-zero。

### `TPL-BUSINESS-ENGINE` 业务引擎模板

必填：

- input models；
- calculation/rule definitions from PRD；
- edge cases；
- deterministic fixtures；
- service tests；
- API integration point；
- evidence for expected outputs。

### `TPL-FRONTEND-SHELL` 前端壳模板

必填：

- routes；
- layout/navigation；
- global design tokens；
- API client；
- auth/session state；
- loading/empty/error foundation；
- smoke render checks。

### `TPL-FRONTEND-PAGE` 单页面模板

必填：

- one route/page only；
- UI reference IDs；
- viewport/state；
- exact controls/clicks；
- API/data dependencies；
- loading/empty/error/success/unauthorized states；
- screenshot target；
- text overflow/responsive checks；
- navigation assertions。

### `TPL-FRONTEND-COMPONENT` 复杂组件模板

必填：

- component owner page；
- props/state/events；
- forms/tables/modals/cards；
- validation；
- keyboard/focus where applicable；
- unit/component tests；
- integration evidence。

### `TPL-ADMIN-WORKFLOW` 后台工作流模板

必填：

- admin persona intent；
- exact steps；
- upload/review/config/publish actions；
- API calls；
- DB mutation/readback；
- persisted result visible to frontend/owner；
- error/empty/invalid data paths。

### `TPL-CONTRACT` 合同对齐模板

必填：

- frontend caller -> backend API rows；
- request/response/error envelope；
- status codes；
- schema fixtures；
- contract tests；
- drift blockers。

### `TPL-LOCAL-SMOKE` 本地全链路模板

必填：

- clean start commands；
- ready signals；
- seed fixtures；
- one happy path；
- API/DB/UI proof；
- logs；
- limitation if runtime unavailable。

### `TPL-LOCAL-ONLY-GUARD` 外部副作用防护模板

必填：

- protected service list；
- env flags；
- mock/sandbox/local adapter proof；
- tests proving no real cloud/payment/production write；
- secret redaction；
- limitation wording。

### `TPL-VISUAL-COMPARE` 视觉一比一模板

必填：

- reference image/prototype path；
- actual capture path；
- viewport match；
- diff/metrics/summary；
- token comparison；
- material deviation list；
- status rule：没有 raster/pixel proof 不得 pure PASS。

### `TPL-VISUAL-REPAIR` 视觉修复模板

必填：

- failed visual evidence input；
- deviation ID；
- target files；
- proposed repair；
- recapture command；
- diff threshold；
- before/after artifacts。

### `TPL-OWNER-SCENARIO` 老板场景矩阵模板

必填：

- persona；
- scenarios；
- preconditions/fixtures；
- exact click paths；
- expected route/API/DB/UI；
- evidence paths；
- status vocabulary。

### `TPL-OWNER-E2E` 老板点击 E2E 模板

必填：

- exact clicks；
- page transitions；
- API calls；
- DB readback；
- visible UI assertions；
- screenshots/traces；
- retry/error/empty/invalid cases；
- every P0 control coverage。

### `TPL-API-DB-E2E` API/DB 证明模板

必填：

- all API inventory；
- success/auth/validation/not-found/conflict/server cases；
- mutation before/after；
- independent DB readback；
- API transcripts；
- matrix summary。

### `TPL-EXTERNAL-DATA` 外部数据验证模板

必填：

- exact table/entity/field names；
- outbound payload；
- unique_key；
- create/update/upsert；
- duplicate-run idempotency；
- failed-write pending cache；
- replay；
- independent mock/sandbox/readback；
- real credential guard。

### `TPL-REPORT-GUARD` 报告/密钥/完整性模板

必填：

- report integrity checks；
- secret guard；
- stale evidence detection；
- generated summary consistency；
- no overclaiming；
- logs and machine-readable output。

### `TPL-FINAL-GATE` 最终门禁模板

必填：

- required result JSON/HANDOFF list；
- requirement/UI/API/DB/external/owner evidence aggregation；
- final verdict rules；
- fail-closed missing evidence behavior；
- no implementation；
- final report with `Why This Is PASS` or `Why Not Pure PASS?`。

### `TPL-REPAIR` 修复模板

必填：

- source failure result；
- failing assertion；
- smallest allowed change scope；
- target files；
- repair steps；
- rerun commands；
- expected evidence；
- updated result/HANDOFF。

## 5. 质量审计要求

`<slug>-task-pack-quality-audit.md` 必须包含：

```markdown
## Task Template Matching Audit

| Task | Selected Template | Primary Surface | Evidence IDs | Template Fits? | Missing Required Template Fields | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
```

任何 task 缺少 `Task Template ID`、模板选择理由、主验收面、覆盖对象，或者所选模板与 task 内容不匹配，整包 verdict 必须是 `NEEDS_REGENERATION`。

<!-- HISTORY-TEMPLATE-ADDITIONS:START -->
## History Scan Template Additions

These template IDs were added after scanning historical `docs/auto-execute` task files.

| Template ID | Type | Applies To | Not For |
| --- | --- | --- | --- |
| `TPL-HARNESS-EVIDENCE-GATE` | harness/evidence | evidence gates, proof strength, runtime gate, report integrity setup | product implementation |
| `TPL-SCREENSHOT-PIXEL-HARNESS` | screenshot/pixel harness | Playwright capture, rpx-to-px, pixelmatch artifacts, anti-fake actual guard | page style repair |
| `TPL-DESIGN-TOKEN-ASSET-INVENTORY` | design token/assets | token extraction, asset inventory, visual motif map, token build | single page implementation |
| `TPL-MINIAPP-SHELL` | mini-program shell | app/page config, route registry, state/API client, fixture toggles | specific page visual implementation |
| `TPL-MINIAPP-PAGE` | mini-program page | WXML/WXSS/page JSON, rpx layout, miniapp navigation/state | web-only page |
| `TPL-ASYNC-JOB-WORKFLOW` | async job | job create/poll/result/failure/retry/local generator/readback | simple CRUD API |
| `TPL-REPORT-CARD-RENDERER` | renderer | share card, report card, image/PDF-like renderer, text fit, snapshot proof | raw file download only |
| `TPL-QUOTA-RATE-LIMIT` | quota/rate limit | quota counters, failed-call accounting, owner limits, readback | simple auth gate |
| `TPL-METRIC-DELTA-ENGINE` | metrics/delta | snapshot windows, previous/current deltas, null-not-zero failures | generic business rule |
| `TPL-ALERT-REPORTING` | alerts/reporting | alert thresholds, task logs, daily report aggregation, operator copy | generic logs only |
| `TPL-LOCALE-ENCODING-GUARD` | locale/encoding | Chinese copy/field preservation, UTF-8 scan, mojibake guard | translation-only work |
<!-- HISTORY-TEMPLATE-ADDITIONS:END -->
