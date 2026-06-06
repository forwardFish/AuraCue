# Next Agent Action

Status: REPAIR_REQUIRED

Continue from the final P0 scope, not the legacy 18-screen repair pack.

1. Target only `UI-01` through `UI-12` from `docs/UI/小程序/P0-*.png` and `apps/wechat-mini/src/routes/route-registry.mjs`.
2. Do not repair or gate legacy unlock, payment, invite, free-preview, history, trend, or profile screens unless product scope explicitly changes.
3. Generate real runtime actual PNGs, diff PNGs, and metrics JSON for all 12 final P0 targets under `docs/auto-execute/screenshots/ui-one-to-one/T33/`.
4. Keep the strict threshold `diffRatio <= 0.005`; do not mount full-screen reference screenshots or weaken tests.
5. Rerun `node scripts/t33-final-ui-one-to-one-gate.mjs` after runtime screenshot/diff evidence exists.

Current unresolved final P0 screens: UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11, UI-12.
