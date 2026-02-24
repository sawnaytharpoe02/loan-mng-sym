/**
 * Loan Calculator Utility (Industry called Equated Monthly Installment (EMI))
 * Calculates monthly repayment using the amortization formula:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where: P = principal, r = monthly interest rate, n = number of months
 */


/**
 * Interest Rate depend on loan type 
 * 5 - mortgage
 * 10 - education
 * 15 - business
 * 20 - personal
 */

import Decimal from "decimal.js";

export interface LoanCalculation {
    monthlyPayment: string;
    totalPayment: string;
    totalInterest: string;
    amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
    month: number;
    payment: string;
    principal: string;
    interest: string;
    balance: string;
}

export function calculateLoan(
    principalStr: string,
    annualRateStr: string,
    termMonths: number
): LoanCalculation {
    const principal = new Decimal(principalStr);
    const annualRate = new Decimal(annualRateStr);
    const monthlyRate = annualRate.div(100).div(12);

    let monthlyPayment: Decimal;

    if (monthlyRate.isZero()) {
        monthlyPayment = principal.div(termMonths);
    } else {
        const factor = new Decimal(1).plus(monthlyRate).pow(termMonths);
        monthlyPayment = principal.mul(monthlyRate).mul(factor).div(factor.minus(1));
    }

    // EMI gets rounded here
    const monthlyPaymentStr = monthlyPayment.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toString();
    const actualMonthlyPayment = new Decimal(monthlyPaymentStr);

    const amortizationSchedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = balance.mul(monthlyRate).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
        let principalPayment = actualMonthlyPayment.minus(interestPayment);
        balance = balance.minus(principalPayment);

        if (month === termMonths) {
            // Adjust final payment to cover any rounding differences
            principalPayment = principalPayment.plus(balance);
            balance = new Decimal(0);
        }

        amortizationSchedule.push({
            month,
            payment: monthlyPaymentStr,
            principal: principalPayment.toString(),
            interest: interestPayment.toString(),
            balance: balance.greaterThan(0) ? balance.toString() : "0",
        });
    }

    const totalPayment = actualMonthlyPayment.mul(termMonths).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    const totalInterest = totalPayment.minus(principal).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

    return {
        monthlyPayment: monthlyPaymentStr,
        totalPayment: totalPayment.toString(),
        totalInterest: totalInterest.toString(),
        amortizationSchedule,
    };
}
