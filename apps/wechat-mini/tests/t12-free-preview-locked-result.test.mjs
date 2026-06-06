import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickInviteToUnlock,
  clickUnlockFullCard,
  loadFreePreviewCard,
  renderFreePreviewPage,
  renderFreePreviewPageHtml
} from "../src/pages/result/free-preview-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T12/free-preview.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T12");
const logPath = resolve(projectRoot, "docs/auto-execute/logs/T12/free-preview-locked-result-test.log");

const markup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/free-preview.wxml"), "utf8");
const logic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/free-preview.js"), "utf8");
const styles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/free-preview.wxss"), "utf8");

assert(markup.includes("Unlock Full Card"));
assert(markup.includes("Invite 3 friends to unlock"));
assert(markup.includes("AuraCue Preview"));
assert(markup.includes("filter:") === false, "WXML must not inline styles; blur belongs in WXSS");
assert(logic.includes("API-003"));
assert(logic.includes("view: \"free\""));
assert(logic.includes("/pages/unlock/index?id="));
assert(logic.includes("/pages/invite/start?id="));
assert(logic.includes("lockedFullContentExposed: false"));
assert(styles.includes("filter: blur(4px)"));
assert(styles.includes("linear-gradient(135deg, #2d3a5f 0%, #d4a39b 100%)"));

const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async getCard(cardId, view) {
    apiTrace.push({ apiId: "API-003", method: "getCard", cardId, view });
    return baseApiClient.getCard(cardId, view);
  }
};

const store = createShellStore();
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();
navigator.navigate("/result/:id", { id: shellFixtureIds.cardId });

const load = await loadFreePreviewCard({
  cardId: shellFixtureIds.cardId,
  store,
  apiClient,
  analytics
});

assert.equal(load.apiCalled, true);
assert.equal(load.apiId, "API-003");
assert.equal(load.requestedView, "free");
assert.equal(load.card.view, "free");
assert.equal(load.card.locked, true);
assert.equal(load.card.lockedPreview.fullContentAvailable, false);
assert.equal(load.viewModel.uiId, "UI-06");
assert.equal(load.viewModel.freeFields.auraName, "Soft Glow Aura");
assert.equal(load.viewModel.freeFields.luckyColor, "Champagne Gold");
assert.equal(load.viewModel.freeFields.oneLineReminder, "Step into tonight with calm confidence.");
assert.equal(load.viewModel.freeFields.previewImage.variant, "low-res-watermarked");
assert.equal(load.viewModel.freeFields.previewImage.watermark, "AuraCue Preview");
assert.equal(load.viewModel.lockedPreview.unlockRequired, true);
assert.equal(load.viewModel.lockedPreview.fullContentAvailable, false);
assert.deepEqual(load.viewModel.lockedPreview.hiddenFields, ["outfit", "beauty", "social", "ritual", "avoid", "caption", "theme"]);

const serializedView = JSON.stringify(load.viewModel);
assert(!serializedView.includes("A clean light layer"), "Locked preview must not expose full outfit copy.");
assert(!serializedView.includes("Soft highlight"), "Locked preview must not expose full beauty copy.");
assert(!serializedView.includes("Open with a sincere compliment"), "Locked preview must not expose full social copy.");
assert(!serializedView.includes("Take three slow breaths"), "Locked preview must not expose full ritual copy.");
assert(!serializedView.includes("Tonight I am choosing"), "Locked preview must not expose full caption copy.");

const unlockClick = await clickUnlockFullCard({
  cardId: shellFixtureIds.cardId,
  navigator,
  analytics
});
assert.equal(unlockClick.controlId, "unlock-full-card");
assert.equal(unlockClick.route.path, `/unlock/${shellFixtureIds.cardId}`);
assert.equal(unlockClick.route.uiId, "UI-07");

const inviteClick = await clickInviteToUnlock({
  cardId: shellFixtureIds.cardId,
  navigator,
  analytics
});
assert.equal(inviteClick.controlId, "invite-three-friends");
assert.equal(inviteClick.route.path, `/invite/${shellFixtureIds.cardId}`);
assert.equal(inviteClick.route.uiId, "UI-08");

assert.deepEqual(apiTrace, [{ apiId: "API-003", method: "getCard", cardId: shellFixtureIds.cardId, view: "free" }]);

const finalState = store.getState();
const analyticsEventNames = finalState.analyticsEvents.map((event) => event.eventName);
assert(analyticsEventNames.includes("view_result_free"));
assert(analyticsEventNames.includes("click_unlock"));
assert(analyticsEventNames.includes("click_invite_unlock_entry"));

const renderSummary = renderFreePreviewPage({ card: load.card });
const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T12",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-009", "REQ-017"],
  uiIds: ["UI-06"],
  routes: ["/result/:id", `/result/${shellFixtureIds.cardId}`, `/unlock/${shellFixtureIds.cardId}`, `/invite/${shellFixtureIds.cardId}`],
  sourceReferences: {
    "UI-06": renderSummary.sourceReference
  },
  stitchReferences: {
    "UI-06": renderSummary.stitchReference
  },
  renderAssertions: {
    apiId: "API-003",
    requestedView: "free",
    freeFieldsShown: Object.keys(load.viewModel.freeFields),
    lockedFullContentExposed: false,
    hiddenFields: load.viewModel.lockedPreview.hiddenFields,
    lockedRows: load.viewModel.lockedPreview.rows.map((row) => row.id),
    nativePageFiles: [
      "apps/wechat-mini/src/pages/result/free-preview.wxml",
      "apps/wechat-mini/src/pages/result/free-preview.wxss",
      "apps/wechat-mini/src/pages/result/free-preview.js",
      "apps/wechat-mini/src/pages/result/free-preview.json"
    ]
  },
  clicks: {
    unlock: {
      controlId: unlockClick.controlId,
      expectedRoute: "/unlock/:id",
      actualRoute: unlockClick.route.path,
      analyticsAccepted: unlockClick.analyticsResponse.accepted
    },
    invite: {
      controlId: inviteClick.controlId,
      expectedRoute: "/invite/:id",
      actualRoute: inviteClick.route.path,
      analyticsAccepted: inviteClick.analyticsResponse.accepted
    }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: finalState.analyticsEvents,
  localOnly: load.viewModel.localOnly,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T12 generated deterministic HTML structural capture and render summary for UI-06; automated raster screenshot and pixel-diff evidence were unavailable in this task boundary.",
    captures: [
      "docs/auto-execute/screenshots/T12/UI-06-free-preview.html",
      "docs/auto-execute/screenshots/T12/UI-06-free-preview-render-summary.json"
    ],
    missingRequestedRasterPath: "docs/auto-execute/screenshots/T12/UI-06-free-preview.png"
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(dirname(logPath), { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(screenshotDir, "UI-06-free-preview.html"), renderFreePreviewPageHtml(load.viewModel));
await writeFile(resolve(screenshotDir, "UI-06-free-preview-render-summary.json"), JSON.stringify(load.viewModel, null, 2));
await writeFile(logPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T12/free-preview.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T12/free-preview.json", "docs/auto-execute/screenshots/T12/UI-06-free-preview.html"] }, null, 2));
