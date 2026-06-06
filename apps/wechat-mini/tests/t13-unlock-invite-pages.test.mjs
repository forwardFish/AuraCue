import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAnalyticsClient } from "../src/api/analytics-client.mjs";
import { createFixtureApiClient } from "../src/api/api-client.mjs";
import { shellFixtureIds } from "../src/fixtures/shell-fixtures.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import {
  clickCopyInviteLink,
  clickFriendGenerate,
  clickHowItWorks,
  clickInviteAgain,
  clickInviteFriends,
  clickInviteInstead,
  clickInvitePaidUnlock,
  clickPaidUnlock,
  openFriendLanding,
  renderFriendLandingPage,
  renderInviteProgressPage,
  renderInviteStartPage,
  renderUnlockChoicePage,
  renderUnlockInvitePageHtml,
  trackInviteStartPageView,
  trackUnlockPageView
} from "../src/pages/unlock/unlock-invite-page.mjs";
import { createShellStore } from "../src/state/shell-store.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const tracePath = resolve(projectRoot, "docs/auto-execute/traces/T13/unlock-invite.json");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T13");
const logPath = resolve(projectRoot, "docs/auto-execute/logs/T13/unlock-invite-pages-test.log");

const files = {
  unlockMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/index.wxml"), "utf8"),
  unlockLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/unlock/index.js"), "utf8"),
  inviteStartMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/start.wxml"), "utf8"),
  inviteStartLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/start.js"), "utf8"),
  inviteProgressMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/progress.wxml"), "utf8"),
  inviteProgressLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/progress.js"), "utf8"),
  landingMarkup: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/landing.wxml"), "utf8"),
  landingLogic: await readFile(resolve(projectRoot, "apps/wechat-mini/src/pages/invite/landing.js"), "utf8")
};

assert(files.unlockMarkup.includes("Invite 3 friends instead"));
assert(files.unlockMarkup.includes("Unlock This Card"));
assert(files.unlockLogic.includes("/pages/unlock/pay?id="));
assert(files.unlockLogic.includes("/pages/invite/start?id="));
assert(files.inviteStartMarkup.includes("Invite Friends"));
assert(files.inviteStartMarkup.includes("Unlock for"));
assert(files.inviteStartLogic.includes("API-006"));
assert(files.inviteStartLogic.includes("API-008"));
assert(files.inviteProgressMarkup.includes("Copy"));
assert(files.inviteProgressMarkup.includes("Invite Again"));
assert(files.inviteProgressMarkup.includes("How it works?"));
assert(files.inviteProgressLogic.includes("modalVisible"));
assert(files.landingMarkup.includes("Generate My Lucky Aura Card"));
assert(files.landingLogic.includes("friend_accept"));
assert(files.landingLogic.includes("noLoginRequired"));

const unlockView = renderUnlockChoicePage();
const inviteStartView = renderInviteStartPage();
const inviteProgressView = renderInviteProgressPage();
const landingView = renderFriendLandingPage();

assert.equal(unlockView.uiId, "UI-07");
assert.equal(inviteStartView.uiId, "UI-08");
assert.equal(inviteProgressView.uiId, "UI-09");
assert.equal(landingView.uiId, "UI-10");
assert.equal(unlockView.actions.paidUnlock.route, "/unlock/:id/pay");
assert.equal(unlockView.actions.inviteAlternative.route, "/invite/:id");
assert.equal(inviteStartView.actions.inviteFriends.route, "/invite/:id/progress");
assert.equal(landingView.actions.generate.route, "/create/scene");

const store = createShellStore();
const baseApiClient = createFixtureApiClient();
const apiTrace = [];
const apiClient = {
  ...baseApiClient,
  async recordInviteEvent(cardId, request) {
    apiTrace.push({ apiId: "API-006", method: "recordInviteEvent", cardId, request });
    return baseApiClient.recordInviteEvent(cardId, request);
  },
  async recordShareEvent(request) {
    apiTrace.push({ apiId: "API-008", method: "recordShareEvent", request });
    return baseApiClient.recordShareEvent(request);
  }
};
const analytics = createLocalAnalyticsClient({ apiClient, store });
const navigator = createShellNavigator();

navigator.navigate("/unlock/:id", { id: shellFixtureIds.cardId });
const unlockPageView = await trackUnlockPageView({ cardId: shellFixtureIds.cardId, analytics });
assert.equal(unlockPageView.accepted, true);

const paidClick = await clickPaidUnlock({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(paidClick.controlId, "paid-unlock");
assert.equal(paidClick.route.uiId, "UI-11");
assert.equal(paidClick.route.path, `/unlock/${shellFixtureIds.cardId}/pay`);

navigator.navigate("/unlock/:id", { id: shellFixtureIds.cardId });
const inviteInsteadClick = await clickInviteInstead({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(inviteInsteadClick.controlId, "invite-three-friends-instead");
assert.equal(inviteInsteadClick.route.uiId, "UI-08");
assert.equal(inviteInsteadClick.route.path, `/invite/${shellFixtureIds.cardId}`);

const inviteStart = await trackInviteStartPageView({ cardId: shellFixtureIds.cardId, store, apiClient, analytics });
assert.equal(inviteStart.apiId, "API-006");
assert.equal(inviteStart.inviteResponse.required, 3);

const inviteFriendsClick = await clickInviteFriends({ cardId: shellFixtureIds.cardId, navigator, apiClient, analytics });
assert.equal(inviteFriendsClick.controlId, "invite-friends");
assert.equal(inviteFriendsClick.route.uiId, "UI-09");
assert.equal(inviteFriendsClick.shareResponse.channel, "wechat");

navigator.navigate("/invite/:id", { id: shellFixtureIds.cardId });
const invitePaidClick = await clickInvitePaidUnlock({ cardId: shellFixtureIds.cardId, navigator, analytics });
assert.equal(invitePaidClick.controlId, "unlock-for-199");
assert.equal(invitePaidClick.route.uiId, "UI-11");

const copyClick = await clickCopyInviteLink({ cardId: shellFixtureIds.cardId, apiClient, analytics });
assert.equal(copyClick.controlId, "copy-invite-link");
assert.equal(copyClick.shareResponse.channel, "copy_link");
assert(copyClick.copiedLink.includes(shellFixtureIds.inviteCode));

const inviteAgainClick = await clickInviteAgain({ cardId: shellFixtureIds.cardId, apiClient, analytics });
assert.equal(inviteAgainClick.controlId, "invite-again");
assert.equal(inviteAgainClick.shareResponse.channel, "wechat");

const howItWorksClick = await clickHowItWorks({ cardId: shellFixtureIds.cardId, analytics });
assert.equal(howItWorksClick.controlId, "how-it-works");
assert.equal(howItWorksClick.modalShown, true);

navigator.navigate("/invite/landing/:code", { code: shellFixtureIds.inviteCode });
const friendLanding = await openFriendLanding({ inviteCode: shellFixtureIds.inviteCode, apiClient, analytics });
assert.equal(friendLanding.apiId, "API-006");
assert.equal(friendLanding.inviteResponse.progress, 1);

const friendGenerateClick = await clickFriendGenerate({ inviteCode: shellFixtureIds.inviteCode, navigator, analytics });
assert.equal(friendGenerateClick.controlId, "generate-my-lucky-aura-card");
assert.equal(friendGenerateClick.route.uiId, "UI-02");
assert.equal(friendGenerateClick.route.path, "/create/scene");

const analyticsEvents = store.getState().analyticsEvents;
const analyticsEventNames = analyticsEvents.map((event) => event.eventName);
for (const requiredEvent of [
  "page_view_unlock_choice",
  "click_paid_unlock_entry",
  "click_invite_instead",
  "invite_started",
  "click_invite_friends",
  "click_invite_paid_unlock",
  "copy_share_link",
  "click_invite_again",
  "click_invite_how_it_works",
  "page_view_invite_landing",
  "click_friend_generate_card"
]) {
  assert(analyticsEventNames.includes(requiredEvent), `Missing analytics event ${requiredEvent}`);
}

assert.equal(apiTrace.filter((entry) => entry.apiId === "API-006").length, 4);
assert.equal(apiTrace.filter((entry) => entry.apiId === "API-008").length, 3);
assert.equal(apiTrace.some((entry) => entry.request?.action === "friend_accept"), true);

const trace = {
  status: "PASS_NEEDS_MANUAL_UI_REVIEW",
  taskId: "T13",
  requirementIds: ["REQ-002", "REQ-003", "REQ-004", "REQ-010", "REQ-012", "REQ-017"],
  uiIds: ["UI-07", "UI-08", "UI-09", "UI-10"],
  routes: [
    "/unlock/:id",
    "/invite/:id",
    "/invite/:id/progress",
    "/invite/landing/:code",
    `/unlock/${shellFixtureIds.cardId}`,
    `/invite/${shellFixtureIds.cardId}`,
    `/invite/${shellFixtureIds.cardId}/progress`,
    `/invite/landing/${shellFixtureIds.inviteCode}`
  ],
  sourceReferences: {
    "UI-07": unlockView.sourceReference,
    "UI-08": inviteStartView.sourceReference,
    "UI-09": inviteProgressView.sourceReference,
    "UI-10": landingView.sourceReference
  },
  stitchReferences: {
    "UI-07": unlockView.stitchReference,
    "UI-08": inviteStartView.stitchReference,
    "UI-09": inviteProgressView.stitchReference,
    "UI-10": landingView.stitchReference
  },
  renderAssertions: {
    nativePageFiles: [
      "apps/wechat-mini/src/pages/unlock/index.wxml",
      "apps/wechat-mini/src/pages/unlock/index.wxss",
      "apps/wechat-mini/src/pages/unlock/index.js",
      "apps/wechat-mini/src/pages/invite/start.wxml",
      "apps/wechat-mini/src/pages/invite/start.wxss",
      "apps/wechat-mini/src/pages/invite/start.js",
      "apps/wechat-mini/src/pages/invite/progress.wxml",
      "apps/wechat-mini/src/pages/invite/progress.wxss",
      "apps/wechat-mini/src/pages/invite/progress.js",
      "apps/wechat-mini/src/pages/invite/landing.wxml",
      "apps/wechat-mini/src/pages/invite/landing.wxss",
      "apps/wechat-mini/src/pages/invite/landing.js"
    ],
    unlockFeatures: unlockView.features.map((feature) => feature.id),
    inviteRewards: inviteStartView.rewardRows,
    inviteProgressFixture: { progress: inviteProgressView.progress, required: inviteProgressView.required, friends: inviteProgressView.friends.map((friend) => friend.status) },
    friendLandingNoLoginRequired: true
  },
  clicks: {
    paidUnlock: { controlId: paidClick.controlId, expectedRoute: paidClick.expectedRoute, actualRoute: paidClick.route.path, analyticsAccepted: paidClick.analyticsResponse.accepted },
    inviteInstead: { controlId: inviteInsteadClick.controlId, expectedRoute: inviteInsteadClick.expectedRoute, actualRoute: inviteInsteadClick.route.path, analyticsAccepted: inviteInsteadClick.analyticsResponse.accepted },
    inviteFriends: { controlId: inviteFriendsClick.controlId, expectedRoute: inviteFriendsClick.expectedRoute, actualRoute: inviteFriendsClick.route.path, inviteApiProgress: inviteFriendsClick.inviteResponse.progress, shareEventId: inviteFriendsClick.shareResponse.shareEventId },
    invitePaidUnlock: { controlId: invitePaidClick.controlId, expectedRoute: invitePaidClick.expectedRoute, actualRoute: invitePaidClick.route.path },
    copy: { controlId: copyClick.controlId, copiedLink: copyClick.copiedLink, shareEventId: copyClick.shareResponse.shareEventId },
    inviteAgain: { controlId: inviteAgainClick.controlId, shareEventId: inviteAgainClick.shareResponse.shareEventId },
    howItWorks: { controlId: howItWorksClick.controlId, modalShown: howItWorksClick.modalShown },
    friendGenerate: { controlId: friendGenerateClick.controlId, expectedRoute: friendGenerateClick.expectedRoute, actualRoute: friendGenerateClick.route.path, noLoginRequired: true }
  },
  apiMockTrace: apiTrace,
  analyticsReadback: analyticsEvents,
  localOnly: unlockView.localOnly,
  visualEvidence: {
    status: "PASS_NEEDS_MANUAL_UI_REVIEW",
    reason: "T13 generated deterministic HTML structural captures and render summaries for UI-07..UI-10; automated raster screenshot and pixel-diff evidence are deferred to T22/T23.",
    captures: [
      "docs/auto-execute/screenshots/T13/UI-07-unlock-choice.html",
      "docs/auto-execute/screenshots/T13/UI-08-invite-start.html",
      "docs/auto-execute/screenshots/T13/UI-09-invite-progress.html",
      "docs/auto-execute/screenshots/T13/UI-10-friend-landing.html"
    ],
    missingRasterScreenshots: [
      "docs/auto-execute/screenshots/T13/UI-07-unlock-choice.png",
      "docs/auto-execute/screenshots/T13/UI-08-invite-start.png",
      "docs/auto-execute/screenshots/T13/UI-09-invite-progress.png",
      "docs/auto-execute/screenshots/T13/UI-10-friend-landing.png"
    ]
  }
};

await mkdir(dirname(tracePath), { recursive: true });
await mkdir(screenshotDir, { recursive: true });
await mkdir(dirname(logPath), { recursive: true });
await writeFile(tracePath, JSON.stringify(trace, null, 2));
await writeFile(resolve(screenshotDir, "UI-07-unlock-choice.html"), renderUnlockInvitePageHtml(unlockView));
await writeFile(resolve(screenshotDir, "UI-08-invite-start.html"), renderUnlockInvitePageHtml(inviteStartView));
await writeFile(resolve(screenshotDir, "UI-09-invite-progress.html"), renderUnlockInvitePageHtml(inviteProgressView));
await writeFile(resolve(screenshotDir, "UI-10-friend-landing.html"), renderUnlockInvitePageHtml(landingView));
await writeFile(resolve(screenshotDir, "UI-07-unlock-choice-render-summary.json"), JSON.stringify(unlockView, null, 2));
await writeFile(resolve(screenshotDir, "UI-08-invite-start-render-summary.json"), JSON.stringify(inviteStartView, null, 2));
await writeFile(resolve(screenshotDir, "UI-09-invite-progress-render-summary.json"), JSON.stringify(inviteProgressView, null, 2));
await writeFile(resolve(screenshotDir, "UI-10-friend-landing-render-summary.json"), JSON.stringify(landingView, null, 2));
await writeFile(logPath, JSON.stringify({ status: trace.status, trace: "docs/auto-execute/traces/T13/unlock-invite.json" }, null, 2));

console.log(JSON.stringify({ status: trace.status, evidence: ["docs/auto-execute/traces/T13/unlock-invite.json", "docs/auto-execute/screenshots/T13/"] }, null, 2));
