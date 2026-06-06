import { Prisma } from "@prisma/client";
import { renderLocalShareCard } from "@auracue/card-renderer";
import { validateAnalyticsEventInput } from "@auracue/analytics-events";
import type { ApiErrorCode } from "../api/envelope";
import {
  createCardActivationShareRepository,
  type CardActivationShareRepository,
  type CardWithLatestActivationRecord
} from "../repositories/card-activation-share-repository";

const allowedPlatforms = new Set(["web", "wechat"]);
const allowedShareChannels = new Set(["copy", "download", "web_share", "native_share"]);
const minimumHoldDurationMs = 3000;

export type CardDomainFailure = {
  ok: false;
  status: number;
  code: ApiErrorCode | "HOLD_TOO_SHORT" | "ACTIVATION_ALREADY_COMPLETED";
  message: string;
  details?: Record<string, unknown>;
};

type CardDomainSuccess<T> = {
  ok: true;
  data: T;
};

type CardDomainResult<T> = CardDomainSuccess<T> | CardDomainFailure;

export class CardActivationShareService {
  constructor(
    private readonly repository: CardActivationShareRepository = createCardActivationShareRepository()
  ) {}

  async getCard(input: { cardId?: string | null }): Promise<CardDomainResult<ReturnType<typeof cardResponse>>> {
    if (!input.cardId) {
      return validationError("cardId is required.", { field: "cardId" });
    }
    const card = await this.repository.findCardById(input.cardId);
    if (!card) {
      return notFound("Aura card was not found.", { cardId: input.cardId });
    }
    return { ok: true, data: cardResponse(card) };
  }

  async renderCard(input: {
    cardId?: string | null;
    anonymousId?: unknown;
    platform?: unknown;
  }): Promise<CardDomainResult<{
    cardId: string;
    shareImageUrl: string;
    width: 1080;
    height: 1920;
    renderer: string;
    deterministicKey: string;
    dataUrlSha256: string;
    reused: boolean;
  }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }
    if (!input.cardId) {
      return validationError("cardId is required.", { field: "cardId" });
    }
    const card = await this.repository.findCardById(input.cardId);
    if (!card || card.userId !== auth.user.id) {
      return notFound("Aura card was not found for this anonymous user.", { cardId: input.cardId });
    }
    const metadata = renderLocalShareCard({ card: { id: card.id, content: asRecord(card.content) } });
    if (card.shareImageUrl) {
      return {
        ok: true,
        data: {
          cardId: card.id,
          shareImageUrl: card.shareImageUrl,
          width: metadata.width,
          height: metadata.height,
          renderer: metadata.renderer,
          deterministicKey: metadata.deterministicKey,
          dataUrlSha256: metadata.dataUrlSha256,
          reused: true
        }
      };
    }
    const updated = await this.repository.updateCardShareImage({
      cardId: card.id,
      shareImageUrl: metadata.localPath
    });
    return {
      ok: true,
      data: {
        cardId: updated.id,
        shareImageUrl: metadata.localPath,
        width: metadata.width,
        height: metadata.height,
        renderer: metadata.renderer,
        deterministicKey: metadata.deterministicKey,
        dataUrlSha256: metadata.dataUrlSha256,
        reused: false
      }
    };
  }

  async startActivation(input: {
    cardId?: string | null;
    anonymousId?: unknown;
    platform?: unknown;
    anchorType?: unknown;
    anchorLabel?: unknown;
  }): Promise<CardDomainResult<{
    activationId: string;
    status: string;
    cardId: string;
    anchorType: string;
    anchorLabel: string;
    alreadyActivated: boolean;
  }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }
    if (!input.cardId) {
      return validationError("cardId is required.", { field: "cardId" });
    }
    const anchorType = optionalString(input.anchorType);
    const anchorLabel = optionalString(input.anchorLabel);
    if (!anchorType || !anchorLabel) {
      return validationError("anchorType and anchorLabel are required.", {
        anchorType: anchorType ?? null,
        anchorLabel: anchorLabel ?? null
      });
    }
    const card = await this.repository.findCardById(input.cardId);
    if (!card || card.userId !== auth.user.id) {
      return notFound("Aura card was not found for this anonymous user.", { cardId: input.cardId });
    }
    const existing = await this.repository.findActivationByAnchor({
      cardId: card.id,
      userId: auth.user.id,
      anchorType,
      anchorLabel
    });
    if (existing) {
      return {
        ok: true,
        data: {
          activationId: existing.id,
          status: existing.status,
          cardId: card.id,
          anchorType: existing.anchorType,
          anchorLabel: existing.anchorLabel,
          alreadyActivated: card.isActivated
        }
      };
    }
    const activation = await this.repository.createActivation({
      cardId: card.id,
      userId: auth.user.id,
      anchorType,
      anchorLabel
    });
    return {
      ok: true,
      data: {
        activationId: activation.id,
        status: activation.status,
        cardId: card.id,
        anchorType,
        anchorLabel,
        alreadyActivated: card.isActivated
      }
    };
  }

  async sealActivation(input: {
    activationId?: string | null;
    anonymousId?: unknown;
    platform?: unknown;
    holdDurationMs?: unknown;
  }): Promise<CardDomainResult<{
    activationId: string;
    cardId: string;
    sealed: boolean;
    status: string;
    activatedAt: string;
    holdDurationMs: number;
  }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }
    if (!input.activationId) {
      return validationError("activationId is required.", { field: "activationId" });
    }
    const holdDurationMs = typeof input.holdDurationMs === "number" ? input.holdDurationMs : null;
    if (holdDurationMs === null) {
      return validationError("holdDurationMs is required.", { field: "holdDurationMs" });
    }
    if (holdDurationMs < minimumHoldDurationMs) {
      return {
        ok: false,
        status: 400,
        code: "HOLD_TOO_SHORT",
        message: "Hold duration must be at least 3000ms.",
        details: { minimumHoldDurationMs, holdDurationMs }
      };
    }
    const activation = await this.repository.findActivationById(input.activationId);
    if (!activation || activation.userId !== auth.user.id) {
      return notFound("Activation was not found for this anonymous user.", { activationId: input.activationId });
    }
    if (activation.status === "sealed" && activation.sealedAt) {
      return {
        ok: true,
        data: {
          activationId: activation.id,
          cardId: activation.cardId,
          sealed: true,
          status: activation.status,
          activatedAt: activation.sealedAt.toISOString(),
          holdDurationMs: activation.holdDurationMs ?? holdDurationMs
        }
      };
    }
    const sealedAt = new Date();
    const sealed = await this.repository.sealActivation({
      activationId: activation.id,
      holdDurationMs,
      sealedAt
    });
    await this.repository.markCardActivated({ cardId: sealed.cardId, activatedAt: sealedAt });
    return {
      ok: true,
      data: {
        activationId: sealed.id,
        cardId: sealed.cardId,
        sealed: true,
        status: sealed.status,
        activatedAt: sealedAt.toISOString(),
        holdDurationMs
      }
    };
  }

  async saveCard(input: {
    cardId?: string | null;
    anonymousId?: unknown;
    platform?: unknown;
    source?: unknown;
  }): Promise<CardDomainResult<{ cardId: string; savedAt: string; savedCardId: string; idempotent: boolean }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }
    if (!input.cardId) {
      return validationError("cardId is required.", { field: "cardId" });
    }
    const card = await this.repository.findCardById(input.cardId);
    if (!card || card.userId !== auth.user.id) {
      return notFound("Aura card was not found for this anonymous user.", { cardId: input.cardId });
    }
    const existing = await this.repository.client.savedCard.findUnique({
      where: { userId_cardId: { userId: auth.user.id, cardId: card.id } }
    });
    const saved = await this.repository.saveCard({
      cardId: card.id,
      userId: auth.user.id,
      source: optionalString(input.source) ?? "result"
    });
    return {
      ok: true,
      data: {
        cardId: card.id,
        savedAt: saved.createdAt.toISOString(),
        savedCardId: saved.id,
        idempotent: Boolean(existing)
      }
    };
  }

  async shareCard(input: {
    cardId?: string | null;
    anonymousId?: unknown;
    platform?: unknown;
    channel?: unknown;
    source?: unknown;
  }): Promise<CardDomainResult<{ shareEventId: string; cardId: string; channel: string; source: string; shareUrl: string }>> {
    const auth = await this.validateKnownUser(input.anonymousId, input.platform);
    if (!auth.ok) {
      return auth;
    }
    if (!input.cardId) {
      return validationError("cardId is required.", { field: "cardId" });
    }
    const channel = optionalString(input.channel);
    const source = optionalString(input.source) ?? "share_preview";
    if (!channel || !allowedShareChannels.has(channel)) {
      return validationError("channel is not supported.", {
        allowed: Array.from(allowedShareChannels),
        channel: channel ?? null
      });
    }
    const card = await this.repository.findCardById(input.cardId);
    if (!card || card.userId !== auth.user.id) {
      return notFound("Aura card was not found for this anonymous user.", { cardId: input.cardId });
    }
    const event = await this.repository.createShareEvent({
      cardId: card.id,
      userId: auth.user.id,
      channel,
      source
    });
    return {
      ok: true,
      data: {
        shareEventId: event.id,
        cardId: card.id,
        channel,
        source,
        shareUrl: `/share/${card.id}`
      }
    };
  }

  async recordAnalytics(input: {
    anonymousId?: unknown;
    platform?: unknown;
    eventName?: unknown;
    page?: unknown;
    payload?: unknown;
  }): Promise<CardDomainResult<{ analyticsEventId: string; eventName: string; page: string }>> {
    const platform = validatePlatform(input.platform);
    if (!platform.ok) {
      return platform;
    }
    const validation = validateAnalyticsEventInput(input);
    if (validation) {
      return validationError("Analytics event is invalid.", validation);
    }
    const anonymousId = optionalString(input.anonymousId);
    const user = anonymousId ? await this.repository.findUserByAnonymousId(anonymousId) : null;
    if (anonymousId && !user) {
      return notFound("Anonymous user was not found.", { anonymousId });
    }
    const event = await this.repository.createAnalyticsEvent({
      userId: user?.id ?? null,
      eventName: input.eventName as string,
      page: input.page as string,
      platform: platform.platform,
      payload: asRecord(input.payload) as Prisma.InputJsonObject
    });
    return {
      ok: true,
      data: {
        analyticsEventId: event.id,
        eventName: event.eventName,
        page: event.page ?? ""
      }
    };
  }

  private async validateKnownUser(
    anonymousIdInput: unknown,
    platformInput: unknown
  ): Promise<CardDomainFailure | { ok: true; user: NonNullable<Awaited<ReturnType<CardActivationShareRepository["findUserByAnonymousId"]>>>; platform: string }> {
    const platform = validatePlatform(platformInput);
    if (!platform.ok) {
      return platform;
    }
    const anonymousId = optionalString(anonymousIdInput);
    if (!anonymousId) {
      return validationError("anonymousId is required.", { field: "anonymousId" });
    }
    const user = await this.repository.findUserByAnonymousId(anonymousId);
    if (!user) {
      return notFound("Anonymous user was not found.", { anonymousId });
    }
    return { ok: true, user, platform: platform.platform };
  }
}

export function createCardActivationShareService(repository?: CardActivationShareRepository) {
  return new CardActivationShareService(repository);
}

function validatePlatform(platformInput: unknown): CardDomainFailure | { ok: true; platform: string } {
  const platform = optionalString(platformInput);
  if (!platform || !allowedPlatforms.has(platform)) {
    return validationError("platform must be web or wechat.", {
      field: "platform",
      allowed: Array.from(allowedPlatforms),
      actual: platform ?? null
    });
  }
  return { ok: true, platform };
}

function cardResponse(card: CardWithLatestActivationRecord) {
  const latestActivation = card.activations[0] ?? null;
  return {
    cardId: card.id,
    ownerAnonymousId: card.user.anonymousId,
    mood: card.mood,
    context: card.context,
    drawSeed: card.drawSeed,
    drawPosition: card.drawPosition,
    content: asRecord(card.content),
    shareImageUrl: card.shareImageUrl,
    isActivated: card.isActivated,
    activatedAt: card.activatedAt?.toISOString() ?? null,
    activation: latestActivation
      ? {
          activationId: latestActivation.id,
          status: latestActivation.status,
          anchorType: latestActivation.anchorType,
          anchorLabel: latestActivation.anchorLabel,
          holdDurationMs: latestActivation.holdDurationMs,
          startedAt: latestActivation.startedAt.toISOString(),
          sealedAt: latestActivation.sealedAt?.toISOString() ?? null
        }
      : null,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString()
  };
}

function validationError(message: string, details: Record<string, unknown>): CardDomainFailure {
  return { ok: false, status: 400, code: "VALIDATION_ERROR", message, details };
}

function notFound(message: string, details: Record<string, unknown>): CardDomainFailure {
  return { ok: false, status: 404, code: "NOT_FOUND", message, details };
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
