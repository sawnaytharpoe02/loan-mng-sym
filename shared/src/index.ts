import { z } from "zod";
import Decimal from "decimal.js";

const DecimalStringSchema = z.string().refine((val) => {
    try {
        new Decimal(val);
        return true;
    } catch {
        return false;
    }
}, "Invalid decimal format");

const PositiveDecimalSchema = z.string().refine((val) => {
    try {
        const d = new Decimal(val);
        return d.isPositive() && !d.isZero();
    } catch {
        return false;
    }
}, "Must be a positive decimal");

const NonNegativeDecimalSchema = z.string().refine((val) => {
    try {
        return new Decimal(val).isPositive(); // isPositive returns true for 0 in decimal.js, or actually we can check d.gte(0)
    } catch {
        return false;
    }
}, "Must be a non-negative decimal");

// Auth Schemas 
export const UserRole = z.enum(["Admin", "LoanOfficer", "Office"]);
export type UserRole = z.infer<typeof UserRole>;

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: UserRole.default("Office"),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
export type LoginDTO = z.infer<typeof loginSchema>;

// Borrower Schemas
export const createBorrowerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z.string().min(5, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    nrc: z.string().min(3, "NRC / ID number is required"),
});
export type CreateBorrowerDTO = z.infer<typeof createBorrowerSchema>;

export const updateBorrowerSchema = createBorrowerSchema.partial();
export type UpdateBorrowerDTO = z.infer<typeof updateBorrowerSchema>;

// Loan Schemas
export const LoanType = z.enum(["Personal", "Mortgage", "Business", "Education"]);
export type LoanType = z.infer<typeof LoanType>;

export const LoanStatus = z.enum(["Active", "Closed", "Defaulted"]);
export type LoanStatus = z.infer<typeof LoanStatus>;

export const createLoanSchema = z.object({
    borrowerId: z.string().min(1, "Borrower is required"),
    loanAmount: PositiveDecimalSchema,
    loanType: LoanType,
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    interestRate: NonNegativeDecimalSchema,
});
export type CreateLoanDTO = z.infer<typeof createLoanSchema>;

export const updateLoanSchema = createLoanSchema.partial();
export type UpdateLoanDTO = z.infer<typeof updateLoanSchema>;

// Repayment Schemas
export const createRepaymentSchema = z.object({
    loanId: z.string().min(1, "Loan is required"),
    amountPaid: PositiveDecimalSchema,
    paymentDate: z.string().optional(),
    paymentTerm: z.number().int().positive().optional(),
});
export type CreateRepaymentDTO = z.infer<typeof createRepaymentSchema>;

// Transaction Schemas
export const TransactionType = z.enum(["Repayment", "LateFee", "Penalty"]);
export type TransactionType = z.infer<typeof TransactionType>;

export const createTransactionSchema = z.object({
    loanId: z.string().min(1, "Loan is required"),
    transactionType: TransactionType,
    amount: PositiveDecimalSchema,
    description: z.string().optional(),
    transactionDate: z.string().optional(),
});
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;

// Contract Schemas
export const createContractSchema = z.object({
    loanId: z.string().min(1, "Loan is required"),
    signingDate: z.string().min(1, "Signing date is required"),
});
export type CreateContractDTO = z.infer<typeof createContractSchema>;

// Interest Rate Schemas
export const createInterestRateSchema = z.object({
    rate: z.string().refine(
        (val) => ["5", "10", "15", "20"].includes(val.toString()),
        { message: "Rate must be 5, 10, 15, or 20" }
    ),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});
export type CreateInterestRateDTO = z.infer<typeof createInterestRateSchema>;

// Loan Calculator Schema
export const loanCalculatorSchema = z.object({
    principal: PositiveDecimalSchema,
    annualRate: NonNegativeDecimalSchema,
    termMonths: z.number().int().positive("Term must be positive"),
});
export type LoanCalculatorDTO = z.infer<typeof loanCalculatorSchema>;
