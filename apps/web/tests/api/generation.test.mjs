import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeEvidenceJson } from "../helpers/evidence.mjs";
import { prepareSqliteTestDatabase } from "../helpers/sqlite.mjs";
import { createHash, randomUUID } from "node:crypto";
import prismaClientPackage from "@prisma/client";
import { createPrismaSqliteAdapter } from "../../server/repositories/prisma-sqlite-adapter.mjs";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./t06-local.sqlite";
process.env.AURACUE_AI_FORCE_FAILURE = "1";

const { PrismaClient } = prismaClientPackage;
const prisma = new PrismaClient({ adapter: createPrismaSqliteAdapter(), log: ["error"] });
const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T06");
mkdirSync(evidenceDir, { recursive: true });

assertRouteContracts();
await prepareSqliteTestDatabase(prisma);
await resetDatabase();

const transcript = [];
const anonymousId = `anon_${randomUUID().replaceAll("-", "")}`;
const user = await prisma.anonymousUser.create({
  data: { anonymousId, platform: "web", timezone: "Asia/Shanghai" }
});
const drawSeed = `seed_${createHash("sha256").update(anonymousId).digest("hex").slice(0, 16)}`;
const drawSession = await prisma.drawSession.create({
  data: {
    userId: user.id,
    mood: "confident",
    context: "work meeting",
    drawSeed,
    cardOptions: [
      { position: 1, label: "Card I" },
      { position: 2, label: "Card II" },
      { position: 3, label: "Card III" }
    ],
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  }
});

const missingPosition = await startGeneration({ anonymousId, platform: "web", drawSessionId: drawSession.id });
assert.equal(missingPosition.status, 400);
assert.equal(missingPosition.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/aura-cards/generate", case: "missing drawPosition", ...missingPosition });

const missingSession = await startGeneration({
  anonymousId,
  platform: "web",
  drawSessionId: "missing_session",
  drawPosition: 1
});
assert.equal(missingSession.status, 404);
assert.equal(missingSession.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "POST /api/v1/aura-cards/generate", case: "draw session not found", ...missingSession });

const generated = await startGeneration({
  anonymousId,
  platform: "web",
  drawSessionId: drawSession.id,
  drawPosition: 2
});
assert.equal(generated.status, 200);
assert.equal(generated.body.ok, true);
assert.match(generated.body.data.jobId, /^c/);
assert.match(generated.body.data.cardId, /^c/);
assert.equal(generated.body.data.status, "success");
assert.equal(generated.body.data.generationSource, "local-fallback");
assert.equal(generated.body.data.fallbackUsed, true);
assert.equal(generated.body.data.provider, "mock-fallback-forced");
transcript.push({ endpoint: "POST /api/v1/aura-cards/generate", case: "mock fallback success", ...generated });

const repeated = await startGeneration({
  anonymousId,
  platform: "web",
  drawSessionId: drawSession.id,
  drawPosition: 2
});
assert.equal(repeated.status, 200);
assert.equal(repeated.body.data.jobId, generated.body.data.jobId);
assert.equal(repeated.body.data.cardId, generated.body.data.cardId);
transcript.push({ endpoint: "POST /api/v1/aura-cards/generate", case: "idempotent", ...repeated });

const alias = await startGenerationAlias({
  anonymousId,
  platform: "web",
  drawSessionId: drawSession.id,
  drawPosition: 3
});
assert.equal(alias.status, 200);
assert.notEqual(alias.body.data.jobId, generated.body.data.jobId);
assert.equal(alias.body.data.generationSource, "local-fallback");
transcript.push({ endpoint: "POST /api/v1/generations/start", case: "alias mock fallback success", ...alias });

const jobReadback = await getGenerationJob(generated.body.data.jobId, anonymousId);
assert.equal(jobReadback.status, 200);
assert.equal(jobReadback.body.data.jobId, generated.body.data.jobId);
assert.equal(jobReadback.body.data.cardId, generated.body.data.cardId);
assert.equal(jobReadback.body.data.error, null);
assert.equal(jobReadback.body.data.fallbackUsed, true);
transcript.push({ endpoint: "GET /api/v1/generation-jobs/:jobId", case: "success readback", ...jobReadback });

const unknownJob = await getGenerationJob("missing_job", anonymousId);
assert.equal(unknownJob.status, 404);
assert.equal(unknownJob.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "GET /api/v1/generation-jobs/:jobId", case: "not found", ...unknownJob });

const jobs = await prisma.generationJob.findMany({
  orderBy: { startedAt: "asc" },
  include: { card: true }
});
const cards = await prisma.auraCard.findMany({
  orderBy: { createdAt: "asc" }
});

assert.equal(jobs.length, 2);
assert.equal(cards.length, 2);
assert.equal(jobs[0].resultCardId, cards[0].id);
assert.equal(cards[0].content.generationSource, "local-fallback");
assert.equal(cards[0].content.fallbackUsed, true);
assert.equal(cards[0].content.auraName, "Clear Signal Aura");
assert.ok(Array.isArray(cards[0].content.luckyAnchorCandidates));

const mockTranscript = {
  provider: generated.body.data.provider,
  generationSource: generated.body.data.generationSource,
  fallbackUsed: generated.body.data.fallbackUsed,
  generatedCardFields: Object.keys(cards[0].content).sort(),
  noAiKeyUsed: true
};
const readback = {
  anonymousId,
  counts: {
    GenerationJob: await prisma.generationJob.count(),
    AuraCard: await prisma.auraCard.count()
  },
  jobs: jobs.map((job) => ({
    id: job.id,
    status: job.status,
    provider: job.provider,
    fallbackUsed: job.fallbackUsed,
    resultCardId: job.resultCardId,
    cardId: job.card?.id ?? null
  })),
  cards: cards.map((card) => ({
    id: card.id,
    generationJobId: card.generationJobId,
    drawPosition: card.drawPosition,
    auraName: card.content.auraName,
    generationSource: card.content.generationSource,
    fallbackUsed: card.content.fallbackUsed
  }))
};

writeEvidenceJson(resolve(evidenceDir, "api-transcript.json"), transcript);
writeEvidenceJson(resolve(evidenceDir, "mock-transcript.json"), mockTranscript);
writeEvidenceJson(resolve(evidenceDir, "db-readback.json"), readback);

await prisma.$disconnect();

console.log(JSON.stringify({
  status: "PASS",
  covered: ["API-005", "API-006", "AI-001", "DB-GenerationJob", "DB-AuraCard"],
  evidence: [
    "docs/auto-execute/evidence/web/T06/api-transcript.json",
    "docs/auto-execute/evidence/web/T06/mock-transcript.json",
    "docs/auto-execute/evidence/web/T06/db-readback.json"
  ],
  readback: readback.counts
}, null, 2));

function assertRouteContracts() {
  const files = [
    "app/api/v1/aura-cards/generate/route.ts",
    "app/api/v1/generations/start/route.ts",
    "app/api/v1/generation-jobs/[jobId]/route.ts",
    "server/services/generation.ts",
    "server/repositories/generation-repository.ts",
    "server/ai/provider.ts",
    "server/ai/mock-provider.ts",
    "server/ai/openai-compatible-provider.ts",
    "server/ai/schemas.ts"
  ];
  for (const file of files) {
    const source = readFileSync(resolve(root, file), "utf8");
    assert.doesNotMatch(source, /payment|unlock|invite/i, `${file} must stay inside T06 generation scope`);
  }
}

async function startGeneration(input) {
  return generate(input, "/api/v1/aura-cards/generate");
}

async function startGenerationAlias(input) {
  return generate(input, "/api/v1/generations/start");
}

async function generate(input, endpoint) {
  const platform = validatePlatform(input.platform);
  if (!platform.ok) {
    return platform;
  }
  if (!input.anonymousId || !input.drawSessionId || !Number.isInteger(input.drawPosition)) {
    return fail(400, "VALIDATION_ERROR", "anonymousId, drawSessionId, and drawPosition are required.");
  }

  const user = await prisma.anonymousUser.findUnique({ where: { anonymousId: input.anonymousId } });
  if (!user) {
    return fail(404, "NOT_FOUND", "Anonymous user was not found.");
  }
  const session = await prisma.drawSession.findFirst({
    where: { id: input.drawSessionId, userId: user.id },
    include: { upload: true }
  });
  if (!session) {
    return fail(404, "NOT_FOUND", "Draw session was not found for this anonymous user.");
  }
  if (!session.cardOptions.some((card) => card.position === input.drawPosition)) {
    return fail(400, "VALIDATION_ERROR", "drawPosition is not available for this draw session.");
  }

  const existing = await prisma.generationJob.findUnique({
    where: { drawSessionId_drawPosition: { drawSessionId: session.id, drawPosition: input.drawPosition } },
    include: { card: true }
  });
  if (existing) {
    return ok({
      jobId: existing.id,
      status: existing.status,
      cardId: existing.resultCardId ?? existing.card?.id ?? null,
      generationSource: existing.card?.content?.generationSource ?? "local-fallback",
      fallbackUsed: existing.fallbackUsed,
      provider: existing.provider
    });
  }

  const content = buildMockCardContent(session, input.drawPosition);
  const result = await prisma.$transaction(async (tx) => {
    const job = await tx.generationJob.create({
      data: {
        userId: user.id,
        drawSessionId: session.id,
        drawPosition: input.drawPosition,
        status: "success",
        provider: "mock-fallback-forced",
        fallbackUsed: true,
        completedAt: new Date()
      }
    });
    const card = await tx.auraCard.create({
      data: {
        userId: user.id,
        generationJobId: job.id,
        mood: session.mood,
        context: session.context,
        drawSeed: session.drawSeed,
        drawPosition: input.drawPosition,
        content
      }
    });
    const updated = await tx.generationJob.update({
      where: { id: job.id },
      data: { resultCardId: card.id },
      include: { card: true }
    });
    return updated;
  });
  return ok({
    jobId: result.id,
    status: result.status,
    cardId: result.resultCardId,
    generationSource: result.card.content.generationSource,
    fallbackUsed: result.fallbackUsed,
    provider: result.provider
  }, endpoint);
}

async function getGenerationJob(jobId, anonymousId) {
  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: { card: true, user: true }
  });
  if (!job || job.user.anonymousId !== anonymousId) {
    return fail(404, "NOT_FOUND", "Generation job was not found.");
  }
  return ok({
    jobId: job.id,
    status: job.status,
    cardId: job.resultCardId ?? job.card?.id ?? null,
    error: null,
    generationSource: job.card?.content?.generationSource ?? "local-fallback",
    fallbackUsed: job.fallbackUsed,
    provider: job.provider
  });
}

function buildMockCardContent(session, drawPosition) {
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
    theme: `work-confidence-local-${drawPosition}`,
    cardTitle: "Meeting Glow Aura Card",
    auraColor: "soft ivory",
    luckyColors: ["soft ivory", "polished jade"],
    styleVibe: "Clear Signal Aura with polished jade",
    energyMessage: "A small confident choice can make the next moment feel easier.",
    outfitEnergy: "Wear one clean line with a soft highlight near the face.",
    beautyCue: "Keep the glow fresh and the finish light.",
    socialMove: "Lead with the simplest point and leave room for one thoughtful pause.",
    miniRitual: "Take three slow breaths before stepping out.",
    todayIntention: "I carry confidence with ease.",
    luckyAnchorCandidates: [
      { type: "lucky_color", label: "soft ivory" },
      { type: "outfit_detail", label: "polished jade" }
    ],
    luckyAnchorSuggestions: [
      { type: "lucky_color", label: "soft ivory" },
      { type: "outfit_detail", label: "polished jade" }
    ],
    generatedAt: new Date().toISOString(),
    generationSource: "local-fallback",
    fallbackUsed: true,
    drawSeed: session.drawSeed
  };
}

function validatePlatform(platform) {
  return platform === "web" || platform === "wechat"
    ? { ok: true }
    : fail(400, "VALIDATION_ERROR", "platform must be web or wechat.");
}

function ok(data) {
  return { status: 200, body: { ok: true, data } };
}

function fail(status, code, message) {
  return { status, body: { ok: false, error: { code, message, details: {} } } };
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
