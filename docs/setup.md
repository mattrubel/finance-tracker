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

## Typecheck all workspaces
```bash
pnpm -r typecheck
```

## Start API (after build)
```bash
pnpm --filter @finance-tracker/api start
```

## Current API endpoints
- `GET /health`
- `GET /analytics/monthly-spend`
