# T08 Unit Log

Command:

```powershell
pnpm.cmd --filter @auracue/web test -- draft-store api-client
```

Final status: `PASS`

Evidence:

```json
{
  "draft-store": {
    "status": "PASS",
    "storageKey": "auracue:web:draft:v1",
    "persistedFields": ["mood", "context", "uploadId", "drawSessionId", "drawPosition"],
    "blockedFields": ["cardId", "activationId"]
  },
  "api-client": {
    "status": "PASS",
    "checked": ["success envelope", "error envelope", "network error", "analytics whitelist"]
  }
}
```
