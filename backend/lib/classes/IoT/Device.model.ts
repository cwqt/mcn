import { Node } from "../../classes/Node.model";
import {
  NodeType,
  IApiKey,
  SupportedHardware,
  IDeviceStub,
  IDevice,
  DeviceStateType,
  HardwareInformation,
} from "@cxss/interfaces";

import * as IpAddress from "ip-address";

export class Device extends Node {
  name: string;
  short_desc?: string;
  thumbnail?: string;
  last_ping?: number; //seconds since epoch device sent message
  state: DeviceStateType;
  hardware_model: SupportedHardware;
  network_name: string;
  images: string[];
  software_version?: string;
  measurement_count?: number;
  full_desc?: string;
  device_ip?: IpAddress.Address4 | IpAddress.Address6;
  api_key?: IApiKey;
  // assigned_to?: IFlorableStub;

  constructor(name: string, hardware_model: SupportedHardware) {
    super(NodeType.Device);
    this.name = name;
    this.hardware_model = hardware_model;
    this.network_name = HardwareInformation[hardware_model]?.network_name;
    this.state = DeviceStateType.UnVerified;
    this.measurement_count = 0;
  }

  toStub(): IDeviceStub {
    return {
      ...super.toStub(),
      name: this.name,
      short_desc: this.short_desc,
      thumbnail: this.thumbnail,
      last_ping: this.last_ping,
      state: this.state,
      hardware_model: this.hardware_model,
      network_name: this.network_name,
    };
  }

  toDevice(): IDevice {
    return {
      ...this.toStub(),
      images: this.images,
      software_version: this.software_version,
      measurement_count: this.measurement_count,
      full_desc: this.full_desc,
      device_ip: this.device_ip,
      api_key: this.api_key,
    };
  }
}
