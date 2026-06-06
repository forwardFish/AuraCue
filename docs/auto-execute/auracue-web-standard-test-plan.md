# AuraCue Web/H5 Standard Test Plan

| Test ID | 类型 | 覆盖对象 | 命令/动作 | 必须证据 | 状态 |
| --- | --- | --- | --- | --- | --- |
| TEST-UNIT-001 | unit | validators/envelope/API DTO | `pnpm --filter @auracue/web test` | logs/web/T02/T04/T05 | PLANNED |
| TEST-UNIT-002 | unit | draft store | `pnpm --filter @auracue/web test` | logs/web/T08 | PLANNED |
| TEST-UNIT-003 | unit | HoldToSealButton | `pnpm --filter @auracue/web test` | logs/web/T10 | PLANNED |
| TEST-API-001 | API | API-001..API-004 | `pnpm --filter @auracue/web test:api` | api/web/T12 + db/web/T12 | PLANNED |
| TEST-API-002 | API | API-005..API-006 | `pnpm --filter @auracue/web test:api` | generation transcripts/readback | PLANNED |
| TEST-API-003 | API | API-007..API-013 | `pnpm --filter @auracue/web test:api` | card/activation/share/analytics readback | PLANNED |
| TEST-PAGE-001 | page | `/`, context, upload, draw | `pnpm --filter @auracue/web test:pages` | logs/web/T09 | PLANNED |
| TEST-PAGE-002 | page | result/activate/activated | `pnpm --filter @auracue/web test:pages` | logs/web/T10 | PLANNED |
| TEST-PAGE-003 | page | share/saved | `pnpm --filter @auracue/web test:pages` | logs/web/T11 | PLANNED |
| TEST-E2E-001 | E2E | happy path | `pnpm --filter @auracue/web test:e2e -- web-p0-happy-path` | trace/screenshots/api/db | PLANNED |
| TEST-E2E-002 | E2E | skip upload | `pnpm --filter @auracue/web test:e2e -- web-p0-skip-upload` | trace/screenshots/api/db | PLANNED |
| TEST-E2E-003 | E2E | upload failure | `pnpm --filter @auracue/web test:e2e -- web-p0-upload-failure` | trace/screenshots/api/db | PLANNED |
| TEST-E2E-004 | E2E | generation fallback | `pnpm --filter @auracue/web test:e2e -- web-p0-generation-fallback` | trace + fallback evidence | PLANNED |
| TEST-E2E-005 | E2E | hold cancel/seal | `pnpm --filter @auracue/web test:e2e -- web-p0-hold-cancel` | seal/no-seal readback | PLANNED |
| TEST-RUNTIME-001 | runtime smoke | 整个 Web app 页面/API/DB 最短主链 | `pnpm --filter @auracue/web dev` + `pnpm --filter @auracue/web test:e2e -- web-p0-runtime-smoke` | live URL, page screenshots, API transcript, DB readback, rerun log | PLANNED |
| TEST-VIS-001 | visual | UI-001..UI-009 | `pnpm --filter @auracue/web test:visual` | reference/actual/diff/metrics | PLANNED |
| TEST-SEC-001 | security | secret/copy safety | `node scripts/acceptance/check-web-copy-safety.mjs` | report guard JSON | PLANNED |
| TEST-FINAL-001 | gate | all P0 | `powershell -ExecutionPolicy Bypass -File scripts/acceptance/run-web-final-gate.ps1` | web-final-gate.json | PLANNED |
