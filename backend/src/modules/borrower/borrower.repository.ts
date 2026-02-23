import { injectable } from "tsyringe";
import { Borrower, IBorrower } from "./borrower.model";

@injectable()
export class BorrowerRepository {
    async create(data: Partial<IBorrower>): Promise<IBorrower> {
        return Borrower.create(data);
    }

    async findAll(): Promise<IBorrower[]> {
        return Borrower.find().sort({ createdAt: -1 });
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
