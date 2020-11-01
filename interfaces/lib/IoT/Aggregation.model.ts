import { NodeType } from "../Types/Nodes.types";
import { Measurement, IoTState, IoTMeasurement, Unit } from "../Types/Measurements.types";
import { IMeasurement } from "./Measurement.model";
import { IRecordable } from "../Hydroponics/Recordable.model";
import { COLOR } from "../material-colors";
import { Type } from "./Hardware.model";
import { ChartType } from "../Dashboard.model";

// decouple ui from requesting data
/** overlapping data from multiple sources, multi-chart, multi-axis
 *
 *  |         +-----------------------
 *  |         |    etc.
 *  |    _-'''+_             /
 *  | .,'     | ',         _'
 *  |/        |   \,------'
 *  |---------+
 *  +-------------------------------------
 *    light (lux), humidity (RH%)
 *  |
 *  |     ____....,,,___
 *  |..'''              `'''...,,,,-----'
 *  +-------------------------------------
 *   temp (C) */

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
  period: { start: Date, end: Date };
  requests: IAggregateRequest[];
  ui?: IAggregateUiData;
}

export interface IAggregateResponseGroup {
  sources: { [recordable: string]: IRecordable }; //reflected in HAS_SOURCE relationship
  responses: IAggregateResponse[];
}
export interface IAggregatePoint {
  recordable: string;
  data_format: Unit | Type;
  measurement: Measurement | IoTState | IoTMeasurement;
  function?: "mean" | "max" | "min" | "first" | "last"; // single point (ChartType.Value)
  interval?: number; // get every nth point
}

export interface IAggregateRequest extends IAggregatePoint {
  sources?: string[]; // Sources.includes(source) == true
}

export interface IAggregateResponse extends IAggregatePoint {
  sources: { [source: string]: Omit<IMeasurement, "unit"> };
}

// Chart data ui ------------------------------------
export interface IAggregateChart {
  title?:string;
  chart_type: ChartType;
  chart_data: {
    [ChartType.Gauge]?: { lower_bound:number, upper_bound:number }
  }
}

export interface IAggregateAxis {
  title?: string;
  label_format?: Unit | Type;
  invert?:boolean; //flip y-axis
}

export interface IAggregatePointUi {
  axis: number;
  chart: number;
  color: COLOR;
}

export interface IAggregateUiData {
  charts: IAggregateChart[];
  axes: IAggregateAxis[];
  requests:IAggregatePointUi[]; // maps to request 
}
