# AuraCue Mini-Program UI Rescan 2026-06-01

## Scope

- Scanned folder: `D:\lyh\agent\agent-frame\AuraCue\docs\UI\小程序`
- Scan time basis: local filesystem state on 2026-06-01.
- Existing route truth checked: `apps/wechat-mini/src/app.config.ts`, `apps/wechat-mini/src/routes/p0-routes.ts`, and `apps/wechat-mini/src/routes/route-registry.mjs`.

## Inventory

Top-level mini-program PNG references now contain 20 files. All top-level PNG references are `941x1672`.

| Group | Count | Notes |
| --- | ---: | --- |
| Original mapped P0 references | 18 | `UI-01` through `UI-18` remain the current route/test/visual-gate scope. |
| New top-level references | 2 | Added on 2026-06-01 and recorded as `UI-19` and `UI-20` candidates. |
| P1 folder references | 4 | Still under `docs/UI/小程序/P1`; deferred unless scope changes. |
| Backup/icon/Stitch assets | not counted as top-level pages | Support/reference assets only. |

## Newly Added Pages

| Candidate UI ID | File | Modified | Inferred Page | Current Implementation Status |
| --- | --- | --- | --- | --- |
| UI-19 | `docs/UI/小程序/ChatGPT Image 2026年6月1日 17_47_59.png` | 2026-06-01 17:48:00 | Choose-card draw entry with three aura cards, `Reveal My Aura`, gift affordance, and Home/Profile tab bar. | Not in `p0-routes.ts`, `route-registry.mjs`, owner scenarios, tests, or visual gates. |
| UI-20 | `docs/UI/小程序/ChatGPT Image 2026年6月1日 17_55_01.png` | 2026-06-01 17:55:02 | Aura activated/result confirmation with `Golden Bloom`, `Done`, `Share Story`, and Home/Profile tab bar. | Not in `p0-routes.ts`, `route-registry.mjs`, owner scenarios, tests, or visual gates. |

## Impact

- The previous `UI-01..UI-18` acceptance scope is now stale if the two new pages are intended to be P0.
- Existing visual gates and final repair packs only assert 18 screens, so they cannot prove completion for the new references.
- No matching Stitch `code.html` was found for the two new PNGs, so implementation workers must derive WXML/WXSS from the PNGs only or add new Stitch/reference code before execution.
- The route decision is still open:
  - UI-19 could be a new `/draw` route or a replacement/revision of `/`.
  - UI-20 could be a new activation-success route or a replacement/revision of the full-result/success flow.

## Required Follow-Up If These Are P0

1. Update route registry and app config coverage from `UI-01..UI-18` to include the new chosen routes.
2. Add owner scenarios for card draw, activation result, tab navigation, `Done`, `Share Story`, and gift affordance behavior.
3. Extend visual capture/diff gates so final acceptance requires all 20 relevant screens.
4. Add simulated tests for the new routes and controls before any PASS claim.
5. Keep final status `REPAIR_REQUIRED` until UI-19 and UI-20 have actual PNG, diff PNG, metrics JSON, route/click evidence, and owner-scenario evidence.
