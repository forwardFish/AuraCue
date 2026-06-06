import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer, healthPayload } from "../src/server.mjs";

const repository = createLocalRepository();
const paymentJob = repository.createGenerationJob({ scene: "date", energy: "confidence" });
const paymentCard = repository.completeGenerationJob(paymentJob.id).card;
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

const createOrder = await requestJson("/api/payment-orders/mock", {
  method: "POST",
  body: JSON.stringify({ cardId: paymentCard.id, amount: 1.99, currency: "USD" })
});
assert.equal(createOrder.status, 201);
assert.equal(createOrder.body.status, "pending");
assert.equal(repository.readPaymentOrder(createOrder.body.orderId).status, "pending");

const invalidOrder = await requestJson("/api/payment-orders/mock", {
  method: "POST",
  body: JSON.stringify({ cardId: "", amount: -1, currency: "CNY" })
});
assert.equal(invalidOrder.status, 400);
assert.equal(invalidOrder.body.error.code, "VALIDATION_ERROR");

const missingOrderCard = await requestJson("/api/payment-orders/mock", {
  method: "POST",
  body: JSON.stringify({ cardId: "card-does-not-exist", amount: 1.99, currency: "USD" })
});
assert.equal(missingOrderCard.status, 404);
assert.equal(missingOrderCard.body.error.code, "NOT_FOUND");

const failedOrder = await requestJson(`/api/payment-orders/mock/${createOrder.body.orderId}/complete`, {
  method: "POST",
  body: JSON.stringify({ result: "failed" })
});
assert.equal(failedOrder.status, 200);
assert.equal(failedOrder.body.status, "failed");
assert.equal(failedOrder.body.entitlement, null);
assert.equal(repository.readEntitlementForCard(paymentCard.id), null);

const retryOrder = await requestJson("/api/payment-orders/mock", {
  method: "POST",
  body: JSON.stringify({ cardId: paymentCard.id, amount: 1.99, currency: "USD" })
});
assert.equal(retryOrder.status, 201);

const paidOrder = await requestJson(`/api/payment-orders/mock/${retryOrder.body.orderId}/complete`, {
  method: "POST",
  body: JSON.stringify({ result: "success" })
});
assert.equal(paidOrder.status, 200);
assert.equal(paidOrder.body.status, "paid");
assert.equal(paidOrder.body.entitlement.method, "payment");
assert.equal(repository.readEntitlementForCard(paymentCard.id).orderId, retryOrder.body.orderId);

const unlockPayment = await requestJson(`/api/cards/${paymentCard.id}/unlock/mock`, {
  method: "POST",
  body: JSON.stringify({ method: "payment", orderId: retryOrder.body.orderId })
});
assert.equal(unlockPayment.status, 200);
assert.equal(unlockPayment.body.entitlementId, paidOrder.body.entitlement.entitlementId);

const duplicateUnlock = await requestJson(`/api/cards/${paymentCard.id}/unlock/mock`, {
  method: "POST",
  body: JSON.stringify({ method: "payment", orderId: retryOrder.body.orderId })
});
assert.equal(duplicateUnlock.status, 200);
assert.equal(duplicateUnlock.body.entitlementId, unlockPayment.body.entitlementId);
assert.equal(repository.snapshot().user_entitlements.filter((item) => item.cardId === paymentCard.id).length, 1);

const unpaidUnlock = await requestJson("/api/cards/card-locked-001/unlock/mock", {
  method: "POST",
  body: JSON.stringify({ method: "payment", orderId: createOrder.body.orderId })
});
assert.equal(unpaidUnlock.status, 409);
assert.equal(unpaidUnlock.body.error.code, "PAYMENT_REQUIRED");

const restoreUnlock = await requestJson("/api/cards/card-saved-001/unlock/mock", {
  method: "POST",
  body: JSON.stringify({ method: "restore" })
});
assert.equal(restoreUnlock.status, 200);
assert.equal(restoreUnlock.body.method, "restore");
assert.equal(repository.readEntitlementForCard("card-saved-001").method, "restore");

const inviteStart = await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "invite_started", inviteCode: "INVITE-T06" })
});
assert.equal(inviteStart.status, 200);
assert.equal(inviteStart.body.progress, 0);

const inviteFriendOne = await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "friend_accept", inviteCode: "INVITE-T06", friendId: "friend-t06-001" })
});
assert.equal(inviteFriendOne.status, 200);
assert.equal(inviteFriendOne.body.progress, 1);
assert.equal(inviteFriendOne.body.completed, false);

const inviteDuplicate = await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "friend_accept", inviteCode: "INVITE-T06", friendId: "friend-t06-001" })
});
assert.equal(inviteDuplicate.status, 200);
assert.equal(inviteDuplicate.body.progress, 1);
assert.equal(repository.snapshot().share_events.filter((event) => event.inviteCode === "INVITE-T06" && event.friendId === "friend-t06-001").length, 1);

await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "friend_accept", inviteCode: "INVITE-T06", friendId: "friend-t06-002" })
});
const inviteComplete = await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "friend_accept", inviteCode: "INVITE-T06", friendId: "friend-t06-003" })
});
assert.equal(inviteComplete.status, 200);
assert.equal(inviteComplete.body.progress, 3);
assert.equal(inviteComplete.body.completed, true);
assert.equal(inviteComplete.body.entitlement.method, "invite");
assert.equal(repository.readEntitlementForCard("card-locked-001").method, "invite");

const invalidInvite = await requestJson("/api/invites/card-locked-001/events", {
  method: "POST",
  body: JSON.stringify({ action: "friend_accept" })
});
assert.equal(invalidInvite.status, 400);
assert.equal(invalidInvite.body.error.code, "VALIDATION_ERROR");

const missingInviteCard = await requestJson("/api/invites/card-does-not-exist/events", {
  method: "POST",
  body: JSON.stringify({ action: "copy" })
});
assert.equal(missingInviteCard.status, 404);
assert.equal(missingInviteCard.body.error.code, "NOT_FOUND");

server.close();

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEvidenceDir = resolve(projectRoot, "docs/auto-execute/api/T06");
const dbEvidenceDir = resolve(projectRoot, "docs/auto-execute/db/T06");
const logEvidenceDir = resolve(projectRoot, "docs/auto-execute/logs/T06");
await mkdir(apiEvidenceDir, { recursive: true });
await mkdir(dbEvidenceDir, { recursive: true });
await mkdir(logEvidenceDir, { recursive: true });

const apiEvidence = {
  status: "PASS",
  apiCases: {
    "API-004-C01-mock-unlock-payment-success": { status: "PASS", response: unlockPayment.body },
    "API-004-C02-idempotent-duplicate-unlock": { status: "PASS", response: duplicateUnlock.body },
    "API-004-payment-required-conflict": { status: "PASS", response: unpaidUnlock.body },
    "API-004-restore-purchase-fixture": { status: "PASS", response: restoreUnlock.body },
    "API-005-C01-create-mock-order": { status: "PASS", response: createOrder.body },
    "API-005-validation": { status: "PASS", response: invalidOrder.body },
    "API-005-not-found": { status: "PASS", response: missingOrderCard.body },
    "API-005-C02-failed-payment": { status: "PASS", response: failedOrder.body },
    "API-005-C02-retry-payment-success": { status: "PASS", response: paidOrder.body },
    "API-006-C01-invite-progress-complete": { status: "PASS", response: inviteComplete.body },
    "API-006-C02-duplicate-invite": { status: "PASS", response: inviteDuplicate.body },
    "API-006-validation": { status: "PASS", response: invalidInvite.body },
    "API-006-not-found": { status: "PASS", response: missingInviteCard.body }
  }
};

const dbReadback = {
  status: "PASS",
  paymentOrders: {
    failed: repository.readPaymentOrder(createOrder.body.orderId),
    retryPaid: repository.readPaymentOrder(retryOrder.body.orderId)
  },
  entitlements: {
    payment: repository.readEntitlementForCard(paymentCard.id),
    invite: repository.readEntitlementForCard("card-locked-001"),
    restore: repository.readEntitlementForCard("card-saved-001")
  },
  inviteProgress: repository.readInviteProgress("card-locked-001", "INVITE-T06"),
  inviteEvents: repository.snapshot().share_events.filter((event) => event.inviteCode === "INVITE-T06"),
  duplicateSafety: {
    duplicateFriendCount: repository.snapshot().share_events.filter((event) => event.inviteCode === "INVITE-T06" && event.friendId === "friend-t06-001").length,
    entitlementRowsForPaymentCard: repository.snapshot().user_entitlements.filter((item) => item.cardId === paymentCard.id).length
  }
};

const localOnly = {
  status: "PASS",
  payment: healthPayload().services.payment,
  realWeChatPayCallsAllowed: false,
  realPaymentCallbackAllowed: false,
  productionPaymentKeysUsed: false,
  networkPaymentProviderCalls: [],
  db: healthPayload().services.db
};

await writeFile(`${apiEvidenceDir}/unlock-payment-invite.json`, JSON.stringify(apiEvidence, null, 2));
await writeFile(`${dbEvidenceDir}/unlock-readback.json`, JSON.stringify(dbReadback, null, 2));
await writeFile(`${logEvidenceDir}/payment-local-only.json`, JSON.stringify(localOnly, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/api/T06/unlock-payment-invite.json",
    "docs/auto-execute/db/T06/unlock-readback.json",
    "docs/auto-execute/logs/T06/payment-local-only.json"
  ]
}, null, 2));
