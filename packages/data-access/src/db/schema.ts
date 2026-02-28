import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentCategoryId: text("parent_category_id"),
  attributes: text("attributes"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const merchants = sqliteTable(
  "merchants",
  {
    id: text("id").primaryKey(),
    displayName: text("display_name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    attributes: text("attributes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [uniqueIndex("merchants_normalized_name_unique").on(table.normalizedName)]
);

export const merchantCategoryPreferences = sqliteTable(
  "merchant_category_preferences",
  {
    id: text("id").primaryKey(),
    merchantId: text("merchant_id")
      .notNull()
      .references(() => merchants.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    source: text("source").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    notes: text("notes"),
    attributes: text("attributes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    check("merchant_category_preferences_source_check", sql`${table.source} in ('user', 'system')`),
    // Enforce one active preference per merchant.
    uniqueIndex("merchant_active_category_pref_unique")
      .on(table.merchantId)
      .where(sql`${table.isActive} = 1`),
    index("merchant_category_preferences_merchant_idx").on(table.merchantId),
    index("merchant_category_preferences_category_idx").on(table.categoryId)
  ]
);

export const importBatches = sqliteTable(
  "import_batches",
  {
    id: text("id").primaryKey(),
    sourceType: text("source_type").notNull(),
    sourceFilename: text("source_filename"),
    importedAt: text("imported_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    totalRows: integer("total_rows").notNull(),
    acceptedRows: integer("accepted_rows").notNull(),
    rejectedRows: integer("rejected_rows").notNull(),
    attributes: text("attributes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    check("import_batches_source_type_check", sql`${table.sourceType} in ('csv', 'statement', 'api')`),
    index("import_batches_imported_at_idx").on(table.importedAt),
    index("import_batches_source_type_idx").on(table.sourceType)
  ]
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    externalId: text("external_id"),
    date: text("date").notNull(),
    description: text("description").notNull(),
    amount: real("amount").notNull(),
    currency: text("currency").notNull(),
    accountName: text("account_name").notNull(),
    accountId: text("account_id"),
    importBatchId: text("import_batch_id").references(() => importBatches.id, {
      onDelete: "set null"
    }),
    merchant: text("merchant"),
    merchantId: text("merchant_id").references(() => merchants.id, { onDelete: "set null" }),
    category: text("category"),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
    type: text("type"),
    attributes: text("attributes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    index("transactions_date_idx").on(table.date),
    index("transactions_import_batch_idx").on(table.importBatchId),
    index("transactions_merchant_idx").on(table.merchantId),
    index("transactions_category_idx").on(table.categoryId),
    index("transactions_account_name_idx").on(table.accountName)
  ]
);

export const importErrors = sqliteTable(
  "import_errors",
  {
    id: text("id").primaryKey(),
    batchId: text("batch_id")
      .notNull()
      .references(() => importBatches.id, { onDelete: "cascade" }),
    rowNumber: integer("row_number").notNull(),
    reason: text("reason").notNull(),
    rawData: text("raw_data"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    index("import_errors_batch_idx").on(table.batchId),
    index("import_errors_row_number_idx").on(table.rowNumber)
  ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id]
  }),
  children: many(categories),
  preferences: many(merchantCategoryPreferences),
  transactions: many(transactions)
}));

export const merchantsRelations = relations(merchants, ({ many }) => ({
  preferences: many(merchantCategoryPreferences),
  transactions: many(transactions)
}));

export const merchantCategoryPreferencesRelations = relations(
  merchantCategoryPreferences,
  ({ one }) => ({
    merchant: one(merchants, {
      fields: [merchantCategoryPreferences.merchantId],
      references: [merchants.id]
    }),
    category: one(categories, {
      fields: [merchantCategoryPreferences.categoryId],
      references: [categories.id]
    })
  })
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  importBatch: one(importBatches, {
    fields: [transactions.importBatchId],
    references: [importBatches.id]
  }),
  merchant: one(merchants, {
    fields: [transactions.merchantId],
    references: [merchants.id]
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id]
  })
}));

export const importBatchesRelations = relations(importBatches, ({ many }) => ({
  errors: many(importErrors),
  transactions: many(transactions)
}));

export const importErrorsRelations = relations(importErrors, ({ one }) => ({
  batch: one(importBatches, {
    fields: [importErrors.batchId],
    references: [importBatches.id]
  })
}));
