import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "./auth.repository";
import { RegisterDTO, LoginDTO } from "@loan-mng/shared";
import { ApiError } from "../../utils/api-error";
import { env } from "../../config/env";

@injectable()
export class AuthService {
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) { }

    async register(data: RegisterDTO) {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw ApiError.conflict("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    async login(data: LoginDTO) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const token = this.generateToken(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    async getProfile(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }
        return user;
    }

    private generateToken(id: string, email: string, role: string): string {
        return jwt.sign({ id, email, role }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any
        });
    }
}
