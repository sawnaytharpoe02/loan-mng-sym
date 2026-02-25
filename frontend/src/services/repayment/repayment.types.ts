import type { IResponse, Params } from "../../types/api.types";
import type { CreateRepaymentDTO } from "@loan-mng/shared";

export interface Repayment {
    _id: string;
    loanId: string | { _id: string; loanAmount: string };
    amountPaid: string;
    paymentDate: string;
    paymentTerm?: number;
    principalPaid: string;
    interestPaid: string;
    remainingBalance: string;
    createdAt: string;
    updatedAt: string;
}

export type RepaymentListResponse = IResponse<Repayment[]>;
export type RepaymentResponse = IResponse<Repayment>;

export type { CreateRepaymentDTO };
export type { Params as RepaymentParams };
