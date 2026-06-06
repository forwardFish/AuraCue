import { makeFreeCard, makeFullCard, shellFixtureIds } from "../fixtures/shell-fixtures.mjs";
import { renderLocalShareCard } from "../../../../packages/card-renderer/src/local-renderer.mjs";

export const apiClientCoverage = {
  "API-001": { method: "POST", path: "/api/generation-jobs", clientMethod: "createGenerationJob" },
  "API-002": { method: "GET", path: "/api/generation-jobs/:jobId", clientMethod: "getGenerationJob" },
  "API-003": { method: "GET", path: "/api/cards/:cardId", clientMethod: "getCard" },
  "API-004": { method: "POST", path: "/api/cards/:cardId/unlock/mock", clientMethod: "unlockCard" },
  "API-005": { method: "POST", path: "/api/payment-orders/mock", clientMethod: "createMockPaymentOrder" },
  "API-005B": { method: "POST", path: "/api/payment-orders/mock/:orderId/complete", clientMethod: "completeMockPaymentOrder" },
  "API-006": { method: "POST", path: "/api/invites/:cardId/events", clientMethod: "recordInviteEvent" },
  "API-007": { method: "POST", path: "/api/cards/:cardId/save", clientMethod: "saveCard" },
  "API-008": { method: "POST", path: "/api/share-events", clientMethod: "recordShareEvent" },
  "API-009": { method: "POST", path: "/api/share-images/:cardId", clientMethod: "renderShareImage" },
  "API-010": { method: "POST", path: "/api/analytics-events", clientMethod: "recordAnalyticsEvent" }
};

function ok(payload) {
  return Promise.resolve(structuredClone(payload));
}

export function createFixtureApiClient({ mode = "fixture" } = {}) {
  if (mode !== "fixture") {
    throw new Error("T08 mini-program client only permits fixture mode in local verification.");
  }

  return {
    mode,
    createGenerationJob(request) {
      if (!request.scene || !request.energy || request.forceFailure) {
        return ok({ error: { code: "LOCAL_GENERATION_FAILURE", message: "Use a complete local scene and energy fixture." } });
      }
      return ok({ jobId: shellFixtureIds.jobId, status: "success", cardId: shellFixtureIds.cardId });
    },
    getGenerationJob(jobId) {
      return ok({ jobId, status: jobId === shellFixtureIds.failedJobId ? "failed" : "success", cardId: jobId === shellFixtureIds.failedJobId ? null : shellFixtureIds.cardId, errorCode: jobId === shellFixtureIds.failedJobId ? "LOCAL_GENERATION_FAILURE" : null });
    },
    getCard(cardId, view = "free") {
      return ok(view === "full" ? makeFullCard(cardId) : makeFreeCard(cardId));
    },
    unlockCard(cardId, request) {
      return ok({ entitled: true, entitlementId: `entitlement-${request.method}-${cardId}`, cardId, method: request.method, orderId: request.orderId ?? null });
    },
    createMockPaymentOrder(request) {
      return ok({ orderId: shellFixtureIds.paymentOrderId, cardId: request.cardId, amount: request.amount ?? 1.99, currency: request.currency ?? "USD", status: "pending", entitlement: null });
    },
    completeMockPaymentOrder(orderId, request) {
      const entitlement = request.result === "success"
        ? { entitled: true, entitlementId: "entitlement-paid-001", cardId: shellFixtureIds.cardId, method: "payment", orderId }
        : null;
      return ok({ orderId, cardId: shellFixtureIds.cardId, amount: 1.99, currency: "USD", status: request.result === "success" ? "paid" : "failed", entitlement });
    },
    recordInviteEvent(cardId, request) {
      const progress = request.action === "friend_accept" ? 1 : 0;
      return ok({ cardId, inviteCode: request.inviteCode ?? shellFixtureIds.inviteCode, progress, required: 3, completed: false, entitlement: null });
    },
    saveCard(cardId) {
      return ok({ saved: true, cardId, savedAt: "2026-05-26T00:05:00.000Z" });
    },
    recordShareEvent(request) {
      return ok({ shareEventId: "share-t08-001", cardId: request.cardId, channel: request.channel, source: request.source });
    },
    renderShareImage(cardId, request = {}) {
      const fullCard = makeFullCard(cardId);
      return ok(renderLocalShareCard({
        card: {
          id: fullCard.cardId,
          content: fullCard.card
        },
        template: {
          templateId: request.templateId ?? "template-story-001",
          format: request.format ?? "story-9x16"
        }
      }));
    },
    recordAnalyticsEvent(request) {
      return ok({ accepted: true, analyticsEventId: `analytics-${request.eventName}` });
    }
  };
}
