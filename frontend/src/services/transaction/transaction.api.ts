import { api } from "@/lib/axios";
import type { TransactionListResponse, TransactionResponse, CreateTransactionDTO, TransactionParams } from "./transaction.types";

export const transactionApi = {
    getAll: (params?: TransactionParams) =>
        api.get<TransactionListResponse>("/transactions", { params }),
    getByLoanId: (loanId: string, params?: TransactionParams) =>
        api.get<TransactionListResponse>(`/transactions/loan/${loanId}`, { params }),
    getById: (id: string) =>
        api.get<TransactionResponse>(`/transactions/${id}`),
    create: (data: CreateTransactionDTO) =>
        api.post<TransactionResponse>("/transactions", data),
};
