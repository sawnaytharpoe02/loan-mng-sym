import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: "Admin" | "LoanOfficer" | "Office";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Admin", "LoanOfficer", "Office"], default: "Office" },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
