# AuraCue Unfinished UI One-To-One Repair Queue

Source: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-master.md`

Execution rule: use the `auto-execute` skill. Complete exactly one unchecked item per fresh `codex exec` worker, write result JSON and HANDOFF, then exit before the next worker starts.

- [ ] U01: refresh current unfinished visual state and confirm local harness/final gate still run. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U01-current-state-intake.md`
- [ ] U02: repair `UI-01` through `UI-05` home/create flow using visual harness task `T27`. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U02-home-create-flow-visual-repair.md`
- [ ] U03: repair `UI-06` through `UI-10` result/unlock/invite flow using visual harness task `T28`. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U03-result-unlock-invite-visual-repair.md`
- [ ] U04: repair `UI-11` through `UI-14` payment/full-result flow using visual harness task `T29`. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U04-payment-full-result-visual-repair.md`
- [ ] U05: repair `UI-15` through `UI-18` share/save/error flow using visual harness task `T30`. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U05-share-save-error-visual-repair.md`
- [ ] U06: run all-screen convergence for `UI-01` through `UI-18` using `T31` and `T33` visual gates. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U06-all-screen-visual-convergence.md`
- [ ] U07: run final regression and acceptance gate. Task: `docs/auto-execute/auracue-unfinished-ui-one-to-one-repair-tasks/U07-final-regression-and-gate.md`

Done only when `node scripts/t33-final-ui-one-to-one-gate.mjs` returns `PASS` and all `UI-01` through `UI-18` have `diffRatio <= 0.005`.
