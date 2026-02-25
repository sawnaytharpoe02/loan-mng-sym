import type { IResponse, Params } from "../../types/api.types";
import type { CreateContractDTO } from "@loan-mng/shared";
import type { Loan } from "../loan/loan.types";

export interface Contract {
    _id: string;
    loanId: string | Loan;
    signingDate: string;
    contractNumber: string;
    originalName: string;
    documentPath: string;
    createdAt: string;
    updatedAt: string;
}

export type ContractListResponse = IResponse<Contract[]>;
export type ContractResponse = IResponse<Contract>;

export type { CreateContractDTO };
export type { Params as ContractParams };
