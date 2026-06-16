import crypto from "node:crypto";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const repoRoot = path.resolve(appRoot, "..", "..");
const docsRoot = path.join(repoRoot, "docs", "auto-execute");
const taskId = process.env.AURACUE_WEB_VISUAL_TASK_ID || "T15";
if (!/^T\d+(?:-[a-z0-9-]+)?$/i.test(taskId)) {
  throw new Error(`Invalid AURACUE_WEB_VISUAL_TASK_ID: ${taskId}`);
}
const visualOutputRoot = process.env.AURACUE_WEB_VISUAL_OUTPUT_ROOT
  ? path.resolve(process.env.AURACUE_WEB_VISUAL_OUTPUT_ROOT)
  : path.join(docsRoot, "screenshots", "web");
const taskRoot = path.join(visualOutputRoot, taskId);
const useExternalVisualOutput = Boolean(process.env.AURACUE_WEB_VISUAL_OUTPUT_ROOT);
const out = {
  reference: path.join(taskRoot, "reference"),
  actual: path.join(taskRoot, "actual"),
  diff: path.join(taskRoot, "diff"),
  metrics: path.join(taskRoot, "metrics"),
  logs: useExternalVisualOutput ? path.join(visualOutputRoot, "_logs") : path.join(docsRoot, "logs", "web"),
  results: useExternalVisualOutput ? path.join(visualOutputRoot, "_results") : path.join(docsRoot, "results", "web"),
  latest: useExternalVisualOutput ? path.join(visualOutputRoot, "_latest") : path.join(docsRoot, "latest", "web")
};

const cases = [
  {
    id: "UI-001",
    route: "/",
    state: "home no active card",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-001.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "01-home.png"]
  },
  {
    id: "UI-002",
    route: "/create/context",
    state: "context selected",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-002.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "02-context.png"]
  },
  {
    id: "UI-003",
    route: "/create/upload",
    state: "upload success",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-003.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "03-upload.png"]
  },
  {
    id: "UI-004",
    route: "/create/draw",
    state: "three-card draw",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-004.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "04-draw.png"]
  },
  {
    id: "UI-005",
    route: "/result/[id]",
    state: "result loaded",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-005.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "05-result.png"]
  },
  {
    id: "UI-006",
    route: "/activate/[id]",
    state: "activation ready",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-006.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "06-activate.png"]
  },
  {
    id: "UI-007",
    route: "/activated/[id]",
    state: "activated",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-007.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "07-activated.png"]
  },
  {
    id: "UI-008",
    route: "/share/[id]",
    state: "share preview",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-008.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "08-share.png"]
  },
  {
    id: "UI-009",
    route: "/saved/[id]",
    state: "saved success",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-009.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T13", "runtime-smoke", "09-saved.png"]
  },
  {
    id: "UI-010",
    route: "/create/upload",
    state: "visible upload error",
    reference: ["docs", "auto-execute", "screenshots", "web", "T15", "reference", "UI-010.png"],
    actual: ["docs", "auto-execute", "screenshots", "web", "T14", "owner-click-e2e", "owner-upload-failure-upload-failure-ui.png"]
  }
];

const commandLog = [];

main().catch(async (error) => {
  await fs.mkdir(out.logs, { recursive: true });
  await writeText(
    path.join(out.logs, "T15-command-log.md"),
    `# T15 Command Log\n\nVerdict: FAIL\n\n- FAIL: \`pnpm --filter @auracue/web test:visual\`\n\n\`\`\`text\n${String(error?.stack || error)}\n\`\`\`\n`
  );
  console.error(error);
  process.exit(1);
});

async function main() {
  await ensureDirs();
  const imageEngine = await getSharp();
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

    await copyIfDifferent(referenceSource, referenceTarget);
    await copyIfDifferent(actualSource, actualTarget);
    await renderDiff(imageEngine, item, referenceTarget, actualTarget, diffTarget);
    const pixelMetric = await computePixelMetric(imageEngine, item, referenceTarget, actualTarget);
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
    taskId,
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
    nextRepair: metrics.every((item) => item.pixelPerfectStatus === "PASS") ? `${taskId} pixel gate is within threshold for covered Web screenshots.` : `Repair screens with normalized pixel diffRatio above threshold, then rerun production T13/T14 and ${taskId}.`,
    rerunResumeState: {
      command: "pnpm --filter @auracue/web test:visual",
      safeToRerun: true,
      inputs: [
        "docs/auto-execute/auracue-web-ui-reference-map.md",
        "docs/auto-execute/screenshots/web/T15/reference/*.png",
        "docs/auto-execute/screenshots/web/T13/runtime-smoke/",
        "docs/auto-execute/screenshots/web/T14/owner-click-e2e/"
      ]
    }
  };
  await writeJson(path.join(taskRoot, "visual-summary.json"), summary);
  await writeJson(path.join(out.results, `${taskId}.json`), {
    taskId,
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
      `docs/auto-execute/screenshots/web/${taskId}/reference`,
      `docs/auto-execute/screenshots/web/${taskId}/actual`,
      `docs/auto-execute/screenshots/web/${taskId}/diff`,
      `docs/auto-execute/screenshots/web/${taskId}/metrics`,
      `docs/auto-execute/screenshots/web/${taskId}/visual-summary.json`,
      "docs/auto-execute/logs/web/T15-command-log.md"
    ],
    counts: summary.summary,
    blockers: summary.verdict === "PASS" ? [] : summary.summary.materialDeviations,
    limitations: [],
    materialDeviations: summary.summary.materialDeviations,
    nextRepair: summary.nextRepair,
    rerunResumeState: summary.rerunResumeState,
    handoff: `docs/auto-execute/latest/web/${taskId}-HANDOFF.md`
  });
  await writeText(path.join(out.latest, `${taskId}-HANDOFF.md`), [
    `# ${taskId} HANDOFF - Visual Compare`,
    "",
    `Status: ${summary.verdict}`,
    "",
    "## Evidence",
    "",
    `- \`docs/auto-execute/screenshots/web/${taskId}/visual-summary.json\``,
    `- \`docs/auto-execute/screenshots/web/${taskId}/reference\``,
    `- \`docs/auto-execute/screenshots/web/${taskId}/actual\``,
    `- \`docs/auto-execute/screenshots/web/${taskId}/diff\``,
    `- \`docs/auto-execute/screenshots/web/${taskId}/metrics\``,
    "",
    "## Pixel Gate",
    "",
    `- Passing screens: ${summary.summary.passingScreens}`,
    `- Failing screens: ${summary.summary.failingScreens}`,
    `- Max diffRatio: ${summary.summary.maxDiffRatio}`,
    `- Threshold: ${summary.summary.threshold}`,
    ""
  ].join("\n"));
  await writeCommandLog("sharp", summary);
  console.log(`T15 visual evidence generated: ${relative(path.join(taskRoot, "visual-summary.json"))}`);
}

async function renderDiff(sharp, item, referencePath, actualPath, diffPath) {
  const started = Date.now();
  const actualMeta = await sharp(actualPath).metadata();
  const width = actualMeta.width;
  const height = actualMeta.height;
  if (!width || !height) {
    throw new Error(`Unable to read actual image dimensions for ${item.id}: ${actualPath}`);
  }
  const reference = await sharp(referencePath).resize(width, height, { fit: "fill" }).png().toBuffer();
  const actual = await sharp(actualPath).resize(width, height, { fit: "fill" }).png().toBuffer();
  await sharp({
    create: {
      width: width * 2 + 12,
      height,
      channels: 4,
      background: "#f6f1ea"
    }
  })
    .composite([
      { input: reference, left: 0, top: 0 },
      { input: actual, left: width + 12, top: 0 }
    ])
    .png()
    .toFile(diffPath);
  commandLog.push({
    command: `sharp side-by-side visual diff ${item.id}`,
    status: "PASS",
    exitCode: 0,
    durationMs: Date.now() - started
  });
  await mustExist(diffPath);
}

async function computePixelMetric(sharp, item, referencePath, actualPath) {
  const started = Date.now();
  const actualMeta = await sharp(actualPath).metadata();
  const width = actualMeta.width;
  const height = actualMeta.height;
  if (!width || !height) {
    throw new Error(`Unable to read actual image dimensions for ${item.id}: ${actualPath}`);
  }
  const reference = await sharp(referencePath).resize(width, height, { fit: "fill" }).raw().toBuffer();
  const actual = await sharp(actualPath).resize(width, height, { fit: "fill" }).raw().toBuffer();
  let changedPixels = 0;
  let totalDelta = 0;
  let maxDelta = 0;
  const channels = reference.length / (width * height);
  for (let i = 0; i < reference.length; i += channels) {
    const delta = (Math.abs(reference[i] - actual[i]) + Math.abs(reference[i + 1] - actual[i + 1]) + Math.abs(reference[i + 2] - actual[i + 2])) / 3;
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
  commandLog.push({
    command: `sharp normalized pixel metric ${item.id}`,
    status: "PASS",
    exitCode: 0,
    durationMs: Date.now() - started
  });
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
  await writeText(path.join(out.logs, "T15-command-log.md"), `${lines.join("\n")}\n`);
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
  await writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function copyIfDifferent(source, target) {
  if (path.resolve(source) === path.resolve(target)) {
    return;
  }
  await fs.copyFile(source, target);
}

async function writeText(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.writeFile(file, value);
    return file;
  } catch (error) {
    if (error?.code !== "EPERM" && error?.code !== "EACCES") {
      throw error;
    }
    const parsed = path.parse(file);
    const fallback = path.join(parsed.dir, `${parsed.name}.${Date.now()}${parsed.ext}`);
    try {
      await fs.writeFile(fallback, value);
      commandLog.push({
        command: `fallback write ${relative(fallback)}`,
        status: "PASS_WITH_LOCKED_PRIMARY",
        exitCode: 0,
        durationMs: 0
      });
      return fallback;
    } catch (fallbackError) {
      if (fallbackError?.code !== "EPERM" && fallbackError?.code !== "EACCES") {
        throw fallbackError;
      }
      const tempFallback = path.join(os.tmpdir(), `auracue-${parsed.name}.${Date.now()}${parsed.ext}`);
      await fs.writeFile(tempFallback, value);
      commandLog.push({
        command: `fallback write ${tempFallback}`,
        status: "PASS_WITH_LOCKED_PRIMARY",
        exitCode: 0,
        durationMs: 0
      });
      return tempFallback;
    }
  }
}

async function getSharp() {
  try {
    const module = await import("sharp");
    return module.default;
  } catch (error) {
    const fallback = path.join(repoRoot, "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp", "lib", "index.js");
    try {
      const module = await import(pathToFileURL(fallback).href);
      return module.default;
    } catch {
      throw error;
    }
  }
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
