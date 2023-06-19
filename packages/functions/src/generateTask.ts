import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { Config } from "sst/node/config";
import { connectToDB } from "./data-source";
import { ImageTask } from "./entity/ImageTask";

const s3 = new S3Client({});
const uploadFolder = "imports";

export const handler = ApiHandler(async (event) => {
  await connectToDB(Config.POSTGRES_URL);

  const uuid = randomUUID();
  const key = `${uploadFolder}/${uuid}.jpg`;

  const newTask = new ImageTask();
  newTask.key = key;

  const bucketName = Bucket.sourceBucket.bucketName;
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key });

  try {
    const preSigned = await getSignedUrl(s3, command, { expiresIn: 3600 });
    await newTask.save();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preSigned, key }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
});
