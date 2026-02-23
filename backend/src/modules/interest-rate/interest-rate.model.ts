import mongoose, { Schema, Document } from "mongoose";

export interface IInterestRate extends Document {
    rate: number;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const interestRateSchema = new Schema<IInterestRate>(
    {
        rate: { type: Number, required: true, enum: [5, 10, 15, 20] },
        description: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const InterestRate = mongoose.model<IInterestRate>("InterestRate", interestRateSchema);
