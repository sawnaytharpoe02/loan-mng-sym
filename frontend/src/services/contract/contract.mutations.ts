import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractApi } from "./contract.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { CreateContractDTO } from "./contract.types";

export function useCreateContract() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateContractDTO) => contractApi.create(data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY.CONTRACTS }); },
    });
}

export function useDeleteContract() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => contractApi.delete(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEY.CONTRACTS }); },
    });
}
