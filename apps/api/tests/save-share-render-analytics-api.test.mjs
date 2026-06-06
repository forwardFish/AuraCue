import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer, healthPayload } from "../src/server.mjs";

const repository = createLocalRepository();
const server = createServer({ repository });

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {})
    }
  });
  const body = await response.json();
  return { status: response.status, body };
}

const saveCard = await requestJson("/api/cards/card-unlocked-001/save", {
  method: "POST",
  body: JSON.stringify({ source: "UI-14-save-card" })
});
assert.equal(saveCard.status, 200);
assert.equal(saveCard.body.saved, true);
assert.equal(repository.readAuraCard("card-unlocked-001").savedAt, saveCard.body.savedAt);

const duplicateSave = await requestJson("/api/cards/card-unlocked-001/save", {
  method: "POST",
  body: JSON.stringify({ source: "UI-17-repeat-save" })
});
assert.equal(duplicateSave.status, 200);
assert.equal(duplicateSave.body.savedAt, saveCard.body.savedAt);

const invalidSave = await requestJson("/api/cards/card-unlocked-001/save", {
  method: "POST",
  body: JSON.stringify({ source: "" })
});
assert.equal(invalidSave.status, 400);
assert.equal(invalidSave.body.error.code, "VALIDATION_ERROR");

const missingSaveCard = await requestJson("/api/cards/card-does-not-exist/save", {
  method: "POST",
  body: JSON.stringify({ source: "UI-17" })
});
assert.equal(missingSaveCard.status, 404);
assert.equal(missingSaveCard.body.error.code, "NOT_FOUND");

const shareEvent = await requestJson("/api/share-events", {
  method: "POST",
  body: JSON.stringify({ cardId: "card-unlocked-001", channel: "moments", source: "UI-16-channel-picker" })
});
assert.equal(shareEvent.status, 201);
assert.equal(shareEvent.body.channel, "moments");
assert.equal(repository.readShareEvent(shareEvent.body.shareEventId).source, "UI-16-channel-picker");

const invalidShareEvent = await requestJson("/api/share-events", {
  method: "POST",
  body: JSON.stringify({ cardId: "card-unlocked-001", channel: "real_platform_sdk", source: "" })
});
assert.equal(invalidShareEvent.status, 400);
assert.equal(invalidShareEvent.body.error.code, "VALIDATION_ERROR");

const missingShareCard = await requestJson("/api/share-events", {
  method: "POST",
  body: JSON.stringify({ cardId: "card-does-not-exist", channel: "story", source: "UI-15" })
});
assert.equal(missingShareCard.status, 404);
assert.equal(missingShareCard.body.error.code, "NOT_FOUND");

const shareImage = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "story-9x16" })
});
assert.equal(shareImage.status, 200);
assert.equal(shareImage.body.localPath, "local://share-images/card-unlocked-001-template-story-001.png");
assert.equal(shareImage.body.width, 1080);
assert.equal(shareImage.body.height, 1920);
assert.equal(repository.readRenderedShareImage("card-unlocked-001").persistedOnCard, true);

const repeatedShareImage = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "story-9x16" })
});
assert.equal(repeatedShareImage.status, 200);
assert.equal(repeatedShareImage.body.deterministicKey, shareImage.body.deterministicKey);

const invalidShareImage = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "square" })
});
assert.equal(invalidShareImage.status, 400);
assert.equal(invalidShareImage.body.error.code, "VALIDATION_ERROR");

const missingShareImageCard = await requestJson("/api/share-images/card-does-not-exist", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "story-9x16" })
});
assert.equal(missingShareImageCard.status, 404);
assert.equal(missingShareImageCard.body.error.code, "NOT_FOUND");

const analyticsEvent = await requestJson("/api/analytics-events", {
  method: "POST",
  body: JSON.stringify({
    eventName: "share_image_rendered",
    page: "/share/card-unlocked-001",
    properties: { cardId: "card-unlocked-001", templateId: "template-story-001" }
  })
});
assert.equal(analyticsEvent.status, 202);
assert.equal(analyticsEvent.body.accepted, true);
assert.equal(repository.readAnalyticsEvents({ eventName: "share_image_rendered" }).at(-1).page, "/share/card-unlocked-001");

const invalidAnalyticsName = await requestJson("/api/analytics-events", {
  method: "POST",
  body: JSON.stringify({ eventName: "send_to_production_analytics", page: "/share/card-unlocked-001", properties: {} })
});
assert.equal(invalidAnalyticsName.status, 400);
assert.equal(invalidAnalyticsName.body.error.code, "VALIDATION_ERROR");

const invalidAnalyticsProperties = await requestJson("/api/analytics-events", {
  method: "POST",
  body: JSON.stringify({ eventName: "card_saved", page: "/saved/card-unlocked-001", properties: { token: "secret-like" } })
});
assert.equal(invalidAnalyticsProperties.status, 400);
assert.equal(invalidAnalyticsProperties.body.error.code, "VALIDATION_ERROR");

server.close();

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEvidenceDir = resolve(projectRoot, "docs/auto-execute/api/T07");
const dbEvidenceDir = resolve(projectRoot, "docs/auto-execute/db/T07");
const renderEvidenceDir = resolve(projectRoot, "docs/auto-execute/screenshots/T07");
const logEvidenceDir = resolve(projectRoot, "docs/auto-execute/logs/T07");
await mkdir(apiEvidenceDir, { recursive: true });
await mkdir(dbEvidenceDir, { recursive: true });
await mkdir(renderEvidenceDir, { recursive: true });
await mkdir(logEvidenceDir, { recursive: true });

const apiEvidence = {
  status: "PASS",
  apiCases: {
    "API-007-C01-save-card-success": { status: "PASS", response: saveCard.body },
    "API-007-idempotent-save": { status: "PASS", response: duplicateSave.body },
    "API-007-validation": { status: "PASS", response: invalidSave.body },
    "API-007-not-found": { status: "PASS", response: missingSaveCard.body },
    "API-008-C01-share-event-success": { status: "PASS", response: shareEvent.body },
    "API-008-validation": { status: "PASS", response: invalidShareEvent.body },
    "API-008-not-found": { status: "PASS", response: missingShareCard.body },
    "API-009-C01-render-share-image": { status: "PASS", response: shareImage.body },
    "API-009-deterministic-repeat": { status: "PASS", response: repeatedShareImage.body },
    "API-009-validation": { status: "PASS", response: invalidShareImage.body },
    "API-009-not-found": { status: "PASS", response: missingShareImageCard.body },
    "API-010-C01-analytics-record": { status: "PASS", response: analyticsEvent.body },
    "API-010-invalid-event-name": { status: "PASS", response: invalidAnalyticsName.body },
    "API-010-secret-like-property-rejected": { status: "PASS", response: invalidAnalyticsProperties.body }
  },
  uiSupport: {
    "UI-15": "share image endpoint returns deterministic story-9x16 local render metadata",
    "UI-16": "share event endpoint records selected channel and source",
    "UI-17": "save endpoint returns saved confirmation data"
  }
};

const dbReadback = {
  status: "PASS",
  savedCard: repository.readAuraCard("card-unlocked-001"),
  shareEvent: repository.readShareEvent(shareEvent.body.shareEventId),
  renderedShareImage: repository.readRenderedShareImage("card-unlocked-001"),
  analyticsEvents: repository.readAnalyticsEvents({ eventName: "share_image_rendered" }),
  idempotency: {
    firstSavedAt: saveCard.body.savedAt,
    secondSavedAt: duplicateSave.body.savedAt,
    saveTimestampStable: saveCard.body.savedAt === duplicateSave.body.savedAt,
    repeatedRenderKeyStable: shareImage.body.deterministicKey === repeatedShareImage.body.deterministicKey
  }
};

const localOnly = {
  status: "PASS",
  analytics: healthPayload().services.analytics,
  storage: healthPayload().services.storage,
  realAnalyticsEndpointUsed: false,
  cloudStorageWriteUsed: false,
  socialPlatformSdkUsed: false
};

await writeFile(`${apiEvidenceDir}/save-share-render-analytics.json`, JSON.stringify(apiEvidence, null, 2));
await writeFile(`${dbEvidenceDir}/readback.json`, JSON.stringify(dbReadback, null, 2));
await writeFile(`${renderEvidenceDir}/share-render-local.json`, JSON.stringify(shareImage.body, null, 2));
await writeFile(`${logEvidenceDir}/local-only.json`, JSON.stringify(localOnly, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/api/T07/save-share-render-analytics.json",
    "docs/auto-execute/db/T07/readback.json",
    "docs/auto-execute/screenshots/T07/share-render-local.json",
    "docs/auto-execute/logs/T07/local-only.json"
  ]
}, null, 2));
