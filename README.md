# Habit Tracker API

Companion codebase for the **API Design with Node.js v5 course**, built with Express, Drizzle ORM, PostgreSQL, and TypeScript.

## Prerequisites

- Node.js 24.3.0+
- PostgreSQL database reachable via `DATABASE_URL`
- npm (or another Node package manager)

Apply the schema and seed the database:

```bash
npm run db:push
npm run db:seed
```

Start the API:

```bash
npm run dev   # restart on file changes
# or
npm start     # run without the watcher
```

## Handy scripts

- `npm run db:generate` - create a Drizzle migration from schema changes
- `npm run db:migrate` - apply pending migrations
- `npm run db:studio` - open Drizzle Studio for inspecting data
