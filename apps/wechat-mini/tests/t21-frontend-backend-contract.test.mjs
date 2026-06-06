import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "../../api/src/server.mjs";
import { createLocalRepository } from "../../api/src/local-repository.mjs";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { apiClientCoverage } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import { clickGenerateCard } from "../src/pages/create/energy-page.mjs";
import { pollGenerationJob, renderLoadingPage } from "../src/pages/create/loading-page.mjs";
import { clickTryAgain as clickGenerationTryAgain, renderNetworkErrorPage } from "../src/pages/error/network-page.mjs";
import { loadFreePreviewCard } from "../src/pages/result/free-preview-page.mjs";
import { clickMoreSharingOptions, clickSaveCard, clickShareStory, loadFullResultPage } from "../src/pages/result/full-page.mjs";
import {
  clickBackHomeFromSaved,
  clickCopyStoryLink,
  clickSaveStoryCard,
  clickShareChannel,
  clickShareNowFromSaved,
  clickShareStoryCard,
  loadSaveSuccessPage,
  loadStorySharePage,
  shareChannels
} from "../src/pages/share/share-save-page.mjs";
import {
  clickConfirmUnlock,
  clickRestorePurchase
} from "../src/pages/unlock/payment-state-page.mjs";
import {
  clickCopyInviteLink,
  clickInviteAgain,
  clickInviteFriends,
  openFriendLanding,
  trackInviteStartPageView
} from "../src/pages/unlock/unlock-invite-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEvidenceDir = resolve(projectRoot, "docs/auto-execute/api/T21");
const traceDir = resolve(projectRoot, "docs/auto-execute/traces/T21");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T21");
const contractSummaryPath = resolve(apiEvidenceDir, "contract-summary.json");
const tracePath = resolve(traceDir, "frontend-backend-contract-trace.json");

await mkdir(apiEvidenceDir, { recursive: true });
await mkdir(traceDir, { recursive: true });
await mkdir(logDir, { recursive: true });

const repository = createLocalRepository();
const server = createServer({ repository });
await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

const calls = [];
const errors = [];

function assertNoErrorEnvelope(payload, label) {
  assert.equal(payload?.error, undefined, `${label} returned an error envelope`);
}

function assertErrorEnvelope(payload, label) {
  assert.equal(typeof payload?.error?.code, "string", `${label} must return typed error.code`);
  assert.equal(typeof payload?.error?.message, "string", `${label} must return typed error.message`);
  assert.equal(typeof payload?.error?.details, "object", `${label} must return typed error.details`);
}

async function requestJson({ apiId, clientMethod, method, path, body, expectedStatus, expectedError = false }) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const payload = await response.json();
  const entry = {
    apiId,
    clientMethod,
    method,
    path: path.replace(/\/[^/?]+(?=\/complete$)/, "/:orderId").replace(/\/(job|card|order)[^/?]+/g, "/:id"),
    request: body ?? null,
    actualStatus: response.status,
    expectedStatus,
    responseShape: expectedError ? "error-envelope" : "success",
    response: payload
  };
  calls.push(entry);
  assert.equal(response.status, expectedStatus, `${apiId} ${clientMethod} ${path} expected ${expectedStatus}, got ${response.status}`);
  if (expectedError) {
    assertErrorEnvelope(payload, `${apiId} ${clientMethod}`);
  } else {
    assertNoErrorEnvelope(payload, `${apiId} ${clientMethod}`);
  }
  return payload;
}

function createHttpContractApiClient() {
  return {
    async createGenerationJob(request) {
      return requestJson({
        apiId: "API-001",
        clientMethod: "createGenerationJob",
        method: "POST",
        path: "/api/generation-jobs",
        body: request,
        expectedStatus: request.forceFailure ? 503 : request.scene && request.energy ? 201 : 400,
        expectedError: Boolean(request.forceFailure || !request.scene || !request.energy)
      });
    },
    async getGenerationJob(jobId) {
      return requestJson({
        apiId: "API-002",
        clientMethod: "getGenerationJob",
        method: "GET",
        path: `/api/generation-jobs/${encodeURIComponent(jobId)}`,
        expectedStatus: jobId === "job-does-not-exist" ? 404 : 200,
        expectedError: jobId === "job-does-not-exist"
      });
    },
    async getCard(cardId, view = "free") {
      const notFound = cardId === "card-does-not-exist";
      const lockedFull = cardId === shellFixtureIds.cardId && view === "full" && !repository.readEntitlementForCard(cardId);
      return requestJson({
        apiId: "API-003",
        clientMethod: "getCard",
        method: "GET",
        path: `/api/cards/${encodeURIComponent(cardId)}?view=${encodeURIComponent(view)}`,
        expectedStatus: notFound ? 404 : lockedFull ? 403 : 200,
        expectedError: notFound || lockedFull
      });
    },
    async unlockCard(cardId, request) {
      const needsPaidOrder = request.method === "payment" && !repository.readPaymentOrder(request.orderId)?.status?.includes("paid");
      return requestJson({
        apiId: "API-004",
        clientMethod: "unlockCard",
        method: "POST",
        path: `/api/cards/${encodeURIComponent(cardId)}/unlock/mock`,
        body: request,
        expectedStatus: needsPaidOrder ? 409 : 200,
        expectedError: needsPaidOrder
      });
    },
    async createMockPaymentOrder(request) {
      return requestJson({
        apiId: "API-005",
        clientMethod: "createMockPaymentOrder",
        method: "POST",
        path: "/api/payment-orders/mock",
        body: request,
        expectedStatus: request.cardId ? 201 : 400,
        expectedError: !request.cardId
      });
    },
    async completeMockPaymentOrder(orderId, request) {
      const missing = orderId === "order-does-not-exist";
      return requestJson({
        apiId: "API-005",
        clientMethod: "completeMockPaymentOrder",
        method: "POST",
        path: `/api/payment-orders/mock/${encodeURIComponent(orderId)}/complete`,
        body: request,
        expectedStatus: missing ? 404 : 200,
        expectedError: missing
      });
    },
    async recordInviteEvent(cardId, request) {
      const invalid = !["invite_started", "copy", "invite_again", "friend_accept"].includes(request.action);
      return requestJson({
        apiId: "API-006",
        clientMethod: "recordInviteEvent",
        method: "POST",
        path: `/api/invites/${encodeURIComponent(cardId)}/events`,
        body: request,
        expectedStatus: invalid ? 400 : 200,
        expectedError: invalid
      });
    },
    async saveCard(cardId, request) {
      return requestJson({
        apiId: "API-007",
        clientMethod: "saveCard",
        method: "POST",
        path: `/api/cards/${encodeURIComponent(cardId)}/save`,
        body: request,
        expectedStatus: request.source ? 200 : 400,
        expectedError: !request.source
      });
    },
    async recordShareEvent(request) {
      const validChannel = ["wechat", "moments", "copy_link", "save_image", "story"].includes(request.channel);
      return requestJson({
        apiId: "API-008",
        clientMethod: "recordShareEvent",
        method: "POST",
        path: "/api/share-events",
        body: request,
        expectedStatus: validChannel && request.cardId && request.source ? 201 : 400,
        expectedError: !(validChannel && request.cardId && request.source)
      });
    },
    async renderShareImage(cardId, request = {}) {
      const invalidFormat = request.format && request.format !== "story-9x16";
      return requestJson({
        apiId: "API-009",
        clientMethod: "renderShareImage",
        method: "POST",
        path: `/api/share-images/${encodeURIComponent(cardId)}`,
        body: request,
        expectedStatus: invalidFormat ? 400 : 200,
        expectedError: invalidFormat
      });
    },
    async recordAnalyticsEvent(request) {
      const invalid = request.eventName === "send_to_production_analytics";
      return requestJson({
        apiId: "API-010",
        clientMethod: "recordAnalyticsEvent",
        method: "POST",
        path: "/api/analytics-events",
        body: request,
        expectedStatus: invalid ? 400 : 202,
        expectedError: invalid
      });
    }
  };
}

try {
  const apiClient = createHttpContractApiClient();
  const store = createShellStore();
  const navigator = createShellNavigator();
  const analytics = createLocalAnalyticsClient({ apiClient, store });

  store.selectScene("date");
  store.selectEnergy("confidence");
  navigator.navigate("/create/energy");
  const generate = await clickGenerateCard({ store, navigator, apiClient, analytics });
  assert.equal(generate.route.uiId, "UI-05");
  assert.equal(generate.job.status, "success");

  const loadingState = renderLoadingPage({ jobId: generate.job.jobId, pollStatus: "pending" });
  assert.equal(loadingState.apiId, "API-002");
  const poll = await pollGenerationJob({ jobId: generate.job.jobId, store, navigator, apiClient, analytics });
  assert.equal(poll.route.uiId, "UI-06");

  const freePreview = await loadFreePreviewCard({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(freePreview.card.locked, true);
  assert.equal(freePreview.viewModel.actions.unlock.route, "/unlock/:id");

  const blockedStore = createShellStore();
  const blockedNavigator = createShellNavigator();
  blockedNavigator.navigate("/create/energy");
  const blockedGenerate = await clickGenerateCard({ store: blockedStore, navigator: blockedNavigator, apiClient, analytics });
  assert.equal(blockedGenerate.blocked, true);
  assert.equal(blockedGenerate.apiCalled, false);

  const failedJob = await apiClient.createGenerationJob({ scene: "luck", energy: "calm", source: "T21-error-ui", forceFailure: true });
  assertErrorEnvelope(failedJob, "API-001 forced failure");
  const networkError = renderNetworkErrorPage({ jobId: failedJob.error.details.jobId });
  assert.equal(networkError.uiId, "UI-18");
  assert.equal(networkError.error.safeCopy, true);
  const retry = await clickGenerationTryAgain({ store, navigator, apiClient, analytics, scene: "date", energy: "confidence" });
  assert.equal(retry.route.uiId, "UI-05");

  const payment = await clickConfirmUnlock({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics, result: "success" });
  assert.equal(payment.entitlement.entitled, true);
  const restore = await clickRestorePurchase({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(restore.entitlement.entitled, true);

  const full = await loadFullResultPage({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(full.card.locked, false);
  const saveFull = await clickSaveCard({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(saveFull.saved.saved, true);
  const shareFull = await clickShareStory({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(shareFull.share.channel, "story");
  const moreShare = await clickMoreSharingOptions({ cardId: shellFixtureIds.cardId, navigator, apiClient, analytics });
  assert.equal(moreShare.share.channel, "story");

  const inviteStart = await trackInviteStartPageView({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(inviteStart.inviteResponse.required, 3);
  const inviteFriends = await clickInviteFriends({ cardId: shellFixtureIds.cardId, navigator, apiClient, analytics });
  assert.equal(inviteFriends.shareResponse.channel, "wechat");
  const copyInvite = await clickCopyInviteLink({ cardId: shellFixtureIds.cardId, apiClient, analytics });
  assert.equal(copyInvite.shareResponse.channel, "copy_link");
  const inviteAgain = await clickInviteAgain({ cardId: shellFixtureIds.cardId, apiClient, analytics });
  assert.equal(inviteAgain.inviteResponse.required, 3);
  const friendLanding = await openFriendLanding({ inviteCode: shellFixtureIds.inviteCode, apiClient, analytics });
  assert.equal(friendLanding.inviteResponse.progress >= 1, true);

  const sharePage = await loadStorySharePage({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(sharePage.shareImage.format, "story-9x16");
  const saveStory = await clickSaveStoryCard({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(saveStory.saved.saved, true);
  const shareStory = await clickShareStoryCard({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(shareStory.share.channel, "story");
  const copyStory = await clickCopyStoryLink({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(copyStory.share.channel, "copy_link");
  for (const channel of shareChannels) {
    const clicked = await clickShareChannel({ cardId: shellFixtureIds.cardId, channelId: channel.id, store, apiClient, analytics });
    assert(["wechat", "moments", "copy_link", "save_image", "story"].includes(clicked.share.channel));
  }

  const savedPage = await loadSaveSuccessPage({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
  assert.equal(savedPage.saved.saved, true);
  const shareNow = await clickShareNowFromSaved({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
  assert.equal(shareNow.share.channel, "story");
  const backHome = await clickBackHomeFromSaved({ cardId: shellFixtureIds.cardId, navigator, analytics });
  assert.equal(backHome.route.uiId, "UI-01");

  const errorContracts = [
    ["API-001", () => apiClient.createGenerationJob({ scene: "", energy: "", source: "T21-invalid" })],
    ["API-002", () => apiClient.getGenerationJob("job-does-not-exist")],
    ["API-003", () => apiClient.getCard("card-does-not-exist", "free")],
    ["API-004", () => apiClient.unlockCard(shellFixtureIds.cardId, { method: "payment", orderId: "order-does-not-exist" })],
    ["API-005", () => apiClient.createMockPaymentOrder({ cardId: "", amount: -1, currency: "USD" })],
    ["API-005", () => apiClient.completeMockPaymentOrder("order-does-not-exist", { result: "success" })],
    ["API-006", () => apiClient.recordInviteEvent(shellFixtureIds.cardId, { action: "invite_button_tap", inviteCode: shellFixtureIds.inviteCode })],
    ["API-007", () => apiClient.saveCard(shellFixtureIds.cardId, { source: "" })],
    ["API-008", () => apiClient.recordShareEvent({ cardId: shellFixtureIds.cardId, channel: "wechat_mock_share", source: "T21" })],
    ["API-009", () => apiClient.renderShareImage(shellFixtureIds.cardId, { templateId: "template-story-001", format: "square" })],
    ["API-010", () => apiClient.recordAnalyticsEvent({ eventName: "send_to_production_analytics", page: "/", properties: {} })]
  ];
  for (const [apiId, run] of errorContracts) {
    const payload = await run();
    assertErrorEnvelope(payload, `${apiId} error contract`);
    errors.push({ apiId, errorCode: payload.error.code, status: "PASS" });
  }

  const expectedApiIds = Array.from({ length: 10 }, (_, index) => `API-${String(index + 1).padStart(3, "0")}`);
  const coveredApiIds = Array.from(new Set(calls.map((call) => call.apiId))).sort();
  assert.deepEqual(coveredApiIds, expectedApiIds);

  const coveredClientMethods = Array.from(new Set(calls.map((call) => call.clientMethod))).sort();
  const expectedClientMethods = Object.values(apiClientCoverage).map((item) => item.clientMethod).sort();
  assert.deepEqual(coveredClientMethods, expectedClientMethods);

  const backendSupportedShareChannels = ["copy_link", "moments", "save_image", "story", "wechat"];
  const observedShareChannels = Array.from(new Set(calls
    .filter((call) => call.apiId === "API-008" && call.responseShape === "success")
    .map((call) => call.request.channel)))
    .sort();
  assert(observedShareChannels.every((channel) => backendSupportedShareChannels.includes(channel)));

  const summary = {
    status: "PASS",
    taskId: "T21",
    scope: "Frontend backend contract tests for mini-program API callers API-001..API-010.",
    acceptanceCriteria: {
      apiClientMethodsMapToApi001ThroughApi010: "PASS",
      everyCallerHasSuccessAndErrorContractTests: "PASS",
      lockedFreeFullEntitlementVisibilityVerified: "PASS",
      contractDriftBlocksTaskSuccess: "PASS"
    },
    backendBaseUrl: `local in-process server on 127.0.0.1:${port}`,
    apiIds: coveredApiIds,
    clientMethods: coveredClientMethods,
    successCallCount: calls.filter((call) => call.responseShape === "success").length,
    errorCallCount: calls.filter((call) => call.responseShape === "error-envelope").length,
    errorContracts: errors,
    lockedFreeFullVisibility: {
      freePreviewLocked: freePreview.card.locked,
      fullAfterMockUnlockLocked: full.card.locked,
      entitlementMethod: full.card.entitlement.method
    },
    loadingAndErrorUi: {
      loadingUiId: loadingState.uiId,
      networkErrorUiId: networkError.uiId,
      retryRouteUiId: retry.route.uiId,
      safeErrorCopy: networkError.error.safeCopy
    },
    shareChannelContract: {
      backendSupportedShareChannels,
      observedShareChannels
    },
    evidence: [
      "docs/auto-execute/api/T21/contract-summary.json",
      "docs/auto-execute/traces/T21/frontend-backend-contract-trace.json",
      "docs/auto-execute/logs/T21/contract-tests.log"
    ],
    noProductionSideEffects: {
      realWeChatPay: false,
      realCloudWrites: false,
      productionDb: false,
      productionAi: false,
      productionAnalytics: false,
      secretsUsed: false
    }
  };

  await writeFile(contractSummaryPath, JSON.stringify(summary, null, 2));
  await writeFile(tracePath, JSON.stringify({ status: "PASS", calls }, null, 2));
  await writeFile(resolve(logDir, "contract-tests.log"), JSON.stringify({
    status: "PASS",
    command: "node apps/wechat-mini/tests/t21-frontend-backend-contract.test.mjs",
    summary: "docs/auto-execute/api/T21/contract-summary.json",
    trace: "docs/auto-execute/traces/T21/frontend-backend-contract-trace.json"
  }, null, 2));
  console.log(JSON.stringify({ status: "PASS", evidence: "docs/auto-execute/api/T21/contract-summary.json" }, null, 2));
} finally {
  server.close();
}
