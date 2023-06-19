import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { Config } from "sst/node/config";

const s3 = new S3Client({});
const uploadFolder = "imports";

export const handler = ApiHandler(async (event) => {
  const uuid = randomUUID();
  const key = `${uploadFolder}/${uuid}.jpg`;
  const bucketName = Bucket.sourceBucket.bucketName;
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
  const preSigned = getSignedUrl(s3, command, { expiresIn: 3600 });

  return {
    statusCode: 200,
    body: JSON.stringify({ preSigned, key }),
  }
});
