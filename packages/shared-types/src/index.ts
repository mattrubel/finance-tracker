export type CurrencyCode = "USD";

export type TransactionType = "expense" | "income" | "transfer" | "refund";

export interface Transaction {
  id: string;
  externalId?: string;
  date: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  accountName: string;
  category?: string;
  merchant?: string;
  type?: TransactionType;
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
