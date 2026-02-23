import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: env.AWS.ACCESS_KEY_ID,
        secretAccessKey: env.AWS.SECRET_ACCESS_KEY,
    },
    region: env.AWS.REGION,
});
