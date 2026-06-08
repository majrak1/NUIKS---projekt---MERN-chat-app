import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import logger from "./logger.js";

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "user-14";

async function ensureBucket() {
    try {
        await s3Client.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 1 }));
        logger.info(`S3 bucket "${BUCKET}" is accessible`);
    } catch (err) {
        logger.warn(`S3 bucket "${BUCKET}" not accessible`, {
            error: err.message,
            statusCode: err.$metadata?.httpStatusCode,
        });
    }
}

export { s3Client, BUCKET, ensureBucket };
