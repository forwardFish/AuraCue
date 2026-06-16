# AuraCue 页面与塔罗仪式设计标准 v3.0

> 文档类型：页面设计 / UX Ritual / Frontend Layout Spec  
> 版本：v3.0  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日塔罗风格神谕**  
> 核心体验：**牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享**  
> 设计目标：高审美、高命中感、高分享欲

---

## 0. 设计结论

当前已有首页视觉方向可以保留：

```text
soft luxury
pastel gradient
editorial card
gentle ritual
feminine but not childish
premium lifestyle
```

但页面链路必须从旧的：

```text
选择 mood → 生成 Aura Card
```

升级为：

```text
Birth Aura
→ Date Aura
→ Mood & Scene
→ Tarot Pull
→ Reading
→ Style Oracle Result
→ Guardian Item
→ Hold to Seal
→ Share Aura Card
```

页面设计目标不是“让用户完成表单”，而是让用户经历一个连续的每日塔罗风格神谕仪式。

---

## 1. 设计总原则

### 1.1 三高体验定义

| 目标 | 用户心里出现的话 | 页面设计要做到 |
|---|---|---|
| 高审美 | 这个页面好美，我想截图 | 大留白、柔光、精致卡片、少文字、高级色彩 |
| 高命中感 | 它怎么知道我今天这样 | 复述用户状态、引用 Birth Aura、Date Aura、塔罗牌和具体单品 |
| 高分享欲 | 这张卡像我，我想发出去 | 9:16 数字护身符、日期、气场名、短句、低隐私风险 |

### 1.2 每页只做一个心理动作

| 页面 | 心理动作 |
|---|---|
| Birth Aura 输入 | 这是我的个人入口 |
| Birth Aura Reveal | 我有长期风格原型 |
| Today Gate | 今天有今天的气场 |
| Mood & Scene | 它看见我今天的状态 |
| Tarot Pull | 这是我亲手抽到的牌 |
| Reading | 它正在解读我 |
| Result | 它说中了，而且我知道怎么穿 |
| Activate | 我把提示穿在身上 |
| Hold to Seal | 我接受并带走今日气场 |
| Share | 这是我的今日身份 |
| Journal | 我的气场正在形成轨迹 |

---

## 2. 全局视觉系统

### 2.1 视觉关键词

```text
Warm Ivory
Blush Pink
Champagne Gold
Deep Navy
Soft Lavender
Pearl White
Thin Serif
Editorial Tarot Card
Soft Glow
Luxury Wellness
```

### 2.2 色彩 Token

```css
:root {
  --bg-page: #FAF7F9;
  --bg-warm-ivory: #F8F1E8;
  --bg-lilac: #F1EAF8;
  --bg-blush: #FCEEF3;
  --bg-peach: #F8E8E0;

  --text-primary: #2F174D;
  --text-secondary: #6F617B;
  --text-muted: #9A8EA5;
  --text-inverse: #FFFFFF;

  --brand-purple-900: #2F174D;
  --brand-purple-700: #6B3BAE;
  --brand-purple-600: #8148C6;
  --brand-pink-500: #ED93BD;
  --brand-peach-400: #F4B7A5;
  --brand-gold: #C9A86A;
  --brand-navy: #101A33;

  --surface-white: rgba(255, 255, 255, 0.72);
  --surface-glass: rgba(255, 255, 255, 0.44);
  --surface-card: rgba(255, 255, 255, 0.28);

  --border-soft: rgba(101, 74, 128, 0.14);
  --border-glass: rgba(255, 255, 255, 0.48);

  --shadow-soft-card:
    0 8px 24px rgba(95, 67, 124, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.34);

  --shadow-selected-card:
    0 12px 30px rgba(137, 89, 199, 0.24),
    0 0 0 3px rgba(218, 190, 255, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);

  --cta-gradient:
    linear-gradient(90deg, #7C3EBB 0%, #C978D5 46%, #F3B3A5 100%);
}
```

### 2.3 页面背景

```css
.aura-page-bg {
  background:
    radial-gradient(circle at 18% 18%, rgba(246, 224, 239, 0.85), transparent 34%),
    radial-gradient(circle at 78% 28%, rgba(235, 219, 250, 0.82), transparent 32%),
    radial-gradient(circle at 76% 78%, rgba(250, 213, 220, 0.72), transparent 34%),
    linear-gradient(180deg, #FAF7F9 0%, #F6F0F8 100%);
}
```

### 2.4 字体

| 用途 | 英文字体建议 | 中文字体建议 |
|---|---|---|
| 大标题 | Playfair Display / Cormorant Garamond | 宋体风标题 / Noto Serif SC |
| 正文 | Inter / SF Pro | Noto Sans SC / PingFang SC |
| 标签 | Inter | PingFang SC |

### 2.5 圆角与阴影

```css
:root {
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-card: 32px;
  --radius-pill: 999px;
}
```

---

## 3. 全局组件

### 3.1 AppShell

```tsx
<AppShell>
  <PageBackground />
  <TopHeader />
  <main>{children}</main>
  <BottomTabBar />
</AppShell>
```

规格：

```css
.app-shell {
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  background: var(--bg-page);
}
```

### 3.2 TopHeader

结构：

```tsx
<TopHeader>
  <ProfileAvatarButton />
  <BrandLogo />
  <GiftButton />
</TopHeader>
```

要求：

- Logo 居中；
- 头像和礼物按钮保留轻品牌感；
- 不要过多功能入口。

### 3.3 Primary CTA

样式：

```css
.primary-cta {
  width: 100%;
  height: 60px;
  border-radius: 999px;
  background: var(--cta-gradient);
  color: white;
  font-family: var(--font-display);
  font-size: 21px;
  box-shadow: 0 12px 28px rgba(154, 89, 191, 0.24);
}
```

主按钮文案应使用：

```text
Reveal
Begin
Activate
Seal
Carry
Share
```

避免使用：

```text
Submit
Generate
Analyze
Calculate
Recommend
```

---

## 4. 页面 P0-00：Create Your Birth Aura

### 4.1 页面目标

让用户相信：

```text
我的生日不是普通资料，而是本命气场钥匙。
```

### 4.2 布局

```text
[TopHeader]

Create Your Birth Aura

Your birthday becomes the key
to how each card speaks to you.

      [ 发光塔罗牌背面 / 圆形光晕 ]

Month        Day
[  10  ]     [  07  ]

[ Reveal My Birth Aura ]

Skip for now
```

### 4.3 中文文案

```text
创建你的本命气场

你的生日会成为每张牌与你对话的方式。

[ 月 ] [ 日 ]

[ 揭示我的本命气场 ]
[ 暂时跳过 ]
```

### 4.4 设计要点

- 输入框要像 ritual selector，不像普通表单；
- 不收年份；
- 不收出生时间、出生地点；
- Skip 要存在，降低阻力；
- 背景保持柔和，不要重玄学。

### 4.5 心理暗示

```text
这是我的个人入口。
```

---

## 5. 页面 P0-01：Birth Aura Reveal

### 5.1 页面目标

让用户获得长期身份标签。

### 5.2 布局

```text
Your Birth Aura is

        Venus Air

Libra · Air · Opal

You carry luck through balance,
beauty, and subtle attraction.

Your first guardian color:
Soft Opal Pink

[ Begin Today’s Ritual ]
```

### 5.3 中文文案

```text
你的本命气场是

        金星风象

天秤 · 风元素 · 欧泊

你的好运来自平衡、美感
和不费力的吸引力。

你的第一个守护色：
柔光欧泊粉

[ 开始今日仪式 ]
```

### 5.4 视觉

- 中间大卡片；
- 背景出现星座符号但不要复杂；
- `auraName` 必须大，像身份头衔；
- `guardianColor` 用色块展示。

### 5.5 心理暗示

```text
我有一个长期风格原型。
同一张牌，会根据我的本命气场说不同的话。
```

---

## 6. 页面 P0-02：Today Gate

### 6.1 页面目标

把“日期”变成每日留存入口。

### 6.2 布局

```text
[TopHeader]

June 13 · Saturday

Today’s Date Aura
Clear Structure

Today asks for structure before expansion.

Birth Aura: Venus Air

[ Activate Today’s Aura ]

Bottom Tab: Today / Journal / Birth Aura
```

### 6.3 中文文案

```text
6月13日 · 星期六

今日日期气场
清晰结构

今天先建立结构，再向外扩张。

本命气场：金星风象

[ 激活今日气场 ]
```

### 6.4 设计要点

- 日期必须是主视觉之一；
- Date Aura 用大卡片；
- 如果当天已 sealed，CTA 改为 `View Today’s Sealed Aura`；
- 不在首页直接堆 mood cards，避免信息过满。

### 6.5 心理暗示

```text
今天有今天自己的气场。
明天会不一样。
```

---

## 7. 页面 P0-03：Mood & Scene Check-in

### 7.1 页面目标

建立“它看见我今天”的命中感。

### 7.2 布局

```text
How are you arriving today?

[ Drained ] [ Soft ]
[ Restless ] [ Hidden ]
[ Focused ] [ Magnetic ]
[ Unbothered ] [ Main Character ]

What is today asking from you?

[ Work / Study ] [ Important Moment ]
[ Stay Low-Key ] [ Just Survive Today ]
[ Need Protection ] [ Want to Be Seen ]
[ Date / Social ] [ Soft Reset ]

[ Continue to Tarot Pull ]
```

### 7.3 中文文案

```text
你今天是以什么状态来到这里？

[ 被消耗 ] [ 柔软敏感 ]
[ 有点烦躁 ] [ 想隐身 ]
[ 想专注 ] [ 想被看见 ]
[ 不想被打扰 ] [ 想成为主角 ]

今天要你面对什么？

[ 工作 / 学习 ] [ 重要时刻 ]
[ 保持低调 ] [ 今天只想撑过去 ]
[ 需要保护 ] [ 想被看见 ]
[ 约会 / 社交 ] [ 想重新调整 ]

[ 进入塔罗抽牌 ]
```

### 7.4 视觉

- 使用胶囊 chip 或小卡片；
- Mood 和 Scene 分成两个 section；
- 选中态要柔和发光；
- 每组最多 8 个。

### 7.5 心理暗示

```text
它不是只看生日，它也看见我今天的状态。
```

---

## 8. 页面 P0-04：Tarot Pull

### 8.1 页面目标

让用户相信：

```text
这是我亲手抽到的今日牌。
```

### 8.2 布局

```text
Choose the card that calls you.

Take a breath.
Today’s card will translate your energy into style.

        [ Card Back ]
 [ Card Back ]    [ Card Back ]

Trust your first pull.
```

### 8.3 中文文案

```text
选择那张正在呼唤你的牌。

深呼吸。
今日牌面会把你的状态翻译成风格。

        [ 牌背 ]
 [ 牌背 ]      [ 牌背 ]

相信第一眼。
```

### 8.4 抽牌交互

1. 进入页后三张牌缓慢浮动；
2. 用户点击一张；
3. 被选中牌轻微放大；
4. 其他两张淡出；
5. 被选牌停留 0.6–0.8 秒；
6. 牌翻转；
7. 显示：

```text
Today’s Card
Strength
Soft Boundary
```

8. 自动进入 Reading。

### 8.5 视觉规格

- 牌背必须高级，使用粉紫/象牙白/金色细线；
- 不要显示复杂传统塔罗图案；
- 牌背可有月亮、星星、莲花、细线边框；
- 卡片比例建议 2:3；
- 翻牌动效 1.2–1.5 秒。

### 8.6 禁止

不要出现：

```text
Generate
AI Loading
Calculate
Pick Random
```

### 8.7 心理暗示

```text
这是我选中的，不是系统塞给我的。
```

---

## 9. 页面 P0-05：Reading Your Aura

### 9.1 页面目标

把 loading 改成“神谕正在形成”。

### 9.2 布局

```text
        [ Revealed Tarot Card ]

Strength
Soft Boundary

Reading your Birth Aura...
Aligning with today’s date signal...
Listening to your card...
Translating energy into style...
```

### 9.3 中文文案

```text
        [ 已翻开的塔罗牌 ]

力量
柔软边界

正在读取你的本命气场……
正在对齐今日日期信号……
正在聆听你的牌面……
正在把能量翻译成风格……
```

### 9.4 动效

- 文字逐行出现；
- 每行间隔 400–600ms；
- 总时长 1.5–3 秒；
- 卡片有柔光扩散；
- 不要 loading bar。

### 9.5 心理暗示

```text
它正在把我的生日、今天日期、状态和牌面合起来解读。
```

---

## 10. 页面 P0-06：Today’s Style Oracle Result

### 10.1 页面目标

输出高命中感结果。

### 10.2 信息顺序

```text
1. 日期与 Date Aura
2. Birth Aura chip
3. 今日牌面
4. Aura Name
5. Luck Shift
6. 今日提示
7. Lucky Color
8. Guardian Item
9. Style Formula
10. Avoid Today
11. Activation Phrase
12. Activation Action
13. CTA: Activate Today’s Aura
14. Save / Share
```

### 10.3 布局

```text
June 13 Style Oracle

Date Aura: Clear Structure
Birth Aura: Venus Air
Today’s Card: Strength

        Strength
        Soft Boundary

Luck Shift
Drained → Protected

Your Message
You arrived today feeling drained.
Because your Birth Aura carries Venus Air,
this card is not asking you to push harder.
It is asking you to protect your softness with structure.

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Style Formula
Soft layer + clean outer shape + silver detail

Avoid Today
Anything too loud, exposed, or emotionally demanding.

Activation Phrase
I can stay soft without being available to everyone.

Activation Action
Adjust your sleeve before entering a room.

[ Activate Today’s Aura ]
[ Save Card ] [ Share Story ]
```

### 10.4 中文布局

```text
6月13日风格神谕

日期气场：清晰结构
本命气场：金星风象
今日牌面：力量

        力量
        柔软边界

今日气运转向
被消耗 → 被保护

今日提示
你今天带着一点被消耗的状态来到这里。
因为你的本命气场带着金星风象，
这张牌不是要你更用力，
而是提醒你用结构感保护自己的柔软。

今日幸运色
炭灰海军蓝

今日守护单品
结构感外套

今日穿搭公式
柔软内搭 + 清晰外轮廓 + 银色细节

今日避免
过度吵闹、暴露、或让你感到被消耗的搭配。

出门暗示
我可以保持柔软，但不必对所有人开放。

今日动作
进门前整理一下袖口。

[ 激活今日气场 ]
[ 保存卡片 ] [ 分享 Story ]
```

### 10.5 视觉结构

上半屏：

```text
命中感 + 神谕感
```

下半屏：

```text
穿搭落地 + 行动感
```

### 10.6 卡片模块

#### Luck Shift Card

- 使用 pill 或小卡片；
- 左边当前状态，右边目标状态；
- 箭头居中；
- 文案大而短。

#### Guardian Item Card

- 展示单品名；
- 展示一句象征意义；
- 可以有小插画或 icon。

#### Activation Phrase

- 使用引号；
- 放在接近 CTA 的位置；
- 适合用户记住和分享。

### 10.7 心理暗示

```text
它说中了，而且我知道今天具体怎么穿。
```

---

## 11. 页面 P0-07：Activate Today’s Aura

### 11.1 页面目标

把结果变成现实中的“数字护身符”。

### 11.2 布局

```text
Your Guardian Item Today

Structured Jacket

It is not here to make you harder.
It helps you protect your softness.

Lucky Color
Charcoal Navy

Activation Action
Adjust your sleeve before entering a room.

Place one finger here.
Hold to seal today’s aura.

        [ Hold Circle ]
```

### 11.3 中文布局

```text
你的今日守护单品

结构感外套

它不是让你变得强硬，
而是帮你保护自己的柔软。

今日幸运色
炭灰海军蓝

今日动作
进门前整理一下袖口。

把手指停在这里。
长按封印今日气场。

        [ 长按圆形按钮 ]
```

### 11.4 交互

- 用户长按 3000ms；
- 圆环进度从 0 到 100%；
- 松手不足 3000ms，圆环回到 0；
- 成功后轻震；
- 背景卡片微光增强；
- 跳转 `/activated/[id]`。

### 11.5 心理暗示

```text
我接受并带走了今天的气场。
```

---

## 12. 页面 P0-08：Aura Activated

### 12.1 页面目标

完成仪式闭环。

### 12.2 布局

```text
Aura Sealed

June 13 aura is active.
Carry Soft Boundary with you.

Lucky Color: Charcoal Navy
Guardian Item: Structured Jacket

Private. Personal. Just for you.

[ Share Story ]
[ Save Card ]
[ Done ]
```

### 12.3 中文布局

```text
气场已封印

6月13日气场已激活。
带着「柔软边界」出门吧。

幸运色：炭灰海军蓝
守护单品：结构感外套

私密的，个人的，只属于你今天。

[ 分享 Story ]
[ 保存卡片 ]
[ 完成 ]
```

### 12.4 视觉

- 使用一张已封印的小卡；
- 可有 stamp / seal 视觉；
- `Aura Sealed` 要清晰；
- CTA 优先分享，其次保存。

### 12.5 心理暗示

```text
我的今日气场已被确认。
```

---

## 13. 页面 P0-09：Share Aura Card

### 13.1 页面目标

形成传播。

### 13.2 分享卡比例

```text
9:16 Story：1080 x 1920，P0 必须
4:5 Feed：P1
1:1 Square：P1
```

### 13.3 分享卡内容

```text
June 13, 2026

Today’s Aura
Soft Boundary

Date Aura: Clear Structure
Birth Aura: Venus Air
Card: Strength

Luck Shift
Drained → Protected

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

“I can stay soft without being available to everyone.”

Sealed by AuraCue
Draw yours on AuraCue
```

### 13.4 中文分享卡

```text
2026年6月13日

今日气场
柔软边界

日期气场：清晰结构
本命气场：金星风象
今日牌面：力量

气运转向
被消耗 → 被保护

幸运色
炭灰海军蓝

守护单品
结构感外套

“我可以保持柔软，但不必对所有人开放。”

Sealed by AuraCue
来抽你的今日风格神谕
```

### 13.5 视觉

- 像一张高级 oracle card；
- 不像报告截图；
- 日期要明显；
- 中间牌面最大；
- 信息控制在 7–9 行；
- 使用水印但不要太广告。

### 13.6 分享按钮

```text
Save Image
Share Story
Copy Link
```

### 13.7 心理暗示

```text
这是我的今日身份。
别人看到会想问：你在哪抽的？
```

---

## 14. 页面 P0-10：Saved

### 14.1 布局

```text
Saved to your AuraCue

You can come back to today’s aura anytime.

[ Share Story ]
[ Back to Today ]
```

### 14.2 中文

```text
已保存到你的 AuraCue

你可以随时回看今天的气场。

[ 分享 Story ]
[ 回到今日 ]
```

### 14.3 心理暗示

```text
今天的气场成为我的个人记录。
```

---

## 15. 页面 P0-11：Aura Journal Lite

### 15.1 页面目标

让每日卡片成为长期资产。

### 15.2 布局

```text
Aura Journal

This Week

June 13
Soft Boundary
Strength · Charcoal Navy · Structured Jacket
Sealed

June 12
Clean Renewal
The Star · Pearl White · White Shirt
Sealed
```

### 15.3 中文

```text
气场日记

本周

6月13日
柔软边界
力量 · 炭灰海军蓝 · 结构感外套
已封印

6月12日
清透恢复
星星 · 珍珠白 · 白衬衫
已封印
```

### 15.4 心理暗示

```text
我的气场正在形成轨迹。
```

---

## 16. 页面 P0-12：Birth Aura Profile

### 16.1 布局

```text
Birth Aura

Venus Air
Libra · Air · Opal

Guardian Color
Soft Opal Pink

Style Origin
Soft Balance

Style Mantra
I attract through balance, not effort.

[ Edit Birthday ]
```

### 16.2 中文

```text
本命气场

金星风象
天秤 · 风元素 · 欧泊

本命守护色
柔光欧泊粉

风格原点
柔和的平衡感

本命风格句
我的吸引力来自平衡，而不是用力。

[ 修改生日 ]
```

### 16.3 心理暗示

```text
这是我的长期身份标签。
```

---

## 17. P1 页面建议

### 17.1 Evening Reflection

文案：

```text
Did today’s aura show up?

[ Yes, surprisingly ]
[ A little ]
[ Not today ]

What moment felt aligned?
```

中文：

```text
今天的气场显现了吗？

[ 有点准 ]
[ 有一点 ]
[ 今天没有 ]

今天哪个瞬间和牌面有点对上？
```

### 17.2 Clarifier Card

文案：

```text
Pull a Clarifier Card

The clarifier does not replace today’s card.
It reveals how to carry it.
```

中文：

```text
抽一张补充牌

补充牌不会替代今日牌面，
它只是告诉你如何承载它。
```

---

## 18. 高审美验收清单

- 页面像高级 lifestyle / beauty / wellness 产品；
- 不像传统算命网站；
- 不像 AI 工具 dashboard；
- 每页只有一个主动作；
- 视觉元素克制，少粒子，少闪烁；
- 卡片有收藏价值；
- 分享卡可以直接发 Story；
- 字体、留白、圆角、阴影统一；
- 移动端 360–430px 正常。

---

## 19. 高命中感验收清单

结果页必须包含：

- 用户今日状态；
- 今日场景；
- 本命气场；
- 日期气场；
- 今日牌面；
- Luck Shift；
- 具体幸运色；
- 具体守护单品；
- 具体穿搭公式；
- 具体今日动作；
- 一句可以记住的 Activation Phrase。

禁止泛泛而谈。

---

## 20. 高分享欲验收清单

分享卡必须满足：

- 9:16；
- 一眼好看；
- 不暴露隐私；
- 有日期；
- 有 Aura Name；
- 有 Luck Shift；
- 有 Guardian Item；
- 有一句短句；
- 有轻 CTA；
- 别人看到会想抽自己的。

---

## 21. 最终页面体验原则

```text
先让用户进入今天，
再让用户确认自己，
再让用户亲手抽牌，
再让用户被说中，
再让用户知道怎么穿，
再让用户封印带走，
最后让用户愿意分享。
```

一句话：

```text
美到想保存，准到想回来，酷到想分享。
```
