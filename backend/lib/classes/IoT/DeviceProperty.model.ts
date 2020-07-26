import {
  Measurement,
  Unit,
  IoTState,
  IoTMeasurement,
  NodeType,
  IDeviceProperty,
  IDeviceSensor,
  IDeviceState,
  Type,
} from "@cxss/interfaces";
import { Node } from "../Node.model";

type TDeviceProperty = NodeType.DeviceProperty | NodeType.Metric | NodeType.Sensor | NodeType.State;

export class DeviceProperty extends Node {
  ref: string;
  value: string | number | boolean;
  name: string;
  description: string;

  constructor(
    name: string,
    ref: string,
    type?: NodeType.Metric | NodeType.Sensor | NodeType.State
  ) {
    super(type ?? NodeType.DeviceProperty);
    this.name = name;
    this.ref = ref;
  }

  toStub(): IDeviceProperty {
    return {
      ...super.toStub(),
      ref: this.ref,
      value: this.value,
      name: this.name,
      description: this.description,
    };
  }
}
