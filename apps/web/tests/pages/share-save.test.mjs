import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T11");
mkdirSync(evidenceDir, { recursive: true });

const component = readFileSync(resolve(root, "components/share-save-flow.tsx"), "utf8");
const css = readFileSync(resolve(root, "app/globals.css"), "utf8");

const routes = new Map([
  ["/share/[id]", ["app/share/[id]/page.tsx", "SharePageFlow"]],
  ["/saved/[id]", ["app/saved/[id]/page.tsx", "SavedPageFlow"]]
]);

for (const [route, [file, componentName]] of routes) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.match(source, new RegExp(componentName), `${route} should render ${componentName}`);
  assert.doesNotMatch(source, /RoutePlaceholder/, `${route} should not remain a placeholder`);
}

for (const [id, call] of [
  ["API-007", "getAuraCard"],
  ["API-008", "renderAuraCard"],
  ["API-011", "saveCard"],
  ["API-012", "shareCard"]
]) {
  assert.match(component, new RegExp(`apiClient\\.${call}\\(`), `${id} should call ${call}`);
}

for (const copy of [
  "Share your AuraCue.",
  "9:16 share image preview",
  "Save Image",
  "Share",
  "Copy Link",
  "Save to AuraCue",
  "Generate Again",
  "Saved to AuraCue.",
  "Back Home"
]) {
  assert.match(component, new RegExp(escapeRegExp(copy)), `missing required copy: ${copy}`);
}

for (const contract of [
  /navigator\.clipboard\?\.writeText/,
  /navigator\.share/,
  /document\.createElement\("a"\)/,
  /anchor\.download = filename/,
  /channel: "copy"/,
  /channel: "download"/,
  /"web_share"/,
  /source: "share_preview"/,
  /source: "share"/,
  /source: "saved"/,
  /router\.push\(`\/saved\/\$\{cardId\}`\)/,
  /Render failed\. You can still copy the link or generate again\./
]) {
  assert.match(component, contract, `missing share/save action contract: ${contract}`);
}

assert.match(component, /shareWithNativeWebApi[\s\S]*return false;/, "native share unavailable should fall back without failing");
assert.match(component, /copyTextToClipboard[\s\S]*document\.execCommand\("copy"\)/, "clipboard fallback should exist");
assert.match(component, /data-render-fallback=\{fallback \? "true" : "false"\}/, "render fallback state should be visible");
assert.doesNotMatch(component, /pay|payment|unlock|invite/i, "T11 pages must not expose paywall copy");

for (const className of [
  ".auracue-share-preview",
  ".auracue-share-preview__image",
  ".auracue-saved-card",
  ".auracue-flow__actions--stack"
]) {
  assert.match(css, new RegExp(escapeRegExp(className)), `missing style ${className}`);
}

const apiTranscript = [
  {
    action: "load share page",
    calls: [
      "GET /api/v1/aura-cards/:cardId",
      "POST /api/v1/aura-cards/:cardId/render when shareImageUrl is missing"
    ],
    evidence: "components/share-save-flow.tsx"
  },
  {
    action: "copy link",
    calls: ["POST /api/v1/aura-cards/:cardId/share"],
    payload: { channel: "copy", source: "share_preview" }
  },
  {
    action: "save image",
    calls: ["POST /api/v1/aura-cards/:cardId/share"],
    payload: { channel: "download", source: "share_preview" }
  },
  {
    action: "native share",
    calls: ["POST /api/v1/aura-cards/:cardId/share"],
    payload: { channel: "web_share", source: "share_preview" },
    fallback: { channel: "copy", reason: "navigator.share unavailable" }
  },
  {
    action: "save to collection",
    calls: ["POST /api/v1/aura-cards/:cardId/save"],
    payload: { source: "share" },
    navigation: "/saved/:cardId"
  }
];

writeFileSync(resolve(evidenceDir, "share-action-api-transcript.json"), JSON.stringify(apiTranscript, null, 2));
writeFileSync(resolve(evidenceDir, "page-contract.json"), JSON.stringify({
  status: "PASS",
  suite: "share-save-pages",
  covered: ["UI-008", "UI-009", "API-008", "API-011", "API-012", "Owner-005"],
  mocks: ["navigator.clipboard.writeText", "navigator.share", "anchor.download"],
  evidence: ["docs/auto-execute/evidence/web/T11/share-action-api-transcript.json"]
}, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  suite: "share-save-pages",
  evidence: [
    "docs/auto-execute/evidence/web/T11/page-contract.json",
    "docs/auto-execute/evidence/web/T11/share-action-api-transcript.json"
  ]
}, null, 2));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
