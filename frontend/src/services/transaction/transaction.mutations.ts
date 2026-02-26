import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "./transaction.api";
import { QUERY_KEY } from "@/lib/query-keys";
import type { CreateTransactionDTO } from "./transaction.types";

export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTransactionDTO) => transactionApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEY.TRANSACTIONS });
            qc.invalidateQueries({ queryKey: QUERY_KEY.LOANS });
        },
    });
}
