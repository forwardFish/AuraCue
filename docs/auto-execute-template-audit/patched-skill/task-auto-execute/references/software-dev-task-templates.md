# Software Development Auto-Execute Task Templates

本文档是 `task-auto-execute` 的软件开发任务标准模板库。以后生成任何软件开发类 auto-execute 任务包时，必须先从本文档选择任务模板，再把项目事实填进任务文件。

独立模板文件已经拆分到 `references/templates/TPL-*.md`。本文档负责分类、历史样本归纳和模板总览；真正生成某个 task 时，必须读取对应的独立模板文件，例如 `references/templates/TPL-DATA-MODEL-MIGRATION.md`、`references/templates/TPL-API-DOMAIN.md`、`references/templates/TPL-FRONTEND-PAGE.md`、`references/templates/TPL-VISUAL-COMPARE.md`、`references/templates/TPL-TEST-E2E.md`。

本文档只约束任务包生成，不代表当前 skill 已经执行实现、测试、截图、API 调用或数据库写入。

## 0. 使用规则

1. 先读 `references/codex-exec-standard-template.md`，确认任务包结构、T00 编排、一个 task 一个 fresh `codex exec`、result JSON、HANDOFF、失败路由和最终门禁。
2. 再读 `references/task-archetype-templates.md` 和本文档。`task-archetype-templates.md` 是模板 ID 索引，本文档是软件开发模板详表。
3. 每个 task 必须先选择一个主模板 ID，并读取 `references/templates/<Task Template ID>.md`。可以列辅助模板，但主验收面只能有一个。
4. 任务拆分必须按验收面拆，而不是按“方便写代码”的目录拆。一个任务只能证明一个主要东西：一个页面、一个 API 域、一条 E2E 链路、一类测试、一类集成、一项最终门禁。
5. 如果项目事实不足，写 `BLOCKED_BY_MISSING_SOURCE`，不要编造 PRD、UI、API、DB 或验收证据。
6. 所有任务必须包含：任务模板选择、Codex Exec、目标、必读输入、允许改动范围、禁止事项、依赖与续跑门槛、执行步骤、必须输出、最低验证命令、细化验收标准、防停止规则、失败修复路由、Result JSON、HANDOFF、退出条件。

## 1. 历史 auto-execute 样本归类

| 分类 | 历史样本形态 | 典型项目来源 | 标准模板 |
| --- | --- | --- | --- |
| 编排与续跑 | T00 串行启动 fresh `codex exec`，检查 result/HANDOFF/log，失败转 repair | xwstarmap、AuraCue、scoremap | `TPL-ORCH-T00` |
| 需求接管与矩阵 | source inventory、PRD 归一、需求到任务到证据映射 | xwstarmap、pathnook、finahunt | `TPL-INTAKE`、`TPL-REQ-MATRIX` |
| 通用开发实现 | 按 requirement ID 实现一块产品能力，并有测试与证据 | 多数项目 | `TPL-DEV-FEATURE` |
| 项目骨架 | app/server/admin/miniapp scaffold、启动命令、基础 smoke | scoremap、picktool、ShopOps | `TPL-SCAFFOLD` |
| 后端基础 | server factory、env、auth、DB/storage adapter、错误 envelope | SnapRep、ShopOps、AuraCue | `TPL-BACKEND-FOUNDATION` |
| API 域实现 | method/path/schema/auth/validation/DB/readback/frontend caller | SnapRep、AuraCue、finahuntV2 | `TPL-API-DOMAIN` |
| API/DB 全量证明 | 所有 API success/auth/validation/error/mutation/readback | AuraCue T20、SnapRep Task19 | `TPL-API-DB-E2E` |
| 页面点击到 API 链路 | page/control/click -> route -> API -> DB/local state -> visible proof | SnapRep Task20 | `TPL-PAGE-CLICK-API` |
| 前端壳 | routes/layout/tokens/api client/state foundation | scoremap、picktool | `TPL-FRONTEND-SHELL` |
| 单页面开发 | 一个 route/page 的 loaded/empty/error/loading/unauthorized 状态 | AuraCue、scoremap、picktool | `TPL-FRONTEND-PAGE` |
| 前端组件 | form/table/modal/card/stateful component | 多数前端项目 | `TPL-FRONTEND-COMPONENT` |
| UI 一比一复刻 | reference/actual/diff/metrics/manual-review 降级规则 | AuraCue T09/T22、scoremap | `TPL-VISUAL-COMPARE`、`TPL-VISUAL-REPAIR` |
| 单元测试 | core function/service/component 的局部行为锁定 | 通用 | `TPL-TEST-UNIT` |
| 集成测试 | API/service/DB/adapter 合同集成证明 | SnapRep、ShopOps | `TPL-TEST-INTEGRATION` |
| 端到端测试 | 页面、用户流程、API、DB、可见结果全链路 | AuraCue、pathnook | `TPL-TEST-E2E`、`TPL-OWNER-E2E` |
| 外部数据 | Feishu/Bitable/spreadsheet/SaaS payload、unique_key、upsert、readback | ShopOps T02 | `TPL-EXTERNAL-DATA` |
| 导入导出 | CSV/Excel/PDF/Word/upload/download/parser/export evidence | printersheet、ShopOps | `TPL-DATA-IMPORT`、`TPL-EXPORT-DOWNLOAD` |
| 爬虫与归一化 | crawl/fetch/normalize/dedupe/compliance/local fixture | finahuntV2 | `TPL-CRAWLER-PIPELINE` |
| AI provider | prompt/input/output schema、local-only guard、mock/live 限制 | aiStoryRoom、finahuntV2 | `TPL-AI-PROVIDER` |
| 定时任务 | scheduler/full collect/pending replay/idempotency/log | ShopOps T07 | `TPL-SCHEDULER-JOB` |
| 支付与权益 | payment guard、entitlement、paywall、sandbox/local proof | printersheet | `TPL-PAYMENT-ENTITLEMENT` |
| 权限身份 | auth/session/roles/access control/negative cases | 通用 | `TPL-AUTH-IDENTITY` |
| 性能 | build/runtime/API/page flow 基准和回归门槛 | 通用 | `TPL-PERFORMANCE` |
| 安全 | secret guard、authz、input validation、dependency risk | 通用 | `TPL-SECURITY` |
| 可访问性 | keyboard/focus/label/contrast/responsive text | Web UI 项目 | `TPL-ACCESSIBILITY` |
| 可观测性 | logs/metrics/traces/error report/report-integrity | 通用 | `TPL-OBSERVABILITY`、`TPL-REPORT-GUARD` |
| 部署与环境 | env matrix、local/staging/deploy commands、rollback/runbook | 通用 | `TPL-DEPLOY-ENV`、`TPL-RELEASE-RUNBOOK` |
| 文档与交接 | HANDOFF、operator doc、acceptance report、known limitations | 通用 | `TPL-DOCS-HANDOFF` |
| 代码审查 | regression/risk/missing tests/security/maintainability findings | 通用 | `TPL-CODE-REVIEW` |
| 旧系统迁移 | reference-only、reuse boundary、compatibility、adapter migration | finahuntV2、pathnook | `TPL-LEGACY-MIGRATION` |
| 最终门禁 | 聚合 durable evidence，fail closed，禁止聊天式 PASS | 所有项目 | `TPL-FINAL-GATE` |
| 修复任务 | 从失败断言生成最小 repair，再重跑证明 | 所有项目 | `TPL-REPAIR` |

## 2. 通用任务骨架

生成任务文件时必须保留下面结构，并用项目事实填满。

```markdown
# Task <ID> - <Name>

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-...` |
| Task 类型 |  |
| 主验收面 |  |
| 为什么选这个模板 |  |
| 覆盖对象 | Req/UI/API/DB/ExternalData/Owner/Test IDs |
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

## Result JSON

必须写入 `docs/auto-execute/results/<TASK-ID>.json`。

## HANDOFF

必须写入 `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`。

## 12. 退出条件
```

## 3. 任务拆分粒度规则

| 场景 | 正确拆分 | 错误拆分 |
| --- | --- | --- |
| 多页面 UI | 一个 P0 页面或一个页面状态组一个 task | 把所有页面放进一个“大前端 task” |
| API | 一个业务 API 域或一组强相关 endpoints 一个 task | 把所有 API 开发和所有测试混在一起 |
| UI 一比一 | mapping、implementation、capture/diff、repair 可以拆开 | 只写“按图实现并检查” |
| 测试 | unit、integration、e2e、visual、final gate 分开 | 让开发 task 顺手“随便测一下” |
| 外部数据 | field mapping、mock write/readback、replay/idempotency 分开或明确分段 | 只证明函数返回成功 |
| AI/爬虫 | provider guard、normalization、fixture/live limitation 分开 | 把真实供应商调用当作默认验收 |
| 发布 | env/deploy/runbook/final gate 分开 | 直接把本地 smoke 当成上线证明 |

## 4. 标准模板详表

### `TPL-ORCH-T00` - 串行编排任务

- 用于：任务队列调度、resume probe、一个 fresh `codex exec` 一个任务、检查 result JSON/HANDOFF/log、失败转 repair。
- 必填输入：master plan、task queue、所有 task 文件、blockers、repair queue、results/latest 路径规则。
- 必填工作：检查队列顺序，按 predecessor gate 判断可执行性，启动一个 worker，等待退出，读取 durable evidence，再决定下一步。
- 禁止：实现产品代码、跳过失败任务、把聊天文字当完成证据、并行启动依赖任务。
- 验收证据：T00 自己的 result JSON/HANDOFF、队列状态、失败路由记录、最终 gate 调用记录。
- 失败路由：缺任务文件为 `NEEDS_REGENERATION`；缺前置 evidence 为 `REPAIR_REQUIRED` 或 `BLOCKED_BY_MISSING_SOURCE`。

### `TPL-INTAKE` - 项目接管任务

- 用于：source inventory、repo 状态、运行入口、PRD/UI/reference/code/harness 盘点。
- 必填输入：项目根目录、AGENTS.md、PRD、UI references、现有代码、参考项目边界。
- 必填工作：列出 source of truth、缺失源、local-only 边界、可运行命令、已知 blockers。
- 验收证据：inventory 文档、blocker 表、后续任务依赖表。
- 退出限制：intake 不等于产品完成，最高只能是 `PASS_WITH_LIMITATION` 或生成阶段的 `PLANNED`。

### `TPL-REQ-MATRIX` - 需求归一与追踪矩阵任务

- 用于：把 PRD、用户指令、UI、现有代码转成 P0/P1/P2 requirement IDs。
- 必填工作：每个需求必须映射 source、priority、role、UI/API/DB、实现 task、验证 task、evidence path。
- 禁止：把未确认候选需求当 P0；遗漏用户明确要求。
- 验收证据：requirement traceability matrix、未覆盖需求 blocker。

### `TPL-UI-MAP` - UI 参考映射任务

- 用于：截图、设计稿、HTML prototype、Figma reference 到 route/state/control/token 的映射。
- 必填工作：每个 UI reference 的 source path、viewport、dimensions、颜色、字体、间距、圆角、阴影、资产、目标 route、目标状态、数据 fixture、capture/diff 目标。
- 禁止：泛化成“做一个好看的页面”；缺失 UI 源时编造。
- 验收证据：ui-reference-map，后续 `TPL-FRONTEND-PAGE` 和 `TPL-VISUAL-COMPARE` 的输入。

### `TPL-REF-MAP` - 参考项目映射任务

- 用于：只读分析参考 repo 的结构、模式、helper、配置。
- 必填工作：列出已读文件、可借鉴模式、禁止复制的业务逻辑、目标项目适配规则。
- 禁止：修改参考项目；把参考项目业务当目标项目需求。
- 验收证据：reference mapping report、reuse boundary。

### `TPL-SCAFFOLD` - 项目骨架任务

- 用于：新建或修复 app/server/admin/miniapp/workspace 基础结构。
- 必填输入：技术栈、package manager、app paths、local start/test/build 命令。
- 必填工作：建立最小可运行结构、健康路由、基础 layout、API client、style tokens、基础测试。
- 验收证据：install/build/start/test 或等价 smoke 日志；不得声称业务功能完成。

### `TPL-DEV-FEATURE` - 通用开发实现任务

- 用于：实现一个明确 requirement ID 的产品能力，通常跨少量前后端/服务文件。
- 必填输入：Req ID、相关 UI/API/DB IDs、现有实现、允许路径、最小测试面。
- 必填工作：按现有代码模式实现功能，补齐错误处理、状态、类型、持久化或 UI 更新，写针对性测试。
- 禁止：扩大到无关需求；只写 mock/placeholder；跳过验证；修改参考项目。
- 最低验证：目标单元或集成测试；必要时 lint/typecheck/build/smoke。
- 验收证据：代码 diff、测试日志、result JSON 中的 covered IDs 和 limitation。
- 失败路由：测试失败先 task-local 修复；范围外缺口生成 `TPL-REPAIR` 或 `BLOCKED_BY_MISSING_SOURCE`。

### `TPL-BACKEND-FOUNDATION` - 后端基础任务

- 用于：server factory、env/config、auth middleware、local DB/storage adapter、error envelope。
- 必填工作：配置读取、secret redaction、local-only external adapter、health endpoint、基础 integration tests。
- 验收证据：backend start/health/test 日志、adapter mock proof。

### `TPL-API-DOMAIN` - API 域开发任务

- 用于：一组相关业务 API 的 routes/service/schema/tests。
- 必填输入：API IDs、method/path/auth/request/response/error、DB side effect、frontend caller。
- 必填工作：实现 route、service、validation、auth、error cases、DB mutation/readback、contract fixtures。
- 最低验证：success、auth failure、validation failure、not found/conflict、server/fallback、readback。
- 验收证据：API transcripts、test logs、DB readback JSON、contract matrix 更新。

### `TPL-CONTRACT` - 前后端合同对齐任务

- 用于：frontend caller 与 backend API 的 method/path/schema/status/error envelope 对齐。
- 必填工作：列 caller -> API rows，补 typed fixtures 或 schema tests，修正 drift。
- 验收证据：contract tests、API/DB contract matrix。

### `TPL-DATA-MODEL-MIGRATION` - 数据模型与迁移任务

- 用于：schema/table/collection/model/migration/seed 变更。
- 必填输入：DB IDs、migration plan、rollback/cleanup、seed fixture、readback target。
- 必填工作：新增或修改 schema、migration、adapter、fixtures、cleanup policy。
- 最低验证：migration up/down 或等价本地迁移、seed、mutation/readback。
- 禁止：破坏用户数据；无备份/回滚说明时做 destructive migration。
- 验收证据：migration log、before/after schema、readback proof。

### `TPL-DATA-IMPORT` - 数据导入任务

- 用于：CSV/Excel/upload/parser/import validation。
- 必填工作：合法样例、非法行、重复行、幂等、错误报告、DB write/readback。
- 禁止：失败值写成 0；吞掉无效行；只测 happy path。
- 验收证据：fixture、import result、DB readback、invalid-row report。

### `TPL-BUSINESS-ENGINE` - 业务引擎任务

- 用于：核心计算、规则、诊断、推荐、风控、排序、评分。
- 必填工作：输入模型、规则来源、边界条件、确定性 fixtures、service tests、API integration point。
- 验收证据：expected output 对照、edge case tests。

### `TPL-FRONTEND-SHELL` - 前端壳任务

- 用于：routes、layout、navigation、global tokens、API client、auth/session state、loading/empty/error foundation。
- 必填工作：路由表、布局、全局样式 token、基础状态组件、API 客户端错误处理。
- 验收证据：render smoke、route smoke、responsive basic check。

### `TPL-FRONTEND-PAGE` - 单页面实现任务

- 用于：一个 P0 route/page 或一个页面状态组。
- 必填输入：UI reference IDs、route、viewport、状态、controls、API/data dependencies、owner scenario IDs。
- 必填工作：实现 loaded/empty/error/loading/unauthorized/success 状态，处理表单、按钮、导航、toast/modal。
- 最低验证：页面 render、主要点击、表单校验、API/mock 数据、截图目标。
- 验收证据：browser/test logs、screenshots、covered UI IDs。

### `TPL-FRONTEND-COMPONENT` - 前端复杂组件任务

- 用于：modal/form/table/card/chart/uploader/editor 等状态组件。
- 必填工作：props/state/events、validation、keyboard/focus、loading/error、owner page integration。
- 验收证据：unit/component tests、集成页面 proof。

### `TPL-VISUAL-COMPARE` - 前端页面一比一复刻验证任务

- 用于：用户要求“一比一”“按图还原”“复刻 UI”“pixel-perfect”的页面或状态。
- 必填输入：reference image/prototype path、target route/state、viewport、fixture、expected assets、design tokens。
- 必填工作：启动本地 app 或可替代 harness，设置目标 fixture，捕获 actual screenshot，生成 diff、metrics、summary，列 material deviations。
- 禁止：只做结构检查就写 pixel-perfect PASS；用泛化 UI 替代参考图；缺 raster proof 时升级为 pure PASS。
- 最低验证：reference/actual/diff/metrics 四件套；移动端和桌面 viewport 按需求覆盖。
- 验收证据：`screenshots/<TASK-ID>/reference.*`、`actual.*`、`diff.*`、`metrics.json`、`visual-summary.json`。
- 状态规则：无真实截图或像素 diff 时最多 `PASS_NEEDS_MANUAL_UI_REVIEW`；存在明显差异为 `REPAIR_REQUIRED`。

### `TPL-VISUAL-REPAIR` - 视觉差异修复任务

- 用于：根据 visual-summary 的 deviation IDs 做最小 UI 修复并重截。
- 必填输入：失败截图、diff、metrics、deviation list、target files。
- 必填工作：只改导致差异的 tokens/layout/component，重启/重截/重算 diff。
- 验收证据：before/after artifacts、new metrics、remaining deviations。

### `TPL-OWNER-SCENARIO` - 业务用户场景矩阵任务

- 用于：生成老板/运营/管理员/普通用户的真实工作流矩阵。
- 必填工作：persona、preconditions、fixture、exact click path、expected route/API/DB/UI、evidence paths。
- 验收证据：owner-scenario-matrix。

### `TPL-OWNER-E2E` - 用户点击端到端任务

- 用于：模拟用户实际点击 P0 页面、按钮、表单、工作流。
- 必填工作：page -> click -> route/state -> API -> DB/local state -> visible UI proof。
- 最低验证：Playwright 或等价浏览器脚本、trace/screenshot、API/DB evidence。
- 失败路由：点击不可达、API 不匹配、DB 无 readback、UI 不显示都为 `REPAIR_REQUIRED`。

### `TPL-PAGE-CLICK-API` - 页面点击到 API/状态矩阵任务

- 用于：证明每个 P0 控件不是“摆设”，点击后有正确路由、API、DB/local state 或可见 UI 变化。
- 必填输入：UI control IDs、route、expected event、API IDs、DB/local state IDs、truthMode。
- 必填工作：生成 click/API execution matrix，标明 `REAL_API`、`FALLBACK`、`LOCAL_STATE`、`SANDBOX`、`TODO_CONFIRM`。
- 最低验证：每个 P0 button/tab/form/card 的 click assertion 和 evidence path。
- 验收证据：click matrix、browser trace、API transcript、state/readback proof。

### `TPL-API-DB-E2E` - API/DB 全量证明任务

- 用于：最终证明 API inventory 里所有 P0/P1 endpoints 的行为和持久化。
- 必填工作：success/auth/validation/not-found/conflict/server/fallback/mutation/readback 全矩阵。
- 验收证据：API transcript、DB readback、matrix summary。
- 禁止：只证明少数 happy path 后把全 API 视为通过。

### `TPL-TEST-UNIT` - 单元测试任务

- 用于：锁定函数、service、adapter、component 局部行为。
- 必填输入：target symbols、expected behavior、edge cases、existing tests。
- 必填工作：新增或修复最小单元测试，覆盖正常、边界、错误路径。
- 验收证据：targeted test command、coverage note 或 covered cases。

### `TPL-TEST-INTEGRATION` - 集成测试任务

- 用于：API/service/DB/adapter/frontend contract 的集成行为。
- 必填工作：启动必要本地依赖或 fake adapter，执行 request/response/persistence/readback。
- 验收证据：integration test logs、fixtures、readback/transcripts。

### `TPL-TEST-E2E` - 端到端测试任务

- 用于：真实用户流程或跨页面 workflow 的完整验证。
- 必填工作：启动 app，准备 fixture，浏览器执行，断言 visible UI、API、DB/state、截图/trace。
- 验收证据：e2e logs、screenshots、traces、result JSON。

### `TPL-EXTERNAL-DATA` - 外部数据验证任务

- 用于：Feishu/Bitable/spreadsheet/Airtable/Notion/SaaS storage 写入和回读。
- 必填输入：table/entity/field names、internal field、field type、unique_key、payload、credential policy。
- 必填工作：local fake/sandbox write、create/update/upsert、duplicate-run idempotency、failed-write pending cache、replay、independent readback。
- 禁止：缺真实凭证就失败整个本地验收；把失败采集值写成 0；没有 readback 就 pure PASS。
- 验收证据：payload JSON、adapter call log、readback JSON、pending/replay logs。

### `TPL-CRAWLER-PIPELINE` - 爬虫/归一化/合规管线任务

- 用于：crawl/fetch/parse/normalize/dedupe/ranking/source attribution。
- 必填输入：source URLs or fixture files、rate limit、robots/compliance rule、schema、dedupe key。
- 必填工作：本地 fixture 优先，真实网络可选且受限；解析失败、重复数据、字段缺失、source attribution 都要覆盖。
- 验收证据：raw fixture、normalized JSON、dedupe report、pipeline test log。

### `TPL-AI-PROVIDER` - AI/模型供应商任务

- 用于：LLM/AI provider 集成、prompt contract、response schema、mock/live smoke。
- 必填输入：provider boundary、env vars、prompt template、input/output schema、fallback/local mock、safety limits。
- 必填工作：本地 mock 和 schema validation 必须可跑；真实 provider 只在用户授权和本地密钥存在时 smoke。
- 禁止：把密钥写进代码/日志/report；把 provider failure 当 PASS；把 mock 结果说成真实模型证明。
- 验收证据：mock transcript、schema validation、live limitation 或 live smoke log。

### `TPL-SCHEDULER-JOB` - 定时任务/队列/重放任务

- 用于：cron/scheduler/job queue/full collect/pending replay。
- 必填工作：计划触发、手动触发、幂等、失败重试、pending cache、replay、run log。
- 验收证据：scheduler test、job log、before/after state、replay proof。

### `TPL-PAYMENT-ENTITLEMENT` - 支付/权益/付费墙任务

- 用于：payment guard、subscription/entitlement、paywall、paid export。
- 必填工作：local/sandbox-only payment adapter、entitlement states、authorized/unauthorized paths、no real charge proof。
- 禁止：真实扣费；生产支付凭证；缺 sandbox 仍写 pure PASS。
- 验收证据：sandbox/local adapter logs、entitlement readback、paywall UI screenshots。

### `TPL-EXPORT-DOWNLOAD` - 导出/下载/PDF/Word 任务

- 用于：PDF、Word、Excel、CSV、image、report export/download。
- 必填工作：输入 fixture、导出格式、文件名、MIME、content validation、paid/permission gate where applicable。
- 验收证据：生成文件、结构或文本校验、下载 response、权限负例。

### `TPL-AUTH-IDENTITY` - 身份权限任务

- 用于：登录、session、role、tenant、permission、access control。
- 必填工作：positive/negative auth、role matrix、route/API protection、session persistence、logout/expired session。
- 验收证据：auth tests、API negative transcripts、UI access screenshots。

### `TPL-PERFORMANCE` - 性能与回归任务

- 用于：API latency、page load、bundle/build、expensive workflow benchmark。
- 必填工作：基线、目标阈值、测量命令、热/冷运行说明、回归判定。
- 验收证据：metrics JSON、logs、before/after comparison。

### `TPL-SECURITY` - 安全审查与修复任务

- 用于：secret guard、authz、input validation、injection、dependency/security headers。
- 必填工作：扫描目标、风险等级、修复范围、负例测试、secret redaction。
- 验收证据：security checklist、test logs、known residual risk。

### `TPL-ACCESSIBILITY` - 可访问性任务

- 用于：Web UI 的 keyboard/focus/label/contrast/responsive text/status message。
- 必填工作：P0 pages/components 的 axe 或等价检查、键盘路径、焦点、ARIA/label、文本不溢出。
- 验收证据：accessibility report、screenshots 或 trace。

### `TPL-OBSERVABILITY` - 日志/指标/错误报告任务

- 用于：structured logs、task run logs、metrics、error boundary、report-integrity。
- 必填工作：关键业务事件日志、错误上下文、secret redaction、operator-readable summary。
- 验收证据：log samples、error-path test、redaction proof。

### `TPL-LOCAL-ONLY-GUARD` - 本地安全边界任务

- 用于：保护 cloud/payment/email/SMS/AI/storage 等外部副作用。
- 必填工作：env flags、mock/sandbox adapter、tests proving no real write、secret guard。
- 验收证据：adapter call log、network/side-effect guard proof、limitation wording。

### `TPL-LOCAL-SMOKE` - 本地全链路 smoke 任务

- 用于：clean start、seed fixture、basic full flow。
- 必填工作：启动 frontend/backend/DB/mocks，执行一个最短 happy path，收集 logs。
- 验收证据：start logs、health checks、basic UI/API proof。
- 限制：local smoke 不是 final PASS。

### `TPL-DEPLOY-ENV` - 部署环境任务

- 用于：env matrix、build/deploy/staging/local config、runtime compatibility。
- 必填工作：环境变量说明、build output、deploy command 或 dry-run、安全边界、rollback notes。
- 验收证据：build/deploy/dry-run logs、env checklist。

### `TPL-RELEASE-RUNBOOK` - 发布运行手册任务

- 用于：上线前检查、回滚、告警、手工操作、known limitations。
- 必填工作：preflight、release steps、rollback steps、post-release verification、owner contacts。
- 验收证据：runbook 文档和 final gate 引用。

### `TPL-DOCS-HANDOFF` - 文档与交接任务

- 用于：README、operator guide、HANDOFF、acceptance report、known limitations。
- 必填工作：把实际 evidence 路径、命令、限制、恢复方式写清楚。
- 禁止：用文档美化未通过状态；删除真实 blocker。
- 验收证据：docs diff、report-integrity check。

### `TPL-CODE-REVIEW` - 代码审查任务

- 用于：按 bug/risk/regression/missing tests/security/maintainability 做审查。
- 必填工作：列 findings，按严重程度排序，给文件/行号，区分 open questions、test gaps、residual risk。
- 验收证据：review report；如需修复，生成 `TPL-REPAIR`。

### `TPL-LEGACY-MIGRATION` - 旧系统迁移/复用边界任务

- 用于：从旧 repo 或参考项目迁移可复用模式、配置、adapter、tests。
- 必填工作：classify `COPY_AS_IS`、`ALLOW_ADAPT`、`REFERENCE_ONLY`、`FORBIDDEN`，列目标适配和验收。
- 禁止：无边界复制旧业务；让旧 repo 变成第二需求源。
- 验收证据：migration matrix、compatibility tests。

### `TPL-REPORT-GUARD` - 报告完整性与密钥保护任务

- 用于：最终报告前检查 result JSON、logs、screenshots、API transcripts、DB readbacks、secret leakage。
- 必填工作：交叉检查 claims vs durable evidence，扫描 secret，标记 stale/missing evidence。
- 验收证据：report-integrity result、secret-scan result。

### `TPL-FINAL-GATE` - 最终验收门禁任务

- 用于：聚合全部 durable evidence 并给最终 verdict。
- 必填工作：读取 requirement/UI/API/DB/external/owner/test matrices，读取 results/latest/evidence，只按真实证据判定。
- 禁止：实现缺失功能；把计划、聊天、dry-run、partial smoke 当 PASS。
- 验收证据：final acceptance report、machine-readable verdict。
- 状态规则：任一 P0 证据缺失必须 fail closed，不得 pure PASS。

### `TPL-REPAIR` - 最小修复任务

- 用于：从已知失败断言、visual deviation、contract drift、test failure 生成最小修复。
- 必填输入：source failure result、failing assertion、target files、allowed scope、rerun commands。
- 必填工作：最小改动、重跑失败命令、更新 evidence、写回 result/HANDOFF。
- 禁止：借 repair 扩展新功能；不重跑验证就写修复完成。

## 5. 质量审计检查表

生成 `<slug>-task-pack-quality-audit.md` 时必须检查：

| 检查项 | 失败条件 | Verdict |
| --- | --- | --- |
| 模板选择 | 任一 task 缺 `Task Template ID`、主验收面、选择理由、覆盖对象 | `NEEDS_REGENERATION` |
| 模板匹配 | 开发任务选测试模板，UI 一比一任务缺 visual 模板，API 任务缺 contract/readback | `NEEDS_REGENERATION` |
| 粒度 | 一个 task 覆盖过多页面/API/流程，导致无法由一个 fresh `codex exec` 完成和证明 | `NEEDS_REGENERATION` |
| 证据路径 | 缺 result JSON、HANDOFF、logs、screenshots/API/DB/readback 目标路径 | `NEEDS_REGENERATION` |
| 防停止 | 缺 dependency/resume、stop prevention、failure repair routing | `NEEDS_REGENERATION` |
| UI 一比一 | 缺 reference/actual/diff/metrics 或缺降级规则 | `NEEDS_REGENERATION` |
| 外部副作用 | 缺 local-only/mock/sandbox/secret guard | `NEEDS_REGENERATION` |
| 中文/编码 | 中文项目文档不是中文，字段名被翻译/拼音/乱码，UTF-8 不干净 | `NEEDS_REGENERATION` |

只有全部任务模板匹配且所有必填字段具体到项目事实时，任务包才可以标记 `READY_FOR_AUTO_EXECUTE`。这仍然只表示任务包可交给后续 auto-execute 运行，不表示产品已完成。

<!-- HISTORY-TEMPLATE-ADDITIONS:START -->
## History Scan Template Additions

When these task shapes appear, read the matching independent file under `references/templates/` before generating the task.

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
