# AuraCue Web/H5 Development Standard

## 1. Source 顺序

后续执行者必须按顺序服从：用户最新指令、`AGENTS.md`、`AuraCue_Web_First_Full_Development_Spec_v1.0.md`、`AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`、UI 参考、现有代码模式。旧小程序和旧 `apps/api` 只能作为迁移参考。

## 2. 架构规则

- Web 主工程为 `apps/web`，使用 Next.js App Router + TypeScript + Tailwind CSS + `packages/ui-tokens`。
- API 在 `apps/web/app/api/v1/**/route.ts` 或明确等价的 Web/API 同域结构中实现。
- DB 使用 Prisma/PostgreSQL，本地开发可使用可替代测试 DB，但必须保留 Prisma schema/migration/readback 证据。
- 前端 draft 只存 mood/context/uploadId/drawSessionId 等非核心草稿；核心业务数据以 DB/API 返回为准。
- 小程序不复制 Prompt、AI、renderer、activation 业务逻辑。

## 3. 实现规则

- 每次改动必须绑定 Req/API/UI/DB ID。
- 不新增 P0 非目标：paywall、真实支付、邀请解锁、history、7-day trend、evening reflection。
- 上传失败不得阻塞生成，页面必须可 Skip。
- 所有写接口必须有 anonymousId/platform 或等价 session 解析。
- 所有 API 使用 `{ ok: true, data }` / `{ ok: false, error }` envelope。
- 真实 AI key 缺失时必须走 mock provider；不得把 mock 证明写成真实模型证明。
- 不得在日志、result JSON、HANDOFF、report 中泄露 API key 或 secret-like 字段。

## 4. 前端规则

- 9 个 P0 route 必须存在：`/`、`/create/context`、`/create/upload`、`/create/draw`、`/result/[id]`、`/activate/[id]`、`/activated/[id]`、`/share/[id]`、`/saved/[id]`。
- 每个页面至少覆盖 loaded、loading/error 或 guard 状态中与 PRD 有关的状态。
- 所有按钮、卡片、表单、上传、长按、分享/下载/复制必须有可见效果或 API/state 证据。
- 页面不出现付费解锁作为 P0 主 CTA。
- 文案默认使用 Web-first 英文 P0 文案；中文任务文档保留中文说明。

## 5. 后端规则

- 每个 API task 必须覆盖 success、validation、not-found/idempotency/error/readback。
- Draw Session 必须由后端生成 drawSeed 并记录 drawPosition。
- Aura Card 生成必须绑定 mood/context/upload/drawSeed/drawPosition。
- Activation start/seal 必须证明 holdDurationMs >= 3000，重复 seal 幂等。
- Save、Share、Analytics 必须写 DB，并有独立 readback。
- Renderer 必须稳定生成 9:16 分享图路径；失败时返回明确 `RENDER_FAILED`。

## 6. 外部副作用

默认 local-only。不得触发真实支付、真实云写入、真实短信/邮件或未经授权的真实 AI 调用。需要真实 provider smoke 时，必须有本地 env 且 result 中写明授权、范围、limitation。

