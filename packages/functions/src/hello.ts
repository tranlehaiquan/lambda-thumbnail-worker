// function lambda return hello
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async () => {
  return {
    statusCode: 200,
    body: "Hello from SST!",
  };
})