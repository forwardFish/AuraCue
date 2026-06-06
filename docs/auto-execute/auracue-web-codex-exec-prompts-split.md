# AuraCue Web/H5 Split Codex Exec Commands

推荐执行方式是 `same-session-serial`：在当前 Codex 会话中一次只执行一个 task boundary，写入 result JSON、HANDOFF、日志后自动进入下一条，不要为普通继续动作停下来问用户。

下面的 split `codex exec` 命令只适用于能无例行审批启动 fresh worker 的环境。若在 Codex App / Windows 审批表面运行会弹出 Action Required，请不要逐条使用这些命令；改用 `auracue-web-codex-exec-prompts.md` 中的 same-session-serial 入口。

每条命令只执行一个 task。使用 fresh-worker 模式时，上一条 `codex exec` 必须完全退出，并写入 result JSON、HANDOFF、日志后，才能启动下一条。

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T00-omx-auto-execute-orchestrator.md。只做队列编排、续跑检查和失败路由。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T01-source-lock-and-intake.md。完成 Web-first source inventory 和 blocker map。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T02-web-scaffold-next-app.md。建立 apps/web Next.js Web/H5 可运行骨架。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T03-prisma-data-model-seed.md。实现 Prisma schema、seed、migration/readback。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T04-api-foundation-route-handlers.md。实现 API foundation、env、error envelope、local guards。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T05-identity-upload-draw-apis.md。实现 identity、today、upload、draw APIs。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T06-ai-generation-apis.md。实现 AI/mock provider、generate、generation job APIs。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T07-card-activation-save-share-apis.md。实现 card/render/activation/save/share/analytics APIs。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T08-web-shell-draft-api-client.md。实现 Web shell、draft store、API client、tokens。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T09-web-create-flow-pages.md。实现首页、context、upload、draw 页面流。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T10-web-result-activation-pages.md。实现 result、activate、activated 页面流。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T11-web-share-save-pages.md。实现 share、saved、copy/download/save 页面流。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T12-api-db-contract-e2e.md。证明所有 API/DB success/negative/readback。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T13-run-whole-app-page-api-smoke.md。启动整个 Web app，打开页面，调用后端接口，跑通完整最短主流程；失败必须修复并重跑。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T14-owner-click-e2e.md。用 Playwright 证明完整用户点击链路。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T15-visual-compare.md。生成 Web UI reference/actual/diff/metrics 视觉证据。"
codex exec "读取并执行 docs/auto-execute/auracue-web-tasks/T16-report-guard-final-gate.md。执行 report guard 和 final gate，fail closed。"
```
