import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { contractApi } from "./contract.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { ContractParams } from "./contract.types";

export function useContracts(params?: ContractParams) {
    return useQuery({
        queryKey: [...QUERY_KEY.CONTRACTS, params],
        queryFn: () => contractApi.getAll(params).then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useContractsByLoan(loanId: string) {
    return useQuery({
        queryKey: QUERY_KEY.CONTRACTS_BY_LOAN(loanId),
        queryFn: () => contractApi.getByLoanId(loanId).then((r) => r.data),
        enabled: !!loanId,
    });
}
