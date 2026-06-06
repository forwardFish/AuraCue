import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const tsFiles = [
  "apps/wechat-mini/src/app.config.ts",
  "apps/wechat-mini/src/routes/p0-routes.ts",
  "packages/shared-types/src/index.ts",
  "packages/ui-tokens/src/index.ts",
  "packages/analytics-events/src/index.ts",
  "packages/card-renderer/src/index.ts",
  "packages/prompt-core/src/index.ts"
];

for (const file of tsFiles) {
  const text = await readFile(file, "utf8");
  assert(!text.includes("any"), `${file} should avoid any in scaffold contracts`);
  assert(!text.includes("TODO"), `${file} should expose intentional placeholders without TODO markers`);
}

console.log(JSON.stringify({ status: "PASS", checkedFiles: tsFiles }, null, 2));
