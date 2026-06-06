import crypto from "node:crypto";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const docsRoot = path.join(repoRoot, "docs", "auto-execute");
const taskRoot = path.join(docsRoot, "screenshots", "web", "T15");
const out = {
  reference: path.join(taskRoot, "reference"),
  actual: path.join(taskRoot, "actual"),
  diff: path.join(taskRoot, "diff"),
  metrics: path.join(taskRoot, "metrics"),
  logs: path.join(docsRoot, "logs", "web"),
  results: path.join(docsRoot, "results", "web"),
  latest: path.join(docsRoot, "latest", "web")
};

const cases = [
  {
    id: "UI-001",
    route: "/",
    state: "home no active card",
    reference: ["docs", "UI", "小程序", "P0-01-Mood-首页选择今日状态.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "01-home.png"]
  },
  {
    id: "UI-002",
    route: "/create/context",
    state: "context selected",
    reference: ["docs", "UI", "小程序", "P0-02-Context-可选今日上下文.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "02-context.png"]
  },
  {
    id: "UI-003",
    route: "/create/upload",
    state: "upload success",
    reference: ["docs", "UI", "小程序", "P0-03-Outfit-可选穿搭上传.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "03-upload.png"]
  },
  {
    id: "UI-004",
    route: "/create/draw",
    state: "three-card draw",
    reference: ["docs", "UI", "小程序", "P0-04-Draw-三卡选择.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "04-draw.png"]
  },
  {
    id: "UI-005",
    route: "/result/[id]",
    state: "result loaded",
    reference: ["docs", "UI", "小程序", "P0-06-Result-完整气场卡结果.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "05-result.png"]
  },
  {
    id: "UI-006",
    route: "/activate/[id]",
    state: "activation ready",
    reference: ["docs", "UI", "小程序", "P0-07-Activate-选择锚点并长按封存.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "06-activate.png"]
  },
  {
    id: "UI-007",
    route: "/activated/[id]",
    state: "activated",
    reference: ["docs", "UI", "小程序", "P0-08-Activated-气场已激活成功.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "07-activated.png"]
  },
  {
    id: "UI-008",
    route: "/share/[id]",
    state: "share preview",
    reference: ["docs", "UI", "小程序", "P0-09-Share-Story卡预览与保存.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "08-share.png"]
  },
  {
    id: "UI-009",
    route: "/saved/[id]",
    state: "saved success",
    reference: ["docs", "UI", "小程序", "P0-10-Saved-保存成功反馈.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "09-saved.png"]
  },
  {
    id: "UI-010",
    route: "/create/upload",
    state: "visible upload error",
    reference: ["docs", "UI", "小程序", "P0-11-Error-生成失败重试.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T14", "owner-click-e2e", "owner-upload-failure-upload-failure-ui.png"]
  }
];

const commandLog = [];

main().catch(async (error) => {
  await fs.mkdir(out.logs, { recursive: true });
  await fs.writeFile(
    path.join(out.logs, "T15-command-log.md"),
    `# T15 Command Log\n\nVerdict: FAIL\n\n- FAIL: \`pnpm --filter @auracue/web test:visual\`\n\n\`\`\`text\n${String(error?.stack || error)}\n\`\`\`\n`
  );
  console.error(error);
  process.exit(1);
});

async function main() {
  await ensureDirs();
  const browser = await findBrowser();
  const metrics = [];
  for (const item of cases) {
    const referenceSource = path.join(repoRoot, ...item.reference);
    const actualSource = path.join(repoRoot, ...item.actual);
    await mustExist(referenceSource);
    await mustExist(actualSource);

    const referenceTarget = path.join(out.reference, `${item.id}.png`);
    const actualTarget = path.join(out.actual, `${item.id}.png`);
    const diffTarget = path.join(out.diff, `${item.id}-diff.png`);
    const metricsTarget = path.join(out.metrics, `${item.id}.json`);

    await fs.copyFile(referenceSource, referenceTarget);
    await fs.copyFile(actualSource, actualTarget);
    await renderDiff(browser, item, referenceTarget, actualTarget, diffTarget);
    const pixelMetric = await computePixelMetric(browser, item, referenceTarget, actualTarget);
    const pixelPerfectStatus = pixelMetric.diffRatio <= 0.005 ? "PASS" : "REPAIR_REQUIRED";

    const metric = {
      uiId: item.id,
      route: item.route,
      state: item.state,
      viewport: "mobile evidence, Web actual captured at 390x693 in T13/T14 to match the 941x1672 reference aspect ratio",
      reference: relative(referenceTarget),
      actual: relative(actualTarget),
      diff: relative(diffTarget),
      referenceSource: relative(referenceSource),
      actualSource: relative(actualSource),
      referenceImage: await inspectPng(referenceTarget),
      actualImage: await inspectPng(actualTarget),
      diffImage: await inspectPng(diffTarget),
      comparisonMode: "browser-canvas normalized pixel diff plus side-by-side raster evidence",
      normalizedPixelDiff: pixelMetric,
      diffRatio: pixelMetric.diffRatio,
      threshold: 0.005,
      pixelPerfectStatus,
      materialDeviation: pixelPerfectStatus === "PASS" ? "NONE_DETECTED_BY_PIXEL_GATE" : "REPAIR_REQUIRED",
      notes: [
        "Reference is mini-program raster or Stitch-derived visual source; actual is Web/H5 runtime raster.",
        "Reference is scaled to the actual screenshot size before pixel comparison so dimensions do not hide visual drift."
      ]
    };
    await writeJson(metricsTarget, metric);
    metrics.push({ ...metric, metrics: relative(metricsTarget) });
  }

  const summary = {
    taskId: "T15",
    verdict: metrics.every((item) => item.pixelPerfectStatus === "PASS") ? "PASS" : "REPAIR_REQUIRED",
    productPassClaimed: metrics.every((item) => item.pixelPerfectStatus === "PASS"),
    coveredIds: cases.map((item) => item.id),
    generatedAt: new Date().toISOString(),
    summary: {
      referenceCount: metrics.length,
      actualCount: metrics.length,
      diffCount: metrics.length,
      metricsCount: metrics.length,
      missingEvidence: [],
      materialDeviations: metrics.map((item) => ({
        uiId: item.uiId,
        status: item.materialDeviation,
        diffRatio: item.diffRatio,
        threshold: item.threshold,
        basis: item.pixelPerfectStatus === "PASS" ? "Normalized pixel diff is within threshold." : "Normalized pixel diff exceeds threshold."
      })),
      passingScreens: metrics.filter((item) => item.pixelPerfectStatus === "PASS").length,
      failingScreens: metrics.filter((item) => item.pixelPerfectStatus !== "PASS").length,
      maxDiffRatio: Math.max(...metrics.map((item) => item.diffRatio)),
      threshold: 0.005
    },
    evidence: {
      referenceDir: relative(out.reference),
      actualDir: relative(out.actual),
      diffDir: relative(out.diff),
      metricsDir: relative(out.metrics),
      cases: metrics
    },
    blockers: [],
    nextRepair: metrics.every((item) => item.pixelPerfectStatus === "PASS") ? "T15 pixel gate is within threshold for covered Web screenshots." : "Repair screens with normalized pixel diffRatio above threshold, then rerun production T13/T14 and T15.",
    rerunResumeState: {
      command: "pnpm --filter @auracue/web test:visual",
      safeToRerun: true,
      inputs: [
        "docs/auto-execute/auracue-web-ui-reference-map.md",
        "docs/UI/小程序/P0-*.png",
        "docs/auto-execute/screenshots/web/T13/runtime-smoke/",
        "docs/auto-execute/screenshots/web/T14/owner-click-e2e/"
      ]
    }
  };
  await writeJson(path.join(taskRoot, "visual-summary.json"), summary);
  await writeJson(path.join(out.results, "T15.json"), {
    taskId: "T15",
    taskName: "visual-compare",
    status: "COMPLETE",
    verdict: summary.verdict,
    productPassClaimed: summary.productPassClaimed,
    coveredIds: summary.coveredIds,
    commands: [
      {
        command: "pnpm.cmd --filter @auracue/web test:visual",
        status: "PASS",
        exitCode: 0,
        evidence: "docs/auto-execute/logs/web/T15-command-log.md"
      }
    ],
    evidence: [
      "docs/auto-execute/screenshots/web/T15/reference",
      "docs/auto-execute/screenshots/web/T15/actual",
      "docs/auto-execute/screenshots/web/T15/diff",
      "docs/auto-execute/screenshots/web/T15/metrics",
      "docs/auto-execute/screenshots/web/T15/visual-summary.json",
      "docs/auto-execute/logs/web/T15-command-log.md"
    ],
    counts: summary.summary,
    blockers: summary.verdict === "PASS" ? [] : summary.summary.materialDeviations,
    limitations: [],
    materialDeviations: summary.summary.materialDeviations,
    nextRepair: summary.nextRepair,
    rerunResumeState: summary.rerunResumeState,
    handoff: "docs/auto-execute/latest/web/T15-HANDOFF.md"
  });
  await fs.writeFile(path.join(out.latest, "T15-HANDOFF.md"), [
    "# T15 HANDOFF - Visual Compare",
    "",
    `Status: ${summary.verdict}`,
    "",
    "## Evidence",
    "",
    "- `docs/auto-execute/screenshots/web/T15/visual-summary.json`",
    "- `docs/auto-execute/screenshots/web/T15/reference`",
    "- `docs/auto-execute/screenshots/web/T15/actual`",
    "- `docs/auto-execute/screenshots/web/T15/diff`",
    "- `docs/auto-execute/screenshots/web/T15/metrics`",
    "",
    "## Pixel Gate",
    "",
    `- Passing screens: ${summary.summary.passingScreens}`,
    `- Failing screens: ${summary.summary.failingScreens}`,
    `- Max diffRatio: ${summary.summary.maxDiffRatio}`,
    `- Threshold: ${summary.summary.threshold}`,
    ""
  ].join("\n"));
  await writeCommandLog(browser, summary);
  console.log(`T15 visual evidence generated: ${relative(path.join(taskRoot, "visual-summary.json"))}`);
}

async function renderDiff(browser, item, referencePath, actualPath, diffPath) {
  const htmlPath = path.join(os.tmpdir(), `auracue-${item.id}-visual-diff.html`);
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; background: #f6f1ea; color: #241b18; font-family: Arial, sans-serif; }
  .wrap { width: 840px; padding: 16px; box-sizing: border-box; }
  .title { font-size: 18px; font-weight: 700; margin: 0 0 10px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
  .panel { background: #fffaf3; border: 1px solid #d8c9b9; padding: 8px; box-sizing: border-box; }
  .label { font-size: 13px; font-weight: 700; margin-bottom: 6px; }
  img { width: 100%; height: auto; display: block; border: 1px solid #b9aa9a; box-sizing: border-box; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="title">${escapeHtml(item.id)} ${escapeHtml(item.route)} - ${escapeHtml(item.state)}</div>
    <div class="grid">
      <div class="panel"><div class="label">REFERENCE</div><img src="${pathToFileURL(referencePath).href}"></div>
      <div class="panel"><div class="label">ACTUAL WEB</div><img src="${pathToFileURL(actualPath).href}"></div>
    </div>
  </div>
</body>
</html>`;
  await fs.writeFile(htmlPath, html);
  const started = Date.now();
  await new Promise((resolve, reject) => {
    const child = spawn(browser, [
      "--headless=chrome",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--window-size=840,920",
      `--screenshot=${diffPath}`,
      pathToFileURL(htmlPath).href
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => {
      commandLog.push({
        command: `${browser} --headless=chrome --screenshot=${relative(diffPath)} ${item.id}`,
        status: code === 0 ? "PASS" : "FAIL",
        exitCode: code,
        durationMs: Date.now() - started
      });
      if (code === 0) resolve();
      else reject(new Error(`Chrome screenshot for ${item.id} exited ${code}: ${stderr}`));
    });
  });
  await mustExist(diffPath);
}

async function computePixelMetric(browser, item, referencePath, actualPath) {
  const htmlPath = path.join(os.tmpdir(), `auracue-${item.id}-pixel-metric.html`);
  const resultPath = path.join(os.tmpdir(), `auracue-${item.id}-pixel-metric.json`);
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
  const referenceUrl = ${JSON.stringify(pathToFileURL(referencePath).href)};
  const actualUrl = ${JSON.stringify(pathToFileURL(actualPath).href)};
  const resultPath = ${JSON.stringify(resultPath.replace(/\\/g, "\\\\"))};
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }
  function meanAbsoluteDelta(a, b, index) {
    return (Math.abs(a[index] - b[index]) + Math.abs(a[index + 1] - b[index + 1]) + Math.abs(a[index + 2] - b[index + 2])) / 3;
  }
  (async () => {
    const [reference, actual] = await Promise.all([loadImage(referenceUrl), loadImage(actualUrl)]);
    const width = actual.naturalWidth;
    const height = actual.naturalHeight;
    const refCanvas = document.createElement("canvas");
    const actCanvas = document.createElement("canvas");
    refCanvas.width = actCanvas.width = width;
    refCanvas.height = actCanvas.height = height;
    const refContext = refCanvas.getContext("2d", { willReadFrequently: true });
    const actContext = actCanvas.getContext("2d", { willReadFrequently: true });
    refContext.drawImage(reference, 0, 0, width, height);
    actContext.drawImage(actual, 0, 0, width, height);
    const refData = refContext.getImageData(0, 0, width, height).data;
    const actData = actContext.getImageData(0, 0, width, height).data;
    let changedPixels = 0;
    let totalDelta = 0;
    let maxDelta = 0;
    for (let i = 0; i < refData.length; i += 4) {
      const delta = meanAbsoluteDelta(refData, actData, i);
      totalDelta += delta;
      maxDelta = Math.max(maxDelta, delta);
      if (delta > 12) changedPixels += 1;
    }
    const totalPixels = width * height;
    const metric = {
      width,
      height,
      totalPixels,
      changedPixels,
      diffRatio: Number((changedPixels / totalPixels).toFixed(6)),
      averageChannelDelta: Number((totalDelta / totalPixels).toFixed(3)),
      maxChannelDelta: Number(maxDelta.toFixed(3)),
      changeThresholdPerPixel: 12
    };
    document.body.textContent = JSON.stringify(metric);
  })().catch((error) => {
    document.body.textContent = JSON.stringify({ error: String(error && error.stack || error) });
  });
</script>
</body>
</html>`;
  await fs.writeFile(htmlPath, html);
  const started = Date.now();
  let output = "";
  await new Promise((resolve, reject) => {
    const child = spawn(browser, [
      "--headless=chrome",
      "--disable-gpu",
      "--no-sandbox",
      "--allow-file-access-from-files",
      "--virtual-time-budget=5000",
      "--dump-dom",
      pathToFileURL(htmlPath).href
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => {
      commandLog.push({
        command: `${browser} --headless=chrome --dump-dom pixel metric ${item.id}`,
        status: code === 0 ? "PASS" : "FAIL",
        exitCode: code,
        durationMs: Date.now() - started
      });
      if (code === 0) resolve();
      else reject(new Error(`Chrome pixel metric for ${item.id} exited ${code}: ${stderr}`));
    });
  });
  const match = output.match(/<body>([\s\S]*)<\/body>/i);
  const body = (match ? match[1] : output).replace(/<[^>]+>/g, "").trim();
  const metric = JSON.parse(body);
  if (metric.error) {
    throw new Error(metric.error);
  }
  return metric;
}

async function writeCommandLog(browser, summary) {
  const lines = [
    "# T15 Command Log",
    "",
    `Verdict: ${summary.verdict}`,
    `Timestamp: ${summary.generatedAt}`,
    `Browser: ${browser}`,
    "",
    "## Commands",
    "",
    "- PASS: `pnpm --filter @auracue/web test:visual`",
    ...commandLog.map((entry) => `- ${entry.status}: \`${entry.command}\`${entry.exitCode !== undefined ? ` (exit ${entry.exitCode})` : ""}`),
    "",
    "## Evidence",
    "",
    `- Visual summary: ${relative(path.join(taskRoot, "visual-summary.json"))}`,
    `- Reference: ${relative(out.reference)}`,
    `- Actual: ${relative(out.actual)}`,
    `- Diff: ${relative(out.diff)}`,
    `- Metrics: ${relative(out.metrics)}`
  ];
  await fs.writeFile(path.join(out.logs, "T15-command-log.md"), `${lines.join("\n")}\n`);
}

async function ensureDirs() {
  await Promise.all(Object.values(out).map((dir) => fs.mkdir(dir, { recursive: true })));
}

async function mustExist(file) {
  await fs.access(file);
}

async function inspectPng(file) {
  const data = await fs.readFile(file);
  if (data.length < 24 || data.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`Not a PNG with IHDR: ${file}`);
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    bytes: data.length,
    sha256: crypto.createHash("sha256").update(data).digest("hex")
  };
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function findBrowser() {
  const candidates = [
    process.env.T15_BROWSER,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error("No Chrome or Edge executable found for T15 visual diff screenshots.");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function relative(file) {
  return path.relative(repoRoot, file).replace(/\\/g, "/");
}
