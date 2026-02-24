import { injectable, inject } from "tsyringe";
import { RepaymentRepository } from "./repayment.repository";
import { LoanRepository } from "../loan/loan.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { CreateRepaymentDTO } from "@loan-mng/shared";
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

    async findByLoanId(loanId: string) {
        return this.repaymentRepository.findByLoanId(loanId);
    }

    async findAll() {
        return this.repaymentRepository.findAll();
    }

    async findById(id: string) {
        const repayment = await this.repaymentRepository.findById(id);
        if (!repayment) {
            throw ApiError.notFound("Repayment not found");
        }
        return repayment;
    }
}
