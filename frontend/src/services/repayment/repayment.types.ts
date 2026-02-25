import type { IResponse, Params } from "../../types/api.types";
import type { CreateRepaymentDTO } from "@loan-mng/shared";
import type { Loan } from "../loan/loan.types";

export interface Repayment {
    _id: string;
    loanId: string | Loan;
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
