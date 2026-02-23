import { rateLimit } from "express-rate-limit";
import { STATUS_CODES } from "../constants/status-codes";
import { ApiError } from "../utils/api-error";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
        status: 429
    },
    handler: (_req, _res, next, options) => {
        next(new ApiError(STATUS_CODES.TOO_MANY_REQUESTS, (options.message as any).message));
    }
});

export const authRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    handler: (_req, _res, next) => {
        next(ApiError.tooManyRequests("Too many login attempts, please try again after an hour"));
    }
});

export const signinRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts, please try again later.",
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const signupRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many registration attempts, please try again later.",
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});
