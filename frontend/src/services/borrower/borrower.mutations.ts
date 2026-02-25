import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-keys";
import { borrowerApi } from "./borrower.api";
import type { CreateBorrowerDTO, UpdateBorrowerDTO } from "@loan-mng/shared";

export function useCreateBorrower() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBorrowerDTO) => borrowerApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
        },
    });
}

export function useUpdateBorrower(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateBorrowerDTO) => borrowerApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.BORROWER(id) });
        },
    });
}

export function useDeleteBorrower() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => borrowerApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
        },
    });
}
