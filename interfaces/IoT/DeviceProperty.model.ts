import { Type } from "./Hardware.model";
import {
  Measurement,
  Unit,
  IoTState,
  IoTMeasurement,
} from "../../backend/lib/common/types/measurements.types";
import { INode } from "../Node.model";

interface IDeviceProperty extends INode {
  ref: string;
  value: string | number | boolean;
  name: string;
  description: string;
}

export interface IDeviceSensor extends IDeviceProperty {
  measures: Measurement | IoTMeasurement;
  unit: Unit;
}

export interface IDeviceState extends IDeviceProperty {
  state: IoTState;
  dType: Type;
}
