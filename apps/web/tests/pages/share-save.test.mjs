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
  ["/share/[id]", ["app/share/[id]/page.tsx", "LatestSharePage"]],
  ["/saved/[id]", ["app/saved/[id]/page.tsx", "LatestSavedPage"]],
  ["/my", ["app/my/page.tsx", "LatestMyPage"]],
  ["/my/birth-aura", ["app/my/birth-aura/page.tsx", "LatestBirthProfilePage"]],
  ["/error/network", ["app/error/network/page.tsx", "LatestErrorPage"]],
  ["/retry", ["app/retry/page.tsx", "LatestErrorPage"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

for (const copy of [
  "Share Today's Aura",
  "9:16 Share Card Preview",
  "Saved",
  "View My Aura",
  "My Aura",
  "Aura History",
  "Birth Aura",
  "Your aura slipped away",
  "Change Context"
]) {
  assert.match(latestComponent.replaceAll("&apos;", "'"), new RegExp(escapeRegExp(copy)), `missing latest share/save/my/error copy: ${copy}`);
}

for (const implementationSignal of [
  "setMessage",
  "Copy Link complete",
  "Download image prepared",
  "saved: true",
  "storageKeys.history",
  "Edit Birthday"
]) {
  assert.match(latestComponent, new RegExp(escapeRegExp(implementationSignal)), `missing share/save/my implementation signal: ${implementationSignal}`);
}

for (const className of [".latest-story-card", ".latest-profile-card", ".latest-history", ".latest-error-card"]) {
  assert.match(latestCss, new RegExp(escapeRegExp(className)), `missing latest share/save/my/error style ${className}`);
}

writeEvidenceJson(resolve(evidenceDir, "share-save-my-error-contract.json"), {
  status: "PASS",
  suite: "latest-ui-functional-share-save-my-error",
  routes: [...routes.keys()]
});

console.log(JSON.stringify({
  status: "PASS",
  suite: "latest-ui-functional-share-save-my-error",
  evidence: ["docs/auto-execute/evidence/web/latest-ui-code/share-save-my-error-contract.json"]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
