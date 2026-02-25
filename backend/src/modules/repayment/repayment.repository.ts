import { injectable } from "tsyringe";
import { Repayment, IRepayment } from "./repayment.model";

@injectable()
export class RepaymentRepository {
    async create(data: Partial<IRepayment>): Promise<IRepayment> {
        return Repayment.create(data);
    }

    async findByLoanId(loanId: string, skip: number = 0, limit: number = 10): Promise<{ data: IRepayment[], total: number }> {
        const [data, total] = await Promise.all([
            Repayment.find({ loanId })
                .populate({ path: "loanId", populate: { path: "borrowerId" } })
                .sort({ paymentDate: -1 })
                .skip(skip)
                .limit(limit),
            Repayment.countDocuments({ loanId })
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<IRepayment | null> {
        return Repayment.findById(id).populate({ path: "loanId", populate: { path: "borrowerId" } });
    }

    async findAll(skip: number = 0, limit: number = 10): Promise<{ data: IRepayment[], total: number }> {
        const [data, total] = await Promise.all([
            Repayment.find()
                .populate({ path: "loanId", populate: { path: "borrowerId" } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Repayment.countDocuments()
        ]);
        return { data, total };
    }
}
