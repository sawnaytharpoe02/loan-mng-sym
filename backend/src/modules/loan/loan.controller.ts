import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { LoanService } from "./loan.service";
import { ApiResponse } from "../../utils/api-response";

export class LoanController {
    private loanService = container.resolve<LoanService>("LoanService");

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loan = await this.loanService.create(req.body);
            ApiResponse.created(res, "Loan created successfully", loan);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.loanService.findAll(page, limit);
            ApiResponse.paginatedSuccess(res, "Loans retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loan = await this.loanService.findById(req.params.id);
            ApiResponse.ok(res, "Loan retrieved successfully", loan);
        } catch (error) {
            next(error);
        }
    };

    findByBorrowerId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.loanService.findByBorrowerId(req.params.borrowerId, page, limit);
            ApiResponse.paginatedSuccess(res, "Loans retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loan = await this.loanService.update(req.params.id, req.body);
            ApiResponse.ok(res, "Loan updated successfully", loan);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.loanService.delete(req.params.id);
            ApiResponse.ok(res, "Loan deleted successfully");
        } catch (error) {
            next(error);
        }
    };
}
