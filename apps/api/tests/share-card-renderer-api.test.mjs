import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer, healthPayload } from "../src/server.mjs";

const repository = createLocalRepository();
const server = createServer({ repository });

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {})
    }
  });
  const body = await response.json();
  return { status: response.status, body };
}

const render = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "story-9x16" })
});
const repeatRender = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "story-9x16" })
});
const invalidTemplate = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "missing-template", format: "story-9x16" })
});
const invalidFormat = await requestJson("/api/share-images/card-unlocked-001", {
  method: "POST",
  body: JSON.stringify({ templateId: "template-story-001", format: "square" })
});

server.close();

assert.equal(render.status, 200);
assert.equal(render.body.cardId, "card-unlocked-001");
assert.equal(render.body.width, 1080);
assert.equal(render.body.height, 1920);
assert.equal(render.body.aspectRatio, "9:16");
assert.equal(render.body.artifactKind, "svg-data-url");
assert(render.body.dataUrl.startsWith("data:image/svg+xml;base64,"));
assert.equal(render.body.textFields.auraName, "Golden Comet Aura");
assert.equal(render.body.textFields.luckyColor, "warm gold");
assert.equal(repeatRender.status, 200);
assert.equal(repeatRender.body.dataUrlSha256, render.body.dataUrlSha256);
assert.equal(repository.readRenderedShareImage("card-unlocked-001").persistedOnCard, true);
assert.equal(invalidTemplate.status, 404);
assert.equal(invalidTemplate.body.error.code, "NOT_FOUND");
assert.equal(invalidFormat.status, 400);
assert.equal(invalidFormat.body.error.code, "VALIDATION_ERROR");

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidenceDir = resolve(projectRoot, "docs/auto-execute/api/T17");
const evidence = {
  status: "PASS",
  taskId: "T17",
  apiId: "API-009",
  endpoint: "POST /api/share-images/:cardId",
  cases: {
    "API-009-C01-render": { status: "PASS", response: render.body },
    "API-009-deterministic-repeat": {
      status: "PASS",
      firstHash: render.body.dataUrlSha256,
      secondHash: repeatRender.body.dataUrlSha256
    },
    "API-009-template-not-found": { status: "PASS", response: invalidTemplate.body },
    "API-009-validation": { status: "PASS", response: invalidFormat.body }
  },
  readback: repository.readRenderedShareImage("card-unlocked-001"),
  localOnly: {
    renderer: render.body.renderer,
    storage: healthPayload().services.storage,
    cloudStorageWriteUsed: false,
    paidImageApiUsed: false
  }
};

await mkdir(evidenceDir, { recursive: true });
await writeFile(resolve(evidenceDir, "render-api.json"), JSON.stringify(evidence, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: ["docs/auto-execute/api/T17/render-api.json"]
}, null, 2));
