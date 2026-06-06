import prismaClientPackage from "@prisma/client";
import { createPrismaSqliteAdapter } from "../server/repositories/prisma-sqlite-adapter.mjs";

const { PrismaClient } = prismaClientPackage;
const prisma = new PrismaClient({ adapter: createPrismaSqliteAdapter(), log: ["error"] });

const fixedNow = new Date("2026-06-04T00:00:00.000Z");
const activatedAt = new Date("2026-06-04T00:04:00.000Z");

const cardContent = {
  auraName: "Quiet Power Bloom",
  cardTitle: "Today's Aura Cue",
  luckyColors: ["warm gold", "moon ivory"],
  styleVibe: "Soft confidence with a polished glow.",
  energyMessage: "Move through the day with calm focus and visible warmth.",
  miniRitual: "Touch your chosen anchor, breathe once, and name the next right step.",
  todayIntention: "I make the day feel clear, kind, and mine.",
  luckyAnchorSuggestions: [
    {
      type: "jewelry",
      label: "Gold ring",
      reason: "A small bright anchor keeps the intention easy to remember."
    }
  ],
  safetyNote: "For reflection and styling inspiration only."
};

const drawCards = [
  { position: 1, backTheme: "warm_gold_01" },
  { position: 2, backTheme: "moon_silver_01" },
  { position: 3, backTheme: "rose_charm_01" }
];

async function main() {
  await prisma.cardTemplate.upsert({
    where: { id: "warm_gold_01" },
    update: {},
    create: {
      id: "warm_gold_01",
      name: "Warm Gold",
      format: "story-9x16",
      version: "1.0.0",
      config: {
        background: "ivory_blush_gradient",
        accent: "soft_gold",
        typography: "elegant_serif_heading_sans_body"
      },
      isActive: true
    }
  });

  await prisma.cardTemplate.upsert({
    where: { id: "moon_silver_01" },
    update: {},
    create: {
      id: "moon_silver_01",
      name: "Moon Silver",
      format: "story-9x16",
      version: "1.0.0",
      config: {
        background: "navy_moon_gradient",
        accent: "silver"
      },
      isActive: true
    }
  });

  await prisma.cardTemplate.upsert({
    where: { id: "rose_charm_01" },
    update: {},
    create: {
      id: "rose_charm_01",
      name: "Rose Charm",
      format: "story-9x16",
      version: "1.0.0",
      config: {
        background: "rose_champagne_gradient",
        accent: "rose_gold"
      },
      isActive: true
    }
  });

  const user = await prisma.anonymousUser.upsert({
    where: { anonymousId: "anon_web_seed_001" },
    update: { platform: "web", timezone: "Asia/Shanghai" },
    create: {
      anonymousId: "anon_web_seed_001",
      platform: "web",
      timezone: "Asia/Shanghai",
      createdAt: fixedNow
    }
  });

  const upload = await prisma.outfitUpload.upsert({
    where: { storagePath: "local://uploads/seed-outfit-001.webp" },
    update: {},
    create: {
      userId: user.id,
      platform: "web",
      fileName: "seed-outfit.webp",
      mimeType: "image/webp",
      fileSize: 123456,
      storagePath: "local://uploads/seed-outfit-001.webp",
      publicUrl: "/uploads/seed-outfit-001.webp",
      styleNotes: { palette: ["warm gold", "ivory"], silhouette: "clean layered" },
      createdAt: fixedNow
    }
  });

  const drawSession = await prisma.drawSession.upsert({
    where: { userId_drawSeed: { userId: user.id, drawSeed: "seed_auracue_t03_draw" } },
    update: { selectedIndex: 2, selectedAt: fixedNow },
    create: {
      userId: user.id,
      mood: "confident",
      context: "work",
      uploadId: upload.id,
      drawSeed: "seed_auracue_t03_draw",
      cardOptions: drawCards,
      selectedIndex: 2,
      selectedAt: fixedNow,
      expiresAt: new Date("2026-06-04T01:00:00.000Z"),
      createdAt: fixedNow
    }
  });

  const generationJob = await prisma.generationJob.upsert({
    where: { drawSessionId_drawPosition: { drawSessionId: drawSession.id, drawPosition: 2 } },
    update: { status: "success", completedAt: activatedAt },
    create: {
      userId: user.id,
      drawSessionId: drawSession.id,
      drawPosition: 2,
      status: "success",
      provider: "deterministic-local-seed",
      fallbackUsed: true,
      startedAt: fixedNow,
      completedAt: activatedAt
    }
  });

  const card = await prisma.auraCard.upsert({
    where: { generationJobId: generationJob.id },
    update: {
      shareImageUrl: "/generated/share/seed-aura-card-story.png",
      isActivated: true,
      activatedAt
    },
    create: {
      userId: user.id,
      generationJobId: generationJob.id,
      uploadId: upload.id,
      mood: "confident",
      context: "work",
      drawSeed: drawSession.drawSeed,
      drawPosition: 2,
      content: cardContent,
      shareImageUrl: "/generated/share/seed-aura-card-story.png",
      isActivated: true,
      activatedAt,
      createdAt: fixedNow
    }
  });

  await prisma.generationJob.update({
    where: { id: generationJob.id },
    data: { resultCardId: card.id }
  });

  await prisma.auraActivation.upsert({
    where: {
      cardId_userId_anchorType_anchorLabel: {
        cardId: card.id,
        userId: user.id,
        anchorType: "jewelry",
        anchorLabel: "Gold ring"
      }
    },
    update: { status: "sealed", holdDurationMs: 3200, sealedAt: activatedAt },
    create: {
      userId: user.id,
      cardId: card.id,
      anchorType: "jewelry",
      anchorLabel: "Gold ring",
      status: "sealed",
      holdDurationMs: 3200,
      startedAt: fixedNow,
      sealedAt: activatedAt
    }
  });

  await prisma.savedCard.upsert({
    where: { userId_cardId: { userId: user.id, cardId: card.id } },
    update: {},
    create: {
      userId: user.id,
      cardId: card.id,
      source: "seed-save-success",
      createdAt: activatedAt
    }
  });

  const existingShare = await prisma.shareEvent.findFirst({
    where: { userId: user.id, cardId: card.id, channel: "download", source: "seed-share" }
  });
  if (!existingShare) {
    await prisma.shareEvent.create({
      data: {
        userId: user.id,
        cardId: card.id,
        channel: "download",
        source: "seed-share",
        createdAt: activatedAt
      }
    });
  }

  for (const event of [
    { eventName: "page_view_home", page: "/", payload: { source: "seed" } },
    { eventName: "draw_session_started", page: "/create/draw", payload: { drawSessionId: drawSession.id } },
    { eventName: "aura_card_activated", page: `/activated/${card.id}`, payload: { cardId: card.id } }
  ]) {
    const exists = await prisma.analyticsEvent.findFirst({
      where: { userId: user.id, eventName: event.eventName, page: event.page }
    });
    if (!exists) {
      await prisma.analyticsEvent.create({
        data: {
          userId: user.id,
          eventName: event.eventName,
          page: event.page,
          platform: "web",
          payload: event.payload,
          createdAt: fixedNow
        }
      });
    }
  }

  console.log(JSON.stringify({ seeded: true, anonymousId: user.anonymousId, cardId: card.id }, null, 2));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
