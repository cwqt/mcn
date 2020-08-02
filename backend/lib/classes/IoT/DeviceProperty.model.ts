import {
  Measurement,
  Unit,
  IoTState,
  IoTMeasurement,
  NodeType,
  IDeviceProperty,
  Type,
  HardwareDevice,
} from "@cxss/interfaces";
import { Node } from "../Node.model";

type TDeviceProperty = NodeType.Metric | NodeType.Sensor | NodeType.State;

export class DeviceProperty<T extends TDeviceProperty> extends Node {
  type: T;
  ref: string;
  value: string | number | boolean;
  name: string;
  description: string;
  measures: Measurement | IoTMeasurement | IoTState;
  data_format: Type | Unit;

  constructor(
    type: T,
    ref: string,
    props: {
      [index: string]: { type: Measurement | IoTMeasurement | IoTState; unit: Type | Unit };
    }
  ) {
    super(type ?? NodeType.DeviceProperty);

    this.ref = ref;
    this.data_format = props[ref].unit;
    this.measures = props[ref].type;
    this.name = `${this.measures} ${this.type}`;
  }

  toStub(): IDeviceProperty<T> {
    return {
      ...super.toStub(),
      type: this.type,
      ref: this.ref,
      value: this.value,
      name: this.name,
      description: this.description,
      measures: this.measures,
      data_format: this.data_format,
    };
  }
}
