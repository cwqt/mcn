import { Unit } from "../Types/Measurements.types";
import { Type } from "./Hardware.model";

export type IMeasurementResult = { [measurement: string]: IMeasurement };
export interface IMeasurement {
  times: Date[];
  values: Array<number | string | boolean>;
  unit: Unit | Type;
}
