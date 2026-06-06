import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickMoreSharingOptions,
  clickSaveCard,
  clickShareStory,
  clickViewTrend,
  loadFullResultPage,
  renderFullResultPage,
  renderFullResultPageHtml
} from "../src/pages/result/full-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T15/full-result.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T15");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T15");
const testLogPath = resolve(logDir, "full-result-page-test.log");

const files = {
  markup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/full.wxml"), "utf8"),
  styles: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/full.wxss"), "utf8"),
  logic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/full.js"), "utf8"),
  module: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/result/full-page.mjs"), "utf8")
};

for (const requiredCopy of [
  "Save Card",
  "Share Story",
  "More Sharing Options",
  "View 7-Day Trend",
  "Coming Soon",
  "Outfit Energy",
  "Beauty Cue",
  "Social Move",
  "Tiny Ritual",
  "Avoid Today"
]) {
  assert(files.markup.includes(requiredCopy) || files.logic.includes(requiredCopy) || files.module.includes(requiredCopy), `Missing UI-14 copy: ${requiredCopy}`);
}

assert(files.logic.includes("/pages/saved/success?id="));
assert(files.logic.includes("/pages/share/story?id="));
assert(files.logic.includes("/pages/share/channels?id="));
assert(!files.logic.includes("/pages/trend"));
assert(!files.module.includes("wx.requestPayment"));

const store = createShellStore();
const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async getCard(cardId, view) {
    apiTrace.push({ apiId: "API-003", method: "getCard", cardId, view });
    return baseApiClient.getCard(cardId, view);
  },
  async saveCard(cardId, request) {
    apiTrace.push({ apiId: "API-007", method: "saveCard", cardId, request });
    return baseApiClient.saveCard(cardId, request);
  },
  async recordShareEvent(request) {
    apiTrace.push({ apiId: "API-008", method: "recordShareEvent", request });
    return baseApiClient.recordShareEvent(request);
  },
  async recordAnalyticsEvent(request) {
    apiTrace.push({ apiId: "API-010", method: "recordAnalyticsEvent", request });
    return baseApiClient.recordAnalyticsEvent(request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();
const cardId = shellFixtureIds.unlockedCardId;

navigator.navigate("/result/:id/full", { id: cardId });
const loaded = await loadFullResultPage({ cardId, store, apiClient, analytics });
const view = loaded.viewModel;

assert.equal(view.uiId, "UI-14");
assert.equal(view.route, "/result/:id/full");
assert.equal(view.actions.saveCard.apiId, "API-007");
assert.equal(view.actions.shareStory.apiId, "API-008");
assert.equal(view.actions.moreSharingOptions.route, "/share/:id/channels");
assert.equal(view.actions.viewTrend.disabled, true);
assert.equal(view.actions.viewTrend.status, "P1_COMING_SOON");
assert.equal(view.guidanceRows.length, 6);

for (const fieldId of ["colors", "outfit", "beauty", "social", "ritual", "avoid"]) {
  assert(view.guidanceRows.some((row) => row.id === fieldId), `Missing structured field ${fieldId}`);
}
for (const key of ["title", "auraName", "tarot", "message", "caption", "theme"]) {
  assert(view[key], `Missing full result field ${key}`);
}

const save = await clickSaveCard({ cardId, navigator, store, apiClient, analytics });
assert.equal(save.controlId, "save-card");
assert.equal(save.route.uiId, "UI-17");
assert.equal(save.saved.saved, true);

navigator.navigate("/result/:id/full", { id: cardId });
const share = await clickShareStory({ cardId, navigator, store, apiClient, analytics });
assert.equal(share.controlId, "share-story");
assert.equal(share.route.uiId, "UI-15");
assert.equal(share.share.channel, "story");

navigator.navigate("/result/:id/full", { id: cardId });
const more = await clickMoreSharingOptions({ cardId, navigator, apiClient, analytics });
assert.equal(more.controlId, "more-sharing-options");
assert.equal(more.route.uiId, "UI-16");
assert.equal(more.share.channel, "story");

const trend = await clickViewTrend({ cardId, analytics });
assert.equal(trend.controlId, "view-7-day-trend");
assert.equal(trend.disabled, true);
assert.equal(trend.route, null);
assert.equal(trend.p1Status, "P1_COMING_SOON");

const analyticsEvents = store.getState().analyticsEvents;
const analyticsEventNames = analyticsEvents.map((event) => event.eventName);
for (const requiredEvent of [
  "page_view_full_result",
  "save_card",
  "share_card",
  "click_more_sharing_options",
  "click_view_7_day_trend_disabled"
]) {
  assert(analyticsEventNames.includes(requiredEvent), `Missing analytics event ${requiredEvent}`);
}

assert(apiTrace.some((entry) => entry.apiId === "API-003" && entry.view === "full"));
assert(apiTrace.some((entry) => entry.apiId === "API-007" && entry.request.source === "full_result"));
assert(apiTrace.some((entry) => entry.apiId === "API-008" && entry.request.channel === "story"));
assert(apiTrace.some((entry) => entry.apiId === "API-008" && entry.request.channel === "story" && entry.request.source === "full_result_more_options"));

const html = renderFullResultPageHtml(view);
assert(html.includes("Golden Comet Aura"));
assert(html.includes("Save Card"));
assert(html.includes("Coming Soon"));

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T15",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-008", "REQ-010", "REQ-017", "REQ-020"],
  uiIds: ["UI-14"],
  routes: ["/result/:id/full", `/result/${cardId}/full`],
  sourceReferences: { "UI-14": view.sourceReference },
  stitchReferences: { "UI-14": view.stitchReference },
  renderAssertions: {
    nativePageFiles: [
      "apps/wechat-mini/src/pages/result/full.wxml",
      "apps/wechat-mini/src/pages/result/full.wxss",
      "apps/wechat-mini/src/pages/result/full.js",
      "apps/wechat-mini/src/pages/result/full-page.mjs"
    ],
    structuredFields: {
      title: view.title,
      auraName: view.auraName,
      tarot: view.tarot.symbol,
      message: view.message,
      colors: view.guidanceRows.find((row) => row.id === "colors").title,
      outfit: view.guidanceRows.find((row) => row.id === "outfit").detail,
      beauty: view.guidanceRows.find((row) => row.id === "beauty").detail,
      social: view.guidanceRows.find((row) => row.id === "social").detail,
      ritual: view.guidanceRows.find((row) => row.id === "ritual").detail,
      avoid: view.guidanceRows.find((row) => row.id === "avoid").detail,
      caption: view.caption,
      theme: view.theme
    },
    p1Trend: { disabled: trend.disabled, status: trend.p1Status, toast: trend.toast }
  },
  clicks: {
    saveCard: { controlId: save.controlId, actualRoute: save.route.path, apiId: save.apiId, saved: save.saved.saved },
    shareStory: { controlId: share.controlId, actualRoute: share.route.path, apiId: share.apiId, shareEventId: share.share.shareEventId },
    moreSharingOptions: { controlId: more.controlId, actualRoute: more.route.path, apiId: more.apiId, channel: more.share.channel },
    viewTrend: { controlId: trend.controlId, disabled: trend.disabled, route: trend.route, p1Status: trend.p1Status }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: analyticsEvents,
  localOnly: view.localOnly,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T15 generated deterministic HTML structural capture and render summary for UI-14; automated raster screenshot and pixel-diff evidence are deferred to T22/T23.",
    captures: ["docs/auto-execute/screenshots/T15/UI-14-full-result.html"],
    missingRasterScreenshots: ["docs/auto-execute/screenshots/T15/UI-14-full-result.png"]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(screenshotDir, "UI-14-full-result.html"), html);
await writeFile(resolve(screenshotDir, "UI-14-full-result-render-summary.json"), JSON.stringify(view, null, 2));
await writeFile(testLogPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T15/full-result.json", screenshot: "docs/auto-execute/screenshots/T15/UI-14-full-result.html" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T15/full-result.json", "docs/auto-execute/screenshots/T15/UI-14-full-result.html"] }, null, 2));
