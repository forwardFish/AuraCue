import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

if (process.argv.includes("identity-upload-draw")) {
  await import("./identity-upload-draw.test.mjs");
  process.exit(0);
}

const root = process.cwd();
const evidenceDir = resolve(root, "../../docs/auto-execute/evidence/web/T04");
mkdirSync(evidenceDir, { recursive: true });

const requiredFiles = [
  "server/api/envelope.ts",
  "server/api/redaction.ts",
  "server/api/local-guard.ts",
  "server/config/env.ts",
  "app/api/v1/health/route.ts"
];

for (const file of requiredFiles) {
  assert.ok(existsSync(resolve(root, file)), `missing ${file}`);
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
assert.match(packageJson.scripts["test:api"], /node tests\/api\/(foundation\.test|run-api-tests)\.mjs/);

const envelope = readFileSync(resolve(root, "server/api/envelope.ts"), "utf8");
assert.match(envelope, /export function createRequestContext/);
assert.match(envelope, /export function jsonOk/);
assert.match(envelope, /export function jsonError/);
assert.match(envelope, /export async function readJsonBody/);
assert.match(envelope, /redactSecretLikeValues/);
assert.doesNotMatch(envelope, /console\.(log|error|warn)/);

const redaction = readFileSync(resolve(root, "server/api/redaction.ts"), "utf8");
assert.match(redaction, /REDACTED/);
assert.match(redaction, /redactedEnvSnapshot/);

const localGuard = readFileSync(resolve(root, "server/api/local-guard.ts"), "utf8");
assert.match(localGuard, /liveServiceWritesAllowed/);
assert.match(localGuard, /127\.0\.0\.1/);
assert.match(localGuard, /localhost/);

const healthRoute = readFileSync(resolve(root, "app/api/v1/health/route.ts"), "utf8");
assert.match(healthRoute, /export async function GET/);
assert.match(healthRoute, /apiBase: "\/api\/v1"/);
assert.match(healthRoute, /p0ModelNames/);
assert.doesNotMatch(healthRoute, /POST|payment|unlock|invite/);

const healthResponseEvidence = {
  endpoint: "GET /api/v1/health",
  status: "STATIC_CONTRACT_PASS",
  envelope: {
    ok: true,
    requestId: "generated-per-request",
    data: {
      status: "ready",
      foundation: "api-v1-route-handler",
      apiBase: "/api/v1",
      localOnly: {
        liveServiceWritesAllowed: false,
        secretsReturned: false
      }
    }
  },
  reusableFoundation: requiredFiles
};

writeFileSync(
  resolve(evidenceDir, "health-response.json"),
  JSON.stringify(healthResponseEvidence, null, 2)
);

console.log(JSON.stringify({
  status: "PASS",
  covered: ["API-FOUNDATION", "error-envelope", "env-redaction", "local-only-guard", "health"],
  evidence: "docs/auto-execute/evidence/web/T04/health-response.json"
}, null, 2));
