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

export function useDownloadContract() {
    return useMutation({
        mutationFn: async ({ id, filename }: { id: string; filename: string }) => {
            const response = await contractApi.download(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
    });
}
