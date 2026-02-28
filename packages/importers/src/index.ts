import type { ImportReport, Transaction } from "@finance-tracker/shared-types";

const REQUIRED_HEADERS = ["date", "description", "amount", "currency", "account_name"] as const;

export function validateCsvHeaders(headers: string[]): string[] {
  return REQUIRED_HEADERS.filter((required) => !headers.includes(required));
}

export function buildEmptyReport(): ImportReport {
  return {
    totalRows: 0,
    acceptedRows: 0,
    rejectedRows: 0,
    errors: []
  };
}

export function normalizeTransaction(tx: Transaction): Transaction {
  const merchant = tx.merchant?.trim();
  const category = tx.category?.trim();

  return {
    ...tx,
    description: tx.description.trim(),
    accountName: tx.accountName.trim(),
    ...(merchant !== undefined ? { merchant } : {}),
    ...(category !== undefined ? { category } : {})
  };
}
