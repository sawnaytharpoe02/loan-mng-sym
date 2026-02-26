import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BorrowerParams, BorrowerListResponse } from "./borrower.types";
import { QUERY_KEY } from "../../lib/query-keys";
import { borrowerApi } from "./borrower.api";

export const useBorrowers = (params?: BorrowerParams) => {
    return useQuery<BorrowerListResponse, Error>({
        queryKey: [...QUERY_KEY.BORROWERS, params ? params : {}],
        queryFn: () => borrowerApi.getAll(params).then((res) => res.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useBorrower = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.BORROWER(id),
        queryFn: () => borrowerApi.getById(id).then((res) => res.data),
        enabled: !!id,
    });
};
