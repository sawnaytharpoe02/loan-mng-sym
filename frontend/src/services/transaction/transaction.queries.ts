import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { transactionApi } from "./transaction.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { TransactionParams } from "./transaction.types";

export function useTransactions(params?: TransactionParams) {
    return useQuery({
        queryKey: [...QUERY_KEY.TRANSACTIONS, params],
        queryFn: () => transactionApi.getAll(params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useTransactionsByLoan(loanId: string, params?: TransactionParams) {
    return useQuery({
        queryKey: QUERY_KEY.TRANSACTIONS_BY_LOAN(loanId),
        queryFn: () => transactionApi.getByLoanId(loanId, params).then((r) => r.data),
        placeholderData: keepPreviousData,
        enabled: !!loanId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
