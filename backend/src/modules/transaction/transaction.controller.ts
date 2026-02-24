import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { TransactionService } from "./transaction.service";
import { ApiResponse } from "../../utils/api-response";

export class TransactionController {
    private transactionService = container.resolve<TransactionService>("TransactionService");

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transaction = await this.transactionService.create(req.body);
            ApiResponse.created(res, "Transaction created successfully", transaction);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.transactionService.findAll(page, limit);
            ApiResponse.paginatedSuccess(res, "Transactions retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findByLoanId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.transactionService.findByLoanId(req.params.loanId, page, limit);
            ApiResponse.paginatedSuccess(res, "Transactions retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transaction = await this.transactionService.findById(req.params.id);
            ApiResponse.ok(res, "Transaction retrieved successfully", transaction);
        } catch (error) {
            next(error);
        }
    };
}
