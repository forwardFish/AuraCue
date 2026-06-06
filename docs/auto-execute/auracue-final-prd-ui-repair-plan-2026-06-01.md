# AuraCue Final PRD UI Repair Plan 2026-06-01

## Goal

Make the mini-program UI inventory match `AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md` and guarantee every final P0 page/state has a UI reference, route, owner scenario, simulated test, and visual gate.

## Change Strategy

Do not continue repairing the old 18-screen unlock/pay/invite flow as P0. Treat it as legacy/P1. Build the final P0 flow around the 9 primary PRD pages plus required draw-loading/share/error states.

## What To Change

### 1. Demote old pay/invite/payment screens

Already updated in:

- `docs/UI/小程序/README.md`
- `docs/auto-execute/auracue-ui-reference-map.md`

Keep the PNGs for historical reference, but do not let them block final P0:

- `05-结果_免费预览待解锁.png`
- `06-解锁_付费与邀请入口.png`
- `07A-邀请解锁_邀请3人入口.png`
- `07B-邀请解锁_邀请进度.png`
- `07C-邀请解锁_好友承接页.png`
- `08A-支付解锁_确认支付.png`
- `08B-支付解锁_失败与恢复购买.png`
- `08C-支付解锁_成功状态.png`

### 2. Add the missing Activate / Hold to Seal UI

Create one approved 941x1672 UI reference named:

```text
docs/UI/小程序/06-激活_选择锚点并长按封存.png
```

Required visible content:

- Title: `Activate Today’s Aura`
- Subtitle: `Choose one thing to carry today’s energy.`
- Lucky color section: `Your lucky colors`, color swatches, and color labels
- Anchor choices: Lucky Color, Jewelry, Crystal, Lipstick, Perfume, Outfit Detail
- Disabled hold button before an anchor is selected
- Enabled hold control after anchor selection: `Hold to Seal Your Aura`
- 0-3 second progress ring/bar state
- Cancel copy after early release: `Keep holding to seal today’s aura.`
- Retry seal state: `The seal slipped. Try again.`
- Safety tone: no guarantee of luck/success, no body/face judgment

### 3. Promote the new draw screen

Use:

```text
docs/UI/小程序/ChatGPT Image 2026年6月1日 17_47_59.png
```

as the visual candidate for:

```text
/create/draw
pages/create/draw
```

Required edits before final acceptance:

- Rename or alias the route from old `/create/energy`/`/create/loading` to final `/create/draw`.
- Keep 3 card choices.
- On selection, store `drawPosition`.
- Call generate after selection.
- Remove or product-approve the gift affordance.
- Remove or make inert the Profile tab because P0 excludes account/profile.

### 4. Promote the activated success screen

Use:

```text
docs/UI/小程序/ChatGPT Image 2026年6月1日 17_55_01.png
```

as the visual candidate for:

```text
/activated/[id]
pages/activated/index?id=
```

Required edits before final acceptance:

- Must say `Aura Activated`.
- Must show auraName, lucky colors, selected anchor, and todayIntention.
- Buttons must be `Save Card`, `Share Story`, `Back Home` or equivalent.
- Remove or make inert Profile tab unless P1 shell is explicitly approved.

### 5. Repair the result page

Use `完整结果页.png` as the nearest current visual reference, but change content and routing:

- Primary button: `Activate Today’s Aura`
- Secondary actions: `Save Card`, `Share Story`
- Required fields: auraName, luckyColors, styleVibe, energyMessage, miniRitual, todayIntention, shareImageUrl
- Remove locked preview, unlock full card, invite friends, payment price, restore purchase, and paywall copy
- Do not surface 7-day trend, history, or profile/account as P0 actions

### 6. Update implementation route source

Only after page files exist, update:

```text
apps/wechat-mini/src/routes/p0-routes.ts
apps/wechat-mini/src/routes/route-registry.mjs
apps/wechat-mini/src/app.config.ts
```

Target final mini-program paths:

```text
pages/index/index
pages/create/context
pages/create/upload
pages/create/draw
pages/result/index
pages/activate/index
pages/activated/index
pages/share/index
pages/saved/index
```

If keeping current filenames temporarily, add an explicit compatibility map and do not call it final PASS.

### 7. Update tests and visual gates

Regenerate or rewrite:

- owner scenario matrix
- simulated page tests
- visual screenshot manifest
- pixel-diff target list
- `docs/auto-execute/latest/gap-list.json` generator

Final gates must fail closed if any final P0 page is missing actual screenshot, diff, metrics, route evidence, or click evidence.

## Done Criteria

Status may move out of `REPAIR_REQUIRED` only when:

- Every final P0 page/state in `auracue-ui-reference-map.md` has a source UI reference or approved generated reference.
- Old pay/invite/payment screens are absent from final P0 route and gate inventories.
- Activate/Hold-to-Seal page exists and has tests for disabled, selected, hold-cancel, hold-complete, and retry states.
- Draw and Activated candidates are mapped into route registry, owner scenarios, simulated tests, and visual gates.
- Result page is activation-first and has no paywall/invite/payment CTA.
