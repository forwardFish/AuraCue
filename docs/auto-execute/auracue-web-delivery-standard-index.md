# AuraCue Web/H5 Delivery Standard Index

生成日期：2026-06-03
项目根目录：`D:\lyh\agent\agent-frame\AuraCue`
项目 slug：`auracue-web`
project_language：`zh-CN`

## 1. 本任务包边界

本包由 `task-auto-execute` 生成，只用于后续 `auto-execute` / fresh `codex exec` 串行执行。生成本包时没有开发产品代码、没有启动服务、没有点击页面、没有调用 API、没有写 DB、没有创建 result JSON、没有创建 HANDOFF，也没有生成任何 PASS 证据。

后续执行完成定义：H5/Web App 能启动，`apps/web` 能完成 Web-first P0 主流程，统一 `/api/v1/*` 后端接口可被页面调用，DB mutation/readback 可证明，mock AI fallback 在无 key 时能走完整流程，Playwright/页面/API/视觉/final gate 全部给出 durable evidence。

## 2. Source Of Truth

| Source ID | 类型 | 路径 | 用途 | 生成阶段状态 |
| --- | --- | --- | --- | --- |
| SRC-AGENTS | agent 规则 | `D:\lyh\agent\agent-frame\AuraCue\AGENTS.md` | 约束所有后续执行者 | PLANNED |
| SRC-PRD-001 | 最终 PRD | `D:\lyh\agent\agent-frame\AuraCue\docs\AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md` | P0 产品、API、数据、页面、验收源头 | PLANNED |
| SRC-WEB-001 | Web-first 开发契约 | `D:\lyh\agent\agent-frame\AuraCue\docs\AuraCue_Web_First_Full_Development_Spec_v1.0.md` | 当前版本最高优先级：H5/Web 主工程 | PLANNED |
| SRC-UI-HOME | 首页视觉标准 | `D:\lyh\agent\agent-frame\AuraCue\docs\AuraCue_首页视觉设计与前端开发标准_v1.0.md` | 首页视觉、文案、交互标准 | PLANNED |
| SRC-UI-001 | P0 UI 参考图 | `D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序\P0-*.png` | Web 视觉方向参考，不绑定小程序路由 | PLANNED |
| SRC-STITCH | UI HTML 原型 | `D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序\stitch_codex_ui_code_generator\**\code.html` | 可迁移页面结构/视觉参考 | PLANNED |
| SRC-API-LEGACY | 现有本地 API | `D:\lyh\agent\agent-frame\AuraCue\apps\api` | 只复用 fallback、repository、renderer 思路；不得当作 Web v1 API 完成 | PLANNED |
| SRC-MINI-LEGACY | 现有小程序 | `D:\lyh\agent\agent-frame\AuraCue\apps\wechat-mini` | 后续适配参考；不是本阶段主交付 | PLANNED |

## 3. 标准依据

- 生命周期与追踪：ISO/IEC/IEEE 12207 风格的需求、实现、验证、证据闭环。
- 产品质量：ISO/IEC 25010 风格的功能、可用性、可靠性、安全、可维护性。
- 测试过程：ISO/IEC/IEEE 29119 风格的测试计划、执行、缺陷、回归。
- 安全开发：NIST SSDF / OWASP ASVS 风格的 secret guard、输入校验、鉴权边界。
- Web 可访问性：WCAG 2.2 风格的键盘、焦点、标签、对比度、响应式文本。
- API 合同：OpenAPI 风格的 method/path/request/response/error/readback。
- 交付证据：本地 durable evidence，不用聊天内容替代证据。

## 4. 文档地图

| 文档 | 控制内容 |
| --- | --- |
| `auracue-web-auto-execute-master-plan.md` | 执行顺序、任务队列、最终成功条件 |
| `auracue-web-development-standard.md` | 后续执行者的开发约束 |
| `auracue-web-software-test-standard.md` | 后续执行者的测试和证据约束 |
| `auracue-web-requirement-traceability-matrix.md` | Req -> Task -> Test -> Evidence |
| `auracue-web-ui-reference-map.md` | UI reference -> route/state/control/viewport |
| `auracue-web-api-db-contract-matrix.md` | `/api/v1/*` 与 DB readback 合同 |
| `auracue-web-external-data-validation-matrix.md` | 外部数据边界，本阶段 local-only |
| `auracue-web-standard-test-plan.md` | API/page/E2E/visual/final gate 测试矩阵 |
| `auracue-web-owner-scenario-matrix.md` | 模拟真实用户点击路径 |
| `auracue-web-final-acceptance-gate.md` | fail-closed 最终门禁 |
| `auracue-web-codex-exec-prompts.md` | 后续执行入口 |
| `auracue-web-codex-exec-prompts-split.md` | 一 task 一 fresh `codex exec` 命令 |
| `auracue-web-task-pack-quality-audit.md` | 任务包质量审计 |
| `auracue-web-tasks/*.md` | 每个任务的独立执行说明 |

## 5. 证据地图

后续执行者必须写入，但本生成阶段不得创建：

| 证据 | 未来路径 |
| --- | --- |
| result JSON | `docs/auto-execute/results/web/<TASK-ID>.json` |
| HANDOFF | `docs/auto-execute/latest/web/<TASK-ID>-HANDOFF.md` |
| 日志 | `docs/auto-execute/logs/web/<TASK-ID>-*.log` |
| API transcript | `docs/auto-execute/api/web/<TASK-ID>/*.json` |
| DB readback | `docs/auto-execute/db/web/<TASK-ID>/*.json` |
| Playwright trace | `docs/auto-execute/traces/web/<TASK-ID>/` |
| 截图与视觉 diff | `docs/auto-execute/screenshots/web/<TASK-ID>/` |
| final gate | `docs/auto-execute/results/web/web-final-gate.json` |

## 6. 状态词规则

生成阶段只能使用 `PLANNED`、`BLOCKED_BY_MISSING_SOURCE`、`OUT_OF_SCOPE_WITH_REASON`。`PASS`、`PASS_WITH_LIMITATION`、`PASS_NEEDS_MANUAL_UI_REVIEW`、`REPAIR_REQUIRED`、`BLOCKED_BY_ENVIRONMENT`、`HARD_FAIL` 只能由后续真实执行 evidence 决定。

