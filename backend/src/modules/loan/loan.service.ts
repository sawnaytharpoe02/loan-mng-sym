import { injectable, inject } from "tsyringe";
import { LoanRepository } from "./loan.repository";
import { BorrowerRepository } from "../borrower/borrower.repository";
import { CreateLoanDTO, UpdateLoanDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";
import Decimal from "decimal.js";

@injectable()
export class LoanService {
    constructor(
        @inject("LoanRepository") private loanRepository: LoanRepository,
        @inject("BorrowerRepository") private borrowerRepository: BorrowerRepository
    ) { }

    async create(data: CreateLoanDTO) {
        // Verify borrower exists
        const borrower = await this.borrowerRepository.findById(data.borrowerId);
        if (!borrower) {
            throw ApiError.notFound("Borrower not found");
        }

        // Calculate total with interest
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const months = Math.max(
            1,
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())
        );

        console.log('months ', months)

        const loanAmount = new Decimal(data.loanAmount);
        const interestRate = new Decimal(data.interestRate);
        const monthlyRate = interestRate.div(100).div(12);
        let totalWithInterest: string;

        console.log('monthly Rate', monthlyRate)

        if (monthlyRate.isZero()) {
            totalWithInterest = loanAmount.toString();

        } else {
            const factor = new Decimal(1).plus(monthlyRate).pow(months);
            const monthlyPayment = loanAmount.mul(monthlyRate).mul(factor).div(factor.minus(1));
            totalWithInterest = monthlyPayment.mul(months).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toString();

            console.log('factor', factor, 'monthly payment', monthlyPayment)
        }


        console.log('totalWithInterest', totalWithInterest);


        return this.loanRepository.create({
            ...data,
            startDate,
            endDate,
            remainingBalance: loanAmount.toString(),
            totalWithInterest,
        } as any);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.loanRepository.findAll(skip, limit);
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
        const loan = await this.loanRepository.findById(id);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }
        return loan;
    }

    async findByBorrowerId(borrowerId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { data, total } = await this.loanRepository.findByBorrowerId(borrowerId, skip, limit);
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

    async update(id: string, data: UpdateLoanDTO) {
        const existingLoan = await this.loanRepository.findById(id);
        if (!existingLoan) {
            throw ApiError.notFound("Loan not found");
        }

        const updateData: any = { ...data };

        // Check if any fields that affect interest calculation are being updated
        const needsRecalculation =
            data.loanAmount !== undefined ||
            data.interestRate !== undefined ||
            data.startDate !== undefined ||
            data.endDate !== undefined;

        if (needsRecalculation) {
            const startDate = data.startDate ? new Date(data.startDate) : existingLoan.startDate;
            const endDate = data.endDate ? new Date(data.endDate) : existingLoan.endDate;

            const months = Math.max(
                1,
                (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                (endDate.getMonth() - startDate.getMonth())
            );

            const loanAmount = new Decimal(data.loanAmount || existingLoan.loanAmount);
            const interestRate = new Decimal(data.interestRate || existingLoan.interestRate);
            const monthlyRate = interestRate.div(100).div(12);
            let newTotalWithInterest: string;

            if (monthlyRate.isZero()) {
                newTotalWithInterest = loanAmount.toString();
            } else {
                const factor = new Decimal(1).plus(monthlyRate).pow(months);
                const monthlyPayment = loanAmount.mul(monthlyRate).mul(factor).div(factor.minus(1));
                newTotalWithInterest = monthlyPayment.mul(months).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toString();
            }

            // To protect the actual amount paid, we calculate how much principal was paid so far
            const previousPrincipal = new Decimal(existingLoan.loanAmount);
            const currentPrincipal = new Decimal(existingLoan.remainingBalance);
            const principalPaidSoFar = previousPrincipal.minus(currentPrincipal);

            // Apply new remaining balance based on the new principal minus the principal paid so far
            const newRemainingBalance = new Decimal(data.loanAmount || existingLoan.loanAmount).minus(principalPaidSoFar);

            updateData.totalWithInterest = newTotalWithInterest;
            updateData.remainingBalance = newRemainingBalance.toString();
        }

        const loan = await this.loanRepository.update(id, updateData);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }
        return loan;
    }

    async delete(id: string) {
        const loan = await this.loanRepository.delete(id);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }
        return loan;
    }
}
