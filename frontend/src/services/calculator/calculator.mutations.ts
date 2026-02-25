import { useMutation } from "@tanstack/react-query";
import { calculatorApi } from "./calculator.api";
import type { LoanCalculatorDTO } from "./calculator.types";

export function useCalculateLoan() {
    return useMutation({
        mutationFn: (data: LoanCalculatorDTO) => calculatorApi.calculate(data),
    });
}
