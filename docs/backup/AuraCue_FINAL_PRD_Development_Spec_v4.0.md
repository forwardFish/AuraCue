# AuraCue FINAL PRD + Development Specification v4.0

> 文档类型：最终需求开发文档 / Product Requirements + Implementation Specification  
> 版本：v4.0 FINAL  
> 适用端：Web / H5 MVP 优先，后续可复用到 App / 小程序  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享**  
> P0 目标：做出一个完整、可上线、可测试、可每日重复使用的 MVP。  

---

## 0. 最终决策摘要

### 0.1 产品一句话

AuraCue 是一个每天出门前使用的 **Daily Tarot Style Oracle**。用户通过生日生成本命气场，通过当天日期生成今日日期气场，再选择今日状态和场景，亲手抽取一张今日塔罗风格牌，获得今日心理暗示、幸运色、守护单品、穿搭公式、今日动作，并通过长按封印把今日气场带走。

用户表面上在问：

```text
今天穿什么？
```

用户真实在寻找：

```text
今天我该以什么状态面对世界？
今天我要被看见、被保护、保持边界、恢复能量，还是启动行动？
今天有没有一个能让我相信“这是为我准备的”提示？
```

AuraCue 的核心价值不是搭配正确性，而是：

```text
每天给用户一个可以穿在身上的心理暗示。
```

---

### 0.2 最终核心公式

```text
Birth Aura 本命气场
+ Date Aura 今日日期气场
+ Today Mood 今日状态
+ Today Scene 今日场景
+ Tarot Pull 今日塔罗抽卡
= Daily Tarot Style Oracle 今日塔罗风格神谕
```

最终输出：

```text
Tarot Card 牌面
→ Psychological Cue 心理暗示
→ Luck Shift 气运转向
→ Lucky Color 幸运色
→ Guardian Item 守护单品
→ Style Formula 穿搭公式
→ Daily Mission 今日要做的事
→ Activation Action 今日动作
→ Hold to Seal 封印
→ Share Aura Card 分享气场牌
```

---

### 0.3 最终底部导航

P0 只做两个底部 Tab：

```text
Home / My
```

| Tab | Route | 职责 |
|---|---|---|
| Home | `/home` 或 `/` | App 主入口、今日日期气场、今日抽牌 CTA、查看今日已封印气场、继续未完成仪式 |
| My | `/my` | 本命气场、生日设置、气场记录、已保存卡、设置、Legal、P1 登录入口 |

P0 不做独立 Journal Tab。Journal / Aura History 放在 My 页面内部。P1 当用户历史记录、订阅、7 日气场轨迹、月度 Aura Map 成熟后，再考虑把 Journal 独立出来。

---

### 0.4 每日抽卡策略

P0 每天只允许用户生成 **1 张 Official Daily Card / 今日官方主牌**。

原因：

- 增强神谕权威感；
- 避免用户刷到满意为止；
- 增强“今天只有这一张”的唯一性；
- 更利于分享：“我今天抽到的是这张”；
- 更利于每日留存：“明天会开启新的气场”。

P0 不做重抽。P1 可以做 **Clarifier Card / 补充牌**，但补充牌不替代今日主牌，只解释如何承载今天的主牌。

---

### 0.5 生日规则

P0 不强制登录，但生日是开始抽卡前必填。

```text
用户可以先看 Home。
用户要开始今日抽牌，必须输入生日月 / 日，生成 Birth Aura。
```

P0 不收：年份、出生时间、出生地点、真实姓名、手机号。

---

### 0.6 登录策略

P0 不做登录、注册、密码、找回密码、账号同步。

P0 使用：

```text
Anonymous Identity / Guest Mode
```

P1 再做：

- Login；
- Sign Up；
- Forgot Password；
- Reset Password；
- Account Sync；
- Subscription。

---

## 1. 产品目标与非目标

### 1.1 P0 目标

P0 只做一件事：

```text
让用户每天打开 AuraCue，
看到今天的 Date Aura，
输入生日生成 Birth Aura，
完成今日塔罗抽卡，
得到今日风格神谕，
长按封印，
保存或分享今日气场卡。
```

P0 成功标准：用户可以在 60–90 秒内完成首次完整仪式，并觉得：

```text
这是我的。
这是今天的。
这是我亲手抽到的。
它说中了我今天的状态。
我知道今天该怎么穿、该做什么。
我愿意保存或分享。
```

---

### 1.2 P0 必须实现

- Home 主页面；
- My 主页面；
- Guest / Anonymous Identity；
- Birth Aura 生日输入与生成；
- Birth Aura Reveal；
- Date Aura 今日日期气场；
- Daily Mission 今日要做的事；
- Today Mood 选择；
- Today Scene 选择；
- 三张塔罗牌背面抽一张；
- Reading 读取页；
- Daily Tarot Style Oracle 结果页；
- Luck Shift；
- Lucky Color；
- Guardian Item；
- Style Formula；
- Avoid Today；
- Activation Phrase；
- Activation Action；
- Hold to Seal；
- Aura Activated；
- Share Aura Card 9:16；
- Save Card；
- My 内部 Aura History；
- Legal 页面；
- 错误兜底；
- API、数据库、Mock AI、真实 AI Adapter 基础；
- 自动化测试和 E2E 测试。

---

### 1.3 P0 不做

- 邮箱登录；
- 密码登录；
- 注册；
- 忘记密码；
- 修改密码；
- Apple / Google 登录；
- 真实订阅支付；
- Pro Paywall；
- 上传衣橱；
- 上传全身照；
- 颜值、脸型、身材、体重评价；
- 电商导购；
- 社区；
- 复杂星盘；
- 出生时间 / 出生地点；
- 完整 78 张传统塔罗；
- 无限重抽；
- Clarifier Card；
- Evening Reflection；
- 7-Day Aura Pattern；
- Push Notification；
- 恐吓式改运；
- 承诺一定幸运、成功、恋爱、变美。

---

### 1.4 P1 建议实现

- Login / Sign Up / Forgot Password / Reset Password；
- Account Sync；
- Subscription / Pro；
- Clarifier Card 补充牌；
- Evening Reflection：今天的气场显现了吗；
- 7-Day Aura Pattern；
- Aura Calendar；
- Monthly Aura Map；
- Push Notification；
- 多套分享模板；
- Birth Aura 深度报告；
- Pro Full Daily Oracle。

---

## 2. 用户心理链路

### 2.1 信念生成公式

用户相信 AuraCue 是为自己设计的，来自以下链路：

```text
生日让我相信：这是我的。
日期让我相信：这是今天的。
状态让我相信：它看见了我。
场景让我相信：它知道我要面对什么。
抽牌让我相信：这是我选中的。
穿搭让我相信：我能把它带出去。
今日任务让我相信：今天我知道该做什么。
封印让我相信：我已经进入今天的状态。
分享让我相信：这是我的今日身份。
```

---

### 2.2 每一步心理暗示

| 步骤 | 页面动作 | 用户心理 |
|---|---|---|
| Home | 看到今天日期气场 | 今天不一样 |
| Birth Aura | 输入生日 | 这是我的个人入口 |
| Birth Aura Reveal | 看到本命气场 | 我有长期风格原型 |
| Mood | 选择今日状态 | 它看见了我今天怎样 |
| Scene | 选择今天要面对什么 | 结果和今天有关 |
| Tarot Pull | 亲手点一张牌 | 这是我选中的牌 |
| Reading | 读取 Birth Aura / Date Aura / Card | 它正在解读我 |
| Result | 看到 Luck Shift 和穿搭 | 它说中了，而且我知道怎么穿 |
| Daily Mission | 看到今天要做的事 | 今天我知道行动方向 |
| Guardian Item | 得到一个具体物件 | 我可以把提示穿在身上 |
| Hold to Seal | 长按 2–3 秒 | 我接受并带走今日气场 |
| Share | 生成今日气场牌 | 这是我的今日身份 |
| My History | 回看过往卡片 | 我的气场正在形成轨迹 |

---

## 3. Date Aura 日期系统设计

### 3.1 为什么日期是核心

生日生成的是用户的长期底色，类似“本命气场”。但用户每天都不一样，产品要让用户相信：

```text
今天有今天自己的气场。
明天会不一样。
所以我每天都要回来。
```

因此 Date Aura 不是普通日期显示，而是每日订阅、打卡、留存、结果差异化的核心。

---

### 3.2 用户感知目标

用户看到日期模块时要感受到：

```text
今天不是普通的一天。
今天有一个自己的信号。
这个信号会影响我今天抽到的牌、心理暗示、幸运色、守护单品和要做的事情。
```

页面文案示例：

```text
A new aura has opened for today.
```

中文：

```text
今天的气场已经开启。
```

---

### 3.3 Date Aura 组成

P0 使用三层日期信号：

```text
Weekday Signal 星期信号
+ Day Number 日期数字
+ Zodiac Season 当前星座季节
= Date Aura 今日日期气场
```

再结合用户 Birth Aura 得到：

```text
Personal Date Aura 个人今日气场
```

这解决两个问题：

1. 所有人每天都有同一个大日期气场；
2. 但每个人因为生日 / Birth Aura 不同，今天收到的提示也不同。

---

### 3.4 Weekday Signal

| 星期 | Signal | 心理含义 | 风格方向 | Daily Mission 方向 |
|---|---|---|---|---|
| Monday | Moon Signal | 重新开始、情绪整理 | 柔软、浅色、安定 | 清理一种情绪或重新设定本周节奏 |
| Tuesday | Mars Signal | 行动、推进、边界 | 红色、硬挺、利落 | 主动推进一件拖延的小事 |
| Wednesday | Mercury Signal | 沟通、切换、表达 | 配饰、层次、轻盈 | 说清楚一句之前没说出口的话 |
| Thursday | Jupiter Signal | 扩张、机会、信心 | 暖色、大廓形、开放 | 给自己一个更大的选择 |
| Friday | Venus Signal | 美感、吸引、社交 | 珍珠、粉色、香槟色 | 用一个细节让自己更愿意出现 |
| Saturday | Saturn Signal | 结构、秩序、保护 | 深色、外套、直线剪裁 | 建立一个边界或整理一个空间 |
| Sunday | Sun Signal | 光感、恢复、被看见 | 白色、金色、明亮单品 | 补充能量，允许自己被照亮 |

---

### 3.5 Day Number

计算方式：

```ts
// localDate = "2026-06-13"
// 2 + 0 + 2 + 6 + 0 + 6 + 1 + 3 = 20
// 2 + 0 = 2
// Day Number = 2
```

| Number | Name | 中文 | 心理含义 | Daily Mission 方向 |
|---|---|---|---|---|
| 1 | Initiation | 启动 | 开始、主动、点火 | 开始一件很小但真实的事 |
| 2 | Alignment | 对齐 | 平衡、柔和、关系 | 先对齐自己，再回应别人 |
| 3 | Expression | 表达 | 轻盈、显现、创造 | 用一个细节表达今天的自己 |
| 4 | Structure | 结构 | 秩序、边界、稳定 | 给今天建立一个清晰框架 |
| 5 | Shift | 转变 | 流动、变化、突破 | 换一种方式处理旧问题 |
| 6 | Care | 照顾 | 温度、关系、自我照顾 | 对自己做一个温柔动作 |
| 7 | Intuition | 直觉 | 安静、内在、神秘 | 听一次直觉，不急着解释 |
| 8 | Power | 力量 | 掌控、行动、效率 | 把能量放到最值得的一件事上 |
| 9 | Release | 释放 | 放下、整理、结束旧状态 | 结束一个不再服务你的消耗 |

---

### 3.6 Zodiac Season

根据当天日期判断当前星座季节，例如：

```text
Mar 21 - Apr 19 → Aries Season
Apr 20 - May 20 → Taurus Season
May 21 - Jun 20 → Gemini Season
...
```

它用于给今日气场加上季节性氛围：

| Season | 日期倾向 | 风格倾向 |
|---|---|---|
| Aries Season | 启动、行动 | 明亮、利落、速度感 |
| Taurus Season | 稳定、感官 | 质感、奶油色、舒适 |
| Gemini Season | 交流、切换 | 轻盈、层次、配饰 |
| Cancer Season | 保护、情绪 | 柔软、珍珠、包裹感 |
| Leo Season | 光、存在感 | 金色、白色、主角感 |
| Virgo Season | 秩序、细节 | 干净线条、白衬衫、低饱和 |
| Libra Season | 平衡、美感 | 柔和撞色、精致配饰 |
| Scorpio Season | 边界、深度 | 深色、皮质、神秘细节 |
| Sagittarius Season | 开放、远方 | 靴子、外套、暖色、旅行感 |
| Capricorn Season | 结构、掌控 | 深色大衣、直线剪裁 |
| Aquarius Season | 独特、冷感 | 冷色、未来感、反常规配饰 |
| Pisces Season | 梦境、直觉 | 雾蓝、灰紫、流动材质 |

---

### 3.7 Date Aura 输出结构

```ts
export type DateAura = {
  localDate: string;              // YYYY-MM-DD in user timezone
  displayDate: string;            // Jun 13 · Saturday
  timezone: string;
  weekdaySignal: string;          // Saturn Signal
  dayNumber: 1|2|3|4|5|6|7|8|9;
  dayNumberName: string;          // Alignment
  zodiacSeason: string;           // Gemini Season
  auraName: string;               // Clear Structure
  theme: string;                  // Today asks for structure before movement.
  dateQuestion: string;           // What needs a clearer boundary today?
  dailyMission: string;           // Build one small boundary before you give more energy away.
  styleBias: string[];            // ["clean lines", "deep navy", "structured layer"]
  guardianBias: string[];         // ["structured jacket", "belt", "silver ring"]
};
```

---

### 3.8 Personal Date Aura 输出结构

Personal Date Aura 是 Date Aura 与用户 Birth Aura 的结合，用来产生更强的“这是今天的我”的感觉。

```ts
export type PersonalDateAura = {
  dateAuraName: string;           // Clear Structure
  birthAuraName: string;          // Venus Air
  personalTheme: string;          // Today asks your Venus Air to create beauty with clearer boundaries.
  personalMission: string;        // Say yes only to what still leaves you feeling graceful.
  personalStyleBias: string[];    // ["soft structure", "opal pink detail", "clean outer line"]
};
```

示例：

```text
Date Aura: Clear Structure
Birth Aura: Venus Air
Personal Theme: Today asks your Venus Air to create beauty with clearer boundaries.
Daily Mission: Say yes only to what still leaves you feeling graceful.
```

中文：

```text
日期气场：清晰结构
本命气场：金星风象
个人主题：今天需要你用更清晰的边界承载自己的美感。
今日任务：只答应那些不会消耗你优雅感的事情。
```

---

### 3.9 Date Aura 在结果页中的作用

结果页必须引用 Date Aura 和 Daily Mission：

```text
June 13 Style Oracle
Date Aura: Clear Structure
Birth Aura: Venus Air
Today’s Card: Strength

Today’s Mission
Build one small boundary before you give more energy away.
```

中文：

```text
6月13日风格神谕
日期气场：清晰结构
本命气场：金星风象
今日牌面：力量

今日任务
在把更多能量给出去之前，先建立一个小边界。
```

---

## 4. Birth Aura 本命气场系统

### 4.1 生日输入

P0 只收：

```text
month: 1-12
day: 1-31
```

P0 不收：

```text
year
birth time
birth location
real name
phone number
```

---

### 4.2 Birth Aura 目的

Birth Aura 要让用户相信：

```text
我不是随机用户，我有自己的本命气场。
同一张牌，对我和别人说的话不一样。
```

页面核心文案：

```text
Your birthday becomes the key to how each card speaks to you.
```

中文：

```text
你的生日会成为每张牌与你对话的方式。
```

---

### 4.3 Zodiac 映射

| Zodiac | 日期范围 | Element | Modality | Ruling Signal | Birth Aura Name | Style Mantra |
|---|---|---|---|---|---|---|
| Aries | Mar 21 - Apr 19 | fire | cardinal | Mars | Mars Fire | I begin before I overthink. |
| Taurus | Apr 20 - May 20 | earth | fixed | Venus | Venus Earth | I attract through calm presence. |
| Gemini | May 21 - Jun 20 | air | mutable | Mercury | Mercury Air | I move lightly and speak clearly. |
| Cancer | Jun 21 - Jul 22 | water | cardinal | Moon | Moon Water | I protect my softness. |
| Leo | Jul 23 - Aug 22 | fire | fixed | Sun | Solar Fire | I can be seen without performing. |
| Virgo | Aug 23 - Sep 22 | earth | mutable | Mercury | Mercury Earth | I find power in clarity. |
| Libra | Sep 23 - Oct 22 | air | cardinal | Venus | Venus Air | I attract through balance, not effort. |
| Scorpio | Oct 23 - Nov 21 | water | fixed | Pluto | Shadow Water | I do not need to reveal everything. |
| Sagittarius | Nov 22 - Dec 21 | fire | mutable | Jupiter | Jupiter Fire | I carry luck through movement. |
| Capricorn | Dec 22 - Jan 19 | earth | cardinal | Saturn | Saturn Earth | I am steady without proving. |
| Aquarius | Jan 20 - Feb 18 | air | fixed | Uranus | Uranus Air | I belong without blending in. |
| Pisces | Feb 19 - Mar 20 | water | mutable | Neptune | Neptune Water | I trust what I feel before I explain it. |

---

### 4.4 Birthstone 映射

| Month | Birthstone | Guardian Color | Meaning |
|---|---|---|---|
| 1 | Garnet | Deep Garnet | protection and steady warmth |
| 2 | Amethyst | Soft Violet | intuition and calm |
| 3 | Aquamarine | Clear Aqua | flow and clarity |
| 4 | Diamond | Clear White | clarity and resilience |
| 5 | Emerald | Emerald Green | growth and abundance |
| 6 | Pearl | Pearl White | softness and protection |
| 7 | Ruby | Ruby Red | courage and presence |
| 8 | Peridot | Peridot Green | lightness and renewal |
| 9 | Sapphire | Sapphire Blue | wisdom and order |
| 10 | Opal | Soft Opal Pink | subtle attraction and change |
| 11 | Citrine | Warm Citrine | confidence and warmth |
| 12 | Turquoise | Turquoise Blue | protection and open horizons |

---

### 4.5 Birth Aura 数据结构

```ts
export type BirthAuraProfile = {
  id: string;
  userId: string;
  month: number;
  day: number;
  zodiacSign: ZodiacSign;
  zodiacLabel: string;
  element: "fire" | "earth" | "air" | "water";
  modality: "cardinal" | "fixed" | "mutable";
  rulingSignal: string;
  birthstoneSignal: string;
  auraName: string;
  styleOrigin: string;
  guardianColor: string;
  styleMantra: string;
  createdAt: string;
  updatedAt: string;
};
```

P0 不允许 `skipped = true` 的用户进入抽卡流程。

---

## 5. Tarot Deck 塔罗牌组系统

### 5.1 P0 牌组策略

P0 不做完整 78 张传统塔罗。P0 使用 12 张 AuraCue 自有塔罗风格神谕牌，降低理解成本，保持正向、可穿搭、可分享。

P0 不做逆位。P1 可加入 Shadow Signal，但不使用恐吓性语言。

---

### 5.2 12 张核心牌

| id | Card | Aura Name | Core Energy | Style Direction |
|---|---|---|---|---|
| moon | The Moon | Hidden Depth | 直觉、敏感、保护 | 深蓝、银色、层叠、朦胧 |
| sun | The Sun | Radiant Ease | 可见、温暖、开放 | 金色、白色、明亮单品 |
| strength | Strength | Soft Boundary | 边界、稳定、内在力量 | 结构外套、深色、金属细节 |
| star | The Star | Clean Renewal | 恢复、希望、清透 | 浅蓝、白色、轻材质 |
| high_priestess | The High Priestess | Quiet Power | 安静、神秘、直觉 | 黑白、深蓝、银饰 |
| empress | The Empress | Soft Abundance | 自我照顾、柔软、丰盛 | 奶油色、针织、珍珠 |
| chariot | The Chariot | Locked In | 行动、目标、效率 | 硬挺外套、直筒裤、运动感 |
| lovers | The Lovers | Chosen Harmony | 选择、关系、呼应 | 柔和撞色、成套感 |
| magician | The Magician | Main Character Spark | 表达、启动、创造 | 亮点配饰、强单品 |
| hermit | The Hermit | Low-Key Shield | 独处、秩序、低调 | 灰色、长外套、舒适包裹 |
| justice | Justice | Clear Line | 清醒、平衡、边界 | 黑白、直线、利落剪裁 |
| temperance | Temperance | Soft Reset | 调和、恢复、平稳 | 米色、渐变、柔软材质 |

---

### 5.3 TarotCard 数据结构

```ts
export type TarotCard = {
  id: string;
  name: string;
  auraName: string;
  coreEnergy: string;
  psychologicalCue: string;
  styleKeywords: string[];
  luckyColorPool: string[];
  guardianItemPool: string[];
  styleFormulaPool: string[];
  activationActionPool: string[];
  safeInterpretation: string;
};
```

---

## 6. 抽卡规则与每日唯一性

### 6.1 今日主牌规则

每个用户按本地日期每天只有一个 Official Daily Oracle。

```text
unique(userId, localDate)
```

如果当天已经生成：

- 未封印：Home 显示“Seal Today’s Aura”；
- 已封印：Home 显示“Today’s Aura Sealed”；
- 不显示主重抽入口。

---

### 6.2 三张候选牌生成

后端基于 deterministic seed 生成三张候选牌。

```ts
seed = hash(userId + localDate + birthAura.auraName + mood + scene)
```

候选牌生成时可加入权重：

- Date Aura 的 styleBias；
- Birth Aura element；
- mood / scene；
- 最近 2 天避免完全重复。

用户从三张牌中亲手选择一张。用户选择是仪式的一部分，必须保存。

---

### 6.3 P1 Clarifier Card

P1 可以允许 Pro 用户抽补充牌。

文案：

```text
Today’s card has already spoken.
Pull a clarifier to understand how to carry it.
```

中文：

```text
今日牌面已经出现。
你可以抽一张补充牌，看看如何更好地承载它。
```

补充牌不替代主牌，不允许“重新抽一张改变今天气场”。

---

## 7. Daily Oracle 输出结构

### 7.1 核心输出字段

```ts
export type DailyTarotStyleOracle = {
  id: string;
  userId: string;
  localDate: string;
  timezone: string;
  status: DailyOracleStatus;

  birthAura: BirthAuraProfile;
  dateAura: DateAura;
  personalDateAura: PersonalDateAura;
  mood: TodayMood;
  scene: TodayScene;
  tarotCard: TarotCard;

  oracleTitle: string;          // June 13 Style Oracle
  auraName: string;             // Soft Boundary

  luckShift: {
    from: string;               // Drained
    to: string;                 // Protected
    label: string;              // Drained → Protected
  };

  message: {
    mirror: string;             // 复述用户状态
    interpretation: string;     // 结合 Birth Aura / Date Aura / Tarot
    guidance: string;           // 今日心理暗示
  };

  style: {
    luckyColor: string;
    guardianItem: string;
    styleFormula: string;
    avoidToday: string;
  };

  dailyMission: {
    title: string;              // Today’s Mission
    text: string;               // Build one small boundary...
  };

  activation: {
    phrase: string;             // I can stay soft without being available to everyone.
    action: string;             // Adjust your sleeve before entering a room.
  };

  share: {
    title: string;
    caption: string;
    imageUrl?: string;
  };

  safetyNote: string;
  createdAt: string;
  sealedAt?: string;
};
```

---

### 7.2 命中感文案公式

大模型或 Mock Generator 必须遵守：

```text
You arrived today feeling {mood}.
Because your Birth Aura carries {birthAura}, you tend to {personalPattern}.
Today’s Date Aura is {dateAura}, asking you to {dateMission}.
Today, {dailyCard} is not asking you to {wrongDirection}.
It is asking you to {rightDirection}.

Wear {luckyColor} through {guardianItem}.
When you {activationAction}, remind yourself:
{activationPhrase}
```

中文逻辑：

```text
你今天带着{今日状态}来到这里。
因为你的本命气场是{Birth Aura}，你可能更容易{个人倾向}。
今天的日期气场是{Date Aura}，它提醒你{今日任务}。
今天的{塔罗牌}不是要你{错误方向}，
而是提醒你{正确方向}。

把{幸运色}穿在{守护单品}上。
当你{今日动作}时，提醒自己：
{出门暗示}
```

---

## 8. 大模型使用方式

### 8.1 原则

- 前端不直接调用大模型；
- 后端封装 AI Provider；
- 默认支持 Mock Provider；
- OpenAI-compatible provider 作为可选；
- 大模型只生成结构化 JSON；
- 所有输出必须 Zod 校验；
- 校验失败走 fallback；
- 禁止生成恐吓、医疗、关系操控、外貌焦虑内容。

---

### 8.2 AI Provider Interface

```ts
export interface OracleAIProvider {
  generateDailyOracle(input: DailyOracleGenerationInput): Promise<DailyTarotStyleOracleContent>;
}
```

---

### 8.3 Input

```ts
export type DailyOracleGenerationInput = {
  birthAura: BirthAuraProfile;
  dateAura: DateAura;
  personalDateAura: PersonalDateAura;
  mood: TodayMood;
  scene: TodayScene;
  tarotCard: TarotCard;
  language: "en";
  safetyMode: "teen_safe" | "standard";
};
```

P0 输出主语言为英文。中文可保留内部文档，不进入海外产品 P0。

---

### 8.4 System Prompt 方向

```text
You are AuraCue, a soft luxury daily tarot style oracle.
You do not predict fate. You translate symbolic signals into supportive style cues.
You never guarantee luck, love, success, beauty, body change, or future events.
You never shame bodies, faces, weight, skin, age, gender, or appearance.
You write for young users in a warm, modern, emotionally precise tone.
Return only valid JSON matching the schema.
```

---

### 8.5 JSON Schema 核心字段

```ts
const DailyOracleContentSchema = z.object({
  oracleTitle: z.string().min(3).max(80),
  auraName: z.string().min(2).max(50),
  luckShift: z.object({
    from: z.string().min(2).max(40),
    to: z.string().min(2).max(40),
    label: z.string().min(3).max(80),
  }),
  message: z.object({
    mirror: z.string().min(20).max(180),
    interpretation: z.string().min(30).max(240),
    guidance: z.string().min(20).max(180),
  }),
  style: z.object({
    luckyColor: z.string().min(2).max(40),
    guardianItem: z.string().min(2).max(60),
    styleFormula: z.string().min(10).max(140),
    avoidToday: z.string().min(10).max(140),
  }),
  dailyMission: z.object({
    title: z.string().min(3).max(50),
    text: z.string().min(20).max(160),
  }),
  activation: z.object({
    phrase: z.string().min(10).max(120),
    action: z.string().min(10).max(120),
  }),
  share: z.object({
    title: z.string().min(3).max(80),
    caption: z.string().min(10).max(180),
  }),
  safetyNote: z.string().min(10).max(160),
});
```

---

### 8.6 Safety Guard

禁止输出：

- “你今天一定会好运”；
- “不穿这个会倒霉”；
- “解锁才能避免坏事”；
- 分手、复合、恋爱成功预测；
- 医疗诊断、心理疾病诊断；
- 自伤、自杀相关细节；
- 身材、脸、体重、缺陷评价；
- 诱导未成年人外貌焦虑；
- 金钱、考试、工作结果保证。

建议输出：

```text
This is a cue, not a command.
Use it as today’s style intention.
```

---

## 9. 数据库设计

### 9.1 必须表

| Model | P0 | 说明 |
|---|---|---|
| AnonymousUser | 是 | 匿名用户主表 |
| BirthAuraProfile | 是 | 生日、本命气场 |
| DateAuraSnapshot | 是 | 当日日期气场快照 |
| DailyCheckIn | 是 | mood / scene |
| DrawSession | 是 | 三张候选牌与选择 |
| GenerationJob | 是 | AI / Mock 生成状态 |
| DailyOracle | 是 | 今日神谕核心结果 |
| AuraActivation | 是 | Hold to Seal |
| SavedCard | 是 | 保存记录 |
| ShareEvent | 是 | 分享记录 |
| AnalyticsEvent | 是 | 埋点 |
| CardTemplate | 是 | 分享模板 |

P1 可加：UserAccount、Subscription、ClarifierCard、EveningReflection。

---

### 9.2 Prisma 最低 Schema

```prisma
model AnonymousUser {
  id           String   @id @default(cuid())
  anonymousId  String   @unique
  platform     String
  timezone     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  birthAura    BirthAuraProfile?
  checkIns     DailyCheckIn[]
  drawSessions DrawSession[]
  jobs         GenerationJob[]
  oracles      DailyOracle[]
  activations  AuraActivation[]
  savedCards   SavedCard[]
  shares       ShareEvent[]
  analytics    AnalyticsEvent[]
}

model BirthAuraProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              AnonymousUser @relation(fields: [userId], references: [id])
  month             Int
  day               Int
  zodiacSign        String
  zodiacLabel       String
  element           String
  modality          String
  rulingSignal      String
  birthstoneSignal  String
  auraName          String
  styleOrigin       String
  guardianColor     String
  styleMantra       String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model DateAuraSnapshot {
  id              String   @id @default(cuid())
  localDate       String
  timezone        String
  weekdaySignal   String
  dayNumber       Int
  dayNumberName   String
  zodiacSeason    String
  auraName        String
  theme           String
  dateQuestion    String
  dailyMission    String
  styleBias       Json
  guardianBias    Json
  createdAt       DateTime @default(now())

  @@unique([localDate, timezone])
}

model DailyCheckIn {
  id          String   @id @default(cuid())
  userId      String
  user        AnonymousUser @relation(fields: [userId], references: [id])
  localDate   String
  mood        String
  scene       String
  createdAt   DateTime @default(now())

  @@unique([userId, localDate])
}

model DrawSession {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])
  localDate      String
  drawSeed       String
  cardOptions    Json
  selectedCardId String?
  selectedIndex  Int?
  selectedAt     DateTime?
  expiresAt      DateTime
  createdAt      DateTime @default(now())

  @@index([userId, localDate])
}

model GenerationJob {
  id            String   @id @default(cuid())
  userId        String
  user          AnonymousUser @relation(fields: [userId], references: [id])
  localDate     String
  drawSessionId String
  status        String
  provider      String
  fallbackUsed  Boolean @default(false)
  errorCode     String?
  resultOracleId String?
  startedAt     DateTime @default(now())
  completedAt   DateTime?
}

model DailyOracle {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])
  localDate       String
  timezone        String
  status          String
  birthAuraJson   Json
  dateAuraJson    Json
  personalDateAuraJson Json
  mood            String
  scene           String
  tarotCardId     String
  tarotCardJson   Json
  content         Json
  shareImageUrl   String?
  sealedAt        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, localDate])
}

model AuraActivation {
  id          String   @id @default(cuid())
  userId      String
  user        AnonymousUser @relation(fields: [userId], references: [id])
  oracleId    String
  localDate   String
  status      String
  holdMs      Int?
  startedAt   DateTime @default(now())
  sealedAt    DateTime?

  @@unique([userId, oracleId])
}

model SavedCard {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  oracleId  String
  createdAt DateTime @default(now())

  @@unique([userId, oracleId])
}

model ShareEvent {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  oracleId  String
  channel   String
  createdAt DateTime @default(now())
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String?
  user      AnonymousUser? @relation(fields: [userId], references: [id])
  eventName String
  payload   Json
  createdAt DateTime @default(now())
}

model CardTemplate {
  id        String   @id @default(cuid())
  key       String   @unique
  name      String
  config    Json
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
}
```

---

## 10. API 契约

### 10.1 Identity

#### `POST /api/v1/identity/anonymous`

创建或读取匿名用户。

Request:

```json
{
  "platform": "web",
  "timezone": "America/Los_Angeles"
}
```

Response:

```json
{
  "userId": "usr_xxx",
  "anonymousId": "anon_xxx",
  "hasBirthAura": true,
  "todayStatus": "NOT_STARTED"
}
```

---

### 10.2 Home State

#### `GET /api/v1/home/today`

返回 Home 状态化页面所需全部数据。

Response:

```json
{
  "localDate": "2026-06-13",
  "displayDate": "Jun 13 · Saturday",
  "hasBirthAura": true,
  "birthAura": { "auraName": "Venus Air" },
  "dateAura": {
    "auraName": "Clear Structure",
    "dailyMission": "Build one small boundary before you give more energy away."
  },
  "todayOracleStatus": "NOT_STARTED",
  "todayOracleSummary": null,
  "cta": {
    "label": "Activate Today’s Aura",
    "target": "/today/check-in"
  }
}
```

Home status values:

```ts
export type HomeState =
  | "FIRST_OPEN"
  | "NO_BIRTH_AURA"
  | "READY_TO_DRAW"
  | "CHECK_IN_STARTED"
  | "CARD_SELECTED"
  | "GENERATING"
  | "GENERATED_NOT_SEALED"
  | "SEALED_TODAY";
```

---

### 10.3 Birth Aura

#### `POST /api/v1/birth-aura`

Request:

```json
{
  "month": 10,
  "day": 7
}
```

Response:

```json
{
  "birthAura": {
    "zodiacSign": "libra",
    "auraName": "Venus Air",
    "element": "air",
    "rulingSignal": "Venus",
    "birthstoneSignal": "Opal",
    "guardianColor": "Soft Opal Pink",
    "styleMantra": "I attract through balance, not effort."
  }
}
```

---

### 10.4 Date Aura

#### `GET /api/v1/date-aura/today?timezone=America/Los_Angeles`

Response:

```json
{
  "dateAura": {
    "localDate": "2026-06-13",
    "displayDate": "Jun 13 · Saturday",
    "weekdaySignal": "Saturn Signal",
    "dayNumber": 2,
    "dayNumberName": "Alignment",
    "zodiacSeason": "Gemini Season",
    "auraName": "Clear Structure",
    "theme": "Today asks for structure before movement.",
    "dateQuestion": "What needs a clearer boundary today?",
    "dailyMission": "Build one small boundary before you give more energy away.",
    "styleBias": ["clean lines", "deep navy"],
    "guardianBias": ["structured jacket", "belt"]
  }
}
```

---

### 10.5 Check-in

#### `POST /api/v1/daily-check-in`

Request:

```json
{
  "localDate": "2026-06-13",
  "mood": "drained",
  "scene": "work_study"
}
```

Response:

```json
{
  "checkInId": "chk_xxx",
  "next": "/today/draw"
}
```

---

### 10.6 Draw Session

#### `POST /api/v1/draw-sessions/start`

Request:

```json
{
  "localDate": "2026-06-13"
}
```

Response:

```json
{
  "drawSessionId": "draw_xxx",
  "cardOptions": [
    { "id": "strength", "name": "Strength", "auraName": "Soft Boundary" },
    { "id": "star", "name": "The Star", "auraName": "Clean Renewal" },
    { "id": "justice", "name": "Justice", "auraName": "Clear Line" }
  ]
}
```

#### `POST /api/v1/draw-sessions/{drawSessionId}/select`

Request:

```json
{
  "selectedIndex": 0
}
```

Response:

```json
{
  "selectedCard": {
    "id": "strength",
    "name": "Strength",
    "auraName": "Soft Boundary"
  },
  "next": "/today/reading"
}
```

---

### 10.7 Generate Oracle

#### `POST /api/v1/oracles/generate`

Request:

```json
{
  "drawSessionId": "draw_xxx",
  "localDate": "2026-06-13"
}
```

Response:

```json
{
  "jobId": "job_xxx",
  "status": "pending"
}
```

#### `GET /api/v1/generation-jobs/{jobId}`

Response:

```json
{
  "status": "success",
  "oracleId": "oracle_xxx"
}
```

#### `GET /api/v1/oracles/{oracleId}`

返回完整结果。

---

### 10.8 Activation

#### `POST /api/v1/oracles/{oracleId}/activation/start`

Response:

```json
{
  "activationId": "act_xxx",
  "requiredHoldMs": 2000
}
```

#### `POST /api/v1/activations/{activationId}/seal`

Request:

```json
{
  "holdMs": 2300
}
```

Response:

```json
{
  "status": "sealed",
  "sealedAt": "2026-06-13T09:00:00.000Z",
  "next": "/activated/oracle_xxx"
}
```

If `holdMs < requiredHoldMs`:

```json
{
  "error": {
    "code": "HOLD_TOO_SHORT",
    "message": "Hold a little longer to seal today’s aura."
  }
}
```

---

### 10.9 Share / Save

#### `POST /api/v1/oracles/{oracleId}/render-share-card`

Response:

```json
{
  "imageUrl": "/generated-cards/oracle_xxx.png"
}
```

#### `POST /api/v1/oracles/{oracleId}/save`

Idempotent.

#### `POST /api/v1/share-events`

Request:

```json
{
  "oracleId": "oracle_xxx",
  "channel": "instagram"
}
```

---

### 10.10 My

#### `GET /api/v1/my/summary`

Response:

```json
{
  "birthAura": { "auraName": "Venus Air" },
  "todaySealedAura": {
    "auraName": "Soft Boundary",
    "luckyColor": "Charcoal Navy",
    "guardianItem": "Structured Jacket"
  },
  "auraHistory": [
    { "localDate": "2026-06-13", "auraName": "Soft Boundary", "sealed": true },
    { "localDate": "2026-06-12", "auraName": "Clean Renewal", "sealed": true }
  ],
  "savedCardsCount": 3,
  "account": {
    "mode": "guest",
    "loginAvailable": false
  }
}
```

---

## 11. 前端 Route 设计

### 11.1 P0 Routes

| Route | 页面 | 说明 |
|---|---|---|
| `/` | Bootstrap | 获取 identity 后跳 `/home` |
| `/home` | Home | 状态化首页 |
| `/onboarding/birth-aura` | Create Birth Aura | 生日必填 |
| `/onboarding/birth-aura/reveal` | Birth Aura Reveal | 本命气场揭示 |
| `/today/check-in` | Mood & Scene | 今日状态和场景 |
| `/today/draw` | Tarot Pull | 三张牌抽一张 |
| `/today/reading` | Reading | 读取和生成中 |
| `/result/[id]` | Result | 今日风格神谕 |
| `/activate/[id]` | Hold to Seal | 封印 |
| `/activated/[id]` | Activated | 封印成功 |
| `/share/[id]` | Share | 分享卡 |
| `/saved/[id]` | Saved | 保存成功 |
| `/my` | My | 我的气场 |
| `/my/birth-aura` | Birth Aura Profile | 修改生日 / 查看本命气场 |
| `/legal/privacy` | Privacy | 隐私政策 |
| `/legal/terms` | Terms | 服务条款 |

---

### 11.2 Route Guard

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

如果缺少 Birth Aura：跳转 `/onboarding/birth-aura?returnTo=...`。

---

## 12. 埋点事件

| Event | 触发 |
|---|---|
| app_bootstrap_started | App 启动 |
| home_viewed | Home 曝光 |
| date_aura_viewed | Date Aura 曝光 |
| first_aura_cta_clicked | 首次 CTA |
| birth_aura_started | 进入生日页 |
| birth_aura_created | Birth Aura 创建成功 |
| birth_aura_revealed | Reveal 页曝光 |
| check_in_submitted | Mood / Scene 提交 |
| draw_started | 抽牌页开始 |
| card_selected | 用户选牌 |
| oracle_generation_started | 生成开始 |
| oracle_generation_completed | 生成成功 |
| oracle_viewed | 结果页曝光 |
| seal_started | 进入封印 |
| seal_completed | 封印成功 |
| share_card_rendered | 分享卡渲染 |
| share_clicked | 点击分享 |
| card_saved | 保存 |
| my_viewed | My 页面曝光 |
| aura_history_viewed | 气场记录曝光 |

---

## 13. 测试与验收

### 13.1 单元测试

- Zodiac 计算；
- Birthstone 计算；
- Date Aura 计算；
- Day Number reduce；
- Zodiac Season 计算；
- Draw Seed deterministic；
- 每日唯一性；
- Safety Guard；
- JSON Schema validation；
- Mock Generator。

---

### 13.2 API 测试

- anonymous identity 创建；
- birth aura 创建；
- date aura 获取；
- home state 获取；
- check-in；
- draw session start；
- card select；
- oracle generate；
- generation job poll；
- oracle read；
- activation start；
- seal success / too short；
- save idempotency；
- share event；
- my summary。

---

### 13.3 E2E 流程

#### 首次用户 Happy Path

```text
/ → /home → Start My First Aura
→ /onboarding/birth-aura
→ /onboarding/birth-aura/reveal
→ /today/check-in
→ /today/draw
→ /today/reading
→ /result/[id]
→ /activate/[id]
→ /activated/[id]
→ /share/[id]
→ /my
```

#### 回访用户：未抽卡

```text
/home 显示 Ready to Draw
点击 Activate Today’s Aura
进入 /today/check-in
```

#### 回访用户：已生成未封印

```text
/home 显示 Today’s Oracle is waiting to be sealed
点击 Seal Today’s Aura
进入 /activate/[id]
```

#### 回访用户：已封印

```text
/home 显示 Today’s Aura Sealed
不显示再抽一次
可 View Today’s Card / Share Story
```

---

### 13.4 验收标准

P0 必须满足：

- 无登录可完整跑通；
- 生日必填后才能抽卡；
- Home / My 底部导航正确；
- Journal 不作为独立 Tab；
- Date Aura 每天变化；
- 本地时区 00:00 开启新日；
- 每日主牌只生成一次；
- 已封印后 Home 不显示重抽；
- 结果页包含 Date Aura、Birth Aura、Tarot Card、Luck Shift、Lucky Color、Guardian Item、Style Formula、Daily Mission、Activation Action；
- Hold to Seal 有最短长按时间；
- 分享图为 9:16；
- 不出现外貌焦虑、恐吓式改运、保证结果文案；
- Mock Provider 无 AI key 也可完整运行；
- E2E 测试通过。

---

## 14. 开发任务拆解

### T00 文档锁定

- 以本文档和页面设计文档 v4.0 为唯一 P0 源头；
- 下线旧 `Today / Journal / My` 导航；
- 下线 `Skip for now` 进入抽卡逻辑；
- 下线 P0 上传 outfit；
- 下线 P0 登录密码。

### T01 Web App 初始化

- Next.js App Router；
- Tailwind；
- ui tokens；
- AppShell；
- Mobile viewport。

### T02 Database

- Prisma schema；
- Migration；
- Seed：12 cards、templates、date mappings。

### T03 Core Services

- Identity service；
- BirthAura service；
- DateAura service；
- TarotDeck service；
- Draw service；
- Oracle generation service；
- Activation service；
- Share renderer service。

### T04 API

- `/api/v1/identity/anonymous`；
- `/api/v1/home/today`；
- `/api/v1/birth-aura`；
- `/api/v1/date-aura/today`；
- `/api/v1/daily-check-in`；
- `/api/v1/draw-sessions/start`；
- `/api/v1/draw-sessions/:id/select`；
- `/api/v1/oracles/generate`；
- `/api/v1/generation-jobs/:id`；
- `/api/v1/oracles/:id`；
- `/api/v1/oracles/:id/activation/start`；
- `/api/v1/activations/:id/seal`；
- `/api/v1/oracles/:id/render-share-card`；
- `/api/v1/oracles/:id/save`；
- `/api/v1/share-events`；
- `/api/v1/my/summary`。

### T05 Pages

- Bootstrap；
- Home；
- Create Birth Aura；
- Birth Aura Reveal；
- Mood & Scene；
- Tarot Pull；
- Reading；
- Result；
- Activate；
- Activated；
- Share；
- Saved；
- My；
- Birth Aura Profile；
- Legal；
- Error。

### T06 Tests

- Unit；
- API；
- Components；
- E2E；
- Visual smoke；
- Safety copy tests。

---

## 15. 最终产品原则

```text
生日让用户相信：这是我的。
日期让用户相信：这是今天的。
抽牌让用户相信：这是我选中的。
穿搭让用户相信：我可以把它带出去。
今日任务让用户相信：今天我知道该做什么。
封印让用户相信：我已经进入今天的状态。
分享让用户相信：这是我的今日身份。
```

AuraCue 的 P0 不是 AI 穿搭工具，而是：

```text
年轻人的每日塔罗风格神谕。
```
