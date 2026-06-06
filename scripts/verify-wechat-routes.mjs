import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const routeFile = new URL("../apps/wechat-mini/src/routes/p0-routes.ts", import.meta.url);
const source = await readFile(routeFile, "utf8");
const uiIds = [...source.matchAll(/uiId: "([^"]+)"/g)].map((match) => match[1]);
const routes = [...source.matchAll(/route: "([^"]+)"/g)].map((match) => match[1]);
const pagePaths = [...source.matchAll(/pagePath: "([^"]+)"/g)].map((match) => match[1]);
const sourceReferences = [...source.matchAll(/sourceReference: "([^"]+)"/g)].map((match) => match[1]);

assert.equal(uiIds.length, 12, "Expected final PRD UI-01 through UI-12 route states");
assert.deepEqual(uiIds, Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`));
assert.equal(new Set(uiIds).size, 12, "UI route states must be unique");
assert(routes.includes("/"));
assert(routes.includes("/create/context"));
assert(routes.includes("/create/upload"));
assert(routes.includes("/create/draw"));
assert(routes.includes("/activate/:id"));
assert(routes.includes("/activated/:id"));
assert(routes.includes("/api/health") === false, "API route must stay in backend scaffold");
assert(routes.every((route) => !route.startsWith("/unlock")), "Unlock routes are legacy/P1 and must not be final P0");
assert(routes.every((route) => !route.startsWith("/invite")), "Invite routes are legacy/P1 and must not be final P0");

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const pagePath of new Set(pagePaths)) {
  for (const extension of [".js", ".json", ".wxml", ".wxss"]) {
    await access(resolve(projectRoot, "apps/wechat-mini/src", `${pagePath}${extension}`), constants.R_OK);
  }
}

for (const reference of sourceReferences) {
  await access(resolve(projectRoot, reference), constants.R_OK);
}

console.log(JSON.stringify({
  status: "PASS",
  sourceOfTruth: "final-prd-v1.0",
  uiRouteStates: uiIds.length,
  uniquePagePaths: new Set(pagePaths).size,
  routes
}, null, 2));
