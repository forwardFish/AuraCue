import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createFixtureApiClient, apiClientCoverage } from "../src/api/api-client.mjs";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const store = createShellStore();
const apiClient = createFixtureApiClient();
const analytics = createLocalAnalyticsClient({ apiClient, store });

store.selectScene("date");
store.selectEnergy("confidence");

const job = await apiClient.createGenerationJob({ scene: "date", energy: "confidence", source: "UI-03" });
store.setJob(job);
assert.equal(job.cardId, shellFixtureIds.cardId);

const jobRead = await apiClient.getGenerationJob(job.jobId);
assert.equal(jobRead.status, "success");

const freeCard = await apiClient.getCard(shellFixtureIds.cardId, "free");
store.setCard(freeCard);
assert.equal(freeCard.locked, true);

const order = await apiClient.createMockPaymentOrder({ cardId: shellFixtureIds.cardId, amount: 1.99, currency: "USD" });
store.setPayment(order);
assert.equal(order.status, "pending");

const paidOrder = await apiClient.completeMockPaymentOrder(order.orderId, { result: "success" });
store.setPayment(paidOrder);
assert.equal(paidOrder.status, "paid");

const entitlement = await apiClient.unlockCard(shellFixtureIds.cardId, { method: "payment", orderId: order.orderId });
store.setEntitlement(entitlement);
assert.equal(entitlement.entitled, true);

const invite = await apiClient.recordInviteEvent(shellFixtureIds.cardId, { action: "invite_started", inviteCode: shellFixtureIds.inviteCode });
store.setInvite(invite);
assert.equal(invite.required, 3);

const fullCard = await apiClient.getCard(shellFixtureIds.unlockedCardId, "full");
store.setCard(fullCard);
assert.equal(fullCard.locked, false);

const saved = await apiClient.saveCard(shellFixtureIds.unlockedCardId, { source: "UI-14-save-card" });
store.setShareSave({ saved: saved.saved });
assert.equal(saved.saved, true);

const shareEvent = await apiClient.recordShareEvent({ cardId: shellFixtureIds.unlockedCardId, channel: "story", source: "UI-15" });
store.setShareSave({ lastShareEventId: shareEvent.shareEventId });
assert.equal(shareEvent.channel, "story");

const shareImage = await apiClient.renderShareImage(shellFixtureIds.unlockedCardId, { templateId: "template-story-001", format: "story-9x16" });
store.setShareSave({ shareImagePath: shareImage.localPath });
assert.equal(shareImage.width, 1080);

const analyticsResponse = await analytics.track("page_view_home", "/", { taskId: "T08" });
assert.equal(analyticsResponse.accepted, true);

store.setError({ code: "LOCAL_GENERATION_FAILURE", route: "/error/network" });
assert.equal(store.getState().error.code, "LOCAL_GENERATION_FAILURE");
store.resetError();

const finalState = store.getState();
const requiredStateKeys = ["scene", "energy", "job", "card", "entitlement", "invite", "payment", "shareSave", "error", "analyticsEvents"];
for (const key of requiredStateKeys) {
  assert(Object.hasOwn(finalState, key), `Shell store must track ${key}`);
}

const apiIds = Array.from(new Set(Object.keys(apiClientCoverage).map((id) => id.replace("API-005B", "API-005"))));
assert.deepEqual(apiIds, Array.from({ length: 10 }, (_, index) => `API-${String(index + 1).padStart(3, "0")}`));

const evidence = {
  status: "PASS",
  taskId: "T08",
  stateKeys: requiredStateKeys,
  apiCoverage: apiIds,
  localOnly: {
    payment: "mock-fixture-only",
    ai: "not-called-by-mini-program-shell",
    analytics: "local-fixture-client",
    storage: "local-fixture-only",
    db: "no-production-write"
  },
  finalState,
  apiClientCoverage
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidencePath = resolve(projectRoot, "docs/auto-execute/logs/T08/shell-tests.log");

await mkdir(dirname(evidencePath), { recursive: true });
await writeFile(evidencePath, JSON.stringify(evidence, null, 2));

console.log(JSON.stringify({ status: "PASS", evidence: "docs/auto-execute/logs/T08/shell-tests.log" }, null, 2));
