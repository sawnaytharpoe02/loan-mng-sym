import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../lib/query-keys";
import { createBorrower, updateBorrower, deleteBorrower } from "./borrower.api";
import type { CreateBorrowerDTO, UpdateBorrowerDTO } from "./borrower.types";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json

export const useCreateBorrower = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBorrowerDTO) => createBorrower(payload),
        onSuccess: (response) => {
            toast.success(response.message || "Borrower created successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to create borrower");
        }
    });
};

export const useUpdateBorrower = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBorrowerDTO }) =>
            updateBorrower(id, payload),
        onSuccess: (response, { id }) => {
            toast.success(response.message || "Borrower updated successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEY.BORROWER(id),
            });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update borrower");
        }
    });
};

export const useDeleteBorrower = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBorrower(id),
        onSuccess: (response, id) => {
            toast.success(response.message || "Borrower deleted successfully");
            queryClient.invalidateQueries({
                queryKey: QUERY_KEY.BORROWER(id),
            });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.BORROWERS });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete borrower");
        }
    });
};
