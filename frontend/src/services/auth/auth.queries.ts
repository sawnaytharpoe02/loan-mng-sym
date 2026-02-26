import { useQuery } from "@tanstack/react-query";
import { authApi } from "./auth.api";

export const AUTH_QUERY_KEY = {
    PROFILE: ["auth", "profile"] as const,
};

export function useProfile() {
    return useQuery({
        queryKey: AUTH_QUERY_KEY.PROFILE,
        queryFn: async () => {
            const response = await authApi.getProfile();
            return response.data.data;
        },
    });
}
