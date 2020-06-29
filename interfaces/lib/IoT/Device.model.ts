import { SupportedHardware, Type } from "./Hardware.model";
import { Measurement, Unit, IoTState, IoTMeasurement } from "../Types/Measurements.types";
import { HardwareInformation } from "../Types/Hardware.types";
import { IApiKey } from "./ApiKey.model";
import { INode } from "../Node.model";

import * as IpAddress from "ip-address";

export enum DeviceStateType {
  Active = "active",
  InActive = "inactive",
  Verified = "verified",
  UnVerified = "unverified",
}

export interface IDeviceStub extends INode {
  name: string;
  short_desc?: string;
  thumbnail?: string;
  last_ping?: number; //seconds since epoch device sent message
  state: DeviceStateType;
  hardware_model: SupportedHardware;
  network_name: string;
}

export interface IDevice extends IDeviceStub {
  images: string[];
  software_version?: string;
  measurement_count?: number;
  full_desc?: string;
  device_ip?: IpAddress.Address4 | IpAddress.Address6;
  api_key?: IApiKey;
  // assigned_to?: IFlorableStub;
}
