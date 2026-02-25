import { useMutation } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            const { user, token } = response.data.data!;
            setAuth(user, token);
        },
    });
}

export function useRegister() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: (response) => {
            const { user, token } = response.data.data!;
            setAuth(user, token);
        },
    });
}
