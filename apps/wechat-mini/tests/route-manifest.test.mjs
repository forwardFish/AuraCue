import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/routes/p0-routes.ts", import.meta.url), "utf8");
const uiIds = [...source.matchAll(/uiId: "([^"]+)"/g)].map((match) => match[1]);
const pagePaths = [...source.matchAll(/pagePath: "([^"]+)"/g)].map((match) => match[1]);

assert.equal(uiIds.length, 12, "Final PRD route manifest must expose UI-01 through UI-12 states");
assert.deepEqual(uiIds, Array.from({ length: 12 }, (_, index) => `UI-${String(index + 1).padStart(2, "0")}`));
assert.equal(new Set(pagePaths).size, 10, "Draw and share states may share mini-program page paths");

console.log(JSON.stringify({ status: "PASS", sourceOfTruth: "final-prd-v1.0", uiRouteStates: uiIds.length }, null, 2));
