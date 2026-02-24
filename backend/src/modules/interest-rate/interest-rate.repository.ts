import { injectable } from "tsyringe";
import { InterestRate, IInterestRate } from "./interest-rate.model";

@injectable()
export class InterestRateRepository {
    async create(data: Partial<IInterestRate>): Promise<IInterestRate> {
        return InterestRate.create(data);
    }

    async findAll(skip: number = 0, limit: number = 10): Promise<{ data: IInterestRate[], total: number }> {
        const [data, total] = await Promise.all([
            InterestRate.find().sort({ rate: 1 }).skip(skip).limit(limit),
            InterestRate.countDocuments()
        ]);
        return { data, total };
    }

    async findActive(skip: number = 0, limit: number = 10): Promise<{ data: IInterestRate[], total: number }> {
        const [data, total] = await Promise.all([
            InterestRate.find({ isActive: true }).sort({ rate: 1 }).skip(skip).limit(limit),
            InterestRate.countDocuments({ isActive: true })
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<IInterestRate | null> {
        return InterestRate.findById(id);
    }

    async update(id: string, data: Partial<IInterestRate>): Promise<IInterestRate | null> {
        return InterestRate.findByIdAndUpdate(id, data, { new: true });
    }

    async count(): Promise<number> {
        return InterestRate.countDocuments();
    }
}
