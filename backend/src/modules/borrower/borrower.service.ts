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

    async findAll() {
        return this.borrowerRepository.findAll();
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
