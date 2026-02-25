import type { IResponse, Params } from "../../types/api.types";
import type { CreateTransactionDTO, TransactionType } from "@loan-mng/shared";
import type { Loan } from "../loan/loan.types";

export interface Transaction {
    _id: string;
    loanId: null | Loan;
    transactionDate: string;
    transactionType: TransactionType;
    amount: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export type TransactionListResponse = IResponse<Transaction[]>;
export type TransactionResponse = IResponse<Transaction>;

export type { CreateTransactionDTO };
export type { Params as TransactionParams };
