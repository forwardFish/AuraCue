import { mkdir, writeFile } from "node:fs/promises";
import { healthPayload } from "../apps/api/src/server.mjs";

const outputPath = "docs/auto-execute/api/T01/health.json";
await mkdir("docs/auto-execute/api/T01", { recursive: true });
await writeFile(outputPath, JSON.stringify({
  statusCode: 200,
  body: healthPayload(),
  source: "apps/api/src/server.mjs",
  endpoint: "GET /api/health"
}, null, 2));

console.log(`wrote ${outputPath}`);
