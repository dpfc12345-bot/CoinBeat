# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

- Any future third-party API key (e.g. Coinness) must be added via Replit Secrets and used only from `artifacts/api-server` — never called directly from the Expo client. Route the call through `artifacts/api-server/src/lib/externalFetch.ts`'s `fetchExternal` (enforced timeout) and return errors to clients via `sendExternalDataError`-style sanitization (log full detail server-side with `logger`, never echo upstream error text/URLs to the client). `/api` already has `helmet()` and a 120 req/min per-IP rate limiter in `app.ts` to protect quota-limited upstreams.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
