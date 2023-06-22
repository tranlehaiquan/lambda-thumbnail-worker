import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";

export enum Status {
  "initial" = "initial",
  "inProcess" = "inProcess",
  "successful" = "successful",
  "failed" = "failed",
}

@Entity()
export class ImageTask extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // s3 key import
  @Column({ type: "varchar", length: 255 })
  key: string;

  // s3 key thumbnail
  @Column({ type: "varchar", length: 255, nullable: true })
  thumbnail: string;

  // status
  @Column({
    type: "varchar",
    enum: Status,
    length: 255,
    default: Status.initial,
  })
  status: Status;
}
