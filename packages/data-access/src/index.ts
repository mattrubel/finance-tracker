import type { Transaction } from "@finance-tracker/shared-types";

export interface TransactionRepository {
  list(): Promise<Transaction[]>;
  upsertMany(transactions: Transaction[]): Promise<void>;
}

export class InMemoryTransactionRepository implements TransactionRepository {
  private readonly items: Transaction[] = [];

  async list(): Promise<Transaction[]> {
    return this.items;
  }

  async upsertMany(transactions: Transaction[]): Promise<void> {
    this.items.push(...transactions);
  }
}
