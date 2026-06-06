# AuraCue Final PRD & Codex Development Spec v1.0

> 文档类型：最终统一需求文档 / 工程开发规格 / Codex 可执行开发说明  
> 适用范围：**H5 / Web App + 微信小程序 P0 MVP**  
> 不适用范围：复杂原生 App、完整订阅系统、商城、社区、长期陪伴、真人塔罗  
> 产品名称：**AuraCue**  
> 中文内部名：**今日开运气场卡 / 今日气场激活仪式**  
> 当前最终主线：**Mood → Context → Optional Outfit → Draw → Reveal → Activate → Seal → Save/Share**  
> 文档目标：Codex 或开发团队读完后，可以直接按照本文件完成 P0 的前端、后端、数据库、AI 生成、卡片渲染、埋点、H5/Web App 与微信小程序适配。

---

## 0. 给 Codex / 开发团队的执行说明

本文件是最终版 P0 开发依据。开发时以本文件为最高优先级，不再回退到旧版本文档。

### 0.1 本文件合并规则

本文件将原有两份文档统一为一个可执行版本：

1. **v0.2 的保留部分**
   - H5 / Web App 与微信小程序共享后端的架构原则；
   - 统一 API；
   - 统一数据库；
   - 统一 Prompt；
   - 统一卡片渲染；
   - 统一埋点；
   - 不直接开发复杂 App；
   - 支付、订阅、历史、趋势、商城作为后置能力。

2. **v0.3 的保留部分**
   - 产品体验从“生成一张卡”升级为“完成一次气场激活仪式”；
   - P0 主线采用 `Draw → Reveal → Activate → Save/Share`；
   - 首页从场景优先改为 mood-first；
   - 场景和穿搭上传变为可选；
   - 新增 Lucky Anchor 与 Hold to Seal；
   - 晚间反馈、7 天趋势、History、Paywall 都不进入 P0 主路径。

### 0.2 最终开发结论

P0 只开发：

```text
H5 / Web App
微信小程序
统一后端 API
统一 PostgreSQL 数据库
统一 AI JSON 生成
统一 9:16 分享卡渲染
统一埋点
```

P0 不开发：

```text
复杂 App
React Native / Expo App
真实订阅系统
完整 Paywall
Shop Your Aura
History Tab
7-Day Trend
Evening Reflection
复杂账号系统
强制自拍
复杂电商
真人塔罗
社区
```

### 0.3 技术实现原则

最重要的工程原则：

```text
前端只负责展示、交互、上传和调用 API。
核心业务逻辑全部放到后端。
```

因此：

- Prompt 不写在前端；
- AI 不在前端直接调用；
- 小程序不保存核心业务数据；
- H5 与小程序都调用同一套 API；
- 卡片内容由后端生成并入库；
- 分享图由后端统一渲染；
- 激活状态由后端记录；
- 埋点由后端统一接收。

---

## 1. 产品定位

### 1.1 产品一句话

**AuraCue 是一个每天出门前使用的 AI 气场激活仪式产品。用户选择今天想要的状态，抽取今日气场卡，穿上幸运色，选择幸运锚点，长按封存气场，然后带着今日能量出门。**

### 1.2 英文定位

```text
AuraCue is a daily aura activation ritual.
Pick how you want to feel, draw your aura card,
wear your lucky color, seal your anchor,
and carry today’s energy with you.
```

### 1.3 中文定位

```text
每天出门前 30 秒，抽一张今日气场卡。
选择今天想要的状态，穿上幸运色，封存幸运锚点，
带着更好的气场出门。
```

### 1.4 核心差异化

传统塔罗 / 星座产品偏向：

```text
Reading：读懂今天
```

AuraCue 要做：

```text
Activation：激活今天
```

即：

```text
抽卡
  ↓
看到今日气场
  ↓
获得幸运色
  ↓
选择现实中的幸运锚点
  ↓
长按封存
  ↓
今日气场已激活
  ↓
保存 / 分享 / 出门
```

### 1.5 产品不做什么

AuraCue 不是：

- 严肃算命产品；
- 医疗 / 心理咨询产品；
- 外貌评分产品；
- 面相产品；
- 完整 AI 穿搭管理产品；
- 完整星盘产品；
- 真人塔罗师服务；
- 社交社区产品。

---

## 2. P0 MVP 范围

### 2.1 P0 要验证的核心问题

P0 不优先验证付费。

P0 优先验证：

```text
用户是否愿意每天完成一次“今日气场激活仪式”，
并愿意保存、分享、第二天再回来。
```

### 2.2 P0 必须完成的能力

| 模块 | P0 是否必须 | 说明 |
|---|---:|---|
| Mood-first 首页 | 必须 | 用户选择今天想要的感觉 |
| Optional Context | 必须 | 场景可选，不阻塞生成 |
| Optional Outfit Upload | 必须 | 上传可选，失败可跳过 |
| Draw & Reveal | 必须 | 3 张卡抽取，制造仪式感 |
| AI Aura Card 生成 | 必须 | 输出稳定 JSON |
| Daily Aura Card Result | 必须 | 展示结果，主按钮激活 |
| Activate Today’s Aura | 必须 | 选择幸运锚点 |
| Hold to Seal | 必须 | 长按 3 秒封存 |
| Aura Activated | 必须 | 激活成功反馈 |
| Save Card | 必须 | 保存记录 |
| Share Story Preview | 必须 | 9:16 分享图 |
| Copy Link / Download | 必须 | Web 与小程序各自适配 |
| Analytics | 必须 | 全流程关键埋点 |
| 匿名用户流程 | 必须 | 不强制登录 |
| 统一后端 API | 必须 | H5 与小程序共用 |
| 统一数据库 | 必须 | PostgreSQL + Prisma |
| Mock AI Fallback | 必须 | 无 AI Key 时可跑通开发环境 |

### 2.3 P0 不开发的能力

| 模块 | P0 处理方式 |
|---|---|
| App | 不开发 |
| 真实订阅 | 不开发 |
| Paywall | 不作为主线，可保留表结构，不做页面 |
| 真实支付 | 不开发，后端可预留模型 |
| History Tab | 不开发 |
| 7-Day Trend | 不开发 |
| Evening Reflection | 不开发，只可预留表 |
| Shop Your Aura | 不开发 |
| 用户账号系统 | 不强制，可匿名 |
| 微信支付 | 不开发 |
| Stripe / Paddle | 不开发 |
| 多语言完整系统 | P0 默认英文，可保留 language 字段 |
| 完整穿搭分析 | 不开发，只做 outfit mood/style 辅助 |
| 身体 / 脸部评价 | 严禁 |
| 保证改运 / 保证恋爱 / 保证成功 | 严禁 |

---

## 3. 平台形态与统一架构

### 3.1 平台定位

| 平台 | P0 定位 | 目标 |
|---|---|---|
| H5 / Web App | 主验证阵地 | 适合海外、TikTok、Instagram、Pinterest、小红书链接承接 |
| 微信小程序 | 国内轻量验证舱 | 快速测试 UI、流程、保存、分享 |
| App | 不做 | 数据验证后再考虑 |

### 3.2 总体架构

```text
apps/web                 apps/wechat-mini
Next.js H5/Web App       Taro/React 微信小程序
        │                         │
        └─────────── HTTPS API ───┘
                      │
                 apps/web API Routes
              或独立 apps/api Backend
                      │
 ┌────────────────────┼─────────────────────┐
 │                    │                     │
Aura Card Service  Activation Service  Analytics Service
Draw Service       Upload Service      Share Render Service
Prompt Core        Card Renderer       Storage Adapter
 │                    │                     │
 └────────────────────┼─────────────────────┘
                      │
        PostgreSQL + Prisma + Object Storage
                      │
             AI Provider / Mock AI Provider
```

### 3.3 P0 推荐技术栈

为了让第一版能最快交付，P0 采用轻量但可扩展架构。

```text
Monorepo：pnpm workspace
Web：Next.js + TypeScript + Tailwind CSS
API：Next.js Route Handlers
微信小程序：Taro + React + TypeScript
数据库：PostgreSQL
ORM：Prisma
对象存储：本地开发 public/uploads，生产 Cloudflare R2 / S3 / Supabase Storage
AI：OpenAI / Claude / Gemini 均可，P0 必须支持 mock provider
卡片渲染：SVG/HTML template → PNG
埋点：自建 analytics_events 表
部署：Web/API 可部署 Vercel；DB 使用 Supabase/Postgres；小程序单独上传微信后台
```

### 3.4 为什么 P0 不拆独立 NestJS

P0 可以先用 Next.js Route Handlers 承担 API，原因：

- 开发速度更快；
- Web 与 API 共仓库，Codex 更容易一次性完成；
- 数据库和业务逻辑仍然保持模块化；
- 后续要拆 NestJS 时，可以把 `server/services` 平移到独立服务。

### 3.5 Monorepo 目录结构

```text
auracue/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   ├── context/page.tsx
│   │   │   │   ├── upload/page.tsx
│   │   │   │   └── draw/page.tsx
│   │   │   ├── result/[id]/page.tsx
│   │   │   ├── activate/[id]/page.tsx
│   │   │   ├── activated/[id]/page.tsx
│   │   │   ├── share/[id]/page.tsx
│   │   │   ├── saved/[id]/page.tsx
│   │   │   └── api/v1/...
│   │   ├── components/
│   │   ├── lib/
│   │   ├── server/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── ai/
│   │   │   ├── renderer/
│   │   │   └── validators/
│   │   └── public/
│   │
│   └── wechat-mini/
│       ├── src/
│       │   ├── app.config.ts
│       │   ├── app.ts
│       │   ├── pages/
│       │   │   ├── index/index.tsx
│       │   │   ├── create/context.tsx
│       │   │   ├── create/upload.tsx
│       │   │   ├── create/draw.tsx
│       │   │   ├── result/index.tsx
│       │   │   ├── activate/index.tsx
│       │   │   ├── activated/index.tsx
│       │   │   ├── share/index.tsx
│       │   │   └── saved/index.tsx
│       │   ├── components/
│       │   ├── services/
│       │   └── store/
│       └── project.config.json
│
├── packages/
│   ├── shared-types/
│   │   └── src/index.ts
│   ├── shared-constants/
│   │   └── src/index.ts
│   ├── prompt-core/
│   │   └── src/index.ts
│   ├── analytics-events/
│   │   └── src/index.ts
│   └── ui-tokens/
│       └── src/index.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── docs/
│   └── FINAL_PRD_CODEX_SPEC.md
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .env.example
```

---

## 4. 用户流程与状态机

### 4.1 P0 主流程

```text
用户进入首页
  ↓
选择 today mood
  ↓
进入 Optional Context
  ↓
选择一个 context 或 Skip
  ↓
进入 Optional Outfit Upload
  ↓
上传 outfit photo 或 Skip
  ↓
进入 Draw & Reveal
  ↓
后端创建 draw_session，返回 draw_seed
  ↓
用户从 3 张卡中选择一张
  ↓
后端根据 mood + context + upload + draw_seed + draw_position 生成 Daily Aura Card
  ↓
展示 Daily Aura Card Result
  ↓
用户点击 Activate Today’s Aura
  ↓
选择 Lucky Anchor
  ↓
长按 3 秒 Hold to Seal
  ↓
后端记录 activation sealed
  ↓
展示 Aura Activated
  ↓
用户 Save Card / Share Story / Back Home
```

### 4.2 P0 状态机

```text
started
  ↓
mood_selected
  ↓
context_optional_done
  ↓
upload_optional_done
  ↓
draw_session_started
  ↓
draw_selected
  ↓
generation_started
  ↓
generated
  ↓
result_viewed
  ↓
activation_started
  ↓
anchor_selected
  ↓
hold_started
  ↓
sealed
  ↓
activated
  ↓
saved / shared / back_home
```

### 4.3 失败分支

| 位置 | 失败情况 | 处理 |
|---|---|---|
| context | 用户不选 | 允许 Skip |
| upload | 用户不传 | 允许 Skip |
| upload | 上传失败 | Toast + Retry + Skip |
| draw | 用户未选卡 | 不能继续生成 |
| generation | AI 超时 | 使用 mock/fallback 生成，或显示 Retry |
| generation | JSON 解析失败 | 后端重试一次；失败后 fallback |
| result | cardId 不存在 | 404 页面 + Back Home |
| activation | 未选 anchor | Hold 按钮 disabled |
| hold | 用户松手 | 进度归零，不调用 seal |
| seal | API 失败 | 显示 Retry Seal |
| save | 保存失败 | Toast + Retry |
| share | 分享失败 | 保留 Copy Link / Save Image |

---

## 5. 产品信息架构

### 5.1 H5 / Web App 路由

| 页面 | 路由 | P0 | 说明 |
|---|---|---:|---|
| Mood-first Home | `/` | 是 | mood 必填 |
| Optional Context | `/create/context` | 是 | context 可选 |
| Optional Outfit Upload | `/create/upload` | 是 | outfit 可选 |
| Draw & Reveal | `/create/draw` | 是 | 抽 3 选 1 |
| Daily Aura Card Result | `/result/[id]` | 是 | 主按钮激活 |
| Activate Today’s Aura | `/activate/[id]` | 是 | 选 anchor + hold |
| Aura Activated | `/activated/[id]` | 是 | 成功页 |
| Share Story Preview | `/share/[id]` | 是 | 9:16 图 |
| Save Success | `/saved/[id]` | 可选 | Web 可做页面，也可 modal |
| Account | `/account` | 否 | P1 |
| History | `/history` | 否 | P1 |
| Trend | `/trend` | 否 | P1 |
| Paywall | `/unlock/[id]` | 否 | P1 |

### 5.2 微信小程序页面

| 页面 | 小程序路径 | P0 | 说明 |
|---|---|---:|---|
| Mood-first Home | `pages/index/index` | 是 | 首页 |
| Optional Context | `pages/create/context` | 是 | 可选场景 |
| Optional Outfit Upload | `pages/create/upload` | 是 | 上传/跳过 |
| Draw & Reveal | `pages/create/draw` | 是 | 3 张卡 |
| Result | `pages/result/index?id=` | 是 | 结果 |
| Activate | `pages/activate/index?id=` | 是 | 激活 |
| Activated | `pages/activated/index?id=` | 是 | 成功 |
| Share | `pages/share/index?id=` | 是 | 分享预览 |
| Saved | `pages/saved/index?id=` | 可选 | 保存成功 |

### 5.3 页面进入保护

如果用户直接访问中间页但缺少前置状态：

| 当前页 | 缺少数据 | 跳转 |
|---|---|---|
| `/create/context` | 无 mood | `/` |
| `/create/upload` | 无 mood | `/` |
| `/create/draw` | 无 mood | `/` |
| `/result/[id]` | card 不存在 | 404 + Home |
| `/activate/[id]` | card 不存在 | 404 + Home |
| `/activated/[id]` | 未 activated | `/activate/[id]` |
| `/share/[id]` | card 不存在 | 404 + Home |

---

## 6. 页面详细需求

## 6.1 01 首页 / Mood-first Home

### 页面目标

让用户 3 秒内理解：

```text
选择今天想要的感觉，AuraCue 会把它变成今日幸运气场卡。
```

### Web 路由

```text
/
```

### 小程序路径

```text
pages/index/index
```

### 页面文案

主标题：

```text
How do you want to feel today?
```

副标题：

```text
Pick one mood and we’ll turn it into your lucky aura card.
```

主按钮：

```text
Start My Aura Card
```

轻提示：

```text
Lucky color · Style vibe · Tiny ritual · Aura anchor
```

免责声明：

```text
For reflection and fun. Not a guarantee or professional advice.
```

### Mood 选项

| 值 | 展示名 | Subtitle | 中文理解 |
|---|---|---|---|
| `calm` | Calm | Peaceful & centered | 平静、稳定 |
| `confident` | Confident | Strong & unstoppable | 自信、有力量 |
| `romantic` | Romantic | Open heart & soft glow | 柔软、恋爱感 |
| `magnetic` | Magnetic | Attract, don’t chase | 吸引力、磁场 |
| `protected` | Protected | Safe & supported | 被保护、有边界 |
| `creative` | Creative | Inspired & expressive | 灵感、表达 |
| `lucky` | Lucky | Doors open, blessings flow | 好运、机会感 |
| `mysterious` | Mysterious | Intuitive & enigmatic | 神秘、直觉 |

### 交互规则

1. mood 必填；
2. 初始按钮 disabled；
3. 选择 mood 后按钮 active；
4. 点击按钮：
   - 保存 mood 到 local draft；
   - 记录 `select_mood`；
   - 跳转 `/create/context`；
5. 如果当天已有 activated card：
   - 显示 `Today’s Aura Active` 小入口；
   - 点击进入 `/activated/[id]`；
   - 仍允许重新生成一张。

### API 调用

进入页面时可调用：

```http
GET /api/v1/aura-cards/today?anonymousId=xxx
```

如果返回 active card，则展示今日已激活入口。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `page_view_home` | 页面加载 | platform, anonymousId |
| `select_mood` | 用户选择 mood | mood |
| `click_start_card` | 点击开始 | mood |
| `click_today_active_card` | 点击今日已激活 | cardId |

### 验收标准

- 未选择 mood 时不能进入下一步；
- mood 选择有明显视觉反馈；
- 首页没有复杂功能干扰主流程；
- 移动端首屏能看到标题、mood 选择和按钮；
- 匿名用户可正常使用。

---

## 6.2 02 Optional Context

### 页面目标

让 AI 更贴合今日场景，但不阻塞生成。

### Web 路由

```text
/create/context
```

### 小程序路径

```text
pages/create/context
```

### 页面文案

标题：

```text
Any context for today?
```

副标题：

```text
Optional — add a scene if you want us to tune your card a little more.
```

按钮：

```text
Continue
Skip
```

### Context 选项

| 值 | 展示名 | 中文 |
|---|---|---|
| `date` | Date | 约会 |
| `work` | Work | 工作 / 会议 |
| `party` | Party | 聚会 / 社交 |
| `interview` | Interview | 面试 |
| `travel` | Travel | 旅行 / 出行 |
| `just_for_luck` | Just for luck | 只是想好运一点 |
| `skip` | Skip | 跳过 |

### 交互规则

1. context 可选；
2. P0 建议单选；
3. 用户选择 context 后点击 Continue；
4. 用户不选择时可以点击 Skip；
5. 不允许 context 阻塞生成；
6. Continue 或 Skip 后进入 `/create/upload`。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `page_view_context` | 页面加载 | mood |
| `context_selected` | 选择 context | mood, context |
| `context_skipped` | 点击 Skip | mood |

### 验收标准

- Skip 永远可用；
- context 不作为必填；
- 选择后可返回修改；
- 页面不出现付费入口。

---

## 6.3 03 Optional Outfit Upload

### 页面目标

让用户上传今日穿搭增强个性化，但不能成为门槛。

### Web 路由

```text
/create/upload
```

### 小程序路径

```text
pages/create/upload
```

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
Continue
Skip for Today
```

安全提示：

```text
We only use your outfit vibe. We don’t judge your body, face, or appearance.
```

### 上传规则

| 项 | 规则 |
|---|---|
| 是否必填 | 否 |
| 支持格式 | jpg, jpeg, png, webp |
| 最大体积 | 8MB |
| 图片数量 | P0 只允许 1 张 |
| 是否压缩 | Web 端压缩到最长边 1600px，小程序尽量使用 compressed |
| 是否做人脸/身体评价 | 禁止 |
| 上传失败 | 可重试或 Skip |

### 交互规则

1. 用户点击 Upload Outfit；
2. 选择图片；
3. 前端校验格式和大小；
4. 上传到 `/api/v1/uploads/outfit`；
5. 成功返回 `outfitUploadId` 和 `fileUrl`；
6. 显示图片预览；
7. 点击 Continue 进入 `/create/draw`；
8. 用户可随时 Skip；
9. 上传失败不阻塞生成。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `page_view_upload` | 页面加载 | mood, context |
| `outfit_upload_started` | 开始上传 | source |
| `outfit_upload_success` | 上传成功 | uploadId, fileSize, fileType |
| `outfit_upload_failed` | 上传失败 | reason |
| `outfit_upload_skipped` | 跳过 | mood, context |

### 验收标准

- 未上传也能继续；
- 上传失败时不阻断；
- 图片预览正常；
- 不出现“评价身材 / 脸 / 缺陷”的文案；
- 小程序可调用 `chooseMedia`；
- Web 可调用 `<input type="file">`。

---

## 6.4 04 Draw & Reveal

### 页面目标

制造“我亲手抽中了今日气场”的仪式感。

### Web 路由

```text
/create/draw
```

### 小程序路径

```text
pages/create/draw
```

### 页面文案

标题：

```text
Choose the card that calls you.
```

副标题：

```text
Take one breath. Let today’s aura find you.
```

Loading 文案轮播：

```text
Revealing your aura...
Choosing your lucky color...
Preparing your tiny ritual...
```

### 页面内容

- 3 张卡背面；
- AuraCue logo 或抽象 aura 图案；
- 用户点击其中一张；
- 选中卡发光、放大、翻转；
- 其他卡淡出；
- 进入生成 loading；
- 生成完成后跳转 `/result/[id]`。

### 数据规则

1. 进入页面时调用 `POST /api/v1/draw-sessions/start`；
2. 后端返回 `drawSessionId` 和 `drawSeed`；
3. 用户选择第几张卡，记录 `drawPosition`，取值为 `1 | 2 | 3`；
4. 调用 `POST /api/v1/aura-cards/generate`；
5. 生成结果与 `mood + context + upload + drawSeed + drawPosition` 绑定。

### 交互规则

1. 用户必须选一张卡；
2. 用户选中后不能连续点多张；
3. 生成中按钮和返回操作要防止重复提交；
4. 如果生成失败：
   - 显示 `The aura signal got cloudy. Try again.`
   - 提供 Retry；
5. 如果 Retry 仍失败：
   - 使用 mock/fallback 生成；
6. 不能让用户感觉是纯随机，文案保持 `the card that calls you`。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `draw_page_view` | 页面加载 | mood, context, hasUpload |
| `draw_session_started` | draw session 创建 | drawSessionId |
| `draw_card_selected` | 选择卡 | drawPosition, drawSeed |
| `generation_started` | 开始生成 | jobId |
| `generation_success` | 生成成功 | jobId, cardId |
| `generation_failed` | 生成失败 | jobId, reason |

### 验收标准

- 页面有 3 张卡；
- 点击一张后有明显选中动画；
- `draw_position` 写入后端；
- `draw_seed` 写入后端；
- 生成成功后跳结果页；
- 失败可重试；
- 重复点击不会创建多张卡。

---

## 6.5 05 Daily Aura Card Result

### 页面目标

让用户觉得：

```text
这张卡说中了我，今天我可以带着这个气场出门。
```

### Web 路由

```text
/result/[id]
```

### 小程序路径

```text
pages/result/index?id=cardId
```

### 页面展示字段

| 字段 | 是否必显 | 示例 |
|---|---:|---|
| `auraName` | 是 | Quiet Power Bloom |
| `cardTitle` | 否 | Your Quiet Power Day |
| `luckyColors` | 是 | Blush Pink · Navy · Gold |
| `styleVibe` | 是 | Tailored & Confident |
| `energyMessage` | 是 | You don’t need to be loud today... |
| `miniRitual` | 是 | Touch one gold detail and take 3 deep breaths. |
| `todayIntention` | 是 | I move through today with quiet power. |
| `shareImageUrl` | 是 | 9:16 story image |

### 页面文案结构

```text
Today’s Aura

Quiet Power Bloom

Lucky Colors
Blush Pink · Navy · Gold

Style Vibe
Tailored & Confident

Energy Message
You don’t need to be loud today. Your calm presence already builds respect.

Mini Ritual
Before you step out, take 3 deep breaths and touch one gold detail.
```

### 按钮顺序

```text
Activate Today’s Aura
Save Card
Share Story
```

### 交互规则

1. 页面加载调用 `GET /api/v1/aura-cards/:cardId`；
2. 如果 `isActivated = true`，主按钮改为 `View Activated Aura`；
3. 点击 `Activate Today’s Aura` 跳 `/activate/[id]`；
4. 点击 Save 调用保存接口，展示 SaveSuccessModal 或跳 `/saved/[id]`；
5. 点击 Share 跳 `/share/[id]`；
6. P0 不展示付费墙主入口；
7. 可保留一个隐藏或低优先级 `Full Reading` 实验入口，但默认不实现。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `view_result` | 页面加载 | cardId, mood, context |
| `click_activate_aura` | 点击激活 | cardId |
| `click_save_from_result` | 点击保存 | cardId |
| `click_share_from_result` | 点击分享 | cardId |

### 验收标准

- 结果页字段完整；
- 主按钮是激活，不是付费；
- 保存可成功写入后端；
- 分享可进入预览；
- cardId 可直接访问；
- 结果页移动端视觉像卡片，不像普通报告。

---

## 6.6 06 Activate Today’s Aura

### 页面目标

让用户完成一个现实动作，把气场从“卡片结果”转化为“今天携带的能量”。

### Web 路由

```text
/activate/[id]
```

### 小程序路径

```text
pages/activate/index?id=cardId
```

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

展示：

```text
Your lucky colors
Blush Pink · Navy · Gold
```

解释：

```text
Wear one color that carries today’s aura.
```

#### Step 2：Choose Your Lucky Anchor

锚点来自 AI 输出的 `luckyAnchorCandidates`，如果 AI 未返回，则使用默认锚点。

默认锚点：

| 值 | 展示名 | 说明 |
|---|---|---|
| `lucky_color` | Lucky Color | 今天穿上幸运色 |
| `jewelry` | Jewelry | 戴一件首饰 |
| `crystal` | Crystal | 带一个水晶 / 幸运物 |
| `lipstick` | Lipstick | 使用一个唇色 |
| `perfume` | Perfume | 喷一款香氛 |
| `outfit_detail` | Outfit Detail | 选择一个穿搭细节 |
| `ring_necklace` | Ring / Necklace | 戒指 / 项链 |
| `bag_scarf` | Bag / Scarf | 包 / 围巾 |

#### Step 3：Hold to Seal

按钮：

```text
Hold to Seal Your Aura
```

长按说明：

```text
Touch your anchor. Take one slow breath. Hold to seal today’s aura.
```

### 交互规则

1. 页面加载获取 card；
2. 用户必须选择一个 anchor；
3. 选择 anchor 后调用 `POST /api/v1/aura-cards/:cardId/activation/start`；
4. 返回 `activationId`；
5. Hold 按钮启用；
6. 用户按住 0–3 秒显示进度；
7. 松手前不足 3 秒：
   - 进度清零；
   - 不调用 seal；
   - 记录 `activation_hold_cancelled`；
8. 按满 3 秒：
   - 轻微震动；
   - 调用 `POST /api/v1/activations/:activationId/seal`；
   - 成功后跳 `/activated/[id]`；
9. Seal API 失败：
   - 显示 Retry；
   - 不标记 activated；
10. 再次进入已激活卡：
   - 展示已激活状态；
   - 可跳 `/activated/[id]`。

### 长按动画要求

| 动画 | 要求 |
|---|---|
| 进度条 | 0 到 100%，持续 3000ms |
| 视觉 | 圆环或按钮填充均可 |
| 颜色 | 优先使用第一个 lucky color 对应 token |
| 完成 | glow / halo |
| 震动 | Web 使用 `navigator.vibrate(35)`；小程序使用 `wx.vibrateShort` |
| 中断 | 进度归零 |

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `activation_page_view` | 页面加载 | cardId |
| `activation_anchor_selected` | 选择 anchor | cardId, anchorType, anchorLabel |
| `activation_started` | start 接口成功 | cardId, activationId |
| `activation_hold_started` | 开始长按 | activationId |
| `activation_hold_cancelled` | 松手不足 3 秒 | activationId, holdDurationMs |
| `activation_hold_completed` | 满 3 秒 | activationId, holdDurationMs |
| `aura_activated` | seal 成功 | cardId, activationId |

### 验收标准

- 未选 anchor 时不能长按；
- 长按不足 3 秒不激活；
- 长按满 3 秒才调用 seal；
- 后端状态变为 activated；
- aura_cards.is_activated 变 true；
- aura_activations.status 变 activated；
- 成功后跳转激活成功页。

---

## 6.7 07 Aura Activated

### 页面目标

给用户明确心理反馈：

```text
今日气场已经启动。
```

### Web 路由

```text
/activated/[id]
```

### 小程序路径

```text
pages/activated/index?id=cardId
```

### 页面文案

标题：

```text
Aura Activated
```

副标题：

```text
{auraName} is active for today.
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

轻提示：

```text
Carry this energy with you today.
```

P0 不显示晚间反馈强提醒。

### 交互规则

1. 页面加载获取 card 和最新 activation；
2. 如果未激活，跳回 `/activate/[id]`；
3. 点击 Save 调用保存接口；
4. 点击 Share 跳分享页；
5. 点击 Back Home 回 `/`；
6. 如果已保存，按钮显示 `Saved`。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `activated_page_view` | 页面加载 | cardId |
| `click_save_from_activated` | 保存 | cardId |
| `click_share_from_activated` | 分享 | cardId |
| `click_back_home_from_activated` | 回首页 | cardId |

### 验收标准

- 页面清晰显示 Aura Activated；
- 显示 anchor；
- 显示 intention；
- 保存和分享可用；
- 未激活不能直接看成功态。

---

## 6.8 08 Share Story Preview

### 页面目标

让用户愿意保存并分享到 Instagram Story / TikTok / Pinterest / 小红书 / 微信。

### Web 路由

```text
/share/[id]
```

### 小程序路径

```text
pages/share/index?id=cardId
```

### 分享图规格

| 项 | 规格 |
|---|---|
| 比例 | 9:16 |
| 建议尺寸 | 1080 x 1920 |
| 格式 | PNG |
| 主题 | Ivory + Blush Pink + Soft Gold |
| 水印 | AuraCue |
| 内容 | 少而美，不做报告截图 |

### 分享图字段

```text
AuraCue
Today’s Aura
Aura Name
Lucky Color
Style Vibe
Energy Message
Mini Ritual
Date
```

### 页面操作按钮

Web：

```text
Save Image
Share Story
Copy Link
Back
```

微信小程序：

```text
Save Image
Share to Friend
Copy Link
Back
```

### 交互规则

1. 页面加载获取 card；
2. 如果 `shareImageUrl` 不存在，调用 render 接口；
3. 展示 9:16 图片预览；
4. Web 点击 Save Image：下载 PNG；
5. Web 点击 Share Story：
   - 优先使用 Web Share API；
   - 不支持时 fallback 到下载图片；
6. Web 点击 Copy Link：复制公开分享链接；
7. 小程序点击 Save Image：
   - 先检查相册权限；
   - 调用保存图片；
8. 小程序分享使用 `onShareAppMessage`；
9. 每次分享动作调用 share 记录接口。

### 埋点

| 事件 | 时机 | payload |
|---|---|---|
| `share_preview_view` | 页面加载 | cardId |
| `save_image` | 保存图片 | cardId, platform |
| `share_card` | 分享 | cardId, channel |
| `copy_share_link` | 复制链接 | cardId |

### 验收标准

- 9:16 图片稳定展示；
- 无图片时可以重新 render；
- Web 可下载；
- Web 可复制链接；
- 小程序可保存图片；
- 小程序可分享；
- 分享事件入库。

---

## 6.9 09 Save Success

### 页面目标

确认保存完成，并引导分享或回首页。

### P0 实现建议

Web 与小程序都优先做成弹层：

```text
SaveSuccessModal
```

也可以保留 `/saved/[id]` 和小程序 `pages/saved/index` 作为 fallback。

### 文案

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

### 交互规则

1. 调用保存接口成功后显示；
2. 点击 Share My Aura 跳 `/share/[id]`；
3. 点击 Back to Home 回 `/`；
4. 不显示复杂历史列表；
5. 不做卡包管理。

### 验收标准

- 保存后有明确反馈；
- 不误导为 History 页；
- 可进入分享；
- 可返回首页。

---

## 7. 共享类型定义

所有类型放在：

```text
packages/shared-types/src/index.ts
```

### 7.1 枚举类型

```ts
export type Platform = 'web' | 'wechat';

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

export type GenerationStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'timeout';

export type ActivationStatus =
  | 'started'
  | 'anchor_selected'
  | 'sealed'
  | 'activated'
  | 'cancelled'
  | 'failed';

export type ShareChannel =
  | 'instagram_story'
  | 'tiktok'
  | 'pinterest'
  | 'wechat'
  | 'xiaohongshu'
  | 'copy_link'
  | 'download'
  | 'web_share'
  | 'other';
```

### 7.2 AuraCard 类型

```ts
export interface LuckyAnchorCandidate {
  type: AnchorType;
  label: string;
  reason?: string;
  color?: string;
}

export interface AuraCard {
  id: string;
  userId?: string | null;
  anonymousId?: string | null;

  selectedMood: AuraMood;
  optionalContext?: AuraContext | null;
  outfitUploadUrl?: string | null;
  language: string;
  timezone?: string | null;

  drawSeed?: string | null;
  drawPosition?: number | null;
  drawRevealedAt?: string | null;

  auraName: string;
  cardTitle?: string | null;
  auraColor?: string | null;
  luckyColors: string[];
  styleVibe: string;
  energyMessage: string;
  outfitEnergy?: string | null;
  beautyCue?: string | null;
  socialMove?: string | null;
  miniRitual: string;
  todayIntention: string;
  luckyAnchorCandidates: LuckyAnchorCandidate[];
  shareCaption?: string | null;
  safetyDisclaimer?: string | null;

  templateId?: string | null;
  imageUrl?: string | null;
  shareImageUrl?: string | null;

  status: string;
  isSaved: boolean;
  isShared: boolean;
  isActivated: boolean;

  createdAt: string;
  updatedAt: string;
}
```

### 7.3 AI 输出类型

```ts
export interface AuraCardAIResult {
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
  luckyAnchorCandidates: LuckyAnchorCandidate[];
  shareCaption: string;
  safetyDisclaimer: string;
}
```

### 7.4 API 通用响应类型

```ts
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export interface ApiSuccess<T> {
  data: T;
}
```

---

## 8. 数据库设计

数据库使用 PostgreSQL + Prisma。P0 必须支持匿名用户。所有时间字段默认 UTC。

### 8.1 Prisma Schema

放在：

```text
prisma/schema.prisma
```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Platform {
  web
  wechat
}

enum AuraMood {
  calm
  confident
  romantic
  magnetic
  protected
  creative
  lucky
  mysterious
}

enum AuraContext {
  date
  work
  party
  interview
  travel
  just_for_luck
  skip
}

enum UploadStatus {
  pending
  uploaded
  failed
  deleted
}

enum DrawSessionStatus {
  started
  selected
  expired
  cancelled
}

enum GenerationStatus {
  pending
  running
  success
  failed
  timeout
}

enum AuraCardStatus {
  generated
  activation_started
  activated
  saved
  shared
  failed
}

enum AnchorType {
  lucky_color
  jewelry
  crystal
  lipstick
  perfume
  outfit_detail
  ring_necklace
  bag_scarf
  other
}

enum ActivationStatus {
  started
  anchor_selected
  sealed
  activated
  cancelled
  failed
}

enum SavedFrom {
  result
  activated
  share
}

enum ShareChannel {
  instagram_story
  tiktok
  pinterest
  wechat
  xiaohongshu
  copy_link
  download
  web_share
  other
}

model User {
  id           String   @id @default(uuid()) @db.Uuid
  platform     Platform
  email        String?  @unique
  phone        String?  @unique
  wechatOpenid String?  @unique
  displayName  String?
  avatarUrl    String?
  locale       String   @default("en")
  timezone     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  auraCards      AuraCard[]
  outfitUploads  OutfitUpload[]
  activations    AuraActivation[]
  savedCards     SavedCard[]
  shareEvents    ShareEvent[]
  analyticsEvents AnalyticsEvent[]

  @@map("users")
}

model AnonymousSession {
  id          String   @id @default(uuid()) @db.Uuid
  anonymousId String  @unique
  platform    Platform
  locale      String  @default("en")
  timezone    String?
  deviceInfo  Json?
  createdAt   DateTime @default(now())
  lastSeenAt  DateTime @default(now())

  @@index([platform])
  @@map("anonymous_sessions")
}

model OutfitUpload {
  id          String       @id @default(uuid()) @db.Uuid
  userId      String?      @db.Uuid
  anonymousId String?
  auraCardId  String?      @db.Uuid

  fileUrl     String
  fileKey     String?
  fileType    String?
  fileSize    Int?
  uploadStatus UploadStatus @default(uploaded)

  // 只记录穿搭氛围辅助，不做人脸、身体、颜值、缺陷评价
  styleNotes  Json?

  createdAt   DateTime @default(now())

  user      User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  auraCard  AuraCard? @relation(fields: [auraCardId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([anonymousId])
  @@index([auraCardId])
  @@map("outfit_uploads")
}

model DrawSession {
  id              String            @id @default(uuid()) @db.Uuid
  userId          String?           @db.Uuid
  anonymousId     String?
  selectedMood    AuraMood
  optionalContext AuraContext?
  outfitUploadId  String?           @db.Uuid
  drawSeed        String
  drawPosition    Int?
  status          DrawSessionStatus @default(started)
  selectedAt      DateTime?
  expiresAt       DateTime
  createdAt       DateTime          @default(now())

  @@index([anonymousId])
  @@index([userId])
  @@index([drawSeed])
  @@map("draw_sessions")
}

model GenerationJob {
  id              String           @id @default(uuid()) @db.Uuid
  userId          String?          @db.Uuid
  anonymousId     String?
  drawSessionId   String?          @db.Uuid

  selectedMood    AuraMood
  optionalContext AuraContext?
  outfitUploadId  String?          @db.Uuid
  drawPosition    Int?
  drawSeed        String?
  language        String           @default("en")

  inputPayload    Json
  promptVersion   String
  modelProvider   String
  modelName       String

  status          GenerationStatus @default(pending)
  resultCardId    String?          @db.Uuid
  errorMessage    String?

  startedAt       DateTime?
  finishedAt      DateTime?
  createdAt       DateTime         @default(now())

  resultCard      AuraCard?

  @@index([anonymousId])
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("generation_jobs")
}

model AuraCard {
  id              String    @id @default(uuid()) @db.Uuid
  userId          String?   @db.Uuid
  anonymousId     String?

  generationJobId String?   @unique @db.Uuid
  selectedMood    AuraMood
  optionalContext AuraContext?
  outfitUploadUrl String?
  language        String    @default("en")
  timezone        String?

  drawSeed        String?
  drawPosition    Int?
  drawRevealedAt  DateTime?

  auraName        String
  cardTitle       String?
  auraColor       String?
  luckyColors     Json      @default("[]")
  styleVibe       String
  energyMessage   String
  outfitEnergy    String?
  beautyCue       String?
  socialMove      String?
  miniRitual      String
  todayIntention  String
  luckyAnchorCandidates Json @default("[]")
  shareCaption    String?
  safetyDisclaimer String?

  templateId      String?
  imageUrl        String?
  shareImageUrl   String?

  status          AuraCardStatus @default(generated)
  isSaved         Boolean @default(false)
  isShared        Boolean @default(false)
  isActivated     Boolean @default(false)

  freePayload     Json?
  fullPayload     Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User?           @relation(fields: [userId], references: [id], onDelete: SetNull)
  generationJob   GenerationJob?  @relation(fields: [generationJobId], references: [id], onDelete: SetNull)
  outfitUploads   OutfitUpload[]
  activations     AuraActivation[]
  savedCards      SavedCard[]
  shareEvents     ShareEvent[]

  @@index([anonymousId])
  @@index([userId])
  @@index([selectedMood])
  @@index([optionalContext])
  @@index([isActivated])
  @@index([createdAt])
  @@map("aura_cards")
}

model AuraActivation {
  id              String           @id @default(uuid()) @db.Uuid
  auraCardId      String           @db.Uuid
  userId          String?          @db.Uuid
  anonymousId     String?

  anchorType      AnchorType
  anchorLabel     String
  anchorColor     String?
  sealDurationMs  Int              @default(3000)
  holdDurationMs  Int?
  sealCompleted   Boolean          @default(false)
  sealedAt        DateTime?

  intentionText   String?
  activatedUntil  DateTime?
  status          ActivationStatus @default(started)

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  auraCard        AuraCard @relation(fields: [auraCardId], references: [id], onDelete: Cascade)
  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([auraCardId])
  @@index([anonymousId])
  @@index([userId])
  @@index([status])
  @@map("aura_activations")
}

model SavedCard {
  id          String    @id @default(uuid()) @db.Uuid
  auraCardId  String    @db.Uuid
  userId      String?   @db.Uuid
  anonymousId String?
  savedFrom   SavedFrom
  createdAt   DateTime  @default(now())

  auraCard    AuraCard @relation(fields: [auraCardId], references: [id], onDelete: Cascade)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([auraCardId])
  @@index([anonymousId])
  @@index([userId])
  @@map("saved_cards")
}

model ShareEvent {
  id          String       @id @default(uuid()) @db.Uuid
  auraCardId  String       @db.Uuid
  userId      String?      @db.Uuid
  anonymousId String?
  channel     ShareChannel
  source      String?
  shareUrl    String?
  referralCode String?
  createdAt   DateTime     @default(now())

  auraCard    AuraCard @relation(fields: [auraCardId], references: [id], onDelete: Cascade)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([auraCardId])
  @@index([anonymousId])
  @@index([userId])
  @@index([channel])
  @@map("share_events")
}

model AnalyticsEvent {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String?  @db.Uuid
  anonymousId  String?

  eventName    String
  eventPayload Json
  platform     Platform
  pagePath     String?
  sessionId    String?
  requestId    String?

  createdAt    DateTime @default(now())

  user         User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([eventName])
  @@index([anonymousId])
  @@index([userId])
  @@index([createdAt])
  @@map("analytics_events")
}

model CardTemplate {
  id        String   @id
  name      String
  ratio     String   // 9:16 / 4:5 / 1:1
  theme     String
  config    Json
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("card_templates")
}

// P1 预留：不在 P0 页面中使用
model AuraReflection {
  id          String   @id @default(uuid()) @db.Uuid
  auraCardId  String   @db.Uuid
  userId      String?  @db.Uuid
  anonymousId String?
  accuracy    String
  appearedIn  Json     @default("[]")
  note        String?
  createdAt   DateTime @default(now())

  @@index([auraCardId])
  @@index([anonymousId])
  @@map("aura_reflections")
}
```

### 8.2 Seed 数据

`prisma/seed.ts` 必须插入 3 个默认卡片模板。

```ts
const templates = [
  {
    id: 'warm_gold_01',
    name: 'Warm Gold',
    ratio: '9:16',
    theme: 'ivory_blush_gold',
    config: {
      background: 'ivory_blush_gradient',
      accent: 'soft_gold',
      typography: 'elegant_serif_heading_sans_body',
    },
    isActive: true,
  },
  {
    id: 'moon_silver_01',
    name: 'Moon Silver',
    ratio: '9:16',
    theme: 'moon_silver_navy',
    config: {
      background: 'navy_moon_gradient',
      accent: 'silver',
    },
    isActive: true,
  },
  {
    id: 'rose_charm_01',
    name: 'Rose Charm',
    ratio: '9:16',
    theme: 'rose_champagne',
    config: {
      background: 'rose_champagne_gradient',
      accent: 'rose_gold',
    },
    isActive: true,
  },
];
```

---

## 9. API 设计

所有 API 使用：

```text
/api/v1
```

所有 JSON 响应统一：

成功：

```json
{
  "data": {}
}
```

失败：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body.",
    "details": {},
    "requestId": "req_xxx"
  }
}
```

### 9.1 通用请求字段

多数接口需要以下字段之一：

```json
{
  "anonymousId": "anon_abc123",
  "userId": null,
  "platform": "web"
}
```

P0 不强制登录，因此 `anonymousId` 必须支持。

### 9.2 生成匿名身份

#### POST `/api/v1/identity/anonymous`

请求：

```json
{
  "platform": "web",
  "locale": "en",
  "timezone": "Asia/Singapore",
  "deviceInfo": {
    "userAgent": "..."
  }
}
```

响应：

```json
{
  "data": {
    "anonymousId": "anon_abc123"
  }
}
```

规则：

- Web 首次访问时如 localStorage 没有 anonymousId，则调用；
- 小程序首次访问时如 storage 没有 anonymousId，则调用；
- P0 不要求微信登录；
- anonymousId 保存在本地。

### 9.3 获取今日已激活卡

#### GET `/api/v1/aura-cards/today?anonymousId=anon_abc123&timezone=Asia/Singapore`

响应：

```json
{
  "data": {
    "hasActiveCard": true,
    "cardId": "card_123",
    "auraName": "Quiet Power Bloom",
    "activatedAt": "2026-06-01T08:00:00.000Z"
  }
}
```

无激活卡：

```json
{
  "data": {
    "hasActiveCard": false
  }
}
```

### 9.4 上传 outfit

#### POST `/api/v1/uploads/outfit`

Content-Type：

```text
multipart/form-data
```

字段：

| 字段 | 必填 | 说明 |
|---|---:|---|
| `file` | 是 | 图片 |
| `anonymousId` | 是 | 匿名 ID |
| `platform` | 是 | web / wechat |

响应：

```json
{
  "data": {
    "uploadId": "upload_123",
    "fileUrl": "https://cdn.auracue.com/uploads/upload_123.jpg",
    "fileType": "image/jpeg",
    "fileSize": 123456
  }
}
```

错误：

```json
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Image must be smaller than 8MB."
  }
}
```

P0 实现：

- 开发环境可以保存到 `apps/web/public/uploads`；
- 生产环境接 R2/S3/Supabase Storage；
- 不做人体、脸、颜值评价；
- 可选：用轻量 prompt 或 image caption 提取 `styleNotes`，但 P0 不强制。

### 9.5 创建 Draw Session

#### POST `/api/v1/draw-sessions/start`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "selectedMood": "confident",
  "optionalContext": "work",
  "outfitUploadId": "upload_123"
}
```

响应：

```json
{
  "data": {
    "drawSessionId": "draw_123",
    "drawSeed": "seed_20260601_abcd",
    "expiresAt": "2026-06-01T09:00:00.000Z",
    "cards": [
      { "position": 1, "backTheme": "warm_gold_01" },
      { "position": 2, "backTheme": "moon_silver_01" },
      { "position": 3, "backTheme": "rose_charm_01" }
    ]
  }
}
```

规则：

- `selectedMood` 必填；
- `optionalContext` 可为 null 或 skip；
- session 60 分钟过期；
- drawSeed 后端生成。

### 9.6 生成 Aura Card

#### POST `/api/v1/aura-cards/generate`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "drawSessionId": "draw_123",
  "drawPosition": 2,
  "language": "en",
  "timezone": "Asia/Singapore"
}
```

响应可以是同步成功：

```json
{
  "data": {
    "jobId": "job_123",
    "status": "success",
    "cardId": "card_123"
  }
}
```

也可以是异步：

```json
{
  "data": {
    "jobId": "job_123",
    "status": "pending"
  }
}
```

P0 建议：

- 内部可以同步执行；
- 仍然创建 `generation_jobs`；
- 如果响应 pending，前端轮询任务状态；
- AI 失败时 fallback 到 deterministic mock generator。

### 9.7 查询生成任务

#### GET `/api/v1/generation-jobs/:jobId`

响应：

```json
{
  "data": {
    "jobId": "job_123",
    "status": "success",
    "cardId": "card_123",
    "errorMessage": null
  }
}
```

状态：

```text
pending
running
success
failed
timeout
```

### 9.8 获取 Aura Card

#### GET `/api/v1/aura-cards/:cardId`

响应：

```json
{
  "data": {
    "id": "card_123",
    "selectedMood": "confident",
    "optionalContext": "work",
    "auraName": "Quiet Power Bloom",
    "cardTitle": "Your Quiet Power Day",
    "auraColor": "Blush Pink",
    "luckyColors": ["Blush Pink", "Navy", "Gold"],
    "styleVibe": "Tailored & Confident",
    "energyMessage": "You don’t need to be loud today. Your calm presence already builds respect.",
    "outfitEnergy": "Choose one structured detail that makes you feel composed.",
    "beautyCue": "Keep one soft glow detail and one clean line.",
    "socialMove": "Lead with warmth, then let your clarity speak.",
    "miniRitual": "Touch one gold detail and take 3 deep breaths before you step out.",
    "todayIntention": "I move through today with quiet power.",
    "luckyAnchorCandidates": [
      {
        "type": "jewelry",
        "label": "Gold earrings",
        "reason": "A small gold detail helps you carry steady confidence."
      },
      {
        "type": "lucky_color",
        "label": "Blush pink detail",
        "reason": "A soft color keeps your energy open without losing boundaries."
      }
    ],
    "shareCaption": "Today’s aura: Quiet Power Bloom ✨",
    "safetyDisclaimer": "For reflection and fun. Not a guarantee or professional advice.",
    "isSaved": false,
    "isShared": false,
    "isActivated": false,
    "shareImageUrl": "https://cdn.auracue.com/cards/card_123_story.png",
    "createdAt": "2026-06-01T08:00:00.000Z"
  }
}
```

### 9.9 重新渲染分享图

#### POST `/api/v1/aura-cards/:cardId/render`

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
  "data": {
    "imageUrl": "https://cdn.auracue.com/cards/card_123_story.png"
  }
}
```

规则：

- 如果 `shareImageUrl` 不存在，结果页或分享页可调用；
- P0 固定 9:16；
- 默认模板为 `warm_gold_01`。

### 9.10 开始激活

#### POST `/api/v1/aura-cards/:cardId/activation/start`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "anchorType": "jewelry",
  "anchorLabel": "Gold earrings",
  "anchorColor": "Gold"
}
```

响应：

```json
{
  "data": {
    "activationId": "act_123",
    "status": "anchor_selected",
    "sealDurationMs": 3000
  }
}
```

规则：

- card 必须存在；
- anchorType 必须合法；
- 可以重复 start，但同一张卡若已有 activated，返回已有 activation；
- start 后 aura_cards.status 可设为 `activation_started`。

### 9.11 完成 Seal

#### POST `/api/v1/activations/:activationId/seal`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "holdDurationMs": 3140,
  "clientCompleted": true
}
```

响应：

```json
{
  "data": {
    "activationId": "act_123",
    "status": "activated",
    "sealedAt": "2026-06-01T08:10:00.000Z",
    "message": "Quiet Power Bloom is active for today.",
    "todayIntention": "I move through today with quiet power."
  }
}
```

规则：

- `holdDurationMs` 必须 >= 2800ms；
- `clientCompleted` 必须为 true；
- 后端将 activation:
  - `sealCompleted = true`
  - `sealedAt = now`
  - `status = activated`
- 同时更新 aura_cards:
  - `isActivated = true`
  - `status = activated`

错误：

```json
{
  "error": {
    "code": "HOLD_TOO_SHORT",
    "message": "Hold for 3 seconds to seal your aura."
  }
}
```

### 9.12 保存卡片

#### POST `/api/v1/aura-cards/:cardId/save`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "source": "activated"
}
```

响应：

```json
{
  "data": {
    "success": true,
    "savedId": "saved_123",
    "isSaved": true
  }
}
```

规则：

- 同一 anonymousId + cardId 重复保存不创建重复记录；
- aura_cards.is_saved = true；
- 记录 `save_card` 埋点。

### 9.13 记录分享

#### POST `/api/v1/aura-cards/:cardId/share`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "channel": "instagram_story",
  "source": "share_preview"
}
```

响应：

```json
{
  "data": {
    "success": true,
    "shareUrl": "https://auracue.com/share/card_123"
  }
}
```

规则：

- 记录 share_events；
- aura_cards.is_shared = true；
- 记录 analytics event。

### 9.14 记录埋点

#### POST `/api/v1/analytics/events`

请求：

```json
{
  "anonymousId": "anon_abc123",
  "platform": "web",
  "events": [
    {
      "eventName": "select_mood",
      "eventPayload": {
        "mood": "confident"
      },
      "pagePath": "/"
    }
  ]
}
```

响应：

```json
{
  "data": {
    "success": true,
    "inserted": 1
  }
}
```

规则：

- 支持单条或批量；
- eventPayload 必须是 JSON；
- 失败不阻塞用户主流程；
- 前端埋点失败只在 console warning。

---

## 10. AI 生成系统

### 10.1 输入

AI 生成必须基于结构化输入。

```ts
export interface AuraGenerationInput {
  selectedMood: AuraMood;
  optionalContext?: AuraContext | null;
  outfitStyleNotes?: unknown | null;
  drawSeed: string;
  drawPosition: 1 | 2 | 3;
  language: 'en';
  date: string;
  timezone?: string;
}
```

### 10.2 输出要求

AI 必须返回严格 JSON，不允许 Markdown。

```json
{
  "auraName": "Quiet Power Bloom",
  "cardTitle": "Your Quiet Power Day",
  "auraColor": "Blush Pink",
  "luckyColors": ["Blush Pink", "Navy", "Gold"],
  "styleVibe": "Tailored & Confident",
  "energyMessage": "You don’t need to be loud today. Your calm presence already builds respect.",
  "outfitEnergy": "Choose one structured detail that makes you feel composed.",
  "beautyCue": "Keep one soft glow detail and one clean line.",
  "socialMove": "Lead with warmth, then let your clarity speak.",
  "miniRitual": "Touch one gold detail and take 3 deep breaths before you step out.",
  "todayIntention": "I move through today with quiet power.",
  "luckyAnchorCandidates": [
    {
      "type": "jewelry",
      "label": "Gold earrings",
      "reason": "A small gold detail helps you carry steady confidence."
    }
  ],
  "shareCaption": "Today’s aura: Quiet Power Bloom ✨",
  "safetyDisclaimer": "For reflection and fun. Not a guarantee or professional advice."
}
```

### 10.3 System Prompt

放在：

```text
packages/prompt-core/src/prompts/aura-card-v1.ts
```

```text
You are AuraCue, a warm, elegant daily aura ritual generator.

Generate a light, positive, non-deterministic daily aura activation card.
The product is for fun, reflection, confidence, style energy, and tiny rituals before going out.

Hard rules:
- Return valid JSON only.
- Do not use Markdown.
- Do not promise guaranteed luck, love, money, health, success, or destiny changes.
- Do not make frightening or negative predictions.
- Do not tell the user something bad will happen.
- Do not comment on body flaws, weight, face shape, attractiveness, skin flaws, or physical defects.
- Do not provide medical, mental health, legal, or financial advice.
- Do not diagnose the user.
- Do not instruct risky behavior.
- Keep all guidance light, positive, stylish, and actionable.
- If outfit information is provided, only describe style mood, color, texture, silhouette, or accessory energy.
- Avoid saying the user must buy anything.
- Avoid deterministic claims like “this will make someone fall in love with you.”
- Prefer soft language like “supports,” “invites,” “helps you carry,” “sets the tone.”
```

### 10.4 User Prompt 模板

```text
Create today's AuraCue daily aura card.

Input:
- Mood: {{selectedMood}}
- Optional context: {{optionalContext}}
- Outfit style notes: {{outfitStyleNotes}}
- Draw seed: {{drawSeed}}
- Draw position: {{drawPosition}}
- Date: {{date}}
- Language: English

Output fields:
- auraName: 2-4 words, elegant, memorable
- cardTitle: short title for today
- auraColor: one primary aura color
- luckyColors: exactly 3 colors
- styleVibe: 2-5 words
- energyMessage: 1-2 sentences, emotionally specific, not generic
- outfitEnergy: practical style suggestion, no body judgment
- beautyCue: simple beauty/accessory cue, no appearance criticism
- socialMove: one behavioral cue for today
- miniRitual: one action under 60 seconds
- todayIntention: first-person affirmation, grounded and not exaggerated
- luckyAnchorCandidates: 3 items, each with type, label, reason
- shareCaption: short social caption
- safetyDisclaimer: "For reflection and fun. Not a guarantee or professional advice."

Return JSON only.
```

### 10.5 Zod 校验

后端必须校验 AI 输出。

```ts
import { z } from 'zod';

export const AnchorCandidateSchema = z.object({
  type: z.enum([
    'lucky_color',
    'jewelry',
    'crystal',
    'lipstick',
    'perfume',
    'outfit_detail',
    'ring_necklace',
    'bag_scarf',
    'other',
  ]),
  label: z.string().min(1).max(80),
  reason: z.string().min(1).max(240).optional(),
  color: z.string().max(40).optional(),
});

export const AuraCardAIResultSchema = z.object({
  auraName: z.string().min(2).max(60),
  cardTitle: z.string().min(2).max(80),
  auraColor: z.string().min(2).max(40),
  luckyColors: z.array(z.string().min(2).max(40)).min(3).max(3),
  styleVibe: z.string().min(2).max(80),
  energyMessage: z.string().min(20).max(360),
  outfitEnergy: z.string().min(10).max(300),
  beautyCue: z.string().min(10).max(240),
  socialMove: z.string().min(10).max(240),
  miniRitual: z.string().min(10).max(240),
  todayIntention: z.string().min(10).max(180),
  luckyAnchorCandidates: z.array(AnchorCandidateSchema).min(3).max(5),
  shareCaption: z.string().min(2).max(120),
  safetyDisclaimer: z.string().min(10).max(160),
});
```

### 10.6 Mock AI Provider

P0 必须支持无 AI Key 的开发模式。

环境变量：

```env
AI_PROVIDER=mock
```

Mock 规则：

- 根据 mood + context + drawPosition 确定 auraName；
- 从固定映射库选 3 个 lucky colors；
- 生成确定性文案；
- 仍然返回完整 AI JSON；
- 用于本地开发、CI、演示。

### 10.7 Mood 映射库

```ts
export const MOOD_PRESETS = {
  calm: {
    auraNames: ['Quiet Power Bloom', 'Soft Center Glow', 'Still Water Charm'],
    colors: ['Soft Blue', 'Cream', 'Silver'],
    vibe: 'Peaceful & Centered',
  },
  confident: {
    auraNames: ['Golden Command', 'Bright Spine Energy', 'Quiet Power Bloom'],
    colors: ['Gold', 'Ivory', 'Navy'],
    vibe: 'Strong & Unstoppable',
  },
  romantic: {
    auraNames: ['Rose Heart Glow', 'Soft Venus Bloom', 'Open Heart Aura'],
    colors: ['Rose Pink', 'Champagne', 'Cream'],
    vibe: 'Open Heart & Soft Glow',
  },
  magnetic: {
    auraNames: ['Magnetic Rose', 'Velvet Pull', 'Attracting Glow'],
    colors: ['Burgundy', 'Soft Gold', 'Black'],
    vibe: 'Attract, Don’t Chase',
  },
  protected: {
    auraNames: ['Silver Boundary', 'Cloak of Calm', 'Guarded Glow'],
    colors: ['Black', 'Deep Green', 'Silver'],
    vibe: 'Safe & Supported',
  },
  creative: {
    auraNames: ['Spark Muse', 'Bright Idea Aura', 'Wild Light'],
    colors: ['Lilac', 'Pearl', 'Citrus'],
    vibe: 'Inspired & Expressive',
  },
  lucky: {
    auraNames: ['Open Door Luck', 'Golden Chance', 'Blessing Current'],
    colors: ['Gold', 'White', 'Mint'],
    vibe: 'Doors Open',
  },
  mysterious: {
    auraNames: ['Moonlit Secret', 'Intuitive Veil', 'Velvet Moon Aura'],
    colors: ['Deep Purple', 'Navy', 'Silver'],
    vibe: 'Intuitive & Enigmatic',
  },
} as const;
```

---

## 11. Card Renderer

### 11.1 目标

AuraCue 的传播核心是一张用户愿意保存和分享的 9:16 美学气场卡。

### 11.2 P0 渲染方案

P0 不调用 AI 图片生成。

推荐：

```text
AuraCard JSON
  ↓
SVG/HTML 模板
  ↓
server-side render to PNG
  ↓
上传到 Object Storage
  ↓
返回 shareImageUrl
```

P0 可用方案：

1. `satori + resvg` 渲染 PNG；
2. `sharp` 组合 SVG；
3. 本地开发保存到 `/public/generated-cards`；
4. 生产保存到 R2/S3/Supabase Storage。

### 11.3 分享图尺寸

```text
1080 x 1920
9:16
PNG
```

### 11.4 分享图内容

必须包含：

```text
AuraCue
Today’s Aura
Aura Name
Lucky Colors
Style Vibe
Energy Message
Mini Ritual
Date
```

不要包含：

- 长报告；
- 过多小字；
- 付费提示；
- 恐吓性文字；
- 绝对承诺；
- 身体 / 外貌评价。

### 11.5 默认模板

```json
{
  "templateId": "warm_gold_01",
  "ratio": "9:16",
  "background": "ivory_blush_gradient",
  "accent": "soft_gold",
  "brand": "AuraCue"
}
```

### 11.6 Web 页面中的卡片组件

组件：

```text
AuraCardPreview
AuraStoryImage
```

展示：

- Web 结果页可用 CSS 卡片；
- 分享页展示 PNG；
- 小程序结果页可以展示同一 PNG，也可以用组件模拟。

---

## 12. 前端实现规格

### 12.1 Web App 技术要求

```text
Next.js App Router
TypeScript
Tailwind CSS
React Server Components + Client Components
Zustand 或 React Context 管理 create draft
fetch API 调用后端
```

### 12.2 Web 关键目录

```text
apps/web/
├── app/
│   ├── page.tsx
│   ├── create/context/page.tsx
│   ├── create/upload/page.tsx
│   ├── create/draw/page.tsx
│   ├── result/[id]/page.tsx
│   ├── activate/[id]/page.tsx
│   ├── activated/[id]/page.tsx
│   ├── share/[id]/page.tsx
│   └── saved/[id]/page.tsx
├── components/
│   ├── layout/AppShell.tsx
│   ├── aura/AuraCardPreview.tsx
│   ├── aura/AuraStoryImage.tsx
│   ├── create/MoodGrid.tsx
│   ├── create/ContextChips.tsx
│   ├── create/OutfitUploader.tsx
│   ├── draw/DrawCardDeck.tsx
│   ├── activation/AnchorSelector.tsx
│   ├── activation/HoldToSealButton.tsx
│   ├── feedback/SaveSuccessModal.tsx
│   └── ui/...
├── lib/
│   ├── api-client.ts
│   ├── anonymous-id.ts
│   ├── create-draft-store.ts
│   ├── analytics.ts
│   └── download.ts
└── server/
    ├── services/
    ├── repositories/
    ├── validators/
    ├── ai/
    └── renderer/
```

### 12.3 前端 Draft Store

Web localStorage 和小程序 storage 都保存临时生成草稿。

```ts
export interface CreateAuraDraft {
  anonymousId: string;
  selectedMood?: AuraMood;
  optionalContext?: AuraContext | null;
  outfitUploadId?: string | null;
  outfitUploadUrl?: string | null;
  drawSessionId?: string | null;
  drawSeed?: string | null;
  drawPosition?: 1 | 2 | 3 | null;
  lastCardId?: string | null;
}
```

### 12.4 Web API Client

```ts
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message ?? 'Request failed');
  }

  return json.data as T;
}
```

### 12.5 HoldToSealButton 组件要求

组件必须支持：

- mouse；
- touch；
- disabled；
- progress；
- cancel；
- complete；
- vibrate；
- 防重复提交。

```tsx
interface HoldToSealButtonProps {
  durationMs?: number;
  disabled?: boolean;
  onHoldStart?: () => void;
  onHoldCancel?: (holdDurationMs: number) => void;
  onComplete: (holdDurationMs: number) => Promise<void> | void;
}
```

验收：

- 按住满 3 秒才触发 `onComplete`；
- 提前松手触发 `onHoldCancel`；
- complete 后不能重复触发；
- touch 和 mouse 都可用。

---

## 13. 微信小程序适配规格

### 13.1 技术要求

```text
Taro + React + TypeScript
小程序端只做页面和 API 调用
不要复制后端逻辑
不要在小程序硬编码 Prompt
不要在小程序硬编码 AI 结果
```

### 13.2 API Base URL

`.env`：

```env
TARO_APP_API_BASE_URL=https://api.auracue.com
```

开发环境可指向本地 tunnel 或测试域名。

### 13.3 小程序匿名 ID

- 首次打开检查 storage；
- 没有则调用 `/api/v1/identity/anonymous`；
- 保存到 `Taro.setStorageSync('anonymousId', value)`；
- P0 不强制微信登录。

### 13.4 小程序上传

使用：

```ts
Taro.chooseMedia({
  count: 1,
  mediaType: ['image'],
  sourceType: ['album', 'camera'],
  sizeType: ['compressed'],
});
```

上传使用：

```ts
Taro.uploadFile({
  url: `${API_BASE_URL}/api/v1/uploads/outfit`,
  filePath,
  name: 'file',
  formData: {
    anonymousId,
    platform: 'wechat',
  },
});
```

### 13.5 小程序保存图片

使用：

```ts
Taro.saveImageToPhotosAlbum({
  filePath,
});
```

注意：

- 如果是远程图片，需要先 `Taro.downloadFile`；
- 无权限时提示用户打开相册权限；
- 保存成功后调用 save/share 相关接口。

### 13.6 小程序分享

页面实现：

```ts
useShareAppMessage(() => ({
  title: 'I activated my aura today ✨',
  path: `/pages/share/index?id=${cardId}`,
  imageUrl: shareImageUrl,
}));
```

### 13.7 小程序与 Web 的差异

| 能力 | Web | 小程序 |
|---|---|---|
| 下载图片 | `<a download>` / blob | `saveImageToPhotosAlbum` |
| 分享 | Web Share API / copy link | `onShareAppMessage` |
| 上传 | input file / drag | chooseMedia |
| 存储 | localStorage | Taro storage |
| 路由参数 | `/result/[id]` | `pages/result/index?id=` |
| 震动 | `navigator.vibrate` | `Taro.vibrateShort` |

---

## 14. 视觉设计规格

### 14.1 视觉关键词

```text
神秘但不低级
女性化但不幼稚
温暖、精致、有仪式感
适合 Instagram / Pinterest / TikTok / 小红书
不像传统算命网站
不像廉价星座 App
```

### 14.2 Design Tokens

放在：

```text
packages/ui-tokens/src/index.ts
```

```ts
export const colors = {
  ivory: '#FFF9F2',
  warmWhite: '#FFFDF8',
  ink: '#241B18',
  muted: '#7A6A61',
  softGold: '#D9B66F',
  champagne: '#F3DEB3',
  blush: '#F7C9D2',
  rose: '#D98695',
  navy: '#1E2B45',
  moonSilver: '#D7DCE8',
  deepPurple: '#332742',
  mint: '#CDEBD8',
  danger: '#B42318',
};

export const radius = {
  sm: '12px',
  md: '18px',
  lg: '24px',
  xl: '32px',
  full: '999px',
};

export const spacing = {
  pageX: '20px',
  pageY: '24px',
  section: '28px',
};

export const shadow = {
  card: '0 18px 60px rgba(36, 27, 24, 0.12)',
  glow: '0 0 40px rgba(217, 182, 111, 0.28)',
};
```

### 14.3 UI 原则

1. 每一屏只完成一个动作；
2. CTA 明确；
3. 卡片是视觉中心；
4. 文案短，但结果要具体；
5. 不堆功能；
6. 不用恐吓式玄学；
7. 重点呈现 mood、lucky color、ritual、anchor；
8. 保持 mobile-first。

---

## 15. 埋点事件

### 15.1 P0 必须埋点

| 事件名 | 触发时机 | 必要 payload |
|---|---|---|
| `page_view_home` | 进入首页 | anonymousId, platform |
| `select_mood` | 选择 mood | mood |
| `click_start_card` | 点击开始 | mood |
| `page_view_context` | 进入 context | mood |
| `context_selected` | 选择 context | mood, context |
| `context_skipped` | 跳过 context | mood |
| `page_view_upload` | 进入上传页 | mood, context |
| `outfit_upload_started` | 开始上传 | platform |
| `outfit_upload_success` | 上传成功 | uploadId, fileSize |
| `outfit_upload_failed` | 上传失败 | reason |
| `outfit_upload_skipped` | 跳过上传 | mood, context |
| `draw_page_view` | 进入抽卡页 | mood, context, hasUpload |
| `draw_session_started` | 创建 draw session | drawSessionId |
| `draw_card_selected` | 选择卡 | drawPosition, drawSeed |
| `generation_started` | 开始生成 | jobId |
| `generation_success` | 生成成功 | jobId, cardId |
| `generation_failed` | 生成失败 | jobId, reason |
| `view_result` | 查看结果页 | cardId |
| `click_activate_aura` | 点击激活 | cardId |
| `activation_page_view` | 进入激活页 | cardId |
| `activation_anchor_selected` | 选择锚点 | cardId, anchorType |
| `activation_started` | start 成功 | cardId, activationId |
| `activation_hold_started` | 开始长按 | activationId |
| `activation_hold_cancelled` | 长按取消 | activationId, holdDurationMs |
| `activation_hold_completed` | 长按完成 | activationId, holdDurationMs |
| `aura_activated` | 激活成功 | cardId, activationId |
| `save_card` | 保存卡片 | cardId, source |
| `share_preview_view` | 查看分享页 | cardId |
| `share_card` | 分享 | cardId, channel |
| `save_image` | 保存图片 | cardId, platform |
| `copy_share_link` | 复制链接 | cardId |
| `return_next_day` | 次日回访 | anonymousId |

### 15.2 指标目标

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

## 16. 安全与内容边界

### 16.1 严禁内容

AI 和前端文案严禁：

- 保证改运；
- 保证脱单；
- 保证面试成功；
- 保证发财；
- 说用户今天会倒霉；
- 说用户不适合出门；
- 外貌缺陷评价；
- 身材、体重、脸型评价；
- 医疗建议；
- 心理诊断；
- 危机干预；
- 恐吓用户；
- 强制用户购买某物。

### 16.2 允许内容

可以输出：

- 幸运色；
- 风格氛围；
- 轻量穿搭建议；
- 配饰建议；
- 香氛 / 唇色作为气场锚点；
- 社交动作；
- 30–60 秒小仪式；
- 今日 intention；
- 正向情绪提示。

### 16.3 Outfit 上传边界

如果用户上传穿搭图片：

允许：

```text
This look carries a soft, calm, polished energy.
A gold detail would make the aura feel more grounded.
```

禁止：

```text
Your body shape is...
Your face looks...
This makes you look fat/thin/old...
Your skin/face/body flaw...
```

---

## 17. 错误处理与兜底

### 17.1 API 错误码

| code | 含义 | 前端处理 |
|---|---|---|
| `VALIDATION_ERROR` | 请求参数错误 | 展示友好提示 |
| `NOT_FOUND` | 资源不存在 | 返回首页 |
| `FILE_TOO_LARGE` | 文件过大 | 提示压缩或换图 |
| `UNSUPPORTED_FILE_TYPE` | 格式不支持 | 提示 jpg/png/webp |
| `DRAW_SESSION_EXPIRED` | 抽卡 session 过期 | 重新进入 draw |
| `GENERATION_FAILED` | 生成失败 | Retry |
| `AI_INVALID_JSON` | AI 输出格式错误 | 后端重试/fallback |
| `HOLD_TOO_SHORT` | 长按不足 | 继续长按 |
| `ACTIVATION_ALREADY_COMPLETED` | 已激活 | 跳成功页 |
| `RATE_LIMITED` | 请求过快 | 稍后再试 |

### 17.2 AI 兜底规则

当真实 AI 调用失败：

1. 后端重试 1 次；
2. 若仍失败，使用 mock generator；
3. mock generator 结果必须完整入库；
4. 前端不需要知道是否 fallback；
5. analytics 记录 `generation_fallback_used`。

### 17.3 分享图兜底

当 PNG 渲染失败：

1. 前端仍可展示 CSS 卡片；
2. 分享页显示 `Generate Image Again`；
3. 后端可重新 render；
4. 若仍失败，允许用户截图；
5. analytics 记录 `render_failed`。

---

## 18. 环境变量

`.env.example`

```env
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
APP_DEFAULT_LOCALE=en

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auracue

# AI
AI_PROVIDER=mock
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
PROMPT_VERSION=aura-card-v1

# Storage
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_GENERATED_CARD_DIR=public/generated-cards
PUBLIC_STORAGE_BASE_URL=http://localhost:3000

# R2/S3 optional
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=

# Security
API_RATE_LIMIT_PER_MINUTE=30
```

微信小程序：

```env
TARO_APP_API_BASE_URL=https://your-api-domain.com
```

---

## 19. 开发任务拆解

### Task 1：初始化 Monorepo

交付：

- pnpm workspace；
- apps/web；
- apps/wechat-mini；
- packages/shared-types；
- packages/shared-constants；
- packages/ui-tokens；
- packages/prompt-core；
- prisma；
- .env.example。

验收：

- `pnpm install` 成功；
- `pnpm dev:web` 启动；
- `pnpm db:migrate` 可运行。

### Task 2：实现 Prisma Schema 与 Seed

交付：

- schema.prisma；
- seed.ts；
- Prisma Client；
- DB migration。

验收：

- 表创建成功；
- card_templates 有 3 条默认模板；
- 本地数据库可写入 aura_cards。

### Task 3：实现后端基础设施

交付：

- prisma client；
- error handler；
- request id；
- zod validators；
- api response helper；
- analytics service；
- anonymous identity service。

验收：

- `/api/v1/health` 正常；
- `/api/v1/identity/anonymous` 正常；
- 错误格式统一。

### Task 4：实现 Upload Service

交付：

- `/api/v1/uploads/outfit`；
- 文件校验；
- 本地存储；
- outfit_uploads 入库。

验收：

- Web 可上传图片；
- 小程序可上传图片；
- >8MB 拒绝；
- 非图片拒绝；
- 失败不阻塞后续。

### Task 5：实现 Draw Service

交付：

- `/api/v1/draw-sessions/start`；
- draw_seed 生成；
- draw_sessions 入库；
- session 过期时间。

验收：

- 返回 3 张卡配置；
- draw_seed 唯一；
- selectedMood 必填。

### Task 6：实现 AI / Mock Generator

交付：

- Prompt 模板；
- Mock provider；
- Real provider adapter；
- Zod 校验；
- fallback 机制。

验收：

- `AI_PROVIDER=mock` 可生成完整 JSON；
- AI JSON 不合法时 fallback；
- 生成结果符合安全边界。

### Task 7：实现 Aura Card Generate API

交付：

- `/api/v1/aura-cards/generate`；
- generation_jobs 入库；
- aura_cards 入库；
- draw session 更新；
- 自动 render 分享图。

验收：

- 用户选卡后可生成 card；
- resultCardId 写入 job；
- card 可通过 GET 访问；
- 重复点击不会创建多张重复卡。

### Task 8：实现 Card Renderer

交付：

- SVG/HTML 模板；
- 1080x1920 PNG；
- 本地保存；
- shareImageUrl 写回 aura_cards；
- `/render` endpoint。

验收：

- 每张 card 有分享图；
- 分享图包含正确字段；
- 分享图可在 Web 和小程序访问。

### Task 9：实现 Activation API

交付：

- `/api/v1/aura-cards/:cardId/activation/start`；
- `/api/v1/activations/:activationId/seal`；
- aura_activations 入库；
- aura_cards 更新 activated。

验收：

- 选 anchor 创建 activation；
- 长按满 3 秒才能 seal；
- 状态正确更新；
- 重复 seal 幂等。

### Task 10：实现 Save / Share API

交付：

- `/api/v1/aura-cards/:cardId/save`；
- `/api/v1/aura-cards/:cardId/share`；
- saved_cards；
- share_events；
- aura_cards isSaved/isShared 更新。

验收：

- 保存幂等；
- 分享记录入库；
- copy/download/share 都能记录 channel。

### Task 11：实现 Web 首页与创建流程

交付：

- `/`；
- `/create/context`；
- `/create/upload`；
- `/create/draw`；
- draft store；
- analytics。

验收：

- mood → context → upload → draw 跑通；
- Skip 可用；
- 页面移动端适配。

### Task 12：实现 Web 结果与激活流程

交付：

- `/result/[id]`；
- `/activate/[id]`；
- HoldToSealButton；
- `/activated/[id]`；
- SaveSuccessModal。

验收：

- 结果页展示字段；
- 激活流程完整；
- 长按中断不激活；
- 激活成功跳成功页。

### Task 13：实现 Web 分享流程

交付：

- `/share/[id]`；
- 图片展示；
- Save Image；
- Web Share；
- Copy Link。

验收：

- 图片可下载；
- 链接可复制；
- 分享事件记录。

### Task 14：实现微信小程序 P0 页面

交付：

- index；
- context；
- upload；
- draw；
- result；
- activate；
- activated；
- share；
- saved/modal；
- 小程序 API client；
- 小程序 storage draft。

验收：

- 小程序跑通同样流程；
- 上传可用；
- 保存图片可用；
- 分享给好友可用；
- 所有业务数据走同一套 API。

### Task 15：端到端验收

交付：

- Web happy path；
- Web skip upload path；
- Web upload failure path；
- Web activation cancel path；
- 小程序 happy path；
- API integration test；
- DB write verification；
- analytics verification。

验收：

- P0 全流程可用；
- 不强制登录；
- 不强制上传；
- 生成、激活、保存、分享全部可完成。

---

## 20. 验收标准

### 20.1 产品验收

1. 用户可在 30 秒内从 mood 选择走到结果页；
2. 用户可完成抽卡翻牌；
3. 用户可获得稳定 Aura Card；
4. 用户可选择幸运锚点；
5. 用户可长按 3 秒 Seal Aura；
6. 激活成功后明确显示 `Aura Activated`；
7. 用户可保存卡片；
8. 用户可生成并查看 9:16 分享图；
9. 用户可分享或复制链接；
10. 全流程不强制登录；
11. 全流程不强制上传图片；
12. 页面没有保证改运、保证恋爱、保证成功等绝对承诺；
13. 页面没有外貌焦虑和身体评价；
14. Web 和小程序体验主线一致。

### 20.2 技术验收

1. Web 和小程序都调用统一后端 API；
2. AI 输出为稳定 JSON；
3. Prompt 不写死在前端；
4. `aura_cards` 正常写入；
5. `generation_jobs` 正常写入；
6. `aura_activations` 正常写入；
7. `saved_cards` 正常写入；
8. `share_events` 正常写入；
9. `analytics_events` 正常写入；
10. 长按封存支持成功、取消、中断状态；
11. 分享图渲染稳定；
12. 匿名用户可完成完整 P0；
13. 错误状态可重试；
14. 上传失败不阻塞生成；
15. API 错误格式统一；
16. Mock AI 模式可跑通；
17. 本地开发无外部 AI Key 也可完成演示。

### 20.3 数据验收

至少能统计：

- 首页访问量；
- mood 选择率；
- context 选择 / 跳过率；
- upload 成功 / 跳过率；
- draw 完成率；
- generation 成功率；
- result view；
- activate click；
- anchor selection；
- hold completion；
- aura activated；
- save rate；
- share rate；
- copy link；
- next day return。

---

## 21. P1 / P2 预留但不开发

### 21.1 P1

可以在 P0 验证后开发：

- Evening Reflection；
- 7-Day Trend；
- History；
- Account；
- Premium Templates；
- 星座 / 生日个性化；
- 每日提醒；
- 关键场景卡；
- 更完整 Aura Profile。

### 21.2 P2

- 真实订阅；
- Stripe / Paddle；
- 微信支付；
- 高级模板包；
- Shop Your Aura；
- 联盟商品；
- 多语言；
- Referral growth loop；
- React Native / Expo App。

### 21.3 不要太早做

- 完整衣橱管理；
- 商品电商闭环；
- 真人塔罗；
- 复杂社区；
- 重关系咨询；
- AI 陪聊伴侣；
- 复杂匹配和社交关系链。

---

## 22. 最终 Codex 开发指令

请按照以下顺序实现：

```text
1. 建立 monorepo 和共享类型
2. 建立 Prisma schema 和 seed
3. 实现统一 API helpers 和 anonymous identity
4. 实现 upload / draw / generate / card / activation / save / share / analytics API
5. 实现 mock AI provider 和 prompt-core
6. 实现 card renderer
7. 实现 Web P0 全页面
8. 实现微信小程序 P0 全页面
9. 接入全流程埋点
10. 完成端到端验收
```

实现时必须遵守：

```text
P0 不做 App。
P0 不做真实支付。
P0 不做完整账号。
P0 不做 History Tab。
P0 不做 Evening Reflection。
P0 不做 7-Day Trend。
P0 不做 Shop Your Aura。
P0 不强制上传图片。
P0 不强制登录。
P0 不允许身体/脸/外貌缺陷评价。
P0 不允许保证改运、保证恋爱、保证成功。
```

最终交付必须满足：

```text
H5/Web App 可完整跑通。
微信小程序可完整跑通。
两端调用同一套 API。
匿名用户可生成、激活、保存、分享。
AI 生成可用 mock fallback。
分享图可稳定生成。
数据库和埋点完整写入。
```

---

## 23. 最终一句话

**AuraCue P0 的核心不是“抽到什么卡”，而是让用户完成一次可感知、可携带、可保存、可分享的今日气场激活仪式。**

最终产品体验必须围绕：

```text
Pick a mood.
Draw your card.
Wear your lucky color.
Choose your anchor.
Hold to seal.
Carry today’s aura.
```
