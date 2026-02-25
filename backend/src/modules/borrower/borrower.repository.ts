import { injectable } from "tsyringe";
import { Borrower, IBorrower } from "./borrower.model";

@injectable()
export class BorrowerRepository {
    async create(data: Partial<IBorrower>): Promise<IBorrower> {
        return Borrower.create(data);
    }

    async findAll(skip: number = 0, limit: number = 10, search?: string): Promise<{ data: IBorrower[], total: number }> {
        const query = search ? { fullName: { $regex: search, $options: "i" } } : {};
        const [data, total] = await Promise.all([
            Borrower.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Borrower.countDocuments(query)
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<IBorrower | null> {
        return Borrower.findById(id);
    }

    async update(id: string, data: Partial<IBorrower>): Promise<IBorrower | null> {
        return Borrower.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id: string): Promise<IBorrower | null> {
        return Borrower.findByIdAndDelete(id);
    }

    async findByNrc(nrc: string): Promise<IBorrower | null> {
        return Borrower.findOne({ nrc });
    }
}
