# T29 HANDOFF

## Status
REPAIR_REQUIRED

## What Ran
- node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T29
- Capture path: local-headless-chrome-compatible (C:\Program Files\Google\Chrome\Application\chrome.exe)
- Diff path: in-repo deterministic PNG RGBA decoder/encoder with max-channel threshold
- Native WeChat capture: unavailable; used current page view-model HTML renderers as a local DOM fallback.

## Evidence
- docs/auto-execute/screenshots/ui-one-to-one/T29/visual-summary.json
- docs/auto-execute/logs/T29/visual-harness.log
- docs/auto-execute/screenshots/ui-one-to-one/T29/actual/UI-01-actual.png through UI-18-actual.png
- docs/auto-execute/screenshots/ui-one-to-one/T29/diff/UI-01-diff.png through UI-18-diff.png
- docs/auto-execute/screenshots/ui-one-to-one/T29/metrics/UI-01-metrics.json through UI-18-metrics.json

## Counts
- actual PNG: 18/18
- diff PNG: 18/18
- metrics JSON: 18/18

## Verdict Notes
- The harness is reusable and produced real PNG evidence where local Chrome ran, but at least one screen remains above the pixel threshold or blocked.
- No environment blockers recorded.

## Unresolved Screens
- UI-01: diffRatio 0.142936; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-02: diffRatio 0.212549; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-03: diffRatio 0.174261; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-04: diffRatio 0.193674; remaining {"x":107,"y":48,"width":727,"height":1603}
- UI-05: diffRatio 0.262479; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-06: diffRatio 0.288386; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-07: diffRatio 0.216334; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-08: diffRatio 0.257127; remaining {"x":76,"y":10,"width":788,"height":1629}
- UI-09: diffRatio 0.343375; remaining {"x":47,"y":0,"width":847,"height":1656}
- UI-10: diffRatio 0.337765; remaining {"x":84,"y":3,"width":774,"height":1600}
- UI-11: diffRatio 0.457306; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-12: diffRatio 0.366343; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-13: diffRatio 0.518726; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-14: diffRatio 0.314493; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-15: diffRatio 0.721088; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-16: diffRatio 0.518919; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-17: diffRatio 0.308903; remaining {"x":0,"y":0,"width":941,"height":1672}
- UI-18: diffRatio 0.369695; remaining {"x":0,"y":0,"width":941,"height":1672}

## Next Steps
- Use `docs/auto-execute/screenshots/ui-one-to-one/T29/visual-summary.json` and per-screen metrics to repair pixel mismatches.
- Later visual gates must rerun `node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T29` after page repairs.
