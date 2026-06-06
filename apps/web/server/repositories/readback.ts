import type { PrismaClient } from "@prisma/client";

export const p0ModelNames = [
  "AnonymousUser",
  "OutfitUpload",
  "DrawSession",
  "GenerationJob",
  "AuraCard",
  "AuraActivation",
  "SavedCard",
  "ShareEvent",
  "AnalyticsEvent",
  "CardTemplate"
] as const;

export async function readP0ModelCounts(client: PrismaClient) {
  const [
    anonymousUsers,
    outfitUploads,
    drawSessions,
    generationJobs,
    auraCards,
    auraActivations,
    savedCards,
    shareEvents,
    analyticsEvents,
    cardTemplates
  ] = await Promise.all([
    client.anonymousUser.count(),
    client.outfitUpload.count(),
    client.drawSession.count(),
    client.generationJob.count(),
    client.auraCard.count(),
    client.auraActivation.count(),
    client.savedCard.count(),
    client.shareEvent.count(),
    client.analyticsEvent.count(),
    client.cardTemplate.count()
  ]);

  return {
    AnonymousUser: anonymousUsers,
    OutfitUpload: outfitUploads,
    DrawSession: drawSessions,
    GenerationJob: generationJobs,
    AuraCard: auraCards,
    AuraActivation: auraActivations,
    SavedCard: savedCards,
    ShareEvent: shareEvents,
    AnalyticsEvent: analyticsEvents,
    CardTemplate: cardTemplates
  };
}

export async function readSeedFixture(client: PrismaClient) {
  const user = await client.anonymousUser.findUnique({
    where: { anonymousId: "anon_web_seed_001" },
    include: {
      uploads: true,
      drawSessions: true,
      jobs: true,
      cards: {
        include: {
          activations: true,
          savedCards: true,
          shares: true
        }
      },
      analytics: true
    }
  });

  const templates = await client.cardTemplate.findMany({
    orderBy: { id: "asc" }
  });

  return { user, templates };
}
