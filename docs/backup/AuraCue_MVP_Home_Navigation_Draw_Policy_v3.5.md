# AuraCue MVP Home / My / Daily Draw Policy v3.5

> 文档类型：产品需求补充 + 页面结构修订 / MVP App Shell & Daily Draw Policy  
> 版本：v3.5  
> 适用范围：修订 PRD v3.0、Page Ritual Design Spec v3.0、Full Development Spec v3.0  
> 核心结论：P0 底部导航改为 **Home / My**；Journal 放入 My；今日官方塔罗牌每天只抽一次；P1 才加入 Clarifier Card 或订阅增强。

---

## 1. 本次修订结论

当前文档中存在 3 个需要统一修正的问题：

1. 底部导航不应使用 `Today / Journal / My`。
2. `Today` 作为 Tab 名称不够像完整 App，P0 应改为 `Home`。
3. 每天是否允许多次抽卡需要明确，否则会影响专业感、信任感和订阅逻辑。

### 1.1 P0 最终底部导航

```text
Home     My
```

| Tab | Route | 职责 |
|---|---|---|
| Home | `/home` 或 `/` | App 主入口、今日日期气场、今日抽卡 CTA、今日已封印气场卡、继续未完成仪式 |
| My | `/my` | 本命气场、生日设置、气场记录、已保存卡、设置、Legal、P1 登录入口 |

### 1.2 Journal 的处理方式

P0 不做独立 Journal Tab。

Journal 在 P0 中改为 My 页面里的一个 Section：

```text
My
  - Birth Aura
  - Today’s Sealed Aura
  - Aura History / My Aura Cards
  - Saved Cards
  - Settings
  - Login / Sync Account  P1
```

P1 当历史记录、7 日气场轨迹、月度 Aura Map、订阅功能上线后，可以再考虑把 Journal 独立为 Tab。

---

## 2. 为什么 Tab 应该叫 Home，而不是 Today

### 2.1 用户认知

`Today` 更像一个功能模块，`Home` 更像一个完整 App 的主入口。

AuraCue 的 Home 不只是今天抽牌，它还承担：

- 首次用户引导；
- 今日日期气场展示；
- 今日抽卡入口；
- 已抽卡后的今日卡片展示；
- 未完成仪式的继续入口；
- 明日新气场开启提示；
- My 的个人资产入口。

所以 Tab 名称应该是：

```text
Home
```

而不是：

```text
Today
```

### 2.2 产品语言

页面内部仍然可以大量使用 Today：

```text
Today’s Date Aura
Today’s Style Oracle
Today’s Aura Sealed
Activate Today’s Aura
```

但底部导航用 Home 更稳。

---

## 3. P0 Home 页面需要支持的状态

Home 不是一个固定页面，而是一个状态化页面。

每次用户进入 Home，系统根据用户状态显示不同内容。

### 3.1 Home State Matrix

| 状态 | 条件 | Home 显示 | 主 CTA |
|---|---|---|---|
| First Open | 无 anonymousId 或首次访问 | 品牌介绍 + 今日日期气场预览 | Start My First Aura |
| No Birth Aura | 已有 guest，但无生日 / Birth Aura | 今日日期气场 + Birth Aura Required Card | Create Birth Aura |
| Ready to Draw | 已有 Birth Aura，今日未开始 | Date Aura + Birth Aura chip + 未翻开的今日卡 | Activate Today’s Aura |
| Check-in Started | 已选 mood/scene，但未抽牌 | 今日仪式进度卡 | Continue Ritual |
| Card Selected / Generating | 已选牌或生成中 | 今日牌面生成中 / 可恢复读取 | Continue Reading |
| Generated Not Sealed | 结果已生成但未封印 | 今日神谕摘要 + 守护单品 | Seal Today’s Aura |
| Sealed Today | 今日已封印 | 今日气场卡摘要 + 幸运色 + 守护单品 | View Today’s Card / Share Story |
| New Day | 本地日期变化 | 新 Date Aura + 昨日卡进入 My > Aura History | Activate Today’s Aura |

---

## 4. 首次用户进入流程

### 4.1 推荐策略

首次用户不要一进来就直接看到生日表单。

更好的方式是：

```text
第一次打开 App → 看到 Home 的欢迎态 → 点击 Start My First Aura → 进入生日必填页
```

原因：

- 先让用户看到产品美感和价值；
- 避免一打开就是表单；
- 保持 App 感，而不是 registration flow；
- 生日虽然是抽卡前必填，但不需要在第一个屏幕强压用户。

### 4.2 First Open Home 布局

```text
[TopHeader]

AuraCue
Your Daily Tarot Style Oracle

June 13 · Saturday
Today’s Date Aura
Clear Structure

Draw one card, activate today’s aura,
and wear your luck.

[ ✦ Start My First Aura ✦ ]

Already have your Birth Aura?
[ Continue ]
```

中文：

```text
AuraCue
年轻人的每日塔罗风格神谕

6月13日 · 星期六
今日日期气场
清晰结构

抽一张牌，激活今日气场，
把好运状态穿在身上。

[ ✦ 开启我的第一张气场牌 ✦ ]
```

### 4.3 点击 CTA 后

如果没有 Birth Aura：

```text
Home → /onboarding/birth-aura
```

如果已有 Birth Aura：

```text
Home → /ritual/check-in
```

---

## 5. 生日规则：P0 必填，但不强制登录

### 5.1 P0 规则

生日不再是“可跳过”。

P0 正式规则：

```text
用户可以先浏览 Home。
用户要开始今日抽牌，必须输入生日月 / 日，生成 Birth Aura。
```

也就是说：

| 行为 | 是否需要生日 |
|---|---|
| 打开 Home | 不需要 |
| 查看今日 Date Aura 预览 | 不需要 |
| 点击 Activate / Start Ritual | 需要 |
| 抽塔罗牌 | 需要 |
| 生成今日风格神谕 | 需要 |
| 查看 My | 不一定需要，但无 Birth Aura 时显示创建入口 |

### 5.2 已登录 / 已知生日用户

如果用户已经登录，或者 guest 本地 / 后端已经有 Birth Aura：

```text
直接跳过生日页，进入今日抽卡流程。
```

判断优先级：

```text
1. 已登录用户 profile.birthMonth / birthDay
2. guest user BirthAuraProfile
3. localStorage draft birthAura backup
4. 如果都没有，进入 Birth Aura Required
```

### 5.3 Login / Password

P0 不做登录、密码、找回密码。

登录体系放到 P1：

```text
P1 Login / Sync Account
P1 Email login
P1 Password reset
P1 Apple / Google login
```

P0 用 `Anonymous Identity + BirthAuraProfile` 跑通完整体验。

---

## 6. Home 页面已抽卡后显示什么

这是 Home 设计的关键。

### 6.1 今日已生成但未封印

用户今天已经生成了结果，但还没 Hold to Seal。

Home 显示：

```text
June 13 · Saturday

Today’s Oracle is waiting to be sealed.

Strength — Soft Boundary
Luck Shift: Drained → Protected
Guardian Item: Structured Jacket

[ ✦ Seal Today’s Aura ✦ ]
[ View Full Oracle ]
```

中文：

```text
6月13日 · 星期六

今天的神谕正在等待封印。

力量 — 柔软边界
气运转向：被消耗 → 被保护
守护单品：结构感外套

[ ✦ 封印今日气场 ✦ ]
[ 查看完整神谕 ]
```

### 6.2 今日已封印

用户今天已经完成 Hold to Seal。

Home 显示：

```text
Today’s Aura Sealed

Soft Boundary is active for today.

Lucky Color
Charcoal Navy

Guardian Item
Structured Jacket

Activation Phrase
I can stay soft without being available to everyone.

[ View Today’s Card ]
[ Share Story ]
```

中文：

```text
今日气场已封印

柔软边界今天已经激活。

今日幸运色
炭灰海军蓝

今日守护单品
结构感外套

出门暗示
我可以保持柔软，但不必对所有人开放。

[ 查看今日气场牌 ]
[ 分享 Story ]
```

### 6.3 今日已封印后是否显示“再抽一次”

不显示主按钮“再抽一次”。

不能让用户觉得：

```text
不满意就换一张。
```

这会破坏神谕的权威感。

可以显示 P1 付费入口：

```text
Pull a Clarifier Card  P1 / Pro
```

但必须解释：

```text
A clarifier does not replace today’s card.
It only shows how to carry it.
```

中文：

```text
补充牌不会替代今日牌面，
它只会告诉你如何更好地承载今天的气场。
```

---

## 7. 每天抽一次，还是最多抽三次？

### 7.1 结论

P0 建议：

```text
每天只允许 1 张 Official Daily Card。
```

P1 可以增加：

```text
Clarifier Card / 补充牌，最多 2 张。
```

最终结构可以是：

```text
1 Official Daily Card
+ 0-2 Clarifier Cards
= Max 3 Cards per day
```

但是：

```text
Clarifier Card 不能替代 Official Daily Card。
Clarifier Card 不能叫 Redraw。
Clarifier Card 不能表达为“改变今天命运”。
```

---

## 8. 用户角度分析：一次 vs 多次

### 8.1 每天只抽一次的优点

| 优点 | 说明 |
|---|---|
| 更有权威感 | 用户会觉得“这就是今天的牌” |
| 更有仪式感 | 稀缺性让结果更像神谕 |
| 更利于每日打卡 | 明天有新的牌，今天不会被消耗完 |
| 更利于分享 | “今天我的牌是 X”更明确 |
| 更利于订阅 | 订阅卖深度和连续记录，而不是随机次数 |
| 更安全 | 不诱导焦虑性反复抽牌 |

### 8.2 每天多次抽卡的问题

| 问题 | 用户心理 |
|---|---|
| 权威感下降 | 既然能换，第一张还算数吗？ |
| 用户会刷好结果 | 用户可能一直抽到满意为止 |
| 产品变得游戏化 | 从神谕变成抽奖 |
| 降低专业感 | 看起来像随机生成器 |
| 可能增加焦虑 | 用户反复确认今天到底是什么气场 |
| 分享变弱 | 不知道哪一张才代表今天 |

### 8.3 多抽卡的正确用法

不是“重新抽今天的牌”。

而是“补充解释今天的牌”。

P1 / Pro 可以设计为：

| Card Type | 中文 | 作用 | 是否可替代主牌 |
|---|---|---|---|
| Official Daily Card | 今日主牌 | 定义今天的核心气场 | 不可替代 |
| Style Clarifier | 风格补充牌 | 补充今天怎么穿 | 不可替代 |
| Action Clarifier | 行动补充牌 | 补充今天如何执行 | 不可替代 |

页面文案：

```text
Today’s card has already spoken.
Pull a clarifier to understand how to carry it.
```

中文：

```text
今日牌面已经出现。
你可以抽一张补充牌，看看如何更好地承载它。
```

---

## 9. 付费设计建议

### 9.1 不建议卖“重抽”

不要这样做：

```text
Pay to redraw today’s aura.
付费重抽，改变今日气场。
```

原因：

- 用户会觉得产品不专业；
- 会破坏第一张牌的可信度；
- 容易显得像利用焦虑付费；
- 不利于长期品牌。

### 9.2 建议卖“完整神谕”和“补充牌”

更好的付费点：

```text
Unlock Full Style Oracle
解锁完整风格神谕
```

包括：

- 深度心理暗示；
- 3 套穿搭公式；
- 今日避免项；
- 今日动作；
- 高清分享卡；
- 7 日气场轨迹；
- Clarifier Card 补充牌。

### 9.3 付费文案

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

不推荐：

```text
不解锁就错过今天好运。
付费改变今日气场。
```

---

## 10. P0 页面地图修订

### 10.1 P0 页面清单

| 页面编号 | Route | 页面名 | P0 是否需要 | 说明 |
|---|---|---|---|---|
| P0-00 | `/home` 或 `/` | Home | 必须 | 主入口，状态化显示 |
| P0-01 | `/onboarding/birth-aura` | Birth Aura Required | 必须 | 抽卡前生日必填 |
| P0-02 | `/onboarding/birth-aura/reveal` | Birth Aura Reveal | 必须 | 揭示本命气场 |
| P0-03 | `/ritual/check-in` | Mood & Scene Check-in | 必须 | 选择今日状态和场景 |
| P0-04 | `/ritual/draw` | Tarot Pull | 必须 | 三张牌中选一张 |
| P0-05 | `/ritual/reading` | Reading Your Aura | 必须 | 读取本命、日期、牌面 |
| P0-06 | `/oracle/[id]` | Today’s Style Oracle | 必须 | 今日结果页 |
| P0-07 | `/seal/[id]` | Hold to Seal | 必须 | 封印今日气场 |
| P0-08 | `/activated/[id]` | Aura Activated | 必须 | 今日气场已激活 |
| P0-09 | `/share/[id]` | Share Aura Card | 必须 | 分享卡预览 |
| P0-10 | `/my` | My | 必须 | 个人资产与设置 |
| P0-11 | `/my/birth-aura` | Birth Aura Profile | 可选 | 可做为 My 内展开 section |
| P0-12 | `/my/aura-history` | Aura History | 可选 | 可做为 My 内 section，不必独立页 |
| P0-13 | `/legal/privacy` | Privacy | 必须 | Legal 页面 |
| P0-14 | `/legal/terms` | Terms | 必须 | Legal 页面 |

### 10.2 P0 不需要独立页面

| 页面 | 处理方式 |
|---|---|
| `/journal` | P0 不独立，放入 `/my` |
| `/login` | P1 |
| `/signup` | P1 |
| `/forgot-password` | P1 |
| `/subscription` | P1 |
| `/clarifier/[id]` | P1 |
| `/evening/[date]` | P1 |

---

## 11. My 页面设计

### 11.1 My 页面目的

My 不是 Profile 工具页，而是用户的个人气场资产页。

推荐页面名：

```text
My Aura
```

中文：

```text
我的气场
```

### 11.2 My 页面布局

```text
[TopHeader]

My Aura

[Birth Aura Card]
Venus Air
Libra · Air · Opal
Edit Birthday

[Today’s Sealed Aura]
Soft Boundary
Charcoal Navy · Structured Jacket
View Today’s Card

[Aura History]
This Week
Jun 13 · Soft Boundary · Sealed
Jun 12 · Clean Renewal · Sealed
Jun 11 · Quiet Power

[Saved Aura Cards]
3 cards saved

[Settings]
Language
Notifications
Privacy Policy
Terms of Service
Login / Sync Account  P1
```

### 11.3 My 页面规则

- 如果没有 Birth Aura，顶部显示创建入口；
- Aura History 只展示最近 7 条；
- Saved Cards 可展示数量，不需要 P0 做复杂列表；
- 登录入口显示为 P1 disabled 或 coming soon；
- Legal 必须可点；
- 不做密码页。

---

## 12. API / 数据结构修订

### 12.1 Home State API

新增：

```text
GET /api/v1/home/today-state
```

用途：Home 根据状态渲染。

Response：

```ts
export interface HomeTodayStateResponse {
  anonymousId: string;
  localDate: string;
  timezone: string;
  hasBirthAura: boolean;
  birthAura?: BirthAuraProfile;
  dateAura: DateAura;
  todayOracleStatus:
    | "NOT_STARTED"
    | "CHECKED_IN"
    | "DRAW_STARTED"
    | "CARD_SELECTED"
    | "GENERATING"
    | "GENERATED"
    | "ACTIVATION_STARTED"
    | "SEALED";
  todayOracle?: {
    id: string;
    auraName: string;
    tarotCardName: string;
    luckShiftLabel: string;
    luckyColor: string;
    guardianItem: string;
    activationPhrase: string;
    sealedAt?: string;
  };
  nextAction: {
    label: string;
    route: string;
  };
}
```

### 12.2 Official Daily Card 唯一约束

新增数据库唯一约束：

```prisma
model DailyOracle {
  id        String @id @default(cuid())
  userId    String
  localDate String
  type      String // official | clarifier_style | clarifier_action
  status    String

  @@unique([userId, localDate, type])
}
```

P0 只允许：

```text
type = official
```

P1 才允许：

```text
type = clarifier_style
type = clarifier_action
```

### 12.3 Draw Session 规则

`draw-sessions/start` 必须检查：

```text
1. 用户是否有 Birth Aura
2. 用户今日是否已有 official DailyOracle
3. 如果已有 sealed，不能重新 start official draw
4. 如果已有 generated not sealed，返回现有 oracle
5. 如果未开始，创建新 draw session
```

---

## 13. 埋点修订

### 13.1 Home 相关事件

```text
home_viewed
home_cta_clicked
home_existing_oracle_viewed
home_share_clicked
home_continue_ritual_clicked
```

### 13.2 Birth Aura Gate

```text
birth_aura_required_viewed
birth_aura_created
birth_aura_reveal_viewed
```

### 13.3 Daily Draw 限制

```text
official_draw_started
official_card_selected
official_draw_blocked_already_sealed
clarifier_teaser_viewed
clarifier_paywall_clicked  P1
```

---

## 14. 文档替换说明

### 14.1 需要替换的旧表述

旧表述：

```text
Today / Journal / My
```

新表述：

```text
Home / My
```

旧表述：

```text
/today
```

新表述：

```text
/home 或 /
```

兼容策略：

```text
/today 可以作为 legacy redirect 到 /home，不作为导航主 route。
```

旧表述：

```text
生日可跳过
```

新表述：

```text
Home 可浏览；开始今日抽牌前，生日月 / 日必须输入。
```

旧表述：

```text
Journal 独立 Tab
```

新表述：

```text
Journal / Aura History 放入 My 页面。
```

旧表述：

```text
用户可以多次重抽
```

新表述：

```text
P0 每天 1 张 Official Daily Card。
P1 可增加 Clarifier Cards，但不替代主牌。
```

---

## 15. 最终建议

从用户心理和产品专业感来看，AuraCue P0 应采用：

```text
Home / My
```

而不是：

```text
Today / Journal / My
```

每日抽卡策略应采用：

```text
每天 1 张 Official Daily Card
```

而不是：

```text
每天无限重抽或付费改牌
```

P1 可以通过：

```text
Clarifier Card
Full Style Oracle
7-Day Aura Pattern
Premium Share Card
```

来做订阅转化。

一句话总结：

> **Home 是每日入口，My 是个人资产；今日主牌每天只能出现一次，付费应该卖“更深的解释”，不是卖“改掉今天的牌”。**
