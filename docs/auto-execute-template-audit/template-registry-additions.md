# Template Registry Additions

Add these IDs to `VALID_TEMPLATE_IDS` in `scripts/audit-task-pack.py`, to the index table in `references/task-archetype-templates.md`, and to the classification catalog in `references/software-dev-task-templates.md`.

```python
"TPL-HARNESS-EVIDENCE-GATE",
"TPL-SCREENSHOT-PIXEL-HARNESS",
"TPL-DESIGN-TOKEN-ASSET-INVENTORY",
"TPL-MINIAPP-SHELL",
"TPL-MINIAPP-PAGE",
"TPL-ASYNC-JOB-WORKFLOW",
"TPL-REPORT-CARD-RENDERER",
"TPL-QUOTA-RATE-LIMIT",
"TPL-METRIC-DELTA-ENGINE",
"TPL-ALERT-REPORTING",
"TPL-LOCALE-ENCODING-GUARD",
```

## Index Rows

| Template ID | 类型 | 适用 task | 不能用于 |
| --- | --- | --- | --- |
| `TPL-HARNESS-EVIDENCE-GATE` | harness/evidence | evidence gates、proof strength、runtime gate、report integrity setup | 产品功能实现 |
| `TPL-SCREENSHOT-PIXEL-HARNESS` | screenshot/pixel harness | Playwright capture、rpx-to-px、pixelmatch artifacts、anti-fake actual guard | 页面样式修复 |
| `TPL-DESIGN-TOKEN-ASSET-INVENTORY` | design token/assets | token extraction、asset inventory、visual motif map、token build | 单页面实现 |
| `TPL-MINIAPP-SHELL` | mini-program shell | app/page config、route registry、state/API client、fixture toggles | 具体页面视觉实现 |
| `TPL-MINIAPP-PAGE` | mini-program page | WXML/WXSS/page JSON、rpx layout、miniapp navigation/state | Web-only page |
| `TPL-ASYNC-JOB-WORKFLOW` | async job | job create/poll/result/failure/retry/local generator/readback | simple CRUD API |
| `TPL-REPORT-CARD-RENDERER` | renderer | share card、report card、image/PDF-like renderer, text fit, snapshot proof | raw file download only |
| `TPL-QUOTA-RATE-LIMIT` | quota/rate limit | quota counters、failed-call accounting、owner limits、readback | simple auth gate |
| `TPL-METRIC-DELTA-ENGINE` | metrics/delta | snapshot windows、previous/current deltas、null-not-zero failures | generic business rule |
| `TPL-ALERT-REPORTING` | alerts/reporting | alert thresholds、task logs、daily report aggregation、operator copy | generic logs only |
| `TPL-LOCALE-ENCODING-GUARD` | locale/encoding | Chinese copy/field preservation、UTF-8 scan、mojibake guard | translation-only work |
