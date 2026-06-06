import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const scanRoots = ["apps/web/server", "apps/web/app/api", "apps/web/tests/api"];
const secretLikePattern = /(sk-[a-z0-9_-]{8,}|client_secret|bearer\s+[a-z0-9._-]+)/i;
const forbiddenCopyPattern = /(paywall|wechat pay|unlock payment|invite unlock)/i;
const allowlistedSecretMentions = new Set([
  "apps/web/server/api/redaction.ts",
  // Intentional negative fixture proves API-013 rejects secret-like analytics payloads.
  "apps/web/tests/api/card-activation-share.test.mjs"
]);
const evidenceDir = resolve(root, "docs/auto-execute/evidence/web/T04");
mkdirSync(evidenceDir, { recursive: true });

function collectFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      return collectFiles(fullPath);
    }
    return /\.(ts|tsx|mjs|js)$/.test(entry) ? [fullPath] : [];
  });
}

const findings = [];
for (const relativeRoot of scanRoots) {
  for (const file of collectFiles(resolve(root, relativeRoot))) {
    const relativeFile = file.replace(root, "").replace(/^[/\\]/, "").replace(/\\/g, "/");
    const source = readFileSync(file, "utf8");
    if (secretLikePattern.test(source) && !allowlistedSecretMentions.has(relativeFile)) {
      findings.push({ file: relativeFile, issue: "secret-like literal" });
    }
    if (forbiddenCopyPattern.test(source)) {
      findings.push({ file: relativeFile, issue: "forbidden Web P0 copy" });
    }
  }
}

const result = {
  status: findings.length === 0 ? "PASS" : "HARD_FAIL",
  scannedRoots: scanRoots,
  findings
};

writeFileSync(resolve(evidenceDir, "copy-safety.json"), JSON.stringify(result, null, 2));
assert.deepEqual(findings, []);
console.log(JSON.stringify(result, null, 2));
