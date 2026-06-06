import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { p0RouteRegistry } from "../apps/wechat-mini/src/routes/route-registry.mjs";

const root = process.cwd();
const resultDir = path.join(root, "docs", "auto-execute", "results");
const latestDir = path.join(root, "docs", "auto-execute", "latest");
const logDir = path.join(root, "docs", "auto-execute", "logs", "T33");
const visualDir = path.join(root, "docs", "auto-execute", "screenshots", "ui-one-to-one", "T33");
const visualSummaryPath = path.join(visualDir, "visual-summary.json");

const rel = (absolutePath) => path.relative(root, absolutePath).replaceAll(path.sep, "/");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, ""));

fs.mkdirSync(logDir, { recursive: true });
fs.mkdirSync(resultDir, { recursive: true });
fs.mkdirSync(latestDir, { recursive: true });

const expectedUiIds = Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`);
assert.deepEqual(p0RouteRegistry.map((route) => route.uiId), expectedUiIds);
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/unlock")));
assert(p0RouteRegistry.every((route) => !route.route.startsWith("/invite")));
assert(p0RouteRegistry.every((route) => !route.route.includes("/pay")));

const scopeEvidence = ["T22", "T23"].map((taskId) => {
  const resultPath = `docs/auto-execute/results/${taskId}.json`;
  const handoffPath = `docs/auto-execute/latest/${taskId}-HANDOFF.md`;
  const resultPresent = exists(resultPath);
  const handoffPresent = exists(handoffPath);
  const result = resultPresent ? readJson(resultPath) : null;
  return {
    taskId,
    resultPath,
    handoffPath,
    resultPresent,
    handoffPresent,
    status: result?.status ?? "MISSING",
    uiRange: result?.uiRange ?? result?.scope ?? null
  };
});

const visualSummary = fs.existsSync(visualSummaryPath)
  ? JSON.parse(fs.readFileSync(visualSummaryPath, "utf8").replace(/^\uFEFF/, ""))
  : null;
const visualSummaryScreens = visualSummary?.screens ?? [];
const visualScreens = p0RouteRegistry.map((route) => {
  const screen = visualSummaryScreens.find((item) => item.uiId === route.uiId);
  const referencePath = screen?.referencePath ?? route.sourceReference;
  const actualPath = screen?.actualPath ?? `docs/auto-execute/screenshots/ui-one-to-one/T33/actual/${route.uiId}.png`;
  const diffPath = screen?.diffPath ?? `docs/auto-execute/screenshots/ui-one-to-one/T33/diff/${route.uiId}.png`;
  const metricsPath = screen?.metricsPath ?? `docs/auto-execute/screenshots/ui-one-to-one/T33/metrics/${route.uiId}.json`;
  const referencePresent = exists(referencePath);
  const actualPresent = exists(actualPath);
  const diffPresent = exists(diffPath);
  const metricsPresent = exists(metricsPath);
  const ratioPass = typeof screen?.diffRatio === "number" && screen.diffRatio <= 0.005;
  const textAndControlPass =
    Array.isArray(screen?.missingCoreText) &&
    screen.missingCoreText.length === 0 &&
    Array.isArray(screen?.missingRequiredControls) &&
    screen.missingRequiredControls.length === 0;
  return {
    uiId: route.uiId,
    route: route.route,
    pagePath: route.pagePath,
    referencePath,
    actualPath,
    diffPath,
    metricsPath,
    referencePresent,
    actualPresent,
    diffPresent,
    metricsPresent,
    diffRatio: screen?.diffRatio ?? null,
    threshold: 0.005,
    thresholdStatus: screen?.thresholdStatus ?? "MISSING_RUNTIME_SCREENSHOT",
    finalScreenVerdict: screen?.finalScreenVerdict ?? "MISSING_RUNTIME_SCREENSHOT",
    missingCoreText: screen?.missingCoreText ?? [],
    missingRequiredControls: screen?.missingRequiredControls ?? [],
    remainingRegions: screen?.remainingRegions ?? [],
    pass: Boolean(screen) && referencePresent && actualPresent && diffPresent && metricsPresent && ratioPass && textAndControlPass
  };
});

const commandResults = [
  ["pnpm.cmd test", "docs/auto-execute/logs/T33/pnpm-test.log"],
  ["pnpm.cmd lint", "docs/auto-execute/logs/T33/pnpm-lint.log"],
  ["pnpm.cmd typecheck", "docs/auto-execute/logs/T33/pnpm-typecheck.log"],
  ["node scripts/verify-wechat-routes.mjs", "docs/auto-execute/logs/T33/verify-wechat-routes.log"],
  ["node scripts/t26-visual-capture-pixel-diff-harness.mjs --task-id=T33", "docs/auto-execute/logs/T33/visual-target-manifest.log"],
  ["git diff --check", "docs/auto-execute/logs/T33/git-diff-check.log"]
].map(([command, evidence]) => ({
  command,
  status: exists(evidence) ? "EVIDENCE_PRESENT" : "EVIDENCE_MISSING",
  evidence,
  evidencePresent: exists(evidence)
}));

const unresolvedItems = [];
for (const scope of scopeEvidence) {
  if (!scope.resultPresent) unresolvedItems.push(`${scope.taskId} result JSON missing`);
  if (!scope.handoffPresent) unresolvedItems.push(`${scope.taskId} HANDOFF missing`);
  if (!["PASS_NEEDS_RUNTIME_SCREENSHOTS", "PASS"].includes(scope.status)) unresolvedItems.push(`${scope.taskId} status is ${scope.status}`);
}
if (!visualSummary) unresolvedItems.push("T33 visual summary missing");
if (visualSummary && visualSummary.uiRange !== "UI-01..UI-12") unresolvedItems.push(`T33 visual summary uiRange is ${visualSummary.uiRange}`);
for (const screen of visualScreens) {
  if (!screen.referencePresent) unresolvedItems.push(`${screen.uiId} final P0 reference PNG missing`);
  if (!screen.actualPresent) unresolvedItems.push(`${screen.uiId} actual PNG missing`);
  if (!screen.diffPresent) unresolvedItems.push(`${screen.uiId} diff PNG missing`);
  if (!screen.metricsPresent) unresolvedItems.push(`${screen.uiId} metrics JSON missing`);
  if (typeof screen.diffRatio !== "number" || screen.diffRatio > 0.005) unresolvedItems.push(`${screen.uiId} diffRatio ${screen.diffRatio} exceeds 0.005 or is missing`);
  if (screen.missingCoreText.length > 0 || screen.missingRequiredControls.length > 0) unresolvedItems.push(`${screen.uiId} missing core text/control`);
}

const finalStatus = unresolvedItems.length === 0 ? "PASS" : "REPAIR_REQUIRED";
const result = {
  taskId: "T33",
  status: finalStatus,
  generatedAt: new Date().toISOString(),
  sourceOfTruth: "final-prd-v1.0",
  legacyP0Status: "DEMOTED",
  scope: "Final fail-closed UI one-to-one gate for AuraCue mini-program UI-01 through UI-12.",
  purePassAllowed: finalStatus === "PASS",
  finalDecisionBasis:
    finalStatus === "PASS"
      ? "All final P0 UI-01..UI-12 references, actual screenshots, diff images, metrics, thresholds, and scope guards are clean."
      : "Pure PASS is blocked because final P0 runtime screenshot/diff/metric evidence is missing or failing.",
  inputs: {
    scopeEvidence,
    finalP0Routes: p0RouteRegistry.map((route) => ({
      uiId: route.uiId,
      route: route.route,
      pagePath: route.pagePath,
      sourceReference: route.sourceReference
    })),
    demotedLegacyScope: [
      "legacy-unlock-pay-invite",
      "unlock/payment/invite screens",
      "free-preview paywall",
      "history",
      "trend",
      "profile"
    ]
  },
  visualGate: {
    status: visualSummary?.status ?? "MISSING",
    summaryPath: rel(visualSummaryPath),
    uiRange: "UI-01..UI-12",
    screenCount: visualScreens.length,
    actualPngCount: visualScreens.filter((screen) => screen.actualPresent).length,
    diffPngCount: visualScreens.filter((screen) => screen.diffPresent).length,
    metricsJsonCount: visualScreens.filter((screen) => screen.metricsPresent).length,
    threshold: 0.005,
    passingScreens: visualScreens.filter((screen) => screen.pass).length,
    failingScreens: visualScreens.filter((screen) => !screen.pass).length,
    screens: visualScreens
  },
  commandResults,
  unresolvedItems,
  changedFiles: [
    "scripts/t33-final-ui-one-to-one-gate.mjs",
    "docs/AUTO_EXECUTE_DELIVERY_REPORT.md",
    "docs/auto-execute/logs/T33/final-gate-summary.json",
    "docs/auto-execute/results/T33.json",
    "docs/auto-execute/latest/T33-HANDOFF.md"
  ],
  forbiddenActions: {
    legacyUi13ToUi18TreatedAsP0: false,
    passNeedsRuntimeScreenshotsPromotedToPurePass: false,
    missingEvidenceIgnored: false,
    diffEvidenceSkipped: false
  }
};

fs.writeFileSync(path.join(resultDir, "T33.json"), `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(path.join(logDir, "final-gate-summary.json"), `${JSON.stringify(result, null, 2)}\n`);

const report = `# AuraCue Auto-Execute Delivery Report

Generated by T33 on ${new Date().toISOString()}.

## Final Verdict

**${finalStatus}**

The final P0 mini-program visual scope is \`UI-01..UI-12\`. Legacy unlock, payment, invite, free-preview, history, trend, and profile screens are demoted from P0 and are not blockers for this gate.

Pure PASS is blocked until every final P0 target has actual PNG, diff PNG, pixel metrics JSON, and \`diffRatio <= 0.005\`.

## Visual Gate Summary

| UI | Route | Verdict | diffRatio | Evidence |
| --- | --- | --- | --- | --- |
${visualScreens.map((screen) => `| ${screen.uiId} | ${screen.route} | ${screen.finalScreenVerdict} | ${screen.diffRatio} | ${screen.metricsPath} |`).join("\n")}

## Unresolved Items

${unresolvedItems.length ? unresolvedItems.map((item) => `- ${item}`).join("\n") : "- None"}
`;

fs.writeFileSync(path.join(root, "docs", "AUTO_EXECUTE_DELIVERY_REPORT.md"), report);

const handoff = `# T33 HANDOFF

Status: ${finalStatus}

## Summary

T33 now gates the final P0 mini-program scope only: \`UI-01..UI-12\`. Old \`UI-13..UI-18\` unlock/payment/invite visual repair work is excluded unless product scope changes.

## Evidence

- Result JSON: \`docs/auto-execute/results/T33.json\`
- Gate summary: \`docs/auto-execute/logs/T33/final-gate-summary.json\`
- Visual summary: \`docs/auto-execute/screenshots/ui-one-to-one/T33/visual-summary.json\`
- Delivery report: \`docs/AUTO_EXECUTE_DELIVERY_REPORT.md\`

## Next Action

Generate actual PNG, diff PNG, and pixel metrics evidence for \`UI-01..UI-12\`, then rerun this final gate. Pure PASS remains forbidden until all 12 screens pass the threshold.
`;

fs.writeFileSync(path.join(latestDir, "T33-HANDOFF.md"), handoff);

console.log(JSON.stringify({ status: finalStatus, uiRange: "UI-01..UI-12", unresolvedItems: unresolvedItems.length }, null, 2));
process.exit(finalStatus === "PASS" ? 0 : 2);
