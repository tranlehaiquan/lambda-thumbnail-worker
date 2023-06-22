import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiHandler } from "sst/node/api";
import { Bucket } from "sst/node/bucket";
import { connectToDB } from "./data-source";
import { Config } from "sst/node/config";
import { ImageTask, Status } from "./entity/ImageTask";

const s3 = new S3Client({});

// get method with query params key
export const handler = ApiHandler(async (event) => {
  await connectToDB(Config.POSTGRES_URL);
  // key
  const id = event.queryStringParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Id is required" }),
    };
  }

  const task = await ImageTask.findOneBy({ id });

  if (!task) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "No Task found" }),
    };
  }

  // if task not done yet
  if (task?.status !== Status.successful) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: task?.status,
        thumbnail: null,
      }),
    };
  }

  const bucketName = Bucket.sourceBucket.bucketName;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: task.thumbnail,
  });

  // get presigned url
  const thumbnail = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ thumbnail, status: task.status }),
  };
});
