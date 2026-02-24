import { injectable } from "tsyringe";
import { Repayment, IRepayment } from "./repayment.model";

@injectable()
export class RepaymentRepository {
    async create(data: Partial<IRepayment>): Promise<IRepayment> {
        return Repayment.create(data);
    }

    async findByLoanId(loanId: string): Promise<IRepayment[]> {
        return Repayment.find({ loanId }).sort({ paymentDate: -1 });
    }

    async findById(id: string): Promise<IRepayment | null> {
        return Repayment.findById(id).populate("loanId");
    }

    async findAll(): Promise<IRepayment[]> {
        return Repayment.find().populate("loanId").sort({ createdAt: -1 });
    }
}
