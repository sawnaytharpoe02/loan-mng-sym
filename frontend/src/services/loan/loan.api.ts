import { api } from "@/lib/axios";
import type { LoanListResponse, LoanResponse, CreateLoanDTO, UpdateLoanDTO, LoanParams } from "./loan.types";

export const loanApi = {
    getAll: (params?: LoanParams) =>
        api.get<LoanListResponse>("/loans", { params }),
    getById: (id: string) =>
        api.get<LoanResponse>(`/loans/${id}`),
    getByBorrowerId: (borrowerId: string, params?: LoanParams) =>
        api.get<LoanListResponse>(`/loans/borrower/${borrowerId}`, { params }),
    create: (data: CreateLoanDTO) =>
        api.post<LoanResponse>("/loans", data),
    update: (id: string, data: UpdateLoanDTO) =>
        api.put<LoanResponse>(`/loans/${id}`, data),
    delete: (id: string) =>
        api.delete<LoanResponse>(`/loans/${id}`),
};
