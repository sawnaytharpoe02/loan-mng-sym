import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { ApiError } from "../utils/api-error";
import { STATUS_CODES } from "../constants/status-codes";
import { env } from "./env";
import { s3Client } from "./s3-client";

const storage = multerS3({
    s3: s3Client,
    bucket: env.AWS.BUCKET_NAME,
    acl: "private",
    metadata: (_req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `contracts/${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                STATUS_CODES.BAD_REQUEST,
                "Only PDF, DOC, DOCX, JPG, and PNG files are allowed"
            ) as any
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 60 * 1024 * 1024 }, // 60MB
});
