import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { InterestRateService } from "./interest-rate.service";
import { ApiResponse } from "../../utils/api-response";

export class InterestRateController {
    private interestRateService = container.resolve<InterestRateService>("InterestRateService");

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const rates = await this.interestRateService.findAll();
            ApiResponse.ok(res, "Interest rates retrieved successfully", rates);
        } catch (error) {
            next(error);
        }
    };

    findActive = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const rates = await this.interestRateService.findActive();
            ApiResponse.ok(res, "Active interest rates retrieved successfully", rates);
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
