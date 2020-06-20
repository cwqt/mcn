import { Measurement } from "../common/types/measurements.types";
import * as IpAddress from "ip-address";
import { IPostableMeta } from "./Post.model";

export enum RecordableType {
  Garden = "garden",
  Plant = "plant",
  Device = "device", //devices can have data recorded onto them, iot metrics etc
}

export interface IRecordableStub {
  _id: string;
  name: string;
  thumbnail?: string;
  created_at?: Date;
  type: RecordableType.Garden | RecordableType.Plant;
  meta?: IPostableMeta;
  short_desc?: string;
}

export interface IRecordable extends IRecordableStub {
  images: string[];
  recording?: string[];
  feed_url?: IpAddress.Address4 | IpAddress.Address6;
  parameters?: Map<Measurement, [number, number, number]>; //lower, avg, upper bounds
  full_desc?: string;
}

export interface IPaginator {
  first: string;
  last: string;
  next: string;
  prev: string;
  total_results: number;
}
