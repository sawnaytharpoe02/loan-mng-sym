import { api } from "@/lib/axios";
import type { RepaymentListResponse, RepaymentResponse, CreateRepaymentDTO, RepaymentParams } from "./repayment.types";

export const repaymentApi = {
    getAll: (params?: RepaymentParams) =>
        api.get<RepaymentListResponse>("/repayments", { params }),
    getByLoanId: (loanId: string, params?: RepaymentParams) =>
        api.get<RepaymentListResponse>(`/repayments/loan/${loanId}`, { params }),
    getById: (id: string) =>
        api.get<RepaymentResponse>(`/repayments/${id}`),
    create: (data: CreateRepaymentDTO) =>
        api.post<RepaymentResponse>("/repayments", data),
    delete: (id: string) =>
        api.delete<RepaymentResponse>(`/repayments/${id}`),
};
