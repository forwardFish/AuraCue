import { shellFixtureIds } from "../../fixtures/shell-fixtures.mjs";

export const networkErrorPageViewModel = {
  uiId: "UI-12",
  route: "/error/network",
  sourceReference: "docs/UI/\u5c0f\u7a0b\u5e8f/P0-11-Error-\u751f\u6210\u5931\u8d25\u91cd\u8bd5.png",
  stitchReference: "docs/UI/\u5c0f\u7a0b\u5e8f/stitch_codex_ui_code_generator/11/code.html",
  viewport: {
    sourceWidth: 941,
    sourceHeight: 1672,
    miniProgramWidth: 390
  },
  header: {
    brand: "AuraCue"
  },
  error: {
    titleLines: ["Your aura slipped away", "for a second."],
    body: "Let's reconnect and try again.",
    safeCopy: true,
    code: "LOCAL_GENERATION_FAILURE"
  },
  actions: {
    retry: {
      id: "try-again",
      label: "Try Again",
      route: "/create/loading"
    },
    changeContext: {
      id: "change-context",
      label: "Change Context",
      route: "/create/context"
    }
  }
};

export function renderNetworkErrorPage({ jobId = shellFixtureIds.failedJobId } = {}) {
  return {
    ...structuredClone(networkErrorPageViewModel),
    jobId,
    apiIds: ["API-001", "API-002"],
    recoveryRoutes: {
      retry: "/create/loading",
      changeContext: "/create/context"
    }
  };
}

export async function trackNetworkErrorPageView({ analytics, jobId = shellFixtureIds.failedJobId }) {
  return analytics.track("page_view_generation_error", "/error/network", {
    uiId: "UI-12",
    jobId,
    requirementId: "REQ-013"
  });
}

export async function clickTryAgain({
  store,
  navigator,
  apiClient,
  analytics,
  scene = "date",
  energy = "confidence"
}) {
  const retryJob = await apiClient.createGenerationJob({
    scene,
    energy,
    locale: "en-US",
    source: "UI-12-retry"
  });
  store.resetError();
  store.setJob(retryJob);

  const analyticsResponse = await analytics.track("click_generation_retry", "/error/network", {
    uiId: "UI-12",
    controlId: networkErrorPageViewModel.actions.retry.id,
    jobId: retryJob.jobId,
    requirementId: "REQ-013"
  });
  const route = navigator.navigate(networkErrorPageViewModel.actions.retry.route, {
    jobId: retryJob.jobId ?? shellFixtureIds.jobId
  });

  return {
    controlId: networkErrorPageViewModel.actions.retry.id,
    apiCalled: true,
    retryJob,
    route,
    analyticsResponse
  };
}

export async function clickChangeContext({ store, navigator, analytics }) {
  store.resetError();
  const analyticsResponse = await analytics.track("click_generation_change_scene", "/error/network", {
    uiId: "UI-12",
    controlId: networkErrorPageViewModel.actions.changeContext.id,
    requirementId: "REQ-013"
  });
  const route = navigator.navigate(networkErrorPageViewModel.actions.changeContext.route);

  return {
    controlId: networkErrorPageViewModel.actions.changeContext.id,
    route,
    analyticsResponse
  };
}

export const clickChangeScene = clickChangeContext;

export function renderNetworkErrorPageHtml(viewModel = renderNetworkErrorPage()) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AuraCue UI-12 Network Error</title>
  <style>
    body { margin: 0; background: #fff3f5; font-family: Inter, system-ui, sans-serif; color: #1b264f; }
    .device { width: 390px; min-height: 844px; margin: 0 auto; box-sizing: border-box; padding: 10px 13px; border-radius: 52px; background: #090909; box-shadow: inset 0 0 0 2px #444, inset 0 0 0 4px #111; position: relative; overflow: hidden; }
    .screen { position: relative; width: 100%; min-height: 824px; margin: 0 auto; padding: 20px 28px 34px; box-sizing: border-box; overflow: hidden; border-radius: 42px; background: radial-gradient(circle at 80% 20%, rgba(255,255,255,.7), transparent 12%), radial-gradient(circle at 20% 90%, rgba(255,220,227,.72), transparent 18%), linear-gradient(180deg,#fdecf0 0%,#fff4e3 40%,#fdecf0 70%,#f5d3de 100%); }
    .notch { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 92px; height: 29px; border-radius: 999px; background: #050505; z-index: 5; }
    .status { height: 34px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px 0 20px; color: #05050a; font-weight: 800; font-size: 15px; }
    .status-icons { width: 62px; height: 14px; background: linear-gradient(90deg,#111 0 8px,transparent 8px 13px,#111 13px 22px,transparent 22px 28px,#111 28px 38px,transparent 38px 44px,#111 44px 62px); border-radius: 2px; opacity: .9; }
    header { position: relative; display: flex; align-items: center; justify-content: center; min-height: 42px; margin-top: 12px; }
    .close { position: absolute; left: 0; width: 40px; height: 40px; border-radius: 999px; border: 1px solid rgba(255,255,255,.55); background: rgba(255,255,255,.55); color: transparent; font-size: 0; }
    .close::before,.close::after { content: ""; position: absolute; left: 11px; right: 11px; top: 19px; height: 2px; background: #6f6d88; transform: rotate(45deg); }
    .close::after { transform: rotate(-45deg); }
    .brand { font-family: Georgia, serif; color: #e5b76c; font-size: 26px; font-weight: 700; }
    .hero { position: relative; display: grid; place-items: center; min-height: 294px; margin-top: 52px; }
    .glow { position: absolute; width: 270px; height: 270px; border-radius: 50%; background: rgba(255,220,227,.4); filter: blur(28px); }
    .card { position: relative; width: 126px; height: 176px; border-radius: 14px; transform: rotate(5deg); background: rgba(255,255,255,.62); border: 1px solid rgba(255,142,154,.6); box-shadow: 0 20px 40px rgba(255,180,195,.3); display: grid; place-items: center; color: #ffc3ca; font-size: 48px; }
    .card::after { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(255,220,227,.72); border-radius: 13px; }
    .cloud { position: absolute; bottom: 44px; width: 226px; height: 74px; border-radius: 90px 90px 34px 34px; background: rgba(255,255,255,.64); filter: drop-shadow(0 10px 20px rgba(255,180,195,.16)); }
    .badge { position: absolute; right: 64px; bottom: 66px; width: 54px; height: 42px; border-radius: 24px; background: #ff7489; border: 2px solid white; color: white; display: grid; place-items: center; font-size: 28px; font-weight: 700; }
    .copy { position: relative; z-index: 1; text-align: center; margin: 42px 0 52px; }
    h1 { font-family: Georgia, serif; font-size: 29px; line-height: 1.22; margin: 0 0 18px; font-weight: 700; color: #17234c; }
    p { color: #66637e; font-size: 15px; margin: 0; font-weight: 600; }
    .actions { position: relative; z-index: 1; display: grid; gap: 16px; }
    button { height: 54px; border-radius: 999px; font-size: 17px; }
    .retry { border: 1px solid rgba(255,255,255,.35); color: white; font: 700 18px Georgia, serif; background: linear-gradient(90deg,#ff4f91 0%,#ff337d 100%); box-shadow: 0 8px 24px -6px rgba(255,92,141,.4); }
    .change { border: 1px solid #f2aec0; color: #1b264f; background: rgba(255,255,255,.42); font-weight: 700; }
  </style>
</head>
<body>
  <div class="phone device"><div class="notch"></div><main class="screen">
    <div class="status"><span>9:41</span><span class="status-icons"></span></div>
    <header><button class="close">x</button><div class="brand">✦ ${viewModel.header.brand} ✦</div></header>
    <section class="hero"><div class="glow"></div><div class="card">☾</div><div class="cloud"></div><div class="badge">!</div></section>
    <section class="copy"><h1>${viewModel.error.titleLines[0]}<br>${viewModel.error.titleLines[1]}</h1><p>${viewModel.error.body}</p></section>
    <section class="actions"><button class="retry">${viewModel.actions.retry.label}</button><button class="change">${viewModel.actions.changeContext.label}</button></section>
  </main></div>
</body>
</html>`;
}
