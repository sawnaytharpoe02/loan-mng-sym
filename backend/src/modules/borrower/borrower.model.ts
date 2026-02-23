import mongoose, { Schema, Document } from "mongoose";

export interface IBorrower extends Document {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    nrc: string;
    createdAt: Date;
    updatedAt: Date;
}

const borrowerSchema = new Schema<IBorrower>(
    {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        address: { type: String, required: true, trim: true },
        nrc: { type: String, required: true, unique: true, trim: true },
    },
    { timestamps: true }
);

export const Borrower = mongoose.model<IBorrower>("Borrower", borrowerSchema);
