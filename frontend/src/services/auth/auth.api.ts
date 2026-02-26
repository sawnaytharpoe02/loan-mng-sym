import { api } from "@/lib/axios";
import type { LoginDTO, RegisterDTO } from "@loan-mng/shared";
import type { IResponse } from "@/types/api.types";

export interface User {
    _id: string;
    username: string;
    email: string;
    role: "Admin" | "LoanOfficer" | "Office";
}

interface AuthData {
    user: User;
    token: string;
}

export type AuthResponse = IResponse<AuthData>;
export type ProfileResponse = IResponse<User>;

export const authApi = {
    login: (data: LoginDTO) =>
        api.post<AuthResponse>("/auth/login", data),
    register: (data: RegisterDTO) =>
        api.post<AuthResponse>("/auth/register", data),
    getProfile: () =>
        api.get<ProfileResponse>("/auth/profile"),
};
