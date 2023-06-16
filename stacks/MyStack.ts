import { StackContext, Bucket, Queue, Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const queue = new Queue(stack, "thumbnailQueue", {
    consumer: {
      function: {
        handler: "packages/functions/src/lambda.handler",
      },
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
  });
}
