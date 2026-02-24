import { injectable, inject } from "tsyringe";
import { TransactionRepository } from "./transaction.repository";
import { LoanRepository } from "../loan/loan.repository";
import { CreateTransactionDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";
import Decimal from "decimal.js";

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

        // If it's a late fee or penalty, add to loan remaining balance
        if (data.transactionType === "LateFee" || data.transactionType === "Penalty") {
            const newBalance = new Decimal(loan.remainingBalance).plus(new Decimal(data.amount)).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toString();
            await this.loanRepository.updateBalance(data.loanId, newBalance);
        }

        return transaction;
    }

    async findByLoanId(loanId: string) {
        return this.transactionRepository.findByLoanId(loanId);
    }

    async findAll() {
        return this.transactionRepository.findAll();
    }

    async findById(id: string) {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw ApiError.notFound("Transaction not found");
        }
        return transaction;
    }
}
