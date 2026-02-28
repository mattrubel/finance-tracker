import type {
  MerchantCategoryPreference,
  Transaction
} from "@finance-tracker/shared-types";

export interface MonthlySpend {
  month: string;
  totalExpense: number;
}

export function calculateMonthlySpend(transactions: Transaction[]): MonthlySpend[] {
  const totalsByMonth = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.amount >= 0) {
      continue;
    }

    const month = tx.date.slice(0, 7);
    const current = totalsByMonth.get(month) ?? 0;
    totalsByMonth.set(month, current + Math.abs(tx.amount));
  }

  return [...totalsByMonth.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, totalExpense]) => ({ month, totalExpense }));
}

export function resolvePreferredCategoryId(
  merchantId: string | undefined,
  preferences: MerchantCategoryPreference[]
): string | undefined {
  if (!merchantId) {
    return undefined;
  }

  const activePreference = preferences.find(
    (preference) => preference.isActive && preference.merchantId === merchantId
  );

  return activePreference?.categoryId;
}
