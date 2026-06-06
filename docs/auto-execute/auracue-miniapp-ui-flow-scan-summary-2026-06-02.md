# AuraCue 小程序 UI 流程扫描总结 2026-06-02

## 结论

当前 `docs/UI/小程序` 的图片已经基本补齐 Final PRD v1.0 的 P0 主流程：

```text
Mood -> Context -> Optional Outfit -> Draw -> Reveal -> Activate -> Seal -> Save/Share
```

和 2026-06-01 的旧审计相比，最大变化是已经新增 `06-激活_选择锚点并长按封存.png`，因此“缺少 Activate Today's Aura / Hold to Seal 页面”的最大 UI 缺口已补上。

但当前仍不能声明最终 P0 UI 完全符合需求。主要原因不是图片数量不够，而是：

- 旧的付费、邀请、解锁页面仍留在 P0 主目录，并且编号混在主流程中。
- 代码路由清单仍是旧的 18 屏 unlock/pay/invite 模型，不是新版 PRD 的 9 个主流程页面。
- `docs/UI/小程序/README.md` 与 `docs/auto-execute/auracue-ui-reference-map.md` 仍写着 Activate/Hold-to-Seal 缺失，已经过期。
- 多张新图仍带 `Gift`、`Profile`、底部 Home/Profile 导航，和 PRD 中 P0 不做账户/Profile、支付/礼物型扩展的边界冲突。
- 结果页内容方向已经接近完整结果，但主 CTA 仍偏 Save/Share，需要补 `Activate Today's Aura` 作为主路径。

当前状态建议保持为：`REPAIR_REQUIRED`，但原因应从“缺少 Activate 页面”更新为“流程命名、路由映射、旧 P0 混入、结果页 CTA 和视觉验收源未同步”。

## 扫描范围

- PRD：`docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`
- UI 图片：`docs/UI/小程序/*.png`
- P1 图片：`docs/UI/小程序/P1/*.png`
- 当前 UI README：`docs/UI/小程序/README.md`
- 当前 UI 映射：`docs/auto-execute/auracue-ui-reference-map.md`
- 当前小程序路由：`apps/wechat-mini/src/app.config.ts`、`apps/wechat-mini/src/routes/p0-routes.ts`、`apps/wechat-mini/src/routes/route-registry.mjs`
- 视觉总览图：`docs/auto-execute/miniapp-ui-contact-sheet-2026-06-02.jpg`

## 页面逐项判断

| PRD 流程 | 当前图片 | 判断 | 需要改的点 |
| --- | --- | --- | --- |
| Mood-first Home | `01-进入_首页生成入口.png` | 基本符合 | 有 Gift、Profile 和底部 Profile 导航；P0 可保留 Home，但 Profile/Gift 应移除、置灰或标注为 P1 inert shell。 |
| Optional Context | `02-选择_出门场景.png` | 符合 | 文件名建议从“出门场景”改为“今日上下文/Context”，因为 PRD 用 Optional Context，不是必选 scene。 |
| Optional Outfit Upload | `03-拍照上传.png` | 符合 | 建议改名体现“可选穿搭上传”；文案已强调 Optional/Private，可继续保留。 |
| Draw card selection | `ChatGPT Image 2026年6月2日 11_21_40 (1).png` | 符合但未正式命名 | 这是 3 卡选择页，应该进入 P0 主流程并重命名；需要去掉或产品确认 Gift/Profile。 |
| Draw generation/loading | `04-生成_抽卡仪式.png` | 符合作为状态页 | 应作为 `/create/draw` 内部生成状态，不建议继续作为独立主流程页面。 |
| Result / Reveal | `完整结果页.png`、`ChatGPT Image 2026年5月28日 16_17_21.png` | 部分符合 | 需要把主 CTA 改为 `Activate Today's Aura`，Save/Share 降为次级；`View 7-Day Trend` 不属于 P0，应去掉或置为 P1。 |
| Activate / Hold to Seal | `06-激活_选择锚点并长按封存.png` | 新增后已符合 UI 需求 | 文件编号与旧 `06-解锁_付费与邀请入口.png` 冲突，需要重新编号；还需要补 disabled、取消、retry 等状态到测试/验收，不一定都要单独出图。 |
| Aura Activated | `ChatGPT Image 2026年6月2日 11_21_41 (2).png` | 基本符合但未正式命名 | 应重命名并映射到 `/activated/[id]`；按钮只有 Done/Share Story，建议补 `Save Card` 或确认 Done 等价于保存完成。 |
| Share Story Preview | `10A-分享_Story卡预览与保存.png` | 符合 | 可保留为主分享预览页；需要确认渲染图来自统一 share renderer，而不是静态截图。 |
| Share Channel Chooser | `10B-分享_渠道选择-1.png` | 符合作为状态 | 建议去掉 `-1`，命名为渠道选择状态；不是单独主路由。 |
| Save Success | `10C-保存_保存成功反馈.png` | 符合 | 可作为 modal 或 fallback page；`View Saved Card` 不能扩展成 History/Profile P0。 |
| Error / Retry | `11-异常_生成失败网络异常.png` | 符合错误状态 | 当前文案是 aura slipped / try again，适合作为 retry 状态；`Change Scene` 应在新版里改为 `Change Context`。 |

## 旧图处理建议

这些图不应再算 Final PRD P0 主流程覆盖：

- `05-结果_免费预览待解锁.png`
- `06-解锁_付费与邀请入口.png`
- `07A-邀请解锁_邀请3人入口.png`
- `07B-邀请解锁_邀请进度.png`
- `07C-邀请解锁_好友承接页.png`
- `08A-支付解锁_确认支付.png`
- `08B-支付解锁_失败与恢复购买.png`
- `08C-支付解锁_成功状态.png`
- `docs/UI/小程序/P1/*`

建议保留这些图片，但移动到 `docs/UI/小程序/backup` 或单独 `docs/UI/小程序/legacy-unlock-pay-invite`，并在 README 中明确：这些是历史/实验/P1，不参与 P0 路由、owner scenario、模拟测试和最终视觉 gate。

## 建议重命名表

建议采用连续 P0 编号，避免旧 P0 的 05/06/07/08 paywall 编号继续污染主流程。

| 当前文件 | 建议新文件名 | 说明 |
| --- | --- | --- |
| `01-进入_首页生成入口.png` | `P0-01-Mood-首页选择今日状态.png` | Mood-first 首页。 |
| `02-选择_出门场景.png` | `P0-02-Context-可选今日上下文.png` | PRD 名称是 Optional Context，不是必选场景。 |
| `03-拍照上传.png` | `P0-03-Outfit-可选穿搭上传.png` | 强调 optional outfit upload。 |
| `ChatGPT Image 2026年6月2日 11_21_40 (1).png` | `P0-04-Draw-三卡选择.png` | 需要正式纳入 P0。 |
| `04-生成_抽卡仪式.png` | `P0-05-Reveal-生成中抽卡仪式.png` | 作为 Draw/Reveal 的 loading state。 |
| `完整结果页.png` | `P0-06-Result-完整气场卡结果.png` | 建议以这张作为更好的结果页基准。 |
| `ChatGPT Image 2026年5月28日 16_17_21.png` | `P0-06A-Result-完整结果备选布局.png` | 备选结果页；若不用，应移入 backup。 |
| `06-激活_选择锚点并长按封存.png` | `P0-07-Activate-选择锚点并长按封存.png` | 已补齐 Activate/Hold-to-Seal。 |
| `ChatGPT Image 2026年6月2日 11_21_41 (2).png` | `P0-08-Activated-气场已激活成功.png` | 激活成功页。 |
| `10A-分享_Story卡预览与保存.png` | `P0-09-Share-Story卡预览与保存.png` | 分享预览页。 |
| `10B-分享_渠道选择-1.png` | `P0-09A-Share-渠道选择状态.png` | 分享页状态，不是独立主流程。 |
| `10C-保存_保存成功反馈.png` | `P0-10-Saved-保存成功反馈.png` | 保存成功页或弹窗。 |
| `11-异常_生成失败网络异常.png` | `P0-11-Error-生成失败重试.png` | 错误/重试状态。 |

不建议现在直接批量重命名，除非同时更新所有引用。当前至少需要同步：

- `docs/UI/小程序/README.md`
- `docs/auto-execute/auracue-ui-reference-map.md`
- `apps/wechat-mini/src/routes/p0-routes.ts`
- `apps/wechat-mini/src/routes/route-registry.mjs`
- visual screenshot manifest / owner scenario matrix / simulated page tests

## 当前代码/验收映射缺口

代码路由仍是旧模型：

```text
pages/home/index
pages/create/scene
pages/create/energy
pages/create/incomplete
pages/create/loading
pages/result/free-preview
pages/unlock/*
pages/invite/*
pages/result/full
pages/share/*
pages/saved/success
pages/error/network
```

新版 PRD 目标应改为：

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

因此后续修复不应继续围绕旧 UI-01..UI-18 的 unlock/pay/invite gate 做 P0，而应重建 Final PRD P0 的流程映射。

## 优先修改项

1. 更新 UI README 和 `auracue-ui-reference-map.md`：把 Activate 缺失改为已补齐，并把新 draw / activated 图正式纳入 P0。
2. 把旧付费/邀请/解锁图片从 P0 主目录降级，避免后续 agent 或 gate 继续把它们当最终需求。
3. 给所有 P0 图片按流程重命名，或先生成 rename manifest，再统一更新引用。
4. 修复结果页：增加 `Activate Today's Aura` 主 CTA，去掉 `View 7-Day Trend` 等 P1 入口。
5. 更新路由和测试映射：从旧 18 屏改为新版 9 主页面 + loading/share/error 状态。
6. 更新视觉 gate：最终 PASS 必须基于新版 P0 图片、真实页面截图、diff metrics、点击证据，而不是旧 paywall/invite 目标。

## 最终判断

图片层面：`基本齐了，但命名和流程归属需要整理`。

需求符合度：`P0 主流程已接近符合 Final PRD v1.0`。

不能直接 PASS 的原因：`旧 P0 图片混入、README/映射过期、代码路由仍旧、结果页 CTA 与 P1 入口需要修、视觉 gate 源还未切到新版流程`。
