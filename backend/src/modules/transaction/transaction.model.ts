import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    loanId: mongoose.Types.ObjectId;
    transactionDate: Date;
    transactionType: "Repayment" | "LateFee" | "Penalty";
    amount: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        transactionDate: { type: Date, required: true, default: Date.now },
        transactionType: {
            type: String,
            enum: ["Repayment", "LateFee", "Penalty"],
            required: true,
        },
        amount: { type: String, required: true },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

transactionSchema.index({ loanId: 1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
