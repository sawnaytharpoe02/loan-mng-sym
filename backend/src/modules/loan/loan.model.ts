import mongoose, { Schema, Document } from "mongoose";

export interface ILoan extends Document {
    borrowerId: mongoose.Types.ObjectId;
    loanAmount: string;
    loanType: "Personal" | "Mortgage" | "Business" | "Education";
    startDate: Date;
    endDate: Date;
    interestRate: string;
    status: "Active" | "Closed" | "Defaulted";
    remainingBalance: string;
    totalWithInterest: string;
    createdAt: Date;
    updatedAt: Date;
}

const loanSchema = new Schema<ILoan>(
    {
        borrowerId: { type: Schema.Types.ObjectId, ref: "Borrower", required: true },
        loanAmount: { type: String, required: true },
        loanType: {
            type: String,
            enum: ["Personal", "Mortgage", "Business", "Education"],
            required: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        interestRate: { type: String, required: true },
        status: {
            type: String,
            enum: ["Active", "Closed", "Defaulted"],
            default: "Active",
        },
        remainingBalance: { type: String, required: true },
        totalWithInterest: { type: String, required: true },
    },
    { timestamps: true }
);

loanSchema.index({ borrowerId: 1 });
loanSchema.index({ status: 1 });

export const Loan = mongoose.model<ILoan>("Loan", loanSchema);
