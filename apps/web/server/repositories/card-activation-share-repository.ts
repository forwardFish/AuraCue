import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma-client";

export type CardWithLatestActivationRecord = Prisma.AuraCardGetPayload<{
  include: {
    user: true;
    activations: { orderBy: { startedAt: "desc" }; take: 1 };
  };
}>;

export type ActivationWithCardRecord = Prisma.AuraActivationGetPayload<{
  include: { card: true; user: true };
}>;

export type CardActivationShareRepository = {
  client: PrismaClient;
  findUserByAnonymousId(anonymousId: string): Promise<Awaited<ReturnType<PrismaClient["anonymousUser"]["findUnique"]>>>;
  findCardById(cardId: string): Promise<CardWithLatestActivationRecord | null>;
  updateCardShareImage(input: { cardId: string; shareImageUrl: string }): Promise<CardWithLatestActivationRecord>;
  findActivationByAnchor(input: {
    cardId: string;
    userId: string;
    anchorType: string;
    anchorLabel: string;
  }): Promise<ActivationWithCardRecord | null>;
  createActivation(input: {
    cardId: string;
    userId: string;
    anchorType: string;
    anchorLabel: string;
  }): Promise<ActivationWithCardRecord>;
  findActivationById(activationId: string): Promise<ActivationWithCardRecord | null>;
  sealActivation(input: {
    activationId: string;
    holdDurationMs: number;
    sealedAt: Date;
  }): Promise<ActivationWithCardRecord>;
  markCardActivated(input: { cardId: string; activatedAt: Date }): Promise<void>;
  saveCard(input: { cardId: string; userId: string; source: string }): Promise<Awaited<ReturnType<PrismaClient["savedCard"]["upsert"]>>>;
  createShareEvent(input: { cardId: string; userId: string; channel: string; source: string }): Promise<Awaited<ReturnType<PrismaClient["shareEvent"]["create"]>>>;
  createAnalyticsEvent(input: {
    userId: string | null;
    eventName: string;
    page: string;
    platform: string;
    payload: Prisma.InputJsonValue;
  }): Promise<Awaited<ReturnType<PrismaClient["analyticsEvent"]["create"]>>>;
};

export function createCardActivationShareRepository(
  client: PrismaClient = prisma
): CardActivationShareRepository {
  return {
    client,
    findUserByAnonymousId(anonymousId) {
      return client.anonymousUser.findUnique({ where: { anonymousId } });
    },
    findCardById(cardId) {
      return client.auraCard.findUnique({
        where: { id: cardId },
        include: {
          user: true,
          activations: {
            orderBy: { startedAt: "desc" },
            take: 1
          }
        }
      });
    },
    updateCardShareImage(input) {
      return client.auraCard.update({
        where: { id: input.cardId },
        data: { shareImageUrl: input.shareImageUrl },
        include: {
          user: true,
          activations: {
            orderBy: { startedAt: "desc" },
            take: 1
          }
        }
      });
    },
    findActivationByAnchor(input) {
      return client.auraActivation.findUnique({
        where: {
          cardId_userId_anchorType_anchorLabel: {
            cardId: input.cardId,
            userId: input.userId,
            anchorType: input.anchorType,
            anchorLabel: input.anchorLabel
          }
        },
        include: { card: true, user: true }
      });
    },
    createActivation(input) {
      return client.auraActivation.create({
        data: {
          cardId: input.cardId,
          userId: input.userId,
          anchorType: input.anchorType,
          anchorLabel: input.anchorLabel,
          status: "started"
        },
        include: { card: true, user: true }
      });
    },
    findActivationById(activationId) {
      return client.auraActivation.findUnique({
        where: { id: activationId },
        include: { card: true, user: true }
      });
    },
    async sealActivation(input) {
      return client.auraActivation.update({
        where: { id: input.activationId },
        data: {
          status: "sealed",
          holdDurationMs: input.holdDurationMs,
          sealedAt: input.sealedAt
        },
        include: { card: true, user: true }
      });
    },
    async markCardActivated(input) {
      await client.auraCard.update({
        where: { id: input.cardId },
        data: {
          isActivated: true,
          activatedAt: input.activatedAt
        }
      });
    },
    saveCard(input) {
      return client.savedCard.upsert({
        where: {
          userId_cardId: {
            userId: input.userId,
            cardId: input.cardId
          }
        },
        update: { source: input.source },
        create: {
          userId: input.userId,
          cardId: input.cardId,
          source: input.source
        }
      });
    },
    createShareEvent(input) {
      return client.shareEvent.create({ data: input });
    },
    createAnalyticsEvent(input) {
      return client.analyticsEvent.create({ data: input });
    }
  };
}
