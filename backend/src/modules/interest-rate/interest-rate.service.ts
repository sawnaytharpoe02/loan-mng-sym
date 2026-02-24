import { injectable, inject } from "tsyringe";
import { InterestRateRepository } from "./interest-rate.repository";
import { ApiError } from "../../utils/api-error";
import { logger } from "../../utils/logger";

@injectable()
export class InterestRateService {
    constructor(
        @inject("InterestRateRepository") private interestRateRepository: InterestRateRepository
    ) { }

    async seed() {
        const count = await this.interestRateRepository.count();
        if (count > 0) return;

        const rates = [
            { rate: "5", description: "Low interest rate - 5%" },
            { rate: "10", description: "Standard interest rate - 10%" },
            { rate: "15", description: "Medium interest rate - 15%" },
            { rate: "20", description: "High interest rate - 20%" },
        ];

        for (const rate of rates) {
            await this.interestRateRepository.create(rate);
        }
        logger.info("Interest rates seeded successfully");
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.interestRateRepository.findAll(skip, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                pageSize: limit,
                totalItems: total,
                currentPage: page,
                totalPages
            }
        };
    }

    async findActive(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.interestRateRepository.findActive(skip, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                pageSize: limit,
                totalItems: total,
                currentPage: page,
                totalPages
            }
        };
    }

    async findById(id: string) {
        const rate = await this.interestRateRepository.findById(id);
        if (!rate) {
            throw ApiError.notFound("Interest rate not found");
        }
        return rate;
    }

    async update(id: string, data: { isActive?: boolean; description?: string }) {
        const rate = await this.interestRateRepository.update(id, data);
        if (!rate) {
            throw ApiError.notFound("Interest rate not found");
        }
        return rate;
    }
}
