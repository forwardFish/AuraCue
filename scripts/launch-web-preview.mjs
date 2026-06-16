import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = process.argv[2] || path.join(repoRoot, "dist", "google", "auracue-web-google-cloud-run");
const port = process.argv[3] || "3220";
const webDir = path.join(packageDir, "apps", "web");
const entry = path.join(webDir, "start-server.mjs");

if (!fs.existsSync(entry)) {
  throw new Error(`Missing packaged web server entry: ${entry}`);
}

const out = fs.openSync(path.join(packageDir, `preview-${port}.out.log`), "a");
const err = fs.openSync(path.join(packageDir, `preview-${port}.err.log`), "a");
const child = spawn(process.execPath, ["start-server.mjs"], {
  cwd: webDir,
  detached: true,
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    AURACUE_API_MODE: "local",
    DATABASE_URL: "file:./auracue-local.sqlite"
  },
  stdio: ["ignore", out, err],
  windowsHide: true
});

child.unref();
console.log(JSON.stringify({
  ok: true,
  pid: child.pid,
  url: `http://127.0.0.1:${port}/`,
  packageDir,
  webDir
}, null, 2));
