# VitePlus Full Stack Template

A TypeScript full-stack monorepo template with a React frontend, Hono API, shared Zod contracts, and Drizzle-backed persistence.

## What Is Included

- VitePlus (`vp`) for installs, dev commands, checks, builds, and workspace task running
- pnpm workspaces
- React + Vite
- TanStack Router for routing
- TanStack Query for server-state fetching and cache invalidation
- Zustand for lightweight client state
- StyleX for compile-time application styling
- Astryx components and the neutral Astryx theme
- Hono served by `@hono/node-server`
- Drizzle ORM with LibSQL/SQLite for local development
- Zod contracts shared between the API and web app
- A local entity generator for adding API modules faster

## First-Time Setup

After creating a repository from this template, initialize the package scope before installing dependencies:

```sh
vp run -w template:init --scope @acme --name my-app
vp install
cp .env.example .env
vp run --filter ./apps/api --filter ./apps/web dev
```

Replace `@acme` with your npm package scope and `my-app` with the root package name you want. The initializer uses plain Node, so it can run before dependencies are installed.

The initializer rewrites:

- workspace package names
- internal imports
- TypeScript path aliases
- root scripts
- README examples

Open the app at `http://localhost:5173`. The API runs at `http://localhost:4000`, and Vite proxies `/api` requests during development.

If `pnpm` is available on your PATH, `pnpm dev` runs the same dev command as the `vp run ... dev` command above.

## Commands

```sh
vp run -w template:init --scope @acme --name my-app
vp install
vp run --filter ./apps/api --filter ./apps/web dev
vp check
vp run -r check
vp run -r build
vp test
vp run -w entity:add users
vp db:push
vp db:studio
```

Command notes:

- `vp check`: formatting and lint checks
- `vp run -r check`: TypeScript checks in every workspace package
- `vp run -r build`: builds every workspace package, including the production web bundle
- `vp run -w entity:add users`: creates the standard files for a new entity
- `vp db:push`: pushes the Drizzle schema to the configured database
- `vp db:studio`: opens Drizzle Studio

The API initializes the local demo `todos` table at startup so the example works immediately. Use `vp db:push` once you start evolving the schema.

## Workspace Layout

```txt
apps/
  api/        Hono API, organized by feature module
  web/        React app with TanStack Router, Query, Zustand, StyleX, and Astryx
packages/
  db/         Drizzle schema modules and database client
  shared/     Zod API contracts and DTO types
scripts/
  add-entity.ts
  init-template.mjs
```

## Entity Organization

Use the same domain boundary across the API, shared contracts, and database schema. Avoid growing single catch-all files like `app.ts`, `schema.ts`, or `shared.ts` as the app grows.

The `todos` example uses this structure:

```txt
apps/api/src/
  app.ts
  lib/
    http.ts
  modules/
    todos/
      todos.routes.ts
      todos.service.ts

packages/db/src/
  client.ts
  schema/
    index.ts
    todos.ts

packages/shared/src/
  index.ts
  todos/
    index.ts
    todos.contracts.ts
```

### API

Keep `apps/api/src/app.ts` focused on app-level concerns:

- middleware
- health checks
- route mounting

Each entity belongs under `apps/api/src/modules/<entity>`:

- `<entity>.routes.ts`: Hono routes, request validation, response status handling
- `<entity>.service.ts`: business logic and Drizzle queries

Mount routes from `app.ts`:

```ts
api.route("/todos", createTodoRoutes({ db }));
```

### Database

Add one schema file per table or tight aggregate:

```txt
packages/db/src/schema/
  index.ts
  todos.ts
  users.ts
```

Export each schema module from `packages/db/src/schema/index.ts`. API services should import database tables through `@template/db`.

### Shared Contracts

`@template/shared` is the contract layer between the API and clients. Put Zod request schemas, response schemas, and DTO types in per-entity contract files:

```txt
packages/shared/src/users/
  index.ts
  users.contracts.ts
```

Export the entity from `packages/shared/src/users/index.ts`, then re-export it from `packages/shared/src/index.ts`.

Application code should import contracts from the package root:

```ts
import { createTodoSchema, type Todo } from "@template/shared";
```

Avoid deep imports from `packages/shared` in app code. Keeping package-root imports stable lets the internal contract layout evolve without touching every caller.

## Adding An Entity

Use the generator for the standard CRUD scaffold:

```sh
vp run -w entity:add users
```

Preview generated files without writing them:

```sh
vp run -w entity:add users --dry-run
```

The generator creates:

- `packages/shared/src/<entity>/<entity>.contracts.ts`
- `packages/db/src/schema/<entity>.ts`
- `apps/api/src/modules/<entity>/<entity>.service.ts`
- `apps/api/src/modules/<entity>/<entity>.routes.ts`
- export wiring in `@template/shared` and `@template/db`
- route mounting in `apps/api/src/app.ts`

The generated entity starts with `id`, `name`, and `createdAt`. Edit the generated files when the entity needs domain-specific fields, relationships, authorization, or custom route behavior.

After adding or editing an entity, run:

```sh
vp run -r check
vp run -r build
```

## Web App Patterns

- Routes are defined with TanStack Router in `apps/web/src/router.tsx`.
- Server data belongs in TanStack Query hooks under `apps/web/src/lib`.
- Lightweight client preferences belong in Zustand stores under `apps/web/src/stores`.
- Shared request and response types should come from `@template/shared`.
- UI components should come from focused `@astryxdesign/core/*` entry points.
- Application styles should use `stylex.create()` and Astryx design tokens.

## Astryx and StyleX

The web app uses the Astryx neutral theme and imports Astryx components directly. StyleX is compiled by the official Vite integration, and the required Astryx stylesheets are loaded from `apps/web/src/styles.css`.

Discover components and inspect their APIs with the Astryx CLI:

```sh
vp run @template/web#astryx -- component --list
vp run @template/web#astryx -- component Button
vp run @template/web#astryx -- build "settings page"
```

Import components from their focused entry points to keep bundles lean:

```tsx
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
```

Use StyleX for app-specific layout or visual rules, with Astryx tokens when a design value is needed:

```tsx
import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@astryxdesign/core/theme/tokens.stylex";

const styles = stylex.create({
  content: {
    paddingBlock: spacingVars["--spacing-4"],
  },
});
```

## Documentation

- [VitePlus](https://viteplus.dev/guide/)
- [pnpm](https://pnpm.io/)
- [Vite](https://vite.dev/guide/)
- [React](https://react.dev/reference/react)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand](https://github.com/pmndrs/zustand/tree/main/docs)
- [StyleX](https://stylexjs.com/docs/)
- [Astryx](https://astryx.atmeta.com/)
- [Hono](https://hono.dev/docs/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [LibSQL client](https://www.npmjs.com/package/@libsql/client)
- [Zod](https://zod.dev/)
