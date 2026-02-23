import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { STATUS_CODES } from "../constants/status-codes";
import { logger } from "../utils/logger";

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ApiError) {
        logger.error(`[${err.statusCode}] ${err.message}`);
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            ...(err.errors ? { errors: err.errors } : {}),
        });
    }

    logger.error(`[500] ${err.message}`, { stack: err.stack });
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
};
