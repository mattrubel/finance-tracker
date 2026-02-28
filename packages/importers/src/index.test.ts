import { describe, expect, it } from "vitest";
import { buildEmptyReport, normalizeTransaction, validateCsvHeaders } from "./index";

describe("validateCsvHeaders", () => {
  it("returns missing required headers", () => {
    const missing = validateCsvHeaders(["date", "description", "amount"]);
    expect(missing).toEqual(["currency", "account_name"]);
  });

  it("returns no missing headers when complete", () => {
    const missing = validateCsvHeaders([
      "date",
      "description",
      "amount",
      "currency",
      "account_name"
    ]);
    expect(missing).toEqual([]);
  });
});

describe("buildEmptyReport", () => {
  it("creates a zeroed import report", () => {
    expect(buildEmptyReport()).toEqual({
      totalRows: 0,
      acceptedRows: 0,
      rejectedRows: 0,
      errors: []
    });
  });
});

describe("normalizeTransaction", () => {
  it("trims supported fields", () => {
    const tx = normalizeTransaction({
      id: "abc",
      date: "2026-01-01",
      description: "  Coffee shop  ",
      amount: -4.5,
      currency: "USD",
      accountName: "  Card  ",
      merchant: "  Coffee  ",
      category: "  Dining  "
    });

    expect(tx.description).toBe("Coffee shop");
    expect(tx.accountName).toBe("Card");
    expect(tx.merchant).toBe("Coffee");
    expect(tx.category).toBe("Dining");
  });
});
