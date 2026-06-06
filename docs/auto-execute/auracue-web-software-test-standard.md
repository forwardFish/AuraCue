# AuraCue Web/H5 Software Test Standard

## 1. 测试层级

后续执行必须至少覆盖：

- Unit：validators、draft store、AI schema、renderer metadata、HoldToSealButton。
- API integration：所有 `/api/v1/*` success/validation/not-found/idempotency/readback。
- Page/component：9 个 route 的页面内容、按钮、表单、guard、错误态。
- E2E：完整 happy path、skip upload、upload failure、generation fallback、hold cancel、route guards、share/save。
- Visual：P0 UI reference 与 Web actual screenshot 的 reference/actual/diff/metrics。
- Final gate：读取 durable evidence fail closed。

## 2. 推荐命令

后续执行者应实现并运行：

```powershell
pnpm --filter @auracue/web lint
pnpm --filter @auracue/web typecheck
pnpm --filter @auracue/web test
pnpm --filter @auracue/web test:api
pnpm --filter @auracue/web test:pages
pnpm --filter @auracue/web test:e2e
pnpm --filter @auracue/web test:visual
pnpm --filter @auracue/web test:db
pnpm --filter @auracue/web build
node scripts/acceptance/check-web-api-contract.mjs
node scripts/acceptance/check-web-analytics-coverage.mjs
node scripts/acceptance/check-web-copy-safety.mjs
powershell -ExecutionPolicy Bypass -File scripts/acceptance/run-web-final-gate.ps1
```

命令不存在时，该 task 必须创建对应脚本或解释为 `REPAIR_REQUIRED`，不得跳过。

## 3. 证据要求

- 每个命令输出写入 `docs/auto-execute/logs/web/`。
- API transcript 写入 `docs/auto-execute/api/web/`。
- DB readback 写入 `docs/auto-execute/db/web/`。
- Playwright trace 写入 `docs/auto-execute/traces/web/`。
- 截图、diff、metrics 写入 `docs/auto-execute/screenshots/web/`。
- result JSON 必须列出 covered IDs、commands、evidence、blockers、next repair。

## 4. False PASS 禁止

- 缺 API/DB readback 不能 PASS。
- 缺完整用户点击链路不能 PASS。
- 缺 visual raster/diff 时最多 `PASS_NEEDS_MANUAL_UI_REVIEW`。
- mock AI 可证明流程，不可证明真实 provider 质量。
- local smoke 不等于 final gate。

