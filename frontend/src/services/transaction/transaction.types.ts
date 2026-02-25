import type { IResponse, Params } from "../../types/api.types";
import type { CreateTransactionDTO, TransactionType } from "@loan-mng/shared";

export interface Transaction {
    _id: string;
    loanId: string | { _id: string };
    transactionType: TransactionType;
    amount: string;
    description?: string;
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
}

export type TransactionListResponse = IResponse<Transaction[]>;
export type TransactionResponse = IResponse<Transaction>;

export type { CreateTransactionDTO };
export type { Params as TransactionParams };
