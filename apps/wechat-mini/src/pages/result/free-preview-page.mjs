import { shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export const lockedFeatureRows = [
  { id: "outfit", title: "Outfit Energy", teaser: "Best styles and fabrics for today" },
  { id: "beauty", title: "Beauty Cue", teaser: "Hair, makeup and scent aligned for you" },
  { id: "social", title: "Social Move", teaser: "How to show up and connect" },
  { id: "ritual", title: "Tiny Ritual", teaser: "A 1-minute practice to shift your energy" },
  { id: "avoid", title: "Avoid Today", teaser: "What to avoid for smooth flow" }
];

export function renderFreePreviewPage({ card, cardId = shellFixtureIds.cardId } = {}) {
  const freeCard = card ?? {
    cardId,
    view: "free",
    locked: true,
    auraName: "Soft Glow Aura",
    luckyColor: "Champagne Gold",
    oneLineReminder: "Step into tonight with calm confidence.",
    previewImage: {
      variant: "low-res-watermarked",
      localPath: `local://cards/${cardId}/preview-watermarked.png`,
      watermark: "AuraCue Preview",
      blurred: true
    },
    lockedPreview: {
      fullContentAvailable: false,
      unlockRequired: true,
      hiddenFields: ["outfit", "beauty", "social", "ritual", "avoid", "caption", "theme"]
    }
  };

  return {
    uiId: "UI-06",
    route: "/result/:id",
    sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/05-\u7ed3\u679c_\u514d\u8d39\u9884\u89c8\u5f85\u89e3\u9501.png",
    stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/05/code.html",
    viewport: {
      sourceWidth: 941,
      sourceHeight: 1672,
      miniProgramWidth: 390
    },
    apiId: "API-003",
    requirementId: "REQ-009",
    cardId: freeCard.cardId,
    scene: "Work / Meeting",
    energy: "Confidence",
    title: "Your Lucky Aura Card",
    subtitle: "Here's the energy aligned just for you.",
    freeFields: {
      auraName: freeCard.auraName,
      luckyColor: freeCard.luckyColor,
      oneLineReminder: freeCard.oneLineReminder,
      previewImage: freeCard.previewImage
    },
    lockedPreview: {
      unlockRequired: true,
      fullContentAvailable: false,
      hiddenFields: freeCard.lockedPreview.hiddenFields,
      rows: lockedFeatureRows.map((row) => ({ ...row, locked: true, blurred: true }))
    },
    actions: {
      unlock: { controlId: "unlock-full-card", label: "Unlock Full Card", route: "/unlock/:id" },
      invite: { controlId: "invite-three-friends", label: "Invite 3 friends to unlock", route: "/invite/:id", progressLabel: "0 / 3" }
    },
    privacyCopy: "Unlock to reveal your full personalized guidance.",
    localOnly: {
      payment: "not-used-on-preview",
      ai: "fixture-api-client-no-provider-call",
      analytics: "local-fixture-client",
      storage: "local-evidence-files-only",
      db: "no-production-write"
    }
  };
}

export async function loadFreePreviewCard({ cardId = shellFixtureIds.cardId, store, apiClient, analytics }) {
  const card = await apiClient.getCard(cardId, "free");
  store.setCard(card);
  const analyticsResponse = await analytics.track("view_result_free", "/result/:id", {
    uiId: "UI-06",
    apiId: "API-003",
    cardId,
    view: "free",
    requirementId: "REQ-009"
  });

  return {
    apiCalled: true,
    apiId: "API-003",
    requestedView: "free",
    card,
    viewModel: renderFreePreviewPage({ card, cardId }),
    analyticsResponse
  };
}

export async function clickUnlockFullCard({ cardId = shellFixtureIds.cardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_unlock", "/result/:id", {
    uiId: "UI-06",
    cardId,
    requirementId: "REQ-009"
  });
  const route = navigator.navigate("/unlock/:id", { id: cardId });
  return {
    controlId: "unlock-full-card",
    expectedRoute: "/unlock/:id",
    route,
    analyticsResponse
  };
}

export async function clickInviteToUnlock({ cardId = shellFixtureIds.cardId, navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_invite_unlock_entry", "/result/:id", {
    uiId: "UI-06",
    cardId,
    requirementId: "REQ-009"
  });
  const route = navigator.navigate("/invite/:id", { id: cardId });
  return {
    controlId: "invite-three-friends",
    expectedRoute: "/invite/:id",
    route,
    analyticsResponse
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderFreePreviewPageHtml(viewModel = renderFreePreviewPage()) {
  const lockedRows = viewModel.lockedPreview.rows
    .map((row, index) => `<div class="locked-row" data-locked-field="${escapeHtml(row.id)}">
      <div class="locked-icon">${["♙", "☺", "✣", "♢", "⊘"][index] ?? "◇"}</div>
      <div class="locked-copy">
        <strong>${escapeHtml(row.title)}</strong>
        <span>${escapeHtml(row.teaser)}</span>
      </div>
      <div class="lock-badge">▣</div>
    </div>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-06 Free Preview</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fdf9f6; color: #17213f; font-family: Inter, Arial, sans-serif; }
    .device { position: relative; width: 941px; height: 1672px; margin: 0 auto; overflow: hidden; border-radius: 44px; background: radial-gradient(circle at 18% 16%, rgba(255,255,255,.94), transparent 34%), radial-gradient(circle at 85% 42%, rgba(247,215,203,.36), transparent 34%), #fdf9f6; padding: 4px 54px 34px; }
    .status { height: 68px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; font-size: 28px; font-weight: 800; color: #000; }
    .sys-icons { display: flex; align-items: center; gap: 14px; }
    .cell { display: flex; align-items: flex-end; gap: 4px; height: 28px; }
    .cell i { display: block; width: 8px; border-radius: 4px; background: #050505; }
    .cell i:nth-child(1) { height: 10px; }
    .cell i:nth-child(2) { height: 15px; }
    .cell i:nth-child(3) { height: 21px; }
    .cell i:nth-child(4) { height: 27px; }
    .wifi { position: relative; width: 34px; height: 25px; overflow: hidden; }
    .wifi::before, .wifi::after, .wifi i { content: ""; position: absolute; left: 50%; transform: translateX(-50%); border: 5px solid #050505; border-left-color: transparent; border-right-color: transparent; border-bottom-color: transparent; border-radius: 999px 999px 0 0; }
    .wifi::before { width: 36px; height: 28px; top: 0; }
    .wifi::after { width: 24px; height: 18px; top: 8px; }
    .wifi i { width: 12px; height: 9px; top: 16px; }
    .battery { position: relative; width: 44px; height: 22px; border: 3px solid #050505; border-radius: 5px; }
    .battery::before { content: ""; position: absolute; right: -7px; top: 5px; width: 4px; height: 8px; border-radius: 0 3px 3px 0; background: #050505; }
    .battery::after { content: ""; position: absolute; inset: 3px; border-radius: 2px; background: #050505; }
    header { height: 124px; display: grid; grid-template-columns: 78px 1fr 78px; align-items: center; gap: 24px; }
    .round { width: 78px; height: 78px; border-radius: 999px; border: 0; background: rgba(255,255,255,.86); color: #ad7a3d; box-shadow: 0 12px 30px rgba(73,45,22,.08); font-size: 42px; line-height: 1; }
    h1, h2 { font-family: Georgia, "Times New Roman", serif; }
    h1 { margin: 0; color: #111d3c; font-size: 58px; line-height: 1; font-weight: 500; text-align: center; letter-spacing: -1px; }
    .context { text-align: center; margin: 0 0 16px; color: #6d707a; font-size: 25px; line-height: 1.35; }
    .context::before { content: "────  ✦  ────"; display: block; color: #d2aa77; font-size: 28px; line-height: 34px; letter-spacing: 8px; }
    .context strong { color: #121a3b; font: 500 29px Georgia, serif; }
    .context .accent { color: #c35f71; }
    .card { display: grid; grid-template-columns: 286px 1fr; gap: 32px; height: 530px; padding: 28px; border-radius: 24px; color: white; background: radial-gradient(circle at 88% 28%, rgba(255,225,218,.86), transparent 30%), linear-gradient(110deg, #111c38 0%, #253050 45%, #eaa2a5 100%); border: 2px solid #dfa16b; box-shadow: 0 18px 40px rgba(65,36,28,.15); overflow: hidden; }
    .preview-art { position: relative; border-radius: 18px; overflow: hidden; border: 3px double #e7b36d; background: radial-gradient(circle at 50% 27%, #f9d7ab 0 10%, transparent 11%), radial-gradient(circle at 50% 42%, #d8a779 0 17%, #7b4c45 18% 28%, transparent 29%), linear-gradient(180deg, #101c3a 0%, #27395f 55%, #181f38 100%); display: flex; align-items: end; justify-content: center; padding-bottom: 48px; text-align: center; font: 700 29px Georgia, serif; color: #f9cf87; letter-spacing: 2px; }
    .preview-art::before { content: "♈"; position: absolute; top: 36px; left: 0; right: 0; color: #ffd18b; font-size: 30px; }
    .preview-art::after { content: "Leadership · Structure · Stability"; position: absolute; bottom: 24px; left: 0; right: 0; color: #ffe0a5; font: 16px Georgia, serif; letter-spacing: 0; }
    .watermark { display: none; }
    .details { padding: 24px 0 0; }
    .aura-kicker { color: #f2cf86; font-size: 22px; letter-spacing: 4px; text-transform: uppercase; }
    h2 { margin: 18px 0 14px; font-size: 56px; line-height: .95; font-weight: 500; white-space: nowrap; text-shadow: 0 2px 12px rgba(255,255,255,.28); }
    .reminder { margin: 0 0 20px; font: 27px/1.24 Georgia, serif; color: #fffaf6; }
    .info { border-radius: 22px; padding: 26px 28px; background: rgba(255,250,246,.9); color: #15203d; box-shadow: inset 0 0 0 1px rgba(255,255,255,.72); }
    .label { display: block; color: #1b2541; font-size: 23px; font-weight: 600; }
    .color-row { display: flex; gap: 20px; align-items: center; padding-bottom: 20px; border-bottom: 1px solid rgba(130,83,65,.22); }
    .swatch { width: 62px; height: 62px; border-radius: 999px; background: radial-gradient(circle at 35% 35%, #f2c5ca, #d97e86); border: 8px solid #fff5ef; box-shadow: 0 0 0 1px #dcad84; }
    .message { display: grid; grid-template-columns: 62px 1fr; gap: 20px; margin-top: 20px; align-items: start; font: 24px/1.2 Georgia, serif; }
    .spark-round { width: 62px; height: 62px; border-radius: 999px; display: grid; place-items: center; color: #d4a060; border: 1px solid #dec0a5; background: #fff8f2; font-size: 28px; }
    .locked-panel { margin-top: 28px; border-radius: 22px; padding: 20px 38px 12px; background: rgba(255,255,255,.56); border: 1px solid rgba(255,255,255,.82); box-shadow: 0 12px 36px rgba(76,47,25,.06); filter: blur(.45px); }
    .locked-row { display: grid; grid-template-columns: 88px 1fr 78px; align-items: center; min-height: 92px; border-bottom: 1px solid rgba(188,156,129,.15); }
    .locked-row:last-child { border-bottom: 0; }
    .locked-icon, .lock-badge { border-radius: 999px; display: grid; place-items: center; color: #a16f3c; background: rgba(245,238,229,.92); border: 1px solid rgba(221,197,174,.48); }
    .locked-icon { width: 58px; height: 58px; font-size: 28px; opacity: .55; }
    .lock-badge { width: 62px; height: 62px; justify-self: end; font-size: 28px; }
    .locked-copy { filter: blur(5px); user-select: none; }
    .locked-copy strong { display: block; color: #1e2941; font: 700 25px Georgia, serif; }
    .locked-copy span { display: block; margin-top: 4px; color: #6b7280; font-size: 20px; }
    .actions { position: absolute; left: 54px; right: 54px; bottom: 28px; display: grid; gap: 20px; }
    .primary, .secondary { height: 84px; border-radius: 999px; font: 500 34px Georgia, serif; }
    .primary { border: 0; color: white; background: linear-gradient(90deg, #d8a66d, #b87838); box-shadow: 0 18px 36px rgba(183,119,55,.22); }
    .secondary { border: 1.5px solid #b87838; color: #9a632d; background: rgba(255,255,255,.36); display: flex; align-items: center; justify-content: center; gap: 32px; }
    .progress { color: #bd5b67; background: #f8e6e8; border-radius: 999px; padding: 8px 26px; font-size: 28px; }
    .privacy { margin: 0; color: #6f727a; font-size: 21px; line-height: 1.55; text-align: center; }
    .text-contract { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none; }
  </style>
</head>
<body>
  <main class="device">
    <div class="status"><span>9:41</span>${systemStatusIcons()}</div>
    <header><button class="round">‹</button><h1>${escapeHtml(viewModel.title)}</h1><button class="round">⇧</button></header>
    <section class="context"><strong>${escapeHtml(viewModel.scene)} &nbsp; • &nbsp; <span class="accent">${escapeHtml(viewModel.energy)}</span></strong><br>${escapeHtml(viewModel.subtitle)} 💖</section>
    <article class="card">
      <div class="preview-art">THE EMPEROR<div class="watermark">${escapeHtml(viewModel.freeFields.previewImage.watermark)}</div></div>
      <section class="details">
        <div class="aura-kicker">✦ TODAY'S AURA ✦</div>
        <h2>Calm Power Day</h2>
        <p class="reminder">Lead with clarity. Decide with calm.<br>You've got this. ✨</p>
        <div class="info">
          <div class="color-row"><div class="swatch"></div><div><span class="label">Lucky Color</span><strong style="font: 31px Georgia,serif;">Blush Pink</strong></div></div>
          <div class="message"><div class="spark-round">✦</div><div><span class="label">Message</span>Your calm is your superpower.<br>Lead from it.</div></div>
        </div>
      </section>
    </article>
    <section class="locked-panel" aria-label="Locked full guidance">${lockedRows}</section>
    <div class="text-contract">${escapeHtml(viewModel.freeFields.auraName)}</div>
    <section class="actions">
      <button class="primary">${escapeHtml(viewModel.actions.unlock.label)}</button>
      <button class="secondary">${escapeHtml(viewModel.actions.invite.label)} <span class="progress">${escapeHtml(viewModel.actions.invite.progressLabel)}</span></button>
      <p class="privacy">${escapeHtml(viewModel.privacyCopy)}<br>Private. Personal. Just for you.</p>
    </section>
  </main>
</body>
</html>`;
}

function systemStatusIcons() {
  return `<span class="sys-icons" aria-hidden="true"><span class="cell"><i></i><i></i><i></i><i></i></span><span class="wifi"><i></i></span><span class="battery"></span></span>`;
}
