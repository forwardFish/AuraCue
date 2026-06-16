# AuraCue PRD v3.0 — 年轻人的每日塔罗风格神谕

> 文档类型：产品需求文档 / Product Requirements Document  
> 版本：v3.0  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享**  
> 核心公式：**星座 / 本命气场 + 今日日期气场 + 今日状态 + 今日场景 + 塔罗抽卡 → 心理暗示 → 今日气场穿搭 + 今日气场牌**  
> 适用端：Web / H5 优先，小程序后续复用同一套 API 与状态机  
> P0 目标：做出高审美、高命中感、高分享欲、可每日重复使用、可订阅的完整 MVP

---

## 0. 版本变更说明

### 0.1 本次 v3.0 相比 v2.0 的核心变化

v2.0 已经确立 AuraCue 不再是普通 AI 穿搭工具，而是 **Daily Style Oracle**。v3.0 在此基础上进一步强化：

1. **把塔罗抽卡从普通“Reveal”升级为完整仪式**：呼吸、洗牌感、三张牌背面、相信第一眼、翻牌、Reading、封印。
2. **把塔罗解读产品化**：不要求用户懂 78 张传统塔罗，而是先用 12 张 AuraCue 自有塔罗风格牌组。
3. **把结果页从报告改成“今日风格神谕卡”**：必须包含牌面、心理暗示、幸运色、守护单品、穿搭公式、今日动作、封印、分享。
4. **把“改运”改成安全且高级的 Luck Shift**：从当前状态转向更有支持感的状态，不做保证命运承诺。
5. **加入用户画像与相邻产品分析**：明确目标用户、她们的动机、特征、分享点和付费触发点。
6. **明确页面优先级**：Tarot Pull、Result、Hold to Seal、Share Card 是产品灵魂。

### 0.2 本文档和其他文档的关系

| 文档 | 作用 |
|---|---|
| `AuraCue_PRD_Daily_Tarot_Style_Oracle_v3.0.md` | 产品战略、用户、功能、商业模式、范围 |
| `AuraCue_Web_First_Full_Development_Spec_v3.0.md` | 开发实现、数据结构、API、AI、数据库、测试 |
| `AuraCue_Page_Ritual_Design_Spec_v3.0.md` | 页面布局、视觉、文案、心理暗示、交互 |

---

## 1. 一句话产品定义

AuraCue 是一个每天出门前使用的 **Daily Tarot Style Oracle**。

用户通过生日、本命气场、今日日期、今日状态、今日场景和亲手抽到的塔罗牌，获得一张 **今日气场牌**，以及可以真实穿戴的：

```text
幸运色
守护单品
穿搭公式
今日动作
出门暗示
```

它的核心不是：

```text
AI 帮我搭衣服。
```

而是：

```text
今天我该以什么状态面对世界，并且如何把这个状态穿在身上。
```

---

## 2. 核心价值主张

### 2.1 英文主张

```text
AuraCue is your daily tarot style oracle.
Draw one card, activate today’s aura, and wear your luck.
```

### 2.2 中文主张

```text
AuraCue 是年轻人的每日塔罗风格神谕。
抽一张牌，激活今日气场，把好运状态穿在身上。
```

### 2.3 最终用户心智

产品必须让用户形成这句话：

```text
今天不是随便穿的。
今天这张牌给了我一个状态。
我把它穿在身上，并且带着它出门。
```

---

## 3. 相邻产品与市场位置

AuraCue 没有完全等价竞品，但有 5 类相邻产品。

### 3.1 Astrology / Horoscope Apps

代表产品：Co-Star、The Pattern、Sanctuary。

这些产品的核心是：

```text
生日 / 星盘 → 个性化解释 → 今日提示 / 关系分析 / 自我理解
```

用户买的是“它好像懂我”。

AuraCue 不直接复制占星，而是借用生日、星座、元素和日期作为 **个人化神谕入口**。

### 3.2 Tarot Apps

代表产品：Labyrinthos、各类 Tarot Reading App。

这些产品的核心是：

```text
抽牌 → 解读 → 日记 / 学习 / 自我探索
```

AuraCue 的差异是：

```text
抽牌后不止解读情绪，还要翻译成今天可以穿戴的幸运色和守护单品。
```

### 3.3 Wellness / Self-Care Apps

代表产品：冥想、journaling、mood tracker、affirmation apps。

这些产品的核心是：

```text
每天确认状态 → 得到一句提示 → 建立轻习惯
```

AuraCue 的差异是：

```text
它不是纯心理工具，而是把心理暗示穿在身上。
```

### 3.4 AI Fashion / AI Wardrobe Apps

代表产品：AI outfit generator、virtual try-on、wardrobe planner。

这些产品的核心是：

```text
衣服 / 照片 / 场景 → 推荐穿搭
```

AuraCue 不和它们拼技术试穿，而是做：

```text
状态 / 牌面 / 气场 → 今日风格神谕 → 穿搭落地
```

### 3.5 Appearance Scoring / UMAX 类产品

这类产品核心是：

```text
自拍 → 外貌分析 / 评分 → 改善建议
```

AuraCue 不做外貌焦虑，不评价身材、脸、体重、缺陷。AuraCue 的路线是：

```text
温和、高频、可分享、可订阅、可长期陪伴。
```

---

## 4. 目标用户画像

### 4.1 核心用户：18–30 岁年轻女性与女性化审美用户

> 产品不应在文案中排除任何性别，但早期视觉、传播和付费模型主要围绕年轻女性、Z 世代、轻疗愈、穿搭、星座、塔罗、OOTD、社交分享人群。

她们的典型特征：

- 喜欢星座、塔罗、MBTI、心理测试、人格标签；
- 半信半玩，但愿意相信“今天这个结果有点意义”；
- 关注穿搭，但不一定想被外貌评分；
- 喜欢保存漂亮卡片、发 Story、小红书、TikTok Slides；
- 容易被“今天的幸运色”“守护单品”“今日气场”吸引；
- 需要低门槛仪式，不想读很长报告；
- 希望产品“懂我”，而不是“教育我”。

---

### 4.2 用户群体 A：星座 / 塔罗 / MBTI 用户

#### 特征

```text
她们已经相信或半相信符号系统。
她们习惯用“我是天蝎 / 我是 INFP / 我今天抽到月亮”来描述自己。
```

#### 典型行为

- 看每日星座；
- 做人格测试；
- 看 Tarot TikTok / Pick a Card；
- 在评论区互动“我抽到了这个”；
- 愿意输入生日，接受 Birth Aura。

#### 页面命中点

- Birth Aura；
- Date Aura；
- Tarot Pull；
- Luck Shift；
- Share Card。

#### 付费触发

```text
Unlock Full Birth Aura Map
Unlock Full Daily Oracle
7-Day Aura Pattern
```

---

### 4.3 用户群体 B：穿搭内耗用户

#### 特征

```text
她们不是不会穿，而是不想每天纠结。
```

#### 典型行为

- 站在衣柜前不知道穿什么；
- 经常问朋友“今天穿这个可以吗”；
- 喜欢“让命运决定今天穿什么”的内容；
- 愿意用一个外部提示结束选择疲劳。

#### 页面命中点

- Today Mood；
- Today Scene；
- Guardian Item；
- Style Formula；
- Avoid Today。

#### 付费触发

```text
3 outfit formulas
Scene-specific oracle
Weekly outfit aura calendar
```

---

### 4.4 用户群体 C：情绪型生活方式用户

#### 特征

```text
她们关注的不是穿得“对不对”，而是今天的衣服能不能帮自己进入状态。
```

#### 典型内容偏好

- Monday reset outfit；
- low energy outfit；
- protect my peace outfit；
- main character energy；
- soft girl / clean girl / dark feminine；
- 不想上班穿搭；
- 见不想见的人穿搭。

#### 页面命中点

- How are you arriving today?；
- Just Survive Today；
- Need Protection；
- Luck Shift；
- Activation Phrase。

#### 付费触发

```text
Evening Reflection
Mood Pattern
Daily affirmation archive
```

---

### 4.5 用户群体 D：分享型社交用户

#### 特征

```text
她们未必深信塔罗，但非常愿意分享漂亮、带身份感、带话题感的结果。
```

#### 典型行为

- 发 Story；
- 做 TikTok Slides；
- 发小红书图文；
- 和朋友互测；
- 在评论区问“你是什么牌？”。

#### 页面命中点

- Share Aura Card；
- Birth Aura 标签；
- Today’s Aura 名称；
- Luck Shift；
- Guardian Item。

#### 付费触发

```text
High-res share card
No watermark
Premium templates
Friend Aura
```

---

### 4.6 用户群体 E：身份探索型用户

#### 特征

```text
她们通过风格、星座、塔罗和审美标签寻找“我是谁”。
```

#### 典型心理

- 我是什么风格的人？
- 我今天要锋利一点还是柔软一点？
- 我是不是 Moon-born / Venus Air / Soft Boundary？
- 我最近反复抽到某张牌，是不是说明我正在经历某个状态？

#### 页面命中点

- Birth Aura Profile；
- Journal；
- 7-Day Aura Pattern；
- Monthly Aura Map。

#### 付费触发

```text
Birth Aura deep report
Monthly style cycle
Personal archetype archive
```

---

## 5. 产品差异化

### 5.1 普通 AI 穿搭产品

```text
上传衣服 / 场景 → 推荐 outfit
```

问题：工具感强、容易被大平台替代、用户重复使用理由弱。

### 5.2 普通塔罗 App

```text
抽牌 → 解读 → 日记
```

问题：不落地，用户看完可能忘记。

### 5.3 AuraCue

```text
生日 / 日期 / 状态 / 场景 / 抽牌
→ 心理暗示
→ 幸运色 / 守护单品 / 穿搭公式 / 今日动作
→ 长按封印
→ 分享今日气场牌
```

优势：

- 有神秘感；
- 有每日重复理由；
- 有穿搭行动；
- 有分享卡；
- 有订阅空间；
- 不依赖外貌焦虑。

---

## 6. 产品核心公式

### 6.1 主公式

```text
Birth Aura
+ Date Aura
+ Today Mood
+ Today Scene
+ Tarot Pull
= Daily Tarot Style Oracle
```

中文：

```text
本命气场
+ 今日日期气场
+ 今日状态
+ 今日场景
+ 今日塔罗牌
= 今日塔罗风格神谕
```

### 6.2 输出公式

```text
Tarot Card
→ Psychological Cue
→ Lucky Color
→ Guardian Item
→ Style Formula
→ Activation Action
→ Hold to Seal
→ Share Aura Card
```

中文：

```text
牌面
→ 心理暗示
→ 幸运色
→ 守护单品
→ 穿搭公式
→ 今日动作
→ 封印
→ 分享
```

---

## 7. 功能范围

### 7.1 P0 必须实现

P0 只做一条极强主链路：

```text
Birth Aura Onboarding
→ Birth Aura Reveal
→ Today Gate
→ Mood & Scene Check-in
→ Tarot Pull
→ Reading Your Aura
→ Today’s Style Oracle Result
→ Activate / Hold to Seal
→ Aura Activated
→ Share / Save
→ Journal Lite
```

P0 必须包含：

- 生日月 / 日输入，可跳过；
- Birth Aura 生成与揭示；
- 今日日期气场 Date Aura；
- 今日状态选择；
- 今日场景选择；
- 三张塔罗背面抽一张；
- 抽牌后翻牌；
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
- Journal Lite：当天卡片归档。

### 7.2 P1 建议实现

- Evening Reflection：今天的气场显现了吗？
- 7-Day Aura Pattern：7 日气场轨迹；
- Aura Calendar：气场日历；
- Birth Aura 深度报告；
- Full Style Oracle 付费页；
- Clarifier Card 补充牌；
- 每日 push；
- 分享卡多模板；
- 月度 Aura Map；
- 好友互抽 / Friend Aura。

### 7.3 P2 暂不实现

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

## 8. 页面地图

### 8.1 P0 页面清单

| 页面编号 | Route | 页面名 | 目的 |
|---|---|---|---|
| P0-00 | `/onboarding/birth-aura` | Create Your Birth Aura | 输入生日，建立本命气场 |
| P0-01 | `/onboarding/birth-aura/reveal` | Birth Aura Reveal | 揭示长期身份标签 |
| P0-02 | `/today` | Today Gate | 显示日期气场，进入今日仪式 |
| P0-03 | `/today/check-in` | Mood & Scene Check-in | 选择今日状态和场景 |
| P0-04 | `/today/draw` | Tarot Pull | 三张牌中抽一张 |
| P0-05 | `/today/reading` | Reading Your Aura | 读取本命气场、日期气场、牌面 |
| P0-06 | `/result/[id]` | Today’s Style Oracle | 今日风格神谕结果 |
| P0-07 | `/activate/[id]` | Activate Today’s Aura | 确认守护单品，长按封印 |
| P0-08 | `/activated/[id]` | Aura Activated | 今日气场已封印 |
| P0-09 | `/share/[id]` | Share Aura Card | 9:16 分享卡预览 |
| P0-10 | `/saved/[id]` | Saved | 保存成功 |
| P0-11 | `/journal` | Aura Journal Lite | 今日卡片和历史归档 |
| P0-12 | `/profile/birth-aura` | Birth Aura Profile | 本命气场资料页 |

---

## 9. 内容系统

### 9.1 Birth Aura 本命气场

Birthday 不直接做“严肃算命”，而是生成本命气场。

输入：

```text
Month / Day
```

输出：

```text
Zodiac Signal
Element
Modality
Ruling Signal
Birthstone Signal
Birth Aura Name
Guardian Color
Style Mantra
```

示例：

```text
Libra → Venus Air
Element: Air
Birthstone Signal: Opal
Guardian Color: Soft Opal Pink
Style Mantra: I attract through balance, not effort.
```

页面心理暗示：

```text
The same card speaks differently to every Birth Aura.
同一张牌，会对不同本命气场说出不同提示。
```

---

### 9.2 Date Aura 今日日期气场

日期不是装饰，是每日订阅和打卡的核心变量。

生成公式：

```text
weekdaySignal + dayNumber + zodiacSeason = dateAura
```

示例：

```text
Saturday + Day Number 4 + Gemini Season
→ Clear Structure
```

页面心理暗示：

```text
A new aura opens every day.
每一天，都会打开新的气场。
```

---

### 9.3 Today Mood 今日状态

问题：

```text
How are you arriving today?
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

---

### 9.4 Today Scene 今日场景

问题：

```text
What is today asking from you?
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

---

### 9.5 12 张 AuraCue 核心塔罗牌组

P0 不做完整 78 张。先做 12 张，保证用户容易理解、页面可控、分享友好。

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

每张牌必须包含：

```text
1. 心理能量
2. Luck Shift 倾向
3. 幸运色池
4. 守护单品池
5. 穿搭公式池
6. 今日动作池
7. 安全解释
8. 分享短句
```

---

## 10. 命中感生成规则

### 10.1 必须使用的文案公式

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

### 10.2 不允许的泛化文案

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

## 11. 关键页面需求摘要

### 11.1 Tarot Pull 抽牌页

必须做到：

```text
选择那张正在呼唤你的牌。
深呼吸。
今日牌面会把你的状态翻译成风格。
相信第一眼。
```

交互要求：

- 三张牌背面；
- 点击一张后放大；
- 其他两张淡出；
- 翻牌；
- 显示牌名和 Aura Name；
- 进入 Reading；
- 不允许无限重抽。

### 11.2 Result 结果页

必须展示：

```text
Date Aura
Birth Aura
Today’s Card
Aura Name
Luck Shift
Your Message
Lucky Color
Guardian Item
Style Formula
Avoid Today
Activation Phrase
Activation Action
Activate Today’s Aura
Save / Share
```

### 11.3 Activate / Hold to Seal

逻辑：

```text
系统给出 Guardian Item，用户确认并封印。
```

不要再让用户自己从一堆 anchor 里选择。用户来这里是为了减少选择疲劳。

### 11.4 Share Card

分享卡必须是“数字护身符”，不是报告截图。

必须包含：

```text
日期
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

---

## 12. 订阅模式设计

### 12.1 订阅成立的核心

订阅不是卖“更多穿搭”，而是卖：

```text
每天都有新的日期气场和更完整的风格神谕。
```

### 12.2 免费版

免费给足命中感：

- 今日日期气场；
- 今日牌面；
- Luck Shift；
- 幸运色；
- 守护单品；
- 一句出门暗示；
- 普通分享卡。

### 12.3 Pro 版

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

### 12.4 付费页文案

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

## 13. 安全与品牌边界

### 13.1 不允许

- 穿这个一定会改变命运；
- 不穿会倒霉；
- 解锁才能避免坏运；
- 今天会失败；
- 保证成功、保证恋爱、保证财运；
- 对身体、脸、体重、身材缺陷做评价；
- 诱导反复抽牌缓解焦虑；
- 鼓励用户把重大人生、健康、财务、关系决定交给牌面。

### 13.2 推荐底层态度

```text
This is a cue, not a command.
Use it to enter today’s energy.
```

中文：

```text
这是提示，不是命令。
用它进入今天的状态。
```

### 13.3 “改运”表达方式

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

## 14. 成功指标

### 14.1 P0 验证指标

| 指标 | 及格线 | 优秀线 |
|---|---:|---:|
| 首次体验完成率 | 60% | 80% |
| Birthday 输入率 | 50% | 75% |
| Mood 选择率 | 70% | 90% |
| Tarot Pull 完成率 | 65% | 85% |
| 结果页停留 10 秒以上 | 35% | 55% |
| Hold to Seal 完成率 | 25% | 45% |
| 保存率 | 10% | 20% |
| 分享率 | 3% | 8% |
| D1 回访 | 12% | 25% |
| D7 回访 | 4% | 10% |

### 14.2 P1 订阅指标

| 指标 | 目标 |
|---|---:|
| 安装到付费 | 1.5%–3% |
| Paywall 到订阅 | 5%–10% |
| 年付占比 | >25% |
| 7 日连续 sealed | >8% |
| 晚间反馈填写 | >15% |

---

## 15. 最终产品原则

```text
生日让用户相信：这是我的。
日期让用户相信：这是今天的。
状态让用户相信：它看见我了。
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

---

## 16. 公开参考产品资料

> 这些资料只作为相邻品类参考，不代表 AuraCue 要复制其产品。

- Co-Star: https://www.costarastrology.com/
- Co-Star App Store: https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561
- Labyrinthos App Store: https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220
- Labyrinthos Google Play: https://play.google.com/store/apps/details?id=com.labyrinthos.app
- Pew Research: https://www.pewresearch.org/religion/2025/05/21/3-in-10-americans-consult-astrology-tarot-cards-or-fortune-tellers/
