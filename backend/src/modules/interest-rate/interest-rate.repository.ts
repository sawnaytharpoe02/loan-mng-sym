import { injectable } from "tsyringe";
import { InterestRate, IInterestRate } from "./interest-rate.model";

@injectable()
export class InterestRateRepository {
    async create(data: Partial<IInterestRate>): Promise<IInterestRate> {
        return InterestRate.create(data);
    }

    async findAll(): Promise<IInterestRate[]> {
        return InterestRate.find().sort({ rate: 1 });
    }

    async findActive(): Promise<IInterestRate[]> {
        return InterestRate.find({ isActive: true }).sort({ rate: 1 });
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
