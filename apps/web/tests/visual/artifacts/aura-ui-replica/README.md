# AuraCue H5 UI Replica Verification Notes

This branch uses real `apps/web` Next.js routes and React components for the H5 UI replica work.

## Current branch status

- Branch: `aura-h5-web-ui-replica`
- Target app: `apps/web`
- Assets: existing `/aura-assets` icons and illustrations only
- Full-page screenshots as page backgrounds: not used

## Local verification limitation in this environment

This execution environment could not complete network-dependent steps:

- `git clone https://github.com/forwardFish/AuraCue.git` could not resolve `github.com`.
- `corepack pnpm --version` could not resolve `registry.npmjs.org`.

Because of that, these commands still need to run in a normal networked dev environment before merge:

```bash
pnpm install
pnpm build:web
pnpm typecheck:web
pnpm test:web
pnpm visual:t26
```

## Screenshot matrix to generate

Use a 390x844 or 430x932 viewport and save screenshots for:

- `/`
- `/create/context`
- `/create/birthday`
- `/birth-aura`
- `/create/upload`
- `/create/draw`
- `/reading`
- `/result/demo-soft-boundary`
- `/activate/demo-soft-boundary`
- `/activated/demo-soft-boundary`
- `/share/demo-soft-boundary`
- `/my`
