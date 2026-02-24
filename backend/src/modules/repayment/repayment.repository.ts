import { injectable } from "tsyringe";
import { Repayment, IRepayment } from "./repayment.model";

@injectable()
export class RepaymentRepository {
    async create(data: Partial<IRepayment>): Promise<IRepayment> {
        return Repayment.create(data);
    }

    async findByLoanId(loanId: string, skip: number = 0, limit: number = 10): Promise<{ data: IRepayment[], total: number }> {
        const [data, total] = await Promise.all([
            Repayment.find({ loanId }).sort({ paymentDate: -1 }).skip(skip).limit(limit),
            Repayment.countDocuments({ loanId })
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<IRepayment | null> {
        return Repayment.findById(id).populate("loanId");
    }

    async findAll(skip: number = 0, limit: number = 10): Promise<{ data: IRepayment[], total: number }> {
        const [data, total] = await Promise.all([
            Repayment.find().populate("loanId").sort({ createdAt: -1 }).skip(skip).limit(limit),
            Repayment.countDocuments()
        ]);
        return { data, total };
    }
}
