# AuraCue Web-First Full Development Spec v1.0

> 生成日期：2026-06-01  
> 项目根目录：`D:\lyh\agent\agent-frame\AuraCue`  
> 唯一产品源头：`docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`  
> 当前策略：**Web/H5 做主工程，小程序做验证入口；后端统一，前端分端适配。**

## 0. 目标

这份文档用于指导 AuraCue P0 的完整软件开发全过程。按本文执行后，应能一次性完成：

- H5/Web App 主流程完整可用。
- 微信小程序后续可接同一套 API 做轻量验证入口。
- 后端、数据库、AI 生成、分享图渲染、埋点统一。
- 所有页面和功能均有自动化测试。
- 接口测试、页面测试、前端模拟点击测试、端到端测试、数据写入验证和最终门禁齐全。

本文不只是任务清单，而是开发契约。后续实现、测试、验收、报告都应以本文为准。

## 1. 顶层架构原则

### 1.1 产品主次

| 层级 | 定位 | 说明 |
| --- | --- | --- |
| Web/H5 App | 主产品、主工程、主验收面 | 优先开发完整 P0，承接海外和链接流量，做分享、转化、A/B 和后续支付能力基础。 |
| 微信小程序 | 国内轻量验证入口 | 不重复业务逻辑，只调用统一 API，验证 UI、保存、分享和仪式感。 |
| 后端 API | 统一核心资产 | Web 与小程序共用同一套 API、数据库、AI、卡片渲染和埋点。 |
| 数据库 | 唯一业务事实源 | PostgreSQL + Prisma，前端不保存核心业务数据。 |

### 1.2 不允许的方向

- 不允许 Web 和小程序各写一套业务逻辑。
- 不允许前端直接写 Prompt 或直接调用 AI provider。
- 不允许小程序保存核心业务数据。
- 不允许为了小程序先行而牺牲 Web 主流程架构。
- 不允许在 P0 主线继续推进 Paywall、真实支付、微信支付、History、7-Day Trend、Evening Reflection、Shop Your Aura。
- 不允许外貌评价、身体评价、保证改运、保证恋爱、保证成功。

### 1.3 Web 先行的完成定义

Web/H5 P0 完成必须满足：

```text
Mood
  -> Context
  -> Optional Outfit Upload or Skip
  -> Draw and Reveal
  -> AI or Mock Aura Card generation
  -> Daily Aura Card Result
  -> Activate Today’s Aura
  -> Select Lucky Anchor
  -> Hold 3 seconds to Seal
  -> Aura Activated
  -> Save Card / Share Story / Copy Link / Download Image
```

任何缺失上述主链节点的状态都不能声称 P0 完成。

## 2. 当前仓库缺口

### 2.1 已有资产

| 资产 | 当前状态 | 可复用方式 |
| --- | --- | --- |
| `apps/api` | 有本地 Node mock API | 仅可复用 AI fallback、mock server 思路；API 路径和数据模型需要重建为 `/api/v1/*`。 |
| `apps/wechat-mini` | 有旧版小程序页面 | 可作为后续适配参考；不作为 Web v1.0 主线来源。 |
| `packages/prompt-core` | 有本地生成器和安全拦截 | 需要改造为 mood/context/upload/draw/activation 输出。 |
| `packages/card-renderer` | 有本地分享图元数据渲染 | 需要升级为 1080x1920 PNG 或稳定 SVG/PNG 渲染。 |
| `packages/analytics-events` | 有事件契约雏形 | 需要覆盖 v1.0 全部埋点事件。 |
| `packages/ui-tokens` | 有 token 包 | 可作为 Web 视觉基础。 |
| `docs/UI/小程序` | 有 20 张顶层小程序参考图 | 可作为视觉方向；Web 不应被小程序路由绑定。 |

### 2.2 必须补齐

| 缺口 | 严重性 | 说明 |
| --- | --- | --- |
| `apps/web` 不存在 | P0 blocker | 最新 PRD 要 Web/H5 主工程。 |
| `prisma/schema.prisma` 不存在 | P0 blocker | 需要 PostgreSQL + Prisma 作为唯一业务事实源。 |
| `/api/v1/*` 不存在 | P0 blocker | 当前旧 API 仍是 generation/cards/unlock/payment/invite。 |
| Draw Session 模型缺失 | P0 blocker | 抽卡三选一必须后端生成 drawSeed 并记录选择。 |
| Activation/Seal 模型缺失 | P0 blocker | AuraCue v1.0 核心是激活仪式，不是解锁付费。 |
| Web 页面缺失 | P0 blocker | `/`, `/create/context`, `/create/upload`, `/create/draw`, `/result/[id]`, `/activate/[id]`, `/activated/[id]`, `/share/[id]`, `/saved/[id]`。 |
| 上传服务缺失 | P0 blocker | Outfit upload 可选，但必须支持失败可跳过。 |
| 真实分享图渲染缺失 | P0 blocker | 需要稳定 9:16 分享图。 |
| Web 自动化测试缺失 | P0 blocker | 需要组件、页面、接口、E2E、点击流、数据读回。 |
| 最终 gate 缺失 | P0 blocker | 需要一个命令能决定 PASS/REPAIR_REQUIRED。 |

### 2.3 需要下线或降级到 P1 的旧资产

旧版小程序中的 unlock/payment/invite 逻辑不是 v1.0 P0 主线：

- `apps/wechat-mini/src/pages/unlock/**`
- `apps/wechat-mini/src/pages/invite/**`
- mock payment API 和测试
- entitlement/paywall 作为主路径的测试和验收文档

处理规则：

- 不在 Web v1.0 P0 中实现这些页面。
- 数据库可预留支付/订阅表，但不进入主线。
- 测试矩阵中标为 P1 或 legacy，不允许阻塞 Web P0。

## 3. 目标目录结构

最终推荐结构：

```text
AuraCue/
  apps/
    web/
      app/
        page.tsx
        create/
          context/page.tsx
          upload/page.tsx
          draw/page.tsx
        result/[id]/page.tsx
        activate/[id]/page.tsx
        activated/[id]/page.tsx
        share/[id]/page.tsx
        saved/[id]/page.tsx
        api/v1/...
      components/
      lib/
      server/
        ai/
        analytics/
        renderer/
        repositories/
        services/
        storage/
        validators/
      tests/
        api/
        pages/
        unit/
      e2e/
    wechat-mini/
      src/
        pages/
        services/
        store/
    api/
      legacy-local-mock/
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
    test/
  docs/
    AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md
    AuraCue_Web_First_Full_Development_Spec_v1.0.md
    AUTO_EXECUTE_DELIVERY_REPORT.md
    auto-execute/
```

## 4. 技术栈

### 4.1 Web 主工程

| 项 | 决策 |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + `packages/ui-tokens` |
| UI state | React state + lightweight draft store wrapper |
| Draft persistence | `localStorage` only for non-core draft: mood, context, uploadId, drawSessionId |
| Server state | PostgreSQL through Prisma |
| API | Next.js Route Handlers under `apps/web/app/api/v1` |
| Validation | Zod |
| Tests | Vitest, React Testing Library, Playwright |
| Visual smoke | Playwright screenshots on mobile viewport |

### 4.2 Unified backend

| 项 | 决策 |
| --- | --- |
| ORM | Prisma |
| DB | PostgreSQL |
| AI | mock provider by default, OpenAI-compatible provider adapter optional |
| Renderer | server-side SVG/HTML to PNG, 1080x1920 |
| Storage | local `public/uploads` and `public/generated-cards` in dev; R2/S3 adapter later |
| Analytics | `/api/v1/analytics/events` writes to DB |
| Identity | anonymous identity, no forced login |

### 4.3 小程序适配原则

小程序不在本阶段作为实现主线，但 Web 架构必须支持它：

- 小程序调用同一套 `/api/v1/*`。
- 小程序用 `TARO_APP_API_BASE_URL` 指向 Web/API 域名。
- 小程序只保留 platform adapters：storage、upload、save image、share、vibrate。
- 小程序不复制 Prompt、AI、renderer、activation 业务逻辑。

## 5. 共享领域模型

### 5.1 枚举

```ts
export type Platform = "web" | "wechat";

export type Mood =
  | "calm"
  | "confident"
  | "romantic"
  | "magnetic"
  | "protected"
  | "creative"
  | "lucky"
  | "mysterious";

export type Context =
  | "date"
  | "work"
  | "party"
  | "interview"
  | "travel"
  | "just_for_luck"
  | "skip";

export type AnchorType =
  | "lucky_color"
  | "jewelry"
  | "crystal"
  | "lipstick"
  | "perfume"
  | "outfit_detail"
  | "ring_necklace"
  | "bag_scarf";

export type GenerationStatus = "pending" | "success" | "failed";
export type ActivationStatus = "started" | "sealed" | "cancelled";
export type ShareChannel = "web_share" | "copy_link" | "download" | "wechat" | "xhs" | "instagram" | "tiktok" | "pinterest";
```

### 5.2 Aura Card 输出

AI 或 mock provider 必须返回稳定 JSON：

```ts
export type AuraCardContent = {
  auraName: string;
  cardTitle?: string;
  luckyColors: string[];
  styleVibe: string;
  energyMessage: string;
  miniRitual: string;
  todayIntention: string;
  luckyAnchorSuggestions: Array<{
    type: AnchorType;
    label: string;
    reason: string;
  }>;
  safetyNote: string;
};
```

约束：

- 不允许身体、脸、体重、年龄、缺陷评价。
- 不允许保证结果。
- 不允许医疗、心理诊断、危机干预。
- 必须是英文 P0 文案。
- mock provider 必须在无 AI key 下生成完整 JSON。

## 6. 数据库设计

### 6.1 Prisma 模型清单

必须实现以下模型：

| Model | P0 必须 | 说明 |
| --- | --- | --- |
| `AnonymousUser` | 是 | 匿名用户主表。 |
| `OutfitUpload` | 是 | 可选上传记录。 |
| `DrawSession` | 是 | 抽卡 session、drawSeed、三张卡配置、选择位置。 |
| `GenerationJob` | 是 | 生成任务状态和 fallback 信息。 |
| `AuraCard` | 是 | 核心卡片内容和状态。 |
| `AuraActivation` | 是 | anchor、hold、seal、activated 状态。 |
| `SavedCard` | 是 | 保存记录，幂等。 |
| `ShareEvent` | 是 | 分享、复制、下载事件。 |
| `AnalyticsEvent` | 是 | 全流程埋点。 |
| `CardTemplate` | 是 | 分享图模板。 |

### 6.2 Prisma schema 关键字段

实现时以此为最低字段集：

```prisma
model AnonymousUser {
  id          String   @id @default(cuid())
  anonymousId String  @unique
  platform    String
  timezone    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  uploads      OutfitUpload[]
  drawSessions DrawSession[]
  jobs         GenerationJob[]
  cards        AuraCard[]
  activations  AuraActivation[]
  savedCards   SavedCard[]
  shares       ShareEvent[]
  analytics    AnalyticsEvent[]
}

model OutfitUpload {
  id          String   @id @default(cuid())
  userId      String
  user        AnonymousUser @relation(fields: [userId], references: [id])
  platform    String
  fileName    String
  mimeType    String
  fileSize    Int
  storagePath String
  publicUrl   String?
  styleNotes  Json?
  createdAt   DateTime @default(now())
}

model DrawSession {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])
  mood           String
  context        String?
  uploadId       String?
  drawSeed       String
  cardOptions    Json
  selectedIndex  Int?
  selectedAt     DateTime?
  expiresAt      DateTime
  createdAt      DateTime @default(now())

  jobs GenerationJob[]

  @@index([userId, createdAt])
}

model GenerationJob {
  id              String   @id @default(cuid())
  userId          String
  user            AnonymousUser @relation(fields: [userId], references: [id])
  drawSessionId   String
  drawSession     DrawSession @relation(fields: [drawSessionId], references: [id])
  status          String
  provider        String
  fallbackUsed    Boolean @default(false)
  errorCode       String?
  resultCardId    String?
  startedAt       DateTime @default(now())
  completedAt     DateTime?

  card AuraCard?
}

model AuraCard {
  id               String   @id @default(cuid())
  userId           String
  user             AnonymousUser @relation(fields: [userId], references: [id])
  generationJobId  String   @unique
  generationJob    GenerationJob @relation(fields: [generationJobId], references: [id])
  mood             String
  context          String?
  uploadId         String?
  drawSeed         String
  drawPosition     Int
  content          Json
  shareImageUrl    String?
  isActivated      Boolean @default(false)
  activatedAt      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  activations AuraActivation[]
  savedCards  SavedCard[]
  shares      ShareEvent[]

  @@index([userId, createdAt])
}

model AuraActivation {
  id             String   @id @default(cuid())
  userId         String
  user           AnonymousUser @relation(fields: [userId], references: [id])
  cardId         String
  card           AuraCard @relation(fields: [cardId], references: [id])
  anchorType     String
  anchorLabel    String
  status         String
  holdDurationMs Int?
  startedAt      DateTime @default(now())
  sealedAt       DateTime?

  @@index([cardId, status])
}

model SavedCard {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  cardId    String
  card      AuraCard @relation(fields: [cardId], references: [id])
  source    String
  createdAt DateTime @default(now())

  @@unique([userId, cardId])
}

model ShareEvent {
  id        String   @id @default(cuid())
  userId    String
  user      AnonymousUser @relation(fields: [userId], references: [id])
  cardId    String
  card      AuraCard @relation(fields: [cardId], references: [id])
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
```

### 6.3 Seed 数据

Seed 必须创建：

- 1 个 web anonymous user。
- 1 个 activated card。
- 1 个 non-activated generated card。
- 1 个 draw session。
- 1 个 card template。
- 1 条 saved card。
- 1 条 share event。
- 关键 analytics events 样例。

Seed 验收：

```powershell
pnpm --filter @auracue/web prisma migrate dev
pnpm --filter @auracue/web prisma db seed
pnpm --filter @auracue/web test:db
```

## 7. API 契约

所有 API 使用统一 envelope。

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
    "message": "Friendly message.",
    "details": {}
  }
}
```

所有写接口必须接收 `anonymousId` 和 `platform`，或可从 session/cookie 解析。

### 7.1 `POST /api/v1/identity/anonymous`

用途：生成匿名身份。

Request：

```json
{
  "platform": "web",
  "timezone": "Asia/Shanghai"
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

测试：

- 首次调用创建用户。
- 传入已有 anonymousId 时不重复创建。
- platform 非 `web/wechat` 返回 `VALIDATION_ERROR`。

### 7.2 `GET /api/v1/aura-cards/today`

用途：首页查询今日已激活卡入口。

Query：

```text
anonymousId=anon_xxx
timezone=Asia/Shanghai
```

Response 有卡：

```json
{
  "ok": true,
  "data": {
    "hasActiveCard": true,
    "cardId": "card_xxx",
    "auraName": "Golden Bloom",
    "activatedAt": "2026-06-01T09:00:00.000Z"
  }
}
```

Response 无卡：

```json
{
  "ok": true,
  "data": {
    "hasActiveCard": false
  }
}
```

测试：

- 已激活卡返回入口。
- 未激活卡不返回入口。
- anonymousId 不存在返回 `NOT_FOUND` 或自动创建，必须二选一并固定。

### 7.3 `POST /api/v1/uploads/outfit`

用途：可选 outfit 上传。

Request：`multipart/form-data`

字段：

- `file`: jpg/jpeg/png/webp
- `anonymousId`
- `platform`

Response：

```json
{
  "ok": true,
  "data": {
    "uploadId": "upload_xxx",
    "publicUrl": "/uploads/upload_xxx.png",
    "styleNotes": {
      "mood": "soft polished"
    }
  }
}
```

测试：

- jpg/png/webp 成功。
- 超过 8MB 返回 `FILE_TOO_LARGE`。
- 非图片返回 `UNSUPPORTED_FILE_TYPE`。
- 上传失败不阻塞 Web 流程，页面可 Skip。

### 7.4 `POST /api/v1/draw-sessions/start`

用途：进入抽卡页时创建 session。

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "mood": "confident",
  "context": "work",
  "uploadId": "upload_xxx"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "drawSessionId": "draw_xxx",
    "drawSeed": "seed_xxx",
    "expiresAt": "2026-06-01T10:30:00.000Z",
    "cards": [
      { "position": 1, "label": "Card I" },
      { "position": 2, "label": "Card II" },
      { "position": 3, "label": "Card III" }
    ]
  }
}
```

测试：

- mood 必填。
- context 可为 skip 或缺省。
- uploadId 可缺省。
- drawSeed 唯一。
- session 有过期时间。

### 7.5 `POST /api/v1/aura-cards/generate`

用途：用户选卡后生成 Aura Card。

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "drawSessionId": "draw_xxx",
  "drawPosition": 2
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_xxx",
    "status": "success",
    "cardId": "card_xxx",
    "generationSource": "mock",
    "fallbackUsed": false
  }
}
```

可接受 pending：

```json
{
  "ok": true,
  "data": {
    "jobId": "job_xxx",
    "status": "pending"
  }
}
```

测试：

- drawPosition 只能 1/2/3。
- session 过期返回 `DRAW_SESSION_EXPIRED`。
- 重复提交同一 session 和 position 不创建重复 card。
- AI 失败后 fallback 成功并写入 DB。
- AI 输出非法 JSON 时重试一次，仍失败则 fallback。
- card 自动写入 shareImageUrl 或可通过 render endpoint 补渲染。

### 7.6 `GET /api/v1/generation-jobs/:jobId`

用途：查询生成状态。

测试：

- success 返回 cardId。
- pending 可轮询。
- failed 返回 `GENERATION_FAILED`。
- 不存在返回 `NOT_FOUND`。

### 7.7 `GET /api/v1/aura-cards/:cardId`

用途：结果页、激活页、分享页读取 card。

Response：

```json
{
  "ok": true,
  "data": {
    "cardId": "card_xxx",
    "mood": "confident",
    "context": "work",
    "content": {
      "auraName": "Golden Bloom",
      "luckyColors": ["Blush Pink", "Navy", "Gold"],
      "styleVibe": "Tailored and confident",
      "energyMessage": "You do not need to be loud today.",
      "miniRitual": "Touch one gold detail and take 3 deep breaths.",
      "todayIntention": "I move through today with quiet power.",
      "luckyAnchorSuggestions": []
    },
    "shareImageUrl": "/generated-cards/card_xxx.png",
    "isActivated": false,
    "activatedAt": null
  }
}
```

测试：

- card 存在返回完整字段。
- card 不存在返回 `NOT_FOUND`。
- 不暴露 Prompt 或 provider secret。

### 7.8 `POST /api/v1/aura-cards/:cardId/render`

用途：重新渲染分享图。

测试：

- 生成 1080x1920 PNG。
- 写回 `shareImageUrl`。
- renderer 失败返回 `RENDER_FAILED`，前端可显示 CSS fallback 和 `Generate Image Again`。

### 7.9 `POST /api/v1/aura-cards/:cardId/activation/start`

用途：选择 anchor 后开始激活。

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "anchorType": "jewelry",
  "anchorLabel": "Jewelry"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "activationId": "act_xxx",
    "status": "started"
  }
}
```

测试：

- anchor 必填。
- card 不存在返回 `NOT_FOUND`。
- 已 activated 的 card 返回 `ACTIVATION_ALREADY_COMPLETED` 并带 `activatedUrl`。
- 多次 start 不生成多个未完成 activation，或明确幂等策略。

### 7.10 `POST /api/v1/activations/:activationId/seal`

用途：长按满 3 秒后完成 seal。

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
    "cardId": "card_xxx",
    "status": "sealed",
    "activatedAt": "2026-06-01T10:00:00.000Z"
  }
}
```

测试：

- `holdDurationMs < 3000` 返回 `HOLD_TOO_SHORT`。
- 满 3000ms 更新 activation 和 card。
- 重复 seal 幂等。
- 非本人 anonymousId 不能 seal。

### 7.11 `POST /api/v1/aura-cards/:cardId/save`

用途：保存卡片。

测试：

- 幂等保存。
- 写 `SavedCard`。
- 返回 savedAt。
- 不存在返回 `NOT_FOUND`。

### 7.12 `POST /api/v1/aura-cards/:cardId/share`

用途：记录分享、复制链接、下载。

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "channel": "copy_link",
  "source": "share_page"
}
```

测试：

- channel 校验。
- 写 `ShareEvent`。
- copy/download/share 都有记录。

### 7.13 `POST /api/v1/analytics/events`

用途：统一埋点。

Request：

```json
{
  "anonymousId": "anon_xxx",
  "platform": "web",
  "eventName": "select_mood",
  "page": "/",
  "payload": {
    "mood": "confident"
  }
}
```

测试：

- 只允许白名单事件名。
- payload 不能包含 secret-like 字段。
- 写 DB。
- 埋点失败不阻塞前端主流程。

## 8. Web 页面规格

### 8.1 `/` Mood-first Home

必须展示：

- 标题：`How do you want to feel today?`
- 副标题：`Pick one mood and we'll turn it into your lucky aura card.`
- 8 个 mood 选项。
- 主按钮：`Start My Aura Card`
- 轻提示：`Lucky color · Style vibe · Tiny ritual · Aura anchor`
- 声明：`For reflection and fun. Not a guarantee or professional advice.`
- 若今日已有 activated card，显示 `Today's Aura Active` 入口。

交互：

- 未选 mood 时按钮 disabled。
- 选 mood 写 draft，触发 `select_mood`。
- 点击 CTA 触发 `click_start_card`，跳 `/create/context`。
- 点击今日已激活入口跳 `/activated/[id]`。

页面测试：

- mood cards 全部存在。
- disabled/active 状态正确。
- 点击 mood 后 CTA 可用。
- 点击 CTA 路由正确。
- 有 active card 时入口可见。
- 无 active card 时入口不可见。

### 8.2 `/create/context` Optional Context

必须展示：

- 标题：`What is today for?`
- context 选项：Date, Work, Party, Interview, Travel, Just for luck。
- Skip。
- Continue。

交互：

- context 可选。
- 选择 context 或 Skip 都可继续。
- 写 draft。
- 触发 `context_selected` 或 `context_skipped`。
- 跳 `/create/upload`。

页面保护：

- 没有 mood 时跳 `/`。

测试：

- 选择每个 context 都能继续。
- Skip 可继续。
- 缺 mood 直接访问会回首页。
- 不出现付费入口。

### 8.3 `/create/upload` Optional Outfit Upload

必须展示：

- 标题：`Add today's outfit?`
- 上传区域。
- Skip。
- Retry。
- Continue。
- 安全说明：不会评价身体、脸或外貌缺陷。

交互：

- 上传非必填。
- 文件类型和体积前端预校验。
- 成功写 uploadId 到 draft。
- 失败显示 Toast，可 Retry 或 Skip。
- Skip 跳 `/create/draw`。

测试：

- jpg/png/webp mock 上传成功。
- >8MB 前端阻止或后端拒绝。
- 上传失败后 Skip 仍可进入 draw。
- 文案不包含身体/脸/外貌评价。

### 8.4 `/create/draw` Draw & Reveal

必须展示：

- 标题：`Choose the card that calls you.`
- 三张卡：Card I, Card II, Card III。
- 指引：`Tap one card to draw today's aura.`
- CTA：`Reveal My Aura`
- 生成中状态：`Revealing your aura...`

数据：

- 进入页面调用 `POST /api/v1/draw-sessions/start`。
- 后端返回 drawSessionId, drawSeed, cards。
- 用户选卡后调用 generate。

交互：

- 未选卡不能生成。
- 选卡后 CTA 可用。
- 生成时禁用重复提交和返回破坏。
- success 跳 `/result/[id]`。
- failed 可 Retry。

测试：

- 页面有 3 张卡。
- 未选卡 CTA disabled。
- 选第二张卡后 generate payload `drawPosition=2`。
- 重复点击不会创建重复请求。
- mock generation success 跳结果页。
- generation failure 显示 Retry。

### 8.5 `/result/[id]` Daily Aura Card Result

必须展示：

- auraName。
- luckyColors。
- styleVibe。
- energyMessage。
- miniRitual。
- todayIntention。
- shareImageUrl 或 CSS fallback card。
- 主按钮：`Activate Today's Aura`。
- 次按钮：`Save Card`。
- 次按钮：`Share Story`。

交互：

- 页面加载 `GET /api/v1/aura-cards/:cardId`。
- Activate 跳 `/activate/[id]`。
- Save 调 save API。
- Share 跳 `/share/[id]`。
- card 不存在显示 404 + Home。
- P0 不出现付费墙入口。

测试：

- 所有必显字段存在。
- 主按钮是 Activate，不是 Pay/Unlock。
- Save 写入 API。
- Share 路由正确。
- 404 状态可回首页。

### 8.6 `/activate/[id]` Activate Today's Aura

必须展示三步：

1. Wear Your Lucky Color。
2. Choose Your Lucky Anchor。
3. Hold to Seal。

Anchor 选项：

- Lucky Color
- Jewelry
- Crystal
- Lipstick
- Perfume
- Outfit Detail
- Ring / Necklace
- Bag / Scarf

交互：

- 页面加载 card。
- 选 anchor 后调用 activation start。
- 未选 anchor 时 Hold disabled。
- 按住满 3000ms 才调用 seal。
- 提前松手触发 cancel 埋点，不调用 seal。
- seal 成功跳 `/activated/[id]`。
- seal 失败显示 Retry Seal。
- 已激活卡进入时跳 `/activated/[id]`。

HoldToSealButton 验收：

- mouse 和 touch 都支持。
- 进度 0 到 100%，持续 3000ms。
- cancel 后进度归零。
- complete 后不能重复触发。
- 支持 `navigator.vibrate(35)`，不可用时静默。

测试：

- 未选 anchor 按钮 disabled。
- 选 anchor 后 start API 被调用。
- 长按 1000ms 松手不调用 seal。
- 长按 3100ms 调 seal。
- seal 成功跳 activated。
- seal 失败显示 Retry。

### 8.7 `/activated/[id]` Aura Activated

必须展示：

- `Aura Activated`
- auraName，例如 `Golden Bloom is active for today.`
- Lucky Color。
- Lucky Anchor。
- 简短 message。
- Buttons：`Done`, `Share Story`, `Save Card`。
- `Private. Personal. Just for you.`

交互：

- 页面加载获取 card 和最新 activation。
- 未 activated 时跳 `/activate/[id]`。
- Done 回 `/`。
- Share Story 跳 `/share/[id]`。
- Save 调 save API。

测试：

- 未激活不能直接看成功态。
- activated card 可显示成功态。
- Done 回首页。
- Share 跳分享页。
- Save 写入。

### 8.8 `/share/[id]` Share Story Preview

必须展示：

- 9:16 分享图预览。
- `Save Image`
- `Share`
- `Copy Link`
- `Generate Image Again` 仅在渲染失败时出现。

交互：

- 页面加载获取 card。
- shareImageUrl 不存在时调用 render。
- Save Image 下载 PNG 并记录 `save_image`。
- Share 优先 Web Share API，不可用则 fallback copy link。
- Copy Link 写 clipboard 并记录 `copy_share_link`。
- 每次分享动作调 share API。

测试：

- 有 shareImageUrl 时展示图片。
- 无 shareImageUrl 时自动 render。
- render 失败显示 CSS fallback 和 Generate Image Again。
- Copy Link 成功写 clipboard mock。
- Share API 不可用时 fallback 到 copy。
- 下载按钮触发 save/share 记录。

### 8.9 `/saved/[id]` Save Success

P0 可做页面，也可做 modal。Web 先实现页面，方便 E2E。

必须展示：

- `Saved to your AuraCue`
- `You can come back to today's aura anytime.`
- `Share Story`
- `Back to Home`

测试：

- 从 result/activated/share 保存后可到 saved。
- Share Story 路由正确。
- Back Home 路由正确。

## 9. 前端实现模块

### 9.1 Draft Store

仅保存流程草稿，不保存核心业务数据：

```ts
type AuraDraft = {
  anonymousId?: string;
  mood?: Mood;
  context?: Context;
  uploadId?: string;
  drawSessionId?: string;
  selectedDrawPosition?: 1 | 2 | 3;
};
```

规则：

- Web 使用 localStorage。
- 未来小程序使用 Taro storage。
- API 返回的 card/activation 以 DB 为准。
- draft 可清除，不能影响已生成卡读取。

### 9.2 API Client

实现 `apps/web/lib/api-client.ts`：

- `getOrCreateAnonymousIdentity`
- `getTodayAuraCard`
- `uploadOutfit`
- `startDrawSession`
- `generateAuraCard`
- `getGenerationJob`
- `getAuraCard`
- `renderAuraCard`
- `startActivation`
- `sealActivation`
- `saveCard`
- `shareCard`
- `trackEvent`

测试：

- 成功 envelope 解析。
- 错误 envelope 抛出 typed error。
- network error 返回用户友好错误。
- 不泄露 secrets。

### 9.3 Analytics Adapter

前端埋点失败不能阻塞主流程：

```ts
track("select_mood", { mood }).catch(console.warn);
```

所有事件必须进入白名单。

### 9.4 Upload Adapter

Web 上传处理：

- 接收 input file。
- 检查 mime 和 size。
- 可选压缩到最长边 1600px。
- FormData 上传。
- 失败时返回可展示错误。

### 9.5 Share Adapter

Web 分享处理：

- `navigator.share` 可用时用 Web Share API。
- 不可用时 copy link。
- 下载图片用 `<a download>` 或 blob。
- 每个动作都调用 share API。

## 10. AI 和 Prompt

### 10.1 Provider 策略

| provider | 用途 |
| --- | --- |
| `mock` | 默认，本地和 CI 必须可跑通。 |
| `openai-compatible` | 可选，支持 DeepSeek/OpenAI-compatible endpoint。 |

环境变量：

```env
AI_PROVIDER=mock
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=
OPENAI_BASE_URL=
PROMPT_VERSION=aura-card-v1
```

### 10.2 Fallback 规则

- 真实 AI 失败，后端重试 1 次。
- 仍失败，使用 mock generator。
- mock 结果必须完整入库。
- 前端不需要知道是否 fallback。
- analytics 记录 `generation_fallback_used`。
- 不得在日志、DB、报告中写入 API key。

### 10.3 Safety Guard

生成后必须检查：

- 无 guarantee 类承诺。
- 无身体、脸、外貌缺陷评价。
- 无医疗或心理诊断。
- 无恐吓式表述。
- 无购买强迫。

失败时重试或 fallback。

## 11. Card Renderer

### 11.1 输出

- PNG。
- 1080 x 1920。
- 9:16。
- Ivory + Blush Pink + Soft Gold。
- 必含 AuraCue 水印。

### 11.2 字段

分享图必须包含：

- AuraCue。
- auraName。
- luckyColors。
- luckyAnchor。
- todayIntention。
- miniRitual 精简版。

### 11.3 测试

- 固定输入生成稳定输出路径。
- PNG 元数据宽高是 1080 x 1920。
- 字段缺失时返回 validation error。
- renderer 失败时 API 返回 `RENDER_FAILED`。

## 12. 开发任务拆解

### T00 文档与范围锁定

交付：

- 本文档。
- Web-first traceability matrix。
- P0 non-goal list。

验收：

- 最新 PRD 是唯一源头。
- 旧 unlock/payment/invite 不进入 P0。

### T01 Monorepo 和 Web 初始化

交付：

- `apps/web` Next.js App Router。
- Tailwind。
- shared packages 接入。
- `.env.example`。

验收命令：

```powershell
pnpm install
pnpm --filter @auracue/web lint
pnpm --filter @auracue/web typecheck
pnpm --filter @auracue/web test
```

### T02 Prisma 和 Seed

交付：

- `prisma/schema.prisma`。
- migration。
- seed。
- DB helper。

验收：

- 本地 PostgreSQL 可迁移。
- seed 后关键表有数据。
- DB test 可读回。

### T03 API 基础设施

交付：

- Route handler helper。
- Zod validators。
- error envelope。
- request id。
- rate-limit placeholder。
- identity endpoint。
- health endpoint。

验收：

- API unit tests。
- error format tests。

### T04 Upload Service

交付：

- `/api/v1/uploads/outfit`。
- local storage adapter。
- file validation。

验收：

- 成功、过大、格式错误、匿名用户缺失全部测试。

### T05 Draw Service

交付：

- `/api/v1/draw-sessions/start`。
- drawSeed。
- card options。
- session expiry。

验收：

- draw session DB readback。
- mood required。
- context/upload optional。

### T06 AI/Mock Generator

交付：

- provider interface。
- mock provider。
- OpenAI-compatible provider。
- Zod output validation。
- safety guard。
- fallback。

验收：

- no-key mock success。
- fake provider success。
- invalid JSON fallback。
- unsafe copy rejection。

### T07 Aura Card Generate API

交付：

- `/api/v1/aura-cards/generate`。
- `/api/v1/generation-jobs/:jobId`。
- card persistence。
- idempotency。
- auto render or render-needed marker。

验收：

- happy path。
- duplicate click。
- expired draw。
- failed AI fallback。
- DB readback。

### T08 Card Read and Renderer

交付：

- `/api/v1/aura-cards/:cardId`。
- `/api/v1/aura-cards/:cardId/render`。
- PNG renderer。

验收：

- card read。
- not found。
- render success。
- render failure fallback。

### T09 Activation API

交付：

- `/api/v1/aura-cards/:cardId/activation/start`。
- `/api/v1/activations/:activationId/seal`。

验收：

- start。
- hold too short。
- seal success。
- repeated seal idempotency。
- card activated state readback。

### T10 Save/Share/Analytics API

交付：

- save endpoint。
- share endpoint。
- analytics endpoint。
- analytics whitelist。

验收：

- save idempotency。
- share channel validation。
- analytics event validation。
- secret-like payload guard。

### T11 Web Create Flow

交付：

- `/`
- `/create/context`
- `/create/upload`
- `/create/draw`
- draft store。
- page tests。

验收：

- mood -> context -> upload skip -> draw。
- upload success path。
- upload failure skip path。
- draw card selected -> generate。

### T12 Web Result and Activation Flow

交付：

- `/result/[id]`
- `/activate/[id]`
- HoldToSealButton。
- `/activated/[id]`

验收：

- result fields。
- activate CTA。
- hold cancel。
- hold complete。
- activated guard。

### T13 Web Share and Save Flow

交付：

- `/share/[id]`
- `/saved/[id]`
- Web Share/copy/download adapters。

验收：

- render if missing。
- copy link。
- save image。
- share fallback。
- saved page.

### T14 Web E2E and Visual Smoke

交付：

- Playwright tests。
- Mobile screenshots。
- full click trace。

验收：

- happy path。
- skip upload path。
- upload failure path。
- generation fallback path。
- hold cancel path。
- direct route guard path。
- share/copy/download path。

### T15 Final Acceptance Gate

交付：

- `scripts/acceptance/run-web-final-gate.ps1`。
- `docs/AUTO_EXECUTE_DELIVERY_REPORT.md`。
- `docs/auto-execute/results/web-final-gate.json`。

验收：

- 所有 tests pass。
- report integrity pass。
- no secret leakage。
- no P0 forbidden copy。
- final verdict PASS only if every gate passes。

## 13. 测试矩阵

### 13.1 单元测试

| Area | Test file | 必测 |
| --- | --- | --- |
| shared types | `packages/shared-types/tests/*.test.ts` | enum values, type guards |
| validators | `apps/web/tests/unit/validators.test.ts` | API request/response zod |
| prompt-core | `packages/prompt-core/tests/*.test.ts` | mock output, unsafe copy rejection |
| renderer | `packages/card-renderer/tests/*.test.ts` | PNG dimensions, deterministic output |
| draft store | `apps/web/tests/unit/draft-store.test.ts` | save/load/clear |
| Hold button | `apps/web/tests/unit/hold-to-seal-button.test.tsx` | cancel/complete/no duplicate |

### 13.2 API 集成测试

使用 test DB，测试后清理或 transaction rollback。

| Endpoint | Cases |
| --- | --- |
| identity | create, reuse, invalid platform |
| today | active card, no card, invalid user |
| upload | success, too large, unsupported type |
| draw start | success, missing mood, optional context/upload |
| generate | success, duplicate, expired session, fallback |
| job read | pending, success, failed, not found |
| card read | success, not found, no secret |
| render | success, failure |
| activation start | success, missing anchor, already activated |
| seal | too short, success, duplicate, wrong user |
| save | success, idempotent, not found |
| share | all channels, invalid channel |
| analytics | allowed event, disallowed event, secret-like payload |

### 13.3 页面组件测试

| Page | Tests |
| --- | --- |
| `/` | mood list, disabled CTA, active CTA, today's active card entry |
| `/create/context` | select, skip, guard |
| `/create/upload` | upload success, invalid file, failed upload skip |
| `/create/draw` | start session, select card, generate, retry |
| `/result/[id]` | fields, activate, save, share, 404 |
| `/activate/[id]` | anchor select, hold cancel, hold complete, retry seal |
| `/activated/[id]` | guard, save, share, done |
| `/share/[id]` | image render, copy, share fallback, download |
| `/saved/[id]` | share, home |

### 13.4 Playwright E2E

必须写入：

```text
apps/web/e2e/web-p0-happy-path.spec.ts
apps/web/e2e/web-p0-skip-upload.spec.ts
apps/web/e2e/web-p0-upload-failure.spec.ts
apps/web/e2e/web-p0-generation-fallback.spec.ts
apps/web/e2e/web-p0-hold-cancel.spec.ts
apps/web/e2e/web-p0-route-guards.spec.ts
apps/web/e2e/web-p0-share-save.spec.ts
```

#### E2E-001 Happy Path

步骤：

1. 打开 `/`。
2. 选择 `Confident`。
3. 点击 `Start My Aura Card`。
4. 选择 `Work`。
5. 点击 Continue。
6. 点击 Skip upload。
7. 进入 draw。
8. 选择 Card II。
9. 点击 `Reveal My Aura`。
10. 等待 `/result/[id]`。
11. 点击 `Activate Today's Aura`。
12. 选择 `Jewelry`。
13. 长按 3100ms。
14. 等待 `/activated/[id]`。
15. 点击 Save。
16. 点击 Share Story。
17. 在 share 页复制链接。

断言：

- 每一步路由正确。
- API mock/测试 DB 有对应记录。
- analytics 事件顺序完整。
- 页面无 console error。

#### E2E-002 Skip Upload

断言：

- 不上传也能生成。
- generation input 中 `uploadId=null`。

#### E2E-003 Upload Failure

断言：

- 上传失败出现提示。
- Skip 后仍能 draw。

#### E2E-004 Generation Fallback

断言：

- 模拟 AI provider failure。
- 结果页仍生成 card。
- DB job `fallbackUsed=true`。

#### E2E-005 Hold Cancel

断言：

- 按住 1000ms 松手不 seal。
- analytics 有 `activation_hold_cancelled`。
- 第二次 3100ms 成功。

#### E2E-006 Route Guards

断言：

- 没 mood 进 `/create/draw` 回 `/`。
- 未激活直接进 `/activated/[id]` 回 `/activate/[id]`。
- 不存在 card 显示 404 + Home。

#### E2E-007 Share Save

断言：

- share image 可见。
- Copy Link 写 clipboard。
- Download 触发 share/save 记录。
- Share API 不可用时 fallback copy。

### 13.5 Visual Smoke

Playwright 截图 viewport：

| Name | Size |
| --- | --- |
| iPhone 14 | 390x844 |
| Pixel 7 | 412x915 |
| Desktop narrow | 768x1024 |

必须截图：

- home
- context
- upload
- draw
- result
- activate
- activated
- share
- saved

验收：

- 无明显重叠。
- CTA 可见。
- 文字不溢出。
- 视觉风格符合 Ivory/Blush/Soft Gold。
- 不需要小程序像素一比一，但必须移动端高质量。

## 14. 最终验收命令

最终 gate 应执行：

```powershell
Set-Location -LiteralPath 'D:\lyh\agent\agent-frame\AuraCue'
pnpm install
pnpm --filter @auracue/web lint
pnpm --filter @auracue/web typecheck
pnpm --filter @auracue/web test
pnpm --filter @auracue/web test:api
pnpm --filter @auracue/web test:pages
pnpm --filter @auracue/web test:e2e
pnpm --filter @auracue/web test:visual
pnpm --filter @auracue/web test:db
pnpm --filter @auracue/web build
node scripts/acceptance/check-web-api-contract.mjs
node scripts/acceptance/check-web-analytics-coverage.mjs
node scripts/acceptance/check-web-copy-safety.mjs
node scripts/acceptance/check-secret-guard.mjs
node scripts/acceptance/check-report-integrity.mjs
git diff --check
```

最终 gate JSON：

```json
{
  "status": "PASS",
  "sourceOfTruth": "docs/AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md",
  "webFirstSpec": "docs/AuraCue_Web_First_Full_Development_Spec_v1.0.md",
  "requiredPages": 9,
  "requiredApiEndpoints": 13,
  "requiredE2EFlows": 7,
  "databaseReadback": "PASS",
  "analyticsCoverage": "PASS",
  "copySafety": "PASS",
  "secretGuard": "PASS"
}
```

若任一 gate 缺失或失败，最终状态必须是 `REPAIR_REQUIRED`，不能写 PASS。

## 15. 验收证据路径

所有验收证据必须写入：

```text
docs/auto-execute/results/web/
docs/auto-execute/api/web/
docs/auto-execute/db/web/
docs/auto-execute/traces/web/
docs/auto-execute/screenshots/web/
docs/auto-execute/logs/web/
docs/auto-execute/latest/WEB-HANDOFF.md
```

最低证据：

- `api-summary.json`
- `db-readback.json`
- `analytics-coverage.json`
- `copy-safety.json`
- `secret-guard.json`
- `playwright-report.json`
- `full-click-journey.json`
- `visual-smoke-summary.json`
- `web-final-gate.json`

## 16. Web 完成后的小程序适配入口

Web PASS 后，小程序适配不能重写业务逻辑，只做：

- route mapping。
- Taro API client。
- Taro storage draft adapter。
- `chooseMedia` upload adapter。
- `saveImageToPhotosAlbum` adapter。
- `useShareAppMessage` adapter。
- `Taro.vibrateShort` adapter。
- 小程序页面复用 Web 页面信息架构和 API。

小程序不允许：

- 复制 Prompt。
- 复制 AI 生成逻辑。
- 复制卡片业务状态机。
- 引入支付/邀请作为 P0 主线。

## 17. 一次性通过检查清单

开发完成前逐项确认：

- [ ] `apps/web` 存在并可 build。
- [ ] Prisma schema 与 seed 存在。
- [ ] 本地 test DB 可迁移、seed、读回。
- [ ] 所有 `/api/v1/*` 端点实现。
- [ ] Web 9 个 P0 页面实现。
- [ ] 全流程不强制登录。
- [ ] 上传可选，失败可跳过。
- [ ] AI key 缺失时 mock fallback 可完成完整流程。
- [ ] 生成结果写 DB。
- [ ] 分享图稳定生成。
- [ ] Activation 需要 3 秒长按。
- [ ] 长按取消不 seal。
- [ ] save/share/analytics 全部写 DB。
- [ ] 页面没有 P0 禁止内容。
- [ ] 不出现 Paywall/Unlock/Payment 主 CTA。
- [ ] Unit tests pass。
- [ ] API tests pass。
- [ ] DB tests pass。
- [ ] Page tests pass。
- [ ] Playwright E2E pass。
- [ ] Visual smoke pass。
- [ ] Secret guard pass。
- [ ] Report integrity pass。
- [ ] Final gate JSON 为 PASS。

## 18. 开发人员最终指令

从现在起，AuraCue P0 应按以下顺序开发：

```text
1. 锁定 Web-first 架构和本文档。
2. 建 apps/web、Prisma、shared contracts。
3. 完成统一 /api/v1 后端。
4. 完成 AI/mock、card renderer、analytics。
5. 完成 Web 9 个 P0 页面。
6. 完成所有 unit/API/page/E2E/visual tests。
7. 运行 final gate。
8. Web PASS 后，再开始小程序轻量适配。
```

最终交付必须能回答：

- 匿名用户能否从 mood 到 activated 全程跑通？
- 无上传能否跑通？
- 上传失败能否跳过？
- AI key 缺失能否跑通？
- 长按不足 3 秒是否不会激活？
- 成功激活后是否能保存和分享？
- 分享图是否稳定生成？
- 关键数据和埋点是否写入数据库？
- Web 与小程序是否可共用同一套 API？

只有全部答案都有自动化证据时，才允许 PASS。
