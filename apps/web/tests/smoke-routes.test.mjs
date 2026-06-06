import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const requested = process.argv.slice(2);

if (requested.length > 0) {
  const suites = {
    "draft-store": "tests/unit/draft-store.test.mjs",
    "api-client": "tests/unit/api-client.test.mjs",
    "hold-to-seal": "tests/pages/hold-to-seal.test.mjs",
    shell: "tests/smoke-routes.test.mjs"
  };
  const selected = Object.entries(suites)
    .filter(([name]) => requested.some((item) => name.includes(item)));
  assert.ok(selected.length > 0, `No test suites matched ${requested.join(", ")}`);
  for (const [name, file] of selected) {
    const result = spawnSync(process.execPath, [file], {
      cwd: root,
      stdio: "inherit"
    });
    assert.equal(result.status, 0, `${name} suite failed`);
  }
  process.exit(0);
}

const requiredRoutes = [
  ["app/page.tsx", "/", /MoodHome|RoutePlaceholder/],
  ["app/create/context/page.tsx", "/create/context", /ContextPageFlow|RoutePlaceholder/],
  ["app/create/upload/page.tsx", "/create/upload", /UploadPageFlow|RoutePlaceholder/],
  ["app/create/draw/page.tsx", "/create/draw", /DrawPageFlow|RoutePlaceholder/],
  ["app/result/[id]/page.tsx", "/result/[id]", /ResultPageFlow|RoutePlaceholder/],
  ["app/activate/[id]/page.tsx", "/activate/[id]", /ActivatePageFlow|RoutePlaceholder/],
  ["app/activated/[id]/page.tsx", "/activated/[id]", /ActivatedPageFlow|RoutePlaceholder/],
  ["app/share/[id]/page.tsx", "/share/[id]", /SharePageFlow|RoutePlaceholder/],
  ["app/saved/[id]/page.tsx", "/saved/[id]", /SavedPageFlow|RoutePlaceholder/]
];

for (const [relativePath, route, routePattern] of requiredRoutes) {
  const absolutePath = join(root, relativePath);
  assert.ok(existsSync(absolutePath), `missing route placeholder ${route}`);
  const source = readFileSync(absolutePath, "utf8");
  assert.match(source, routePattern, `${route} should use its current route component`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const scriptName of ["dev", "build", "lint", "test", "test:pages", "typecheck"]) {
  assert.ok(packageJson.scripts?.[scriptName], `missing ${scriptName} script`);
}

assert.equal(packageJson.dependencies?.["@auracue/ui-tokens"], "workspace:*");
assert.ok(existsSync(join(root, "tailwind.config.ts")), "missing Tailwind config");
assert.ok(existsSync(join(root, "app", "globals.css")), "missing global Tailwind CSS");
assert.ok(existsSync(join(root, "components", "web-shell.tsx")), "missing shared Web shell");
assert.ok(existsSync(join(root, "components", "loading-state.tsx")), "missing shared loading state");
assert.ok(existsSync(join(root, "components", "error-state.tsx")), "missing shared error state");
assert.ok(existsSync(join(root, "lib", "routes.ts")), "missing route constants");
assert.ok(existsSync(join(root, "lib", "api-client.js")), "missing API client");
assert.ok(existsSync(join(root, "lib", "draft-store.js")), "missing draft store");

console.log(JSON.stringify({
  status: "PASS",
  suite: "route-shell-smoke",
  checkedRoutes: requiredRoutes.map(([, route]) => route),
  scripts: ["dev", "build", "lint", "test", "typecheck"]
}, null, 2));
