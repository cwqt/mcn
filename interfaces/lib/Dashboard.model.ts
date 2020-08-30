import { IRecordable, IRecordableStub } from "./Hydroponics/Recordable.model";
import { IMeasurement } from "./IoT/Measurement.model";
import { IoTState, IoTMeasurement, Measurement, Unit } from "./Types/Measurements.types";
import { INode } from "./Node.model";
import { Type } from "./IoT/Hardware.model";

export interface IDashboard extends INode {
  rows: number;
  columns: number;
  items: IDashboardItem[];
}

export interface IDashboardItem extends INode {
  title: string;
  position: { top: number; left: number; height: number; width: number };
  chart_type: "line-graph" | "heat-map" | "state" | "pie-chart";
  aggregation_request: IAggregateRequest;
}

export interface IAggregatePoint {
  measurements: (Measurement | IoTState | IoTMeasurement)[];
  creators?: string[];
  properties?: string[];
}

export interface IAggregateRequest {
  period: string | number | [Date, Date]; // 12 hrs ago, last 100 points, or between range
  interval?: number; // every n point
  aggregation_points: {
    [recordable: string]: IAggregatePoint[];
  };
}

export interface IAggregateData {
  sources?: { [recordable: string]: IRecordable }; //reflected in HAS_SOURCE relationship
  data?: {
    [recordable: string]: {
      [field in IMeasurement & IoTState & IoTMeasurement]: {
        unit: Type | Unit;
        sources: { [source: string]: Omit<IMeasurement, "unit"> };
      };
    };
  };
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

let req: IAggregateRequest = {
  period: "24 hours",
  aggregation_points: {
    ["farm-5f2f04ad17d5122cccb1d294"]: [
      {
        // IAggregatePoint
        measurements: [Measurement.AirTemperature, Measurement.Humidity],
        creators: ["device-5f4ac5a4e9ea0314a64b862f", "sensor-5f4ac5a4e9ea0314a64b862f"],
      },
      {
        measurements: [Measurement.WaterLevel],
        properties: ["sensor-5f4ac5a4e9ea0314a64b862f"],
      },
    ],
    ["device-5f4ac5a4e9ea0314a64b862f"]: [
      {
        measurements: [IoTState.LightState],
        creators: ["device-5f4ac5a4e9ea0314a64b862f"],
      },
    ],
  },
};

// transforms to
let res: IAggregateData = {
  sources: {
    // ["farm-5f2f04ad17d5122cccb1d294"]: RecordableStub
    // ["device-5f4ac5a4e9ea0314a64b862f"]: RecordableStub
    // ["sensor-5f4ac5a4e9ea0314a64b862f"]: PropertyStub
  },
  data: {
    ["farm-5f2f04ad17d5122cccb1d294"]: {
      [Measurement.AirTemperature]: {
        unit: Unit.Celcius,
        sources: {
          ["device-5f4ac5a4e9ea0314a64b862f"]: {
            times: [159873578550, 1598735785540, 1598735785560],
            values: [23.1, 23.4, 22.0],
          },
          ["sensor-5f4ac5a4e9ea0314a64b862f"]: {
            times: [159873578550, 1598735785540, 1598735785560],
            values: [23.1, 23.4, 22.0],
          },
        },
      },
      [Measurement.Humidity]: {
        unit: Unit.RelativeHumidity,
        sources: {
          ["sensor-5f4ac5a4e9ea0314a64b862f"]: {
            times: [159873578550, 1598735785540, 1598735785560],
            values: [50, 54, 58],
          },
        },
      },
    },
    ["device-5f4ac5a4e9ea0314a64b862f"]: {
      [IoTState.LightState]: {
        unit: Type.Boolean,
        sources: {
          ["device-5f4ac5a4e9ea0314a64b862f"]: {
            times: [159873578550, 1598735785540, 1598735785560],
            values: [true, true, false],
          },
        },
      },
    },
  },
};
