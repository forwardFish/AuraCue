# AuraCue Web/H5 Requirement Traceability Matrix

| Req ID | Priority | 需求 | Source | UI/API/DB | 实现 Task | 验证 Task | 未来证据 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | P0 | Web/H5 是主工程，`apps/web` 存在并可运行 | SRC-WEB-001 §0-4 | Route all | T02,T08 | T16 | `results/web/T16.json` | PLANNED |
| REQ-002 | P0 | 匿名用户不强制登录完成主流程 | SRC-WEB-001 §1.3, §7.1 | API-001, DB-User | T05,T08 | T12,T13 | `api/web/T12/API-001*.json` | PLANNED |
| REQ-003 | P0 | Mood 首页选择后进入创建流程 | SRC-WEB-001 §8.1 | UI-001, API-002 | T09 | T13,T14 | `screenshots/web/T14/UI-001-*` | PLANNED |
| REQ-004 | P0 | Context 可选且可 Skip | SRC-WEB-001 §8.2 | UI-002 | T09 | T13 | `traces/web/T13/skip-upload` | PLANNED |
| REQ-005 | P0 | Outfit upload 可选，失败可跳过 | SRC-WEB-001 §7.3, §8.3 | UI-003, API-003, DB-Upload | T05,T09 | T12,T13 | `api/web/T12/API-003*.json` | PLANNED |
| REQ-006 | P0 | Draw 三卡选择，后端记录 drawSeed/drawPosition | SRC-WEB-001 §7.4, §8.4 | UI-004, API-004, DB-DrawSession | T05,T09 | T12,T13 | `db/web/T12/draw-session-readback.json` | PLANNED |
| REQ-007 | P0 | Aura Card 由 AI/mock fallback 输出稳定 JSON 并入库 | SRC-WEB-001 §7.5, §10 | API-005, API-006, AI-001, DB-Card | T06 | T12,T13 | `db/web/T12/card-readback.json` | PLANNED |
| REQ-008 | P0 | Result 页面展示完整卡片并支持 Save/Share/Activate | SRC-WEB-001 §8.5 | UI-005, API-007,011,012 | T10,T07 | T13,T14 | `traces/web/T13/happy-path` | PLANNED |
| REQ-009 | P0 | Activation 选择 anchor，长按 3 秒 Seal | SRC-WEB-001 §8.6 | UI-006, API-009,010, DB-Activation | T07,T10 | T13 | `db/web/T12/activation-readback.json` | PLANNED |
| REQ-010 | P0 | Activated 页面显示成功态，可保存分享 | SRC-WEB-001 §8.7 | UI-007, API-007,011,012 | T10 | T13,T14 | `screenshots/web/T14/UI-007-*` | PLANNED |
| REQ-011 | P0 | Share 页面支持 9:16 图、下载、Web Share、Copy fallback | SRC-WEB-001 §8.8 | UI-008, API-008,012, Renderer | T07,T11 | T13,T14 | `screenshots/web/T14/UI-008-*` | PLANNED |
| REQ-012 | P0 | Saved 页面/反馈可回首页或继续分享 | SRC-WEB-001 §8.9 | UI-009, API-011 | T11 | T13,T14 | `screenshots/web/T14/UI-009-*` | PLANNED |
| REQ-013 | P0 | 全流程埋点写 DB，失败不阻塞前端 | SRC-WEB-001 §7.13 | API-013, DB-Analytics | T07,T09,T10,T11 | T12,T15 | `db/web/T12/analytics-readback.json` | PLANNED |
| REQ-014 | P0 | 安全内容边界：不评价身体/脸/外貌缺陷，不保证改运 | SRC-PRD-001 §16 | UI all, AI-001 | T06,T09,T10,T11 | T16 | `results/web/T16.json` | PLANNED |
| REQ-015 | P0 | Web final gate fail closed，不能用聊天声明代替证据 | SRC-WEB-001 §15 | Evidence all | T15 | T15 | `results/web/web-final-gate.json` | PLANNED |
