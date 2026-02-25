import type { LoanCalculatorDTO } from "@loan-mng/shared";

export interface AmortizationEntry {
    month: number;
    payment: string;
    principal: string;
    interest: string;
    balance: string;
}

export interface LoanCalculationResponse {
    monthlyPayment: string;
    totalPayment: string;
    totalInterest: string;
    amortizationSchedule: AmortizationEntry[];
}

export type { LoanCalculatorDTO };
