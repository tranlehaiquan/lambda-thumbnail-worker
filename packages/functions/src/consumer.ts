import { Bucket } from "sst/node/bucket";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSEvent } from "aws-lambda";
import { Upload } from "@aws-sdk/lib-storage";
import stream from "stream";
import sharp from "sharp";
import { connectToDB } from "./data-source";
import { Config } from "sst/node/config";
import { ImageTask, Status } from "./entity/ImageTask";

type RecordsEvent = {
  eventVersion: string;
  eventSource: "aws:s3";
  awsRegion: "us-east-1";
  eventTime: "2023-06-16T07:55:36.960Z";
  eventName: "ObjectCreated:Put";
  userIdentity: { principalId: "AWS:AIDAQDQ45PWVECH7ZPEU2" };
  requestParameters: { sourceIPAddress: "14.238.91.178" };
  responseElements: {
    "x-amz-request-id": "FV0QGEGKG099RTWS";
    "x-amz-id-2": "b2Bfd6A0Lu/Jh07Sxz+HOJnFO86zrLckjwnNbvqhQDqlVR8gHqskxK0xU8y+qEeW26KF4YiSJL9XxQYH2W5AE03nVCQUt3FX";
  };
  s3: {
    s3SchemaVersion: "1.0";
    configurationId: "YjQ1YjY1ODUtODAyNi00ZDQ2LTk1N2YtMjhmZTYyYTkyZjQw";
    bucket: {
      name: "quantranlehai-lambda-thumbna-sourcebucketdc914398-15ejk6xr4pgbs";
      ownerIdentity: { principalId: "ACLGS5HO9JKQ1" };
      arn: "arn:aws:s3:::quantranlehai-lambda-thumbna-sourcebucketdc914398-15ejk6xr4pgbs";
    };
    object: {
      key: "imports/Sample-jpg-image-500kb.jpg";
      size: 512017;
      eTag: "7c858c1e9e6c971cc360141e92fc918e";
      sequencer: "00648C1578D78BCA50";
    };
  };
};

// Sharp resize stream
function streamToSharp(width: number) {
  return sharp().resize(width);
}

const client = new S3Client({});

export async function handler(event: SQSEvent) {
  const records = event.Records || [];
  const prefix = "thumbnail";
  const bucketName = Bucket.sourceBucket.bucketName;
  await connectToDB(Config.POSTGRES_URL);

  await Promise.all(
    records.map(async (record) => {
      const body = JSON.parse(record.body).Records as RecordsEvent[];

      await Promise.all(
        body.map(async (item) => {
          const key = item.s3.object.key;
          const objectName = key.split("/").at(-1);
          // example thumbnail/Sample-jpg-image-500kb.jpg
          const newKey = `${prefix}/${objectName}`;

          const commandPullObject = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
          });

          const response = await client.send(commandPullObject);
          const task = await ImageTask.findOneBy({
            key,
          });

          if (task !== null) {
            task.status = Status.inProcess;
          }

          const pass = new stream.PassThrough();
          const upload = new Upload({
            client,
            params: {
              Bucket: bucketName,
              Key: newKey,
              Body: pass,
              ContentType: response.ContentType,
            },
          });

          const resizeStream = streamToSharp(
            Number(process.env.THUMBNAIL_SIZE || 100)
          );
          // read from readableStream -> resize -> Write to pass
          (response.Body as NodeJS.ReadableStream)
            ?.pipe(resizeStream)
            .pipe(pass);

          try {
            await upload.done();

            if (task !== null) {
              task.status = Status.successful;
              await task.save();
            }
          } catch (err) {
            console.log(err);

            if (task !== null) {
              task.status = Status.failed;
              await task.save();
            }
          }
        })
      );
    })
  );

  return {};
}
