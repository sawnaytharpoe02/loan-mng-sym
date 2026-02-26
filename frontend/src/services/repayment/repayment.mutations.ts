import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repaymentApi } from "./repayment.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { CreateRepaymentDTO, UpdateRepaymentDTO } from "./repayment.types";

export function useCreateRepayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRepaymentDTO) => repaymentApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.REPAYMENTS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS }); // balance changes
        },
    });
}

export function useUpdateRepayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRepaymentDTO }) => repaymentApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.REPAYMENTS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS }); // balance changes
        },
    });
}

export function useDeleteRepayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => repaymentApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.REPAYMENTS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS }); // balance changes
        },
    });
}
