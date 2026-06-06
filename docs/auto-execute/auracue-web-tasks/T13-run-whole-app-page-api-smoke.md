# Task T13 - Run Whole App Page API Smoke

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-LOCAL-SMOKE` |
| Task 类型 | local smoke |
| 主验收面 | clean local start and one full page/API flow |
| 为什么选这个模板 | 用户明确要求 task 执行后能跑起来 app、调用后端接口、完整流程跑完；本任务专门证明整个 Web app 能启动并完成页面到 API 到 DB 的最短主链 |
| 覆盖对象 | Runtime-Web, UI-001..UI-009, API-001..API-013, DB core, Owner-001 |
| 辅助模板 | `TPL-TEST-E2E`, `TPL-PAGE-CLICK-API` |

## Codex Exec

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T13-run-whole-app-page-api-smoke.md"
```

## 1. Task 目标

真实启动 AuraCue Web/H5 app 和所需本地 DB/mock，打开 live 页面，从首页跑完整最短主流程：Mood -> Context -> Upload Skip -> Draw -> Generate -> Result -> Activate -> Hold Seal -> Activated -> Save -> Share/Copy/Download。必须截获页面触发的后端 `/api/v1/*` 调用，并保存 DB readback。失败后必须修复并反复重跑，直到通过或留下明确 `REPAIR_REQUIRED` evidence。

## 2. 必须读取的输入

T09、T10、T11、T12 HANDOFF；`auracue-web-owner-scenario-matrix.md`；`auracue-web-api-db-contract-matrix.md`；Web spec §1.3、§8、§15。

## 3. 允许改动范围

`apps/web/e2e/**`、`apps/web/tests/**`、`apps/web/playwright.config.*`、`scripts/acceptance/**`、必要的最小产品修复文件、future evidence paths。

## 4. 禁止事项

不允许只跑静态 render；不允许只调用 API 而不打开页面；不允许只打开页面而不证明 API/DB；不允许失败后写“手动验证”；不允许把旧小程序 smoke 当 Web smoke。

## 5. 依赖与续跑门槛

前置：T09、T10、T11、T12 result/HANDOFF 必须存在。若 app 无法启动，先修复本 task 允许范围内的启动/配置问题；若需要回到 API/page task，写 repair route。

## 6. 执行步骤

1. 准备 env 和 test DB/seed，确保无真实外部副作用。
2. 清理或确认端口，启动 `pnpm --filter @auracue/web dev` 或等价命令。
3. 等待 live URL ready，记录 health/ready signal。
4. 用 Playwright 打开 `/`，完成最短主链点击。
5. 在浏览器测试中监听/记录所有 `/api/v1/*` request/response。
6. 对 user、draw session、generation job、card、activation、saved card、share event、analytics event 做 DB readback。
7. 保存 screenshots、trace、API transcript、DB readback、start logs。
8. 任一页面、API、DB、console error 失败，修复后重启 app 并重跑；result JSON 中记录 rerun count。

## 7. 必须输出

| 输出 | 必须内容 |
| --- | --- |
| `docs/auto-execute/logs/web/T13-start.log` | dev server 启动日志和 live URL |
| `docs/auto-execute/traces/web/T13/runtime-smoke/` | Playwright trace |
| `docs/auto-execute/screenshots/web/T13/runtime-smoke/` | 首页、draw、result、activate、activated、share、saved 截图 |
| `docs/auto-execute/api/web/T13/runtime-smoke-api-transcript.json` | 页面实际触发的 API request/response |
| `docs/auto-execute/db/web/T13/runtime-smoke-readback.json` | 完整流程 DB readback |
| `docs/auto-execute/results/web/T13.json` | verdict、rerun count、commands、covered IDs、evidence、blockers |
| `docs/auto-execute/latest/web/T13-HANDOFF.md` | 当前状态、失败/修复记录、T14 输入 |

## 8. 最低验证命令

```powershell
pnpm --filter @auracue/web dev
pnpm --filter @auracue/web test:e2e -- web-p0-runtime-smoke
```

如果 dev server 需后台启动，必须把 PID、端口、URL、关闭方式写入 result/HANDOFF，且 task 结束前关闭临时进程或说明仍需 T14 复用。

## 9. 细化验收标准

### Functional

- App live URL 可访问。
- Mood 到 Saved/Share 的最短主链完整。
- 上传选择 Skip 时仍能生成。
- Hold 3100ms 后 seal 成功。
- 保存、分享、复制、下载至少证明一个成功动作和 API 记录。

### API/DB

- transcript 中出现 API-001、API-004、API-005、API-007、API-009、API-010、API-011、API-012、API-013。
- DB readback 至少覆盖 AnonymousUser、DrawSession、GenerationJob、AuraCard、Activation、SavedCard、ShareEvent、AnalyticsEvent。

### UI

- 每个主阶段至少一张 live screenshot。
- 页面无 blocking console error。

## 10. 防停止规则

失败必须先修复并重跑；最多只有环境不可启动且替代路径也无法证明时，才能写 `BLOCKED_BY_ENVIRONMENT`。不能以“后续 E2E 会测”结束。

## 11. 失败修复路由

启动失败：T02/T04/T08 repair；页面断裂：T09/T10/T11 repair；API/DB 失败：T05/T06/T07/T12 repair；浏览器环境缺失：`BLOCKED_BY_ENVIRONMENT`。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

`docs/auto-execute/results/web/T13.json` verdict 为 `PASS` 或明确 repair/blocker；若不是 `PASS`，T14/T15/T16 不得升级最终状态为 pure PASS。
