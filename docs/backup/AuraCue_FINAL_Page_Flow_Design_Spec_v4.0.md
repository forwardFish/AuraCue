# AuraCue FINAL Page Flow + Ritual Design Spec v4.0

> 文档类型：最终页面设计文档 / Page Layout + UX Flow + API Calling Flow  
> 版本：v4.0 FINAL  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享**  
> 底部导航：**Home / My**  
> 设计目标：高审美、高命中感、高分享欲、每日重复使用。  

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

但页面链路必须从旧的：

```text
选择 mood → 生成 Aura Card
```

升级为最终 MVP：

```text
Home
→ Birth Aura Required Gate
→ Create Birth Aura
→ Birth Aura Reveal
→ Mood & Scene Check-in
→ Tarot Pull
→ Reading
→ Today’s Style Oracle Result
→ Guardian Item / Daily Mission
→ Hold to Seal
→ Aura Activated
→ Share / Save
→ My / Aura History
```

页面目标不是让用户完成表单，而是让用户完成一个每日塔罗风格神谕仪式。

---

## 1. 全局信息架构

### 1.1 底部导航

P0 底部只保留两个 Tab：

```text
Home     My
```

| Tab | Route | 职责 |
|---|---|---|
| Home | `/home` 或 `/` | App 主入口、今日日期气场、今日抽牌 CTA、今日已封印气场、继续未完成仪式 |
| My | `/my` | 本命气场、生日设置、气场记录、已保存卡、设置、Legal、P1 登录入口 |

P0 不做独立 Journal Tab。历史气场卡放入 My 页面中的 `Aura History / My Aura Cards`。

---

### 1.2 P0 页面清单

| 编号 | 页面 | Route | 作用 |
|---|---|---|---|
| P0-00 | Bootstrap | `/` | 创建 anonymous identity，读取 Home 状态，跳转 `/home` |
| P0-01 | Home | `/home` | App 主入口，状态化展示今日气场 |
| P0-02 | Create Birth Aura | `/onboarding/birth-aura` | 输入生日月 / 日，生成本命气场 |
| P0-03 | Birth Aura Reveal | `/onboarding/birth-aura/reveal` | 揭示长期本命气场身份 |
| P0-04 | Mood & Scene Check-in | `/today/check-in` | 选择今日状态和今日场景 |
| P0-05 | Tarot Pull | `/today/draw` | 三张塔罗背面牌，用户亲手抽一张 |
| P0-06 | Reading | `/today/reading` | 读取 Birth Aura / Date Aura / Mood / Scene / Card |
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

### 1.3 P1 页面

| 页面 | Route | 说明 |
|---|---|---|
| Login | `/auth/login` | 邮箱密码登录 |
| Sign Up | `/auth/signup` | 邮箱注册 |
| Forgot Password | `/auth/forgot-password` | 找回密码 |
| Reset Password | `/auth/reset-password` | 重置密码 |
| Account Settings | `/my/account` | 账号、邮箱、密码、同步 |
| Subscription | `/subscription` | Pro / 年费 |
| Clarifier Card | `/clarifier/[id]` | 补充牌，不替代主牌 |
| Evening Reflection | `/evening/[date]` | 晚间反馈 |
| 7-Day Aura Pattern | `/my/aura-pattern/week` | 7 日气场轨迹 |
| Monthly Aura Map | `/my/aura-map/month` | 月度风格地图 |
| Share Templates | `/share/templates` | 多套分享模板 |

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

### 3.4 DateAuraCard

显示今日日期气场。

示例：

```text
Jun 13 · Saturday
Today’s Date Aura
Clear Structure
Today asks for structure before movement.
```

组件字段：

```ts
DateAuraCardProps = {
  displayDate: string;
  auraName: string;
  theme: string;
  dailyMission?: string;
  mode: "home" | "result" | "share";
}
```

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
Home 显示新的 Date Aura
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

### 跳转规则

总是跳转 `/home`。Home 再根据状态显示下一步。

---

## 6. P0-01 Home

### Route

```text
/home
```

### 页面目标

Home 是完整 App 的主入口，不叫 Today。页面内部可以大量使用 Today 语言。

Home 负责：

- 展示今日日期气场；
- 展示今日任务；
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
| First Open | 无 anonymousId 或首次访问 | 品牌介绍 + 今日日期气场预览 | Start My First Aura |
| No Birth Aura | 有 guest，但无 Birth Aura | Date Aura + Birth Aura Required Card | Create Birth Aura |
| Ready to Draw | 有 Birth Aura，今日未开始 | Date Aura + Birth Aura chip + 未翻开的今日卡 | Activate Today’s Aura |
| Check-in Started | 已选 mood / scene，未抽牌 | 今日仪式进度卡 | Continue Ritual |
| Card Selected / Generating | 已选牌或生成中 | 今日牌面生成中 | Continue Reading |
| Generated Not Sealed | 结果已生成未封印 | 今日神谕摘要 + 守护单品 | Seal Today’s Aura |
| Sealed Today | 今日已封印 | 今日气场卡摘要 + 幸运色 + 守护单品 | View Today’s Card / Share Story |
| New Day | 本地日期变化 | 新 Date Aura + 昨日进入 Aura History | Activate Today’s Aura |

---

### First Open Home 布局

```text
[TopHeader]

AuraCue
Your Daily Tarot Style Oracle

Jun 13 · Saturday
Today’s Date Aura
Clear Structure

Today’s Mission
Build one small boundary before you give more energy away.

Draw one card, activate today’s aura,
and wear your luck.

[ ✦ Start My First Aura ✦ ]
```

中文：

```text
AuraCue
年轻人的每日塔罗风格神谕

6月13日 · 星期六
今日日期气场
清晰结构

今日任务
在把更多能量给出去之前，先建立一个小边界。

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
Today’s Date Aura
Clear Structure

Create your Birth Aura first.
Your birthday becomes the key to how each card speaks to you.

[ ✦ Create Birth Aura ✦ ]
```

---

### Ready to Draw Home 布局

```text
[Birth Aura Chip: Venus Air]

Jun 13 · Saturday
Today’s Date Aura
Clear Structure

Today’s Mission
Build one small boundary before you give more energy away.

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

Today’s Mission
Build one small boundary before you give more energy away.

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
[Date Aura Chip: Jun 13 · Clear Structure]
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
6. 显示：

```text
Today’s Card
Strength
Soft Boundary
```

7. 1 秒后进入 `/today/reading`。

---

## 11. P0-06 Reading

### Route

```text
/today/reading
```

### 页面目标

让用户感到系统正在把多个信号合成，不是普通 loading。

### API 调用

```text
POST /api/v1/oracles/generate
GET /api/v1/generation-jobs/{jobId}
```

### 布局

```text
[翻开的牌居中]
Strength
Soft Boundary

Reading your Birth Aura...
Aligning with today’s date signal...
Listening to your card...
Translating energy into style...
```

中文：

```text
正在读取你的本命气场……
正在对齐今日日期信号……
正在聆听你的牌面……
正在把能量翻译成风格……
```

### 时间

- 最短展示 1.5 秒；
- 最长 5 秒；
- 超过 5 秒显示柔和 fallback：

```text
Your oracle is almost ready...
```

---

## 12. P0-07 Today’s Style Oracle Result

### Route

```text
/result/[id]
```

### 页面目标

决定用户是否觉得“它说的是我”。结果页必须是卡片，不是报告。

### API 调用

```text
GET /api/v1/oracles/{oracleId}
```

---

### 布局结构

```text
Jun 13 Style Oracle

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
you may give too much energy to keep things beautiful.
Today’s Date Aura asks for clearer structure.
Strength is not asking you to become harder.
It is asking you to protect your softness.

Today’s Mission
Build one small boundary before you give more energy away.

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

[ ✦ Hold to Seal Today’s Aura ✦ ]
[ Save Card ]  [ Share Story ]
```

中文结构：

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
你可能会为了维持关系和美感而给出过多能量。
今天的日期气场提醒你建立更清晰的结构。
力量牌不是要你变得更强硬，
而是提醒你保护自己的柔软。

今日任务
在把更多能量给出去之前，先建立一个小边界。

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
```

### 设计要求

- 上半屏：日期、Birth Aura、牌面、Luck Shift；
- 中段：心理暗示与今日任务；
- 下半屏：穿搭落地；
- 主 CTA：Hold to Seal；
- 不做长报告；
- 不超过 1–2 屏核心信息。

---

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

Today’s Mission
Build one small boundary before you give more energy away.

Activation Action
Adjust your sleeve before entering a room.

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

今日任务
在把更多能量给出去之前，先建立一个小边界。

今日动作
进门前整理一下袖口。

把手指停在这里。
长按封印今日气场。
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

Today’s Mission
Build one small boundary before you give more energy away.

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

今日任务
在把更多能量给出去之前，先建立一个小边界。
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

Date Aura: Clear Structure
Birth Aura: Venus Air
Card: Strength

Luck Shift
Drained → Protected

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Today’s Mission
Build one small boundary before you give more energy away.

“I can stay soft without being available to everyone.”

Sealed by AuraCue
Draw yours on AuraCue
```

中文：

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

今日任务
在把更多能量给出去之前，先建立一个小边界。

“我可以保持柔软，但不必对所有人开放。”

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

[ Settings ]
Notifications  P1
Language       P1 / optional
Privacy Policy
Terms of Use
Login / Sync Account  P1 Coming Soon
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

[ 设置 ]
隐私政策
服务条款
登录 / 同步账号  P1 开放
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

- 结果页引用 Birth Aura；
- 结果页引用 Date Aura；
- 结果页复述 Mood / Scene；
- 结果页显示 Tarot Card；
- 结果页有 Luck Shift；
- 结果页有 Daily Mission；
- 结果页有具体 Guardian Item 和 Activation Action。

### 21.3 高分享欲

- 分享卡是 9:16；
- 包含日期；
- 包含 Today’s Aura；
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
Home 让用户相信：今天有今天的气场。
Birth Aura 让用户相信：这是我的。
Mood & Scene 让用户相信：它看见了我。
Tarot Pull 让用户相信：这是我亲手抽到的。
Reading 让用户相信：它正在解读我。
Result 让用户相信：它说中了，而且我知道怎么穿、怎么做。
Hold to Seal 让用户相信：我已经进入今天的状态。
Share 让用户相信：这是我的今日身份。
My 让用户相信：我的气场正在形成轨迹。
```
