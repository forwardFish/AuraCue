import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const apiDir = resolve(root, "docs/auto-execute/api/web/T12");
const dbDir = resolve(root, "docs/auto-execute/db/web/T12");
mkdirSync(apiDir, { recursive: true });
mkdirSync(dbDir, { recursive: true });

const sources = {
  T03: {
    db: "docs/auto-execute/evidence/web/T03/db-readback.json"
  },
  T05: {
    api: "docs/auto-execute/evidence/web/T05/api-transcript.json",
    db: "docs/auto-execute/evidence/web/T05/db-readback.json"
  },
  T06: {
    api: "docs/auto-execute/evidence/web/T06/api-transcript.json",
    db: "docs/auto-execute/evidence/web/T06/db-readback.json",
    mock: "docs/auto-execute/evidence/web/T06/mock-transcript.json"
  },
  T07: {
    api: "docs/auto-execute/evidence/web/T07/api-transcript.json",
    db: "docs/auto-execute/evidence/web/T07/db-readback.json",
    renderer: "docs/auto-execute/evidence/web/T07/renderer-proof.json"
  }
};

const apiExpectations = [
  { id: "API-001", endpoint: "POST /api/v1/identity/anonymous", requiredCases: ["create", "idempotent", "invalid platform"] },
  { id: "API-002", endpoint: "GET /api/v1/aura-cards/today", requiredCases: ["not found", "empty", "active"] },
  { id: "API-003", endpoint: "POST /api/v1/uploads/outfit", requiredCases: ["image/jpeg", "image/png", "image/webp", "too large", "bad type"] },
  { id: "API-004", endpoint: "POST /api/v1/draw-sessions/start", requiredCases: ["missing mood", "no upload", "idempotent", "with upload", "upload not found"] },
  { id: "API-005", endpoint: "POST /api/v1/aura-cards/generate", requiredCases: ["missing drawPosition", "draw session not found", "mock fallback success", "idempotent"] },
  { id: "API-006", endpoint: "GET /api/v1/generation-jobs/:jobId", requiredCases: ["success readback", "not found"] },
  { id: "API-007", endpoint: "GET /api/v1/aura-cards/:cardId", requiredCases: ["success no secrets", "not found", "activation state readback"] },
  { id: "API-008", endpoint: "POST /api/v1/aura-cards/:cardId/render", requiredCases: ["invalid platform", "success 1080x1920", "idempotent"] },
  { id: "API-009", endpoint: "POST /api/v1/aura-cards/:cardId/activation/start", requiredCases: ["anchor required", "success", "idempotent"] },
  { id: "API-010", endpoint: "POST /api/v1/activations/:activationId/seal", requiredCases: ["hold too short", "wrong user", "success", "idempotent repeat"] },
  { id: "API-011", endpoint: "POST /api/v1/aura-cards/:cardId/save", requiredCases: ["not found", "success", "idempotent"] },
  { id: "API-012", endpoint: "POST /api/v1/aura-cards/:cardId/share", requiredCases: ["channel validation", "success"] },
  { id: "API-013", endpoint: "POST /api/v1/analytics/events", requiredCases: ["secret-like payload rejected", "event whitelist", "success"] }
];

const p0Models = [
  "AnonymousUser",
  "OutfitUpload",
  "DrawSession",
  "GenerationJob",
  "AuraCard",
  "AuraActivation",
  "SavedCard",
  "ShareEvent",
  "AnalyticsEvent",
  "CardTemplate"
];

const mutationModelsByApi = {
  "API-001": ["AnonymousUser"],
  "API-003": ["OutfitUpload"],
  "API-004": ["DrawSession"],
  "API-005": ["GenerationJob", "AuraCard"],
  "API-008": ["AuraCard"],
  "API-009": ["AuraActivation"],
  "API-010": ["AuraActivation", "AuraCard"],
  "API-011": ["SavedCard"],
  "API-012": ["ShareEvent"],
  "API-013": ["AnalyticsEvent"]
};

const loaded = loadSources(sources);
const allApiRows = [
  ...loaded.T05.api,
  ...loaded.T06.api,
  ...loaded.T07.api
];

const apiResults = apiExpectations.map((expectation) => {
  const rows = allApiRows.filter((row) => row.endpoint === expectation.endpoint);
  const presentCases = rows.map((row) => row.case);
  const missingCases = expectation.requiredCases.filter((required) => !presentCases.includes(required));
  const failuresWithoutCodes = rows.filter((row) => row.status >= 400 && !row.body?.error?.code);

  assert.equal(missingCases.length, 0, `${expectation.id} missing cases: ${missingCases.join(", ")}`);
  assert.equal(failuresWithoutCodes.length, 0, `${expectation.id} has failing cases without error.code`);

  return {
    id: expectation.id,
    endpoint: expectation.endpoint,
    status: "PASS",
    cases: rows.map((row) => ({
      name: row.case,
      httpStatus: row.status,
      ok: row.body?.ok,
      errorCode: row.body?.error?.code ?? null
    }))
  };
});

const modelEvidence = buildModelEvidence(loaded);
for (const model of p0Models) {
  assert.ok(modelEvidence[model]?.some((entry) => entry.count > 0), `${model} lacks positive readback evidence`);
}

const mutationReadback = {};
for (const [apiId, models] of Object.entries(mutationModelsByApi)) {
  mutationReadback[apiId] = models.map((model) => {
    const evidence = modelEvidence[model]?.filter((entry) => entry.count > 0) ?? [];
    assert.ok(evidence.length > 0, `${apiId} lacks ${model} readback`);
    return { model, evidence };
  });
}

assert.equal(loaded.T06.mock.noAiKeyUsed, true, "T06 mock fallback evidence must prove no AI key was used");
assert.equal(loaded.T07.renderer.width, 1080, "T07 renderer proof must be 1080 wide");
assert.equal(loaded.T07.renderer.height, 1920, "T07 renderer proof must be 1920 high");

const apiTranscript = {
  generatedAt: new Date().toISOString(),
  verdict: "PASS",
  coveredIds: apiExpectations.map((item) => item.id),
  sourceEvidence: Object.values(sources).flatMap((entry) => Object.values(entry)),
  endpoints: apiResults
};

const dbReadback = {
  generatedAt: new Date().toISOString(),
  verdict: "PASS",
  p0Models,
  modelEvidence,
  mutationReadback
};

const matrixSummary = {
  generatedAt: new Date().toISOString(),
  verdict: "PASS",
  coveredIds: apiExpectations.map((item) => item.id),
  apiTranscriptPath: "docs/auto-execute/api/web/T12/api-transcript.json",
  dbReadbackPath: "docs/auto-execute/db/web/T12/db-readback.json",
  negativeCasesHaveErrorCodes: true,
  mutationReadbackCovered: true
};

writeFileSync(resolve(apiDir, "api-transcript.json"), `${JSON.stringify(apiTranscript, null, 2)}\n`);
writeFileSync(resolve(dbDir, "db-readback.json"), `${JSON.stringify(dbReadback, null, 2)}\n`);
writeFileSync(resolve(apiDir, "matrix-summary.json"), `${JSON.stringify(matrixSummary, null, 2)}\n`);

console.log(JSON.stringify(matrixSummary, null, 2));

function loadSources(sourceMap) {
  return Object.fromEntries(Object.entries(sourceMap).map(([task, entries]) => [
    task,
    Object.fromEntries(Object.entries(entries).map(([kind, relativePath]) => {
      const fullPath = resolve(root, relativePath);
      assert.ok(existsSync(fullPath), `missing evidence file: ${relativePath}`);
      return [kind, JSON.parse(readFileSync(fullPath, "utf8"))];
    }))
  ]));
}

function buildModelEvidence(evidence) {
  const modelEvidence = Object.fromEntries(p0Models.map((model) => [model, []]));
  for (const [task, entry] of Object.entries(evidence)) {
    for (const [model, count] of Object.entries(entry.db.counts ?? {})) {
      if (modelEvidence[model]) {
        modelEvidence[model].push({ task, count, source: sources[task].db });
      }
    }
  }
  return modelEvidence;
}
