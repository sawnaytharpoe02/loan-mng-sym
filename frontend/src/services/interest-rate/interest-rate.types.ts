import type { IResponse, Params } from "../../types/api.types";
import type { CreateInterestRateDTO } from "@loan-mng/shared";

export interface InterestRate {
    _id: string;
    rate: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type InterestRateListResponse = IResponse<InterestRate[]>;
export type InterestRateResponse = IResponse<InterestRate>;

export type { CreateInterestRateDTO };
export type { Params as InterestRateParams };
