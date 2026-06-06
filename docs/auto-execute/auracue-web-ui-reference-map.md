# AuraCue Web/H5 UI Reference Map

UI 参考来自小程序视觉图和 Stitch HTML，但目标是 Web/H5 route，不绑定小程序路径。后续执行者必须把 reference 复制到未来截图目录并生成 actual/diff/metrics。

| UI ID | Source | 目标 Web route | 状态 | 关键控件 | 数据/API | 视觉证据目标 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-001 | `docs\UI\小程序\P0-01-Mood-首页选择今日状态.png`; `docs\AuraCue_首页视觉设计与前端开发标准_v1.0.md` | `/` | no active card / active card entry | mood cards, CTA | API-001, API-002 | `screenshots/web/T14/UI-001-*` | PLANNED |
| UI-002 | `docs\UI\小程序\P0-02-Context-可选今日上下文.png` | `/create/context` | selected / skipped / guard | context options, Skip, Continue | draft | `screenshots/web/T14/UI-002-*` | PLANNED |
| UI-003 | `docs\UI\小程序\P0-03-Outfit-可选穿搭上传.png` | `/create/upload` | empty / success / error / skip | file input, Retry, Skip, Continue | API-003 | `screenshots/web/T14/UI-003-*` | PLANNED |
| UI-004 | `docs\UI\小程序\P0-04-Draw-三卡选择.png`; `P0-05-Reveal-生成中抽卡仪式.png` | `/create/draw` | three-card / selected / generating / error | Card I/II/III, Reveal, Retry | API-004, API-005 | `screenshots/web/T14/UI-004-*` | PLANNED |
| UI-005 | `docs\UI\小程序\P0-06-Result-完整气场卡结果.png` | `/result/[id]` | loaded / 404 / save toast | Activate, Save, Share | API-007,011,012 | `screenshots/web/T14/UI-005-*` | PLANNED |
| UI-006 | `docs\UI\小程序\P0-07-Activate-选择锚点并长按封存.png` | `/activate/[id]` | no anchor / started / holding / cancel / seal error | anchor chips, HoldToSealButton | API-009,010 | `screenshots/web/T14/UI-006-*` | PLANNED |
| UI-007 | `docs\UI\小程序\P0-08-Activated-气场已激活成功.png` | `/activated/[id]` | activated / guard redirect | Done, Share Story, Save Card | API-007,011,012 | `screenshots/web/T14/UI-007-*` | PLANNED |
| UI-008 | `docs\UI\小程序\P0-09-Share-Story卡预览与保存.png`; `P0-09A-Share-渠道选择状态.png` | `/share/[id]` | image exists / render failed / copy fallback | Save Image, Share, Copy Link, Generate Again | API-008,012 | `screenshots/web/T14/UI-008-*` | PLANNED |
| UI-009 | `docs\UI\小程序\P0-10-Saved-保存成功反馈.png` | `/saved/[id]` | saved success | Share Story, Back Home | API-011 | `screenshots/web/T14/UI-009-*` | PLANNED |
| UI-010 | `docs\UI\小程序\P0-11-Error-生成失败重试.png` | `/create/draw` and shared error states | generation/render/API failure | Retry, Home | API-005,008 | `screenshots/web/T14/UI-010-*` | PLANNED |

## 视觉约束

- Web viewport 至少覆盖 mobile 390x844；desktop 可作为补充。
- 不得把旧 unlock/payment/invite 视觉带入 Web P0 主线。
- 缺真实 actual screenshot/diff/metrics 时，视觉结论最多 `PASS_NEEDS_MANUAL_UI_REVIEW`。

