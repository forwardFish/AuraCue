import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeEvidenceJson } from "../helpers/evidence.mjs";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/latest-ui-code");

const latestComponent = readFileSync(resolve(root, "components/latest-ui-pages.tsx"), "utf8");
const latestCss = readFileSync(resolve(root, "components/latest-ui.css"), "utf8");

assert.doesNotMatch(latestComponent, /aura-references|latest-reference-replica|replicaPages/, "latest UI must not render full-page reference images");
assert.doesNotMatch(latestCss, /latest-reference-replica/, "latest UI CSS must not keep reference-image replica styles");

const routes = new Map([
  ["/", ["app/page.tsx", "LatestHomePage"]],
  ["/home", ["app/home/page.tsx", "LatestHomePage"]],
  ["/onboarding/birth-aura", ["app/onboarding/birth-aura/page.tsx", "LatestBirthdayPage"]],
  ["/onboarding/birth-aura/reveal", ["app/onboarding/birth-aura/reveal/page.tsx", "LatestBirthRevealPage"]],
  ["/today/check-in", ["app/today/check-in/page.tsx", "LatestCheckInPage"]],
  ["/today/draw", ["app/today/draw/page.tsx", "LatestDrawPage"]],
  ["/today/reading", ["app/today/reading/page.tsx", "LatestReadingPage"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

for (const copy of [
  "Start My First Aura",
  "Enter Your Birthday",
  "Your Birth Aura is",
  "Venus Air",
  "How are you arriving today?",
  "What is today asking from you?",
  "Choose the card",
  "Your reading begins.",
  "Your message is clear.",
  "Your reading unfolds."
]) {
  assert.match(latestComponent.replaceAll("&apos;", "'"), new RegExp(escapeRegExp(copy)), `missing latest UI copy: ${copy}`);
}

for (const route of [
  "/onboarding/birth-aura",
  "/onboarding/birth-aura/reveal",
  "/today/check-in",
  "/today/draw",
  "/today/reading",
  "/result/${oracle.cardId || demoCardId}"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(route)), `missing latest flow route: ${route}`);
}

for (const implementationSignal of [
  "useState",
  "localStorage",
  "apiClient.getHomeContent",
  "apiClient.createAnonymousIdentity",
  "apiClient.startDrawSession",
  "apiClient.generateAuraCard",
  "apiClient.getAuraCard",
  "generateOracleFromApi",
  "<select",
  "aria-pressed={mood === label}",
  "aria-pressed={selectedCard === label}",
  "advanceReading"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(implementationSignal)), `missing real UI implementation signal: ${implementationSignal}`);
}

for (const fontSignal of [
  "AuraCue Cormorant",
  "AuraCue Inter",
  "cormorant-garamond-v21-latin-600.ttf",
  "inter-v20-latin-600.ttf"
]) {
  assert.match(latestCss, new RegExp(escapeRegExp(fontSignal)), `missing latest UI font signal: ${fontSignal}`);
}

for (const asset of [
  "home-saturn-planet-hero-card.png",
  "birth-reveal-guardian-libra.png",
  "p0-05-tarot-card-back-clean.png",
  "mood-drained-drop.png",
  "intent-work-study-book.png"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(asset)), `missing UI asset reference ${asset}`);
}

assert.match(latestCss, /home-trait-pill-frame\.png/, "missing latest UI trait pill frame CSS asset");

for (const className of [
  ".latest-phone",
  ".latest-planet-hero",
  ".latest-panel",
  ".latest-card-stage",
  ".latest-orbit"
]) {
  assert.match(latestCss, new RegExp(escapeRegExp(className)), `missing latest UI style ${className}`);
}

writeEvidenceJson(resolve(evidenceDir, "page-contract.json"), {
  status: "PASS",
  suite: "latest-ui-functional-flow",
  sourceOfTruth: "docs/AuraCue_FINAL_Page_Flow_Design_Spec_v4.1.md",
  routes: [...routes.keys()]
});

console.log(JSON.stringify({
  status: "PASS",
  suite: "latest-ui-functional-flow",
  evidence: ["docs/auto-execute/evidence/web/latest-ui-code/page-contract.json"]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
