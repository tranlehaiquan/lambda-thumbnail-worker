import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";

export enum Status {
  "initial", "inProcess", "successful", "failed"
}

@Entity()
export class ImageTask extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // s3 key import
  @Column({ type: "varchar", length: 255 })
  key: string;

  // status 
  @Column({
    type: "varchar",
    enum: Status,
    length: 255,
    default: Status.initial,
  })
  status: Status;
}
