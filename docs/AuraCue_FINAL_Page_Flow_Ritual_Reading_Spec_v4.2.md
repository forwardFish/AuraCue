# AuraCue FINAL Page Flow + Ritual Design Spec v4.2

> 文档类型：最终页面设计文档 / Page Layout + UX Flow + API Calling Flow  
> 版本：v4.2 FINAL  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**今日守护星 → 本命气场 → 今日状态 / 场景 → 今日单牌阵 → 牌位确认 → 分层解读 → 心理转向 → 幸运色 → 守护单品 → 穿搭公式 → 封印 → 分享**  
> 底部导航：**Home / My**  
> 本次 v4.2 修正重点：在 v4.1 的 Today’s Ruling Planet 与结果页精简基础上，新增 **Daily One-Card Spread / 今日单牌阵**、**Card Position / 牌位确认**、**Reading Ritual / 分层解读仪式** 与 **Style Translation / 穿搭转译桥梁**，解决牌阵感不足、Reading 像 loading、牌义到穿搭跳跃、时间流不明显的问题。

---

## 0. 页面设计最终结论

当前已有视觉方向继续保留：

```text
soft luxury
pastel gradient
editorial card
gentle ritual
feminine but not childish
premium lifestyle
```

全产品沿用：浅奶油白 + 粉紫柔光背景、serif 大标题、玻璃胶囊、横向大卡片、紫粉桃渐变 CTA、柔光塔罗卡片。

但页面信息结构必须更新：

```text
不要展示：Date Aura: Clear Structure / 日期气场：清晰结构
改成展示：Today’s Ruling Planet: Saturn / 今日守护星：Saturn 土星
```

P0-07 结果页必须从“字段完整的 AI 报告”改成：

```text
一张说中用户今天状态的神谕卡
+ 一个明确的今日穿搭决定
```

---

### 0.1 v4.2 核心新增：Daily One-Card Reading Layer

P0 不增加三牌阵、十字排阵或完整 78 张传统塔罗。P0 继续保持轻量，但必须让用户明确感受到：

```text
我不是只点了一张随机卡。
我打开了一个今日单牌阵。
这张牌落在“今日核心能量”的位置。
系统正在按顺序解读我的状态、牌义、今日守护星、本命气场和穿搭转译。
```

因此，v4.2 在原有流程中新增一层 **Daily One-Card Reading / 今日单牌解读**：

```text
Mood / Scene Check-in
→ Tarot Pull
→ Card Position Confirmation
→ Reading Ritual Reveal
→ Today’s Style Oracle Result
```

### 0.2 v4.2 必须修复的 5 个体验缺口

| 缺口 | v4.2 修复方式 |
|---|---|
| 牌阵感不够 | 在抽牌后明确展示 `Daily One-Card Spread` 与 `Card Position: Today’s Core Energy` |
| 解读过程不够 | P0-06 从 loading 改为可参与的分层解读仪式，用户逐步打开每一层解读 |
| 牌义解释不够 | 增加 `Card Meaning Bridge`：牌面核心能量 → 用户状态 → 今日守护星 → 本命气场 → 心理转向 → 穿搭转译 |
| 时间流不够明显 | 结果页按 `进入状态 → 牌面回应 → 今日转向 → 穿出去 → 封印` 的时间顺序组织 |
| 结果页像字段卡 | P0-07 改为 `Unfolded One-Card Reading`，字段服务于解读，不做报告式堆叠 |

### 0.3 v4.2 体验原则

```text
抽牌不是结束，抽牌只是进入解读。
Reading 不是等待，Reading 是用户参与解读的仪式。
结果页不是报告，结果页是已经展开的今日单牌阵。
穿搭不是推荐，穿搭是牌义落到现实的方式。
```

---

## 1. 全局信息架构

### 1.1 底部导航

P0 底部只保留两个 Tab：

```text
Home     My
```

| Tab | Route | 职责 |
|---|---|---|
| Home | `/home` 或 `/` | App 主入口、今日守护星、今日抽牌 CTA、今日已封印气场、继续未完成仪式 |
| My | `/my` | 本命气场、生日设置、气场记录、已保存卡、设置、Legal、P1 登录入口 |

P0 不做独立 Journal Tab。历史气场卡放入 My 页面中的 `Aura History / My Aura Cards`。

---

### 1.2 P0 页面清单

| 编号 | 页面 | Route | 作用 |
|---|---|---|---|
| P0-00 | Bootstrap | `/` | 创建 anonymous identity，读取 Home 状态，跳转 `/home` |
| P0-01 | Home | `/home` | App 主入口，状态化展示今日守护星与今日气场 |
| P0-02 | Create Birth Aura | `/onboarding/birth-aura` | 输入生日月 / 日，生成本命气场 |
| P0-03 | Birth Aura Reveal | `/onboarding/birth-aura/reveal` | 揭示长期本命气场身份 |
| P0-04 | Mood & Scene Check-in | `/today/check-in` | 选择今日状态和今日场景 |
| P0-05 | Tarot Pull | `/today/draw` | 三张塔罗背面牌，用户亲手抽一张 |
| P0-06 | Daily One-Card Reading | `/today/reading` | 打开今日单牌阵，分层揭示牌位、牌义、个人信号、心理转向与穿搭转译 |
| P0-07 | Today’s Style Oracle Result | `/result/[id]` | 今日塔罗风格神谕结果页 |
| P0-08 | Activate / Hold to Seal | `/activate/[id]` | 确认守护单品，长按封印 |
| P0-09 | Aura Activated | `/activated/[id]` | 封印成功页 |
| P0-10 | Share Aura Card | `/share/[id]` | 9:16 分享卡预览和分享 |
| P0-11 | Saved | `/saved/[id]` | 保存成功反馈 |
| P0-12 | My | `/my` | 我的气场、本命气场、历史记录、设置 |
| P0-13 | Birth Aura Profile | `/my/birth-aura` | 查看 / 修改生日与本命气场 |
| P0-14 | Legal Privacy | `/legal/privacy` | 隐私政策 |
| P0-15 | Legal Terms | `/legal/terms` | 服务条款 |
| P0-16 | Error / Not Found | `/404` / Error Boundary | 错误兜底 |

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
Wearable Luck
```

---

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

---

### 2.3 背景

```css
.aura-page-bg {
  background:
    radial-gradient(circle at 18% 18%, rgba(246, 224, 239, 0.85), transparent 34%),
    radial-gradient(circle at 78% 28%, rgba(235, 219, 250, 0.82), transparent 32%),
    radial-gradient(circle at 76% 78%, rgba(250, 213, 220, 0.72), transparent 34%),
    linear-gradient(180deg, #FAF7F9 0%, #F6F0F8 100%);
}
```

---

### 2.4 字体

| 用途 | 英文字体建议 | 中文字体建议 |
|---|---|---|
| Hero / 神谕标题 | Playfair Display / Cormorant Garamond / Georgia | Noto Serif SC / 思源宋体 |
| 正文 | Inter / SF Pro | PingFang SC / Noto Sans SC |
| 标签 | Inter | PingFang SC |

---

### 2.5 布局基准

```text
设计基准：390 × 844
最大宽度：430px
最小宽度：360px
左右边距：20px
底部 Tab 高度：82–88px
主 CTA 高度：60px
卡片圆角：24–32px
页面主卡圆角：32px
```

---

## 3. 全局组件

### 3.1 AppShell

```tsx
<AppShell>
  <PageBackground />
  <TopHeader />
  <main>{children}</main>
  <BottomTabBar tabs={["Home", "My"]} />
</AppShell>
```

要求：

- 全部主页面统一 AppShell；
- 最大宽度 430px；
- 背景统一；
- 每页最多一个主 CTA；
- 避免 dashboard；
- 页面只完成一个心理动作。

---

### 3.2 TopHeader

结构：

```text
[Avatar / My]      [AURACUE]      [Gift / P1 Pro Placeholder]
```

P0 右上 Gift 可保留视觉，但功能不进入真实 Paywall。

---

### 3.3 BottomTabBar

```text
Home        My
```

规则：

- Home icon：小星 / 房子 / 日光；
- My icon：头像 / 月亮 / 人像；
- P0 不显示 Journal；
- My 内部展示 Aura History。

---

### 3.4 RulingPlanetCard

替代旧的 DateAuraCard。

显示今日守护星与今日主题。

示例：

```text
Jun 13 · Saturday
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability
```

中文：

```text
6月13日 · 星期六
今日守护星
Saturn 土星
结构 · 边界 · 稳定
```

组件字段：

```ts
RulingPlanetCardProps = {
  displayDate: string;
  planetName: string;
  planetNameCn?: string;
  keywords: string[];
  keywordsCn?: string[];
  themeTitle?: string;
  themeMessage?: string;
  mode: "home" | "result" | "share";
}
```

设计规则：

- Home 中用大卡展示；
- Result 中用精简模块展示；
- Share 中只展示 planet + keywords；
- 不使用 “Date Aura: Clear Structure” 文案。

---

### 3.5 BirthAuraChip

```text
Venus Air
Moon Water
Solar Fire
```

用于 Home、Result、Share、My。

---

### 3.6 PrimaryCTA

按钮文案必须使用仪式语言：

```text
Start My First Aura
Create Birth Aura
Reveal My Birth Aura
Begin Today’s Ritual
Activate Today’s Aura
Choose the Card
Hold to Seal
Share Story
```

避免：

```text
Submit
Generate
Analyze
Calculate
Recommend
```

---

### 3.7 SpreadPositionCard

用于 P0-05 抽牌后和 P0-06 Reading 顶部，负责建立“牌阵感”。

```text
Daily One-Card Spread
Card Position
Today’s Core Energy

This card answers:
What energy should I carry today?
```

中文：

```text
今日单牌阵
牌位
今日核心能量

这张牌回答的是：
我今天应该带着什么能量出门？
```

组件字段：

```ts
SpreadPositionCardProps = {
  spreadType: "daily_one_card";
  spreadTitle: string;              // Daily One-Card Spread
  positionName: string;             // Today’s Core Energy
  positionNameCn?: string;          // 今日核心能量
  question: string;                 // What energy should I carry today?
  questionCn?: string;              // 我今天应该带着什么能量出门？
  tarotCardName?: string;           // Strength
  tarotAuraName?: string;           // Soft Boundary
  mode: "draw" | "reading" | "result";
};
```

设计规则：

- 必须出现在用户选牌之后；
- 不要让用户感觉“牌只是结果字段”；
- `Today’s Core Energy` 是 P0 唯一固定牌位；
- P0 不展示复杂牌阵图，不引入十字排阵。

---

### 3.8 ReadingStepCard

用于 P0-06 分层解读，让 Reading 从 loading 变成仪式。

```text
Step 1 / What you brought in
Step 2 / What the card reveals
Step 3 / Why this card found you today
Step 4 / What shifts now
Step 5 / How to wear it
```

中文：

```text
第一层 / 你今天带来的状态
第二层 / 这张牌看见了什么
第三层 / 为什么今天是这张牌
第四层 / 今天正在发生的转向
第五层 / 如何把它穿在身上
```

组件字段：

```ts
ReadingStepCardProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  titleCn?: string;
  body: string;
  bodyCn?: string;
  isRevealed: boolean;
  revealLabel: string;              // Reveal next layer
  revealLabelCn?: string;           // 打开下一层解读
};
```

交互规则：

- 每一步默认折叠或半透明；
- 用户点击 / 轻触后展开下一层；
- 已展开步骤保留在页面上，形成“解读展开”的时间流；
- 提供 `Reveal all` 作为轻量跳过，但默认文案仍强调仪式。

---

### 3.9 ReadingRitualProgress

用于展示解读进度，不做机械 loading。

```text
Opening the spread 1/5
Listening to the card 2/5
Reading your Birth Aura 3/5
Aligning with Saturn 4/5
Translating into style 5/5
```

中文：

```text
正在打开牌阵 1/5
正在聆听牌面 2/5
正在读取本命气场 3/5
正在对齐土星能量 4/5
正在翻译成今日穿搭 5/5
```

规则：

- 进度是仪式语言，不是技术状态；
- 允许与后端生成 job 同步，但用户看到的是解读层级；
- 如果后端提前完成，仍保留最短仪式展开；
- 如果后端超时，使用 Mock / fallback readingFrame 保证流程完整。

---

## 4. 页面调用总流程

### 4.1 首次用户流程

```text
/ bootstrap
→ /home
→ Start My First Aura
→ /onboarding/birth-aura
→ /onboarding/birth-aura/reveal
→ /today/check-in
→ /today/draw
→ /today/reading
→ /result/[id]
→ /activate/[id]
→ /activated/[id]
→ /share/[id] 或 /my
```

### 4.2 回访用户：今日未抽卡

```text
/ → /home
Home 显示 Ready to Draw
点击 Activate Today’s Aura
→ /today/check-in
```

### 4.3 回访用户：今日已生成未封印

```text
/ → /home
Home 显示 Today’s Oracle is waiting to be sealed
点击 Seal Today’s Aura
→ /activate/[id]
```

### 4.4 回访用户：今日已封印

```text
/ → /home
Home 显示 Today’s Aura Sealed
可 View Today’s Card / Share Story
不可主重抽
```

### 4.5 新日期

本地时间 00:00 后：

```text
旧 oracle 进入 My > Aura History
Home 显示新的 Ruling Planet
CTA 变为 Activate Today’s Aura
```

---

## 5. P0-00 Bootstrap

### Route

```text
/
```

### 页面目标

创建或读取 anonymous identity，并跳转到 `/home`。

### 页面调用

```text
POST /api/v1/identity/anonymous
GET /api/v1/home/today
```

### 布局

```text
[AuraCue Logo]
Opening today’s aura...
```

中文：

```text
正在开启今天的气场……
```

---

## 6. P0-01 Home

### Route

```text
/home
```

### 页面目标

Home 是完整 App 的主入口，不叫 Today。页面内部可以大量使用 Today 语言。

Home 负责：

- 展示今日守护星；
- 展示今日主题；
- 展示 Birth Aura chip；
- 引导首次用户；
- 引导创建 Birth Aura；
- 进入今日抽卡；
- 继续未完成仪式；
- 展示今日已封印卡；
- 分享今日卡。

### API 调用

```text
GET /api/v1/home/today
```

---

### Home State Matrix

| 状态 | 条件 | Home 显示 | 主 CTA |
|---|---|---|---|
| First Open | 无 anonymousId 或首次访问 | 品牌介绍 + 今日守护星预览 | Start My First Aura |
| No Birth Aura | 有 guest，但无 Birth Aura | 今日守护星 + Birth Aura Required Card | Create Birth Aura |
| Ready to Draw | 有 Birth Aura，今日未开始 | 今日守护星 + Birth Aura chip + 未翻开的今日卡 | Activate Today’s Aura |
| Check-in Started | 已选 mood / scene，未抽牌 | 今日仪式进度卡 | Continue Ritual |
| Card Selected / Reading Not Opened | 已选牌但未打开解读 | 今日牌面 + 牌阵位置 | Continue Reading |
| Reading Started / Generating | 已打开 Reading 或生成中 | 解读进度 / 已展开层级 | Continue Reading |
| Generated Not Sealed | 结果已生成未封印 | 今日神谕摘要 + 守护单品 | Seal Today’s Aura |
| Sealed Today | 今日已封印 | 今日气场卡摘要 + 幸运色 + 守护单品 | View Today’s Card / Share Story |
| New Day | 本地日期变化 | 新今日守护星 + 昨日进入 Aura History | Activate Today’s Aura |

---

### First Open Home 布局

```text
[TopHeader]

AuraCue
Your Daily Tarot Style Oracle

Jun 13 · Saturday
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability

Draw one card, activate today’s aura,
and wear your luck.

[ ✦ Start My First Aura ✦ ]
```

中文：

```text
AuraCue
年轻人的每日塔罗风格神谕

6月13日 · 星期六
今日守护星
Saturn 土星
结构 · 边界 · 稳定

抽一张牌，激活今日气场，
把好运状态穿在身上。

[ ✦ 开启我的第一张气场牌 ✦ ]
```

CTA 点击规则：

- 无 Birth Aura → `/onboarding/birth-aura`；
- 有 Birth Aura → `/today/check-in`。

---

### No Birth Aura Home 布局

```text
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability

Create your Birth Aura first.
Your birthday becomes the key to how each card speaks to you.

[ ✦ Create Birth Aura ✦ ]
```

---

### Ready to Draw Home 布局

```text
[Birth Aura Chip: Venus Air]

Jun 13 · Saturday
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability

[ 未翻开的今日塔罗牌 ]

[ ✦ Activate Today’s Aura ✦ ]
```

---

### Generated Not Sealed Home 布局

```text
Jun 13 · Saturday

Today’s Oracle is waiting to be sealed.

Strength — Soft Boundary
Luck Shift: Drained → Protected
Guardian Item: Structured Jacket

[ ✦ Seal Today’s Aura ✦ ]
[ View Full Oracle ]
```

---

### Sealed Today Home 布局

```text
Today’s Aura Sealed

Soft Boundary is active for today.

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

[ View Today’s Card ]
[ Share Story ]
```

规则：封印后不显示“再抽一次”。

---

## 7. P0-02 Create Birth Aura

### Route

```text
/onboarding/birth-aura
```

### 页面目标

让用户输入生日，建立“这是我的”的个人入口。

### API 调用

```text
POST /api/v1/birth-aura
```

### 布局

```text
[TopHeader / Logo only]

Create Your
Birth Aura

Your birthday becomes the key
to how each card speaks to you.

[ 发光塔罗牌背面 / 星座圆盘 ]

Month        Day
[  08  ]     [  21  ]

[ ✦ Reveal My Birth Aura ✦ ]

Maybe later
```

中文：

```text
创建你的
本命气场

你的生日会成为每张牌
与你对话的方式。

月        日
[ 08 ]   [ 21 ]

[ ✦ 揭示我的本命气场 ✦ ]

稍后再说
```

### 规则

- P0 生日是抽卡前必填；
- `Maybe later` 只能返回 Home，不能进入抽卡；
- 不显示 `Skip for now` 进入流程；
- 不收年份、出生时间、出生地点。

---

## 8. P0-03 Birth Aura Reveal

### Route

```text
/onboarding/birth-aura/reveal
```

### 页面目标

让用户获得长期身份标签。

### API 调用

```text
GET /api/v1/my/summary 或 POST /api/v1/birth-aura response
```

### 布局

```text
Your Birth Aura is

Venus Air

Libra · Air · Opal

You carry luck through balance,
beauty, and subtle attraction.

Your first guardian color:
Soft Opal Pink

[ ✦ Begin Today’s Ritual ✦ ]
```

中文：

```text
你的本命气场是

金星风象

天秤 · 风元素 · 欧泊

你的好运来自平衡、美感
和不费力的吸引力。

你的第一个守护色：
柔光欧泊粉

[ ✦ 开始今日仪式 ✦ ]
```

### CTA 跳转

```text
/today/check-in
```

---

## 9. P0-04 Mood & Scene Check-in

### Route

```text
/today/check-in
```

### 页面目标

让用户感觉“它看见我今天的状态”和“它知道我今天要面对什么”。

### API 调用

```text
GET /api/v1/home/today
POST /api/v1/daily-check-in
```

### 布局

```text
[Ruling Planet Chip: Jun 13 · Saturn]
[Birth Aura Chip: Venus Air]

How are you arriving today?

[ Drained ] [ Soft ] [ Restless ]
[ Hidden ] [ Focused ] [ Magnetic ]
[ Unbothered ] [ Main Character ]

What is today asking from you?

[ Work / Study ] [ Important Moment ]
[ Stay Low-Key ] [ Just Survive Today ]
[ Need Protection ] [ Want to Be Seen ]
[ Social ] [ Soft Reset ]

[ ✦ Continue to Your Card ✦ ]
```

中文：

```text
你今天是以什么状态来到这里？

[ 被消耗 ] [ 柔软敏感 ] [ 有点烦躁 ]
[ 想隐身 ] [ 想专注 ] [ 想被看见 ]
[ 不想被打扰 ] [ 想成为主角 ]

今天要你面对什么？

[ 工作 / 学习 ] [ 重要时刻 ]
[ 保持低调 ] [ 今天只想撑过去 ]
[ 需要保护 ] [ 想被看见 ]
[ 社交 ] [ 想重新调整 ]
```

### 交互规则

- Mood 必选；
- Scene 必选；
- 默认不允许跳过；
- 选中卡片有柔光边框；
- 提交后进入 `/today/draw`。

---

## 10. P0-05 Tarot Pull

### Route

```text
/today/draw
```

### 页面目标

让用户相信“这是我亲手抽到的牌”。

### API 调用

```text
POST /api/v1/draw-sessions/start
POST /api/v1/draw-sessions/{drawSessionId}/select
```

### 布局

```text
Choose the card that calls you.

Take a breath.
Today’s card will translate your energy into style.

[ Card Back ]   [ Card Back ]   [ Card Back ]

Trust your first pull.
```

中文：

```text
选择那张正在呼唤你的牌。

深呼吸。
今日牌面会把你的状态翻译成风格。

[ 牌背 ]   [ 牌背 ]   [ 牌背 ]

相信第一眼。
```

### 交互

1. 三张牌轻微浮动；
2. 用户点击一张；
3. 选中牌放大；
4. 其他两张淡出；
5. 牌面翻转；
6. 显示今日牌面：

```text
Today’s Card
Strength
Soft Boundary
```

7. 紧接着显示牌阵位置，不自动跳走：

```text
Daily One-Card Spread
Card Position
Today’s Core Energy

This card answers:
What energy should I carry today?
```

中文：

```text
今日单牌阵
牌位
今日核心能量

这张牌回答的是：
我今天应该带着什么能量出门？
```

8. 用户点击 CTA 进入 `/today/reading`：

```text
[ ✦ Open My Reading ✦ ]
```

中文：

```text
[ ✦ 打开我的今日解读 ✦ ]
```

规则：

- 不再 1 秒后自动跳转；
- 用户必须亲手打开解读，增强参与感；
- 选牌后的牌位确认必须保存为 reading ritual 的第一步；
- 如果用户返回 Home，Home 状态为 `Card Selected / Reading Not Opened`，CTA 显示 `Continue Reading`。

---

## 11. P0-06 Daily One-Card Reading

### Route

```text
/today/reading
```

### 页面目标

P0-06 不再是普通 loading，也不只是“系统生成中”。

P0-06 是用户亲手打开今日单牌阵后的 **Reading Ritual / 解读仪式页**。它要让用户感到：

```text
这张牌不是随机结果。
它落在“今日核心能量”的牌位上。
系统正在按顺序读取我的状态、牌义、本命气场、今日守护星，并把它翻译成今天能穿出去的提示。
```

### API 调用

```text
POST /api/v1/oracles/generate
GET /api/v1/generation-jobs/{jobId}
GET /api/v1/oracles/{oracleId}/reading-frame
```

说明：

- 进入页面时立即启动生成；
- 前端按 ReadingStepCard 展示仪式层级；
- `readingFrame` 可以来自 AI Provider，也必须有 Mock / fallback；
- 即使生成很快，也要保留最短解读仪式；
- 如果生成超过 5 秒，继续展示已揭示的 reading steps，并显示柔和等待文案。

---

### 11.1 英文布局结构

```text
[翻开的牌居中]
Strength
Soft Boundary

Daily One-Card Spread
Card Position
Today’s Core Energy

This card answers:
What energy should I carry today?

[Reading Progress: 1 / 5]

Layer 1
What you brought in
You arrived feeling drained, with work / study asking for your focus.

[ ✦ Reveal the card’s message ✦ ]

Layer 2
What the card reveals
Strength appears when softness needs a clearer shape.
It is not about becoming harder.

[ ✦ Reveal why it found me ✦ ]

Layer 3
Why this card found you today
Your Venus Air wants harmony, but Saturn brings structure, boundaries, and stability.

[ ✦ Reveal today’s shift ✦ ]

Layer 4
What shifts now
Drained → Protected

[ ✦ Reveal my style cue ✦ ]

Layer 5
How to wear it
Charcoal Navy · Structured Jacket · Silver detail

[ ✦ See My Style Oracle ✦ ]
```

---

### 11.2 中文布局结构

```text
[翻开的牌居中]
力量
柔软边界

今日单牌阵
牌位
今日核心能量

这张牌回答的是：
我今天应该带着什么能量出门？

[解读进度：1 / 5]

第一层
你今天带来的状态
你今天带着被消耗的感觉来到这里，而工作 / 学习正在要求你保持专注。

[ ✦ 打开牌面的信息 ✦ ]

第二层
这张牌看见了什么
力量牌出现时，通常不是要你更用力，
而是提醒柔软也需要一个清晰的形状。

[ ✦ 打开它为什么找到我 ✦ ]

第三层
为什么今天是这张牌
你的金星风象习惯维持和谐，
而今天的土星带来结构、边界和稳定。

[ ✦ 打开今日转向 ✦ ]

第四层
今天正在发生的转向
被消耗 → 被保护

[ ✦ 打开我的穿搭提示 ✦ ]

第五层
如何把它穿在身上
炭灰海军蓝 · 结构感外套 · 银色细节

[ ✦ 查看我的风格神谕 ✦ ]
```

---

### 11.3 Reading Layer 定义

| Layer | 英文标题 | 中文标题 | 必须引用 | 用户感受 |
|---|---|---|---|---|
| 1 | What you brought in | 你今天带来的状态 | Mood + Scene | 它看见了我今天怎样 |
| 2 | What the card reveals | 这张牌看见了什么 | Tarot Card + Core Energy | 这不是随机牌，有牌义 |
| 3 | Why this card found you today | 为什么今天是这张牌 | Birth Aura + Ruling Planet | 它把我的长期气场和今天连起来了 |
| 4 | What shifts now | 今天正在发生的转向 | Luck Shift | 我知道今天要从哪里转到哪里 |
| 5 | How to wear it | 如何把它穿在身上 | Lucky Color + Guardian Item + Formula | 我知道怎么把提示带出去 |

---

### 11.4 交互规则

- Reading 页面默认显示已选牌和牌位；
- 用户必须至少点击一次 `Reveal` 才能看到第一层解读；
- 每展开一层，上一层保留，形成时间流；
- 每层展开有轻微卡片翻页 / 光晕扩散动画；
- CTA 文案必须是仪式语言，不使用 `Next`、`Continue`、`Loading`；
- 可提供 `Reveal all`，但不能作为主 CTA；
- 最后一层展开后，主 CTA 变为 `See My Style Oracle`；
- 若用户中途离开，返回后从已展开层级继续。

---

### 11.5 时间与 fallback

- 最短完整展示：4 秒；
- 推荐完整仪式：8–15 秒，取决于用户点击速度；
- AI 生成超过 5 秒时显示：

```text
Your oracle is still opening.
The card has already given its first message.
```

中文：

```text
你的神谕还在展开。
这张牌已经给出了第一层信息。
```

- 生成失败时使用 Mock / fallback readingFrame，不中断仪式；
- fallback 文案必须仍然引用 Mood、Scene、Birth Aura、Ruling Planet 和 Tarot Card。

---

### 11.6 页面验收

P0-06 合格标准：

```text
用户知道这是一张“今日单牌阵”；
用户知道这张牌的位置是“今日核心能量”；
用户不是等待结果，而是在逐层打开解读；
用户在进入结果页前，已经理解 Card → Aura Name → Luck Shift → Style Cue 的基本逻辑。
```

## 12. P0-07 Today’s Style Oracle Result

### Route

```text
/result/[id]
```

### 页面目标

P0-07 是产品最重要的命中感页面。v4.2 中，结果页不再只是“字段完整的 AI 报告”，也不只是“抽牌结果卡”。

P0-07 必须是一张已经被展开的 **Unfolded Daily One-Card Reading / 已展开的今日单牌解读**。

用户看完这一页要产生：

```text
我知道这是一张今日单牌阵。
我知道这张牌在回答“今日核心能量”。
它说中了我今天带来的状态。
它解释了为什么这张牌今天找到我。
它把今日守护星、本命气场和牌义连起来了。
它把心理转向翻译成了颜色、单品和穿搭公式。
我想封印它，并把这个状态带走。
```

### API 调用

```text
GET /api/v1/oracles/{oracleId}
```

---

### 12.1 结果页最终保留内容

P0-07 只保留以下 10 类信息。所有字段都必须服务于“解读展开”，不能像报告一样平铺。

| 层级 | 内容 | 展示方式 | 目的 |
|---|---|---|---|
| 1 | 日期标题 | `Jun 13 Style Oracle` | 今天性 |
| 2 | 今日守护星 | `Saturn / Structure · Boundaries · Stability` | 时间能量 |
| 3 | 本命气场 | `Venus Air` chip | 个人性 |
| 4 | 今日单牌阵 | `Daily One-Card Spread` | 牌阵感 |
| 5 | 牌位 | `Today’s Core Energy` | 这张牌在回答什么 |
| 6 | 今日牌面 | `Strength` chip / 主卡 | 牌义入口 |
| 7 | Aura Name | `Soft Boundary` 主标题 | 今日气场名 |
| 8 | Reading Frame | 5 段分层解读 | 连贯解释 |
| 9 | Luck Shift | `Drained → Protected` | 今日心理转向 |
| 10 | Style Translation | Lucky Color / Guardian Item / Style Formula | 把牌义穿出去 |

P0-07 不展示：

```text
Today’s Mission / 今日任务
Avoid Today / 今日避免
Activation Phrase / 出门暗示
Activation Action / 今日动作
```

这些内容会让结果页变成报告，削弱命中感。`Activation Action` 如有需要，只能放到 P0-08 Hold to Seal 页面。

---

### 12.2 英文布局结构

```text
Jun 13 Style Oracle

Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability

[Birth Aura: Venus Air] [Card: Strength]

Daily One-Card Spread
Card Position: Today’s Core Energy

Strength
Soft Boundary

Luck Shift
Drained → Protected

Your Reading

1. What you brought in
You arrived today feeling drained, with work / study asking for your focus.

2. What the card reveals
Strength appears when softness needs a clearer shape.
It is not asking you to become harder.

3. Why this card found you today
Because your Birth Aura carries Venus Air,
you may give too much energy to keep the atmosphere beautiful.
Today is ruled by Saturn, bringing structure, boundaries, and stability.

4. The shift opening now
This card is asking you to protect your softness with clearer shape.

Today’s Style Translation

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Style Formula
Soft layer + clean outer shape + silver detail

[ ✦ Seal Today’s Aura ✦ ]
[ Save Card ]  [ Share Story ]
```

---

### 12.3 中文布局结构

```text
6月13日风格神谕

今日守护星
Saturn 土星
结构 · 边界 · 稳定

[本命气场：金星风象] [今日牌面：力量]

今日单牌阵
牌位：今日核心能量

力量
柔软边界

今日气运转向
被消耗 → 被保护

你的今日解读

1. 你今天带来的状态
你今天带着被消耗的感觉来到这里，而工作 / 学习正在要求你保持专注。

2. 这张牌看见了什么
力量牌出现时，通常不是要你更用力，
而是提醒柔软也需要一个清晰的形状。

3. 为什么今天是这张牌
你的金星风象让你很容易照顾关系、氛围和别人的感受；
而今天的土星气场，会提醒你把柔软放进一个更清晰的边界里。

4. 今天正在发生的转向
这张牌给你的不是强硬，
而是一种有结构的温柔。

今日穿搭转译

今日幸运色
炭灰海军蓝

今日守护单品
结构感外套

今日穿搭公式
柔软内搭 + 清晰外轮廓 + 银色细节

[ ✦ 封印今日气场 ✦ ]
[ 保存卡片 ]  [ 分享 Story ]
```

---

### 12.4 视觉布局建议

页面从上到下分为 6 个区块。

#### A. 日期 + 守护星区

```text
Jun 13 Style Oracle
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability
```

设计要求：

- `Jun 13 Style Oracle` 使用小 serif 标题；
- `Today’s Ruling Planet` 为小标签；
- `Saturn` 使用大字，但不要超过 Aura Name；
- `Structure · Boundaries · Stability` 做成一行小关键词；
- 中文里 `Saturn 土星` 直接保留英文 + 中文，显得更像西方占星。

---

#### B. 牌阵 + 牌位区

```text
Daily One-Card Spread
Card Position: Today’s Core Energy
```

设计要求：

- 用细金线 / 小星点 / 单张牌位框表现“单牌阵”；
- 不展示复杂十字牌阵，避免 P0 过重；
- `Today’s Core Energy` 必须显眼，让用户知道这张牌回答什么；
- 可以用一张居中牌 + 下方 position label 表达牌位。

---

#### C. 主神谕卡区

```text
Strength
Soft Boundary
Luck Shift: Drained → Protected
```

设计要求：

- 这是页面视觉中心；
- `Soft Boundary` 最大，必须让用户记住今天的气场名；
- `Drained → Protected` 做成左右 pill + 箭头；
- 卡片背景可用深蓝 / 香槟金细线 / 轻微光晕。

---

#### D. 分层解读区

标题：

```text
Your Reading
```

中文：

```text
你的今日解读
```

包含 4 个短段落：

```text
1. What you brought in
2. What the card reveals
3. Why this card found you today
4. The shift opening now
```

中文：

```text
1. 你今天带来的状态
2. 这张牌看见了什么
3. 为什么今天是这张牌
4. 今天正在发生的转向
```

写法要求：

- 必须复述用户 mood；
- 必须引用 scene；
- 必须解释 tarot card 的核心牌义；
- 必须引用 Birth Aura；
- 必须引用 Today’s Ruling Planet；
- 必须说出一个心理转向；
- 每段 1–2 句，整体不超过 160–220 中文字或 120–170 英文词；
- 不要堆字段，不要说教。

---

#### E. 今日穿搭转译区

三张小卡并排或纵向堆叠：

```text
Lucky Color
Charcoal Navy
[色块]

Guardian Item
Structured Jacket
[小 icon]

Style Formula
Soft layer + clean outer shape + silver detail
```

设计要求：

- 标题必须叫 `Style Translation / 穿搭转译`，不要只叫 recommendation；
- Lucky Color 要有真实色块；
- Guardian Item 要有简洁 icon / 插画；
- Style Formula 不超过一行半；
- 不显示 `Avoid Today`；
- 穿搭内容必须能被上方解读解释，不能像随机推荐。

---

#### F. CTA 区

主按钮：

```text
[ ✦ Seal Today’s Aura ✦ ]
```

中文：

```text
[ ✦ 封印今日气场 ✦ ]
```

次按钮：

```text
Save Card
Share Story
```

规则：

- 主 CTA 永远是 Seal；
- Save / Share 不抢主 CTA；
- 已封印后再显示更强的 Share。

---

### 12.5 P0-07 数据读取字段

前端只读取并展示：

```ts
export type ResultPageContent = {
  oracleTitle: string;              // Jun 13 Style Oracle

  todayDateSignal: {
    rulingPlanet: {
      name: string;                 // Saturn
      nameCn?: string;              // 土星
      keywords: string[];           // Structure, Boundaries, Stability
      keywordsCn?: string[];        // 结构, 边界, 稳定
    };
  };

  birthAura: {
    auraName: string;               // Venus Air
  };

  spread: {
    type: "daily_one_card";
    title: string;                  // Daily One-Card Spread
    titleCn?: string;               // 今日单牌阵
    position: {
      name: string;                 // Today’s Core Energy
      nameCn?: string;              // 今日核心能量
      question: string;             // What energy should I carry today?
      questionCn?: string;          // 我今天应该带着什么能量出门？
    };
  };

  tarotCard: {
    name: string;                   // Strength
    auraName: string;               // Soft Boundary
    coreEnergy?: string;            // boundaries, stability, inner strength
  };

  auraName: string;                 // Soft Boundary

  luckShift: {
    from: string;                   // Drained
    to: string;                     // Protected
    label: string;                  // Drained → Protected
  };

  readingFrame: {
    title: string;                  // Your Reading
    titleCn?: string;               // 你的今日解读
    whatYouBroughtIn: string;       // Mood + Scene
    cardReveals: string;            // Tarot card meaning
    whyItFoundYou: string;          // Birth Aura + Ruling Planet
    psychologicalTurn: string;      // Wrong direction → right direction
    styleTranslation: string;       // Why the style cue fits the reading
  };

  style: {
    luckyColor: string;             // Charcoal Navy
    guardianItem: string;           // Structured Jacket
    styleFormula: string;           // Soft layer + clean outer shape + silver detail
  };
};
```

---

### 12.6 P0-07 不读取或不展示字段

```ts
avoidToday
activationPhrase
activationAction
dailyMission
todayMission
```

这些字段如存在，只能在 P1 Full Oracle 或 P0-08 / P0-09 中使用。

---

### 12.7 结果页验收标准

P0-07 必须满足：

```text
用户能看到牌阵名称；
用户能看到牌位；
用户知道这张牌回答的是“今日核心能量”；
用户能读到完整但不冗长的解读链路；
用户能理解为什么牌义会转成这个幸运色、守护单品和穿搭公式；
用户不会觉得这是 AI 字段报告。
```

## 13. P0-08 Activate / Hold to Seal

### Route

```text
/activate/[id]
```

### 页面目标

让用户把神谕从“看见”变成“接受并带走”。

### API 调用

```text
POST /api/v1/oracles/{oracleId}/activation/start
POST /api/v1/activations/{activationId}/seal
```

### 布局

```text
Your Guardian Item Today

Structured Jacket

It is not here to make you harder.
It helps you protect your softness.

Lucky Color
Charcoal Navy

Place one finger here.
Hold to seal today’s aura.

[ 圆形 Seal 按钮 ]
```

中文：

```text
你的今日守护单品

结构感外套

它不是让你变得强硬，
而是帮你保护自己的柔软。

今日幸运色
炭灰海军蓝

把手指停在这里。
长按封印今日气场。

[ 圆形 Seal 按钮 ]
```

### 交互

- 长按 2 秒或 3 秒；
- 圆环慢慢填满；
- 卡片轻微发光；
- 轻震；
- 完成跳 `/activated/[id]`。

---

## 14. P0-09 Aura Activated

### Route

```text
/activated/[id]
```

### 页面目标

确认今日气场已经激活。

### API 调用

```text
GET /api/v1/oracles/{oracleId}
```

### 布局

```text
Aura Sealed

June 13 aura is active.

Soft Boundary
is with you today.

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

[ Share Story ]
[ Save Card ]
[ Done ]
```

中文：

```text
气场已封印

6月13日气场已激活。

柔软边界
今天会陪你一起出门。

今日幸运色
炭灰海军蓝

守护单品
结构感外套

[ 分享 Story ]
[ 保存卡片 ]
[ 完成 ]
```

---

## 15. P0-10 Share Aura Card

### Route

```text
/share/[id]
```

### 页面目标

让用户愿意分享这张卡。

### API 调用

```text
POST /api/v1/oracles/{oracleId}/render-share-card
POST /api/v1/share-events
```

### 分享卡 9:16 内容

```text
June 13, 2026

Today’s Aura
Soft Boundary

One-Card Spread
Today’s Core Energy

Ruling Planet
Saturn
Structure · Boundaries · Stability

Birth Aura: Venus Air
Card: Strength

Luck Shift
Drained → Protected

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Sealed by AuraCue
Draw yours on AuraCue
```

中文：

```text
2026年6月13日

今日气场
柔软边界

今日单牌阵
今日核心能量

今日守护星
Saturn 土星
结构 · 边界 · 稳定

本命气场：金星风象
今日牌面：力量

气运转向
被消耗 → 被保护

幸运色
炭灰海军蓝

守护单品
结构感外套

Sealed by AuraCue
来抽你的今日风格神谕
```

### 分享页布局

```text
Share Today’s Aura

[9:16 Share Card Preview]

[ Share Story ]
[ Download Image ]
[ Copy Link ]
```

---

## 16. P0-11 Saved

### Route

```text
/saved/[id]
```

### 页面目标

给保存成功反馈。

### 布局

```text
Saved to My Aura Cards

Your June 13 aura is ready whenever you need it.

[小卡预览]

[ View in My ]
[ Share Story ]
[ Back Home ]
```

---

## 17. P0-12 My

### Route

```text
/my
```

### 页面目标

承载用户个人资产。P0 不做登录，但 My 必须存在。

### API 调用

```text
GET /api/v1/my/summary
```

### 布局

```text
My Aura

[ Birth Aura Card ]
Venus Air
Libra · Air · Opal
Soft Opal Pink
[ View / Edit Birth Aura ]

[ Today’s Sealed Aura ]
Soft Boundary
Charcoal Navy · Structured Jacket
[ View Today’s Card ]

[ Aura History ]
This Week
Jun 13 · Soft Boundary · Sealed
Jun 12 · Clean Renewal · Sealed
Jun 11 · Quiet Power

[ Saved Aura Cards ]
3 cards saved


```

中文：

```text
我的气场

[ 本命气场卡 ]
金星风象
天秤 · 风元素 · 欧泊
柔光欧泊粉
[ 查看 / 修改本命气场 ]

[ 今日已封印气场 ]
柔软边界
炭灰海军蓝 · 结构感外套
[ 查看今日气场牌 ]

[ 气场记录 ]
本周
6月13日 · 柔软边界 · 已封印
6月12日 · 清透恢复 · 已封印
6月11日 · 安静力量

[ 已保存气场卡 ]
已保存 3 张


```

### 规则

- Aura History 只展示最近 7 条；
- 点击历史项进入 `/result/[id]` 只读模式；
- 登录入口为 P1 占位，不阻塞 P0。

---

## 18. P0-13 Birth Aura Profile

### Route

```text
/my/birth-aura
```

### 页面目标

查看与修改 Birth Aura。

### 布局

```text
Birth Aura

Venus Air
Libra · Air · Opal

Guardian Color
Soft Opal Pink

Style Mantra
I attract through balance, not effort.

Birthday
Oct 07

[ Edit Birthday ]
```

修改生日时需要提示：

```text
Changing your birthday will update future readings.
Past sealed cards will stay unchanged.
```

中文：

```text
修改生日会影响未来的神谕。
过去已封印的卡片不会改变。
```

---

## 19. Legal 页面

### `/legal/privacy`

包含：

- 只收月 / 日；
- P0 使用匿名身份；
- 不出售用户数据；
- 分享卡由用户主动分享；
- 不做医疗、心理诊断、命运保证。

### `/legal/terms`

包含：

- AuraCue 提供的是 self-reflection / style inspiration；
- 不保证好运、成功、恋爱、健康结果；
- 用户保留选择权。

---

## 20. Route Guard

| 页面 | Guard |
|---|---|
| `/home` | 无需 Birth Aura |
| `/my` | 无需 Birth Aura |
| `/onboarding/birth-aura` | 无 |
| `/today/check-in` | 必须 hasBirthAura |
| `/today/draw` | 必须 hasBirthAura + checkIn |
| `/today/reading` | 必须 selectedCard |
| `/result/[id]` | 必须 oracle exists |
| `/activate/[id]` | 必须 oracle exists |
| `/share/[id]` | 必须 oracle exists |

缺少 Birth Aura 时跳转：

```text
/onboarding/birth-aura?returnTo=/today/check-in
```

---

## 21. 页面验收清单

### 21.1 高审美

- 背景符合 soft luxury；
- 页面不拥挤；
- 主卡片像可收藏神谕卡；
- CTA 渐变统一；
- 每页视觉焦点明确。

### 21.2 高命中感

- 结果页引用 Today’s Ruling Planet；
- 结果页引用 Birth Aura；
- 结果页引用 Tarot Card；
- 结果页复述 Mood / Scene；
- 结果页有 Daily One-Card Spread；
- 结果页有 Card Position: Today’s Core Energy；
- 结果页有 Reading Frame，解释 Card → Aura Name → Luck Shift → Style Translation；
- 结果页有 Luck Shift；
- 结果页有具体 Guardian Item；
- 结果页有 Lucky Color 和 Style Formula；
- 结果页删除 Today’s Mission / Avoid Today / Activation Action。

### 21.2.1 高塔罗感 / 高仪式参与

- 抽牌后不自动跳走，必须显示牌阵位置；
- Reading 页面不是 loading，而是分层解读仪式；
- 用户至少主动打开一层解读；
- 每层解读都能被上一层承接；
- 用户能清楚感受到 `进入状态 → 牌面回应 → 今日转向 → 穿出去 → 封印` 的时间流；
- P0 不引入三牌阵或十字排阵，但要让单牌阵有足够塔罗感。

### 21.3 高分享欲

- 分享卡是 9:16；
- 包含日期；
- 包含 Today’s Aura；
- 包含 Today’s Ruling Planet；
- 包含 Luck Shift；
- 包含 Guardian Item；
- 不暴露隐私；
- 有 “Draw yours on AuraCue”。

### 21.4 MVP 完整性

- Home / My 底部导航；
- Journal 在 My 内；
- 生日必填后才能抽卡；
- 每天只能生成 1 张官方主牌；
- 已封印后 Home 不显示重抽；
- 登录密码不在 P0；
- 可保存、分享、回看历史。

---

## 22. 最终页面原则

```text
Home 让用户相信：今天有今天的守护星。
Birth Aura 让用户相信：这是我的。
Mood & Scene 让用户相信：它看见了我。
Tarot Pull 让用户相信：这是我亲手抽到的。
Reading 让用户相信：我正在亲手打开这张牌的解读。
Result 让用户相信：这张牌说中了，而且我知道为什么要这样穿。
Hold to Seal 让用户相信：我已经进入今天的状态。
Share 让用户相信：这是我的今日身份。
My 让用户相信：我的气场正在形成轨迹。
```
