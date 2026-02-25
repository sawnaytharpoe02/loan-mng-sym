import { api } from "../../lib/axios";
import type {
    CreateBorrowerDTO,
    UpdateBorrowerDTO,
    BorrowerListResponse,
    BorrowerResponse,
    BorrowerParams,
} from "./borrower.types";

export const borrowerApi = {
    getAll: (params?: BorrowerParams) =>
        api.get<BorrowerListResponse>("/borrowers", { params }),
    getById: (id: string) =>
        api.get<BorrowerResponse>(`/borrowers/${id}`),
    getByBorrowerId: (borrowerId: string, params?: BorrowerParams) =>
        api.get<BorrowerListResponse>(`/borrowers/borrower/${borrowerId}`, { params }),
    create: (data: CreateBorrowerDTO) =>
        api.post<BorrowerResponse>("/borrowers", data),
    update: (id: string, data: UpdateBorrowerDTO) =>
        api.put<BorrowerResponse>(`/borrowers/${id}`, data),
    delete: (id: string) =>
        api.delete<BorrowerResponse>(`/borrowers/${id}`),
};
