import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickHomePrimaryCta,
  clickHomeSceneShortcut,
  homeSceneShortcuts,
  renderHomePage,
  renderHomePageHtml,
  trackHomePageView
} from "../src/pages/home/home-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T09/home-clicks.json");
const renderPath = resolve(projectRoot, "docs/auto-execute/screenshots/T09/UI-01-home.html");
const logPath = resolve(projectRoot, "docs/auto-execute/logs/T09/home-page-test.log");

const view = renderHomePage();
const pageMarkup = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/home/index.wxml"), "utf8");
const pageLogic = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/home/index.js"), "utf8");
const pageStyles = await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/home/index.wxss"), "utf8");

assert.equal(view.uiId, "UI-01");
assert.equal(view.route, "/");
assert.equal(view.header.brand, "AuraCue");
assert.equal(view.hero.titleLines[0], "Before you step out,");
assert.equal(view.auraCard.title, "Golden Bloom");
assert.equal(view.auraCard.luckyColor.value, "Blush Pink");
assert.equal(view.auraCard.outfitEnergy.value, "Soft Power");
assert.equal(view.auraCard.socialMove.value, "Listen first, connect deeper.");
assert.deepEqual(view.shortcuts.map((shortcut) => shortcut.label), ["Date", "Work", "Party", "Just need luck"]);
assert.equal(view.primaryCta.label, "Start My 30-Second Card");
assert.equal(view.bottomNav.active, "Home");
assert.equal(view.bottomNav.disabled, "Profile");
assert(pageMarkup.includes("Start My 30-Second Card"));
assert(pageMarkup.includes("bindtap=\"onShortcutTap\""));
assert(pageMarkup.includes("bindtap=\"onStartTap\""));
assert(pageLogic.includes("page_view_home"));
assert(pageLogic.includes("click_generate_start"));
assert(pageLogic.includes("wx.navigateTo"));
assert(pageStyles.includes("#fcf9f6"));
assert(pageStyles.includes("#db8a86"));

const store = createShellStore();
const apiClient = createFixtureApiClient();
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();

const pageView = await trackHomePageView({ analytics });
assert.equal(pageView.accepted, true);

const shortcutClicks = [];
for (const shortcut of homeSceneShortcuts) {
  const click = await clickHomeSceneShortcut({ sceneId: shortcut.id, store, navigator, analytics });
  assert.equal(click.selectedScene, shortcut.id);
  assert.equal(click.route.path, "/create/scene");
  assert.equal(click.route.uiId, "UI-02");
  assert.equal(click.analyticsResponse.accepted, true);
  shortcutClicks.push(click);
}

const ctaClick = await clickHomePrimaryCta({ navigator, analytics });
assert.equal(ctaClick.route.path, "/create/scene");
assert.equal(ctaClick.route.uiId, "UI-02");
assert.equal(ctaClick.analyticsResponse.accepted, true);

const finalState = store.getState();
const analyticsEventNames = finalState.analyticsEvents.map((event) => event.eventName);
assert(analyticsEventNames.includes("page_view_home"));
assert.equal(analyticsEventNames.filter((name) => name === "click_generate_start").length, 5);
assert.equal(finalState.scene, "luck");

const trace = {
  status: "PASS",
  taskId: "T09",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-017"],
  uiId: "UI-01",
  route: "/",
  sourceReference: view.sourceReference,
  stitchReference: view.stitchReference,
  renderAssertions: {
    brand: view.header.brand,
    hero: view.hero.titleLines,
    cardTitle: view.auraCard.title,
    shortcuts: view.shortcuts.map((shortcut) => shortcut.label),
    primaryCta: view.primaryCta.label,
    trustCopy: view.trustCopy,
    nativePageFiles: [
      "apps/wechat-mini/src/pages/home/index.wxml",
      "apps/wechat-mini/src/pages/home/index.wxss",
      "apps/wechat-mini/src/pages/home/index.js",
      "apps/wechat-mini/src/pages/home/index.json"
    ]
  },
  clicks: [
    ...shortcutClicks.map((click) => ({
      controlId: click.controlId,
      label: click.label,
      selectedScene: click.selectedScene,
      expectedRoute: "/create/scene",
      actualRoute: click.route.path,
      analyticsAccepted: click.analyticsResponse.accepted
    })),
    {
      controlId: ctaClick.controlId,
      label: ctaClick.label,
      selectedScene: null,
      expectedRoute: "/create/scene",
      actualRoute: ctaClick.route.path,
      analyticsAccepted: ctaClick.analyticsResponse.accepted
    }
  ],
  analyticsReadback: finalState.analyticsEvents,
  localOnly: {
    payment: "not-used",
    ai: "not-used",
    analytics: "fixture-api-client",
    storage: "local-evidence-files-only",
    db: "no-production-write"
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(dirname(renderPath), { recursive: true });
await mkdir(dirname(logPath), { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(renderPath, renderHomePageHtml(view));
await writeFile(logPath, JSON.stringify({ status: "PASS", trace: "docs/auto-execute/traces/T09/home-clicks.json", render: "docs/auto-execute/screenshots/T09/UI-01-home.html" }, null, 2));

console.log(JSON.stringify({ status: "PASS", evidence: ["docs/auto-execute/traces/T09/home-clicks.json", "docs/auto-execute/screenshots/T09/UI-01-home.html"] }, null, 2));
