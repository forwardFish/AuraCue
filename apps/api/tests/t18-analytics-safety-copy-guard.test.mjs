import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  analyticsEventCoverage,
  analyticsEvents,
  missingRequiredAnalyticsEvents,
  prdRequiredAnalyticsEvents
} from "../../../packages/analytics-events/src/event-contract.mjs";
import { validateAnalyticsEventInput } from "../../../packages/analytics-events/src/local-validator.mjs";
import { buildLocalAuraCard, validEnergies, validScenes } from "../../../packages/prompt-core/src/local-generator.mjs";
import { scanCopySafety } from "../../../packages/prompt-core/src/safety-copy-guard.mjs";
import { createLocalRepository } from "../src/local-repository.mjs";
import { createServer, healthPayload } from "../src/server.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const traceDir = resolve(projectRoot, "docs/auto-execute/traces/T18");
const logDir = resolve(projectRoot, "docs/auto-execute/logs/T18");
const apiDir = resolve(projectRoot, "docs/auto-execute/api/T18");
await mkdir(traceDir, { recursive: true });
await mkdir(logDir, { recursive: true });
await mkdir(apiDir, { recursive: true });

const repository = createLocalRepository();
const server = createServer({ repository });
await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
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

const contractMissing = missingRequiredAnalyticsEvents(analyticsEvents);
assert.deepEqual(contractMissing, []);
for (const eventName of prdRequiredAnalyticsEvents) {
  assert.equal(validateAnalyticsEventInput({ eventName, page: "/", properties: { taskId: "T18" } }), null);
  assert(analyticsEventCoverage[eventName], `Missing coverage metadata for ${eventName}`);
}

const apiEventTranscripts = [];
for (const eventName of prdRequiredAnalyticsEvents) {
  const response = await requestJson("/api/analytics-events", {
    method: "POST",
    body: JSON.stringify({
      eventName,
      page: eventName === "page_view_home" ? "/" : analyticsEventCoverage[eventName].surface.includes("API") ? "/api/local-flow" : "/local-flow",
      properties: {
        requirementId: "REQ-017",
        taskId: "T18",
        flow: analyticsEventCoverage[eventName].flow
      }
    })
  });
  assert.equal(response.status, 202, `API-010 should accept ${eventName}`);
  apiEventTranscripts.push({ eventName, status: response.status, response: response.body });
}

const invalidEvent = await requestJson("/api/analytics-events", {
  method: "POST",
  body: JSON.stringify({ eventName: "send_to_production_analytics", page: "/bad", properties: {} })
});
assert.equal(invalidEvent.status, 400);

const secretProperty = await requestJson("/api/analytics-events", {
  method: "POST",
  body: JSON.stringify({ eventName: "page_view_home", page: "/", properties: { client_secret: "nope" } })
});
assert.equal(secretProperty.status, 400);

const generatedCards = [];
for (const scene of validScenes) {
  for (const energy of validEnergies) {
    generatedCards.push({ scene, energy, card: buildLocalAuraCard({ scene, energy }) });
  }
}

const staticCopyFiles = [
  "apps/wechat-mini/src/pages/home/home-page.mjs",
  "apps/wechat-mini/src/pages/create/scene-page.mjs",
  "apps/wechat-mini/src/pages/create/energy-page.mjs",
  "apps/wechat-mini/src/pages/create/loading-page.mjs",
  "apps/wechat-mini/src/pages/result/free-preview-page.mjs",
  "apps/wechat-mini/src/pages/result/full-page.mjs",
  "apps/wechat-mini/src/pages/unlock/unlock-invite-page.mjs",
  "apps/wechat-mini/src/pages/unlock/payment-state-page.mjs",
  "apps/wechat-mini/src/pages/share/share-save-page.mjs",
  "apps/wechat-mini/src/pages/error/network-page.mjs",
  "apps/wechat-mini/src/fixtures/shell-fixtures.mjs",
  "packages/prompt-core/src/local-generator.mjs"
];

const staticScans = [];
for (const relativePath of staticCopyFiles) {
  const text = await readFile(resolve(projectRoot, relativePath), "utf8");
  staticScans.push({
    file: relativePath,
    ...scanCopySafety(text, { source: relativePath })
  });
}

const generatedScans = generatedCards.map(({ scene, energy, card }) => ({
  scene,
  energy,
  ...scanCopySafety(card, { source: `generated-card:${scene}:${energy}` })
}));

const unsafeExamples = [
  { category: "guaranteed_destiny_change", copy: "This card will change your destiny guaranteed." },
  { category: "negative_judgment", copy: "Your aura is bad energy and your fault." },
  { category: "appearance_anxiety", copy: "Fix your face and hide your flaws before going out." },
  { category: "therapy_medical_claim", copy: "This ritual can cure anxiety as medical treatment." },
  { category: "mandatory_selfie", copy: "You must upload a selfie to continue." }
];
for (const example of unsafeExamples) {
  const result = scanCopySafety(example.copy, { source: `unsafe-example:${example.category}` });
  assert.equal(result.safe, false, `Safety guard should reject ${example.category}`);
  assert(result.violations.some((violation) => violation.category === example.category));
}

const copyViolations = [
  ...staticScans.flatMap((scan) => scan.violations),
  ...generatedScans.flatMap((scan) => scan.violations)
];
assert.deepEqual(copyViolations, []);

server.close();

const analyticsReadback = repository.readAnalyticsEvents();
const recordedRequiredEvents = prdRequiredAnalyticsEvents.filter((eventName) =>
  analyticsReadback.some((event) => event.eventName === eventName)
);
assert.deepEqual(missingRequiredAnalyticsEvents(recordedRequiredEvents), []);

const analyticsCoverage = {
  status: "PASS",
  taskId: "T18",
  requirementId: "REQ-017",
  apiId: "API-010",
  requiredEvents: prdRequiredAnalyticsEvents,
  knownEventCount: analyticsEvents.length,
  coverage: analyticsEventCoverage,
  apiEventTranscripts,
  negativeCases: {
    invalidEventStatus: invalidEvent.status,
    secretPropertyStatus: secretProperty.status
  },
  dbReadback: analyticsReadback.filter((event) => prdRequiredAnalyticsEvents.includes(event.eventName)),
  localOnly: {
    analyticsService: healthPayload().services.analytics,
    productionAnalyticsEndpointUsed: false,
    realCloudWritesUsed: false
  }
};

const copySafetyAudit = {
  status: "PASS",
  taskId: "T18",
  requirementId: "REQ-018",
  checkedStaticFiles: staticCopyFiles,
  staticTextCount: staticScans.reduce((sum, scan) => sum + scan.checkedTextCount, 0),
  generatedCardCases: generatedScans.length,
  categories: scanCopySafety("").categories,
  violations: copyViolations,
  unsafeFixtureAssertions: unsafeExamples.map((example) => example.category),
  localOnly: {
    productionAiUsed: false,
    generatedFromDeterministicFixtures: true
  }
};

await writeFile(resolve(traceDir, "analytics-coverage.json"), JSON.stringify(analyticsCoverage, null, 2));
await writeFile(resolve(logDir, "copy-safety-audit.json"), JSON.stringify(copySafetyAudit, null, 2));
await writeFile(resolve(apiDir, "API-010-analytics.json"), JSON.stringify({
  status: "PASS",
  requiredEventsAccepted: prdRequiredAnalyticsEvents,
  invalidEventRejected: invalidEvent.body,
  secretPropertyRejected: secretProperty.body
}, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  evidence: [
    "docs/auto-execute/traces/T18/analytics-coverage.json",
    "docs/auto-execute/logs/T18/copy-safety-audit.json",
    "docs/auto-execute/api/T18/API-010-analytics.json"
  ]
}, null, 2));
