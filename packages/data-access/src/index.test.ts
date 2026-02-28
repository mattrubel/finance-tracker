import { describe, expect, it } from "vitest";
import { InMemoryTransactionRepository } from "./index";

describe("InMemoryTransactionRepository", () => {
  it("stores and returns transactions", async () => {
    const repo = new InMemoryTransactionRepository();

    await repo.upsertMany([
      {
        id: "1",
        date: "2026-01-01",
        description: "Lunch",
        amount: -12,
        currency: "USD",
        accountName: "Checking"
      }
    ]);

    const result = await repo.list();
    expect(result).toHaveLength(1);
    expect(result[0]?.description).toBe("Lunch");
  });
});
