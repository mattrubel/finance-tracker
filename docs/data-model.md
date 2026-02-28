# Data Model Notes

This document defines the current model contracts used by `packages/shared-types`.

## Design goals
- Support reliable month-over-month spending analysis.
- Preserve user intent when categorizing merchants.
- Stay extensible without frequent schema rewrites.

## Core entities

### Transaction
- `id`: internal transaction id.
- `externalId?`: source-provided id from bank/statement.
- `date`: ISO date (`YYYY-MM-DD`).
- `description`: canonical transaction description.
- `amount`: signed decimal (`< 0` expense, `> 0` income/refund).
- `currency`: ISO code (currently `USD`).
- `accountName`: source account label.
- `accountId?`: normalized account reference.
- `merchant?`: display merchant name from source/user edits.
- `merchantId?`: normalized merchant reference.
- `category?`: display category from source/user edits.
- `categoryId?`: normalized category reference.
- `type?`: `expense | income | transfer | refund`.
- `attributes?`: flexible JSON object for future feature fields.

### Merchant
- `id`: normalized merchant id.
- `displayName`: user-facing merchant name.
- `normalizedName`: normalized name key for matching/dedup.
- `attributes?`: flexible JSON object.

### Category
- `id`: category id.
- `name`: user-facing category name.
- `parentCategoryId?`: optional hierarchy support.
- `attributes?`: flexible JSON object.

### MerchantCategoryPreference
Represents remembered user categorization choices for merchants.

- `id`: preference record id.
- `merchantId`: merchant being classified.
- `categoryId`: chosen category.
- `source`: `user | system`.
- `isActive`: active preference flag.
- `notes?`: optional rationale.
- `attributes?`: flexible JSON object.
- `createdAt`, `updatedAt`: ISO timestamps.

## Relationship behavior
- A merchant can have many historical preference rows.
- Only one active preference should exist per merchant.
- Writing a new active preference for a merchant deactivates older active preferences.
- Transaction categorization can resolve by:
  1. explicit `transaction.categoryId` if set,
  2. active `MerchantCategoryPreference` for `transaction.merchantId`,
  3. fallback to uncategorized/manual review.

## Extensibility strategy
- Use typed core fields for stable analytics dimensions (date, amount, merchant/category references).
- Use `attributes` for additive metadata (tags, confidence, import hints, geo, custom user fields).
- Promote heavily used `attributes` keys into first-class fields only after feature stabilization.

## Storage notes (planned SQLite)
- Add unique/partial index to enforce one active preference per merchant.
- Keep preference history for explainability and auditability.
- Keep import batch linkage on transactions for rollback/debug flows.
