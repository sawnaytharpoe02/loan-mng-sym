import { api } from "@/lib/axios";
import type { ContractListResponse, ContractResponse, CreateContractDTO, ContractParams } from "./contract.types";

export const contractApi = {
    getAll: (params?: ContractParams) =>
        api.get<ContractListResponse>("/contracts", { params }),
    getByLoanId: (loanId: string) =>
        api.get<ContractListResponse>(`/contracts/loan/${loanId}`),
    getById: (id: string) =>
        api.get<ContractResponse>(`/contracts/${id}`),
    create: (data: CreateContractDTO) =>
        api.post<ContractResponse>("/contracts", data),
    delete: (id: string) =>
        api.delete<ContractResponse>(`/contracts/${id}`),
};
