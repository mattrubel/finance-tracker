export type CurrencyCode = "USD";

export type TransactionType = "expense" | "income" | "transfer" | "refund";

export type RuleSource = "user" | "system";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface Transaction {
  id: string;
  externalId?: string;
  date: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  accountName: string;
  accountId?: string;
  merchant?: string;
  merchantId?: string;
  category?: string;
  categoryId?: string;
  type?: TransactionType;
  attributes?: JsonObject;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  attributes?: JsonObject;
}

export interface Merchant {
  id: string;
  displayName: string;
  normalizedName: string;
  attributes?: JsonObject;
}

export interface MerchantCategoryPreference {
  id: string;
  merchantId: string;
  categoryId: string;
  source: RuleSource;
  isActive: boolean;
  notes?: string;
  attributes?: JsonObject;
  createdAt: string;
  updatedAt: string;
}

export interface ImportError {
  rowNumber: number;
  reason: string;
  rawRow: Record<string, string>;
}

export interface ImportReport {
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  errors: ImportError[];
}
