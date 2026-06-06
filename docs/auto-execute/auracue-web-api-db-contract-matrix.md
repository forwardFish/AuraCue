# AuraCue Web/H5 API DB Contract Matrix

统一 envelope：成功 `{ "ok": true, "data": {} }`；失败 `{ "ok": false, "error": { "code": "...", "message": "...", "details": {} } }`。

| API ID | Method | Path | Auth | Request | Response | DB/readback | Frontend caller | 测试要求 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-001 | POST | `/api/v1/identity/anonymous` | anonymous | platform, timezone, optional anonymousId | anonymousId, created | `AnonymousUser` create/idempotent | draft init | first/existing/invalid platform | PLANNED |
| API-002 | GET | `/api/v1/aura-cards/today` | anonymousId query | anonymousId, timezone | hasActiveCard/cardId | `AuraCard` activated readback | `/` | active/none/not found policy | PLANNED |
| API-003 | POST | `/api/v1/uploads/outfit` | anonymousId/platform | multipart file | uploadId, publicUrl, styleNotes | `OutfitUpload` write/readback | `/create/upload` | jpg/png/webp/>8MB/bad type/failure skip | PLANNED |
| API-004 | POST | `/api/v1/draw-sessions/start` | anonymousId/platform | mood, context, uploadId | drawSessionId, drawSeed, cards | `DrawSession` write/readback | `/create/draw` | mood required/optional context/upload/expiry | PLANNED |
| API-005 | POST | `/api/v1/aura-cards/generate` | anonymousId/platform | drawSessionId, drawPosition | jobId,status,cardId,generationSource | `GenerationJob`, `AuraCard` write/readback | `/create/draw` | position validation/expired/idempotent/fallback | PLANNED |
| API-006 | GET | `/api/v1/generation-jobs/:jobId` | anonymousId/session | jobId | status, cardId/error | `GenerationJob` readback | `/create/draw` | success/pending/failed/not-found | PLANNED |
| API-007 | GET | `/api/v1/aura-cards/:cardId` | public or anonymous-safe | cardId | full card, activation state | `AuraCard`, latest activation readback | result/activate/activated/share | exists/not-found/no secrets | PLANNED |
| API-008 | POST | `/api/v1/aura-cards/:cardId/render` | anonymousId/platform | cardId | shareImageUrl | `AuraCard.shareImageUrl` write/readback | `/share/[id]` | 1080x1920/render failed/idempotent | PLANNED |
| API-009 | POST | `/api/v1/aura-cards/:cardId/activation/start` | anonymousId/platform | anchorType, anchorLabel | activationId,status | `Activation` started readback | `/activate/[id]` | anchor required/not-found/already activated/idempotent | PLANNED |
| API-010 | POST | `/api/v1/activations/:activationId/seal` | anonymousId/platform | holdDurationMs | sealed, activatedAt | `Activation`, `AuraCard.isActivated` readback | HoldToSealButton | <3000/>=3000/repeat/wrong user | PLANNED |
| API-011 | POST | `/api/v1/aura-cards/:cardId/save` | anonymousId/platform | cardId | savedAt | `SavedCard` idempotent readback | result/activated/share/saved | success/not-found/idempotent | PLANNED |
| API-012 | POST | `/api/v1/aura-cards/:cardId/share` | anonymousId/platform | channel, source | shareEventId | `ShareEvent` write/readback | `/share/[id]` | channel validation/copy/download/share | PLANNED |
| API-013 | POST | `/api/v1/analytics/events` | anonymousId/platform | eventName,page,payload | analyticsEventId | `AnalyticsEvent` write/readback | all pages | whitelist/secret-like payload/non-blocking | PLANNED |

## DB Models

`AnonymousUser`、`OutfitUpload`、`DrawSession`、`GenerationJob`、`AuraCard`、`Activation`、`SavedCard`、`ShareEvent`、`AnalyticsEvent`、`CardTemplate` 均为 P0 数据模型。后续 T03 必须给出 schema、seed、migration 或等价 local test DB 说明。

