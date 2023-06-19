import {
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";

@Entity()
export class ImageTask extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: number;
}