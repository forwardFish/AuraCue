import { shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export const energyOptions = [
  {
    id: "confidence",
    label: "Confidence",
    icon: "spark",
    description: "Stand tall. Believe in you."
  },
  {
    id: "luck",
    label: "Luck",
    icon: "clover",
    description: "Open doors. Attract opportunity."
  },
  {
    id: "love",
    label: "Love",
    icon: "heart",
    description: "Open your heart. Invite meaningful love."
  },
  {
    id: "calm",
    label: "Calm",
    icon: "moon",
    description: "Find peace. Let go of what weighs you down."
  },
  {
    id: "charm",
    label: "Charm",
    icon: "star",
    description: "Magnetic energy. Naturally draw people in."
  },
  {
    id: "focus",
    label: "Focus",
    icon: "eye",
    description: "Clear your mind. Stay aligned and on track."
  }
];

export const combinedEnergyOrder = ["Confidence", "Calm", "Love", "Focus", "Luck", "Charm"];

export const energyPageViewModel = {
  uiId: "UI-03",
  route: "/create/energy",
  sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/03-\u9009\u62e9_\u4eca\u65e5\u80fd\u91cf.png",
  stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/03/code.html",
  incompleteSourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/03A-\u9009\u62e9_\u573a\u666f\u4e0e\u80fd\u91cf\u672a\u5b8c\u6210\u72b6\u6001.png",
  incompleteStitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/03a/code.html",
  viewport: {
    sourceWidth: 941,
    sourceHeight: 1672,
    miniProgramWidth: 390
  },
  statusBar: {
    time: "9:41"
  },
  header: {
    brand: "AuraCue",
    step: "Step 2 of 2"
  },
  hero: {
    titleLines: ["What energy do you", "need today?"],
    subtitleLines: ["Choose the energy you want to invite in.", "Your card will be aligned to support it."]
  },
  options: energyOptions,
  optionalPrompt: {
    label: "How do you feel today?",
    placeholder: "Share anything that's on your heart... (optional)"
  },
  primaryCta: {
    id: "generate-card",
    label: "Generate My Lucky Aura Card",
    incompleteLabel: "Generate My Aura Card",
    route: "/create/loading"
  },
  validation: {
    missingScene: "Choose one scene to continue.",
    missingEnergy: "Choose one energy to continue.",
    missingBoth: "Choose one scene and one energy to continue."
  },
  trustCopy: "Private. Personal. Just for you."
};

export function isSelectionComplete(state) {
  return Boolean(state.scene && state.energy);
}

export function validationMessage(state) {
  if (state.scene && state.energy) {
    return null;
  }
  if (!state.scene && !state.energy) {
    return energyPageViewModel.validation.missingBoth;
  }
  if (!state.scene) {
    return energyPageViewModel.validation.missingScene;
  }
  return energyPageViewModel.validation.missingEnergy;
}

export function renderEnergyPage({ selectedScene = "date", selectedEnergy = "confidence" } = {}) {
  const state = { scene: selectedScene, energy: selectedEnergy };
  return {
    ...structuredClone(energyPageViewModel),
    selectedScene,
    selectedEnergy,
    complete: isSelectionComplete(state),
    validationMessage: validationMessage(state),
    options: energyOptions.map((option) => ({
      ...option,
      selected: option.id === selectedEnergy
    }))
  };
}

export function renderIncompleteSelectionPage({ selectedScene = "work", selectedEnergy = null } = {}) {
  const state = { scene: selectedScene, energy: selectedEnergy };
  return {
    uiId: "UI-04",
    route: "/create/energy",
    sourceReference: energyPageViewModel.incompleteSourceReference,
    stitchReference: energyPageViewModel.incompleteStitchReference,
    statusBar: energyPageViewModel.statusBar,
    header: {
      brand: "AuraCue"
    },
    sceneOptions: [
      { id: "date", label: "Date", icon: "heart", selected: selectedScene === "date" },
      { id: "work", label: "Work / Meeting", shortLabel: "Work", subLabel: null, icon: "briefcase", selected: selectedScene === "work" },
      { id: "party", label: "Party / Social", shortLabel: "Party", subLabel: null, icon: "party", selected: selectedScene === "party" },
      { id: "luck", label: "Just need luck", shortLabel: "Just me", subLabel: "Just need luck", icon: "person", selected: selectedScene === "luck" }
    ],
    energyOptions: combinedEnergyOrder.map((label) => {
      const source = energyOptions.find((option) => option.label === label);
      return { id: source.id, label: source.label, selected: source.id === selectedEnergy };
    }),
    complete: isSelectionComplete(state),
    validationMessage: validationMessage(state),
    primaryCta: energyPageViewModel.primaryCta
  };
}

export async function trackEnergyPageView({ analytics }) {
  return analytics.track("page_view_energy_selection", "/create/energy", {
    uiId: "UI-03",
    requirementId: "REQ-007"
  });
}

export async function clickEnergyOption({ energyId, store, analytics }) {
  const option = energyOptions.find((item) => item.id === energyId);
  if (!option) {
    throw new Error(`Unknown UI-03 energy option: ${energyId}`);
  }

  store.selectEnergy(option.id);
  const analyticsResponse = await analytics.track("select_energy", "/create/energy", {
    uiId: "UI-03",
    controlId: `energy-${option.id}`,
    energy: option.id,
    label: option.label,
    requirementId: "REQ-007"
  });

  return {
    controlId: `energy-${option.id}`,
    label: option.label,
    selectedEnergy: option.id,
    analyticsResponse
  };
}

export async function clickGenerateCard({ store, navigator, apiClient, analytics }) {
  const state = store.getState();
  const message = validationMessage(state);
  if (message) {
    const analyticsResponse = await analytics.track("blocked_generate_incomplete_selection", "/create/energy", {
      uiId: "UI-04",
      controlId: energyPageViewModel.primaryCta.id,
      requirementId: "REQ-006,REQ-007",
      reason: message
    });
    return {
      controlId: energyPageViewModel.primaryCta.id,
      blocked: true,
      validationMessage: message,
      apiCalled: false,
      route: navigator.currentRoute(),
      analyticsResponse
    };
  }

  const job = await apiClient.createGenerationJob({
    scene: state.scene,
    energy: state.energy,
    locale: "en-US",
    source: "UI-03"
  });
  store.setJob(job);

  const analyticsResponse = await analytics.track("click_generate_card", "/create/energy", {
    uiId: "UI-03",
    controlId: energyPageViewModel.primaryCta.id,
    scene: state.scene,
    energy: state.energy,
    jobId: job.jobId,
    requirementId: "REQ-006,REQ-007"
  });
  const route = navigator.navigate(energyPageViewModel.primaryCta.route, {
    jobId: job.jobId ?? shellFixtureIds.jobId
  });

  return {
    controlId: energyPageViewModel.primaryCta.id,
    blocked: false,
    apiCalled: true,
    job,
    route,
    analyticsResponse
  };
}

export function renderEnergyPageHtml(viewModel = renderEnergyPage()) {
  const options = viewModel.options
    .map((option) => `<button class="energy-card${option.selected ? " selected" : ""}" data-energy="${option.id}">
      <span class="energy-icon ${option.id}" aria-label="${option.icon}"></span>
      <span><strong>${option.label}</strong><small>${option.description}</small></span>
      <i>${option.selected ? "check" : ""}</i>
    </button>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-03 Energy Selection</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fbf8f4; color: #10213d; font-family: Inter, Arial, sans-serif; }
    .device { width: 941px; height: 1672px; margin: 0 auto; padding: 58px 58px 0; background: radial-gradient(circle at 50% 20%, #fffdfb 0%, #f5f1eb 100%); overflow: hidden; border-radius: 42px; }
    .status { display: flex; justify-content: space-between; font-size: 28px; font-weight: 700; margin-bottom: 22px; }
    .status-icons { width:164px; height:34px; display:block; position:relative; font-size:0; }
    .status-icons::before { content:""; position:absolute; left:0; top:2px; width:94px; height:30px; background:
      linear-gradient(#050505,#050505) 0 19px/8px 10px no-repeat,
      linear-gradient(#050505,#050505) 14px 14px/8px 15px no-repeat,
      linear-gradient(#050505,#050505) 28px 8px/8px 21px no-repeat,
      linear-gradient(#050505,#050505) 42px 2px/8px 27px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 8px, #050505 9px 13px, transparent 14px) 58px 0/36px 25px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 3px, #050505 4px 7px, transparent 8px) 68px 13px/16px 12px no-repeat; }
    .status-icons::after { content:""; position:absolute; right:0; top:3px; width:53px; height:25px; border:4px solid #050505; border-radius:6px; box-shadow:7px 8px 0 -5px #050505, inset 0 0 0 3px #fff, inset 5px 0 0 3px #050505; }
    .top { position: relative; text-align: center; margin-bottom: 4px; }
    .back { position: absolute; left: 0; top: 0; width: 86px; height: 86px; border-radius: 999px; border: 0; background: white; color: #a68154; font-size: 44px; box-shadow: 0 8px 20px rgba(166,129,84,.08); }
    .brand, h1, .cta { font-family: Georgia, serif; }
    .brand { display: block; font-size: 66px; line-height: 82px; font-weight: 700; }
    .rule { margin: 10px auto 14px; width: 238px; color: #c5a059; border-top: 2px solid rgba(197,160,89,.28); text-align: center; font-size: 26px; }
    .step { display: inline-block; padding: 16px 34px; border: 2px solid rgba(197,160,89,.22); border-radius: 999px; color: #a67c4b; background: rgba(255,255,255,.55); font-size: 24px; }
    h1 { font-size: 62px; line-height: 1.12; text-align: center; margin: 18px 0 18px; }
    .copy { text-align: center; color: #6b7280; line-height: 1.45; margin: 0 0 38px; font-size: 26px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; margin-bottom: 42px; }
    .energy-card { position: relative; min-height: 178px; border: 2px solid transparent; border-radius: 38px; background: rgba(255,255,255,.72); display: flex; align-items: center; gap: 26px; padding: 26px; text-align: left; color: #10213d; box-shadow: 0 8px 20px rgba(0,0,0,.035); }
    .energy-card::after { border: 0; }
    .energy-card.selected { border-color: #e5c284; box-shadow: 0 0 16px rgba(229,194,132,.36); background: white; }
    .energy-icon { width: 86px; height: 86px; border-radius: 999px; background: #fff5ec; color: #c5a059; display: grid; place-items: center; flex: 0 0 86px; font-size: 0; position: relative; }
    .energy-icon.luck, .energy-icon.love { background: #fdeff3; color: #e08ba3; }
    .energy-icon.calm, .energy-icon.focus { background: #f0f3f8; color: #7e8ba4; }
    .energy-icon::before, .energy-icon::after { content: ""; position: absolute; }
    .energy-icon.confidence::before, .energy-icon.charm::before { width: 46px; height: 46px; background: currentColor; clip-path: polygon(50% 0,60% 39%,100% 50%,60% 61%,50% 100%,40% 61%,0 50%,40% 39%); }
    .energy-icon.luck::before { width: 48px; height: 48px; background: radial-gradient(circle at 35% 35%, currentColor 0 25%, transparent 26%), radial-gradient(circle at 65% 35%, currentColor 0 25%, transparent 26%), radial-gradient(circle at 35% 65%, currentColor 0 25%, transparent 26%), radial-gradient(circle at 65% 65%, currentColor 0 25%, transparent 26%); }
    .energy-icon.love::before { width: 44px; height: 40px; background: currentColor; clip-path: path("M22 39 C8 27 0 20 0 10 C0 4 4 0 10 0 C15 0 19 3 22 7 C25 3 29 0 34 0 C40 0 44 4 44 10 C44 20 36 27 22 39 Z"); }
    .energy-icon.calm::before { width: 46px; height: 46px; border-radius: 50%; background: currentColor; }
    .energy-icon.calm::after { width: 44px; height: 44px; border-radius: 50%; background: #f0f3f8; left: 35px; top: 12px; }
    .energy-icon.focus::before { width: 54px; height: 34px; border: 5px solid currentColor; border-radius: 55% 55% 55% 55% / 75% 75% 75% 75%; transform: rotate(-2deg); }
    .energy-icon.focus::after { width: 18px; height: 18px; border-radius: 50%; background: currentColor; left: 34px; top: 34px; }
    strong { display: block; font-family: Georgia, serif; font-size: 34px; line-height: 1.1; margin-bottom: 10px; }
    small { display: block; color: #6b7280; font-size: 19px; line-height: 1.35; }
    i { position: absolute; top: 20px; right: 20px; width: 38px; height: 38px; border-radius: 999px; background: #b68c5e; color: white; font-style: normal; font-size: 0; text-align: center; line-height: 38px; }
    i::before { content: ""; position: absolute; left: 10px; top: 10px; width: 17px; height: 10px; border-left: 4px solid currentColor; border-bottom: 4px solid currentColor; transform: rotate(-45deg); border-radius: 1px; }
    .energy-card:not(.selected) i { display: none; }
    .prompt { border: 2px solid rgba(244,194,205,.55); border-radius: 38px; background: linear-gradient(135deg, rgba(255,241,242,.45), rgba(255,255,255,.84)); padding: 34px 38px; margin-bottom: 40px; }
    .prompt strong { font-size: 30px; }
    .line { margin-top: 24px; border-bottom: 2px solid #e8d6d1; color: #6b7280; font-size: 22px; padding-bottom: 22px; }
    .cta { width: 100%; min-height: 112px; border: 0; border-radius: 999px; color: white; font-size: 40px; background: linear-gradient(180deg,#d4a773 0%,#a67c4b 100%); box-shadow: 0 14px 30px rgba(166,124,75,.22); }
    .trust { display: block; color: #747b87; text-align: center; font-size: 22px; margin-top: 26px; }
  </style>
</head>
<body>
  <main class="device">
    <div class="status"><span>${viewModel.statusBar.time}</span><span class="status-icons">signal wifi battery</span></div>
    <header class="top"><button class="back" aria-label="Back">‹</button><span class="brand">${viewModel.header.brand}</span><div class="rule">✦</div><span class="step">${viewModel.header.step}</span></header>
    <h1>${viewModel.hero.titleLines[0]}<br>${viewModel.hero.titleLines[1]}</h1>
    <p class="copy">${viewModel.hero.subtitleLines[0]}<br>${viewModel.hero.subtitleLines[1]} ✨</p>
    <section class="grid">${options}</section>
    <section class="prompt"><strong>✦ ${viewModel.optionalPrompt.label}</strong><div class="line">${viewModel.optionalPrompt.placeholder}</div></section>
    <button class="cta">✦ ${viewModel.primaryCta.label}</button>
    <span class="trust">${viewModel.trustCopy}</span>
  </main>
</body>
</html>`;
}

export function renderIncompleteSelectionHtml(viewModel = renderIncompleteSelectionPage()) {
  const scenes = viewModel.sceneOptions
    .map((option) => `<button class="scene${option.selected ? " selected" : ""}" data-scene="${option.id}"><span>${option.icon}</span><strong>${option.shortLabel ?? option.label}</strong>${option.subLabel ? `<small>${option.subLabel}</small>` : ""}</button>`)
    .join("");
  const energies = viewModel.energyOptions
    .map((option) => `<button class="chip${option.selected ? " selected" : ""}" data-energy="${option.id}">${option.label}</button>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-04 Incomplete Selection</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #10213d; font-family: Inter, Arial, sans-serif; }
    .device { width: 704px; height: 1516px; margin: 52px auto 0; padding: 64px 38px 0; border: 28px solid #0b0d10; border-radius: 104px; background: linear-gradient(180deg,#fdf8f3 0%,#fdf8f3 72%,#f7dce9 100%); overflow: hidden; box-shadow: 0 0 0 4px #2b2d32, 0 22px 58px rgba(0,0,0,.22); position: relative; }
    .device::before { content: ""; position: absolute; left: 258px; top: 16px; width: 190px; height: 58px; border-radius: 999px; background: #020204; box-shadow: 108px 20px 0 -19px #0d1b3d; z-index: 2; }
    .device::after { content: ""; position: absolute; left: -30px; right: -30px; bottom: -4px; height: 210px; background: radial-gradient(circle at 78% 34%, #f5d879 0 21px, transparent 22px), radial-gradient(circle at 9% 70%, rgba(255,255,255,.92) 0 4px, transparent 5px), radial-gradient(circle at 27% 75%, rgba(255,255,255,.88) 0 5px, transparent 6px), radial-gradient(circle at 65% 68%, rgba(255,255,255,.88) 0 4px, transparent 5px), radial-gradient(circle at 90% 68%, rgba(255,255,255,.80) 0 5px, transparent 6px), radial-gradient(circle at 12% 105%, rgba(255,190,220,.70) 0 90px, transparent 91px), radial-gradient(circle at 24% 105%, rgba(220,190,250,.48) 0 80px, transparent 81px), radial-gradient(circle at 88% 105%, rgba(255,190,220,.70) 0 90px, transparent 91px), radial-gradient(circle at 74% 110%, rgba(220,190,250,.48) 0 82px, transparent 83px); pointer-events:none; }
    .phone-status { position: absolute; left: 90px; right: 72px; top: 38px; height: 32px; display: flex; justify-content: space-between; align-items: center; z-index: 3; color: #050505; font-size: 24px; font-weight: 700; }
    .phone-icons { width:128px; height:26px; display:block; position:relative; font-size:0; }
    .phone-icons::before { content:""; position:absolute; left:0; top:1px; width:72px; height:24px; background:
      linear-gradient(#050505,#050505) 0 16px/6px 8px no-repeat,
      linear-gradient(#050505,#050505) 11px 12px/6px 12px no-repeat,
      linear-gradient(#050505,#050505) 22px 7px/6px 17px no-repeat,
      linear-gradient(#050505,#050505) 33px 2px/6px 22px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 6px, #050505 7px 10px, transparent 11px) 48px 0/27px 20px no-repeat; }
    .phone-icons::after { content:""; position:absolute; right:0; top:2px; width:39px; height:19px; border:3px solid #050505; border-radius:5px; box-shadow:6px 6px 0 -4px #050505, inset 0 0 0 2px #fff, inset 4px 0 0 2px #050505; }
    .top { display: grid; grid-template-columns: 68px 1fr 68px; align-items: center; margin: 34px 0 78px; }
    .back { width: 64px; height: 64px; border-radius: 999px; border: 2px solid #f3c9d8; background: rgba(255,255,255,.68); color: #10213d; font-size: 32px; }
    .brand, h2, .cta { font-family: Georgia, serif; }
    .brand { text-align: center; font-size: 38px; font-weight: 700; }
    h2 { text-align: center; font-size: 36px; margin: 0 0 46px; }
    .scenes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-bottom: 76px; }
    .scene { border: 2px solid #f2c9d4; background: rgba(255,255,255,.52); border-radius: 34px; min-height: 150px; color: #ef5b8c; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 8px; }
    .scene::after, .chip::after, .cta::after { border: 0; }
    .scene.selected { background: linear-gradient(180deg,#ff6b98 0%,#ef3470 100%); color: white; box-shadow: 0 0 22px rgba(239,52,112,.34); }
    .scene span { font-size: 0; width: 48px; height: 48px; display: block; position: relative; color: currentColor; }
    .scene span::before, .scene span::after { content: ""; position: absolute; }
    .scene[data-scene="date"] span::before { width: 42px; height: 38px; left: 3px; top: 5px; background: currentColor; clip-path: path("M21 37 C8 25 0 18 0 9 C0 3 4 0 10 0 C15 0 18 3 21 7 C24 3 27 0 32 0 C38 0 42 3 42 9 C42 18 34 25 21 37 Z"); }
    .scene[data-scene="work"] span::before { width: 42px; height: 30px; left: 3px; top: 15px; border-radius: 5px; background: currentColor; }
    .scene[data-scene="work"] span::after { width: 20px; height: 13px; left: 14px; top: 6px; border: 5px solid currentColor; border-bottom: 0; border-radius: 8px 8px 0 0; }
    .scene[data-scene="party"] span::before { width: 42px; height: 42px; left: 3px; top: 3px; background: currentColor; clip-path: polygon(50% 0,100% 100%,0 100%); }
    .scene[data-scene="luck"] span::before { width: 24px; height: 24px; left: 12px; top: 2px; border-radius: 50%; background: currentColor; }
    .scene[data-scene="luck"] span::after { width: 42px; height: 22px; left: 3px; bottom: 0; border-radius: 22px 22px 5px 5px; background: currentColor; }
    .scene strong { font-size: 25px; font-weight: 600; line-height: 1.05; color:#10213d; }
    .scene.selected strong { color:white; }
    .scene small { font-size: 16px; line-height: 1; color:#10213d; }
    .divider { display: flex; align-items: center; gap: 32px; color: #efb47d; margin-bottom: 64px; font-size: 24px; }
    .divider::before, .divider::after { content: ""; height: 2px; flex: 1; background: #f1d8d4; }
    .chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; margin-bottom: 78px; }
    .chip { height: 72px; border-radius: 999px; border: 2px solid #efc7d2; background: rgba(255,255,255,.48); color: #10213d; font-size: 24px; }
    .validation { margin: 0 30px 42px; min-height: 88px; border-radius: 34px; border: 2px solid #efc7d2; color: #ec3c77; background: rgba(255,255,255,.55); display: flex; align-items: center; justify-content: center; gap: 18px; font-size: 26px; }
    .cta { width: calc(100% - 60px); margin: 0 30px; min-height: 104px; border: 0; border-radius: 999px; color: #88898d; background: #e7e1dd; font-size: 34px; box-shadow: inset 0 2px 6px rgba(0,0,0,.06); }
  </style>
</head>
<body>
  <main class="device">
    <div class="phone-status"><span>9:41</span><span class="phone-icons">icons</span></div>
    <header class="top"><button class="back">‹</button><div class="brand">✦ ${viewModel.header.brand} ✦</div><div></div></header>
    <h2>Choose your scene</h2>
    <section class="scenes">${scenes}</section>
    <div class="divider">✦</div>
    <h2>Choose your energy</h2>
    <section class="chips">${energies}</section>
    <section class="validation">✦ ${viewModel.validationMessage}</section>
    <button class="cta" disabled>✦ ${viewModel.primaryCta.incompleteLabel}</button>
  </main>
</body>
</html>`;
}
