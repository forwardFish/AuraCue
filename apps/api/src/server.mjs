import http from "node:http";
import { analyticsEvents, validateAnalyticsEventInput } from "../../../packages/analytics-events/src/local-validator.mjs";
import { assertSafeLocalCopy, buildLocalAuraCard, validEnergies, validScenes } from "../../../packages/prompt-core/src/local-generator.mjs";
import { generateAuraCardWithAi, publicAiProviderConfig, resolveAiProvider } from "./ai-provider.mjs";
import { createLocalRepository, repositoryHealth } from "./local-repository.mjs";

export const apiVersion = "0.1.0-t01";

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(payload, null, 2));
}

function errorEnvelope(code, message, details = {}) {
  return { error: { code, message, details } };
}

function parseUrl(request) {
  return new URL(request.url, "http://127.0.0.1");
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

function validateGenerationInput(body) {
  const details = {};
  if (!validScenes.includes(body?.scene)) {
    details.scene = `Expected one of: ${validScenes.join(", ")}`;
  }
  if (!validEnergies.includes(body?.energy)) {
    details.energy = `Expected one of: ${validEnergies.join(", ")}`;
  }
  return Object.keys(details).length === 0 ? null : details;
}

function validateMockPaymentOrderInput(body) {
  const details = {};
  if (typeof body?.cardId !== "string" || body.cardId.trim() === "") {
    details.cardId = "Expected a cardId.";
  }
  if (body?.amount !== undefined && (typeof body.amount !== "number" || body.amount <= 0)) {
    details.amount = "Expected a positive number.";
  }
  if (body?.currency !== undefined && body.currency !== "USD") {
    details.currency = "Only USD mock pricing is supported in the local MVP.";
  }
  return Object.keys(details).length === 0 ? null : details;
}

function validateMockPaymentCompletionInput(body) {
  if (body?.result === "success" || body?.result === "failed") {
    return null;
  }
  return { result: "Expected success or failed." };
}

function validateUnlockInput(body) {
  const details = {};
  if (!["payment", "invite", "restore"].includes(body?.method)) {
    details.method = "Expected payment, invite, or restore.";
  }
  if (body?.orderId !== undefined && body.orderId !== null && typeof body.orderId !== "string") {
    details.orderId = "Expected orderId to be a string when supplied.";
  }
  return Object.keys(details).length === 0 ? null : details;
}

function validateInviteInput(body) {
  const details = {};
  if (!["invite_started", "copy", "invite_again", "friend_accept"].includes(body?.action)) {
    details.action = "Expected invite_started, copy, invite_again, or friend_accept.";
  }
  if (body?.inviteCode !== undefined && typeof body.inviteCode !== "string") {
    details.inviteCode = "Expected inviteCode to be a string when supplied.";
  }
  if (body?.friendId !== undefined && body.friendId !== null && typeof body.friendId !== "string") {
    details.friendId = "Expected friendId to be a string when supplied.";
  }
  if (body?.action === "friend_accept" && (typeof body.friendId !== "string" || body.friendId.trim() === "")) {
    details.friendId = "friend_accept requires a friendId for duplicate-safe progress.";
  }
  return Object.keys(details).length === 0 ? null : details;
}

function validateSaveInput(body) {
  if (typeof body?.source === "string" && body.source.trim() !== "") {
    return null;
  }
  return { source: "Expected a non-empty save source." };
}

function validateShareEventInput(body) {
  const details = {};
  if (typeof body?.cardId !== "string" || body.cardId.trim() === "") {
    details.cardId = "Expected a cardId.";
  }
  if (!["wechat", "moments", "copy_link", "save_image", "story"].includes(body?.channel)) {
    details.channel = "Expected wechat, moments, copy_link, save_image, or story.";
  }
  if (typeof body?.source !== "string" || body.source.trim() === "") {
    details.source = "Expected a non-empty share source.";
  }
  return Object.keys(details).length === 0 ? null : details;
}

function validateShareImageInput(body) {
  const details = {};
  if (body?.templateId !== undefined && typeof body.templateId !== "string") {
    details.templateId = "Expected templateId to be a string when supplied.";
  }
  if (body?.format !== undefined && body.format !== "story-9x16") {
    details.format = "Only story-9x16 local share rendering is supported.";
  }
  return Object.keys(details).length === 0 ? null : details;
}

function freeCardResponse(card) {
  return {
    cardId: card.id,
    view: "free",
    locked: true,
    auraName: card.content.auraName,
    luckyColor: card.content.luckyColor,
    oneLineReminder: card.content.message,
    previewImage: {
      variant: "low-res-watermarked",
      localPath: `local://cards/${card.id}/preview-watermarked.png`,
      watermark: "AuraCue Preview",
      blurred: true
    },
    lockedPreview: {
      fullContentAvailable: false,
      unlockRequired: true,
      hiddenFields: ["outfit", "beauty", "social", "ritual", "avoid", "caption", "theme"]
    }
  };
}

function fullCardResponse(card, entitlement) {
  return {
    cardId: card.id,
    view: "full",
    locked: false,
    entitlement: {
      entitled: true,
      entitlementId: entitlement.id,
      method: entitlement.method
    },
    card: {
      title: card.content.title,
      auraName: card.content.auraName,
      tarotSymbol: card.content.tarotSymbol,
      message: card.content.message,
      luckyColor: card.content.luckyColor,
      colors: card.content.colors,
      outfit: card.content.outfit,
      beauty: card.content.beauty,
      social: card.content.social,
      ritual: card.content.ritual,
      avoid: card.content.avoid,
      caption: card.content.caption,
      theme: card.content.theme
    },
    shareImagePath: card.shareImagePath,
    savedAt: card.savedAt
  };
}

function entitlementResponse(entitlement) {
  return {
    entitled: true,
    entitlementId: entitlement.id,
    cardId: entitlement.cardId,
    method: entitlement.method,
    orderId: entitlement.orderId
  };
}

function paymentOrderResponse(order, entitlement = null) {
  return {
    orderId: order.id,
    cardId: order.cardId,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    entitlement: entitlement ? entitlementResponse(entitlement) : null
  };
}

export function healthPayload() {
  const aiProvider = publicAiProviderConfig(resolveAiProvider());
  return {
    status: "ready",
    version: apiVersion,
    mode: "local-mock",
    services: {
      payment: "mock-only",
      ai: aiProvider.hasApiKey ? "deepseek-with-local-fallback" : "deterministic-local-fallback",
      aiProvider,
      analytics: "local-collector-only",
      analyticsEvents,
      storage: "local-artifacts-only",
      db: "deterministic-json-repository"
    },
    repository: repositoryHealth()
  };
}

export function createServer({ repository = createLocalRepository(), aiFetch = globalThis.fetch } = {}) {
  return http.createServer(async (request, response) => {
    const url = parseUrl(request);
    if (request.method === "GET" && request.url === "/api/health") {
      sendJson(response, 200, healthPayload());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/generation-jobs") {
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateGenerationInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Choose a supported scene and energy before generating.", validationDetails));
        return;
      }

      const job = repository.createGenerationJob({
        scene: body.scene,
        energy: body.energy,
        source: body.source,
        forceFailure: body.forceFailure === true
      });

      if (body.forceFailure === true) {
        sendJson(response, 503, errorEnvelope("LOCAL_GENERATION_FAILURE", "The local generator could not finish this card. Please try again.", {
          jobId: job.id,
          status: job.status
        }));
        return;
      }

      if (body.autoComplete === false) {
        sendJson(response, 201, { jobId: job.id, status: job.status });
        return;
      }

      const aiResult = await generateAuraCardWithAi({
        scene: body.scene,
        energy: body.energy,
        locale: body.locale ?? "en-US",
        fetchImpl: aiFetch
      });
      const content = aiResult.ok
        ? aiResult.content
        : buildLocalAuraCard({ scene: body.scene, energy: body.energy });
      const safety = assertSafeLocalCopy(content);
      if (!safety.safe) {
        sendJson(response, 500, errorEnvelope("LOCAL_COPY_SAFETY_FAILURE", "The local generator produced unsafe copy.", safety));
        return;
      }
      const completed = repository.completeGenerationJob(job.id, content);
      sendJson(response, 201, {
        jobId: completed.job.id,
        status: completed.job.status,
        cardId: completed.card.id,
        generationSource: aiResult.ok ? "ai" : "local-fallback",
        aiProvider: aiResult.config
      });
      return;
    }

    const generationJobMatch = url.pathname.match(/^\/api\/generation-jobs\/([^/]+)$/);
    if (request.method === "GET" && generationJobMatch) {
      const job = repository.readGenerationJob(decodeURIComponent(generationJobMatch[1]));
      if (!job) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Generation job was not found.", { jobId: generationJobMatch[1] }));
        return;
      }
      sendJson(response, 200, { jobId: job.id, status: job.status, cardId: job.cardId, errorCode: job.errorCode });
      return;
    }

    const cardMatch = url.pathname.match(/^\/api\/cards\/([^/]+)$/);
    if (request.method === "GET" && cardMatch) {
      const cardId = decodeURIComponent(cardMatch[1]);
      const view = url.searchParams.get("view") ?? "free";
      if (view !== "free" && view !== "full") {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Card view must be free or full.", { view }));
        return;
      }

      const card = repository.readAuraCard(cardId);
      if (!card) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId }));
        return;
      }

      if (view === "free") {
        sendJson(response, 200, freeCardResponse(card));
        return;
      }

      const entitlement = repository.readEntitlementForCard(card.id);
      if (!entitlement) {
        sendJson(response, 403, errorEnvelope("ENTITLEMENT_REQUIRED", "Unlock this card to view the full AuraCue result.", {
          cardId: card.id,
          locked: true
        }));
        return;
      }

      sendJson(response, 200, fullCardResponse(card, entitlement));
      return;
    }

    const unlockMatch = url.pathname.match(/^\/api\/cards\/([^/]+)\/unlock\/mock$/);
    if (request.method === "POST" && unlockMatch) {
      const cardId = decodeURIComponent(unlockMatch[1]);
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateUnlockInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Choose a supported local unlock method.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId }));
        return;
      }
      if (body.method === "payment") {
        const order = body.orderId ? repository.readPaymentOrder(body.orderId) : null;
        if (!order || order.cardId !== cardId || order.status !== "paid") {
          sendJson(response, 409, errorEnvelope("PAYMENT_REQUIRED", "Complete the local mock payment order before payment unlock.", {
            cardId,
            orderId: body.orderId ?? null
          }));
          return;
        }
      }
      const entitlement = repository.unlockCard({ cardId, method: body.method, orderId: body.orderId ?? null });
      sendJson(response, 200, entitlementResponse(entitlement));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/payment-orders/mock") {
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateMockPaymentOrderInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Mock payment order input is invalid.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(body.cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId: body.cardId }));
        return;
      }
      const order = repository.createMockPaymentOrder({
        cardId: body.cardId,
        amount: body.amount ?? 1.99,
        currency: body.currency ?? "USD"
      });
      sendJson(response, 201, paymentOrderResponse(order));
      return;
    }

    const paymentCompleteMatch = url.pathname.match(/^\/api\/payment-orders\/mock\/([^/]+)\/complete$/);
    if (request.method === "POST" && paymentCompleteMatch) {
      const orderId = decodeURIComponent(paymentCompleteMatch[1]);
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateMockPaymentCompletionInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Mock payment completion input is invalid.", validationDetails));
        return;
      }
      if (!repository.readPaymentOrder(orderId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Mock payment order was not found.", { orderId }));
        return;
      }
      const completed = repository.completeMockPaymentOrder(orderId, body.result);
      sendJson(response, 200, paymentOrderResponse(completed.order, completed.entitlement));
      return;
    }

    const inviteMatch = url.pathname.match(/^\/api\/invites\/([^/]+)\/events$/);
    if (request.method === "POST" && inviteMatch) {
      const cardId = decodeURIComponent(inviteMatch[1]);
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateInviteInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Invite event input is invalid.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId }));
        return;
      }
      const progress = repository.recordInviteEvent({
        cardId,
        action: body.action,
        inviteCode: body.inviteCode ?? "INVITE-LOCAL-001",
        friendId: body.friendId ?? null
      });
      sendJson(response, 200, {
        cardId,
        inviteCode: body.inviteCode ?? "INVITE-LOCAL-001",
        progress: progress.progress,
        required: progress.required,
        completed: progress.completed,
        entitlement: repository.readEntitlementForCard(cardId) ? entitlementResponse(repository.readEntitlementForCard(cardId)) : null
      });
      return;
    }

    const saveMatch = url.pathname.match(/^\/api\/cards\/([^/]+)\/save$/);
    if (request.method === "POST" && saveMatch) {
      const cardId = decodeURIComponent(saveMatch[1]);
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateSaveInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Save card input is invalid.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId }));
        return;
      }
      const saved = repository.saveCard(cardId);
      sendJson(response, 200, {
        saved: true,
        cardId,
        savedAt: saved.card.savedAt,
        source: body.source
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/share-events") {
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateShareEventInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Share event input is invalid.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(body.cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId: body.cardId }));
        return;
      }
      const shareEvent = repository.recordShareEvent({
        cardId: body.cardId,
        channel: body.channel,
        source: body.source
      });
      sendJson(response, 201, {
        shareEventId: shareEvent.id,
        cardId: shareEvent.cardId,
        channel: shareEvent.channel,
        source: shareEvent.source
      });
      return;
    }

    const shareImageMatch = url.pathname.match(/^\/api\/share-images\/([^/]+)$/);
    if (request.method === "POST" && shareImageMatch) {
      const cardId = decodeURIComponent(shareImageMatch[1]);
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateShareImageInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Share image input is invalid.", validationDetails));
        return;
      }
      if (!repository.readAuraCard(cardId)) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Aura card was not found.", { cardId }));
        return;
      }
      try {
        const rendered = repository.renderShareImage({
          cardId,
          templateId: body.templateId ?? "template-story-001",
          format: body.format ?? "story-9x16"
        });
        sendJson(response, 200, rendered);
      } catch (error) {
        sendJson(response, 404, errorEnvelope("NOT_FOUND", "Share template was not found.", {
          templateId: body.templateId ?? "template-story-001",
          message: error.message
        }));
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/analytics-events") {
      const body = await readJsonBody(request);
      if (body === null) {
        sendJson(response, 400, errorEnvelope("INVALID_JSON", "Request body must be valid JSON."));
        return;
      }
      const validationDetails = validateAnalyticsEventInput(body);
      if (validationDetails) {
        sendJson(response, 400, errorEnvelope("VALIDATION_ERROR", "Analytics event input is invalid.", validationDetails));
        return;
      }
      const analyticsEvent = repository.recordAnalyticsEvent({
        eventName: body.eventName,
        page: body.page,
        properties: body.properties ?? {}
      });
      sendJson(response, 202, {
        accepted: true,
        analyticsEventId: analyticsEvent.id
      });
      return;
    }

    sendJson(response, 404, errorEnvelope("NOT_FOUND", "Local mock endpoint not found."));
  });
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const port = Number(process.env.PORT || 4317);
  createServer().listen(port, "127.0.0.1", () => {
    console.log(`AuraCue local mock API listening on http://127.0.0.1:${port}`);
  });
}
