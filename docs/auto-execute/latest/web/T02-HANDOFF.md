# T02 Web Handoff

Status: `COMPLETE`

Verdict: `PASS`

Product PASS claimed: no. T02 only created the Web/H5 scaffold and verified it can typecheck, smoke test, and build.

## Current State

`apps/web` now exists as the Web-first Next.js App Router project with TypeScript, Tailwind, ESLint, and workspace scripts.

Implemented route placeholders:

- `/`
- `/create/context`
- `/create/upload`
- `/create/draw`
- `/result/[id]`
- `/activate/[id]`
- `/activated/[id]`
- `/share/[id]`
- `/saved/[id]`

The pages share `apps/web/components/route-placeholder.tsx`, which imports `@auracue/ui-tokens` to prove the Web scaffold can consume workspace UI tokens.

## Completed In T02

- Created `apps/web/package.json` with `dev`, `build`, `lint`, `test`, and `typecheck`.
- Added Next.js config with `transpilePackages: ["@auracue/ui-tokens"]`.
- Added TypeScript config extending root `tsconfig.base.json` plus Web-local `@/*` alias.
- Added Tailwind and PostCSS config.
- Added global Tailwind CSS and minimal App Router layout.
- Added the nine T01-locked Web P0 placeholder routes.
- Added smoke route test at `apps/web/tests/smoke-routes.test.mjs`.
- Added root workspace scripts:
  - `dev:web`
  - `build:web`
  - `test:web`
  - `typecheck:web`
- Updated `pnpm-lock.yaml` by running `pnpm.cmd install`.
- Added `.gitignore` entries for Node/Next generated outputs.

## Repair Record

- Initial `pnpm.cmd --filter @auracue/web typecheck` failed because `@/components/route-placeholder` was not mapped. Fixed by adding Web-local `baseUrl` and `paths` in `apps/web/tsconfig.json`.
- Initial `pnpm.cmd --filter @auracue/web lint` would have triggered interactive Next ESLint setup. Fixed by adding `apps/web/eslint.config.mjs` and using `eslint . --max-warnings=0`.
- Next build added `esModuleInterop: true` to `apps/web/tsconfig.json`; retained because Next reported it as mandatory for SWC/Babel.

## Verification

Required T02 validation passed:

```powershell
pnpm.cmd --filter @auracue/web typecheck
pnpm.cmd --filter @auracue/web test
pnpm.cmd --filter @auracue/web build
```

Additional validation passed:

```powershell
pnpm.cmd --filter @auracue/web lint
git diff --check
```

Note: `pnpm` PowerShell shim is blocked by execution policy on this machine, so `pnpm.cmd` was used as the equivalent pnpm CLI entrypoint.

## Evidence Paths

- Result JSON: `docs/auto-execute/results/web/T02.json`
- Handoff: `docs/auto-execute/latest/web/T02-HANDOFF.md`
- Command log: `docs/auto-execute/logs/web/T02-command-log.md`
- Smoke test: `apps/web/tests/smoke-routes.test.mjs`
- Web package: `apps/web/package.json`

## Next Task Input

T03/T04 can now add Prisma and `/api/v1/*` route handlers under the established `apps/web` project.

Preserve T02 boundaries:

- Web first.
- Keep `/api/v1/*` for unified backend work in later tasks.
- No paywall, real payment, WeChat Pay, unlock payment, or invite unlock in Web P0.
- Do not treat placeholder pages as final UI or business logic.

## Residual Risks

- No dev server or screenshot evidence was required or produced for T02.
- Placeholder routes are intentionally skeletal; T08-T11 still own real page UX and visual matching.
- pnpm install emitted dependency build-script approval warnings, but typecheck, lint, test, and production build all passed.
