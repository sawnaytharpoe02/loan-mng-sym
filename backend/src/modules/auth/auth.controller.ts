import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/api-response";

export class AuthController {
    private authService = container.resolve<AuthService>("AuthService");

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.register(req.body);
            ApiResponse.created(res, "User registered successfully", result);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.body);
            ApiResponse.ok(res, "Login successful", result);
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const profile = await this.authService.getProfile(user.id);
            ApiResponse.ok(res, "Profile retrieved", profile);
        } catch (error) {
            next(error);
        }
    };
}
