import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanApi } from "./loan.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { CreateLoanDTO, UpdateLoanDTO } from "./loan.types";

export function useCreateLoan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLoanDTO) => loanApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS });
        },
    });
}

export function useUpdateLoan(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateLoanDTO) => loanApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOAN(id) });
        },
    });
}

export function useDeleteLoan() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => loanApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS });
        },
    });
}
