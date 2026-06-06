# AuraCue MVP 需求分析与产品架构文档 v0.2 最新版

> 原始版本：v0.1  
> 本次版本：v0.2  
> 更新重点：结合“海外产品 + 微信小程序先验证 + 后续 Web/PWA/App”的产品路线，补充小程序与 App 的差异、迁移策略、整体架构、页面范围、数据库、接口、AI 生成链路、支付/解锁、埋点和开发优先级。  
> 产品方向：AI + 玄学符号 + 情绪价值 + 出门前轻决策  
> 推荐产品名：**AuraCue**  
> 中文内部名：**今日开运气场卡 / 出门前好运卡**  
> 核心一句话：**出门前 30 秒，抽一张今日开运气场卡，获得今天的幸运色、穿搭能量、社交动作和开运小仪式。**

---

# 0. 本版核心结论

## 0.1 最重要结论

AuraCue 最终目标用户在海外，但第一阶段可以用微信小程序验证体验。

但要注意：

> **微信小程序是体验验证舱，不是最终主工程。**

更合理的路线是：

```text
第一阶段：微信小程序验证 UI、流程、内容吸引力
    ↓
第二阶段：海外 Web / PWA 验证真实市场、流量、付费、分享
    ↓
第三阶段：React Native / Expo App 放大留存、订阅、推送和品牌感
```

不建议一开始直接重投入开发原生 App。

原因：

1. App 获客门槛高，用户要先下载；
2. App Store / Google Play 审核和订阅复杂；
3. 早期产品还没验证，直接做 App 容易开发过重；
4. 海外 TikTok / Instagram / Pinterest 引流，更适合先用 Web/PWA 承接；
5. 微信小程序代码不能直接变成 App，但产品流程、后端接口、Prompt、卡片渲染、数据库可以复用。

## 0.2 产品定位结论

AuraCue 不应定位为传统塔罗 App、星座 App、AI 穿搭 App，也不应定位为严肃算命产品。

更准确的定位是：

> **AI Daily Aura Ritual Product**  
> 一个每天出门前使用的 AI 气场开运仪式产品。

用户购买的不是“塔罗牌义”本身，而是：

1. 今天更顺一点的心理暗示；
2. 今天更自信、更开心、更有状态的情绪价值；
3. 今天穿什么颜色、走什么风格、怎么见人的轻决策；
4. 一张好看、可保存、可分享、能代表“今天的我”的气场卡；
5. 在约会、面试、会议、聚会、拍照等关键场景前获得安心感和行动提示。

## 0.3 MVP 验证目标

MVP 不要做大而全。

MVP 只验证一个核心问题：

> **用户是否愿意在出门前，为一张“今日开运气场卡”停留、保存、分享，甚至付费解锁完整方案？**

核心验证指标：

1. 用户是否愿意点击生成；
2. 用户是否觉得结果“说中了我”；
3. 用户是否愿意保存卡片；
4. 用户是否愿意分享卡片；
5. 用户是否愿意为完整卡片付费；
6. 用户是否愿意第二天再来。

---

# 1. 产品命名与品牌表达

## 1.1 推荐主名称：AuraCue

**AuraCue = Aura + Cue**

- Aura：气场、能量、神秘感、玄学感；
- Cue：提示、暗示、行动信号；
- 合起来的含义是：**给你今天的气场提示和行动暗示**。

这个名字比 “Tarot Outfit” 更高级，也比 “Fortune Teller” 更安全，不会显得低级迷信。

## 1.2 中文表达

| 类型 | 名称 |
|---|---|
| 中文内部项目名 | 今日开运气场卡 |
| 中文营销名 | 出门前好运卡 |
| 中文功能名 | 今日气场卡 |
| 中文口号 | 每天一张气场卡，带着好状态出门 |

## 1.3 英文 Slogan 候选

首选：

> **Your daily cue for luck, confidence, and a little magic.**

首页主标题：

> **Before you go out, draw your Lucky Aura Card.**

首页副标题：

> **Get your lucky color, outfit energy, social cue, and tiny ritual for today.**

更偏情绪价值：

> **Feel lucky. Feel seen. Show up brighter.**

更偏轻决策：

> **Find your lucky color, outfit energy, and tiny ritual for today.**

---

# 2. 产品定位

## 2.1 错误定位

不要定位成：

- AI 塔罗 App
- AI 星座 App
- AI 面相 App
- AI 穿搭 App
- AI 算命 App
- AI 心理咨询 App

原因：

1. **AI 塔罗 / 星座**：竞品多，免费内容多，用户容易认为只是普通玄学工具；
2. **AI 面相**：涉及人脸、隐私、外貌焦虑和平台审核风险；
3. **AI 穿搭**：会和 AI stylist、数字衣橱、色彩分析 App 正面竞争；
4. **AI 心理咨询**：边界风险更高，也不是本产品核心。

## 2.2 正确定位

本产品应定位为：

> **出门前使用的 AI 开运气场卡。**

用户在出门前，选择今天的场景和想要的能量，AI 结合塔罗、星座、气场颜色、幸运色等符号，生成一张今日开运气场卡，告诉用户：

- 今日能量是什么；
- 今日幸运色是什么；
- 今天适合什么穿搭 / 妆容 / 配饰；
- 今天适合主动还是克制；
- 今天适合什么社交状态；
- 出门前做一个什么小仪式；
- 今天给自己什么心理暗示。

## 2.3 核心价值公式

```text
玄学符号 × 当前场景 × 用户情绪 × 可执行轻决策 × 可分享卡片
```

竞品多数停留在：

```text
玄学符号 × 个性化解释
```

AuraCue 要往前推进一步：

```text
玄学符号 → 今日状态 → 今日穿搭 / 美妆 / 社交 / 小仪式 → 可保存分享的开运卡
```

## 2.4 核心差异化

竞品卖的是：

> **Reading：读懂今天。**

AuraCue 卖的是：

> **Activation：激活今天。**

也就是说，AuraCue 不是只告诉用户“你今天是什么状态”，而是进一步告诉用户：

1. 今天穿什么颜色；
2. 今天用什么表达方式；
3. 今天见人时采取什么社交动作；
4. 今天出门前做什么 30–60 秒小仪式；
5. 今天如何用一个轻动作进入更好的状态。

---

# 3. 目标用户与真实需求

## 3.1 MVP 第一阶段目标用户

MVP 第一阶段聚焦：

> **18–34 岁女性，喜欢星座 / 塔罗 / 气场 / 穿搭 / 美妆 / 分享图卡，日常有出门、见人、社交、约会、上班、拍照等场景。**

## 3.2 用户画像

### 用户 A：出门前状态焦虑型

- 年龄：20–30 岁；
- 场景：上班、见朋友、约会、聚会、面试；
- 内心问题：
  - 今天穿什么？
  - 今天应该主动一点还是克制一点？
  - 今天适合什么颜色？
  - 今天怎么让自己更有状态？
- 购买动机：
  - 想要一个快速、好玩、有仪式感的出门前建议。

### 用户 B：玄学轻信仰型

- 年龄：18–34 岁；
- 行为：
  - 看星座；
  - 偶尔抽塔罗；
  - 喜欢 lucky color、angel number、moon phase、aura color；
  - 不一定严肃相信，但愿意获得“今天有好运”的感觉。
- 购买动机：
  - 想要每日仪式感和好运暗示。

### 用户 C：社交分享型

- 年龄：18–30 岁；
- 行为：
  - 发 Instagram Story、TikTok、小红书、Pinterest；
  - 喜欢人格测试、气场卡、MBTI、星座图卡；
  - 愿意保存漂亮结果图。
- 购买动机：
  - 想得到一张好看的、代表“今天的我”的图卡。

### 用户 D：关键场景付费型

- 年龄：20–35 岁；
- 场景：
  - 第一次约会；
  - 面试；
  - 重要会议；
  - 聚会；
  - 拍照；
  - 见喜欢的人；
  - 发布重要社交内容。
- 购买动机：
  - 不是为了每天玩，而是关键时刻想要更安心、更有方向。

---

# 4. 用户为什么付费

## 4.1 用户不会为普通鸡汤付费

如果产品只输出：

> 今天你要相信自己，你很棒。

用户会认为这是免费 AI 文案，不值得付费。

## 4.2 用户更可能为“完整开运方案”付费

用户更可能为下面这种结果付费：

```text
今天你的气场是 Calm Power。

今日开运色：深蓝、黑色、银色。

今日穿搭：
结构感外套、直线条单品、简洁金属配饰。

今日表达：
先说结论，再解释理由。

今日小仪式：
出门前整理包和桌面 1 分钟，进入掌控感。

今日提醒：
你不需要为了让所有人满意而过度解释。
```

这里面有：

- 情绪价值；
- 玄学暗示；
- 具体轻决策；
- 出门前可执行动作；
- 可保存分享的完整卡片。

## 4.3 用户付费买的不是“准”，而是“状态”

| 表层购买理由 | 深层心理 |
|---|---|
| 解锁完整气场卡 | 我想看看今天的完整答案 |
| 解锁幸运色 / 穿搭 / 妆容 | 我想知道今天怎么出现 |
| 解锁约会卡 / 面试卡 | 我想在关键场景前更安心 |
| 解锁高清分享卡 | 我想保存和分享今天的自己 |
| 解锁 7 天趋势 | 我想形成每日仪式和连续陪伴 |

---

# 5. 微信小程序、Web/PWA、App 的区别与产品路线

## 5.1 三种形态的定位

| 形态 | 适合做什么 | 不适合做什么 | AuraCue 阶段定位 |
|---|---|---|---|
| 微信小程序 | 快速验证 UI、流程、生成结果、保存分享 | 验证海外真实付费和海外传播 | 第一阶段体验验证舱 |
| 海外 Web/PWA | TikTok/Instagram/Pinterest 引流、低门槛访问、付费测试、A/B 测试 | 强推送、深度留存、App Store 订阅 | 第二阶段主验证阵地 |
| iOS/Android App | 每日提醒、订阅、长期留存、品牌入口、相册/推送能力 | 早期快速试错、轻量获客 | 第三阶段放大工具 |

## 5.2 能不能从小程序直接改成 App？

结论：

> **不能直接改，但可以通过正确架构实现大部分核心资产复用。**

不能直接复用的部分：

| 内容 | 原因 |
|---|---|
| WXML/WXSS 原生页面 | 语法与 React Native / Web 不同 |
| 微信登录 | 海外需要 Apple / Google / Email |
| 微信支付 | 海外需要 Stripe / Paddle / Freemius / IAP |
| 微信分享 API | 海外需要 Web Share / Instagram Story / 下载图 |
| 小程序路由 | App/Web 路由机制不同 |

可以复用的部分：

| 内容 | 是否可复用 |
|---|---|
| 产品流程 | 可以复用 |
| UI 设计稿 | 可以复用 |
| 页面信息架构 | 可以复用 |
| Prompt 模板 | 可以复用 |
| AI 生成逻辑 | 可以复用 |
| 卡片渲染模板 | 可以复用 |
| 数据库模型 | 可以复用 |
| 后端 API | 高度复用 |
| 埋点事件定义 | 高度复用 |
| 支付权益模型 | 高度复用 |

## 5.3 关键架构原则

从第一天开始要坚持：

> **前端只负责展示和交互，核心业务逻辑全部放到后端。**

包括：

1. Prompt 不写死在小程序；
2. AI 生成不在小程序端直接调用；
3. 卡片保存不只存在本地；
4. 分享图由统一卡片渲染服务生成；
5. 付费权益由后端统一判断；
6. 小程序、Web、App 调同一套 API。

---

# 6. 推荐整体技术架构

## 6.1 总体架构

```text
微信小程序
海外 Web / PWA
iOS / Android App
        ↓
统一 API Gateway / Backend
        ↓
用户系统 / Aura Card 系统 / AI 生成系统 / 支付系统 / 分享系统 / 埋点系统
        ↓
PostgreSQL + Object Storage + Redis Queue + AI Model + Card Renderer
```

## 6.2 推荐技术选型

### 第一阶段 MVP 简化版

适合快速上线：

```text
前端 Web：Next.js + Tailwind CSS
微信小程序：Taro + React 或原生小程序
后端：Next.js API Routes / Server Actions
数据库：Supabase PostgreSQL
存储：Supabase Storage / Cloudflare R2
AI：OpenAI / Claude / Gemini / 其他 LLM
支付：Stripe / Paddle / Freemius，微信端先 mock 或后接微信支付
部署：Vercel + Supabase
```

### 第二阶段工程化版

适合长期产品：

```text
Web：Next.js + TypeScript + Tailwind CSS
App：React Native + Expo + TypeScript
小程序：Taro + React
Backend：NestJS
DB：PostgreSQL
ORM：Prisma
Queue：Redis / BullMQ
Storage：Cloudflare R2 / S3
Card Renderer：HTML/CSS/SVG → PNG
Payment：Stripe / Paddle / Freemius / RevenueCat
Analytics：PostHog / GA4 / 自建 events
Admin：Next.js Admin
```

## 6.3 Monorepo 项目结构建议

```text
auracue/
├── apps/
│   ├── web/                 # 海外 Web / PWA，Next.js
│   ├── mobile/              # iOS / Android App，Expo React Native
│   ├── wechat-mini/         # 微信小程序，Taro 或原生
│   ├── api/                 # 后端 API，NestJS 或 Next API
│   └── admin/               # 后台管理系统
│
├── packages/
│   ├── shared-types/        # 前后端共享 TypeScript 类型
│   ├── ui-tokens/           # 颜色、字体、间距、圆角等设计变量
│   ├── prompt-core/         # Prompt 模板、版本管理
│   ├── card-renderer/       # 卡片渲染逻辑
│   └── analytics-events/    # 统一埋点事件定义
│
├── services/
│   ├── ai-worker/           # AI 生成任务 Worker
│   ├── image-renderer/      # 图片渲染服务
│   └── payment-webhook/     # 支付回调服务
│
├── prisma/
│   └── schema.prisma        # 数据库模型
│
├── docs/
│   ├── PRD.md
│   ├── API.md
│   ├── DB_SCHEMA.md
│   ├── UI_FLOW.md
│   ├── PROMPT_SPEC.md
│   └── ACCEPTANCE.md
│
└── package.json
```

---

# 7. MVP 核心定义

## 7.1 MVP 只做一个场景

MVP 只做：

> **出门前开运卡。**

不要同时做：

- 完整穿搭系统；
- 完整星盘；
- 复杂塔罗牌阵；
- 长期情绪陪伴；
- 社区；
- 好友互动；
- 完整衣橱；
- 电商推荐。

这些都可以作为未来扩展，但第一阶段必须聚焦：

> **出门前 30 秒，生成今日 Lucky Aura Card。**

## 7.2 MVP 核心用户路径

```text
用户进入首页
    ↓
看到一句清晰价值主张：
Before you go out, draw your Lucky Aura Card.
    ↓
点击 Generate My Card
    ↓
选择今天的场景
    ↓
选择今天想要的能量
    ↓
系统生成基础 Lucky Aura Card
    ↓
展示基础结果 + 模糊完整内容
    ↓
用户选择：
A. 保存基础卡
B. 分享基础卡
C. 付费解锁完整卡
D. 邀请朋友解锁完整卡
    ↓
保存成功 / 分享成功 / 解锁成功
    ↓
第二天通过提醒或内容回流再次生成
```

## 7.3 MVP 页面原则

MVP 页面必须遵循：

1. 首页只表达一个核心动作：生成今日 Lucky Aura Card；
2. 不要在首页堆很多模块；
3. 不做复杂 History Tab；
4. 保存成功页只是轻量反馈，不做完整卡包；
5. 分享卡片优先于复杂报告；
6. 页面视觉要像高质感欧美消费 App，不像传统算命网站；
7. 每一步都要让用户感觉“轻、快、好看、有仪式感”。

---

# 8. MVP 页面规划

## 8.1 页面清单

| 编号 | 页面 | 路径建议 | 必要性 | 说明 |
|---|---|---|---|---|
| 01 | 首页 | `/` | P0 | 价值主张 + 主按钮 + 示例卡 |
| 02 | 场景选择页 | `/create/scene` | P0 | 选择今天出门场景 |
| 03 | 能量选择页 | `/create/energy` | P0 | 选择今天需要的能量 |
| 04 | 生成中页 | `/create/loading` | P0 | 制造仪式感，等待生成 |
| 05 | 基础结果页 | `/result/:id` | P0 | 展示免费结果 + 模糊完整内容 |
| 06 | 解锁页 | `/unlock/:id` | P0 | 单次付费 / 邀请解锁 |
| 07 | 完整结果页 | `/result/:id/full` | P0 | 展示完整气场卡与完整方案 |
| 08 | 分享预览页 | `/share/:id` | P0 | 生成可保存分享图 |
| 09 | 保存成功反馈页 | `/saved/:id` | P0 | 明确提示保存成功，引导分享/回首页 |
| 10 | 账号 / 设置页 | `/account` | P1 | 登录、订阅、基础设置 |
| 11 | 历史卡片页 | `/history` | P1 | MVP 不放底部 Tab，后续再做 |
| 12 | 7 天趋势页 | `/trend` | P1 | 后续订阅价值 |

## 8.2 底部导航建议

MVP 不建议放复杂 Tab。

如果微信小程序必须使用底部 Tab，建议只保留：

```text
Home / Create / Me
```

不要放：

```text
History
```

原因：

1. MVP 核心不是管理历史卡片；
2. History 会让产品显得像工具，而不是每日仪式；
3. 早期历史数据不足，页面容易空；
4. 之前已明确去掉 History，保持首页轻量。

## 8.3 首页要求

### 页面目标

让用户在 3 秒内理解：

> 这是一个出门前生成今日 Lucky Aura Card 的产品。

### 页面内容

- 顶部：AuraCue 品牌名；
- 中间：大标题；
- 副标题；
- 一张精美示例 Lucky Aura Card；
- 主按钮：Generate My Card；
- 轻量说明：Lucky color / Outfit energy / Social cue / Tiny ritual；
- 底部：轻量免责声明。

### 英文文案

```text
Before you go out,
draw your Lucky Aura Card.

Get your lucky color, outfit energy,
social cue, and tiny ritual for today.

[Generate My Card]
```

### 首页不要做

- 不要放大量功能模块；
- 不要放复杂介绍；
- 不要放 History 入口；
- 不要放太多塔罗解释；
- 不要做传统星座 App 风格。

---

# 9. 选择页需求

## 9.1 场景选择

MVP 初始只保留 4 个：

| 英文 | 中文 | 说明 |
|---|---|---|
| Date | 约会 | 强付费场景 |
| Work / Meeting | 工作 / 会议 | 专业感、表达、边界 |
| Party / Social | 聚会 / 社交 | 魅力、外放、拍照 |
| Just need luck | 只是想好运一点 | 日常泛场景 |

P1 再扩展：

- Interview；
- School；
- Travel；
- Content Day；
- First Meeting；
- Photo Day。

## 9.2 能量选择

MVP 初始保留 6 个：

| 英文 | 中文 | 说明 |
|---|---|---|
| Confidence | 自信 | 今日更有力量 |
| Luck | 好运 | 轻玄学主线 |
| Love | 吸引力 | 约会场景强相关 |
| Calm | 平静 | 情绪安定 |
| Charm | 魅力 | 社交和拍照 |
| Focus | 专注 | 工作/会议 |

P1 再扩展：

- Protection；
- Reset；
- Soft Power；
- Magnetic；
- Clarity。

---

# 10. 结果页与卡片内容结构

## 10.1 一张完整 Lucky Aura Card 的字段

```json
{
  "cardTitle": "Calm Power Day",
  "auraName": "Calm Power",
  "tarotSymbol": "The Emperor",
  "auraMessage": "You don’t need to explain yourself to be taken seriously.",
  "luckyColors": ["Deep navy", "Black", "Silver"],
  "outfitEnergy": "Structured jacket, clean lines, simple metal accessories.",
  "beautyCue": "Clean base, defined brows, soft neutral lips.",
  "socialMove": "Lead with your conclusion. Explain only when needed.",
  "tinyRitual": "Before you go out, organize your bag for 60 seconds.",
  "avoidToday": "Overexplaining. Dressing too casually for a moment that matters.",
  "shareCaption": "Today’s aura: Calm Power ✨",
  "visualTheme": "warm-gold-minimal"
}
```

## 10.2 免费展示内容

免费展示：

1. 今日气场名；
2. 今日幸运色；
3. 一句话提醒；
4. 基础卡片低清版 / 带水印版；
5. 模糊完整内容预览。

## 10.3 付费解锁内容

付费解锁：

1. 完整今日解释；
2. 今日穿搭 / 美妆 / 配饰建议；
3. 今日社交动作；
4. 今日小仪式；
5. 今日避免事项；
6. 高清分享卡；
7. 可保存无水印版本；
8. 后续可加入 7 天趋势。

## 10.4 中文示例

```text
今日气场：Calm Power Day / 冷静掌控日

今日牌：The Emperor / 皇帝

今日提醒：
今天你不需要用很多话证明自己。
你只需要把表达说清楚，把边界放稳。

今日开运色：
深蓝、黑色、银色。

今日穿搭：
选择有结构感的外套、直线条单品、简洁金属配饰。
避免太松散、太随意的搭配。

今日妆容：
干净底妆、清晰眉眼、低饱和唇色。

今日社交动作：
开会或见人时，先说结论，再解释理由。

今日小仪式：
出门前整理包包 1 分钟，只带今天真正需要的东西。

今日避免：
不要为了让所有人满意而过度解释。
```

---

# 11. 保存成功反馈页

## 11.1 页面名称

```text
10C-保存_保存成功反馈
```

## 11.2 页面目标

用户在分享预览页或完整结果页点击 Save 后，系统确认今日 Lucky Aura Card 已保存成功。

这个页面用于：

1. 强化“保存完成”的反馈；
2. 让用户放心卡片已经保存；
3. 引导用户继续分享；
4. 引导用户回首页生成下一张或明天再来。

## 11.3 页面内容

- 顶部：
  - AuraCue 品牌名；
  - 左上角返回或关闭按钮；
- 中部：
  - 柔金色成功图标；
  - 或轻微发光的 check mark；
- 主标题：
  - `Saved to your Aura Cards`
- 副文案：
  - `Your lucky aura is ready whenever you step out.`
- 中间：
  - 今日 Lucky Aura Card 缩小预览；
- 卡片下方：
  - 保存位置提示：
    - `Saved in Today’s Aura`
    - 或 `Saved to your phone`
- 底部按钮：
  - 主按钮：`Share My Aura`
  - 次按钮：`Back to Home`

## 11.4 MVP 注意

保存成功页不是历史页，不是卡包页。

不要在这里做复杂列表、分类、过往卡片管理。

---

# 12. 解锁与商业模式

## 12.1 MVP 收费方式

第一阶段不要直接主推订阅。

优先验证：

1. 单次付费；
2. 邀请解锁；
3. 后续订阅。

## 12.2 推荐价格

| 类型 | 价格 | 说明 |
|---|---:|---|
| 完整今日开运卡 | $1.99 | 入门价格 |
| 关键场景完整卡 | $2.99–$4.99 | 约会、面试、会议、聚会 |
| 7 天开运趋势 | $4.99 | 小套餐 |
| 周订阅 | $6.99/week | 后续测试 |
| 月订阅 | $9.99/month | 后续测试 |
| 年订阅 | $39.99/year | 后续测试 |

## 12.3 付费墙策略

A/B 测试三种：

### 方案 A：先展示基础卡，再模糊完整内容

适合：

- 强化“想看完整答案”的欲望；
- 测试单次解锁。

### 方案 B：先给完整结果，再收费高清保存

适合：

- 提高信任；
- 降低用户对“AI 鸡汤”的防备。

### 方案 C：关键场景直接高价值付费

例如：

```text
Unlock your Date Aura Card
Unlock your Interview Aura Card
Unlock your Meeting Power Card
```

适合：

- 约会；
- 面试；
- 重要会议；
- 拍照；
- 发布内容前。

## 12.4 邀请解锁

MVP 可设计：

```text
Invite 3 friends to unlock your full card.
```

邀请逻辑：

1. 用户生成卡片；
2. 完整内容部分模糊；
3. 用户点击邀请解锁；
4. 生成带 referral code 的分享链接；
5. 3 个新用户完成生成后，原用户解锁完整卡。

注意：

- 邀请解锁必须有防刷机制；
- 早期可以先做轻量统计，不做复杂反作弊；
- 如果开发成本高，MVP 可先只做付费，不做邀请。

---

# 13. 支付策略

## 13.1 微信小程序阶段

微信小程序阶段建议：

1. 第一版可不接真实支付；
2. 先做 mock paywall；
3. 验证用户是否点击 `Unlock Full Card`；
4. 记录点击率、停留、分享；
5. 后续国内测试再接微信支付。

微信端早期核心不是收入，而是验证：

```text
用户是否被卡片吸引
用户是否愿意保存
用户是否愿意分享
用户是否点击解锁
```

## 13.2 海外 Web/PWA 阶段

海外 Web/PWA 才是真实付费验证主阵地。

支付可选：

| 方案 | 适合情况 |
|---|---|
| Stripe | 自建灵活，适合美国/海外用户 |
| Paddle | 税务处理更省心，适合全球 SaaS/数字产品 |
| Freemius | 如果产品更像插件/软件授权，也可测试 |
| Lemon Squeezy | 轻量数字产品也可考虑 |

MVP 可以优先接：

```text
Stripe Checkout / Paddle Checkout
```

## 13.3 App 阶段

如果进入 App Store / Google Play：

1. 数字内容解锁和订阅通常需要走 IAP；
2. 建议使用 RevenueCat 管理订阅；
3. Web 支付和 App IAP 权益要在后端统一；
4. App 阶段再做订阅，不要一开始做复杂订阅体系。

---

# 14. AI 生成系统设计

## 14.1 生成原则

AI 输出不能是随机鸡汤。

必须由结构化输入控制：

```text
用户选择的场景
用户选择的能量
日期
可选生日 / 星座
可选用户语言
可选历史偏好
```

生成结果必须稳定输出为 JSON，便于前端渲染和卡片生成。

## 14.2 生成链路

```text
用户提交 scene + energy
    ↓
后端创建 generation_job
    ↓
Prompt Core 组装结构化 Prompt
    ↓
LLM 输出 Aura Card JSON
    ↓
后端做安全过滤和格式校验
    ↓
写入 aura_cards 表
    ↓
Card Renderer 生成分享图
    ↓
返回结果页
```

## 14.3 Prompt 输入示例

```json
{
  "language": "en",
  "scene": "Work / Meeting",
  "energy": "Calm",
  "date": "2026-05-26",
  "tone": "warm, elegant, specific, non-deterministic",
  "safetyRules": [
    "Do not make absolute predictions",
    "Do not promise guaranteed luck",
    "Do not mention body flaws",
    "Do not provide medical or psychological diagnosis",
    "Keep advice light, positive, and actionable"
  ]
}
```

## 14.4 AI 输出格式

```json
{
  "auraName": "Calm Power",
  "cardTitle": "Calm Power Day",
  "symbol": {
    "type": "tarot",
    "name": "The Emperor",
    "meaning": "Boundaries, clarity, grounded authority"
  },
  "message": "You don’t need to explain yourself to be taken seriously.",
  "luckyColors": ["Deep navy", "Black", "Silver"],
  "outfitEnergy": "Choose structured pieces, clean lines, and simple metal accents.",
  "beautyCue": "Keep your base clean, brows defined, and lips soft neutral.",
  "socialMove": "Lead with your conclusion. Explain only when needed.",
  "tinyRitual": "Before you leave, organize your bag for 60 seconds.",
  "avoidToday": "Overexplaining or dressing too casually for a moment that matters.",
  "shareCaption": "Today’s aura: Calm Power ✨",
  "disclaimer": "For reflection and fun. Not a guarantee or professional advice."
}
```

## 14.5 成本控制建议

MVP 不建议每次都用 AI 生成复杂图片。

推荐方式：

```text
LLM 生成文案 JSON
    ↓
使用固定模板渲染卡片
    ↓
HTML/CSS/SVG 转 PNG
```

这样更便宜、更稳定、更容易统一视觉。

不要第一版就做：

```text
每次调用 AI 图片生成模型生成一张完全不同的卡
```

原因：

1. 成本高；
2. 出图不稳定；
3. 容易风格漂移；
4. 生成速度慢；
5. 保存分享图难以保持品牌一致。

---

# 15. 卡片渲染系统

## 15.1 卡片是产品传播核心

AuraCue 的传播核心不是报告，而是：

> **一张用户愿意保存和分享的 Lucky Aura Card。**

卡片需要满足：

1. 用户愿意截图；
2. 用户愿意发 Story；
3. 用户看到后觉得“这张卡代表今天的我”；
4. 朋友看到后会想“我也想生成一张”。

## 15.2 卡片比例

MVP 先做：

```text
9:16 Story 版
```

后续扩展：

```text
4:5 Feed 版
1:1 Square 版
```

## 15.3 卡片模板字段

```json
{
  "templateId": "warm_gold_01",
  "ratio": "9:16",
  "background": "warm-white-gold-gradient",
  "auraName": "Calm Power",
  "symbolName": "The Emperor",
  "luckyColors": ["Deep navy", "Black", "Silver"],
  "shortMessage": "Move slowly. Speak clearly. Let your boundaries do the work.",
  "brand": "AuraCue",
  "date": "2026-05-26"
}
```

## 15.4 卡片模板数量

MVP 先做 3 套模板：

| 模板 | 风格 | 适合 |
|---|---|---|
| warm_gold_01 | 暖白 + 香槟金 | 默认高级感 |
| moon_silver_01 | 月光银 + 深蓝 | 平静、专注 |
| rose_charm_01 | 玫瑰粉 + 柔金 | 约会、魅力 |

不要一开始做 20 套模板。

---

# 16. 内容映射库

## 16.1 Tarot → Energy

| Tarot | Energy |
|---|---|
| The Sun | 自信、明亮、外放、好运 |
| The Star | 治愈、希望、重新相信自己 |
| The Moon | 直觉、神秘、敏感、内收 |
| The Empress | 吸引力、柔软、自我价值 |
| The Emperor | 掌控、边界、专业感 |
| The Lovers | 关系、选择、吸引 |
| Strength | 温柔但有力量 |
| The Magician | 主动创造、表达、掌控资源 |
| Temperance | 平衡、温和、协调 |
| Justice | 清晰、公平、判断力 |

## 16.2 Energy → Color

| Energy | Colors |
|---|---|
| Confidence | Gold / White / Red |
| Calm | Blue / Cream / Silver |
| Love | Rose / Pink / Champagne |
| Focus | Navy / Black / Gray |
| Charm | Burgundy / Soft Gold / Rose |
| Reset | White / Mint / Light Blue |
| Protection | Black / Deep Green / Silver |
| Clarity | White / Sky Blue / Pearl |

## 16.3 Scene → Advice Focus

| Scene | Advice Focus |
|---|---|
| Date | 吸引力、亲和力、香水、妆容、主动程度 |
| Work / Meeting | 专业感、边界、表达方式、穿搭结构 |
| Party / Social | 外放、社交动作、拍照、配饰 |
| Interview | 稳定、可信、清晰表达、正式感 |
| Just need luck | 情绪补能、幸运色、小仪式 |

## 16.4 文案原则

文案不能空泛。

避免：

```text
今天要自信一点，勇敢面对挑战。
```

应改为：

```text
今天你不需要用很多话证明自己。
先说结论，再解释理由。
你的清晰会比用力更有力量。
```

文案要求：

1. 有画面感；
2. 有具体动作；
3. 有情绪安慰；
4. 有一点神秘感；
5. 不做绝对承诺；
6. 不制造恐惧；
7. 不制造外貌焦虑。

---

# 17. 数据库设计

## 17.1 users 用户表

```sql
users (
  id uuid primary key,
  platform varchar,                 -- web / wechat / ios / android
  email varchar nullable,
  phone varchar nullable,
  apple_id varchar nullable,
  google_id varchar nullable,
  wechat_openid varchar nullable,
  display_name varchar nullable,
  avatar_url text nullable,
  locale varchar default 'en',
  timezone varchar nullable,
  created_at timestamp,
  updated_at timestamp
)
```

## 17.2 aura_cards 气场卡表

```sql
aura_cards (
  id uuid primary key,
  user_id uuid nullable references users(id),
  anonymous_id varchar nullable,

  scene varchar not null,           -- date / work / party / luck
  energy varchar not null,          -- confidence / calm / love 等
  language varchar default 'en',

  card_title varchar,
  aura_name varchar,
  tarot_symbol varchar,
  lucky_colors jsonb,
  message text,
  outfit_energy text,
  beauty_cue text,
  social_move text,
  tiny_ritual text,
  avoid_today text,
  share_caption text,

  free_payload jsonb,
  full_payload jsonb,

  is_unlocked boolean default false,
  unlock_method varchar nullable,   -- paid / invite / admin / free
  template_id varchar,
  image_url text nullable,
  share_image_url text nullable,

  status varchar default 'generated',
  created_at timestamp,
  updated_at timestamp
)
```

## 17.3 generation_jobs 生成任务表

```sql
generation_jobs (
  id uuid primary key,
  user_id uuid nullable references users(id),
  anonymous_id varchar nullable,

  scene varchar not null,
  energy varchar not null,
  input_payload jsonb,
  prompt_version varchar,
  model_provider varchar,
  model_name varchar,

  status varchar,                   -- pending / running / success / failed
  result_card_id uuid nullable,
  error_message text nullable,

  started_at timestamp nullable,
  finished_at timestamp nullable,
  created_at timestamp
)
```

## 17.4 card_templates 卡片模板表

```sql
card_templates (
  id varchar primary key,
  name varchar,
  ratio varchar,                    -- 9:16 / 4:5 / 1:1
  theme varchar,
  config jsonb,
  is_active boolean default true,
  created_at timestamp,
  updated_at timestamp
)
```

## 17.5 payment_orders 支付订单表

```sql
payment_orders (
  id uuid primary key,
  user_id uuid nullable references users(id),
  anonymous_id varchar nullable,
  aura_card_id uuid nullable references aura_cards(id),

  provider varchar,                 -- stripe / paddle / freemius / wechat / app_store
  provider_order_id varchar nullable,
  product_type varchar,             -- single_card / key_scene_card / subscription
  amount_cents int,
  currency varchar,

  status varchar,                   -- pending / paid / failed / refunded
  checkout_url text nullable,
  paid_at timestamp nullable,
  created_at timestamp,
  updated_at timestamp
)
```

## 17.6 user_entitlements 用户权益表

```sql
user_entitlements (
  id uuid primary key,
  user_id uuid nullable references users(id),
  anonymous_id varchar nullable,

  entitlement_type varchar,         -- card_unlock / subscription / template_pack
  aura_card_id uuid nullable,
  source varchar,                   -- paid / invite / promo / admin
  starts_at timestamp,
  ends_at timestamp nullable,
  created_at timestamp
)
```

## 17.7 share_events 分享事件表

```sql
share_events (
  id uuid primary key,
  user_id uuid nullable references users(id),
  anonymous_id varchar nullable,
  aura_card_id uuid references aura_cards(id),

  channel varchar,                  -- instagram / tiktok / pinterest / wechat / copy_link / download
  share_url text nullable,
  referral_code varchar nullable,
  created_at timestamp
)
```

## 17.8 analytics_events 埋点事件表

```sql
analytics_events (
  id uuid primary key,
  user_id uuid nullable,
  anonymous_id varchar nullable,

  event_name varchar,
  event_payload jsonb,
  platform varchar,
  page_path varchar nullable,
  created_at timestamp
)
```

---

# 18. API 设计

## 18.1 创建生成任务

```http
POST /api/v1/aura-cards/generate
```

请求：

```json
{
  "scene": "work",
  "energy": "calm",
  "language": "en",
  "platform": "web",
  "anonymousId": "anon_xxx"
}
```

响应：

```json
{
  "jobId": "job_xxx",
  "status": "pending"
}
```

## 18.2 查询生成任务

```http
GET /api/v1/generation-jobs/:jobId
```

响应：

```json
{
  "jobId": "job_xxx",
  "status": "success",
  "cardId": "card_xxx"
}
```

## 18.3 获取卡片结果

```http
GET /api/v1/aura-cards/:cardId
```

响应：

```json
{
  "id": "card_xxx",
  "isUnlocked": false,
  "freePayload": {
    "auraName": "Calm Power",
    "luckyColors": ["Deep navy", "Black", "Silver"],
    "message": "Move slowly. Speak clearly."
  },
  "lockedPreview": {
    "hasOutfitEnergy": true,
    "hasBeautyCue": true,
    "hasSocialMove": true,
    "hasTinyRitual": true
  },
  "shareImageUrl": "https://..."
}
```

## 18.4 解锁卡片

```http
POST /api/v1/aura-cards/:cardId/unlock
```

请求：

```json
{
  "method": "paid",
  "paymentOrderId": "order_xxx"
}
```

响应：

```json
{
  "cardId": "card_xxx",
  "isUnlocked": true,
  "fullPayload": {}
}
```

## 18.5 创建支付链接

```http
POST /api/v1/payments/checkout
```

请求：

```json
{
  "productType": "single_card",
  "cardId": "card_xxx",
  "provider": "stripe"
}
```

响应：

```json
{
  "orderId": "order_xxx",
  "checkoutUrl": "https://checkout..."
}
```

## 18.6 支付回调

```http
POST /api/v1/webhooks/payment
```

作用：

1. 接收 Stripe / Paddle / Freemius / 微信支付回调；
2. 更新 payment_orders；
3. 写入 user_entitlements；
4. 解锁 aura_cards。

## 18.7 保存卡片

```http
POST /api/v1/aura-cards/:cardId/save
```

响应：

```json
{
  "success": true,
  "savedAt": "2026-05-26T12:00:00Z"
}
```

## 18.8 记录分享

```http
POST /api/v1/aura-cards/:cardId/share
```

请求：

```json
{
  "channel": "instagram",
  "referralCode": "REF123"
}
```

响应：

```json
{
  "success": true,
  "shareUrl": "https://auracue.com/share/card_xxx?ref=REF123"
}
```

## 18.9 生成分享图

```http
POST /api/v1/aura-cards/:cardId/render
```

请求：

```json
{
  "templateId": "warm_gold_01",
  "ratio": "9:16"
}
```

响应：

```json
{
  "imageUrl": "https://..."
}
```

---

# 19. 前端页面详细需求

## 19.1 首页

### 状态

- 首次访问；
- 已生成过今日卡；
- 网络异常；
- 生成次数达到限制。

### 组件

- BrandHeader；
- HeroTitle；
- SampleAuraCard；
- GenerateButton；
- FeaturePills；
- FooterDisclaimer。

### 主按钮

```text
Generate My Card
```

点击后进入：

```text
/create/scene
```

## 19.2 场景选择页

### 组件

- ProgressIndicator；
- SceneOptionCard；
- NextButton；
- BackButton。

### 交互

1. 用户选择一个场景；
2. 按钮变为可点击；
3. 点击后进入能量选择页。

## 19.3 能量选择页

### 组件

- ProgressIndicator；
- EnergyOptionCard；
- GenerateButton；
- BackButton。

### 交互

1. 用户选择一个能量；
2. 点击 Generate；
3. 创建 generation_job；
4. 跳转生成中页。

## 19.4 生成中页

### 页面目标

制造轻仪式感，不要像普通 loading。

### 文案示例

```text
Reading your aura...
Choosing your lucky color...
Preparing your tiny ritual...
```

### 状态

- 正常生成；
- 生成失败；
- 超时；
- 重试。

## 19.5 基础结果页

### 页面目标

让用户觉得“这张卡是我的”，并产生保存/分享/解锁欲望。

### 内容

免费展示：

- 今日气场名；
- 今日幸运色；
- 一句话提醒；
- 基础卡预览；
- 模糊完整区域。

按钮：

- Unlock Full Card；
- Save Basic Card；
- Share Preview；
- Try Another Energy。

## 19.6 解锁页

### 页面目标

把“完整气场方案”的价值讲清楚。

### 内容

- 完整卡片内容预览；
- 已解锁内容列表；
- 价格；
- 支付按钮；
- 邀请好友解锁按钮；
- 安全提示。

### 文案示例

```text
Unlock your full aura for today.

Get your outfit energy, beauty cue,
social move, tiny ritual, and what to avoid.
```

## 19.7 完整结果页

### 内容

- 大卡片；
- 完整文案；
- 今日幸运色；
- 穿搭建议；
- 美妆建议；
- 社交动作；
- 小仪式；
- 今日避免；
- Save；
- Share；
- Back Home。

## 19.8 分享预览页

### 内容

- 9:16 分享图；
- Download / Save；
- Share；
- Copy Link；
- 频道提示：
  - Instagram Story；
  - TikTok；
  - Pinterest；
  - WeChat；
  - 小红书。

## 19.9 保存成功页

### 内容

- 成功图标；
- 标题：
  - `Saved to your Aura Cards`
- 副标题：
  - `Your lucky aura is ready whenever you step out.`
- 缩小卡片预览；
- 主按钮：
  - `Share My Aura`
- 次按钮：
  - `Back to Home`

---

# 20. App 架构设计

## 20.1 何时开发 App

只有满足以下信号后，再开发 App：

1. Web/PWA 生成转化率稳定；
2. 保存率达到 20% 以上；
3. 分享/邀请率达到 8% 以上；
4. 单次付费率达到 2% 以上；
5. 有明显次日回访；
6. 用户主动想每天生成；
7. 有订阅或提醒需求。

## 20.2 App 技术栈

推荐：

```text
React Native
Expo
TypeScript
Zustand
TanStack Query
React Hook Form
Expo Image Picker
Expo Notifications
RevenueCat
```

## 20.3 App 模块结构

```text
mobile/
├── app/
│   ├── onboarding/
│   ├── home/
│   ├── create/
│   ├── loading/
│   ├── result/
│   ├── unlock/
│   ├── save-success/
│   ├── share/
│   ├── paywall/
│   └── settings/
│
├── components/
│   ├── AuraCard.tsx
│   ├── UploadBox.tsx
│   ├── SceneSelector.tsx
│   ├── EnergySelector.tsx
│   ├── ResultBlock.tsx
│   └── PrimaryButton.tsx
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── upload.ts
│   ├── generation.ts
│   └── payment.ts
│
├── stores/
│   ├── userStore.ts
│   ├── generationStore.ts
│   └── cardStore.ts
│
├── hooks/
│   ├── useCreateAuraCard.ts
│   ├── useAuraCard.ts
│   ├── useUnlockCard.ts
│   └── useEntitlement.ts
│
└── constants/
    ├── colors.ts
    ├── spacing.ts
    └── copy.ts
```

## 20.4 App 核心流程

```text
用户打开 App
    ↓
进入首页
    ↓
选择今日场景
    ↓
选择今日能量
    ↓
点击 Generate
    ↓
创建 AI 生成任务
    ↓
进入生成等待页
    ↓
展示 Lucky Aura Card
    ↓
用户保存 / 分享 / 解锁更多
```

## 20.5 App 特有能力

App 阶段才做：

1. 每日提醒；
2. Push Notification；
3. 相册保存；
4. App 内订阅；
5. 小组件 Widget；
6. 连续打卡；
7. 7 天趋势；
8. 更完整个人 Aura Profile。

---

# 21. Web/PWA 架构设计

## 21.1 为什么海外优先 Web/PWA

海外早期获客常见链路是：

```text
TikTok / Instagram / Pinterest 内容
    ↓
用户点击 Bio Link / 评论区链接
    ↓
进入 Web 页面
    ↓
30 秒生成卡片
    ↓
保存 / 分享 / 付费
```

这个链路比 App 更轻。

## 21.2 Web 页面路径

```text
/
首页

/create/scene
选择场景

/create/energy
选择能量

/create/loading
生成中

/result/:id
基础结果

/unlock/:id
解锁页

/result/:id/full
完整结果

/share/:id
分享预览

/saved/:id
保存成功

/account
账户页
```

## 21.3 PWA 能力

Web/PWA 可加入：

1. Add to Home Screen；
2. 本地缓存；
3. 今日卡片提醒；
4. Web Push；
5. 离线查看最近卡片。

但 MVP 不强制做 PWA 高级能力。

---

# 22. 微信小程序设计策略

## 22.1 小程序阶段目标

微信小程序阶段只验证：

1. 页面流程是否顺；
2. UI 是否有吸引力；
3. 卡片是否愿意保存；
4. 分享反馈是否强；
5. 解锁按钮是否有人点；
6. 用户是否愿意第二天再来。

## 22.2 小程序不要做太重

不要在小程序阶段做：

- 完整支付系统；
- 完整卡包历史；
- 复杂会员体系；
- 复杂用户档案；
- 多语言系统；
- 大量模板；
- 完整 App 级架构。

## 22.3 小程序必须对齐后端 API

小程序只做展示和调用 API：

```text
选择场景
选择能量
调用生成接口
展示结果
保存图片
分享图片
记录行为
```

不要把这些写死在小程序：

1. Tarot 映射；
2. Prompt；
3. 完整卡片生成；
4. 解锁判断；
5. 价格；
6. 权益。

---

# 23. 埋点与数据指标

## 23.1 必须埋点

| 事件名 | 触发时机 |
|---|---|
| page_view_home | 进入首页 |
| click_generate_start | 点击生成入口 |
| select_scene | 选择场景 |
| select_energy | 选择能量 |
| generation_started | 开始生成 |
| generation_success | 生成成功 |
| generation_failed | 生成失败 |
| view_result_free | 查看免费结果 |
| click_unlock | 点击解锁 |
| checkout_started | 开始支付 |
| checkout_success | 支付成功 |
| save_card | 保存卡片 |
| share_card | 分享卡片 |
| copy_share_link | 复制链接 |
| invite_started | 开始邀请 |
| invite_completed | 邀请完成 |
| return_next_day | 次日回访 |

## 23.2 MVP 验证指标

| 指标 | 含义 | 早期参考线 |
|---|---|---:|
| 首页到生成转化率 | 用户是否理解产品 | > 30% |
| 生成完成率 | 用户是否愿意完成流程 | > 60% |
| 卡片保存率 | 结果是否打动用户 | > 20% |
| 分享 / 邀请率 | 是否具备传播性 | > 8% |
| 单次付费率 | 是否有付费价值 | > 2% |
| 关键场景付费率 | 约会 / 面试 / 会议等 | > 4% |
| 次日回访率 | 是否有每日 ritual 潜力 | > 15% |

## 23.3 是否继续投入的判断

值得继续投入的信号：

1. 用户评论出现：
   - “This is so me.”
   - “I needed this today.”
   - “Can you do mine?”
   - “What should I wear for my date?”
2. 分享率高；
3. 用户愿意邀请好友解锁；
4. 关键场景卡付费率明显高于普通卡；
5. 用户第二天回来重新生成。

需要调整的信号：

1. 用户只玩一次；
2. 保存率低；
3. 分享率低；
4. 付费率低于 0.5%；
5. 用户反馈“像 AI 鸡汤”；
6. 用户不理解为什么要付费。

---

# 24. 视觉与体验要求

## 24.1 视觉关键词

- 神秘但不低级；
- 女性化但不幼稚；
- 温暖、精致、有仪式感；
- 适合 Instagram / Pinterest / TikTok；
- 不像传统算命网站；
- 不要过度紫色水晶风；
- 不要廉价星座 App 感。

## 24.2 推荐风格

- 暖白背景；
- 深棕 / 墨黑 / 香槟金；
- 少量玫瑰粉、月光银、深蓝；
- 大卡片；
- 柔和渐变；
- 细腻光晕；
- Tarot / aura 元素轻量点缀。

## 24.3 UI 原则

1. 首页上传/生成入口要成为绝对中心；
2. 卡片视觉优先级高于文本说明；
3. 每一屏只完成一个动作；
4. 按钮要清晰，不要过多；
5. 文案要短，但结果页内容要有价值；
6. 页面要像欧美高质感消费产品，而不是传统工具站。

---

# 25. 风险与边界

## 25.1 不能承诺改变命运

可以说：

```text
激活好运感。
找到今天的幸运色。
帮你带着更好状态出门。
```

不要说：

```text
保证改变命运。
保证脱单。
保证面试成功。
保证发财。
穿这个一定转运。
```

## 25.2 不做负面判断

不要输出：

- 你今天运势很差；
- 你不适合出门；
- 你会失败；
- 对方不喜欢你；
- 你的脸说明你命不好；
- 你需要改变外貌缺陷。

所有建议都应保持正向、轻量、可执行。

## 25.3 不做外貌焦虑

不要输出：

- 你的脸型不适合；
- 你显胖；
- 你身材缺点；
- 你颜值不够；
- 你需要遮住某个部位。

可以输出：

- 今天适合更清爽的线条；
- 今天适合更柔和的颜色；
- 今天适合更有结构感的单品；
- 今天适合用配饰增强完整度。

## 25.4 不做心理治疗

可以做：

- 轻度情绪鼓励；
- self-care 小动作；
- 日记提示；
- 出门前小仪式。

不要做：

- 心理诊断；
- 抑郁 / 焦虑治疗；
- 危机干预；
- 医疗建议。

## 25.5 不强制上传自拍

MVP 不建议强制上传自拍。

原因：

1. 增加隐私压力；
2. 增加审核风险；
3. 增加外貌焦虑风险；
4. 增加转化阻力；
5. 当前核心价值不依赖自拍。

P1 可以测试：

```text
Upload an outfit photo for aura enhancement
```

但必须避免评价身材、脸、缺陷。

---

# 26. 开发优先级

## 26.1 第一阶段：小程序体验验证版

目标：

```text
看 UI 是否舒服
看生成结果是否有吸引力
看保存/分享流程是否顺
```

开发范围：

1. 首页；
2. 场景选择；
3. 能量选择；
4. 生成中；
5. 基础结果；
6. 完整结果；
7. 保存成功；
8. 分享预览；
9. Mock 解锁；
10. 埋点。

不做：

1. 完整历史页；
2. 真实支付；
3. 复杂账户；
4. 多模板商城；
5. App 推送；
6. 长期订阅系统。

## 26.2 第二阶段：海外 Web/PWA MVP

目标：

```text
验证海外真实用户是否愿意点进来
是否愿意生成
是否愿意分享
是否愿意付费
```

开发范围：

1. Next.js Web；
2. Landing Page；
3. 生成流程；
4. 结果页；
5. 分享页；
6. Stripe/Paddle Checkout；
7. 支付回调；
8. 数据埋点；
9. A/B 测试 paywall；
10. 基础 SEO / Open Graph。

## 26.3 第三阶段：App

目标：

```text
提高留存
做每日 Aura Card
做推送
做订阅
做更强品牌感
```

开发范围：

1. React Native + Expo；
2. App 登录；
3. 每日提醒；
4. IAP / RevenueCat；
5. Aura Profile；
6. 7 天趋势；
7. Widget；
8. 历史卡片；
9. 高级模板；
10. 订阅权益。

---

# 27. 四周 MVP 执行计划

## 第 1 周：内容和原型验证

任务：

1. 设计 20 张示例 Lucky Aura Card；
2. 做 20 条 TikTok / Reels / 小红书风格内容；
3. 测试以下内容钩子：
   - `Pick a card: what color should you wear today?`
   - `Before you go out, draw your lucky aura.`
   - `Tarot chooses my outfit for a date.`
   - `Your lucky color before your next meeting.`
4. 观察评论是否出现：
   - `Do mine.`
   - `This is so me.`
   - `I needed this.`
   - `What should I wear?`

交付物：

- 20 张卡片图；
- 20 条内容脚本；
- 首页 UI；
- 生成流程 UI；
- Prompt v0.1；
- 映射库 v0.1。

## 第 2 周：小程序体验验证

任务：

1. 小程序首页；
2. 场景选择；
3. 能量选择；
4. 生成中；
5. 结果页；
6. 保存成功页；
7. 分享预览页；
8. Mock unlock；
9. 埋点。

交付物：

- 可跑通微信小程序；
- 真实生成或半模拟生成；
- 保存/分享闭环；
- 数据记录。

## 第 3 周：海外 Web/PWA MVP

任务：

1. Next.js Web 首页；
2. 生成流程；
3. 结果页；
4. 分享图渲染；
5. 支付墙；
6. Stripe/Paddle；
7. 分享链接；
8. Open Graph；
9. 埋点。

交付物：

- 可访问 Web MVP；
- 可支付解锁；
- 可分享；
- 可追踪指标。

## 第 4 周：付费和传播复盘

任务：

1. 分析首页到生成转化；
2. 分析保存率；
3. 分析分享率；
4. 分析解锁点击率；
5. 分析付费率；
6. 分析关键场景转化；
7. 判断是否进入 App 阶段。

交付物：

- MVP 数据复盘；
- 是否继续投入判断；
- 下一版需求清单；
- App 阶段计划或产品调整建议。

---

# 28. 验收标准

## 28.1 产品验收标准

MVP 通过标准：

1. 用户能在 30 秒内完成生成；
2. 首页主价值清晰；
3. 场景和能量选择无理解障碍；
4. 结果页有保存/分享欲望；
5. 分享图足够好看；
6. 解锁页价值明确；
7. 保存成功页反馈清晰；
8. 没有复杂无关功能干扰主流程。

## 28.2 技术验收标准

1. 小程序/Web 都调用统一后端 API；
2. Prompt 不写死在前端；
3. 卡片结果结构化存储；
4. 分享图可稳定生成；
5. 支付权益由后端判断；
6. 埋点事件完整；
7. 生成失败有重试；
8. 主要页面有 loading / error / empty 状态；
9. 可以根据 cardId 重新访问结果；
10. 匿名用户也能完成一次生成。

## 28.3 数据验收标准

至少能统计：

1. 首页访问量；
2. 点击生成人数；
3. 场景选择分布；
4. 能量选择分布；
5. 生成成功率；
6. 保存率；
7. 分享率；
8. 解锁点击率；
9. 支付转化率；
10. 次日回访率。

---

# 29. 当前版本最终建议

## 29.1 不建议现在直接做 App

直接做 App 的问题：

1. 成本高；
2. 审核慢；
3. 支付复杂；
4. 获客门槛高；
5. 产品还没验证；
6. 可能做出一堆用户不需要的功能。

## 29.2 建议现在这样做

```text
微信小程序继续做，但只做轻量闭环
    ↓
后端架构按海外 Web/App 标准设计
    ↓
AI 生成、卡片保存、分享图、支付权益全部走统一 API
    ↓
尽快做海外 Web/PWA
    ↓
Web/PWA 有真实数据后，再做 App
```

## 29.3 一句话总结

> **微信小程序用来快速看效果，海外 Web/PWA 用来验证市场，App 用来放大留存和订阅。不要把微信小程序当最终产品，也不要一开始就重做原生 App。**

---

# 30. 后续路线图

## P1：验证后扩展

如果 MVP 指标达标，可以扩展：

1. 自拍气场增强；
2. 星座 / 生日个性化；
3. 7 天开运趋势；
4. Aura Profile；
5. 高级卡片模板；
6. 每日提醒；
7. 历史卡片；
8. 约会 / 面试 / 会议专属卡。

## P2：商业化增强

1. 周订阅 / 月订阅；
2. 高级主题卡包；
3. 情绪趋势报告；
4. 个性化穿搭风格库；
5. 香水 / 饰品 / 美妆推荐；
6. 创作者分享模板；
7. 多语言版本；
8. Referral growth loop。

## P3：不要太早做

1. 完整衣橱管理；
2. 商品电商闭环；
3. 真人塔罗师；
4. 重关系咨询；
5. 空间风水；
6. AI 陪聊长期伴侣；
7. 复杂社区；
8. 复杂匹配和社交关系链。

---

# 31. 给开发的最小实现清单

## 31.1 P0 页面

1. 首页；
2. 场景选择页；
3. 能量选择页；
4. 生成中页；
5. 基础结果页；
6. 解锁页；
7. 完整结果页；
8. 分享预览页；
9. 保存成功页。

## 31.2 P0 后端

1. 创建生成任务；
2. 调用 AI 生成结构化结果；
3. 保存 Aura Card；
4. 获取免费结果；
5. 获取完整结果；
6. Mock 解锁；
7. 保存卡片；
8. 分享记录；
9. 埋点记录。

## 31.3 P0 数据表

1. users；
2. aura_cards；
3. generation_jobs；
4. card_templates；
5. share_events；
6. analytics_events。

支付相关表可以先建，但第一版可 mock：

1. payment_orders；
2. user_entitlements。

## 31.4 P0 不做

1. History Tab；
2. 复杂用户中心；
3. 多模板商城；
4. 强制自拍；
5. 真人塔罗；
6. 完整订阅；
7. App；
8. 复杂社区。

---

# 32. 最终产品判断

AuraCue 有市场，但不是强刚需市场，而是：

> **高传播、中等付费、强情绪价值、适合轻量订阅和单次解锁的消费产品。**

正确路线不是：

> 做一个更复杂的塔罗 App。

而是：

> 做一个更可执行、更好看、更适合分享的出门前开运气场卡产品。

最终核心应坚持：

> **每天出门前 30 秒，给用户一个更开心、更自信、更有好运感的理由。**
