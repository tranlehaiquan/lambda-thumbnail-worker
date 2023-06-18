import { StackContext, Bucket, Queue, Api, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  const queue = new Queue(stack, "thumbnailQueue", {
    consumer: {
      function: {
        handler: "packages/functions/src/lambda.handler",
        environment: {
          THUMBNAIL_SIZE: "100",
        },
      },
    },
  });

  const api = new Api(stack, "Api", {
    routes: {
      "GET /": "packages/functions/src/preSignedUrl.handler",
    },
  });

  // StaticSite
  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  const sourceBucket = new Bucket(stack, "sourceBucket", {
    notifications: {
      insertImage: {
        type: "queue",
        queue,
        events: ["object_created"],
        filters: [{ prefix: "imports/" }, { suffix: ".jpg" }],
      },
    },
  });

  // queue.attachPermissions([sourceBucket]);
  queue.bind([sourceBucket]);

  stack.addOutputs({
    SourceBucketName: sourceBucket.bucketName,
    Queue: queue.queueName,
    SiteUrl: web.url,
  });
}
