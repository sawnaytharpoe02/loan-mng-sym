import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || "8080", 10),
    MONGO_URI: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.typegqq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || "default_secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    NODE_ENV: process.env.NODE_ENV || "development",
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
        REGION: process.env.AWS_REGION || "ap-southeast-1",
        BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",
    }
};
