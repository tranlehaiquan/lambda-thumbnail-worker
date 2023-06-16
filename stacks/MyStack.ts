import { StackContext, Bucket, Queue } from "sst/constructs";

export function API({ stack }: StackContext) {
  const queue = new Queue(stack, "thumbnailQueue", {
    consumer: {
      function: {
        handler: "packages/functions/src/lambda.handler",
        environment: {},
        timeout: 60,
      }
    }
  });

  const sourceBucket = new Bucket(stack, "sourceBucket", {
    notifications: {
      insertImage: {
        type: "queue",
        queue,
        events: ['object_created'],
        filters: [{ prefix: "imports/" }, { suffix: ".jpg" }],
      },
    },
  });

  queue.attachPermissions([sourceBucket]);
  if(queue.consumerFunction) {

  }

  // const web = new StaticSite(stack, "web", {
  //   path: "packages/web",
  //   buildOutput: "dist",
  //   buildCommand: "npm run build",
  //   environment: {
  //     VITE_APP_API_URL: api.url,
  //   },
  // });

  stack.addOutputs({
    SourceBucketName: sourceBucket.bucketName,
    Queue: queue.id,
  });
}
