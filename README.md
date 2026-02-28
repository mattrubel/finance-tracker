# Personal Finance Tracker

A local-first personal finance tracker designed to become cloud-deployable later without major rewrites.

## Goals
- Help users understand spending habits.
- Show month-over-month spending changes by category, merchant, and account.
- Let users import, review, and edit transaction history.
- Start with CSV imports in v1, then add statement/bank integrations.

## Product Scope

### V1 (MVP)
- Local app running on the user's machine.
- Import transactions from a standardized CSV format.
- Validate and normalize imported data.
- Store transactions in local database.
- Dashboard with:
  - Total spend by month.
  - Spend by category.
  - Top merchants.
  - Month-over-month deltas.
- Transaction table with filtering/search/editing.
- Manual category management (create/rename/merge).

### V1 Non-goals
- Direct bank API integrations.
- OCR/PDF statement ingestion.
- Multi-user collaboration.
- Budget forecasting or AI recommendations.

## Architecture (Local-first, Cloud-ready)

### High-level modules
1. `frontend` (UI)
- Dashboard visualizations.
- Transaction management screens.
- Import workflow and validation feedback.

2. `backend` (Application/API layer)
- Import pipeline orchestration.
- Business rules (categorization, trend calculations).
- CRUD APIs for transactions, categories, accounts.

3. `domain` (Core logic, pure modules)
- Transaction normalization.
- Month-over-month analytics.
- Category and merchant grouping logic.

4. `storage` (Persistence)
- Local DB in v1 (`SQLite`).
- Storage adapter interface so cloud DB can replace it later.

5. `integrations` (Future connectors)
- CSV importer in v1.
- Statement parser and bank connectors in later phases.

### Deployment modes
- **V1 local mode**: UI + backend run on localhost; SQLite file on device.
- **Future cloud mode**: same API/domain contracts with hosted DB and auth.

This avoids lock-in by keeping domain logic independent from transport and database engines.

## Proposed Repository Structure

```text
finance-tracker/
  README.md
  docs/
    architecture.md
    data-model.md
    roadmap.md
  apps/
    web/                 # frontend
    api/                 # backend service
  packages/
    domain/              # business logic, analytics, normalization
    data-access/         # repository interfaces + SQLite impl
    importers/           # csv importer (later: statements/bank adapters)
    shared-types/        # DTOs, schema types
  data/
    samples/
      transactions.sample.csv
```

## Canonical CSV Format (V1)

Use UTF-8 CSV with headers exactly as below:

```csv
transaction_id,date,description,amount,currency,account_name,category,merchant,type
```

### Field definitions
- `transaction_id` (string, optional): External ID if available.
- `date` (required): `YYYY-MM-DD`.
- `description` (required): Raw transaction description.
- `amount` (required): Decimal; **negative = expense**, positive = income/refund.
- `currency` (required): ISO 4217 (e.g., `USD`).
- `account_name` (required): User-friendly account label.
- `category` (optional): User-provided initial category.
- `merchant` (optional): Parsed or user-provided merchant name.
- `type` (optional): `expense | income | transfer | refund`.

### Validation rules
- Reject rows missing `date`, `description`, `amount`, `currency`, or `account_name`.
- Normalize date into ISO format.
- Normalize amount to fixed decimal precision.
- Deduplicate with fingerprint: `(date, amount, normalized_description, account_name)` when `transaction_id` absent.
- Store original raw row for audit/debug.

## Data Model (Core Entities)

- `Transaction`
  - `id`, `externalId`, `date`, `description`, `normalizedDescription`, `amount`, `currency`, `merchantId`, `categoryId`, `accountId`, `type`, `createdAt`, `updatedAt`
- `Category`
  - `id`, `name`, `parentCategoryId`, `isSystem`
- `Merchant`
  - `id`, `name`, `normalizedName`
- `Account`
  - `id`, `name`, `institution`, `last4`
- `ImportBatch`
  - `id`, `sourceType`, `sourceFilename`, `importedAt`, `totalRows`, `acceptedRows`, `rejectedRows`
- `ImportError`
  - `id`, `batchId`, `rowNumber`, `reason`, `rawData`

## Key User Flows

1. CSV Import Flow
- User uploads CSV.
- System validates and previews row-level errors.
- User confirms import.
- Data persisted with import batch metadata.

2. Dashboard Flow
- User selects month range.
- System computes monthly totals and category breakdown.
- UI highlights largest increases/decreases month-over-month.

3. Transaction Editing Flow
- User searches/filters transactions.
- User edits category, merchant, description, or type.
- Changes are persisted and analytics recalculate.

## MVP Dashboard Metrics
- Total spending this month vs last month.
- Category spend distribution (pie/bar).
- Top 10 merchants by spend.
- Monthly spend trend line (last 12 months).
- Largest month-over-month increases by category.

## Technical Decisions (Recommended)
- Frontend: `React + TypeScript`.
- Backend: `Node.js + TypeScript` (REST API).
- Database (v1): `SQLite`.
- ORM/Query layer: `Prisma` or `Drizzle`.
- Charts: `Recharts` or `ECharts`.
- Validation: `zod` schemas shared across frontend/backend.

## Phased Roadmap

### Phase 1: Foundation
- Set up monorepo and module boundaries.
- Implement DB schema and repositories.
- Build CSV import + validation pipeline.

### Phase 2: Insights MVP
- Build dashboard metrics and charts.
- Build transaction list + edit UX.
- Add category management.

### Phase 3: Data quality and UX improvements
- Rule-based merchant/category normalization.
- Duplicate detection review UI.
- Import history and rollback per batch.

### Phase 4: Integrations
- Statement import (CSV variants, PDF parsing).
- Bank connector abstraction (e.g., Plaid-like providers).

### Phase 5: Cloud readiness
- Swap SQLite adapter for hosted database.
- Add auth and multi-user support.
- Add background jobs for imports and analytics.

## Immediate Next Build Steps
1. Scaffold `apps/web`, `apps/api`, and `packages/*` directories.
2. Define shared `Transaction`/`ImportBatch` types and zod schemas.
3. Implement SQLite schema + migrations.
4. Build `POST /imports/csv` endpoint with validation report.
5. Build dashboard API endpoints for monthly/category summaries.
6. Implement first dashboard and transaction table screens.

