import { injectable } from "tsyringe";
import { Contract, IContract } from "./contract.model";

@injectable()
export class ContractRepository {
    async create(data: Partial<IContract>): Promise<IContract> {
        return Contract.create(data);
    }

    async findByLoanId(loanId: string, skip: number = 0, limit: number = 10): Promise<{ data: IContract[], total: number }> {
        const [data, total] = await Promise.all([
            Contract.find({ loanId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Contract.countDocuments({ loanId })
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<IContract | null> {
        return Contract.findById(id).populate("loanId");
    }

    async findAll(skip: number = 0, limit: number = 10): Promise<{ data: IContract[], total: number }> {
        const [data, total] = await Promise.all([
            Contract.find().populate({ path: 'loanId', populate: { path: 'borrowerId', model: 'Borrower' } }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Contract.countDocuments()
        ]);
        return { data, total };
    }

    async delete(id: string): Promise<IContract | null> {
        return Contract.findByIdAndDelete(id);
    }
}
