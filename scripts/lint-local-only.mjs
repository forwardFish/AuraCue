import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const files = [
  "apps/api/src/server.mjs",
  "apps/api/src/local-repository.mjs",
  "packages/prompt-core/src/index.ts",
  "package.json"
];

const forbidden = [
  "wx.requestPayment(",
  "api.openai.com",
  "cloud.database(",
  "production"
];

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const needle of forbidden) {
    assert(!text.includes(needle), `${file} must not contain ${needle}`);
  }
}

async function collectFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const collected = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      collected.push(...await collectFiles(path));
    } else if (entry.isFile()) {
      collected.push(path);
    }
  }
  return collected;
}

async function assertNoPatterns(paths, patterns) {
  for (const path of paths) {
    if ((await stat(path)).size > 2_000_000) {
      continue;
    }
    const text = await readFile(path, "utf8");
    for (const pattern of patterns) {
      assert(!pattern.regex.test(text), `${path} must not contain ${pattern.label}`);
    }
  }
}

const frontendFiles = await collectFiles("apps/wechat-mini");
await assertNoPatterns(frontendFiles, [
  { label: "DEEPSEEK_API_KEY", regex: /DEEPSEEK_API_KEY/ },
  { label: "AI_API_KEY", regex: /AI_API_KEY/ },
  { label: "secret-looking sk key", regex: /sk-[A-Za-z0-9]{20,}/ }
]);

const implementationFiles = [
  ...await collectFiles("apps/api/src"),
  ...await collectFiles("packages")
];
await assertNoPatterns(implementationFiles, [
  { label: "secret-looking sk key", regex: /sk-[A-Za-z0-9]{20,}/ }
]);

console.log(JSON.stringify({
  status: "PASS",
  checkedFiles: files,
  frontendSecretFilesChecked: frontendFiles.length,
  implementationSecretFilesChecked: implementationFiles.length
}, null, 2));
