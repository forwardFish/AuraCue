# T13 Validation Log

Timestamp: 2026-06-05T18:46:49+08:00

## Runtime Smoke

- PASS: `pnpm.cmd --filter @auracue/web test:e2e -- web-p0-runtime-smoke`
- Internal app setup: `pnpm.cmd prisma db push`
- Internal app start: `node apps/web/node_modules/next/dist/bin/next dev --port 3213 --hostname 127.0.0.1`
- Internal browser start: `C:\Program Files\Google\Chrome\Application\chrome.exe --headless=chrome --remote-debugging-port=9322`

## Static And Targeted Checks

- PASS: `pnpm.cmd --filter @auracue/web typecheck`
- FAIL_THEN_PASS: `pnpm.cmd --filter @auracue/web lint`
- PASS: `pnpm.cmd --filter @auracue/web test:api -- card-activation-share`
- PASS: `pnpm.cmd --filter @auracue/web test:pages -- share-save`

## Evidence Summary Checks

```json
{
  "apiIds": [
    "API-001",
    "API-002",
    "API-003",
    "API-004",
    "API-005",
    "API-006",
    "API-007",
    "API-008",
    "API-009",
    "API-010",
    "API-011",
    "API-012",
    "API-013"
  ],
  "failedApiResponses": 0,
  "screenshots": 10,
  "consoleEvents": 0,
  "blockingConsoleErrors": 0,
  "dbCounts": {
    "AnonymousUser": 1,
    "OutfitUpload": 1,
    "DrawSession": 1,
    "GenerationJob": 1,
    "AuraCard": 1,
    "AuraActivation": 1,
    "SavedCard": 1,
    "ShareEvent": 4,
    "AnalyticsEvent": 15,
    "CardTemplate": 0
  }
}
```
