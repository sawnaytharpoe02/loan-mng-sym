import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
    loanId: mongoose.Types.ObjectId;
    documentPath: string;
    originalName: string;
    signingDate: Date;
    contractNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const contractSchema = new Schema<IContract>(
    {
        loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
        documentPath: { type: String, required: true },
        originalName: { type: String, required: true },
        signingDate: { type: Date, required: true },
        contractNumber: { type: String, required: true },
    },
    { timestamps: true }
);

contractSchema.index({ loanId: 1 });

export const Contract = mongoose.model<IContract>("Contract", contractSchema);
