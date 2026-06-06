import { makeFullCard, shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export function renderFullResultPage({ card, cardId = shellFixtureIds.unlockedCardId } = {}) {
  const fullCard = card ?? makeFullCard(cardId);
  const fields = fullCard.card;
  const guidanceRows = [
    { id: "colors", label: "Lucky Colors", title: "Navy, Rose, Gold", detail: "Wear one grounded tone with a warm luminous accent.", value: fields.colors },
    { id: "outfit", label: "Outfit Energy", title: "Tailored & Confident", detail: fields.outfit },
    { id: "beauty", label: "Beauty Cue", title: "Defined & Polished", detail: fields.beauty },
    { id: "social", label: "Social Move", title: "Lead with Clarity", detail: fields.social },
    { id: "ritual", label: "Tiny Ritual", title: "3 Deep Anchor Breaths", detail: fields.ritual },
    { id: "avoid", label: "Avoid Today", title: "Keep It Gentle", detail: fields.avoid }
  ];

  return {
    uiId: "UI-14",
    route: "/result/:id/full",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/09-\u7ed3\u679c_\u5b8c\u6574\u6c14\u573a\u5361\u4e0e\u5206\u4eab\u5165\u53e3.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/09/code.html",
    requirementIds: ["REQ-008", "REQ-010", "REQ-017"],
    apiIds: ["API-003", "API-007", "API-008", "API-010"],
    ownerScenario: "SCN-012",
    cardId: fullCard.cardId,
    title: fields.title,
    auraName: fields.auraName,
    tarot: {
      symbol: fields.tarotSymbol,
      keywords: ["Authority", "Structure", "Leadership"]
    },
    message: fields.message,
    caption: fields.caption,
    theme: fields.theme,
    shareImagePath: fullCard.shareImagePath,
    guidanceRows,
    actions: {
      saveCard: { controlId: "save-card", label: "Save Card", route: "/saved/:id", apiId: "API-007" },
      shareStory: { controlId: "share-story", label: "Share Story", route: "/share/:id", apiId: "API-008" },
      moreSharingOptions: { controlId: "more-sharing-options", label: "More Sharing Options", route: "/share/:id/channels", apiId: "API-008" },
      viewTrend: { controlId: "view-7-day-trend", label: "View 7-Day Trend", disabled: true, status: "P1_COMING_SOON", route: null }
    },
    localOnly: {
      payment: "entitlement supplied by local mock unlock fixture",
      ai: "fixture-api-client-no-provider-call",
      analytics: "local-fixture-client",
      storage: "local-evidence-files-only",
      db: "mock repository/readback deferred to T20"
    }
  };
}

export async function loadFullResultPage({ cardId = shellFixtureIds.unlockedCardId, store, apiClient, analytics }) {
  const card = await apiClient.getCard(cardId, "full");
  store.setCard(card);
  if (card.entitlement) {
    store.setEntitlement(card.entitlement);
  }
  const analyticsResponse = await analytics.track("page_view_full_result", "/result/:id/full", {
    uiId: "UI-14",
    apiId: "API-003",
    cardId,
    view: "full",
    requirementId: "REQ-008,REQ-010"
  });

  return {
    apiCalled: true,
    apiId: "API-003",
    requestedView: "full",
    card,
    viewModel: renderFullResultPage({ card, cardId }),
    analyticsResponse
  };
}

export async function clickSaveCard({ cardId = shellFixtureIds.unlockedCardId, navigator, store, apiClient, analytics }) {
  const saved = await apiClient.saveCard(cardId, { source: "full_result" });
  store.setShareSave({ saved: true, savedAt: saved.savedAt, source: "full_result" });
  const analyticsResponse = await analytics.track("save_card", "/result/:id/full", {
    uiId: "UI-14",
    apiId: "API-007",
    cardId,
    requirementId: "REQ-010"
  });
  const route = navigator.navigate("/saved/:id", { id: cardId });
  return { controlId: "save-card", expectedRoute: "/saved/:id", apiId: "API-007", saved, route, analyticsResponse };
}

export async function clickShareStory({ cardId = shellFixtureIds.unlockedCardId, navigator, store, apiClient, analytics }) {
  const share = await apiClient.recordShareEvent({ cardId, channel: "story", source: "full_result" });
  store.setShareSave({ lastShareEventId: share.shareEventId });
  const analyticsResponse = await analytics.track("share_card", "/result/:id/full", {
    uiId: "UI-14",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-010"
  });
  const route = navigator.navigate("/share/:id", { id: cardId });
  return { controlId: "share-story", expectedRoute: "/share/:id", apiId: "API-008", share, route, analyticsResponse };
}

export async function clickMoreSharingOptions({ cardId = shellFixtureIds.unlockedCardId, navigator, apiClient, analytics }) {
  const share = await apiClient.recordShareEvent({ cardId, channel: "story", source: "full_result_more_options" });
  const analyticsResponse = await analytics.track("click_more_sharing_options", "/result/:id/full", {
    uiId: "UI-14",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-010"
  });
  const route = navigator.navigate("/share/:id/channels", { id: cardId });
  return { controlId: "more-sharing-options", expectedRoute: "/share/:id/channels", apiId: "API-008", share, route, analyticsResponse };
}

export async function clickViewTrend({ cardId = shellFixtureIds.unlockedCardId, analytics }) {
  const analyticsResponse = await analytics.track("click_view_7_day_trend_disabled", "/result/:id/full", {
    uiId: "UI-14",
    cardId,
    p1Deferred: true,
    requirementId: "REQ-020"
  });
  return {
    controlId: "view-7-day-trend",
    disabled: true,
    p1Status: "P1_COMING_SOON",
    toast: "7-Day Trend is coming in a later AuraCue release.",
    route: null,
    analyticsResponse
  };
}

export function renderFullResultPageHtml(viewModel = renderFullResultPage()) {
  return renderFullResultPageHtmlU04(viewModel);

  const rows = viewModel.guidanceRows
    .map((row) => `<div class="guidance-row" data-field="${escapeHtml(row.id)}">
      <div class="icon">${escapeHtml(row.label.slice(0, 1))}</div>
      <div>
        <p class="label">${escapeHtml(row.label)}</p>
        <h4>${escapeHtml(row.title)}</h4>
        <p>${escapeHtml(row.detail)}</p>
      </div>
    </div>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-14 Full Result</title>
  <style>
    body { margin: 0; background: #fdfbf7; color: #1a2342; font-family: Inter, system-ui, sans-serif; }
    .phone { width: 390px; min-height: 844px; margin: 0 auto; padding: 48px 24px 28px; box-sizing: border-box; background: #fdfbf7; }
    header { display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; padding-bottom: 16px; background: rgba(253,251,247,.78); backdrop-filter: blur(10px); }
    .round { width: 40px; height: 40px; border-radius: 999px; border: 1px solid #f0e6d2; background: white; color: #d4af37; }
    h1 { margin: 0; font: 600 30px/34px Georgia, serif; }
    .ready { text-align: center; margin: 10px 0 20px; color: #8c7c6d; }
    .tarot { width: 240px; height: 380px; margin: 0 auto 24px; border-radius: 18px; border: 4px solid #1a2342; overflow: hidden; background: linear-gradient(180deg, #2a375e, #121933); color: white; display: grid; place-items: end center; box-shadow: 0 10px 30px rgba(0,0,0,.15); }
    .tarot strong { color: #d4af37; font: 700 19px Georgia, serif; text-transform: uppercase; letter-spacing: .14em; margin-bottom: 28px; }
    .aura h2 { margin: 0; font: 600 32px/36px Georgia, serif; }
    .aura .tarot-name { color: #8c7c6d; text-transform: uppercase; letter-spacing: .14em; font-size: 12px; margin: 6px 0 18px; }
    .panel { background: #f8f5ee; border: 1px solid white; border-radius: 28px; padding: 18px; box-shadow: 0 4px 20px rgba(0,0,0,.05); }
    .guidance-row { display: grid; grid-template-columns: 42px 1fr; gap: 14px; padding: 14px 0; border-bottom: 1px solid #eae3d5; }
    .guidance-row:last-child { border-bottom: 0; }
    .icon { width: 40px; height: 40px; border-radius: 999px; display: grid; place-items: center; background: white; color: #8c7c6d; border: 1px solid #eae3d5; box-shadow: 0 4px 12px rgba(0,0,0,.04); }
    .label { margin: 0 0 3px; color: #8c7c6d; font-size: 12px; }
    h4 { margin: 0 0 4px; font-size: 15px; }
    p { margin: 0; color: #8c7c6d; font-size: 13px; line-height: 18px; }
    .message { margin-top: 24px; padding: 22px; background: white; border: 1px solid #eae3d5; border-radius: 28px; text-align: center; font: 500 21px/31px Georgia, serif; }
    .trend { width: 100%; margin: 16px 0 24px; min-height: 54px; border-radius: 999px; border: 1px solid #eae3d5; background: #f8f5ee; color: #8c7c6d; font-weight: 700; }
    .share { margin-top: 16px; background: #faf5f3; border: 1px solid #f0e6df; border-radius: 28px; padding: 18px; }
    .mini { display: grid; grid-template-columns: 96px 1fr; gap: 12px; padding: 12px; border-radius: 16px; background: #1a2342; color: white; }
    .mini-art { border-radius: 12px; min-height: 128px; background: linear-gradient(160deg, #2a375e, #c27c7e 60%, #d4af37); }
    .caption { color: rgba(255,255,255,.8); font-style: italic; font-size: 11px; line-height: 15px; }
    .actions { display: grid; gap: 12px; margin-top: 16px; }
    .primary, .secondary, .tertiary { min-height: 52px; border-radius: 999px; font-weight: 800; font-size: 15px; }
    .primary { border: 0; color: white; background: linear-gradient(180deg, #d5a973, #a67b45); }
    .secondary { border: 2px solid #d5a973; color: #a67b45; background: transparent; }
    .tertiary { border: 1px solid #eae3d5; color: #8c7c6d; background: rgba(255,255,255,.5); }
    .private { margin: 18px 0 0; text-align: center; font-size: 12px; opacity: .75; }
    .visual-contract { display: none; }
  </style>
</head>
<body>
  <main class="phone">
    <span class="visual-contract">Soft Confidence ${escapeHtml(viewModel.auraName)} ${escapeHtml(viewModel.message)} ${escapeHtml(viewModel.caption)}</span>
    <header><button class="round">back</button><h1>AuraCue</h1><button class="round">tag</button></header>
    <section class="ready"><h2>Your Aura Card is Ready</h2></section>
    <section class="tarot"><strong>${escapeHtml(viewModel.tarot.symbol)}</strong></section>
    <section class="aura">
      <h2>${escapeHtml(viewModel.auraName)}</h2>
      <div class="tarot-name">${escapeHtml(viewModel.tarot.symbol)} - ${escapeHtml(viewModel.tarot.keywords.join(" - "))}</div>
      <div class="panel">${rows}</div>
    </section>
    <section class="message">${escapeHtml(viewModel.message)}</section>
    <button class="trend" disabled>${escapeHtml(viewModel.actions.viewTrend.label)} - Coming Soon</button>
    <section class="share">
      <h3>Share Your Card</h3>
      <p>Inspire someone's day</p>
      <div class="mini"><div class="mini-art"></div><div><h4>${escapeHtml(viewModel.auraName)}</h4><p>${escapeHtml(viewModel.tarot.symbol)}</p><p class="caption">"${escapeHtml(viewModel.caption)}"</p><strong>AuraCue</strong></div></div>
      <div class="actions">
        <button class="primary" data-control-id="save-card">${escapeHtml(viewModel.actions.saveCard.label)}</button>
        <button class="secondary" data-control-id="share-story">${escapeHtml(viewModel.actions.shareStory.label)}</button>
        <button class="tertiary" data-control-id="more-sharing-options">${escapeHtml(viewModel.actions.moreSharingOptions.label)}</button>
      </div>
    </section>
    <p class="private">Private. Personal. Just for you.</p>
  </main>
</body>
</html>`;
}

function renderFullResultPageHtmlU04(viewModel) {
  const rows = viewModel.guidanceRows
    .map((row, index) => `<div class="guidance-row row-${index}" data-field="${escapeHtml(row.id)}"><div class="icon">${["", "♙", "☵", "☷", "♧", "△"][index]}</div><div><p class="label">${escapeHtml(row.label)}</p><h4>${escapeHtml(row.title)}</h4><p>${escapeHtml(row.detail)}</p></div></div>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-14 Full Result</title>
  <style>
    body { margin: 0; background: #fdfbf7; color: #1a2342; font-family: Inter, system-ui, sans-serif; }
    .phone { position: relative; width: 390px; height: 693px; margin: 0 auto; box-sizing: border-box; overflow: hidden; padding: 14px 21px 11px; background: radial-gradient(circle at 50% 50%, #fffaf6 0%, #fdfbf7 62%, #f5eee5 100%); border: 1px solid #dedad2; border-radius: 14px; }
    .visual-contract { display: none; }
    .status { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 15px; margin-bottom: 8px; }
    .status span:last-child { letter-spacing: 2px; }
    header { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; margin-bottom: 8px; }
    .round { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #f0e6d2; background: white; color: #bd8750; font-size: 23px; box-shadow: 0 4px 12px rgba(0,0,0,.05); }
    h1 { margin: 0; text-align: center; font: 600 29px/34px Georgia, serif; }
    .ready { text-align: center; margin: 2px 0 14px; }
    .ready h2 { margin: 0; font: 500 15px/18px Georgia, serif; }
    .top-grid { display: grid; grid-template-columns: 176px 1fr; gap: 14px; align-items: start; }
    .tarot { position: relative; width: 156px; height: 258px; border-radius: 18px; border: 3px solid #1a2342; overflow: hidden; background: linear-gradient(180deg, #243253, #121933); color: #f4c760; box-shadow: 0 9px 22px rgba(0,0,0,.15); }
    .tarot::before { content: ""; position: absolute; inset: 13px 18px 50px; border-radius: 999px 999px 22px 22px; background: radial-gradient(circle at 50% 24%, #e7b98f 0 30px, transparent 31px), linear-gradient(160deg, #273050, #b06b63 58%, #2a3156); opacity: .85; }
    .tarot strong { position: absolute; left: 0; right: 0; bottom: 18px; text-align: center; font: 700 18px Georgia, serif; letter-spacing: .12em; text-transform: uppercase; }
    .aura-head .eyebrow { margin: 4px 0 4px; color: #c9787d; font: 600 12px Georgia, serif; }
    .aura-head h2 { margin: 0; font: 600 23px/27px Georgia, serif; }
    .tarot-name { color: #8c7c6d; text-transform: uppercase; letter-spacing: .12em; font-size: 9px; line-height: 14px; margin: 8px 0 10px; }
    .panel { background: rgba(248,245,238,.78); border: 1px solid white; border-radius: 22px; padding: 10px 10px 8px; box-shadow: 0 4px 18px rgba(0,0,0,.04); }
    .guidance-row { display: grid; grid-template-columns: 28px 1fr; gap: 8px; padding: 7px 0; border-bottom: 1px solid #eae3d5; }
    .guidance-row:last-child { border-bottom: 0; }
    .icon { width: 26px; height: 26px; border-radius: 999px; display: grid; place-items: center; background: #fffaf7; color: #a67b45; border: 1px solid #eee3d5; }
    .row-0 .icon { background: radial-gradient(circle, #e7b9b9 0 8px, #fff4f1 9px); }
    .label { margin: 0; color: #8c7c6d; font-size: 9px; line-height: 11px; }
    h4 { margin: 0 0 2px; font: 700 11px/13px Georgia, serif; }
    p { margin: 0; color: #8c7c6d; font-size: 9px; line-height: 12px; }
    .message-title { margin: 14px 0 6px; color: #c9787d; font: 600 13px Georgia, serif; }
    .message { width: 156px; min-height: 74px; padding: 15px 18px; box-sizing: border-box; background: rgba(255,255,255,.62); border: 1px solid #eadbd1; border-radius: 18px; text-align: center; font: 500 13px/18px Georgia, serif; }
    .trend { width: 100%; margin: 12px 0 9px; min-height: 34px; border-radius: 999px; border: 1px solid #eae3d5; background: #fbf8f2; color: #8c633c; font-weight: 700; font-size: 12px; }
    .share-title { margin: 0; text-align: center; font: 500 14px Georgia, serif; }
    .share-sub { text-align: center; margin-bottom: 5px; }
    .share { display: grid; grid-template-columns: 176px 1fr; gap: 16px; align-items: center; background: rgba(250,245,243,.75); border: 1px solid #f0e6df; border-radius: 20px; padding: 10px 12px; }
    .mini { display: grid; grid-template-columns: 70px 1fr; gap: 9px; padding: 7px; border-radius: 12px; background: #1a2342; color: white; min-height: 78px; }
    .mini-art { border-radius: 9px; background: linear-gradient(160deg, #2a375e, #c27c7e 60%, #d4af37); }
    .mini h4 { color: white; font-size: 10px; line-height: 12px; }
    .mini p { color: rgba(255,255,255,.75); font-size: 7px; line-height: 9px; }
    .caption { font-style: italic; }
    .actions { display: grid; gap: 8px; }
    .primary, .secondary, .tertiary { min-height: 31px; border-radius: 999px; font-weight: 800; font-size: 11px; }
    .primary { border: 0; color: white; background: linear-gradient(180deg, #d5a973, #a67b45); box-shadow: 0 6px 14px rgba(166,123,69,.25); }
    .secondary { border: 1px solid #d5a973; color: #a67b45; background: transparent; }
    .tertiary { border: 1px solid #eae3d5; color: #8c7c6d; background: rgba(255,255,255,.5); }
    .private { margin: 9px 0 0; text-align: center; font-size: 10px; opacity: .75; }
  </style>
</head>
<body>
  <main class="phone">
    <span class="visual-contract">Soft Confidence</span>
    <div class="status"><span>9:41</span><span>▮▮▮⌁▱</span></div>
    <header><button class="round">‹</button><h1>AuraCue</h1><button class="round">□</button></header>
    <section class="ready"><h2>Your Aura Card is Ready ✨</h2></section>
    <section class="top-grid">
      <div>
        <section class="tarot"><strong>${escapeHtml(viewModel.tarot.symbol)}</strong></section>
        <h3 class="message-title">✦ Today's Message</h3>
        <section class="message">${escapeHtml(viewModel.message)}</section>
      </div>
      <section class="aura">
        <div class="aura-head"><p class="eyebrow">✦ Today's Aura ✦</p><h2>${escapeHtml(viewModel.auraName)}</h2><div class="tarot-name">${escapeHtml(viewModel.tarot.symbol)} - ${escapeHtml(viewModel.tarot.keywords.join(" - "))}</div></div>
        <div class="panel">${rows}</div>
      </section>
    </section>
    <button class="trend" disabled>${escapeHtml(viewModel.actions.viewTrend.label)}</button>
    <h3 class="share-title">✦ Share Your Card ✦</h3><p class="share-sub">Inspire someone's day ✨</p>
    <section class="share">
      <div class="mini"><div class="mini-art"></div><div><h4>${escapeHtml(viewModel.auraName)}</h4><p>${escapeHtml(viewModel.tarot.symbol)}</p><p class="caption">"${escapeHtml(viewModel.caption)}"</p><strong>AuraCue</strong></div></div>
      <div class="actions"><button class="primary" data-control-id="save-card">${escapeHtml(viewModel.actions.saveCard.label)}</button><button class="secondary" data-control-id="share-story">${escapeHtml(viewModel.actions.shareStory.label)}</button><button class="tertiary" data-control-id="more-sharing-options">${escapeHtml(viewModel.actions.moreSharingOptions.label)}</button></div>
    </section>
    <p class="private">Private. Personal. Just for you.</p>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
