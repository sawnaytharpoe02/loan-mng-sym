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

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const transactions = await this.transactionService.findAll();
            ApiResponse.ok(res, "Transactions retrieved successfully", transactions);
        } catch (error) {
            next(error);
        }
    };

    findByLoanId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactions = await this.transactionService.findByLoanId(req.params.loanId);
            ApiResponse.ok(res, "Transactions retrieved successfully", transactions);
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
