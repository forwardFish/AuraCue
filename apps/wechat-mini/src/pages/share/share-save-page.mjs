import { makeFullCard, shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export const shareChannels = [
  { id: "wechat", label: "WeChat", accent: "#07c160", apiChannel: "wechat" },
  { id: "moments", label: "Moments", accent: "#18b77a", apiChannel: "moments" },
  { id: "xiaohongshu", label: "Xiaohongshu", accent: "#ff2442", apiChannel: "story" },
  { id: "instagram-story", label: "Instagram Story", accent: "#d84bb5", apiChannel: "story" },
  { id: "save-image", label: "Save Image", accent: "#64748b", apiChannel: "save_image" },
  { id: "copy-link", label: "Copy Link", accent: "#8b5cf6", apiChannel: "copy_link" }
];

export function renderStorySharePage({ card, cardId = shellFixtureIds.unlockedCardId, shareImage } = {}) {
  const fullCard = card ?? makeFullCard(cardId);
  const fields = {
    ...fullCard.card,
    auraName: "Soft Confidence",
    theme: "Romantic Clarity",
    luckyColor: "Embrace your glow",
    outfit: "Dress",
    social: "Message",
    ritual: "Rose",
    caption: "Speak from heart, your words create magic."
  };
  const image = shareImage ?? {
    cardId,
    templateId: "template-story-001",
    format: "story-9x16",
    localPath: fullCard.shareImagePath,
    width: 1080,
    height: 1920
  };

  return {
    uiId: "UI-15",
    route: "/share/:id",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/10A-\u5206\u4eab_Story\u5361\u9884\u89c8\u4e0e\u4fdd\u5b58.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/10a_story/code.html",
    requirementIds: ["REQ-011", "REQ-014", "REQ-017"],
    apiIds: ["API-008", "API-009", "API-010"],
    ownerScenario: "SCN-013",
    cardId: fullCard.cardId,
    title: "Today's Lucky Aura",
    eyebrow: "Share your",
    auraName: fields.auraName,
    theme: fields.theme,
    luckyColor: fields.luckyColor,
    outfit: fields.outfit,
    social: fields.social,
    ritual: fields.ritual,
    caption: fields.caption,
    shareImage: image,
    cardAspectRatio: "9:16",
    renderedArtifact: {
      kind: image.artifactKind ?? "local-path",
      localPath: image.localPath,
      dataUrl: image.dataUrl ?? null,
      dataUrlSha256: image.dataUrlSha256 ?? null,
      deterministicKey: image.deterministicKey ?? null,
      dimensions: { width: image.width, height: image.height }
    },
    actions: {
      close: { controlId: "close-share-preview", label: "Close", route: "/result/:id/full" },
      save: { controlId: "save-story-card", label: "Save", route: "/saved/:id", apiId: "API-007" },
      share: { controlId: "share-story-card", label: "Share", route: "/share/:id/channels", apiId: "API-008" },
      copy: { controlId: "copy-story-link", label: "Copy Link", route: null, apiId: "API-008" }
    },
    localOnly: {
      share: "local mocked platform action only",
      storage: "local rendered share image path only",
      analytics: "local fixture collector",
      db: "mock repository/readback deferred to T20"
    }
  };
}

export function renderChannelChooserPage({ cardId = shellFixtureIds.unlockedCardId } = {}) {
  return {
    uiId: "UI-16",
    route: "/share/:id/channels",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/10B-\u5206\u4eab_\u6e20\u9053\u9009\u62e9.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/10b/code.html",
    requirementIds: ["REQ-014", "REQ-017"],
    apiIds: ["API-008", "API-010"],
    ownerScenario: "SCN-013",
    cardId,
    title: "Share your Lucky Aura",
    channels: shareChannels,
    actions: {
      cancel: { controlId: "cancel-share-channel", label: "Cancel", route: "/share/:id" }
    },
    localOnly: {
      externalPlatform: "forbidden in tests; all channel taps are mocked local events",
      analytics: "local fixture collector"
    }
  };
}

export function renderSaveSuccessPage({ card, cardId = shellFixtureIds.unlockedCardId, savedAt = "2026-05-26T00:05:00.000Z" } = {}) {
  const fullCard = card ?? makeFullCard(cardId);
  const fields = {
    ...fullCard.card,
    auraName: "Soft Confidence",
    theme: "Romantic Clarity"
  };

  return {
    uiId: "UI-17",
    route: "/saved/:id",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/10C-\u4fdd\u5b58_\u4fdd\u5b58\u6210\u529f\u53cd\u9988.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/10c/code.html",
    requirementIds: ["REQ-011", "REQ-014", "REQ-017"],
    apiIds: ["API-007", "API-010"],
    ownerScenario: "SCN-014",
    cardId: fullCard.cardId,
    title: "Saved to your Aura Cards",
    subtitle: "Your lucky aura is ready whenever you step out.",
    auraName: fields.auraName,
    theme: fields.theme,
    savedAt,
    statusRows: [
      { id: "photos", label: "Saved to Photos", status: "saved" },
      { id: "aura-cards", label: "Saved to Aura Cards", status: "saved" }
    ],
    actions: {
      shareNow: { controlId: "share-now", label: "Share Now", route: "/share/:id", apiId: "API-008" },
      backHome: { controlId: "back-home", label: "Back Home", route: "/", apiId: "API-010" },
      viewSavedCard: { controlId: "view-saved-card", label: "View Saved Card", route: "/result/:id/full" }
    },
    localOnly: {
      storage: "local save fixture only",
      analytics: "local fixture collector",
      db: "mock save readback deferred to T20"
    }
  };
}

export async function loadStorySharePage({ cardId = shellFixtureIds.unlockedCardId, store, apiClient, analytics }) {
  const card = await apiClient.getCard(cardId, "full");
  const shareImage = await apiClient.renderShareImage(cardId, { templateId: "template-story-001", format: "story-9x16" });
  store.setCard(card);
  store.setShareSave({ shareImagePath: shareImage.localPath });
  const analyticsResponse = await analytics.track("page_view_share_story", "/share/:id", {
    uiId: "UI-15",
    apiId: "API-009",
    cardId,
    requirementId: "REQ-014"
  });

  return {
    apiCalled: true,
    apiIds: ["API-003", "API-009"],
    card,
    shareImage,
    viewModel: renderStorySharePage({ card, cardId, shareImage }),
    analyticsResponse
  };
}

export async function loadChannelChooserPage({ cardId = shellFixtureIds.unlockedCardId, analytics }) {
  const analyticsResponse = await analytics.track("page_view_share_channels", "/share/:id/channels", {
    uiId: "UI-16",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-014"
  });

  return { viewModel: renderChannelChooserPage({ cardId }), analyticsResponse };
}

export async function loadSaveSuccessPage({ cardId = shellFixtureIds.unlockedCardId, store, apiClient, analytics, source = "save_success" }) {
  const saved = await apiClient.saveCard(cardId, { source });
  store.setShareSave({ saved: true, savedAt: saved.savedAt, source });
  const analyticsResponse = await analytics.track("page_view_save_success", "/saved/:id", {
    uiId: "UI-17",
    apiId: "API-007",
    cardId,
    requirementId: "REQ-011"
  });

  return {
    apiCalled: true,
    apiId: "API-007",
    saved,
    viewModel: renderSaveSuccessPage({ cardId, savedAt: saved.savedAt }),
    analyticsResponse
  };
}

export async function clickSaveStoryCard({ cardId = shellFixtureIds.unlockedCardId, navigator, store, apiClient, analytics }) {
  const saved = await apiClient.saveCard(cardId, { source: "share_story_preview" });
  store.setShareSave({ saved: true, savedAt: saved.savedAt, source: "share_story_preview" });
  const analyticsResponse = await analytics.track("save_card", "/share/:id", {
    uiId: "UI-15",
    apiId: "API-007",
    cardId,
    requirementId: "REQ-011"
  });
  const route = navigator.navigate("/saved/:id", { id: cardId });
  return { controlId: "save-story-card", expectedRoute: "/saved/:id", apiId: "API-007", saved, route, analyticsResponse };
}

export async function clickShareStoryCard({ cardId = shellFixtureIds.unlockedCardId, navigator, store, apiClient, analytics }) {
  const share = await apiClient.recordShareEvent({ cardId, channel: "story", source: "share_story_preview" });
  store.setShareSave({ lastShareEventId: share.shareEventId });
  const analyticsResponse = await analytics.track("share_card", "/share/:id", {
    uiId: "UI-15",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-014"
  });
  const route = navigator.navigate("/share/:id/channels", { id: cardId });
  return { controlId: "share-story-card", expectedRoute: "/share/:id/channels", apiId: "API-008", share, route, analyticsResponse };
}

export async function clickCopyStoryLink({ cardId = shellFixtureIds.unlockedCardId, store, apiClient, analytics }) {
  const share = await apiClient.recordShareEvent({ cardId, channel: "copy_link", source: "share_story_preview" });
  store.setShareSave({ lastShareEventId: share.shareEventId, copiedLink: true });
  const analyticsResponse = await analytics.track("copy_share_link", "/share/:id", {
    uiId: "UI-15",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-014"
  });
  return { controlId: "copy-story-link", apiId: "API-008", share, toast: "Link copied", analyticsResponse };
}

export async function clickShareChannel({ cardId = shellFixtureIds.unlockedCardId, channelId, store, apiClient, analytics }) {
  const channel = shareChannels.find((item) => item.id === channelId);
  if (!channel) {
    throw new Error(`Unknown local share channel: ${channelId}`);
  }
  const share = await apiClient.recordShareEvent({ cardId, channel: channel.apiChannel, source: `share_channel_chooser:${channel.id}` });
  store.setShareSave({ lastShareEventId: share.shareEventId, lastChannel: channel.apiChannel });
  const analyticsResponse = await analytics.track("share_card", "/share/:id/channels", {
    uiId: "UI-16",
    apiId: "API-008",
    cardId,
    channel: channel.apiChannel,
    requirementId: "REQ-014"
  });
  return { controlId: `share-channel-${channel.id}`, apiId: "API-008", channel, share, mockedExternalAction: true, analyticsResponse };
}

export async function clickCancelChannels({ cardId = shellFixtureIds.unlockedCardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_cancel_share_channels", "/share/:id/channels", {
    uiId: "UI-16",
    cardId,
    requirementId: "REQ-014"
  });
  const route = navigator.navigate("/share/:id", { id: cardId });
  return { controlId: "cancel-share-channel", expectedRoute: "/share/:id", route, analyticsResponse };
}

export async function clickShareNowFromSaved({ cardId = shellFixtureIds.unlockedCardId, navigator, store, apiClient, analytics }) {
  const share = await apiClient.recordShareEvent({ cardId, channel: "story", source: "save_success" });
  store.setShareSave({ lastShareEventId: share.shareEventId });
  const analyticsResponse = await analytics.track("share_card", "/saved/:id", {
    uiId: "UI-17",
    apiId: "API-008",
    cardId,
    requirementId: "REQ-011"
  });
  const route = navigator.navigate("/share/:id", { id: cardId });
  return { controlId: "share-now", expectedRoute: "/share/:id", apiId: "API-008", share, route, analyticsResponse };
}

export async function clickBackHomeFromSaved({ navigator, analytics, cardId = shellFixtureIds.unlockedCardId }) {
  const analyticsResponse = await analytics.track("return_next_day", "/saved/:id", {
    uiId: "UI-17",
    cardId,
    requirementId: "REQ-011"
  });
  const route = navigator.navigate("/");
  return { controlId: "back-home", expectedRoute: "/", route, analyticsResponse };
}

export function renderShareSavePageHtml(viewModel) {
  if (viewModel.uiId === "UI-15") {
    return renderStoryHtml(viewModel);
  }
  if (viewModel.uiId === "UI-16") {
    return renderChannelsHtml(viewModel);
  }
  return renderSavedHtml(viewModel);
}

function renderStoryHtml(viewModel) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AuraCue UI-15 Share Story</title>${baseStyle()}</head>
<body class="story-body">${deviceTop()}
  <main class="screen story">
    ${statusBar()}
    <header><button class="round x" data-control-id="close-share-preview"></button><strong>AuraCue</strong><span></span></header>
    <section class="share-title"><i class="spark s1"></i><i class="spark s2"></i><p>${escapeHtml(viewModel.eyebrow)}</p><h1>${escapeHtml(viewModel.title)}</h1><div class="rule"></div></section>
    <section class="story-card" data-aspect="${escapeHtml(viewModel.cardAspectRatio)}" data-renderer-key="${escapeHtml(viewModel.renderedArtifact.deterministicKey ?? "")}">
      <div class="rendered-artifact" data-local-path="${escapeHtml(viewModel.renderedArtifact.localPath)}"></div>
      <div class="inner-frame"></div>
      <div class="story-figure"></div>
      <div class="story-top"><b>AuraCue</b><h2>Today's Lucky Aura</h2><p>May 18, 2025</p></div>
      <div class="story-panel">
        <h3>${escapeHtml(viewModel.auraName)}</h3>
        <p>${escapeHtml(viewModel.theme)}</p>
        <div><span><b>Lucky Color</b><small>${escapeHtml(viewModel.luckyColor)}</small></span><strong class="swatches"><i></i><i></i><i></i></strong></div>
        <div><span>Outfit Energy</span><strong>Dress</strong></div>
        <div><span>Social Action</span><strong>Message</strong></div>
        <div><span>Tiny Ritual</span><strong>Rose</strong></div>
        <em>"${escapeHtml(viewModel.caption)}"</em>
      </div>
    </section>
    <footer class="round-actions">
      <button data-control-id="save-story-card"><i class="download"></i><span>Save</span></button>
      <button data-control-id="share-story-card"><i class="upload"></i><span>Share</span></button>
      <button data-control-id="copy-story-link"><i class="link"></i><span>Copy Link</span></button>
    </footer>
  </main>
</div></body>
</html>`;
}

function renderChannelsHtml(viewModel) {
  const channels = viewModel.channels
    .map((channel) => `<button class="channel" data-control-id="share-channel-${escapeHtml(channel.id)}"><i style="background:${escapeHtml(channel.accent)}">${escapeHtml(channel.label.slice(0, 1))}</i><span>${escapeHtml(channel.label)}</span></button>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AuraCue UI-16 Share Channels</title>${baseStyle()}</head>
<body class="channels-body">${deviceTop()}
  <main class="screen channels">
    ${statusBar()}
    <header><button class="round x">x</button><strong>AuraCue</strong><span></span></header>
    <section class="compact-preview"><h1>${escapeHtml(viewModel.title)} <span>+</span></h1><div class="story-mini"><div class="story-figure mini"></div><div class="mini-panel"><b>Soft Confidence</b><span>Romantic Clarity</span></div></div></section>
    <section class="sheet"><div class="grid">${channels}</div><button class="cancel" data-control-id="cancel-share-channel">${escapeHtml(viewModel.actions.cancel.label)}</button></section>
  </main>
</div></body>
</html>`;
}

function renderSavedHtml(viewModel) {
  const statusRows = viewModel.statusRows
    .map((row) => `<div class="status-row"><span>${escapeHtml(row.label)}</span><b>check</b></div>`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AuraCue UI-17 Saved</title>${baseStyle()}</head>
<body class="saved-body">${deviceTop()}
  <main class="screen saved">
    ${statusBar()}
    <header><button class="round x">x</button><strong>AuraCue</strong><span></span></header>
    <section class="success-mark"></section>
    <h1>${escapeHtml(viewModel.title)}</h1>
    <p class="subtitle">${escapeHtml(viewModel.subtitle)}</p>
    <section class="saved-card"><div class="saved-portrait"></div><div class="saved-caption"><h2>Rose Aura</h2><p>Love - Confidence - Radiance</p><small>${escapeHtml(viewModel.auraName)}</small></div></section>
    <section class="status-list">${statusRows}</section>
    <section class="stack-actions">
      <button data-control-id="share-now">${escapeHtml(viewModel.actions.shareNow.label)}</button>
      <button data-control-id="back-home">${escapeHtml(viewModel.actions.backHome.label)}</button>
      <a data-control-id="view-saved-card">${escapeHtml(viewModel.actions.viewSavedCard.label)}</a>
    </section>
  </main>
</div></body>
</html>`;
}

function baseStyle() {
  return `<style>
    body { margin: 0; min-height: 100vh; font-family: Inter, system-ui, sans-serif; color: #111936; background: #fff7f0; }
    .device { width: 390px; min-height: 844px; margin: 0 auto; box-sizing: border-box; padding: 10px 13px; border-radius: 52px; background: #090909; box-shadow: inset 0 0 0 2px #444, inset 0 0 0 4px #111; position: relative; overflow: hidden; }
    .screen { width: 100%; min-height: 824px; margin: 0 auto; box-sizing: border-box; padding: 20px 24px 26px; position: relative; overflow: hidden; border-radius: 42px; background: linear-gradient(180deg, #fff8f5 0%, #fff1f6 42%, #f9cddd 100%); }
    .status { height: 34px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px 0 20px; color: #05050a; font-weight: 800; font-size: 15px; }
    .notch { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 92px; height: 29px; border-radius: 999px; background: #050505; z-index: 5; }
    .status-icons { width: 62px; height: 14px; background: linear-gradient(90deg,#111 0 8px,transparent 8px 13px,#111 13px 22px,transparent 22px 28px,#111 28px 38px,transparent 38px 44px,#111 44px 62px); border-radius: 2px; opacity: .9; }
    header { display: flex; justify-content: space-between; align-items: center; margin: -8px 0 8px; }
    header strong { font: 600 19px Georgia, serif; color: #d69d40; text-shadow: 0 1px 0 white; }
    .round { width: 30px; height: 30px; border-radius: 999px; border: 1px solid rgba(220,190,150,.35); background: rgba(255,255,255,.55); color: #111936; position: relative; }
    .x::before,.x::after { content: ""; position: absolute; left: 8px; right: 8px; top: 14px; height: 2px; background: currentColor; transform: rotate(45deg); }
    .x::after { transform: rotate(-45deg); }
    .share-title { text-align: center; margin: 2px 0 10px; position: relative; }
    .share-title p { margin: 0; color: #111936; font: 16px Georgia, serif; }
    h1 { margin: 0; text-align: center; font: 600 27px/31px Georgia, serif; color: #251345; }
    .rule { width: 120px; height: 12px; margin: 6px auto 0; background: linear-gradient(90deg,transparent 0 18px,#d8a354 18px 56px,transparent 56px 64px,#d8a354 64px 102px,transparent 102px); position: relative; }
    .rule::after,.spark::after { content: "*"; color: #d8a354; font: 22px Georgia, serif; }
    .spark { position: absolute; color: #d8a354; font-style: normal; }
    .s1 { left: 24px; top: -6px; }
    .s2 { right: 22px; top: -2px; }
    .story-card { width: 236px; margin: 0 auto; aspect-ratio: 9 / 16; border-radius: 18px; overflow: hidden; position: relative; background: radial-gradient(circle at 50% 48%, #ffd8bd 0 12%, transparent 34%), linear-gradient(165deg, #56398d 0%, #976fe5 44%, #f6a6c6 74%, #ffe0a8 100%); color: white; border: 1px solid rgba(212,175,55,.8); box-shadow: 0 12px 28px rgba(42,26,74,.18); }
    .rendered-artifact { position: absolute; inset: 0; opacity: .001; pointer-events: none; }
    .inner-frame { position: absolute; inset: 10px; border: 1px solid rgba(212,175,55,.38); border-radius: 18px; }
    .story-figure { position: absolute; left: 58px; right: 58px; top: 162px; height: 150px; border-radius: 48% 48% 16px 16px; background: radial-gradient(circle at 50% 42%, #6b2b1f 0 18%, transparent 19%), radial-gradient(ellipse at 50% 70%, #ffd3bf 0 39%, transparent 40%); opacity: .85; }
    .story-top { position: relative; text-align: center; padding-top: 24px; }
    .story-top b { color: #f5e15c; }
    .story-top h2 { margin: 4px 0; font: 600 21px Georgia, serif; }
    .story-top p { margin: 0; font-size: 13px; }
    .story-panel { position: absolute; left: 20px; right: 20px; bottom: 16px; padding: 12px 18px; border-radius: 17px; background: rgba(255,253,248,.9); color: #111936; border: 1px solid rgba(212,175,55,.25); }
    .story-panel h3 { margin: 0; text-align: center; font: 600 18px Georgia, serif; text-transform: none; }
    .story-panel p { margin: 2px 0 8px; text-align: center; color: #111936; font-size: 12px; }
    .story-panel div { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 5px 0; border-top: 1px solid rgba(212,175,55,.22); font-size: 10px; }
    .story-panel small { display: block; color: #a25f33; font-size: 10px; font-weight: 400; }
    .story-panel strong { text-align: right; min-width: 54px; color: #f46d93; }
    .swatches { display: flex; gap: 8px; }
    .swatches i { width: 20px; height: 20px; border-radius: 50%; background: #ff6f9d; box-shadow: inset 0 0 0 1px rgba(0,0,0,.1); }
    .swatches i:nth-child(2) { background: #b68be8; }
    .swatches i:nth-child(3) { background: #ffb079; }
    .story-panel em { display: block; margin-top: 8px; text-align: center; font: 500 10px/14px Georgia, serif; }
    .round-actions { display: flex; justify-content: center; gap: 40px; margin-top: 12px; }
    .round-actions button { width: 60px; display: grid; gap: 7px; justify-items: center; border: 0; background: transparent; color: #111936; font-weight: 600; font-size: 12px; }
    .round-actions i { width: 54px; height: 54px; border-radius: 999px; background: rgba(255,255,255,.9); border: 1px solid rgba(212,175,55,.55); box-shadow: 0 8px 18px rgba(42,26,74,.12); position: relative; }
    .download::after { content: "v"; font: 800 28px Arial; position: absolute; inset: 11px 0 0; text-align: center; }
    .upload::after { content: "^"; font: 800 28px Arial; position: absolute; inset: 11px 0 0; text-align: center; }
    .link::after { content: "oo"; font: 800 21px Arial; position: absolute; inset: 15px 0 0; text-align: center; letter-spacing: -5px; transform: rotate(-35deg); }
    .channels { background: #fdf9f1; padding-bottom: 20px; }
    .compact-preview h1 { font-size: 18px; line-height: 24px; margin: 0 0 12px; }
    .compact-preview h1 span { color: #d69d40; }
    .story-mini { width: 174px; height: 309px; margin: 0 auto; border-radius: 16px; background: radial-gradient(circle at 50% 42%, #ffd8bd 0 13%, transparent 34%), linear-gradient(165deg, #56398d, #f6a6c6 70%, #fff0f5); box-shadow: 0 10px 24px rgba(42,26,74,.13); border: 1px solid rgba(212,175,55,.55); position: relative; overflow: hidden; }
    .story-figure.mini { top: 105px; left: 42px; right: 42px; height: 94px; }
    .mini-panel { position: absolute; left: 26px; right: 26px; bottom: 12px; border-radius: 14px; background: rgba(255,255,255,.72); padding: 8px; text-align: center; font-size: 10px; }
    .mini-panel b,.mini-panel span { display: block; }
    .sheet { position: absolute; left: 18px; right: 18px; bottom: 196px; padding: 0 0 54px; border-radius: 26px; background: rgba(255,255,255,.55); border: 1px solid rgba(232,190,160,.5); box-shadow: 0 8px 20px rgba(42,26,74,.06); overflow: hidden; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
    .channel { min-height: 84px; display: grid; gap: 7px; place-items: center; border: 0; border-right: 1px solid rgba(221,179,150,.35); border-bottom: 1px solid rgba(221,179,150,.35); background: transparent; color: #111936; font-size: 12px; }
    .channel i { width: 38px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: white; font-style: normal; font-weight: 900; }
    .cancel { position: absolute; left: 18px; right: 18px; bottom: 10px; width: auto; min-height: 38px; border-radius: 999px; border: 1px solid rgba(248,113,113,.24); background: rgba(254,242,242,.58); font: 600 16px Georgia, serif; color: #111936; }
    .saved-body { background: #fdf9f2; }
    .saved { background: radial-gradient(circle at 50% 27%, rgba(255,223,179,.42), transparent 26%), radial-gradient(circle at 50% 57%, rgba(255,160,158,.18), transparent 30%), #fffdf8; color: #4a3b2c; }
    .saved .success-mark { width: 74px; height: 74px; margin: 18px auto 18px; border-radius: 999px; border: 2px solid #d0a960; box-shadow: 0 0 22px rgba(210,169,96,.35); position: relative; }
    .success-mark::after { content: ""; position: absolute; left: 22px; top: 23px; width: 26px; height: 14px; border-left: 5px solid #d0a960; border-bottom: 5px solid #d0a960; transform: rotate(-45deg); }
    .saved h1 { font-size: 27px; line-height: 34px; color: #4a3020; }
    .subtitle { text-align: center; color: #7a6b5c; margin: 8px 0 20px; font-size: 14px; }
    .saved-card { width: 200px; height: 298px; margin: 0 auto 22px; border-radius: 12px; overflow: hidden; background: radial-gradient(circle at 50% 39%, #ffe1d4 0 29%, transparent 30%), linear-gradient(180deg,#fffaf1,#fff4eb); border: 1px solid rgba(200,169,126,.42); box-shadow: 0 12px 28px rgba(139,94,60,.18); position: relative; }
    .saved-portrait { position: absolute; left: 50px; right: 50px; top: 92px; height: 92px; border-radius: 48% 48% 18px 18px; background: radial-gradient(circle at 50% 38%, #6b2b1f 0 21%, transparent 22%), radial-gradient(ellipse at 50% 70%, #ffd3bf 0 40%, transparent 41%); }
    .saved-caption { position: absolute; left: 0; right: 0; bottom: 44px; text-align: center; }
    .saved-card h2 { margin: 0; font: 600 19px Georgia, serif; color: #c59043; text-transform: uppercase; }
    .saved-card p { margin: 4px 0 0; color: #d77d72; font-size: 12px; }
    .saved-card small { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
    .status-list { display: grid; gap: 10px; margin-bottom: 22px; }
    .status-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-radius: 16px; background: rgba(255,255,255,.55); border: 1px solid rgba(200,169,126,.24); color: #6b5744; }
    .status-row b { width: 20px; height: 20px; overflow: hidden; color: transparent; background: #ff8585; border-radius: 999px; position: relative; }
    .status-row b::after { content: ""; position: absolute; left: 6px; top: 5px; width: 7px; height: 4px; border-left: 2px solid white; border-bottom: 2px solid white; transform: rotate(-45deg); }
    .stack-actions { display: grid; gap: 12px; text-align: center; }
    .stack-actions button { min-height: 48px; border-radius: 999px; font: 700 17px Georgia, serif; }
    .stack-actions button:first-child { border: 0; background: linear-gradient(135deg, #ffb5b3, #ff8f8d); color: white; }
    .stack-actions button:nth-child(2) { background: white; border: 1px solid rgba(200,169,126,.52); color: #8e6e41; }
    .stack-actions a { color: #ffa09e; font-size: 14px; }
  </style>`;
}

function deviceTop() {
  return `<div class="phone device"><div class="notch"></div>`;
}

function statusBar() {
  return `<div class="status"><span>9:41</span><span class="status-icons"></span></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
