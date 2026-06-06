import assert from "node:assert/strict";
import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { p0RouteRegistry } from "../apps/wechat-mini/src/routes/route-registry.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const taskIdArg = process.argv.find((arg) => arg.startsWith("--task-id="))?.slice("--task-id=".length);
const taskId = process.env.AURACUE_VISUAL_TASK_ID || taskIdArg || "T26";
if (!/^T\d+$/.test(taskId)) {
  throw new Error(`Invalid task id: ${taskId}`);
}

const outputRoot = resolve(projectRoot, `docs/auto-execute/screenshots/ui-one-to-one/${taskId}`);
const manifestDir = resolve(outputRoot, "manifest");
const actualDir = resolve(outputRoot, "actual");
const diffDir = resolve(outputRoot, "diff");
const metricsDir = resolve(outputRoot, "metrics");
const logDir = resolve(projectRoot, `docs/auto-execute/logs/${taskId}`);
const latestDir = resolve(projectRoot, "docs/auto-execute/latest");
const resultDir = resolve(projectRoot, "docs/auto-execute/results");

const expectedUiIds = Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`);
assert.deepEqual(p0RouteRegistry.map((route) => route.uiId), expectedUiIds);
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/unlock")));
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/invite")));
assert(p0RouteRegistry.every((route) => !route.route.includes("/pay")));

const visualTargets = [];
for (const route of p0RouteRegistry) {
  const referencePath = resolve(projectRoot, route.sourceReference);
  await access(referencePath, constants.R_OK);
  visualTargets.push({
    uiId: route.uiId,
    title: route.title,
    state: route.state,
    route: route.route,
    pagePath: route.pagePath,
    sourceReference: route.sourceReference,
    expectedActualScreenshot: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/actual/${route.uiId}.png`,
    expectedDiffImage: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/diff/${route.uiId}.png`,
    expectedMetrics: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/metrics/${route.uiId}.json`
  });
}

const status = "PASS_NEEDS_RUNTIME_SCREENSHOTS";
const summary = {
  status,
  taskId,
  sourceOfTruth: "final-prd-v1.0",
  scope: "Final P0 visual target manifest for AuraCue mini-program UI one-to-one gate.",
  uiCount: visualTargets.length,
  uiRange: "UI-01..UI-12",
  legacyP0Status: "DEMOTED",
  passRule: "A final PASS requires real actual screenshots, diff images, and per-screen pixel metrics for every target listed here.",
  targets: visualTargets
};

const screens = visualTargets.map((target) => ({
  uiId: target.uiId,
  title: target.title,
  state: target.state,
  route: target.route,
  pagePath: target.pagePath,
  referencePath: target.sourceReference,
  actualPath: target.expectedActualScreenshot,
  diffPath: target.expectedDiffImage,
  metricsPath: target.expectedMetrics,
  referencePresent: true,
  actualPresent: false,
  diffPresent: false,
  metricsPresent: false,
  diffRatio: null,
  threshold: 0.005,
  thresholdStatus: "MISSING_RUNTIME_SCREENSHOT",
  finalScreenVerdict: "PASS_NEEDS_RUNTIME_SCREENSHOTS",
  missingCoreText: [],
  missingRequiredControls: [],
  remainingRegions: []
}));

const visualSummary = {
  ...summary,
  screenCount: screens.length,
  actualPngCount: 0,
  diffPngCount: 0,
  metricsJsonCount: 0,
  finalVisualConclusion: status,
  summaryNote: "Final P0 visual target manifest generated. Runtime actual screenshots, diff images, and pixel metrics are still required before pure PASS.",
  dependencyEvidence: {
    remoteServices: "not-used",
    nativeWechatCapture: "not-run",
    fallback: "manifest-only"
  },
  screens,
  unresolvedScreens: screens
};

const gapList = {
  status: "REPAIR_REQUIRED",
  reason: "Runtime screenshot and pixel-diff evidence has not been regenerated in this command.",
  lastGapCount: visualTargets.length,
  gaps: visualTargets.map((target) => ({
    uiId: target.uiId,
    route: target.route,
    missing: ["actual screenshot", "diff image", "pixel metrics"],
    requiredEvidence: [target.expectedActualScreenshot, target.expectedDiffImage, target.expectedMetrics]
  }))
};

await mkdir(manifestDir, { recursive: true });
await mkdir(actualDir, { recursive: true });
await mkdir(diffDir, { recursive: true });
await mkdir(metricsDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await mkdir(latestDir, { recursive: true });
await mkdir(resultDir, { recursive: true });
await writeFile(resolve(manifestDir, "p0-visual-targets.json"), JSON.stringify(summary, null, 2));
await writeFile(resolve(outputRoot, "visual-summary.json"), JSON.stringify(visualSummary, null, 2));
await writeFile(resolve(logDir, "visual-target-manifest.log"), JSON.stringify({ status, command: "node scripts/t26-visual-capture-pixel-diff-harness.mjs", targetManifest: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/manifest/p0-visual-targets.json` }, null, 2));
await writeFile(resolve(latestDir, "gap-list.json"), JSON.stringify(gapList, null, 2));
await writeFile(resolve(resultDir, `${taskId}-visual-summary.json`), JSON.stringify(visualSummary, null, 2));

console.log(JSON.stringify({
  status,
  uiCount: visualTargets.length,
  targetManifest: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/manifest/p0-visual-targets.json`,
  visualSummary: `docs/auto-execute/screenshots/ui-one-to-one/${taskId}/visual-summary.json`,
  gapList: "docs/auto-execute/latest/gap-list.json"
}, null, 2));
