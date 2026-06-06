# AuraCue UI One-To-One Repair Master

## Goal
Repair AuraCue mini-program UI so `UI-01` through `UI-18` are verified one-to-one code replicas of the supplied references under `docs/UI/小程序`, with complete raster capture, pixel diff, route/click regression evidence, and an honest final gate.

This pack continues after the existing T00-T25 baseline. It does not replace the original MVP task pack. The current known blocker is that T22/T23 only provide structural HTML evidence for all P0 screens and one actual raster artifact; they do not provide complete actual PNG captures or pixel-diff proof.

## Source Of Truth
- Visual truth: `D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序\*.png`
- Structural reference: `D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序\stitch_codex_ui_code_generator\*\code.html`
- Existing UI map: `D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-ui-reference-map.md`
- Target page code: `D:\lyh\agent\agent-frame\AuraCue\apps\wechat-mini\src\pages\**`
- Route manifests: `apps\wechat-mini\src\app.config.ts`, `apps\wechat-mini\src\routes\p0-routes.ts`, `apps\wechat-mini\src\routes\route-registry.mjs`

## Hard Rules
- Do not mount full-screen reference screenshots as UI.
- Do not replace screens with a generic card shell, placeholder page, or unrelated layout.
- Do not use remote CDN, remote fonts, remote images, production cloud, real payment, production DB, real analytics, real AI, or secrets.
- Preserve route, API, DB, click, analytics, local/mock payment, and owner-flow behavior unless a task explicitly repairs a regression caused by visual work.
- Do not loosen tests, change reference screenshots, lower visual thresholds, or promote `PASS_NEEDS_MANUAL_UI_REVIEW` to `PASS`.
- Each task must run in one fresh `codex exec` worker, execute only that task, write result JSON and HANDOFF, then exit completely.

## Pixel Gate
Every P0 UI screen must have:
- reference PNG,
- actual PNG captured at `941x1672`,
- diff PNG,
- metrics JSON,
- visual summary entry,
- route/click evidence.

Screen-level visual PASS is allowed only when:
- `diffRatio <= 0.005`,
- no missing core text,
- no missing required control,
- no major layout region mismatch,
- no full-screen screenshot mounting,
- no remote visual dependency.

If any screen lacks actual PNG, diff PNG, metrics JSON, or exceeds threshold, the final UI verdict must be `REPAIR_REQUIRED` or a stricter non-PASS status. `PASS_NEEDS_MANUAL_UI_REVIEW` is acceptable only for an explicitly documented environment blocker, not for skipped implementation work.

## Task Sequence
| Order | Task | Document |
| --- | --- | --- |
| 1 | T26 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T26-visual-capture-pixel-diff-harness.md` |
| 2 | T27 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T27-home-create-flow-one-to-one-repair.md` |
| 3 | T28 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T28-result-unlock-invite-one-to-one-repair.md` |
| 4 | T29 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T29-payment-full-result-one-to-one-repair.md` |
| 5 | T30 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T30-share-save-error-one-to-one-repair.md` |
| 6 | T31 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T31-all-ui-raster-diff-repair-loop.md` |
| 7 | T32 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T32-click-route-regression-after-visual-repair.md` |
| 8 | T33 | `docs/auto-execute/auracue-ui-one-to-one-repair-tasks/T33-final-ui-one-to-one-gate.md` |

## Evidence Layout
New visual evidence must be written under:

```text
docs/auto-execute/screenshots/ui-one-to-one/<TASK-ID>/actual/*.png
docs/auto-execute/screenshots/ui-one-to-one/<TASK-ID>/diff/*.png
docs/auto-execute/screenshots/ui-one-to-one/<TASK-ID>/metrics/*.json
docs/auto-execute/screenshots/ui-one-to-one/<TASK-ID>/visual-summary.json
```

Every task must also write:

```text
docs/auto-execute/results/<TASK-ID>.json
docs/auto-execute/latest/<TASK-ID>-HANDOFF.md
```

## Final Verdict Authority
Only T33 may update `docs/AUTO_EXECUTE_DELIVERY_REPORT.md` for this repair pack. Pure product PASS is allowed only if T26-T32 evidence proves complete visual capture/diff, all 18 screen metrics pass the pixel gate, and route/click/API/local-only/secret/report checks are clean.

