# T08 Route Smoke Log

Command:

```powershell
pnpm.cmd --filter @auracue/web test
```

Status: `PASS`

Checked routes:

- `/`
- `/create/context`
- `/create/upload`
- `/create/draw`
- `/result/[id]`
- `/activate/[id]`
- `/activated/[id]`
- `/share/[id]`
- `/saved/[id]`

Smoke asserted shared route constants, shared Web shell, loading/error components, API client, draft store, and UI token dependency presence.
