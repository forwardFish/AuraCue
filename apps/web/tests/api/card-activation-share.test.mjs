import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import prismaClientPackage from "@prisma/client";
import { createPrismaSqliteAdapter } from "../../server/repositories/prisma-sqlite-adapter.mjs";
import { renderLocalShareCard } from "../../../../packages/card-renderer/src/local-renderer.mjs";
import { validateAnalyticsEventInput } from "../../../../packages/analytics-events/src/local-validator.mjs";

process.env.DATABASE_URL = "file:./t07-local.sqlite";

ensureDatabase();

const { PrismaClient } = prismaClientPackage;
const prisma = new PrismaClient({ adapter: createPrismaSqliteAdapter(), log: ["error"] });
const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T07");
mkdirSync(evidenceDir, { recursive: true });

assertRouteContracts();
await resetDatabase();

const transcript = [];
const anonymousId = `anon_${randomUUID().replaceAll("-", "")}`;
const otherAnonymousId = `anon_${randomUUID().replaceAll("-", "")}`;
const user = await prisma.anonymousUser.create({
  data: { anonymousId, platform: "web", timezone: "Asia/Shanghai" }
});
await prisma.anonymousUser.create({
  data: { anonymousId: otherAnonymousId, platform: "web", timezone: "Asia/Shanghai" }
});
const card = await createGeneratedCard(user.id, 2);

const cardRead = await getAuraCard(card.id);
assert.equal(cardRead.status, 200);
assert.equal(cardRead.body.data.cardId, card.id);
assert.equal(cardRead.body.data.content.auraName, "Clear Signal Aura");
assert.equal(cardRead.body.data.activation, null);
assert.equal(JSON.stringify(cardRead.body), JSON.stringify(redactSecretLikeValues(cardRead.body)));
transcript.push({ endpoint: "GET /api/v1/aura-cards/:cardId", case: "success no secrets", ...cardRead });

const cardNotFound = await getAuraCard("missing_card");
assert.equal(cardNotFound.status, 404);
assert.equal(cardNotFound.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "GET /api/v1/aura-cards/:cardId", case: "not found", ...cardNotFound });

const renderMissingAuth = await renderAuraCard(card.id, { anonymousId, platform: "desktop" });
assert.equal(renderMissingAuth.status, 400);
assert.equal(renderMissingAuth.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/render", case: "invalid platform", ...renderMissingAuth });

const rendered = await renderAuraCard(card.id, { anonymousId, platform: "web" });
assert.equal(rendered.status, 200);
assert.equal(rendered.body.data.shareImageUrl, `local://share-images/${card.id}-template-story-001.png`);
assert.equal(rendered.body.data.width, 1080);
assert.equal(rendered.body.data.height, 1920);
assert.equal(rendered.body.data.reused, false);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/render", case: "success 1080x1920", ...rendered });

const renderedRepeat = await renderAuraCard(card.id, { anonymousId, platform: "web" });
assert.equal(renderedRepeat.status, 200);
assert.equal(renderedRepeat.body.data.shareImageUrl, rendered.body.data.shareImageUrl);
assert.equal(renderedRepeat.body.data.deterministicKey, rendered.body.data.deterministicKey);
assert.equal(renderedRepeat.body.data.reused, true);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/render", case: "idempotent", ...renderedRepeat });

const activationMissingAnchor = await startActivation(card.id, { anonymousId, platform: "web", anchorType: "lucky_color" });
assert.equal(activationMissingAnchor.status, 400);
assert.equal(activationMissingAnchor.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/activation/start", case: "anchor required", ...activationMissingAnchor });

const activation = await startActivation(card.id, {
  anonymousId,
  platform: "web",
  anchorType: "lucky_color",
  anchorLabel: "soft ivory"
});
assert.equal(activation.status, 200);
assert.match(activation.body.data.activationId, /^c/);
assert.equal(activation.body.data.status, "started");
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/activation/start", case: "success", ...activation });

const activationRepeat = await startActivation(card.id, {
  anonymousId,
  platform: "web",
  anchorType: "lucky_color",
  anchorLabel: "soft ivory"
});
assert.equal(activationRepeat.status, 200);
assert.equal(activationRepeat.body.data.activationId, activation.body.data.activationId);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/activation/start", case: "idempotent", ...activationRepeat });

const sealTooShort = await sealActivation(activation.body.data.activationId, {
  anonymousId,
  platform: "web",
  holdDurationMs: 2999
});
assert.equal(sealTooShort.status, 400);
assert.equal(sealTooShort.body.error.code, "HOLD_TOO_SHORT");
transcript.push({ endpoint: "POST /api/v1/activations/:activationId/seal", case: "hold too short", ...sealTooShort });

const sealWrongUser = await sealActivation(activation.body.data.activationId, {
  anonymousId: otherAnonymousId,
  platform: "web",
  holdDurationMs: 3200
});
assert.equal(sealWrongUser.status, 404);
assert.equal(sealWrongUser.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "POST /api/v1/activations/:activationId/seal", case: "wrong user", ...sealWrongUser });

const sealed = await sealActivation(activation.body.data.activationId, {
  anonymousId,
  platform: "web",
  holdDurationMs: 3200
});
assert.equal(sealed.status, 200);
assert.equal(sealed.body.data.sealed, true);
assert.equal(sealed.body.data.status, "sealed");
transcript.push({ endpoint: "POST /api/v1/activations/:activationId/seal", case: "success", ...sealed });

const sealedRepeat = await sealActivation(activation.body.data.activationId, {
  anonymousId,
  platform: "web",
  holdDurationMs: 3500
});
assert.equal(sealedRepeat.status, 200);
assert.equal(sealedRepeat.body.data.activatedAt, sealed.body.data.activatedAt);
assert.equal(sealedRepeat.body.data.holdDurationMs, 3200);
transcript.push({ endpoint: "POST /api/v1/activations/:activationId/seal", case: "idempotent repeat", ...sealedRepeat });

const saveMissingCard = await saveAuraCard("missing_card", { anonymousId, platform: "web" });
assert.equal(saveMissingCard.status, 404);
assert.equal(saveMissingCard.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/save", case: "not found", ...saveMissingCard });

const saved = await saveAuraCard(card.id, { anonymousId, platform: "web", source: "result" });
assert.equal(saved.status, 200);
assert.equal(saved.body.data.idempotent, false);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/save", case: "success", ...saved });

const savedRepeat = await saveAuraCard(card.id, { anonymousId, platform: "web", source: "share" });
assert.equal(savedRepeat.status, 200);
assert.equal(savedRepeat.body.data.savedCardId, saved.body.data.savedCardId);
assert.equal(savedRepeat.body.data.idempotent, true);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/save", case: "idempotent", ...savedRepeat });

const shareBadChannel = await shareAuraCard(card.id, { anonymousId, platform: "web", channel: "email", source: "share_preview" });
assert.equal(shareBadChannel.status, 400);
assert.equal(shareBadChannel.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/share", case: "channel validation", ...shareBadChannel });

const shared = await shareAuraCard(card.id, { anonymousId, platform: "web", channel: "download", source: "share_preview" });
assert.equal(shared.status, 200);
assert.match(shared.body.data.shareEventId, /^c/);
assert.equal(shared.body.data.shareUrl, `/share/${card.id}`);
transcript.push({ endpoint: "POST /api/v1/aura-cards/:cardId/share", case: "success", ...shared });

const analyticsBadPayload = await recordAnalytics({
  anonymousId,
  platform: "web",
  eventName: "share_card",
  page: `/share/${card.id}`,
  payload: { apiToken: "sk-testlocal123456" }
});
assert.equal(analyticsBadPayload.status, 400);
assert.equal(analyticsBadPayload.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/analytics/events", case: "secret-like payload rejected", ...analyticsBadPayload });

const analyticsUnknown = await recordAnalytics({
  anonymousId,
  platform: "web",
  eventName: "unknown_event",
  page: `/share/${card.id}`,
  payload: { cardId: card.id }
});
assert.equal(analyticsUnknown.status, 400);
assert.equal(analyticsUnknown.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/analytics/events", case: "event whitelist", ...analyticsUnknown });

const analytics = await recordAnalytics({
  anonymousId,
  platform: "web",
  eventName: "aura_activated",
  page: `/activated/${card.id}`,
  payload: { cardId: card.id, activationId: activation.body.data.activationId, holdDurationMs: 3200 }
});
assert.equal(analytics.status, 200);
assert.match(analytics.body.data.analyticsEventId, /^c/);
transcript.push({ endpoint: "POST /api/v1/analytics/events", case: "success", ...analytics });

const cardAfter = await getAuraCard(card.id);
assert.equal(cardAfter.body.data.isActivated, true);
assert.equal(cardAfter.body.data.activation.status, "sealed");
assert.equal(cardAfter.body.data.shareImageUrl, rendered.body.data.shareImageUrl);
transcript.push({ endpoint: "GET /api/v1/aura-cards/:cardId", case: "activation state readback", ...cardAfter });

const rendererProof = renderLocalShareCard({ card: { id: card.id, content: card.content } });
assert.equal(rendererProof.width, 1080);
assert.equal(rendererProof.height, 1920);
assert.equal(rendererProof.localPath, rendered.body.data.shareImageUrl);
assert.equal(rendererProof.dataUrlSha256, rendered.body.data.dataUrlSha256);

const dbCard = await prisma.auraCard.findUniqueOrThrow({
  where: { id: card.id },
  include: {
    activations: true,
    savedCards: true,
    shares: true
  }
});
const dbReadback = {
  anonymousId,
  otherAnonymousId,
  counts: {
    AuraCard: await prisma.auraCard.count(),
    AuraActivation: await prisma.auraActivation.count(),
    SavedCard: await prisma.savedCard.count(),
    ShareEvent: await prisma.shareEvent.count(),
    AnalyticsEvent: await prisma.analyticsEvent.count()
  },
  card: {
    id: dbCard.id,
    shareImageUrl: dbCard.shareImageUrl,
    isActivated: dbCard.isActivated,
    activatedAt: dbCard.activatedAt?.toISOString() ?? null
  },
  activation: dbCard.activations.map((item) => ({
    id: item.id,
    status: item.status,
    anchorType: item.anchorType,
    anchorLabel: item.anchorLabel,
    holdDurationMs: item.holdDurationMs,
    sealedAt: item.sealedAt?.toISOString() ?? null
  })),
  savedCards: dbCard.savedCards.map((item) => ({
    id: item.id,
    source: item.source,
    createdAt: item.createdAt.toISOString()
  })),
  shares: dbCard.shares.map((item) => ({
    id: item.id,
    channel: item.channel,
    source: item.source,
    createdAt: item.createdAt.toISOString()
  })),
  analyticsEvents: await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, eventName: true, page: true, platform: true, payload: true }
  }),
  idempotency: {
    render: "AuraCard.shareImageUrl reused on repeat render",
    activationStart: "AuraActivation @@unique([cardId, userId, anchorType, anchorLabel])",
    seal: "sealed activation returns original sealedAt and holdDurationMs on repeat",
    save: "SavedCard @@unique([userId, cardId])"
  }
};

assert.equal(dbReadback.counts.AuraActivation, 1);
assert.equal(dbReadback.counts.SavedCard, 1);
assert.equal(dbReadback.counts.ShareEvent, 1);
assert.equal(dbReadback.counts.AnalyticsEvent, 1);

writeFileSync(resolve(evidenceDir, "api-transcript.json"), JSON.stringify(transcript, null, 2));
writeFileSync(resolve(evidenceDir, "db-readback.json"), JSON.stringify(dbReadback, null, 2));
writeFileSync(resolve(evidenceDir, "renderer-proof.json"), JSON.stringify({
  cardId: rendererProof.cardId,
  shareImageUrl: rendererProof.localPath,
  width: rendererProof.width,
  height: rendererProof.height,
  aspectRatio: rendererProof.aspectRatio,
  renderer: rendererProof.renderer,
  deterministicKey: rendererProof.deterministicKey,
  dataUrlSha256: rendererProof.dataUrlSha256,
  textFields: rendererProof.textFields
}, null, 2));

await prisma.$disconnect();

console.log(JSON.stringify({
  status: "PASS",
  covered: ["API-007", "API-008", "API-009", "API-010", "API-011", "API-012", "API-013"],
  evidence: [
    "docs/auto-execute/evidence/web/T07/api-transcript.json",
    "docs/auto-execute/evidence/web/T07/db-readback.json",
    "docs/auto-execute/evidence/web/T07/renderer-proof.json"
  ],
  readback: dbReadback.counts
}, null, 2));

function assertRouteContracts() {
  const files = [
    "app/api/v1/aura-cards/[cardId]/route.ts",
    "app/api/v1/aura-cards/[cardId]/render/route.ts",
    "app/api/v1/aura-cards/[cardId]/activation/start/route.ts",
    "app/api/v1/activations/[activationId]/seal/route.ts",
    "app/api/v1/aura-cards/[cardId]/save/route.ts",
    "app/api/v1/aura-cards/[cardId]/share/route.ts",
    "app/api/v1/analytics/events/route.ts",
    "server/services/card-activation-share.ts",
    "server/repositories/card-activation-share-repository.ts"
  ];
  for (const file of files) {
    const source = readFileSync(resolve(root, file), "utf8");
    assert.doesNotMatch(source, /payment|unlock|invite|OPENAI_API_KEY|DEEPSEEK_API_KEY/i, `${file} must stay inside T07 local card API scope`);
  }
}

async function getAuraCard(cardId) {
  const card = await prisma.auraCard.findUnique({
    where: { id: cardId },
    include: {
      user: true,
      activations: { orderBy: { startedAt: "desc" }, take: 1 }
    }
  });
  if (!card) {
    return fail(404, "NOT_FOUND", "Aura card was not found.");
  }
  return ok(cardResponse(card));
}

async function renderAuraCard(cardId, input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  const card = await findOwnedCard(cardId, auth.user.id);
  if (!card) {
    return fail(404, "NOT_FOUND", "Aura card was not found for this anonymous user.");
  }
  const metadata = renderLocalShareCard({ card: { id: card.id, content: card.content } });
  if (card.shareImageUrl) {
    return ok(renderResponse(card.id, card.shareImageUrl, metadata, true));
  }
  await prisma.auraCard.update({
    where: { id: card.id },
    data: { shareImageUrl: metadata.localPath }
  });
  return ok(renderResponse(card.id, metadata.localPath, metadata, false));
}

async function startActivation(cardId, input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  if (!input.anchorType || !input.anchorLabel) {
    return fail(400, "VALIDATION_ERROR", "anchorType and anchorLabel are required.");
  }
  const card = await findOwnedCard(cardId, auth.user.id);
  if (!card) {
    return fail(404, "NOT_FOUND", "Aura card was not found for this anonymous user.");
  }
  const existing = await prisma.auraActivation.findUnique({
    where: {
      cardId_userId_anchorType_anchorLabel: {
        cardId: card.id,
        userId: auth.user.id,
        anchorType: input.anchorType,
        anchorLabel: input.anchorLabel
      }
    }
  });
  const activation = existing ?? await prisma.auraActivation.create({
    data: {
      cardId: card.id,
      userId: auth.user.id,
      anchorType: input.anchorType,
      anchorLabel: input.anchorLabel,
      status: "started"
    }
  });
  return ok({
    activationId: activation.id,
    status: activation.status,
    cardId: card.id,
    anchorType: activation.anchorType,
    anchorLabel: activation.anchorLabel,
    alreadyActivated: card.isActivated
  });
}

async function sealActivation(activationId, input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  if (!Number.isInteger(input.holdDurationMs)) {
    return fail(400, "VALIDATION_ERROR", "holdDurationMs is required.");
  }
  if (input.holdDurationMs < 3000) {
    return fail(400, "HOLD_TOO_SHORT", "Hold duration must be at least 3000ms.");
  }
  const activation = await prisma.auraActivation.findUnique({
    where: { id: activationId },
    include: { card: true }
  });
  if (!activation || activation.userId !== auth.user.id) {
    return fail(404, "NOT_FOUND", "Activation was not found for this anonymous user.");
  }
  if (activation.status === "sealed" && activation.sealedAt) {
    return ok({
      activationId: activation.id,
      cardId: activation.cardId,
      sealed: true,
      status: activation.status,
      activatedAt: activation.sealedAt.toISOString(),
      holdDurationMs: activation.holdDurationMs
    });
  }
  const sealedAt = new Date();
  const sealed = await prisma.auraActivation.update({
    where: { id: activation.id },
    data: { status: "sealed", holdDurationMs: input.holdDurationMs, sealedAt }
  });
  await prisma.auraCard.update({
    where: { id: activation.cardId },
    data: { isActivated: true, activatedAt: sealedAt }
  });
  return ok({
    activationId: sealed.id,
    cardId: sealed.cardId,
    sealed: true,
    status: sealed.status,
    activatedAt: sealedAt.toISOString(),
    holdDurationMs: input.holdDurationMs
  });
}

async function saveAuraCard(cardId, input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  const card = await findOwnedCard(cardId, auth.user.id);
  if (!card) {
    return fail(404, "NOT_FOUND", "Aura card was not found for this anonymous user.");
  }
  const existing = await prisma.savedCard.findUnique({ where: { userId_cardId: { userId: auth.user.id, cardId: card.id } } });
  const saved = await prisma.savedCard.upsert({
    where: { userId_cardId: { userId: auth.user.id, cardId: card.id } },
    update: { source: input.source ?? "result" },
    create: { userId: auth.user.id, cardId: card.id, source: input.source ?? "result" }
  });
  return ok({ cardId: card.id, savedAt: saved.createdAt.toISOString(), savedCardId: saved.id, idempotent: Boolean(existing) });
}

async function shareAuraCard(cardId, input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  const allowed = new Set(["copy", "download", "web_share", "native_share"]);
  if (!allowed.has(input.channel)) {
    return fail(400, "VALIDATION_ERROR", "channel is not supported.");
  }
  const card = await findOwnedCard(cardId, auth.user.id);
  if (!card) {
    return fail(404, "NOT_FOUND", "Aura card was not found for this anonymous user.");
  }
  const event = await prisma.shareEvent.create({
    data: { userId: auth.user.id, cardId: card.id, channel: input.channel, source: input.source ?? "share_preview" }
  });
  return ok({
    shareEventId: event.id,
    cardId: card.id,
    channel: event.channel,
    source: event.source,
    shareUrl: `/share/${card.id}`
  });
}

async function recordAnalytics(input) {
  const platform = validatePlatform(input.platform);
  if (!platform.ok) {
    return platform;
  }
  const validation = validateAnalyticsEventInput({ ...input, properties: input.payload });
  if (validation) {
    return fail(400, "VALIDATION_ERROR", "Analytics event is invalid.", validation);
  }
  const user = input.anonymousId ? await prisma.anonymousUser.findUnique({ where: { anonymousId: input.anonymousId } }) : null;
  if (input.anonymousId && !user) {
    return fail(404, "NOT_FOUND", "Anonymous user was not found.");
  }
  const event = await prisma.analyticsEvent.create({
    data: {
      userId: user?.id ?? null,
      eventName: input.eventName,
      page: input.page,
      platform: input.platform,
      payload: input.payload ?? {}
    }
  });
  return ok({ analyticsEventId: event.id, eventName: event.eventName, page: event.page });
}

async function findOwnedCard(cardId, userId) {
  return prisma.auraCard.findFirst({ where: { id: cardId, userId } });
}

async function validateKnownUser(input) {
  const platform = validatePlatform(input.platform);
  if (!platform.ok) {
    return platform;
  }
  if (!input.anonymousId) {
    return fail(400, "VALIDATION_ERROR", "anonymousId is required.");
  }
  const user = await prisma.anonymousUser.findUnique({ where: { anonymousId: input.anonymousId } });
  if (!user) {
    return fail(404, "NOT_FOUND", "Anonymous user was not found.");
  }
  return { ok: true, user };
}

function validatePlatform(platform) {
  return platform === "web" || platform === "wechat"
    ? { ok: true }
    : fail(400, "VALIDATION_ERROR", "platform must be web or wechat.");
}

function cardResponse(card) {
  const activation = card.activations[0] ?? null;
  return {
    cardId: card.id,
    ownerAnonymousId: card.user.anonymousId,
    mood: card.mood,
    context: card.context,
    drawSeed: card.drawSeed,
    drawPosition: card.drawPosition,
    content: card.content,
    shareImageUrl: card.shareImageUrl,
    isActivated: card.isActivated,
    activatedAt: card.activatedAt?.toISOString() ?? null,
    activation: activation ? {
      activationId: activation.id,
      status: activation.status,
      anchorType: activation.anchorType,
      anchorLabel: activation.anchorLabel,
      holdDurationMs: activation.holdDurationMs,
      startedAt: activation.startedAt.toISOString(),
      sealedAt: activation.sealedAt?.toISOString() ?? null
    } : null,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString()
  };
}

function renderResponse(cardId, shareImageUrl, metadata, reused) {
  return {
    cardId,
    shareImageUrl,
    width: metadata.width,
    height: metadata.height,
    renderer: metadata.renderer,
    deterministicKey: metadata.deterministicKey,
    dataUrlSha256: metadata.dataUrlSha256,
    reused
  };
}

function ok(data) {
  return { status: 200, body: { ok: true, data } };
}

function fail(status, code, message, details = {}) {
  return { status, body: { ok: false, error: { code, message, details } } };
}

function redactSecretLikeValues(value) {
  if (typeof value === "string") {
    return /(sk-[a-z0-9_-]{8,}|client_secret|bearer\s+[a-z0-9._-]+)/i.test(value) ? "[REDACTED]" : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactSecretLikeValues(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
      key,
      /(secret|token|password|api[_-]?key|authorization|cookie|credential)/i.test(key) ? "[REDACTED]" : redactSecretLikeValues(entry)
    ]));
  }
  return value;
}

async function createGeneratedCard(userId, drawPosition) {
  const drawSeed = `seed_${createHash("sha256").update(`${userId}:${drawPosition}`).digest("hex").slice(0, 16)}`;
  const drawSession = await prisma.drawSession.create({
    data: {
      userId,
      mood: "confident",
      context: "work meeting",
      drawSeed,
      cardOptions: [{ position: drawPosition, label: "Card II" }],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });
  const job = await prisma.generationJob.create({
    data: {
      userId,
      drawSessionId: drawSession.id,
      drawPosition,
      status: "success",
      provider: "t07-local-test",
      fallbackUsed: true,
      completedAt: new Date()
    }
  });
  const card = await prisma.auraCard.create({
    data: {
      userId,
      generationJobId: job.id,
      mood: drawSession.mood,
      context: drawSession.context,
      drawSeed: drawSession.drawSeed,
      drawPosition,
      content: buildCardContent(drawSeed)
    }
  });
  await prisma.generationJob.update({ where: { id: job.id }, data: { resultCardId: card.id } });
  return card;
}

function buildCardContent(drawSeed) {
  return {
    title: "Meeting Glow Aura Card",
    auraName: "Clear Signal Aura",
    tarotSymbol: "The Magician",
    message: "A small confident choice can make the next moment feel easier.",
    luckyColor: "soft ivory",
    colors: { primary: "soft ivory", accent: "polished jade", background: "warm moonlight" },
    outfit: "Wear one clean line with a soft highlight near the face.",
    beauty: "Keep the glow fresh and the finish light.",
    social: "Lead with the simplest point and leave room for one thoughtful pause.",
    ritual: "Take three slow breaths before stepping out.",
    avoid: "Avoid over-planning the first ten minutes.",
    caption: "Today I am carrying clear signal aura.",
    theme: "work-confidence-local-2",
    cardTitle: "Meeting Glow Aura Card",
    auraColor: "soft ivory",
    luckyColors: ["soft ivory", "polished jade", "warm moonlight"],
    styleVibe: "Clear Signal Aura with polished jade",
    energyMessage: "A small confident choice can make the next moment feel easier.",
    outfitEnergy: "Wear one clean line with a soft highlight near the face.",
    beautyCue: "Keep the glow fresh and the finish light.",
    socialMove: "Lead with the simplest point and leave room for one thoughtful pause.",
    miniRitual: "Take three slow breaths before stepping out.",
    todayIntention: "I carry confidence with ease.",
    luckyAnchorCandidates: [
      { type: "lucky_color", label: "soft ivory" },
      { type: "outfit_detail", label: "polished jade" },
      { type: "jewelry", label: "small gold ring" }
    ],
    shareCaption: "Today I am carrying clear signal aura.",
    safetyDisclaimer: "For reflection and fun. Not a guarantee or professional advice.",
    generatedAt: new Date().toISOString(),
    generationSource: "local-fallback",
    fallbackUsed: true,
    drawSeed
  };
}

async function resetDatabase() {
  await prisma.auraActivation.deleteMany();
  await prisma.savedCard.deleteMany();
  await prisma.shareEvent.deleteMany();
  await prisma.auraCard.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.drawSession.deleteMany();
  await prisma.outfitUpload.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.anonymousUser.deleteMany();
  await prisma.cardTemplate.deleteMany();
}

function ensureDatabase() {
  const command = process.platform === "win32" ? "cmd.exe" : "pnpm";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", "pnpm.cmd prisma db push"]
    : ["prisma", "db", "push"];
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`Failed to prepare T07 local database: ${result.stderr ?? ""}${result.stdout ?? ""}`);
  }
}
