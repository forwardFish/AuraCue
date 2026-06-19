import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeEvidenceJson } from "../helpers/evidence.mjs";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/latest-ui-code");

const latestComponent = readFileSync(resolve(root, "components/latest-ui-pages.tsx"), "utf8");
const latestCss = readFileSync(resolve(root, "components/latest-ui.css"), "utf8");

assert.doesNotMatch(latestComponent, /aura-references|latest-reference-replica|replicaPages/, "latest UI must not render full-page reference images");

const routes = new Map([
  ["/result/[id]", ["app/result/[id]/page.tsx", "LatestResultPage"]],
  ["/activate/[id]", ["app/activate/[id]/page.tsx", "LatestActivatePage"]],
  ["/activated/[id]", ["app/activated/[id]/page.tsx", "LatestActivatedPage"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

for (const copy of [
  "Today's Ruling Planet",
  "Saturn",
  "Today's Aura",
  "Strength",
  "Soft Boundary",
  "Seal Today's Aura",
  "Hold to Seal",
  "Aura Sealed",
  "Share Story",
  "Save Card"
]) {
  assert.match(latestComponent.replaceAll("&apos;", "'"), new RegExp(escapeRegExp(copy)), `missing latest result/activation copy: ${copy}`);
}

for (const implementationSignal of [
  "onPointerDown={startHold}",
  "window.setTimeout",
  "holdMs",
  "saveHistory",
  "sealed: true"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(implementationSignal)), `missing activation implementation signal: ${implementationSignal}`);
}

for (const route of [
  "/activate/${demoCardId}",
  "/activated/${demoCardId}",
  "/share/${demoCardId}",
  "/saved/${demoCardId}"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(route)), `missing result/activation route: ${route}`);
}

for (const className of [".latest-result-planet", ".latest-aura-summary", ".latest-seal-orb", ".latest-sealed-hero", ".latest-hold"]) {
  assert.match(latestCss, new RegExp(escapeRegExp(className)), `missing latest result/activation style ${className}`);
}

writeEvidenceJson(resolve(evidenceDir, "result-activation-contract.json"), {
  status: "PASS",
  suite: "latest-ui-functional-result-activation",
  routes: [...routes.keys()]
});

console.log(JSON.stringify({
  status: "PASS",
  suite: "latest-ui-functional-result-activation",
  evidence: ["docs/auto-execute/evidence/web/latest-ui-code/result-activation-contract.json"]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
