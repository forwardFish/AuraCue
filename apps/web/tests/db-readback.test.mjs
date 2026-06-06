import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prismaClientPackage from "@prisma/client";
import { createPrismaSqliteAdapter } from "../server/repositories/prisma-sqlite-adapter.mjs";

const { PrismaClient } = prismaClientPackage;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.resolve(__dirname, "../../../docs/auto-execute/evidence/web/T03");
const readbackPath = path.join(evidenceDir, "db-readback.json");

const prisma = new PrismaClient({ adapter: createPrismaSqliteAdapter(), log: ["error"] });

const expectedModels = [
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
];

async function readCounts() {
  return {
    AnonymousUser: await prisma.anonymousUser.count(),
    OutfitUpload: await prisma.outfitUpload.count(),
    DrawSession: await prisma.drawSession.count(),
    GenerationJob: await prisma.generationJob.count(),
    AuraCard: await prisma.auraCard.count(),
    AuraActivation: await prisma.auraActivation.count(),
    SavedCard: await prisma.savedCard.count(),
    ShareEvent: await prisma.shareEvent.count(),
    AnalyticsEvent: await prisma.analyticsEvent.count(),
    CardTemplate: await prisma.cardTemplate.count()
  };
}

async function main() {
  const counts = await readCounts();
  for (const model of expectedModels) {
    assert.ok(counts[model] > 0, `${model} should have seed/readback rows`);
  }

  const user = await prisma.anonymousUser.findUniqueOrThrow({
    where: { anonymousId: "anon_web_seed_001" },
    include: {
      uploads: true,
      drawSessions: true,
      jobs: true,
      cards: {
        include: {
          generationJob: true,
          activations: true,
          savedCards: true,
          shares: true
        }
      },
      analytics: true
    }
  });

  const card = user.cards[0];
  assert.equal(user.platform, "web");
  assert.ok(user.uploads[0]?.storagePath, "OutfitUpload readback should include storagePath");
  assert.equal(user.drawSessions[0]?.drawSeed, "seed_auracue_t03_draw");
  assert.equal(user.jobs[0]?.status, "success");
  assert.equal(card?.isActivated, true);
  assert.equal(card?.generationJob.resultCardId, card.id);
  assert.equal(card?.activations[0]?.status, "sealed");
  assert.ok(card?.savedCards[0]?.createdAt, "SavedCard readback should include createdAt");
  assert.equal(card?.shares[0]?.channel, "download");
  assert.ok(user.analytics.length >= 3, "AnalyticsEvent seed/readback should include key events");

  const firstDrawSession = await prisma.drawSession.upsert({
    where: { userId_drawSeed: { userId: user.id, drawSeed: "seed_auracue_t03_draw" } },
    update: {},
    create: {
      userId: user.id,
      mood: "confident",
      context: "work",
      drawSeed: "seed_auracue_t03_draw",
      cardOptions: [{ position: 2, backTheme: "moon_silver_01" }],
      expiresAt: new Date("2026-06-04T01:00:00.000Z")
    }
  });
  assert.equal(firstDrawSession.id, user.drawSessions[0].id, "draw idempotency key should reuse userId+drawSeed");

  const firstJob = await prisma.generationJob.upsert({
    where: { drawSessionId_drawPosition: { drawSessionId: firstDrawSession.id, drawPosition: 2 } },
    update: {},
    create: {
      userId: user.id,
      drawSessionId: firstDrawSession.id,
      drawPosition: 2,
      status: "success",
      provider: "deterministic-local-test"
    }
  });
  assert.equal(firstJob.id, user.jobs[0].id, "generate idempotency key should reuse drawSessionId+drawPosition");

  const firstSaved = await prisma.savedCard.upsert({
    where: { userId_cardId: { userId: user.id, cardId: card.id } },
    update: {},
    create: { userId: user.id, cardId: card.id, source: "db-readback-test" }
  });
  assert.equal(firstSaved.id, card.savedCards[0].id, "save idempotency key should reuse userId+cardId");

  const firstActivation = await prisma.auraActivation.upsert({
    where: {
      cardId_userId_anchorType_anchorLabel: {
        cardId: card.id,
        userId: user.id,
        anchorType: "jewelry",
        anchorLabel: "Gold ring"
      }
    },
    update: { status: "sealed", holdDurationMs: 3200 },
    create: {
      userId: user.id,
      cardId: card.id,
      anchorType: "jewelry",
      anchorLabel: "Gold ring",
      status: "sealed",
      holdDurationMs: 3200
    }
  });
  assert.equal(firstActivation.id, card.activations[0].id, "seal idempotency key should reuse card+user+anchor");

  const templates = await prisma.cardTemplate.findMany({ orderBy: { id: "asc" } });
  assert.ok(templates.length >= 3, "CardTemplate seed should include the three default templates");

  const readback = {
    generatedAt: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ?? null,
    strategy: "local SQLite test DB via Prisma 7 for non-destructive T03 validation",
    p0Models: expectedModels,
    counts,
    fixtureIds: {
      anonymousId: user.anonymousId,
      userId: user.id,
      uploadId: user.uploads[0].id,
      drawSessionId: firstDrawSession.id,
      generationJobId: firstJob.id,
      auraCardId: card.id,
      activationId: firstActivation.id,
      savedCardId: firstSaved.id,
      shareEventId: card.shares[0].id,
      analyticsEventIds: user.analytics.map((event) => event.id),
      templateIds: templates.map((template) => template.id)
    },
    idempotency: {
      draw: "DrawSession @@unique([userId, drawSeed])",
      generate: "GenerationJob @@unique([drawSessionId, drawPosition])",
      save: "SavedCard @@unique([userId, cardId])",
      seal: "AuraActivation @@unique([cardId, userId, anchorType, anchorLabel])"
    }
  };

  await mkdir(evidenceDir, { recursive: true });
  await writeFile(readbackPath, `${JSON.stringify(readback, null, 2)}\n`);
  console.log(JSON.stringify(readback, null, 2));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
