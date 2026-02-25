import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { BorrowerService } from "./borrower.service";
import { ApiResponse } from "../../utils/api-response";

export class BorrowerController {
    private borrowerService = container.resolve<BorrowerService>("BorrowerService");

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const borrower = await this.borrowerService.create(req.body);
            ApiResponse.created(res, "Borrower created successfully", borrower);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const result = await this.borrowerService.findAll(page, limit, search);
            ApiResponse.paginatedSuccess(res, "Borrowers retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const borrower = await this.borrowerService.findById(req.params.id);
            ApiResponse.ok(res, "Borrower retrieved successfully", borrower);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const borrower = await this.borrowerService.update(req.params.id, req.body);
            ApiResponse.ok(res, "Borrower updated successfully", borrower);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.borrowerService.delete(req.params.id);
            ApiResponse.ok(res, "Borrower deleted successfully");
        } catch (error) {
            next(error);
        }
    };
}
