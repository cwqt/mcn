import { NodeType } from "../Types/Nodes.types";
import { Measurement, IoTState, IoTMeasurement, Unit } from "../Types/Measurements.types";
import { IMeasurement } from "./Measurement.model";
import { IRecordable } from "../Hydroponics/Recordable.model";
import { COLOR } from "../material-colors";
import { Type } from "./Hardware.model";

/** overlapping data from multiple sources
 *
 *  |         +-----------------------
 *  |         |    etc.
 *  |    _-'''+_             /
 *  | .,'     | ',         _'
 *  |/        |   \,------'
 *  |---------+
 *  +-------------------------------------
 *    light (lux), humidity (RH%), temp (C)
 */

export const Properties = [
  NodeType.DeviceProperty,
  NodeType.Sensor,
  NodeType.State,
  NodeType.Metric,
];

export const Sources = [NodeType.User, NodeType.Device];
export const Recordables = [NodeType.Crop, NodeType.Rack, NodeType.Farm, NodeType.Recordable];

// send an IAggregateRequestGroup and recieve an IAggregateResponseGroup
export interface IAggregateRequestGroup {
  period: string | number | [Date, Date]; // 12 hrs ago, last 100 points, or between range
  interval?: number; // every n point
  aggregation_points: IAggregateRequest[];
}

export interface IAggregateResponseGroup {
  sources: { [recordable: string]: IRecordable }; //reflected in HAS_SOURCE relationship
  data: IAggregateResponse[];
}

export interface IAggregatePoint {
  _id: string;
  recordable: string;
  color?: COLOR;
  data_format: Unit | Type;
  measurement: Measurement | IoTState | IoTMeasurement;
}

export interface IAggregateRequest extends IAggregatePoint {
  sources?: string[]; // Sources.includes(source) == true
}

export interface IAggregateResponse extends IAggregatePoint {
  sources: { [source: string]: Omit<IMeasurement, "unit"> };
}
