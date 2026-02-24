import { injectable, inject } from "tsyringe";
import { BorrowerRepository } from "./borrower.repository";
import { CreateBorrowerDTO, UpdateBorrowerDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";

@injectable()
export class BorrowerService {
    constructor(
        @inject("BorrowerRepository") private borrowerRepository: BorrowerRepository
    ) { }

    async create(data: CreateBorrowerDTO) {
        const existing = await this.borrowerRepository.findByNrc(data.nrc);
        if (existing) {
            throw ApiError.conflict("Borrower with this NRC already exists");
        }
        return this.borrowerRepository.create(data);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.borrowerRepository.findAll(skip, limit);

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
        const borrower = await this.borrowerRepository.findById(id);
        if (!borrower) {
            throw ApiError.notFound("Borrower not found");
        }
        return borrower;
    }

    async update(id: string, data: UpdateBorrowerDTO) {
        const borrower = await this.borrowerRepository.update(id, data);
        if (!borrower) {
            throw ApiError.notFound("Borrower not found");
        }
        return borrower;
    }

    async delete(id: string) {
        const borrower = await this.borrowerRepository.delete(id);
        if (!borrower) {
            throw ApiError.notFound("Borrower not found");
        }
        return borrower;
    }
}
