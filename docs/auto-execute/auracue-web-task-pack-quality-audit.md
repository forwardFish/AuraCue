# AuraCue Web/H5 Task Pack Quality Audit

生成日期：2026-06-03
审计对象：`docs/auto-execute/auracue-web-*`

## 1. Verdict

`READY_FOR_AUTO_EXECUTE`

理由：本包包含 Web-first source、标准、矩阵、task queue、split commands、T00 编排器和 T01-T16 共 16 个后续任务文档。所有任务均选定 `Task Template ID`，对应独立模板文件存在，并按一个主验收面拆分。生成阶段未创建 result JSON、HANDOFF、logs、screenshots、API transcript 或 DB readback。

## 2. Task Template Matching Audit

| Task | Template | 匹配结论 |
| --- | --- | --- |
| T00 | `TPL-ORCH-T00` | 正确：唯一串行编排入口 |
| T01 | `TPL-INTAKE` | 正确：锁定 source inventory 和 blocker |
| T02 | `TPL-SCAFFOLD` | 正确：建立 Web app 可运行骨架 |
| T03 | `TPL-DATA-MODEL-MIGRATION` | 正确：Prisma schema/migration/seed/readback |
| T04 | `TPL-BACKEND-FOUNDATION` | 正确：API foundation/env/error/local guard |
| T05 | `TPL-API-DOMAIN` | 正确：identity/upload/draw API 域 |
| T06 | `TPL-AI-PROVIDER` | 正确：AI/mock provider 和 generation contract |
| T07 | `TPL-API-DOMAIN` | 正确：card/activation/save/share/analytics API 域 |
| T08 | `TPL-FRONTEND-SHELL` | 正确：route/layout/api client/draft foundation |
| T09 | `TPL-FRONTEND-PAGE` | 正确：create flow 页面组 |
| T10 | `TPL-FRONTEND-PAGE` | 正确：result/activation 页面组 |
| T11 | `TPL-FRONTEND-PAGE` | 正确：share/save 页面组 |
| T12 | `TPL-API-DB-E2E` | 正确：全 API/DB 证明 |
| T13 | `TPL-LOCAL-SMOKE` | 正确：显式启动整个 Web app 并跑页面/API/DB 最短主链，失败需修复重跑 |
| T14 | `TPL-OWNER-E2E` | 正确：用户点击端到端 |
| T15 | `TPL-VISUAL-COMPARE` | 正确：视觉 reference/actual/diff/metrics |
| T16 | `TPL-FINAL-GATE` | 正确：最终 fail-closed 门禁，辅助 report guard |

## 2.1 Template Structure Audit

| 检查项 | 结果 |
| --- | --- |
| 17 个 task 文件均包含 `Task Template ID` | PASS |
| 17 个 `Task Template ID` 均能在 `references/templates/TPL-*.md` 找到独立模板文件 | PASS |
| 17 个 task 均包含通用 0-12 章节 | PASS |
| 17 个 task 均包含显式 `Result JSON` 和 `HANDOFF` 章节 | PASS |
| T13 单独使用 `TPL-LOCAL-SMOKE` 强制启动整个 app、跑页面/API/DB 主链 | PASS |

## 3. 生成边界审计

| 项 | 结果 |
| --- | --- |
| 是否修改产品代码 | 否 |
| 是否执行实现命令 | 否 |
| 是否启动 app/API | 否 |
| 是否调用 API/写 DB | 否 |
| 是否创建 result JSON/HANDOFF | 否 |
| 是否创建运行证据 | 否 |
| 是否保留中文 UTF-8 | 是 |

## 4. 已知限制

- UI reference 主要来自小程序图和 Stitch HTML，Web visual task 必须在 T14 进行真实截图/diff；生成阶段不能声称视觉 PASS。
- 现有旧 `apps/api` 不等于 Web-first `/api/v1/*` 完成；T04-T07 必须重建或迁移到 `apps/web`。
- 真实 AI provider smoke 只有在本地有 key 且被后续执行授权时才能运行；默认 mock fallback 足以证明流程，不证明真实模型质量。
