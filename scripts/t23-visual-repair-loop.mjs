import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const t22SummaryPath = resolve(projectRoot, "docs/auto-execute/screenshots/diffs/T22/visual-summary.json");
const t22ResultPath = resolve(projectRoot, "docs/auto-execute/results/T22.json");
const diffDir = resolve(projectRoot, "docs/auto-execute/screenshots/diffs/T23");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T23");
const resultDir = resolve(projectRoot, "docs/auto-execute/results");
const latestDir = resolve(projectRoot, "docs/auto-execute/latest");

const command = "node scripts/t23-visual-repair-loop.mjs";

function relative(path) {
  return path.replace(projectRoot + "\\", "").replaceAll("\\", "/");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

await mkdir(diffDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await mkdir(resultDir, { recursive: true });
await mkdir(latestDir, { recursive: true });

const blockers = [];
if (!existsSync(t22SummaryPath)) blockers.push(`Missing T22 visual summary: ${relative(t22SummaryPath)}`);
if (!existsSync(t22ResultPath)) blockers.push(`Missing T22 result: ${relative(t22ResultPath)}`);

const t22Summary = blockers.length ? { screens: [] } : await readJson(t22SummaryPath);
const screens = [];
const repairLogRows = [];

for (const screen of t22Summary.screens ?? []) {
  const isLegacyUi = /^UI-(1[3-9]|[2-9]\d)$/.test(screen.uiId);
  const finalUiStatus = isLegacyUi ? "DEMOTED_FROM_P0" : screen.referencePresent ? "PASS_NEEDS_RUNTIME_SCREENSHOTS" : "REPAIR_REQUIRED";
  const repairDecision = isLegacyUi ? "exclude_from_final_p0" : screen.referencePresent ? "scope_confirmed_waiting_for_runtime_evidence" : "missing_final_p0_reference";
  const metricsPath = resolve(diffDir, `${screen.uiId}-metrics.json`);
  const metrics = {
    taskId: "T23",
    sourceTaskId: "T22",
    uiId: screen.uiId,
    route: screen.route,
    pagePath: screen.pagePath,
    sourceReference: screen.sourceReference,
    repairDecision,
    finalUiStatus,
    canClaimPixelPerfect: false,
    diffRatio: null,
    knownDifferences: isLegacyUi
      ? ["This UI target is legacy/P1 and is excluded from final P0."]
      : ["Runtime screenshot, diff image, and pixel metrics still need to be generated for final P0."]
  };
  await writeJson(metricsPath, metrics);

  screens.push({
    uiId: screen.uiId,
    route: screen.route,
    pagePath: screen.pagePath,
    sourceReference: screen.sourceReference,
    metrics: relative(metricsPath),
    repairDecision,
    finalUiStatus,
    canClaimPixelPerfect: false
  });
  repairLogRows.push(`| ${screen.uiId} | ${screen.route} | ${repairDecision} | ${finalUiStatus} | ${relative(metricsPath)} |`);
}

const unexpectedLegacyTargets = screens.filter((screen) => screen.finalUiStatus === "DEMOTED_FROM_P0");
const missingRequiredEvidence = screens.filter((screen) => screen.finalUiStatus === "REPAIR_REQUIRED");
const finalStatus = blockers.length || unexpectedLegacyTargets.length || missingRequiredEvidence.length
  ? "REPAIR_REQUIRED"
  : "PASS_NEEDS_RUNTIME_SCREENSHOTS";
const nonPassReason = finalStatus === "PASS_NEEDS_RUNTIME_SCREENSHOTS"
  ? "T23 confirmed the visual repair target set is final P0 UI-01..UI-12; runtime raster/diff evidence remains to be generated."
  : "T23 found missing T22 evidence, missing final P0 references, or unexpected legacy targets in the current visual scope.";

const repairLogPath = resolve(diffDir, "repair-log.md");
const repairSummaryPath = resolve(diffDir, "repair-summary.json");
const logPath = resolve(logDir, "visual-repair.log");

const repairLog = `# T23 Visual Scope Repair Log

## Verdict
${finalStatus}

## Deviation Mapping
| UI ID | Route | T23 Action | T23 Status | Evidence |
| --- | --- | --- | --- | --- |
${repairLogRows.join("\n")}

## Notes
- T23 does not repair old unlock/payment/invite screens because final PRD v1.0 demotes them from P0.
- The next valid visual gate must target only \`UI-01..UI-12\`.
- Pure PASS remains unavailable until final-P0 runtime screenshots, diff images, and pixel metrics exist.
`;
await writeFile(repairLogPath, repairLog);

const repairSummary = {
  taskId: "T23",
  status: finalStatus,
  sourceTaskId: "T22",
  sourceOfTruth: "final-prd-v1.0",
  legacyP0Status: "DEMOTED",
  uiRange: "UI-01..UI-12",
  command,
  screenCount: screens.length,
  unexpectedLegacyTargetCount: unexpectedLegacyTargets.length,
  finalP0TargetCount: screens.filter((screen) => screen.finalUiStatus !== "DEMOTED_FROM_P0").length,
  canClaimPixelPerfect: false,
  finalVisualConclusion: finalStatus,
  summaryNote: nonPassReason,
  screens,
  blockers
};
await writeJson(repairSummaryPath, repairSummary);
await writeJson(logPath, {
  status: finalStatus,
  command,
  repairLog: relative(repairLogPath),
  repairSummary: relative(repairSummaryPath),
  blockers
});

const changedFiles = [
  "scripts/t23-visual-repair-loop.mjs",
  "docs/auto-execute/screenshots/diffs/T23/",
  "docs/auto-execute/logs/T23/visual-repair.log",
  "docs/auto-execute/results/T23.json",
  "docs/auto-execute/latest/T23-HANDOFF.md"
];
const evidence = [
  relative(repairLogPath),
  relative(repairSummaryPath),
  relative(logPath),
  ...screens.map((screen) => screen.metrics)
];
const result = {
  taskId: "T23",
  status: finalStatus,
  uiRange: "UI-01..UI-12",
  scope: "Final P0 visual target scope repair for AuraCue mini-program UI-01 through UI-12.",
  changedFiles,
  commands: [command],
  evidence,
  blockers,
  nonPassReason,
  nextActions: [
    "Generate final-P0 runtime actual screenshots, diff images, and pixel metrics for UI-01..UI-12.",
    "Keep UI-13..UI-18 and legacy unlock/payment/invite repair tasks out of the final P0 gate.",
    "Rerun T33 after final-P0 raster evidence exists."
  ],
  localOnly: {
    payment: "not-used",
    ai: "not-used",
    analytics: "not-used",
    storage: "local evidence files only",
    db: "not-used"
  }
};
await writeJson(resolve(resultDir, "T23.json"), result);

const handoff = `# T23 HANDOFF

## Status
${finalStatus}

## Scope
T23 confirmed the final P0 visual target set is \`UI-01..UI-12\`. Legacy unlock/payment/invite visual repair lanes are excluded from P0.

## Evidence Paths
${evidence.map((item) => `- ${item}`).join("\n")}

## Next-Step Notes
- Generate runtime actual screenshots, diff images, and pixel metrics for \`UI-01..UI-12\`.
- Do not continue old \`UI-13..UI-18\` visual repair work unless product scope changes.
`;
await writeFile(resolve(latestDir, "T23-HANDOFF.md"), handoff);

console.log(JSON.stringify({
  status: finalStatus,
  uiRange: "UI-01..UI-12",
  evidence,
  blockers
}, null, 2));
