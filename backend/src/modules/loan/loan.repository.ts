import { injectable } from "tsyringe";
import { Loan, ILoan } from "./loan.model";
import { Borrower } from "../borrower/borrower.model";
import Decimal from "decimal.js";

@injectable()
export class LoanRepository {
    async create(data: Partial<ILoan>): Promise<ILoan> {
        return Loan.create(data);
    }

    async findAll(skip: number = 0, limit: number = 10, search?: string): Promise<{ data: ILoan[], total: number }> {
        let query: any = {};

        if (search) {
            const borrowers = await Borrower.find({
                fullName: { $regex: search, $options: "i" }
            }).select("_id");
            const borrowerIds = borrowers.map(b => b._id);
            query.borrowerId = { $in: borrowerIds };
        }

        const [data, total] = await Promise.all([
            Loan.find(query).populate("borrowerId", "fullName email phone").sort({ createdAt: -1 }).skip(skip).limit(limit),
            Loan.countDocuments(query)
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<ILoan | null> {
        return Loan.findById(id).populate("borrowerId", "fullName email phone identificationNumber address");
    }

    async findByBorrowerId(borrowerId: string, skip: number = 0, limit: number = 10): Promise<{ data: ILoan[], total: number }> {
        const [data, total] = await Promise.all([
            Loan.find({ borrowerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Loan.countDocuments({ borrowerId })
        ]);
        return { data, total };
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
