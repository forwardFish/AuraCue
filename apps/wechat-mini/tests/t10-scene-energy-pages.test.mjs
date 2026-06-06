import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickEnergyOption,
  clickGenerateCard,
  energyOptions,
  renderEnergyPage,
  renderEnergyPageHtml,
  renderIncompleteSelectionHtml,
  renderIncompleteSelectionPage,
  trackEnergyPageView
} from "../src/pages/create/energy-page.mjs";
import {
  clickSceneContinue,
  clickSceneOption,
  renderScenePage,
  renderScenePageHtml,
  sceneOptions,
  trackScenePageView
} from "../src/pages/create/scene-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T10/scene-energy-clicks.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T10");
const logPath = resolve(projectRoot, "docs/auto-execute/logs/T10/scene-energy-pages-test.log");

const scenePageMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/scene.wxml"), "utf8");
const scenePageLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/scene.js"), "utf8");
const scenePageStyles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/scene.wxss"), "utf8");
const energyPageMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/energy.wxml"), "utf8");
const energyPageLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/energy.js"), "utf8");
const energyPageStyles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/energy.wxss"), "utf8");

assert.deepEqual(sceneOptions.map((option) => option.label), ["Date", "Work / Meeting", "Party / Social", "Just need luck"]);
assert.deepEqual(energyOptions.map((option) => option.label), ["Confidence", "Luck", "Love", "Calm", "Charm", "Focus"]);

const sceneView = renderScenePage({ selectedScene: "date" });
assert.equal(sceneView.uiId, "UI-02");
assert.equal(sceneView.route, "/create/scene");
assert.equal(sceneView.options.find((option) => option.id === "date").selected, true);
assert(scenePageMarkup.includes("Where are you"));
assert(scenePageMarkup.includes("bindtap=\"onSceneTap\""));
assert(scenePageMarkup.includes("bindtap=\"onContinueTap\""));
assert(scenePageLogic.includes("blocked_continue_scene"));
assert(scenePageLogic.includes("/pages/create/energy?scene="));
assert(scenePageStyles.includes("#f8f1e9"));
assert(scenePageStyles.includes("#e2b879"));

const energyView = renderEnergyPage({ selectedScene: "date", selectedEnergy: "confidence" });
assert.equal(energyView.uiId, "UI-03");
assert.equal(energyView.route, "/create/energy");
assert.equal(energyView.complete, true);
assert.equal(energyView.validationMessage, null);
assert(energyPageMarkup.includes("Generate My Lucky Aura Card"));
assert(energyPageMarkup.includes("bindtap=\"onEnergyTap\""));
assert(energyPageMarkup.includes("bindtap=\"onGenerateTap\""));
assert(energyPageLogic.includes("localGenerationJobs"));
assert(energyPageLogic.includes("blocked_generate_incomplete_selection"));
assert(energyPageLogic.includes("/pages/create/loading?jobId="));
assert(energyPageStyles.includes("#e5c284"));

const incompleteView = renderIncompleteSelectionPage({ selectedScene: "work", selectedEnergy: null });
assert.equal(incompleteView.uiId, "UI-04");
assert.equal(incompleteView.route, "/create/energy");
assert.equal(incompleteView.complete, false);
assert.equal(incompleteView.validationMessage, "Choose one energy to continue.");

const store = createShellStore();
const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async createGenerationJob(request) {
    apiTrace.push({ method: "createGenerationJob", request });
    return baseApiClient.createGenerationJob(request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();

const scenePageView = await trackScenePageView({ analytics });
assert.equal(scenePageView.accepted, true);

const sceneClicks = [];
for (const option of sceneOptions) {
  const click = await clickSceneOption({ sceneId: option.id, store, analytics });
  assert.equal(click.selectedScene, option.id);
  assert.equal(click.analyticsResponse.accepted, true);
  sceneClicks.push(click);
}

const sceneContinue = await clickSceneContinue({ store, navigator, analytics });
assert.equal(sceneContinue.blocked, false);
assert.equal(sceneContinue.route.path, "/create/energy");
assert.equal(sceneContinue.route.uiId, "UI-03");

const incompleteStore = createShellStore({ scene: "work", energy: null });
const incompleteNavigator = createShellNavigator();
const incompleteAnalytics = createLocalAnalyticsClient({ apiClient, store: incompleteStore });
incompleteNavigator.navigate("/create/energy");
const blockedGenerate = await clickGenerateCard({
  store: incompleteStore,
  navigator: incompleteNavigator,
  apiClient,
  analytics: incompleteAnalytics
});
assert.equal(blockedGenerate.blocked, true);
assert.equal(blockedGenerate.apiCalled, false);
assert.equal(blockedGenerate.validationMessage, "Choose one energy to continue.");
assert.equal(apiTrace.length, 0);

const energyPageView = await trackEnergyPageView({ analytics });
assert.equal(energyPageView.accepted, true);

const energyClicks = [];
for (const option of energyOptions) {
  const click = await clickEnergyOption({ energyId: option.id, store, analytics });
  assert.equal(click.selectedEnergy, option.id);
  assert.equal(click.analyticsResponse.accepted, true);
  energyClicks.push(click);
}

store.selectScene("date");
store.selectEnergy("confidence");
const generation = await clickGenerateCard({ store, navigator, apiClient, analytics });
assert.equal(generation.blocked, false);
assert.equal(generation.apiCalled, true);
assert.equal(generation.job.status, "success");
assert.equal(generation.route.path, "/create/loading");
assert.equal(generation.route.uiId, "UI-05");
assert.equal(apiTrace.length, 1);
assert.deepEqual(apiTrace[0].request, { scene: "date", energy: "confidence", locale: "en-US", source: "UI-03" });

const finalState = store.getState();
const analyticsEventNames = finalState.analyticsEvents.map((event) => event.eventName);
assert(analyticsEventNames.includes("page_view_scene_selection"));
assert(analyticsEventNames.includes("click_scene_continue"));
assert(analyticsEventNames.includes("page_view_energy_selection"));
assert(analyticsEventNames.includes("click_generate_card"));
assert.equal(analyticsEventNames.filter((name) => name === "select_scene").length, 4);
assert.equal(analyticsEventNames.filter((name) => name === "select_energy").length, 6);

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T10",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-006", "REQ-007", "REQ-017"],
  uiIds: ["UI-02", "UI-03", "UI-04"],
  routes: ["/create/scene", "/create/energy", "/create/loading"],
  sourceReferences: {
    "UI-02": sceneView.sourceReference,
    "UI-03": energyView.sourceReference,
    "UI-04": incompleteView.sourceReference
  },
  stitchReferences: {
    "UI-02": sceneView.stitchReference,
    "UI-03": energyView.stitchReference,
    "UI-04": incompleteView.stitchReference
  },
  renderAssertions: {
    sceneOptions: sceneOptions.map((option) => option.label),
    energyOptions: energyOptions.map((option) => option.label),
    incompleteValidation: incompleteView.validationMessage,
    nativePageFiles: [
      "apps/wechat-mini/src/pages/create/scene.wxml",
      "apps/wechat-mini/src/pages/create/scene.wxss",
      "apps/wechat-mini/src/pages/create/scene.js",
      "apps/wechat-mini/src/pages/create/energy.wxml",
      "apps/wechat-mini/src/pages/create/energy.wxss",
      "apps/wechat-mini/src/pages/create/energy.js"
    ]
  },
  clicks: {
    sceneOptions: sceneClicks.map((click) => ({
      controlId: click.controlId,
      label: click.label,
      selectedScene: click.selectedScene,
      analyticsAccepted: click.analyticsResponse.accepted
    })),
    sceneContinue: {
      controlId: sceneContinue.controlId,
      selectedScene: sceneContinue.selectedScene,
      expectedRoute: "/create/energy",
      actualRoute: sceneContinue.route.path,
      analyticsAccepted: sceneContinue.analyticsResponse.accepted
    },
    incompleteGenerate: {
      controlId: blockedGenerate.controlId,
      blocked: blockedGenerate.blocked,
      validationMessage: blockedGenerate.validationMessage,
      apiCalled: blockedGenerate.apiCalled,
      apiTraceLengthAfterBlockedClick: 0
    },
    energyOptions: energyClicks.map((click) => ({
      controlId: click.controlId,
      label: click.label,
      selectedEnergy: click.selectedEnergy,
      analyticsAccepted: click.analyticsResponse.accepted
    })),
    generateComplete: {
      controlId: generation.controlId,
      expectedRoute: "/create/loading",
      actualRoute: generation.route.path,
      apiCalled: generation.apiCalled,
      job: generation.job,
      analyticsAccepted: generation.analyticsResponse.accepted
    }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: finalState.analyticsEvents,
  localOnly: {
    payment: "not-used",
    ai: "fixture-api-client-no-provider-call",
    analytics: "local-fixture-client",
    storage: "local-evidence-files-only",
    db: "no-production-write"
  },
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T10 generated deterministic HTML structural captures; no automated raster screenshot or pixel-diff tooling was run in this task boundary.",
    captures: [
      "docs/auto-execute/screenshots/T10/UI-02-scene.html",
      "docs/auto-execute/screenshots/T10/UI-03-energy.html",
      "docs/auto-execute/screenshots/T10/UI-04-incomplete.html"
    ]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(dirname(logPath), { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(screenshotDir, "UI-02-scene.html"), renderScenePageHtml(sceneView));
await writeFile(resolve(screenshotDir, "UI-03-energy.html"), renderEnergyPageHtml(energyView));
await writeFile(resolve(screenshotDir, "UI-04-incomplete.html"), renderIncompleteSelectionHtml(incompleteView));
await writeFile(resolve(screenshotDir, "UI-02-scene-render-summary.json"), JSON.stringify(sceneView, null, 2));
await writeFile(resolve(screenshotDir, "UI-03-energy-render-summary.json"), JSON.stringify(energyView, null, 2));
await writeFile(resolve(screenshotDir, "UI-04-incomplete-render-summary.json"), JSON.stringify(incompleteView, null, 2));
await writeFile(logPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T10/scene-energy-clicks.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T10/scene-energy-clicks.json", "docs/auto-execute/screenshots/T10/"] }, null, 2));
