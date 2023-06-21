import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";

const s3 = new S3Client({});

// get method with query params key
export const handler = ApiHandler(async (event) => {
  // key
  const key = event.queryStringParameters?.key;

  if (!key) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Key is required" }),
    };
  }

  const bucketName = Bucket.sourceBucket.bucketName;
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });

  // get presigned url
  const preSigned = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ preSigned, key }),
  }
});
