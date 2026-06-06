import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T09");
mkdirSync(evidenceDir, { recursive: true });

const component = readFileSync(resolve(root, "components/create-flow.tsx"), "utf8");
const visibleComponentText = component.replaceAll("&apos;", "'");
const routes = new Map([
  ["/", ["app/page.tsx", "MoodHome"]],
  ["/create/context", ["app/create/context/page.tsx", "ContextPageFlow"]],
  ["/create/upload", ["app/create/upload/page.tsx", "UploadPageFlow"]],
  ["/create/draw", ["app/create/draw/page.tsx", "DrawPageFlow"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

assert.equal((component.match(/\{ id: "/g) || []).length, 8, "home should define 8 mood cards");
for (const label of ["Date", "Work", "Party", "Interview", "Travel", "Just for luck"]) {
  assert.match(component, new RegExp(`"${label}"`), `context option ${label} should exist`);
}
for (const copy of [
  "How do you want to feel today?",
  "Pick one mood and we'll turn it into your lucky aura card.",
  "Start My Aura Card",
  "Today's Aura Active",
  "What is today for?",
  "Add today's outfit?",
  "Choose the card that calls you.",
  "Tap one card to draw today's aura.",
  "Reveal My Aura",
  "Revealing your aura..."
]) {
  assert.match(visibleComponentText, new RegExp(escapeRegExp(copy)), `missing required copy: ${copy}`);
}

const requiredApiCalls = [
  ["API-001", "createAnonymousIdentity"],
  ["API-002", "getTodayCard"],
  ["API-003", "uploadOutfit"],
  ["API-004", "startDrawSession"],
  ["API-005", "startGeneration"]
];
for (const [id, call] of requiredApiCalls) {
  assert.match(component, new RegExp(`apiClient\\.${call}\\(`), `${id} should call ${call}`);
}

for (const guard of ["router.replace(\"/\")", "!draft.mood"]) {
  assert.match(component, new RegExp(escapeRegExp(guard)), `missing mood guard ${guard}`);
}
assert.match(component, /acceptedUploadTypes/, "upload should prevalidate file type");
assert.match(component, /maxUploadBytes/, "upload should prevalidate file size");
assert.match(component, /skipUpload/, "upload failure path should allow Skip");
assert.match(component, /status === "error"/, "upload error state should be visible");
assert.match(component, /!session \|\| !draft\.drawPosition \|\| generating/, "draw reveal should require selected card and prevent duplicate submits");
assert.match(component, /drawPosition: draft\.drawPosition/, "generation payload should send selected drawPosition");
assert.match(component, /router\.push\(`\/result\/\$\{generation\.cardId\}`\)/, "generation success should navigate to result card");
assert.match(component, /track\("click_start_card"/, "home CTA should emit click_start_card analytics");
assert.match(readFileSync(resolve(root, "lib/analytics.js"), "utf8"), /"click_start_card"/, "analytics whitelist should include click_start_card");
assert.doesNotMatch(component, /pay|payment|unlock|invite/i, "T09 pages must not expose paywall copy");

const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
for (const className of [
  ".auracue-mood-grid",
  ".auracue-upload-zone",
  ".auracue-card-row",
  ".auracue-draw-card",
  ".auracue-inline-state--error"
]) {
  assert.match(css, new RegExp(escapeRegExp(className)), `missing style ${className}`);
}

const screenshotTargets = {
  taskId: "T09",
  status: "TARGETS_DEFINED",
  owner: "T13/T14/T15 runtime capture",
  targets: [
    "screenshots/web/T14/UI-001-home-mood.png",
    "screenshots/web/T14/UI-002-context.png",
    "screenshots/web/T14/UI-003-upload-success-error-skip.png",
    "screenshots/web/T14/UI-004-draw-selected-generating.png",
    "screenshots/web/T14/UI-010-draw-generation-error.png"
  ]
};
writeFileSync(resolve(evidenceDir, "screenshot-targets.json"), JSON.stringify(screenshotTargets, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  suite: "create-flow-pages",
  covered: ["UI-001", "UI-002", "UI-003", "UI-004", "UI-010", "API-001", "API-002", "API-003", "API-004", "API-005"],
  evidence: ["docs/auto-execute/evidence/web/T09/screenshot-targets.json"]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
