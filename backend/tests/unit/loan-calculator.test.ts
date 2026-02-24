import { calculateLoan } from "../../src/utils/loan-calculator";

describe("Loan Calculator", () => {
    it("should calculate monthly payment for a standard loan", () => {
        // 10,000 loan at 10% annual rate for 12 months
        const result = calculateLoan("10000", "10", 12);

        expect(Number(result.monthlyPayment)).toBeCloseTo(879.16, 0); // it will be output 879
        expect(Number(result.totalPayment)).toBeGreaterThan(10000);
        expect(Number(result.totalInterest)).toBeGreaterThan(0);
        expect(result.amortizationSchedule).toHaveLength(12);
    });

    it("should calculate zero interest loan correctly", () => {
        const result = calculateLoan("12000", "0", 12);

        expect(Number(result.monthlyPayment)).toBe(1000);
        expect(Number(result.totalPayment)).toBe(12000);
        expect(Number(result.totalInterest)).toBe(0);
        expect(result.amortizationSchedule).toHaveLength(12);
    });

    it("should have last payment with zero balance", () => {
        const result = calculateLoan("10000", "15", 24);
        const lastEntry = result.amortizationSchedule[result.amortizationSchedule.length - 1];

        expect(Number(lastEntry.balance)).toBe(0);
        expect(lastEntry.month).toBe(24);
    });

    it("should calculate correct number of schedule entries", () => {
        const result = calculateLoan("5000", "20", 6);
        expect(result.amortizationSchedule).toHaveLength(6);
    });

    it("should ensure total interest increases with higher rates", () => {
        const low = calculateLoan("10000", "5", 12);
        const high = calculateLoan("10000", "20", 12);

        expect(Number(high.totalInterest)).toBeGreaterThan(Number(low.totalInterest));
    });
});
