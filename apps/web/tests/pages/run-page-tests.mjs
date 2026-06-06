import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const requested = process.argv.slice(2);

const suites = {
  "create-flow": "tests/pages/create-flow.test.mjs",
  "result-activation": "tests/pages/result-activation.test.mjs",
  "share-save": "tests/pages/share-save.test.mjs"
};

const selected = requested.length === 0
  ? Object.entries(suites)
  : Object.entries(suites).filter(([name]) => requested.some((item) => name.includes(item)));

assert.ok(selected.length > 0, `No page test suites matched ${requested.join(", ")}`);

for (const [name, file] of selected) {
  const result = spawnSync(process.execPath, [join(root, file)], {
    cwd: root,
    stdio: "inherit"
  });
  assert.equal(result.status, 0, `${name} page suite failed`);
}
