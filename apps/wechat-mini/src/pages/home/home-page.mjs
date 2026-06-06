export const homeSceneShortcuts = [
  {
    id: "date",
    label: "Date",
    icon: "heart",
    route: "/create/scene"
  },
  {
    id: "work",
    label: "Work",
    icon: "briefcase",
    route: "/create/scene"
  },
  {
    id: "party",
    label: "Party",
    icon: "map",
    route: "/create/scene"
  },
  {
    id: "luck",
    label: "Just need luck",
    icon: "sparkle",
    route: "/create/scene"
  }
];

export const homePageViewModel = {
  uiId: "UI-01",
  route: "/",
  sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/01-\u8fdb\u5165_\u9996\u9875\u751f\u6210\u5165\u53e3.png",
  stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/01/code.html",
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
    leftIcon: "sparkle",
    rightIcon: "gift"
  },
  hero: {
    titleLines: ["Before you step out,", "draw today's tiny advantage."],
    emphasizedText: "tiny advantage.",
    subtitleLines: ["Pick your scene. Get one color,", "one outfit energy, one social move."]
  },
  auraCard: {
    eyebrow: "Today's Aura",
    title: "Golden Bloom",
    frameShape: "rounded-arch",
    luckyColor: {
      label: "Lucky Color",
      value: "Blush Pink",
      swatch: "#F6C9D2"
    },
    outfitEnergy: {
      label: "Outfit Energy",
      value: "Soft Power"
    },
    socialMove: {
      label: "Social Move",
      value: "Listen first, connect deeper."
    }
  },
  shortcuts: homeSceneShortcuts,
  primaryCta: {
    id: "start-card",
    label: "Start My 30-Second Card",
    route: "/create/scene"
  },
  trustCopy: "Private. Personal. Just for you.",
  bottomNav: {
    active: "Home",
    disabled: "Profile"
  }
};

export function renderHomePage() {
  return structuredClone(homePageViewModel);
}

export async function trackHomePageView({ analytics }) {
  return analytics.track("page_view_home", "/", { uiId: "UI-01", requirementId: "REQ-004" });
}

export async function clickHomeSceneShortcut({ sceneId, store, navigator, analytics }) {
  const shortcut = homeSceneShortcuts.find((item) => item.id === sceneId);
  if (!shortcut) {
    throw new Error(`Unknown UI-01 scene shortcut: ${sceneId}`);
  }

  store.selectScene(shortcut.id);
  const analyticsResponse = await analytics.track("click_generate_start", "/", {
    uiId: "UI-01",
    controlId: `scene-${shortcut.id}`,
    scene: shortcut.id,
    requirementId: "REQ-004"
  });
  const route = navigator.navigate(shortcut.route);

  return {
    controlId: `scene-${shortcut.id}`,
    label: shortcut.label,
    selectedScene: shortcut.id,
    route,
    analyticsResponse
  };
}

export async function clickHomePrimaryCta({ navigator, analytics }) {
  const analyticsResponse = await analytics.track("click_generate_start", "/", {
    uiId: "UI-01",
    controlId: homePageViewModel.primaryCta.id,
    requirementId: "REQ-004"
  });
  const route = navigator.navigate(homePageViewModel.primaryCta.route);

  return {
    controlId: homePageViewModel.primaryCta.id,
    label: homePageViewModel.primaryCta.label,
    route,
    analyticsResponse
  };
}

export function renderHomePageHtml(viewModel = homePageViewModel) {
  const shortcuts = viewModel.shortcuts
    .map((shortcut) => `<button class="shortcut" data-scene="${shortcut.id}"><span class="line-icon ${shortcut.id}"></span><span>${shortcut.label}</span></button>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-01 Home</title>
  <style>
    :root { --bg:#FCF9F6; --ink:#102243; --accent:#C58482; --gold:#D4AF37; --border:#F1E1D1; }
    * { box-sizing: border-box; }
    html, body { margin:0; width:941px; height:1672px; overflow:hidden; background:#000; color:var(--ink); font-family: Inter, Arial, sans-serif; }
    .device { width:941px; height:1672px; border-radius:62px; overflow:hidden; background:radial-gradient(circle at 50% 30%, #fff 0%, #fcf9f6 62%, #fbf7f1 100%); display:flex; flex-direction:column; }
    .status { height:84px; padding:0 86px 18px; display:flex; align-items:flex-end; justify-content:space-between; color:#050505; font-size:34px; font-weight:800; }
    .status-icons { width:164px; height:34px; display:block; position:relative; font-size:0; }
    .status-icons::before { content:""; position:absolute; left:0; top:2px; width:94px; height:30px; background:
      linear-gradient(#050505,#050505) 0 19px/8px 10px no-repeat,
      linear-gradient(#050505,#050505) 14px 14px/8px 15px no-repeat,
      linear-gradient(#050505,#050505) 28px 8px/8px 21px no-repeat,
      linear-gradient(#050505,#050505) 42px 2px/8px 27px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 8px, #050505 9px 13px, transparent 14px) 58px 0/36px 25px no-repeat,
      radial-gradient(ellipse at 50% 100%, transparent 0 3px, #050505 4px 7px, transparent 8px) 68px 13px/16px 12px no-repeat; }
    .status-icons::after { content:""; position:absolute; right:0; top:3px; width:53px; height:25px; border:4px solid #050505; border-radius:6px; box-shadow:7px 8px 0 -5px #050505, inset 0 0 0 3px #fff, inset 5px 0 0 3px #050505; }
    .header { display:flex; align-items:center; justify-content:space-between; padding:28px 52px 0; }
    .brand, .hero h1, .card h2, .cta, .shortcut, .stat span { font-family: Georgia, "Times New Roman", serif; }
    .brand { font-size:58px; line-height:1; font-weight:500; letter-spacing:-1px; }
    .round { width:78px; height:78px; border-radius:999px; border:1px solid #fff1e6; background:rgba(255,255,255,.92); display:grid; place-items:center; color:#c99649; box-shadow:0 8px 24px rgba(0,0,0,.05); font-size:0; }
    .round::before, .round::after { content:""; position:absolute; display:block; }
    .round { position:relative; }
    .round:first-child::before { width:42px; height:42px; background:currentColor; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.88; }
    .round:last-child::before { width:34px; height:31px; left:22px; top:35px; border-radius:4px; background:currentColor; box-shadow:inset 14px 0 0 rgba(255,255,255,.52); }
    .round:last-child::after { width:42px; height:11px; left:18px; top:27px; border-radius:4px; background:currentColor; box-shadow:12px -13px 0 -7px currentColor,-12px -13px 0 -7px currentColor; }
    main { flex:1; padding:42px 76px 0; }
    .hero { text-align:center; margin-bottom:20px; position:relative; }
    .hero::before { content:""; width:34px; height:34px; background:var(--gold); clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.75; position:absolute; top:-44px; left:50%; transform:translateX(-50%); }
    .hero h1 { font-size:62px; line-height:1.14; margin:0 0 18px; font-weight:500; letter-spacing:-.5px; }
    .hero em { color:var(--accent); font-style:italic; }
    .hero p { color:#737884; font-size:27px; line-height:1.38; margin:0; }
    .card { width:560px; margin:0 auto 46px; padding:36px 34px 34px; position:relative; text-align:center; background:rgba(255,255,255,.76); border:2px solid #d5a45b; border-radius:28px; box-shadow:0 18px 46px -20px rgba(197,132,130,.20); }
    .card::before, .card::after { content:""; position:absolute; width:24px; height:24px; background:var(--gold); clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.72; top:18px; }
    .card::before { left:18px; } .card::after { right:18px; }
    .eyebrow { margin:0 0 10px; color:#c48b36; font-size:22px; text-transform:uppercase; letter-spacing:5px; font-weight:700; }
    .card h2 { margin:0 0 28px; font-size:46px; font-weight:500; color:#080808; }
    .arch { width:300px; height:392px; margin:0 auto 34px; border:2px solid #d4a05f; border-radius:150px 150px 10px 10px; background:radial-gradient(circle at 50% 78%, rgba(255,255,255,.95) 0 7%, transparent 8%), linear-gradient(180deg,#fff7ef 0%,#fff1f4 68%,#efb8bd 100%); display:flex; align-items:end; justify-content:center; overflow:hidden; position:relative; }
    .arch::before { content:""; position:absolute; top:46px; width:44px; height:44px; border-radius:50%; background:#e9c8aa; box-shadow:24px 0 0 0 #fff8f2; opacity:.95; }
    .arch::after { content:""; position:absolute; bottom:0; width:100%; height:108px; background:linear-gradient(180deg,rgba(246,201,210,.12),rgba(231,139,151,.50)); }
    .flower { width:104px; height:214px; margin-bottom:82px; border-radius:56px 56px 18px 18px; background:radial-gradient(ellipse at 50% 24%, #fff2f6 0 17%, #f9d7dd 18% 27%, #f8c6cf 28% 42%, #e9aeb9 43% 58%, transparent 59%), radial-gradient(ellipse at 34% 30%, #ffe6eb 0 16%, transparent 17%), radial-gradient(ellipse at 66% 30%, #ffe6eb 0 16%, transparent 17%), linear-gradient(90deg,transparent 43%,#d5a05e 44% 47%,#8fa064 48% 54%,transparent 55%); box-shadow:0 0 60px rgba(246,201,210,.88); position:relative; z-index:1; }
    .flower::before, .flower::after { content:""; position:absolute; width:86px; height:22px; border-radius:50%; background:#d1b47d; bottom:68px; opacity:.48; }
    .flower::before { transform:rotate(-58deg); left:-46px; } .flower::after { transform:rotate(58deg); right:-46px; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid var(--border); padding-top:26px; }
    .stat { min-height:96px; border-right:1px solid var(--border); padding:0 14px; }
    .stat:last-child { border-right:0; }
    .stat strong { display:block; color:#c48b36; text-transform:uppercase; font-size:16px; margin:8px 0 8px; }
    .stat span { display:block; color:#080808; font-size:22px; line-height:1.16; }
    .swatch { width:46px; height:46px; margin:0 auto 8px; border-radius:999px; background:#f6c9d2; }
    .shortcuts { display:grid; grid-template-columns:repeat(4,1fr); gap:22px; margin-bottom:22px; }
    .shortcut { height:98px; border:1px solid var(--border); background:rgba(255,255,255,.92); border-radius:30px; color:#111827; display:flex; align-items:center; justify-content:center; gap:12px; padding:0 18px; font-size:26px; font-weight:500; box-shadow:0 8px 22px rgba(0,0,0,.035); }
    .shortcut:last-child { font-size:22px; line-height:1.05; }
    .line-icon { width:42px; height:42px; color:var(--accent); display:block; position:relative; flex:0 0 42px; }
    .line-icon::before, .line-icon::after { content:""; position:absolute; display:block; }
    .line-icon.date::before { width:34px; height:31px; left:4px; top:6px; background:currentColor; clip-path:path("M17 31 C6 21 0 15 0 8 C0 3 3 0 8 0 C12 0 15 2 17 6 C19 2 22 0 26 0 C31 0 34 3 34 8 C34 15 28 21 17 31 Z"); }
    .line-icon.work::before { width:36px; height:25px; left:3px; top:15px; border:5px solid currentColor; border-radius:5px; }
    .line-icon.work::after { width:18px; height:12px; left:12px; top:6px; border:5px solid currentColor; border-bottom:0; border-radius:8px 8px 0 0; }
    .line-icon.party::before { width:34px; height:34px; left:4px; top:5px; border:5px solid currentColor; border-top:0; transform:perspective(30px) rotateX(20deg); clip-path:polygon(18% 0,82% 0,100% 100%,0 100%); }
    .line-icon.luck::before { width:42px; height:42px; background:currentColor; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); }
    .cta { width:100%; min-height:98px; border:0; border-radius:30px; color:white; font-size:38px; line-height:1.15; background:linear-gradient(90deg,#df8c8c,#cf7776); box-shadow:0 24px 40px rgba(197,110,105,.20); display:flex; align-items:center; justify-content:space-around; padding:0 70px; }
    .cta::before, .cta::after { content:""; width:30px; height:30px; background:white; clip-path:polygon(50% 0,60% 38%,100% 50%,60% 62%,50% 100%,40% 62%,0 50%,40% 38%); opacity:.82; }
    .trust { text-align:center; color:#8c949f; font-size:22px; margin-top:24px; }
    footer { height:126px; border-top:1px solid var(--border); background:rgba(255,255,255,.82); display:flex; align-items:center; justify-content:center; gap:310px; font-size:22px; color:#c0813d; }
    footer .muted { color:#8c949f; }
  </style>
</head>
<body>
  <div class="device">
    <div class="status"><strong>${viewModel.statusBar.time}</strong><span class="status-icons">icons</span></div>
    <header class="header"><div class="round" aria-label="spark"></div><div class="brand">${viewModel.header.brand}</div><div class="round" aria-label="gift"></div></header>
    <main>
      <section class="hero">
        <h1>${viewModel.hero.titleLines[0]}<br>draw today's <em>tiny advantage.</em></h1>
        <p>${viewModel.hero.subtitleLines[0]}<br>${viewModel.hero.subtitleLines[1]}</p>
      </section>
      <section class="card">
        <p class="eyebrow">${viewModel.auraCard.eyebrow}</p>
        <h2>${viewModel.auraCard.title}</h2>
        <div class="arch"><div class="flower"></div></div>
        <div class="stats">
          <div class="stat"><div class="swatch"></div><strong>${viewModel.auraCard.luckyColor.label}</strong><span>${viewModel.auraCard.luckyColor.value}</span></div>
          <div class="stat"><strong>${viewModel.auraCard.outfitEnergy.label}</strong><span>${viewModel.auraCard.outfitEnergy.value}</span></div>
          <div class="stat"><strong>${viewModel.auraCard.socialMove.label}</strong><span>Listen first,<br>connect deeper.</span></div>
        </div>
      </section>
      <section class="shortcuts">${shortcuts}</section>
      <button class="cta">${viewModel.primaryCta.label}</button>
      <div class="trust">${viewModel.trustCopy}</div>
    </main>
    <footer><strong>Home</strong><span class="muted">Profile</span></footer>
  </div>
</body>
</html>`;
}
