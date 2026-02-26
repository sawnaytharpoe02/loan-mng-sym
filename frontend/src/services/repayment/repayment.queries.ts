import { keepPreviousData, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { repaymentApi } from "./repayment.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { RepaymentParams, RepaymentListResponse } from "./repayment.types";

export function useRepayments(params?: RepaymentParams, options?: Partial<UseQueryOptions<RepaymentListResponse, Error, RepaymentListResponse>>) {
    return useQuery<RepaymentListResponse, Error>({
        queryKey: [...QUERY_KEY.REPAYMENTS, params],
        queryFn: () => repaymentApi.getAll(params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options as any
    });
}

export function useRepaymentsByLoan(loanId: string, params?: RepaymentParams, options?: Partial<UseQueryOptions<RepaymentListResponse>>) {
    return useQuery({
        queryKey: [...QUERY_KEY.REPAYMENTS_BY_LOAN(loanId), params],
        queryFn: () => repaymentApi.getByLoanId(loanId, params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!loanId,
        ...options as any
    });
}
