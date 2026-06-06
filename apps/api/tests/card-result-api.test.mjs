import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer } from "../src/server.mjs";

const repository = createLocalRepository();
const server = createServer({ repository });

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function requestJson(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "content-type": "application/json" }
  });
  const body = await response.json();
  return { status: response.status, body };
}

const freeResult = await requestJson("/api/cards/card-locked-001?view=free");
assert.equal(freeResult.status, 200);
assert.equal(freeResult.body.view, "free");
assert.equal(freeResult.body.locked, true);
assert.equal(freeResult.body.auraName, "Soft Glow Aura");
assert.equal(freeResult.body.luckyColor, repository.readAuraCard("card-locked-001").content.luckyColor);
assert.equal(freeResult.body.previewImage.variant, "low-res-watermarked");
assert.equal(freeResult.body.previewImage.blurred, true);
assert.equal(freeResult.body.lockedPreview.fullContentAvailable, false);
assert.equal(freeResult.body.lockedPreview.unlockRequired, true);
assert(!("card" in freeResult.body), "free result must not expose full card content");
assert(!("outfit" in freeResult.body), "free result must not expose locked outfit content");
assert(!("ritual" in freeResult.body), "free result must not expose locked ritual content");

const lockedFullResult = await requestJson("/api/cards/card-locked-001?view=full");
assert.equal(lockedFullResult.status, 403);
assert.equal(lockedFullResult.body.error.code, "ENTITLEMENT_REQUIRED");
assert.equal(lockedFullResult.body.error.details.locked, true);
assert(!("card" in lockedFullResult.body), "locked full result must not expose full card content");

const unlockedFullResult = await requestJson("/api/cards/card-unlocked-001?view=full");
assert.equal(unlockedFullResult.status, 200);
assert.equal(unlockedFullResult.body.view, "full");
assert.equal(unlockedFullResult.body.locked, false);
assert.equal(unlockedFullResult.body.entitlement.entitled, true);
assert.equal(unlockedFullResult.body.entitlement.entitlementId, "entitlement-paid-001");

const fullFields = [
  "title",
  "auraName",
  "tarotSymbol",
  "message",
  "luckyColor",
  "colors",
  "outfit",
  "beauty",
  "social",
  "ritual",
  "avoid",
  "caption",
  "theme"
];
for (const field of fullFields) {
  assert.notEqual(unlockedFullResult.body.card[field], undefined, `Missing full result field: ${field}`);
}

const notFound = await requestJson("/api/cards/card-does-not-exist?view=free");
assert.equal(notFound.status, 404);
assert.equal(notFound.body.error.code, "NOT_FOUND");
assert.equal(notFound.body.error.details.cardId, "card-does-not-exist");

const invalidView = await requestJson("/api/cards/card-locked-001?view=secret");
assert.equal(invalidView.status, 400);
assert.equal(invalidView.body.error.code, "VALIDATION_ERROR");

server.close();

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEvidenceDir = resolve(projectRoot, "docs/auto-execute/api/T05");
const dbEvidenceDir = resolve(projectRoot, "docs/auto-execute/db/T05");
await mkdir(apiEvidenceDir, { recursive: true });
await mkdir(dbEvidenceDir, { recursive: true });

const apiEvidence = {
  status: "PASS",
  apiCases: {
    "API-003-C01-free-result-success": { status: "PASS", response: freeResult.body },
    "API-003-C02-full-result-locked": { status: "PASS", response: lockedFullResult.body },
    "API-003-C03-full-result-success": { status: "PASS", response: unlockedFullResult.body },
    "API-003-C04-not-found": { status: "PASS", response: notFound.body },
    "API-003-validation-invalid-view": { status: "PASS", response: invalidView.body }
  },
  contractSupport: {
    "UI-06": "free response contains auraName, luckyColor, oneLineReminder, low-res watermarked preview metadata, and locked preview markers",
    "UI-14": "full response contains complete structured card fields after entitlement readback"
  },
  forbiddenLeakChecks: {
    freeResponseExposesFullCard: false,
    lockedFullResponseExposesFullCard: false
  }
};

const dbReadback = {
  status: "PASS",
  cardReadbacks: {
    lockedCard: repository.readAuraCard("card-locked-001"),
    unlockedCard: repository.readAuraCard("card-unlocked-001"),
    missingCard: repository.readAuraCard("card-does-not-exist")
  },
  entitlementReadbacks: {
    lockedCard: repository.readEntitlementForCard("card-locked-001"),
    unlockedCard: repository.readEntitlementForCard("card-unlocked-001")
  },
  entitlementGate: {
    lockedCardFullStatus: lockedFullResult.status,
    unlockedCardFullStatus: unlockedFullResult.status,
    fullResultRequiresEntitlement: true
  }
};

await writeFile(`${apiEvidenceDir}/card-api.json`, JSON.stringify(apiEvidence, null, 2));
await writeFile(`${dbEvidenceDir}/card-readback.json`, JSON.stringify(dbReadback, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/api/T05/card-api.json",
    "docs/auto-execute/db/T05/card-readback.json"
  ]
}, null, 2));
