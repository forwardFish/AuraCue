# AuraCue Mini-Program UI Inventory

This folder is aligned to `docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`.

Final P0 flow:

```text
Mood -> Context -> Optional Outfit -> Draw -> Reveal -> Activate -> Seal -> Save/Share
```

Only files prefixed with `P0-` in this folder are final P0 references. Legacy unlock, payment, invite, profile, trend, and P1 references must not drive final P0 routes, owner scenarios, simulated tests, or visual gates.

## Final P0 References

| P0 Page/State | Current Reference | Target Route/Page | Status |
| --- | --- | --- | --- |
| Mood-first Home | `P0-01-Mood-首页选择今日状态.png` | `/`; `pages/index/index` | P0 reference; Gift/Profile affordances must be removed or inert. |
| Optional Context | `P0-02-Context-可选今日上下文.png` | `/create/context`; `pages/create/context` | P0 reference; context is optional and skippable. |
| Optional Outfit Upload | `P0-03-Outfit-可选穿搭上传.png` | `/create/upload`; `pages/create/upload` | P0 reference; upload is optional and private. |
| Draw card selection | `P0-04-Draw-三卡选择.png` | `/create/draw`; `pages/create/draw` | P0 reference; three-card selection belongs in the main flow. |
| Draw generation/loading state | `P0-05-Reveal-生成中抽卡仪式.png` | state inside `/create/draw` | P0 state, not a separate primary route. |
| Daily Aura Card Result | `P0-06-Result-完整气场卡结果.png` | `/result/:id`; `pages/result/index` | P0 reference; `Activate Today's Aura` is the primary CTA. |
| Result alternate layout | `P0-06A-Result-完整结果备选布局.png` | backup only | Optional visual reference, not a required route. |
| Activate Today's Aura / Hold to Seal | `P0-07-Activate-选择锚点并长按封存.png` | `/activate/:id`; `pages/activate/index` | P0 reference; includes disabled, selected, hold, cancel, and retry states in tests. |
| Aura Activated | `P0-08-Activated-气场已激活成功.png` | `/activated/:id`; `pages/activated/index` | P0 reference; Done/Save Card completes saving. |
| Share Story Preview | `P0-09-Share-Story卡预览与保存.png` | `/share/:id`; `pages/share/index` | P0 reference; image must come from renderer or approved fixture. |
| Share channel chooser | `P0-09A-Share-渠道选择状态.png` | state under `/share/:id` | P0 share state, not an additional primary journey step. |
| Save Success | `P0-10-Saved-保存成功反馈.png` | `/saved/:id`; `pages/saved/index` | P0 modal/fallback page; must not expand into History/Profile. |
| Network/generation error | `P0-11-Error-生成失败重试.png` | `/error/network`; `pages/error/network` | P0 error/retry state; use `Change Context`, not `Change Scene`. |

## Demoted From P0

These references are historical/P1 only:

- `legacy-unlock-pay-invite/*`
- `P1/*`

Reason: final PRD v1.0 excludes paywall, real/mock payment, invite unlock, restore purchase, history, 7-day trend, account/profile, and shopping-like outfit extensions from P0.

## Current Verdict

UI reference coverage is no longer blocked by a missing Activate/Hold-to-Seal page. The remaining acceptance risk is runtime evidence alignment: final PASS still requires actual screenshots, diff images, click evidence, and metrics generated from the `P0-*` references above.
