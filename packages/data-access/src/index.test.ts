import { describe, expect, it } from "vitest";
import {
  InMemoryMerchantCategoryPreferenceRepository,
  InMemoryTransactionRepository
} from "./index";

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

describe("InMemoryMerchantCategoryPreferenceRepository", () => {
  it("returns active preference for a merchant", async () => {
    const repo = new InMemoryMerchantCategoryPreferenceRepository();

    await repo.upsert({
      id: "pref-1",
      merchantId: "merchant-1",
      categoryId: "cat-groceries",
      source: "user",
      isActive: true,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z"
    });

    const active = await repo.findActiveByMerchantId("merchant-1");
    expect(active?.categoryId).toBe("cat-groceries");
  });

  it("deactivates older active preference when a new one is added", async () => {
    const repo = new InMemoryMerchantCategoryPreferenceRepository();

    await repo.upsert({
      id: "pref-1",
      merchantId: "merchant-1",
      categoryId: "cat-groceries",
      source: "user",
      isActive: true,
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z"
    });

    await repo.upsert({
      id: "pref-2",
      merchantId: "merchant-1",
      categoryId: "cat-dining",
      source: "user",
      isActive: true,
      createdAt: "2026-02-02T00:00:00.000Z",
      updatedAt: "2026-02-02T00:00:00.000Z"
    });

    const all = await repo.list();
    const oldPreference = all.find((item) => item.id === "pref-1");
    const active = await repo.findActiveByMerchantId("merchant-1");

    expect(oldPreference?.isActive).toBe(false);
    expect(active?.id).toBe("pref-2");
    expect(active?.categoryId).toBe("cat-dining");
  });
});
