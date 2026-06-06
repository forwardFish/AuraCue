import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertSafeLocalCopy } from "../../../packages/prompt-core/src/local-generator.mjs";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer } from "../src/server.mjs";

const originalAiEnv = {
  AI_API_KEY: process.env.AI_API_KEY,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
  DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
  AI_MODEL: process.env.AI_MODEL,
  DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL
};

function restoreAiEnv() {
  for (const [key, value] of Object.entries(originalAiEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function clearAiEnv() {
  for (const key of Object.keys(originalAiEnv)) {
    delete process.env[key];
  }
}

clearAiEnv();

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

const success = await requestJson("/api/generation-jobs", {
  method: "POST",
  body: JSON.stringify({ scene: "date", energy: "confidence" })
});
assert.equal(success.status, 201);
assert.equal(success.body.status, "success");
assert.ok(success.body.jobId);
assert.ok(success.body.cardId);
assert.equal(success.body.generationSource, "local-fallback");
assert.equal(success.body.aiProvider.hasApiKey, false);

const successRead = await requestJson(`/api/generation-jobs/${success.body.jobId}`);
assert.equal(successRead.status, 200);
assert.equal(successRead.body.status, "success");
assert.equal(successRead.body.cardId, success.body.cardId);

const pending = await requestJson("/api/generation-jobs", {
  method: "POST",
  body: JSON.stringify({ scene: "work", energy: "focus", autoComplete: false })
});
assert.equal(pending.status, 201);
assert.equal(pending.body.status, "pending");

const pendingRead = await requestJson(`/api/generation-jobs/${pending.body.jobId}`);
assert.equal(pendingRead.status, 200);
assert.equal(pendingRead.body.status, "pending");
assert.equal(pendingRead.body.cardId, null);

const validation = await requestJson("/api/generation-jobs", {
  method: "POST",
  body: JSON.stringify({ scene: "unknown", energy: "confidence" })
});
assert.equal(validation.status, 400);
assert.equal(validation.body.error.code, "VALIDATION_ERROR");

const failure = await requestJson("/api/generation-jobs", {
  method: "POST",
  body: JSON.stringify({ scene: "luck", energy: "calm", forceFailure: true })
});
assert.equal(failure.status, 503);
assert.equal(failure.body.error.code, "LOCAL_GENERATION_FAILURE");
assert.ok(failure.body.error.details.jobId);

const failureRead = await requestJson(`/api/generation-jobs/${failure.body.error.details.jobId}`);
assert.equal(failureRead.status, 200);
assert.equal(failureRead.body.status, "failed");
assert.equal(failureRead.body.errorCode, "LOCAL_GENERATION_FAILURE");

const notFound = await requestJson("/api/generation-jobs/job-does-not-exist");
assert.equal(notFound.status, 404);
assert.equal(notFound.body.error.code, "NOT_FOUND");

const generatedCard = repository.readAuraCard(success.body.cardId);
const structuredFields = [
  "title",
  "auraName",
  "tarotSymbol",
  "message",
  "luckyColor",
  "colors",
  "outfit",
  "beauty",
  "social",
  "ritual",
  "avoid",
  "caption",
  "theme"
];
for (const field of structuredFields) {
  assert.notEqual(generatedCard.content[field], undefined, `Missing structured field: ${field}`);
}
assert.equal(generatedCard.isUnlocked, false);
assert.equal(generatedCard.jobId, success.body.jobId);
assert.equal(assertSafeLocalCopy(generatedCard.content).safe, true);

server.close();

process.env.DEEPSEEK_API_KEY = "unit-test-key";
process.env.DEEPSEEK_BASE_URL = "https://deepseek.example.test";
process.env.DEEPSEEK_MODEL = "unit-test-model";
let aiCalls = 0;
const aiRepository = createLocalRepository();
const aiServer = createServer({
  repository: aiRepository,
  aiFetch: async (url, init) => {
    aiCalls += 1;
    assert.equal(url, "https://deepseek.example.test/chat/completions");
    assert.equal(init.headers.authorization, "Bearer unit-test-key");
    const requestBody = JSON.parse(init.body);
    assert.equal(requestBody.model, "unit-test-model");
    assert.deepEqual(requestBody.response_format, { type: "json_object" });
    assert.match(requestBody.messages[0].content, /strict JSON/);
    assert.match(requestBody.messages[1].content, /Scene id: work/);
    assert.match(requestBody.messages[1].content, /Energy id: calm/);
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            title: "Calm Signal Aura Card",
            auraName: "Silver Harbor Aura",
            tarotSymbol: "Temperance",
            message: "A steady choice can make the next conversation easier.",
            luckyColor: "silver blue",
            colors: {
              primary: "silver blue",
              accent: "soft jade",
              background: "morning mist"
            },
            outfit: "Choose a clean shape with one soft layer.",
            beauty: "Keep the finish fresh and comfortable.",
            social: "Open with the clearest useful point.",
            ritual: "Take one slow breath before you answer.",
            avoid: "Avoid rushing to fill every pause.",
            caption: "Today I am carrying Silver Harbor Aura.",
            theme: "work-calm-ai"
          })
        }
      }]
    }), { status: 200 });
  }
});
await new Promise((resolve) => aiServer.listen(0, "127.0.0.1", resolve));
const aiPort = aiServer.address().port;
const aiResponse = await fetch(`http://127.0.0.1:${aiPort}/api/generation-jobs`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ scene: "work", energy: "calm", locale: "en-US" })
});
const aiBody = await aiResponse.json();
aiServer.close();
assert.equal(aiResponse.status, 201);
assert.equal(aiBody.generationSource, "ai");
assert.equal(aiBody.aiProvider.hasApiKey, true);
assert.equal(aiBody.aiProvider.model, "unit-test-model");
assert.equal(JSON.stringify(aiBody).includes("unit-test-key"), false);
assert.equal(aiCalls, 1);
const aiGeneratedCard = aiRepository.readAuraCard(aiBody.cardId);
assert.equal(aiGeneratedCard.content.auraName, "Silver Harbor Aura");
assert.equal(aiGeneratedCard.content.theme, "work-calm-ai");

const fallbackRepository = createLocalRepository();
const fallbackServer = createServer({
  repository: fallbackRepository,
  aiFetch: async () => new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify({ title: "Missing fields" }) } }]
  }), { status: 200 })
});
await new Promise((resolve) => fallbackServer.listen(0, "127.0.0.1", resolve));
const fallbackPort = fallbackServer.address().port;
const fallbackResponse = await fetch(`http://127.0.0.1:${fallbackPort}/api/generation-jobs`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ scene: "party", energy: "charm" })
});
const fallbackBody = await fallbackResponse.json();
fallbackServer.close();
assert.equal(fallbackResponse.status, 201);
assert.equal(fallbackBody.generationSource, "local-fallback");
assert.ok(fallbackBody.cardId);
assert.equal(fallbackRepository.readAuraCard(fallbackBody.cardId).content.theme, "party-charm-local");

restoreAiEnv();

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const apiEvidenceDir = resolve(projectRoot, "docs/auto-execute/api/T04");
const dbEvidenceDir = resolve(projectRoot, "docs/auto-execute/db/T04");
await mkdir(apiEvidenceDir, { recursive: true });
await mkdir(dbEvidenceDir, { recursive: true });

const apiEvidence = {
  status: "PASS",
  apiCases: {
    "API-001-C01-success": { status: "PASS", response: success.body },
    "API-001-C02-validation": { status: "PASS", response: validation.body },
    "API-001-C03-fallback": { status: "PASS", response: failure.body },
    "API-002-C01-success": { status: "PASS", response: successRead.body },
    "API-002-C01-pending": { status: "PASS", response: pendingRead.body },
    "API-002-C01-failure": { status: "PASS", response: failureRead.body },
    "API-002-C02-not-found": { status: "PASS", response: notFound.body }
  },
  localOnly: {
    aiProvider: "deepseek-with-local-fallback",
    fallbackWithoutKey: success.body.generationSource === "local-fallback",
    fakeAiCall: aiBody.generationSource === "ai",
    secretInResponse: false
  }
};

const dbReadback = {
  status: "PASS",
  jobReadbacks: {
    success: repository.readGenerationJob(success.body.jobId),
    pending: repository.readGenerationJob(pending.body.jobId),
    failed: repository.readGenerationJob(failure.body.error.details.jobId)
  },
  cardReadback: generatedCard,
  structuredFields,
  copySafety: assertSafeLocalCopy(generatedCard.content)
};

await writeFile(`${apiEvidenceDir}/generation-api.json`, JSON.stringify(apiEvidence, null, 2));
await writeFile(`${dbEvidenceDir}/generation-readback.json`, JSON.stringify(dbReadback, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/api/T04/generation-api.json",
    "docs/auto-execute/db/T04/generation-readback.json"
  ]
}, null, 2));
