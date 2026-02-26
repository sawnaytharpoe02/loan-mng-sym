import { injectable, inject } from "tsyringe";
import { TransactionRepository } from "./transaction.repository";
import { LoanRepository } from "../loan/loan.repository";
import { CreateTransactionDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";

@injectable()
export class TransactionService {
    constructor(
        @inject("TransactionRepository") private transactionRepository: TransactionRepository,
        @inject("LoanRepository") private loanRepository: LoanRepository
    ) { }

    async create(data: CreateTransactionDTO) {
        const loan = await this.loanRepository.findById(data.loanId);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }

        const transaction = await this.transactionRepository.create({
            loanId: loan._id as any,
            transactionType: data.transactionType,
            amount: data.amount,
            transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
            description: data.description || "",
        });

        return transaction;
    }

    async findByLoanId(loanId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.transactionRepository.findByLoanId(loanId, skip, limit);
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

    async findAll(page: number = 1, limit: number = 10, transactionType?: string) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.transactionRepository.findAll(skip, limit, transactionType);
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
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw ApiError.notFound("Transaction not found");
        }
        return transaction;
    }
}
