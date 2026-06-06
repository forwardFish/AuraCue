# History Task Template Coverage Audit

> Date: 2026-06-03
> Goal: scan historical `docs/auto-execute` task files, map them to current `task-auto-execute` templates, and identify templates that must be added or strengthened.

## Scan Scope

The conservative scan covered task-like markdown files under:

- `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute`
- `D:\lyh\agent\agent-frame\scoremap\docs\auto-execute`
- `D:\lyh\agent\agent-frame\xwstarmap\docs\auto-execute`
- `D:\lyh\agent\agent-frame\ShopOps\docs\auto-execute`
- `D:\lyh\agent\agent-frame\finahuntV2\docs\auto-execute`
- `D:\lyh\agent\agent-frame\printersheet\docs\auto-execute`
- `D:\lyh\AI\SnapRep\docs\auto-execute`

Excluded evidence-only folders: `latest`, `logs`, `screenshots`, `results`, `evidence`.

## Result

| Metric | Value |
| --- | --- |
| Historical task files scanned | 218 |
| Projects covered | 7 |
| Existing independent templates found | 47 |
| Primary missing template families found by conservative classifier | 9 |
| Additional hardening templates added from representative task review | 2 |
| Patched independent templates after content audit | 58 |
| Full patched template content audit | 58/58 PASS |

## Project Counts

| Project | Task Files |
| --- | ---: |
| scoremap | 80 |
| AuraCue | 46 |
| xwstarmap | 36 |
| SnapRep | 24 |
| ShopOps | 12 |
| finahuntV2 | 10 |
| printersheet | 10 |

## Existing Templates That Fit Many Historical Tasks

| Template | Historical fit |
| --- | --- |
| `TPL-FRONTEND-PAGE` | generic web/miniapp page implementation |
| `TPL-AI-PROVIDER` | AI provider, prompt, mock/live limits |
| `TPL-PAYMENT-ENTITLEMENT` | payment, unlock, paid states |
| `TPL-API-DOMAIN` | API route/domain work |
| `TPL-AUTH-IDENTITY` | auth, permission, secret hygiene |
| `TPL-ADMIN-WORKFLOW` | admin review/publish/upload |
| `TPL-DATA-MODEL-MIGRATION` | local DB, repository, schema |
| `TPL-API-DB-E2E` | all API DB readback proof |
| `TPL-CRAWLER-PIPELINE` | crawler/collector/normalization |
| `TPL-FINAL-GATE` | final gate and closure |

## Missing Or Too-Generic Template Families

The conservative classifier uses file names plus task headings/front matter. It identified 9 primary missing template families. Two more templates, `TPL-ALERT-REPORTING` and `TPL-LOCALE-ENCODING-GUARD`, were added from manual representative task review because their requirements are repeated and safety-critical even when they are not the primary classifier result.

| Needed Template | Evidence From Historical Tasks | Why Existing Templates Are Not Enough |
| --- | --- | --- |
| `TPL-HARNESS-EVIDENCE-GATE` | AuraCue `T00-intake-source-inventory-harness-decision.md`; finahuntV2 `21-task-02-harness-and-evidence-gates.md`; SnapRep `19-task-02-harness-and-evidence-gates.md` | `TPL-INTAKE` and `TPL-LOCAL-SMOKE` do not fully specify evidence directory contracts, proof strength, report-integrity gates, and fail-closed harness decisions. |
| `TPL-SCREENSHOT-PIXEL-HARNESS` | scoremap `T45-browser-screenshot-harness.md`, `T46-pixelmatch-artifact-writer.md`; AuraCue `T26-visual-capture-pixel-diff-harness.md`; xwstarmap `XWS-C29-runtime-visual-capture-harness.md` | `TPL-VISUAL-COMPARE` verifies output, but these tasks build the harness itself: route-aware preview renderer, rpx-to-px, anti-fake-actual guard, pixelmatch artifacts. |
| `TPL-DESIGN-TOKEN-ASSET-INVENTORY` | AuraCue `T02-extract-ui-tokens-and-asset-inventory.md`; scoremap `T24-design-tokens-routes.md`; xwstarmap `XWS-02-ui-visual-target-map.md` | `TPL-UI-MAP` maps screens but does not require token extraction, asset inventory, token package build, import tests, or anti-generic-style checks. |
| `TPL-MINIAPP-SHELL` | AuraCue `T08-mini-program-shell-routes-state-api-client.md`; scoremap `T06-miniapp-shell-navigation-and-contract.md`; xwstarmap `XWS-11-miniprogram-shell.md` | `TPL-FRONTEND-SHELL` is web-generic and misses mini-program app/page config, route registry, rpx/WXSS/WXML, fixture toggles, and miniapp API client constraints. |
| `TPL-MINIAPP-PAGE` | xwstarmap `XWS-12..16`; finahuntV2 `21-task-06-miniprogram-ui-acceptance.md`; scoremap miniapp page tasks | `TPL-FRONTEND-PAGE` is too broad for mini-program state, page JSON, WXML/WXSS, rpx conversion, preview harness, and miniapp-specific navigation. |
| `TPL-ASYNC-JOB-WORKFLOW` | AuraCue `T04-generation-job-and-structured-card-api.md`; SnapRep recognition/mock tasks | `TPL-API-DOMAIN` handles routes but not job lifecycle, pending/success/failure polling, deterministic local generator, retry/fallback, and generated artifact readback. |
| `TPL-REPORT-CARD-RENDERER` | AuraCue `T17-share-card-renderer.md`; scoremap `T22-full-report-question-cards.md`; xwstarmap `XWS-09-card-task-report-api.md` | `TPL-EXPORT-DOWNLOAD` covers downloads but not deterministic card/report renderer inputs, dimensions, text-fit, template metadata, data URL/local artifact, and renderer snapshot proof. |
| `TPL-QUOTA-RATE-LIMIT` | scoremap `T23-ai-tutor-api-quota-auth.md`, `T29-my-reports-quota-history.md`; SnapRep subscription/sandbox DTO tasks | `TPL-AUTH-IDENTITY` checks access but not quota counters, failed-call accounting, per-owner/per-question limits, repeated-submit behavior, and readback. |
| `TPL-METRIC-DELTA-ENGINE` | ShopOps `T05-metric-snapshot-delta-engine.md` | `TPL-BUSINESS-ENGINE` is generic and does not require snapshot windows, previous/current delta, null-not-zero failure semantics, Feishu field mapping, idempotency, and readback. |
| `TPL-ALERT-REPORTING` | ShopOps `T06-alerts-task-log-daily-report.md`; operator report tasks | `TPL-OBSERVABILITY` logs events, but alert/report tasks need alert threshold rules, task-run logs, daily report aggregation, delivery/local-only guard, and operator-facing Chinese copy. |
| `TPL-LOCALE-ENCODING-GUARD` | scoremap `V143-07-design-tokens-navigation-and-mojibake-guard.md`; multiple Chinese projects with mojibake risk | Existing language rules are global, but there is no executable task template for UTF-8 validation, Chinese field/copy preservation, mojibake scanning, and failure routing. |

## Patch Bundle

The supplemental independent templates are staged under:

`D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\templates\`

They should be copied into the global skill when write access is available:

`C:\Users\linyanhui\.agents\skills\task-auto-execute\references\templates\`

and then mirrored to:

`C:\Users\linyanhui\.codex\skills\task-auto-execute\references\templates\`

The global `audit-task-pack.py` `VALID_TEMPLATE_IDS` must also include the new template IDs listed above.

## Content Accuracy Follow-Up

This audit did not stop at adding template IDs. The follow-up content audit found that the new 11 templates needed full executable fields, and the existing 47 templates needed a shared content-accuracy appendix to force allowed scope, forbidden actions, evidence, Result JSON, and failure routing.

The verified patched snapshot is:

`D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill\task-auto-execute`

Content audit evidence:

```text
docs/auto-execute-template-audit/template-content-audit.md
docs/auto-execute-template-audit/template-content-quality-staged.json
docs/auto-execute-template-audit/template-content-quality-patched.json
```
