# Local Setup

## Prerequisites
- Node.js 22+ (or current LTS)
- pnpm 10+

## Install
```bash
pnpm install
```

## Build all workspaces
```bash
pnpm -r build
```

## Generate SQLite migration files
```bash
pnpm --filter @finance-tracker/data-access db:generate
```

## Apply SQLite migrations
```bash
pnpm --filter @finance-tracker/data-access db:migrate
```

## Typecheck all workspaces
```bash
pnpm -r typecheck
```

## Run unit tests
```bash
pnpm test
```

## Run unit tests with coverage
```bash
pnpm test:coverage
```

Coverage output is written to `coverage/` (`lcov`, `json-summary`, and terminal text report).

## Start API (after build)
```bash
pnpm --filter @finance-tracker/api start
```

## Current API endpoints
- `GET /health`
- `GET /analytics/monthly-spend`
