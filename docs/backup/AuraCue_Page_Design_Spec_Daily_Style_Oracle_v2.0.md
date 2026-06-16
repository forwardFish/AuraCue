# AuraCue Page Design Specification v2.0 — 每日风格神谕全页面设计文档

> 文档类型：页面设计 / UI Layout / Interaction Specification  
> 版本：v2.0  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日风格神谕 / Daily Style Oracle**  
> 设计目标：高审美、高命中感、高分享欲  
> 基准风格：沿用当前首页截图的 soft luxury、粉紫柔光、serif 大标题、横向大卡片、玻璃胶囊、紫粉桃渐变 CTA

---

## 0. 对当前页面风格的判断

当前截图整体方向是可用的，而且适合继续作为全产品的视觉母版。

### 0.1 该保留的部分

| 视觉元素 | 判断 | 原因 |
|---|---|---|
| 浅奶油白 + 粉紫柔光背景 | 保留 | 有轻疗愈和高级生活方式感 |
| AURACUE 顶部居中 Logo | 保留 | 品牌感强，适合神谕产品 |
| 日期胶囊 | 强化 | 日期是每日订阅和打卡的关键，应升级成 Date Aura |
| serif 大标题 | 保留 | 有 editorial / beauty campaign 感 |
| 横向大卡片 | 保留 | 适合 mood、scene、card、result 模块 |
| 紫粉桃渐变 CTA | 保留 | 有点击欲，也符合女性向气场产品 |
| 轻玻璃按钮和圆角 | 保留 | 有高级感，不像普通工具 |
| 底部 Home / Profile | 保留但精简 | P0 可用，P1 增加 Journal |

### 0.2 需要升级的部分

| 当前问题 | 修改方向 |
|---|---|
| 现在只是 mood 选择，缺少“生日 / 本命气场” | 加入 Birth Aura onboarding |
| 日期只是普通 badge | 升级为 Today’s Date Aura |
| mood 选项偏普通：Confident / Romantic / Calm | 增加更有命中感的年轻人状态：Drained、Hidden、Unbothered、Magnetic |
| 缺少塔罗抽牌动作 | 加三张牌抽取页 |
| 缺少“今日神谕卡”结果页 | 设计 Today’s Style Oracle 卡片页 |
| 缺少现实穿戴锚点 | 增加 Lucky Color、Guardian Item、Style Formula |
| 缺少仪式完成动作 | 增加 Hold to Seal |
| 缺少分享卡 | 增加 9:16 Aura Card |
| 缺少留存机制 | 增加 Journal / Evening Reflection / 7-Day Pattern |

### 0.3 全产品视觉结论

全产品不要换风格。应保持当前视觉，但把它从“mood 首页”扩展为完整仪式系统：

```text
Birth Aura
→ Date Aura
→ Mood & Scene
→ Tarot Pull
→ Reading
→ Today’s Style Oracle
→ Hold to Seal
→ Share / Journal
```

---

## 1. 全局视觉系统

### 1.1 视觉关键词

```text
soft luxury
aura wellness
pastel gradient
editorial card
gentle ritual
feminine but not childish
premium lifestyle
clean mystic
daily oracle
wearable luck
```

中文：

```text
柔和高级
轻疗愈
气场感
每日神谕
粉紫柔光
高级生活方式
大卡片
留白
可穿戴好运
不是低端玄学
不是 AI 工具页
```

### 1.2 色彩 Token

```css
:root {
  /* Page Background */
  --bg-page: #FAF7F9;
  --bg-page-lilac: #F1EAF8;
  --bg-page-blush: #FCEEF3;
  --bg-page-peach: #F8E8E0;
  --bg-page-warm: #FFF8F4;

  /* Text */
  --text-primary: #2F174D;
  --text-secondary: #6F617B;
  --text-muted: #9A8EA5;
  --text-inverse: #FFFFFF;

  /* Brand */
  --brand-purple-900: #2F174D;
  --brand-purple-700: #6B3BAE;
  --brand-purple-600: #8148C6;
  --brand-purple-500: #9D6ADF;

  --brand-pink-600: #D66AA7;
  --brand-pink-500: #ED93BD;
  --brand-pink-400: #F5B4D2;

  --brand-peach-400: #F4B7A5;
  --brand-peach-300: #F7D2C7;

  --brand-gold-500: #C9A86A;
  --brand-gold-300: #EAD7A8;

  /* Surface */
  --surface-white: rgba(255, 255, 255, 0.72);
  --surface-glass: rgba(255, 255, 255, 0.48);
  --surface-card: rgba(255, 255, 255, 0.30);

  /* Border */
  --border-soft: rgba(101, 74, 128, 0.14);
  --border-glass: rgba(255, 255, 255, 0.52);
  --border-selected: rgba(218, 190, 255, 0.92);

  /* Shadow */
  --shadow-soft: rgba(95, 67, 124, 0.12);
  --shadow-card: rgba(114, 83, 151, 0.16);
  --shadow-cta: rgba(154, 89, 191, 0.26);

  /* Gradients */
  --cta-gradient: linear-gradient(90deg, #7C3EBB 0%, #C978D5 46%, #F3B3A5 100%);
  --aura-bg: radial-gradient(circle at 18% 18%, rgba(246, 224, 239, 0.85), transparent 34%),
             radial-gradient(circle at 78% 28%, rgba(235, 219, 250, 0.82), transparent 32%),
             radial-gradient(circle at 76% 78%, rgba(250, 213, 220, 0.72), transparent 34%),
             linear-gradient(180deg, #FAF7F9 0%, #F6F0F8 100%);
}
```

### 1.3 字体

| 用途 | 推荐字体 | 说明 |
|---|---|---|
| 英文 Hero / 卡片标题 | Playfair Display / Cormorant Garamond / Georgia | 高级、神谕、fashion editorial |
| 英文正文 | Inter / SF Pro Text | 清晰、现代 |
| 中文标题 | 思源宋体 / Noto Serif SC / 系统宋体 | 优雅，不幼稚 |
| 中文正文 | PingFang SC / Noto Sans SC | 清晰，适合移动端 |

### 1.4 字号层级

| Token | 用途 | 字号 | 行高 |
|---|---|---:|---:|
| `display-xl` | 首页大标题 | 48–54px | 56–60px |
| `display-lg` | 页面主标题 | 38–44px | 46–50px |
| `card-title` | 大卡标题 | 30–34px | 36–40px |
| `section-title` | 模块标题 | 18–22px | 26–30px |
| `body-lg` | 解释正文 | 16–17px | 24–26px |
| `body-md` | 普通正文 | 14–15px | 22px |
| `caption` | 小标签 | 12–13px | 18px |
| `button-lg` | 主按钮 | 20–22px | 26px |

### 1.5 页面布局基准

```text
设计基准：390 × 844
最大宽度：430px
最小宽度：360px
左右边距：20px
底部 Tab 高度：88px
底部安全区：env(safe-area-inset-bottom)
主 CTA 高度：60px
卡片圆角：24–28px
页面大卡圆角：28–32px
```

### 1.6 AppShell

```tsx
<AppShell>
  <PageBackground />
  <TopHeader />
  <main>{children}</main>
  <BottomTabBar />
</AppShell>
```

全局规则：

- 全部页面使用同一 AppShell；
- 背景统一为浅奶油粉紫柔光；
- 不使用科技蓝、黑紫水晶球风；
- 页面最多一个主 CTA；
- 不堆信息，不做 dashboard；
- 每个页面只完成一个心理动作。

---

## 2. 全局组件

### 2.1 TopHeader

用途：

- 保持品牌一致；
- 显示 Avatar / Logo / Gift 或 Streak；
- P0 右上角 gift 可作为占位，P1 可变成 Pro / Rewards。

结构：

```tsx
<TopHeader>
  <ProfileAvatarButton />
  <BrandLogo />
  <HeaderActionButton />
</TopHeader>
```

布局：

```text
[Avatar]       [Lotus + AURACUE]       [Gift / Streak]
```

### 2.2 DateAuraBadge

原日期 badge 升级为 Date Aura 胶囊。

展示：

```text
Jun 13 · Clear Structure
```

或：

```text
Today · Soft Alignment
```

样式：

- 高度 36px；
- 圆角 pill；
- 玻璃白；
- 左侧小日历 icon；
- 文字用 `body-md`。

### 2.3 BirthAuraChip

小型身份标签，用于结果页、首页顶部。

示例：

```text
Moon-born
Venus Air
Solar Fire
```

样式：

- 玻璃胶囊；
- 金色 / 紫色描边；
- 可点击进入 Birth Aura Profile。

### 2.4 PrimaryCTA

统一主按钮：

```text
[ ✦ Activate Today’s Aura ✦ ]
[ ✦ Reveal My Birth Aura ✦ ]
[ ✦ Start Today’s Ritual ✦ ]
[ ✦ Hold to Seal ✦ ]
```

规则：

- 全宽；
- 60px 高；
- 紫粉桃渐变；
- serif 字体；
- 左右星光 icon；
- disabled 使用灰粉渐变；
- loading 文案要神谕化，不能写普通 loading。

### 2.5 OracleCard

用于结果、分享、Journal。

属性：

```ts
type OracleCardProps = {
  date: string;
  auraName: string;
  dateAura?: string;
  birthAura?: string;
  tarotCard?: string;
  luckShift?: string;
  luckyColor?: string;
  guardianItem?: string;
  activationPhrase?: string;
  mode: "result" | "share" | "journal";
}
```

---

## 3. P0-00 Create Your Birth Aura

### Route

```text
/onboarding/birth-aura
```

### 页面目的

让用户完成第一个心理动作：

```text
这是我的个人入口。
```

### 页面布局

```text
[TopHeader / Logo only]

        Create Your
        Birth Aura

Your birthday becomes the key
to how each card speaks to you.

        [ 发光卡片背面 / 星座圆盘 ]

Month        Day
[  08  ]     [  21  ]

[ ✦ Reveal My Birth Aura ✦ ]

Skip for now
```

### UI 结构

```tsx
<BirthAuraPage>
  <CenteredLogo />
  <HeroTitle>Create Your<br />Birth Aura</HeroTitle>
  <HeroSubtitle>Your birthday becomes the key to how each card speaks to you.</HeroSubtitle>
  <MysticCardBack />
  <BirthdayInput month day />
  <PrimaryCTA>Reveal My Birth Aura</PrimaryCTA>
  <TextButton>Skip for now</TextButton>
</BirthAuraPage>
```

### 心理暗示

- 生日不是注册资料；
- 生日是钥匙；
- 用户输入后会觉得这是自己的系统。

### 文案规则

推荐：

```text
Your birthday becomes the key to how each card speaks to you.
```

不推荐：

```text
Enter your birthday to predict your fate.
```

### 交互

- 输入 Month + Day 后按钮可点击；
- 点击 CTA 进入 reveal loading；
- 可跳过；
- 跳过后进入 Today Gate；
- 跳过用户结果页不显示 Birth Aura 字段，只显示 Date Aura + mood + card。

### 动效

- 卡片背面缓慢浮动；
- 输入后卡片发光增强；
- CTA 点击有轻微缩放。

---

## 4. P0-01 Birth Aura Reveal

### Route

```text
/onboarding/birth-aura/reveal
```

### 页面目的

给用户一个长期身份标签：

```text
我是某种 Birth Aura。
```

### 页面布局

```text
[TopHeader]

Your Birth Aura is

        Venus Air

Libra · Air · Opal

You carry luck through balance,
beauty, and subtle attraction.

Your first guardian color:
Soft Opal Pink

[ ✦ Begin Today’s Ritual ✦ ]
```

### UI 结构

```tsx
<BirthAuraRevealPage>
  <SmallLabel>Your Birth Aura is</SmallLabel>
  <LargeAuraCard auraName="Venus Air" />
  <SignalRow>Libra · Air · Opal</SignalRow>
  <Message />
  <GuardianColorSwatch />
  <PrimaryCTA>Begin Today’s Ritual</PrimaryCTA>
</BirthAuraRevealPage>
```

### 视觉设计

- 大卡片居中；
- 卡片上可显示星座 glyph、元素 icon、生日石色块；
- 背景继续粉紫，但可加柔金光；
- 卡片不要黑暗玄学。

### 心理暗示

- 用户获得身份标签；
- 后续每张牌都会“通过这个气场与她对话”；
- 解决“大家抽到一样牌”的相似问题。

---

## 5. P0-02 Today Gate

### Route

```text
/today
```

### 页面目的

让日期成为每日打开理由：

```text
今天有今天的气场。
```

### 页面布局

```text
[Avatar]        [AURACUE]        [Streak/Gift]

Jun 13 · Saturday

Today’s Date Aura
Clear Structure

A new aura has opened for today.

[ Date Aura Card / 未翻开的今日卡 ]

Birth Aura: Venus Air

[ ✦ Activate Today’s Aura ✦ ]

底部：
[ Today ] [ Journal ] [ Birth Aura ]
```

### UI 结构

```tsx
<TodayGatePage>
  <TopHeader />
  <DateBadge>Jun 13 · Saturday</DateBadge>
  <HeroSection>
    <Eyebrow>Today’s Date Aura</Eyebrow>
    <HeroTitle>Clear Structure</HeroTitle>
    <HeroSubtitle>A new aura has opened for today.</HeroSubtitle>
  </HeroSection>
  <TodayCardBack />
  <BirthAuraChip />
  <PrimaryCTA>Activate Today’s Aura</PrimaryCTA>
  <BottomTabBar />
</TodayGatePage>
```

### 已封印状态

如果当天已完成 seal：

```text
Today’s Aura Sealed

Soft Boundary is active for today.

[ View Today’s Card ]
[ Share Story ]
```

### 日期规则

- 使用用户本地日期；
- 每天 00:00 开启新 Date Aura；
- 今天只有一张 Official Card；
- 昨天的卡进入 Journal。

### 视觉重点

日期 badge 不能只是小元素，它要成为每日感的入口。  
首页上方应显示：

```text
Jun 13 · Clear Structure
```

而不是只显示：

```text
Today, 13 Jun
```

---

## 6. P0-03 Mood & Scene Check-in

### Route

```text
/today/check-in
```

### 页面目的

让用户感到：

```text
它看见了我今天的状态。
```

### 页面布局

```text
Date Aura: Clear Structure
Birth Aura: Venus Air

How are you arriving today?

[ Drained ] [ Soft ]
[ Restless ] [ Hidden ]
[ Focused ] [ Magnetic ]
[ Unbothered ] [ Main Character ]

What is today asking from you?

[ Work / Study ] [ Important Moment ]
[ Stay Low-Key ] [ Just Survive Today ]
[ Need Protection ] [ Want to Be Seen ]

[ ✦ Continue to Draw ✦ ]
```

### UI 结构

```tsx
<CheckInPage>
  <SignalHeader dateAura birthAura />
  <QuestionBlock title="How are you arriving today?">
    <MoodOptionGrid />
  </QuestionBlock>
  <QuestionBlock title="What is today asking from you?">
    <SceneOptionGrid />
  </QuestionBlock>
  <PrimaryCTA>Continue to Draw</PrimaryCTA>
</CheckInPage>
```

### Option Card 样式

- 小卡片 / pill 都可；
- 选中态使用紫粉渐变；
- 图标简洁：moon、spark、shield、eye、flame、leaf；
- 每行 2 个或横向滑动；
- 选项不要太多。

### 选项文案

Mood：

```text
Drained
Soft
Restless
Hidden
Focused
Magnetic
Unbothered
Main Character
```

Scene：

```text
Work / Study
Important Moment
Stay Low-Key
Just Survive Today
Need Protection
Want to Be Seen
Date / Social
Soft Reset
```

### 心理暗示

不要问：

```text
What outfit style do you want?
```

要问：

```text
How are you arriving today?
```

这会把产品从工具变成情绪仪式。

---

## 7. P0-04 Tarot Pull

### Route

```text
/today/draw
```

### 页面目的

让用户相信：

```text
这张牌是我亲手抽到的。
```

### 页面布局

```text
Choose the card
that calls you.

Take a breath.
Today’s card will translate your energy into style.

        [ Card I ] [ Card II ] [ Card III ]

Trust your first pull.

[ ✦ Reveal My Card ✦ ]
```

### UI 结构

```tsx
<DrawPage>
  <HeroTitle>Choose the card<br />that calls you.</HeroTitle>
  <HeroSubtitle>Take a breath. Today’s card will translate your energy into style.</HeroSubtitle>
  <TarotCardRow>
    <TarotCardBack position={1} />
    <TarotCardBack position={2} />
    <TarotCardBack position={3} />
  </TarotCardRow>
  <Microcopy>Trust your first pull.</Microcopy>
  <PrimaryCTA disabled={!selected}>Reveal My Card</PrimaryCTA>
</DrawPage>
```

### 卡片样式

- 竖向卡片；
- 圆角 20px；
- 金色细线边框；
- 背面图案：莲花、星月、AURACUE monogram；
- 选中后卡片放大 1.06x；
- 未选中卡片 opacity 0.4。

### 动效

- 卡片 idle floating；
- hover/touch 微光；
- tap 轻震；
- reveal 翻转 1.2s；
- 三张牌不要 3D 过度炫技。

### 文案禁忌

不要出现：

```text
Generate Outfit
AI is calculating
```

使用：

```text
Reveal
Draw
Listen
Translate
```

---

## 8. P0-05 Reading Your Aura

### Route

```text
/today/reading
```

### 页面目的

把等待变成仪式。

### 页面布局

```text
[ 翻开的牌 / 发光卡 ]

Reading your Birth Aura...
Aligning with today’s date signal...
Listening to your card...
Translating energy into style...
```

### UI 结构

```tsx
<ReadingPage>
  <RevealedCardPreview />
  <ReadingLines>
    <Line>Reading your Birth Aura...</Line>
    <Line>Aligning with today’s date signal...</Line>
    <Line>Listening to your card...</Line>
    <Line>Translating energy into style...</Line>
  </ReadingLines>
</ReadingPage>
```

### 动效

- 每行 500ms 间隔出现；
- 背景轻光扩散；
- 总时长 1.5–3s；
- 若真实生成超过 3s，继续显示柔和 loading，不要跳出技术错误。

### 错误状态

```text
The signal faded for a moment.
Try revealing again.
```

中文：

```text
信号刚刚散开了一下。
再揭示一次。
```

---

## 9. P0-06 Today’s Style Oracle Result

### Route

```text
/result/[id]
```

### 页面目的

让用户感到：

```text
它说中了，而且我知道今天该怎么穿。
```

### 页面结构原则

```text
上半屏：命中感
下半屏：可穿戴行动
```

### 页面布局

```text
Jun 13 Style Oracle

[Date Aura: Clear Structure] [Birth Aura: Venus Air]

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

[ ✦ Activate Today’s Aura ✦ ]

[ Save Card ] [ Share Story ]
```

### UI 结构

```tsx
<ResultPage>
  <ResultHeader date dateAura birthAura />
  <OracleHeroCard cardName auraName />
  <LuckShiftCard />
  <MessageBlock />
  <StyleTranslationGrid>
    <LuckyColor />
    <GuardianItem />
    <StyleFormula />
    <AvoidToday />
  </StyleTranslationGrid>
  <ActivationPhraseCard />
  <PrimaryCTA>Activate Today’s Aura</PrimaryCTA>
  <SecondaryActions />
</ResultPage>
```

### 结果页视觉

- 顶部应比首页更像“神谕卡”；
- 使用一张大卡作为主视觉；
- 文案短句化；
- 不要做长报告；
- 每个模块做成小 glass card；
- Lucky Color 用色块；
- Guardian Item 可以用精致图标或小插画。

### 高命中感文案公式

```text
You arrived today feeling {mood}.
Because your Birth Aura carries {birthAura}, you tend to {personalPattern}.
Today, {dailyCard} is not asking you to {wrongDirection}.
It is asking you to {rightDirection}.
```

中文：

```text
你今天带着{今日状态}来到这里。
因为你的本命气场带着{本命气场}，你可能更容易{个人倾向}。
今天的{今日牌面}不是要你{错误方向}，
而是提醒你{正确方向}。
```

### CTA

主按钮：

```text
Activate Today’s Aura
```

次按钮：

```text
Save Card
Share Story
```

不要在 P0 结果页放强付费主按钮。

---

## 10. P0-07 Activate Today’s Aura

### Route

```text
/activate/[id]
```

### 页面目的

把今日结果转成现实护符。

### 页面布局

```text
Activate Today’s Aura

Today’s Guardian Item
Structured Jacket

It is not here to make you harder.
It helps you protect your softness.

Step 1
Wear your lucky color
Charcoal Navy

Step 2
Carry your guardian item
Structured Jacket

Step 3
Hold to seal

[ Hold Circle ]

Place one finger here.
Hold for 3 seconds.
```

### UI 结构

```tsx
<ActivatePage>
  <HeroTitle>Activate Today’s Aura</HeroTitle>
  <GuardianItemHero />
  <ActivationSteps />
  <HoldToSealButton durationMs={3000} />
</ActivatePage>
```

### Hold Button

样式：

- 圆形或大 pill；
- 中心文字：`Hold to Seal`；
- 外圈进度；
- 颜色从紫到金；
- 完成时卡片微光。

交互规则：

- 未进入页面就不自动 seal；
- 手指按下开始进度；
- 释放中断进度归零；
- 持续 3000ms 后 seal；
- 成功震动；
- 跳转 Activated。

### 心理暗示

这是从“看见结果”到“接受神谕”的关键动作。  
不要省略。

---

## 11. P0-08 Aura Activated

### Route

```text
/activated/[id]
```

### 页面目的

完成仪式，建立打卡感。

### 页面布局

```text
Aura Sealed

[ 发光气场牌 ]

June 13 aura is active.
Carry Soft Boundary with you.

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Private. Personal. Just for you.

[ Share Story ]
[ Save Card ]
[ Done ]
```

### UI 结构

```tsx
<ActivatedPage>
  <SuccessAuraMark />
  <HeroTitle>Aura Sealed</HeroTitle>
  <ActivatedCardPreview />
  <KeyValueList />
  <Microcopy>Private. Personal. Just for you.</Microcopy>
  <ButtonGroup />
</ActivatedPage>
```

### 视觉

- 背景更亮；
- 可增加柔光 halo；
- 主卡片像“护身符已点亮”；
- 按钮优先 Share Story。

---

## 12. P0-09 Share Aura Card

### Route

```text
/share/[id]
```

### 页面目的

高分享欲。

### 页面布局

```text
Share Today’s Aura

[ 9:16 Story Card Preview ]

[ Save Image ]
[ Share ]
[ Copy Link ]
```

### 9:16 分享卡模板

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

### 分享卡视觉要求

- 1080 × 1920；
- 中心大 Aura Name；
- 顶部日期；
- 中间一张气场卡；
- 下方 key-value；
- 一句 quotation；
- AuraCue 水印；
- 背景保持粉紫柔光；
- 文本不超过 12 行；
- 不出现用户敏感生日；
- 可选显示 Birth Aura，但不显示具体生日。

### 分享文案自动生成

英文：

```text
Today’s card said I need soft boundaries.
Wearing charcoal navy as my luck color.
```

中文：

```text
今天抽到「柔软边界」。
幸运色是炭灰海军蓝，守护单品是结构感外套。
有点准。
```

---

## 13. P0-10 Saved

### Route

```text
/saved/[id]
```

### 页面目的

确认保存，让用户知道可以回看。

### 页面布局

```text
Saved to your AuraCue

You can come back to today’s aura anytime.

[ 小卡片预览 ]

[ Share Story ]
[ Back to Today ]
```

### 视觉

- 简洁；
- 不需要新插图；
- CTA 优先 Share Story。

---

## 14. P0-11 Aura Journal Lite

### Route

```text
/journal
```

### 页面目的

让每日卡片变成长期资产。

### 页面布局

```text
Aura Journal

This Week

[ Jun 13 · Soft Boundary · Sealed ]
[ Jun 12 · Clean Renewal ]
[ Jun 11 · Quiet Power ]
[ Jun 10 · Clear Line ]

Your recent pattern:
Boundaries · Renewal · Quiet Power
```

### UI 结构

```tsx
<JournalPage>
  <HeroTitle>Aura Journal</HeroTitle>
  <WeeklyStrip />
  <JournalCardList />
  <PatternSummary lockedOrLite />
</JournalPage>
```

### P0 功能

- 列出最近 7 天；
- 显示日期、auraName、guardianItem、sealed 状态；
- 点击进入卡片详情；
- 没有历史时显示 empty state。

### P1 Pro 功能

- 7-Day Aura Pattern；
- Monthly Aura Map；
- 颜色频率；
- 守护单品频率；
- 情绪变化曲线。

---

## 15. P0-12 Birth Aura Profile

### Route

```text
/profile/birth-aura
```

### 页面目的

查看长期身份，强化用户认同。

### 页面布局

```text
Your Birth Aura

Venus Air

Libra · Air · Opal

Style Origin
Soft Balance

Guardian Color
Soft Opal Pink

Style Mantra
I attract through balance, not effort.

[ Edit Birthday ]
```

### 视觉

- 大卡片；
- 星座 / 元素 / birthstone 三个小标签；
- 守护色用色块；
- P1 可加完整报告付费入口。

---

## 16. P1 Evening Reflection

### Route

```text
/evening/[date]
```

### 页面目的

强化“有点准”，提高第二天回访。

### 页面布局

```text
Did today’s aura show up?

Today’s Aura
Soft Boundary

Guardian Item
Structured Jacket

[ Yes, surprisingly ]
[ A little ]
[ Not today ]

What moment felt aligned?
[ Text input ]

[ Save Reflection ]
```

中文：

```text
今天的气场显现了吗？

今日气场
柔软边界

守护单品
结构感外套

[ 有点准 ]
[ 有一点 ]
[ 今天没有 ]

今天哪个瞬间和牌面有点对上？
[ 输入框 ]

[ 保存回看 ]
```

### 心理作用

用户主动寻找一天中与牌面相关的瞬间，形成自我验证闭环。

---

## 17. P1 Subscription / Full Style Oracle

### Route

```text
/subscription
```

### 页面目的

把“好玩”转成持续付费。

### 页面布局

```text
Unlock the Full Style Oracle

Today’s card has more to say.

Free Today
✓ Date Aura
✓ Today’s Card
✓ Luck Shift
✓ Lucky Color
✓ Guardian Item

AuraCue Pro
✓ Full card reading
✓ 3 outfit formulas
✓ What to avoid today
✓ Activation action
✓ 7-Day Aura Pattern
✓ Monthly Aura Map
✓ Birth Aura deep report
✓ High-res story cards

[ Start 7-Day Trial ]
[ Continue Free ]
```

### 付费文案规则

推荐：

```text
Today’s card has more to say.
```

禁止：

```text
Unlock to avoid bad luck.
```

### 视觉

- 不要像 SaaS 价格表；
- 像解锁一个更完整的神谕卷轴；
- 年费按钮优先但不压迫；
- 不做恐惧营销。

---

## 18. Bottom Navigation

### P0 Tab

```text
Today
Journal
Birth Aura
```

### 说明

现有底部只有 Home / Profile，可以保留外观，但信息架构建议升级为三项：

| Tab | 目的 |
|---|---|
| Today | 今日仪式入口 |
| Journal | 每日留存资产 |
| Birth Aura | 长期身份标签 |

P0 如果要极简，也可以：

```text
Today | Profile
```

其中 Profile 内含 Birth Aura。

---

## 19. 关键动效规范

### 19.1 通用动效

- 页面进入：fade up 420ms；
- 卡片点击：scale 0.985；
- CTA 点击：scale 0.98；
- 选中态：边框 + 光晕；
- 不使用复杂粒子；
- 支持 reduced motion。

### 19.2 抽牌动效

```text
idle float → selected glow → card enlarge → others fade → flip → reading
```

### 19.3 Seal 动效

```text
touch start → progress ring → aura glow → haptic → Aura Sealed
```

### 19.4 分享卡生成动效

```text
preview fade in → shimmer line → buttons appear
```

---

## 20. 设计验收清单

### 20.1 高审美验收

- 是否一眼像高端 lifestyle / wellness 产品？
- 是否延续浅奶油、粉紫、柔光、serif、大卡片？
- 是否没有低端玄学感？
- 是否没有 AI dashboard 感？
- 是否每页留白足够？
- 是否每张卡可以截图？
- 是否移动端 360–430px 正常？
- 是否所有 CTA 都有一致视觉语言？

### 20.2 高命中感验收

- 结果页是否复述用户今日状态？
- 是否引用 Birth Aura？
- 是否引用 Date Aura？
- 是否引用用户亲手抽到的牌？
- 是否给出 Luck Shift？
- 是否给出具体 Guardian Item？
- 是否给出具体 Activation Action？
- 是否避免泛泛而谈？

### 20.3 高分享欲验收

- 分享卡是否像数字护身符？
- 是否有日期？
- 是否有 Today’s Aura？
- 是否有 Luck Shift？
- 是否有 Lucky Color 和 Guardian Item？
- 是否不暴露生日隐私？
- 是否适合 9:16 Story？
- 别人看到是否会想“我也要抽”？

### 20.4 安全验收

- 不保证好运；
- 不恐吓；
- 不身体评价；
- 不外貌焦虑；
- 不诱导用户为焦虑反复付费；
- 不把结果用于重大人生决策；
- 不出现“必须按牌面做”。

---

## 21. 全页面流程 Wireframe 总览

```text
[Birth Aura Input]
  ↓
[Birth Aura Reveal]
  ↓
[Today Gate: Date Aura]
  ↓
[Mood & Scene Check-in]
  ↓
[Tarot Pull]
  ↓
[Reading Your Aura]
  ↓
[Today’s Style Oracle Result]
  ↓
[Activate Today’s Aura]
  ↓
[Hold to Seal]
  ↓
[Aura Activated]
  ↓
[Share Aura Card] ──→ [Saved]
  ↓
[Journal Lite]
```

---

## 22. 给设计师的最终指令

请基于当前截图风格继续扩展，不要换视觉方向。

必须延续：

```text
浅奶油白背景
粉紫柔光渐变
大 serif 标题
横向 / 纵向大卡片
玻璃胶囊
紫粉桃渐变 CTA
顶部 AURACUE 品牌
柔和星光点缀
高端生活方式感
```

但所有页面都必须服务新的核心公式：

```text
Birth Aura + Date Aura + Mood + Scene + Tarot Card
= Daily Style Oracle
```

最终体验目标：

```text
美到想保存，
准到想回来，
酷到想分享。
```
