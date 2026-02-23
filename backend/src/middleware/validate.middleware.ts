import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/api-error";

export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            if (error instanceof ZodError || error?.name === 'ZodError') {
                const formattedErrors = error.errors.map((err: any) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                next(ApiError.validation("Validation failed", formattedErrors));
            } else {
                next(error);
            }
        }
    };
};
