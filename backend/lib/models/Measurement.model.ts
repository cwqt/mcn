import { Measurement as RecordableMeasurement, IoTMeasurement } from "../common/types/measurements.types";
import { Document, Schema, Model, model, Types} from "mongoose";

export enum RecorderType {
    User = 'user',
    Device = 'device'
}

//sent from device
export interface IoTDataPacket {
    recordable_data: Array<{[index in RecordableMeasurement]:number | string | boolean}>,
    device_data:     Array<{[index in IoTMeasurement]:number | string | boolean}>,
}

export interface IMeasurement {
    recorder_id?:     string, // which device/user made this measurement
    recorder_type?:   RecorderType.User | RecorderType.Device,
    created_at:       number,
    data?:            Array<{[index in (RecordableMeasurement | IoTMeasurement)]:number | string | boolean}>,
}

export interface IMeasurementModel extends IMeasurement, Document {
    _id:            string,
}

const RecordableMeasurementSchema:Schema = new Schema({
    [RecordableMeasurement.Temperature]:  Number,
    [RecordableMeasurement.Moisture]:     Number,
    [RecordableMeasurement.Humidity]:     Number,
    [RecordableMeasurement.Light]:        Number,
    [RecordableMeasurement.WaterLevel]:   Number,
    [RecordableMeasurement.LightState]:   Boolean,
    [RecordableMeasurement.CameraState]:  Boolean,
    [RecordableMeasurement.PumpState]:    Boolean,
    [RecordableMeasurement.HeaterState]:  Boolean,
    [RecordableMeasurement.Height]:       Number,
    [RecordableMeasurement.pH]:           Number,
}, { _id: false})

const DeviceMeasurementSchema:Schema = new Schema({
    [IoTMeasurement.Voltage]:        Number,
    [IoTMeasurement.Current]:        Number,
    [IoTMeasurement.Power]:          Number,
    [IoTMeasurement.SignalStrength]: Number
}, { _id: false })

export const MeasurementSchema:Schema = new Schema({
    _id: {
        type:String,
        default: () => Types.ObjectId().toHexString(),
        index: true,
        required: true,
        auto: true,
    },
    recordable_id: String,
    recorder_id: String,
    recorder_type: {
        type: String,
        enum: [RecorderType.User, RecorderType.Device]
    },
    created_at: {
        type: Number,
        default: Date.now()
    },
    data: Object//RecordableMeasurementSchema || DeviceMeasurementSchema,
}, { versionKey: false, discriminatorKey: "data"})
