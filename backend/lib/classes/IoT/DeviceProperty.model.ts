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

//sensor / metric
export class DeviceSensor extends DeviceProperty {
  measures: Measurement | IoTMeasurement;
  unit: Unit;

  constructor(measures: Measurement | IoTMeasurement, unit: Unit, name: string, ref: string) {
    super(name, ref);
    this.measures = measures;
    this.unit = unit;
  }

  toStub(): IDeviceSensor {
    return {
      ...super.toStub(),
      measures: this.measures,
      unit: this.unit,
    };
  }
}

//state
export class DeviceState extends DeviceProperty {
  state: IoTState;
  dType: Type;

  constructor(state: IoTState, dType: Type, name: string, ref: string) {
    super(name, ref);
    this.state = state;
    this.dType = dType;
  }

  toStub(): IDeviceState {
    return {
      ...super.toStub(),
      state: this.state,
      dType: this.dType,
    };
  }
}
