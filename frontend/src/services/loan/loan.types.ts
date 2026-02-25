import type { IResponse, Params } from "../../types/api.types";
import type { CreateLoanDTO, UpdateLoanDTO, LoanType, LoanStatus } from "@loan-mng/shared";
import type { Borrower } from "../borrower/borrower.types";

export interface Loan {
    _id: string;
    borrowerId: string | Borrower;
    loanAmount: string;
    loanType: LoanType;
    status: LoanStatus;
    startDate: string;
    endDate: string;
    interestRate: string;
    totalWithInterest: string;
    remainingBalance: string;
    createdAt: string;
    updatedAt: string;
}

export type LoanListResponse = IResponse<Loan[]>;
export type LoanResponse = IResponse<Loan>;

export type { CreateLoanDTO, UpdateLoanDTO };
export type { Params as LoanParams };
