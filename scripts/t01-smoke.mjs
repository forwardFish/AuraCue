import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "../apps/api/src/server.mjs";

await import("./verify-wechat-routes.mjs");
await import("./lint-local-only.mjs");
await import("./typecheck-placeholders.mjs");

const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const response = await fetch(`http://127.0.0.1:${port}/api/health`);
const body = await response.json();
server.close();

assert.equal(response.status, 200);
assert.equal(body.status, "ready");
assert.equal(body.mode, "local-mock");

await mkdir("docs/auto-execute/api/T01", { recursive: true });
await writeFile("docs/auto-execute/api/T01/health.json", JSON.stringify({
  statusCode: response.status,
  body,
  endpoint: "GET /api/health",
  probe: "scripts/t01-smoke.mjs"
}, null, 2));

console.log(JSON.stringify({
  status: "PASS",
  checks: ["routes", "local-only", "placeholder-typecheck", "api-health"],
  healthEvidence: "docs/auto-execute/api/T01/health.json"
}, null, 2));
