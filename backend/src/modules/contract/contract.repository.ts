import { injectable } from "tsyringe";
import { Contract, IContract } from "./contract.model";

@injectable()
export class ContractRepository {
    async create(data: Partial<IContract>): Promise<IContract> {
        return Contract.create(data);
    }

    async findByLoanId(loanId: string): Promise<IContract[]> {
        return Contract.find({ loanId }).sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IContract | null> {
        return Contract.findById(id).populate("loanId");
    }

    async findAll(): Promise<IContract[]> {
        return Contract.find().populate("loanId").sort({ createdAt: -1 });
    }

    async delete(id: string): Promise<IContract | null> {
        return Contract.findByIdAndDelete(id);
    }
}
