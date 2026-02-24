import { injectable } from "tsyringe";
import { Transaction, ITransaction } from "./transaction.model";

@injectable()
export class TransactionRepository {
    async create(data: Partial<ITransaction>): Promise<ITransaction> {
        return Transaction.create(data);
    }

    async findByLoanId(loanId: string): Promise<ITransaction[]> {
        return Transaction.find({ loanId }).sort({ transactionDate: -1 });
    }

    async findAll(): Promise<ITransaction[]> {
        return Transaction.find().populate("loanId").sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<ITransaction | null> {
        return Transaction.findById(id).populate("loanId");
    }
}
