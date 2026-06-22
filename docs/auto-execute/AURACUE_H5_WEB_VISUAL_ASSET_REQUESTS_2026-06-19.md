# AuraCue H5/Web 全页面视觉素材与 image2 提示词清单

更新日期：2026-06-20

## 结论先说

这份文档是给 ChatGPT image2 / 图片生成模型使用的资产需求文档，不是让前端直接贴整页截图。

当前 H5/Web 页面已经有真实前端代码和交互，不再是整页图片替代实现。但从一比一视觉角度看，当前 13 个已纳入 T15 对比的页面全部仍是 `REPAIR_REQUIRED`，主要问题不是按钮能不能点，而是主视觉插画、卡面背景、徽章、光效纹理和局部图标还没有完全对齐 APP 参考图。

你已经补充的 icon 目录：

`docs/UI/小程序/icon/`

我已经确认这里有：

- P0-04 mood 图标：`01_mood_*` 到 `08_mood_*`
- P0-04 intent 图标：`09_intent_*` 到 `14_intent_*`
- 选择态徽章：`15_selected_check_badge@2x.png`
- P0-02/P0-03 birthday / birth aura 图标：`16_birth_aura_venus_symbol@2x.png`、`17_calendar_star_chip_icon@2x.png`
- P0-10 分享操作图标：`share-icon-upload.*`、`share-icon-download.*`、`share-icon-link.*`
- P0-10 金色莲花分割线：`share-divider-lotus-gold.*`

所以后面每页会区分：

- `已可复用`：你已经给了或项目已有，不需要再生成。
- `缺失资产`：需要 image2 生成。
- `缺参考图`：页面有代码，但没有当前 P0 顶层 APP 参考图，无法严格一比一验收。

## 当前证据

- 页面实现：`apps/web/components/latest-ui-pages.tsx`
- 样式实现：`apps/web/components/latest-ui.css`
- 参考图目录：`docs/UI/小程序/`
- 新 icon 目录：`docs/UI/小程序/icon/`
- 当前运行截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/`
- 当前视觉对比：`docs/auto-execute/screenshots/web/T15/visual-summary.json`
- 参考图总览：`docs/auto-execute/screenshots/web/T15/contact/p0-reference-contact-sheet.png`
- 当前截图总览：`docs/auto-execute/screenshots/web/T15/contact/p0-actual-contact-sheet.png`

完成度说明：

- `功能完成度`：页面是否有真实前端代码、状态变化、导航、测试覆盖。
- `视觉完成度`：按 T15 当前像素差异粗略折算，`100% - diffRatio`，只用于排序优先级，不代表已经一比一通过。
- 目标视觉门槛：`diffRatio <= 0.05`。

## 页面完成度总表

| 页面 | 路由 | 参考图 | 功能完成度 | 视觉完成度 | 当前状态 |
| --- | --- | --- | ---: | ---: | --- |
| P0-01 Home | `/home` | 有 | 100% | 35% | 主视觉差距最大，需重做 Saturn hero 卡 |
| P0-02 Birth Aura 输入生日 | `/onboarding/birth-aura` | 有 | 100% | 72% | 组件可用，缺梦幻 picker 面板背景 |
| P0-03 Birth Aura Reveal | `/onboarding/birth-aura/reveal` | 有 | 100% | 64% | 缺 Venus Air 主徽章卡与守护色卡细节 |
| P0-04 Check-in | `/today/check-in` | 有 | 100% | 56% | icon 已补齐，面板纹理/选中态还需对齐 |
| P0-05 Tarot Pull | `/today/draw` | 有 | 100% | 69% | 卡背可用，三卡舞台光效和比例需对齐 |
| P0-06A Reading 轻量进度 | `/today/reading` | 有 | 100% | 74% | 需要读取进度光环/云雾背景 |
| P0-06B Reading 完整进度 | `/today/reading` | 有，但未纳入 T15 | 60% | 未测 | 需要单独状态和四项读取步骤素材 |
| P0-07 Result | `/result/[id]` | 有 | 100% | 59% | 缺结果页顶部 Strength 插画卡和细节徽章 |
| P0-08 Activate | `/activate/[id]` | 有 | 100% | 60% | 缺中心莲花封印 orb 精确图 |
| P0-09 Activated | `/activated/[id]` | 有 | 100% | 43% | 主插画有 lion 版本但比例/信息卡差异大 |
| P0-10 Share | `/share/[id]` | 有 | 100% | 59% | 缺无狮子的分享卡主插画和底部徽章 |
| P0-11 Saved | `/saved/[id]` | 缺当前 P0 顶层参考图 | 100% | 无法严格验收 | 有代码，需要参考图或明确沿用旧 UI-009 |
| P0-12 My Aura | `/my` | 有 | 100% | 74% | 缺 Birth Aura / Today 两张圆形卡面徽章精修 |
| P0-13 My Birth Aura | `/my/birth-aura` | 有 | 100% | 62% | 缺大号 Venus Air 宝石徽章精修 |
| P0-14 Privacy | `/legal/privacy` | 缺 | 100% | 无法严格验收 | 有需求实现，无 APP 参考图 |
| P0-15 Terms | `/legal/terms` | 缺 | 100% | 无法严格验收 | 有需求实现，无 APP 参考图 |
| P0-16 Error | `/error/network` | 有 | 100% | 50% | 缺溶解塔罗卡/云雾错误页主视觉精修 |

---

## 全局通用生成规范

所有 image2 生成都请遵守：

```text
风格：高级女性向、梦幻塔罗、柔和灵性、轻奢 App 视觉。色调以奶油白、浅粉、薰衣草紫、柔和金色、深海军蓝为主。画面干净、高清、细腻、柔光、颗粒轻微，不要暗黑，不要赛博朋克，不要厚重宗教感。

如果是插画素材：不要生成任何文字、Logo、按钮、状态栏、手机边框、UI 整页截图。

如果是 icon / badge：透明背景 PNG，边缘干净，居中，有安全边距，不能带文字。
```

通用反向提示词：

```text
不要文字，不要英文单词，不要中文，不要 logo，不要水印，不要完整 App 页面，不要手机状态栏，不要按钮，不要 UI 截图，不要低清晰度，不要锯齿边缘，不要脸部畸形，不要手部畸形，不要暗黑恐怖风，不要赛博朋克，不要强霓虹，不要脏污背景。
```

---

## P0-01 Home：首页今日守护星

- 路由：`/home`
- 参考图：`docs/UI/小程序/P0-01-Home-首页今日守护星.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/01-home.png`
- T15 diffRatio：`0.64517`
- 功能完成度：100%
- 视觉完成度：35%

已可复用：

- `lotus-logo.png`
- `calendar-star.png`
- `shield.png`
- `lock.png`
- `scales.png`
- `hero-woman.png` 可以临时用，但构图不等于参考图

缺失资产：

1. `home-saturn-planet-hero-card.png`：首页 Saturn 守护星主视觉卡。

### P0-01 提示词：Saturn 首页主视觉卡

建议文件：

- `home-saturn-planet-hero-card.png`
- PNG，建议 `1200 x 760`
- 背景不透明，圆角卡片里使用
- 不要文字

正向提示词：

```text
生成一张用于移动端 App 首页卡片的横向梦幻插画，尺寸 1200x760。

画面是 Today's Ruling Planet / Saturn 的视觉卡背景，但不要生成任何文字。整体用于前端叠加 Saturn 标题、Structure、Boundaries、Stability 三个标签。

画面风格：高级女性向、梦幻塔罗、轻奢、柔和灵性。色调为淡薰衣草紫、粉白云雾、奶油白、柔和金色。背景是粉紫星空和云雾，细小星光散布。

主体：右侧一位年轻女性侧脸朝上或朝右，闭眼，发髻或松散盘发，穿浅粉或裸粉色丝质上衣。人物只占画面右侧 35%-45%，左侧需要大面积留白，方便前端叠加 Saturn 大标题。

背景元素：女性背后有淡淡圆形星盘光环，可以有半透明月亮/行星弧线，底部有柔软云雾。整体像一张精致的塔罗神谕卡背景。

构图要求：左侧留足文字区，底部留出三个小标签位置；不要让人物遮挡左侧标题区域。
```

反向提示词：

```text
不要文字，不要 Saturn 字样，不要 AuraCue 字样，不要 logo，不要 UI 按钮，不要手机界面，不要动物，不要狮子，不要多人，不要强烈黑色背景，不要赛博朋克，不要大面积深紫霓虹。
```

验收标准：

- 左侧有干净留白，可叠加大号 `Saturn`
- 右侧女性侧脸清晰
- 有粉紫星空、云雾、圆形光环
- 没有文字和 UI

---

## P0-02 Birth Aura：输入生日创建本命气场

- 路由：`/onboarding/birth-aura`
- 参考图：`docs/UI/小程序/P0-02-BirthAura-输入生日创建本命气场.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/02-birth-aura.png`
- T15 diffRatio：`0.284956`
- 功能完成度：100%
- 视觉完成度：72%

已可复用：

- `lotus-logo.png`
- `privacy-lock-badge.png`
- `17_calendar_star_chip_icon@2x.png`

缺失资产：

1. `birthday-picker-cloud-panel-bg.png`：生日选择器梦幻粉紫云雾背景。
2. `birthday-soft-star-divider.png`：标题两侧柔粉星芒装饰，可用 CSS 替代，非必须。

### P0-02 提示词：生日选择器云雾面板背景

建议文件：

- `birthday-picker-cloud-panel-bg.png`
- PNG，建议 `900 x 840`
- 不要文字

正向提示词：

```text
生成一张用于移动端生日选择器面板的梦幻背景图，尺寸 900x840。

画面风格：浅粉、薰衣草紫、奶油白、柔和金色星光，像柔软云层中的生日能量面板。背景中有淡淡半圆光环、细小星星、底部粉白云雾，边缘有柔和发光效果。

构图：中间区域保持足够干净，前端会叠加 Month / Day 两个选择器。画面不要有任何文字，不要有按钮，不要有人物。整体适合放进大圆角半透明卡片。
```

反向提示词：

```text
不要文字，不要数字，不要月份，不要人物，不要 UI 控件，不要按钮，不要 logo，不要水印，不要太暗，不要强对比。
```

验收标准：

- 能作为 picker 面板背景
- 中间干净不干扰文字
- 有云雾、星光、半圆光环
- 无文字

---

## P0-03 Birth Aura Reveal：本命气场揭示

- 路由：`/onboarding/birth-aura/reveal`
- 参考图：`docs/UI/小程序/P0-03-BirthAuraReveal-本命气场揭示.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/03-birth-aura-reveal.png`
- T15 diffRatio：`0.360169`
- 功能完成度：100%
- 视觉完成度：64%

已可复用：

- `birth-aura-venus-air-orb.png`
- `birth_lotus_medallion.png`
- `16_birth_aura_venus_symbol@2x.png`

缺失资产：

1. `birth-aura-venus-air-orb-large.png`：更贴近参考图的大号 Venus Air 宝石/星盘徽章。
2. `guardian-color-soft-opal-pink-swatch.png`：Soft Opal Pink 守护色圆形色块。

### P0-03 提示词：Venus Air 本命气场主徽章

建议文件：

- `birth-aura-venus-air-orb-large.png`
- 透明背景 PNG，建议 `720 x 720`
- 不要文字

正向提示词：

```text
生成一个透明背景的圆形本命气场徽章，尺寸 720x720。

主题是 Venus Air，画面中心是一颗粉紫色宝石或水晶莲花，外圈有细金色星盘线条、轻微黄道符号感、柔和光环。整体颜色为软欧泊粉、浅薰衣草紫、奶油白和柔金。徽章要高级、细腻、灵性、女性向，适合放在 AuraCue 的 Birth Aura 页面。

构图：圆形徽章居中，内部有宝石、水晶、莲花、星光、细金线。背景透明，边缘干净，不能有任何文字。
```

反向提示词：

```text
不要文字，不要 Venus Air 字样，不要 Libra 字样，不要 logo，不要水印，不要人物，不要按钮，不要方形背景，不要暗黑魔法阵，不要复杂到看不清。
```

验收标准：

- 透明背景
- 圆形宝石/莲花/星盘徽章
- 粉紫、欧泊、柔金色
- 无文字

### P0-03 提示词：Soft Opal Pink 色块

建议文件：

- `guardian-color-soft-opal-pink-swatch.png`
- 透明背景 PNG，`256 x 256`

正向提示词：

```text
生成一个透明背景 PNG 圆形色彩徽章，尺寸 256x256。

主题色是 Soft Opal Pink。圆形内部是柔和欧泊粉、贝母白、浅薰衣草紫的渐变，带一点珠光质感和细小星光。外圈有很细的柔金描边。用于 Birth Aura 页面的 Guardian Color 色块。
```

反向提示词：

```text
不要文字，不要 logo，不要方形背景，不要人物，不要强烈彩虹，不要高饱和荧光色。
```

---

## P0-04 Check-in：今日状态与场景选择

- 路由：`/today/check-in`
- 参考图：`docs/UI/小程序/P0-04-CheckIn-今日状态与场景选择.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/04-check-in.png`
- T15 diffRatio：`0.43599`
- 功能完成度：100%
- 视觉完成度：56%

已可复用：

- mood 图标：`01_mood_drained_drop@2x.png` 到 `08_mood_main_character_crown@2x.png`
- intent 图标：`09_intent_work_study_book@2x.png` 到 `14_intent_soft_reset_arrows@2x.png`
- 选中态：`15_selected_check_badge@2x.png`

缺失资产：

1. 小图标不缺。
2. 若要更贴近参考图，需要 `checkin-choice-panel-bg.png`：粉紫星光大面板纹理。

### P0-04 提示词：Check-in 星光选择面板背景

建议文件：

- `checkin-choice-panel-bg.png`
- PNG，建议 `900 x 1280`
- 不要文字

正向提示词：

```text
生成一张用于移动端选择题面板的柔和星光背景，尺寸 900x1280。

画面风格：奶油白底、浅粉、浅薰衣草紫、柔金星光。四周有淡淡发光边缘和很轻的云雾，中间干净，前端会叠加 mood 和 intent 的选择按钮。

背景中可以有少量星星、小月牙、非常淡的光晕，但不要复杂插画，不要人物。整体像 AuraCue 的塔罗神谕选择面板。
```

反向提示词：

```text
不要文字，不要图标，不要按钮，不要人物，不要 logo，不要水印，不要强烈纹理，不要暗色背景。
```

验收标准：

- 可作为选择按钮背后的大面板
- 画面干净，不抢按钮文字
- 无文字

---

## P0-05 Tarot Pull：三张塔罗抽卡

- 路由：`/today/draw`
- 参考图：`docs/UI/小程序/P0-05-TarotPull-三张塔罗抽卡.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/05-draw.png`
- T15 diffRatio：`0.305835`
- 功能完成度：100%
- 视觉完成度：69%

已可复用：

- `tarot-card-back-card2.png`
- `tarot-card-back-tilt.png`

缺失资产：

1. `tarot-card-back-reference.png`：更接近参考图的粉白金色卡背，可替换现有卡背。
2. `tarot-pull-stage-glow.png`：三卡背后的柔粉舞台光晕。

### P0-05 提示词：粉白金色塔罗卡背

建议文件：

- `tarot-card-back-reference.png`
- 透明背景 PNG，建议 `420 x 720`
- 不要文字

正向提示词：

```text
生成一张透明背景 PNG 的竖版塔罗卡背，尺寸 420x720。

卡片风格：粉白底、柔金描边、细腻星光、中心有金色四芒星或罗盘星，边角有小星星装饰。整体高级、干净、女性向、梦幻塔罗风格。卡片需要完整正面朝上，圆角，边缘清晰，适合在前端旋转和缩放。

卡片内部不能出现文字，不能出现 AURA 字样。
```

反向提示词：

```text
不要文字，不要 AURA 字样，不要 logo，不要水印，不要人物，不要深色恐怖塔罗，不要复杂图案，不要背景。
```

### P0-05 提示词：三卡舞台光效

建议文件：

- `tarot-pull-stage-glow.png`
- 透明背景 PNG，建议 `900 x 620`

正向提示词：

```text
生成一张透明背景 PNG 的柔和舞台光效，尺寸 900x620。

用于三张塔罗卡背后的背景。画面是浅粉、奶油白、薰衣草紫的柔光云雾，中心有淡淡金色星光和圆形光晕。边缘自然消散，不能有文字，不能有卡片，不能有人物。
```

反向提示词：

```text
不要文字，不要卡牌，不要人物，不要 logo，不要水印，不要硬边框，不要暗色背景。
```

---

## P0-06A Reading：轻量生成进度

- 路由：`/today/reading`
- 参考图：`docs/UI/小程序/P0-06A-Reading-轻量生成进度.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/06-reading.png`
- T15 diffRatio：`0.264983`
- 功能完成度：100%
- 视觉完成度：74%

已可复用：

- `tarot-card-back-card2.png`

缺失资产：

1. `reading-light-orbit-cloud-bg.png`：卡牌外圈的巨大柔粉光环与云雾背景。

### P0-06A 提示词：Reading 轻量进度光环背景

建议文件：

- `reading-light-orbit-cloud-bg.png`
- 透明背景 PNG，建议 `900 x 900`

正向提示词：

```text
生成一张透明背景 PNG 的圆形梦幻光环背景，尺寸 900x900。

用于 Reading your aura 页面中塔罗卡背后的发光区域。画面中心是淡粉白和薰衣草紫渐变光圈，外围有柔和圆形光环，底部有淡淡云雾和细小星光。整体很轻、干净、梦幻，不要有文字，不要有卡片，不要人物。
```

反向提示词：

```text
不要文字，不要卡牌，不要人物，不要 logo，不要手机界面，不要硬边框，不要强烈霓虹。
```

---

## P0-06B Reading：完整信号读取进度

- 路由：`/today/reading`
- 参考图：`docs/UI/小程序/P0-06B-Reading-完整信号读取进度.png`
- 当前状态：参考图存在，但 T15 视觉对比脚本未覆盖这一状态。
- 功能完成度：60%
- 视觉完成度：未测

已可复用：

- `hero_woman_lion.png` 可以临时表达 Strength，但 P0-06B 参考图需要更像“读取进度卡”。
- `tarot-card-back-card2.png`

缺失资产：

1. `reading-strength-preview-card.png`：女性 + 狮子 + 拱门的横向读取预览卡。
2. `reading-step-orb-set.png` 或拆分为 4 个透明小徽章：Birth Aura、Ruling Planet、Chosen Card、Translating Energy。

### P0-06B 提示词：完整读取进度 Strength 预览卡

建议文件：

- `reading-strength-preview-card.png`
- PNG，建议 `1100 x 680`
- 不要文字

正向提示词：

```text
生成一张用于移动端 Reading 进度页顶部的横向梦幻插画卡，尺寸 1100x680。

画面主体：年轻女性侧脸朝上或朝右，闭眼，穿浅粉丝质吊带裙，旁边有温柔的狮子，狮子安静守护。右侧有淡紫粉色古典拱门和花枝，背景是粉紫星空、云雾、圆形光环和柔金星光。

风格：高级女性向、梦幻塔罗、轻奢、柔和灵性。整体要像 Strength 塔罗能量，但不要生成任何文字。

构图：人物和狮子居中偏左，右侧拱门可见，上方和下方保持干净，方便前端叠加标题、进度条、步骤按钮。
```

反向提示词：

```text
不要文字，不要 Strength 字样，不要 AuraCue 字样，不要 logo，不要按钮，不要完整 UI 页面，不要凶猛狮子，不要暗黑风，不要多人。
```

### P0-06B 提示词：四个读取步骤小徽章

建议文件：

- `reading-step-birth-aura.png`
- `reading-step-ruling-planet.png`
- `reading-step-chosen-card.png`
- `reading-step-energy-style.png`
- 透明背景 PNG，`256 x 256`

正向提示词：

```text
生成一组透明背景 PNG 小圆形徽章，尺寸每个 256x256，用于 AuraCue Reading 进度页。

风格统一：圆形柔粉紫徽章，细金边，内部是简单清晰的线性符号，颜色为深海军蓝和柔金。

四个图标分别是：
1. Birth Aura：小莲花或宝石星盘
2. Ruling Planet：小行星或月亮轨道
3. Chosen Card：小塔罗卡背
4. Energy Style：闪光线条或衣橱能量符号

全部透明背景，无文字，无 logo。
```

反向提示词：

```text
不要文字，不要数字，不要 logo，不要水印，不要方形背景，不要复杂人物，不要完整页面。
```

---

## P0-07 Result：今日风格神谕结果

- 路由：`/result/[id]`
- 参考图：`docs/UI/小程序/P0-07-Result-今日风格神谕结果.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/07-result.png`
- T15 diffRatio：`0.411677`
- 功能完成度：100%
- 视觉完成度：59%

已可复用：

- `shield-growth.png`
- `hero_woman_lion.png` 可复用但当前 Result 页没有按参考图使用

缺失资产：

1. `result-strength-soft-boundary-banner.png`：结果页顶部 Strength / Soft Boundary 插画横幅。
2. `share-lucky-color-charcoal-navy-medallion.png`：幸运色徽章，也用于 P0-09/P0-10。
3. `share-guardian-structured-jacket-medallion.png`：守护单品徽章，也用于 P0-09/P0-10。

### P0-07 提示词：结果页 Strength 横幅

建议文件：

- `result-strength-soft-boundary-banner.png`
- PNG，建议 `1100 x 620`
- 不要文字

正向提示词：

```text
生成一张横向结果页插画卡背景，尺寸 1100x620，用于 AuraCue 今日风格神谕结果页。

画面主题：Strength / Soft Boundary，但不要生成文字。主体是一位闭眼女性侧脸朝右，旁边有温柔狮子，右侧有古典拱门和花枝。背景是粉紫星空、云雾、发光圆环、微金星光。整体高级、柔和、女性向、塔罗神谕风格。

构图：画面上方和下方留出一定空间，前端会叠加 Strength、Soft Boundary、Today's Ruling Planet 等文字。人物和狮子不要遮挡中间主要文字区。
```

反向提示词：

```text
不要文字，不要 Strength 字样，不要 Soft Boundary 字样，不要 logo，不要按钮，不要完整 App 页面，不要凶猛动物，不要暗黑风。
```

---

## P0-08 Activate：长按封印今日气场

- 路由：`/activate/[id]`
- 参考图：`docs/UI/小程序/P0-08-Activate-长按封印今日气场.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/08-activate.png`
- T15 diffRatio：`0.401894`
- 功能完成度：100%
- 视觉完成度：60%

已可复用：

- `seal-orb-pink.png` 可临时用

缺失资产：

1. `activate-lotus-seal-orb.png`：中心带莲花线稿的粉紫封印 orb。

### P0-08 提示词：莲花封印 orb

建议文件：

- `activate-lotus-seal-orb.png`
- 透明背景 PNG，建议 `900 x 900`

正向提示词：

```text
生成一个透明背景 PNG 的大型圆形封印能量球，尺寸 900x900。

画面中心是一朵柔粉色莲花线稿，莲花周围是半透明粉紫能量球、细小星光、云雾和柔和光环。外圈有轻微玻璃质感和淡金色边缘。整体非常柔和、安静、女性向、塔罗神谕风格。

构图：中心莲花清晰，周围圆形 orb 完整，边缘自然发光。不要文字，不要按钮，不要 logo。
```

反向提示词：

```text
不要文字，不要 logo，不要水印，不要人物，不要卡牌，不要黑色背景，不要强霓虹，不要复杂魔法阵。
```

---

## P0-09 Activated：气场已封印

- 路由：`/activated/[id]`
- 参考图：`docs/UI/小程序/P0-09-Activated-气场已封印.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/09-activated.png`
- T15 diffRatio：`0.572361`
- 功能完成度：100%
- 视觉完成度：43%

已可复用：

- `hero_woman_lion.png` 已有，但需要按参考图裁切和比例使用。
- `share-lucky-color-charcoal-navy-medallion.png` 如果生成，可复用。
- `share-guardian-structured-jacket-medallion.png` 如果生成，可复用。

缺失资产：

1. 若 `hero_woman_lion.png` 不够贴近参考图，则生成 `activated-soft-boundary-lion-card.png`。
2. Lucky Color / Guardian Item 两个徽章，见 P0-10 的 A2/A3。

### P0-09 提示词：封印成功页 Soft Boundary 插画卡

建议文件：

- `activated-soft-boundary-lion-card.png`
- PNG，建议 `1100 x 760`
- 不要文字

正向提示词：

```text
生成一张用于 AuraCue 气场已封印页面的横向插画卡，尺寸 1100x760。

主体：闭眼女性侧脸朝右，穿浅粉丝质吊带裙，旁边有温柔狮子。背景是粉紫星空、云雾、右侧古典拱门、柔和月光、圆形光环和微金星光。

画面风格：高级女性向、梦幻塔罗、轻奢、柔和灵性。整体明亮、干净、细腻。

构图：画面中间偏上保留可叠加 Soft Boundary 标题的位置，底部不要太复杂，方便前端放信息卡。
```

反向提示词：

```text
不要文字，不要 Soft Boundary 字样，不要 Aura Sealed 字样，不要 logo，不要按钮，不要完整页面，不要凶猛狮子，不要暗黑风。
```

---

## P0-10 Share：今日气场分享卡

- 路由：`/share/[id]`
- 参考图：`docs/UI/小程序/P0-10-Share-今日气场分享卡.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/10-share.png`
- T15 diffRatio：`0.41039`
- 功能完成度：100%
- 视觉完成度：59%

已可复用：

- `share-icon-upload.png/svg`
- `share-icon-download.png/svg`
- `share-icon-link.png/svg`
- `share-divider-lotus-gold.png/svg`

缺失资产：

1. `share-card-soft-boundary-scene.png`：无狮子的 9:16 分享卡主插画。
2. `share-lucky-color-charcoal-navy-medallion.png`
3. `share-guardian-structured-jacket-medallion.png`

### P0-10 A1 提示词：分享卡主插画

建议文件：

- `share-card-soft-boundary-scene.png`
- PNG，建议 `864 x 1488`
- 不要文字

正向提示词：

```text
生成一张用于移动端 App 分享卡片的竖版梦幻插画，画面比例约 0.58 宽高比，建议尺寸 864x1488。

画面风格：高级女性向、梦幻塔罗、柔和灵性、轻奢 App 视觉，色调为薰衣草紫、浅粉、奶油白、微金色，高级细腻，不要暗黑，不要厚重。

主体：一位年轻女性，东方或混合族裔五官，闭眼，侧脸朝右，表情安静自信，头发低盘发或松散发髻，穿浅粉色丝质吊带裙。人物位于画面中下部，胸像到半身，不要全身。姿态优雅，像在冥想或感受能量。

背景：梦幻粉紫星空，细小星光点缀；女性背后有柔和发光的圆形光环；左上角有一枚小月牙；画面底部左右有柔软粉白云雾；右侧有淡紫粉色古典拱门，拱门上有少量花枝和藤蔓。整体像一张精致塔罗神谕卡的插画背景。

构图要求：上方留出空间，方便前端叠加 AuraCue logo、TODAY'S AURA、Soft Boundary 等文字；底部也留出空间，方便前端叠加 Lucky Color 和 Guardian Item 两个信息胶囊。人物不要遮挡上方文字区域，也不要占满底部信息区域。

画质要求：精致、干净、高清、柔和光效、细节丰富、边缘自然、适合放进圆角卡片中。不要生成 UI 按钮，不要生成文字，不要生成 logo。
```

反向提示词：

```text
不要文字，不要英文单词，不要中文，不要 logo，不要水印，不要 App 按钮，不要完整手机界面，不要边框文字，不要 Soft Boundary 字样，不要 AuraCue 字样，不要 lucky color 字样，不要 guardian item 字样。

不要狮子，不要动物，不要翅膀，不要魔法阵符号过重，不要恐怖风，不要暗黑哥特，不要赛博朋克，不要强烈蓝紫霓虹，不要浓重黑色背景，不要低清晰度，不要模糊脸，不要多个人物，不要手部畸形，不要脸部畸形。
```

### P0-10 A2 提示词：Lucky Color 深藏青徽章

建议文件：

- `share-lucky-color-charcoal-navy-medallion.png`
- 透明背景 PNG，`256 x 256`

正向提示词：

```text
生成一个透明背景 PNG 小图标，尺寸 256x256，用于移动端 App 分享卡里的 Lucky Color 圆形徽章。

图标内容：一个圆形深藏青色 / Charcoal Navy 色彩徽章，像夜空或高级布料质感。圆形外圈有细金色边框，内部是深蓝黑、藏青、午夜蓝的渐变，有非常细微的织物纹理或夜空颗粒感。圆形内部有一个很小的金色星光高光，位置可以在左上或右上。

风格：精致、轻奢、女性向、塔罗神谕卡风格，适合放在粉紫色卡片上。边缘干净，透明背景，不要投影太重。
```

反向提示词：

```text
不要文字，不要 logo，不要水印，不要方形背景，不要复杂图案，不要人物，不要衣服，不要按钮，不要 UI 页面，不要强烈发光，不要低清晰度，不要锯齿边缘。
```

### P0-10 A3 提示词：Guardian Item 结构外套徽章

建议文件：

- `share-guardian-structured-jacket-medallion.png`
- 透明背景 PNG，`256 x 256`

正向提示词：

```text
生成一个透明背景 PNG 小图标，尺寸 256x256，用于移动端 App 分享卡里的 Guardian Item 圆形徽章。

图标内容：圆形徽章中有一件结构感深蓝色西装外套 / structured jacket，小插画风格。外套颜色为深藏青、午夜蓝，带一点金色细节，例如金色滚边、金色纽扣或细线装饰。圆形外圈是细金色边框，内部可以有淡紫色或深蓝色柔和背景。

风格：精致、轻奢、女性向、塔罗神谕卡风格，图标需要清晰可识别，适合放在粉紫色分享卡的底部信息条里。透明背景，边缘干净。
```

反向提示词：

```text
不要文字，不要 logo，不要水印，不要真人模特，不要完整穿搭照片，不要衣架，不要复杂背景，不要方形底图，不要按钮，不要 UI 页面，不要低清晰度，不要变形衣服。
```

---

## P0-11 Saved：保存成功

- 路由：`/saved/[id]`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/11-saved.png`
- 当前问题：顶层 P0 参考图缺失。旧 web UI-009 参考存在，但不是当前 `docs/UI/小程序/P0-*` 这套命名。
- 功能完成度：100%
- 视觉完成度：无法严格验收

已可复用：

- `share-status-success-check.png`
- `hero_woman_lion.png`
- `share-action-aura-cards-lotus.png`

缺失资产：

1. 如果要严格一比一，需要先补 P0-11 APP 参考图。
2. 若直接做素材，可生成 `saved-success-aura-card-thumbnail.png`。

### P0-11 参考图生成提示词：Saved 页面参考图

用途：这是生成 UI 参考图，不是要放进前端代码。

建议文件：

- `P0-11-Saved-保存成功反馈.png`
- 竖版 UI 参考图，`941 x 1672`

正向提示词：

```text
生成一张移动端 App 页面参考图，尺寸 941x1672，主题是 AuraCue 的 Saved 保存成功反馈页。

页面风格和 AuraCue P0 系列一致：奶油白背景、深海军蓝 serif 字体、浅粉紫卡片、柔金细线、梦幻塔罗女性向轻奢风格。

页面结构：顶部 iOS 状态栏 9:41，中间 AuraCue 莲花 logo；主标题 Saved 或 Aura Saved；副文案 Your aura card has been saved to My Aura；中间有一个保存成功卡片，卡片里是 Soft Boundary / Strength 的小插画缩略图，可以用女性、狮子、粉紫星空、拱门元素；旁边或上方有圆形成功勾选徽章。底部有主按钮 View My Aura，次按钮 Back Home 或 Share Story。

这张是 UI 参考图，可以包含文字。但请保持文字清晰、布局规整、不要水印。
```

反向提示词：

```text
不要杂乱排版，不要暗黑风，不要 Android 状态栏，不要真实照片感过强，不要水印，不要品牌拼错，不要奇怪乱码。
```

### P0-11 素材提示词：保存成功卡片缩略图

建议文件：

- `saved-success-aura-card-thumbnail.png`
- PNG，建议 `800 x 560`
- 不要文字

正向提示词：

```text
生成一张 AuraCue 保存成功页使用的横向小卡片插画，尺寸 800x560。

内容：粉紫星空、云雾、柔金星光、闭眼女性侧脸、温柔狮子、右侧古典拱门。整体像 Soft Boundary 气场卡缩略图。上方留白，底部干净，不要文字，不要 logo。
```

反向提示词：

```text
不要文字，不要 logo，不要按钮，不要完整 UI 页面，不要凶猛狮子，不要暗黑风。
```

---

## P0-12 My Aura：我的气场首页

- 路由：`/my`
- 参考图：`docs/UI/小程序/P0-12-My-我的气场首页.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/12-my.png`
- T15 diffRatio：`0.262719`
- 功能完成度：100%
- 视觉完成度：74%

已可复用：

- `avatar_woman.png`
- `birth_lotus_medallion.png`
- `moon_medallion.png`
- `common-tab-home.png`
- `common-tab-profile.png`

缺失资产：

1. `my-birth-aura-venus-air-medallion.png`：My 首页 Birth Aura 圆形卡图。
2. `my-today-soft-boundary-medallion.png`：My 首页 Today 圆形卡图。

### P0-12 提示词：My 首页 Birth Aura 圆形卡图

建议文件：

- `my-birth-aura-venus-air-medallion.png`
- 透明背景 PNG，`512 x 512`

正向提示词：

```text
生成一个透明背景 PNG 圆形徽章，尺寸 512x512，用于 AuraCue My Aura 页面里的 Birth Aura 卡片。

主题：Venus Air。中心是粉紫欧泊宝石、莲花和细金星盘线条，周围有柔和云雾和小星光。整体轻奢、梦幻、女性向。圆形边缘自然发光，透明背景，无文字。
```

反向提示词：

```text
不要文字，不要 logo，不要人物，不要方形背景，不要暗黑魔法阵。
```

### P0-12 提示词：My 首页 Today 圆形卡图

建议文件：

- `my-today-soft-boundary-medallion.png`
- 透明背景 PNG，`512 x 512`

正向提示词：

```text
生成一个透明背景 PNG 圆形徽章，尺寸 512x512，用于 AuraCue My Aura 页面里的 Today 气场卡片。

主题：Soft Boundary。中心是柔粉紫圆形光环、月牙、云雾、细小星光，可以有非常淡的女性侧脸轮廓或塔罗卡背轮廓。整体柔和、干净、高级，边缘自然发光。不要文字。
```

反向提示词：

```text
不要文字，不要 logo，不要完整人物大脸，不要方形背景，不要按钮，不要暗黑风。
```

---

## P0-13 My Birth Aura：本命气场资料

- 路由：`/my/birth-aura`
- 参考图：`docs/UI/小程序/P0-13-MyBirthAura-本命气场资料.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/13-my-birth-aura.png`
- T15 diffRatio：`0.382995`
- 功能完成度：100%
- 视觉完成度：62%

已可复用：

- `birth_lotus_medallion.png`
- P0-03 生成的 `birth-aura-venus-air-orb-large.png` 可复用

缺失资产：

1. `my-birth-profile-venus-air-card-art.png`：大卡片左侧 Venus Air 宝石/莲花主图。

### P0-13 提示词：Birth Aura 资料页大号主图

建议文件：

- `my-birth-profile-venus-air-card-art.png`
- 透明背景 PNG，`720 x 520`

正向提示词：

```text
生成一张透明背景 PNG 的 Birth Aura 资料页主图，尺寸 720x520。

画面是一个大号 Venus Air 本命气场徽章：粉紫欧泊宝石、莲花、水晶、细金星盘线条、柔和云雾。整体偏横向，左侧图形更饱满，右侧保持少量留白，方便前端排版文字。无文字，无 logo。
```

反向提示词：

```text
不要文字，不要 logo，不要人物，不要方形背景，不要按钮，不要黑色背景。
```

---

## P0-14 Privacy：隐私页

- 路由：`/legal/privacy`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/14-privacy.png`
- 当前问题：没有 P0-14 APP 参考图。
- 功能完成度：100%
- 视觉完成度：无法严格验收

已可复用：

- `privacy-lock-badge.png`
- `lock.png`

缺失资产：

1. 当前不缺前端必需 icon。
2. 如果要一比一，需要生成或提供 P0-14 Privacy APP 参考图。

### P0-14 参考图生成提示词：Privacy 页面

用途：生成 UI 参考图，不是作为前端整页实现。

建议文件：

- `P0-14-Privacy-隐私说明.png`
- 竖版 UI 参考图，`941 x 1672`

正向提示词：

```text
生成一张 AuraCue 移动端 App 隐私页面参考图，尺寸 941x1672。

风格与 AuraCue P0 系列一致：奶油白背景、深海军蓝 serif 标题、粉紫柔光、柔金细线、圆角信息卡。顶部 iOS 状态栏 9:41，左上返回按钮，中间 AuraCue 莲花 logo。

标题：Privacy。副标题表达 birthday and aura history stay private。页面中间有 3 到 4 个隐私说明卡片：Birthday、Personalization、Sharing、Storage。每个卡片左侧有小线性图标，例如锁、生日、星光、设备存储。底部有 Back to My Aura 按钮。

整体清爽、安静、可信任，不要营销感，不要复杂插画。
```

反向提示词：

```text
不要水印，不要乱码，不要品牌拼错，不要暗黑风，不要过度装饰，不要复杂人物插画。
```

---

## P0-15 Terms：条款页

- 路由：`/legal/terms`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/15-terms.png`
- 当前问题：没有 P0-15 APP 参考图。
- 功能完成度：100%
- 视觉完成度：无法严格验收

已可复用：

- `lotus-logo.png`
- `scales.png`

缺失资产：

1. 当前不缺前端必需 icon。
2. 如果要一比一，需要生成或提供 P0-15 Terms APP 参考图。

### P0-15 参考图生成提示词：Terms 页面

用途：生成 UI 参考图，不是作为前端整页实现。

建议文件：

- `P0-15-Terms-使用条款.png`
- 竖版 UI 参考图，`941 x 1672`

正向提示词：

```text
生成一张 AuraCue 移动端 App 使用条款页面参考图，尺寸 941x1672。

风格与 AuraCue P0 系列一致：奶油白背景、深海军蓝 serif 标题、粉紫柔光、柔金细线、圆角信息卡。顶部 iOS 状态栏 9:41，左上返回按钮，中间 AuraCue 莲花 logo。

标题：Terms。副标题表达 AuraCue offers style inspiration and reflective prompts。页面中间有 3 个条款说明卡片：Use、Cards、Saved Aura。每个卡片左侧可以有天平、塔罗卡、小书签等极简线性图标。底部有 Back to My Aura 按钮。

整体像正式但温柔的 App 条款页，清爽、可信、轻奢，不要复杂插画。
```

反向提示词：

```text
不要水印，不要乱码，不要品牌拼错，不要暗黑风，不要密密麻麻的小字，不要法律合同截图感。
```

---

## P0-16 Error：生成失败重试

- 路由：`/error/network`
- 参考图：`docs/UI/小程序/P0-16-Error-生成失败重试.png`
- 当前截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/16-error.png`
- T15 diffRatio：`0.496318`
- 功能完成度：100%
- 视觉完成度：50%

已可复用：

- `tarot-card-back-tilt.png`

缺失资产：

1. `error-dissolving-tarot-card-cloud.png`：错误页中上部溶解塔罗卡主视觉。

### P0-16 提示词：溶解塔罗卡错误页主视觉

建议文件：

- `error-dissolving-tarot-card-cloud.png`
- 透明背景 PNG，`900 x 760`
- 不要文字

正向提示词：

```text
生成一张透明背景 PNG 的错误页主视觉，尺寸 900x760。

画面是一张粉白金色塔罗卡背，略微倾斜，卡片右侧或边缘正在化成细小粉金星尘。背景有非常柔和的粉白云雾和浅薰衣草光晕，整体梦幻、轻柔、不要悲伤沉重。

风格：AuraCue 高级女性向塔罗神谕 App，奶油白、浅粉、柔金、薰衣草紫。无文字，无 logo。
```

反向提示词：

```text
不要文字，不要 logo，不要水印，不要恐怖破碎效果，不要火焰，不要暗黑背景，不要完整 UI 页面。
```

---

## 优先生成顺序

如果一次不能全部生成，建议按下面顺序给我：

1. `share-card-soft-boundary-scene.png`：P0-10 最大 blocker。
2. `home-saturn-planet-hero-card.png`：P0-01 当前视觉差异最大。
3. `result-strength-soft-boundary-banner.png` / `activated-soft-boundary-lion-card.png`：P0-07/P0-09 共享主视觉。
4. `birth-aura-venus-air-orb-large.png`：P0-03/P0-12/P0-13 可复用。
5. `activate-lotus-seal-orb.png`：P0-08。
6. `share-lucky-color-charcoal-navy-medallion.png` 和 `share-guardian-structured-jacket-medallion.png`：P0-07/P0-09/P0-10 共享。
7. `reading-strength-preview-card.png` 和 reading step 徽章：P0-06B。
8. `error-dissolving-tarot-card-cloud.png`：P0-16。
9. P0-11/P0-14/P0-15 参考图：用于补齐严格视觉验收，不直接接入前端。

## 生成后交付给我的建议文件名

核心插画：

- `home-saturn-planet-hero-card.png`
- `birthday-picker-cloud-panel-bg.png`
- `birth-aura-venus-air-orb-large.png`
- `guardian-color-soft-opal-pink-swatch.png`
- `checkin-choice-panel-bg.png`
- `tarot-card-back-reference.png`
- `tarot-pull-stage-glow.png`
- `reading-light-orbit-cloud-bg.png`
- `reading-strength-preview-card.png`
- `result-strength-soft-boundary-banner.png`
- `activate-lotus-seal-orb.png`
- `activated-soft-boundary-lion-card.png`
- `share-card-soft-boundary-scene.png`
- `saved-success-aura-card-thumbnail.png`
- `my-birth-aura-venus-air-medallion.png`
- `my-today-soft-boundary-medallion.png`
- `my-birth-profile-venus-air-card-art.png`
- `error-dissolving-tarot-card-cloud.png`

共享徽章 / 小图标：

- `share-lucky-color-charcoal-navy-medallion.png`
- `share-guardian-structured-jacket-medallion.png`
- `reading-step-birth-aura.png`
- `reading-step-ruling-planet.png`
- `reading-step-chosen-card.png`
- `reading-step-energy-style.png`

缺参考图页面：

- `P0-11-Saved-保存成功反馈.png`
- `P0-14-Privacy-隐私说明.png`
- `P0-15-Terms-使用条款.png`

## 我收到资产后会做什么

收到图片后，我会把真正用于前端的素材放进：

`apps/web/public/aura-assets/`

然后修改：

- `apps/web/components/latest-ui-pages.tsx`
- `apps/web/components/latest-ui.css`
- 必要时补充 `apps/web/tests/visual/run-visual-compare.mjs` 覆盖 P0-06B、P0-11、P0-14、P0-15

每轮会重新跑：

- `pnpm --filter @auracue/web test:pages`
- `pnpm --filter @auracue/web lint`
- `pnpm --filter @auracue/web test:e2e`
- `pnpm --filter @auracue/web test:visual`

重要边界：

不要把整页 UI 截图放进 App 里当页面实现。整页 UI 图只能作为参考图；真正进入前端的应该是插画、徽章、图标、纹理等可组合资产。
