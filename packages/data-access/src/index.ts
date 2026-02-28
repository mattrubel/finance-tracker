import type {
  Category,
  Merchant,
  MerchantCategoryPreference,
  Transaction
} from "@finance-tracker/shared-types";

export interface TransactionRepository {
  list(): Promise<Transaction[]>;
  upsertMany(transactions: Transaction[]): Promise<void>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  upsert(category: Category): Promise<void>;
}

export interface MerchantRepository {
  list(): Promise<Merchant[]>;
  upsert(merchant: Merchant): Promise<void>;
}

export interface MerchantCategoryPreferenceRepository {
  list(): Promise<MerchantCategoryPreference[]>;
  findActiveByMerchantId(merchantId: string): Promise<MerchantCategoryPreference | undefined>;
  upsert(preference: MerchantCategoryPreference): Promise<void>;
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

export class InMemoryCategoryRepository implements CategoryRepository {
  private readonly items = new Map<string, Category>();

  async list(): Promise<Category[]> {
    return [...this.items.values()];
  }

  async upsert(category: Category): Promise<void> {
    this.items.set(category.id, category);
  }
}

export class InMemoryMerchantRepository implements MerchantRepository {
  private readonly items = new Map<string, Merchant>();

  async list(): Promise<Merchant[]> {
    return [...this.items.values()];
  }

  async upsert(merchant: Merchant): Promise<void> {
    this.items.set(merchant.id, merchant);
  }
}

export class InMemoryMerchantCategoryPreferenceRepository
  implements MerchantCategoryPreferenceRepository
{
  private readonly items = new Map<string, MerchantCategoryPreference>();

  async list(): Promise<MerchantCategoryPreference[]> {
    return [...this.items.values()];
  }

  async findActiveByMerchantId(
    merchantId: string
  ): Promise<MerchantCategoryPreference | undefined> {
    return [...this.items.values()].find(
      (preference) => preference.merchantId === merchantId && preference.isActive
    );
  }

  async upsert(preference: MerchantCategoryPreference): Promise<void> {
    if (preference.isActive) {
      for (const existing of this.items.values()) {
        if (existing.merchantId !== preference.merchantId || !existing.isActive) {
          continue;
        }

        this.items.set(existing.id, {
          ...existing,
          isActive: false,
          updatedAt: preference.updatedAt
        });
      }
    }

    this.items.set(preference.id, preference);
  }
}
