export type IMeasurementResult = { [measurement: string]: IMeasurement };
export interface IMeasurement {
  times: Date[];
  values: any[];
}
