export const sceneOptions = [
  {
    id: "date",
    label: "Date",
    icon: "heart",
    description: "Romantic, magnetic & heart-open."
  },
  {
    id: "work",
    label: "Work / Meeting",
    icon: "briefcase",
    description: "Confident, focused & respected."
  },
  {
    id: "party",
    label: "Party / Social",
    icon: "party",
    description: "Radiant, fun & unforgettable."
  },
  {
    id: "luck",
    label: "Just need luck",
    icon: "clover",
    description: "Lucky, aligned & open to magic."
  }
];

const visualSceneOptions = [
  sceneOptions[0],
  sceneOptions[1],
  sceneOptions[2],
  {
    id: "interview",
    label: "Interview",
    icon: "clipboard",
    description: "Poised, prepared & impressive.",
    visualOnly: true
  },
  {
    id: "travel",
    label: "Travel",
    icon: "suitcase",
    description: "Protected, aligned & adventure-ready.",
    visualOnly: true
  },
  sceneOptions[3]
];

export const scenePageViewModel = {
  uiId: "UI-02",
  route: "/create/scene",
  sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/02-\u9009\u62e9_\u51fa\u95e8\u573a\u666f.png",
  stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/02/code.html",
  viewport: {
    sourceWidth: 941,
    sourceHeight: 1672,
    miniProgramWidth: 390
  },
  statusBar: {
    time: "9:41"
  },
  header: {
    step: "Step 1 of 2"
  },
  hero: {
    titleLines: ["Where are you", "going today?"],
    subtitleLines: ["Choose the scene that fits your plans", "so we can tune your aura just right."]
  },
  options: sceneOptions,
  primaryCta: {
    id: "continue-scene",
    label: "Continue",
    disabledLabel: "Choose a scene to continue.",
    route: "/create/energy"
  }
};

export function renderScenePage({ selectedScene = "date" } = {}) {
  return {
    ...structuredClone(scenePageViewModel),
    selectedScene,
    canContinue: Boolean(selectedScene),
    options: sceneOptions.map((option) => ({
      ...option,
      selected: option.id === selectedScene
    }))
  };
}

export async function trackScenePageView({ analytics }) {
  return analytics.track("page_view_scene_selection", "/create/scene", {
    uiId: "UI-02",
    requirementId: "REQ-006"
  });
}

export async function clickSceneOption({ sceneId, store, analytics }) {
  const option = sceneOptions.find((item) => item.id === sceneId);
  if (!option) {
    throw new Error(`Unknown UI-02 scene option: ${sceneId}`);
  }

  store.selectScene(option.id);
  const analyticsResponse = await analytics.track("select_scene", "/create/scene", {
    uiId: "UI-02",
    controlId: `scene-${option.id}`,
    scene: option.id,
    label: option.label,
    requirementId: "REQ-006"
  });

  return {
    controlId: `scene-${option.id}`,
    label: option.label,
    selectedScene: option.id,
    analyticsResponse
  };
}

export async function clickSceneContinue({ store, navigator, analytics }) {
  const state = store.getState();
  if (!state.scene) {
    const analyticsResponse = await analytics.track("blocked_continue_scene", "/create/scene", {
      uiId: "UI-02",
      controlId: scenePageViewModel.primaryCta.id,
      requirementId: "REQ-006",
      reason: "missing-scene"
    });
    return {
      controlId: scenePageViewModel.primaryCta.id,
      blocked: true,
      reason: "missing-scene",
      route: navigator.currentRoute(),
      analyticsResponse
    };
  }

  const analyticsResponse = await analytics.track("click_scene_continue", "/create/scene", {
    uiId: "UI-02",
    controlId: scenePageViewModel.primaryCta.id,
    scene: state.scene,
    requirementId: "REQ-006"
  });
  const route = navigator.navigate(scenePageViewModel.primaryCta.route);

  return {
    controlId: scenePageViewModel.primaryCta.id,
    blocked: false,
    selectedScene: state.scene,
    route,
    analyticsResponse
  };
}

export function renderScenePageHtml(viewModel = renderScenePage()) {
  const options = visualSceneOptions
    .map((option) => ({
      ...option,
      selected: option.id === viewModel.selectedScene
    }))
    .map((option) => `<button class="scene-card${option.selected ? " selected" : ""}" data-scene="${option.id}">
      <span class="scene-check"></span>
      <span class="scene-art ${option.id}"><span class="scene-illustration ${option.id}"></span></span>
      <strong>${option.label}</strong>
      <small>${option.description}</small>
    </button>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-02 Scene Selection</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fbf6f0; color: #10213d; font-family: Inter, Arial, sans-serif; }
    .device { width: 941px; height: 1672px; margin: 0 auto; padding: 36px 50px 0; background: radial-gradient(circle at top, #fffaf5 0%, #f8f1e9 100%); overflow: hidden; position: relative; }
    .status { display: flex; justify-content: space-between; font-size: 32px; font-weight: 800; margin-bottom: 34px; padding: 0 0 0 36px; color: #050505; }
    .status-icons { width:164px; height:34px; display:block; position:relative; font-size:0; }
    .status-icons::before { content:""; position:absolute; left:0; top:2px; width:94px; height:30px; background:
      linear-gradient(#050505,#050505) 0 19px/8px 10px no-repeat,
      linear-gradient(#050505,#050505) 14px 14px/8px 15px no-repeat,
      linear-gradient(#050505,#050505) 28px 8px/8px 21px no-repeat,
      linear-gradient(#050505,#050505) 42px 2px/8px 27px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 8px, #050505 9px 13px, transparent 14px) 58px 0/36px 25px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 3px, #050505 4px 7px, transparent 8px) 68px 13px/16px 12px no-repeat; }
    .status-icons::after { content:""; position:absolute; right:0; top:3px; width:53px; height:25px; border:4px solid #050505; border-radius:6px; box-shadow:7px 8px 0 -5px #050505, inset 0 0 0 3px #fff, inset 5px 0 0 3px #050505; }
    .top { display: grid; grid-template-columns: 96px 1fr 96px; align-items: center; margin-bottom: 28px; }
    .back { width: 90px; height: 90px; border-radius: 999px; border: 0; background: white; color: #a68154; font-size: 0; box-shadow: 0 8px 28px rgba(166,129,84,.10); position: relative; }
    .back::before { content: ""; position: absolute; width: 28px; height: 28px; border-left: 6px solid currentColor; border-bottom: 6px solid currentColor; transform: rotate(45deg); left: 34px; top: 30px; border-radius: 2px; }
    .step { text-align: center; color: #c79a62; font-size: 30px; font-weight: 600; display:flex; align-items:center; justify-content:center; gap:18px; }
    .mini-spark { width:28px; height:28px; display:inline-block; background:currentColor; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.8; }
    h1 { font-family: Georgia, serif; font-size: 70px; line-height: 1.06; text-align: center; margin: 0 0 28px; font-weight: 700; }
    .copy { color: #6b7280; text-align: center; line-height: 1.45; margin: 0 0 32px; font-size: 28px; }
    .copy-heart { color:#ee91a1; font-weight:700; }
    .hero-spark { position:absolute; right:155px; top:274px; width:42px; height:42px; background:#d6a96f; opacity:.66; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); }
    .hero-spark.small { right:116px; top:330px; width:28px; height:28px; opacity:.42; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-bottom: 94px; }
    .scene-card { position: relative; min-height: 446px; border: 2px solid #f4ece5; border-radius: 28px; background: rgba(255,255,255,.74); padding: 28px 18px 24px; color: #10213d; box-shadow: 0 12px 28px rgba(0,0,0,.035); text-align: center; }
    .scene-card::after { border: 0; }
    .scene-card.selected { border: 3px solid #e2b879; background: #fff8f3; }
    .scene-check { position: absolute; top: 22px; right: 20px; width: 58px; height: 58px; border-radius: 999px; background: linear-gradient(135deg,#e1bd84,#a77b49); z-index: 2; box-shadow: 0 6px 12px rgba(166,124,75,.16); }
    .scene-check::before { content: ""; position: absolute; width: 24px; height: 13px; border-left: 7px solid white; border-bottom: 7px solid white; transform: rotate(-45deg); left: 17px; top: 17px; border-radius: 2px; }
    .scene-card:not(.selected) .scene-check { display: none; }
    .scene-art { width: 176px; height: 226px; margin: 14px auto 28px; border-radius: 88px 88px 14px 14px; border: 3px solid #f4e1d8; background: radial-gradient(circle at 50% 28%,rgba(255,255,255,.72) 0 10%,transparent 11%), radial-gradient(circle at 70% 22%,rgba(212,161,95,.34) 0 3px,transparent 4px), radial-gradient(circle at 28% 36%,rgba(212,161,95,.25) 0 3px,transparent 4px), linear-gradient(180deg,#fff3f4,#fde4e6); display: grid; place-items: center; color: #c4945c; overflow: hidden; position: relative; box-shadow: inset 0 0 22px rgba(197,132,130,.12), 0 6px 14px rgba(0,0,0,.04); }
    .scene-art.work { background: #f2f4f7; }
    .scene-art.party { background: #fde8e8; }
    .scene-art.interview, .scene-art.travel { background: #f5f1ec; }
    .scene-art.luck { background: linear-gradient(180deg,#fff4ef,#ffe5e9); }
    .scene-illustration { width: 104px; height: 118px; position: relative; display: block; }
    .scene-illustration::before, .scene-illustration::after { content: ""; position: absolute; }
    .scene-illustration.date::before { width: 76px; height: 76px; left: 14px; top: 18px; border-radius: 50% 50% 46% 46%; background: radial-gradient(circle at 50% 38%,#f2a9b4 0 26%,#d97d8b 27% 34%,transparent 35%), radial-gradient(circle at 34% 42%,#f8c6cc 0 22%,transparent 23%), radial-gradient(circle at 66% 42%,#f8c6cc 0 22%,transparent 23%); box-shadow: 0 0 22px rgba(218,124,139,.24); }
    .scene-illustration.date::after { width: 8px; height: 82px; left: 49px; top: 74px; background: #b88d42; border-radius: 99px; box-shadow: -28px -6px 0 -1px #d6bc80,28px -5px 0 -1px #d6bc80; transform: rotate(-2deg); }
    .scene-illustration.work::before { width: 96px; height: 60px; left: 4px; top: 56px; border-radius: 10px; background: linear-gradient(#c8cbd1,#8e929a); box-shadow: 0 24px 0 -16px #d5c8b9; }
    .scene-illustration.work::after { width: 34px; height: 34px; left: 35px; top: 16px; background: #d1a15e; clip-path: polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%); }
    .scene-illustration.party::before { width: 30px; height: 104px; left: 22px; top: 28px; border-radius: 18px 18px 6px 6px; background: linear-gradient(#ffd5d8,#ef9fac); transform: rotate(-16deg); box-shadow: 48px 13px 0 -1px #f1a9b4; }
    .scene-illustration.party::after { width: 74px; height: 22px; left: 15px; top: 126px; border-bottom: 4px solid #d29c68; transform: rotate(0deg); }
    .scene-illustration.interview::before { width: 74px; height: 96px; left: 15px; top: 28px; border-radius: 8px; background: #fff; box-shadow: 0 0 0 3px #e9ddd2 inset,0 0 0 18px rgba(255,255,255,.28); }
    .scene-illustration.interview::after { width: 46px; height: 8px; left: 29px; top: 58px; background: #d7c8b7; box-shadow: 0 24px 0 #d7c8b7,0 48px 0 #d7c8b7,52px 36px 0 -1px #8fa0b5; transform: rotate(-3deg); }
    .scene-illustration.travel::before { width: 82px; height: 102px; left: 12px; top: 32px; border-radius: 12px; background: linear-gradient(90deg,#9aa8bc,#cfd7e2); box-shadow: inset 0 0 0 4px #8d9bae; }
    .scene-illustration.travel::after { width: 46px; height: 30px; left: 30px; top: 10px; border: 6px solid #8d9bae; border-bottom: 0; border-radius: 18px 18px 0 0; }
    .scene-illustration.luck::before { width: 86px; height: 86px; left: 9px; top: 30px; background: radial-gradient(circle at 35% 35%,#d9a55e 0 16%,transparent 17%), radial-gradient(circle at 65% 35%,#d9a55e 0 16%,transparent 17%), radial-gradient(circle at 35% 65%,#d9a55e 0 16%,transparent 17%), radial-gradient(circle at 65% 65%,#d9a55e 0 16%,transparent 17%); }
    .scene-illustration.luck::after { width: 8px; height: 58px; left: 53px; top: 90px; background: #b58b43; transform: rotate(26deg); border-radius: 99px; }
    strong { display: block; font-family: Georgia, serif; font-size: 32px; line-height: 1.1; margin-bottom: 18px; }
    small { display: block; color: #5f6673; font-size: 22px; line-height: 1.32; }
    .cta { width: calc(100% - 124px); min-height: 112px; border: 0; border-radius: 999px; color: white; font-family: Georgia, serif; font-size: 42px; background: linear-gradient(90deg,#d9ad75 0%,#a67c4b 100%); box-shadow: 0 14px 30px rgba(166,124,75,.22); position: absolute; left: 62px; bottom: 64px; display:flex; align-items:center; justify-content:center; gap:30px; }
    .cta::before { content:""; width:36px; height:36px; background:white; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.9; }
  </style>
</head>
<body>
  <main class="device">
    <div class="status"><span>${viewModel.statusBar.time}</span><span class="status-icons">signal wifi battery</span></div>
    <header class="top"><button class="back" aria-label="Back"></button><div class="step"><span class="mini-spark"></span>${viewModel.header.step}<span class="mini-spark"></span></div><div></div></header>
    <h1>${viewModel.hero.titleLines[0]}<br>${viewModel.hero.titleLines[1]}</h1>
    <span class="hero-spark"></span><span class="hero-spark small"></span>
    <p class="copy">${viewModel.hero.subtitleLines[0]}<br>${viewModel.hero.subtitleLines[1]} <span class="copy-heart">&#x1F496;</span></p>
    <section class="grid">${options}</section>
    <button class="cta">${viewModel.primaryCta.label}</button>
  </main>
</body>
</html>`;
}
