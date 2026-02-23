import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { registerSchema, loginSchema } from "@loan-mng/shared";
import { signinRateLimiter, signupRateLimiter } from "../../middleware/rate-limiter";

const router = Router();
const controller = new AuthController();

router.post("/register", signupRateLimiter, validate(registerSchema), controller.register);
router.post("/login", signinRateLimiter, validate(loginSchema), controller.login);
router.get("/profile", authenticate, controller.getProfile);

export default router;
