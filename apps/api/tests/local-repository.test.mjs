import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalRepository, localRepositoryMode, repositoryMethodCoverage, repositorySchema } from "../src/local-repository.mjs";

const requiredEntities = [
  "users",
  "aura_cards",
  "generation_jobs",
  "card_templates",
  "share_events",
  "analytics_events",
  "payment_orders",
  "user_entitlements"
];

const repository = createLocalRepository();
const readback = repository.seedReadback();

assert.equal(localRepositoryMode.storage, "deterministic-json-repository");
assert.equal(localRepositoryMode.liveServiceWritesAllowed, false);
assert.deepEqual(Object.keys(repositorySchema), requiredEntities);

for (const entity of requiredEntities) {
  assert(readback.counts[entity] > 0, `${entity} should have seed rows`);
}

assert.equal(readback.lockedCard.isUnlocked, false);
assert.equal(readback.unlockedCard.isUnlocked, true);
assert.equal(readback.failedJob.status, "failed");
assert.equal(readback.inviteProgress.progress, 1);
assert.equal(readback.paymentSuccess.status, "paid");
assert.equal(readback.paymentFailure.status, "failed");
assert.ok(readback.savedCard.savedAt);
assert.equal(readback.shareEvent.channel, "story");
assert(readback.analyticsEvents.length >= 2);

const job = repository.createGenerationJob({ scene: "date", energy: "confidence" });
assert.equal(repository.readGenerationJob(job.id).status, "pending");
const completed = repository.completeGenerationJob(job.id);
assert.equal(repository.readGenerationJob(job.id).status, "success");
assert.equal(repository.readAuraCard(completed.card.id).jobId, job.id);

const order = repository.createMockPaymentOrder({ cardId: completed.card.id });
assert.equal(repository.readPaymentOrder(order.id).status, "pending");
const paid = repository.completeMockPaymentOrder(order.id, "success");
assert.equal(paid.order.status, "paid");
assert.equal(repository.readEntitlementForCard(completed.card.id).method, "payment");

const inviteRepository = createLocalRepository();
inviteRepository.recordInviteEvent({ cardId: "card-locked-001", action: "friend_accept", friendId: "friend-002" });
inviteRepository.recordInviteEvent({ cardId: "card-locked-001", action: "friend_accept", friendId: "friend-003" });
const inviteProgress = inviteRepository.recordInviteEvent({ cardId: "card-locked-001", action: "friend_accept", friendId: "friend-004" });
assert.equal(inviteProgress.completed, true);
assert.equal(inviteRepository.readEntitlementForCard("card-locked-001").method, "invite");

const saved = repository.saveCard(completed.card.id);
assert.equal(saved.saved, true);
assert.ok(repository.readAuraCard(completed.card.id).savedAt);

const share = repository.recordShareEvent({ cardId: completed.card.id, channel: "wechat", source: "unit-test" });
assert.equal(repository.readShareEvent(share.id).source, "unit-test");

const rendered = repository.renderShareImage({ cardId: completed.card.id });
assert.equal(rendered.templateId, "template-story-001");
assert.ok(repository.readAuraCard(completed.card.id).shareImagePath);

const analytics = repository.recordAnalyticsEvent({ eventName: "click_generate_start", page: "/", properties: { source: "unit-test" } });
assert.equal(repository.readAnalyticsEvents({ eventName: analytics.eventName }).at(-1).page, "/");

for (const [apiId, methods] of Object.entries(repositoryMethodCoverage)) {
  assert(methods.length > 0, `${apiId} should map to repository methods`);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidenceDir = resolve(projectRoot, "docs/auto-execute/db/T03");
await mkdir(evidenceDir, { recursive: true });
await writeFile(`${evidenceDir}/schema-summary.json`, JSON.stringify(repository.schemaSummary(), null, 2));
await writeFile(`${evidenceDir}/fixture-manifest.json`, JSON.stringify(repository.fixtureManifest(), null, 2));
await writeFile(`${evidenceDir}/seed-readback.json`, JSON.stringify(repository.seedReadback(), null, 2));

console.log(JSON.stringify({
  status: "PASS",
  entities: requiredEntities,
  methodCoverage: Object.keys(repositoryMethodCoverage),
  evidence: [
    "docs/auto-execute/db/T03/schema-summary.json",
    "docs/auto-execute/db/T03/fixture-manifest.json",
    "docs/auto-execute/db/T03/seed-readback.json"
  ]
}, null, 2));
