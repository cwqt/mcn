import { Measurement } from "../Types/Measurements.types";
import * as IpAddress from "ip-address";
import { INode } from "../Node.model";
import { NodeType, RecordableType } from "../Types/Nodes.types";

export interface IRecordableStub extends INode {
  name: string;
  thumbnail?: string;
  tagline?: string;
}

export interface IRecordable extends IRecordableStub {
  images: string[];
  recording?: string[];
  feed_url?: IpAddress.Address4 | IpAddress.Address6;
  parameters?: Map<Measurement, [number, number, number]>; //lower, avg, upper bounds
  description?: string;
}
