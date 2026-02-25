import { api } from "@/lib/axios";
import type { IResponse } from "@/types/api.types";
import type { LoanCalculatorDTO, LoanCalculationResponse } from "./calculator.types";

export const calculatorApi = {
    calculate: (data: LoanCalculatorDTO) =>
        api.post<IResponse<LoanCalculationResponse>>("/calculator", data),
};
