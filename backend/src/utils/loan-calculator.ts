/**
 * Loan Calculator Utility
 * Calculates monthly repayment using the amortization formula:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where: P = principal, r = monthly interest rate, n = number of months
 */

export interface LoanCalculation {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export function calculateLoan(
    principal: number,
    annualRate: number,
    termMonths: number
): LoanCalculation {
    const monthlyRate = annualRate / 100 / 12;

    let monthlyPayment: number;

    if (monthlyRate === 0) {
        monthlyPayment = principal / termMonths;
    } else {
        const factor = Math.pow(1 + monthlyRate, termMonths);
        monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    monthlyPayment = Math.round(monthlyPayment * 100) / 100;

    const amortizationSchedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = Math.round(balance * monthlyRate * 100) / 100;
        const principalPayment = Math.round((monthlyPayment - interestPayment) * 100) / 100;
        balance = Math.round((balance - principalPayment) * 100) / 100;

        if (month === termMonths) {
            balance = 0;
        }

        amortizationSchedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, balance),
        });
    }

    const totalPayment = Math.round(monthlyPayment * termMonths * 100) / 100;
    const totalInterest = Math.round((totalPayment - principal) * 100) / 100;

    return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        amortizationSchedule,
    };
}
