import { injectable } from "tsyringe";
import { Transaction, ITransaction } from "./transaction.model";

@injectable()
export class TransactionRepository {
    async create(data: Partial<ITransaction>): Promise<ITransaction> {
        return Transaction.create(data);
    }

    async findByLoanId(loanId: string, skip: number = 0, limit: number = 10): Promise<{ data: ITransaction[], total: number }> {
        const [data, total] = await Promise.all([
            Transaction.find({ loanId }).sort({ transactionDate: -1 }).skip(skip).limit(limit),
            Transaction.countDocuments({ loanId })
        ]);
        return { data, total };
    }

    async findAll(skip: number = 0, limit: number = 10): Promise<{ data: ITransaction[], total: number }> {
        const [data, total] = await Promise.all([
            Transaction.find().populate("loanId").sort({ createdAt: -1 }).skip(skip).limit(limit),
            Transaction.countDocuments()
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<ITransaction | null> {
        return Transaction.findById(id).populate("loanId");
    }
}
