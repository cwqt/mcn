import { IRecordable, IRecordableStub } from "./Hydroponics/Recordable.model";
import { IMeasurement } from "./IoT/Measurement.model";
import { IoTState, IoTMeasurement } from "./Types/Measurements.types";
import { INode } from "./Node.model";

export interface IDashboard extends INode {
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

// fetch dashboard
//   for each dashboard item
//     get the aggregated data from source_fields over period

export interface IDashboardItem extends INode {
  title: string;
  position: { top: number; left: number; height: number; width: number };
  chart_type: "line-graph" | "heat-map" | "state" | "pie-chart";
  period: string | number; //e.g. '12 hrs' or last n results
  source_fields: {
    [recordable: string]: [IMeasurement | IoTState | IoTMeasurement];
  };
}

/** overlapping data from multiple sources
 * source_fields
 *  farm-a73jdba8: [humidity, temperature]
 *  rack-w9s4dee9: [light]
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

//general data aggregations
export interface IAggregateData {
  sources?: { [recordable: string]: IRecordable }; //reflected in HAS_SOURCE relationship
  data?: {
    [recordable: string]: { [field in IMeasurement & IoTState & IoTMeasurement]: IMeasurement };
  };
}
