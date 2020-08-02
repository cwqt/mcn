import { Type } from "./Hardware.model";
import { Measurement, Unit, IoTState, IoTMeasurement } from "../Types/Measurements.types";
import { INode } from "../Node.model";
import { NodeType } from "../Types/Nodes.types";

export interface IDeviceProperty<T extends NodeType.State | NodeType.Sensor | NodeType.Metric>
  extends INode {
  type: T;
  ref: string;
  value: string | number | boolean;
  name: string;
  description: string;
  measures: Measurement | IoTMeasurement | IoTState;
  data_format: Unit | Type;
}
