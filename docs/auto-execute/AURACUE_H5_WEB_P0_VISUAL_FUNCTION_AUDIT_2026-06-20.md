# AuraCue H5/Web P0 页面视觉与功能审计报告

生成时间：2026-06-20

## 本轮结论

本轮已对 H5/Web P0 主流程进行完整浏览器流程测试，并按 `docs/UI/小程序` 与 `docs/UI/小程序/icon` 中的参考图和资产继续修复页面。当前结论：

- 功能流程：已通过。
- 页面截图：已全部重新生成。
- 视觉对比：所有 P0 页面均已完成代码化实现，不是整图贴图；但仍有部分页面未达到一比一验收级别。
- 最高差异来源：P0-09、P0-10、P0-06B/C、P0-01，主要是人像/卡面资产构图、局部元素间距、部分信息卡片密度。

## 已完成的关键修复

1. P0-06 阅读流程从静态加载页改为真实三步功能：
   - 06A：`Your reading begins.`
   - 06B：`Your message is clear.`
   - 06C：`Your reading unfolds.`
   - 每一步点击 CTA 后进入下一步，最后进入结果页。

2. P0-06 修复 step 切换后没有回到顶部的问题：
   - 切换 06B/06C 时自动 `scrollTo(0,0)`，避免截图和用户视图停留在上一屏底部。

3. P0-08 激活页修复：
   - Logo、标题、封印圆盘整体上移。
   - 圆盘内部文字改为固定层级定位。
   - 长按按钮恢复左侧圆形星标视觉。

4. P0-09 已封印页修复：
   - 主图从带狮子版本切换到不带狮子人像版本。
   - 信息区改为长条 `Lucky Shift` 与上下两条 `Style Translation`。
   - 按钮和内容密度收紧。

5. P0-10 分享页修复：
   - 分享卡改为真实结构：顶部 chips、Ruling Planet、Birth Aura、CARD Strength、Soft Boundary、Luck Shift、颜色/单品信息、AuraCue footer。
   - 分享卡不再是简单人像海报。
   - Share / Download / Copy 三个按钮仍为可点击功能按钮。

## 验证命令

```powershell
pnpm --filter @auracue/web typecheck
pnpm --filter @auracue/web test:pages
$env:T13_WEB_PORT='3220'; $env:T13_CDP_PORT='9330'; pnpm --filter @auracue/web test:e2e
```

验证结果：

- `typecheck`：PASS
- `test:pages`：PASS
- `test:e2e`：PASS

## 证据文件

- 全流程运行截图目录：`docs/auto-execute/screenshots/web/T13/runtime-smoke`
- 视觉并排对比目录：`docs/auto-execute/screenshots/web/T13/visual-audit`
- 全页面对比总览图：`docs/auto-execute/screenshots/web/T13/visual-audit/P0-visual-audit-contact-sheet.jpg`
- 视觉差异 JSON：`docs/auto-execute/screenshots/web/T13/visual-audit/P0-visual-audit-summary.json`

## 页面完成度

| 页面 | 当前功能 | diffRatio | 完成度判断 | 主要剩余差异 |
| --- | --- | ---: | --- | --- |
| P0-01 Home 首页 | 已实现 | 0.2455 | 需继续精修 | 主卡人物/光环构图、Tab 高度和色块仍偏 Web 化 |
| P0-02 BirthAura 输入生日 | 已实现，支持滚动选择月日 | 0.1933 | 接近可验收 | 日期组件仍需继续微调字体与选中区位置 |
| P0-03 BirthAuraReveal 本命气场 | 已实现 | 0.1639 | 当前较接近 | 背景月亮/云层位置与参考仍非完全一致 |
| P0-04 CheckIn 状态选择 | 已实现，多选功能可用 | 0.2339 | 需继续精修 | 图标间距、选项卡片密度、整体高度仍不够贴近 |
| P0-05A TarotPull 抽卡 | 已实现 | 0.1742 | 当前较接近 | 卡牌角度与光效轻微差异 |
| P0-05B Card Selected | 已实现 | 0.1696 | 当前较接近 | 选中态卡牌叠层与提示区还有差异 |
| P0-06A Reading begins | 已实现 | 0.2396 | 需继续精修 | 卡面大小、阅读说明卡高度、底部 CTA 与参考仍有差异 |
| P0-06B Message clear | 已实现 | 0.2465 | 需继续精修 | 列表项高度、左侧步骤图标、底部 Wear Today’s Aura 区域仍偏大 |
| P0-06C Reading unfolds | 已实现 | 0.2494 | 需继续精修 | 三个解释卡高度、右侧标签、底部 CTA 与参考仍不一致 |
| P0-07 Result 结果页 | 已实现 | 0.2067 | 基本可用，需微调 | 信息卡密度与主标题间距仍不同 |
| P0-08 Activate 长按封印 | 已实现，长按 2 秒进入已封印页 | 0.2229 | 已改善，需微调 | 圆盘莲花/文字位置和按钮光效仍未完全一致 |
| P0-09 Activated 已封印 | 已实现，保存/分享/完成可点击 | 0.2525 | 需继续精修 | 英雄图参考构图缺失，信息区/按钮区仍有高度差 |
| P0-10 Share 分享 | 已实现，分享/下载/复制反馈可用 | 0.2480 | 需继续精修 | 分享卡内人物构图、背景拱门/月亮资产和标题层级仍有差 |
| P0-12 My 我的气场 | 已实现 | 0.1617 | 当前较接近 | 局部卡片阴影和字体大小仍可微调 |
| P0-13 MyBirthAura 本命资料 | 已实现 | 0.1643 | 当前较接近 | 信息卡间距和装饰符号略有差异 |
| P0-16 Error 错误页 | 已实现 | 0.1772 | 当前较接近 | 背景卡牌角度和按钮光效略有差异 |

## 当前还缺的关键资产

严格一比一时，当前最缺的是：

1. P0-09 / P0-10 使用的无狮子、带拱门/月亮/完整云层的同构图人像卡面背景。
   - 现在用 `hero-woman.png` 可以避免狮子干扰，但缺少参考图里的拱门、月亮、星云层。
   - 用 `hero_woman_lion.png` 有拱门和空间感，但狮子会造成大面积差异。

2. P0-06 阅读卡牌专用小卡资产。
   - 当前复用主视觉卡面，参考图里的小卡比例、留白、文字位置更独立。

3. P0-09 左侧风格条里的 Guardian Item 西装图标。
   - 当前用 CSS swatch 模拟，若要完全一致，建议提供透明 PNG 图标。

## 下一轮建议顺序

1. 先做 P0-09 / P0-10 共用人像卡面资产专项。
2. 再做 P0-06A/B/C 小卡与阅读卡片密度专项。
3. 再回到 P0-01 / P0-04 做 Tab、选项、按钮细节。
4. 最后统一微调字体、装饰线、星标和按钮光效。

