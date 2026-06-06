import { shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export const paymentValueRows = [
  "Full reading & insights",
  "Outfit energy details",
  "Social action plan",
  "Lucky ritual",
  "Save & share high-quality card"
];

export function renderPaymentConfirmPage({ cardId = shellFixtureIds.cardId } = {}) {
  return {
    uiId: "UI-11",
    route: "/unlock/:id/pay",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/08A-\u652f\u4ed8\u89e3\u9501_\u786e\u8ba4\u652f\u4ed8.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/08a/code.html",
    requirementIds: ["REQ-010", "REQ-012", "REQ-017"],
    apiIds: ["API-005", "API-010"],
    cardId,
    title: "Unlock your full Aura Card",
    price: "$1.99",
    priceNote: "One-time unlock",
    valueRows: paymentValueRows,
    actions: {
      confirmUnlock: { controlId: "confirm-unlock-199", label: "Confirm Unlock $1.99", route: "/unlock/:id/success" },
      inviteInstead: { controlId: "invite-3-friends-instead", label: "Invite 3 Friends Instead", route: "/invite/:id" },
      close: { controlId: "close-payment", label: "Close", route: "/unlock/:id" }
    },
    localOnly: localOnlyPaymentSummary()
  };
}

export function renderPaymentFailedPage({ cardId = shellFixtureIds.cardId, orderId = "order-failed-001" } = {}) {
  return {
    uiId: "UI-12",
    route: "/unlock/:id/pay-failed",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/08B-\u652f\u4ed8\u89e3\u9501_\u5931\u8d25\u4e0e\u6062\u590d\u8d2d\u4e70.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/08b/code.html",
    requirementIds: ["REQ-010", "REQ-012", "REQ-017"],
    apiIds: ["API-005", "API-004", "API-010"],
    cardId,
    orderId,
    title: "Payment didn't go through",
    message: "No worries, it happens. Please try again.",
    actions: {
      tryAgain: { controlId: "try-again", label: "Try Again", route: "/unlock/:id/success" },
      restorePurchase: { controlId: "restore-purchase", label: "Restore Purchase", route: "/unlock/:id/success" },
      inviteInstead: { controlId: "invite-3-friends-instead", label: "Invite 3 Friends Instead", route: "/invite/:id" },
      contactSupport: { controlId: "contact-support", label: "Contact Support" },
      back: { controlId: "back-from-payment-failed", route: "/unlock/:id/pay" }
    },
    localOnly: localOnlyPaymentSummary()
  };
}

export function renderPaymentSuccessPage({ cardId = shellFixtureIds.cardId, orderId = shellFixtureIds.paymentOrderId } = {}) {
  return {
    uiId: "UI-13",
    route: "/unlock/:id/success",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/08C-\u652f\u4ed8\u89e3\u9501_\u6210\u529f\u72b6\u6001.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/08c/code.html",
    requirementIds: ["REQ-010", "REQ-012", "REQ-017"],
    apiIds: ["API-004", "API-010"],
    cardId,
    orderId,
    title: "Your full aura is unlocked!",
    cardPreview: {
      title: "Today's Lucky Aura",
      auraName: "Soft Confidence",
      theme: "Romantic Clarity",
      luckyColor: "Champagne Gold"
    },
    actions: {
      viewFullCard: { controlId: "view-full-card", label: "View Full Card", route: "/result/:id/full" },
      shareStory: { controlId: "share-story", label: "Share Story", route: "/share/:id" }
    },
    localOnly: localOnlyPaymentSummary()
  };
}

export async function trackPaymentConfirmPageView({ cardId = shellFixtureIds.cardId, analytics }) {
  return analytics.track("page_view_mock_payment_confirm", "/unlock/:id/pay", { uiId: "UI-11", cardId, requirementId: "REQ-012" });
}

export async function clickConfirmUnlock({ cardId = shellFixtureIds.cardId, navigator, store, apiClient, analytics, result = "success" }) {
  const order = await apiClient.createMockPaymentOrder({ cardId, amount: 1.99, currency: "USD" });
  store.setPayment(order);
  const started = await analytics.track("checkout_started", "/unlock/:id/pay", { uiId: "UI-11", cardId, orderId: order.orderId, localMock: true });
  const completed = await apiClient.completeMockPaymentOrder(order.orderId, { result });
  store.setPayment(completed);
  const completionAnalytics = await analytics.track(result === "success" ? "checkout_success" : "mock_payment_completed", "/unlock/:id/pay", { uiId: result === "success" ? "UI-13" : "UI-12", cardId, orderId: order.orderId, result });
  if (result === "success") {
    const entitlement = await apiClient.unlockCard(cardId, { method: "payment", orderId: order.orderId });
    store.setEntitlement(entitlement);
    const route = navigator.navigate("/unlock/:id/success", { id: cardId });
    return { controlId: "confirm-unlock-199", order, completed, entitlement, route, analytics: [started, completionAnalytics] };
  }
  const route = navigator.navigate("/unlock/:id/pay-failed", { id: cardId });
  return { controlId: "confirm-unlock-199", order, completed, entitlement: null, route, analytics: [started, completionAnalytics] };
}

export async function clickTryAgain({ cardId = shellFixtureIds.cardId, navigator, store, apiClient, analytics }) {
  const retry = await clickConfirmUnlock({ cardId, navigator, store, apiClient, analytics, result: "success" });
  return { ...retry, controlId: "try-again", expectedRoute: "/unlock/:id/success" };
}

export async function clickRestorePurchase({ cardId = shellFixtureIds.cardId, navigator, store, apiClient, analytics }) {
  const entitlement = await apiClient.unlockCard(cardId, { method: "restore", orderId: null });
  store.setEntitlement(entitlement);
  const analyticsResponse = await analytics.track("click_restore_purchase", "/unlock/:id/pay-failed", { uiId: "UI-12", cardId, method: "restore" });
  const route = navigator.navigate("/unlock/:id/success", { id: cardId });
  return { controlId: "restore-purchase", expectedRoute: "/unlock/:id/success", entitlement, analyticsResponse, route };
}

export async function clickPaymentInviteInstead({ cardId = shellFixtureIds.cardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_payment_invite_instead", "/unlock/:id/pay-failed", { uiId: "UI-12", cardId });
  const route = navigator.navigate("/invite/:id", { id: cardId });
  return { controlId: "invite-3-friends-instead", expectedRoute: "/invite/:id", route, analyticsResponse };
}

export async function clickContactSupport({ cardId = shellFixtureIds.cardId, analytics }) {
  const analyticsResponse = await analytics.track("click_payment_contact_support", "/unlock/:id/pay-failed", { uiId: "UI-12", cardId, localOnly: true });
  return { controlId: "contact-support", toast: "Local support placeholder", analyticsResponse };
}

export async function clickViewFullCard({ cardId = shellFixtureIds.cardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_view_full_card_after_payment", "/unlock/:id/success", { uiId: "UI-13", cardId });
  const route = navigator.navigate("/result/:id/full", { id: cardId });
  return { controlId: "view-full-card", expectedRoute: "/result/:id/full", route, analyticsResponse };
}

export async function clickShareStoryAfterPayment({ cardId = shellFixtureIds.cardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_share_story_after_payment", "/unlock/:id/success", { uiId: "UI-13", cardId });
  const route = navigator.navigate("/share/:id", { id: cardId });
  return { controlId: "share-story", expectedRoute: "/share/:id", route, analyticsResponse };
}

export function renderPaymentStatePageHtml(viewModel) {
  if (viewModel.uiId === "UI-11") return renderPaymentConfirmHtml(viewModel);
  if (viewModel.uiId === "UI-12") return renderPaymentFailedHtml(viewModel);
  if (viewModel.uiId === "UI-13") return renderPaymentSuccessHtml(viewModel);

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AuraCue ${escapeHtml(viewModel.uiId)}</title>
<style>
body { margin: 0; background: #fff0f5; color: #1c274c; font-family: Inter, system-ui, sans-serif; }
.phone { width: 390px; min-height: 844px; margin: 0 auto; box-sizing: border-box; padding: 48px 24px 32px; background: radial-gradient(circle at 50% 18%, #ffe5e5 0%, #fff0f5 48%, #f5e6ff 100%); }
h1 { margin: 0 0 22px; font: 700 32px/38px Georgia, serif; text-align: center; }
.price { text-align: center; font-size: 48px; font-weight: 800; margin: 18px 0 4px; }
.card { border-radius: 28px; padding: 20px; background: rgba(255,255,255,.72); box-shadow: 0 12px 30px rgba(255,105,180,.16); }
ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 12px; }
li { border-bottom: 1px solid rgba(28,39,76,.08); padding: 10px 0; font-weight: 700; }
.actions { display: grid; gap: 12px; margin-top: 24px; }
button { min-height: 56px; border: 0; border-radius: 999px; color: white; background: linear-gradient(90deg, #ff6b95, #ff85a1); font-weight: 800; font-size: 16px; }
.meta { margin-top: 16px; color: #64748b; font-size: 12px; text-align: center; }
</style></head>
<body><main class="phone"><h1>${escapeHtml(viewModel.title)}</h1></main></body></html>`;
}

function renderPaymentConfirmHtmlLegacy(viewModel) {
  const rows = viewModel.valueRows
    .map((row, index) => `<div class="benefit-row"><span class="check">✓</span><span>${escapeHtml(row)}</span><span class="benefit-icon">${["□", "♙", "◌", "☘", "⇧"][index]}</span></div>`)
    .join("");
  return paymentHtmlShell({
    title: "AuraCue UI-11 Payment Confirm",
    bodyClass: "confirm-bg",
    body: `<main class="phone confirm">
      <span class="visual-contract">Unlock your full Aura Card</span>
      <div class="device-top"><span>9:41</span><span class="island"></span><span>▮▮▮ ⌁ ▱</span></div>
      <header class="pay-header"><button data-control-id="close-payment">×</button><h2>AuraCue<span>✦</span></h2><i></i></header>
      <section class="confirm-title"><h1>Unlock your<br>full Aura Card <span>✦</span></h1></section>
      <section class="card-fan" aria-label="tarot cards">
        <div class="fan-card left">☾</div><div class="fan-card center">✦</div><div class="fan-card right">☾</div>
        <div class="clouds"></div>
      </section>
      <section class="benefits">${rows}</section>
      <section class="price"><i>✦</i><h3>${escapeHtml(viewModel.price)}</h3><i>✦</i><p>${escapeHtml(viewModel.priceNote)}</p></section>
      <button class="primary pill" data-control-id="${escapeHtml(viewModel.actions.confirmUnlock.controlId)}">Confirm Unlock $1.99 <span>▣</span></button>
      <div class="secure"><b></b><span>◇ Secure &amp; private payment</span><b></b></div>
      <button class="secondary pill" data-control-id="${escapeHtml(viewModel.actions.inviteInstead.controlId)}">●● Invite 3 Friends Instead</button>
      <p class="fineprint">▣ Cancel anytime. Your data is safe with us.</p>
    </main>`
  });
}

function renderPaymentFailedHtmlLegacy(viewModel) {
  return paymentHtmlShell({
    title: "AuraCue UI-12 Payment Failed",
    bodyClass: "failed-bg",
    body: `<main class="phone failed">
      <span class="visual-contract">Payment didn't go through</span>
      <div class="device-top"><span>9:41</span><span>▮▮ ⌁ ▱</span></div>
      <header class="fail-header"><button data-control-id="${escapeHtml(viewModel.actions.back.controlId)}">‹</button><h1>✦ AuraCue ✦</h1><i></i></header>
      <section class="fail-art"><span class="spark a">✦</span><span class="spark b">✦</span><div class="cloud"><b>!</b></div></section>
      <section class="fail-copy"><h2>Payment didn't<br>go through</h2><p>${escapeHtml(viewModel.message).replace("No worries, it happens. Please try again.", "No worries, it happens.<br>Please try again.")}</p></section>
      <section class="fail-actions">
        <button class="primary block" data-control-id="${escapeHtml(viewModel.actions.tryAgain.controlId)}">↻ Try Again</button>
        <button class="surface block" data-control-id="${escapeHtml(viewModel.actions.restorePurchase.controlId)}">↻ Restore Purchase</button>
        <button class="surface block" data-control-id="${escapeHtml(viewModel.actions.inviteInstead.controlId)}">●● Invite 3 Friends Instead</button>
      </section>
      <button class="support" data-control-id="${escapeHtml(viewModel.actions.contactSupport.controlId)}">◎ Contact Support</button>
    </main>`
  });
}

function renderPaymentSuccessHtmlLegacy(viewModel) {
  return paymentHtmlShell({
    title: "AuraCue UI-13 Payment Success",
    bodyClass: "success-bg",
    body: `<main class="phone success">
      <span class="visual-contract">Your full aura is unlocked</span>
      <div class="success-sparkles"><span>✦</span><span>✦</span><span>✦</span></div>
      <section class="success-title"><div class="success-check">✓</div><h1>Your full aura<br>is unlocked! <span>✦</span></h1></section>
      <section class="success-card">
        <div class="card-image"></div>
        <div class="card-overlay">
          <div class="success-card-top"><p>✦ AuraCue ✦</p><h2>${escapeHtml(viewModel.cardPreview.title)}</h2><small>May 18, 2025</small></div>
          <div class="success-panel">
            <h3>${escapeHtml(viewModel.cardPreview.auraName)}</h3><p>${escapeHtml(viewModel.cardPreview.theme)}</p>
            <div><span>♡ Lucky Color</span><b></b><b></b><b></b></div>
            <div><span>☷ Social Action</span><em>☷</em></div>
            <div><span>♙ Outfit Energy</span><em>♙</em></div>
          </div>
        </div>
      </section>
      <footer class="success-actions">
        <button class="primary pill" data-control-id="${escapeHtml(viewModel.actions.viewFullCard.controlId)}">View Full Card ✦</button>
        <button class="white pill" data-control-id="${escapeHtml(viewModel.actions.shareStory.controlId)}">⇧ Share Story</button>
      </footer>
    </main>`
  });
}

function paymentHtmlShellLegacy({ title, bodyClass, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; font-family: Inter, "Plus Jakarta Sans", Nunito, system-ui, sans-serif; color: #101b3b; }
  body.confirm-bg { background: radial-gradient(circle at 50% 35%, #fff8f3 0%, #fff0f5 47%, #e7d9ff 100%); }
  body.failed-bg { background: linear-gradient(180deg, #fdf7f0 0%, #fff0f0 100%); }
  body.success-bg { background: linear-gradient(180deg, #fff0ee 0%, #ffe6ed 50%, #ffd6e3 100%); }
  .phone { position: relative; width: 390px; min-height: 844px; margin: 0 auto; box-sizing: border-box; overflow: hidden; }
  .visual-contract { display: none; }
  button { font: inherit; }
  .device-top { display: flex; align-items: center; justify-content: space-between; padding: 17px 28px 0; font-weight: 800; font-size: 14px; color: #050914; }
  .island { width: 132px; height: 31px; border-radius: 999px; background: #000; }
  .pay-header, .fail-header { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 24px 24px 0; }
  .pay-header button, .fail-header button { width: 40px; height: 40px; border: 0; background: transparent; color: #101b3b; font-size: 34px; line-height: 40px; }
  .pay-header h2, .fail-header h1 { position: absolute; left: 0; right: 0; text-align: center; margin: 0; font: 700 20px/1.1 Georgia, serif; color: #8b7bd9; }
  .pay-header h2 span { color: #f6b567; font-size: 14px; }
  .confirm-title h1, .fail-copy h2, .success-title h1 { margin: 0; text-align: center; font-family: Georgia, serif; letter-spacing: 0; }
  .confirm-title h1 { padding-top: 30px; font-size: 33px; line-height: 38px; }
  .confirm-title span { color: #f4b269; }
  .card-fan { position: relative; height: 213px; margin-top: 20px; }
  .fan-card { position: absolute; top: 34px; left: 50%; width: 100px; height: 142px; margin-left: -50px; border-radius: 14px; border: 1px solid #f6b48a; display: grid; place-items: center; color: #eda66e; font-size: 48px; background: rgba(255,255,255,.75); box-shadow: 0 15px 24px rgba(255,105,180,.18); }
  .fan-card.left { transform: translateX(-74px) rotate(-15deg); background: #fff1e8; }
  .fan-card.center { z-index: 3; width: 112px; height: 156px; margin-left: -56px; top: 24px; font-size: 58px; background: #fffafa; }
  .fan-card.right { transform: translateX(74px) rotate(15deg); background: #f9e9ff; border-color: #d9b8e7; color: #c5a3d8; }
  .clouds { position: absolute; left: 52px; right: 52px; bottom: 0; height: 42px; border-radius: 999px 999px 0 0; background: rgba(255,255,255,.62); filter: blur(2px); }
  .benefits { margin: 0 24px; padding: 13px 18px; border: 1px solid rgba(244,202,206,.8); border-radius: 22px; background: rgba(255,255,255,.67); box-shadow: 0 6px 20px rgba(255,105,180,.07); }
  .benefit-row { display: grid; grid-template-columns: 34px 1fr 28px; align-items: center; min-height: 45px; border-top: 1px solid rgba(28,39,76,.09); font-size: 15px; font-weight: 600; }
  .benefit-row:first-child { border-top: 0; }
  .check { width: 24px; height: 24px; border-radius: 50%; background: #ff5f91; color: white; display: grid; place-items: center; font-weight: 800; }
  .benefit-icon { text-align: right; color: #bd8ce1; font-size: 21px; }
  .price { position: relative; text-align: center; margin: 18px 0 20px; color: #101b3b; }
  .price h3 { margin: 0; font: 700 47px/52px Georgia, serif; }
  .price p { margin: 4px 0 0; color: #72749b; font-size: 15px; }
  .price i { position: absolute; top: 14px; color: #edae6a; font-style: normal; }
  .price i:first-child { left: 118px; } .price i:nth-child(3) { right: 118px; top: 28px; }
  .pill, .block { width: calc(100% - 48px); margin-left: 24px; border: 0; min-height: 54px; border-radius: 999px; font-weight: 800; font-size: 16px; }
  .primary { color: white; background: linear-gradient(90deg, #ff4f8c 0%, #ff7aa2 100%); box-shadow: 0 8px 20px rgba(255,80,140,.32); }
  .primary span { float: right; margin-right: 10px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,.34); line-height: 34px; }
  .secondary { color: #ee2f73; background: rgba(255,255,255,.43); border: 1px solid rgba(238,47,115,.22); box-shadow: none; }
  .secure { display: flex; align-items: center; gap: 10px; padding: 18px 38px; color: #7d7fa2; font-size: 13px; }
  .secure b { flex: 1; height: 1px; background: #cfcfe0; }
  .fineprint { margin: 13px 0 0; text-align: center; color: #8b8ba6; font-size: 12px; }
  .failed { padding: 0 24px 34px; }
  .fail-header { padding-left: 0; padding-right: 0; margin-top: 20px; }
  .fail-header button { background: white; border-radius: 50%; color: #64748b; font-size: 30px; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
  .fail-header h1 { color: transparent; background: linear-gradient(90deg,#ff9a9e,#fecfef); -webkit-background-clip: text; background-clip: text; font-weight: 500; }
  .fail-art { position: relative; display: flex; justify-content: center; height: 202px; align-items: center; margin-top: 18px; }
  .spark { position: absolute; color: #f5d2aa; } .spark.a { left: 48px; top: 44px; } .spark.b { right: 55px; top: 24px; }
  .cloud { width: 246px; height: 158px; border-radius: 86px; background: #ffe5ec; display: grid; place-items: center; box-shadow: 0 18px 28px rgba(255,142,158,.16); }
  .cloud b { width: 78px; height: 78px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(180deg,#ff8e9e,#ff6b81); color: #fff; font-size: 52px; }
  .fail-copy { text-align: center; margin-top: 2px; }
  .fail-copy h2 { font-size: 33px; line-height: 38px; font-weight: 700; }
  .fail-copy p { margin: 14px 0 36px; color: #64748b; font-size: 16px; line-height: 24px; }
  .fail-actions { display: grid; gap: 14px; }
  .fail-actions .block { width: 100%; margin: 0; min-height: 56px; border-radius: 24px; }
  .surface { color: #1e293b; background: rgba(255,255,255,.62); border: 1px solid rgba(255,255,255,.85); box-shadow: 0 4px 10px rgba(0,0,0,.03); }
  .support { display: block; margin: 36px auto 0; border: 0; background: transparent; color: #64748b; font-size: 14px; font-weight: 700; }
  .success { min-height: 844px; padding: 72px 24px 42px; background: linear-gradient(180deg, #fff0ee 0%, #ffe6ed 50%, #ffd6e3 100%); }
  .success-sparkles span { position: absolute; color: #d4af37; } .success-sparkles span:nth-child(1) { left: 42px; top: 76px; } .success-sparkles span:nth-child(2) { right: 64px; top: 124px; color: #ff6b9e; } .success-sparkles span:nth-child(3) { left: 22px; top: 260px; color: #c6afe7; }
  .success-title { text-align: center; }
  .success-check { width: 86px; height: 86px; margin: 0 auto 20px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg,#ffd275,#e6a840); border: 6px solid rgba(255,255,255,.75); color: white; font-size: 42px; box-shadow: 0 0 34px rgba(255,223,137,.48); }
  .success-title h1 { font-size: 33px; line-height: 38px; font-weight: 700; }
  .success-title span { color: #d4af37; }
  .success-card { position: relative; width: 320px; height: 512px; margin: 24px auto 22px; border-radius: 20px; overflow: hidden; border: 2px solid #e5c384; background: linear-gradient(160deg,#47377b,#ff6b9e 52%,#f4c76b); box-shadow: 0 16px 34px rgba(28,41,69,.18); color: white; }
  .card-image { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, rgba(255,255,255,.28), transparent 35%), linear-gradient(160deg,#47377b,#ff6b9e 58%,#f4c76b); }
  .card-overlay { position: absolute; inset: 6px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 14px; overflow: hidden; }
  .success-card-top { text-align: center; padding: 24px 14px 118px; }
  .success-card-top p { margin: 0 0 8px; opacity: .82; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .success-card-top h2 { margin: 0 0 4px; font: 500 21px/25px Georgia, serif; }
  .success-card-top small { opacity: .9; }
  .success-panel { margin: 0 12px 12px; padding: 16px; border-radius: 14px; background: rgba(255,255,255,.9); color: #2d3748; }
  .success-panel h3 { margin: 0; text-align: center; font: 700 19px/23px Georgia, serif; }
  .success-panel p { margin: 4px 0 12px; text-align: center; color: #64748b; font-size: 14px; }
  .success-panel div { display: flex; align-items: center; justify-content: space-between; min-height: 34px; border-top: 1px solid rgba(45,55,72,.12); font-size: 12px; font-weight: 700; }
  .success-panel b { width: 16px; height: 16px; border-radius: 50%; background: #a898d8; margin-left: 4px; } .success-panel b:nth-child(3) { background: #ff9eb5; } .success-panel b:nth-child(4) { background: #ffb58a; }
  .success-actions { display: grid; gap: 12px; }
  .success-actions .pill { width: 100%; margin: 0; min-height: 56px; }
  .white { color: #1c2945; background: rgba(255,255,255,.82); border: 1px solid rgba(255,214,227,.8); }
</style>
</head>
<body class="${escapeHtml(bodyClass)}">${body}</body>
</html>`;
}

function renderPaymentConfirmHtml(viewModel) {
  const rows = viewModel.valueRows
    .map((row, index) => `<div class="benefit-row"><span class="check">✓</span><span>${escapeHtml(row)}</span><span class="benefit-icon">${["□", "♙", "◌", "♣", "⇧"][index]}</span></div>`)
    .join("");
  return paymentHtmlShell({
    title: "AuraCue UI-11 Payment Confirm",
    bodyClass: "confirm-bg",
    body: `<main class="phone confirm"><div class="device-shell">
      <span class="visual-contract">Unlock your full Aura Card</span>
      <div class="device-top"><span>9:41</span><span class="island"></span><span class="status-icons">▮▮▮⌁▱</span></div>
      <header class="pay-header"><button data-control-id="close-payment">×</button><h2>AuraCue<span>✦</span></h2><i></i></header>
      <section class="confirm-title"><h1>Unlock your<br>full Aura Card <span>✦</span></h1></section>
      <section class="card-fan" aria-label="tarot cards"><div class="fan-card left">☾</div><div class="fan-card center">✦</div><div class="fan-card right">☾</div><div class="clouds"></div></section>
      <section class="benefits">${rows}</section>
      <section class="price"><i>✦</i><h3>${escapeHtml(viewModel.price)}</h3><i>✦</i><p>${escapeHtml(viewModel.priceNote)}</p></section>
      <button class="primary pill" data-control-id="${escapeHtml(viewModel.actions.confirmUnlock.controlId)}">Confirm Unlock $1.99 <span>▣</span></button>
      <div class="secure"><b></b><span>⌑ Secure &amp; private payment</span><b></b></div>
      <button class="secondary pill" data-control-id="${escapeHtml(viewModel.actions.inviteInstead.controlId)}">●● Invite 3 Friends Instead</button>
      <p class="fineprint">▣ Cancel anytime. Your data is safe with us.</p>
    </div></main>`
  });
}

function renderPaymentFailedHtml(viewModel) {
  return paymentHtmlShell({
    title: "AuraCue UI-12 Payment Failed",
    bodyClass: "failed-bg",
    body: `<main class="phone failed"><div class="device-shell">
      <span class="visual-contract">Payment didn't go through</span>
      <div class="device-top"><span>9:41</span><span class="island"></span><span class="status-icons">▮▮▮⌁▱</span></div>
      <header class="fail-header"><button data-control-id="${escapeHtml(viewModel.actions.back.controlId)}">‹</button><h1>✦ AuraCue ✦</h1><i></i></header>
      <section class="fail-art"><span class="spark a">✦</span><span class="spark b">✦</span><div class="cloud"><b>!</b></div></section>
      <section class="fail-copy"><h2>Payment didn't<br>go through</h2><p>${escapeHtml(viewModel.message).replace("No worries, it happens. Please try again.", "No worries, it happens.<br>Please try again.")}</p></section>
      <section class="fail-actions"><button class="primary block" data-control-id="${escapeHtml(viewModel.actions.tryAgain.controlId)}">↻ Try Again</button><button class="surface block" data-control-id="${escapeHtml(viewModel.actions.restorePurchase.controlId)}">↻ Restore Purchase</button><button class="surface block" data-control-id="${escapeHtml(viewModel.actions.inviteInstead.controlId)}">●● Invite 3 Friends Instead</button></section>
      <button class="support" data-control-id="${escapeHtml(viewModel.actions.contactSupport.controlId)}">☎ Contact Support</button>
    </div></main>`
  });
}

function renderPaymentSuccessHtml(viewModel) {
  return paymentHtmlShell({
    title: "AuraCue UI-13 Payment Success",
    bodyClass: "success-bg",
    body: `<main class="phone success"><div class="device-shell">
      <span class="visual-contract">Your full aura is unlocked</span>
      <div class="device-top"><span>9:41</span><span class="island"></span><span class="status-icons">▮▮▮⌁▱</span></div>
      <div class="success-sparkles"><span>✦</span><span>✦</span><span>✦</span><span></span><span></span></div>
      <section class="success-title"><div class="success-check">✓</div><h1>Your full aura<br>is unlocked! <span>✦</span></h1></section>
      <section class="success-card"><div class="card-image"></div><div class="card-overlay"><div class="success-card-top"><p>✦ AuraCue ✦</p><h2>${escapeHtml(viewModel.cardPreview.title)}</h2><small>May 18, 2025</small></div><div class="success-panel"><h3>${escapeHtml(viewModel.cardPreview.auraName)}</h3><p>${escapeHtml(viewModel.cardPreview.theme)}</p><div><span>♡ Lucky Color</span><b></b><b></b><b></b></div><div><span>☵ Social Action</span><em>☵</em></div><div><span>♙ Outfit Energy</span><em>♙</em></div></div></div></section>
      <footer class="success-actions"><button class="primary pill" data-control-id="${escapeHtml(viewModel.actions.viewFullCard.controlId)}">View Full Card ✦</button><button class="white pill" data-control-id="${escapeHtml(viewModel.actions.shareStory.controlId)}">⇧ Share Story</button></footer>
    </div></main>`
  });
}

function paymentHtmlShell({ title, bodyClass, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; font-family: Inter, "Plus Jakarta Sans", Nunito, system-ui, sans-serif; color: #101b3b; }
  body.confirm-bg, body.failed-bg { background: radial-gradient(circle at 50% 45%, #fff8f3 0%, #fff0f5 45%, #c9b6f0 100%); }
  body.success-bg { background: radial-gradient(circle at 50% 45%, #fff5f2 0%, #ffe6ed 52%, #f4d8ef 100%); }
  .phone { position: relative; width: 390px; height: 693px; margin: 0 auto; box-sizing: border-box; overflow: hidden; background: radial-gradient(circle at 18% 86%, rgba(255,255,255,.7) 0 18px, transparent 42px), radial-gradient(circle at 92% 62%, rgba(255,255,255,.55) 0 16px, transparent 48px), linear-gradient(135deg, #cbb7ee 0%, #fff4ef 45%, #ffdfe5 100%); }
  .device-shell { position: absolute; left: 47px; top: 12px; width: 296px; height: 664px; box-sizing: border-box; overflow: hidden; border: 9px solid #050608; border-radius: 36px; background: radial-gradient(circle at 50% 30%, #fff9f5 0%, #fff6f0 42%, #fff0f5 100%); box-shadow: 0 0 0 2px rgba(255,255,255,.45), 0 10px 22px rgba(29,23,51,.22); }
  .device-shell::before { content: ""; position: absolute; left: 97px; top: 13px; width: 102px; height: 29px; border-radius: 999px; background: #000; z-index: 6; }
  .device-shell::after { content: ""; position: absolute; left: 120px; bottom: 13px; width: 56px; height: 4px; border-radius: 999px; background: #050608; z-index: 6; }
  .visual-contract { display: none; }
  button { font: inherit; }
  .device-top { display: flex; align-items: center; justify-content: space-between; padding: 23px 30px 0; font-weight: 800; font-size: 13px; color: #050914; }
  .island { width: 102px; }
  .status-icons { font-size: 12px; letter-spacing: 1px; }
  .pay-header, .fail-header { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 24px 24px 0; }
  .pay-header button, .fail-header button { width: 31px; height: 31px; border: 0; background: transparent; color: #101b3b; font-size: 29px; line-height: 30px; }
  .pay-header h2, .fail-header h1 { position: absolute; left: 0; right: 0; text-align: center; margin: 0; font: 700 19px/1.1 Georgia, serif; color: #8b7bd9; }
  .pay-header h2 span { color: #f6b567; font-size: 14px; }
  .confirm-title h1, .fail-copy h2, .success-title h1 { margin: 0; text-align: center; font-family: Georgia, serif; letter-spacing: 0; }
  .confirm-title h1 { padding-top: 15px; font-size: 24px; line-height: 29px; }
  .confirm-title span { color: #f4b269; }
  .card-fan { position: relative; height: 118px; margin-top: 12px; }
  .fan-card { position: absolute; top: 20px; left: 50%; width: 60px; height: 86px; margin-left: -30px; border-radius: 10px; border: 1px solid #f6b48a; display: grid; place-items: center; color: #eda66e; font-size: 29px; background: rgba(255,255,255,.75); box-shadow: 0 12px 20px rgba(255,105,180,.18); }
  .fan-card.left { transform: translateX(-48px) rotate(-15deg); background: #fff1e8; }
  .fan-card.center { z-index: 3; width: 68px; height: 94px; margin-left: -34px; top: 13px; font-size: 36px; background: #fffafa; }
  .fan-card.right { transform: translateX(48px) rotate(15deg); background: #f9e9ff; border-color: #d9b8e7; color: #c5a3d8; }
  .clouds { position: absolute; left: 58px; right: 58px; bottom: 3px; height: 20px; border-radius: 999px 999px 0 0; background: rgba(255,255,255,.68); filter: blur(2px); }
  .benefits { margin: 0 24px; padding: 9px 14px; border: 1px solid rgba(244,202,206,.8); border-radius: 18px; background: rgba(255,255,255,.72); box-shadow: 0 6px 20px rgba(255,105,180,.07); }
  .benefit-row { display: grid; grid-template-columns: 26px 1fr 22px; align-items: center; min-height: 30px; border-top: 1px solid rgba(28,39,76,.09); font-size: 12px; font-weight: 650; }
  .benefit-row:first-child { border-top: 0; }
  .check { width: 19px; height: 19px; border-radius: 50%; background: #ff5f91; color: white; display: grid; place-items: center; font-weight: 800; }
  .benefit-icon { text-align: right; color: #bd8ce1; font-size: 17px; }
  .price { position: relative; text-align: center; margin: 10px 0 10px; color: #101b3b; }
  .price h3 { margin: 0; font: 700 35px/38px Georgia, serif; }
  .price p { margin: 1px 0 0; color: #72749b; font-size: 12px; }
  .price i { position: absolute; top: 8px; color: #edae6a; font-style: normal; }
  .price i:first-child { left: 106px; } .price i:nth-child(3) { right: 106px; top: 19px; }
  .pill, .block { width: calc(100% - 48px); margin-left: 24px; border: 0; min-height: 43px; border-radius: 999px; font-weight: 800; font-size: 13px; }
  .primary { color: white; background: linear-gradient(90deg, #ff4f8c 0%, #ff7aa2 100%); box-shadow: 0 8px 20px rgba(255,80,140,.32); }
  .primary span { float: right; margin-right: 5px; width: 27px; height: 27px; border-radius: 50%; background: rgba(255,255,255,.34); line-height: 27px; }
  .secondary { color: #ee2f73; background: rgba(255,255,255,.43); border: 1px solid rgba(238,47,115,.22); box-shadow: none; }
  .secure { display: flex; align-items: center; gap: 8px; padding: 11px 38px; color: #7d7fa2; font-size: 10px; }
  .secure b { flex: 1; height: 1px; background: #cfcfe0; }
  .fineprint { margin: 8px 0 0; text-align: center; color: #8b8ba6; font-size: 9px; }
  .failed .device-shell { background: linear-gradient(180deg, #fffaf6 0%, #fff5f1 100%); }
  .fail-header { padding-left: 24px; padding-right: 24px; margin-top: 12px; }
  .fail-header button { background: white; border-radius: 50%; color: #64748b; font-size: 30px; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
  .fail-header h1 { color: transparent; background: linear-gradient(90deg,#ff9a9e,#fecfef); -webkit-background-clip: text; background-clip: text; font-weight: 500; }
  .fail-art { position: relative; display: flex; justify-content: center; height: 170px; align-items: center; margin-top: 20px; }
  .spark { position: absolute; color: #f5d2aa; } .spark.a { left: 70px; top: 44px; } .spark.b { right: 70px; top: 24px; }
  .cloud { width: 190px; height: 110px; border-radius: 65px; background: #ffe5ec; display: grid; place-items: center; box-shadow: 0 18px 28px rgba(255,142,158,.16); }
  .cloud b { width: 70px; height: 70px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(180deg,#ff8e9e,#ff6b81); color: #fff; font-size: 48px; }
  .fail-copy { text-align: center; margin-top: 2px; }
  .fail-copy h2 { font-size: 28px; line-height: 33px; font-weight: 700; }
  .fail-copy p { margin: 12px 0 32px; color: #64748b; font-size: 14px; line-height: 20px; }
  .fail-actions { display: grid; gap: 10px; padding: 0 24px; }
  .fail-actions .block { width: 100%; margin: 0; min-height: 43px; border-radius: 22px; }
  .surface { color: #1e293b; background: rgba(255,255,255,.62); border: 1px solid rgba(255,255,255,.85); box-shadow: 0 4px 10px rgba(0,0,0,.03); }
  .support { display: block; margin: 24px auto 0; border: 0; background: transparent; color: #64748b; font-size: 12px; font-weight: 700; }
  .success .device-shell { background: radial-gradient(circle at 50% 55%, #fff7f1 0%, #fff0ee 48%, #ffe2eb 100%); }
  .success-sparkles span { position: absolute; color: #d4af37; } .success-sparkles span:nth-child(1) { left: 42px; top: 140px; } .success-sparkles span:nth-child(2) { right: 64px; top: 154px; color: #ff6b9e; } .success-sparkles span:nth-child(3) { left: 22px; top: 270px; color: #c6afe7; } .success-sparkles span:nth-child(4) { right: 40px; top: 300px; width: 6px; height: 16px; background: #f28faf; transform: rotate(20deg); border-radius: 2px; } .success-sparkles span:nth-child(5) { left: 45px; top: 340px; width: 5px; height: 13px; background: #b989e8; transform: rotate(65deg); border-radius: 2px; }
  .success-title { text-align: center; }
  .success-check { width: 58px; height: 58px; margin: 28px auto 14px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg,#ffd275,#e6a840); border: 4px solid rgba(255,255,255,.75); color: white; font-size: 34px; box-shadow: 0 0 34px rgba(255,223,137,.48); }
  .success-title h1 { font-size: 25px; line-height: 30px; font-weight: 700; }
  .success-title span { color: #d4af37; }
  .success-card { position: relative; width: 210px; height: 314px; margin: 12px auto 14px; border-radius: 16px; overflow: hidden; border: 2px solid #e5c384; background: linear-gradient(160deg,#47377b,#ff6b9e 52%,#f4c76b); box-shadow: 0 16px 34px rgba(28,41,69,.18); color: white; }
  .card-image { position: absolute; inset: 0; background: radial-gradient(circle at 50% 44%, rgba(255,255,255,.3), transparent 32%), radial-gradient(circle at 50% 46%, #8b4a37 0 22px, transparent 23px), linear-gradient(160deg,#47377b,#ff6b9e 58%,#f4c76b); }
  .card-overlay { position: absolute; inset: 6px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 14px; overflow: hidden; }
  .success-card-top { text-align: center; padding: 16px 10px 60px; }
  .success-card-top p { margin: 0 0 5px; opacity: .82; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; }
  .success-card-top h2 { margin: 0 0 4px; font: 500 17px/20px Georgia, serif; }
  .success-card-top small { opacity: .9; font-size: 11px; }
  .success-panel { margin: 0 10px 10px; padding: 10px; border-radius: 14px; background: rgba(255,255,255,.9); color: #2d3748; }
  .success-panel h3 { margin: 0; text-align: center; font: 700 16px/19px Georgia, serif; }
  .success-panel p { margin: 2px 0 8px; text-align: center; color: #64748b; font-size: 12px; }
  .success-panel div { display: flex; align-items: center; justify-content: space-between; min-height: 24px; border-top: 1px solid rgba(45,55,72,.12); font-size: 10px; font-weight: 700; }
  .success-panel b { width: 13px; height: 13px; border-radius: 50%; background: #a898d8; margin-left: 4px; } .success-panel b:nth-child(3) { background: #ff9eb5; } .success-panel b:nth-child(4) { background: #ffb58a; }
  .success-actions { display: grid; gap: 10px; padding: 0 32px; }
  .success-actions .pill { width: 100%; margin: 0; min-height: 43px; }
  .white { color: #1c2945; background: rgba(255,255,255,.82); border: 1px solid rgba(255,214,227,.8); }
</style>
</head>
<body class="${escapeHtml(bodyClass)}">${body}</body>
</html>`;
}

function localOnlyPaymentSummary() {
  return {
    payment: "local-mock-api-client-only",
    forbiddenSdkCalls: ["wechat-payment-sdk-call", "live-payment-provider", "live-payment-url"],
    analytics: "local-fixture-client",
    storage: "local-evidence-files-only",
    db: "mock repository/readback deferred to T20"
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
