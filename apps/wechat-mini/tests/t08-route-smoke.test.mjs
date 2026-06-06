import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { p0RouteRegistry, requiredApiIds, routeManifest } from "../src/routes/route-registry.mjs";
import { createShellNavigator } from "../src/navigation/router.mjs";
import { shellRouteParams } from "../src/fixtures/shell-fixtures.mjs";

const navigator = createShellNavigator();
const visits = p0RouteRegistry.map((route) => navigator.navigateByUiId(route.uiId, shellRouteParams));
const manifest = routeManifest();

assert.equal(visits.length, 12);
assert.deepEqual(manifest.uiCoverage, Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`));
assert.deepEqual(manifest.apiCoverage, requiredApiIds);
assert.equal(new Set(visits.map((visit) => visit.pagePath)).size, 10);
assert(visits.every((visit) => !visit.route.startsWith("/unlock")));
assert(visits.every((visit) => !visit.route.startsWith("/invite")));
assert(visits.every((visit) => !visit.path.includes(":")), "All dynamic route params must be materialized in smoke navigation.");

const trace = {
  status: "PASS",
  taskId: "T08",
  routeCount: visits.length,
  uiCoverage: manifest.uiCoverage,
  apiCoverage: manifest.apiCoverage,
  visits
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const evidencePath = resolve(projectRoot, "docs/auto-execute/traces/T08/route-smoke.json");

await mkdir(dirname(evidencePath), { recursive: true });
await writeFile(evidencePath, JSON.stringify(trace, null, 2));

console.log(JSON.stringify({ status: "PASS", evidence: "docs/auto-execute/traces/T08/route-smoke.json" }, null, 2));
