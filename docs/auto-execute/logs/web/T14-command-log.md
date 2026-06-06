# T14 Command Log

Verdict: PASS
Mode: owner-click-e2e
Server mode: production
Timestamp: 2026-06-06T00:01:04.155Z
Live URL: http://127.0.0.1:3214
Database URL: file:./t14-owner-click-e2e.sqlite

## Commands

- PASS: `apply committed migration SQL -> t14-owner-click-e2e.sqlite` -> apps/web/prisma/migrations/20260604010930_init/migration.sql
- STARTED: `node apps/web/node_modules/next/dist/bin/next start --port 3214 --hostname 127.0.0.1` -> docs/auto-execute/logs/web/T14-start.log
- STARTED: `C:\Program Files\Google\Chrome\Application\chrome.exe --headless=chrome --remote-debugging-port=9324` -> docs/auto-execute/logs/web/T14-browser.log

## Evidence

- Start log: docs/auto-execute/logs/web/T14-start.log
- API transcript: docs/auto-execute/api/web/T14/runtime-smoke-api-transcript.json
- DB readback: docs/auto-execute/db/web/T14/runtime-smoke-readback.json
- Trace: docs/auto-execute/traces/web/T14/owner-click-e2e/runtime-smoke-trace.json
- Screenshots: docs/auto-execute/screenshots/web/T14/owner-click-e2e
