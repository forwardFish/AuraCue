# AuraCue Web-First Full Development Spec v3.0

> 文档类型：Web/H5 主工程完整开发规格  
> 版本：v3.0  
> 生成日期：2026-06-13  
> 产品定位：**Daily Tarot Style Oracle / 年轻人的每日塔罗风格神谕**  
> 核心链路：**Birth Aura → Date Aura → Mood & Scene → Tarot Pull → Reading → Style Oracle Result → Hold to Seal → Share / Journal**  
> 当前策略：Web/H5 做主工程，小程序后续复用同一套 API、数据库、AI Provider、卡片渲染和状态机。

---

## 0. v3.0 开发结论

v3.0 不再实现旧版：

```text
Mood → Context → Optional Upload → Draw → Aura Card → Choose Anchor → Seal
```

而是实现新版：

```text
Create Birth Aura
→ Reveal Birth Aura
→ Today Gate / Date Aura
→ Mood & Scene Check-in
→ Tarot Pull
→ Reading Your Aura
→ Today’s Style Oracle Result
→ Confirm Guardian Item
→ Hold to Seal
→ Aura Activated
→ Share / Save
→ Journal Lite
```

核心开发目标：

```text
让用户相信：这是我的、这是今天的、这是我亲手抽到的、这是可以穿出去的。
```

---

## 1. 顶层架构原则

### 1.1 产品主次

| 层级 | 定位 | 说明 |
|---|---|---|
| Web/H5 App | 主产品、主工程、主验收面 | 承接海外和链接流量，完成 P0 主链路、分享、A/B、订阅基础 |
| 小程序 | 国内轻量验证入口 | 复用 API，不复制业务逻辑 |
| 后端 API | 统一核心资产 | Web 与小程序共用 API、AI、数据库、渲染、埋点 |
| 数据库 | 唯一业务事实源 | PostgreSQL + Prisma；前端只存 draft，不存核心业务状态 |
| AI Provider | 统一生成层 | 前端不直接写 Prompt、不直接调用大模型 |

### 1.2 P0 不允许方向

- 不允许前端直接调用大模型；
- 不允许前端保存核心业务数据；
- 不允许 P0 强制上传照片；
- 不允许颜值、身体、体重、脸型、身材缺陷评价；
- 不允许保证改运、保证成功、保证恋爱、保证财运；
- 不允许恐吓式付费；
- 不允许无限重抽；
- 不允许在 P0 做完整 78 张传统塔罗；
- 不允许把结果页做成长报告。

---

## 2. 目标目录结构

```text
AuraCue/
  apps/
    web/
      app/
        onboarding/
          birth-aura/page.tsx
          birth-aura/reveal/page.tsx
        today/
          page.tsx
          check-in/page.tsx
          draw/page.tsx
          reading/page.tsx
        result/[id]/page.tsx
        activate/[id]/page.tsx
        activated/[id]/page.tsx
        share/[id]/page.tsx
        saved/[id]/page.tsx
        journal/page.tsx
        profile/birth-aura/page.tsx
        api/v1/...
      components/
        shell/
        ritual/
        oracle/
        tarot/
        share/
        journal/
      lib/
        api-client.ts
        draft-store.ts
        date.ts
        analytics.ts
      server/
        ai/
        analytics/
        renderer/
        repositories/
        services/
        tarot/
        astrology/
        validators/
      tests/
        unit/
        api/
        pages/
      e2e/
  packages/
    shared-types/
    shared-constants/
    prompt-core/
    card-renderer/
    analytics-events/
    ui-tokens/
  prisma/
    schema.prisma
    seed.ts
  scripts/
    acceptance/
```

---

## 3. 技术栈

| 模块 | 技术 |
|---|---|
| Web Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables + ui-tokens |
| DB | PostgreSQL |
| ORM | Prisma |
| API | Next.js Route Handlers `/api/v1/*` |
| Validation | Zod |
| AI | Mock provider + OpenAI-compatible provider |
| Renderer | server-side SVG/HTML → PNG 1080x1920 |
| Tests | Vitest, React Testing Library, Playwright |
| Identity | anonymous identity，无强制登录 |

---

## 4. 核心领域模型

### 4.1 主输入输出公式

```text
BirthAura
+ DateAura
+ TodayMood
+ TodayScene
+ TarotCard
= DailyStyleOracle
```

最终输出：

```text
LuckShift
LuckyColor
GuardianItem
StyleFormula
AvoidToday
ActivationPhrase
ActivationAction
ShareCard
```

---

## 5. TypeScript 类型定义

### 5.1 Platform

```ts
export type Platform = "web" | "wechat";
```

### 5.2 Birth Aura

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

export type ElementType = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";

export type BirthAura = {
  zodiacSign: ZodiacSign | "unknown";
  element: ElementType | "unknown";
  modality: Modality | "unknown";
  rulingSignal: string;
  birthstoneSignal: string;
  auraName: string;
  styleOrigin: string;
  guardianColor: string;
  styleMantra: string;
  month?: number;
  day?: number;
  skipped: boolean;
};
```

### 5.3 Date Aura

```ts
export type DateAura = {
  localDate: string; // YYYY-MM-DD in user timezone
  timezone: string;
  weekdaySignal: string;
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  zodiacSeason: string;
  auraName: string;
  theme: string;
  styleBias: string[];
};
```

### 5.4 Mood / Scene

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

export type TodayScene =
  | "work_study"
  | "important_moment"
  | "stay_low_key"
  | "just_survive"
  | "need_protection"
  | "want_seen"
  | "social"
  | "soft_reset"
  | "skip";
```

### 5.5 Tarot Card

```ts
export type TarotCard = {
  id: string;
  name: string;
  auraName: string;
  coreEnergy: string;
  styleKeywords: string[];
  luckyColorPool: string[];
  guardianItemPool: string[];
  styleFormulaPool: string[];
  activationActionPool: string[];
  safeInterpretation: string;
};
```

### 5.6 Daily Style Oracle

```ts
export type DailyStyleOracleContent = {
  oracleTitle: string;
  auraName: string;

  birthAura: BirthAura | null;
  dateAura: DateAura;
  mood: TodayMood;
  scene: TodayScene | null;
  tarotCard: TarotCard;

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

  safetyNote: string;
};
```

---

## 6. 内容常量设计

### 6.1 Zodiac → Birth Aura 映射

```ts
export const ZODIAC_AURA_MAP = {
  aries: {
    auraName: "Mars Fire",
    element: "fire",
    modality: "cardinal",
    rulingSignal: "Mars",
    styleOrigin: "Bold Start",
    guardianColor: "Ember Red",
    styleMantra: "I begin before I overthink."
  },
  taurus: {
    auraName: "Venus Earth",
    element: "earth",
    modality: "fixed",
    rulingSignal: "Venus",
    styleOrigin: "Soft Grounding",
    guardianColor: "Cream Moss",
    styleMantra: "I attract through calm presence."
  },
  gemini: {
    auraName: "Mercury Air",
    element: "air",
    modality: "mutable",
    rulingSignal: "Mercury",
    styleOrigin: "Light Expression",
    guardianColor: "Pale Yellow",
    styleMantra: "I move lightly and speak clearly."
  },
  cancer: {
    auraName: "Moon Water",
    element: "water",
    modality: "cardinal",
    rulingSignal: "Moon",
    styleOrigin: "Soft Protection",
    guardianColor: "Pearl White",
    styleMantra: "I protect my softness."
  },
  leo: {
    auraName: "Solar Fire",
    element: "fire",
    modality: "fixed",
    rulingSignal: "Sun",
    styleOrigin: "Radiant Presence",
    guardianColor: "Warm Gold",
    styleMantra: "I can be seen without performing."
  },
  virgo: {
    auraName: "Mercury Earth",
    element: "earth",
    modality: "mutable",
    rulingSignal: "Mercury",
    styleOrigin: "Clean Detail",
    guardianColor: "Soft Ivory",
    styleMantra: "I find power in clarity."
  },
  libra: {
    auraName: "Venus Air",
    element: "air",
    modality: "cardinal",
    rulingSignal: "Venus",
    styleOrigin: "Soft Balance",
    guardianColor: "Soft Opal Pink",
    styleMantra: "I attract through balance, not effort."
  },
  scorpio: {
    auraName: "Shadow Water",
    element: "water",
    modality: "fixed",
    rulingSignal: "Pluto",
    styleOrigin: "Deep Boundary",
    guardianColor: "Black Cherry",
    styleMantra: "I do not need to reveal everything."
  },
  sagittarius: {
    auraName: "Jupiter Fire",
    element: "fire",
    modality: "mutable",
    rulingSignal: "Jupiter",
    styleOrigin: "Open Horizon",
    guardianColor: "Burnt Amber",
    styleMantra: "I carry luck through movement."
  },
  capricorn: {
    auraName: "Saturn Earth",
    element: "earth",
    modality: "cardinal",
    rulingSignal: "Saturn",
    styleOrigin: "Quiet Authority",
    guardianColor: "Charcoal Brown",
    styleMantra: "I am steady without proving."
  },
  aquarius: {
    auraName: "Uranus Air",
    element: "air",
    modality: "fixed",
    rulingSignal: "Uranus",
    styleOrigin: "Cool Distance",
    guardianColor: "Electric Blue",
    styleMantra: "I belong without blending in."
  },
  pisces: {
    auraName: "Neptune Water",
    element: "water",
    modality: "mutable",
    rulingSignal: "Neptune",
    styleOrigin: "Dream Flow",
    guardianColor: "Mist Lavender",
    styleMantra: "I trust what I feel before I explain it."
  }
} as const;
```

### 6.2 Birthstone 映射

```ts
export const BIRTHSTONE_MAP = {
  1: { name: "Garnet", color: "Deep Garnet", meaning: "protection and steady warmth" },
  2: { name: "Amethyst", color: "Soft Violet", meaning: "intuition and calm" },
  3: { name: "Aquamarine", color: "Clear Aqua", meaning: "flow and clarity" },
  4: { name: "Diamond", color: "Clear White", meaning: "clarity and resilience" },
  5: { name: "Emerald", color: "Emerald Green", meaning: "growth and abundance" },
  6: { name: "Pearl", color: "Pearl White", meaning: "softness and protection" },
  7: { name: "Ruby", color: "Ruby Red", meaning: "courage and presence" },
  8: { name: "Peridot", color: "Peridot Green", meaning: "lightness and renewal" },
  9: { name: "Sapphire", color: "Sapphire Blue", meaning: "wisdom and order" },
  10: { name: "Opal", color: "Soft Opal Pink", meaning: "subtle attraction and change" },
  11: { name: "Citrine", color: "Warm Citrine", meaning: "confidence and warmth" },
  12: { name: "Turquoise", color: "Turquoise Blue", meaning: "protection and open horizons" }
} as const;
```

### 6.3 12 张核心牌组

```ts
export const AURACUE_TAROT_CARDS: TarotCard[] = [
  {
    id: "moon",
    name: "The Moon",
    auraName: "Hidden Depth",
    coreEnergy: "intuition, sensitivity, protection",
    styleKeywords: ["deep navy", "silver", "layers", "soft mystery"],
    luckyColorPool: ["Deep Navy", "Mist Lavender", "Moonlit Grey"],
    guardianItemPool: ["Silver ring", "Soft scarf", "Deep blue bag"],
    styleFormulaPool: ["soft layer + moonlit detail + low contrast"],
    activationActionPool: ["Touch your ring before responding."],
    safeInterpretation: "Today asks you to protect what you do not need to explain."
  },
  {
    id: "sun",
    name: "The Sun",
    auraName: "Radiant Ease",
    coreEnergy: "visibility, warmth, openness",
    styleKeywords: ["warm white", "gold", "light silhouettes"],
    luckyColorPool: ["Warm Gold", "Ivory", "Soft Yellow"],
    guardianItemPool: ["Gold necklace", "White shirt", "Light jacket"],
    styleFormulaPool: ["clean white base + warm accent + easy shape"],
    activationActionPool: ["Lift your chin before entering the room."],
    safeInterpretation: "Today asks you to be visible without performing."
  },
  {
    id: "strength",
    name: "Strength",
    auraName: "Soft Boundary",
    coreEnergy: "inner strength, protection, steady boundary",
    styleKeywords: ["structured jacket", "charcoal", "metal detail"],
    luckyColorPool: ["Charcoal Navy", "Deep Brown", "Black"],
    guardianItemPool: ["Structured jacket", "Leather belt", "Silver ring"],
    styleFormulaPool: ["soft layer + clean outer shape + metal detail"],
    activationActionPool: ["Adjust your sleeve before entering a room."],
    safeInterpretation: "Today asks you to protect your softness with structure."
  },
  {
    id: "star",
    name: "The Star",
    auraName: "Clean Renewal",
    coreEnergy: "recovery, hope, clarity",
    styleKeywords: ["pale blue", "white", "light texture"],
    luckyColorPool: ["Pale Blue", "Pearl White", "Clear Silver"],
    guardianItemPool: ["White shirt", "Silver earrings", "Clean sneakers"],
    styleFormulaPool: ["pale color + breathable fabric + clean detail"],
    activationActionPool: ["Take one slow breath before you leave."],
    safeInterpretation: "Today asks you to recover without rushing."
  },
  {
    id: "high_priestess",
    name: "High Priestess",
    auraName: "Quiet Power",
    coreEnergy: "intuition, quiet authority, mystery",
    styleKeywords: ["black and white", "deep blue", "silver"],
    luckyColorPool: ["Ink Navy", "Pearl White", "Silver"],
    guardianItemPool: ["Silver earrings", "Black bag", "Silk scarf"],
    styleFormulaPool: ["quiet base + one precise detail + clean contrast"],
    activationActionPool: ["Pause before answering."],
    safeInterpretation: "Today asks you to trust what you already know."
  },
  {
    id: "empress",
    name: "The Empress",
    auraName: "Soft Abundance",
    coreEnergy: "self-care, softness, fullness",
    styleKeywords: ["cream", "knit", "pearl", "soft lines"],
    luckyColorPool: ["Cream", "Blush", "Warm Beige"],
    guardianItemPool: ["Pearl earrings", "Soft knit", "Cream bag"],
    styleFormulaPool: ["soft texture + warm neutral + gentle accessory"],
    activationActionPool: ["Touch your earring when you need softness."],
    safeInterpretation: "Today asks you to treat softness as power."
  },
  {
    id: "chariot",
    name: "The Chariot",
    auraName: "Locked In",
    coreEnergy: "direction, action, focus",
    styleKeywords: ["straight lines", "sneakers", "structured outerwear"],
    luckyColorPool: ["Graphite", "Clean White", "Sport Red"],
    guardianItemPool: ["Clean sneakers", "Structured jacket", "Belt"],
    styleFormulaPool: ["straight pants + clean shoes + focused outer layer"],
    activationActionPool: ["Tie or adjust your shoes before starting."],
    safeInterpretation: "Today asks you to move with direction."
  },
  {
    id: "lovers",
    name: "The Lovers",
    auraName: "Chosen Harmony",
    coreEnergy: "choice, harmony, connection",
    styleKeywords: ["matching set", "soft contrast", "paired details"],
    luckyColorPool: ["Rose Beige", "Soft Blue", "Ivory"],
    guardianItemPool: ["Matching set", "Pair of earrings", "Coordinated bag"],
    styleFormulaPool: ["two soft colors + one repeated detail"],
    activationActionPool: ["Check one detail that feels aligned."],
    safeInterpretation: "Today asks you to choose what feels aligned."
  },
  {
    id: "magician",
    name: "The Magician",
    auraName: "Main Character Spark",
    coreEnergy: "expression, initiation, creative control",
    styleKeywords: ["statement accessory", "red lip", "visual focus"],
    luckyColorPool: ["Clear Red", "Bright Gold", "Black"],
    guardianItemPool: ["Red lipstick", "Statement ring", "Sharp bag"],
    styleFormulaPool: ["simple base + one strong focal point"],
    activationActionPool: ["Apply or touch your statement detail before starting."],
    safeInterpretation: "Today asks you to use one clear signal."
  },
  {
    id: "hermit",
    name: "The Hermit",
    auraName: "Low-Key Shield",
    coreEnergy: "privacy, restoration, quiet shield",
    styleKeywords: ["grey", "long coat", "soft coverage"],
    luckyColorPool: ["Soft Grey", "Warm Taupe", "Deep Olive"],
    guardianItemPool: ["Long coat", "Soft scarf", "Crossbody bag"],
    styleFormulaPool: ["covered silhouette + quiet color + comfortable texture"],
    activationActionPool: ["Wrap or adjust your outer layer before stepping out."],
    safeInterpretation: "Today asks you to keep your energy close."
  },
  {
    id: "justice",
    name: "Justice",
    auraName: "Clear Line",
    coreEnergy: "clarity, balance, clean boundary",
    styleKeywords: ["black and white", "tailoring", "sharp lines"],
    luckyColorPool: ["Black", "White", "Slate"],
    guardianItemPool: ["White shirt", "Black blazer", "Watch"],
    styleFormulaPool: ["black-white base + clean line + minimal detail"],
    activationActionPool: ["Straighten your collar before a decision."],
    safeInterpretation: "Today asks you to make the line clear."
  },
  {
    id: "temperance",
    name: "Temperance",
    auraName: "Soft Reset",
    coreEnergy: "balance, recovery, integration",
    styleKeywords: ["beige", "gradient", "soft material"],
    luckyColorPool: ["Warm Beige", "Pale Peach", "Soft Taupe"],
    guardianItemPool: ["Soft cardigan", "Neutral scarf", "Beige tote"],
    styleFormulaPool: ["soft neutral + relaxed layer + gentle transition"],
    activationActionPool: ["Smooth your layer when you feel rushed."],
    safeInterpretation: "Today asks you to reset gently, not restart harshly."
  }
];
```

---

## 7. 算法实现

### 7.1 计算 Zodiac Sign

```ts
export function getZodiacSign(month: number, day: number): ZodiacSign {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return "aries";
  if (md >= 420 && md <= 520) return "taurus";
  if (md >= 521 && md <= 620) return "gemini";
  if (md >= 621 && md <= 722) return "cancer";
  if (md >= 723 && md <= 822) return "leo";
  if (md >= 823 && md <= 922) return "virgo";
  if (md >= 923 && md <= 1022) return "libra";
  if (md >= 1023 && md <= 1121) return "scorpio";
  if (md >= 1122 && md <= 1221) return "sagittarius";
  if (md >= 1222 || md <= 119) return "capricorn";
  if (md >= 120 && md <= 218) return "aquarius";
  return "pisces";
}
```

### 7.2 创建 Birth Aura

```ts
export function createBirthAura(input: { month?: number; day?: number; skipped?: boolean }): BirthAura {
  if (input.skipped || !input.month || !input.day) {
    return {
      zodiacSign: "unknown",
      element: "unknown",
      modality: "unknown",
      rulingSignal: "Unknown Signal",
      birthstoneSignal: "Unknown Stone",
      auraName: "Open Aura",
      styleOrigin: "Open Signal",
      guardianColor: "Pearl White",
      styleMantra: "I can meet today in my own way.",
      skipped: true
    };
  }

  const zodiacSign = getZodiacSign(input.month, input.day);
  const zodiac = ZODIAC_AURA_MAP[zodiacSign];
  const stone = BIRTHSTONE_MAP[input.month as keyof typeof BIRTHSTONE_MAP];

  return {
    zodiacSign,
    element: zodiac.element,
    modality: zodiac.modality,
    rulingSignal: zodiac.rulingSignal,
    birthstoneSignal: stone.name,
    auraName: zodiac.auraName,
    styleOrigin: zodiac.styleOrigin,
    guardianColor: stone.color || zodiac.guardianColor,
    styleMantra: zodiac.styleMantra,
    month: input.month,
    day: input.day,
    skipped: false
  };
}
```

### 7.3 计算 Date Aura

```ts
export function getDayNumber(localDate: string): 1|2|3|4|5|6|7|8|9 {
  const digits = localDate.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  return sum as 1|2|3|4|5|6|7|8|9;
}

export function createDateAura(localDate: string, timezone: string): DateAura {
  const date = new Date(`${localDate}T12:00:00`);
  const weekday = date.getDay();
  const dayNumber = getDayNumber(localDate);
  const zodiacSeason = getZodiacSeasonFromDate(date);

  const weekdaySignalMap = [
    "Sun Signal",
    "Moon Signal",
    "Mars Signal",
    "Mercury Signal",
    "Jupiter Signal",
    "Venus Signal",
    "Saturn Signal"
  ];

  const numberAuraMap = {
    1: "Bold Start",
    2: "Soft Alignment",
    3: "Light Expression",
    4: "Clear Structure",
    5: "Open Shift",
    6: "Gentle Care",
    7: "Quiet Intuition",
    8: "Grounded Power",
    9: "Radiant Release"
  } as const;

  return {
    localDate,
    timezone,
    weekdaySignal: weekdaySignalMap[weekday],
    dayNumber,
    zodiacSeason,
    auraName: numberAuraMap[dayNumber],
    theme: getDateAuraTheme(dayNumber),
    styleBias: getDateAuraStyleBias(dayNumber)
  };
}
```

### 7.4 生成每日候选牌

目标：

- 同一用户同一天稳定；
- 不同用户因生日、日期、状态、场景不同而不同；
- 不允许无限重抽；
- 允许三张候选牌由后端生成，用户亲手选一张。

```ts
export function createDailySeed(input: {
  userId: string;
  localDate: string;
  birthAuraName: string;
  mood: TodayMood;
  scene?: TodayScene | null;
}) {
  return hashString([
    input.userId,
    input.localDate,
    input.birthAuraName,
    input.mood,
    input.scene || "skip"
  ].join("|"));
}

export function createTarotOptions(seed: string): TarotCard[] {
  const shuffled = seededShuffle(AURACUE_TAROT_CARDS, seed);
  return shuffled.slice(0, 3);
}
```

### 7.5 幂等规则

```text
同一 anonymousId + localDate 只能有一个 officialOracle。
如果用户今天已经完成 Tarot Pull，再次进入时展示已选牌和结果。
如果用户今天已经 sealed，Today Gate 直接显示 Today’s Aura Sealed。
```

---

## 8. AI 生成系统

### 8.1 Provider 策略

| provider | 用途 |
|---|---|
| `mock` | 本地、CI、无 key 环境必须可跑通 |
| `openai-compatible` | 线上可选，支持 OpenAI/DeepSeek-compatible endpoint |

环境变量：

```env
AI_PROVIDER=mock
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=
OPENAI_BASE_URL=
PROMPT_VERSION=daily-tarot-style-oracle-v3
```

### 8.2 AI 输入

```ts
export type OracleGenerationInput = {
  language: "en" | "zh";
  birthAura: BirthAura | null;
  dateAura: DateAura;
  mood: TodayMood;
  scene: TodayScene | null;
  tarotCard: TarotCard;
  localDate: string;
};
```

### 8.3 System Prompt

```text
You are AuraCue's Daily Tarot Style Oracle writer.
Your job is to translate symbolic tarot energy into safe, stylish, wearable daily guidance.

Rules:
- Do not claim to predict the future.
- Do not guarantee luck, love, money, health, or success.
- Do not create fear, dependency, or urgency.
- Do not mention body flaws, face shape, weight, attractiveness scores, or appearance defects.
- Do not give medical, legal, financial, or crisis advice.
- Keep the tone elegant, intimate, modern, and emotionally precise.
- Use the user's mood, scene, birth aura, date aura, and tarot card.
- Output must be valid JSON matching the schema.
- The result should feel personal, specific, and wearable.
- Use "cue, not command" philosophy.
```

### 8.4 User Prompt Template

```text
Create a Daily Tarot Style Oracle.

User context:
- Local date: {localDate}
- Birth Aura: {birthAura.auraName}
- Zodiac signal: {birthAura.zodiacSign}
- Element: {birthAura.element}
- Guardian color: {birthAura.guardianColor}
- Date Aura: {dateAura.auraName}
- Date theme: {dateAura.theme}
- Mood: {mood}
- Scene: {scene}
- Tarot card: {tarotCard.name}
- Tarot aura name: {tarotCard.auraName}
- Tarot safe interpretation: {tarotCard.safeInterpretation}
- Style keywords: {tarotCard.styleKeywords}
- Lucky color candidates: {tarotCard.luckyColorPool}
- Guardian item candidates: {tarotCard.guardianItemPool}
- Activation action candidates: {tarotCard.activationActionPool}

Return JSON only.
```

### 8.5 AI 输出 JSON Schema

```ts
export const DailyOracleOutputSchema = z.object({
  oracleTitle: z.string().min(3).max(80),
  auraName: z.string().min(3).max(60),
  luckShift: z.object({
    from: z.string().min(2).max(40),
    to: z.string().min(2).max(40),
    label: z.string().min(4).max(80)
  }),
  message: z.object({
    mirror: z.string().min(20).max(180),
    interpretation: z.string().min(40).max(260),
    guidance: z.string().min(30).max(180)
  }),
  style: z.object({
    luckyColor: z.string().min(2).max(40),
    guardianItem: z.string().min(2).max(60),
    styleFormula: z.string().min(8).max(120),
    avoidToday: z.string().min(8).max(140)
  }),
  activation: z.object({
    phrase: z.string().min(8).max(140),
    action: z.string().min(8).max(120)
  }),
  share: z.object({
    title: z.string().min(4).max(80),
    caption: z.string().min(4).max(160)
  }),
  safetyNote: z.string().min(10).max(160)
});
```

### 8.6 Safety Guard

生成后必须检查：

```ts
const forbiddenPatterns = [
  /guarantee/i,
  /will definitely/i,
  /bad luck/i,
  /curse/i,
  /must wear/i,
  /you will fail/i,
  /change your fate/i,
  /body flaw/i,
  /fat/i,
  /skinny/i,
  /ugly/i,
  /face shape/i,
  /weight/i
];
```

规则：

- 如果命中 forbidden，重试 1 次；
- 仍失败，使用 mock fallback；
- 不把 unsafe 输出写入 `DailyOracle`；
- 写入 `GenerationJob.errorCode = UNSAFE_OUTPUT_BLOCKED`。

### 8.7 Mock Generator

Mock 必须按同样 schema 输出，确保无 AI key 时完整跑通。

```ts
export function generateMockOracle(input: OracleGenerationInput): DailyStyleOracleContent {
  const card = input.tarotCard;
  const luckyColor = pickSeeded(card.luckyColorPool, input.localDate + input.mood);
  const guardianItem = pickSeeded(card.guardianItemPool, input.localDate + input.scene);
  const action = pickSeeded(card.activationActionPool, input.localDate + guardianItem);

  return {
    oracleTitle: `${formatDate(input.localDate)} Style Oracle`,
    auraName: card.auraName,
    birthAura: input.birthAura,
    dateAura: input.dateAura,
    mood: input.mood,
    scene: input.scene,
    tarotCard: card,
    luckShift: buildLuckShift(input.mood, card),
    message: {
      mirror: buildMirror(input.mood, input.scene),
      interpretation: buildInterpretation(input.birthAura, input.dateAura, card),
      guidance: card.safeInterpretation
    },
    style: {
      luckyColor,
      guardianItem,
      styleFormula: pickSeeded(card.styleFormulaPool, guardianItem),
      avoidToday: buildAvoidToday(input.mood, card)
    },
    activation: {
      phrase: buildActivationPhrase(input.mood, card),
      action
    },
    share: {
      title: `Today’s Aura: ${card.auraName}`,
      caption: `Today’s card said I need ${card.auraName.toLowerCase()}.`
    },
    safetyNote: "This is a cue, not a command. Use it to enter today’s energy."
  };
}
```

---

## 9. 数据库设计

### 9.1 Prisma 模型清单

| Model | P0 必须 | 说明 |
|---|---|---|
| `AnonymousUser` | 是 | 匿名用户 |
| `BirthAuraProfile` | 是 | 本命气场 |
| `DailyCheckIn` | 是 | 日期、mood、scene |
| `TarotDrawSession` | 是 | 三张候选牌、选中牌 |
| `GenerationJob` | 是 | AI / mock 生成状态 |
| `DailyOracle` | 是 | 今日神谕结果 |
| `AuraActivation` | 是 | 封印状态 |
| `SavedCard` | 是 | 保存记录 |
| `ShareEvent` | 是 | 分享记录 |
| `AnalyticsEvent` | 是 | 埋点 |
| `CardTemplate` | 是 | 分享模板 |
| `SubscriptionEntitlement` | P1 | 订阅权益 |
| `EveningReflection` | P1 | 晚间反馈 |

### 9.2 Prisma Schema

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
  drawSessions TarotDrawSession[]
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
  month             Int?
  day               Int?
  skipped           Boolean  @default(false)
  zodiacSign         String
  element            String
  modality           String
  rulingSignal       String
  birthstoneSignal   String
  auraName           String
  styleOrigin        String
  guardianColor      String
  styleMantra        String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model DailyCheckIn {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])
  localDate        String
  timezone         String
  dateAuraSnapshot Json
  mood             String
  scene            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  drawSessions TarotDrawSession[]
  oracle       DailyOracle?

  @@unique([userId, localDate])
  @@index([localDate])
}

model TarotDrawSession {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])
  checkInId        String
  checkIn          DailyCheckIn @relation(fields: [checkInId], references: [id])
  localDate        String
  drawSeed         String
  cardOptions      Json
  selectedCardId   String?
  selectedIndex    Int?
  selectedAt       DateTime?
  expiresAt        DateTime
  createdAt        DateTime @default(now())

  jobs GenerationJob[]

  @@index([userId, localDate])
}

model GenerationJob {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])
  drawSessionId   String
  drawSession     TarotDrawSession @relation(fields: [drawSessionId], references: [id])
  status          String
  provider        String
  promptVersion   String
  fallbackUsed    Boolean @default(false)
  errorCode       String?
  resultOracleId  String?
  startedAt       DateTime @default(now())
  completedAt     DateTime?

  oracle DailyOracle?
}

model DailyOracle {
  id                 String   @id @default(cuid())
  userId             String
  user               AnonymousUser @relation(fields: [userId], references: [id])
  checkInId           String   @unique
  checkIn             DailyCheckIn @relation(fields: [checkInId], references: [id])
  generationJobId     String   @unique
  generationJob       GenerationJob @relation(fields: [generationJobId], references: [id])
  localDate           String
  timezone            String
  birthAuraSnapshot   Json?
  dateAuraSnapshot    Json
  mood                String
  scene               String?
  tarotCardSnapshot   Json
  content             Json
  shareImageUrl       String?
  isSealed            Boolean @default(false)
  sealedAt            DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  activations AuraActivation[]
  savedCards  SavedCard[]
  shares      ShareEvent[]

  @@unique([userId, localDate])
  @@index([localDate])
}

model AuraActivation {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])
  oracleId        String
  oracle          DailyOracle @relation(fields: [oracleId], references: [id])
  guardianItem    String
  luckyColor      String
  status          String
  holdDurationMs  Int?
  startedAt       DateTime @default(now())
  sealedAt        DateTime?

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
  id           String   @id @default(cuid())
  userId       String
  plan         String
  status       String
  platform     String
  expiresAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId, status])
}

model EveningReflection {
  id          String   @id @default(cuid())
  userId      String
  oracleId    String
  localDate   String
  rating      String
  note        String?
  createdAt   DateTime @default(now())

  @@unique([userId, localDate])
}
```

---

## 10. API 契约

统一 envelope：

```ts
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { code: string; message: string; details?: unknown } };
```

### 10.1 Identity

#### `POST /api/v1/identity/anonymous`

Request：

```json
{
  "platform": "web",
  "timezone": "America/Los_Angeles"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "anonymousId": "anon_xxx",
    "created": true
  }
}
```

---

### 10.2 Birth Aura

#### `POST /api/v1/birth-aura`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "month": 10,
  "day": 7,
  "skipped": false
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "birthAura": {
      "zodiacSign": "libra",
      "element": "air",
      "modality": "cardinal",
      "rulingSignal": "Venus",
      "birthstoneSignal": "Opal",
      "auraName": "Venus Air",
      "styleOrigin": "Soft Balance",
      "guardianColor": "Soft Opal Pink",
      "styleMantra": "I attract through balance, not effort.",
      "skipped": false
    }
  }
}
```

#### `GET /api/v1/birth-aura?anonymousId=...`

返回当前用户 Birth Aura。

---

### 10.3 Date Aura / Today Gate

#### `GET /api/v1/today`

Query：

```text
anonymousId=anon_xxx&timezone=America/Los_Angeles
```

Response：

```json
{
  "ok": true,
  "data": {
    "localDate": "2026-06-13",
    "dateAura": {
      "auraName": "Clear Structure",
      "weekdaySignal": "Saturn Signal",
      "dayNumber": 4,
      "zodiacSeason": "Gemini Season",
      "theme": "Today asks for structure before expansion.",
      "styleBias": ["clean lines", "soft contrast", "structured outer layer"]
    },
    "birthAura": {},
    "todayStatus": {
      "hasCheckIn": false,
      "hasOracle": false,
      "isSealed": false,
      "oracleId": null
    }
  }
}
```

---

### 10.4 Daily Check-in

#### `POST /api/v1/daily-check-ins`

Request：

```json
{
  "anonymousId": "anon_xxx",
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
    "checkInId": "chk_xxx",
    "localDate": "2026-06-13",
    "dateAura": {}
  }
}
```

Rules：

- `mood` 必填；
- `scene` 可为 `skip`；
- 同一用户同一天幂等更新，保留第一次生成 Oracle 前的选择；
- 如果今天已生成 Oracle，不允许修改 mood/scene 覆盖结果。

---

### 10.5 Tarot Draw Session

#### `POST /api/v1/tarot-draw-sessions/start`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "checkInId": "chk_xxx"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "drawSessionId": "draw_xxx",
    "drawSeed": "seed_xxx",
    "expiresAt": "2026-06-13T10:30:00.000Z",
    "cards": [
      { "position": 1, "cardBackVariant": "moon", "label": "I" },
      { "position": 2, "cardBackVariant": "sun", "label": "II" },
      { "position": 3, "cardBackVariant": "star", "label": "III" }
    ]
  }
}
```

Rules：

- 后端生成候选牌，但前端只看到牌背；
- 同一用户同一天如已选牌，返回已选状态；
- session 过期后可重新 start，但如果已有 oracle，不再允许重新抽。

#### `POST /api/v1/tarot-draw-sessions/:id/select`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "position": 2
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "drawSessionId": "draw_xxx",
    "selectedIndex": 2,
    "selectedCard": {
      "id": "strength",
      "name": "Strength",
      "auraName": "Soft Boundary"
    }
  }
}
```

---

### 10.6 Generate Oracle

#### `POST /api/v1/daily-oracles/generate`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "drawSessionId": "draw_xxx"
}
```

Response success：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_xxx",
    "status": "success",
    "oracleId": "orc_xxx",
    "fallbackUsed": false
  }
}
```

Response pending：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_xxx",
    "status": "pending"
  }
}
```

Rules：

- 没有 selectedCard 时返回 `TAROT_CARD_NOT_SELECTED`；
- 同一用户同一天已生成 Oracle 时返回现有 `oracleId`；
- AI 失败自动 fallback；
- 不把 unsafe output 写入 DB。

#### `GET /api/v1/generation-jobs/:jobId`

用于轮询。

---

### 10.7 Oracle Read

#### `GET /api/v1/daily-oracles/:oracleId`

Response：

```json
{
  "ok": true,
  "data": {
    "oracleId": "orc_xxx",
    "localDate": "2026-06-13",
    "content": {},
    "isSealed": false,
    "shareImageUrl": null
  }
}
```

---

### 10.8 Activation / Seal

#### `POST /api/v1/daily-oracles/:oracleId/activation/start`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "activationId": "act_xxx",
    "guardianItem": "Structured Jacket",
    "luckyColor": "Charcoal Navy",
    "status": "started"
  }
}
```

注意：P0 不再让用户手动选择 anchor。Guardian Item 由 Oracle 结果决定。

#### `POST /api/v1/activations/:activationId/seal`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "holdDurationMs": 3120
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "activationId": "act_xxx",
    "oracleId": "orc_xxx",
    "status": "sealed",
    "sealedAt": "2026-06-13T10:00:00.000Z"
  }
}
```

Rules：

- `holdDurationMs < 3000` 返回 `HOLD_TOO_SHORT`；
- 重复 seal 幂等；
- seal 后更新 `DailyOracle.isSealed = true`。

---

### 10.9 Share / Save / Render

#### `POST /api/v1/daily-oracles/:oracleId/render`

生成 1080x1920 PNG。

#### `POST /api/v1/daily-oracles/:oracleId/save`

幂等保存。

#### `POST /api/v1/daily-oracles/:oracleId/share`

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "channel": "copy_link",
  "source": "share_page"
}
```

---

### 10.10 Journal

#### `GET /api/v1/journal?anonymousId=...&range=7d`

Response：

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "localDate": "2026-06-13",
        "oracleId": "orc_xxx",
        "auraName": "Soft Boundary",
        "tarotCardName": "Strength",
        "luckyColor": "Charcoal Navy",
        "guardianItem": "Structured Jacket",
        "isSealed": true
      }
    ]
  }
}
```

---

## 11. 前端 Draft Store

只保存非核心流程草稿：

```ts
export type AuraDraft = {
  anonymousId?: string;
  birthAuraCreated?: boolean;
  localDate?: string;
  checkInId?: string;
  mood?: TodayMood;
  scene?: TodayScene;
  drawSessionId?: string;
  selectedDrawPosition?: 1 | 2 | 3;
  selectedCardId?: string;
};
```

规则：

- 核心状态以 DB 为准；
- localStorage 清空后仍可通过 `/today` 恢复今日状态；
- 不在前端保存 prompt 或 AI 输出过程。

---

## 12. 页面数据流

### 12.1 首次用户

```text
/onboarding/birth-aura
POST /identity/anonymous
POST /birth-aura
→ /onboarding/birth-aura/reveal
→ /today
GET /today
→ /today/check-in
POST /daily-check-ins
→ /today/draw
POST /tarot-draw-sessions/start
POST /tarot-draw-sessions/:id/select
→ /today/reading
POST /daily-oracles/generate
→ /result/[id]
GET /daily-oracles/:id
→ /activate/[id]
POST /daily-oracles/:id/activation/start
POST /activations/:id/seal
→ /activated/[id]
→ /share/[id]
POST /daily-oracles/:id/render
```

### 12.2 回访用户

```text
/today
GET /today
if today.isSealed → /activated/[oracleId]
if hasOracle but not sealed → /result/[oracleId]
if hasCheckIn but no oracle → /today/draw
else → /today/check-in
```

---

## 13. 分享图渲染

### 13.1 输出规格

```text
PNG
1080 x 1920
9:16
```

### 13.2 必含字段

```text
Date
Today’s Aura
Date Aura
Birth Aura
Today’s Card
Luck Shift
Lucky Color
Guardian Item
Activation Phrase
Sealed by AuraCue
Draw yours on AuraCue
```

### 13.3 渲染失败策略

- 如果 PNG 生成失败，前端显示 CSS fallback；
- 提供 `Generate Image Again`；
- 不阻塞复制链接或分享链接。

---

## 14. Analytics 事件

| 事件 | 触发点 | Payload |
|---|---|---|
| `birth_aura_started` | 进入生日页 | `{source}` |
| `birth_aura_revealed` | 生成 Birth Aura | `{zodiacSign, element, auraName}` |
| `date_aura_viewed` | 打开 Today Gate | `{localDate, dateAuraName}` |
| `mood_selected` | 选择 mood | `{mood}` |
| `scene_selected` | 选择 scene | `{scene}` |
| `tarot_draw_started` | 进入抽牌页 | `{drawSessionId}` |
| `tarot_card_selected` | 选中牌 | `{position}` |
| `tarot_card_revealed` | 翻牌展示 | `{cardId, cardName}` |
| `oracle_generation_started` | Reading 开始 | `{drawSessionId}` |
| `oracle_generated` | 结果生成 | `{oracleId, fallbackUsed}` |
| `oracle_result_viewed` | 结果页曝光 | `{oracleId, auraName}` |
| `activation_started` | 进入激活 | `{oracleId, guardianItem}` |
| `activation_hold_cancelled` | 长按取消 | `{durationMs}` |
| `aura_sealed` | 长按成功 | `{oracleId, holdDurationMs}` |
| `share_card_viewed` | 分享页曝光 | `{oracleId}` |
| `share_card_saved` | 保存图片 | `{oracleId}` |
| `share_card_shared` | 分享 | `{channel}` |
| `journal_opened` | 打开日记 | `{dateRange}` |
| `subscription_paywall_viewed` | 进入付费页 | `{source}` |
| `subscription_started` | 订阅成功 | `{plan}` |

---

## 15. 测试矩阵

### 15.1 Unit Tests

| 模块 | 必测 |
|---|---|
| Zodiac | 边界日期正确，如 3/21 Aries、12/22 Capricorn |
| Birth Aura | skip、正常生日、月份石映射 |
| Date Aura | dayNumber、weekdaySignal、timezone localDate |
| Tarot Options | 同 seed 稳定，三张不重复 |
| AI Schema | JSON 校验、unsafe output 拦截 |
| Mock Generator | 无 AI key 完整生成 |
| Hold Button | cancel、complete、no duplicate |
| Share Renderer | 1080x1920、字段缺失报错 |

### 15.2 API Tests

| Endpoint | Cases |
|---|---|
| identity | create, reuse, invalid platform |
| birth-aura | create, skip, invalid date |
| today | no oracle, has check-in, has oracle, sealed |
| daily-check-ins | create, duplicate, locked after oracle |
| draw start | success, missing checkIn, already selected |
| draw select | position 1/2/3, invalid, expired |
| generate | success, duplicate, fallback, unsafe blocked |
| oracle read | success, not found |
| activation start | success, already sealed |
| seal | too short, success, duplicate |
| render | success, failure |
| save | success, idempotent |
| share | channel validation |
| journal | 7d list |

### 15.3 Playwright E2E

必须覆盖：

```text
1. 首次完整路径：Birth Aura → Seal → Share
2. Skip Birth Aura 路径
3. 已有当天 Oracle 回访路径
4. 长按不足 3 秒取消路径
5. AI fallback 路径
6. 分享图渲染失败 fallback 路径
7. Journal 读回路径
```

---

## 16. 最终验收标准

P0 PASS 必须满足：

- 用户可完成完整链路：Birth Aura → Date Aura → Mood/Scene → Tarot Pull → Reading → Result → Seal → Share；
- 同一用户同一天结果稳定；
- 新一天自动生成新 Date Aura；
- 塔罗抽卡不是直接生成，而是三张背面 + 亲手选择 + 翻牌；
- 结果页必须有 Luck Shift、Guardian Item、Style Formula、Activation Action；
- 长按不足 3000ms 不 seal；
- 分享图可生成；
- Journal 可读回；
- 无 AI key 时 mock 可跑通；
- 不出现身体 / 外貌评价；
- 不出现保证改运文案；
- 所有关键数据和埋点写 DB；
- 单元测试、API 测试、E2E、视觉 smoke 通过。

---

## 17. 开发顺序

```text
T01 初始化 Web + Prisma + shared types
T02 实现 Birth Aura / Date Aura / Tarot constants
T03 实现 Identity / BirthAura / Today / CheckIn API
T04 实现 Tarot Draw Session API
T05 实现 AI Provider / Mock Generator / Safety Guard
T06 实现 Daily Oracle Generate / Read API
T07 实现 Activation / Seal API
T08 实现 Share Render / Save / Share / Journal API
T09 实现页面：Birth Aura → Today → Check-in → Draw → Reading
T10 实现页面：Result → Activate → Activated → Share → Journal
T11 补齐 Analytics
T12 补齐 Unit / API / E2E / Visual Smoke
T13 Final Gate
```

