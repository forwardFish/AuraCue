import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(repoRoot, "apps", "web");
const standaloneRoot = path.join(appRoot, ".next", "standalone");
const distRoot = path.join(repoRoot, "dist", "google", "auracue-web-google-cloud-run");
const appDistRoot = path.join(distRoot, "apps", "web");
const migrationId = "20260604010930_init";

await assertExists(standaloneRoot, "Missing standalone build. Run pnpm build:web first.");

await fs.rm(distRoot, { recursive: true, force: true });
await fs.mkdir(distRoot, { recursive: true });

await copyDir(standaloneRoot, distRoot);
await copyDir(path.join(appRoot, ".next", "static"), path.join(appDistRoot, ".next", "static"));
await copyDir(path.join(appRoot, "public"), path.join(appDistRoot, "public"));
await copyDir(path.join(appRoot, "prisma"), path.join(appDistRoot, "prisma"));

await fs.writeFile(path.join(appDistRoot, "start-server.mjs"), startServerSource(migrationId));
await fs.writeFile(path.join(distRoot, "Dockerfile"), dockerfileSource());
await fs.writeFile(path.join(distRoot, "README_GOOGLE.md"), readmeSource());
await fs.writeFile(path.join(distRoot, "package-manifest.json"), `${JSON.stringify({
  name: "auracue-web-google-cloud-run",
  generatedAt: new Date().toISOString(),
  entrypoint: "apps/web/start-server.mjs",
  dockerfile: "Dockerfile",
  localPreview: "powershell -ExecutionPolicy Bypass -File ./start-local.ps1 -Port 3220",
  notes: [
    "This is a Next.js standalone server package for Google Cloud Run style hosting.",
    "It is not an Android App Bundle. Google Play upload requires a native Android wrapper and signing pipeline."
  ]
}, null, 2)}\n`);
await fs.writeFile(path.join(distRoot, "start-local.ps1"), startLocalPowerShellSource());

console.log(JSON.stringify({
  status: "PASS",
  packageDir: path.relative(repoRoot, distRoot).replace(/\\/g, "/"),
  entrypoint: "apps/web/start-server.mjs",
  dockerfile: "Dockerfile"
}, null, 2));

async function assertExists(target, message) {
  try {
    await fs.access(target);
  } catch {
    throw new Error(message);
  }
}

async function copyDir(source, target) {
  await assertExists(source, `Missing required package source: ${source}`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.cp(source, target, { recursive: true, force: true });
}

function dockerfileSource() {
  return `FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV AURACUE_API_MODE=local
COPY . .
WORKDIR /app/apps/web
EXPOSE 8080
CMD ["node", "start-server.mjs"]
`;
}

function readmeSource() {
  return `# AuraCue Google Cloud Run Package

This directory is a production Next.js standalone server package.

## Local preview

\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\start-local.ps1 -Port 3220
\`\`\`

Open http://127.0.0.1:3220 after the server reports it is ready.

## Google Cloud Run source deploy

\`\`\`powershell
gcloud run deploy auracue-web --source . --region <region> --allow-unauthenticated
\`\`\`

For production persistence, configure a durable external \`DATABASE_URL\`.
Without \`DATABASE_URL\`, the package uses a local SQLite file suitable for preview only.

## Important boundary

This is not a Google Play Android App Bundle. Uploading to Google Play requires an Android wrapper, release signing, store metadata, and an \`.aab\` build pipeline.
`;
}

function startLocalPowerShellSource() {
  return `param(
  [int]$Port = 3220
)

$ErrorActionPreference = "Stop"
$env:PORT = [string]$Port
$env:HOSTNAME = "127.0.0.1"
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:AURACUE_API_MODE = "local"
if (-not $env:DATABASE_URL) {
  $env:DATABASE_URL = "file:./auracue-local.sqlite"
}

Push-Location (Join-Path $PSScriptRoot "apps\\web")
try {
  node start-server.mjs
} finally {
  Pop-Location
}
`;
}

function startServerSource(migrationId) {
  return `import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.NEXT_TELEMETRY_DISABLED = process.env.NEXT_TELEMETRY_DISABLED || "1";
process.env.AURACUE_API_MODE = process.env.AURACUE_API_MODE || "local";
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./auracue-local.sqlite";

if (process.env.DATABASE_URL.startsWith("file:./")) {
  const sqlitePath = path.resolve(process.cwd(), process.env.DATABASE_URL.slice("file:./".length));
  if (!fs.existsSync(sqlitePath)) {
    const migrationSql = fs.readFileSync(path.join(process.cwd(), "prisma", "migrations", "${migrationId}", "migration.sql"), "utf8");
    const Database = require("better-sqlite3");
    const db = new Database(sqlitePath);
    try {
      db.exec(migrationSql);
      console.log("[auracue] initialized local sqlite database", sqlitePath);
    } finally {
      db.close();
    }
  }
}

await import("./server.js");
`;
}
