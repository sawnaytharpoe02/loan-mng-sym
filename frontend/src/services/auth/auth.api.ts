import { api } from "@/lib/axios";
import type { LoginDTO, RegisterDTO } from "@loan-mng/shared";
import type { IResponse } from "@/types/api.types";

interface AuthData {
    user: {
        _id: string;
        username: string;
        email: string;
        role: "Admin" | "LoanOfficer" | "Office";
    };
    token: string;
}

export type AuthResponse = IResponse<AuthData>;

export const authApi = {
    login: (data: LoginDTO) =>
        api.post<AuthResponse>("/auth/login", data),
    register: (data: RegisterDTO) =>
        api.post<AuthResponse>("/auth/register", data),
};
