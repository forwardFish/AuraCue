# AuraCue Full PRD & Implementation Spec v3.0

> 文档类型：完整产品需求文档 + 技术实现规格 / Full PRD & Development Specification  
> 版本：v3.0  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日风格神谕 / Daily Style Oracle**  
> 核心公式：**Birth Aura 本命气场 + Date Aura 今日日期气场 + Today Mood 今日状态 + Today Scene 今日场景 + Tarot Pull 塔罗抽卡 → Psychological Cue 心理暗示 → Daily Outfit Oracle 今日气场穿搭 + Daily Aura Card 今日气场牌**  
> 适用端：Web / H5 优先，小程序后续复用 API 与状态机  
> 目标读者：产品、设计、前端、后端、AI、测试、Codex / Agent 开发人员  
> 本文档目标：让开发团队可以直接按本文实现 AuraCue P0，不再需要额外补需求。

---

## 0. 重要结论

AuraCue 不再是普通 AI 穿搭工具，而是：

> **一个每天出门前使用的 Daily Style Oracle。用户通过生日 / 星座、本命气场、今日日期气场、今日状态、今日场景和塔罗抽牌，获得一张今日气场牌，以及可穿在身上的幸运色、守护单品、穿搭公式、心理暗示和封印动作。**

用户表面上在问：

```text
今天穿什么？
```

用户真实在寻找：

```text
今天我该以什么状态面对世界？
今天我需要被看见、被保护、保持边界、恢复能量，还是启动行动？
今天有没有一个能让我相信“这是为我准备的”提示？
```

AuraCue 的核心价值不是搭配正确性，而是：

```text
每天给用户一个可以穿在身上的心理暗示。
```

---

## 1. 文档适用范围

### 1.1 本文档覆盖

本文档覆盖 P0 可上线版本所需的完整内容：

- 产品定位与用户心理链路；
- 星座 / 生日系统设计；
- Date Aura 日期气场系统设计；
- 今日状态与今日场景系统设计；
- 12 张 AuraCue 塔罗风格牌组设计；
- 抽牌算法与每日唯一性；
- 大模型使用方式；
- Prompt 结构、输出 JSON、校验与 fallback；
- 数据库设计；
- API 契约；
- 前端路由与页面功能；
- 分享图渲染；
- Journal 与每日留存；
- 安全边界；
- 埋点；
- 测试与验收。

### 1.2 本文档不覆盖

P0 不做：

- 真实支付接入；
- 复杂星盘；
- 出生时间、出生地点；
- 完整 78 张传统塔罗；
- 颜值、脸型、身材、体重评价；
- 电商导购；
- 社区；
- 关系占卜；
- 恐吓式改运；
- 承诺一定变幸运、变美、成功、恋爱。

### 1.3 P0 完成定义

P0 完成必须能跑通：

```text
Anonymous Identity
→ Birth Aura Onboarding
→ Birth Aura Reveal
→ Today Gate / Date Aura
→ Mood & Scene Check-in
→ Tarot Pull
→ Reading
→ AI / Mock Daily Style Oracle Generation
→ Result
→ Hold to Seal
→ Activated
→ Share / Save
→ Journal Lite
```

任何缺少上述主链节点的版本，都不能称为 P0 完成。

---

## 2. 产品核心原则

### 2.1 一句话定位

```text
AuraCue is your Daily Style Oracle.
Draw one card, activate today’s aura, and wear your luck.
```

中文：

```text
AuraCue 是年轻人的每日风格神谕。
抽一张牌，激活今日气场，把好运状态穿在身上。
```

### 2.2 三高体验标准

| 体验目标 | 用户心里出现的话 | 产品必须做到 |
|---|---|---|
| 高审美 | 这个页面好美，我想截图 | soft luxury、pastel gradient、editorial card、柔光、大留白 |
| 高命中感 | 它怎么知道我今天是这样 | 生日 / 星座 + 日期 + 今日状态 + 场景 + 抽牌 + 具体单品 |
| 高分享欲 | 这张卡像我，我想发出去 | 日期、Birth Aura、Date Aura、Luck Shift、Guardian Item、短句、9:16 分享卡 |

### 2.3 用户信念生成公式

用户相信 AuraCue 是为自己设计的，来自以下链路：

```text
生日让我相信：这是我的。
日期让我相信：这是今天的。
状态让我相信：它看见了我。
场景让我相信：它知道我要面对什么。
抽牌让我相信：这是我选中的。
穿搭让我相信：我能把它带出去。
封印让我相信：我已经进入今天的状态。
分享让我相信：这是我的今日身份。
```

---

## 3. 产品核心公式

### 3.1 主公式

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

### 3.2 模块作用

| 模块 | 输入 | 作用 | 输出 |
|---|---|---|---|
| Birth Aura | 生日月 / 日 | 建立长期个人底色 | 星座、元素、守护星、生日石、本命色、风格原点 |
| Date Aura | 本地日期、时区 | 建立“今天不一样” | 星期信号、日期数字、星座季节、日期气场名 |
| Today Mood | 用户选择 | 读取今日情绪入口 | Drained、Hidden、Magnetic 等 |
| Today Scene | 用户选择 | 使建议贴合现实场景 | Work、Important Moment、Just Survive 等 |
| Tarot Pull | 用户点击三张牌之一 | 增强主动选择感 | 今日牌面、牌面能量 |
| LLM Oracle | 后端大模型 / mock | 把符号转为心理暗示和穿搭 | Luck Shift、幸运色、守护单品、公式、动作 |
| Hold to Seal | 长按 3 秒 | 完成仪式和打卡 | sealed 状态、Journal 记录 |
| Share Card | 生成 9:16 卡片 | 传播和身份表达 | PNG / SVG 分享图 |

---

## 4. 用户流程与状态机

### 4.1 首次用户流程

```text
1. 打开 App / H5
2. 创建匿名用户 anonymousId
3. 进入 Create Birth Aura
4. 输入生日月 / 日，或跳过
5. 生成 Birth Aura
6. 揭示 Birth Aura
7. 进入 Today Gate
8. 读取今日 Date Aura
9. 选择 Today Mood
10. 选择 Today Scene
11. 创建 Draw Session
12. 用户从 3 张牌中抽 1 张
13. Reading 过渡页
14. 后端生成 Daily Style Oracle
15. 结果页展示今日神谕
16. 用户进入 Activate
17. 用户长按 3 秒 Hold to Seal
18. Aura Activated
19. 保存 / 分享
20. Journal Lite 记录当天卡片
```

### 4.2 回访用户流程

```text
1. 打开 App / H5
2. 读取 anonymousId
3. 读取 Birth Aura
4. 根据本地日期读取 today oracle 状态
5. 如果今日未生成：进入 Today Gate
6. 如果今日已生成未封印：进入 Result 或 Activate
7. 如果今日已封印：进入 Activated / Journal
8. 次日 00:00 本地时间开启新的 Date Aura
```

### 4.3 Daily Oracle 状态机

```text
NOT_STARTED
  → CHECKED_IN
  → DRAW_STARTED
  → CARD_SELECTED
  → GENERATING
  → GENERATED
  → ACTIVATION_STARTED
  → SEALED
  → SAVED / SHARED
```

状态说明：

| 状态 | 含义 | 允许动作 |
|---|---|---|
| NOT_STARTED | 今日还没开始 | Begin Today |
| CHECKED_IN | 已选 Mood / Scene | Start Draw |
| DRAW_STARTED | 已生成三张牌 | Select Card |
| CARD_SELECTED | 已选牌 | Generate Oracle |
| GENERATING | 后端生成中 | Poll job |
| GENERATED | 结果已生成 | View Result / Activate / Save / Share |
| ACTIVATION_STARTED | 进入封印 | Hold to Seal |
| SEALED | 今日气场已封印 | Save / Share / Journal |

---

## 5. 星座 + Birth Aura 系统设计

### 5.1 生日输入规则

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

原因：降低输入成本，避免隐私负担，同时足够生成星座信号和生日石。

### 5.2 Birth Aura 的心理目的

Birth Aura 要让用户相信：

```text
我不是随机用户，我有自己的本命气场。
同一张牌，对我和别人说的话不一样。
```

页面文案核心：

```text
Your birthday becomes the key to how each card speaks to you.
```

中文：

```text
你的生日会成为每张牌与你对话的方式。
```

### 5.3 ZodiacSign 计算

P0 使用西方太阳星座日期范围。

```ts
export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";
```

| 星座 | 英文 | 日期范围 | Element | Modality | Ruling Signal |
|---|---|---|---|---|---|
| 白羊 | Aries | Mar 21 - Apr 19 | fire | cardinal | Mars |
| 金牛 | Taurus | Apr 20 - May 20 | earth | fixed | Venus |
| 双子 | Gemini | May 21 - Jun 20 | air | mutable | Mercury |
| 巨蟹 | Cancer | Jun 21 - Jul 22 | water | cardinal | Moon |
| 狮子 | Leo | Jul 23 - Aug 22 | fire | fixed | Sun |
| 处女 | Virgo | Aug 23 - Sep 22 | earth | mutable | Mercury |
| 天秤 | Libra | Sep 23 - Oct 22 | air | cardinal | Venus |
| 天蝎 | Scorpio | Oct 23 - Nov 21 | water | fixed | Pluto / Mars |
| 射手 | Sagittarius | Nov 22 - Dec 21 | fire | mutable | Jupiter |
| 摩羯 | Capricorn | Dec 22 - Jan 19 | earth | cardinal | Saturn |
| 水瓶 | Aquarius | Jan 20 - Feb 18 | air | fixed | Uranus / Saturn |
| 双鱼 | Pisces | Feb 19 - Mar 20 | water | mutable | Neptune / Jupiter |

### 5.4 Birthstone 生日石

按月份生成生日石信号。

| 月份 | Birthstone | Guardian Color | 风格暗示 |
|---|---|---|---|
| 1 | Garnet | Deep Garnet Red | 保护、稳定热量 |
| 2 | Amethyst | Mystic Violet | 直觉、安定、精神感 |
| 3 | Aquamarine | Clear Aqua Blue | 清澈、流动、冷静 |
| 4 | Diamond | Crystal White | 清晰、光感、不可动摇 |
| 5 | Emerald | Emerald Green | 生长、丰盛、心轮感 |
| 6 | Pearl / Moonstone | Pearl White | 柔软、月光、保护 |
| 7 | Ruby | Ruby Red | 勇气、热量、存在感 |
| 8 | Peridot | Peridot Green | 恢复、轻盈、绿意 |
| 9 | Sapphire | Sapphire Navy | 智慧、秩序、深蓝稳定 |
| 10 | Opal / Tourmaline | Soft Opal Pink | 多变、梦幻、柔和吸引 |
| 11 | Topaz / Citrine | Honey Gold | 温暖、信心、丰盛 |
| 12 | Turquoise / Tanzanite | Turquoise Blue | 保护、远方、蓝色气场 |

### 5.5 Birth Aura 生成映射

Birth Aura 不直接显示“你是 Libra”，而显示产品化名称：

| Zodiac | Birth Aura Name | Style Origin | Style Mantra |
|---|---|---|---|
| Aries | Mars Fire | Bold Start | I move before doubt grows. |
| Taurus | Venus Earth | Soft Grounding | I attract through calm presence. |
| Gemini | Mercury Air | Light Switch | I stay light, curious, and clear. |
| Cancer | Moon Water | Gentle Shield | I protect what makes me soft. |
| Leo | Solar Fire | Radiant Presence | I can be seen without shrinking. |
| Virgo | Mercury Earth | Clean Order | I find power in clear details. |
| Libra | Venus Air | Soft Balance | I attract through balance, not effort. |
| Scorpio | Shadow Water | Deep Boundary | I keep my depth without giving it away. |
| Sagittarius | Jupiter Fire | Open Horizon | I move toward what expands me. |
| Capricorn | Saturn Earth | Quiet Authority | I build my day with structure. |
| Aquarius | Uranus Air | Cool Signal | I do not need to blend in. |
| Pisces | Neptune Water | Dream Current | I trust softness as a signal. |

### 5.6 Birth Aura 输出数据结构

```ts
export interface BirthAuraProfile {
  id: string;
  userId: string;
  month: number | null;
  day: number | null;
  skipped: boolean;

  zodiacSign: ZodiacSign | null;
  zodiacLabel: string | null;          // Libra
  element: "fire" | "earth" | "air" | "water" | null;
  modality: "cardinal" | "fixed" | "mutable" | null;
  rulingSignal: string | null;         // Venus
  birthstoneSignal: string | null;     // Opal
  auraName: string;                    // Venus Air / Unknown Aura
  styleOrigin: string;                 // Soft Balance
  guardianColor: string | null;        // Soft Opal Pink
  styleMantra: string;                 // I attract through balance, not effort.

  createdAt: string;
  updatedAt: string;
}
```

### 5.7 Birth Aura 计算伪代码

```ts
export function createBirthAura(month?: number, day?: number): BirthAuraProfileInput {
  if (!month || !day) {
    return {
      skipped: true,
      zodiacSign: null,
      zodiacLabel: null,
      element: null,
      modality: null,
      rulingSignal: null,
      birthstoneSignal: null,
      auraName: "Open Aura",
      styleOrigin: "Intuitive Beginning",
      guardianColor: null,
      styleMantra: "I let today speak first."
    };
  }

  const zodiac = getZodiacSign(month, day);
  const zodiacMeta = ZODIAC_META[zodiac];
  const birthstone = BIRTHSTONE_BY_MONTH[month];

  return {
    skipped: false,
    zodiacSign: zodiac,
    zodiacLabel: zodiacMeta.label,
    element: zodiacMeta.element,
    modality: zodiacMeta.modality,
    rulingSignal: zodiacMeta.rulingSignal,
    birthstoneSignal: birthstone.name,
    auraName: zodiacMeta.birthAuraName,
    styleOrigin: zodiacMeta.styleOrigin,
    guardianColor: birthstone.guardianColor,
    styleMantra: zodiacMeta.styleMantra
  };
}
```

### 5.8 存储规则

Birth Aura 必须持久化。

原因：

- 之后每日结果都要引用；
- 用户 profile 要展示；
- 分享卡可显示 Birth Aura chip；
- 订阅功能可围绕 Birth Aura 深度报告展开。

---

## 6. Date Aura 今日日期气场系统设计

### 6.1 Date Aura 的产品目的

Date Aura 是订阅和每日留存的核心。它让用户相信：

```text
今天有今天自己的气场。
明天会不一样。
所以我每天都要回来。
```

### 6.2 Date Aura 输入

```ts
export interface DateAuraInput {
  localDate: string;      // YYYY-MM-DD
  timezone: string;       // America/Los_Angeles, Asia/Shanghai
}
```

日期必须按用户本地时区计算，不使用服务器 UTC 直接判断“今天”。

### 6.3 Date Aura 三层信号

P0 使用三层日期信号：

```text
Weekday Signal + Day Number + Zodiac Season
```

#### 6.3.1 Weekday Signal

| 星期 | Signal | 心理含义 | 风格方向 |
|---|---|---|---|
| Monday | Moon Signal | 重新开始、情绪整理 | 柔软、浅色、安定 |
| Tuesday | Mars Signal | 行动、推进、边界 | 红色、硬挺、利落 |
| Wednesday | Mercury Signal | 沟通、切换、表达 | 配饰、层次、轻盈 |
| Thursday | Jupiter Signal | 扩张、机会、信心 | 暖色、大廓形、开放 |
| Friday | Venus Signal | 美感、吸引、社交 | 珍珠、粉色、香槟色 |
| Saturday | Saturn Signal | 结构、秩序、保护 | 深色、外套、直线剪裁 |
| Sunday | Sun Signal | 光感、恢复、被看见 | 白色、金色、明亮单品 |

#### 6.3.2 Day Number

计算方式：

```ts
// localDate = "2026-06-13"
// 2+0+2+6+0+6+1+3 = 20 → 2+0 = 2
export function reduceToDayNumber(localDate: string): 1|2|3|4|5|6|7|8|9
```

| Number | Name | 中文 | 心理含义 |
|---|---|---|---|
| 1 | Initiation | 启动 | 开始、主动、点火 |
| 2 | Alignment | 对齐 | 平衡、温柔、关系 |
| 3 | Expression | 表达 | 轻盈、显现、创造 |
| 4 | Structure | 结构 | 秩序、边界、稳定 |
| 5 | Shift | 转变 | 流动、变化、突破 |
| 6 | Care | 照顾 | 温度、关系、自我照顾 |
| 7 | Intuition | 直觉 | 安静、内在、神秘 |
| 8 | Power | 力量 | 掌控、行动、效率 |
| 9 | Release | 释放 | 放下、整理、结束旧状态 |

#### 6.3.3 Zodiac Season

当前日期所属太阳星座季节。

```ts
export function getZodiacSeason(localDate: string): ZodiacSeason
```

例如：

```text
May 21 - Jun 20 → Gemini Season
Jun 21 - Jul 22 → Cancer Season
```

### 6.4 Date Aura 命名规则

Date Aura 不在前端显示复杂公式，只显示结果名。

生成方式：

```text
weekdaySignal.theme + dayNumber.theme + zodiacSeason.styleBias
→ DateAura.auraName
```

示例：

```text
Saturday + Day Number 4 + Gemini Season
→ Clear Structure
```

P0 可使用 mapping 表，不需要 LLM 生成 Date Aura 名。

| Weekday / Number Combination | Date Aura Name | 中文 |
|---|---|---|
| Moon + 2 | Soft Alignment | 柔和对齐 |
| Mars + 1 | Bold Start | 果断启动 |
| Mercury + 3 | Light Expression | 轻盈表达 |
| Jupiter + 8 | Expansive Power | 扩张力量 |
| Venus + 6 | Soft Attraction | 柔和吸引 |
| Saturn + 4 | Clear Structure | 清晰结构 |
| Sun + 9 | Radiant Release | 明亮释放 |
| Moon + 7 | Quiet Intuition | 安静直觉 |
| Mars + 5 | Brave Shift | 勇敢转向 |
| Venus + 2 | Gentle Balance | 温柔平衡 |
| Saturn + 8 | Quiet Authority | 安静分量 |
| Sun + 1 | Solar Opening | 太阳开启 |

如果没有命中特定组合，用 fallback：

```ts
const auraName = `${numberName} ${weekdayStyleWord}`;
```

### 6.5 Date Aura 输出结构

```ts
export interface DateAura {
  localDate: string;
  timezone: string;
  weekday: number;                // 0-6
  weekdayLabel: string;           // Saturday
  weekdaySignal: string;          // Saturn Signal
  dayNumber: 1|2|3|4|5|6|7|8|9;
  dayNumberName: string;          // Structure
  zodiacSeason: string;           // Gemini Season
  auraName: string;               // Clear Structure
  theme: string;                  // Today asks for structure before motion.
  styleBias: string[];            // ["clean lines", "structured jacket", "deep navy"]
  guardianColorBias: string[];    // ["Charcoal Navy", "Soft Black", "Pearl Grey"]
}
```

### 6.6 Date Aura 存储规则

Date Aura 可以每日动态计算，也可以持久化到 `DailyOracle.dateAura` JSON 字段。

P0 规则：

- 每次生成 Daily Oracle 时，将当日 Date Aura 快照写入 DB；
- Journal 和分享卡读取快照，不重新计算；
- 这样即使后续 Date Aura 算法升级，历史卡也不变。

---

## 7. Today Mood 今日状态系统

### 7.1 Mood 目的

Mood 是高命中感核心。用户选了状态后，结果页必须复述它。

### 7.2 P0 Mood 枚举

```ts
export type TodayMood =
  | "drained"
  | "soft"
  | "restless"
  | "hidden"
  | "focused"
  | "magnetic"
  | "unbothered"
  | "main_character";
```

| ID | 英文 | 中文 | 目标状态 | Luck Shift 倾向 |
|---|---|---|---|---|
| drained | Drained | 被消耗 | protected | Drained → Protected |
| soft | Soft | 柔软敏感 | supported | Sensitive → Supported |
| restless | Restless | 有点烦躁 | clear | Scattered → Clear |
| hidden | Hidden | 想隐身 | quietly radiant | Invisible → Quietly Radiant |
| focused | Focused | 想专注 | activated | Ready → Activated |
| magnetic | Magnetic | 想被看见 | cherished | Noticed → Cherished |
| unbothered | Unbothered | 不想被打扰 | shielded | Available → Shielded |
| main_character | Main Character | 想成为主角 | expressive | Ready → Magnetic |

### 7.3 Mood 存储

Mood 写入：

- `DailyCheckIn.mood`
- `DrawSession.mood`
- `DailyOracle.mood`
- `AnalyticsEvent.payload.mood`

---

## 8. Today Scene 今日场景系统

### 8.1 Scene 目的

Scene 让结果从“心理暗示”落到现实场景。

### 8.2 P0 Scene 枚举

```ts
export type TodayScene =
  | "work_study"
  | "important_moment"
  | "stay_low_key"
  | "just_survive"
  | "need_protection"
  | "want_seen"
  | "social"
  | "soft_reset";
```

| ID | 英文 | 中文 | 穿搭倾向 |
|---|---|---|---|
| work_study | Work / Study | 工作 / 学习 | clean, clear, grounded |
| important_moment | Important Moment | 重要时刻 | structured, polished, intentional |
| stay_low_key | Stay Low-Key | 保持低调 | muted, soft shield, minimal |
| just_survive | Just Survive Today | 今天只想撑过去 | comfort, protection, low effort |
| need_protection | Need Protection | 需要保护 | outer layer, deep color, boundary |
| want_seen | Want to Be Seen | 想被看见 | light, accent, visual center |
| social | Date / Social | 约会 / 社交 | harmony, warmth, detail |
| soft_reset | Soft Reset | 想重新调整 | clean, fresh, gentle |

### 8.3 Scene 存储

Scene 写入：

- `DailyCheckIn.scene`
- `DrawSession.scene`
- `DailyOracle.scene`
- `AnalyticsEvent.payload.scene`

---

## 9. Tarot / AuraCue 牌组系统

### 9.1 牌组策略

P0 不做完整 78 张传统塔罗。P0 做 **12 张 AuraCue 自有风格神谕牌**。

原因：

- 便于控制安全表达；
- 便于和穿搭系统绑定；
- 便于形成品牌语言；
- 减少用户理解成本；
- 保证结果质量稳定。

### 9.2 12 张牌结构

```ts
export interface TarotCardDefinition {
  id: string;
  name: string;                 // Strength
  displayName: string;          // Strength
  auraName: string;             // Soft Boundary
  coreEnergy: string;           // boundary, stability, inner strength
  psychologicalCue: string;     // Protect your softness.
  styleKeywords: string[];      // ["structured jacket", "deep colors", "metal detail"]
  colorBias: string[];          // ["Charcoal Navy", "Soft Black", "Deep Plum"]
  guardianItems: GuardianItemDefinition[];
  avoidBias: string[];
  safeInterpretation: string;
  visualTheme: {
    gradient: string;
    symbol: string;
    imagePromptHint: string;
  };
}
```

### 9.3 P0 牌组表

| Card ID | Card | Aura Name | Core Energy | Style Keywords |
|---|---|---|---|---|
| moon | The Moon | Hidden Depth | intuition, protection, sensitivity | deep navy, silver, layered texture |
| sun | The Sun | Radiant Ease | visibility, warmth, openness | white, gold, bright accent |
| strength | Strength | Soft Boundary | boundary, stability, inner power | structured jacket, dark tones, metal detail |
| star | The Star | Clean Renewal | healing, clarity, hope | pale blue, white, light fabric |
| high_priestess | High Priestess | Quiet Power | intuition, mystery, knowing | black-white, navy, silver jewelry |
| empress | The Empress | Soft Abundance | care, softness, self-worth | cream, knit, pearl, soft lines |
| chariot | The Chariot | Locked In | movement, focus, discipline | tailored outerwear, straight pants, sneakers |
| lovers | The Lovers | Chosen Harmony | choice, relation, alignment | matching tones, soft contrast, detail echo |
| magician | The Magician | Main Character Spark | activation, creation, expression | statement accessory, visual center, red lip |
| hermit | The Hermit | Low-Key Shield | solitude, protection, order | grey, long coat, covered silhouette |
| justice | Justice | Clear Line | clarity, balance, boundary | black-white, clean lines, sharp cut |
| temperance | Temperance | Soft Reset | balance, recovery, flow | beige, gradient, soft fabric |

### 9.4 Guardian Item 池

```ts
export interface GuardianItemDefinition {
  id: string;
  label: string;
  category: "outerwear" | "jewelry" | "makeup" | "bag" | "shoe" | "accessory" | "color_anchor";
  psychologicalMeaning: string;
  activationAction: string;
}
```

| Item | 心理含义 | Activation Action |
|---|---|---|
| Structured Jacket | 边界、稳定、不被打扰 | Adjust your sleeve before entering a room. |
| Silver Ring | 清醒、直觉、保护 | Touch your ring before answering. |
| Red Lipstick | 启动、表达、存在感 | Put it on before starting something important. |
| White Shirt | 清洁、秩序、重新开始 | Button your collar before you step out. |
| Gold Necklace | 光感、自信、被看见 | Touch it when you need to show up. |
| Pearl Earrings | 柔软、体面、自我照顾 | Put them on slowly and breathe once. |
| Deep Navy Bag | 稳定、理性、承载 | Hold the strap when you need grounding. |
| Clean Sneakers | 行动、轻盈、出发 | Tie your laces like you are choosing motion. |
| Leather Belt | 收束、掌控、边界 | Fasten it as a signal to hold your center. |
| Soft Scarf | 安抚、温度、保护 | Wrap it once when you need softness. |

### 9.5 抽牌算法

#### 9.5.1 目标

- 同一用户同一天结果稳定；
- 不同用户结果有差异；
- 用户手动选择三张之一；
- 避免用户无限重抽；
- 支持未来 P1 Clarifier Card。

#### 9.5.2 Seed 输入

```ts
const drawSeedInput = {
  anonymousId,
  localDate,
  birthAuraName,
  dateAuraName,
  mood,
  scene
};
```

生成：

```ts
const drawSeed = sha256(JSON.stringify(drawSeedInput));
```

#### 9.5.3 生成三张牌

```ts
function createDailyCardOptions(seed: string, context: OracleContext): TarotCardOption[] {
  const rng = seedrandom(seed);
  const weightedDeck = applyCardWeights(AURACUE_TAROT_DECK, context);
  return sampleWithoutReplacement(weightedDeck, 3, rng).map((card, index) => ({
    position: index + 1,
    cardId: card.id,
    backLabel: `Card ${roman(index + 1)}`
  }));
}
```

#### 9.5.4 权重规则

权重不直接决定最终卡，只影响三张候选卡。

```ts
function applyCardWeights(deck, context) {
  return deck.map(card => {
    let weight = 1;

    if (context.mood === "drained" && ["strength", "star", "hermit"].includes(card.id)) weight += 1.2;
    if (context.mood === "hidden" && ["sun", "hermit", "high_priestess"].includes(card.id)) weight += 1.0;
    if (context.mood === "restless" && ["justice", "temperance", "chariot"].includes(card.id)) weight += 1.0;
    if (context.scene === "important_moment" && ["strength", "justice", "chariot"].includes(card.id)) weight += 1.0;
    if (context.scene === "social" && ["lovers", "empress", "sun"].includes(card.id)) weight += 1.0;

    // 避免连续两天完全相同，除非 P1 要做 repeated theme narrative
    if (context.recentCardIds?.slice(0, 1).includes(card.id)) weight -= 0.5;

    return { ...card, weight: Math.max(0.2, weight) };
  });
}
```

#### 9.5.5 用户选择

用户看到 3 张牌背面，不显示正面。点击后，使用该 position 对应的 cardId 作为 `selectedCard`。

### 9.6 每日唯一性

P0 规则：

- 每个用户每个 localDate 只有一个 Official Daily Oracle；
- 如果用户已经生成今日卡，再次进入直接显示今日卡；
- 不提供无限重抽；
- 如果用户未封印，可以继续完成 Hold to Seal；
- 次日 00:00 本地时间开启新的 oracle。

唯一约束：

```prisma
@@unique([userId, localDate])
```

---

## 10. Daily Style Oracle 输出系统

### 10.1 输出目标

Daily Style Oracle 必须同时完成：

1. 复述用户状态，制造命中感；
2. 引用 Birth Aura，制造专属感；
3. 引用 Date Aura，制造今日感；
4. 引用 Tarot Card，制造神谕感；
5. 输出 Lucky Color、Guardian Item、Style Formula，落到穿搭；
6. 输出 Activation Phrase 和 Action，把暗示带入现实；
7. 生成分享卡内容。

### 10.2 输出 JSON

```ts
export interface DailyStyleOracleContent {
  oracleTitle: string;                 // June 13 Style Oracle
  auraName: string;                    // Soft Boundary

  sourceSignals: {
    birthAuraName: string | null;
    zodiacSignal: string | null;
    dateAuraName: string;
    tarotCardName: string;
    tarotAuraName: string;
    mood: TodayMood;
    scene: TodayScene | null;
  };

  luckShift: {
    from: string;
    to: string;
    label: string;                     // Drained → Protected
  };

  message: {
    mirror: string;                    // You arrived today feeling drained.
    interpretation: string;            // Because your Birth Aura...
    guidance: string;                  // Today, Strength is not asking you...
  };

  style: {
    luckyColor: string;                // Charcoal Navy
    luckyColorHex?: string;            // #263247
    guardianItem: string;              // Structured Jacket
    guardianItemCategory: string;
    guardianItemMeaning: string;
    styleFormula: string;              // Soft layer + clean outer shape + silver detail
    avoidToday: string;                // Anything too loud...
  };

  activation: {
    phrase: string;                    // I can stay soft without being available to everyone.
    action: string;                    // Adjust your sleeve before entering a room.
    sealInstruction: string;           // Hold to seal today's aura.
  };

  share: {
    title: string;                     // Today's Aura: Soft Boundary
    caption: string;                   // Today's card said I need soft boundaries.
    cardLine1: string;
    cardLine2: string;
  };

  safetyNote: string;                  // A cue, not a command.
}
```

### 10.3 必须遵守的文案公式

```text
You arrived today feeling {mood}.
Because your Birth Aura carries {birthAura}, you tend to {personalPattern}.
Today, {dailyCard} is not asking you to {wrongDirection}.
It is asking you to {rightDirection}.

Wear {luckyColor} through {guardianItem}.
When you {activationAction}, remind yourself:
{activationPhrase}
```

中文解释：

```text
你今天带着{今日状态}来到这里。
因为你的本命气场带着{本命气场}，你可能更容易{个人倾向}。
今天的{今日牌面}不是要你{错误方向}，
而是提醒你{正确方向}。

把{幸运色}穿在{守护单品}上。
当你{具体动作}时，提醒自己：
{出门暗示}
```

### 10.4 禁止泛化文案

禁止输出：

```text
You are strong but sensitive.
Believe in yourself.
You have unlimited potential.
Today is a good day to be yourself.
```

原因：太泛，任何人都适用。

必须输出：

- 用户 mood；
- Birth Aura；
- Date Aura；
- Tarot card；
- Lucky color；
- Guardian item；
- Activation action。

---

## 11. 大模型使用方式

### 11.1 总原则

- 前端不能直接调用大模型；
- Prompt 只能在后端；
- 大模型只负责“结构化解释与文案生成”；
- 星座、日期、牌组、抽牌结果必须由后端确定；
- 大模型不能自由决定用户的命运、健康、身体评价或重大人生建议；
- 大模型输出必须是严格 JSON；
- 所有结果必须经过 Zod 校验和安全过滤；
- 无 AI key 时 mock generator 必须能完整跑通。

### 11.2 Provider 设计

```ts
export interface OracleAIProvider {
  generateDailyOracle(input: OracleGenerationInput): Promise<DailyStyleOracleContent>;
}
```

Provider：

| Provider | 用途 |
|---|---|
| mock | 本地、测试、AI 失败 fallback |
| openai-compatible | OpenAI / DeepSeek / 其他兼容接口 |

环境变量：

```env
AI_PROVIDER=mock
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=
OPENAI_BASE_URL=
PROMPT_VERSION=style-oracle-v3
AI_TIMEOUT_MS=12000
AI_MAX_RETRIES=1
```

### 11.3 LLM 输入结构

```ts
export interface OracleGenerationInput {
  user: {
    anonymousId: string;
    locale: "en" | "zh";
    timezone: string;
  };

  birthAura: BirthAuraSnapshot | null;
  dateAura: DateAura;

  checkIn: {
    mood: TodayMood;
    moodLabel: string;
    scene: TodayScene | null;
    sceneLabel: string | null;
  };

  tarot: {
    selectedCard: TarotCardDefinition;
    drawPosition: 1 | 2 | 3;
    drawSeed: string;
  };

  constraints: {
    outputLanguage: "en" | "zh";
    maxMirrorWords: number;
    maxInterpretationWords: number;
    maxGuidanceWords: number;
    allowedGuardianItems: string[];
    allowedLuckyColors: string[];
    forbiddenClaims: string[];
    tone: "soft_luxury_oracle";
  };
}
```

### 11.4 System Prompt

后端 Prompt 模板：

```text
You are AuraCue's Daily Style Oracle writer.
Your job is to transform symbolic inputs into a gentle, fashion-forward, emotionally resonant daily style reading.

You must follow these rules:
1. Return only valid JSON matching the provided schema.
2. Do not claim to predict the future.
3. Do not guarantee luck, love, success, money, health, or any outcome.
4. Do not mention body shape, face, weight, skin defects, attractiveness scores, age judgments, or physical flaws.
5. Do not create fear, dependency, urgency, or punishment.
6. Do not say the user must obey the card.
7. Frame every reading as a cue, reflection, or style intention.
8. Always make the reading feel personal by referencing mood, Birth Aura, Date Aura, and selected card.
9. Always translate the reading into wearable style: luckyColor, guardianItem, styleFormula, avoidToday.
10. Keep the tone poetic but concrete. No vague motivational filler.

Brand tone:
soft luxury, clean beauty, modern oracle, emotionally precise, non-scary, non-clinical.
```

### 11.5 User Prompt 模板

```text
Generate today's Daily Style Oracle from the following signals.

Birth Aura:
{birthAuraJson}

Date Aura:
{dateAuraJson}

User Check-in:
Mood: {moodLabel}
Scene: {sceneLabel}

Selected Tarot Card:
{tarotCardJson}

Allowed lucky colors:
{allowedLuckyColors}

Allowed guardian items:
{allowedGuardianItems}

Required psychological structure:
- mirror: mention the user's selected mood.
- interpretation: connect Birth Aura + Date Aura + Tarot card.
- guidance: say what the card is not asking and what it is asking.
- style: provide luckyColor, guardianItem, guardianItemMeaning, styleFormula, avoidToday.
- activation: provide activationPhrase and activationAction.
- share: provide a short title and social caption.

Return JSON only.
```

### 11.6 JSON Schema / Zod 校验

```ts
import { z } from "zod";

export const DailyStyleOracleContentSchema = z.object({
  oracleTitle: z.string().min(3).max(80),
  auraName: z.string().min(2).max(50),
  sourceSignals: z.object({
    birthAuraName: z.string().nullable(),
    zodiacSignal: z.string().nullable(),
    dateAuraName: z.string(),
    tarotCardName: z.string(),
    tarotAuraName: z.string(),
    mood: z.string(),
    scene: z.string().nullable()
  }),
  luckShift: z.object({
    from: z.string().min(2).max(30),
    to: z.string().min(2).max(30),
    label: z.string().min(3).max(80)
  }),
  message: z.object({
    mirror: z.string().min(10).max(180),
    interpretation: z.string().min(20).max(300),
    guidance: z.string().min(20).max(300)
  }),
  style: z.object({
    luckyColor: z.string().min(2).max(40),
    luckyColorHex: z.string().optional(),
    guardianItem: z.string().min(2).max(60),
    guardianItemCategory: z.string().min(2).max(40),
    guardianItemMeaning: z.string().min(10).max(180),
    styleFormula: z.string().min(10).max(160),
    avoidToday: z.string().min(10).max(160)
  }),
  activation: z.object({
    phrase: z.string().min(8).max(140),
    action: z.string().min(8).max(160),
    sealInstruction: z.string().min(8).max(100)
  }),
  share: z.object({
    title: z.string().min(3).max(80),
    caption: z.string().min(5).max(180),
    cardLine1: z.string().min(3).max(80),
    cardLine2: z.string().min(3).max(100)
  }),
  safetyNote: z.string().min(5).max(120)
});
```

### 11.7 Safety Guard

校验后再做文本安全检查。

禁止词 / 禁止语义：

```ts
const FORBIDDEN_PATTERNS = [
  /guarantee/i,
  /will definitely/i,
  /your fate is/i,
  /bad luck/i,
  /curse/i,
  /must obey/i,
  /if you don't/i,
  /ugly/i,
  /fat/i,
  /skinny/i,
  /face shape/i,
  /body type/i,
  /lose weight/i,
  /make him love you/i,
  /avoid disaster/i
];
```

失败处理：

```text
LLM output invalid
→ retry once with repair prompt
→ still invalid
→ use mock generator
→ write fallbackUsed=true
```

### 11.8 Repair Prompt

```text
Your previous output failed validation or safety checks.
Rewrite it as valid JSON only.
Avoid guarantees, body/face judgments, fear, dependency, or commands.
Keep the reading as a gentle style cue.
```

### 11.9 Mock Generator

Mock generator 必须不依赖 AI，也能生成完整结果。

Mock 逻辑：

```ts
function generateMockOracle(input: OracleGenerationInput): DailyStyleOracleContent {
  const card = input.tarot.selectedCard;
  const moodMeta = MOOD_META[input.checkIn.mood];
  const birthAuraName = input.birthAura?.auraName ?? "Open Aura";
  const dateAuraName = input.dateAura.auraName;
  const item = chooseGuardianItem(card, input);
  const color = chooseLuckyColor(card, input);

  return {
    oracleTitle: `${formatMonthDay(input.dateAura.localDate)} Style Oracle`,
    auraName: card.auraName,
    sourceSignals: {...},
    luckShift: {
      from: moodMeta.from,
      to: moodMeta.to,
      label: `${moodMeta.from} → ${moodMeta.to}`
    },
    message: {
      mirror: `You arrived today feeling ${moodMeta.label.toLowerCase()}.`,
      interpretation: `Because your Birth Aura carries ${birthAuraName} and today's date aura is ${dateAuraName}, ${card.displayName} speaks through ${card.coreEnergy}.`,
      guidance: `This card is not asking you to push harder. It is asking you to carry ${card.auraName.toLowerCase()} in a way you can actually wear.`
    },
    style: {...},
    activation: {...},
    share: {...},
    safetyNote: "This is a cue, not a command."
  };
}
```

---

## 12. 数据存储设计

### 12.1 存储原则

| 数据 | 存哪里 | 原因 |
|---|---|---|
| anonymousId | localStorage + DB | 匿名识别 |
| Birth Aura | DB | 长期个人底色 |
| Date Aura snapshot | DailyOracle JSON | 历史卡不可变化 |
| Mood / Scene | DB + draft | 生成与分析 |
| DrawSession | DB | 防重复、可追踪 |
| Selected Tarot | DB | 结果可复现 |
| LLM input summary | DB JSON | 审计与调试，不存完整 prompt secret |
| LLM output | DB JSON | 页面渲染核心 |
| Activation / Seal | DB | 打卡和订阅留存 |
| Share image URL | DB | 分享复用 |
| Saved card | DB | Journal |
| Analytics | DB | 漏斗分析 |

### 12.2 不应存储

P0 不存：

- 真实姓名；
- 手机号；
- 年龄；
- 精确出生时间；
- 出生地点；
- 身材数据；
- 脸部分析数据；
- 支付信息；
- 大模型 API key；
- 完整系统 Prompt。

### 12.3 LocalStorage Draft

```ts
export interface AuraDraft {
  anonymousId?: string;
  birthAuraCompleted?: boolean;
  localDate?: string;
  mood?: TodayMood;
  scene?: TodayScene;
  drawSessionId?: string;
  selectedDrawPosition?: 1 | 2 | 3;
  currentOracleId?: string;
}
```

LocalStorage 只用于流程草稿，不能作为业务事实源。

---

## 13. 数据库模型 / Prisma Schema

### 13.1 模型清单

P0 必须实现：

| Model | 说明 |
|---|---|
| AnonymousUser | 匿名用户 |
| BirthAuraProfile | 用户本命气场 |
| DailyCheckIn | 每日 mood / scene |
| DrawSession | 抽牌 session |
| DailyOracle | 今日风格神谕主表 |
| GenerationJob | AI 生成任务 |
| AuraActivation | 封印 / 激活记录 |
| SavedCard | 保存记录 |
| ShareEvent | 分享事件 |
| AnalyticsEvent | 埋点 |
| CardTemplate | 分享卡模板 |
| SubscriptionEntitlement | P1 订阅预留 |

### 13.2 Prisma Schema

```prisma
model AnonymousUser {
  id           String   @id @default(cuid())
  anonymousId  String   @unique
  platform     String
  locale       String   @default("en")
  timezone     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  birthAura    BirthAuraProfile?
  checkIns     DailyCheckIn[]
  drawSessions DrawSession[]
  oracles      DailyOracle[]
  jobs         GenerationJob[]
  activations  AuraActivation[]
  savedCards   SavedCard[]
  shares       ShareEvent[]
  analytics    AnalyticsEvent[]
  entitlement  SubscriptionEntitlement?
}

model BirthAuraProfile {
  id                 String   @id @default(cuid())
  userId             String   @unique
  user               AnonymousUser @relation(fields: [userId], references: [id])

  month              Int?
  day                Int?
  skipped            Boolean  @default(false)

  zodiacSign         String?
  zodiacLabel        String?
  element            String?
  modality           String?
  rulingSignal       String?
  birthstoneSignal   String?
  auraName           String
  styleOrigin        String
  guardianColor      String?
  styleMantra        String

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model DailyCheckIn {
  id          String   @id @default(cuid())
  userId      String
  user        AnonymousUser @relation(fields: [userId], references: [id])

  localDate   String
  timezone    String
  mood        String
  scene       String?
  dateAura    Json

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  drawSession DrawSession?
  oracle      DailyOracle?

  @@unique([userId, localDate])
  @@index([localDate])
}

model DrawSession {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])

  checkInId       String
  checkIn         DailyCheckIn @relation(fields: [checkInId], references: [id])

  localDate       String
  timezone        String
  drawSeed        String
  cardOptions     Json
  selectedIndex   Int?
  selectedCardId  String?
  selectedAt      DateTime?
  expiresAt       DateTime
  createdAt       DateTime @default(now())

  jobs            GenerationJob[]

  @@unique([userId, localDate])
  @@index([drawSeed])
}

model GenerationJob {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])

  drawSessionId  String
  drawSession    DrawSession @relation(fields: [drawSessionId], references: [id])

  status         String
  provider       String
  model          String?
  promptVersion  String
  inputSummary   Json
  fallbackUsed   Boolean @default(false)
  errorCode      String?
  resultOracleId String?
  startedAt      DateTime @default(now())
  completedAt    DateTime?

  oracle         DailyOracle?

  @@index([userId, startedAt])
}

model DailyOracle {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])

  localDate        String
  timezone         String

  checkInId        String   @unique
  checkIn          DailyCheckIn @relation(fields: [checkInId], references: [id])

  generationJobId  String   @unique
  generationJob    GenerationJob @relation(fields: [generationJobId], references: [id])

  birthAuraSnapshot Json?
  dateAuraSnapshot  Json
  mood              String
  scene             String?

  drawSeed          String
  drawPosition      Int
  tarotCardId       String
  tarotCardSnapshot Json

  content           Json
  safetyStatus      String   @default("passed")
  shareImageUrl     String?

  isSealed          Boolean  @default(false)
  sealedAt          DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  activations       AuraActivation[]
  savedCards        SavedCard[]
  shares            ShareEvent[]

  @@unique([userId, localDate])
  @@index([localDate])
}

model AuraActivation {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])

  oracleId       String
  oracle         DailyOracle @relation(fields: [oracleId], references: [id])

  guardianItem   String
  luckyColor     String
  status         String
  holdDurationMs Int?
  startedAt      DateTime @default(now())
  sealedAt       DateTime?

  @@index([oracleId, status])
}

model SavedCard {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  oracleId  String
  oracle    DailyOracle @relation(fields: [oracleId], references: [id])
  source    String
  createdAt DateTime @default(now())

  @@unique([userId, oracleId])
}

model ShareEvent {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  oracleId  String
  oracle    DailyOracle @relation(fields: [oracleId], references: [id])
  channel   String
  source    String
  createdAt DateTime @default(now())
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String?
  user      AnonymousUser? @relation(fields: [userId], references: [id])
  eventName String
  page      String?
  platform  String
  payload   Json
  createdAt DateTime @default(now())

  @@index([eventName, createdAt])
  @@index([userId, createdAt])
}

model CardTemplate {
  id        String   @id
  name      String
  format    String
  version   String
  config    Json
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
}

model SubscriptionEntitlement {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           AnonymousUser @relation(fields: [userId], references: [id])

  status         String   @default("free")
  plan           String?
  provider       String?
  expiresAt      DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 14. API 契约

所有 API 返回统一 envelope。

成功：

```json
{
  "ok": true,
  "data": {}
}
```

失败：

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Friendly user-facing message.",
    "details": {}
  }
}
```

### 14.1 `POST /api/v1/identity/anonymous`

用途：创建或复用匿名用户。

Request：

```json
{
  "anonymousId": "anon_optional_existing",
  "platform": "web",
  "timezone": "America/Los_Angeles",
  "locale": "en"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "anonymousId": "anon_abc123",
    "created": true,
    "hasBirthAura": false
  }
}
```

### 14.2 `POST /api/v1/birth-aura`

用途：创建 / 更新 Birth Aura。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "month": 10,
  "day": 7,
  "skip": false
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "birthAura": {
      "zodiacSign": "libra",
      "zodiacLabel": "Libra",
      "element": "air",
      "modality": "cardinal",
      "rulingSignal": "Venus",
      "birthstoneSignal": "Opal",
      "auraName": "Venus Air",
      "styleOrigin": "Soft Balance",
      "guardianColor": "Soft Opal Pink",
      "styleMantra": "I attract through balance, not effort."
    }
  }
}
```

Validation：

- month 1–12；
- day 合法；
- skip=true 时 month/day 可空；
- 不收 year。

### 14.3 `GET /api/v1/birth-aura/me`

Query：

```text
anonymousId=anon_abc123
```

Response：

```json
{
  "ok": true,
  "data": {
    "hasBirthAura": true,
    "birthAura": {}
  }
}
```

### 14.4 `GET /api/v1/date-aura/today`

用途：读取今日 Date Aura。

Query：

```text
anonymousId=anon_abc123&timezone=America/Los_Angeles&localDate=2026-06-13
```

Response：

```json
{
  "ok": true,
  "data": {
    "dateAura": {
      "localDate": "2026-06-13",
      "timezone": "America/Los_Angeles",
      "weekdayLabel": "Saturday",
      "weekdaySignal": "Saturn Signal",
      "dayNumber": 2,
      "dayNumberName": "Alignment",
      "zodiacSeason": "Gemini Season",
      "auraName": "Soft Alignment",
      "theme": "Today asks you to find balance before action.",
      "styleBias": ["clean lines", "soft contrast", "silver detail"],
      "guardianColorBias": ["Charcoal Navy", "Pearl Grey", "Soft Opal Pink"]
    }
  }
}
```

### 14.5 `GET /api/v1/daily-oracles/today`

用途：读取今日状态。

Response：

```json
{
  "ok": true,
  "data": {
    "localDate": "2026-06-13",
    "status": "NOT_STARTED",
    "oracleId": null,
    "isSealed": false,
    "dateAura": {},
    "birthAura": {}
  }
}
```

Status 可为：

```ts
"NOT_STARTED" | "CHECKED_IN" | "DRAW_STARTED" | "GENERATING" | "GENERATED" | "SEALED"
```

### 14.6 `POST /api/v1/daily-check-ins`

用途：提交今日 Mood / Scene。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "timezone": "America/Los_Angeles",
  "localDate": "2026-06-13",
  "mood": "drained",
  "scene": "work_study"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "checkInId": "chk_123",
    "dateAura": {},
    "nextRoute": "/today/draw"
  }
}
```

Rules：

- mood 必填；
- scene 可空，但推荐填写；
- 同一 userId + localDate 幂等更新。

### 14.7 `POST /api/v1/draw-sessions/start`

用途：创建今日三张候选牌。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "checkInId": "chk_123"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "drawSessionId": "draw_123",
    "drawSeed": "seed_xxx",
    "cards": [
      { "position": 1, "backLabel": "Card I" },
      { "position": 2, "backLabel": "Card II" },
      { "position": 3, "backLabel": "Card III" }
    ],
    "expiresAt": "2026-06-13T23:59:59-07:00"
  }
}
```

Important：

- 前端不返回 cardId，避免用户知道未选牌；
- 后端 DB 的 `cardOptions` 内部保存真实 cardId。

### 14.8 `POST /api/v1/draw-sessions/:drawSessionId/select`

用途：用户选择一张牌。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "drawPosition": 2
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "drawSessionId": "draw_123",
    "selectedPosition": 2,
    "selectedAt": "2026-06-13T09:41:00.000Z",
    "nextRoute": "/today/reading"
  }
}
```

Rules：

- drawPosition 只能 1/2/3；
- 同一天已选择则返回原选择，不允许更改；
- 过期 session 返回 `DRAW_SESSION_EXPIRED`。

### 14.9 `POST /api/v1/daily-oracles/generate`

用途：生成今日 Daily Style Oracle。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "drawSessionId": "draw_123"
}
```

Response success：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_123",
    "status": "success",
    "oracleId": "oracle_123",
    "fallbackUsed": false,
    "nextRoute": "/result/oracle_123"
  }
}
```

Response pending：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_123",
    "status": "pending"
  }
}
```

Rules：

- 如果同一 userId + localDate 已有 oracle，直接返回已有 oracle；
- 生成失败 fallback mock；
- 不允许生成多个 Official Oracle。

### 14.10 `GET /api/v1/generation-jobs/:jobId`

用途：轮询生成状态。

Response：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_123",
    "status": "success",
    "oracleId": "oracle_123"
  }
}
```

### 14.11 `GET /api/v1/daily-oracles/:oracleId`

用途：结果页、封印页、分享页读取。

Response：

```json
{
  "ok": true,
  "data": {
    "oracleId": "oracle_123",
    "localDate": "2026-06-13",
    "birthAura": {},
    "dateAura": {},
    "tarotCard": {},
    "content": {},
    "isSealed": false,
    "sealedAt": null,
    "shareImageUrl": null
  }
}
```

### 14.12 `POST /api/v1/daily-oracles/:oracleId/activation/start`

用途：开始封印。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "activationId": "act_123",
    "guardianItem": "Structured Jacket",
    "luckyColor": "Charcoal Navy",
    "status": "started"
  }
}
```

### 14.13 `POST /api/v1/activations/:activationId/seal`

用途：长按 3 秒后封印。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "holdDurationMs": 3120
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "activationId": "act_123",
    "oracleId": "oracle_123",
    "status": "sealed",
    "sealedAt": "2026-06-13T09:45:00.000Z"
  }
}
```

Rules：

- holdDurationMs < 3000 返回 `HOLD_TOO_SHORT`；
- 重复 seal 幂等；
- sealed 后写 `DailyOracle.isSealed=true`。

### 14.14 `POST /api/v1/daily-oracles/:oracleId/render-share-card`

用途：生成 9:16 分享卡。

Response：

```json
{
  "ok": true,
  "data": {
    "shareImageUrl": "/generated-cards/oracle_123.png",
    "width": 1080,
    "height": 1920
  }
}
```

### 14.15 `POST /api/v1/daily-oracles/:oracleId/save`

用途：保存到 Journal。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "source": "result_page"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "saved": true,
    "savedAt": "2026-06-13T09:46:00.000Z"
  }
}
```

### 14.16 `POST /api/v1/daily-oracles/:oracleId/share`

用途：记录分享。

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "channel": "copy_link",
  "source": "share_page"
}
```

### 14.17 `GET /api/v1/journal`

用途：获取历史卡片。

Query：

```text
anonymousId=anon_abc123&limit=14
```

Response：

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "localDate": "2026-06-13",
        "oracleId": "oracle_123",
        "auraName": "Soft Boundary",
        "luckyColor": "Charcoal Navy",
        "guardianItem": "Structured Jacket",
        "isSealed": true
      }
    ]
  }
}
```

### 14.18 `POST /api/v1/analytics/events`

Request：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "eventName": "mood_selected",
  "page": "/today/check-in",
  "payload": {
    "mood": "drained"
  }
}
```

---

## 15. 页面需求与数据写入

### 15.1 `/onboarding/birth-aura`

功能：

- 输入 Month / Day；
- 可 Skip；
- 调 `POST /api/v1/birth-aura`；
- 成功后进入 `/onboarding/birth-aura/reveal`。

写入：

- `BirthAuraProfile`
- `AnalyticsEvent.birth_aura_revealed`

### 15.2 `/onboarding/birth-aura/reveal`

功能：

- 展示 Birth Aura；
- 展示 zodiac / element / birthstone / guardian color；
- CTA `Begin Today’s Ritual`。

读取：

- `GET /api/v1/birth-aura/me`

### 15.3 `/today`

功能：

- 展示本地日期；
- 展示 Date Aura；
- 展示 Birth Aura chip；
- 如果今日已 sealed，展示 `Today's Aura Sealed`；
- 如果未开始，CTA 进入 check-in。

读取：

- `GET /api/v1/daily-oracles/today`
- `GET /api/v1/date-aura/today`

### 15.4 `/today/check-in`

功能：

- 选择 Mood；
- 选择 Scene；
- CTA `Continue to Draw`；
- 调 `POST /api/v1/daily-check-ins`。

写入：

- `DailyCheckIn`
- `AnalyticsEvent.mood_selected`
- `AnalyticsEvent.scene_selected`

### 15.5 `/today/draw`

功能：

- 进入页面调用 `draw-sessions/start`；
- 展示 3 张牌背面；
- 点击后调用 `draw-sessions/:id/select`；
- 进入 Reading。

写入：

- `DrawSession`
- selectedIndex / selectedCardId
- `AnalyticsEvent.draw_session_started`
- `AnalyticsEvent.tarot_card_selected`

### 15.6 `/today/reading`

功能：

- 展示逐行 reading 文案；
- 调 `daily-oracles/generate`；
- 如果 pending，轮询 job；
- 成功进入 `/result/[id]`。

写入：

- `GenerationJob`
- `DailyOracle`
- `AnalyticsEvent.oracle_generated`

### 15.7 `/result/[id]`

功能：

- 展示 Daily Style Oracle；
- 展示 Date Aura、Birth Aura、Tarot、Luck Shift、Lucky Color、Guardian Item、Style Formula、Activation Phrase；
- CTA `Activate Today’s Aura`；
- Save / Share。

读取：

- `GET /api/v1/daily-oracles/:id`

### 15.8 `/activate/[id]`

功能：

- 展示 Guardian Item；
- 展示 Lucky Color；
- 展示 Activation Action；
- Hold to Seal 3 秒；
- 不足 3 秒取消；
- 成功进入 Activated。

写入：

- `AuraActivation`
- `DailyOracle.isSealed`
- `AnalyticsEvent.activation_hold_cancelled`
- `AnalyticsEvent.aura_sealed`

### 15.9 `/activated/[id]`

功能：

- 展示 Aura Sealed；
- 显示 sealed date；
- Save / Share / Done；
- 引导明天回来。

### 15.10 `/share/[id]`

功能：

- 如果 shareImageUrl 不存在，调用 render；
- 展示 9:16 图片；
- 支持 Save Image / Share / Copy Link。

写入：

- `ShareEvent`
- `AnalyticsEvent.share_card_shared`

### 15.11 `/journal`

功能：

- 展示今日卡；
- 展示过去 7 天；
- 点击进入 oracle detail。

读取：

- `GET /api/v1/journal`

---

## 16. 分享卡渲染需求

### 16.1 输出规格

```text
format: PNG
size: 1080 x 1920
ratio: 9:16
```

### 16.2 必须字段

分享卡必须包含：

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
- Draw yours on AuraCue。

### 16.3 示例

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

### 16.4 Renderer 实现建议

P0 推荐两种实现任选其一：

#### 方案 A：SVG → PNG

- 后端生成 SVG 模板；
- 使用 sharp 转 PNG；
- 性能稳定，依赖较少。

#### 方案 B：HTML → PNG

- 使用 Playwright / Puppeteer 截图；
- 视觉还原好；
- 服务器部署稍重。

P0 推荐方案 A。

---

## 17. 订阅预留设计

P0 不接真实支付，但数据和产品结构要为订阅准备。

### 17.1 订阅价值

订阅卖的不是“更多穿搭”，而是：

```text
每天更完整的风格神谕 + 长期气场记录。
```

### 17.2 Free vs Pro

| 功能 | Free | Pro |
|---|---|---|
| 每日 Date Aura | 是 | 是 |
| 每日主牌 | 是 | 是 |
| Luck Shift | 是 | 是 |
| Lucky Color | 是 | 是 |
| Guardian Item | 是 | 是 |
| Activation Phrase | 是 | 是 |
| 完整牌面深度解读 | 否 | 是 |
| 3 套穿搭公式 | 否 | 是 |
| Clarifier Card | 否 | 是 |
| 7-Day Aura Pattern | 否 | 是 |
| Monthly Aura Map | 否 | 是 |
| 高清无水印分享卡 | 否 | 是 |

### 17.3 Paywall 文案

推荐：

```text
Today’s card has more to say.
Unlock the full oracle.
```

禁止：

```text
Unlock now or lose your luck.
```

---

## 18. 安全与品牌边界

### 18.1 禁止表达

不允许：

- 保证改运；
- 不按结果会倒霉；
- 付费才能避免坏运；
- 预测死亡、疾病、灾难；
- 分手 / 辞职 / 投资 / 医疗等重大决策建议；
- 身材、脸、体重、年龄、颜值评价；
- 诱导用户反复抽牌缓解焦虑；
- 对未成年人制造外貌焦虑。

### 18.2 推荐底层态度

```text
This is a cue, not a command.
Use it to enter today’s energy.
```

中文：

```text
这是提示，不是命令。
用它进入今天的状态。
```

### 18.3 Luck Shift 表达边界

使用：

```text
Today’s Luck Shift
Drained → Protected
```

不要使用：

```text
Change your fate today.
```

---

## 19. Analytics 埋点

| Event | 触发点 | Payload |
|---|---|---|
| anonymous_created | 创建匿名用户 | `{platform, timezone, locale}` |
| birth_aura_started | 进入生日页 | `{source}` |
| birth_aura_skipped | 跳过生日 | `{source}` |
| birth_aura_revealed | 生成 Birth Aura | `{zodiacSign, element, auraName}` |
| date_aura_viewed | 打开 Today Gate | `{localDate, dateAuraName}` |
| mood_selected | 选择 mood | `{mood}` |
| scene_selected | 选择 scene | `{scene}` |
| checkin_completed | 提交 check-in | `{mood, scene, localDate}` |
| draw_session_started | 进入抽牌 | `{drawSessionId}` |
| tarot_card_selected | 选牌 | `{position}` |
| oracle_generation_started | 开始生成 | `{drawSessionId}` |
| oracle_generated | 生成成功 | `{oracleId, fallbackUsed}` |
| oracle_result_viewed | 看结果 | `{oracleId, auraName}` |
| activation_started | 进入激活 | `{oracleId, guardianItem}` |
| activation_hold_cancelled | 长按取消 | `{durationMs}` |
| aura_sealed | 长按成功 | `{oracleId, holdDurationMs}` |
| share_card_viewed | 看分享页 | `{oracleId}` |
| share_card_rendered | 分享图生成 | `{oracleId, renderer}` |
| share_card_saved | 保存图片 | `{oracleId}` |
| share_card_shared | 分享 | `{channel}` |
| card_saved | 保存卡片 | `{oracleId, source}` |
| journal_opened | 打开 Journal | `{range}` |
| paywall_viewed | P1 付费页 | `{source}` |
| subscription_started | P1 订阅 | `{plan}` |

---

## 20. 技术架构

### 20.1 Web First

P0 推荐技术栈：

| 层 | 技术 |
|---|---|
| Web | Next.js App Router + TypeScript |
| UI | Tailwind CSS + design tokens |
| API | Next.js Route Handlers `/api/v1/*` |
| DB | PostgreSQL + Prisma |
| AI | OpenAI-compatible provider + mock fallback |
| Renderer | SVG/HTML to PNG |
| Tests | Vitest + React Testing Library + Playwright |

### 20.2 推荐目录结构

```text
AuraCue/
  apps/
    web/
      app/
        onboarding/birth-aura/page.tsx
        onboarding/birth-aura/reveal/page.tsx
        today/page.tsx
        today/check-in/page.tsx
        today/draw/page.tsx
        today/reading/page.tsx
        result/[id]/page.tsx
        activate/[id]/page.tsx
        activated/[id]/page.tsx
        share/[id]/page.tsx
        saved/[id]/page.tsx
        journal/page.tsx
        profile/birth-aura/page.tsx
        api/v1/...
      components/
      lib/
        api-client.ts
        draft-store.ts
        analytics.ts
      server/
        astrology/
        date-aura/
        tarot/
        oracle/
        ai/
        safety/
        renderer/
        repositories/
        validators/
  packages/
    shared-types/
    prompt-core/
    card-renderer/
    analytics-events/
    ui-tokens/
  prisma/
    schema.prisma
    seed.ts
```

---

## 21. 核心服务拆分

### 21.1 Astrology Service

```ts
export class AstrologyService {
  getZodiacSign(month: number, day: number): ZodiacSign;
  createBirthAura(input: { month?: number; day?: number; skip?: boolean }): BirthAuraProfileInput;
}
```

### 21.2 Date Aura Service

```ts
export class DateAuraService {
  getLocalDate(timezone: string, now?: Date): string;
  createDateAura(input: DateAuraInput): DateAura;
}
```

### 21.3 Tarot Service

```ts
export class TarotService {
  createDrawSession(input: CreateDrawSessionInput): DrawSessionPayload;
  selectCard(drawSessionId: string, position: 1|2|3): SelectedTarotPayload;
}
```

### 21.4 Oracle Generation Service

```ts
export class OracleGenerationService {
  generate(input: {
    userId: string;
    drawSessionId: string;
  }): Promise<DailyOracle>;
}
```

### 21.5 Activation Service

```ts
export class ActivationService {
  start(oracleId: string, userId: string): Promise<AuraActivation>;
  seal(activationId: string, userId: string, holdDurationMs: number): Promise<AuraActivation>;
}
```

### 21.6 Share Renderer Service

```ts
export class ShareRendererService {
  renderOracleCard(oracleId: string): Promise<{ shareImageUrl: string }>;
}
```

---

## 22. 测试与验收

### 22.1 单元测试

必须覆盖：

- `getZodiacSign` 边界日期；
- `createBirthAura` 跳过和正常输入；
- `reduceToDayNumber`；
- `createDateAura`；
- `createDailyCardOptions` 稳定性；
- 同 seed 结果稳定；
- 不同日期结果不同；
- LLM JSON schema validation；
- Safety Guard；
- Mock generator 完整输出；
- HoldToSeal 取消和完成。

### 22.2 API 测试

必须覆盖：

- 创建匿名用户；
- 创建 Birth Aura；
- 读取 Date Aura；
- 提交 Mood / Scene；
- 创建 DrawSession；
- 选择牌；
- 生成 Oracle；
- AI fallback；
- 读取 Oracle；
- Seal 不足 3 秒失败；
- Seal 成功；
- 分享图生成；
- 保存；
- 分享；
- Journal 读取。

### 22.3 E2E Happy Path

```text
1. 打开 /onboarding/birth-aura
2. 输入 10 / 7
3. Reveal Birth Aura
4. Begin Today’s Ritual
5. 打开 /today
6. 查看 Date Aura
7. 进入 /today/check-in
8. 选择 Drained
9. 选择 Work / Study
10. Continue
11. 进入 /today/draw
12. 选择第二张牌
13. Reading
14. 生成 result
15. 查看 Luck Shift / Guardian Item
16. Activate
17. 长按 3100ms
18. Aura Sealed
19. Share
20. Save
21. Journal 能看到今日卡片
```

### 22.4 最终验收标准

P0 通过必须满足：

- 无需登录即可完成全流程；
- 输入生日可生成 Birth Aura；
- 跳过生日也可完成；
- 每天有 Date Aura；
- 同一天同用户结果稳定；
- 次日本地时间刷新；
- 用户可以选 Mood / Scene；
- 用户可以三选一抽牌；
- 无 AI key 时 mock 可跑通；
- LLM 输出严格 JSON；
- 不出现禁止文案；
- 结果页有 Lucky Color、Guardian Item、Style Formula、Activation Phrase；
- Hold 不足 3 秒不 seal；
- Hold 满 3 秒 seal；
- 分享卡可生成；
- Journal 能看到今日卡；
- 所有关键数据写 DB；
- 所有关键事件写 Analytics。

---

## 23. 开发执行顺序

推荐开发顺序：

```text
T01 初始化 apps/web + Prisma
T02 实现 Anonymous Identity
T03 实现 AstrologyService + BirthAura API
T04 实现 DateAuraService + Today API
T05 实现 Mood / Scene Check-in API
T06 实现 Tarot Deck + DrawSession API
T07 实现 Mock Oracle Generator
T08 实现 OpenAI-compatible Provider + Safety Guard
T09 实现 Daily Oracle Generate API
T10 实现 Result / Activate / Seal API
T11 实现 Share Renderer
T12 实现 Save / Journal / Share API
T13 实现前端页面链路
T14 实现埋点
T15 完成测试和验收
```

---

## 24. Codex / Agent 开发提示词

给开发 Agent 的完整任务：

```text
请基于 AuraCue Full PRD & Implementation Spec v3.0 实现 AuraCue P0。

产品定位：年轻人的每日风格神谕。
核心公式：Birth Aura + Date Aura + Today Mood + Today Scene + Tarot Pull = Daily Style Oracle。

要求：
1. Web/H5 优先，使用 Next.js App Router + TypeScript。
2. 后端 API 在 /api/v1/*，前端不得直接调用 AI。
3. 使用 PostgreSQL + Prisma，按文档实现所有 P0 表。
4. 实现 Birth Aura：输入生日月/日，生成星座、元素、守护星、生日石、本命气场。
5. 实现 Date Aura：基于用户本地日期、星期、日期数字、星座季节生成今日日期气场。
6. 实现 Mood / Scene Check-in。
7. 实现 12 张 AuraCue 自有塔罗风格牌组。
8. 实现 DrawSession：三张牌背面，用户选择一张；同一用户同一天只允许一个 Official Oracle。
9. 实现 DailyStyleOracle 生成：优先 AI provider，失败 fallback mock；输出严格 JSON。
10. 实现 Safety Guard：禁止保证改运、身体/外貌评价、恐吓、重大决策建议。
11. 实现 Result 页面，展示 Luck Shift、Lucky Color、Guardian Item、Style Formula、Activation Phrase、Activation Action。
12. 实现 Hold to Seal：长按 3000ms 成功，不足取消。
13. 实现 Activated、Share、Save、Journal Lite。
14. 实现 1080x1920 分享图。
15. 实现 analytics 埋点。
16. 写 unit/API/E2E 测试，保证 happy path 和 fallback path 都通过。
```

---

## 25. 最终产品原则

```text
生日让用户相信：这是我的。
日期让用户相信：这是今天的。
状态让用户相信：它看见了我。
场景让用户相信：它知道我今天要面对什么。
抽牌让用户相信：这是我选中的。
穿搭让用户相信：我可以把提示带出门。
封印让用户相信：我已经进入今天的状态。
分享让用户相信：这是我的今日身份。
```

最终体验必须让用户产生：

```text
今天不是随便穿的。
今天这件衣服是我的守护单品。
今天这个颜色是在帮我进入状态。
今天这张牌有点像我。
我明天还想再抽一次。
```

