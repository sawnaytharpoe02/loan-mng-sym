import "reflect-metadata";
import express from "express";
import cors from "cors";
import "./config/container";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import borrowerRoutes from "./modules/borrower/borrower.routes";
import loanRoutes from "./modules/loan/loan.routes";
import repaymentRoutes from "./modules/repayment/repayment.routes";
import interestRateRoutes from "./modules/interest-rate/interest-rate.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import contractRoutes from "./modules/contract/contract.routes";

// Middleware
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rate-limiter";
import { logger } from "./utils/logger";
import { ApiResponse } from "./utils/api-response";

// Calculator
import { calculateLoan } from "./utils/loan-calculator";
import { loanCalculatorSchema } from "@loan-mng/shared";
import { validate } from "./middleware/validate.middleware";

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Rate limiting
app.use(rateLimiter);

// Request logging
app.use((req, _res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/repayments", repaymentRoutes);
app.use("/api/interest-rates", interestRateRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/contracts", contractRoutes);

// Loan calculator route
app.post("/api/calculator", validate(loanCalculatorSchema), (req, res) => {
    const { principal, annualRate, termMonths } = req.body;
    const result = calculateLoan(principal, annualRate, termMonths);
    ApiResponse.ok(res, "Calculation complete", result);
});

// Health check
app.get("/api/health", (_req, res) => {
    ApiResponse.ok(res, "Server is running");
});

// Global Error handler
app.use(errorMiddleware);

export default app;
