# Template Content Accuracy Audit

> Date: 2026-06-03
> Goal: verify whether the matched templates are content-accurate enough to generate executable auto-execute tasks, not only whether a template ID exists.

## Audit Conclusion

The first pass found two different issues:

1. Historical coverage issue: 47 existing global templates missed 9 primary task families from historical task packs.
2. Content accuracy issue: the 11 new templates needed to be full execution templates, and the 47 existing templates needed a shared content-accuracy appendix because many lacked explicit allowed scope, Result JSON, content gate, or failure-routing fields.

The patched skill snapshot now passes both checks:

| Check | Result |
| --- | --- |
| Historical task files scanned | 218 |
| Projects covered | 7 |
| Template files in patched snapshot | 58 |
| Missing primary template families after patch | 0 |
| Strict content audit for 11 new templates | 11/11 PASS |
| Full content audit for patched 58 templates | 58/58 PASS |
| Sync dry-run against patched snapshot | 0 pending changes |

## Why Adding Template IDs Was Not Enough

Historical task files showed repeated failures that are not solved by naming a template:

- One-to-one visual work needs real `reference/actual/diff/metrics` artifacts and honest downgrade when raster proof is missing.
- Mini-program work must distinguish real WeChat simulator/device proof from local HTML/mock preview proof.
- API/domain work must include negative cases, DB readback, and frontend caller contract.
- Async job work must prove create/poll/result/failure/retry lifecycle, not only create an endpoint.
- Chinese projects need UTF-8/code-point validation and exact Chinese field/copy preservation, not terminal-rendering guesses.
- Final/reporting work must map every claim to durable evidence and fail closed when evidence is missing.

## New Templates Strengthened

| Template | Content accuracy additions |
| --- | --- |
| `TPL-HARNESS-EVIDENCE-GATE` | proof-strength vocabulary, runtime preflight, report-integrity, secret guard, Result JSON fields |
| `TPL-SCREENSHOT-PIXEL-HARNESS` | actual-source guard, `390x844`/rpx rules, `pixelmatch` outputs, anti-fake check, downgrade statuses |
| `TPL-DESIGN-TOKEN-ASSET-INVENTORY` | token source trace, asset manifest, Chinese font fallback, rpx/px rules, build/import proof |
| `TPL-MINIAPP-SHELL` | `app.json`/page JSON registry, route smoke, API client mapping, fixture toggles, WeChat-vs-mock proof |
| `TPL-MINIAPP-PAGE` | WXML/WXSS/page JSON, required page states, control assertions, fixture source, screenshot limitation |
| `TPL-ASYNC-JOB-WORKFLOW` | job lifecycle, deterministic local processor, failure/retry, DB readback, no real provider call |
| `TPL-REPORT-CARD-RENDERER` | fixed dimensions, text-fit/overflow, Chinese long text, local artifact proof, renderer/API evidence split |
| `TPL-QUOTA-RATE-LIMIT` | quota subject, failed-call accounting, owner isolation, entitlement relation, counter readback |
| `TPL-METRIC-DELTA-ENGINE` | previous/current/delta formulas, window/timezone, null-not-zero, idempotency, readback |
| `TPL-ALERT-REPORTING` | threshold rules, dedupe/cooldown, task/alert log readback, daily report traceability, redaction |
| `TPL-LOCALE-ENCODING-GUARD` | UTF-8 scan, code-point/JSON-key validation, exact Chinese copy/field mapping, mojibake failure routing |

## Existing Templates Strengthened

The 47 existing templates already had domain guidance, but many lacked a uniform executable ending. The patched snapshot now appends `通用内容准确性补强` to old templates that needed it. This appendix requires:

- allowed change scope;
- forbidden actions;
- execution-step completion against concrete IDs;
- content accuracy gate;
- minimum verification commands;
- durable evidence paths;
- Result JSON required fields;
- failure routing with `BLOCKED_BY_MISSING_SOURCE`, `BLOCKED_BY_ENVIRONMENT`, `REPAIR_REQUIRED`, and `HARD_FAIL`.

This keeps existing domain-specific text intact while forcing every template to generate task files that can be run and audited.

## New Skill Gate

The patched skill adds `1.06. Template Content Accuracy Gate`. Future task generation must:

1. select the template;
2. verify the template actually fits the task;
3. map every required input to a concrete source or blocker;
4. map every acceptance criterion to a command and evidence path;
5. use honest limitation statuses when proof is incomplete;
6. strengthen the template before task generation if the template is too thin.

## Evidence Files

```text
docs/auto-execute-template-audit/template-content-quality-staged.json
docs/auto-execute-template-audit/template-content-quality-patched.json
docs/auto-execute-template-audit/patched-history-template-map.json
docs/auto-execute-template-audit/patched-skill/task-auto-execute/
docs/auto-execute-template-audit/patched-skill-manifest.json
docs/auto-execute-template-audit/task-auto-execute-patched-skill.zip
```

## Remaining Limitation

The actual global skill copies under `C:\Users\linyanhui\.agents\skills\task-auto-execute` and `C:\Users\linyanhui\.codex\skills\task-auto-execute` were not modified in this environment because those paths are outside writable roots. The exact patched global skill snapshot is staged under:

```text
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill\task-auto-execute
```

The package checksum is:

```text
090cb95fca23c0dc3813b083b50f04e97c6f6923b523ca71a7772e9cf1da6d74
```
