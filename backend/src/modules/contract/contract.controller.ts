import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { ContractService, IS3File } from "./contract.service";
import { ApiResponse } from "../../utils/api-response";
import { ApiError } from "../../utils/api-error";

export class ContractController {
    private contractService = container.resolve<ContractService>("ContractService");

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check for multipart/form-data
            if (!req.is("multipart/form-data")) {
                throw ApiError.badRequest("Content-Type must be multipart/form-data");
            }

            if (!req.file) {
                throw ApiError.badRequest("Contract document file is required");
            }

            const { loanId, signingDate } = req.body;
            const contract = await this.contractService.create(loanId, signingDate, req.file as unknown as IS3File);
            ApiResponse.created(res, "Contract uploaded successfully", contract);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const contracts = await this.contractService.findAll();
            ApiResponse.ok(res, "Contracts retrieved successfully", contracts);
        } catch (error) {
            next(error);
        }
    };

    findByLoanId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contracts = await this.contractService.findByLoanId(req.params.loanId);
            ApiResponse.ok(res, "Contracts retrieved successfully", contracts);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contract = await this.contractService.findById(req.params.id);
            ApiResponse.ok(res, "Contract retrieved successfully", contract);
        } catch (error) {
            next(error);
        }
    };

    download = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { url } = await this.contractService.getDownloadUrl(req.params.id);
            res.redirect(url);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.contractService.delete(req.params.id);
            ApiResponse.ok(res, "Contract deleted successfully");
        } catch (error) {
            next(error);
        }
    };
}
