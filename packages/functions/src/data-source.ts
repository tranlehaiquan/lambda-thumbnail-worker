import "reflect-metadata";
import { DataSource } from "typeorm";
import { ImageTask } from "./entity/ImageTask";

let connected = false;

export const connectToDB = async (url: string) => {
  if(connected) {
    return;
  }
  
  const AppDataSource = new DataSource({
    type: "postgres",
    url,
    synchronize: true,
    logging: false,
    entities: [ImageTask],
    migrations: [],
    subscribers: [],
    ssl: true,
  });

  await AppDataSource.initialize();
  connected = true;
};