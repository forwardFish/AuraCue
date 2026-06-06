# AuraCue Web/H5 Final Acceptance Gate

## 1. Gate 命令

后续执行者必须实现并运行：

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
powershell -ExecutionPolicy Bypass -File scripts\acceptance\run-web-final-gate.ps1
```

如使用等价 Node gate，必须仍写入：

`docs/auto-execute/results/web/web-final-gate.json`

## 2. Gate 输入

- `auracue-web-requirement-traceability-matrix.md`
- `auracue-web-ui-reference-map.md`
- `auracue-web-api-db-contract-matrix.md`
- `auracue-web-standard-test-plan.md`
- `auracue-web-owner-scenario-matrix.md`
- `docs/auto-execute/results/web/*.json`
- `docs/auto-execute/latest/web/*HANDOFF.md`
- `docs/auto-execute/api/web/**`
- `docs/auto-execute/db/web/**`
- `docs/auto-execute/traces/web/**`
- `docs/auto-execute/screenshots/web/**`
- `docs/auto-execute/logs/web/**`

## 3. Fail-Closed 规则

最终 `PASS` 必须同时满足：

- 所有 P0 requirement 有实现 task、验证 task、真实证据。
- 所有 13 个 `/api/v1/*` endpoint 有 success/negative/readback。
- 所有 P0 DB mutation 有独立 readback。
- 所有 9 个 Web P0 页面有页面测试和 E2E 覆盖。
- T13 runtime smoke 真实启动整个 app，访问 live URL，页面点击调用后端接口，完整走到保存/分享，并在失败后重跑到通过或留下 repair evidence。
- 至少一条完整 owner journey 证明页面点击 -> API -> DB -> 可见结果。
- mock AI fallback 可在无 key 时完成流程，且没有 secret 泄露。
- 视觉 reference/actual/diff/metrics 齐全；否则不能 pure PASS。
- report claims 与 durable evidence 一致。

任何 P0 缺口必须给 `REPAIR_REQUIRED`、`BLOCKED_BY_ENVIRONMENT` 或 `BLOCKED_BY_MISSING_SOURCE`，不能写聊天式完成。
