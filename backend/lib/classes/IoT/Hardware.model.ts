import { Measurement, Unit, IoTMeasurement, IoTState } from "../../common/types/measurements.types";

export enum MicroController {
  ESP8266 = "ESP-8266",
  ESP32 = "ESP-32",
}

export enum DeviceCapability {
  Bluetooth = "Bluetooth",
  UPnP = "UPnP",
  WiFi = "WiFi",
}

export interface HardwareDevice {
  model_name: string;
  network_name: string;
  microcontroller: MicroController;
  capabilities: DeviceCapability[];
  mcnEnabled: boolean;
  plantsSupported: number;
  states: { [index: string]: { type: IoTState; unit: Type } };
  sensors: { [index: string]: { type: Measurement; unit: Unit } };
  metrics: { [index: string]: { type: IoTMeasurement; unit: Unit } };
  api?: { [index: string]: { [index in HttpMethod]?: IDeviceEndpoint } };
}

export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

export interface IDeviceEndpoint {
  description: string;
  icon?: string;
  body?: { [index: string]: { type: Type; required: boolean } };
  api?: { [index: string]: { [index in HttpMethod]?: IDeviceEndpoint } };
}

export enum SupportedHardware {
  MCNWemosD1Mini = "mcn_wemos_d1_mini",
}

export enum Type {
  Boolean = "boolean",
  Number = "number",
  String = "string",
}
