# AuraCue MVP 需求分析与产品架构文档 v0.3 气场激活闭环版

> 基于：`AuraCue_MVP_需求分析与产品架构文档_v0.2_最新版.md` 继续修订  
> 本版重点：从“生成今日气场卡”升级为“今日气场激活仪式”。  
> 核心调整：P0 不再以付费解锁为主线，而是以 **Draw → Reveal → Activate → Save/Share** 为主线。  
> 特别调整：`Evening Reflection / 晚间反馈页` 暂不进入 P0，移动到 P1。  
> 产品核心：**抽取今日气场卡，穿上幸运色，选择幸运锚点，长按封存气场，带着今日能量出门。**

---

## 0. 本版核心结论

### 0.1 产品主线调整

v0.2 的主线是：

```text
选择场景 / 能量 → AI 生成 Lucky Aura Card → 保存 / 分享 / 解锁
```

v0.3 调整为：

```text
选择今日想要的状态
  ↓
可选补充今日场景
  ↓
可选上传今日穿搭
  ↓
抽卡翻牌
  ↓
生成 Daily Aura Card
  ↓
Activate Today’s Aura
  ↓
选择幸运锚点
  ↓
长按 3 秒 Seal 气场
  ↓
Aura Activated
  ↓
保存 / 分享
```

核心变化：

> MVP 第一阶段不再重点验证“用户是否付费解锁完整报告”，而是优先验证“用户是否愿意完成一次今日气场激活仪式，并愿意保存、分享、明天再来”。

---

### 0.2 P0 / P1 最新页面清单

#### P0 必须开发页面

| 编号 | 页面 | 英文名 | 路径建议 | 说明 |
|---|---|---|---|---|
| 01 | 首页 | Mood-first Home | `/` | 用户选择今天想要的感觉，mood 必填 |
| 02 | 可选上下文页 | Optional Context | `/create/context` | 场景只是辅助，不阻塞生成 |
| 03 | 可选穿搭上传页 | Optional Outfit Upload | `/create/upload` | 上传是增强，不是门槛，可跳过 |
| 04 | 抽卡翻牌页 | Draw & Reveal | `/create/draw` | 用户从 3 张卡中选一张，制造“我抽中的”仪式感 |
| 05 | 今日气场卡结果页 | Daily Aura Card Result | `/result/:id` | 展示今日气场卡，主按钮是 Activate Today’s Aura |
| 06 | 今日气场激活页 | Activate Today’s Aura | `/activate/:id` | 选择幸运锚点，触碰现实物品，长按封存气场 |
| 07 | 气场激活成功页 | Aura Activated | `/activated/:id` | 明确反馈今日气场已激活，引导保存/分享 |
| 08 | 分享 Story 预览页 | Share Story Preview | `/share/:id` | 生成 9:16 分享图 |
| 09 | 保存成功反馈页 | Save Success | `/saved/:id` | 可做成页面，也可做成弹层 |

#### P1 后置页面

| 编号 | 页面 | 英文名 | 说明 |
|---|---|---|---|
| 10 | 晚间反馈页 | Evening Reflection | 后置，不进入 P0；用于验证“今天气场是否显现” |
| 11 | 7 天趋势页 | 7-Day Trend | 需要积累多日数据后再做 |
| 12 | 历史卡片页 | History | P0 不做底部 History Tab |
| 13 | 账号设置页 | Account / Settings | P0 可匿名使用，账号后置 |
| 14 | Premium 模板页 | Premium Templates | 付费视觉模板后置 |
| 15 | Shop Your Aura | Aura Commerce | 电商/联盟商品后置 |
| 16 | 订阅 / Paywall | Subscription / Paywall | P0 不作为主线，只保留接口预留 |

---

## 1. 产品定位修订

### 1.1 当前定位

AuraCue 不是传统塔罗 App，也不是 AI 穿搭工具，而是：

> **Daily Aura Activation Product**  
> 每天出门前使用的 AI 气场激活仪式产品。

### 1.2 核心差异化

竞品多数是：

```text
Reading：读懂今天
```

AuraCue 要做：

```text
Activation：激活今天
```

即：

```text
抽卡 → 颜色 → 首饰 / 水晶 / 穿搭锚点 → 长按封存 → 今日气场已激活 → 保存 / 分享
```

### 1.3 用户相信的核心逻辑

产品不要承诺“保证改命”。

产品要传达：

> **What you wear changes the energy you carry.  
> The energy you carry changes how you show up today.**

中文理解：

> 你穿什么，会改变你带出去的气场；  
> 你带出去的气场，会改变你今天出现、表达和被回应的方式。

---

## 2. P0 用户流程

### 2.1 主流程

```text
用户进入首页
  ↓
选择 today mood，例如 Calm / Confident / Romantic / Magnetic / Protected / Creative / Lucky / Mysterious
  ↓
可选补充 context，例如 Date / Work / Party / Interview / Travel / Just for luck / Skip
  ↓
可选上传 outfit photo，或 Skip for Today
  ↓
进入 Draw & Reveal，用户从 3 张卡背面中选择一张
  ↓
卡片翻开，AI 生成 Daily Aura Card
  ↓
结果页展示 Aura Name / Lucky Color / Style Vibe / Energy Message / Mini Ritual
  ↓
用户点击 Activate Today’s Aura
  ↓
选择 Lucky Anchor，例如 Jewelry / Crystal / Lipstick / Perfume / Outfit Detail
  ↓
触碰现实锚点，长按 3 秒 Hold to Seal
  ↓
Aura Activated 成功状态
  ↓
Save Card / Share Story / Back Home
```

---

## 3. 页面详细需求

## 3.1 01 首页 / Mood-first Home

### 页面目标

让用户 3 秒内理解：

> 选择今天想要的感觉，AuraCue 会把它变成今日幸运气场卡。

### 页面文案

标题：

```text
How do you want to feel today?
```

副标题：

```text
Pick one mood and we’ll turn it into your lucky aura card. 💖
```

Mood 选项：

| Mood | Subtitle | 中文理解 |
|---|---|---|
| Calm | Peaceful & centered | 平静、稳定 |
| Confident | Strong & unstoppable | 自信、有力量 |
| Romantic | Open heart & love | 柔软、恋爱感 |
| Magnetic | Attract, don’t chase | 吸引力、磁场 |
| Protected | Safe & supported | 被保护、有边界 |
| Creative | Inspired & expressive | 灵感、表达 |
| Lucky | Doors open, blessings flow | 好运、机会感 |
| Mysterious | Intuitive & enigmatic | 神秘、直觉 |

按钮：

```text
Start My Aura Card
```

### 交互规则

- mood 必填；
- 未选择 mood 时按钮 disabled；
- 选择 mood 后按钮 active；
- 点击后进入 `/create/context`；
- 如果用户今天已生成并激活过卡，可显示：`Today’s Aura Active` 状态入口。

---

## 3.2 02 可选上下文页 / Optional Context

### 页面目标

让 AI 更贴合今日场景，但不阻塞生成。

### 页面文案

标题：

```text
Any context for today?
```

副标题：

```text
Optional — add a scene if you want us to tune your card a little more.
```

场景 chips：

```text
Date
Work
Party
Interview
Travel
Just for luck
```

按钮：

```text
Continue
Skip
```

### 交互规则

- context 可选；
- 可多选或单选，MVP 建议单选；
- 点击 Skip 直接进入 `/create/upload`；
- 不允许 context 阻塞生成。

---

## 3.3 03 可选穿搭上传页 / Optional Outfit Upload

### 页面目标

让用户上传今日穿搭增强个性化，但不能成为门槛。

### 页面文案

标题：

```text
Upload today’s outfit?
```

副标题：

```text
Optional — add a look for a more personalized card, or let AuraCue read your mood only.
```

按钮：

```text
Upload Outfit
Skip for Today
```

### 交互规则

- 支持图片上传；
- 不强制上传自拍；
- 上传后仅做穿搭氛围辅助，不评价身材、脸、缺陷；
- 上传失败可 Skip；
- 点击继续进入 `/create/draw`。

---

## 3.4 04 抽卡翻牌页 / Draw & Reveal

### 页面目标

制造“我亲手抽中了今日气场”的仪式感。

### 页面文案

标题：

```text
Choose the card that calls you.
```

副标题：

```text
Take one breath. Let today’s aura find you.
```

### 页面内容

- 3 张卡背面；
- 卡背统一 AuraCue 视觉；
- 用户点击其中一张；
- 选中卡片发光、放大、翻转；
- 展示短暂 loading：

```text
Revealing your aura...
Choosing your lucky color...
Preparing your tiny ritual...
```

### 交互规则

- 用户必须选一张卡；
- 被选卡片位置记录为 `draw_position`；
- 后端使用 `draw_seed` 和用户输入共同生成结果；
- 不能让用户感觉完全随机，文案要强调：`the card that calls you`。

---

## 3.5 05 今日气场卡结果页 / Daily Aura Card Result

### 页面目标

让用户觉得：

> 这张卡说中了我，今天我可以带着这个气场出门。

### 页面内容

主卡字段：

```text
Aura Name
Aura Color
Lucky Color
Style Vibe
Energy Message
One Small Ritual
```

示例：

```text
Quiet Power Bloom

Lucky Color:
Blush Pink · Navy · Gold

Style Vibe:
Tailored & Confident

Energy Message:
You don’t need to be loud today. Your calm presence already builds respect.

Mini Ritual:
Before you step out, take 3 deep breaths and touch one gold detail.
```

### 主按钮

按钮顺序调整为：

```text
Activate Today’s Aura
Save Card
Share Story
```

`Full Reading / Premium` 在 P0 中不是主路径，可作为低优先级入口或隐藏。

---

## 3.6 06 今日气场激活页 / Activate Today’s Aura

### 页面目标

让用户完成一个现实动作，把气场从“卡片”转化为“今天要携带的能量”。

### 页面文案

标题：

```text
Activate Today’s Aura
```

副标题：

```text
Choose one thing to carry today’s energy.
```

### 页面结构

#### Step 1：Wear Your Lucky Color

显示今日幸运色：

```text
Blush Pink · Navy · Gold
```

解释：

```text
Wear one color that carries today’s aura.
```

#### Step 2：Choose Your Lucky Anchor

锚点选项：

| Anchor | 说明 |
|---|---|
| Lucky Color | 今天穿上幸运色 |
| Jewelry | 戴一件首饰 |
| Crystal | 带一个水晶 / 幸运物 |
| Lipstick | 使用一个唇色 |
| Perfume | 喷一款香氛 |
| Outfit Detail | 选择一个穿搭细节 |
| Ring / Necklace | 戒指 / 项链 |
| Bag / Scarf | 包 / 围巾 |

#### Step 3：Hold to Seal

按钮：

```text
Hold to Seal Your Aura
```

长按说明：

```text
Touch your anchor. Take one slow breath. Hold to seal today’s aura.
```

### 动画要求

- 长按 0–3 秒显示进度环；
- 进度环颜色使用今日 lucky color；
- 完成时轻微震动；
- 卡片出现 glow / halo 动效；
- 成功后跳转 `/activated/:id`。

---

## 3.7 07 气场激活成功页 / Aura Activated

### 页面目标

给用户明确心理反馈：

> 今日气场已经启动。

### 页面文案

标题：

```text
Aura Activated
```

副标题：

```text
Quiet Power Bloom is active for today.
```

展示字段：

```text
Today’s Aura: Quiet Power Bloom
Lucky Colors: Blush Pink · Navy · Gold
Lucky Anchor: Gold detail
Today’s Intention: I move through today with quiet power.
```

按钮：

```text
Save Card
Share Story
Back Home
```

### MVP 不做

- 不做晚间反馈强提醒；
- 不做 push；
- 不做复杂打卡；
- 可轻提示：`You can come back tonight to reflect.` 但不进入 P0 主流程。

---

## 3.8 08 分享 Story 预览页 / Share Story Preview

### 页面目标

让用户愿意保存和分享到 Instagram Story / TikTok / Pinterest / 小红书。

### 分享图字段

```text
AuraCue
Today’s Aura
Aura Name
Lucky Color
Style Vibe
Energy Message
Mini Ritual
```

### 操作按钮

```text
Save Image
Share Story
Copy Link
```

### 视觉要求

- 9:16；
- 默认使用 Ivory + Blush Pink + Soft Gold；
- P1 可加入梦幻紫粉星空 premium theme；
- 不要像报告截图，要像美学卡片。

---

## 3.9 09 保存成功反馈 / Save Success

### 页面目标

确认保存完成，并引导分享或回首页。

### 页面文案

标题：

```text
Saved to your Aura Cards
```

副标题：

```text
Your lucky aura is ready whenever you step out.
```

按钮：

```text
Share My Aura
Back to Home
```

### 实现建议

MVP 可以做成弹层，而不是完整页面：

```text
SaveSuccessModal
```

---

## 4. P1 页面说明

## 4.1 10 晚间反馈页 / Evening Reflection

本页移动到 P1，不进入 P0。

### P1 目标

验证用户是否愿意回看今天气场是否显现，用于构建“越来越准”的自我反馈机制。

### 页面文案

```text
Did your aura show up today?
```

选项：

```text
Yes, it felt real
A little
Not today
```

二级问题：

```text
Where did it show up?
```

选项：

```text
My mood
My outfit
Someone noticed me
A lucky moment
Love energy
Confidence
Protection
```

### P1 API 预留

```http
POST /api/v1/aura-cards/:cardId/reflection
```

---

## 5. 系统架构设计

### 5.1 总体架构

```text
微信小程序 / Web PWA / App
        ↓
Frontend Client
        ↓
API Gateway / Backend
        ↓
Aura Card Service
Activation Service
Share Render Service
Analytics Service
Payment Service（P1/P2）
        ↓
PostgreSQL + Object Storage + Redis Queue + AI Provider
```

### 5.2 核心服务职责

| 服务 | 职责 |
|---|---|
| Aura Card Service | 创建生成任务、调用 AI、保存 Aura Card JSON |
| Draw Service | 生成 draw_seed，记录用户选中卡位 |
| Activation Service | 处理 lucky anchor、长按激活、激活状态 |
| Card Renderer | 使用 HTML/SVG 模板生成 9:16 分享图 |
| Upload Service | 可选上传 outfit 图片，返回 upload_url |
| Analytics Service | 记录转化、保存、分享、激活等事件 |
| Payment Service | P1/P2 处理付费、模板、订阅 |

### 5.3 P0 状态机

```text
started
  ↓
mood_selected
  ↓
context_optional_done
  ↓
upload_optional_done
  ↓
draw_selected
  ↓
generating
  ↓
generated
  ↓
activation_started
  ↓
anchor_selected
  ↓
sealed
  ↓
activated
  ↓
saved / shared
```

---

## 6. 数据库设计

> 推荐使用 PostgreSQL + Prisma。P0 必须支持匿名用户流程。

## 6.1 aura_cards 表修订

```sql
create table aura_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  anonymous_id varchar null,

  -- 输入
  selected_mood varchar not null,
  optional_context varchar null,
  outfit_upload_url text null,
  language varchar default 'en',
  timezone varchar null,

  -- 抽卡仪式
  draw_seed varchar null,
  draw_position int null,
  draw_revealed_at timestamp null,

  -- AI 输出
  aura_name varchar not null,
  card_title varchar null,
  aura_color varchar null,
  lucky_colors jsonb default '[]'::jsonb,
  style_vibe varchar null,
  energy_message text null,
  outfit_energy text null,
  beauty_cue text null,
  social_move text null,
  mini_ritual text null,
  today_intention text null,
  lucky_anchor_candidates jsonb default '[]'::jsonb,
  share_caption text null,

  -- 卡片图
  template_id varchar null,
  image_url text null,
  share_image_url text null,

  -- 状态
  status varchar default 'generated',
  is_saved boolean default false,
  is_shared boolean default false,
  is_activated boolean default false,

  -- 扩展
  free_payload jsonb,
  full_payload jsonb,

  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

---

## 6.2 aura_activations 表新增

```sql
create table aura_activations (
  id uuid primary key default gen_random_uuid(),
  aura_card_id uuid not null references aura_cards(id) on delete cascade,
  user_id uuid null,
  anonymous_id varchar null,

  anchor_type varchar not null,
  anchor_label varchar not null,
  anchor_color varchar null,
  seal_duration_ms int default 3000,
  seal_completed boolean default false,
  sealed_at timestamp null,

  intention_text text null,
  activated_until timestamp null,
  status varchar default 'started', -- started / anchor_selected / sealed / activated / cancelled

  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

### anchor_type 枚举建议

```text
lucky_color
jewelry
crystal
lipstick
perfume
outfit_detail
ring_necklace
bag_scarf
other
```

---

## 6.3 outfit_uploads 表新增

```sql
create table outfit_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  anonymous_id varchar null,
  aura_card_id uuid null references aura_cards(id) on delete set null,

  file_url text not null,
  file_type varchar,
  file_size int,
  upload_status varchar default 'uploaded',

  -- 不做人体/颜值评价，只做风格辅助
  style_notes jsonb null,

  created_at timestamp default now()
);
```

---

## 6.4 saved_cards 表新增

```sql
create table saved_cards (
  id uuid primary key default gen_random_uuid(),
  aura_card_id uuid not null references aura_cards(id) on delete cascade,
  user_id uuid null,
  anonymous_id varchar null,
  saved_from varchar, -- result / activated / share
  created_at timestamp default now()
);
```

---

## 6.5 reflections 表 P1 预留

```sql
create table aura_reflections (
  id uuid primary key default gen_random_uuid(),
  aura_card_id uuid not null references aura_cards(id) on delete cascade,
  user_id uuid null,
  anonymous_id varchar null,

  accuracy varchar not null, -- yes / a_little / not_today
  appeared_in jsonb default '[]'::jsonb,
  note text null,

  created_at timestamp default now()
);
```

P0 不开发对应页面，但可以先建表或延后。

---

## 7. API 设计

## 7.1 创建 Aura Card 生成任务

```http
POST /api/v1/aura-cards/generate
```

请求：

```json
{
  "anonymousId": "anon_123",
  "selectedMood": "confident",
  "optionalContext": "work",
  "outfitUploadId": "upload_123",
  "drawPosition": 2,
  "drawSeed": "seed_20260601_abc",
  "language": "en"
}
```

响应：

```json
{
  "jobId": "job_123",
  "status": "pending"
}
```

---

## 7.2 获取生成任务状态

```http
GET /api/v1/generation-jobs/:jobId
```

响应：

```json
{
  "jobId": "job_123",
  "status": "success",
  "cardId": "card_123"
}
```

---

## 7.3 获取 Aura Card

```http
GET /api/v1/aura-cards/:cardId
```

响应：

```json
{
  "id": "card_123",
  "selectedMood": "confident",
  "optionalContext": "work",
  "auraName": "Quiet Power Bloom",
  "luckyColors": ["Blush Pink", "Navy", "Gold"],
  "styleVibe": "Tailored & Confident",
  "energyMessage": "You don’t need to be loud today. Your calm presence already builds respect.",
  "miniRitual": "Touch one gold detail and take 3 deep breaths.",
  "todayIntention": "I move through today with quiet power.",
  "luckyAnchorCandidates": [
    { "type": "jewelry", "label": "Gold earrings" },
    { "type": "lucky_color", "label": "Blush pink detail" },
    { "type": "crystal", "label": "Rose quartz" }
  ],
  "isActivated": false,
  "shareImageUrl": "https://cdn.auracue.com/cards/card_123_story.png"
}
```

---

## 7.4 创建激活记录

```http
POST /api/v1/aura-cards/:cardId/activation/start
```

请求：

```json
{
  "anchorType": "jewelry",
  "anchorLabel": "Gold earrings",
  "anchorColor": "Gold"
}
```

响应：

```json
{
  "activationId": "act_123",
  "status": "anchor_selected",
  "sealDurationMs": 3000
}
```

---

## 7.5 完成气场封存

```http
POST /api/v1/activations/:activationId/seal
```

请求：

```json
{
  "holdDurationMs": 3140,
  "clientCompleted": true
}
```

响应：

```json
{
  "activationId": "act_123",
  "status": "activated",
  "sealedAt": "2026-06-01T08:00:00Z",
  "message": "Quiet Power Bloom is active for today.",
  "todayIntention": "I move through today with quiet power."
}
```

---

## 7.6 保存卡片

```http
POST /api/v1/aura-cards/:cardId/save
```

请求：

```json
{
  "source": "activated"
}
```

响应：

```json
{
  "success": true,
  "savedId": "saved_123"
}
```

---

## 7.7 分享记录

```http
POST /api/v1/aura-cards/:cardId/share
```

请求：

```json
{
  "channel": "instagram_story",
  "source": "share_preview"
}
```

响应：

```json
{
  "success": true,
  "shareUrl": "https://auracue.com/share/card_123"
}
```

---

## 8. AI 输出结构

```ts
export type AuraCardAIResult = {
  auraName: string;
  cardTitle: string;
  auraColor: string;
  luckyColors: string[];
  styleVibe: string;
  energyMessage: string;
  outfitEnergy: string;
  beautyCue: string;
  socialMove: string;
  miniRitual: string;
  todayIntention: string;
  luckyAnchorCandidates: Array<{
    type: 'lucky_color' | 'jewelry' | 'crystal' | 'lipstick' | 'perfume' | 'outfit_detail' | 'ring_necklace' | 'bag_scarf';
    label: string;
    reason: string;
  }>;
  shareCaption: string;
  safetyDisclaimer: string;
};
```

### Prompt 约束

```text
You are AuraCue, a warm, elegant daily aura ritual generator.
Generate a light, positive, non-deterministic aura card.
Do not promise guaranteed luck, love, money, health, or success.
Do not comment on body flaws, attractiveness, weight, face shape, or medical/mental health.
Focus on mood, aura, color, outfit energy, charm, and tiny ritual.
The result should feel specific, beautiful, and actionable.
Return valid JSON only.
```

---

## 9. 前端代码示例

## 9.1 TypeScript 类型

```ts
export type AuraMood =
  | 'calm'
  | 'confident'
  | 'romantic'
  | 'magnetic'
  | 'protected'
  | 'creative'
  | 'lucky'
  | 'mysterious';

export type AuraContext =
  | 'date'
  | 'work'
  | 'party'
  | 'interview'
  | 'travel'
  | 'just_for_luck'
  | 'skip';

export type AnchorType =
  | 'lucky_color'
  | 'jewelry'
  | 'crystal'
  | 'lipstick'
  | 'perfume'
  | 'outfit_detail'
  | 'ring_necklace'
  | 'bag_scarf'
  | 'other';

export interface AuraCard {
  id: string;
  selectedMood: AuraMood;
  optionalContext?: AuraContext;
  auraName: string;
  luckyColors: string[];
  styleVibe: string;
  energyMessage: string;
  miniRitual: string;
  todayIntention: string;
  luckyAnchorCandidates: Array<{
    type: AnchorType;
    label: string;
    reason?: string;
  }>;
  isActivated: boolean;
  shareImageUrl?: string;
}
```

---

## 9.2 HoldToSealButton 组件示例

```tsx
import { useEffect, useRef, useState } from 'react';

interface HoldToSealButtonProps {
  durationMs?: number;
  disabled?: boolean;
  onComplete: () => Promise<void> | void;
}

export function HoldToSealButton({
  durationMs = 3000,
  disabled = false,
  onComplete,
}: HoldToSealButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = () => {
    setHolding(false);
    setProgress(0);
    startTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const tick = async () => {
    if (!startTimeRef.current) return;
    const elapsed = Date.now() - startTimeRef.current;
    const nextProgress = Math.min(elapsed / durationMs, 1);
    setProgress(nextProgress);

    if (nextProgress >= 1) {
      setHolding(false);
      if (navigator.vibrate) navigator.vibrate(35);
      await onComplete();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (disabled) return;
    setHolding(true);
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      className="relative h-14 w-full overflow-hidden rounded-full bg-gradient-to-r from-rose-300 to-amber-200 text-slate-900 shadow-lg disabled:opacity-50"
    >
      <span
        className="absolute inset-y-0 left-0 bg-white/35 transition-[width]"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative z-10 font-semibold">
        {holding ? 'Sealing your aura...' : 'Hold to Seal Your Aura'}
      </span>
    </button>
  );
}
```

---

## 9.3 激活页调用示例

```tsx
async function startActivation(cardId: string, anchor: { type: string; label: string }) {
  const res = await fetch(`/api/v1/aura-cards/${cardId}/activation/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anchorType: anchor.type,
      anchorLabel: anchor.label,
    }),
  });

  if (!res.ok) throw new Error('Failed to start activation');
  return res.json() as Promise<{ activationId: string; status: string; sealDurationMs: number }>;
}

async function sealActivation(activationId: string, holdDurationMs: number) {
  const res = await fetch(`/api/v1/activations/${activationId}/seal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ holdDurationMs, clientCompleted: true }),
  });

  if (!res.ok) throw new Error('Failed to seal aura');
  return res.json();
}
```

---

## 9.4 Next.js API Route 示例

```ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const StartActivationSchema = z.object({
  anchorType: z.string().min(1),
  anchorLabel: z.string().min(1),
  anchorColor: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const body = StartActivationSchema.parse(await req.json());

  const card = await prisma.auraCard.findUnique({
    where: { id: params.cardId },
  });

  if (!card) {
    return NextResponse.json({ error: 'Aura card not found' }, { status: 404 });
  }

  const activation = await prisma.auraActivation.create({
    data: {
      auraCardId: card.id,
      userId: card.userId,
      anonymousId: card.anonymousId,
      anchorType: body.anchorType,
      anchorLabel: body.anchorLabel,
      anchorColor: body.anchorColor ?? null,
      sealDurationMs: 3000,
      status: 'anchor_selected',
      intentionText: card.todayIntention,
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      userId: card.userId,
      anonymousId: card.anonymousId,
      eventName: 'activation_started',
      eventPayload: {
        cardId: card.id,
        anchorType: body.anchorType,
        anchorLabel: body.anchorLabel,
      },
      pagePath: `/activate/${card.id}`,
      platform: 'web',
    },
  });

  return NextResponse.json({
    activationId: activation.id,
    status: activation.status,
    sealDurationMs: activation.sealDurationMs,
  });
}
```

---

## 10. 埋点事件修订

### P0 必须埋点

| 事件名 | 触发时机 |
|---|---|
| page_view_home | 进入首页 |
| select_mood | 选择 mood |
| context_selected | 选择 context |
| context_skipped | 跳过 context |
| outfit_upload_started | 开始上传 |
| outfit_upload_success | 上传成功 |
| outfit_upload_skipped | 跳过上传 |
| draw_page_view | 进入抽卡页 |
| draw_card_selected | 选择一张卡 |
| generation_started | 开始生成 |
| generation_success | 生成成功 |
| view_result | 查看结果页 |
| click_activate_aura | 点击激活气场 |
| activation_anchor_selected | 选择幸运锚点 |
| activation_hold_started | 开始长按 |
| activation_hold_completed | 长按完成 |
| aura_activated | 气场激活成功 |
| save_card | 保存卡片 |
| share_card | 分享卡片 |
| copy_share_link | 复制分享链接 |
| return_next_day | 次日回访 |

### P1 埋点

| 事件名 | 触发时机 |
|---|---|
| evening_reflection_view | 查看晚间反馈 |
| evening_reflection_submit | 提交晚间反馈 |
| view_7day_trend | 查看 7 天趋势 |
| click_paywall | 点击付费墙 |
| shop_your_aura_click | 点击商品推荐 |

---

## 11. 开发优先级

## 11.1 P0 第一批开发

1. Mood-first 首页；
2. Optional Context；
3. Optional Upload；
4. Draw & Reveal；
5. Aura Card Result；
6. Activate Today’s Aura；
7. Aura Activated；
8. Share Story Preview；
9. Save Success；
10. 埋点；
11. AI 生成结构化 JSON；
12. 固定模板渲染分享图。

## 11.2 P0 不做

1. 晚间反馈页；
2. 7 天趋势页；
3. 真实订阅；
4. 完整 Paywall；
5. Shop Your Aura；
6. History Tab；
7. 复杂账户系统；
8. 多模板商城；
9. 真人塔罗；
10. 强制自拍。

---

## 12. 验收标准

### 12.1 产品验收

1. 用户可在 30 秒内完成从 mood 选择到 Aura Card 结果；
2. 用户可完成抽卡翻牌动作；
3. 用户可完成幸运锚点选择；
4. 用户可长按 3 秒 Seal Aura；
5. 激活成功后明确显示 `Aura Activated`；
6. 用户可保存卡片；
7. 用户可生成 9:16 分享图；
8. 全流程不强制登录；
9. 全流程不强制上传图片；
10. 页面不出现保证改运、保证恋爱、保证成功等绝对承诺。

### 12.2 技术验收

1. 所有核心输入通过后端保存；
2. AI 输出为稳定 JSON；
3. aura_cards、aura_activations、share_events、analytics_events 正常写入；
4. 长按封存支持成功、取消、中断状态；
5. 分享图渲染稳定；
6. 匿名用户可以完成一次完整 P0 流程；
7. 错误状态可重试；
8. 图片上传失败不阻塞生成；
9. API 返回统一错误格式；
10. 埋点事件完整。

### 12.3 数据验收

核心指标：

| 指标 | 早期目标 |
|---|---:|
| 首页到 mood 选择率 | > 40% |
| mood 到生成完成率 | > 60% |
| 抽卡页完成率 | > 70% |
| 结果页点击激活率 | > 30% |
| 激活完成率 | > 50% |
| 保存率 | > 20% |
| 分享率 | > 8% |
| 次日回访率 | > 10% |

---

## 13. 给开发的最小任务拆解

```text
Task 1: 实现 Mood-first 首页
Task 2: 实现 Optional Context 页面
Task 3: 实现 Optional Upload 页面
Task 4: 实现 Draw & Reveal 抽卡翻牌页面
Task 5: 实现 AI 生成接口和 Aura Card JSON 结构
Task 6: 实现 Daily Aura Card Result 页面
Task 7: 实现 Activate Today’s Aura 页面
Task 8: 实现 Hold to Seal 交互组件
Task 9: 实现 Aura Activated 成功状态页
Task 10: 实现 Share Story Preview 页面和卡片渲染
Task 11: 实现 Save Success 弹层/页面
Task 12: 实现 aura_cards / aura_activations / share_events / analytics_events 表
Task 13: 实现核心 API
Task 14: 实现核心埋点
Task 15: 完成端到端验收
```

---

## 14. 本版最终结论

v0.3 的重点不是增加更多页面，而是让核心体验从“看结果”变成“完成仪式”。

最终 P0 要验证的是：

> 用户是否愿意每天抽一张 Aura Card，并通过幸运色、幸运锚点和长按封存动作，完成一次“今日气场激活”。

一句话：

> **AuraCue 的核心不是抽到什么卡，而是抽到之后，用户能否把这张卡穿上、戴上、封存，并带着它出门。**
