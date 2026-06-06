import { spawnSync } from "node:child_process";

const suites = {
  foundation: "tests/api/foundation.test.mjs",
  "identity-upload-draw": "tests/api/identity-upload-draw.test.mjs",
  generation: "tests/api/generation.test.mjs",
  "card-activation-share": "tests/api/card-activation-share.test.mjs"
};

const requested = process.argv.slice(2);
const selected = requested.length > 0
  ? Object.entries(suites).filter(([name]) => requested.some((item) => name.includes(item)))
  : Object.entries(suites);

if (selected.length === 0) {
  console.error(`No API test suites matched: ${requested.join(", ")}`);
  process.exit(1);
}

for (const [name, file] of selected) {
  const result = spawnSync(process.execPath, [file], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    console.error(`API test suite failed: ${name}`);
    process.exit(result.status ?? 1);
  }
}
