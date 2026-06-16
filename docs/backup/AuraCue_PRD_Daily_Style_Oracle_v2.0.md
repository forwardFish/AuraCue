# AuraCue PRD v2.0 — 年轻人的每日风格神谕

> 文档类型：产品需求文档 / Product Requirements Document  
> 版本：v2.0  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日风格神谕 / Daily Style Oracle for Young Users**  
> 核心公式：**星座 / 本命气场 + 今日日期气场 + 今日气场选择 + 塔罗抽卡 → 心理暗示 → 今日气场穿搭 + 今日气场牌**  
> 适用端：Web / H5 优先，小程序后续复用同一套 API 与状态机  
> P0 目标：做出一个高审美、高命中感、高分享欲、可每日重复使用的完整 MVP

---

## 0. 一句话结论

AuraCue 不再定义为“AI 穿搭工具”，而应定义为：

> **一个每天出门前使用的 Daily Style Oracle。用户通过生日、本命气场、今日日期、今日状态和塔罗抽牌，获得一张今日气场牌，以及可穿在身上的幸运色、守护单品、穿搭公式和出门暗示。**

它的产品核心不是：

> AI 帮我搭衣服。

而是：

> **今天我该用什么状态面对世界，并且如何把这个状态穿在身上。**

---

## 1. 产品核心价值

### 1.1 核心价值主张

```text
AuraCue is your daily style oracle.
Draw one card, activate today’s aura, and wear your luck.
```

中文：

```text
AuraCue 是年轻人的每日风格神谕。
抽一张牌，激活今日气场，把好运状态穿在身上。
```

### 1.2 用户获得的不是“穿搭答案”，而是“今日状态确认”

用户表面问题：

```text
今天穿什么？
```

用户真实问题：

```text
今天我该以什么状态出门？
今天我要被看见，还是保持边界？
今天我需要清醒、保护、表达、恢复，还是一点主角感？
```

AuraCue 的回答不是简单 outfit recommendation，而是：

```text
今日牌面 + 今日气场 + 心理暗示 + 幸运色 + 守护单品 + 穿搭公式 + 封印动作
```

### 1.3 三个体验标准

| 目标 | 用户心里出现的话 | 产品要做到 |
|---|---|---|
| 高审美 | 这个页面好美，我想截图 | soft luxury、pastel gradient、editorial card、柔光、大留白 |
| 高命中感 | 它怎么知道我今天是这样 | 复述用户状态 + 本命气场 + 日期气场 + 塔罗牌 + 具体单品 |
| 高分享欲 | 这张卡像我，我想发出去 | 9:16 气场卡、日期、Birth Aura、Luck Shift、守护单品、短句 |

---

## 2. 产品核心公式

### 2.1 v2.0 主公式

```text
Birth Aura
+ Date Aura
+ Today Mood
+ Today Scene
+ Tarot Pull
= Daily Style Oracle
```

中文：

```text
本命气场
+ 今日日期气场
+ 今日状态
+ 今日场景
+ 今日塔罗牌
= 今日风格神谕
```

### 2.2 各模块作用

| 模块 | 用户输入 / 系统输入 | 心理作用 | 输出 |
|---|---|---|---|
| Birth Aura | 生日月 / 日 | 这是我的长期气场底色 | 星座信号、元素、守护星、生日石、本命守护色 |
| Date Aura | 用户本地日期 | 今天是独一无二的 | 日期气场名、星期信号、数字信号、星座季节 |
| Today Mood | 用户当天状态 | 它看见了我今天怎么样 | Drained、Hidden、Magnetic 等状态 |
| Today Scene | 用户当天要面对什么 | 结果和今天有关 | Work、Important Moment、Just Survive Today 等场景 |
| Tarot Pull | 用户亲手抽牌 | 这是我选中的今日牌 | 今日牌面、能量名 |
| Daily Oracle | AI / mock 结构化生成 | 它在把神谕翻译成现实 | Luck Shift、幸运色、守护单品、穿搭公式、出门暗示 |
| Seal | 长按封印 | 我接受并带走今日气场 | Aura Activated、打卡记录、分享卡 |
| Journal | 晚间反馈 / 历史记录 | 好像真的有点准 | 日期归档、7 日轨迹、月度地图 |

---

## 3. P0 / P1 / P2 范围

### 3.1 P0 必须实现

P0 只做一条极强主链路：

```text
Birth Aura Onboarding
→ Today Gate
→ Mood & Scene
→ Tarot Pull
→ Reading
→ Today’s Style Oracle Result
→ Hold to Seal
→ Activated
→ Share / Save
→ Journal lite
```

P0 必须包含：

- 生日月 / 日输入，可跳过；
- Birth Aura 生成与揭示；
- 今日日期气场 Date Aura；
- 今日状态选择；
- 今日场景选择；
- 三张塔罗背面抽一张；
- Reading 读取页；
- 今日风格神谕结果页；
- Luck Shift；
- 幸运色；
- 今日守护单品；
- 今日穿搭公式；
- 今日避免项；
- 出门暗示；
- Activation Action；
- Hold to Seal；
- 9:16 分享卡；
- 保存卡片；
- Journal lite：当天卡片归档。

### 3.2 P1 建议实现

P1 用于留存和订阅：

- Evening Reflection：今天的气场显现了吗？
- 7-Day Aura Pattern：7 日气场轨迹；
- Aura Calendar：气场日历；
- Birth Aura 深度报告；
- Full Style Oracle 付费页；
- Clarifier Card 补充牌；
- 每日 push；
- 分享卡多模板；
- 月度 Aura Map。

### 3.3 P2 暂不实现

P2 暂不做：

- 复杂星盘；
- 出生时间 / 出生地点；
- 78 张完整传统塔罗；
- 复杂衣橱管理；
- 电商导购；
- 社区；
- 关系占卜；
- 颜值 / 身材评分；
- 恐吓式改运付费；
- 保证好运 / 保证成功文案。

---

## 4. 用户心理链路

### 4.1 完整心理递进

```text
个人锚点
→ 当前状态
→ 今日日期
→ 主动选择
→ 神秘揭示
→ 被说中
→ 现实穿戴
→ 封印承诺
→ 分享身份
→ 晚间验证
```

### 4.2 每一步的心理暗示

| 步骤 | 页面动作 | 心理暗示 |
|---|---|---|
| 输入生日 | 填 Month / Day | 这是我的个人入口 |
| 揭示 Birth Aura | 看到星座信号、元素、守护色 | 我有一个长期风格原型 |
| 显示 Date Aura | 看到今天日期气场 | 今天是独一无二的 |
| 选择 Mood | 选择今日状态 | 它看见了我今天怎么样 |
| 选择 Scene | 选择今天要面对什么 | 结果和今天有关 |
| 抽塔罗 | 亲手点一张牌 | 这是我选中的牌 |
| Reading | 读取本命气场、日期信号、牌面 | 它正在解读我 |
| Result | 看到 Luck Shift 和穿搭 | 它说中了，而且我知道怎么穿 |
| Guardian Item | 看到今日守护单品 | 我可以把提示穿在身上 |
| Hold to Seal | 长按 3 秒 | 我接受并带走今日气场 |
| Share | 生成今日气场牌 | 这是我的今日身份 |
| Evening | 晚上回看 | 好像真的有点准 |

---

## 5. 页面地图

### 5.1 P0 页面清单

| 页面编号 | Route | 页面名 | 目的 |
|---|---|---|---|
| P0-00 | `/onboarding/birth-aura` | Create Your Birth Aura | 输入生日，建立本命气场 |
| P0-01 | `/onboarding/birth-aura/reveal` | Birth Aura Reveal | 揭示长期身份标签 |
| P0-02 | `/today` | Today Gate | 显示日期气场，进入今日仪式 |
| P0-03 | `/today/check-in` | Mood & Scene Check-in | 选择今日状态和场景 |
| P0-04 | `/today/draw` | Tarot Pull | 三张牌中抽一张 |
| P0-05 | `/today/reading` | Reading Your Aura | 读取本命气场、日期气场、牌面 |
| P0-06 | `/result/[id]` | Today’s Style Oracle | 今日风格神谕结果 |
| P0-07 | `/activate/[id]` | Activate Today’s Aura | 选择 / 确认守护单品，长按封印 |
| P0-08 | `/activated/[id]` | Aura Activated | 今日气场已封印 |
| P0-09 | `/share/[id]` | Share Aura Card | 9:16 分享卡预览 |
| P0-10 | `/saved/[id]` | Saved | 保存成功 |
| P0-11 | `/journal` | Aura Journal Lite | 今日卡片和历史归档 |
| P0-12 | `/profile/birth-aura` | Birth Aura Profile | 本命气场资料页 |

### 5.2 P1 页面清单

| 页面编号 | Route | 页面名 | 目的 |
|---|---|---|---|
| P1-01 | `/evening/[date]` | Evening Reflection | 晚间反馈，增强“有点准” |
| P1-02 | `/journal/week` | 7-Day Aura Pattern | 7 日气场轨迹 |
| P1-03 | `/journal/month` | Monthly Aura Map | 月度风格地图 |
| P1-04 | `/subscription` | Full Style Oracle Pro | 订阅 / 年费 |
| P1-05 | `/clarifier/[id]` | Clarifier Card | 补充牌，不替代主牌 |
| P1-06 | `/share/templates` | Share Templates | 多套分享模板 |

---

## 6. 页面功能需求

### 6.1 P0-00 Create Your Birth Aura

#### 目的

让用户相信：

```text
我的生日不是普通资料，而是本命气场钥匙。
```

#### 输入

- Month
- Day
- Skip for now

#### 输出

生成 `BirthAura`：

```ts
type BirthAura = {
  zodiacSign: string;
  element: "fire" | "earth" | "air" | "water";
  modality: "cardinal" | "fixed" | "mutable";
  rulingSignal: string;
  birthstoneSignal: string;
  auraName: string;
  styleOrigin: string;
  guardianColor: string;
  styleMantra: string;
};
```

#### 页面文案

```text
Create Your Birth Aura

Your birthday becomes the key
to how each card speaks to you.

[ Month ] [ Day ]

[ Reveal My Birth Aura ]
[ Skip for now ]
```

中文：

```text
创建你的本命气场

你的生日会成为每张牌与你对话的方式。

[ 月 ] [ 日 ]

[ 揭示我的本命气场 ]
[ 暂时跳过 ]
```

#### 规则

- P0 只收月 / 日，不收年份；
- 可跳过；
- 跳过时生成临时 `Unknown Birth Aura`，但结果页不出现星座信号；
- 不允许写“生日决定你的命运”；
- 推荐文案：`Birth Aura shapes how today’s card speaks to you.`

---

### 6.2 P0-01 Birth Aura Reveal

#### 目的

让用户获得长期身份标签。

#### 展示字段

- `auraName`
- `zodiacSign`
- `element`
- `birthstoneSignal`
- `guardianColor`
- `styleMantra`

#### 示例

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

中文：

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

---

### 6.3 P0-02 Today Gate

#### 目的

把“日期”变成每日留存入口。

#### 核心模块

- Today Date：用户本地日期；
- Date Aura：今日日期气场；
- Birth Aura mini chip；
- 今日是否已封印状态；
- CTA：`Activate Today’s Aura`。

#### Date Aura 数据

```ts
type DateAura = {
  localDate: string;
  weekdaySignal: string;
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  zodiacSeason: string;
  auraName: string;
  theme: string;
  styleBias: string[];
};
```

#### Date Aura 生成规则

P0 使用三层日期信号：

```text
weekdaySignal + dayNumber + zodiacSeason
```

示例：

```text
Saturday + Day Number 4 + Gemini Season
→ Date Aura: Clear Structure
```

#### 页面文案

```text
June 13 · Saturday

Today’s Date Aura
Clear Structure

A new aura has opened for today.

[ Activate Today’s Aura ]
```

中文：

```text
6月13日 · 星期六

今日日期气场
清晰结构

今天的气场已经开启。

[ 激活今日气场 ]
```

#### 规则

- 每天 00:00 按用户本地时区刷新；
- 同一用户同一天只有一张 Official Card；
- 已封印时首页显示 `Today’s Aura Sealed`，可进入 `/activated/[id]`；
- 未封印时进入今日仪式。

---

### 6.4 P0-03 Mood & Scene Check-in

#### 目的

建立“它看见我今天”的命中感。

#### 第一组问题：Today Mood

```text
How are you arriving today?
```

中文：

```text
你今天是以什么状态来到这里？
```

选项：

| ID | 英文 | 中文 | 心理含义 |
|---|---|---|---|
| drained | Drained | 被消耗 | 需要保护 |
| soft | Soft | 柔软敏感 | 需要支撑 |
| restless | Restless | 有点烦躁 | 需要清醒 |
| hidden | Hidden | 想隐身 | 需要安全感 |
| focused | Focused | 想专注 | 需要秩序 |
| magnetic | Magnetic | 想被看见 | 需要光感 |
| unbothered | Unbothered | 不想被打扰 | 需要边界 |
| main_character | Main Character | 想成为主角 | 需要表达 |

#### 第二组问题：Today Scene

```text
What is today asking from you?
```

中文：

```text
今天要你面对什么？
```

选项：

| ID | 英文 | 中文 |
|---|---|---|
| work_study | Work / Study | 工作 / 学习 |
| important_moment | Important Moment | 重要时刻 |
| stay_low_key | Stay Low-Key | 保持低调 |
| just_survive | Just Survive Today | 今天只想撑过去 |
| need_protection | Need Protection | 需要保护 |
| want_seen | Want to Be Seen | 想被看见 |
| social | Date / Social | 约会 / 社交 |
| soft_reset | Soft Reset | 想重新调整 |

#### 页面规则

- Mood 必选；
- Scene 可选，但推荐默认不跳过；
- 每组选项最多 8 个；
- 选项要像状态，不要像普通问卷；
- 不出现身材、脸型、颜值、体重等选项。

---

### 6.5 P0-04 Tarot Pull

#### 目的

让用户相信结果是“我亲手抽到的”。

#### 页面文案

```text
Choose the card that calls you.

Take a breath.
Today’s card will translate your energy into style.

Trust your first pull.
```

中文：

```text
选择那张正在呼唤你的牌。

深呼吸。
今日牌面会把你的状态翻译成风格。

相信第一眼。
```

#### 交互

- 页面展示 3 张牌背面；
- 点击一张后选中放大；
- 其他两张淡出；
- 牌面翻转；
- 进入 `/today/reading`；
- 未选牌不能继续；
- 不允许无限重抽；
- 同一天重复进入时展示已选牌。

#### TarotCard 数据

```ts
type TarotCard = {
  id: string;
  name: string;
  auraName: string;
  coreEnergy: string;
  styleKeywords: string[];
  safeInterpretation: string;
};
```

P0 使用 12 张自有 AuraCue 牌组，不必完整 78 张传统塔罗。

---

### 6.6 P0-05 Reading Your Aura

#### 目的

把 loading 改成“神谕正在形成”。

#### 文案

```text
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

#### 规则

- 1.5–3 秒；
- 逐行出现；
- 轻微光晕；
- 不出现 `AI is generating`；
- 失败时给柔和重试：`The signal faded. Try revealing again.`

---

### 6.7 P0-06 Today’s Style Oracle Result

#### 目的

输出高命中感结果。

#### 必显字段

```ts
type DailyStyleOracle = {
  id: string;
  localDate: string;

  birthAura: BirthAura | null;
  dateAura: DateAura;
  mood: string;
  scene: string | null;
  tarotCard: TarotCard;

  oracleTitle: string;
  auraName: string;

  luckShift: {
    from: string;
    to: string;
    label: string;
  };

  message: {
    mirror: string;
    interpretation: string;
    guidance: string;
  };

  style: {
    luckyColor: string;
    guardianItem: string;
    styleFormula: string;
    avoidToday: string;
  };

  activation: {
    phrase: string;
    action: string;
  };

  share: {
    title: string;
    caption: string;
  };
};
```

#### 结果页顺序

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
13. CTA: Hold / Activate
14. Save / Share
```

#### 示例

```text
June 13 Style Oracle

Date Aura: Clear Structure
Birth Aura: Venus Air
Today’s Card: Strength

Strength — Soft Boundary

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

中文：

```text
6月13日风格神谕

日期气场：清晰结构
本命气场：金星风象
今日牌面：力量

力量 — 柔软边界

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

---

### 6.8 P0-07 Activate Today’s Aura

#### 目的

把结果变成可穿戴的现实护符。

#### 三步结构

```text
1. Wear Your Lucky Color
2. Carry Your Guardian Item
3. Hold to Seal
```

中文：

```text
1. 穿上今日幸运色
2. 带上今日守护单品
3. 长按封印今日气场
```

#### 页面文案

```text
Your guardian item today:
Structured Jacket

It is not here to make you harder.
It helps you protect your softness.

Place one finger here.
Hold to seal today’s aura.
```

中文：

```text
你的今日守护单品：
结构感外套

它不是让你变得强硬，
而是帮你保护自己的柔软。

把手指停在这里。
长按封印今日气场。
```

#### Hold 规则

- 长按 3000ms；
- 进度环 0–100%；
- 释放 <3000ms 不 seal；
- 成功后轻震；
- 成功后进入 `/activated/[id]`。

---

### 6.9 P0-08 Aura Activated

#### 目的

完成仪式闭环，形成打卡感。

#### 页面文案

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

中文：

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

---

### 6.10 P0-09 Share Aura Card

#### 目的

形成传播。

#### 分享卡必含

- 日期；
- Today’s Aura；
- Date Aura；
- Birth Aura；
- Today’s Card；
- Luck Shift；
- Lucky Color；
- Guardian Item；
- Activation Phrase；
- AuraCue 水印；
- CTA：`Draw yours on AuraCue`。

#### 分享卡示例

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

“我可以保持柔软，但不必对所有人开放。”

Sealed by AuraCue
来抽你的今日风格神谕
```

---

### 6.11 P0-10 Saved

#### 目的

确认用户保存成功，并引导回首页或分享。

#### 文案

```text
Saved to your AuraCue

You can come back to today’s aura anytime.

[ Share Story ]
[ Back to Today ]
```

中文：

```text
已保存到你的 AuraCue

你可以随时回看今天的气场。

[ 分享 Story ]
[ 回到今日 ]
```

---

### 6.12 P0-11 Aura Journal Lite

#### 目的

让每日卡片成为长期资产。

#### P0 展示

- 今天卡片；
- 过去 7 天简略列表；
- 每天显示：日期、Aura Name、幸运色、守护单品、是否 sealed；
- 点击进入对应卡片。

#### P1 增强

- 7 日气场轨迹；
- 月度 Aura Map；
- 晚间反馈；
- Streak / Sealed Days。

---

### 6.13 P0-12 Birth Aura Profile

#### 目的

用户查看长期身份标签。

#### 展示

- Birth Aura 名称；
- Zodiac Signal；
- Element；
- Ruling Signal；
- Birthstone Signal；
- Guardian Color；
- Style Origin；
- Style Mantra；
- Edit birthday。

---

## 7. 内容系统

### 7.1 12 张 AuraCue 核心牌组

| Card | Aura Name | 心理能量 | 穿搭翻译 |
|---|---|---|---|
| The Moon | Hidden Depth | 直觉、保护、敏感 | 深蓝、银饰、层叠、朦胧质感 |
| The Sun | Radiant Ease | 光感、开放、被看见 | 白色、金色、亮色、轻松廓形 |
| Strength | Soft Boundary | 稳定、边界、内在力量 | 深色、结构外套、金属细节 |
| The Star | Clean Renewal | 修复、清透、希望 | 浅蓝、白色、轻材质 |
| High Priestess | Quiet Power | 安静、神秘、直觉 | 黑白、深蓝、银饰 |
| The Empress | Soft Abundance | 自我照顾、丰盛、柔软 | 奶油色、针织、珍珠 |
| The Chariot | Locked In | 行动、效率、目标 | 硬挺外套、直筒裤、运动感 |
| The Lovers | Chosen Harmony | 选择、关系、和谐 | 成套感、柔和撞色 |
| The Magician | Main Character Spark | 表达、启动、创造 | 亮点配饰、强单品 |
| The Hermit | Low-Key Shield | 独处、低调、保护 | 灰色、长外套、舒适包裹 |
| Justice | Clear Line | 清醒、平衡、边界 | 黑白、直线、利落剪裁 |
| Temperance | Soft Reset | 调和、恢复、稳定 | 米色、渐变、柔软材质 |

---

## 8. 命中感生成规则

### 8.1 必须使用的文案公式

```text
You arrived today feeling {mood}.
Because your Birth Aura carries {birthAura}, you tend to {personalPattern}.
Today, {dailyCard} is not asking you to {wrongDirection}.
It is asking you to {rightDirection}.

Wear {luckyColor} through {guardianItem}.
When you {activationAction}, remind yourself:
{activationPhrase}
```

中文：

```text
你今天带着{今日状态}来到这里。
因为你的本命气场带着{本命气场}，你可能更容易{个人倾向}。
今天的{今日牌面}不是要你{错误方向}，
而是提醒你{正确方向}。

把{幸运色}穿在{守护单品}上。
当你{具体动作}时，提醒自己：
{出门暗示}
```

### 8.2 不允许的泛化文案

禁止：

```text
你是一个外表坚强但内心敏感的人。
你今天要相信自己。
你有无限潜力。
今天适合做真实的自己。
```

必须具体到：

- 用户今日状态；
- 本命气场；
- 今日日期气场；
- 今日牌面；
- 幸运色；
- 守护单品；
- 具体动作。

---

## 9. 安全与品牌边界

### 9.1 不允许的文案

禁止：

- 穿这个一定会改变命运；
- 不穿会倒霉；
- 解锁才能避免坏运；
- 今天会失败；
- 保证成功、保证恋爱、保证财运；
- 对身体、脸、体重、身材缺陷做评价；
- 诱导反复抽牌缓解焦虑。

### 9.2 推荐底层态度

```text
This is a cue, not a command.
Use it to enter today’s energy.
```

中文：

```text
这是提示，不是命令。
用它进入今天的状态。
```

### 9.3 “改运”表达方式

不用：

```text
Change your fate.
```

使用：

```text
Today’s Luck Shift
```

中文：

```text
今日气运转向
```

解释：

```text
从当前状态转向更有支持感的状态。
```

---

## 10. 订阅模式设计

### 10.1 订阅成立的核心

订阅不是卖“更多穿搭”，而是卖：

```text
每天都有新的日期气场和更完整的风格神谕。
```

### 10.2 免费版

免费给足命中感：

- 今日日期气场；
- 今日牌面；
- Luck Shift；
- 幸运色；
- 守护单品；
- 一句出门暗示；
- 普通分享卡。

### 10.3 Pro 版

Pro 解锁：

- Full Daily Style Oracle；
- 深度牌面解释；
- 3 套场景穿搭公式；
- 今日避免项；
- Activation Action；
- 高清无水印分享卡；
- 7-Day Aura Pattern；
- Birth Aura 深度报告；
- Monthly Aura Map；
- Clarifier Card；
- Aura Journal 高级归档。

### 10.4 付费文案

推荐：

```text
Today’s card has more to say.
Unlock the full oracle.
```

中文：

```text
今日牌面还有更深一层。
解锁完整风格神谕。
```

禁止：

```text
不解锁就错过好运。
付费才能避免坏运。
```

---

## 11. Analytics 埋点

| 事件 | 触发点 | Payload |
|---|---|---|
| `birth_aura_started` | 进入生日页 | `{source}` |
| `birth_aura_revealed` | 生成 Birth Aura | `{zodiacSign, element, auraName}` |
| `date_aura_viewed` | 打开 Today Gate | `{localDate, dateAuraName}` |
| `mood_selected` | 选择 mood | `{mood}` |
| `scene_selected` | 选择 scene | `{scene}` |
| `draw_session_started` | 进入抽牌页 | `{drawSessionId}` |
| `tarot_card_selected` | 选中牌 | `{position}` |
| `oracle_generated` | 结果生成 | `{cardId, fallbackUsed}` |
| `oracle_result_viewed` | 结果页曝光 | `{cardId, auraName}` |
| `activation_started` | 进入激活 | `{cardId, guardianItem}` |
| `activation_hold_cancelled` | 长按取消 | `{durationMs}` |
| `aura_sealed` | 长按成功 | `{cardId, holdDurationMs}` |
| `share_card_viewed` | 分享页曝光 | `{cardId}` |
| `share_card_saved` | 保存图片 | `{cardId}` |
| `share_card_shared` | 分享 | `{channel}` |
| `journal_opened` | 打开日记 | `{dateRange}` |
| `subscription_paywall_viewed` | 进入付费页 | `{source}` |
| `subscription_started` | 订阅成功 | `{plan}` |

---

## 12. 成功指标

### 12.1 P0 验证指标

| 指标 | 及格线 | 优秀线 |
|---|---:|---:|
| 首次体验完成率 | 60% | 80% |
| Birthday 输入率 | 50% | 75% |
| Mood 选择率 | 70% | 90% |
| 抽牌完成率 | 65% | 85% |
| 结果页停留 10 秒以上 | 35% | 55% |
| Hold to Seal 完成率 | 25% | 45% |
| 保存率 | 10% | 20% |
| 分享率 | 3% | 8% |
| D1 回访 | 12% | 25% |
| D7 回访 | 4% | 10% |

### 12.2 P1 订阅指标

| 指标 | 目标 |
|---|---:|
| 安装到付费 | 1.5%–3% |
| Paywall 到订阅 | 5%–10% |
| 年付占比 | >25% |
| 7 日连续 sealed | >8% |
| 晚间反馈填写 | >15% |

---

## 13. P0 开发验收

### 13.1 功能验收

- 用户可完成：Birth Aura → Date Aura → Mood / Scene → Draw → Reading → Result → Seal → Share；
- 同一用户同一天结果稳定；
- 新一天自动生成新 Date Aura；
- 长按不足 3000ms 不 seal；
- 分享图可生成；
- 保存和分享有记录；
- 不强制登录；
- 不强制上传照片；
- 无 AI key 时 mock 可跑通；
- 不出现身体 / 外貌评价；
- 不出现保证改运文案。

### 13.2 视觉验收

- 全页面遵守 soft luxury / pastel gradient / editorial card；
- 9:16 分享卡可直接发 Story；
- 移动端 360–430px 正常；
- CTA 不被底部导航遮挡；
- 文案不溢出；
- 图像不压缩变形；
- 每页只有一个主动作。

---

## 14. 最终产品原则

```text
生日让用户相信：这是我的。
日期让用户相信：这是今天的。
抽牌让用户相信：这是我选中的。
穿搭让用户相信：我可以把它带出去。
封印让用户相信：我已经进入今天的状态。
分享让用户相信：这是我的今日身份。
```

最终产品体验必须让用户产生：

```text
今天不是随便穿的。
今天这件衣服是我的守护单品。
今天这个颜色是在帮我进入状态。
今天这张牌有点像我。
我明天还想再抽一次。
```
