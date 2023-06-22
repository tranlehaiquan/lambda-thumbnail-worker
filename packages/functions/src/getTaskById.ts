import { ApiHandler } from "sst/node/api";
import { connectToDB } from "./data-source";
import { Config } from "sst/node/config";
import { ImageTask } from "./entity/ImageTask";

// get method with query params key
export const handler = ApiHandler(async (event) => {
  // key
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Key is required" }),
    };
  }

  await connectToDB(Config.POSTGRES_URL);
  const task = await ImageTask.findOneBy({ id: id });

  if (!task) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Task not found" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task }),
  };
});
