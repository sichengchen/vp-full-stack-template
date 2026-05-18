# VitePlus Full Stack Template

A TypeScript monorepo template for building React applications with a Hono API, shared contracts, and Drizzle-backed persistence.

## Tech Stack

- VitePlus (`vp`) for installs, task running, checks, builds, and dev workflows
- pnpm workspaces
- React + Vite
- TanStack Router
- TanStack Query
- Zustand
- Tailwind CSS v4
- shadcn/ui in Base UI mode
- Hono on `@hono/node-server`
- Drizzle ORM with LibSQL/SQLite
- Zod contracts shared by the API and web app

## Documentation Links

- [VitePlus](https://viteplus.dev/guide/)
- [pnpm](https://pnpm.io/)
- [Vite](https://vite.dev/guide/)
- [React](https://react.dev/reference/react)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand](https://github.com/pmndrs/zustand/tree/main/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Base UI](https://base-ui.com/react/overview/about)
- [Hono](https://hono.dev/docs/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [LibSQL client](https://www.npmjs.com/package/@libsql/client)
- [Zod](https://zod.dev/)

## Getting Started

```sh
vp install
cp .env.example .env
vp run --filter ./apps/api --filter ./apps/web dev
```

If `pnpm` is on your PATH, `pnpm dev` runs the same workspace dev command.

Open the web app at `http://localhost:5173`. The API runs on `http://localhost:4000`, and Vite proxies `/api` requests during development.

## Workspace

```txt
apps/
  api/        Hono API, organized by feature module
  web/        React app with TanStack Router, Query, Zustand, and Tailwind
packages/
  db/         Drizzle schema modules and database client
  shared/     Zod API contracts and DTO types
  ui/         shadcn-style UI primitives and utilities
```

## Useful Commands

```sh
vp check         # format and lint checks
vp run -r check  # TypeScript checks in every workspace package
vp build         # build packages and apps
vp test          # run test scripts
vp run -w entity:add users
vp db:push       # push Drizzle schema to the configured database
vp db:studio     # open Drizzle Studio
```

The API initializes the local demo table at startup so the example works immediately. Use `vp db:push` when you start evolving the schema.

## Entity Organization

Use the same domain boundary across the API, shared contracts, and database schema. Do not grow a single `app.ts`, `schema.ts`, or `shared.ts` file as entities are added.

For an entity named `todos`, the template uses this layout:

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

### API Modules

Keep `apps/api/src/app.ts` focused on application-level middleware, health checks, and route mounting.

Each entity gets a module under `apps/api/src/modules/<entity>`:

- `<entity>.routes.ts`: Hono route definitions, request validation, HTTP status handling
- `<entity>.service.ts`: business logic and Drizzle queries

Mount entity routes from `app.ts`:

```ts
api.route("/todos", createTodoRoutes({ db }));
```

### Database Schema

Add one schema file per table or tight aggregate:

```txt
packages/db/src/schema/
  index.ts
  todos.ts
  users.ts
```

Export each schema module from `packages/db/src/schema/index.ts`. API services should import database tables through `@template/db`.

### Shared Contracts

`@template/shared` is the contract layer between the API and clients. Put Zod request schemas, response schemas, and exported DTO types in per-entity contract files:

```txt
packages/shared/src/users/
  index.ts
  users.contracts.ts
```

Export the entity from `packages/shared/src/users/index.ts`, then re-export it from `packages/shared/src/index.ts`. Application code should import from the package root:

```ts
import { createTodoSchema, type Todo } from "@template/shared";
```

Avoid importing from deep shared paths in app code. Keeping the package-root import stable lets the internal contract layout evolve without touching every caller.

## Adding A New Entity

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

The generated entity uses an `id`, `name`, and `createdAt` baseline. Edit those generated files when the entity needs domain-specific fields, relationships, authorization, or custom route behavior.

Manual checklist for a new `users` entity:

1. Add `packages/shared/src/users/users.contracts.ts` for Zod schemas and DTO types.
2. Export it from `packages/shared/src/users/index.ts`.
3. Re-export it from `packages/shared/src/index.ts`.
4. Add `packages/db/src/schema/users.ts`.
5. Export the schema from `packages/db/src/schema/index.ts`.
6. Add `apps/api/src/modules/users/users.service.ts`.
7. Add `apps/api/src/modules/users/users.routes.ts`.
8. Mount it in `apps/api/src/app.ts` with `api.route("/users", createUserRoutes({ db }))`.
9. Add web client functions and TanStack Query hooks under `apps/web/src/lib` when the UI needs the entity.
10. Run `vp run -r check` and `vp build`.

## shadcn/ui

`components.json` is configured with `"base": "base"` for shadcn/ui Base UI mode and points component aliases at `packages/ui`.

Example:

```sh
vp dlx shadcn@latest add button card input
```

Keep generated components in `packages/ui/src/components` and import them from `@template/ui/components/...`.
