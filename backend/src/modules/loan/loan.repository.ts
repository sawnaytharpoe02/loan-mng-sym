import { injectable } from "tsyringe";
import { Loan, ILoan } from "./loan.model";
import Decimal from "decimal.js";

@injectable()
export class LoanRepository {
    async create(data: Partial<ILoan>): Promise<ILoan> {
        return Loan.create(data);
    }

    async findAll(): Promise<ILoan[]> {
        return Loan.find().populate("borrowerId", "fullName email phone").sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<ILoan | null> {
        return Loan.findById(id).populate("borrowerId", "fullName email phone identificationNumber address");
    }

    async findByBorrowerId(borrowerId: string): Promise<ILoan[]> {
        return Loan.find({ borrowerId }).sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<ILoan>): Promise<ILoan | null> {
        return Loan.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("borrowerId");
    }

    async delete(id: string): Promise<ILoan | null> {
        return Loan.findByIdAndDelete(id);
    }

    async updateBalance(id: string, remainingBalance: string): Promise<ILoan | null> {
        const update: Partial<ILoan> = { remainingBalance } as Partial<ILoan>;
        if (new Decimal(remainingBalance).lte(0)) {
            (update as any).status = "Closed";
            update.remainingBalance = "0";
        }
        return Loan.findByIdAndUpdate(id, update, { new: true });
    }
}
