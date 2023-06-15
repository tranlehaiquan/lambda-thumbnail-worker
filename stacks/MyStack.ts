import { StackContext, Api, EventBus, StaticSite, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": "packages/functions/src/todo.handler",
      "GET /list": "packages/functions/src/todo.list",
      "POST /": "packages/functions/src/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  const sourceBucket = new Bucket(stack, "sourceBucket");
  const thumbnailBucket = new Bucket(stack, "thumbnailBucket");

  stack.addOutputs({
    ApiEndpoint: api.url,
    WebUrl: web.url,
    SourceBucketName: sourceBucket.bucketName,
    ThumbnailBucketName: thumbnailBucket.bucketName,
  });
}
