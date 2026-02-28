import { describe, expect, it } from "vitest";
import { calculateMonthlySpend } from "./index";
import type { Transaction } from "@finance-tracker/shared-types";

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
