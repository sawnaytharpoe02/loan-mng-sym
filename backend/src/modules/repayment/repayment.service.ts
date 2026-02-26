import { injectable, inject } from "tsyringe";
import { RepaymentRepository } from "./repayment.repository";
import { LoanRepository } from "../loan/loan.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { CreateRepaymentDTO, UpdateRepaymentDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";
import Decimal from "decimal.js";

@injectable()
export class RepaymentService {
    constructor(
        @inject("RepaymentRepository") private repaymentRepository: RepaymentRepository,
        @inject("LoanRepository") private loanRepository: LoanRepository,
        @inject("TransactionRepository") private transactionRepository: TransactionRepository
    ) { }

    async create(data: CreateRepaymentDTO) {
        // Get the loan
        const loan = await this.loanRepository.findById(data.loanId);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }

        if (loan.status === "Closed") {
            throw ApiError.badRequest("This loan is already closed");
        }

        const amountPaid = new Decimal(data.amountPaid);
        const currentPrincipal = new Decimal(loan.remainingBalance);
        const interestRate = new Decimal(loan.interestRate);
        const monthlyRate = interestRate.div(100).div(12);

        if (amountPaid.greaterThan(currentPrincipal)) {
            throw ApiError.badRequest(
                `Payment (${amountPaid.toFixed(0)}) exceeds remaining principal (${currentPrincipal.toFixed(0)})`
            );
        }

        // Calculate expected EMI
        const startDate = new Date(loan.startDate);
        const endDate = new Date(loan.endDate);
        const termMonths = Math.max(
            1,
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
        );

        const originalPrincipal = new Decimal(loan.loanAmount);
        let emi = new Decimal(0);
        if (monthlyRate.isZero()) {
            emi = originalPrincipal.div(termMonths);
        } else {
            const factor = new Decimal(1).plus(monthlyRate).pow(termMonths);
            emi = originalPrincipal.mul(monthlyRate).mul(factor).div(factor.minus(1));
        }

        let interestPortion = new Decimal(0);
        let principalPortion = amountPaid;

        // Apply normal EMI logic or Full Settlement logic
        if (amountPaid.lessThan(currentPrincipal) && amountPaid.greaterThanOrEqualTo(emi)) {
            // Normal EMI: Calculate interest, the remainder goes to principal
            interestPortion = currentPrincipal.mul(monthlyRate).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
            principalPortion = amountPaid.minus(interestPortion);
        } else if (amountPaid.greaterThanOrEqualTo(currentPrincipal)) {
            // Full Settlement: Waive future interest
            principalPortion = currentPrincipal;
            interestPortion = new Decimal(0);
        }

        // Calculate new principal balance
        let newBalance = currentPrincipal.minus(principalPortion).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

        // Treat as fully paid if remainder is extremely small
        if (newBalance.lessThanOrEqualTo(0.01)) {
            newBalance = new Decimal(0);
        }

        const newBalanceStr = newBalance.toString();

        // Create repayment record
        const repayment = await this.repaymentRepository.create({
            loanId: loan._id as any,
            amountPaid: data.amountPaid,
            principalPaid: principalPortion.toString(),
            interestPaid: interestPortion.toString(),
            paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
            remainingBalance: newBalanceStr,
            paymentTerm: data.paymentTerm || 0,
        });

        // Update loan balance
        await this.loanRepository.updateBalance(data.loanId, newBalanceStr);

        // Create a transaction record
        await this.transactionRepository.create({
            loanId: loan._id as any,
            transactionType: "Repayment",
            amount: data.amountPaid,
            transactionDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
            description: `Repayment of ${data.amountPaid}. Remaining balance: ${newBalanceStr}`,
        });

        return repayment;
    }

    async update(id: string, data: UpdateRepaymentDTO) {
        const existingRepayment = await this.repaymentRepository.findById(id);
        if (!existingRepayment) {
            throw ApiError.notFound("Repayment not found");
        }

        const loanId = typeof (existingRepayment.loanId as any)._id !== "undefined"
            ? (existingRepayment.loanId as any)._id.toString()
            : existingRepayment.loanId.toString();

        const loan = await this.loanRepository.findById(loanId);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }

        // Reverse old repayment's principal effect on loan balance
        const oldPrincipalPaid = new Decimal(existingRepayment.principalPaid);
        const restoredBalance = new Decimal(loan.remainingBalance).plus(oldPrincipalPaid);

        const newAmountPaid = data.amountPaid ? new Decimal(data.amountPaid) : new Decimal(existingRepayment.amountPaid);

        if (newAmountPaid.greaterThan(restoredBalance)) {
            throw ApiError.badRequest(
                `Payment (${newAmountPaid.toFixed(0)}) exceeds remaining principal (${restoredBalance.toFixed(0)})`
            );
        }

        // Recalculate interest/principal split
        const interestRate = new Decimal(loan.interestRate);
        const monthlyRate = interestRate.div(100).div(12);

        const startDate = new Date(loan.startDate);
        const endDate = new Date(loan.endDate);
        const termMonths = Math.max(
            1,
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
        );

        const originalPrincipal = new Decimal(loan.loanAmount);
        let emi = new Decimal(0);
        if (monthlyRate.isZero()) {
            emi = originalPrincipal.div(termMonths);
        } else {
            const factor = new Decimal(1).plus(monthlyRate).pow(termMonths);
            emi = originalPrincipal.mul(monthlyRate).mul(factor).div(factor.minus(1));
        }

        let interestPortion = new Decimal(0);
        let principalPortion = newAmountPaid;

        if (newAmountPaid.lessThan(restoredBalance) && newAmountPaid.greaterThanOrEqualTo(emi)) {
            interestPortion = restoredBalance.mul(monthlyRate).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
            principalPortion = newAmountPaid.minus(interestPortion);
        } else if (newAmountPaid.greaterThanOrEqualTo(restoredBalance)) {
            principalPortion = restoredBalance;
            interestPortion = new Decimal(0);
        }

        let newBalance = restoredBalance.minus(principalPortion).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
        if (newBalance.lessThanOrEqualTo(0.01)) {
            newBalance = new Decimal(0);
        }
        const newBalanceStr = newBalance.toString();

        // Update repayment record
        const updatedRepayment = await this.repaymentRepository.update(id, {
            amountPaid: data.amountPaid || existingRepayment.amountPaid,
            principalPaid: principalPortion.toString(),
            interestPaid: interestPortion.toString(),
            paymentDate: data.paymentDate ? new Date(data.paymentDate) : existingRepayment.paymentDate,
            remainingBalance: newBalanceStr,
            paymentTerm: data.paymentTerm ?? existingRepayment.paymentTerm,
        });

        // Update loan balance
        await this.loanRepository.updateBalance(loanId, newBalanceStr);

        return updatedRepayment;
    }

    async findByLoanId(loanId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.repaymentRepository.findByLoanId(loanId, skip, limit);
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

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.repaymentRepository.findAll(skip, limit);
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
        const repayment = await this.repaymentRepository.findById(id);
        if (!repayment) {
            throw ApiError.notFound("Repayment not found");
        }
        return repayment;
    }
}
