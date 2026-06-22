# T13 Command Log

Verdict: PASS
Mode: web-p0-runtime-smoke
Server mode: development
Timestamp: 2026-06-21T16:52:23.465Z
Live URL: http://127.0.0.1:3213
Database URL: file:./t13-runtime-smoke.sqlite

## Commands

- PASS: `apply committed migration SQL -> t13-runtime-smoke.sqlite` -> apps/web/prisma/migrations/20260604010930_init/migration.sql
- STARTED: `node apps/web/node_modules/next/dist/bin/next dev --port 3213 --hostname 127.0.0.1` -> docs/auto-execute/logs/web/T13-start.log
- STARTED: `C:\Program Files\Google\Chrome\Application\chrome.exe --headless=chrome --remote-debugging-port=9322` -> docs/auto-execute/logs/web/T13-browser.log

## Evidence

- Start log: docs/auto-execute/logs/web/T13-start.log
- API transcript: docs/auto-execute/api/web/T13/runtime-smoke-api-transcript.json
- DB readback: docs/auto-execute/db/web/T13/runtime-smoke-readback.json
- Trace: docs/auto-execute/traces/web/T13/runtime-smoke/runtime-smoke-trace.json
- Screenshots: docs/auto-execute/screenshots/web/T13/runtime-smoke
