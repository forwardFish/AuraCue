# AuraCue H5/Web UI 复刻与测试进度报告

日期：2026-06-18

## 结论

目标尚未完成，当前状态为 `REPAIR_REQUIRED`。

已完成代码拉取、需求阅读、UI 文件流程化命名、H5/Web 静态路由/页面/API/typecheck/lint 验证，以及 Home 页第一轮对齐修复。完整浏览器 e2e 与重新截图对比仍未闭环，当前环境存在 `spawn EPERM`，会阻止 Node/Next/Chrome 由测试脚本启动子进程。

## 本轮已完成

1. 拉取最新代码：`git pull --rebase`，结果为 `Already up to date`。
2. 阅读需求源：
   - `docs/AuraCue_FINAL_PRD_Development_Spec_v4.1.md`
   - `docs/AuraCue_FINAL_Page_Flow_Design_Spec_v4.1.md`
3. 整理小程序 UI 文件命名：
   - 映射文档：`docs/UI/小程序/P0_UI_RENAME_MAP_v4.1.md`
   - 因当前环境拒绝删除/改名旧 PNG，落地方式为生成同内容的新命名副本。
4. H5/Web Home 第一轮对齐：
   - 首页标题改为 `Start Your Aura Journey`
   - 增加日期 pill：`Today, 18 Jul 2024`
   - 默认选中 `Confident`
   - 首页可见 mood card 对齐参考图为 `Confident / Romantic / Calm`
   - 首页右上角切换为 gift 图标
5. 测试基础设施修复：
   - e2e 支持复用外部 Web server / Chrome CDP，便于绕开 Node 子进程启动限制。
   - 页面/API evidence 写入增加 fallback，避免旧证据文件 EPERM 导致测试结论中断。
   - API 测试改为进程内 SQLite 初始化，并设置 `PRAGMA journal_mode = MEMORY`，避免 `SQLITE_IOERR_DELETE`。

## 已通过验证

| 验证项 | 命令 | 结果 |
| --- | --- | --- |
| 路由烟测 | `pnpm --filter @auracue/web test` | PASS |
| 页面合约 | `pnpm --filter @auracue/web test:pages` | PASS |
| API 全套 | `$env:DATABASE_URL='file:D:/tmp/auracue-api-tests-0618e.sqlite'; pnpm --filter @auracue/web test:api` | PASS |
| TypeScript | `pnpm --filter @auracue/web exec tsc --noEmit --incremental false` | PASS |
| ESLint | `pnpm --filter @auracue/web lint` | PASS |
| Visual compare 基线 | `$env:AURACUE_WEB_VISUAL_OUTPUT_ROOT='D:/tmp/auracue-visual-output-0618'; pnpm --filter @auracue/web test:visual` | PASS 生成报告，但 verdict 为 `REPAIR_REQUIRED` |

## 当前未通过 / 未闭环

### 浏览器 e2e

命令：

```powershell
$env:DATABASE_URL='file:D:/tmp/auracue-t13-runtime-smoke-0618f.sqlite'
pnpm --filter @auracue/web test:e2e
```

结果：

```text
Error: spawn EPERM
    at ChildProcess.spawn
    at startDevServer (.../apps/web/e2e/run-web-p0-runtime-smoke.mjs)
```

说明：当前会话中 Node 无法 `child_process.spawn()`，Next dev 本身也会 fork，因此无法完成由脚本启动的浏览器全流程截图。

### 视觉对比

Visual compare 已在 `D:/tmp/auracue-visual-output-0618/T15/visual-summary.json` 生成，结果仍为 `REPAIR_REQUIRED`。

| UI | 页面 | diffRatio | 状态 |
| --- | --- | ---: | --- |
| UI-001 | Home | 0.656037 | REPAIR_REQUIRED |
| UI-002 | Context | 0.273811 | REPAIR_REQUIRED |
| UI-003 | Upload | 0.377955 | REPAIR_REQUIRED |
| UI-004 | Draw | 0.379384 | REPAIR_REQUIRED |
| UI-005 | Result | 0.300366 | REPAIR_REQUIRED |
| UI-006 | Activate | 0.338469 | REPAIR_REQUIRED |
| UI-007 | Activated | 0.234022 | REPAIR_REQUIRED |
| UI-008 | Share | 0.380619 | REPAIR_REQUIRED |
| UI-009 | Saved | 0.378858 | REPAIR_REQUIRED |
| UI-010 | Upload Error | 0.027861 | REPAIR_REQUIRED |

注意：以上视觉数据使用的是已有 T13/T14 截图作为 actual；Home 代码已做第一轮修复，但受 `spawn EPERM` 影响，尚未重新生成最新 actual 截图，因此 diffRatio 仍是旧截图基线。

## 当前缺失页面 / 资料

按 v4.1 P0 流程，当前顶层 UI 图未发现：

| 流程 | 路由 / 页面 | 状态 |
| --- | --- | --- |
| P0-00 | `/` Bootstrap / 跳转判断 | 缺 UI 图 |
| P0-11 | `/saved/[id]` Saved Aura Card | 小程序顶层 UI 图缺失；Web visual T15 有旧参考 |
| P0-14 | `/legal/privacy` Privacy Policy | 缺 UI 图 |
| P0-15 | `/legal/terms` Terms of Use | 缺 UI 图 |

## 下一步

1. 解决或绕开当前 `spawn EPERM` 后，重新跑 `test:e2e` 生成最新 T13/T14 actual 截图。
2. 重新跑 visual compare，确认 Home 第一轮修复后的 diff。
3. 按 diffRatio 优先级继续修 UI-002 到 UI-009。
4. 补齐缺失页面 UI 或确认这些页面采用非视觉验收。
5. 全流程 e2e、visual、API、pages、typecheck、lint 全部通过后，才能将 goal 标记为 complete。
