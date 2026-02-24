import { api } from "../../lib/axios";
import type { IResponse } from "../../types/api.types";
import type {
    CreateBorrowerDTO,
    UpdateBorrowerDTO,
    BorrowerListResponse,
    BorrowerResponse,
    BorrowerParams,
} from "./borrower.types";

const fetchBorrowers = async (params?: BorrowerParams): Promise<BorrowerListResponse> => {
    const { data } = await api.get<BorrowerListResponse>("/borrowers", {
        params,
    });
    return data;
};

// GET by id
const fetchBorrowerById = async (id: string): Promise<BorrowerResponse> => {
    const { data } = await api.get(`/borrowers/${id}`);
    return data;
};

// CREATE
const createBorrower = async (
    payload: CreateBorrowerDTO,
): Promise<BorrowerResponse> => {
    const { data } = await api.post("/borrowers", payload);
    return data;
};

// UPDATE
const updateBorrower = async (
    id: string,
    payload: UpdateBorrowerDTO,
): Promise<BorrowerResponse> => {
    const { data } = await api.patch(`/borrowers/${id}`, payload);
    return data;
};

// DELETE
const deleteBorrower = async (id: string): Promise<IResponse<null>> => {
    const { data } = await api.delete(`/borrowers/${id}`);
    return data;
};

export {
    fetchBorrowers,
    fetchBorrowerById,
    createBorrower,
    updateBorrower,
    deleteBorrower,
};
