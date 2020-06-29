import {
  Measurement as RecordableMeasurement,
  IoTMeasurement,
  IoTState,
} from "../../common/types/measurements.types";
import { Document, Schema, Model, model, Types } from "mongoose";

export enum RecorderType {
  User = "user",
  Device = "device",
}

//sent from device
export interface IoTDataPacket {
  sensors: { [index: string]: number | string | boolean };
  states: { [index: string]: number | string | boolean };
  metrics: { [index: string]: number | string | boolean };
}
// e.g.
// {
//     "sensors": {
//         "light_sensor1": 123,
//         "light_sensor2": 456,
//         "ecv": 12.4
//     },
//     "states": {
//         "pump_01": false
//     },
//     "metrics": {
//         "cpu_freq": 801,
//         "lipo_v": 3.67
//     }
// }

// --> influx

export interface IMeasurement {
  recorder_id?: string; // which device/user made this measurement
  recorder_type?: RecorderType.User | RecorderType.Device;
  created_at: number;
  data?: IoTDataPacket;
}

export interface IMeasurementModel extends IMeasurement, Document {
  _id: string;
}
