import type { Transaction } from "@finance-tracker/shared-types";

export function summarizeTransactions(transactions: Transaction[]): string {
  const expenseCount = transactions.filter((tx) => tx.amount < 0).length;
  return `Loaded ${transactions.length} transactions (${expenseCount} expenses)`;
}
