import assert from "node:assert/strict";
import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { p0RouteRegistry } from "../apps/wechat-mini/src/routes/route-registry.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const screenshotDir = resolve(projectRoot, "docs/auto-execute/screenshots/T22");
const diffDir = resolve(projectRoot, "docs/auto-execute/screenshots/diffs/T22");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T22");
const resultDir = resolve(projectRoot, "docs/auto-execute/results");
const latestDir = resolve(projectRoot, "docs/auto-execute/latest");

const command = "node scripts/t22-visual-harness.mjs";
const expectedUiIds = Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`);

function relative(path) {
  return path.replace(projectRoot + "\\", "").replaceAll("\\", "/");
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

assert.deepEqual(p0RouteRegistry.map((route) => route.uiId), expectedUiIds);
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/unlock")));
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/invite")));
assert(p0RouteRegistry.every((route) => !route.route.includes("/pay")));

await mkdir(screenshotDir, { recursive: true });
await mkdir(diffDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await mkdir(resultDir, { recursive: true });
await mkdir(latestDir, { recursive: true });

const blockers = [];
const screens = [];

for (const route of p0RouteRegistry) {
  const referencePath = resolve(projectRoot, route.sourceReference);
  let referencePresent = true;
  try {
    await access(referencePath, constants.R_OK);
  } catch {
    referencePresent = false;
    blockers.push(`${route.uiId} missing final P0 reference ${route.sourceReference}`);
  }

  const metricsPath = resolve(diffDir, `${route.uiId}-metrics.json`);
  const metrics = {
    taskId: "T22",
    uiId: route.uiId,
    title: route.title,
    route: route.route,
    pagePath: route.pagePath,
    state: route.state,
    sourceReference: route.sourceReference,
    referencePresent,
    actualScreenshotPresent: false,
    diffImagePresent: false,
    metricsPresent: false,
    finalUiStatus: referencePresent ? "PASS_NEEDS_RUNTIME_SCREENSHOTS" : "REPAIR_REQUIRED",
    requiredEvidence: {
      actualScreenshot: `docs/auto-execute/screenshots/ui-one-to-one/T33/actual/${route.uiId}.png`,
      diffImage: `docs/auto-execute/screenshots/ui-one-to-one/T33/diff/${route.uiId}.png`,
      pixelMetrics: `docs/auto-execute/screenshots/ui-one-to-one/T33/metrics/${route.uiId}.json`
    }
  };
  await writeJson(metricsPath, metrics);

  screens.push({
    uiId: route.uiId,
    title: route.title,
    route: route.route,
    pagePath: route.pagePath,
    state: route.state,
    sourceReference: route.sourceReference,
    referencePath: route.sourceReference,
    referencePresent,
    actualPath: null,
    diffPath: null,
    metricsPath: relative(metricsPath),
    diffRatio: null,
    thresholdStatus: "MISSING_RUNTIME_SCREENSHOT",
    finalScreenVerdict: metrics.finalUiStatus,
    missingCoreText: [],
    missingRequiredControls: [],
    remainingRegions: []
  });
}

const finalStatus = blockers.length ? "REPAIR_REQUIRED" : "PASS_NEEDS_RUNTIME_SCREENSHOTS";
const visualSummary = {
  taskId: "T22",
  status: finalStatus,
  sourceOfTruth: "final-prd-v1.0",
  legacyP0Status: "DEMOTED",
  uiRange: "UI-01..UI-12",
  command,
  screenCount: screens.length,
  referenceCount: screens.filter((screen) => screen.referencePresent).length,
  actualPngCount: 0,
  diffPngCount: 0,
  metricsJsonCount: screens.length,
  canClaimPixelPerfect: false,
  finalVisualConclusion: finalStatus,
  summaryNote: "Final P0 scope is 12 UI states from P0-* references. Legacy unlock, payment, invite, free-preview, history, trend, and profile screens are demoted and are not visual-gate targets.",
  screens,
  blockers
};

const visualSummaryPath = resolve(diffDir, "visual-summary.json");
const screenshotManifestPath = resolve(screenshotDir, "screenshot-manifest.json");
const logPath = resolve(logDir, "visual-harness.log");
await writeJson(visualSummaryPath, visualSummary);
await writeJson(screenshotManifestPath, visualSummary);
await writeJson(logPath, {
  status: finalStatus,
  command,
  visualSummary: relative(visualSummaryPath),
  screenshotManifest: relative(screenshotManifestPath),
  blockers
});

const result = {
  taskId: "T22",
  status: finalStatus,
  uiRange: "UI-01..UI-12",
  scope: "Final P0 visual target scope audit for AuraCue mini-program UI-01 through UI-12.",
  changedFiles: [
    "scripts/t22-visual-harness.mjs",
    "docs/auto-execute/screenshots/T22/",
    "docs/auto-execute/screenshots/diffs/T22/",
    "docs/auto-execute/logs/T22/visual-harness.log",
    "docs/auto-execute/results/T22.json",
    "docs/auto-execute/latest/T22-HANDOFF.md"
  ],
  commands: [command],
  evidence: [
    relative(screenshotManifestPath),
    relative(visualSummaryPath),
    relative(logPath),
    ...screens.map((screen) => screen.metricsPath)
  ],
  blockers,
  nonPassReason: "Pure visual PASS is not claimed because runtime actual screenshots, diff images, and pixel metrics have not been regenerated for final P0.",
  nextActions: [
    "Generate actual screenshots, diff images, and pixel metrics for UI-01..UI-12 only.",
    "Keep legacy unlock/pay/invite screens excluded unless product scope explicitly changes.",
    "Rerun T33 after a final-P0 raster capture path exists."
  ],
  localOnly: {
    payment: "not-used",
    ai: "not-used",
    analytics: "not-used",
    storage: "local evidence files only",
    db: "not-used"
  }
};
await writeJson(resolve(resultDir, "T22.json"), result);

const handoff = `# T22 HANDOFF

## Status
${finalStatus}

## Scope
Final P0 mini-program UI target set is \`UI-01..UI-12\`, sourced from \`apps/wechat-mini/src/routes/route-registry.mjs\` and \`docs/UI/小程序/P0-*.png\`.

Legacy unlock, payment, invite, free-preview, history, trend, and profile references are demoted and must not drive the P0 visual gate.

## Evidence Paths
- docs/auto-execute/screenshots/T22/screenshot-manifest.json
- docs/auto-execute/screenshots/diffs/T22/visual-summary.json
- docs/auto-execute/logs/T22/visual-harness.log
- docs/auto-execute/screenshots/diffs/T22/UI-01-metrics.json through UI-12-metrics.json

## Next-Step Notes
- Generate runtime actual screenshots, diff images, and pixel metrics for \`UI-01..UI-12\`.
- Do not revive old \`UI-13..UI-18\` as P0 targets without an explicit product-scope change.
`;
await writeFile(resolve(latestDir, "T22-HANDOFF.md"), handoff);

console.log(JSON.stringify({
  status: finalStatus,
  uiRange: "UI-01..UI-12",
  evidence: result.evidence,
  blockers
}, null, 2));
