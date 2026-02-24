import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { InterestRateService } from "./interest-rate.service";
import { ApiResponse } from "../../utils/api-response";

export class InterestRateController {
    private interestRateService = container.resolve<InterestRateService>("InterestRateService");

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.interestRateService.findAll(page, limit);
            ApiResponse.paginatedSuccess(res, "Interest rates retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.interestRateService.findActive(page, limit);
            ApiResponse.paginatedSuccess(res, "Active interest rates retrieved successfully", result.data, result.pagination);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rate = await this.interestRateService.findById(req.params.id);
            ApiResponse.ok(res, "Interest rate retrieved successfully", rate);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rate = await this.interestRateService.update(req.params.id, req.body);
            ApiResponse.ok(res, "Interest rate updated successfully", rate);
        } catch (error) {
            next(error);
        }
    };
}
