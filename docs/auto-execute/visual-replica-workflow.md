# AuraCue UI 一比一复刻流程

本流程用于逐页对照 `docs/UI/小程序` 中的参考图实现 Web/H5 页面。目标不是“差不多”，而是用真实组件、截图、坐标、字体、颜色和功能路径一起验证。

## 绝对禁止

- 禁止把整页参考图、整页截图、full-page reference image 作为页面背景或覆盖层来冒充实现。
- 禁止把真实 DOM 整页设为透明，只保留点击区域。
- 禁止用 `p0-XX-full-reference.png` 这类整页素材作为运行时页面资产。
- 允许使用局部素材：icon、纹理、卡片面板、插画局部、装饰元素；局部裁切必须对应真实 UI 元素，不能覆盖整页。
- 如果缺素材，记录缺口并告诉用户，不要用整页截图绕过。

## 当前策略

- 批量自检阶段：Codex 可以先按页面顺序自主对后续页面完成截图、标注、差异记录和修复，不需要逐页询问用户。
- 人工确认阶段：必须一页一页给用户看真实组件渲染的左右对比图；用户确认当前页通过后，才能进入下一页。
- 每一页最终通过必须同时满足视觉接近、坐标可解释、功能可点击。

## 固定页面清单

- `P0-01-Home-首页今日守护星.png`
- `P0-02-BirthAura-输入生日创建本命气场.png`
- `P0-03-BirthAuraReveal-本命气场揭示.png`
- `P0-04-CheckIn-今日状态与场景选择.png`
- `P0-05A-TarotPull-三张塔罗抽卡.png`
- `P0-05B-Card Selected.png`
- `P0-06A.png`
- `P0-06B.png`
- `P0-06C.png`
- `P0-07-Result-今日风格神谕结果.png`
- `P0-08-Activate-长按封印今日气场.png`
- `P0-09-Activated-气场已封印.png`
- `P0-10-Share.png`
- `P0-12-My-我的气场首页.png`
- `P0-13-MyBirthAura-本命气场资料.png`
- `P0-16-Error-生成失败重试.png`

## 每页工作流

1. 确认参考图、路由、页面状态。
   - 参考图目录：`docs/UI/小程序`
   - 图标目录：`docs/UI/小程序/icon`
   - Web 页面目录：`apps/web`
   - 本地服务通常是 `http://127.0.0.1:3001`

2. 捕获实际页面截图。
   - 视口固定 `430x800`。
   - 交互态页面必须通过真实用户路径进入状态，例如点击按钮，而不是手改 DOM。
   - 例：`P0-06B` 是 `/today/reading` 点击一次 `Reveal the card's message` 后的 `latest-reading--clear` 状态。

3. 每页必须生成证据。
   - `P0-XX-reference-annotated.png`
   - `P0-XX-actual-annotated.png`
   - `P0-XX-annotated-side-by-side.png`
   - `P0-XX-side-by-side.png`
   - `P0-XX-dom.json`
   - `P0-XX-diff-overlay.png`

4. 标注必须覆盖主要视觉对象。
   - 状态栏、返回按钮、Logo、顶部 pill、标题、副标题。
   - 标签按钮、主卡片、列表行、内容面板、CTA。
   - BottomNav、Home/My 的位置、宽高、字体、图标大小必须重点检查。
   - 复杂卡片还要标出内部按钮、图标、色块、文字区域。

5. 差异比较必须看 `x/y/w/h`。
   - 以参考图缩放到 `430x800` 后的坐标为准。
   - 优先修按钮、卡片、面板、导航等可交互/容器元素。
   - 标题文字的 DOM 宽度不等于真实字形宽度，可以标注但不要单独误判。

6. 视觉差异不能只看坐标。
   - 必须比较字体：`font-family`、`font-size`、`font-weight`、`line-height`。
   - 必须比较颜色和背景：按钮背景、面板底色、文字颜色、图标颜色。
   - 用户特别强调：字体大小、按钮宽高、按钮背景色、Home/My BottomNav 必须尽量一比一。

7. 图标处理规则。
   - 先从 `docs/UI/小程序/icon` 和 `apps/web/public/aura-assets` 找现有素材。
   - 找到后复制或处理到 `apps/web/public/aura-assets`，使用稳定英文文件名。
   - 不要依赖中文/空格文件名作为运行时路径。
   - 不要用临时丑图标替代目录里已有的真实图标。
   - 如果目录里确实没有对应图标，记录缺口，再让用户生成或下载。

8. 每轮修复后必须重新截图、重新标注、重新生成差异。
   - 不凭肉眼说“差不多”。
   - 每页保留最终证据图和 JSON。

9. 页面功能也要验证。
   - 视觉自检 OK 后，点击当前页主按钮，确认能进入下一状态或目标路由。
   - 批量自检阶段可以继续下一页；人工确认阶段必须等用户确认。

## 中文路径注意事项

- Python/OpenCV 读取中文路径时优先使用 `np.fromfile + cv2.imdecode`。
- 写图优先使用 `cv2.imencode(...).tofile(path)`。
- 必要时先用 PowerShell 把参考图复制到 ASCII 输出目录再处理。

## 换电脑后给 Codex 的提示词

```text
请继续 AuraCue 的 UI 一比一复刻工作。先阅读 docs/auto-execute/visual-replica-workflow.md。

硬规则：
1. 绝对禁止使用整页参考图/整页截图/full-page reference image 作为页面背景或覆盖层。
2. 绝对禁止把真实 DOM 整页透明化，只保留点击区域。
3. 只能用真实组件复刻；可以使用局部 icon、局部纹理、局部面板、局部插画素材。
4. 使用 430x800 视口。
5. 每页生成参考标注图、实际标注图、标注左右对比图、普通左右对比图、DOM JSON、diff overlay。
6. 必须比较关键元素的 x/y/w/h，以及字体、颜色、按钮背景、Home/My BottomNav。
7. 图标必须先从 docs/UI/小程序/icon 找，不要用临时丑图标替代已有素材。
8. 批量自检阶段 Codex 自己把后续全部页面对完并修到 OK，不用逐页询问。
9. 批量自检完成后，再从头开始逐页交给我确认；我确认当前页通过后才能进入下一页。
```
