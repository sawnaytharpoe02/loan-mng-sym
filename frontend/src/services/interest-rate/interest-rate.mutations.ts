import { useMutation, useQueryClient } from "@tanstack/react-query";
import { interestRateApi } from "./interest-rate.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { CreateInterestRateDTO } from "./interest-rate.types";

export function useCreateInterestRate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateInterestRateDTO) => interestRateApi.create(data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY.INTEREST_RATES }); },
    });
}

export function useUpdateInterestRate(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CreateInterestRateDTO>) => interestRateApi.update(id, data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY.INTEREST_RATES }); },
    });
}

export function useDeleteInterestRate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => interestRateApi.delete(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY.INTEREST_RATES }); },
    });
}
