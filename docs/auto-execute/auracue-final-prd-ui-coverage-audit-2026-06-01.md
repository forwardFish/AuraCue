# AuraCue Final PRD UI Coverage Audit 2026-06-01

## Scope

- PRD: `docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`
- UI folder: `docs/UI/小程序`
- Focus: verify that every P0 mini-program page in the final PRD has a matching UI reference, and identify UI references whose content no longer matches the final PRD.

Follow-up source-of-truth files added/updated:

- `docs/UI/小程序/README.md`
- `docs/auto-execute/auracue-ui-reference-map.md`
- `docs/auto-execute/auracue-final-prd-ui-repair-plan-2026-06-01.md`

## Source Of Truth

The final PRD replaces older v0.2/v0.3 task scopes. The P0 user journey is:

```text
Mood -> Context -> Optional Outfit -> Draw -> Reveal -> Activate -> Seal -> Save/Share
```

The PRD explicitly excludes P0 paywall, real payment, invite unlock, history tab, 7-day trend, account system, and full bottom-tab navigation.

## Required P0 Page Coverage

| PRD Page | Required Route/Path | Current UI Reference | Coverage | Notes |
| --- | --- | --- | --- | --- |
| Mood-first Home | `pages/index/index` | `01-进入_首页生成入口.png`; Stitch `01` | COVERED_WITH_COPY_CHECK | Current screen matches mood-first home, but implementation routes still use old `pages/home/index`; align path naming or document alias. |
| Optional Context | `pages/create/context` | `02-选择_出门场景.png`; Stitch `02` | COVERED | Matches optional context intent. Must keep Skip available and no payment entry. |
| Optional Outfit Upload | `pages/create/upload` | `03-拍照上传.png` | COVERED | Matches optional upload. Ensure safety copy says outfit vibe only and no face/body judgment. |
| Draw & Reveal: card selection | `pages/create/draw` | `ChatGPT Image 2026年6月1日 17_47_59.png` | UNMAPPED_NEEDS_ROUTE | This is the closest match to final PRD draw selection with 3 cards and Reveal CTA, but it is not in current route registry or visual gates. |
| Draw & Reveal: generation/loading state | same page/state | `04-生成_抽卡仪式.png`; Stitch `04` | COVERED_AS_STATE | Useful as loading state after card selection. Should not replace the required 3-card selection UI. |
| Daily Aura Card Result | `pages/result/index?id=` | `完整结果页.png`; `ChatGPT Image 2026年5月28日 16_17_21.png`; Stitch `09` | PARTIAL_REPAIR_REQUIRED | Visual has full-result/report material, but must be reworked so primary CTA is `Activate Today’s Aura`, with `Save Card` and `Share Story` secondary. Remove P1 trend/history wording from P0. |
| Activate Today's Aura | `pages/activate/index?id=` | none found | MISSING | Need a dedicated page with lucky colors, lucky anchor choices, disabled/enabled hold button, 3-second Hold to Seal progress, cancel and retry states. This is the largest missing P0 UI. |
| Aura Activated | `pages/activated/index?id=` | `ChatGPT Image 2026年6月1日 17_55_01.png` | UNMAPPED_NEEDS_ROUTE | Good candidate for activated success page, but it is not in route registry, Stitch refs, owner scenarios, or visual gates. Must include anchor and intention per PRD. |
| Share Story Preview | `pages/share/index?id=` | `10A-分享_Story卡预览与保存.png`; Stitch `10a_story` | COVERED_WITH_COPY_CHECK | Must expose Save Image, Share to Friend, Copy Link, Back for mini-program behavior. |
| Share Channel Chooser | state/subpage of share | `10B-分享_渠道选择.png`; Stitch `10b` | OPTIONAL_OR_STATE | PRD does not require a separate route, but this is acceptable as share sheet/state. |
| Save Success | `pages/saved/index?id=` or modal | `10C-保存_保存成功反馈.png`; Stitch `10c` | COVERED | PRD prefers modal but allows fallback page. Keep it lightweight, not a history/account feature. |
| Error / Retry | generation/share failure states | `11-异常_生成失败网络异常.png`; Stitch `11` | COVERED_AS_ERROR_STATE | Required by failure branches even though not listed as a primary IA page. |

## UI References That Conflict With Final PRD P0

These references should not be counted as P0-final coverage unless the product scope changes:

| File/Group | Problem |
| --- | --- |
| `05-结果_免费预览待解锁.png` | Locked free preview and unlock CTA conflict with PRD: P0 result page must not be paywall-first and must use activation as the primary CTA. |
| `06-解锁_付费与邀请入口.png` | Paywall/unlock choice is explicitly out of P0. |
| `07A-邀请解锁_邀请3人入口.png`, `07B-邀请解锁_邀请进度.png`, `07C-邀请解锁_好友承接页.png` | Invite unlock/referral flow is not in final P0 mainline. |
| `08A-支付解锁_确认支付.png`, `08B-支付解锁_失败与恢复购买.png`, `08C-支付解锁_成功状态.png` | Payment flow is out of P0. Also `08C` should not be reused as activation success because its copy says unlock/payment. |
| P1 folder `08-穿搭能量页_P1扩展.png`, `09-历史页_P1扩展.png`, `10-七日能量趋势页_P1扩展.png`, `11-个人档案页_P1扩展.png` | Correctly deferred. Do not pull these into P0. |
| Bottom Home/Profile nav in the two new `ChatGPT Image 2026年6月1日 ...` files | Final PRD excludes full account/history navigation in P0. Either remove bottom nav from P0 screens or treat it as inert/deferred shell with no Profile route. |
| Gift affordance in `ChatGPT Image 2026年6月1日 17_47_59.png` | Not specified in final PRD P0. Needs product decision before implementation. |

## Missing Or Wrong Content To Repair

1. Add a real `Activate Today's Aura` UI reference.
   - Required content: lucky colors, lucky anchor choices, `Hold to Seal Your Aura`, disabled state before anchor selection, 0-3 second progress state, cancelled state, retry state.

2. Map the new draw-selection reference into the official P0 route.
   - Current official route registry still uses old `/create/energy` and `/create/loading` flow.
   - Final PRD requires `/create/draw` with 3 selectable cards.

3. Map the new activated-success reference into the official P0 route.
   - Current route registry has old unlock/payment success, not PRD activation success.
   - The page must show `Aura Activated`, aura name, lucky colors, selected anchor, intention, Save, Share, Back Home.

4. Replace paywall-first result references with activation-first result content.
   - The result page must show auraName, luckyColors, styleVibe, energyMessage, miniRitual, todayIntention, shareImageUrl.
   - Primary CTA must be `Activate Today’s Aura`.

5. Demote payment and invite references.
   - Keep them only as backup/P1/reference material.
   - They must not drive P0 route registry, app config, owner scenarios, or final visual gates.

6. Update all coverage artifacts.
   - `apps/wechat-mini/src/routes/p0-routes.ts`
   - `apps/wechat-mini/src/routes/route-registry.mjs`
   - `docs/auto-execute/auracue-ui-reference-map.md`
   - visual screenshot manifest/gates
   - owner scenario matrix
   - simulated page tests

## Final Verdict

Current UI folder does not yet guarantee every final PRD P0 page.

Status: `REPAIR_REQUIRED`

Required before claiming all pages are covered:

- Add or approve a dedicated Activate/Hold-to-Seal page reference.
- Promote the new draw-selection and activated-success references into the route/test/visual source of truth.
- Remove or demote old P0 paywall/invite/payment pages from the final P0 route inventory.
- Repair result-page content so activation is the primary path.
