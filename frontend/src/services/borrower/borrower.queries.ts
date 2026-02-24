import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { BorrowerParams } from "./borrower.types";
import { QUERY_KEY } from "../../lib/query-keys";
import { fetchBorrowerById, fetchBorrowers } from "./borrower.api";

export const useBorrowers = (params?: BorrowerParams) => {
    return useQuery({
        queryKey: [...QUERY_KEY.BORROWERS, params ? params : {}],
        queryFn: () => fetchBorrowers(params),
        placeholderData: keepPreviousData,
    });
};

export const useBorrower = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.BORROWER(id),
        queryFn: () => fetchBorrowerById(id),
        enabled: !!id,
    });
};
