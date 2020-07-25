import { Measurement } from "../Types/Measurements.types";
import * as IpAddress from "ip-address";
import { INode } from "../Node.model";

export enum RecordableType {
  Farm = "farm",
  Rack = "rack",
  Crop = "crop",
  Device = "device", //devices can have data recorded onto them, iot metrics etc
}

export interface IRecordableStub extends INode {
  name: string;
  thumbnail?: string;
  short_desc?: string;
}

export interface IRecordable extends IRecordableStub {
  images: string[];
  recording?: string[];
  feed_url?: IpAddress.Address4 | IpAddress.Address6;
  parameters?: Map<Measurement, [number, number, number]>; //lower, avg, upper bounds
  full_desc?: string;
}
