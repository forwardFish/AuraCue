# AuraCue UI Reference Map

This map is aligned to `docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`.

Final PRD v1.0 replaces the old unlock/pay/invite MVP. The P0 source of truth is:

```text
Mood -> Context -> Optional Outfit -> Draw -> Reveal -> Activate -> Seal -> Save/Share
```

Rows marked `FINAL_P0` are the only pages/states that may block final P0 visual acceptance. Rows marked `LEGACY_DEMOTED` are historical/P1 references only and must not be used as P0 route, owner-scenario, simulated-test, or final visual-gate targets.

## Final PRD P0 Coverage

| Final ID | PRD Page/State | Source Image | Target Route/Page | Required Controls/Content | Status |
| --- | --- | --- | --- | --- | --- |
| UI-01 | Mood-first Home | `docs/UI/小程序/P0-01-Mood-首页选择今日状态.png` | `/`; `pages/index/index` | mood choices, `Start My Aura Card`, privacy/disclaimer copy | FINAL_P0 |
| UI-02 | Optional Context | `docs/UI/小程序/P0-02-Context-可选今日上下文.png` | `/create/context`; `pages/create/context` | context choices, `Continue`, `Skip`, no paywall | FINAL_P0 |
| UI-03 | Optional Outfit Upload | `docs/UI/小程序/P0-03-Outfit-可选穿搭上传.png` | `/create/upload`; `pages/create/upload` | `Upload Outfit`, `Skip for Today`, retry/skip on failure | FINAL_P0 |
| UI-04 | Draw card selection | `docs/UI/小程序/P0-04-Draw-三卡选择.png` | `/create/draw`; `pages/create/draw` | 3 card backs, selectable card, selected state, `Reveal My Aura` | FINAL_P0 |
| UI-05 | Draw generation/loading state | `docs/UI/小程序/P0-05-Reveal-生成中抽卡仪式.png` | state inside `/create/draw` | rotating/loading copy, duplicate submit blocked, retry path on failure | FINAL_P0_STATE |
| UI-06 | Daily Aura Card Result | `docs/UI/小程序/P0-06-Result-完整气场卡结果.png` | `/result/:id`; `pages/result/index?id=` | auraName, luckyColors, styleVibe, ritual, intention, `Activate Today's Aura`, `Save Card`, `Share Story` | FINAL_P0 |
| UI-07 | Activate Today's Aura / Hold to Seal | `docs/UI/小程序/P0-07-Activate-选择锚点并长按封存.png` | `/activate/:id`; `pages/activate/index?id=` | anchor choices, disabled hold before anchor selection, `Hold to Seal Your Aura`, cancel/retry states | FINAL_P0 |
| UI-08 | Aura Activated | `docs/UI/小程序/P0-08-Activated-气场已激活成功.png` | `/activated/:id`; `pages/activated/index?id=` | `Aura Activated`, selected anchor, intention, `Save Card`/Done, `Share Story`, `Back Home` | FINAL_P0 |
| UI-09 | Share Story Preview | `docs/UI/小程序/P0-09-Share-Story卡预览与保存.png` | `/share/:id`; `pages/share/index?id=` | 9:16 story image, `Save Image`, share action, `Copy Link`, `Back` | FINAL_P0 |
| UI-10 | Share channel chooser | `docs/UI/小程序/P0-09A-Share-渠道选择状态.png` | state under `/share/:id`; `pages/share/index?id=` | channel options, cancel/back, share event logging | FINAL_P0_STATE |
| UI-11 | Save Success | `docs/UI/小程序/P0-10-Saved-保存成功反馈.png` | `/saved/:id`; `pages/saved/index?id=` | saved confirmation, `Share Now`, `Back Home` | FINAL_P0_OPTIONAL_PAGE |
| UI-12 | Network / generation error | `docs/UI/小程序/P0-11-Error-生成失败重试.png` | error state or `/error/network` | retry, `Change Context`, calm non-blaming copy | FINAL_P0_ERROR_STATE |

## Demoted Legacy References

| Scope | New Classification | Reason |
| --- | --- | --- |
| `docs/UI/小程序/legacy-unlock-pay-invite/*` | LEGACY_DEMOTED | Final P0 result is activation-first, not unlock/paywall/invite-first. |
| `docs/UI/小程序/P1/*` | P1_DEFERRED | PRD excludes History, 7-Day Trend, Account/Profile, and shopping-like outfit extensions from P0. |

## Route And Gate Requirements

Final P0 evidence must target the map above:

- `apps/wechat-mini/src/routes/p0-routes.ts`
- `apps/wechat-mini/src/routes/route-registry.mjs`
- `apps/wechat-mini/src/app.config.ts`
- owner scenario matrix and simulated page tests
- visual screenshot manifest and pixel-diff gates
- current `docs/auto-execute/latest/gap-list.json` generation logic

Current verdict: `REPAIR_REQUIRED` until actual runtime screenshots, diff metrics, and click traces are regenerated against these `P0-*` references. The previous missing Activate/Hold-to-Seal reference is resolved.
