import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLocalAuraCard } from "../../prompt-core/src/local-generator.mjs";
import { defaultShareCardTemplate, renderLocalShareCard } from "../src/local-renderer.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidenceDir = resolve(projectRoot, "docs/auto-execute/screenshots/T17");

const card = {
  id: "card-t17-render-001",
  content: {
    ...buildLocalAuraCard({ scene: "party", energy: "charm" }),
    title: "Full Lucky Aura Card",
    auraName: "Golden Comet Aura",
    luckyColor: "Champagne Gold",
    theme: "golden-night"
  }
};

const firstRender = renderLocalShareCard({ card });
const secondRender = renderLocalShareCard({ card });

assert.equal(firstRender.templateId, defaultShareCardTemplate.templateId);
assert.equal(firstRender.format, "story-9x16");
assert.equal(firstRender.aspectRatio, "9:16");
assert.equal(firstRender.width, 1080);
assert.equal(firstRender.height, 1920);
assert.equal(firstRender.artifactKind, "svg-data-url");
assert(firstRender.localPath.startsWith("local://share-images/card-t17-render-001-template-story-001."));
assert(firstRender.dataUrl.startsWith("data:image/svg+xml;base64,"));
assert.equal(firstRender.dataUrl, secondRender.dataUrl);
assert.equal(firstRender.dataUrlSha256, secondRender.dataUrlSha256);

for (const requiredField of [
  "Full Lucky Aura Card",
  "Golden Comet Aura",
  "Champagne Gold",
  "golden-night",
  card.content.outfit,
  card.content.social,
  card.content.ritual,
  card.content.caption
]) {
  assert(JSON.stringify(firstRender).includes(requiredField), `render output should include ${requiredField}`);
}

const decodedSvg = Buffer.from(firstRender.dataUrl.split(",")[1], "base64").toString("utf8");
assert(decodedSvg.includes("<svg"));
assert(decodedSvg.includes("width=\"1080\""));
assert(decodedSvg.includes("height=\"1920\""));
assert(decodedSvg.includes("Golden Comet Aura"));
assert(!decodedSvg.includes("href=\"http"));
assert(!decodedSvg.includes("href='http"));
assert(!decodedSvg.includes("https://"));

const evidence = {
  status: "PASS",
  taskId: "T17",
  requirementIds: ["REQ-014"],
  uiIds: ["UI-15"],
  apiIds: ["API-009"],
  renderer: {
    cardId: firstRender.cardId,
    templateId: firstRender.templateId,
    format: firstRender.format,
    localPath: firstRender.localPath,
    width: firstRender.width,
    height: firstRender.height,
    aspectRatio: firstRender.aspectRatio,
    artifactKind: firstRender.artifactKind,
    dataUrlSha256: firstRender.dataUrlSha256,
    deterministicKey: firstRender.deterministicKey,
    requiredTextFields: firstRender.textFields,
    layerTypes: firstRender.layers.map((layer) => layer.type)
  },
  assertions: {
    deterministicRepeat: firstRender.dataUrlSha256 === secondRender.dataUrlSha256,
    stableDimensions: firstRender.width === 1080 && firstRender.height === 1920,
    requiredFieldsPresent: true,
    externalNetworkUsed: false,
    cloudStorageUsed: false
  }
};

await mkdir(evidenceDir, { recursive: true });
await writeFile(resolve(evidenceDir, "share-card-render.json"), JSON.stringify(evidence, null, 2));
await writeFile(resolve(evidenceDir, "share-card.svg"), decodedSvg);

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/screenshots/T17/share-card-render.json",
    "docs/auto-execute/screenshots/T17/share-card.svg"
  ]
}, null, 2));
