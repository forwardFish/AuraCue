import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { loadStorySharePage, renderShareSavePageHtml } from "../src/pages/share/share-save-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T17");
const traceDir = resolve(projectRoot, "docs/auto-execute/traces/T17");

const storyMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/story.wxml"), "utf8");
const storyLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/share/story.js"), "utf8");
assert(storyMarkup.includes("shareImageDataUrl"));
assert(storyMarkup.includes("data-renderer-path"));
assert(storyMarkup.includes("data-renderer-key"));
assert(storyLogic.includes("shareImagePath"));
assert(storyLogic.includes("shareImageKey"));

const store = createShellStore();
const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async getCard(cardId, view) {
    apiTrace.push({ apiId: "API-003", method: "getCard", cardId, view });
    return baseApiClient.getCard(cardId, view);
  },
  async renderShareImage(cardId, request) {
    const response = await baseApiClient.renderShareImage(cardId, request);
    apiTrace.push({
      apiId: "API-009",
      method: "renderShareImage",
      cardId,
      request,
      response: {
        localPath: response.localPath,
        width: response.width,
        height: response.height,
        artifactKind: response.artifactKind,
        dataUrlSha256: response.dataUrlSha256
      }
    });
    return response;
  },
  async recordAnalyticsEvent(request) {
    apiTrace.push({ apiId: "API-010", method: "recordAnalyticsEvent", request });
    return baseApiClient.recordAnalyticsEvent(request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const cardId = shellFixtureIds.unlockedCardId;
const loadedStory = await loadStorySharePage({ cardId, store, apiClient, analytics });
const html = renderShareSavePageHtml(loadedStory.viewModel);

assert.equal(loadedStory.viewModel.uiId, "UI-15");
assert.equal(loadedStory.shareImage.artifactKind, "svg-data-url");
assert.equal(loadedStory.shareImage.width, 1080);
assert.equal(loadedStory.shareImage.height, 1920);
assert(loadedStory.shareImage.dataUrl.startsWith("data:image/svg+xml;base64,"));
assert.equal(loadedStory.viewModel.renderedArtifact.dataUrlSha256, loadedStory.shareImage.dataUrlSha256);
assert.equal(store.getState().shareSave.shareImagePath, loadedStory.shareImage.localPath);
assert(html.includes("data-renderer-key="));
assert(html.includes(loadedStory.shareImage.localPath));
assert(apiTrace.some((entry) => entry.apiId === "API-009" && entry.request.format === "story-9x16"));

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T17",
  requirementIds: ["REQ-002", "REQ-014"],
  uiIds: ["UI-15"],
  apiIds: ["API-009"],
  route: "/share/:id",
  rendererDisplayedByUi15: true,
  shareImage: {
    cardId: loadedStory.shareImage.cardId,
    localPath: loadedStory.shareImage.localPath,
    width: loadedStory.shareImage.width,
    height: loadedStory.shareImage.height,
    artifactKind: loadedStory.shareImage.artifactKind,
    dataUrlSha256: loadedStory.shareImage.dataUrlSha256,
    deterministicKey: loadedStory.shareImage.deterministicKey
  },
  apiTrace,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T17 verifies deterministic renderer integration and writes structural HTML/SVG evidence. Raster screenshot and pixel diff remain scheduled for T22/T23.",
    structuralCapture: "docs/auto-execute/screenshots/T17/UI-15-share-renderer.html"
  }
};

await mkdir(screenshotDir, { recursive: true });
await mkdir(traceDir, { recursive: true });
await writeFile(resolve(screenshotDir, "UI-15-share-renderer.html"), html);
await writeFile(resolve(screenshotDir, "UI-15-share-renderer-summary.json"), JSON.stringify(loadedStory.viewModel, null, 2));
await writeFile(resolve(traceDir, "ui15-share-renderer.json"), JSON.stringify(trace, null, 2));

console.log(JSON.stringify({
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  evidence: [
    "docs/auto-execute/screenshots/T17/UI-15-share-renderer.html",
    "docs/auto-execute/screenshots/T17/UI-15-share-renderer-summary.json",
    "docs/auto-execute/traces/T17/ui15-share-renderer.json"
  ]
}, null, 2));
