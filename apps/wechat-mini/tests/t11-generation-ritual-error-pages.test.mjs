import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  pollGenerationJob,
  renderLoadingPage,
  renderLoadingPageHtml,
  trackLoadingPageView
} from "../src/pages/create/loading-page.mjs";
import {
  clickChangeScene,
  clickTryAgain,
  renderNetworkErrorPage,
  renderNetworkErrorPageHtml,
  trackNetworkErrorPageView
} from "../src/pages/error/network-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T11/generation-error.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T11");
const logPath = resolve(projectRoot, "docs/auto-execute/logs/T11/generation-ritual-error-pages-test.log");

const loadingMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/loading.wxml"), "utf8");
const loadingLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/loading.js"), "utf8");
const loadingStyles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/create/loading.wxss"), "utf8");
const errorMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/error/network.wxml"), "utf8");
const errorLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/error/network.js"), "utf8");
const errorStyles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/error/network.wxss"), "utf8");

const loadingView = renderLoadingPage({ jobId: shellFixtureIds.jobId, pollStatus: "pending" });
assert.equal(loadingView.uiId, "UI-05");
assert.equal(loadingView.route, "/create/loading");
assert.equal(loadingView.apiId, "API-002");
assert.equal(loadingView.nextRoutes.success, "/result/:id");
assert.equal(loadingView.nextRoutes.failure, "/error/network");
assert(loadingMarkup.includes("Drawing your"));
assert(loadingMarkup.includes("Lucky Aura Card"));
assert(loadingMarkup.includes("This takes a few seconds."));
assert(loadingLogic.includes("pollGenerationJob"));
assert(loadingLogic.includes("API-002"));
assert(loadingLogic.includes("/pages/result/free-preview?id="));
assert(loadingLogic.includes("/pages/error/network?jobId="));
assert(loadingStyles.includes("#c5a070"));
assert(loadingStyles.includes("radial-gradient"));

const errorView = renderNetworkErrorPage({ jobId: shellFixtureIds.failedJobId });
assert.equal(errorView.uiId, "UI-18");
assert.equal(errorView.route, "/error/network");
assert.equal(errorView.error.safeCopy, true);
assert.equal(errorView.actions.retry.label, "Try Again");
assert.equal(errorView.actions.changeScene.label, "Change Scene");
assert(errorMarkup.includes("Your aura slipped away"));
assert(errorMarkup.includes("Try Again"));
assert(errorMarkup.includes("Change Scene"));
assert(!errorMarkup.toLowerCase().includes("your fault"));
assert(!errorMarkup.toLowerCase().includes("you failed"));
assert(errorLogic.includes("onTryAgainTap"));
assert(errorLogic.includes("/pages/create/loading?jobId="));
assert(errorLogic.includes("/pages/create/scene"));
assert(errorStyles.includes("#ff4d85"));

const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async getGenerationJob(jobId) {
    apiTrace.push({ apiId: "API-002", method: "getGenerationJob", jobId });
    if (jobId === "job-pending-001") {
      return { jobId, status: "pending", cardId: null, errorCode: null };
    }
    return baseApiClient.getGenerationJob(jobId);
  },
  async createGenerationJob(request) {
    apiTrace.push({ apiId: "API-001", method: "createGenerationJob", request });
    return baseApiClient.createGenerationJob(request);
  }
};

const store = createShellStore({ scene: "date", energy: "confidence" });
const analytics = createLocalAnalyticsClient({ apiClient, store });

const loadingPageView = await trackLoadingPageView({ analytics, jobId: "job-pending-001" });
assert.equal(loadingPageView.accepted, true);

const pendingNavigator = createShellNavigator();
pendingNavigator.navigate("/create/loading", { jobId: "job-pending-001" });
const pendingPoll = await pollGenerationJob({
  jobId: "job-pending-001",
  store,
  navigator: pendingNavigator,
  apiClient,
  analytics
});
assert.equal(pendingPoll.job.status, "pending");
assert.equal(pendingPoll.route.path, "/create/loading");

const successNavigator = createShellNavigator();
successNavigator.navigate("/create/loading", { jobId: shellFixtureIds.jobId });
const successPoll = await pollGenerationJob({
  jobId: shellFixtureIds.jobId,
  store,
  navigator: successNavigator,
  apiClient,
  analytics
});
assert.equal(successPoll.job.status, "success");
assert.equal(successPoll.route.path, `/result/${shellFixtureIds.cardId}`);
assert.equal(successPoll.route.uiId, "UI-06");

const failureNavigator = createShellNavigator();
failureNavigator.navigate("/create/loading", { jobId: shellFixtureIds.failedJobId });
const failurePoll = await pollGenerationJob({
  jobId: shellFixtureIds.failedJobId,
  store,
  navigator: failureNavigator,
  apiClient,
  analytics
});
assert.equal(failurePoll.job.status, "failed");
assert.equal(failurePoll.route.path, "/error/network");
assert.equal(failurePoll.route.uiId, "UI-18");
assert.equal(store.getState().error.code, "LOCAL_GENERATION_FAILURE");

const errorPageView = await trackNetworkErrorPageView({ analytics, jobId: shellFixtureIds.failedJobId });
assert.equal(errorPageView.accepted, true);

const retryNavigator = createShellNavigator();
retryNavigator.navigate("/error/network");
const retryClick = await clickTryAgain({
  store,
  navigator: retryNavigator,
  apiClient,
  analytics,
  scene: "date",
  energy: "confidence"
});
assert.equal(retryClick.controlId, "try-again");
assert.equal(retryClick.apiCalled, true);
assert.equal(retryClick.retryJob.status, "success");
assert.equal(retryClick.route.path, "/create/loading");
assert.equal(retryClick.route.uiId, "UI-05");

store.setError({ code: "LOCAL_GENERATION_FAILURE", jobId: shellFixtureIds.failedJobId });
const changeSceneNavigator = createShellNavigator();
changeSceneNavigator.navigate("/error/network");
const changeSceneClick = await clickChangeScene({
  store,
  navigator: changeSceneNavigator,
  analytics
});
assert.equal(changeSceneClick.controlId, "change-scene");
assert.equal(changeSceneClick.route.path, "/create/scene");
assert.equal(changeSceneClick.route.uiId, "UI-02");
assert.equal(store.getState().error, null);

const finalState = store.getState();
const analyticsEventNames = finalState.analyticsEvents.map((event) => event.eventName);
assert(analyticsEventNames.includes("generation_started"));
assert(analyticsEventNames.includes("generation_success"));
assert(analyticsEventNames.includes("generation_failed"));
assert(analyticsEventNames.includes("page_view_generation_error"));
assert(analyticsEventNames.includes("click_generation_retry"));
assert(analyticsEventNames.includes("click_generation_change_scene"));

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T11",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-013", "REQ-017"],
  uiIds: ["UI-05", "UI-18"],
  routes: ["/create/loading", "/error/network", `/result/${shellFixtureIds.cardId}`, "/create/scene"],
  sourceReferences: {
    "UI-05": loadingView.sourceReference,
    "UI-18": errorView.sourceReference
  },
  stitchReferences: {
    "UI-05": loadingView.stitchReference,
    "UI-18": errorView.stitchReference
  },
  renderAssertions: {
    loading: {
      jobId: loadingView.jobId,
      title: loadingView.hero.titleLines,
      apiId: loadingView.apiId,
      nativePageFiles: [
        "apps/wechat-mini/src/pages/create/loading.wxml",
        "apps/wechat-mini/src/pages/create/loading.wxss",
        "apps/wechat-mini/src/pages/create/loading.js"
      ]
    },
    networkError: {
      jobId: errorView.jobId,
      title: errorView.error.titleLines,
      safeCopy: errorView.error.safeCopy,
      nativePageFiles: [
        "apps/wechat-mini/src/pages/error/network.wxml",
        "apps/wechat-mini/src/pages/error/network.wxss",
        "apps/wechat-mini/src/pages/error/network.js"
      ]
    }
  },
  clicks: {
    pendingPoll: {
      apiId: "API-002",
      job: pendingPoll.job,
      expectedRoute: "/create/loading",
      actualRoute: pendingPoll.route.path,
      analyticsAccepted: pendingPoll.analyticsResponse.accepted
    },
    successPoll: {
      apiId: "API-002",
      job: successPoll.job,
      expectedRoute: `/result/${shellFixtureIds.cardId}`,
      actualRoute: successPoll.route.path,
      analyticsAccepted: successPoll.analyticsResponse.accepted
    },
    failurePoll: {
      apiId: "API-002",
      job: failurePoll.job,
      expectedRoute: "/error/network",
      actualRoute: failurePoll.route.path,
      analyticsAccepted: failurePoll.analyticsResponse.accepted
    },
    retry: {
      controlId: retryClick.controlId,
      apiId: "API-001",
      expectedRoute: "/create/loading",
      actualRoute: retryClick.route.path,
      retryJob: retryClick.retryJob,
      analyticsAccepted: retryClick.analyticsResponse.accepted
    },
    changeScene: {
      controlId: changeSceneClick.controlId,
      expectedRoute: "/create/scene",
      actualRoute: changeSceneClick.route.path,
      analyticsAccepted: changeSceneClick.analyticsResponse.accepted
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
    reason: "T11 generated deterministic HTML structural captures for UI-05 and UI-18; automated raster screenshot and pixel-diff evidence were not available in this task boundary.",
    captures: [
      "docs/auto-execute/screenshots/T11/UI-05-loading.html",
      "docs/auto-execute/screenshots/T11/UI-18-network-error.html"
    ]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(dirname(logPath), { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(screenshotDir, "UI-05-loading.html"), renderLoadingPageHtml(loadingView));
await writeFile(resolve(screenshotDir, "UI-18-network-error.html"), renderNetworkErrorPageHtml(errorView));
await writeFile(resolve(screenshotDir, "UI-05-loading-render-summary.json"), JSON.stringify(loadingView, null, 2));
await writeFile(resolve(screenshotDir, "UI-18-network-error-render-summary.json"), JSON.stringify(errorView, null, 2));
await writeFile(logPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T11/generation-error.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T11/generation-error.json", "docs/auto-execute/screenshots/T11/"] }, null, 2));
