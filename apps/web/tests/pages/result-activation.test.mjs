import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T10");
mkdirSync(evidenceDir, { recursive: true });

const component = readFileSync(resolve(root, "components/result-activation-flow.tsx"), "utf8");
const css = readFileSync(resolve(root, "app/globals.css"), "utf8");

const routes = new Map([
  ["/result/[id]", ["app/result/[id]/page.tsx", "ResultPageFlow"]],
  ["/activate/[id]", ["app/activate/[id]/page.tsx", "ActivatePageFlow"]],
  ["/activated/[id]", ["app/activated/[id]/page.tsx", "ActivatedPageFlow"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

for (const [id, call] of [
  ["API-007", "getAuraCard"],
  ["API-008", "renderAuraCard"],
  ["API-009", "startActivation"],
  ["API-010", "sealActivation"],
  ["API-011", "saveCard"],
  ["API-012", "shareCard"]
]) {
  assert.match(component, new RegExp(`apiClient\\.${call}\\(`), `${id} should call ${call}`);
}

for (const copy of [
  "Your Aura Card is ready.",
  "Activate My Aura",
  "Seal today's aura.",
  "Hold 3s to Seal",
  "Release before 3 seconds to cancel.",
  "Aura activated.",
  "Save",
  "Share",
  "Done"
]) {
  assert.match(component, new RegExp(escapeRegExp(copy)), `missing required copy: ${copy}`);
}

assert.match(component, /holdToSealDurationMs = 3000/, "hold threshold should be exactly 3000ms");
assert.match(component, /window\.setTimeout\(\(\) => \{[\s\S]*holdToSealDurationMs/, "hold completion should use a timer, not CSS only");
assert.match(component, /onPointerDown=\{startHold\}/, "hold button should support pointer/mouse/touch start");
assert.match(component, /onPointerUp=\{cancelHold\}/, "hold button should cancel on release");
assert.match(component, /onPointerCancel=\{cancelHold\}/, "hold button should cancel pointer cancellation");
assert.match(component, /onPointerLeave=\{cancelHold\}/, "hold button should cancel pointer leave");
assert.match(component, /router\.replace\(`\/activated\/\$\{cardId\}`\)/, "already activated guard should redirect to activated page");
assert.match(component, /router\.push\(`\/activated\/\$\{sealed\.cardId\}`\)/, "seal success should navigate to activated page");
assert.doesNotMatch(component, /pay|payment|unlock|invite/i, "T10 pages must not expose paywall copy");

for (const className of [
  ".auracue-result-card",
  ".auracue-hold-seal",
  ".auracue-seal-card",
  ".auracue-link-action"
]) {
  assert.match(css, new RegExp(escapeRegExp(className)), `missing style ${className}`);
}

writeFileSync(resolve(evidenceDir, "page-contract.json"), JSON.stringify({
  status: "PASS",
  suite: "result-activation-pages",
  covered: ["UI-005", "UI-006", "UI-007", "API-007", "API-008", "API-009", "API-010", "API-011", "API-012", "Owner-004"]
}, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  suite: "result-activation-pages",
  evidence: ["docs/auto-execute/evidence/web/T10/page-contract.json"]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
