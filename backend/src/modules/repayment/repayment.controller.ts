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

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.repaymentService.findAll(page, limit);
            ApiResponse.paginatedSuccess(res, "Repayments retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findByLoanId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.repaymentService.findByLoanId(req.params.loanId, page, limit);
            ApiResponse.paginatedSuccess(res, "Repayments retrieved successfully", result.data, result.pagination);
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
