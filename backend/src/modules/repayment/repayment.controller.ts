import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { RepaymentService } from "./repayment.service";
import { ApiResponse } from "../../utils/api-response";

export class RepaymentController {
    private repaymentService = container.resolve<RepaymentService>("RepaymentService");

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const repayment = await this.repaymentService.create(req.body);
            ApiResponse.created(res, "Repayment recorded successfully", repayment);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const repayments = await this.repaymentService.findAll();
            ApiResponse.ok(res, "Repayments retrieved successfully", repayments);
        } catch (error) {
            next(error);
        }
    };

    findByLoanId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const repayments = await this.repaymentService.findByLoanId(req.params.loanId);
            ApiResponse.ok(res, "Repayments retrieved successfully", repayments);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const repayment = await this.repaymentService.findById(req.params.id);
            ApiResponse.ok(res, "Repayment retrieved successfully", repayment);
        } catch (error) {
            next(error);
        }
    };
}
