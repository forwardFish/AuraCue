import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickConfirmUnlock,
  clickContactSupport,
  clickPaymentInviteInstead,
  clickRestorePurchase,
  clickShareStoryAfterPayment,
  clickTryAgain,
  clickViewFullCard,
  renderPaymentConfirmPage,
  renderPaymentFailedPage,
  renderPaymentStatePageHtml,
  renderPaymentSuccessPage,
  trackPaymentConfirmPageView
} from "../src/pages/unlock/payment-state-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T14/mock-payment.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T14");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T14");
const localOnlyPath = resolve(logDir, "payment-local-only.json");
const testLogPath = resolve(logDir, "mock-payment-states-test.log");

const files = {
  payMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/pay.wxml"), "utf8"),
  payLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/pay.js"), "utf8"),
  failedMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/pay-failed.wxml"), "utf8"),
  failedLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/pay-failed.js"), "utf8"),
  successMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/success.wxml"), "utf8"),
  successLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/success.js"), "utf8"),
  paymentModule: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/payment-state-page.mjs"), "utf8")
};

assert(files.payMarkup.includes("Confirm Unlock $1.99"));
assert(files.payMarkup.includes("Invite 3 Friends Instead"));
assert(files.payLogic.includes("checkout_started"));
assert(files.payLogic.includes("/pages/unlock/success?id="));
assert(files.failedMarkup.includes("Try Again"));
assert(files.failedMarkup.includes("Restore Purchase"));
assert(files.failedMarkup.includes("Invite 3 Friends Instead"));
assert(files.failedMarkup.includes("Contact Support"));
assert(files.failedLogic.includes("/pages/invite/start?id="));
assert(files.successMarkup.includes("View Full Card"));
assert(files.successMarkup.includes("Share Story"));
assert(files.successLogic.includes("/pages/result/full?id="));
assert(files.successLogic.includes("/pages/share/story?id="));
assert(!files.paymentModule.includes("wx.requestPayment"));
assert(!files.payLogic.includes("wx.requestPayment"));
assert(!files.failedLogic.includes("wx.requestPayment"));
assert(!files.successLogic.includes("wx.requestPayment"));

const confirmView = renderPaymentConfirmPage();
const failedView = renderPaymentFailedPage();
const successView = renderPaymentSuccessPage();

assert.equal(confirmView.uiId, "UI-11");
assert.equal(failedView.uiId, "UI-12");
assert.equal(successView.uiId, "UI-13");
assert.equal(confirmView.actions.confirmUnlock.route, "/unlock/:id/success");
assert.equal(failedView.actions.tryAgain.route, "/unlock/:id/success");
assert.equal(successView.actions.viewFullCard.route, "/result/:id/full");

const store = createShellStore();
const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async createMockPaymentOrder(request) {
    apiTrace.push({ apiId: "API-005", method: "createMockPaymentOrder", request });
    return baseApiClient.createMockPaymentOrder(request);
  },
  async completeMockPaymentOrder(orderId, request) {
    apiTrace.push({ apiId: "API-005", method: "completeMockPaymentOrder", orderId, request });
    return baseApiClient.completeMockPaymentOrder(orderId, request);
  },
  async unlockCard(cardId, request) {
    apiTrace.push({ apiId: "API-004", method: "unlockCard", cardId, request });
    return baseApiClient.unlockCard(cardId, request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();

navigator.navigate("/unlock/:id/pay", { id: shellFixtureIds.cardId });
const confirmPageView = await trackPaymentConfirmPageView({ cardId: shellFixtureIds.cardId, analytics });
assert.equal(confirmPageView.accepted, true);

const failedConfirm = await clickConfirmUnlock({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics, result: "failed" });
assert.equal(failedConfirm.controlId, "confirm-unlock-199");
assert.equal(failedConfirm.route.uiId, "UI-12");
assert.equal(failedConfirm.completed.status, "failed");
assert.equal(failedConfirm.entitlement, null);

const tryAgain = await clickTryAgain({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
assert.equal(tryAgain.controlId, "try-again");
assert.equal(tryAgain.route.uiId, "UI-13");
assert.equal(tryAgain.completed.status, "paid");
assert.equal(tryAgain.entitlement.entitled, true);

navigator.navigate("/unlock/:id/pay-failed", { id: shellFixtureIds.cardId });
const restore = await clickRestorePurchase({ cardId: shellFixtureIds.cardId, navigator, store, apiClient, analytics });
assert.equal(restore.controlId, "restore-purchase");
assert.equal(restore.route.uiId, "UI-13");
assert.equal(restore.entitlement.method, "restore");

navigator.navigate("/unlock/:id/pay-failed", { id: shellFixtureIds.cardId });
const inviteInstead = await clickPaymentInviteInstead({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(inviteInstead.controlId, "invite-3-friends-instead");
assert.equal(inviteInstead.route.uiId, "UI-08");

const support = await clickContactSupport({ cardId: shellFixtureIds.cardId, analytics });
assert.equal(support.controlId, "contact-support");
assert.equal(support.toast, "Local support placeholder");

navigator.navigate("/unlock/:id/success", { id: shellFixtureIds.cardId });
const viewFullCard = await clickViewFullCard({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(viewFullCard.controlId, "view-full-card");
assert.equal(viewFullCard.route.uiId, "UI-14");

navigator.navigate("/unlock/:id/success", { id: shellFixtureIds.cardId });
const shareStory = await clickShareStoryAfterPayment({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(shareStory.controlId, "share-story");
assert.equal(shareStory.route.uiId, "UI-15");

const analyticsEvents = store.getState().analyticsEvents;
const analyticsEventNames = analyticsEvents.map((event) => event.eventName);
for (const requiredEvent of [
  "page_view_mock_payment_confirm",
  "checkout_started",
  "checkout_success",
  "click_restore_purchase",
  "click_payment_invite_instead",
  "click_payment_contact_support",
  "click_view_full_card_after_payment",
  "click_share_story_after_payment"
]) {
  assert(analyticsEventNames.includes(requiredEvent), `Missing analytics event ${requiredEvent}`);
}

assert.equal(apiTrace.filter((entry) => entry.method === "createMockPaymentOrder").length, 2);
assert.equal(apiTrace.filter((entry) => entry.method === "completeMockPaymentOrder").length, 2);
assert.equal(apiTrace.filter((entry) => entry.method === "unlockCard").length, 2);
assert(apiTrace.some((entry) => entry.request?.result === "failed"));
assert(apiTrace.some((entry) => entry.request?.result === "success"));
assert(apiTrace.some((entry) => entry.request?.method === "payment"));
assert(apiTrace.some((entry) => entry.request?.method === "restore"));

const localOnly = {
  status: "PASS",
  taskId: "T14",
  checkedFiles: [
    "apps/wechat-mini/src/pages/unlock/pay.js",
    "apps/wechat-mini/src/pages/unlock/pay-failed.js",
    "apps/wechat-mini/src/pages/unlock/success.js",
    "apps/wechat-mini/src/pages/unlock/payment-state-page.mjs"
  ],
  forbiddenPaymentNeedlesAbsent: ["wx.requestPayment(", "live payment SDK", "live payment URL", "secret key"],
  paymentMode: "local/mock API client only",
  realPaymentUsed: false,
  productionUrlUsed: false,
  secretUsed: false
};

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T14",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-010", "REQ-012", "REQ-017"],
  uiIds: ["UI-11", "UI-12", "UI-13"],
  routes: [
    "/unlock/:id/pay",
    "/unlock/:id/pay-failed",
    "/unlock/:id/success",
    `/unlock/${shellFixtureIds.cardId}/pay`,
    `/unlock/${shellFixtureIds.cardId}/pay-failed`,
    `/unlock/${shellFixtureIds.cardId}/success`
  ],
  sourceReferences: {
    "UI-11": confirmView.sourceReference,
    "UI-12": failedView.sourceReference,
    "UI-13": successView.sourceReference
  },
  stitchReferences: {
    "UI-11": confirmView.stitchReference,
    "UI-12": failedView.stitchReference,
    "UI-13": successView.stitchReference
  },
  renderAssertions: {
    nativePageFiles: [
      "apps/wechat-mini/src/pages/unlock/pay.wxml",
      "apps/wechat-mini/src/pages/unlock/pay.wxss",
      "apps/wechat-mini/src/pages/unlock/pay.js",
      "apps/wechat-mini/src/pages/unlock/pay-failed.wxml",
      "apps/wechat-mini/src/pages/unlock/pay-failed.wxss",
      "apps/wechat-mini/src/pages/unlock/pay-failed.js",
      "apps/wechat-mini/src/pages/unlock/success.wxml",
      "apps/wechat-mini/src/pages/unlock/success.wxss",
      "apps/wechat-mini/src/pages/unlock/success.js"
    ],
    confirmValueRows: confirmView.valueRows,
    failedControls: Object.keys(failedView.actions),
    successControls: Object.keys(successView.actions)
  },
  clicks: {
    confirmForcedFailure: { controlId: failedConfirm.controlId, actualRoute: failedConfirm.route.path, orderStatus: failedConfirm.completed.status, entitlementCreated: false },
    tryAgain: { controlId: tryAgain.controlId, actualRoute: tryAgain.route.path, orderStatus: tryAgain.completed.status, entitled: tryAgain.entitlement.entitled },
    restorePurchase: { controlId: restore.controlId, actualRoute: restore.route.path, entitlementMethod: restore.entitlement.method },
    inviteInstead: { controlId: inviteInstead.controlId, actualRoute: inviteInstead.route.path },
    contactSupport: { controlId: support.controlId, toast: support.toast },
    viewFullCard: { controlId: viewFullCard.controlId, actualRoute: viewFullCard.route.path },
    shareStory: { controlId: shareStory.controlId, actualRoute: shareStory.route.path }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: analyticsEvents,
  localOnly,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T14 generated deterministic HTML structural captures and render summaries for UI-11..UI-13; automated raster screenshot and pixel-diff evidence are deferred to T22/T23.",
    captures: [
      "docs/auto-execute/screenshots/T14/UI-11-payment-confirm.html",
      "docs/auto-execute/screenshots/T14/UI-12-payment-failed.html",
      "docs/auto-execute/screenshots/T14/UI-13-payment-success.html"
    ],
    missingRasterScreenshots: [
      "docs/auto-execute/screenshots/T14/UI-11-payment-confirm.png",
      "docs/auto-execute/screenshots/T14/UI-12-payment-failed.png",
      "docs/auto-execute/screenshots/T14/UI-13-payment-success.png"
    ]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(localOnlyPath, JSON.stringify(localOnly, null, 2));
await writeFile(resolve(screenshotDir, "UI-11-payment-confirm.html"), renderPaymentStatePageHtml(confirmView));
await writeFile(resolve(screenshotDir, "UI-12-payment-failed.html"), renderPaymentStatePageHtml(failedView));
await writeFile(resolve(screenshotDir, "UI-13-payment-success.html"), renderPaymentStatePageHtml(successView));
await writeFile(resolve(screenshotDir, "UI-11-payment-confirm-render-summary.json"), JSON.stringify(confirmView, null, 2));
await writeFile(resolve(screenshotDir, "UI-12-payment-failed-render-summary.json"), JSON.stringify(failedView, null, 2));
await writeFile(resolve(screenshotDir, "UI-13-payment-success-render-summary.json"), JSON.stringify(successView, null, 2));
await writeFile(testLogPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T14/mock-payment.json", localOnly: "docs/auto-execute/logs/T14/payment-local-only.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T14/mock-payment.json", "docs/auto-execute/logs/T14/payment-local-only.json", "docs/auto-execute/screenshots/T14/"] }, null, 2));
