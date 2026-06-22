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
  ["app/page.tsx", "/", /LatestHomePage|RoutePlaceholder/],
  ["app/home/page.tsx", "/home", /LatestHomePage|RoutePlaceholder/],
  ["app/onboarding/birth-aura/page.tsx", "/onboarding/birth-aura", /LatestBirthdayPage|RoutePlaceholder/],
  ["app/onboarding/birth-aura/reveal/page.tsx", "/onboarding/birth-aura/reveal", /LatestBirthRevealPage|RoutePlaceholder/],
  ["app/today/check-in/page.tsx", "/today/check-in", /LatestCheckInPage|RoutePlaceholder/],
  ["app/today/draw/page.tsx", "/today/draw", /LatestDrawPage|RoutePlaceholder/],
  ["app/today/reading/page.tsx", "/today/reading", /LatestReadingPage|RoutePlaceholder/],
  ["app/result/[id]/page.tsx", "/result/[id]", /LatestResultPage|RoutePlaceholder/],
  ["app/activate/[id]/page.tsx", "/activate/[id]", /LatestActivatePage|RoutePlaceholder/],
  ["app/activated/[id]/page.tsx", "/activated/[id]", /LatestActivatedPage|RoutePlaceholder/],
  ["app/share/[id]/page.tsx", "/share/[id]", /LatestSharePage|RoutePlaceholder/],
  ["app/saved/[id]/page.tsx", "/saved/[id]", /LatestSavedPage|RoutePlaceholder/],
  ["app/my/page.tsx", "/my", /LatestMyPage|RoutePlaceholder/],
  ["app/my/birth-aura/page.tsx", "/my/birth-aura", /LatestBirthProfilePage|RoutePlaceholder/],
  ["app/legal/privacy/page.tsx", "/legal/privacy", /LatestPrivacyPage/],
  ["app/legal/terms/page.tsx", "/legal/terms", /LatestTermsPage/],
  ["app/error/network/page.tsx", "/error/network", /LatestErrorPage|RoutePlaceholder/]
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
assert.ok(existsSync(join(root, "components", "latest-ui-pages.tsx")), "missing latest UI_Code component bridge");
assert.ok(existsSync(join(root, "components", "latest-ui.css")), "missing latest UI_Code stylesheet bridge");
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
