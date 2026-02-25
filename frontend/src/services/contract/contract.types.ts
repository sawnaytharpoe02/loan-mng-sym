import type { IResponse, Params } from "../../types/api.types";
import type { CreateContractDTO } from "@loan-mng/shared";

export interface Contract {
    _id: string;
    loanId: string | { _id: string; loanAmount: string; borrowerId: string | { fullName: string } };
    signingDate: string;
    contractNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export type ContractListResponse = IResponse<Contract[]>;
export type ContractResponse = IResponse<Contract>;

export type { CreateContractDTO };
export type { Params as ContractParams };
