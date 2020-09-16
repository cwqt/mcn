import { Measurement } from "../Types/Measurements.types";
import * as IpAddress from "ip-address";
import { INode, IGraphNode } from "../Node.model";
import { NodeType, RecordableType } from "../Types/Nodes.types";
import { IDeviceProperty } from "../IoT/DeviceProperty.model";

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
