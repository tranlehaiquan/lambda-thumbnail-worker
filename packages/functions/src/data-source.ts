import "reflect-metadata";
import { DataSource } from "typeorm";
import { ImageTask } from "./entity/ImageTask";

let connected = false;

export const connect = async () => {
  if(connected) {
    return;
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  
  const AppDataSource = new DataSource({
    type: "postgres",
    ...dbConfig,
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