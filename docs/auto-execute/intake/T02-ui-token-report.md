# T02 UI Token Report

Task boundary: T02 only.

## Source Inventory

- P0 PNG references inspected: 18 files under `docs/UI/小程序`.
- PNG viewport: every inspected P0 source is `941x1672`.
- Stitch references inspected: 18 `code.html` files under `docs/UI/小程序/stitch_codex_ui_code_generator`.
- Source modification policy: source screenshots and Stitch references were read only; no source UI reference files were edited.

Evidence:

- `docs/auto-execute/logs/T02/source-png-inventory.json`
- `docs/auto-execute/logs/T02/stitch-token-extract.json`

## Shared Token Outputs

Implemented shared tokens in `packages/ui-tokens/src/index.ts`.

Coverage:

- color tokens: navy ink, warm cream surfaces, rose/pink states, gold/bronze accents, channel/status colors;
- typography tokens: sans/serif font stack, P0 scale, weights, line heights;
- spacing tokens: screen safe areas, stacked controls, fixed footer, grid gaps;
- radius tokens: card, panel, pill, scene image, device-frame radii;
- shadow tokens: soft card, raised card, gold glow, pink CTA glow, story card, bottom sheet;
- border tokens: cream hairline, gold, rose, white glass, card frame;
- z-depth tokens: background aura, content, ornaments, fixed actions, modal sheet, toast;
- card proportions: aura card `12:19`, story card `9:16`, mini preview;
- background treatments: warm aura, energy aura, ritual glow, invite, payment, success, story, network-error gradients;
- CTA styles: primary gold, primary coral, primary pink, secondary outline, disabled.

## UI ID Asset And Motif Inventory

| UI ID | Route | Stitch | Primary Token Notes | Required Motifs |
| --- | --- | --- | --- | --- |
| UI-01 | `/` | `01` | warm cream page, premium hero card, coral primary CTA, gold sparkle accent | hero aura card, scenario shortcuts, brand sparkle |
| UI-02 | `/create/scene` | `02` | radial warm background, scene image cards, gold selected border, fixed footer CTA | scene illustrations, selected check, back affordance |
| UI-03 | `/create/energy` | `03` | energy chips, gold gradient CTA, navy text, small icon badges | confidence, luck, love, calm, charm, focus |
| UI-04 | `/create/energy` | `03a` | disabled CTA, validation hint, incomplete selection state | disabled action, missing-selection hint |
| UI-05 | `/create/loading` | `04` | ritual glow, tarot draw focus, soft orbit ornaments | ritual card, orbit sparkle, deterministic animation fallback |
| UI-06 | `/result/:id` | `05` | locked preview, blurred full sections, watermarked card, unlock CTA | blur overlay, lock marker, free preview card |
| UI-07 | `/unlock/:id` | `06` | paywall glass panels, gold value icons, choice cards | payment choice, invite choice, benefit icons |
| UI-08 | `/invite/:id` | `07a_3` | warm invite background, pink reward CTA, progress affordance | invite counter, friend avatars, reward badge |
| UI-09 | `/invite/:id/progress` | `07b` | progress state, pink gradient action, copy/share controls | progress nodes, copy icon, explainer affordance |
| UI-10 | `/invite/landing/:code` | `07c` | friend landing frame, purple-pink card, gold avatar ring | avatar, invite card, friend CTA |
| UI-11 | `/unlock/:id/pay` | `08a` | payment aura, price scale, pink unlock CTA, white glass list | price block, mock payment checklist, confirm CTA |
| UI-12 | `/unlock/:id/pay-failed` | `08b` | recoverable error rose, action stack, support affordance | error badge, retry, restore, support |
| UI-13 | `/unlock/:id/success` | `08c` | success celebration, gold check, pink primary CTA, unlocked preview | success badge, confetti sparkle, unlocked card |
| UI-14 | `/result/:id/full` | `09` | full result report, navy tarot card, gold section dividers, save/share controls | full aura card, color swatches, report section icons |
| UI-15 | `/share/:id` | `10a_story` | 9:16 story card, purple-pink gradient, gold frame, save/share controls | story preview, gold card frame, swatches |
| UI-16 | `/share/:id/channels` | `10b` | bottom sheet, channel icons, cream overlay, cancel action | WeChat channel, moments channel, copy link, cancel |
| UI-17 | `/saved/:id` | `10c` | save confirmation, gold check glow, mini card preview, share/home actions | saved check, mini preview, share now, back home |
| UI-18 | `/error/network` | `11` | network recovery gradient, soft cloud error, retry CTA, change scene secondary | cloud error, retry, change scene, safe copy |

## Later Implementation Guidance

- Later page tasks should import `@auracue/ui-tokens` instead of duplicating color, spacing, radius, shadow, CTA, and card proportion constants.
- Raster asset creation should be deferred to the page or renderer task that proves CSS/vector motifs cannot reproduce a required visual.
- Pixel-perfect visual PASS remains out of scope for T02 because this task does not capture actual app screenshots or run diff metrics.

## Verification

- `pnpm.cmd --filter @auracue/ui-tokens test` passed and imported the token package.
- `pnpm.cmd typecheck` passed against the scaffold placeholder typecheck.

## Verdict

`PASS_NEEDS_MANUAL_UI_REVIEW`

The shared token and asset inventory is complete for T02, with import/build evidence. Manual UI review remains required because T02 did not perform app screenshot capture or pixel diff; those are assigned to later visual tasks.
