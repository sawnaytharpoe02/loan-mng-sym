import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { repaymentApi } from "./repayment.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { RepaymentParams } from "./repayment.types";

export function useRepayments(params?: RepaymentParams) {
    return useQuery({
        queryKey: [...QUERY_KEY.REPAYMENTS, params],
        queryFn: () => repaymentApi.getAll(params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useRepaymentsByLoan(loanId: string, params?: RepaymentParams) {
    return useQuery({
        queryKey: QUERY_KEY.REPAYMENTS_BY_LOAN(loanId),
        queryFn: () => repaymentApi.getByLoanId(loanId, params).then((r) => r.data),
        enabled: !!loanId,
    });
}
