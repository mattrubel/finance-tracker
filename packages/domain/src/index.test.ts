import { describe, expect, it } from "vitest";
import { calculateMonthlySpend, resolvePreferredCategoryId } from "./index";
import type { MerchantCategoryPreference, Transaction } from "@finance-tracker/shared-types";

describe("calculateMonthlySpend", () => {
  it("aggregates only expenses by month", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        date: "2026-01-03",
        description: "groceries",
        amount: -20.25,
        currency: "USD",
        accountName: "Checking"
      },
      {
        id: "2",
        date: "2026-01-10",
        description: "salary",
        amount: 1500,
        currency: "USD",
        accountName: "Checking"
      },
      {
        id: "3",
        date: "2026-02-01",
        description: "fuel",
        amount: -40,
        currency: "USD",
        accountName: "Credit"
      }
    ];

    expect(calculateMonthlySpend(transactions)).toEqual([
      { month: "2026-01", totalExpense: 20.25 },
      { month: "2026-02", totalExpense: 40 }
    ]);
  });
});

describe("resolvePreferredCategoryId", () => {
  it("returns the active preference for a merchant", () => {
    const preferences: MerchantCategoryPreference[] = [
      {
        id: "pref-1",
        merchantId: "merchant-1",
        categoryId: "cat-groceries",
        source: "user",
        isActive: true,
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z"
      }
    ];

    expect(resolvePreferredCategoryId("merchant-1", preferences)).toBe("cat-groceries");
  });

  it("ignores inactive preferences", () => {
    const preferences: MerchantCategoryPreference[] = [
      {
        id: "pref-2",
        merchantId: "merchant-1",
        categoryId: "cat-old",
        source: "user",
        isActive: false,
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z"
      }
    ];

    expect(resolvePreferredCategoryId("merchant-1", preferences)).toBeUndefined();
  });
});
