import { injectable } from "tsyringe";
import { User, IUser } from "./auth.model";

@injectable()
export class UserRepository {
    async create(data: Partial<IUser>): Promise<IUser> {
        return User.create(data);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id).select("-password");
    }

    async findAll(): Promise<IUser[]> {
        return User.find().select("-password");
    }
}
