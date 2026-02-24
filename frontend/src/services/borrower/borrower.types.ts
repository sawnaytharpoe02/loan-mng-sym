import type { IResponse, Params } from "../../types/api.types";
import type { CreateBorrowerDTO, UpdateBorrowerDTO } from "@loan-mng/shared";

export interface Borrower {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    identificationNumber: string;
    address: string;
    dateOfBirth?: string;
    createdAt: string;
    updatedAt: string;
}

export type BorrowerListResponse = IResponse<Borrower[]>;
export type BorrowerResponse = IResponse<Borrower>;

export type { CreateBorrowerDTO, UpdateBorrowerDTO };
export type { Params as BorrowerParams };
