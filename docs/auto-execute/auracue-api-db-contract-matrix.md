# AuraCue API/DB Contract Matrix

Every API row is local/mock for MVP. Real payment, real cloud storage, and real AI provider calls are forbidden unless a later explicit task changes scope.

| API ID | Case ID | Method | Path | Case Type | Auth | Request Schema | Response Schema | Expected Status/Error | Frontend Caller | Owner Scenario | DB Mutation | DB Readback | Future Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-000 | C01 | GET | `/api/health` | success | none | none | `{status, version}` | 200 | T00/T01 harness | SCN-001 | none | none | `docs/auto-execute/api/T01/health.json` | PLANNED |
| API-001 | C01 | POST | `/api/generation-jobs` | success | anonymous allowed | `{scene, energy, locale?, source?}` | `{jobId, status}` | 201 | UI-03/UI-04 | SCN-003 | create `generation_jobs` | read job by id | `docs/auto-execute/api/T20/API-001-success.json` | PLANNED |
| API-001 | C02 | POST | `/api/generation-jobs` | validation failure | anonymous allowed | missing/invalid scene or energy | error envelope | 400 | UI-03A | SCN-003 | none | no new job | `docs/auto-execute/api/T20/API-001-validation.json` | PLANNED |
| API-001 | C03 | POST | `/api/generation-jobs` | timeout/fallback | anonymous allowed | valid request with forced failure | fallback/error envelope | 503 or local fallback | UI-11 | SCN-015 | failed `generation_jobs` | read failed job | `docs/auto-execute/api/T20/API-001-fallback.json` | PLANNED |
| API-002 | C01 | GET | `/api/generation-jobs/:jobId` | success | anonymous token/session | route param `jobId` | `{jobId,status,cardId?}` | 200 | UI-05 | SCN-004 | update job status as local worker completes | read job | `docs/auto-execute/api/T20/API-002-success.json` | PLANNED |
| API-002 | C02 | GET | `/api/generation-jobs/:jobId` | not found | anonymous token/session | unknown `jobId` | error envelope | 404 | UI-11 | SCN-015 | none | none | `docs/auto-execute/api/T20/API-002-404.json` | PLANNED |
| API-003 | C01 | GET | `/api/cards/:cardId` | free result success | anonymous/session owner | `view=free` | free card fields + locked markers | 200 | UI-05 | SCN-005 | none | read `aura_cards` | `docs/auto-execute/api/T20/API-003-free.json` | PLANNED |
| API-003 | C02 | GET | `/api/cards/:cardId` | full result locked | anonymous/session owner | `view=full` without entitlement | error or locked response | 402/403 | UI-05/UI-06 | SCN-006 | none | read entitlement false | `docs/auto-execute/api/T20/API-003-locked.json` | PLANNED |
| API-003 | C03 | GET | `/api/cards/:cardId` | full result success | anonymous/session owner | `view=full` with entitlement | full card fields | 200 | UI-09 | SCN-012 | none | read card + entitlement | `docs/auto-execute/api/T20/API-003-full.json` | PLANNED |
| API-003 | C04 | GET | `/api/cards/:cardId` | not found | anonymous/session owner | unknown `cardId` | error envelope | 404 | UI-11 | SCN-015 | none | none | `docs/auto-execute/api/T20/API-003-404.json` | PLANNED |
| API-004 | C01 | POST | `/api/cards/:cardId/unlock/mock` | mock unlock success | anonymous/session owner | `{method:"payment" or "invite", orderId?}` | `{entitled:true, entitlementId}` | 200 | UI-08/UI-11/UI-13 | SCN-011 | create/update `user_entitlements` | read entitlement true | `docs/auto-execute/api/T20/API-004-success.json` | PLANNED |
| API-004 | C02 | POST | `/api/cards/:cardId/unlock/mock` | conflict/idempotent | anonymous/session owner | duplicate unlock | same entitlement | 200 | UI-13 | SCN-011 | no duplicate entitlement | read one entitlement | `docs/auto-execute/api/T20/API-004-idempotent.json` | PLANNED |
| API-005 | C01 | POST | `/api/payment-orders/mock` | create mock order | anonymous/session owner | `{cardId, amount, currency}` | `{orderId,status}` | 201 | UI-11 | SCN-009 | create `payment_orders` | read order | `docs/auto-execute/api/T20/API-005-create.json` | PLANNED |
| API-005 | C02 | POST | `/api/payment-orders/mock/:orderId/complete` | payment success/failure | anonymous/session owner | `{result:"success" or "failed"}` | `{orderId,status}` | 200 | UI-12/UI-13 | SCN-010/SCN-011 | update `payment_orders`; maybe entitlement | read order + entitlement | `docs/auto-execute/api/T20/API-005-complete.json` | PLANNED |
| API-006 | C01 | POST | `/api/invites/:cardId/events` | invite event/progress | anonymous/session owner | `{action, inviteCode?, friendId?}` | `{progress, required, completed}` | 200 | UI-08/UI-09/UI-10 | SCN-007/SCN-008 | create `share_events`; maybe entitlement at 3/3 | read progress + entitlement | `docs/auto-execute/api/T20/API-006-progress.json` | PLANNED |
| API-006 | C02 | POST | `/api/invites/:cardId/events` | duplicate invite | anonymous/session owner | duplicate friend/action | idempotent progress | 200 | UI-09 | SCN-007 | no double count | read progress unchanged | `docs/auto-execute/api/T20/API-006-duplicate.json` | PLANNED |
| API-007 | C01 | POST | `/api/cards/:cardId/save` | save card success | anonymous/session owner | `{source}` | `{saved:true}` | 200 | UI-14/UI-15/UI-17 | SCN-014 | update `aura_cards.savedAt` | read card saved | `docs/auto-execute/api/T20/API-007-save.json` | PLANNED |
| API-008 | C01 | POST | `/api/share-events` | share event success | anonymous/session owner | `{cardId, channel, source}` | `{shareEventId}` | 201 | UI-15/UI-16 | SCN-013 | create `share_events` | read share event | `docs/auto-execute/api/T20/API-008-share.json` | PLANNED |
| API-009 | C01 | POST | `/api/share-images/:cardId` | generate share image | anonymous/session owner | `{templateId, format}` | `{imageUrl or localPath, templateId}` | 200 | UI-15 | SCN-013 | maybe create rendered asset record | read template/card | `docs/auto-execute/api/T20/API-009-render.json` | PLANNED |
| API-010 | C01 | POST | `/api/analytics-events` | analytics record | anonymous allowed | `{eventName, page, properties}` | `{accepted:true}` | 202 | all P0 UI | SCN-001..SCN-015 | create `analytics_events` | read event | `docs/auto-execute/api/T20/API-010-analytics.json` | PLANNED |

## Error Envelope
All API errors must use a typed envelope equivalent to:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Safe user-facing message",
    "details": {}
  }
}
```

## DB Readback Rule
Every mutation row above requires an independent readback through repository/test helper or API probe. A response alone is not sufficient evidence for final acceptance.
