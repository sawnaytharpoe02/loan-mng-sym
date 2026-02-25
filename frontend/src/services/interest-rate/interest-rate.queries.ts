import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { interestRateApi } from "./interest-rate.api";
import { QUERY_KEY } from "@/lib/query-keys";

export function useInterestRates() {
    return useQuery({
        queryKey: QUERY_KEY.INTEREST_RATES,
        queryFn: () => interestRateApi.getAll().then((r) => r.data),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useActiveInterestRates() {
    return useQuery({
        queryKey: QUERY_KEY.ACTIVE_INTEREST_RATES,
        queryFn: () => interestRateApi.getActive().then((r) => r.data),
    });
}
