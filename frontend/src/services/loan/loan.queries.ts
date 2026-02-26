import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { loanApi } from "./loan.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { LoanParams, LoanListResponse } from "./loan.types";

export function useLoans(params?: LoanParams) {
    return useQuery<LoanListResponse, Error>({
        queryKey: [...QUERY_KEY.LOANS, params],
        queryFn: () => loanApi.getAll(params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useLoan(id: string) {
    return useQuery({
        queryKey: QUERY_KEY.LOAN(id),
        queryFn: () => loanApi.getById(id).then((r) => r.data),
        enabled: !!id,
    });
}

export function useLoansByBorrower(borrowerId: string, params?: LoanParams) {
    return useQuery({
        queryKey: QUERY_KEY.LOANS_BY_BORROWER(borrowerId),
        queryFn: () => loanApi.getByBorrowerId(borrowerId, params).then((r) => r.data),
        enabled: !!borrowerId,
    });
}
