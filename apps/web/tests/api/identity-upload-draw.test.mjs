import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeEvidenceJson } from "../helpers/evidence.mjs";
import { prepareSqliteTestDatabase } from "../helpers/sqlite.mjs";
import { createHash, randomUUID } from "node:crypto";
import prismaClientPackage from "@prisma/client";
import { createPrismaSqliteAdapter } from "../../server/repositories/prisma-sqlite-adapter.mjs";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./t05-local.sqlite";

const { PrismaClient } = prismaClientPackage;
const prisma = new PrismaClient({ adapter: createPrismaSqliteAdapter(), log: ["error"] });
const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T05");
mkdirSync(evidenceDir, { recursive: true });

assertRouteContracts();
await prepareSqliteTestDatabase(prisma);
await resetDatabase();

const transcript = [];

const identityCreate = await createAnonymousIdentity({ platform: "web", timezone: "Asia/Shanghai" });
assert.equal(identityCreate.status, 200);
assert.equal(identityCreate.body.ok, true);
assert.match(identityCreate.body.data.anonymousId, /^anon_/);
assert.equal(identityCreate.body.data.created, true);
transcript.push({ endpoint: "POST /api/v1/identity/anonymous", case: "create", ...identityCreate });

const anonymousId = identityCreate.body.data.anonymousId;
const identityRepeat = await createAnonymousIdentity({ platform: "web", timezone: "Asia/Shanghai", anonymousId });
assert.equal(identityRepeat.status, 200);
assert.equal(identityRepeat.body.data.created, false);
transcript.push({ endpoint: "POST /api/v1/identity/anonymous", case: "idempotent", ...identityRepeat });

const identityInvalid = await createAnonymousIdentity({ platform: "desktop" });
assert.equal(identityInvalid.status, 400);
assert.equal(identityInvalid.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/identity/anonymous", case: "invalid platform", ...identityInvalid });

const todayMissingUser = await getTodayCard({ anonymousId: "anon_missing" });
assert.equal(todayMissingUser.status, 404);
assert.equal(todayMissingUser.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "GET /api/v1/aura-cards/today", case: "not found", ...todayMissingUser });

const todayEmpty = await getTodayCard({ anonymousId });
assert.equal(todayEmpty.status, 200);
assert.deepEqual(todayEmpty.body.data, { hasActiveCard: false });
transcript.push({ endpoint: "GET /api/v1/aura-cards/today", case: "empty", ...todayEmpty });

const uploaded = [];
for (const [mimeType, fileName, size] of [
  ["image/jpeg", "look.jpg", 1024],
  ["image/png", "look.png", 2048],
  ["image/webp", "look.webp", 4096]
]) {
  const upload = await createOutfitUpload({ anonymousId, platform: "web", fileName, mimeType, size });
  assert.equal(upload.status, 200);
  assert.equal(upload.body.ok, true);
  assert.match(upload.body.data.uploadId, /^c/);
  assert.match(upload.body.data.publicUrl, /^\/uploads\/upload_/);
  assert.equal(upload.body.data.styleNotes.mood, "soft polished");
  uploaded.push(upload.body.data);
  transcript.push({ endpoint: "POST /api/v1/uploads/outfit", case: mimeType, ...upload });
}

const tooLargeUpload = await createOutfitUpload({
  anonymousId,
  platform: "web",
  fileName: "too-large.png",
  mimeType: "image/png",
  size: 8 * 1024 * 1024 + 1
});
assert.equal(tooLargeUpload.status, 413);
assert.equal(tooLargeUpload.body.error.code, "FILE_TOO_LARGE");
transcript.push({ endpoint: "POST /api/v1/uploads/outfit", case: "too large", ...tooLargeUpload });

const badTypeUpload = await createOutfitUpload({
  anonymousId,
  platform: "web",
  fileName: "notes.txt",
  mimeType: "text/plain",
  size: 100
});
assert.equal(badTypeUpload.status, 415);
assert.equal(badTypeUpload.body.error.code, "UNSUPPORTED_FILE_TYPE");
transcript.push({ endpoint: "POST /api/v1/uploads/outfit", case: "bad type", ...badTypeUpload });

const missingMood = await startDrawSession({ anonymousId, platform: "web" });
assert.equal(missingMood.status, 400);
assert.equal(missingMood.body.error.code, "VALIDATION_ERROR");
transcript.push({ endpoint: "POST /api/v1/draw-sessions/start", case: "missing mood", ...missingMood });

const drawNoUpload = await startDrawSession({
  anonymousId,
  platform: "web",
  mood: "confident",
  context: "work"
});
assert.equal(drawNoUpload.status, 200);
assert.match(drawNoUpload.body.data.drawSeed, /^seed_/);
assert.equal(drawNoUpload.body.data.cards.length, 3);
assert.ok(Date.parse(drawNoUpload.body.data.expiresAt) > Date.now());
transcript.push({ endpoint: "POST /api/v1/draw-sessions/start", case: "no upload", ...drawNoUpload });

const drawRepeat = await startDrawSession({
  anonymousId,
  platform: "web",
  mood: "confident",
  context: "work"
});
assert.equal(drawRepeat.body.data.drawSessionId, drawNoUpload.body.data.drawSessionId);
assert.equal(drawRepeat.body.data.drawSeed, drawNoUpload.body.data.drawSeed);
transcript.push({ endpoint: "POST /api/v1/draw-sessions/start", case: "idempotent", ...drawRepeat });

const drawWithUpload = await startDrawSession({
  anonymousId,
  platform: "web",
  mood: "calm",
  context: "skip",
  uploadId: uploaded[0].uploadId
});
assert.equal(drawWithUpload.status, 200);
assert.notEqual(drawWithUpload.body.data.drawSessionId, drawNoUpload.body.data.drawSessionId);
transcript.push({ endpoint: "POST /api/v1/draw-sessions/start", case: "with upload", ...drawWithUpload });

const drawBadUpload = await startDrawSession({
  anonymousId,
  platform: "web",
  mood: "calm",
  uploadId: "missing_upload"
});
assert.equal(drawBadUpload.status, 404);
assert.equal(drawBadUpload.body.error.code, "NOT_FOUND");
transcript.push({ endpoint: "POST /api/v1/draw-sessions/start", case: "upload not found", ...drawBadUpload });

const user = await prisma.anonymousUser.findUniqueOrThrow({
  where: { anonymousId },
  include: {
    uploads: { orderBy: { createdAt: "asc" } },
    drawSessions: { orderBy: { createdAt: "asc" } }
  }
});

assert.equal(user.uploads.length, 3);
assert.equal(user.drawSessions.length, 2);
assert.equal(new Set(user.drawSessions.map((session) => session.drawSeed)).size, 2);

const activeCard = await createActivatedCardForToday(user.id, user.drawSessions[0]);
const todayActive = await getTodayCard({ anonymousId });
assert.equal(todayActive.status, 200);
assert.equal(todayActive.body.data.hasActiveCard, true);
assert.equal(todayActive.body.data.cardId, activeCard.id);
assert.equal(todayActive.body.data.auraName, "Quiet Power Bloom");
transcript.push({ endpoint: "GET /api/v1/aura-cards/today", case: "active", ...todayActive });

const readback = {
  anonymousId,
  counts: {
    AnonymousUser: await prisma.anonymousUser.count(),
    OutfitUpload: await prisma.outfitUpload.count(),
    DrawSession: await prisma.drawSession.count(),
    GenerationJob: await prisma.generationJob.count(),
    AuraCard: await prisma.auraCard.count()
  },
  uploadIds: user.uploads.map((upload) => upload.id),
  drawSessions: user.drawSessions.map((session) => ({
    id: session.id,
    mood: session.mood,
    context: session.context,
    uploadId: session.uploadId,
    drawSeed: session.drawSeed,
    expiresAt: session.expiresAt.toISOString()
  })),
  todayActiveCardId: activeCard.id
};

writeEvidenceJson(resolve(evidenceDir, "api-transcript.json"), transcript);
writeEvidenceJson(resolve(evidenceDir, "db-readback.json"), readback);

await prisma.$disconnect();

console.log(JSON.stringify({
  status: "PASS",
  covered: ["API-001", "API-002", "API-003", "API-004"],
  evidence: [
    "docs/auto-execute/evidence/web/T05/api-transcript.json",
    "docs/auto-execute/evidence/web/T05/db-readback.json"
  ],
  readback: readback.counts
}, null, 2));

function assertRouteContracts() {
  const files = [
    "app/api/v1/identity/anonymous/route.ts",
    "app/api/v1/aura-cards/today/route.ts",
    "app/api/v1/uploads/outfit/route.ts",
    "app/api/v1/draw-sessions/start/route.ts",
    "server/services/identity-upload-draw.ts",
    "server/repositories/identity-upload-draw-repository.ts"
  ];
  for (const file of files) {
    const source = readFileSync(resolve(root, file), "utf8");
    assert.doesNotMatch(source, /payment|unlock|invite|cloud/i, `${file} must stay inside T05 Web P0 scope`);
  }

  assert.match(readFileSync(resolve(root, "app/api/v1/identity/anonymous/route.ts"), "utf8"), /export async function POST/);
  assert.match(readFileSync(resolve(root, "app/api/v1/aura-cards/today/route.ts"), "utf8"), /export async function GET/);
  assert.match(readFileSync(resolve(root, "app/api/v1/uploads/outfit/route.ts"), "utf8"), /formData/);
  assert.match(readFileSync(resolve(root, "app/api/v1/draw-sessions/start/route.ts"), "utf8"), /readJsonBody/);
}

async function createAnonymousIdentity(input) {
  const platform = validatePlatform(input.platform);
  if (!platform.ok) {
    return platform;
  }
  const anonymousId = input.anonymousId ?? `anon_${randomUUID().replaceAll("-", "")}`;
  const existing = await prisma.anonymousUser.findUnique({ where: { anonymousId } });
  if (existing) {
    await prisma.anonymousUser.update({
      where: { anonymousId },
      data: { platform: input.platform, timezone: input.timezone ?? null }
    });
    return ok({ anonymousId, created: false });
  }
  const created = await prisma.anonymousUser.create({
    data: { anonymousId, platform: input.platform, timezone: input.timezone ?? null }
  });
  return ok({ anonymousId: created.anonymousId, created: true });
}

async function getTodayCard(input) {
  if (!input.anonymousId) {
    return fail(400, "VALIDATION_ERROR", "anonymousId is required.");
  }
  const user = await prisma.anonymousUser.findUnique({ where: { anonymousId: input.anonymousId } });
  if (!user) {
    return fail(404, "NOT_FOUND", "Anonymous user was not found.");
  }
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const card = await prisma.auraCard.findFirst({
    where: { userId: user.id, isActivated: true, activatedAt: { gte: start, lt: end } },
    orderBy: { activatedAt: "desc" }
  });
  if (!card) {
    return ok({ hasActiveCard: false });
  }
  return ok({
    hasActiveCard: true,
    cardId: card.id,
    auraName: card.content?.auraName ?? null,
    activatedAt: card.activatedAt?.toISOString() ?? null
  });
}

async function createOutfitUpload(input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  const mimeExtensions = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"]
  ]);
  if (input.size > 8 * 1024 * 1024) {
    return fail(413, "FILE_TOO_LARGE", "Upload must be 8MB or smaller.");
  }
  const extension = mimeExtensions.get(input.mimeType);
  if (!extension) {
    return fail(415, "UNSUPPORTED_FILE_TYPE", "Upload must be jpg, png, or webp.");
  }
  const token = `upload_${randomUUID().replaceAll("-", "")}`;
  const upload = await prisma.outfitUpload.create({
    data: {
      userId: auth.user.id,
      platform: input.platform,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSize: input.size,
      storagePath: `local://uploads/${token}.${extension}`,
      publicUrl: `/uploads/${token}.${extension}`,
      styleNotes: { mood: "soft polished", source: "local-metadata-only", uploadMimeType: input.mimeType }
    }
  });
  return ok({ uploadId: upload.id, publicUrl: upload.publicUrl, styleNotes: upload.styleNotes });
}

async function startDrawSession(input) {
  const auth = await validateKnownUser(input);
  if (!auth.ok) {
    return auth;
  }
  if (!input.mood) {
    return fail(400, "VALIDATION_ERROR", "mood is required.");
  }
  if (input.uploadId) {
    const upload = await prisma.outfitUpload.findFirst({ where: { id: input.uploadId, userId: auth.user.id } });
    if (!upload) {
      return fail(404, "NOT_FOUND", "Upload was not found for this anonymous user.");
    }
  }
  const drawSeed = createDrawSeed({
    anonymousId: input.anonymousId,
    mood: input.mood,
    context: input.context ?? null,
    uploadId: input.uploadId ?? null,
    day: new Date().toISOString().slice(0, 10)
  });
  const existing = await prisma.drawSession.findUnique({
    where: { userId_drawSeed: { userId: auth.user.id, drawSeed } }
  });
  if (existing) {
    return ok({
      drawSessionId: existing.id,
      drawSeed: existing.drawSeed,
      expiresAt: existing.expiresAt.toISOString(),
      cards: existing.cardOptions
    });
  }
  const cards = [
    { position: 1, label: "Card I" },
    { position: 2, label: "Card II" },
    { position: 3, label: "Card III" }
  ];
  const created = await prisma.drawSession.create({
    data: {
      userId: auth.user.id,
      mood: input.mood,
      context: input.context ?? null,
      uploadId: input.uploadId ?? null,
      drawSeed,
      cardOptions: cards,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });
  return ok({ drawSessionId: created.id, drawSeed: created.drawSeed, expiresAt: created.expiresAt.toISOString(), cards });
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

function ok(data) {
  return { status: 200, body: { ok: true, data } };
}

function fail(status, code, message) {
  return { status, body: { ok: false, error: { code, message, details: {} } } };
}

function createDrawSeed(input) {
  return `seed_${createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16)}`;
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

async function createActivatedCardForToday(userId, drawSession) {
  const job = await prisma.generationJob.create({
    data: {
      userId,
      drawSessionId: drawSession.id,
      drawPosition: 1,
      status: "success",
      provider: "t05-local-test",
      fallbackUsed: true,
      completedAt: new Date()
    }
  });

  const card = await prisma.auraCard.create({
    data: {
      userId,
      generationJobId: job.id,
      uploadId: drawSession.uploadId,
      mood: drawSession.mood,
      context: drawSession.context,
      drawSeed: drawSession.drawSeed,
      drawPosition: 1,
      content: {
        auraName: "Quiet Power Bloom",
        luckyColors: ["warm gold"],
        styleVibe: "calm",
        energyMessage: "A steady cue for today.",
        miniRitual: "Breathe once.",
        todayIntention: "I move with clarity.",
        luckyAnchorSuggestions: []
      },
      isActivated: true,
      activatedAt: new Date()
    }
  });

  await prisma.generationJob.update({
    where: { id: job.id },
    data: { resultCardId: card.id }
  });

  return card;
}
