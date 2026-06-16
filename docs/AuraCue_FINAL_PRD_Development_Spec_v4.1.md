# AuraCue FINAL PRD + Development Specification v4.1

> 文档类型：最终需求开发文档 / Product Requirements + Implementation Specification  
> 版本：v4.1 FINAL  
> 适用端：Web / H5 MVP 优先，后续复用到 App / 小程序  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**生日决定本命气场；日期决定今日守护星；抽牌决定今日神谕；穿搭把神谕带到现实。**  
> 本次 v4.1 修正重点：用 **Today’s Ruling Planet / 今日守护星** 替代用户难理解的 “Date Aura: Clear Structure / 日期气场：清晰结构” 和 “Today’s Mission / 今日任务”；重写 **P0-07 Today’s Style Oracle Result** 页面信息结构。

---

## 0. v4.1 最终决策摘要

### 0.1 产品一句话

AuraCue 是一个每天出门前使用的 **Daily Tarot Style Oracle**。用户通过生日生成 **Birth Aura 本命气场**，通过当天日期获得 **Today’s Ruling Planet 今日守护星** 和 **Today’s Theme 今日主题**，再选择今日状态和今日场景，亲手抽取一张今日塔罗风格牌，获得心理暗示、幸运色、守护单品、穿搭公式，并通过长按封印把今日气场带走。

用户表面上在问：

```text
今天穿什么？
```

用户真实在寻找：

```text
今天我该以什么状态面对世界？
今天是什么能量在影响我？
今天我应该被看见、被保护、保持边界、恢复能量，还是启动行动？
我能不能把这个提示穿在身上？
```

AuraCue 的核心价值不是搭配正确性，而是：

```text
每天给用户一个可以穿在身上的心理暗示。
```

---

### 0.2 最终核心公式

```text
Birth Aura 本命气场
+ Today’s Ruling Planet 今日守护星
+ Today’s Theme 今日主题
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
→ Hold to Seal 封印
→ Share Aura Card 分享气场牌
```

> 重要修正：P0 结果页不再展示 `Today’s Mission / 今日任务`、`Avoid Today / 今日避免`、`Activation Phrase / 出门暗示`、`Activation Action / 今日动作`。这些内容会让结果页像报告，削弱命中感。P0-07 只保留最能建立信任和穿搭决策的信息。

---

### 0.3 日期系统的最终用户表达

不要对用户展示：

```text
Date Aura: Clear Structure
日期气场：清晰结构
```

这太抽象，像内部设计语言。

改为展示：

```text
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability
```

中文：

```text
今日守护星
Saturn 土星
结构 · 边界 · 稳定
```

这更符合西方用户熟悉的占星语境。用户能理解：

```text
今天是土星日，所以今天的主题和结构、边界、稳定有关。
```

---

### 0.4 底部导航

P0 只做两个底部 Tab：

```text
Home / My
```

| Tab | Route | 职责 |
|---|---|---|
| Home | `/home` 或 `/` | App 主入口、今日守护星、今日抽牌 CTA、今日已封印气场、继续未完成仪式 |
| My | `/my` | 本命气场、生日设置、气场记录、已保存卡、设置、Legal、P1 登录入口 |

P0 不做独立 Journal Tab。历史气场卡放在 My 页面里的 `Aura History / My Aura Cards`。

---

### 0.5 每日抽卡策略

P0 每天只允许用户生成 **1 张 Official Daily Card / 今日官方主牌**。

原因：

- 增强神谕权威感；
- 避免用户刷到满意为止；
- 增强“今天只有这一张”的唯一性；
- 更利于分享：“我今天抽到的是这张”；
- 更利于每日留存：“明天会开启新的气场”。

P0 不做重抽。P1 可以做 **Clarifier Card / 补充牌**，但补充牌不替代今日主牌，只解释如何承载今天的主牌。

---

### 0.6 生日规则

P0 不强制登录，但生日是开始抽卡前必填。

```text
用户可以先看 Home。
用户要开始今日抽牌，必须输入生日月 / 日，生成 Birth Aura。
```

P0 不收：年份、出生时间、出生地点、真实姓名、手机号。

---

### 0.7 登录策略

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

## 1. P0 产品目标与非目标

### 1.1 P0 目标

P0 只做一件事：

```text
让用户每天打开 AuraCue，
看到今天的守护星，
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
我知道今天该怎么穿。
我愿意保存或分享。
```

---

### 1.2 P0 必须实现

- Home 主页面；
- My 主页面；
- Guest / Anonymous Identity；
- Birth Aura 生日输入与生成；
- Birth Aura Reveal；
- Today’s Ruling Planet 今日守护星；
- Today’s Theme 今日主题；
- Today Mood 选择；
- Today Scene 选择；
- 三张塔罗牌背面抽一张；
- Reading 读取页；
- P0-07 Today’s Style Oracle Result 结果页；
- Luck Shift；
- Lucky Color；
- Guardian Item；
- Style Formula；
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

## 2. 用户心理链路

### 2.1 信念生成公式

```text
生日让我相信：这是我的。
今日守护星让我相信：今天有今天的能量。
状态让我相信：它看见了我。
场景让我相信：它知道我要面对什么。
抽牌让我相信：这是我选中的。
穿搭让我相信：我能把它带出去。
封印让我相信：我已经进入今天的状态。
分享让我相信：这是我的今日身份。
```

---

### 2.2 每一步心理暗示

| 步骤 | 页面动作 | 用户心理 |
|---|---|---|
| Home | 看到今日守护星 | 今天不一样 |
| Birth Aura | 输入生日 | 这是我的个人入口 |
| Birth Aura Reveal | 看到本命气场 | 我有长期风格原型 |
| Mood | 选择今日状态 | 它看见了我今天怎样 |
| Scene | 选择今天要面对什么 | 结果和今天有关 |
| Tarot Pull | 亲手点一张牌 | 这是我选中的牌 |
| Reading | 读取 Birth Aura / Ruling Planet / Card | 它正在解读我 |
| Result | 看到 Luck Shift 和穿搭 | 它说中了，而且我知道怎么穿 |
| Guardian Item | 得到一个具体物件 | 我可以把提示穿在身上 |
| Hold to Seal | 长按 2–3 秒 | 我接受并带走今日气场 |
| Share | 生成今日气场牌 | 这是我的今日身份 |
| My History | 回看过往卡片 | 我的气场正在形成轨迹 |

---

## 3. 日期系统：Today’s Ruling Planet / 今日守护星

### 3.1 为什么日期是核心

生日生成的是用户的长期底色，类似“本命气场”。但用户每天都不一样，产品要让用户相信：

```text
今天有今天自己的能量。
明天会不一样。
所以我每天都要回来。
```

因此，日期不只是展示 `Jun 13`，而是生成 **Today’s Ruling Planet 今日守护星** 和 **Today’s Theme 今日主题**。

---

### 3.2 用户感知目标

用户看到日期模块时要感受到：

```text
今天不是普通的一天。
今天由某种星体能量主导。
这个星体会影响我今天的牌、心理暗示、幸运色和守护单品。
```

页面文案示例：

```text
A new ruling planet opens today’s aura.
```

中文：

```text
今天的守护星已经开启。
```

---

### 3.3 P0 使用的星期守护星体系

西方占星和神秘学里，一周七天对应七颗传统行星。P0 使用这个体系，用户理解成本低，且每天自然变化。

| 星期 | Today’s Ruling Planet | 中文 | 用户理解 | 穿搭方向 |
|---|---|---|---|---|
| Monday | Moon | 月亮 | 情绪、直觉、保护 | 珍珠白、银色、柔软层次 |
| Tuesday | Mars | 火星 | 勇气、行动、推进 | 红色、短外套、靴子、利落感 |
| Wednesday | Mercury | 水星 | 表达、沟通、思路 | 浅黄、银色、领口细节、轻盈层次 |
| Thursday | Jupiter | 木星 | 机会、扩张、好运 | 蜂蜜金、绿色、大包、开放廓形 |
| Friday | Venus | 金星 | 美感、吸引、关系 | 腮红粉、香槟金、珍珠、柔软材质 |
| Saturday | Saturn | 土星 | 结构、边界、稳定 | 深蓝、炭灰、结构感外套、皮带 |
| Sunday | Sun | 太阳 | 光感、自信、恢复 | 象牙白、金色、白衬衫、明亮单品 |

---

### 3.4 Today’s Theme 今日主题

Today’s Theme 是把今日守护星翻译成普通用户能理解的心理主题。

| Ruling Planet | Today’s Theme | 中文主题 | Keywords | 中文关键词 |
|---|---|---|---|---|
| Moon | Emotional Protection | 情绪与保护 | Emotion · Intuition · Protection | 情绪 · 直觉 · 保护 |
| Mars | Courage & Action | 行动与勇气 | Action · Courage · Boundaries | 行动 · 勇气 · 边界 |
| Mercury | Expression & Clarity | 表达与沟通 | Voice · Thought · Clarity | 表达 · 思路 · 清晰 |
| Jupiter | Opportunity & Expansion | 机会与扩张 | Luck · Growth · Expansion | 好运 · 成长 · 展开 |
| Venus | Beauty & Attraction | 美感与吸引 | Beauty · Attraction · Relationship | 美感 · 吸引 · 关系 |
| Saturn | Boundaries & Structure | 边界与秩序 | Structure · Boundaries · Stability | 结构 · 边界 · 稳定 |
| Sun | Radiance & Renewal | 光感与恢复 | Radiance · Confidence · Renewal | 光感 · 自信 · 恢复 |

P0 用户界面优先展示：

```text
Today’s Ruling Planet
Saturn
Structure · Boundaries · Stability
```

中文：

```text
今日守护星
Saturn 土星
结构 · 边界 · 稳定
```

不要展示：

```text
Date Aura: Clear Structure
日期气场：清晰结构
```

---

### 3.5 Personal Date Signal 个人今日信号

同一天所有人都可能看到同一颗守护星，但每个人的生日 / Birth Aura 不同，所以结果文案必须结合用户本命气场。

示例：

```text
Today’s Ruling Planet: Saturn
Birth Aura: Venus Air
Personal Signal: Saturn asks your Venus Air to create beauty with clearer boundaries.
```

中文：

```text
今日守护星：Saturn 土星
本命气场：金星风象
个人今日信号：今天的土星会提醒你的金星风象，用更清晰的边界承载美感和关系。
```

---

### 3.6 TodayDateSignal 数据结构

```ts
export type TodayDateSignal = {
  localDate: string;              // YYYY-MM-DD in user timezone
  displayDate: string;            // Jun 13 · Saturday
  timezone: string;

  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

  rulingPlanet: {
    id: "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "sun";
    name: string;                 // Saturn
    nameCn: string;               // 土星
    keywords: string[];           // ["Structure", "Boundaries", "Stability"]
    keywordsCn: string[];         // ["结构", "边界", "稳定"]
  };

  todayTheme: {
    title: string;                 // Boundaries & Structure
    titleCn: string;               // 边界与秩序
    message: string;               // Today asks you to protect your energy with a clearer shape.
    messageCn: string;             // 今天适合用更清晰的边界保护自己的能量。
  };

  styleBias: string[];             // ["deep navy", "structured jacket", "clean outer shape"]
  guardianBias: string[];          // ["structured jacket", "belt", "silver ring"]
};
```

---

### 3.7 未来 P1 可扩展

P1 可加入以下系统，但 P0 不展示，避免信息过载：

- Moon Phase / 月相；
- Personal Day Number / 个人日期数字；
- Guardian Stone / 今日守护石；
- Angel Number / 天使数字；
- Planetary Hour / 行星时。

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

### 4.5 BirthAuraProfile 数据结构

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

P0 不允许缺少 Birth Aura 的用户进入抽卡流程。

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

- 未封印：Home 显示 “Seal Today’s Aura”；
- 已封印：Home 显示 “Today’s Aura Sealed”；
- 不显示主重抽入口。

---

### 6.2 三张候选牌生成

后端基于 deterministic seed 生成三张候选牌。

```ts
seed = hash(userId + localDate + birthAura.auraName + todayDateSignal.rulingPlanet.id + mood + scene)
```

候选牌生成时可加入权重：

- 今日守护星的 styleBias；
- Birth Aura element；
- mood / scene；
- 最近 2 天避免完全重复。

用户从三张牌中亲手选择一张。用户选择是仪式的一部分，必须保存。

---

## 7. Daily Oracle 输出结构

### 7.1 P0 核心输出字段

```ts
export type DailyTarotStyleOracle = {
  id: string;
  userId: string;
  localDate: string;
  timezone: string;
  status: DailyOracleStatus;

  birthAura: BirthAuraProfile;
  todayDateSignal: TodayDateSignal;
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

  resultPage: {
    hitMessageTitle: string;    // Why this card found you today
    hitMessage: string;         // 4-5 lines, strongest emotional hit
  };

  style: {
    luckyColor: string;
    guardianItem: string;
    styleFormula: string;
  };

  activation: {
    sealMessage: string;        // Carry your Soft Boundary with you today.
    action?: string;            // P0-08 can use it, P0-07 must not show it.
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

### 7.2 P0-07 结果页不得展示字段

P0-07 结果页不展示：

```ts
avoidToday
activationPhrase
activationAction
todayMission
dailyMission
```

这些内容可在 P1 Full Oracle 或 P0-08 Seal 页中轻量使用。

---

### 7.3 命中感文案公式

大模型或 Mock Generator 必须遵守：

```text
You arrived today feeling {mood}.
Because your Birth Aura carries {birthAura}, you tend to {personalPattern}.
Today is ruled by {rulingPlanet}, bringing {planetKeywords}.
Today, {dailyCard} is not asking you to {wrongDirection}.
It is asking you to {rightDirection}.
```

中文逻辑：

```text
你今天带着{今日状态}来到这里。
因为你的本命气场是{Birth Aura}，你可能更容易{个人倾向}。
今天由{今日守护星}主导，它带来{守护星关键词}。
今天的{塔罗牌}不是要你{错误方向}，
而是提醒你{正确方向}。
```

示例：

```text
You arrived today feeling drained.
Because your Birth Aura carries Venus Air, you may give too much energy to keep things beautiful.
Today is ruled by Saturn, bringing structure, boundaries, and stability.
Strength is not asking you to become harder.
It is asking you to protect your softness with clearer shape.
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

### 8.2 Input

```ts
export type DailyOracleGenerationInput = {
  birthAura: BirthAuraProfile;
  todayDateSignal: TodayDateSignal;
  mood: TodayMood;
  scene: TodayScene;
  tarotCard: TarotCard;
  language: "en";
  safetyMode: "teen_safe" | "standard";
};
```

---

### 8.3 System Prompt 方向

```text
You are AuraCue, a soft luxury daily tarot style oracle.
You do not predict fate. You translate symbolic signals into supportive style cues.
You use Birth Aura, Today’s Ruling Planet, Today’s Theme, Mood, Scene, and Tarot Card to create a precise daily style oracle.
You never guarantee luck, love, success, beauty, body change, or future events.
You never shame bodies, faces, weight, skin, age, gender, or appearance.
You write for young users in a warm, modern, emotionally precise tone.
Return only valid JSON matching the schema.
```

---

### 8.4 JSON Schema 核心字段

```ts
const DailyOracleContentSchema = z.object({
  oracleTitle: z.string().min(3).max(80),
  auraName: z.string().min(2).max(50),
  luckShift: z.object({
    from: z.string().min(2).max(40),
    to: z.string().min(2).max(40),
    label: z.string().min(3).max(80),
  }),
  resultPage: z.object({
    hitMessageTitle: z.string().min(3).max(80),
    hitMessage: z.string().min(80).max(420),
  }),
  style: z.object({
    luckyColor: z.string().min(2).max(40),
    guardianItem: z.string().min(2).max(60),
    styleFormula: z.string().min(10).max(140),
  }),
  activation: z.object({
    sealMessage: z.string().min(10).max(140),
    action: z.string().min(5).max(120).optional(),
  }),
  share: z.object({
    title: z.string().min(3).max(80),
    caption: z.string().min(10).max(180),
  }),
  safetyNote: z.string().min(10).max(160),
});
```

---

### 8.5 Safety Guard

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
| DateSignalSnapshot | 是 | 当日守护星 / 今日主题快照 |
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

model DateSignalSnapshot {
  id              String   @id @default(cuid())
  localDate       String
  timezone        String
  weekday         String
  rulingPlanetId  String
  rulingPlanet    String
  rulingPlanetCn  String
  planetKeywords  Json
  planetKeywordsCn Json
  themeTitle      String
  themeTitleCn    String
  themeMessage    String
  themeMessageCn  String
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
  dateSignalJson  Json
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

Response:

```json
{
  "localDate": "2026-06-13",
  "displayDate": "Jun 13 · Saturday",
  "hasBirthAura": true,
  "birthAura": { "auraName": "Venus Air" },
  "todayDateSignal": {
    "rulingPlanet": {
      "name": "Saturn",
      "nameCn": "土星",
      "keywords": ["Structure", "Boundaries", "Stability"],
      "keywordsCn": ["结构", "边界", "稳定"]
    },
    "todayTheme": {
      "title": "Boundaries & Structure",
      "titleCn": "边界与秩序",
      "message": "Today asks you to protect your energy with a clearer shape.",
      "messageCn": "今天适合用更清晰的边界保护自己的能量。"
    }
  },
  "todayOracleStatus": "NOT_STARTED",
  "todayOracleSummary": null,
  "cta": {
    "label": "Activate Today’s Aura",
    "target": "/today/check-in"
  }
}
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

### 10.4 Today Date Signal

#### `GET /api/v1/date-signal/today?timezone=America/Los_Angeles`

Response:

```json
{
  "todayDateSignal": {
    "localDate": "2026-06-13",
    "displayDate": "Jun 13 · Saturday",
    "weekday": "saturday",
    "rulingPlanet": {
      "id": "saturn",
      "name": "Saturn",
      "nameCn": "土星",
      "keywords": ["Structure", "Boundaries", "Stability"],
      "keywordsCn": ["结构", "边界", "稳定"]
    },
    "todayTheme": {
      "title": "Boundaries & Structure",
      "titleCn": "边界与秩序",
      "message": "Today asks you to protect your energy with a clearer shape.",
      "messageCn": "今天适合用更清晰的边界保护自己的能量。"
    },
    "styleBias": ["deep navy", "structured jacket", "clean outer shape"],
    "guardianBias": ["structured jacket", "belt", "silver ring"]
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

## 11. 前端 Routes

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

## 12. Route Guard

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

## 13. 埋点事件

| Event | 触发 |
|---|---|
| app_bootstrap_started | App 启动 |
| home_viewed | Home 曝光 |
| ruling_planet_viewed | 今日守护星曝光 |
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

## 14. 测试与验收

### 14.1 单元测试

- Zodiac 计算；
- Birthstone 计算；
- Today’s Ruling Planet 计算；
- Today’s Theme 计算；
- Draw Seed deterministic；
- 每日唯一性；
- Safety Guard；
- JSON Schema validation；
- Mock Generator。

---

### 14.2 API 测试

- anonymous identity 创建；
- birth aura 创建；
- today date signal 获取；
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

### 14.3 E2E 流程

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

### 14.4 验收标准

P0 必须满足：

- 无登录可完整跑通；
- 生日必填后才能抽卡；
- Home / My 底部导航正确；
- Journal 不作为独立 Tab；
- 今日守护星每天根据星期变化；
- 本地时区 00:00 开启新日；
- 每日主牌只生成一次；
- 已封印后 Home 不显示重抽；
- 结果页包含 Today’s Ruling Planet、Birth Aura、Tarot Card、Luck Shift、Lucky Color、Guardian Item、Style Formula；
- 结果页不展示 Today’s Mission / Avoid Today / Activation Action；
- Hold to Seal 有最短长按时间；
- 分享图为 9:16；
- 不出现外貌焦虑、恐吓式改运、保证结果文案；
- Mock Provider 无 AI key 也可完整运行；
- E2E 测试通过。

---

## 15. 最终产品原则

```text
生日让用户相信：这是我的。
今日守护星让用户相信：今天有今天的能量。
抽牌让用户相信：这是我选中的。
穿搭让用户相信：我可以把它带出去。
封印让用户相信：我已经进入今天的状态。
分享让用户相信：这是我的今日身份。
```

AuraCue 的 P0 不是 AI 穿搭工具，而是：

```text
年轻人的每日塔罗风格神谕。
```
