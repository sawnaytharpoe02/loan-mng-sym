import mongoose, { Schema, Document } from "mongoose";

export interface IRepayment extends Document {
    loanId: mongoose.Types.ObjectId;
    paymentDate: Date;
    amountPaid: string;
    remainingBalance: string;
    paymentTerm: number;
    createdAt: Date;
    updatedAt: Date;
}

const repaymentSchema = new Schema<IRepayment>(
    {
        loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        paymentDate: { type: Date, required: true, default: Date.now },
        amountPaid: { type: String, required: true },
        remainingBalance: { type: String, required: true },
        paymentTerm: { type: Number, default: 0 },
    },
    { timestamps: true }
);

repaymentSchema.index({ loanId: 1 });

export const Repayment = mongoose.model<IRepayment>("Repayment", repaymentSchema);
