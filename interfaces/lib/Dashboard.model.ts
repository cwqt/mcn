import { IRecordable, IRecordableStub } from "./Hydroponics/Recordable.model";
import { IMeasurement } from "./IoT/Measurement.model";
import { IoTState, IoTMeasurement, Measurement, Unit } from "./Types/Measurements.types";
import { INode } from "./Node.model";
import { Type } from "./IoT/Hardware.model";
import { COLOR } from "./material-colors";

export interface IDashboard extends INode {
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

export enum ChartType {
  "line-graph",
  "heat-map",
  "state",
}

export interface IDashboardItem extends INode {
  title: string;
  position: { top: number; left: number; height: number; width: number };
  chart_type: ChartType;
  aggregation_request: IAggregateRequest;
}

export interface IAggregateRequest {
  period: string | number | [Date, Date]; // 12 hrs ago, last 100 points, or between range
  interval?: number; // every n point
  aggregation_points: {
    [recordable: string]: IAggregatePoint[];
  };
}

export interface IAggregatePoint {
  measurements: Array<{
    color: COLOR;
    measurement: Measurement | IoTState | IoTMeasurement;
    data_format: Unit | Type;
    join?: boolean;
  }>;
  creators?: string[];
  properties?: string[];
}

export interface IAggregateData {
  sources: { [recordable: string]: IRecordable }; //reflected in HAS_SOURCE relationship
  data: {
    [recordable: string]: {
      [field in Measurement | IoTState | IoTMeasurement]?: IAggregatePointResult;
    };
  };
}

export interface IAggregatePointResult {
  color: COLOR;
  data_format: Type | Unit;
  sources: { [source: string]: Omit<IMeasurement, "unit"> };
}

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

// let req: IAggregateRequest = {
//   period: "24 hours",
//   aggregation_points: {
//     ["farm-5f2f04ad17d5122cccb1d294"]: [
//       {
//         // IAggregatePoint
//         measurements: [
//           {
//             color: COLOR.red,
//             measurement: Measurement.AirTemperature,
//             unit: Unit.Celcius,
//             join: false,
//           },
//           {
//             color: COLOR.green,
//             measurement: Measurement.Humidity,
//             unit: Unit.RelativeHumidity,
//             join: true,
//           },
//         ],
//         creators: ["device-5f4ac5a4e9ea0314a64b862f", "sensor-5f4ac5a4e9ea0314a64b862f"],
//       },
//       {
//         measurements: [
//           {
//             color: COLOR.indigo,
//             measurement: Measurement.WaterLevel,
//             unit: Unit.Percentage,
//             join: false,
//           },
//         ],
//         properties: ["sensor-5f4ac5a4e9ea0314a64b862f"],
//       },
//     ],
//     ["device-5f4ac5a4e9ea0314a64b862f"]: [
//       {
//         measurements: [
//           {
//             color: COLOR.purple,
//             measurement: IoTState.LightState,
//             unit: Type.Boolean,
//             join: false,
//           },
//         ],
//         creators: ["device-5f4ac5a4e9ea0314a64b862f"],
//       },
//     ],
//   },
// };

// // transforms to
// let res: IAggregateData = {
//   sources: {
//     // ["farm-5f2f04ad17d5122cccb1d294"]: RecordableStub
//     // ["device-5f4ac5a4e9ea0314a64b862f"]: RecordableStub
//     // ["sensor-5f4ac5a4e9ea0314a64b862f"]: PropertyStub
//   },
//   data: {
//     ["farm-5f2f04ad17d5122cccb1d294"]: {
//       [Measurement.AirTemperature]: {
//         colour: "red",
//         unit: Unit.Celcius,
//         sources: {
//           ["device-5f4ac5a4e9ea0314a64b862f"]: {
//             times: [159873578550, 1598735785540, 1598735785560],
//             values: [23.1, 23.4, 22.0],
//           },
//           ["sensor-5f4ac5a4e9ea0314a64b862f"]: {
//             times: [159873578550, 1598735785540, 1598735785560],
//             values: [23.1, 23.4, 22.0],
//           },
//         },
//       },
//       [Measurement.Humidity]: {
//         colour: "green",
//         unit: Unit.RelativeHumidity,
//         sources: {
//           ["sensor-5f4ac5a4e9ea0314a64b862f"]: {
//             times: [159873578550, 1598735785540, 1598735785560],
//             values: [50, 54, 58],
//           },
//         },
//       },
//     },
//     ["device-5f4ac5a4e9ea0314a64b862f"]: {
//       [IoTState.LightState]: {
//         colour: "fuschia",
//         unit: Type.Boolean,
//         sources: {
//           ["device-5f4ac5a4e9ea0314a64b862f"]: {
//             times: [159873578550, 1598735785540, 1598735785560],
//             values: [true, true, false],
//           },
//         },
//       },
//     },
//   },
// };
