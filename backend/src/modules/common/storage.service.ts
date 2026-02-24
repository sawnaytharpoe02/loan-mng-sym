import { injectable } from "tsyringe";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../config/s3-client";
import { env } from "../../config/env";

@injectable()
export class FileStorageService {
    private client: S3Client = s3Client;

    /**
     * Delete a file from S3
     * @param key The S3 object key
     */
    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: env.AWS.BUCKET_NAME,
            Key: key,
        });

        await this.client.send(command);
    }

    /**
     * Generate a pre-signed URL for downloading a file
     * @param key The S3 object key
     * @param originalName The original filename for the download
     * @param expiresIn Expiration time in seconds (default 1 hour)
     */
    async getSignedDownloadUrl(
        key: string,
        originalName: string,
        expiresIn: number = 3600
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: env.AWS.BUCKET_NAME,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${originalName}"`,
        });

        return getSignedUrl(this.client, command, { expiresIn });
    }
}
