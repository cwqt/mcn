import { Measurement as AcceptedMeasurement } from "../common/types/measurements.types";
import { Document, Schema, Model, model, Types} from "mongoose";

// example data packet in db
// when sent device_id removed,
// {
//     _id: 5ead6fa9de75a68ea1acc4a1,
//     created_at: 1588424694404,
//     recordable_id: 5ead701d5dfd5ef70e085h4s 
//     recorder_id: 5ead701d5dfd5ef70e085ef3,
//     recorder_type: 'device' | 'user',
//     measurements: {
//         temperature: 13,
//         moisture: 87,
//         light: 4202,
//         camera_state: false,
//         pump_state: true,
//     }
// }


export enum RecorderTypes {
    User = 'user',
    Device = 'device'
}

export interface IMeasurement {
    recordable_id:  string, //which recordable this measurement is for
    recorder_id:    string, // which device/user made this measurement
    recorder_type:  RecorderTypes.User | RecorderTypes.Device, //what recordertype made the measurement
    measurements:   Array<{[index in AcceptedMeasurement]:number | string | boolean}>,
    created_at?:    Date,
}

export interface IMeasurementModel extends IMeasurement, Document {
    _id:            string,
}

export var MeasurementSchema:Schema = new Schema({
    _id: {
        type:String,
        default: Types.ObjectId().toHexString()
    },
    recordable_id: String,
    recorder_id: String,
    recordable_type: String,
    created_at: {
        type: Number,
        default: Date.now()
    },
    measurements: Object,
})

export const Measurement:Model<IMeasurementModel> = model<IMeasurementModel>("Measurement", MeasurementSchema);
