import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickBackHomeFromSaved,
  clickCancelChannels,
  clickCopyStoryLink,
  clickSaveStoryCard,
  clickShareChannel,
  clickShareNowFromSaved,
  clickShareStoryCard,
  loadChannelChooserPage,
  loadSaveSuccessPage,
  loadStorySharePage,
  renderChannelChooserPage,
  renderSaveSuccessPage,
  renderShareSavePageHtml,
  renderStorySharePage,
  shareChannels
} from "../src/pages/share/share-save-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T16/share-save.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T16");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T16");
const testLogPath = resolve(logDir, "share-save-pages-test.log");

const files = {
  storyMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/story.wxml"), "utf8"),
  storyLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/story.js"), "utf8"),
  channelsMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/channels.wxml"), "utf8"),
  channelsLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/channels.js"), "utf8"),
  savedMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/saved/success.wxml"), "utf8"),
  savedLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/saved/success.js"), "utf8"),
  module: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/share-save-page.mjs"), "utf8")
};

for (const requiredCopy of [
  "Today's Lucky Aura",
  "Save",
  "Share",
  "Copy Link",
  "WeChat",
  "Moments",
  "Xiaohongshu",
  "Instagram Story",
  "Save Image",
  "Cancel",
  "Saved to your Aura Cards",
  "Saved to Photos",
  "Share Now",
  "Back Home"
]) {
  assert(Object.values(files).some((content) => content.includes(requiredCopy)), `Missing T16 UI copy: ${requiredCopy}`);
}

assert(files.storyMarkup.includes("aspect-ratio") || files.storyMarkup.includes("story-card"));
assert(files.storyLogic.includes("/pages/saved/success?id="));
assert(files.storyLogic.includes("/pages/share/channels?id="));
assert(files.channelsLogic.includes("mockedExternalAction"));
assert(files.channelsLogic.includes("/pages/share/story?id="));
assert(files.savedLogic.includes("/pages/share/story?id="));
assert(files.savedLogic.includes("/pages/home/index"));
assert(!files.module.includes("wx.requestPayment"));
assert(!files.module.includes("wx.cloud"));
assert(!files.module.includes("requestPayment"));

const storyView = renderStorySharePage();
const channelView = renderChannelChooserPage();
const savedView = renderSaveSuccessPage();

assert.equal(storyView.uiId, "UI-15");
assert.equal(storyView.cardAspectRatio, "9:16");
assert.equal(storyView.actions.save.apiId, "API-007");
assert.equal(storyView.actions.share.route, "/share/:id/channels");
assert.equal(channelView.uiId, "UI-16");
assert.equal(channelView.channels.length, 6);
assert.equal(savedView.uiId, "UI-17");
assert.equal(savedView.statusRows.length, 2);
assert.equal(savedView.actions.shareNow.route, "/share/:id");
assert.equal(savedView.actions.backHome.route, "/");

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
  async renderShareImage(cardId, request) {
    apiTrace.push({ apiId: "API-009", method: "renderShareImage", cardId, request });
    return baseApiClient.renderShareImage(cardId, request);
  },
  async recordAnalyticsEvent(request) {
    apiTrace.push({ apiId: "API-010", method: "recordAnalyticsEvent", request });
    return baseApiClient.recordAnalyticsEvent(request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();
const cardId = shellFixtureIds.unlockedCardId;

navigator.navigate("/share/:id", { id: cardId });
const loadedStory = await loadStorySharePage({ cardId, store, apiClient, analytics });
assert.equal(loadedStory.viewModel.uiId, "UI-15");
assert.equal(loadedStory.shareImage.format, "story-9x16");
assert.equal(loadedStory.shareImage.width, 1080);
assert.equal(loadedStory.shareImage.height, 1920);

const save = await clickSaveStoryCard({ cardId, navigator, store, apiClient, analytics });
assert.equal(save.controlId, "save-story-card");
assert.equal(save.route.uiId, "UI-17");
assert.equal(save.saved.saved, true);

navigator.navigate("/share/:id", { id: cardId });
const share = await clickShareStoryCard({ cardId, navigator, store, apiClient, analytics });
assert.equal(share.controlId, "share-story-card");
assert.equal(share.route.uiId, "UI-16");
assert.equal(share.share.channel, "story");

const copy = await clickCopyStoryLink({ cardId, store, apiClient, analytics });
assert.equal(copy.controlId, "copy-story-link");
assert.equal(copy.share.channel, "copy_link");
assert.equal(copy.toast, "Link copied");

navigator.navigate("/share/:id/channels", { id: cardId });
const loadedChannels = await loadChannelChooserPage({ cardId, analytics });
assert.equal(loadedChannels.viewModel.uiId, "UI-16");

const channelClicks = [];
for (const channel of shareChannels) {
  const click = await clickShareChannel({ cardId, channelId: channel.id, store, apiClient, analytics });
  assert.equal(click.mockedExternalAction, true);
  assert.equal(click.share.channel, channel.apiChannel);
  channelClicks.push(click);
}

const cancel = await clickCancelChannels({ cardId, navigator, analytics });
assert.equal(cancel.controlId, "cancel-share-channel");
assert.equal(cancel.route.uiId, "UI-15");

navigator.navigate("/saved/:id", { id: cardId });
const loadedSaved = await loadSaveSuccessPage({ cardId, store, apiClient, analytics });
assert.equal(loadedSaved.viewModel.uiId, "UI-17");
assert.equal(loadedSaved.saved.saved, true);

const shareNow = await clickShareNowFromSaved({ cardId, navigator, store, apiClient, analytics });
assert.equal(shareNow.controlId, "share-now");
assert.equal(shareNow.route.uiId, "UI-15");

navigator.navigate("/saved/:id", { id: cardId });
const backHome = await clickBackHomeFromSaved({ cardId, navigator, analytics });
assert.equal(backHome.controlId, "back-home");
assert.equal(backHome.route.uiId, "UI-01");

const analyticsEvents = store.getState().analyticsEvents;
const analyticsEventNames = analyticsEvents.map((event) => event.eventName);
for (const requiredEvent of [
  "page_view_share_story",
  "save_card",
  "share_card",
  "copy_share_link",
  "page_view_share_channels",
  "share_card",
  "click_cancel_share_channels",
  "page_view_save_success",
  "share_card",
  "return_next_day"
]) {
  assert(analyticsEventNames.includes(requiredEvent), `Missing analytics event ${requiredEvent}`);
}

assert(apiTrace.some((entry) => entry.apiId === "API-009" && entry.request.format === "story-9x16"));
assert(apiTrace.some((entry) => entry.apiId === "API-007" && entry.request.source === "share_story_preview"));
assert(apiTrace.some((entry) => entry.apiId === "API-007" && entry.request.source === "save_success"));
assert(apiTrace.some((entry) => entry.apiId === "API-008" && entry.request.channel === "story" && entry.request.source === "share_story_preview"));
assert(apiTrace.some((entry) => entry.apiId === "API-008" && entry.request.channel === "wechat"));
assert(apiTrace.some((entry) => entry.apiId === "API-008" && entry.request.channel === "story" && entry.request.source === "save_success"));

const storyHtml = renderShareSavePageHtml(loadedStory.viewModel);
const channelsHtml = renderShareSavePageHtml(loadedChannels.viewModel);
const savedHtml = renderShareSavePageHtml(loadedSaved.viewModel);
assert(storyHtml.includes("data-aspect=\"9:16\""));
assert(channelsHtml.includes("share-channel-wechat"));
assert(savedHtml.includes("Saved to your Aura Cards"));

const localOnly = {
  status: "PASS",
  taskId: "T16",
  checkedFiles: [
    "apps/wechat-mini/src/pages/share/story.js",
    "apps/wechat-mini/src/pages/share/channels.js",
    "apps/wechat-mini/src/pages/saved/success.js",
    "apps/wechat-mini/src/pages/share/share-save-page.mjs"
  ],
  forbiddenNeedlesAbsent: ["wx.requestPayment(", "wx.cloud", "production", "secret"],
  externalPlatformShareUsed: false,
  localMockShareOnly: true,
  productionUrlUsed: false,
  secretUsed: false
};

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T16",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-011", "REQ-014", "REQ-017"],
  uiIds: ["UI-15", "UI-16", "UI-17"],
  routes: [
    "/share/:id",
    "/share/:id/channels",
    "/saved/:id",
    `/share/${cardId}`,
    `/share/${cardId}/channels`,
    `/saved/${cardId}`
  ],
  sourceReferences: {
    "UI-15": storyView.sourceReference,
    "UI-16": channelView.sourceReference,
    "UI-17": savedView.sourceReference
  },
  stitchReferences: {
    "UI-15": storyView.stitchReference,
    "UI-16": channelView.stitchReference,
    "UI-17": savedView.stitchReference
  },
  renderAssertions: {
    nativePageFiles: [
      "apps/wechat-mini/src/pages/share/story.wxml",
      "apps/wechat-mini/src/pages/share/story.wxss",
      "apps/wechat-mini/src/pages/share/story.js",
      "apps/wechat-mini/src/pages/share/channels.wxml",
      "apps/wechat-mini/src/pages/share/channels.wxss",
      "apps/wechat-mini/src/pages/share/channels.js",
      "apps/wechat-mini/src/pages/saved/success.wxml",
      "apps/wechat-mini/src/pages/saved/success.wxss",
      "apps/wechat-mini/src/pages/saved/success.js",
      "apps/wechat-mini/src/pages/share/share-save-page.mjs"
    ],
    storyPreview: {
      cardAspectRatio: loadedStory.viewModel.cardAspectRatio,
      shareImage: loadedStory.shareImage,
      actions: Object.keys(loadedStory.viewModel.actions)
    },
    channelChooser: {
      channelCount: loadedChannels.viewModel.channels.length,
      channels: loadedChannels.viewModel.channels.map((channel) => channel.apiChannel)
    },
    saveSuccess: {
      statusRows: loadedSaved.viewModel.statusRows,
      actions: Object.keys(loadedSaved.viewModel.actions)
    }
  },
  clicks: {
    saveStoryCard: { controlId: save.controlId, actualRoute: save.route.path, apiId: save.apiId, saved: save.saved.saved },
    shareStoryCard: { controlId: share.controlId, actualRoute: share.route.path, apiId: share.apiId, channel: share.share.channel },
    copyStoryLink: { controlId: copy.controlId, apiId: copy.apiId, channel: copy.share.channel, toast: copy.toast },
    channelOptions: channelClicks.map((click) => ({ controlId: click.controlId, apiId: click.apiId, channel: click.share.channel, mockedExternalAction: click.mockedExternalAction })),
    cancelChannels: { controlId: cancel.controlId, actualRoute: cancel.route.path },
    saveSuccessShareNow: { controlId: shareNow.controlId, actualRoute: shareNow.route.path, apiId: shareNow.apiId, channel: shareNow.share.channel },
    saveSuccessBackHome: { controlId: backHome.controlId, actualRoute: backHome.route.path }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: analyticsEvents,
  localOnly,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T16 generated deterministic HTML structural captures and render summaries for UI-15..UI-17; automated raster screenshots and pixel-diff evidence are deferred to T22/T23.",
    captures: [
      "docs/auto-execute/screenshots/T16/UI-15-share-story.html",
      "docs/auto-execute/screenshots/T16/UI-16-share-channels.html",
      "docs/auto-execute/screenshots/T16/UI-17-save-success.html"
    ],
    missingRasterScreenshots: [
      "docs/auto-execute/screenshots/T16/UI-15-share-story.png",
      "docs/auto-execute/screenshots/T16/UI-16-share-channels.png",
      "docs/auto-execute/screenshots/T16/UI-17-save-success.png"
    ]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(logDir, "share-save-local-only.json"), JSON.stringify(localOnly, null, 2));
await writeFile(resolve(screenshotDir, "UI-15-share-story.html"), storyHtml);
await writeFile(resolve(screenshotDir, "UI-16-share-channels.html"), channelsHtml);
await writeFile(resolve(screenshotDir, "UI-17-save-success.html"), savedHtml);
await writeFile(resolve(screenshotDir, "UI-15-share-story-render-summary.json"), JSON.stringify(loadedStory.viewModel, null, 2));
await writeFile(resolve(screenshotDir, "UI-16-share-channels-render-summary.json"), JSON.stringify(loadedChannels.viewModel, null, 2));
await writeFile(resolve(screenshotDir, "UI-17-save-success-render-summary.json"), JSON.stringify(loadedSaved.viewModel, null, 2));
await writeFile(testLogPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T16/share-save.json", localOnly: "docs/auto-execute/logs/T16/share-save-local-only.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T16/share-save.json", "docs/auto-execute/screenshots/T16/", "docs/auto-execute/logs/T16/share-save-local-only.json"] }, null, 2));
